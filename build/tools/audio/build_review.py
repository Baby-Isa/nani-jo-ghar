#!/usr/bin/env python3
"""Build build/tools/audio/review.html from data/family-audio-candidates.json (S02-D).

A static, self-contained page for Zafar's phone (S02-D2: only blind-verified takes, decision 69): every
line with at least one verified take, lines whose current clip fails the blind check first; the current
clip and the ranked takes, rank 1 marked as the suggestion, each with what the two blind transcribers
heard; lines with no verified take come last under 'Record again', not mixed in. One tap picks
(or 'keep current'); 'Copy my picks' gives the compact list for apply_picks.mjs. Picks are kept in
the browser between visits (localStorage, a convenience only).

Usage: python3 build/tools/audio/build_review.py
"""
import html, json, os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
UP = "../../../"


def main():
    data = json.load(open(os.path.join(ROOT, "data", "family-audio-candidates.json")))
    rows = sorted(data["lines"], key=lambda r: (bool(r["current"]["blind_ok"]), r["key"]))
    items = []
    for r in rows:
        cur = r["current"]["blind"]
        items.append({
            "k": r["key"], "t": r["kutchi"], "e": r.get("english") or "", "q": r.get("qid") or "",
            "s": r["speaker"], "ck": r.get("checked") or "", "o": UP + r["file"],
            "ok": bool(r["current"]["blind_ok"]),
            "h": " / ".join(v["text"] for v in cur.values()),
            "c": [{"r": c["rank"], "f": UP + c["file"], "sc": c["score"],
                   "src": os.path.basename(c["source"]) + f" {c['start']:.1f}s",
                   "h": " / ".join(v["text"] for v in c["blind"].values()),
                   "same": c.get("same_as_current", False)} for c in r["candidates"]]})
    with_c = [d for d in items if d["c"]]
    missing = [d for d in items if not d["c"]]
    page = TEMPLATE.replace("__DATA__", json.dumps(with_c + missing, ensure_ascii=False).replace("</", "<\\/")) \
        .replace("__N__", str(len(with_c))).replace("__MISSING__", str(len(missing)))
    open(os.path.join(HERE, "review.html"), "w").write(page)
    print(f"review.html: {len(with_c)} lines with verified takes; {len(missing)} with none (record again)")


