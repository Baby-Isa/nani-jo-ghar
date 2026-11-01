#!/usr/bin/env node
// The photo shoot prototype's screenshots (js/farm/photo.js; build/reports/proto-photo-2026-11-01.md): each level at the four sizes,
// at the head turn, the camera up with the asks said, a photo just taken (its card ticked), and the end's table. A child's moves
// through the game's own test hook (njgTest.controller().test: aim, shoot), so the shots are the game as played.
//   node build/tools/review/shoot_photo.mjs [--levels 1,2,3,4] [--sizes 740x320,930x430,1280x665,1920x1080] [--out dir]
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, PORT, SIZES, startServer, launch, newPage } from "../../sandbox/lib/env.mjs";
import { SPILLS } from "./lib/cardmeasure.mjs";

const argv = process.argv.slice(2);
const val = (f, d) => { const i = argv.indexOf(f); return i >= 0 ? argv.splice(i, 2)[1] : d; };
const levels = val("--levels", "1,2,3,4").split(",").map(Number);
const sizes = val("--sizes", "740x320,930x430,1280x665,1920x1080").split(",");
const out = val("--out", join(ROOT, "build", "screenshots", "proto-photo"));
mkdirSync(out, { recursive: true });

const srv = await startServer();
const browser = await launch();
const lines = [];
let bad = 0;
const T = (p, js) => p.evaluate(js).catch((e) => `ERR ${String(e.message || e).split("\n")[0]}`);
const until = async (p, js, ms = 30000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await T(p, js) === true) return true; await p.waitForTimeout(150); } return false; };
for (const lv of levels) {
  for (const size of sizes) {
    const np = await newPage(browser, size);
    const { page: p, errors } = np;
    const shot = async (name) => {
      const sp = await p.evaluate(SPILLS).catch((e) => [String(e)]);
      const f = join(out, `L${lv}-${size}-${name}.png`);
      await p.screenshot({ path: f });
      lines.push(`- L${lv} ${size} ${name}: ${sp.length ? "SPILLS " + sp.join("; ") : "nothing spills"}`);
      if (sp.length) bad++;
    };
    await p.goto(`http://127.0.0.1:${PORT}/lab.html?mode=farm&game=photo&level=${lv}&nonav=1&seed=${lv * 7}&quiet=1`, { waitUntil: "load" });
    await until(p, `!!(window.njgTest && njgTest.state && /farm\\/photo\\/intro/.test(njgTest.state()))`, 20000);
    await p.waitForTimeout(300);
    await shot("0-whole");
    await p.waitForTimeout(3600);
    await shot("1-head-turn");
    await until(p, `/asking/.test(njgTest.state())`, 20000);
    await p.waitForTimeout(900);
    await shot("2-ask");
    await until(p, `/playing/.test(njgTest.state())`, 40000);
    await p.waitForTimeout(900);
    await shot("2-camera");
    const first = await T(p, `njgTest.controller().test.aim(njgTest.controller().test.asks()[0].ask)`);
    await p.waitForTimeout(1500);
    await shot("3-aimed");
    await T(p, `njgTest.controller().test.shoot()`);
    await p.waitForTimeout(450);
    await shot("4-shot");
    // the rest of the asks, as a child who finds each one
    for (let i = 0; i < 8; i++) {
      const left = await T(p, `njgTest.controller().test.asks().filter((a) => !a.done).map((a) => a.ask)`);
      if (!Array.isArray(left) || !left.length) break;
      await T(p, `njgTest.controller().test.aim(${JSON.stringify(left[0])})`);
      await p.waitForTimeout(500);
      await T(p, `njgTest.controller().test.shoot()`);
      await p.waitForTimeout(700);
    }
    await until(p, `/end/.test(njgTest.state())`, 10000);
    await until(p, `!!document.querySelector(".fp-camera.fp-away")`, 60000);
    await p.waitForTimeout(400);
    await shot("5-table");
    await until(p, `!!document.querySelector(".njg-results")`, 20000);
    await p.waitForTimeout(1200);
    await shot("6-results");
    lines.push(`  L${lv} ${size}: first ask ${first}; asks ${JSON.stringify(await T(p, `0`))}; ${errors.length ? "ERRORS " + errors.join(" | ") : "no errors"}`);
    if (errors.length) bad++;
    await np.ctx.close();
  }
}
writeFileSync(join(out, "report.md"), `# Photo shoot shots (${new Date().toISOString().slice(0, 16)})\n\n${lines.join("\n")}\n`);
console.log(lines.join("\n"));
await browser.close();
srv.close();
process.exit(bad ? 1 : 0);
