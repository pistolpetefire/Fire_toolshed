"""Read PDF viewport scale metadata locally; no network calls or PDF modifications."""
import argparse, hashlib, json, math
from pathlib import Path
from pypdf import PdfReader

def obj(v):
    return v.get_object() if hasattr(v,'get_object') else v

def formats(v):
    return [{'unit':str(obj(x).get('/U','')), 'factor':float(obj(x).get('/C',0))} for x in obj(v or [])]

def viewport(v, index):
    v=obj(v); m=obj(v.get('/Measure',{})); bounds=[float(x) for x in v.get('/BBox',[])]
    r={'id':f'VP-{index+1}','name':str(v.get('/Name','')),'bounds':bounds,'scaleLabel':str(m.get('/R','')),'subtype':str(m.get('/Subtype','/RL')),'status':'unsupported','reason':'No usable rectilinear scale','requiresDimensionVerification':True}
    try:
        x=formats(m.get('/X')); y=formats(m.get('/Y')) if '/Y' in m else x
        r.update(xFormats=x,yFormats=y,distanceFormats=formats(m.get('/D')))
        if r['subtype']!='/RL': raise ValueError('Non-rectilinear measurement is not supported')
        if len(bounds)!=4 or not all(math.isfinite(n) for n in bounds) or bounds[2]<=bounds[0] or bounds[3]<=bounds[1]: raise ValueError('Reversed or invalid viewport bounds require coordinate normalization')
        if not x or not y: raise ValueError('No numeric X/Y scale; printed scale labels alone are not parsed')
        sx,sy=x[0]['factor'],y[0]['factor']; unit=x[0]['unit']
        if unit not in ('ft','m','in','mm') or y[0]['unit']!=unit: raise ValueError('Unsupported or differing axis unit labels')
        if not all(math.isfinite(s) and s>0 for s in (sx,sy)): raise ValueError('Invalid numeric conversion factor')
        if float(m.get('/CYX',1))!=1 or not math.isclose(sx,sy,rel_tol=1e-9): raise ValueError('Anisotropic or cross-unit scale requires a dedicated transform')
        r.update(status='candidate',reason='Verify against a labeled dimension before measuring',unitsPerCoordinate=sx,unit=unit)
    except (ValueError,TypeError,KeyError,OverflowError) as e: r['reason']=str(e)
    return r

def extract(path):
    path=Path(path);reader=PdfReader(path)
    if reader.is_encrypted: raise ValueError('Encrypted PDF: provide an authorized decrypted copy in the AI environment')
    pages=[]
    for n,p in enumerate(reader.pages,1):
        views=[]
        for i,v in enumerate(obj(p.get('/VP',[]))):
            try: views.append(viewport(v,i))
            except Exception as e: views.append({'id':f'VP-{i+1}','status':'unsupported','reason':str(e)})
        pages.append({'page':n,'rotation':int(p.get('/Rotate',0)),'userUnit':float(p.get('/UserUnit',1)),'cropBox':[float(x) for x in p.cropbox],'viewports':views,'status':'metadata found' if views else 'no viewport metadata'})
    return {'tool':'pdf_scale_metadata','version':'1.0.0','document':path.name,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'pages':pages,'coordinateConvention':'Raw PDF default user space; do not mix with rendered pixels or rotated/cropped display coordinates. X/Y conversion factors already map default user space: do not multiply them again by UserUnit.','limitations':['Candidate scales are not verified measurements.','Overlapping viewports require last-containing-viewport selection per PDF order; split routes at viewport boundaries.','No proprietary vendor scales, annotation-only scales, geospatial transforms, route detection or OCR.']}

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('pdf');args=parser.parse_args()
    try: print(json.dumps({'ok':True,'result':extract(args.pdf)},allow_nan=False))
    except Exception as e: print(json.dumps({'ok':False,'error':str(e)}));raise SystemExit(1)
