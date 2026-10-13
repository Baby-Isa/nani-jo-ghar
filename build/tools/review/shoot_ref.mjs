// Shoot a lab page as a reference picture for an evidence sheet (`ref:` captures need an image; S05-C3: CHAI-08's
// reference was the v2 mock-up's HTML, so no judge could see "about 15% bigger").
//   COOK_TEST_PORT=8893 node build/tools/review/shoot_ref.mjs lab/chai-v2-mockup.html build/sandbox/data/refs/chai-v2-mockup.png [1366x768]
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { ROOT, BASE, startServer, launch } from "../../sandbox/lib/env.mjs";

const [page0, out, size = "1366x768"] = process.argv.slice(2);
if (!page0 || !out) { console.error("usage: shoot_ref.mjs <page> <out.png> [WxH]"); process.exit(2); }
const [width, height] = size.split("x").map(Number);
const srv = await startServer();
const browser = await launch();
try {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`${BASE}/${page0}`, { waitUntil: "load" });
  await page.waitForTimeout(1000);
  mkdirSync(dirname(join(ROOT, out)), { recursive: true });
  await page.screenshot({ path: join(ROOT, out) });
  console.log(`wrote ${out}`);
} finally { await browser.close(); srv.close(); }
