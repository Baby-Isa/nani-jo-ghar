// The box reader's browser part (Sprint 20 P4): one game, one level, one size. The play bot (the sandbox's fair CookPlayer) plays the
// Station lab round; the stand-still switch (js/cook/test-stand.js, injected here only) holds the game at each named moment; this reads
// the boxes there (lib/boxes.mjs READ), reads them again after the picture (the game must not have moved meanwhile), takes the
// picture, and lets the game go on. A planted fault (--plant, the proof that the comparison catches what it must) is a test-only nudge
// made while the game stands still and undone before it goes on; it never touches a game file.
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { BASE, newPage, sleep } from "./env.mjs";
import { CookPlayer } from "./cook-player.mjs";
import { armScript, readCall, standSource, momentsOf, PIXEL_MOMENTS } from "./boxes.mjs";

// the planted faults: the moment each is planted at, the box it must show up in (expect, a pattern; kind: the difference's kind), and
// the nudge (in the page, while held) -> an undo
export const PLANTS = {
  // a box moved 4 px: the tray, 4 CSS px to the right
  move4: { at: "mid", expect: "^tray$", js: `(() => { const C = window.Cook, U = C.UI; const k = U.worldToScreen(1, 0).x - U.worldToScreen(0, 0).x; let t = null;
    for (const sc of C.game.scene.getScenes(true)) for (const o of sc.children.list) if (o.texture && o.texture.key === "v2-tray") t = o;
    if (!t) return "no tray"; const dx = 4 / k; t.x += dx; window.__plantUndo = () => { t.x -= dx; }; return "the tray moved 4 px right"; })()` },
  // a card over a face: the order card's first item card laid over the card's face circle
  "card-face": { at: "mid", expect: "^card-1/item-1$", js: `(() => { const c = document.querySelector("#mission .oc-card"); const it = c && c.querySelector(".oc-it14"); const f = c && c.querySelector(".oc-face");
    if (!it || !f) return "no card or face"; const a = it.getBoundingClientRect(), b = f.getBoundingClientRect(); const old = it.style.transform;
    it.style.transform = "translate(" + (b.left - a.left) + "px, " + (b.top - a.top) + "px)"; window.__plantUndo = () => { it.style.transform = old; }; return "the first item card over the order card's face"; })()` },
  // a cut word: Nani's line held to half its width, its overflow hidden (an ellipsis)
  "cut-word": { at: "order", expect: "^nani/", kind: "cut", js: `(() => { const el = document.querySelector("#guide .ng-line") || document.querySelector("#mission .oc-card .oc-t");
    if (!el) return "no words"; const w = el.getBoundingClientRect().width; const old = el.getAttribute("style");
    Object.assign(el.style, { maxWidth: Math.round(w / 2) + "px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" });
    window.__plantUndo = () => { if (old == null) el.removeAttribute("style"); else el.setAttribute("style", old); }; return "Nani's line cut to half its width"; })()` },
  // a light off its target: the drawn light (its hole, box and rings) 20 px to the right of what it lights
  "light-off": { at: "light", expect: "^light-1", js: `(() => { const ob = Array.from(document.querySelectorAll(".njg-onboard")).find((o) => { const b = o.querySelector(".ob-box"); return b && b.style.display !== "none"; });
    if (!ob) return "no light"; const els = Array.from(ob.querySelectorAll(".ob-hole, .ob-box, .ob-item-glow")); const old = els.map((e) => e.getAttribute("x"));
    els.forEach((e) => e.setAttribute("x", (+e.getAttribute("x") + 20).toFixed(1))); window.__plantUndo = () => els.forEach((e, i) => e.setAttribute("x", old[i])); return "the light 20 px right of its target"; })()` },
};

let STAND = null; // the switch as it was when this process started (a run never mixes two versions of it)
const STAND_Q = "(() => { const S = window.njgStand; if (!S) return null; return { reached: S.reached(), busy: S.busy(), held: S.held(), pending: S.pending() }; })()";

/**
 * Play one page and read its moments. -> {page, level, size, moments: {name: {read, again, steady, shot, t}}, missed, errors, notes, ms}
 * dir: the page's folder (boxes.json and the pictures go there); plant: a PLANTS key or null
 */
