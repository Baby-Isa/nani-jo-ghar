import { startServer, launch, newPage, BASE } from "../lib/env.mjs";
const [OUT, SIZE, LV] = process.argv.slice(2);
const srv = await startServer(); const b = await launch();
const { page: p } = await newPage(b, SIZE); p.setDefaultTimeout(60000);
await p.goto(`${BASE}/cook.html?speed=1`, { waitUntil: "load" }); await p.evaluate(() => localStorage.clear());
await p.goto(`${BASE}/cook.html?speed=1`, { waitUntil: "load" }); await p.waitForSelector("#panel .title-wrap");
await p.evaluate((l) => { njgTest.cook.lab("chai-tray", true, { level: +l }); }, LV);
await p.waitForFunction(() => /khape,/.test((document.querySelector(".cv-bubble") || {}).textContent || ""), null, { timeout: 60000 });
for (let i = 0; i < 20; i++) { await p.screenshot({ path: `${OUT}/${SIZE}-${String(i).padStart(2, "0")}.png` }); await p.waitForTimeout(150); }
await b.close(); srv.close();
