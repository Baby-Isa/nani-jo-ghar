#!/usr/bin/env python3
"""Sekelo skewer fit check (SEK-20, Zafar 9 Nov): today's skewer art on mock A1-sekelo-1. Usage: python3 build/tools/art/sekelo_fit_check.py <outdir>"""
# Sekelo skewer fit check: today's skewer art laid on mock A1-sekelo-1 (the first try) at a given scale.
import sys
from PIL import Image, ImageDraw, ImageFont
D='assets/cook/items/v3/sekelo/'
mock=Image.open('sources/art/s19-mocks2/results/A1-sekelo-1.png').convert('RGBA')
W,H=mock.size  # 1672x941
k=W/1400  # crop coords -> original
def skewer(L, state, pw=None):
    stick=Image.open(D+'stick.webp').convert('RGBA'); sw,sh=stick.size
    s=L/sh; stick=stick.resize((max(1,int(sw*s)),int(L)))
    pw=pw or int(L*0.2); can=Image.new('RGBA',(pw+8,int(L)),(0,0,0,0))
    can.alpha_composite(stick,((can.width-stick.width)//2,0))
    names=['meat','tomato','onion','meat']
    top=int(L*0.06); bot=int(L*0.74); step=(bot-top)/4
    for i,n in enumerate(names):
        p=Image.open(D+f'{n}-{state}.webp').convert('RGBA').resize((pw,int(pw*396/404)))
        can.alpha_composite(p,((can.width-pw)//2,int(top+i*step+step/2-p.height/2)))
    return can
def shadow(base,img,x,y):
    sh=Image.new('RGBA',img.size,(0,0,0,0)); a=img.split()[3].point(lambda v:int(v*0.35))
    sh.putalpha(a); base.alpha_composite(sh,(x+6,y+6)); base.alpha_composite(img,(x,y))
def run(L,out,label):
    im=mock.copy(); d=ImageDraw.Draw(im)
    # trays (crop coords measured by eye) -> original
    trays=[(60,68,445,375),(60,403,445,712)]
    trays=[tuple(int(v*k) for v in t) for t in trays]
    bed=tuple(int(v*k) for v in (575,130,1245,615))
    for t,state in zip(trays,['raw','grilled']):
        sk=skewer(L,state).rotate(90,expand=True)  # lying across the tray, handle right
        x0,y0,x1,y1=t; pad=int(0.06*(x1-x0)); n=4
        gap=((y1-y0)-2*pad-n*sk.height)/(n-1) if n>1 else 0
        for i in range(n): shadow(im,sk,x0+((x1-x0)-sk.width)//2, int(y0+pad+i*(sk.height+gap)))
        d.rectangle(t,outline=(255,0,255,255),width=3)
    sk=skewer(L,'raw'); x0,y0,x1,y1=bed; n=4; span=(x1-x0)
    for i in range(n): shadow(im,sk,int(x0+span*(i+0.5)/n-sk.width/2), int((y0+y1)/2-L*0.42))
    f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',26)
    d.rectangle((0,H-44,W,H),fill=(0,0,0,170)); d.text((14,H-38),label,fill='white',font=f)
    im.convert('RGB').save(out,quality=88)
L_mock=int(665*k)  # the mock's own skewer length
run(L_mock,sys.argv[1]+'/fit-a-mock-scale.jpg',f'A: the mock\'s skewer size ({L_mock}px of {H}): four do not fit a tray')
L_fit=int(0.88*int(385*k))  # longest that lies across a tray
run(L_fit,sys.argv[1]+'/fit-b-tray-scale.jpg',f'B: skewers sized to lie across a tray ({L_fit}px, {L_fit/L_mock:.0%} of the mock\'s): four per tray, pieces {int(L_fit*0.2)}px ({int(L_fit*0.2)/int(130*k):.0%} of the mock\'s)')

# C: left, middle, right: a tall raw tray, the grill, a tall cooked tray; skewers upright everywhere (no turning)
def runC(out):
    im=mock.copy(); d=ImageDraw.Draw(im)
    marble=mock.crop((int(1290*k),int(20*k),int(1390*k),int(120*k))).resize((W,H))
    im.alpha_composite(marble.convert('RGBA'))
    grill=mock.crop((int(470*k),int(75*k),int(1360*k),int(670*k)))  # grill with its handles, no skewer handle below
    gw=int(W*0.50); gh=int(grill.height*gw/grill.width); gx=(W-gw)//2; gy=int(H*0.08)
    g=grill.resize((gw,gh)); im.alpha_composite(g,(gx,gy))
    # paint the mock's own skewer out of the grill: cover with a coal patch from the grill's left
    tray=mock.crop((int(60*k),int(68*k),int(445*k),int(375*k)))
    tw=int(W*0.205); th=int(H*0.84); ty=int(H*0.08)
    def tall(x):
        t=tray.resize((tw,th)); im.alpha_composite(t,(x,ty)); d.rectangle((x,ty,x+tw,ty+th),outline=(255,0,255,255),width=3)
    tall(int(W*0.03)); tall(W-int(W*0.03)-tw)
    L=int(th*0.9); PW=int((tw-20)/4*0.84)
    for (x0,state) in [(int(W*0.03),'raw'),(W-int(W*0.03)-tw,'grilled')]:
        sk=skewer(L,state,PW); n=4; span=tw-20
        for i in range(n): shadow(im,sk,int(x0+10+span*(i+0.5)/n-sk.width/2), ty+int(th*0.05))
    sk=skewer(L,'raw',PW)
    for i in range(4): shadow(im,sk,int(gx+gw*0.14+gw*0.72*(i+0.5)/4-sk.width/2), gy+int(gh*0.5-L*0.42))
    f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',26)
    d.rectangle((0,H-44,W,H),fill=(0,0,0,170)); d.text((14,H-38),f'C: raw tray left, grill middle, cooked tray right; skewers upright, pieces {PW}px ({PW/int(130*k):.0%} of the mock\'s)',fill='white',font=f)
    im.convert('RGB').save(out,quality=88)
runC(sys.argv[1]+'/fit-c-left-middle-right.jpg')