export async function playBoxes(browser, { game = "chai-tray", level = 1, size, dir, plant = null, seed = 7, settle = 8, timeoutMs = 240000 }) {
  const t0 = Date.now();
  mkdirSync(dir, { recursive: true });
  const np = await newPage(browser, size);
  const { page, ctx, errors } = np;
  const notes = [];
  await ctx.addInitScript({ content: armScript(game, { seed, settle }) });
  await ctx.addInitScript({ content: (STAND = STAND || standSource()) });
  const moments = {};
  const rec = { state: async (n) => n, note: (s) => notes.push(s), pend() {}, stop: (s) => notes.push(`stop: ${s}`) };
  let done = false;
  // the watcher: each moment the stand reaches is read, pictured, read again, and let go
  const watch = (async () => {
    while (!done) {
      const st = await page.evaluate(STAND_Q).catch(() => null);
      if (st && st.reached) {
        const m = st.reached.name;
        try {
          let planted = null;
          if (plant && PLANTS[plant] && PLANTS[plant].at === m) planted = await page.evaluate(PLANTS[plant].js).catch((e) => `plant failed: ${e.message}`);
          const read = await page.evaluate(readCall(game));
          // (the page's animations as held: what loops, what was paused where; for "why did this picture differ")
          const anims = await page.evaluate(`document.getAnimations().map((a) => { const t = a.effect && a.effect.target; const d = t ? (t.tagName || "").toLowerCase() + (t.id ? "#" + t.id : "") + (typeof t.className === "string" && t.className ? "." + t.className.trim().split(/\\s+/).slice(0, 2).join(".") : "") : "?"; const ct = a.effect ? a.effect.getComputedTiming() : {}; return d + " " + (a.animationName || a.transitionProperty || "waapi") + " " + a.playState + " t=" + Math.round(a.currentTime || 0) + (isFinite(ct.endTime) ? "" : " loop"); })`).catch(() => []);
          const life = await page.evaluate("((window.Lifecycle && Lifecycle.log) || []).slice(-10).map((x) => x.what + (x.step != null ? ':' + x.step : ''))").catch(() => []);
          const pixel = PIXEL_MOMENTS.has(m);
          // (a picture compared pixel for pixel: the page's compositor gets a moment after the hold, so a layer an animation just left
          // is drawn as the still page draws it)
          // (and it is taken until two pictures in a row are the same, at most 6: the compositor sometimes leaves a faint seam for a
          // frame, 9 of 255 on one row of 8 pixels, that the still page does not keep)
          const shot = `${m}.${pixel ? "png" : "jpg"}`;
          let shots = 1, still = true;
          if (pixel) {
            await sleep(250);
            let prev = await page.screenshot({ animations: "allow", timeout: 15000 });
            still = false;
            for (; shots < 6 && !still; shots++) {
              await sleep(150);
              const cur = await page.screenshot({ animations: "allow", timeout: 15000 });
              still = cur.equals(prev);
              prev = cur;
            }
            writeFileSync(join(dir, shot), prev);
          } else await page.screenshot({ path: join(dir, shot), animations: "allow", timeout: 15000, type: "jpeg", quality: 82 });
          const again = await page.evaluate(readCall(game));
          if (planted) await page.evaluate("window.__plantUndo && window.__plantUndo(); window.__plantUndo = null;").catch(() => {});
          moments[m] = { read, life, anims, ...(pixel ? { shots, pictureStill: still } : {}), steady: JSON.stringify(read) === JSON.stringify(again), shot, t: st.reached.t, frames: st.reached.frames, ...(planted ? { planted } : {}) };
          if (!moments[m].steady) moments[m].again = again;
        } catch (e) { notes.push(`${m}: ${String(e.message).split("\n")[0]}`); }
        await page.evaluate("window.njgStand && njgStand.go()").catch(() => {});
        continue;
      }
      await sleep(20);
    }
  })();
  let ended = false;
  try {
    await page.goto(`${BASE}/cook.html?speed=3`, { waitUntil: "load" });
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${BASE}/cook.html?speed=3`, { waitUntil: "load" });
    await page.waitForSelector("#panel .title-wrap", { timeout: 20000 });
    const P = new CookPlayer(page, rec, { mode: "fair", speed: 3 });
    P.helped = true; // (the grown-ups' "?" is not opened: the boxes are a child's round)
    // the bot never taps while the game stands still, or while it is settling into a moment (njgStand.busy)
    const act = P.act.bind(P);
    P.act = async (e) => {
      const tw = Date.now();
      while (Date.now() - tw < 20000 && (await page.evaluate("!!(window.njgStand && njgStand.busy())").catch(() => false))) await sleep(20);
      return act(e);
    };
    await page.evaluate(([k, l]) => { if (window.njgStand) njgStand.reseed(); njgTest.cook.lab(k, true, { level: l }); }, [game, level]);
    await page.waitForFunction("document.querySelector('#overlay').classList.contains('hidden')", null, { timeout: 15000 });
    await P.play(() => page.evaluate("(() => { const b = document.querySelector('.njg-results #lab-list'); return !!b && b.offsetParent !== null; })()"), { timeout: timeoutMs });
    // the end: the word review stands still once its moment is read
    const tEnd = Date.now();
    while (Date.now() - tEnd < 20000 && !moments.end) await sleep(100);
    ended = true;
  } catch (e) {
    notes.push(`play: ${String(e.message).split("\n")[0]}`);
  } finally {
    done = true;
    await watch.catch(() => {});
  }
  const pending = await page.evaluate("window.njgStand ? njgStand.pending() : []").catch(() => []);
  await ctx.close().catch(() => {});
  const out = { game, level, size, ended, moments, missed: momentsOf(game).filter((m) => !moments[m]), pending, errors, notes, plant, ms: Date.now() - t0 };
  writeFileSync(join(dir, "boxes.json"), JSON.stringify(out, null, 1));
  return out;
}