TEMPLATE = """<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Clip Picker</title>
<style>
:root{--bg:#faf7f2;--card:#fff;--ink:#222;--mute:#6b6459;--line:#e4ddd2;--pick:#1f7a4d;--pickbg:#e3f4ea;--sug:#b7791f}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#1b1916;--card:#26231f;--ink:#eee8de;--mute:#a89f92;--line:#3a352e;--pick:#5fd39a;--pickbg:#1d3a2b;--sug:#e2b25a}}
:root[data-theme="dark"]{--bg:#1b1916;--card:#26231f;--ink:#eee8de;--mute:#a89f92;--line:#3a352e;--pick:#5fd39a;--pickbg:#1d3a2b;--sug:#e2b25a}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.4 system-ui,-apple-system,sans-serif}
header{position:sticky;top:0;z-index:2;background:var(--bg);border-bottom:1px solid var(--line);padding:10px 16px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}
header h1{font-size:18px;margin:0;flex:1 1 auto}
header .n{color:var(--mute);font-size:14px}
button{font:inherit;cursor:pointer}
.copy{background:var(--pick);color:#fff;border:0;border-radius:10px;padding:10px 14px;font-weight:600}
main{padding:12px 16px 80px;max-width:760px;margin:0 auto}
.help{color:var(--mute);font-size:14px;margin:4px 0 14px}
.line{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px;margin:0 0 12px}
.line.done{border-color:var(--pick)}
.hd{display:flex;gap:8px;align-items:baseline;flex-wrap:wrap}
.hd b{font-size:18px}
.hd .en,.hd .meta{color:var(--mute);font-size:14px}
.opts{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;margin-top:10px}
.opt{border:2px solid var(--line);border-radius:12px;padding:8px;display:flex;flex-direction:column;gap:6px;background:var(--card);color:var(--ink);text-align:left}
.opt.on{border-color:var(--pick);background:var(--pickbg)}
.opt .lbl{font-weight:600;font-size:15px}
.opt .sub{color:var(--mute);font-size:12px;overflow-wrap:anywhere}
.again{margin:24px 0 8px;font-size:18px}
.line.rec .hd b{color:var(--mute)}
.opt .heard{font-size:12px;overflow-wrap:anywhere}
.opt .sug{color:var(--sug);font-size:12px;font-weight:700}
.play{border:1px solid var(--line);background:transparent;color:var(--ink);border-radius:999px;padding:6px 10px;font-size:14px}
.choose{border:0;border-radius:8px;padding:6px;background:var(--line);color:var(--ink);font-size:14px}
.opt.on .choose{background:var(--pick);color:#fff}
textarea{width:100%;min-height:120px;font:13px/1.4 ui-monospace,monospace;margin-top:10px;background:var(--card);color:var(--ink);border:1px solid var(--line);border-radius:8px;padding:8px}
.toast{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);background:var(--ink);color:var(--bg);padding:8px 14px;border-radius:10px;opacity:0;transition:opacity .2s}
.toast.show{opacity:1}
</style></head><body>
<header><h1>Pick the best take</h1><span class="n" id="count"></span><button class="copy" id="copy">Copy my picks</button></header>
<main>
<p class="help">__N__ lines have takes that passed a blind listening check (two transcribers, never told the word, heard only the word and one voice). Lines whose current clip failed that check come first. __MISSING__ lines have no take that passed: they are at the end under Record again. Tap ▶ to listen, then tap a box to pick it. ★ is the suggestion. Your picks stay on this phone until you copy them.</p>
<div id="list"></div>
<textarea id="out" readonly placeholder="Your picks appear here after Copy my picks."></textarea>
</main>
<div class="toast" id="toast"></div>
<script>
const DATA = __DATA__;
const KEY = "njg-clip-picks";
let picks = {};
try { picks = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { picks = {}; }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(picks)); } catch (e) {} };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const audio = new Audio();
function play(src) { audio.pause(); audio.src = src; audio.currentTime = 0; audio.play().catch(() => {}); }
function render() {
  const list = document.getElementById("list");
  const firstMissing = DATA.findIndex((d) => !d.c.length);
  list.innerHTML = DATA.map((d, i) => {
    const cur = picks[d.k];
    const opt = (val, lbl, sub, heard, src, sug) =>
      `<div class="opt${cur === val ? " on" : ""}" data-i="${i}" data-v="${val}">
        <span class="lbl">${lbl}</span>${sug ? '<span class="sug">★ suggested</span>' : ""}
        <span class="heard">heard: ${esc(heard || "nothing")}</span>
        <span class="sub">${esc(sub)}</span>
        <button class="play" data-src="${esc(src)}">▶ Play</button>
        <button class="choose">${cur === val ? "Picked" : "Pick"}</button></div>`;
    const head = (i === firstMissing ? `<h2 class="again">Record again (${DATA.length - firstMissing} lines: no take passed the check)</h2>` : "");
    const meta = `${esc(d.s)} · ${esc(d.q)}${d.ck ? " · " + esc(d.ck) : ""} · current clip ${d.ok ? "passed" : "failed"} the check`;
    if (!d.c.length) return head + `<section class="line rec"><div class="hd"><b>${esc(d.t)}</b><span class="en">${esc(d.e)}</span>
      <span class="meta">${meta} · record again</span></div>
      <div class="opts">${opt("k", "Keep current", "for now", d.h, d.o, false)}</div></section>`;
    return head + `<section class="line${cur ? " done" : ""}">
      <div class="hd"><b>${esc(d.t)}</b><span class="en">${esc(d.e)}</span><span class="meta">${meta}</span></div>
      <div class="opts">${opt("k", "Keep current", d.ok ? "passed" : "failed the check", d.h, d.o, false)}
      ${d.c.map((c) => opt(String(c.r), "Take " + c.r, "score " + c.sc + " · " + c.src + (c.same ? " · same take, new cut" : ""), c.h, c.f, c.r === 1)).join("")}</div></section>`;
  }).join("");
  const n = Object.keys(picks).filter((k) => DATA.some((d) => d.k === k)).length;
  document.getElementById("count").textContent = n + " / " + DATA.length + " picked";
}
document.getElementById("list").addEventListener("click", (ev) => {
  const p = ev.target.closest(".play");
  if (p) { play(p.dataset.src); return; }
  const o = ev.target.closest(".opt");
  if (!o) return;
  const d = DATA[+o.dataset.i];
  picks[d.k] = o.dataset.v; save(); render();
});
document.getElementById("copy").addEventListener("click", async () => {
  const txt = DATA.filter((d) => picks[d.k]).map((d) => d.k + "=" + picks[d.k]).join("\\n");
  const out = document.getElementById("out"); out.value = txt || "(nothing picked yet)";
  let ok = false;
  try { await navigator.clipboard.writeText(txt); ok = true; } catch (e) { out.select(); try { ok = document.execCommand("copy"); } catch (e2) {} }
  const t = document.getElementById("toast"); t.textContent = ok ? "Copied: paste it to Claude" : "Select the text below and copy it";
  t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 2000);
});
render();
</script></body></html>
"""

if __name__ == "__main__":
    main()
