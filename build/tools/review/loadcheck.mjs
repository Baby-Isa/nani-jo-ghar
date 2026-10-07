#!/usr/bin/env node
/*
 * The load check (decision 68, rule J11): every page loads only what's on its screen. It opens Cook (the title, then
 * each station in the Station lab) and the clinic (a morning, then each healing game alone) headless, records every
 * picture the page asks for, and FAILS a page that asks for a picture outside its manifest: another game's art, or
 * art nobody declared. Pictures only (webp, png, jpg, svg, gif under assets/); the family's voices are not art.
 *   node build/tools/review/loadcheck.mjs                    every page (about a minute and a half)
 *   node build/tools/review/loadcheck.mjs --only cook,cook:chai-tray,clinic:morning,clinic:tooth
 *   node build/tools/review/loadcheck.mjs --list             the pages
 *   node build/tools/review/loadcheck.mjs --discover         print what each page asked for that its manifest lacks, as globs
 *                                                            (--json FILE writes every page's pictures)
 *   node build/tools/review/loadcheck.mjs --stray            proves the check: Cook's chai station also asks for samosa's
 *                                                            board; that page must FAIL (exit 1)
 *   node build/tools/review/loadcheck.mjs --time [--rate B]  cold and warm load times (a caching server at B bytes/s,
 *                                                            default 2.5e6 = 20 Mbit/s, 30 ms a request)
 * Manifests (the data is the truth; build/tools/review/checks.mjs runs this check):
 *   Cook   data/cook.json art.assets: shared.images (preloaded) + shared.files (allowed on every Cook page); a station's
 *          stations[key].props (assets/cook/props/<name>.webp or its painted sprite), art.sprites.need[key] (painted
 *          sprites) and stations[key].files (globs: what its own code loads), plus stations[key].uses (the mechanics
 *          inside it, whose entries it may load too)
 *   Clinic data/clinic/assets.json shared (every clinic page) + data/clinic/heal/<id>.json "assets" (that game's);
 *          a morning may load its first two patients' games (the next one is prefetched); a game page only its own
 *          game's code (js/clinic/heal/games/<id>.js) and art
 * Run it under the browser lock (rule B16): checks.mjs does (flock -w 1800 /tmp/njg-browser.lock). Port: COOK_TEST_PORT
 * + 40 (default 8852), so it never meets the sandbox's server.
 */
import { createServer } from "node:http";
import { existsSync, statSync, createReadStream, readFileSync } from "node:fs";
import { join, extname, normalize } from "node:path";
import { args, help, ROOT } from "./lib/common.mjs";

const a = args();
help(readFileSync(new URL(import.meta.url), "utf8").split("*/")[0].replace(/^[\s\S]*?\/\*\n?/, "").replace(/^ \* ?/gm, ""), a);
const { pw } = await import("../../sandbox/lib/env.mjs");
const PORT = +(process.env.LOADCHECK_PORT || +(process.env.COOK_TEST_PORT || 8812) + 40);
const BASE = `http://127.0.0.1:${PORT}`;
const TIME = a.has("time");
const RATE = +(a.val("rate") || 2.5e6);
const LAT = TIME ? 30 : 0;
const IMG = /\.(webp|png|jpe?g|svg|gif)$/i;
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".m4a": "audio/mp4", ".woff2": "font/woff2", ".ttf": "font/ttf", ".gif": "image/gif" };
const json = (p) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));

