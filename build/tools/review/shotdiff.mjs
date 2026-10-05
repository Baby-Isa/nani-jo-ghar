#!/usr/bin/env node
// Screenshot diff: compare a sandbox run's shots with the last APPROVED run and print only what changed or is new.
// The approved run is kept as a manifest of small hashes (build/tools/review/approved-shots.json), never as images (rule B19).
import { existsSync, readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { join, relative } from "node:path";
import { createHash } from "node:crypto";
import { decodePng, encodePng, resize, luma, blank, blit, drawText } from "./lib/png.mjs";
import { args, help, runDir, rel, ROOT, TOOLS, die, more } from "./lib/common.mjs";

const HELP = `
node build/tools/review/shotdiff.mjs [--run <id|dir>] [--vs <run-id>] [--flows a,b] [--threshold N] [--approve] [--manifest file]
  Compares a sandbox run's screenshots (default: the newest run) with the approved manifest and prints only the CHANGED and NEW shots,
  plus the approved shots this run no longer has (only for flows the run covers). Writes a contact sheet of just those:
  <run>/sheets/changed.png (numbered cells) and changed.md (number -> shot path).
  --vs <run>      compare with another saved run at full resolution (side-by-side sheet: old | new) instead of the manifest
  --approve       record this run as the approved one: merges its shots into the manifest (replaces entries for the flows it covers)
  --flows a,b     only these flow ids (slugs such as cook-chai-tray, or a prefix such as clinic-)
  --threshold N   how different counts as changed: a shot is changed when the biggest 16x9 grid-cell luma change is at least N of 255
                  (default 6) or its mean change is at least N/12; exact-identical shots are never changed
  --manifest f    use another manifest file (default build/tools/review/approved-shots.json)
  Exit 0 when nothing changed or is new, 1 otherwise (2 on a usage error). No network.
Manifest entry per shot: "WxH:sha8:<144 base64 chars>" = size, hash of the pixels, a 16x9 luma thumbnail.`;
const a = args(); help(HELP, a);

const GW = 16, GH = 9;
const MANIFEST = a.val("manifest", join(TOOLS, "approved-shots.json"));
const TH = +a.val("threshold", 6);

function walk(dir) { // every shot of a run: key "flow-slug/size/NN-state.png" -> absolute path
  const out = new Map();
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    if (!f.isDirectory() || ["data", "sheets"].includes(f.name)) continue;
    for (const sz of readdirSync(join(dir, f.name), { withFileTypes: true })) {
      if (!sz.isDirectory()) continue;
      for (const s of readdirSync(join(dir, f.name, sz.name))) if (s.endsWith(".png")) out.set(`${f.name}/${sz.name}/${s.replace(/^\d+-/, "")}`, join(dir, f.name, sz.name, s));
    }
  }
  return out;
}
function signature(path) {
  const buf = readFileSync(path), img = decodePng(buf), small = resize(img, GW, GH), sig = Buffer.alloc(GW * GH);
  for (let i = 0; i < GW * GH; i++) sig[i] = Math.round(luma(small.data, i * 4));
  return { w: img.w, h: img.h, sha: createHash("sha1").update(img.data).digest("hex").slice(0, 8), sig };
}
const pack = (s) => `${s.w}x${s.h}:${s.sha}:${s.sig.toString("base64")}`;
function unpack(str) { const [wh, sha, b64] = str.split(":"); const [w, h] = wh.split("x").map(Number); return { w, h, sha, sig: Buffer.from(b64, "base64") }; }
function dist(x, y) { let max = 0, sum = 0; for (let i = 0; i < x.length; i++) { const d = Math.abs(x[i] - y[i]); sum += d; if (d > max) max = d; } return { max, mean: sum / x.length }; }
const flowOf = (k) => k.split("/")[0];

let run;
try { run = runDir(a.val("run")); } catch (e) { die(e.message); }
let shots = walk(run);
const want = (a.val("flows") || "").split(",").filter(Boolean);
if (want.length) shots = new Map([...shots].filter(([k]) => want.some((w) => flowOf(k) === w || (w.endsWith("-") && flowOf(k).startsWith(w)))));
if (!shots.size) die(`No screenshots in ${rel(run)}${want.length ? " for those flows" : ""}.`);
const flowsInRun = new Set([...shots.keys()].map(flowOf));

const changed = [], added = [], same = [], noise = [], tone = [], moved = [];
let removed = [];
let manifest = null, other = null;

