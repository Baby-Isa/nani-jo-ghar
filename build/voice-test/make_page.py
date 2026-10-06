#!/usr/bin/env python3
"""Builds build/voice-test/<round>/index.html: the listening page for one round."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
rnd = sys.argv[1] if len(sys.argv) > 1 else "r1"
od = os.path.join(HERE, rnd)
spec = json.load(open(os.path.join(od, "items.json")))
KINDS = [("mum", "Mum, as recorded"), ("mum-clean", "Mum, cleaned up"),
         ("openai-gu", "Robot A · Gujarati letters"), ("openai-lat", "Robot A · sounds-like"),
         ("gemini-gu", "Robot B · Gujarati letters"), ("gemini-lat", "Robot B · sounds-like")]
items = []
for it in spec["items"]:
    clips = [{"k": k, "label": l, "file": f"{it['id']}-{k}.mp3"} for k, l in KINDS if os.path.exists(os.path.join(od, f"{it['id']}-{k}.mp3"))]
    items.append({**it, "clips": clips})
tpl = open(os.path.join(HERE, "page.html")).read()
open(os.path.join(od, "index.html"), "w").write(tpl.replace("__ROUND__", rnd).replace("__DATA__", json.dumps(items, ensure_ascii=False)))
print(sum(len(i["clips"]) for i in items), "clips")
