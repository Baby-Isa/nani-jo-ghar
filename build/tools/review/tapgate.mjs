import { pathToFileURL } from "node:url";
// SH-198: the lab page with a phone's rule (no tap yet: navigator.webdriver off): the play button shows, and one tap starts the game.
//   node build/tools/review/tapgate.mjs [out-dir]
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../../..", import.meta.url)).replace(/\/$/, ""), out = process.argv[2] || "/tmp";
const { PORT, startServer, launch } = await import(pathToFileURL(`${root}/build/sandbox/lib/env.mjs`).href);
const srv = await startServer();
const b = await launch();
let fails = 0;
for (const [w, h] of [[740, 320], [1920, 1080]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.addInitScript(() => Object.defineProperty(Navigator.prototype, "webdriver", { get: () => false }));
  await p.goto(`http://127.0.0.1:${PORT}/lab.html?mode=cook&game=chai-tray&level=4&nonav=1`, { waitUntil: "load" });
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${out}/gate-${w}.png` });
  const before = await p.evaluate(() => !!document.querySelector(".njg-start"));
  await p.click(".njg-start-btn");
  await p.waitForTimeout(6000);
  await p.screenshot({ path: `${out}/after-${w}.png` });
  const after = await p.evaluate(() => ({ gate: !!document.querySelector(".njg-start"), cards: document.querySelectorAll("#mission .oc-card, .njg-rq-card").length }));
  const ok = before && !after.gate && after.cards > 0;
  if (!ok) fails++;
  console.log(`${ok ? "pass" : "FAIL"} SH-198 ${w}x${h}: the play button ${before ? "shown" : "MISSING"}; after the tap ${after.cards} order cards`);
  await p.close();
}
await b.close(); srv && srv.close && srv.close();
process.exit(fails ? 1 : 0);
