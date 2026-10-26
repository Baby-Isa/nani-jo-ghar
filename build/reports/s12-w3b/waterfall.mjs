// s12-w3b (CK-48): what loads before the left bar shows: the page's resources in order, with start and end (ms).
// COOK_TEST_PORT=8856 node build/reports/s12-w3b/waterfall.mjs <url>
import { BASE, startServer, launch, newPage } from "../../sandbox/lib/env.mjs";
const srv = await startServer();
const browser = await launch();
try {
  const { page } = await newPage(browser, "1366x768");
  await page.route("**/*", async (route) => {
    await new Promise((x) => setTimeout(x, 40));
    route.continue();
  });
  await page.addInitScript(() => {
    window.__lt = {};
    const tick = () => {
      const s = document.querySelector(".njg-side");
      if (!window.__lt.side && s && s.offsetWidth > 0) window.__lt.side = performance.now();
      if (!window.__lt.side) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await page.goto(`${BASE}/${process.argv[2]}`, { waitUntil: "load" });
  await page.waitForFunction(() => window.__lt.side, null, { timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));
  const r = await page.evaluate(() => ({
    side: Math.round(window.__lt.side),
    dcl: Math.round(performance.getEntriesByType("navigation")[0].domContentLoadedEventEnd),
    res: performance.getEntriesByType("resource").map((e) => [Math.round(e.startTime), Math.round(e.responseEnd), e.initiatorType, e.name.replace(location.origin, "").replace(/\?.*/, "")]),
  }));
  console.log("left bar", r.side, "DOMContentLoaded", r.dcl, "resources", r.res.length);
  r.res.sort((a, b) => a[0] - b[0]).forEach((x) => console.log(x.join(" ")));
} finally {
  await browser.close();
  srv.close();
}
