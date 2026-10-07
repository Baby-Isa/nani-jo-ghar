import json, re, os, sys, base64, subprocess, urllib.request, concurrent.futures as cf
root='/home/user/nani-jo-ghar'
src=open(f'{root}/build/tools/audio/review.html').read()
data=json.loads(re.search(r'const DATA = (\[.*?\]);\n', src, re.S).group(1))
K=os.environ['OPENAI_API_KEY']
def path(rel): return os.path.normpath(os.path.join(root,'assets',rel.split('assets/',1)[1]))
def whisper(p):
    r=subprocess.run(['curl','-s','https://api.openai.com/v1/audio/transcriptions','-H',f'Authorization: Bearer {K}','-F','model=whisper-1','-F',f'file=@{p}','-F','response_format=text'],capture_output=True,text=True)
    return r.stdout.strip()
def judge(p, target, speaker, english):
    wav=subprocess.run(['ffmpeg','-loglevel','error','-i',p,'-ac','1','-ar','16000','-f','wav','-'],capture_output=True).stdout
    who='an older woman (Mum)' if speaker=='mum' else 'a man (Zafar)'
    q=(f"This is a short clip cut from a family recording of Kutchi words. The target is the Kutchi '{target}' (meaning '{english}'), "
       f"which should be said by {who}. Listen carefully. Answer in JSON only: "
       '{"heard": "<what you hear, romanised>", "only_target": true|false, "extra": "<any other words, English, numbers, prompts, laughter, other voices>", "speaker_ok": true|false, "clear": 1-5, "cut_ok": true|false}. '
       "only_target is true only if the clip contains the target said once (or an obvious same-word variant) and nothing else. cut_ok is false if the word is chopped at the start or end.")
    body={"model":"gpt-audio-1.5","modalities":["text"],"messages":[{"role":"user","content":[{"type":"text","text":q},{"type":"input_audio","input_audio":{"data":base64.b64encode(wav).decode(),"format":"wav"}}]}]}
    req=urllib.request.Request('https://api.openai.com/v1/chat/completions',data=json.dumps(body).encode(),headers={'Authorization':f'Bearer {K}','Content-Type':'application/json'})
    try:
        t=json.loads(urllib.request.urlopen(req,timeout=90).read())['choices'][0]['message']['content']
        return json.loads(re.search(r'\{.*\}',t,re.S).group(0))
    except Exception as e: return {"error":str(e)[:120]}
def check(L, c):
    p=path(c['f']); return (L['k'], c['r'], whisper(p), judge(p, L['t'], L['s'], L.get('e','')))
n=int(sys.argv[1]) if len(sys.argv)>1 else 20
jobs=[(L,c) for L in data[:n] for c in L['c']]
with cf.ThreadPoolExecutor(6) as ex:
    res=list(ex.map(lambda a: check(*a), jobs))
json.dump(res,open(f'{os.path.dirname(__file__)}/listen-{n}.json','w'),ensure_ascii=False,indent=1)
for k,r,w,j in res:
    ok = j.get('only_target') and j.get('speaker_ok') and j.get('cut_ok') and (j.get('clear',0)>=3)
    print(f"{'PASS' if ok else 'fail'} {k:28s} r{r} whisper='{w[:30]}' heard='{j.get('heard','')}' extra='{j.get('extra','')}' {j.get('error','')}")
