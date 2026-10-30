#!/usr/bin/env node
// The lab check (Zafar, 27-28 Oct: "this is the way we should be doing things"): a lab page at the four edge sizes, before Zafar
// sees it. For each size and each state (a query string): a screenshot, the page's errors, and every word that leaves its card
// (each text's own glyph box against its nearest card: the nearest box with a fill, an edge or a shadow), a contact sheet of
// them all. Exit 1 on a page error or a spill. What I ran by hand for lab/cards.html, as one command.
//
//   node build/tools/review/labcheck.mjs lab/cards.html ["stage=4&open=1" "long=1" ...] [--sizes 740x320,930x430,1280x665,1920x1080]
//                                                        [--wait 1200] [--out build/screenshots/labcheck/<name>]
//                                                        [--until <selector>] [--play] [--click <selector>] [--eval <js>]
// S14 tools (B9, SH-168): it runs on the games too. `--until .wc14-pop` waits (up to 45 s) for the selector to show instead of a fixed wait;
// `--play` taps a Cook greeting's answer and the order's pop-up through as a child would, so the sidebar's and the big card's states come
// up: node build/tools/review/labcheck.mjs lab.html "mode=cook&game=chai-tray&level=3&nonav=1&seed=7&speed=3" --until .wc14-pop --play
// (cook.html and the clinic's states the same: clinic.html "stage=heal&game=eye&level=1&nonav=1&fast=1" --until .cl-heal). Besides the
// spill it measures the word cards' speaker spacing (lib/cardmeasure.mjs: the side-by-side card's speaker at the item card's own padding).
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join, basename } from "node:path";
import { ROOT, PORT, SIZES, startServer, launch, newPage } from "../../sandbox/lib/env.mjs";
import { SPILLS, SPACING, judgeSpacing } from "./lib/cardmeasure.mjs";

const argv = process.argv.slice(2);
const val = (f, d) => { const i = argv.indexOf(f); return i >= 0 ? argv.splice(i, 2)[1] : d; };
const sizes = val("--sizes", "740x320,930x430,1280x665,1920x1080").split(",");
const wait = +val("--wait", "1200");
const until = val("--until", "");
const click = val("--click", "");
const evalJs = val("--eval", "");
const play = (() => { const i = argv.indexOf("--play"); if (i >= 0) argv.splice(i, 1); return i >= 0; })();
const page0 = argv.shift();
if (!page0) { console.log("node build/tools/review/labcheck.mjs <page under the repo> [query ...] [--sizes a,b] [--wait ms] [--out dir]"); process.exit(0); }
const out = val("--out", join(ROOT, "build", "screenshots", "labcheck", basename(page0).replace(/\.\w+$/, "")));
const states = argv.length ? [...argv] : [""]; // (every option read first: what is left are the states)
mkdirSync(out, { recursive: true });

const srv = await startServer();
const browser = await launch();
let bad = 0;
const shots = [];
const lines = [`# Lab check: ${page0} (${new Date().toISOString().slice(0, 16)})`, ""];
for (const size of sizes) {
  const [w, h] = size.split("x").map(Number);
  for (const q of states) {
    // (the sandbox's own page: local fonts, no outside network; a size it does not know gets a plain page)
    const np = SIZES[size] ? await newPage(browser, size) : null;
    const p = np ? np.page : await browser.newPage({ viewport: { width: w, height: h }, hasTouch: h < 500 });
    const errs = np ? np.errors : [];
    if (!np) { p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text())); }
    await p.goto(`http://127.0.0.1:${PORT}/${page0}${q ? "?" + q : ""}`, { waitUntil: "load" }).catch((e) => errs.push(String(e)));
    if (until || play) {
      // (a child's way through a Cook round to the state: the greeting's answer, the order's pop-up, until the selector shows)
      const t0 = Date.now();
      while (Date.now() - t0 < 45000) {
        if (until && (await p.evaluate((sel) => Array.from(document.querySelectorAll(sel)).some((e) => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; }), until).catch(() => false))) break;
        if (play) {
          const g = await p.evaluate(() => { const T = window.njgTest; const e = T && T.cook && T.cook.expectation ? T.cook.expectation() : null; if (!e || e.kind !== "click" || !/^#choices/.test(e.selector || "")) return null; const el = document.querySelector(e.selector); const r = el && el.getBoundingClientRect(); return r && r.width > 2 ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null; }).catch(() => null);
          if (g) await p.mouse.click(g.x, g.y).catch(() => {});
        }
        await p.waitForTimeout(150);
      }
    }
    if (click) { await p.locator(click).filter({ visible: true }).first().click({ timeout: 4000 }).catch((e) => errs.push(`--click ${click}: ${String(e.message || e).split("\n")[0]}`)); await p.waitForTimeout(700); }
    if (evalJs) { await p.evaluate(evalJs).catch((e) => errs.push(`--eval: ${String(e.message || e).split("\n")[0]}`)); await p.waitForTimeout(700); }
    await p.waitForTimeout(wait);
    const sp = await p.evaluate(SPILLS).catch((e) => [String(e)]);
    const spacing = judgeSpacing(await p.evaluate(SPACING).catch(() => []));
    for (const x of spacing) if (x.ok === false) sp.push(x.what);
    const f = join(out, `${size}${q ? "-" + q.replace(/[^\w=]+/g, "_") : ""}.png`);
    await p.screenshot({ path: f });
    shots.push({ f, size, q });
    if (errs.length || sp.length) bad++;
    lines.push(`- ${size} ${q || "(default)"}: ${errs.length ? `ERRORS ${errs.join(" | ")}` : "no errors"}; ${sp.length ? `SPILLS ${sp.join("; ")}` : "nothing spills"}${spacing.length ? `; SPACING ${spacing.map((x) => x.what).join("; ")}` : ""}`);
    console.log(lines[lines.length - 1]);
    await (np ? np.ctx : p).close();
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
