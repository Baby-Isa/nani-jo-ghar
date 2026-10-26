// s12-w3b: a page's console errors and its ready flags. COOK_TEST_PORT=8856 node build/reports/s12-w3b/errs.mjs <url>
import { BASE, startServer, launch, newPage, sleep } from "../../sandbox/lib/env.mjs";
const srv = await startServer();
const browser = await launch();
try {
  const { page } = await newPage(browser, "1366x768");
  page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && console.log("console", m.type(), m.text().slice(0, 300)));
  page.on("pageerror", (e) => console.log("pageerror", String(e).slice(0, 300)));
  await page.goto(`${BASE}/${process.argv[2]}`, { waitUntil: "load" });
  await sleep(6000);
  console.log(await page.evaluate(() => ({ clinic: !!(window.__clinic && window.__clinic.ready), side: [...document.querySelectorAll(".njg-side")].map((s) => s.offsetWidth + ":" + getComputedStyle(s).visibility) })));
} finally {
  await browser.close();
  srv.close();
}
