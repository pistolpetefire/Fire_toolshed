"""Rebuild the downloadable execution kit without dependencies or timestamps."""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
root=Path(__file__).resolve().parent.parent
files=[]
for folder in ['ai-review','automation','proposal-review','review-modules','peer-review','directory']:
    for p in (root/folder).rglob('*'):
        if p.is_file() and p.suffix in ['.mjs','.py','.md','.json','.html','.css','.txt'] and '__pycache__' not in p.parts:
            files.append(p)
with ZipFile(root/'ai-review/pilot-kit.zip','w',compression=ZIP_DEFLATED) as z:
    for p in sorted(files):
        entry=ZipInfo(p.relative_to(root).as_posix(),(2026,1,1,0,0,0))
        entry.compress_type=ZIP_DEFLATED
        z.writestr(entry,p.read_bytes())
print(f'Execution kit: {len(files)} files')