// the other side: the manifest's hashes, or another saved run read in full
const old = new Map(); // key -> [{w, h, sha, sig, path?}, ...]: several variants when the approved side was taken from several runs
const addOld = (k, v) => { const l = old.get(k) || []; if (!l.some((x) => x.sha === v.sha)) l.push(v); old.set(k, l); };
if (a.val("vs")) {
  for (const id of a.val("vs").split(",")) { other = walk(runDir(id)); for (const [k, p] of other) if (flowsInRun.has(flowOf(k))) { try { addOld(k, { ...signature(p), path: p }); } catch (e) { /* unreadable */ } } }
} else {
  manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : { shots: {} };
  for (const [k, v] of Object.entries(manifest.shots)) if (flowsInRun.has(flowOf(k))) for (const x of [].concat(v)) addOld(k, unpack(x));
}
const sigs = new Map();
for (const [k, p] of shots) { try { sigs.set(k, signature(p)); } catch (e) { console.error(`cannot read ${k}: ${e.message}`); } }

// how different two shots are: "same" (within the threshold), "tone" (same picture, different brightness: a fade or a dim scrim),
// or "changed" (the picture differs)
const RANK = { same: 0, tone: 1, changed: 2 };
function compare(vs, n) { // against every variant, the closest wins
  let best = null;
  for (const o of [].concat(vs)) { const r = compare1(o, n); if (!best || RANK[r.kind] < RANK[best.kind] || (r.kind === best.kind && r.kind === "changed" && (r.max ?? 1e9) < (best.max ?? 1e9))) best = r; }
  return best;
}
function compare1(o, n) {
  if (o.w !== n.w || o.h !== n.h) return { kind: "changed", why: `size ${o.w}x${o.h} -> ${n.w}x${n.h}` };
  const d = dist(o.sig, n.sig);
  if (d.max < TH && d.mean < TH / 12) return { kind: "same", ...d };
  // fit n = g*o + c (least squares over the grid): a pure fade or exposure change leaves almost no residual
  const N = o.sig.length; let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (let i = 0; i < N; i++) { sx += o.sig[i]; sy += n.sig[i]; sxx += o.sig[i] * o.sig[i]; sxy += o.sig[i] * n.sig[i]; }
  const den = N * sxx - sx * sx, g = den ? (N * sxy - sx * sy) / den : 1, c = (sy - g * sx) / N;
  let res = 0; for (let i = 0; i < N; i++) res = Math.max(res, Math.abs(n.sig[i] - (g * o.sig[i] + c)));
  if (res < TH && (Math.abs(g - 1) > 0.02 || Math.abs(c) > 2)) return { kind: "tone", ...d, why: `whole-screen brightness change (x${g.toFixed(2)})` };
  return { kind: "changed", ...d, why: `grid change max ${d.max}, mean ${d.mean.toFixed(2)}` };
}
const sameFlowSize = (k) => k.split("/").slice(0, 2).join("/") + "/";
for (const [k, n] of sigs) {
  const p = shots.get(k), o = old.get(k);
  if (!o) {
    // a name the other side lacks: a state that happened at another moment may still be the same picture as one of its shots
    const near = [...old].find(([ok, ov]) => ok.startsWith(sameFlowSize(k)) && !sigs.has(ok) && compare(ov, n).kind === "same");
    if (near) moved.push(k); else added.push({ key: k, path: p });
    continue;
  }
  if (o.some((x) => x.sha === n.sha)) { same.push(k); continue; }
  const r = compare(o, n);
  if (r.kind === "same") noise.push({ key: k, ...r });
  else if (r.kind === "tone") tone.push({ key: k, path: p, old: o[0].path, why: r.why });
  else {
    // timing: the same picture may sit under another name in the other run
    const near = [...old].find(([ok, ov]) => ok.startsWith(sameFlowSize(k)) && ok !== k && compare(ov, n).kind === "same");
    if (near) moved.push(k); else changed.push({ key: k, path: p, old: o[0].path, why: r.why });
  }
}
removed = [...old.keys()].filter((k) => flowsInRun.has(flowOf(k)) && !sigs.has(k) && (!want.length || want.some((w) => flowOf(k) === w || (w.endsWith("-") && flowOf(k).startsWith(w)))));
if (a.has("approve")) {
  if (a.val("vs")) die("--approve works from a run, not with --vs.");
  // --also run2,run3: more runs of the same code; a shot that wobbles between runs (a hint that fires a moment later) keeps every variant
  const variants = new Map([...sigs].map(([k, v]) => [k, [pack(v)]]));
  for (const id of (a.val("also") || "").split(",").filter(Boolean)) {
    for (const [k, p] of walk(runDir(id))) { if (!flowsInRun.has(flowOf(k)) || (want.length && !shots.has(k))) continue; const v = pack(signature(p)); const l = variants.get(k) || []; if (!l.some((x) => x.split(":")[1] === v.split(":")[1])) l.push(v); variants.set(k, l); }
  }
  const m = manifest || { shots: {} };
  for (const k of Object.keys(m.shots)) if (flowsInRun.has(flowOf(k)) && (!want.length || shots.has(k) || removed.includes(k))) delete m.shots[k];
  for (const [k, l] of variants) m.shots[k] = l.length === 1 ? l[0] : l;
  const body = Object.entries(m.shots).sort(([x], [y]) => (x < y ? -1 : 1)).map(([k, v]) => `${JSON.stringify(k)}:${JSON.stringify(v)}`).join(",\n");
  const from = [rel(run), ...(a.val("also") || "").split(",").filter(Boolean)].join(" + ");
  writeFileSync(MANIFEST, `{"note":"Approved screenshot hashes (shotdiff.mjs --approve): size, pixel hash, 16x9 luma thumbnail per shot. Hashes only, never images (rule B19).","approvedFrom":${JSON.stringify(from)},"shots":{\n${body}\n}}\n`);
  console.log(`approved ${variants.size} shots from ${from} -> ${rel(MANIFEST)} (${Object.keys(m.shots).length} shots in all, ${[...variants.values()].filter((l) => l.length > 1).length} with more than one variant)`);
}

