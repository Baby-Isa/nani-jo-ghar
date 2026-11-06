// CHAI-92 (the juice wired into chai, 6 Nov): plays chai with the sandbox's fair player and shoots each effect at its moment, frozen
// (Phaser's tweens and timers at time scale 0) so a still shows it; the same play with the game's
// files of an earlier commit (--before <dir>: every changed file served from that folder) gives the BEFORE of each pair. It also
// saves the play's sound log (the sandbox's sound hook: every voice clip and every effect, with their times) for the voice gate's proof.
//   COOK_TEST_PORT=8870 node build/tools/juice/shoot_juice.mjs <outdir> <size> <lab|order> [level] [--before <dir>] [--less]
//     lab   njgTest.cook.lab("chai-tray"): A the steam over the boiling pan, B the tray glass's last drop and twinkles (a strip),
//           C the word moment's last drop and crown (level 4: the moment comes before its first half-and-full order), D the end
//           screen's stopwatch
//     order njgTest.cook.order({dish: "chai"}): E the serve's stamp
//     --less  the system's reduced motion (each effect fades in place)
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { BASE, startServer, launch, newPage, sleep } from "../../sandbox/lib/env.mjs";
import { CookPlayer } from "../../sandbox/lib/cook-player.mjs";
import { Recorder } from "../../sandbox/lib/recorder.mjs";

