#!/usr/bin/env node
// The ES-module pilot in a real browser (decision 18): a scratch page (never committed, never published) with the
// import map build/bump_version.py writes, loading the core as modules by name ("#core/save.js"). It checks that
// every core module loads, that every module request carries the ?v= stamp (the core's own relative imports
// included), and that the core save, wallet and Lang adapter run in the page. Chromium only: the family's oldest
// iPad (import maps need iOS 16.4+) is a check for a person. One browser at a time:
//   COOK_TEST_PORT=8813 flock -w 1800 /tmp/njg-browser.lock timeout 600 node build/core/module-pilot.mjs
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { ROOT, BASE, startServer, launch, newPage } from "../sandbox/lib/env.mjs";

const STAMP = "PILOT" + Date.now();
const dir = mkdtempSync(join(tmpdir(), "njg-pilot-"));
const map = execFileSync("python3", ["-c", `import sys; sys.path.insert(0, ${JSON.stringify(join(ROOT, "build"))}); import bump_version as b; print(b.import_map("lab/pilot.html", ${JSON.stringify(STAMP)}))`]).toString();
writeFileSync(
  join(dir, "pilot.html"),
  `<!doctype html><meta charset="utf-8"><title>module pilot</title>
<script type="importmap" data-njg="core">
${map}
</script>
<script type="module">
  import { Save } from "#core/save.js";
  import { createWallet } from "#core/wallet.js";
  import { createProgress } from "#core/progress.js";
  import { createScore } from "#core/score.js";
  import { createSettings } from "#core/settings.js";
  import { createUnlocks } from "#core/unlocks.js";
  import { createVoice, clipIndex } from "#core/voice.js";
  import { createLang } from "#core/lang/index.js";
  import { fromQuery } from "#core/context.js";
  import { loadJSON } from "#core/env.js";
  const economy = await loadJSON("data/economy.json", { base: "../" });
  Save.ensurePlayer();
  const wallet = createWallet({ save: Save, economy });
  const score = createScore({ save: Save, wallet, progress: createProgress({ save: Save }) });
  const out = score.finish({ mode: "pilot", game: "x", level: 1, timeMs: 1000, right: 2, total: 2, hints: 0, rows: [{ word: "cook-chai", ok: true }] });
  window.pilot = { ok: true, coins: wallet.coins(), pay: out.pay.coins, schema: Save.init().schema, globalSave: window.Save === Save,
    settings: createSettings({ save: Save }).all(), beach: createUnlocks({ save: Save, rules: await loadJSON("data/unlocks.json", { base: "../" }) }).why("beach"),
    ctx: fromQuery("?play=story&arc=birthday&chapter=1"), lang: typeof createLang({ cook: null }).say, voice: typeof createVoice({ index: clipIndex([]) }).say };
</script>`
);
const server = await startServer({ "/__pilot/": dir });
const browser = await launch();
let bad = 0;
try {
  const { ctx, page, errors } = await newPage(browser, "1366x768");
  const reqs = [];
  page.on("request", (r) => r.url().includes("/js/core/") && reqs.push(r.url()));
  await page.goto(`${BASE}/__pilot/pilot.html`, { waitUntil: "load" });
  await page.waitForFunction(() => window.pilot, null, { timeout: 15000 }).catch(() => {});
  const res = await page.evaluate(() => window.pilot || null);
  const unstamped = reqs.filter((u) => !u.includes(`v=${STAMP}`));
  const want = execFileSync("bash", ["-c", `cd ${ROOT} && ls js/core/*.js js/core/lang/*.js | grep -v -e 'js/core/package' | wc -l`]).toString().trim();
  console.log(JSON.stringify({ result: res, moduleRequests: reqs.length, coreFiles: +want, unstamped, errors: [...new Set(errors)] }, null, 1));
  if (!res || !res.ok) bad++;
  if (unstamped.length) bad++;
  if (errors.length) bad++;
  await ctx.close();
} finally {
  await browser.close();
  server.close();
  rmSync(dir, { recursive: true, force: true });
}
console.log(bad ? "PILOT FAILED" : "PILOT PASSED: every core module loaded by name through the import map, every request stamped");
process.exit(bad ? 1 : 0);
