// s12-w3b (CK-48): time to the left bar (and the game's first drawn screen) on chai and the eye test, and every data file
// fetched more than once. COOK_TEST_PORT=8856 node build/reports/s12-w3b/loadtime.mjs [runs]
import { BASE, startServer, launch, newPage } from "../../sandbox/lib/env.mjs";
const runs = +(process.argv[2] || 3);
const PAGES = {
  chai: "cook.html?app=1&first=chai&quiet=1",
  eye: "clinic.html?stage=heal&game=eye&level=1&seed=1&quiet=1&nonav=1&onboard=0",
};
const srv = await startServer();
const browser = await launch();
try {
  for (const [name, url] of Object.entries(PAGES)) {
    const times = [];
    let dups = {};
    for (let r = 0; r < runs; r++) {
      const { page } = await newPage(browser, "1366x768");
      // a slow phone's network (each request 40 ms more), so the order of loads shows
      await page.route("**/*", async (route) => {
        await new Promise((x) => setTimeout(x, 40));
        route.continue();
      });
      const seen = {};
      page.on("request", (q) => {
        const u = q.url().replace(BASE, "").replace(/\?.*$/, "");
        if (/\.json$/.test(u)) seen[u] = (seen[u] || 0) + 1;
      });
      await page.addInitScript(() => {
        const t = { side: 0, canvas: 0 };
        window.__lt = t;
        const tick = () => {
          const s = document.querySelector(".njg-side");
          if (!t.side && s && s.offsetWidth > 0 && getComputedStyle(s).visibility !== "hidden" && (s.querySelector("img,svg,button") || s.textContent.trim())) t.side = performance.now();
          const c = document.querySelector("canvas");
          if (!t.canvas && ((c && c.offsetWidth > 0) || (window.__clinic && window.__clinic.ready))) t.canvas = performance.now();
          if (!t.side || !t.canvas) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      await page.goto(`${BASE}/${url}`, { waitUntil: "load" });
      await page.waitForFunction(() => window.__lt.side && window.__lt.canvas, null, { timeout: 30000 }).catch(() => {});
      times.push(await page.evaluate(() => window.__lt));
      dups = Object.fromEntries(Object.entries(seen).filter(([, n]) => n > 1));
      await page.context().close();
    }
    const med = (k) => times.map((t) => Math.round(t[k])).sort((a, b) => a - b)[Math.floor(times.length / 2)];
    console.log(JSON.stringify({ page: name, leftBarMs: med("side"), canvasMs: med("canvas"), all: times.map((t) => [Math.round(t.side), Math.round(t.canvas)]), twice: dups }));
  }
} finally {
  await browser.close();
  srv.close();
}
