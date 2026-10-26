#!/usr/bin/env node
// CK-48 (with SH-37): the slow-load check. A station entered on a slow connection must show nothing half-built: from the
// first frame its view is on screen (the camera's fade-in starts), no picture of the station is still loading, nothing
// draws as Phaser's missing texture, and the view is not rebuilt under the child (the background or the camera's zoom
// changing after it showed). It plays Cook's Station lab with the network throttled (Chrome's own emulation, after the
// title has loaded at full speed: a child on a slow phone who opens a station for the first time), taps through the
// order card after 1 s, films the station's first seconds (a frame about every 100 ms) and measures each frame.
//
//   COOK_TEST_PORT=8879 flock -w 1800 /tmp/njg-browser-8879.lock timeout 600 node build/sandbox/slowload.mjs [--stations chop,samosa] [--kbps 1600] [--latency 150] [--size 1366x768] [--out dir]
//
// Exit 1 when any station breaks the rule (each break printed with its frame); the strip of frames is <out>/<station>.png.
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { startServer, launch, newPage, BASE, sleep, ROOT } from "./lib/env.mjs";

const argv = process.argv.slice(2);
const val = (k, d) => { const i = argv.indexOf(k); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const STATIONS = val("--stations", "chop,samosa").split(",").filter(Boolean);
const KBPS = +val("--kbps", "1600");
const LATENCY = +val("--latency", "150");
const SIZE = val("--size", "1366x768");
const FILM_MS = +val("--film-ms", "5000");
const WAIT_MS = +val("--wait-ms", "45000"); // how long the station may take to come up on the slow line
const OUT = val("--out", join(ROOT, "build", "screenshots", "slowload", new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)));
mkdirSync(OUT, { recursive: true });

// what the page says about itself at a frame: the view, the camera's fade, the background, the zoom, missing textures
const PROBE = `(() => {
  const C = window.Cook, s = C && C.scene;
  if (!s || !s.cameras) return null;
  const cam = s.cameras.main, fx = cam.fadeEffect;
  const list = s.children.list;
  const missing = list.filter((o) => o.visible && o.texture && o.texture.key === "__MISSING").map((o) => o.type);
  return { view: s.viewName || null, bg: s.bg && s.bg.texture ? s.bg.texture.key : null, zoom: +cam.zoom.toFixed(3), scroll: [Math.round(cam.scrollX), Math.round(cam.scrollY)],
    fading: !!(fx && fx.isRunning), fadeAlpha: fx ? +fx.alpha.toFixed(2) : 0, fadeDir: fx ? (fx.direction ? "in" : "out") : null,
    objects: list.filter((o) => o.visible).length, missing, inStation: !!C.inStation, overlay: !document.querySelector("#overlay").classList.contains("hidden"),
    loading: !!(s.load && s.load.isLoading && s.load.isLoading()) };
})()`;

