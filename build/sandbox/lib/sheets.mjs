// Contact sheets: one PNG grid per flow per size of the recorded states, labelled (flow, state, size).
import { mkdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { BASE, ROOT, SIZES } from "./env.mjs";

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const PER_SHEET = 16;

export async function makeSheets(browser, runDir, results, log = () => {}) {
  const outDir = join(runDir, "sheets");
  mkdirSync(outDir, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1480, height: 900 } });
  const files = [];
  for (const r of results) {
    const parts = [];
    for (let i = 0; i < Math.max(1, r.states.length); i += PER_SHEET) parts.push(r.states.slice(i, i + PER_SHEET));
    for (let pi = 0; pi < parts.length; pi++) {
      const sz = SIZES[r.size];
      const cells = parts[pi].map((s, i) => {
        const n = pi * PER_SHEET + i + 1;
        const by = {};
        for (const f of s.findings) by[f.check] = (by[f.check] || 0) + 1;
        const detail = Object.entries(by).map(([k, v]) => `${k} ${v}`).join(", ") || "clean";
        const src = s.shot ? `${BASE}/${relative(ROOT, join(runDir, slug(r.flow), r.size, s.shot))}` : "";
        return `<figure class="${s.findings.length ? "bad" : "ok"}"><div class="shot" style="aspect-ratio:${sz.width}/${sz.height}">${src ? `<img src="${esc(src)}">` : "<em>no screenshot</em>"}</div>
          <figcaption><b>${n}. ${esc(s.name)}</b><span>${esc(s.page)}</span><span class="n">${s.findings.length} finding${s.findings.length === 1 ? "" : "s"}${s.findings.length ? ": " + esc(detail) : ""}</span></figcaption></figure>`;
      }).join("");
      const stops = r.stops.length ? `<p class="stop">Stops here: ${esc(r.stops.join(" | "))}</p>` : "";
      const html = `<!doctype html><meta charset="utf-8"><style>
        body{margin:0;padding:16px;background:#f3ece0;font:14px/1.3 Nunito,system-ui,sans-serif;color:#2a1f14;width:1448px}
        h1{font-size:22px;margin:0 0 4px} p{margin:2px 0 10px} .stop{color:#a02a20;font-weight:700}
        .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        figure{margin:0;background:#fff;border:3px solid #cdbfa8;border-radius:8px;overflow:hidden} figure.bad{border-color:#d9534f} figure.ok{border-color:#6aa56a}
        .shot{background:#ddd;width:100%} .shot img{width:100%;height:100%;display:block;object-fit:contain}
        figcaption{padding:6px 8px;display:flex;flex-direction:column;gap:1px;font-size:13px} figcaption span{color:#6b5a45;font-size:12px} .n{font-weight:700}
      </style><h1>${esc(r.flow)} &middot; ${esc(r.size)} (${esc(sz.label)})${parts.length > 1 ? ` &middot; part ${pi + 1}/${parts.length}` : ""}</h1>
      <p>${esc(r.title)}. ${r.complete ? "Reached its end." : "Did not reach its end."} ${r.states.length} states, ${r.findingCount} findings, ${(r.ms / 1000).toFixed(0)} s.</p>${stops}
      <div class="grid">${cells}</div>`;
      const htmlName = `${slug(r.flow)}__${r.size}${parts.length > 1 ? `__${pi + 1}` : ""}`;
      writeFileSync(join(outDir, htmlName + ".html"), html);
      await page.goto(`${BASE}/${relative(ROOT, join(outDir, htmlName + ".html"))}`, { waitUntil: "load" });
      await page.waitForFunction(() => Array.from(document.images).every((i) => i.complete), null, { timeout: 30000 }).catch(() => {});
      await page.screenshot({ path: join(outDir, htmlName + ".png"), fullPage: true });
      files.push(htmlName + ".png");
    }
  }
  await page.close();
  log(`${files.length} contact sheets in ${outDir}`);
  return files;
}
