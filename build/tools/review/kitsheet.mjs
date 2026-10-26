#!/usr/bin/env node
// The side-by-side sheet per shared element (S13-T, the one loop; docs/architecture/evidence-loop.md "The one loop (S13)").
// data/kit-elements.json lists each element of the shared kit, its selectors and where it shows on every LIVE page (index, first,
// day, cook, clinic, lab; the parked games are out). This crops the element from every page at both sizes into ONE sheet (the
// game's name under each crop; a 4-frame strip at 250 ms beside it for a moving one: the glow, the finger), so the judge passes the
// element on one picture: the same look in every game. A page where it is not, by design, or that no driver reaches is listed on
// the sheet with why, never dropped. It plays through the evidence loop's own capture path (run.mjs --evidence: no second one).
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, copyFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { args, help, die, ROOT, rel } from "./lib/common.mjs";

const HELP = `
node build/tools/review/kitsheet.mjs --elem <name>[,<name>...] [--before | --after] [--sizes 1366x768,915x412] [--pages cook,clinic]
                                     [--parallel 2] [--plan] [--from <kit run id> | --redraw]
node build/tools/review/kitsheet.mjs --list
  --elem     the element(s): a name or its slug from data/kit-elements.json (finger, glow, "order card" or order-card, help-box ...);
             several at once share their pages (one play of each page serves every element on it)
  --before / --after   which side of a build this is (the sheet's folder: build/screenshots/kit/<elem>/<before|after|now>/)
  --pages    only these pages (default: every live page: index, first, day, cook, clinic, lab)
  --plan     print the pages and the places no driver reaches, play nothing
  --from     make the sheets again from an earlier kit run's stored captures (build/screenshots/sandbox/ev-<run>: no replay; the run
             id is on the sheet's .md). The places are the run's own (its cells.json); a place changed since needs a new play
  --redraw   draw the sheet again from its own folder (kitsheet.json and its crops): no replay and no sandbox run needed
  Port COOK_TEST_PORT; lock NJG_LOCK (default /tmp/njg-browser.lock). Output: kitsheet-<elem>.png and .md (every page and size:
  reached, or why not) in that folder, the crops beside them.`;
const a = args(); help(HELP, a);
const PORT = process.env.COOK_TEST_PORT || "8843";
const LOCK = process.env.NJG_LOCK || "/tmp/njg-browser.lock";
const KIT = JSON.parse(readFileSync(join(ROOT, "data", "kit-elements.json"), "utf8"));
const slugOf = (s) => String(s).toLowerCase().replace(/\?/g, "q").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
if (a.has("list")) { for (const [n, e] of Object.entries(KIT.elements)) console.log(`${slugOf(n).padEnd(16)} ${n}: ${e.sel}`); process.exit(0); }
const want = String(a.val("elem") || "").split(",").map((s) => s.trim()).filter(Boolean);
if (!want.length) die("Name the element(s): --elem finger (--list shows them).");
const elems = want.map((w) => { const k = Object.keys(KIT.elements).find((n) => n === w || slugOf(n) === slugOf(w)); if (!k) die(`No element "${w}" in data/kit-elements.json (--list shows them).`); return k; });
const PAGES = Object.keys(KIT.pages).filter((p) => !a.val("pages") || a.val("pages").split(",").includes(p));
const SIZES_WANTED = (a.val("sizes") || "1366x768,915x412").split(",");
const phase = a.has("before") ? "before" : a.has("after") ? "after" : "now";
const stamp = () => new Date().toISOString().replace(/[-:]/g, "").slice(0, 15).replace("T", "-") + "-" + Math.random().toString(36).slice(2, 5);

