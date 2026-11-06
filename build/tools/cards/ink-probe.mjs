#!/usr/bin/env node
// A check of word-card.js's ink measure (SH-227's last gap): for the English face at a few sizes and sub-pixel offsets, the baseline
// as the row pass computes it (a Range's box less the face's descent) against a zero-height inline-block's baseline, and the
// lowest ink as it computes it against the pixels of a screenshot (dpr 2).
//   COOK_TEST_PORT=8862 flock -w 900 /tmp/njg-browser-8862.lock node build/tools/cards/ink-probe.mjs
import { startServer, launch, BASE } from "../../sandbox/lib/env.mjs";
import { writeFileSync } from "node:fs";

const srv = await startServer();
const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 900, height: 700 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(`${BASE}/lab.html`, { waitUntil: "load" });
await page.evaluate(() => document.fonts.load('600 12px "Nunito Sans"'));
const rows = await page.evaluate(() => {
  document.body.innerHTML = "";
  document.body.style.cssText = "margin:0;background:#fffdf8";
  const out = [];
  let y = 10;
  for (const px of [10, 11, 12, 13.5]) for (const off of [0, 0.25, 0.5, 0.75]) for (const word of ["mint chutney", "water", "sugar"]) {
    const p = document.createElement("p");
    p.textContent = word;
    p.style.cssText = `position:absolute;left:20px;top:${y + off}px;margin:0;font:600 ${px}px/1.1 "Nunito Sans";color:#6f6660;white-space:nowrap`;
    document.body.appendChild(p);
    const r = document.createRange(), t = p.firstChild;
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.font = `600 ${px}px "Nunito Sans"`;
    let foot = -Infinity, base0 = null;
    for (let i = 0; i < word.length; i++) {
      if (word[i] === " ") continue;
      r.setStart(t, i); r.setEnd(t, i + 1);
      const b = r.getBoundingClientRect(), m = ctx.measureText(word[i]);
      const base = b.bottom - m.fontBoundingBoxDescent;
      base0 = base;
      foot = Math.max(foot, base + (m.actualBoundingBoxDescent > px * 0.1 ? m.actualBoundingBoxDescent : 0));
    }
    const probe = document.createElement("span");
    probe.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline";
    p.appendChild(probe);
    const pb = probe.getBoundingClientRect().bottom;
    probe.remove();
    const pr = p.getBoundingClientRect();
    out.push({ px, off, word, baseRange: +base0.toFixed(2), baseProbe: +pb.toFixed(2), foot: +foot.toFixed(2), box: { x: pr.left, y: pr.top, w: pr.width, h: pr.height } });
    y += 30;
  }
  return out;
});
await page.screenshot({ path: "/tmp/ink-probe.png", fullPage: true });
writeFileSync("/tmp/ink-probe.json", JSON.stringify(rows));
console.log("written /tmp/ink-probe.png /tmp/ink-probe.json");
await browser.close();
srv.close();