/* ---------------- the manifests ---------------- */
const glob = (g) => new RegExp("^" + g.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\u0000").replace(/\*/g, "[^/]*").replace(/\u0000/g, ".*") + "$");
const matcher = (list) => {
  const res = [...new Set(list.filter(Boolean))].map((g) => (g.includes("*") ? glob(g) : g));
  return (u) => res.some((r) => (typeof r === "string" ? r === u : r.test(u)));
};
const cook = json("data/cook.json");
const SP = cook.art.sprites || {};
const AS = cook.art.assets || {};
// a painted sprite ref ("veg-03.whole", "bg:marble", "<id>.shelf") -> its file (js/cook/art.js refUrl)
function spriteFile(ref) {
  const dir = SP.dir || "assets/cook/items/";
  if (ref.startsWith("bg:")) return (SP.bg || {})[ref.slice(3)] ? `assets/cook/bg/${SP.bg[ref.slice(3)]}.webp` : null;
  const i = ref.lastIndexOf(".");
  if (i < 0) return null;
  const id = ref.slice(0, i), st = ref.slice(i + 1);
  if (st === "shelf") return (SP.shelf || {})[id] ? `${dir}${SP.shelf[id][0]}.webp` : null;
  const v = ((SP.items || {})[id] || {})[st];
  const stem = v && (typeof v === "string" ? v : v.file);
  return stem ? `${dir}${stem}.webp` : null;
}
const propFiles = (p) => [`assets/cook/props/${p}.webp`].concat((SP.props || {})[p] ? [spriteFile(SP.props[p])] : []);
const s02Files = (station) => Object.values(cook.art.s02 || {}).filter((e) => e && typeof e === "object" && e.ready && e.file && String(e.station || "").split(/,\s*/).includes(station)).flatMap((e) => (e.file.endsWith("/") ? [e.file + "**"] : [e.file]).concat(e.meta && e.meta.dishes ? Object.values(e.meta.dishes).map((d) => d.file) : []));
function cookStation(key, seen = new Set()) {
  if (seen.has(key)) return [];
  seen.add(key);
  const st = (AS.stations || {})[key] || {};
  return [].concat((st.props || []).flatMap(propFiles), ((SP.need || {})[key] || []).map(spriteFile), st.files || [], s02Files(key), (st.uses || []).flatMap((k) => cookStation(k, seen)));
}
const cookShared = () => Object.values((AS.shared || {}).images || {}).concat((AS.shared || {}).files || [], (cook.art.s02["kitchen-trays"] || {}).ready ? [cook.art.s02["kitchen-trays"].file] : []);
const clinicAssets = existsSync(join(ROOT, "data/clinic/assets.json")) ? json("data/clinic/assets.json") : { shared: [] };
const gameAssets = (g) => {
  const p = `data/clinic/heal/${g}.json`;
  return existsSync(join(ROOT, p)) ? json(p).assets || [] : [];
};
const owners = (u) => {
  const out = [];
  Object.keys(AS.stations || {}).forEach((k) => matcher(cookStation(k))(u) && out.push(`cook:${k}`));
  CLINIC.forEach((g) => matcher(gameAssets(g))(u) && out.push(`clinic:${g}`));
  return out;
};

/* ---------------- the pages ---------------- */
const STATIONS = ["fetch", "chai-tray", "maani-line", "mishkaki-grill", "daar", "chop", "tadka", "stir", "assemble", "samosa"];
const CLINIC = ["cut", "knee", "ear", "tooth", "taste", "fever", "boing", "eye", "foot"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PAGES = [
  { id: "cook", url: "/cook.html?speed=3", ready: "!!document.querySelector('#panel .title-wrap')", allow: () => cookShared() },
  ...STATIONS.map((k) => ({
    id: `cook:${k}`, url: "/cook.html?speed=3", ready: "!!document.querySelector('#panel .title-wrap')",
    then: `void __cook.lab(${JSON.stringify(k)}, true, { level: 1 })`,
    ready2: "(() => { const e = __cook.expectation && __cook.expectation(); return !!(__cook.state().view && e && e.kind && e.kind !== 'click' && e.kind !== 'wait'); })()",
    allow: () => cookShared().concat(cookStation(k)), station: k,
  })),
  {
    id: "clinic:morning", url: "/clinic.html?morning=1&session=2&nosave=1&quiet=1&seed=1&fast=1", ready: "window.__clinic && window.__clinic.ready && !!window.__clinic.expect()",
    allow: (pg) => clinicAssets.shared.concat(...(pg.games || []).map(gameAssets)), code: (pg) => pg.games || [],
    after: async (page, pg) => (pg.games = await page.evaluate(() => ((Clinic.Run.morningPlan || {}).patients || []).slice(0, 2).map((p) => p.stages && p.stages.heal && p.stages.heal.game).filter(Boolean))),
  },
  ...CLINIC.map((g) => ({
    id: `clinic:${g}`, url: `/clinic.html?stage=heal&game=${g}&level=1&quiet=1&seed=1&fast=1`,
    ready: "window.__clinic && window.__clinic.ready && window.__clinic.Stages.heal.current && !!window.__clinic.Stages.heal.current.controller",
    allow: () => clinicAssets.shared.concat(gameAssets(g)), code: () => [g],
  })),
];
if (a.has("list")) {
  PAGES.forEach((p) => console.log(p.id.padEnd(22), p.url));
  process.exit(0);
}
const only = a.val("only") ? a.val("only").split(",") : null;
let pages = only ? PAGES.filter((p) => only.includes(p.id)) : PAGES;
if (a.has("stray")) pages = PAGES.filter((p) => p.id === "cook:chai-tray").map((p) => Object.assign({}, p, { stray: "assets/cook/items/v3/samosa/board.webp" }));

/* ---------------- the server (a cache like the live site's, so a warm load is warm) ---------------- */
let served = 0;
const srv = createServer((req, res) => {
  served++;
  const p = decodeURIComponent(new URL(req.url, BASE).pathname);
  let f = normalize(join(ROOT, p));
  if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.writeHead(404); return res.end(); }
  const size = statSync(f).size;
  const send = () => { res.writeHead(200, { "content-type": MIME[extname(f).toLowerCase()] || "application/octet-stream", "cache-control": "max-age=3600", "content-length": size }); createReadStream(f).pipe(res); };
  if (LAT) setTimeout(send, LAT + (size / RATE) * 1000);
  else send();
});
await new Promise((r, j) => { srv.once("error", j); srv.listen(PORT, "127.0.0.1", r); });
const exe = existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined;
const browser = await pw.chromium.launch({ executablePath: exe, args: ["--no-sandbox", "--disable-webgl", "--autoplay-policy=no-user-gesture-required"] });

async function visit(pg, page, warm = false) {
  const reqs = [];
  let phase = 0, bytes = 0;
  const onReq = (r) => { const u = r.url(); if (u.startsWith(BASE)) reqs.push({ u: decodeURIComponent(new URL(u).pathname.slice(1)), phase }); };
  const onRes = (r) => { bytes += +(r.headers()["content-length"] || 0); };
  page.on("request", onReq);
  page.on("response", onRes);
  const s0 = served;
  const t0 = Date.now();
  // (the warm pass is a new navigation, not a reload: a reload makes the browser revalidate what it has cached)
  await page.goto(BASE + pg.url + (warm ? "&warm=1" : ""), { waitUntil: "commit" });
  await page.waitForFunction(pg.ready, null, { timeout: 45000, polling: 50 });
  const tOpen = Date.now() - t0;
  let tStation = null;
  if (pg.then) {
    await sleep(600);
    phase = 1;
    const t1 = Date.now();
    await page.evaluate(pg.then);
    await sleep(250);
    await page.waitForFunction(pg.ready2, null, { timeout: 45000, polling: 50 });
    tStation = Date.now() - t1;
  }
  if (pg.stray) await page.evaluate((u) => { new Image().src = u; }, pg.stray);
  await sleep(TIME ? 400 : 1800); // what loads just after the screen is up (a prefetch) counts too
  if (pg.after) await pg.after(page, pg);
  page.off("request", onReq);
  page.off("response", onRes);
  return { reqs, tOpen, tStation, bytes, served: served - s0 };
}

const results = [];
async function checkPage(pg) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 }, serviceWorkers: "block" });
  // nothing from outside the repo (web fonts); not when timing: intercepting requests turns the browser's cache off
  if (!TIME) await ctx.route(/^https?:\/\//, (route) => (route.request().url().startsWith(BASE) ? route.fallback() : route.abort()));
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e.message || e)));
  try {
    if (TIME) {
      const cold = await visit(pg, page);
      const warm = await visit(pg, page, true);
      results.push({ pg, cold, warm, errs });
    } else {
      const r = await visit(pg, page);
      // a station page is held to its station after the title (the title's own pictures are Cook's shared ones)
      const allow = matcher(pg.allow(pg));
      const shared = matcher(pg.id.startsWith("cook") ? cookShared() : clinicAssets.shared);
      const pics = [...new Set(r.reqs.filter((q) => IMG.test(q.u) && q.u.startsWith("assets/")).map((q) => q.u))];
      const stray = pics.filter((u) => !allow(u) && !(pg.station && shared(u)));
      const okCode = pg.code ? pg.code(pg) : null;
      const codeStray = okCode ? [...new Set(r.reqs.map((q) => q.u).filter((u) => /^js\/clinic\/heal\/games\//.test(u)).map((u) => u.replace(/^.*\/|\.js$/g, "")).filter((g) => !okCode.includes(g)))] : [];
      results.push({ pg, pics, stray, codeStray, errs });
    }
  } catch (e) {
    results.push({ pg, error: e.message.split("\n")[0], errs });
  }
  await ctx.close();
}
const par = +(a.val("parallel") || (TIME ? 1 : 3));
const queue = pages.slice();
await Promise.all(Array.from({ length: Math.min(par, queue.length) }, async () => { while (queue.length) await checkPage(queue.shift()); }));
await browser.close();
srv.close();

/* ---------------- the report ---------------- */
let fail = 0;
for (const pg of pages) {
  const r = results.find((x) => x.pg.id === pg.id);
  if (!r) continue;
  if (r.error) { fail++; console.log(`FAIL ${pg.id.padEnd(20)} did not load: ${r.error}`); continue; }
  if (TIME) {
    const f = (v) => `${v.tOpen} ms${v.tStation != null ? ` + station ${v.tStation} ms` : ""}, ${v.reqs.length} requests (${v.served} from the server), ${v.reqs.filter((q) => IMG.test(q.u)).length} pictures, ${(v.bytes / 1e6).toFixed(1)} MB`;
    console.log(`time ${pg.id.padEnd(20)} cold ${f(r.cold)} | warm ${f(r.warm)}`);
    continue;
  }
  const bad = r.stray.length || r.codeStray.length;
  if (bad) fail++;
  console.log(`${bad ? "FAIL" : "ok  "} ${pg.id.padEnd(20)} ${r.pics.length} pictures${pg.games ? ` (games ${pg.games.join(", ")})` : ""}${bad ? `: ${r.stray.length} outside the manifest${r.codeStray.length ? `, other games' code: ${r.codeStray.join(", ")}` : ""}` : ""}`);
  if (bad && !a.has("discover")) r.stray.slice(0, 8).forEach((u) => { const o = owners(u); console.log(`       ${u}${o.length ? `  (belongs to ${o.join(", ")})` : "  (in no manifest)"}`); });
  if (a.has("discover") && r.stray.length) {
    const dirs = {};
    r.stray.forEach((u) => (dirs[u.replace(/[^/]*$/, "")] = (dirs[u.replace(/[^/]*$/, "")] || []).concat(u)));
    Object.entries(dirs).forEach(([d, us]) => console.log(`       ${us.length > 3 ? `${d}*  (${us.length})` : us.join("\n       ")}`));
  }
  if (r.errs.length) console.log(`       page errors: ${r.errs.slice(0, 2).join(" | ")}`);
}
if (a.val("json")) (await import("node:fs")).writeFileSync(a.val("json"), JSON.stringify(Object.fromEntries(results.map((r) => [r.pg.id, { pictures: r.pics || [], stray: r.stray || [], games: r.pg.games || null }])), null, 1));
if (!TIME) console.log(`\n${pages.length - fail}/${pages.length} pages load only what's on their screen${fail ? `; ${fail} FAIL` : ""}${a.has("stray") ? " (--stray: the chai station asked for samosa's board on purpose)" : ""}`);
process.exit(fail ? 1 : 0);