// ---------- the places -> evidence probes (validated by the evidence loop's own spec rules) ----------
const S = await import("../../sandbox/lib/evidence.mjs");
const M = await import("../../sandbox/lib/moments.mjs");
const { allFlows, resolveFlow, flowKind } = await import("../../sandbox/flows/index.mjs");
const { SIZES } = await import("../../sandbox/lib/env.mjs");
const { CHECKS } = await import("../../sandbox/lib/contract.mjs");
for (const s of SIZES_WANTED) if (!SIZES[s]) die(`Unknown size ${s}.`);
const live = allFlows(), fcache = new Map(), seen = M.seenMoments(ROOT);
const ctx = { resolve: (id) => { if (!fcache.has(id)) fcache.set(id, resolveFlow(id, live)); return fcache.get(id); }, kindOf: flowKind, sizes: SIZES, contractChecks: Object.keys(CHECKS), moments: (id) => M.momentsFor(ROOT, id, { kindOf: flowKind, seen }), reachable: M.reachable, rowText: {} };
// cells: one per element x page: {elem, page, flow, at, sel, none|error, id}
const cells = [], spec = {};
let n = 0;
for (const el of elems) {
  const E = KIT.elements[el];
  for (const pg of PAGES) {
    const pl = (E.places || {})[pg];
    const cell = { elem: el, page: pg, title: KIT.pages[pg].title };
    cells.push(cell);
    if (!pl) { cell.none = "no place listed in data/kit-elements.json"; continue; }
    if (pl.none) { cell.none = pl.none; continue; }
    Object.assign(cell, { flow: pl.flow || KIT.pages[pg].flow, at: pl.at, sel: pl.sel || E.sel, id: `KIT-${++n}` });
    // sel "screen": the whole screen (the help ladder); every: N: a frame each time the moment comes, up to N (each rung)
    const capture = cell.sel === "screen" ? ["shot"] : [`crop:${cell.sel}`, ...(E.moves ? [`strip:${cell.sel}:4x250`] : []), ...(E.dom ? [`dom:${cell.sel}`] : [])];
    cell.every = pl.every || 0;
    spec[cell.id] = [{ flow: cell.flow, at: pl.every ? `every:${cell.at}` : cell.at, ...(pl.every ? { max: pl.every } : {}), sizes: SIZES_WANTED, capture, delay: pl.delay || 0, ...(pl.profile ? { profile: pl.profile } : {}), note: `${el} on ${pg}` }];
  }
}
const norm = S.normalizeSpec(spec, ctx);
for (const c of cells) if (c.id && norm.rowErrors[c.id]) c.error = `not reachable: ${norm.rowErrors[c.id][0].replace(/^KIT-\d+ probe 1: /, "")}`;
const ids = cells.filter((c) => c.id && !c.error).map((c) => c.id);
const { pages } = S.planPages(ids, norm.rows);
for (const p of pages) p.early = true; // a page stops once every probe on it has its capture (lib/evidence-probe.mjs)
console.log(`kitsheet ${elems.join(", ")} (${phase}): ${pages.length} pages to play for ${ids.length} places; ${cells.filter((c) => c.none).length} not on their page by design; ${cells.filter((c) => c.error).length} no driver reaches`);
for (const c of cells.filter((c) => c.error)) console.log(`  ${c.elem} on ${c.page}: ${c.error}`);
for (const p of pages) console.log(`  ${p.flow} @ ${p.size}${p.variant ? ` [${p.variant}]` : ""}: ${p.probes.map((q) => cells.find((c) => c.id === q.row)).map((c) => `${c.elem} at ${c.at}`).join("; ")}`);
if (a.has("plan")) process.exit(0);
// the play and the sheets use the browser: under the lock (B16), taken once for the whole job
if (!process.env.NJG_LOCKED) {
  const r = spawnSync("flock", ["-w", "3600", LOCK, process.execPath, ...process.argv.slice(1)], { stdio: "inherit", cwd: ROOT, env: { ...process.env, NJG_LOCKED: "1" } });
  process.exit(r.status === null ? 124 : r.status);
}

