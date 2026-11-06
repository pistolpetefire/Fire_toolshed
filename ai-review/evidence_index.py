"""Build a local text/evidence index where the AI's uploaded PDFs live."""
import argparse,hashlib,json,re
from pathlib import Path
from pypdf import PdfReader

def index_documents(entries):
    docs=[];pages=[];seen=set()
    for entry in entries:
        ident=entry['id'];role=entry['role'];path=Path(entry['path'])
        if ident in seen or role not in ('design','criteria'):raise ValueError('Unique IDs and design/criteria roles required')
        seen.add(ident);reader=PdfReader(path)
        if reader.is_encrypted:raise ValueError('Encrypted input requires an authorized decrypted copy')
        digest=hashlib.sha256(path.read_bytes()).hexdigest()
        docs.append({'id':ident,'name':path.name,'pages':len(reader.pages),'role':role,'sha256':digest,'revision':entry.get('revision','Unspecified')})
        for n,p in enumerate(reader.pages,1):
            try:text=p.extract_text() or '';error=''
            except Exception as e:text='';error=str(e)
            pages.append({'documentId':ident,'page':n,'text':text,'status':'text extracted' if text.strip() else 'visual review or OCR needed','error':error})
    return {'documents':docs,'pages':pages,'limitation':'Text extraction is not visual drawing review; page numbers are PDF indices, not printed sheet labels.'}

def verify_quotes(index,claims):
    pages={(x['documentId'],x['page']):x for x in index['pages']}
    normalize=lambda s:re.sub(r'\s+',' ',s).strip().casefold()
    result=[]
    for c in claims:
        page=pages.get((c['documentId'],c['page']));quote=c.get('quote','')
        if not isinstance(quote,str) or not quote.strip():status='empty quote'
        elif not page:status='unknown page'
        elif not page['text'].strip():status='visual verification required'
        elif normalize(quote) in normalize(page['text']):status='text match'
        else:status='not found in extracted text'
        result.append({**c,'verification':status})
    return {'claims':result,'limitation':'Text match verifies presence only, not meaning, applicability, revision precedence or compliance.'}
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('command',choices=['index','verify']);p.add_argument('input');p.add_argument('claims',nargs='?');a=p.parse_args()
    try:
        data=json.loads(Path(a.input).read_text(encoding='utf-8-sig'))
        result=index_documents(data) if a.command=='index' else verify_quotes(data,json.loads(Path(a.claims).read_text(encoding='utf-8-sig')))
        print(json.dumps(result,ensure_ascii=False))
    except Exception as e:print(json.dumps({'error':str(e)}));raise SystemExit(1)
