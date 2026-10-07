import json, re, os, subprocess, base64, sys
root='/home/user/nani-jo-ghar'; src=open(f'{root}/build/tools/audio/review.html').read()
m=re.search(r'const DATA = (\[.*?\]);\n', src, re.S); data=json.loads(m.group(1))
cache={}
def uri(rel):
    p=os.path.normpath(os.path.join(root,'build/tools/audio',rel.replace('../../../','../../')))
    if not os.path.exists(p): p=os.path.normpath(os.path.join(root, rel.split('assets/',1)[1] and 'assets/'+rel.split('assets/',1)[1]))
    if p in cache: return cache[p]
    out=subprocess.run(['ffmpeg','-loglevel','error','-i',p,'-ac','1','-ar','22050','-b:a','40k','-f','mp3','-'],capture_output=True).stdout
    cache[p]='data:audio/mpeg;base64,'+base64.b64encode(out).decode(); return cache[p]
for L in data:
    if L.get('o'): L['o']=uri(L['o'])
    for c in L['c']: c['f']=uri(c['f'])
# split into pages under ~11 MB
pages=[[]]; size=0
for L in data:
    n=len(json.dumps(L))
    if size+n>11_000_000: pages.append([]); size=0
    pages[-1].append(L); size+=n
od=f'{root}/build/tools/audio/pages'; os.makedirs(od,exist_ok=True)
for i,pg in enumerate(pages,1):
    html=src[:m.start(1)]+json.dumps(pg,ensure_ascii=False)+src[m.end(1):]
    html=html.replace('<title>Clip Picker</title>',f'<title>Clip Picker {i} of {len(pages)}</title>')
    open(f'{od}/picker-{i}.html','w').write(html)
    print(i, len(pg), 'lines', round(len(html)/1e6,1),'MB')