// ---------- play (run.mjs --evidence, under the lock, in chunks) ----------
const KITDIR = join(ROOT, "build", "screenshots", "kit");
const runId = a.val("from") || `kit-${stamp()}`;
const runDir = join(KITDIR, "runs", runId);
if (!a.has("redraw")) mkdirSync(runDir, { recursive: true });
const sandboxRun = `ev-${runId}`;
if (!a.val("from") && !a.has("redraw")) {
  writeFileSync(join(runDir, "pages.json"), JSON.stringify({ pages }, null, 1));
  writeFileSync(join(runDir, "cells.json"), JSON.stringify(cells, null, 1));
  let code = 75, chunks = 0;
  while (code === 75 && chunks < 20) {
    chunks++;
    const runArgs = [join(ROOT, "build/sandbox/run.mjs"), "--evidence", join(runDir, "pages.json"), "--evidence-only", "--parallel", a.val("parallel", "2"), "--budget-min", "13", "--no-sheets", "--run-id", sandboxRun, "--resume", sandboxRun];
    console.log(`chunk ${chunks} (run ${runId})`);
    const r = spawnSync("timeout", ["1200", process.execPath, ...runArgs], { stdio: "inherit", cwd: ROOT, env: { ...process.env, COOK_TEST_PORT: PORT } });
    code = r.status === null || r.status === 124 ? 75 : r.status;
  }
}

