#!/usr/bin/env node
/*
 * The one shadow, checked in the real games (s19-artfix; Zafar, 12 Nov evening, sekelo's grill: "This doesn't look correctly cut
 * out"). SH-268: one light from the upper left, so everything on the worktop casts one soft shadow down and to the right, and nothing
 * shows a second outline up and to the left of it. For each game whose settings name its bottom row (data/stations/*.json band
 * "tray" or "shelf"; chaat's tray is its bowl's, the assemble station), at each size, at L1 (ghost on the tray games, sign on all):
 *   ghost   the painted stone tray (Shelf.P.tray's canvas) against the slab picture's own outline, row by row at its two ends and
 *           column by column along its top and foot: any solid paint (alpha > 0.5) more than 1.5 canvas px outside the picture's
 *           edge is a second outline (the 12 Nov fault: an opaque rounded box under the slab, its corners tighter and its sides wider
 *           than the picture's, showing as a darker copy of the edge up and to the left)
 *   sign    every shadow on the scene (an object's .shadow, the kit's or the stations' contact shadow) lies down and to the right of
 *           its object: its middle never more than 1 design px up or left of the object's middle
 * Exit 1 on any fail. --shots <dir>: a frame of each band's left end (and the full screen) for the report.
 *   node build/tools/art/shadowcheck.mjs [--games corn,mishkaki-grill] [--sizes 740x320,930x430,1280x665,1920x1080] [--shots dir]
 *                                       [--json out.json]
 * Port COOK_TEST_PORT (default 8913); take the lock /tmp/njg-browser-$COOK_TEST_PORT.lock round it.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
process.env.COOK_TEST_PORT = process.env.COOK_TEST_PORT || "8913";
const argv = process.argv.slice(2);
const val = (k, d = null) => { const i = argv.indexOf(`--${k}`); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : d; };
if (argv.includes("--help")) { console.log("node build/tools/art/shadowcheck.mjs [--games a,b] [--sizes a,b] [--shots dir] [--json out.json]"); process.exit(0); }

// every game whose settings name its bottom row: {game: "tray" | "shelf"}
export const bandGames = (root = ROOT) => Object.fromEntries(readdirSync(join(root, "data/stations")).filter((f) => f.endsWith(".json")).map((f) => {
  try { const j = JSON.parse(readFileSync(join(root, "data/stations", f), "utf8")); return j.band === "tray" || j.band === "shelf" ? [f.replace(/\.json$/, ""), j.band] : null; } catch { return null; }
}).filter(Boolean).sort());
const BANDS = bandGames();

const games = val("games") ? val("games").split(",") : Object.keys(BANDS);
const sizes = String(val("sizes", "740x320,930x430,1280x665,1920x1080")).split(",");
const shots = val("shots");
// (chaat has no station of its own by its name: its bowl, the assemble station, draws its tray)
const LAB = { chaat: "assemble" };
if (shots) mkdirSync(shots, { recursive: true });

// in the page: the tray's canvas against the slab picture's outline, and every shadow's side
const PROBE = (band) => {
  const C = window.Cook, S = C && C.scene, SH = window.Shelf;
  if (!S || !S.children || !SH) return { wait: "no scene" };
  // every shadow's side: its middle against its object's
  const signs = () => {
    const sign = [];
    let shadows = 0;
    for (const o of S.children.list) {
      const sh = o && o.shadow;
      if (!sh || !sh.active || !o.active || !o.visible || !sh.visible || !sh.getBounds || !o.getBounds) continue;
      shadows++;
      // (a contact shadow cast from a footprint of its own, a pan's body without its handle, is judged from that footprint)
      const a = sh.njgFoot ? (({ x, y }) => ({ centerX: x, centerY: y }))(sh.njgFoot()) : o.getBounds(), b = sh.getBounds();
      const dx = b.centerX - a.centerX, dy = b.centerY - a.centerY;
      if ((dx < -1 || dy < -1) && sign.length < 6) sign.push(`${(o.texture && o.texture.key) || o.type}: shadow ${dx.toFixed(1)}, ${dy.toFixed(1)} (up or left)`);
    }
    return { sign, shadows };
  };
  // (a shelf game: the stone band and its ledge are tiles with no shadow of their own; its things' shadows are judged)
  if (band === "shelf") { const g = signs(); return g.shadows ? { worst: 0, fails: [], ...g, screen: null } : { wait: "no shadows yet" }; }
  const tray = S.children.list.find((o) => o.texture && /^njg-tray@/.test(o.texture.key) && o.active);
  if (!tray) return { wait: "no tray" };
  if (!/@art$/.test(tray.texture.key)) return { wait: "tray not painted from its art yet" };
  const art = SH.trayArt();
  if (!art) return { wait: "no art" };
  const A = SH.TRAY_ART, box = tray.trayBox, sc = 1 / tray.scaleX;
  const cv = tray.texture.getSourceImage();
  const g = cv.getContext("2d");
  const W = cv.width, H = cv.height;
  const pa = g.getImageData(0, 0, W, H).data;
  const al = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : pa[(y * W + x) * 4 + 3]);
  // the slab picture's alpha
  const sl = art.slab, SW = sl.naturalWidth, SHh = sl.naturalHeight;
  const sc2 = document.createElement("canvas");
  sc2.width = SW; sc2.height = SHh;
  const g2 = sc2.getContext("2d");
  g2.drawImage(sl, 0, 0);
  const sa = g2.getImageData(0, 0, SW, SHh).data;
  const sal = (c, r) => (c < 0 || r < 0 || c >= SW || r >= SHh ? 0 : sa[(r * SW + c) * 4 + 3]);
  const pad = box.pad * sc, w = box.w * sc, h = box.h * sc;
  const k = h / (A.body[1] - A.body[0]);
  const y0 = pad - A.body[0] * k;
  const e = Math.min(A.end * k, w / 2);
  const solid = 128;
  // the picture's edge, in canvas px: left end (picture cols from 0) at x = pad + c*k; right end (picture cols from SW) at x = pad + w - (SW - c)*k
  const fails = [];
  let worst = 0;
  const note = (side, at, d) => { worst = Math.max(worst, d); if (d > 1.5 && fails.length < 6) fails.push(`${side} at ${at}: solid paint ${d.toFixed(1)} px outside the slab's edge`); };
  for (let y = Math.ceil(y0 + A.body[0] * k) + 1; y < Math.floor(y0 + A.body[1] * k) - 1; y++) {
    // (the picture's edge over the rows this canvas row is resampled from, so a smoothed edge pixel is never a fail)
    const rs = [Math.floor((y - 1 - y0) / k), Math.ceil((y + 1 - y0) / k)];
    const any = (c) => { for (let r = rs[0]; r <= rs[1]; r++) if (sal(c, r) > solid) return true; return false; };
    let c0 = -1; for (let c = 0; c < SW / 2; c++) if (any(c)) { c0 = c; break; }
    let c1 = -1; for (let c = SW - 1; c > SW / 2; c--) if (any(c)) { c1 = c; break; }
    let p0 = -1; for (let x = 0; x < W / 2; x++) if (al(x, y) > solid) { p0 = x; break; }
    let p1 = -1; for (let x = W - 1; x > W / 2; x--) if (al(x, y) > solid) { p1 = x; break; }
    if (c0 >= 0 && p0 >= 0) note("left", `row ${y}`, pad + c0 * k - p0);
    if (c1 >= 0 && p1 >= 0) note("right", `row ${y}`, p1 - (pad + w - (SW - 1 - c1) * k));
  }
  // top and foot along the left end and the right end (where the corners are)
  for (let x = Math.ceil(pad) + 1; x < pad + e; x++) {
    const cs = [Math.floor((x - 1 - pad) / k), Math.ceil((x + 1 - pad) / k)];
    for (const [side, xx, flip] of [["top-left", x, false], ["top-right", Math.round(pad + w - (x - pad)), true]]) {
      const at = (c, r) => sal(flip ? SW - 1 - c : c, r) > solid;
      let r0 = -1; for (let r = 0; r < SHh && r0 < 0; r++) for (let c = cs[0]; c <= cs[1]; c++) if (at(c, r)) { r0 = r; break; }
      let q0 = -1; for (let y = 0; y < H; y++) if (al(xx, y) > solid) { q0 = y; break; }
      if (r0 >= 0 && q0 >= 0) note(side, `col ${xx}`, y0 + r0 * k - q0);
    }
  }
  const { sign, shadows } = signs();
  const v = window.UI || (C && C.UI);
  const a0 = v && v.worldToScreen ? v.worldToScreen(box.x, box.y) : null;
  const a1 = v && v.worldToScreen ? v.worldToScreen(box.x + box.w, box.y + box.h) : null;
  return { worst: Math.round(worst * 10) / 10, fails, sign, shadows, key: tray.texture.key, screen: a0 && a1 ? { x: a0.x, y: a0.y, w: a1.x - a0.x, h: a1.y - a0.y } : null };
};

const { startServer, launch, newPage, SIZES } = await import(join(ROOT, "build/sandbox/lib/env.mjs"));
const srv = await startServer();
const browser = await launch();
const rows = [];
let bad = 0;
for (const game of games) {
  for (const size of sizes) {
    const np = await newPage(browser, SIZES[size] ? size : "1280x665", { seed: 7 });
    const p = np.page;
    await p.goto(`http://127.0.0.1:${process.env.COOK_TEST_PORT}/lab.html?mode=cook&game=${LAB[game] || game}&level=1&nonav=1&seed=7&speed=3`, { waitUntil: "load" });
    let r = null;
    const t0 = Date.now();
    while (Date.now() - t0 < 30000) {
      r = await p.evaluate(PROBE, BANDS[game] || "tray").catch((e) => ({ wait: String(e) }));
      if (!r.wait) break;
      await p.waitForTimeout(250);
    }
    if (!r.wait) { await p.waitForTimeout(1200); r = await p.evaluate(PROBE, BANDS[game] || "tray").catch((e) => ({ wait: String(e) })); }
    const ok = !r.wait && !r.fails.length && !r.sign.length;
    if (!ok) bad++;
    rows.push({ game, size, ok, ...r });
    console.log(`${ok ? "ok  " : "FAIL"} ${game} @${size}: ${r.wait ? r.wait : `ghost ${r.worst} px, ${r.shadows} shadows${r.fails.length ? "; " + r.fails.join("; ") : ""}${r.sign.length ? "; " + r.sign.join("; ") : ""}`}`);
    if (shots && r.screen) {
      const [vw, vh] = size.split("x").map(Number);
      const s = r.screen, cw = Math.min(vw, Math.max(160, Math.round(s.h * 2.2))), y = Math.max(0, Math.round(s.y - s.h * 0.35));
      await p.screenshot({ path: `${shots}/${game}@${size}-band.png`, clip: { x: Math.max(0, Math.round(s.x - s.h * 0.25)), y, width: cw, height: Math.min(vh - y, Math.round(s.h * 1.6)) } }).catch(() => {});
      await p.screenshot({ path: `${shots}/${game}@${size}-full.png` }).catch(() => {});
    }
    await np.ctx.close();
  }
}
await browser.close();
srv.close();
if (val("json")) writeFileSync(val("json"), JSON.stringify(rows, null, 1));
console.log(bad ? `shadowcheck: ${bad} of ${rows.length} fail` : `shadowcheck: all ${rows.length} pass`);
process.exit(bad ? 1 : 0);
