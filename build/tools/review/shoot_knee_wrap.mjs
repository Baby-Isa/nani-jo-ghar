// CLN-100 proof: plays the knee heal game's wrap at a level with the game's own debug driver and shoots after each
// bandage turn.  COOK_TEST_PORT=8849 flock -w 900 /tmp/njg-browser.lock timeout 300 node build/tools/review/shoot_knee_wrap.mjs <outdir> [level] [size]
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { BASE, startServer, launch, newPage } from "../../sandbox/lib/env.mjs";
const out = process.argv[2] || "build/screenshots/knee-wrap";
const level = +(process.argv[3] || 3);
const size = process.argv[4] || "1366x768";
mkdirSync(out, { recursive: true });
const srv = await startServer();
const browser = await launch();
try {
  const { page } = await newPage(browser, size);
  await page.addInitScript(() => { try { localStorage.setItem("njg-test", "1"); } catch (e) {} });
  await page.goto(`${BASE}/clinic.html?stage=heal&game=knee&level=${level}&speed=3`, { waitUntil: "load" });
  await page.evaluate(() => { if (window.UIStore) UIStore.set("onboarded", "clinic/heal-knee", true); });
  const ev = (f, a) => page.evaluate(f, a);
  await page.waitForFunction(() => window.__clinic && window.__clinic.Stages && window.__clinic.Stages.heal.current && window.__clinic.Stages.heal.current.controller, null, { timeout: 30000 });
  const m = page.mouse;
  let turns = 0, n = 0;
  const t0 = Date.now();
  while (Date.now() - t0 < 120000) {
    const a = await ev(() => { const r = window.__clinic.Stages.heal.current; return r && r.controller.debug ? r.controller.debug.next() : null; });
    if (!a) break;
    if (a.do === "tap") { await m.move(a.x, a.y); await m.down(); await m.up(); await page.waitForTimeout(250); }
    else if (a.do === "button") { const v = page.locator(".cl-go:not(.hidden)"); if (await v.count()) await v.last().click().catch(() => {}); await page.waitForTimeout(400); }
    else if (a.do === "drag") { await m.move(a.pts[0][0], a.pts[0][1]); await m.down(); for (const [x, y] of a.pts.slice(1)) await m.move(x, y, { steps: 3 }); await m.up(); await page.waitForTimeout(200); }
    else await page.waitForTimeout(250);
    const t = await ev(() => document.querySelectorAll(".knee-turn").length + document.querySelectorAll(".knee-wrap-behind path").length);
    if (t > turns) { turns = t; await page.screenshot({ path: join(out, `L${level}-turn${String(++n).padStart(2, "0")}.png`) }); }
    if (await ev(() => !!window.__clinic.last)) break;
  }
  console.log(`turns drawn: ${turns}, shots in ${out}`);
} finally { await browser.close(); srv.close(); }