// ---------- read the captures, draw one sheet per element ----------
// Every crop on a sheet is 1:1 CSS px and, per size, the same box for every game: a fixed box round the element's centre, as big as
// the largest game's (fix round, 26 Oct: the finger was drawn small in Cook and large in the clinic, so size could not be compared),
// cut from the whole screen the probe took at that moment. Strips keep their own crop, 1:1, flagged when still or off their slots.
const { decodePng, encodePng } = await import("./lib/png.mjs");
const { stripMotion, offSlots, SLOT_TOL } = await import("./lib/brief.mjs");
const dataDir = join(ROOT, "build", "screenshots", "sandbox", sandboxRun, "data");
const results = new Map(); // id|size -> evidence result
if (!a.has("redraw") && existsSync(dataDir)) for (const f of readdirSync(dataDir)) {
  let r; try { r = JSON.parse(readFileSync(join(dataDir, f), "utf8")); } catch (e) { continue; }
  for (const e of r.evidence || []) results.set(`${e.row}|${e.size}`, { ...e, sandboxRun, stops: r.stops || [] });
}
if (a.val("from") && !a.has("redraw") && !existsSync(dataDir)) die(`The captures of ${runId} are gone (${rel(dataDir)}): redraw a sheet from its own folder with --redraw, or play again.`);
const playedCells = a.val("from") && existsSync(join(runDir, "cells.json")) ? JSON.parse(readFileSync(join(runDir, "cells.json"), "utf8")) : cells;
const cutPng = (file, box) => { const img = decodePng(readFileSync(file)); const x0 = Math.max(0, Math.min(img.w - 2, Math.round(box.x))), y0 = Math.max(0, Math.min(img.h - 2, Math.round(box.y))); const w = Math.max(2, Math.min(img.w - x0, Math.round(box.width))), h = Math.max(2, Math.min(img.h - y0, Math.round(box.height))); const data = Buffer.alloc(w * h * 4); for (let y = 0; y < h; y++) img.data.copy(data, y * w * 4, ((y0 + y) * img.w + x0) * 4, ((y0 + y) * img.w + x0 + w) * 4); return encodePng({ w, h, data }); };
const motionOf = (files) => { try { return stripMotion(files.map((f) => decodePng(readFileSync(f)))); } catch (e) { return { moving: true, note: "" }; } };
const { startServer, launch } = await import("../../sandbox/lib/env.mjs");
const { htmlToPng, shotUrl: rawUrl } = await import("../../sandbox/lib/sheets.mjs");
const shotUrl = (f) => rawUrl(f).replace(/#/g, "%23").replace(/ /g, "%20");
const server = await startServer(), browser = await launch({ webgl: false });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
const unreached = [];
for (const el of elems) {
  const E = KIT.elements[el], out = join(KITDIR, slugOf(el), phase);
  let grid;
  if (a.has("redraw")) {
    // the sheet again from its own folder (kitsheet.json and the crops beside it): no play, no sandbox run needed
    try { grid = JSON.parse(readFileSync(join(out, "kitsheet.json"), "utf8")).grid; } catch (e) { die(`No ${rel(join(out, "kitsheet.json"))} to redraw from: --from <kit run> (or play again).`); }
  } else {
    rmSync(out, { recursive: true, force: true }); mkdirSync(out, { recursive: true });
    grid = [];
    for (const size of SIZES_WANTED) {
      const row = [];
      for (const c of playedCells.filter((x) => x.elem === el)) {
        const cell = { page: c.page, title: c.title, size, flow: c.flow, at: c.at, crop: null, strip: [], why: null };
        if (c.none) cell.why = `not on this page: ${c.none}`;
        else if (c.error) cell.why = c.error;
        else {
          const r = results.get(`${c.id}|${size}`);
          if (!r) cell.why = "not played (the run did not reach this page)";
          else if (!r.reached) cell.why = `not reached: ${(r.tool || [])[0] ? r.tool[0].replace(/; moments seen:.*$/, "") : "the moment never came"}`;
          else if (c.every) {
            // one whole screen per time the moment came (each rung)
            cell.frames = [];
            r.hits.forEach((h, k) => { const cap = h.captures.find((x) => !x.fail && (x.kind === "shot" || x.kind === "crop") && x.files[0]); if (!cap) return; const f = `${slugOf(c.page)}-${size}-${k + 1}.png`; copyFileSync(join(r.dir, cap.files[0]), join(out, f)); cell.frames.push({ file: f, label: `${h.name.replace(/^rec:/, "")} · ${(h.t / 1000).toFixed(1)} s` }); });
            if (cell.frames.length) { cell.crop = cell.frames[0].file; cell.when = `${cell.frames.length} frames`; } else cell.why = `no frame: ${((r.tool || [])[0] || "nothing captured").slice(0, 200)}`;
          } else {
            const h = r.hits[0], dir = r.dir;
            for (const cap of h.captures) {
              if (cap.fail) { cell.why = cell.why || `${cap.raw}: ${cap.fail}`; continue; }
              if (cap.kind === "crop" && cap.files[0]) { cell.src = join(dir, cap.files[0]); cell.box = cap.box; cell.room = h.room ? join(dir, h.room) : null; cell.crop = `${slugOf(c.page)}-${size}-crop.png`; }
              if (cap.kind === "strip") {
                const ms = cap.n && cap.times ? +((/x(\d+)$/.exec(cap.raw) || [])[1] || 0) : 0, off = offSlots(cap.times || [], ms);
                cap.files.forEach((x, k) => { const f = `${slugOf(c.page)}-${size}-strip-${k + 1}.png`; copyFileSync(join(dir, x), join(out, f)); cell.strip.push({ file: f, ms: cap.times[k], slot: k * ms, off: off[k] }); });
                cell.motion = motionOf(cap.files.map((x) => join(dir, x)));
              }
              if (cap.kind === "dom" && cap.text) cell.text = cap.text.slice(0, 300);
            }
            if (cell.crop) cell.why = null;
            cell.when = `${h.name} at ${(h.t / 1000).toFixed(1)} s`;
          }
        }
        row.push(cell);
      }
      // the same box for every game at this size: as big as the largest element's, round each element's centre, from its screen
      const boxed = row.filter((x) => x.box && x.room && existsSync(x.room));
      const W = Math.max(0, ...boxed.map((x) => x.box.width)), H = Math.max(0, ...boxed.map((x) => x.box.height));
      for (const x of row) {
        if (!x.crop || x.frames) continue;
        try {
          if (x.box && x.room && existsSync(x.room)) { const cx = x.box.x + x.box.width / 2, cy = x.box.y + x.box.height / 2; writeFileSync(join(out, x.crop), cutPng(x.room, { x: cx - W / 2, y: cy - H / 2, width: W, height: H })); x.fixed = `${Math.round(W)} x ${Math.round(H)} px round the centre`; }
          else copyFileSync(x.src, join(out, x.crop));
        } catch (e) { copyFileSync(x.src, join(out, x.crop)); }
        delete x.src; delete x.room;
      }
      grid.push({ size, box: W && H ? { w: Math.round(W), h: Math.round(H) } : null, cells: row });
    }
    writeFileSync(join(out, "kitsheet.json"), JSON.stringify({ element: el, phase, run: runId, grid }, null, 1) + "\n");
  }
  for (const g of grid) for (const c of g.cells) if (!c.crop) unreached.push(`${el} on ${c.page} @ ${g.size}: ${c.why}`);
  const png = await htmlToPng(page, join(out, `kitsheet-${slugOf(el)}.html`), sheetHtml(el, E, grid, out));
  // whole-screen frames (the help ladder): a sheet per page and size, two frames to a sheet at 1136 px, the sidebar readable
  const details = [];
  for (const g of grid) for (const c of g.cells) if (c.frames && c.frames.length) for (let k = 0; k < c.frames.length; k += 2) {
    const name = `kitsheet-${slugOf(el)}-${slugOf(c.page)}-${g.size}-${k / 2 + 1}`;
    details.push(await htmlToPng(page, join(out, `${name}.html`), detailHtml(el, c, g.size, c.frames.slice(k, k + 2), out)));
  }
  let md = `# Kit sheet: ${el} (${phase})\n\nRun ${runId}. Selector \`${E.sel}\`${E.moves ? "; a moving element: a 4-frame strip at 250 ms beside each crop (each frame's real ms; one more than " + SLOT_TOL + " ms off its slot is flagged; a still strip says NO MOTION CAPTURED)" : ""}. Every crop is 1:1 CSS px, the same box for every game at a size (${grid.map((g) => `${g.size}: ${g.box ? `${g.box.w} x ${g.box.h}` : "-"}`).join(", ")}). The judge passes the element on \`${rel(png)}\`${details.length ? ` (full-size frames: ${details.map(rel).join(", ")})` : ""}: the same look in every game. Not reached = no crop: why, per page and size.\n\n| page | size | flow | moment | shown | strip | text |\n|---|---|---|---|---|---|---|\n`;
  for (const g of grid) for (const c of g.cells) md += `| ${c.page} | ${g.size} | ${c.flow || "-"} | ${c.at || "-"} | ${c.crop ? `yes (${c.when})` : String(c.why).replace(/\|/g, "/").slice(0, 200)} | ${c.strip && c.strip.length ? `${c.strip.map((s) => `${s.ms}${s.off ? "(off)" : ""}`).join("/")} ms${c.motion && !c.motion.moving ? ": NO MOTION CAPTURED" : ""}` : "-"} | ${c.text ? c.text.replace(/\s+/g, " ").replace(/\|/g, "/").slice(0, 120) : "-"} |\n`;
  writeFileSync(join(out, `kitsheet-${slugOf(el)}.md`), md);
  console.log(`${el}: ${rel(png)}${details.length ? ` + ${details.length} full-size frame sheets` : ""} (${grid.reduce((k, g) => k + g.cells.filter((c) => c.crop).length, 0)} of ${grid.reduce((k, g) => k + g.cells.length, 0)} crops)`);
}
await page.close(); await browser.close(); server.close();
if (unreached.length) { console.log(`\nnot on the sheet as a crop (${unreached.length}; each is listed on its sheet with why):`); for (const u of unreached) console.log(`  ${u}`); }

function sheetHtml(el, E, grid, out) {
  const img = (f, cls = "") => `<img class="${cls}" src="${esc(shotUrl(join(out, f)))}">`;
  const strip = (c) => (c.strip && c.strip.length ? `${c.motion && !c.motion.moving ? `<div class="still">NO MOTION CAPTURED</div>` : ""}<div class="strip">${c.strip.map((s) => `<div>${img(s.file)}<small class="${s.off ? "off" : ""}">${s.ms} ms${s.off ? ` (slot ${s.slot})` : ""}</small></div>`).join("")}</div>` : "");
  const cell = (c) => c.frames && c.frames.length
    ? `<figure><div class="rungs">${c.frames.map((f) => `<div>${img(f.file, "thumb")}<small>${esc(f.label)}</small></div>`).join("")}</div><figcaption><b>${esc(c.page)}</b> ${esc(c.title)}<span>full size: the ${esc(c.page)} frame sheets</span></figcaption></figure>`
    : `<figure class="${c.crop ? "" : "miss"}">${c.crop ? `<div class="crop">${img(c.crop, "one")}</div>${strip(c)}` : `<div class="why">${esc(c.why)}</div>`}<figcaption><b>${esc(c.page)}</b> ${esc(c.title)}${c.when ? `<span>${esc(c.when)}</span>` : ""}</figcaption></figure>`;
  return `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;padding:12px 16px;background:#f3ece0;font:14px/1.3 Nunito,system-ui,sans-serif;color:#2a1f14;width:1368px}
    header{background:#fff;border:2px solid #2a1f14;border-radius:8px;padding:6px 12px;margin-bottom:8px} h1{font-size:24px;margin:0} header p{margin:2px 0}
    h2{font-size:18px;margin:10px 0 4px}
    .grid{display:flex;flex-wrap:wrap;gap:8px;align-items:flex-start}
    figure{margin:0;background:#fff;border:2px solid #cdbfa8;border-radius:8px;padding:4px;max-width:1360px} figure.miss{background:#fbf3e6;border-style:dashed;width:210px}
    img.one{display:block;margin:0 auto} .crop{overflow:hidden}
    .strip{display:flex;flex-wrap:wrap;gap:3px;margin-top:4px;max-width:1340px} .strip small{display:block;text-align:center;font-size:11px;font-weight:700} .strip small.off{color:#c0443c}
    .still{background:#c0443c;color:#fff;font-weight:900;padding:2px 6px;border-radius:6px;margin-top:4px;font-size:12px}
    .why{padding:14px 6px;font-weight:800;color:#8a4a1a;font-size:13px}
    .rungs{display:grid;grid-template-columns:repeat(2,300px);gap:4px} .rungs img{width:300px;display:block} .rungs small{display:block;text-align:center;font-size:12px;font-weight:800}
    figcaption{font-size:13px;margin-top:3px;text-align:center} figcaption b{font-size:16px;display:block} figcaption span{display:block;color:#6b5a45;font-size:11px}
  </style><header><h1>${esc(el)}: one look in every game?</h1><p>Selector <code>${esc(E.sel)}</code> · every crop 1:1 CSS px, the same box for every game at a size${E.moves ? " · 4 frames 250 ms apart under each crop (real ms; red = off its slot by more than " + SLOT_TOL + " ms)" : ""} · the game's name under each crop · a page where it is not shown says why</p></header>
  ${grid.map((g) => `<h2>${esc(g.size)}${g.box ? ` · box ${g.box.w} x ${g.box.h} px` : ""}</h2><div class="grid">${g.cells.map(cell).join("")}</div>`).join("\n")}`;
}
function detailHtml(el, c, size, frames, out) {
  return `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;padding:12px 16px;background:#f3ece0;font:14px/1.3 Nunito,system-ui,sans-serif;color:#2a1f14;width:1136px}
    h1{font-size:22px;margin:0 0 6px} figure{margin:0 0 8px;background:#fff;border:2px solid #cdbfa8;border-radius:8px;padding:4px} img{width:1124px;display:block} figcaption{font-size:16px;font-weight:900;text-align:center}
  </style><h1>${esc(el)} · ${esc(c.page)} (${esc(c.title)}) · ${esc(size)}</h1>${frames.map((f) => `<figure><img src="${esc(shotUrl(join(out, f.file)))}"><figcaption>${esc(f.label)}</figcaption></figure>`).join("")}`;
}