const argv = process.argv.slice(2);
const flag = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv.splice(i, 2)[1] : null; };
const before = flag("--before");
const less = argv.includes("--less") ? (argv.splice(argv.indexOf("--less"), 1), true) : false;
const [out = "build/screenshots/juice", size = "1280x665", what = "lab", lv = "1"] = argv;
const level = +lv;
const tag = `${before ? "before" : "after"}-${what}-L${level}${less ? "-less" : ""}-${size}`;
mkdirSync(out, { recursive: true });
const log = (m) => process.env.DBG && console.log(new Date().toISOString().slice(11, 19), m);
const srv = await startServer();
log("server");
const browser = await launch();
log("browser");
const shots = [];
try {
  const { ctx, page, errors, sound } = await newPage(browser, size);
  if (less) await page.emulateMedia({ reducedMotion: "reduce" });
  if (before) {
    // the earlier commit's copy of each changed file (the folder mirrors the repo's paths)
    await ctx.route(/^http:\/\/127\.0\.0\.1:\d+\/(js|data|css)\/.*|^http:\/\/127\.0\.0\.1:\d+\/[\w-]+\.html.*/, (route) => {
      const p = new URL(route.request().url()).pathname.replace(/^\//, "");
      const f = join(before, p);
      if (existsSync(f)) return route.fulfill({ status: 200, contentType: p.endsWith(".js") ? "text/javascript" : p.endsWith(".json") ? "application/json" : p.endsWith(".css") ? "text/css" : "text/html", body: readFileSync(f) });
      return route.fallback();
    });
  }
  await page.goto(`${BASE}/cook.html?speed=1`, { waitUntil: "load" });
  await page.evaluate(() => localStorage.clear());
  await page.goto(`${BASE}/cook.html?speed=1`, { waitUntil: "load" });
  await page.waitForSelector("#panel .title-wrap", { timeout: 20000 });
  log("title");
  const rec = new Recorder({ flow: "juice", size, dir: join(out, "_rec"), page });
  const P = new CookPlayer(page, rec, { mode: "fair", speed: 1 });
  const freeze = (on) => page.evaluate((on) => {
    const S = window.Cook && Cook.scene;
    if (S) { S.tweens.timeScale = on ? 0 : 1; if (S.time) S.time.timeScale = on ? 0 : 1; }
    // (the page's own animations run on: pausing them for each still stretched a strip's timeline; a still is one frame anyway)
  }, on);
  const shoot = async (name, clip) => {
    await freeze(true);
    await sleep(60);
    const file = join(out, `${name}-${tag}.png`);
    const vp = page.viewportSize();
    const c = clip ? { x: Math.max(0, Math.round(clip.x)), y: Math.max(0, Math.round(clip.y)), width: Math.round(clip.w), height: Math.round(clip.h) } : null;
    if (c) { c.width = Math.min(c.width, vp.width - c.x); c.height = Math.min(c.height, vp.height - c.y); }
    await page.screenshot({ path: file, clip: c || undefined });
    shots.push(file);
    await freeze(false);
  };
  if (what === "order") await page.evaluate((lv) => { window.__orderDone = false; njgTest.cook.order({ dish: "chai", level: lv }).then(() => (window.__orderDone = true)); }, level);
  else await page.evaluate((lv) => { njgTest.cook.lab("chai-tray", true, { level: lv }); }, level);
  await page.waitForFunction("document.querySelector('#overlay').classList.contains('hidden')", null, { timeout: 15000 }).catch(() => {});
  let done = false;
  const got = {};
  const watcher = (async () => {
    let glassAt = null;
    let dbgAt = 0;
    while (!done) {
      try {
        if (process.env.DBG && Date.now() - dbgAt > 3000) {
          dbgAt = Date.now();
          console.log(JSON.stringify(await page.evaluate(() => { const C = window.Cook; const S = C && C.scene; return { pans: C && C.chaiPans ? C.chaiPans().map((p) => [p.state, +p.heat.toFixed(2)]) : null, keys: S ? [...new Set(S.children.list.filter((o) => o.texture && /juice|fx-s11/.test(o.texture.key)).map((o) => o.texture.key))] : null, juice: !!window.Juice }; })));
        }
        // A: the boiling pan's steam (after: two s17 wisps up; before: an s11 wisp up)
        if (!got.A) {
          const s = await page.evaluate(() => {
            const C = window.Cook, S = C && C.scene;
            if (!S || !C.chaiPans) return null;
            const pan = C.chaiPans().find((p) => p.state === "heating");
            if (!pan) return null;
            const vis = S.children.list.filter((o) => o.visible && o.alpha > 0.35 && o.texture && /^(fx-juice-st|fx-s11-steam)/.test(o.texture.key));
            // (reduced motion: the one still wisp)
            const less = matchMedia("(prefers-reduced-motion: reduce)").matches;
            return vis.length >= (vis.some((o) => o.texture.key.startsWith("fx-juice")) && !less ? 2 : 1) ? pan.at : null;
          });
          if (s) { got.A = true; await shoot("A-steam", { x: s.x - 190, y: s.y - 260, w: 380, h: 380 }); await shoot("A-steam-whole", null); }
        }
        // B: the tray glass, as its first pour ends (a strip: 120, 260, 420, 650 ms after)
        if (!got.B) {
          const g = await page.evaluate(() => { const C = window.Cook; const p = C && C.chaiPour; if (!p) return null; const f = p.frames(); return C.UI.worldToScreen(f.glassAt.x, f.glassAt.y); });
          if (g) glassAt = g;
          else if (glassAt) {
            got.B = true;
            // (the game's clock stands still while a still is taken, so each frame waits its own share of the game's time, not the
            // wall clock's: by the wall clock the stills came out nearly one moment, the drop hanging where it started)
            let t0 = Date.now();
            let gone = 0;
            for (const ms of [150, 300, 600, 900, 1200, 1500]) {
              gone += Date.now() - t0;
              await sleep(Math.max(0, ms - gone));
              gone = Math.max(gone, ms);
              if (process.env.DBG) console.log(ms, JSON.stringify(await page.evaluate(() => Cook.scene.children.list.filter((o) => o.texture && /juice/.test(o.texture.key)).map((o) => [o.texture.key, +o.alpha.toFixed(2), Math.round(o.x), Math.round(o.y), o.depth, Cook.UI.worldToScreen(o.x, o.y), o.displayWidth])), glassAt));
              if (process.env.DBG && ms === 900) await shoot("B-whole", null);
              await shoot(`B-glass-${String(ms).padStart(3, "0")}`, { x: glassAt.x - 110, y: glassAt.y - 130, w: 220, h: 220 });
              t0 = Date.now();
            }
          }
        }
        // C: the word moment's last drop (after: the painted drop; before: the drawn one), a strip from its start
        if (!got.C) {
          const d = await page.evaluate(() => { const e = document.querySelector('img.njg-juice[src*="td-1"], .wm-drop'); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top }; });
          if (d) {
            got.C = true;
            const t0 = Date.now();
            for (const ms of [150, 300, 450, 600]) {
              await sleep(Math.max(0, t0 + ms - Date.now()));
              await shoot(`C-drop-${String(ms).padStart(3, "0")}`, { x: d.x - 130, y: d.y - 40, w: 260, h: 300 });
            }
          }
        }
        // D: the end screen's stopwatch as its count lands (after: the burst blooms behind it, at its fullest, 330 ms in)
        if (!got.D) {
          const r = await page.evaluate(() => {
            const b = document.querySelector('.rs-badge[data-badge="time"].in');
            if (!b) return null;
            const burst = b.querySelector("img.njg-juice");
            const acc = document.querySelector('.rs-badge[data-badge="accuracy"].in');
            const card = document.querySelector(".rs-card") || b;
            const r = card.getBoundingClientRect();
            return burst || acc ? { burst: !!burst, x: r.left, y: r.top, w: r.width, h: r.height } : null;
          });
          if (r) { got.D = true; if (r.burst) await sleep(300); await shoot("D-end", { x: r.x - 20, y: r.y - 20, w: r.w + 40, h: r.h + 40 }); }
        }
        // E: the serve's stamp as it lands (after: the burst behind it)
        if (!got.E) {
          const r = await page.evaluate(() => {
            const st = [...document.querySelectorAll(".njg-served-stamp")].find((s) => +getComputedStyle(s).opacity > 0.9);
            if (!st) return null;
            const c = st.closest(".njg-served-card").getBoundingClientRect();
            return { x: c.left, y: c.top, w: c.width, h: c.height, burst: !!st.parentNode.querySelector("img.njg-juice") };
          });
          if (r) { got.E = true; await sleep(r.burst ? 250 : 250); await shoot("E-stamp", { x: r.x - 60, y: r.y - 60, w: r.w + 120, h: r.h + 120 }); }
        }
      } catch (e) {
        /* the page moved on */
      }
      await sleep(30);
    }
  })();
  try {
    await P.play(() => page.evaluate("(() => { if (window.__orderDone) return true; const b = document.querySelector('.njg-results #lab-list'); return !!b && b.offsetParent !== null; })()"), { timeout: 300000 });
    await sleep(1500);
  } finally {
    done = true;
    await watcher;
  }
  writeFileSync(join(out, `sound-${tag}.json`), JSON.stringify(sound.events, null, 0));
  console.log(JSON.stringify({ tag, got, shots: shots.length, errors }));
} finally {
  await browser.close();
  srv.close();
}
