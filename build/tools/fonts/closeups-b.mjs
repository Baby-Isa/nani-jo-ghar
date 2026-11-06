#!/usr/bin/env node
// The close-ups of the font sample (6 Nov b): the same words in every option (options-b.mjs), at a phone's sizes, drawn at 2x.
//   node build/tools/fonts/closeups-b.mjs [out.png]     (mock only; a static page, no game code)
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
const require = createRequire(import.meta.url);
let pw; try { pw = require("playwright"); } catch { pw = require(execSync("npm root -g").toString().trim() + "/playwright"); }
const { chromium } = pw;
import { dirname, join } from "node:path";
import { writeFileSync, unlinkSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { OPTIONS } from "./options-b.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const out = process.argv[2] || join(HERE, "..", "..", "screenshots", "fonts-b", "closeups.png");
const woff = pathToFileURL(join(HERE, "woff2")).href;
const nunito = pathToFileURL(join(HERE, "..", "..", "sandbox", "fonts", "nunito-800.ttf")).href;
// today: Fraunces 700 on the headline, the card and Nani's line; Baloo 2 800 in the bubbles; Nunito 800 on the pills
const today = { heading: ["'Fraunces', serif", 700, "Fraunces 700"], card: ["'Fraunces', serif", 700, "Fraunces 700"], line: ["'Fraunces', serif", 700, "Fraunces 700 (bubbles: Baloo 2)"], pill: ["'Nunito', sans-serif", 800, "Nunito 800"] };
const st = (f) => (f === "Fraunces" ? "'Fraunces Full', serif" : `'${f}', serif`);
const vs = (f) => (f === "Fraunces" ? "font-variation-settings:'SOFT' 0,'WONK' 0;" : "");
const rows = Object.values(OPTIONS).map((o) => {
  const r = o.roles
    ? Object.fromEntries(Object.entries(o.roles).map(([role, [f, w]]) => [role, [st(f), w, `${f} ${w}`, vs(f)]]))
    : Object.fromEntries(Object.entries(today).map(([role, v]) => [role, [...v, ""]]));
  const s = (role) => `font-family:${r[role][0]};font-weight:${r[role][1]};${r[role][3]}`;
  return `<tr><th>${o.name}<small>${o.why}</small></th>
  <td><span style="${s("heading")}" class="h">Muke chai khape</span><i>${r.heading[2]}</i></td>
  <td><div class="card"><span style="${s("card")}" class="c">adh</span><u>half</u></div><i>${r.card[2]}</i></td>
  <td><div class="nani"><span style="${s("line")}">Muke aadu waari chai khape.</span></div><i>${r.line[2]}</i></td>
  <td style="white-space:nowrap"><span class="pill" style="${s("pill")}">paani</span> <span class="pill" style="${s("pill")}">dudh</span><i>${r.pill[2]}</i></td>
  <td><button>Next</button><i>Nunito 800</i></td></tr>`;
}).join("\n");
const fam = (n, f, sty = "normal", w = "100 900") => `@font-face{font-family:'${n}';font-style:${sty};font-weight:${w};src:url(${woff}/${f}) format('woff2')}`;
const html = `<!doctype html><meta charset=utf-8><style>
${fam("Fraunces", "fraunces-roman.woff2")}${fam("Fraunces Full", "fraunces-full-normal.woff2")}${fam("Lora", "lora-normal.woff2", "normal", "400 700")}
${fam("Literata", "literata-normal.woff2", "normal", "200 900")}${fam("Source Serif 4", "source-serif-4-normal.woff2", "normal", "200 900")}${fam("Alegreya", "alegreya-normal.woff2", "normal", "400 900")}
@font-face{font-family:'Nunito';font-weight:800;src:url(${nunito})}
body{margin:0;background:#f6f1e8;font-family:Nunito,sans-serif;color:#2a2522;padding:10px}
h1{font:800 16px Nunito;margin:4px 0 8px}
table{border-collapse:collapse} td,th{border-top:1px solid #e0d2bb;padding:8px 12px;vertical-align:middle;text-align:left}
th{font:800 14px Nunito;color:#7d2234;width:190px} th small{display:block;font:800 10px Nunito;color:#6b5f55;margin-top:3px;opacity:.85}
i{display:block;font:800 10px Nunito;color:#8a7d70;margin-top:4px;font-style:normal}
.h{font-size:22px;color:#2a2522}
.card{display:inline-flex;flex-direction:column;align-items:center;background:#fffaf0;border:2px solid #e0d2bb;border-radius:12px;padding:6px 16px}
.card .c{font-size:30px;color:#7d2234;line-height:1.05} .card u{font:800 11px Nunito;text-decoration:none;color:#6b5f55}
.nani{background:#fff;border-radius:14px;padding:8px 12px;max-width:250px;font-size:17px;line-height:1.25;box-shadow:0 1px 3px #0002}
.pill{display:inline-block;white-space:nowrap;background:#fffaf0;border:2px solid #e0d2bb;border-radius:999px;padding:3px 10px;font-size:13px;color:#7d2234}
button{font:800 15px Nunito;background:#5f7a52;color:#fff;border:0;border-radius:999px;padding:8px 18px}
</style><h1>The same words in every option, at a phone's sizes (heading 22 px, card 30 px, Nani's line 17 px, pills 13 px), drawn at 2x</h1>
<table><tr><th></th><td><b>heading</b></td><td><b>the card's word</b></td><td><b>Nani's line</b></td><td><b>shelf pills</b></td><td><b>a button</b></td></tr>${rows}</table>`;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1000, height: 400 }, deviceScaleFactor: 2 });
const tmp = join(HERE, "woff2", "_closeups.html");
writeFileSync(tmp, html);
await p.goto(pathToFileURL(tmp).href, { waitUntil: "load" });
unlinkSync(tmp);
await p.evaluate(() => document.fonts.ready);
// the faces measured at 100 px (x-height and the width of "paani", in em), drawn in the browser
console.log(await p.evaluate(() => { const c = document.createElement("canvas").getContext("2d"); return [["Fraunces Full", 600], ["Fraunces", 700], ["Lora", 600], ["Lora", 500], ["Literata", 600], ["Source Serif 4", 600], ["Alegreya", 600], ["Nunito", 800]].map(([f, w]) => { c.font = `${w} 100px '${f}'`; return `${f} ${w}: x-height ${(c.measureText("x").actualBoundingBoxAscent / 100).toFixed(3)} em, "paani" ${(c.measureText("paani").width / 100).toFixed(2)} em`; }).join("\n"); }));
await p.waitForTimeout(400);
await p.screenshot({ path: out, fullPage: true });
await b.close();
console.log(out);