const srv = await startServer();
const browser = await launch();
let breaks = 0;
const report = [];
for (const st of STATIONS) {
  const { page, ctx } = await newPage(browser, SIZE, { seed: 1 });
  const inflight = new Map(); // url -> started (ms since the lab call)
  let T0 = 0;
  const now = () => Date.now() - T0;
  const late = []; // image requests that finished after the view showed
  // the station's pictures are Phaser's (fetched by XHR); the sidebar's DOM pictures (Nani's face) are not the stage's
  page.on("request", (r) => { if (["xhr", "fetch"].includes(r.resourceType()) && /\.(webp|png|jpg)(\?|$)/.test(r.url())) inflight.set(r.url(), now()); });
  const done = (r) => inflight.delete(r.url());
  page.on("requestfinished", done);
  page.on("requestfailed", done);
  await page.goto(`${BASE}/cook.html?speed=1`, { waitUntil: "load" });
  await page.evaluate(() => localStorage.clear());
  await page.goto(`${BASE}/cook.html?speed=1`, { waitUntil: "load" });
  await page.waitForSelector("#panel .title-wrap", { timeout: 20000 });
  await page.evaluate(() => window.njgTest?.cook.coachesSeen && window.njgTest?.cook.coachesSeen());
  await sleep(1500);
  // the slow connection from here (the title is in; the station's own pictures are not)
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: LATENCY, downloadThroughput: (KBPS * 1024) / 8, uploadThroughput: (KBPS * 1024) / 8 });
  T0 = Date.now();
  await page.evaluate((k) => { window.njgTest?.cook.lab(k, true, { level: 1 }); }, st); // (not awaited: the lab round runs on)
  const frames = [];
  let tapped = false;
  let shownAt = null; // the first frame the station's view is on screen
  const first = {};
  const fails = [];
  const dir = join(OUT, st);
  mkdirSync(dir, { recursive: true });
  for (let i = 0; now() < (shownAt == null ? WAIT_MS : shownAt + FILM_MS); i++) {
    if (shownAt == null && i > 12) await sleep(400); // (waiting: fewer frames)
    if (!tapped && now() > 1000) { tapped = true; await page.mouse.click(300, 300).catch(() => {}); }
    const p = await page.evaluate(PROBE).catch(() => null);
    const t = now();
    const open = [...inflight.entries()].map(([u]) => u.replace(BASE + "/", "").replace(/\?.*$/, ""));
    // the view is up from the first frame its picture shows (the camera's fade-in begun: the fade's cover under 1)
    if (p && shownAt == null && p.view && p.view !== "service" && p.fadeAlpha < 0.99 && !p.overlay) shownAt = t;
    const buf = await page.screenshot({ type: "jpeg", quality: 45 }).catch(() => null);
    const file = buf ? `data:image/jpeg;base64,${buf.toString("base64")}` : "";
    frames.push({ t, file, p, open });
    if (shownAt != null && p) {
      // the rule, from the first frame the view is up
      if (first.bg == null) Object.assign(first, { bg: p.bg, zoom: p.zoom, scroll: p.scroll.join(","), view: p.view });
      const why = [];
      const stationArt = open.filter((u) => u.startsWith("assets/"));
      if (stationArt.length) why.push(`still loading ${stationArt.length}: ${stationArt.slice(0, 3).join(", ")}`);
      if (p.missing.length) why.push(`missing texture on ${p.missing.length} object(s)`);
      if (p.view === first.view && p.bg !== first.bg) why.push(`background changed ${first.bg} -> ${p.bg}`);
      if (p.view === first.view && (p.zoom !== first.zoom || p.scroll.join(",") !== first.scroll)) why.push(`camera changed zoom ${first.zoom} -> ${p.zoom}, scroll ${first.scroll} -> ${p.scroll.join(",")}`);
      if (why.length) fails.push({ t, i, why });
    }
    await sleep(60);
  }
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 }).catch(() => {});
  await ctx.close();
  // the strip: up to 16 frames from the lab call on, time-labelled (the first second, then every ~300 ms)
  // the frames from just before the view came up: the first second at every frame, then spread out
  const from = Math.max(0, frames.findIndex((f) => shownAt != null && f.t >= shownAt) - 2);
  const rest = frames.slice(from);
  const pick = rest.slice(0, 10).concat(rest.slice(10).filter((f, k) => k % Math.max(1, Math.ceil((rest.length - 10) / 6)) === 0)).slice(0, 16);
  const sheet = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const cell = (f) => `<figure><img src="${f.file}"><figcaption>${(f.t / 1000).toFixed(2)} s${f.p ? ` · ${f.p.view || "-"}${f.p.fading ? ` fade-${f.p.fadeDir} ${f.p.fadeAlpha}` : ""} · ${f.p.objects} obj · ${f.open.length} loading` : ""}${shownAt != null && f.t >= shownAt ? " · VIEW UP" : ""}</figcaption></figure>`;
  await sheet.setContent(`<style>body{margin:8px;font:13px sans-serif;background:#f3ece0}h1{font-size:16px;margin:4px 0}.g{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}figure{margin:0}img{width:100%;display:block;border:1px solid #9a8}figcaption{padding:2px 0}</style><h1>CK-48 slow load: ${st} at ${SIZE}, ${KBPS} kbit/s, ${LATENCY} ms (the order card tapped through at 1 s; view up at ${shownAt == null ? "never" : (shownAt / 1000).toFixed(2) + " s"}) · ${fails.length ? `${fails.length} frames break` : "nothing half-built"}</h1><div class="g">${pick.map(cell).join("")}</div>`, { waitUntil: "load" });
  await sheet.screenshot({ path: join(OUT, `${st}.png`), fullPage: true });
  await sheet.close();
  rmSync(dir, { recursive: true, force: true });
  const line = shownAt == null ? `${st}: the station's view never came up in ${WAIT_MS / 1000} s` : fails.length ? `${st}: BREAK, ${fails.length} of ${frames.filter((f) => f.t >= shownAt).length} frames after the view came up at ${(shownAt / 1000).toFixed(2)} s; first at ${(fails[0].t / 1000).toFixed(2)} s: ${fails[0].why.join("; ")}` : `${st}: ok, view up at ${(shownAt / 1000).toFixed(2)} s, nothing loading or rebuilt after it (${frames.length} frames)`;
  if (shownAt == null || fails.length) breaks++;
  report.push({ station: st, shownAt, fails: fails.slice(0, 20), frames: frames.length, sheet: join(OUT, `${st}.png`) });
  console.log(line);
}
writeFileSync(join(OUT, "slowload.json"), JSON.stringify({ kbps: KBPS, latency: LATENCY, size: SIZE, report }, null, 1));
console.log(`sheets: ${OUT}`);
await browser.close();
srv.close();
process.exit(breaks ? 1 : 0);
