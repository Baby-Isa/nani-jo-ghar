// s08 w3A (SAM-21): films samosa's coded fold in the real game. Plays the Station lab's samosa fair (the sandbox's Cook
// player); at every swipe it drags in steps and shoots the strip: lit with its arrow, a third, two thirds, then let go. A
// second, x2 page shoots the flap close. One sheet per size: <out>/fold-<size>.jpg (and fold-<size>-x2.jpg).
//   COOK_TEST_PORT=8839 flock -w 1800 /tmp/njg-browser.lock timeout 600 node build/reports/s08-w3a-samosa/filmstrip.mjs <out> <level> <size>[,<size>] [x2]
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { startServer, launch, newPage, sleep } from "../../sandbox/lib/env.mjs";
import { openCook } from "../../sandbox/flows/cook.mjs";
import { CookPlayer } from "../../sandbox/lib/cook-player.mjs";

const [out = "/tmp/fold", level = "1", sizes = "1366x768", x2 = ""] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const srv = await startServer();
const browser = await launch();
const rec = { state: async () => {}, note: () => {}, pend: () => {} };

async function film(size, dpr) {
  const { page, ctx } = await newPage(browser, size, { dpr });
  const frames = [];
  await openCook({ page, rec }, { speed: 3 });
  await page.evaluate(() => window.__cook.coachesSeen && window.__cook.coachesSeen());
  const P = new CookPlayer(page, rec, { mode: "fair", speed: 3 });
  const vw = page.viewportSize().width, vh = page.viewportSize().height;
  let fold = 0;
  const shot = async (label, e) => {
    const cx = (e.sx1 + e.sx2) / 2, cy = (e.sy1 + e.sy2) / 2;
    const w = dpr > 1 ? vw * 0.3 : vw * 0.52, h = dpr > 1 ? vh * 0.36 : vh * 0.5;
    const clip = { x: Math.max(0, Math.min(vw - w, cx - w / 2)), y: Math.max(0, Math.min(vh - h, cy - h / 2)), width: w, height: h };
    frames.push({ label, png: (await page.screenshot({ clip })).toString("base64") });
  };
  const act = P.act.bind(P);
  P.act = async (e) => {
    if (e.kind !== "swipe") return act(e);
    fold++;
    await sleep(500);
    await shot(`swipe ${fold}: lit, the arrow`, e);
    await page.mouse.move(e.sx1, e.sy1);
    await page.mouse.down();
    const steps = 12;
    for (let s = 1; s <= steps; s++) {
      await page.mouse.move(e.sx1 + ((e.sx2 - e.sx1) * s) / steps, e.sy1 + ((e.sy2 - e.sy1) * s) / steps);
      await sleep(12);
      if (s === 4 || s === 8 || s === 11) {
        await sleep(60);
        await shot(`swipe ${fold}: ${Math.round((100 * s) / steps)}%`, e);
      }
    }
    await page.mouse.up();
    await sleep(110);
    await shot(`swipe ${fold}: let go`, e);
    // (the last swipe: the end tucks under by itself, then the finished samosa, before it goes to the plate)
    const nx = await page.evaluate("__cook.expectation()").catch(() => null);
    if (!nx || nx.kind !== "swipe") {
      await sleep(150);
      await shot(`swipe ${fold}: the end tucks under`, e);
      await sleep(150);
      await shot(`samosa made`, e);
    }
  };
  await page.evaluate(([l]) => { window.__cook.lab("samosa", false, { level: l }); }, [+level]);
  await page.waitForFunction("document.querySelector('#overlay').classList.contains('hidden')", null, { timeout: 15000 });
  await P.play(async () => (await page.evaluate("(() => { const e = __cook.expectation(); return !!e && e.key === 'knob'; })()").catch(() => false)) || fold >= 16, { timeout: 150000 });
  await ctx.close();
  return frames;
}

for (const size of sizes.split(",")) {
  for (const dpr of x2 ? [1, 2] : [1]) {
    const frames = await film(size, dpr);
    const page = (await newPage(browser, "1440x900")).page;
    const cols = 4;
    await page.setViewportSize({ width: 1800, height: 900 });
    await page.setContent(`<body style="margin:0;padding:8px;background:#f4ecdf;font:600 15px sans-serif;color:#2a2522"><h3 style="margin:4px 0 8px">samosa L${level} fold at ${size}${dpr > 1 ? " (x2 zoom on the flap)" : ""}: ${frames.length} frames</h3><div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:8px">${frames.map((f) => `<div><div>${f.label}</div><img src="data:image/png;base64,${f.png}" style="width:100%;border-radius:6px"></div>`).join("")}</div></body>`);
    await sleep(300);
    const file = join(out, `fold-${size}${dpr > 1 ? "-x2" : ""}.jpg`);
    await page.screenshot({ path: file, fullPage: true, type: "jpeg", quality: 82 });
    console.log(file, frames.length, "frames");
  }
}
await browser.close();
srv.close();
