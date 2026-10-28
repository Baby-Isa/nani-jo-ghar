#!/usr/bin/env node
// The lab check (Zafar, 27-28 Oct: "this is the way we should be doing things"): a lab page at the four edge sizes, before Zafar
// sees it. For each size and each state (a query string): a screenshot, the page's errors, and every word that leaves its card
// (each text's own glyph box against its nearest card: the nearest box with a fill, an edge or a shadow), a contact sheet of
// them all. Exit 1 on a page error or a spill. What I ran by hand for lab/cards.html, as one command.
//
//   node build/tools/review/labcheck.mjs lab/cards.html ["stage=4&open=1" "long=1" ...] [--sizes 740x320,930x430,1280x665,1920x1080]
//                                                        [--wait 1200] [--out build/screenshots/labcheck/<name>]
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join, basename } from "node:path";
import { ROOT, PORT, startServer, pw } from "../../sandbox/lib/env.mjs";

const argv = process.argv.slice(2);
const val = (f, d) => { const i = argv.indexOf(f); return i >= 0 ? argv.splice(i, 2)[1] : d; };
const sizes = val("--sizes", "740x320,930x430,1280x665,1920x1080").split(",");
const wait = +val("--wait", "1200");
const page0 = argv.shift();
if (!page0) { console.log("node build/tools/review/labcheck.mjs <page under the repo> [query ...] [--sizes a,b] [--wait ms] [--out dir]"); process.exit(0); }
const out = val("--out", join(ROOT, "build", "screenshots", "labcheck", basename(page0).replace(/\.\w+$/, "")));
const states = argv.length ? [...argv] : [""]; // (every option read first: what is left are the states)
mkdirSync(out, { recursive: true });

const SPILLS = () => {
  const shown = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && +s.opacity > 0.05; };
  const cardOf = (el) => {
    for (let x = el; x && x !== document.body; x = x.parentElement) {
      const s = getComputedStyle(x);
      if (/hidden|clip|auto|scroll/.test(s.overflowX + s.overflowY)) return null; // clipped, not spilled (the text-clipped lint's)
      const fill = s.backgroundColor && !/rgba\(0, 0, 0, 0\)|transparent/.test(s.backgroundColor);
      if (fill || parseFloat(s.borderTopWidth) > 0 || s.boxShadow !== "none") return x;
    }
    return null;
  };
  const out = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    const s = (n.nodeValue || "").trim();
    if (!s || !n.parentElement || !shown(n.parentElement) || n.parentElement.closest("script, style, .opts")) continue;
    const card = cardOf(n.parentElement);
    if (!card) continue;
    const rg = document.createRange(); rg.selectNodeContents(n);
    const r = rg.getBoundingClientRect(), c = card.getBoundingClientRect();
    if (r.width < 1) continue;
    const over = Math.max(c.left - r.left, r.right - c.right, c.top - r.top, r.bottom - c.bottom);
    if (over > 2) out.push(`"${s.slice(0, 30)}" ${Math.round(over)} px outside ${card.tagName.toLowerCase()}.${String(card.className).split(" ").slice(0, 2).join(".")}`);
  }
  return [...new Set(out)];
};

const srv = await startServer();
const browser = await pw.chromium.launch();
let bad = 0;
const shots = [];
const lines = [`# Lab check: ${page0} (${new Date().toISOString().slice(0, 16)})`, ""];
for (const size of sizes) {
  const [w, h] = size.split("x").map(Number);
  for (const q of states) {
    const p = await browser.newPage({ viewport: { width: w, height: h }, hasTouch: h < 500 });
    const errs = [];
    p.on("pageerror", (e) => errs.push(e.message));
    p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
    await p.goto(`http://127.0.0.1:${PORT}/${page0}${q ? "?" + q : ""}`, { waitUntil: "networkidle" }).catch((e) => errs.push(String(e)));
    await p.waitForTimeout(wait);
    const sp = await p.evaluate(SPILLS).catch((e) => [String(e)]);
    const f = join(out, `${size}${q ? "-" + q.replace(/[^\w=]+/g, "_") : ""}.png`);
    await p.screenshot({ path: f });
    shots.push({ f, size, q });
    if (errs.length || sp.length) bad++;
    lines.push(`- ${size} ${q || "(default)"}: ${errs.length ? `ERRORS ${errs.join(" | ")}` : "no errors"}; ${sp.length ? `SPILLS ${sp.join("; ")}` : "nothing spills"}`);
    console.log(lines[lines.length - 1]);
    await p.close();
  }
}
// the contact sheet: every shot at a fixed height, in rows by size
const sheet = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const imgs = shots.map((s) => `<figure><img src="data:image/png;base64,${readFileSync(s.f).toString("base64")}"><figcaption>${s.size} ${s.q || ""}</figcaption></figure>`).join("");
await sheet.setContent(`<style>body{margin:8px;font:12px sans-serif;display:flex;flex-wrap:wrap;gap:8px}figure{margin:0}img{height:220px;display:block;border:1px solid #ccc}</style>${imgs}`);
await sheet.waitForTimeout(500);
await sheet.screenshot({ path: join(out, "sheet.png"), fullPage: true });
writeFileSync(join(out, "report.md"), lines.join("\n") + "\n");
await browser.close();
if (srv.close) srv.close();
console.log(`${bad ? "FAIL" : "ok"}: ${shots.length} shots, sheet ${join(out, "sheet.png")}`);
process.exit(bad ? 1 : 0);