// ---- contact sheet of just the changed and new shots ----
const show = [...changed.map((c) => ({ ...c, kind: "CHANGED" })), ...added.map((c) => ({ ...c, kind: "NEW" }))];
let sheet = null;
if (show.length) {
  const MAXN = 40, cellW = 360, side = !!other, cols = side ? 2 : 4, pad = 6, label = 16;
  const items = show.slice(0, MAXN);
  const imgs = items.map((it) => { const im = decodePng(readFileSync(it.path)); const h = Math.round((cellW * im.h) / im.w); return { it, im: resize(im, cellW, h), old: it.old ? (() => { const o = decodePng(readFileSync(it.old)); return resize(o, cellW, Math.round((cellW * o.h) / o.w)); })() : null }; });
  const perRow = side ? 1 : cols, unitW = (side ? 2 : 1) * (cellW + pad) + pad;
  const rows = [];
  for (let i = 0; i < imgs.length; i += perRow) rows.push(imgs.slice(i, i + perRow));
  const rowH = rows.map((r) => Math.max(...r.map((x) => Math.max(x.im.h, x.old ? x.old.h : 0))) + label + pad);
  const W = unitW * perRow, H = rowH.reduce((s, x) => s + x, pad);
  const sh = blank(W, H, [235, 235, 235]);
  let y = pad;
  rows.forEach((r, ri) => {
    r.forEach((x, ci) => {
      const n = ri * perRow + ci + 1, x0 = ci * unitW + pad;
      drawText(sh, `#${n}`, x0, y, 2, x.it.kind === "NEW" ? [0, 120, 0] : [200, 0, 0]);
      if (x.old) { drawText(sh, "OLD", x0 + 40, y, 2, [90, 90, 90]); blit(sh, x.old, x0, y + label); blit(sh, x.im, x0 + cellW + pad, y + label); drawText(sh, "NEW", x0 + cellW + pad + 40, y, 2, [90, 90, 90]); }
      else blit(sh, x.im, x0, y + label);
    });
    y += rowH[ri];
  });
  const sdir = join(run, "sheets"); mkdirSync(sdir, { recursive: true });
  sheet = join(sdir, "changed.png");
  writeFileSync(sheet, encodePng(sh));
  writeFileSync(join(sdir, "changed.md"), items.map((it, i) => `${i + 1}. ${it.kind} ${it.key}${it.why ? ` (${it.why})` : ""}\n   ${rel(it.path)}`).join("\n") + (show.length > MAXN ? `\n... ${show.length - MAXN} more not on the sheet\n` : "\n"));
}

const other_label = other ? `run ${rel(a.val("vs"))}` : rel(MANIFEST);
console.log(`shotdiff ${rel(run)} vs ${other_label}: ${shots.size} shots, ${changed.length} changed, ${added.length} new, ${removed.length} gone, ${same.length} identical${(noise.length ? `, ${noise.length} within threshold (largest cell ${Math.max(...noise.map((n) => n.max))}/255, mean ${Math.max(...noise.map((n) => n.mean)).toFixed(2)})` : "") + (tone.length ? `, ${tone.length} brightness-only (a fade or dim scrim)` : "") + (moved.length ? `, ${moved.length} same picture under another state name` : "")}`);
let i = 0;
more(show, 30, (s) => `  #${++i} ${s.kind.padEnd(7)} ${s.key}${s.why ? `  (${s.why})` : ""}`);
if (removed.length) { console.log("  gone from this run:"); more(removed, 10, (k) => `    ${k}`); }
if (sheet) console.log(`contact sheet of just those: ${rel(sheet)} (legend: ${rel(join(run, "sheets", "changed.md"))})`);
if (!manifest && !other) { /* unreachable */ }
if (manifest && !Object.keys(manifest.shots).length && !a.has("approve")) console.log(`The manifest is empty: record a first approved run with --approve.`);
process.exit(show.length ? 1 : 0);
