// S04-C proof shots: every served dish on its tray (js/cook/flow.js test hook __cook.served) and Nani in each
// Cook service mood, on cook.html. Writes build/screenshots/s04c/<size>/*.png (not committed, B19).
//   COOK_TEST_PORT=8843 flock -w 1800 /tmp/njg-browser.lock timeout 600 node build/tools/art/shoot_served.mjs [844x390,1366x768]
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { ROOT, BASE, startServer, launch, newPage } from "../../sandbox/lib/env.mjs";

const sizes = (process.argv[2] || "1366x768,844x390").split(",");
const DISHES = ["chai", "maani", "daal", "chaat", "samosa", "pantry", "mishkaki"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const srv = await startServer();
const browser = await launch();
try {
  for (const size of sizes) {
    const out = join(ROOT, "build", "screenshots", "s04c", size);
    mkdirSync(out, { recursive: true });
    const { page, ctx } = await newPage(browser, size);
    await page.goto(`${BASE}/cook.html?speed=3`, { waitUntil: "load" });
    await page.waitForFunction(() => window.__cook && window.Cook && Cook.scene, null, { timeout: 20000 });
    await sleep(1500);
    for (const d of DISHES) {
      const served = d === "chai" ? [{ recipe: "chai", count: 1, cups: [{ who: "nana" }] }] : [{ recipe: d, count: 2 }];
      await page.evaluate((s) => __cook.served({ who: "nana", served: s }), served);
      await sleep(900);
      await page.screenshot({ path: join(out, `served-${d}.png`) });
    }
    await page.evaluate(() => __cook.served({ who: "nana", served: [{ recipe: "chai", cups: [{ who: "nani" }, { who: "nana", dudh: false }, { who: "ma" }] }] }));
    await sleep(900);
    await page.screenshot({ path: join(out, "served-chai-tray-3.png") });
    for (const m of ["neutral", "happy", "talk", "point"]) {
      await page.evaluate(async (m) => { await __cook.served({ who: "ma", served: [] }); Cook.scene.tweens.killAll(); Cook.scene.setMood("nani", m); }, m);
      await sleep(500);
      await page.screenshot({ path: join(out, `nani-${m}.png`) });
    }
    await ctx.close();
  }
} finally {
  await browser.close();
  srv.close();
}
console.log("shots in build/screenshots/s04c/");
