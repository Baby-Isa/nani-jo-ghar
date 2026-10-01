// The clinic, through its real page and lab URLs (labs.html: clinic.html?stage=...&level=...&variant=...; the lab
// bar is left off, it is developer chrome). The driver follows window.__clinic.expect() (what the stage wants next)
// with real pointer events, like build/test_clinic.py; the healing games are driven through the controller's own
// debug.next() (what a child who understood would do), like build/heal_play.py. Fair player only.
// &quiet=1 (no device voice) &fast=1 (short waits) &onboard=0 (no first-time ghost finger) &seed=7 (the same people every run).
import { BASE, sleep } from "../lib/env.mjs";
import { waitBadges, readBadges } from "../lib/results.mjs";

const SEED = 7;
export const HEAL_GAMES = ["cut", "knee", "ear", "tooth", "taste", "fever", "boing", "eye", "foot"];

// mode: "fair" does what the stage asks. "mistake" makes one wrong pick per stage where the stage offers one (e.wrong: a wrong dish, probe,
// seat, card), and in a healing game the game's own deliberate slip (debug.slip()), then goes on to the end. "hint" asks for help: it
// leaves the first thing alone for the first-time help's idle hint, presses the light bulb (the English flip), and peeks at a closed card.
class ClinicPlayer {
  constructor(page, rec, { mode = "fair" } = {}) {
    this.page = page; this.rec = rec; this.seen = new Set(); this.covers = new Set();
    this.mode = mode; this.mistakes = mode === "mistake"; this.hints = mode === "hint";
    this.made = new Set(); this.idled = false; this.bulbs = new Set(); this.peeks = new Set(); this.badges = [];
  }
  // the hint player's moves at a stage: wait for the idle hint once, press the bulb once per stage, peek at a closed card once per stage
  async hintMoves(stage) {
    const p = this.page;
    if (!this.idled) { this.idled = true; await sleep(7500); await this.once(`idle-hint-${stage}`, { settle: 0 }); }
    if (!this.peeks.has(stage)) {
      const closed = await p.$(".oc-card.closed.folded .oc-head");
      if (closed && (await closed.isVisible())) {
        this.peeks.add(stage);
        await closed.click({ force: true }).catch(() => {});
        await sleep(300);
        await this.once(`peek-${stage}`, { settle: 0 });
      }
    }
    if (!this.bulbs.has(stage)) {
      const bulb = await p.$(".ng-bulb");
      if (bulb && (await bulb.isVisible())) {
        this.bulbs.add(stage);
        // the lab's fast mode makes the English flip last 0.3 s: give it its real time for this press
        await p.evaluate(() => { if (window.Clinic && Clinic.Kit) { window.__njgFast = Clinic.Kit.fast; Clinic.Kit.fast = false; } });
        await bulb.click({ force: true }).catch(() => {});
        await p.evaluate(() => { if (window.Clinic && Clinic.Kit && "__njgFast" in window) Clinic.Kit.fast = window.__njgFast; });
        await sleep(150);
        await this.once(`bulb-${stage}`, { settle: 0 });
        await sleep(400);
      }
    }
  }
  // the mistake player's move: one wrong pick per stage
  async mistakeMoves(stage, e) {
    if (!this.mistakes || !e.wrong || this.made.has(stage)) return false;
    const c = await this.centre(e.wrong);
    if (!c || !c.onscreen) return false;
    if (e.kind === "belt") { const vw = await this.ev(() => innerWidth); if (c.x > vw * 0.85) return false; }
    this.made.add(stage);
    await this.tapXY(c.x, c.y);
    await sleep(350);
    await this.once(`wrong-${stage}`, { settle: 0 });
    await sleep(500);
    return true;
  }
  async once(name, opts) { if (this.seen.has(name)) return; this.seen.add(name); await this.rec.state(name, opts); }
  ev(fn, arg) { return this.page.evaluate(fn, arg); }
  async centre(sel) {
    return this.ev((sel) => {
      const els = Array.from(document.querySelectorAll(sel)).filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !e.disabled; });
      if (!els.length) return null;
      const e = els[0], r = e.getBoundingClientRect();
      const x = Math.round(r.left + r.width / 2), y = Math.round(r.top + r.height / 2);
      const top = document.elementFromPoint(x, y);
      return { x, y, ok: !!top && (top === e || e.contains(top)), onscreen: x > 0 && y > 0 && x < innerWidth && y < innerHeight, cover: top ? (top.className && top.className.baseVal !== undefined ? top.className.baseVal : top.className) : null };
    }, sel);
  }
  async tapXY(x, y) { await this.page.mouse.click(x, y); }
  async tapSel(sel, needClear = true) {
    const c = await this.centre(sel);
    if (!c || !c.onscreen) return false;
    if (needClear && !c.ok) this.covers.add(`${sel} is covered by ${c.cover}`);
    await this.tapXY(c.x, c.y);
    return true;
  }
  async results() {
    for (const sel of [".rs-next", ".rs-done", ".rs-act.primary"]) {
      const c = await this.centre(sel);
      if (c) { await this.tapXY(c.x, c.y); await sleep(250); return true; }
    }
    return false;
  }
  async tapSay(choice) {
    let sel = null;
    const cands = choice ? [`.njg-say .pill[data-choice="${choice}"]`, `.cl-pill[data-choice="${choice}"]`] : [".njg-say.live .pill", ".njg-say .pill", ".cl-pill"];
    for (const s of cands) if (await this.centre(s)) { sel = s; break; }
    if (!sel) return false;
    return this.tapSel(sel, false);
  }
  async resultsVisible() { return !!((await this.centre(".rs-next")) || (await this.centre(".rs-done")) || (await this.centre(".rs-act.primary"))); }

  // one action of a heal game's debug driver
  async healAct(a) {
    const m = this.page.mouse;
    if (a.do === "tap") {
      const covered = await this.ev(([x, y]) => { const e = document.elementFromPoint(x, y); return !e || !(e.closest(".hs-root") || e.closest(".cl-stage")); }, [a.x, a.y]);
      if (covered) this.covers.add(`heal tap (${Math.round(a.x)},${Math.round(a.y)}) is off the play area (${a.what || ""})`);
      await m.move(a.x, a.y); await m.down(); await m.up();
      await this.page.waitForTimeout(a.after || 90);
    } else if (a.do === "drag") {
      const pts = a.pts;
      await m.move(pts[0][0], pts[0][1]); await m.down();
      for (const [x, y] of pts.slice(1)) await m.move(x, y, { steps: a.steps || 3 });
      await m.up();
      await this.page.waitForTimeout(120);
    } else if (a.do === "hold") {
      await m.move(a.x, a.y); await m.down();
      const t0 = Date.now();
      while (!(await this.page.evaluate(a.until)) && Date.now() - t0 < 12000) await this.page.waitForTimeout(15);
      await m.up();
      await this.page.waitForTimeout(150);
    } else if (a.do === "button") {
      // D7 (R5): the ✓ is hidden until it can do something (at level 1 a counted step closes itself): then wait a beat
      const vis = await this.page.locator(".cl-go:not(.hidden)").count();
      if (vis) await this.page.locator(".cl-go:not(.hidden)").last().click({ timeout: 3000 }).catch(() => {});
      else await this.page.waitForTimeout(300);
      await this.page.waitForTimeout(150);
    } else if (a.do === "wait") {
      await this.page.waitForTimeout(a.ms || 150);
    } else throw new Error(`unknown heal action ${JSON.stringify(a)}`);
  }

  async play({ done = () => !!(window.__clinic && window.__clinic.last), timeout = 240000, label = "" } = {}) {
    const page = this.page;
    const t0 = Date.now();
    let lastStage = null;
    while (Date.now() - t0 < timeout) {
      // "ResizeObserver loop completed with undelivered notifications" is a browser notice, not a bug: it fires now and then on layout
      const errs = (await this.ev(() => (window.__clinic ? window.__clinic.errors : []))).filter((e) => !/ResizeObserver loop/.test(e));
      if (errs.length) throw new Error(`page errors ${JSON.stringify(errs)}`);
      if (await this.ev(done)) {
        if (await this.resultsVisible()) { await this.once("results-end"); await this.results(); continue; }
        return;
      }
      if (await this.resultsVisible()) {
        const badges = !!(await this.centre(".rs-next"));
        if (badges) { await waitBadges(page); this.badges = await readBadges(page); } else await sleep(500);
        await this.once("results-" + (badges ? "badges" : "words"));
        await this.results();
        continue;
      }
      const e = await this.ev(() => (window.__clinic && window.__clinic.expect ? window.__clinic.expect() : null));
      const stage = e && e.stage;
      if (stage && stage !== lastStage) { lastStage = stage; await sleep(200); await this.once(`stage-${stage}`); }
      if (!e) {
        if (await this.tapSay(null)) { await this.once("say-pills"); continue; }
        const c = await this.centre(".cl-go.throb, .cl-go");
        if (c && c.onscreen) { await this.once("between-stages"); await this.tapXY(c.x, c.y); }
        await sleep(150);
        continue;
      }
      const k = e.kind;
      if (this.hints && ["tap", "act", "point", "belt"].includes(k) && !(await this.page.evaluate(() => !!document.querySelector(".njg-onboard.on")))) await this.hintMoves(stage);
      if (this.mistakes && ["tap", "act", "belt"].includes(k) && (await this.mistakeMoves(stage, e))) continue;
      if (k === "tap" || k === "act") {
        await this.once(`${stage}-${k}`);
        if (!(await this.tapSel(e.target))) await sleep(100); else await sleep(250);
      } else if (k === "point") {
        await this.once(`${stage}-point`);
        await this.tapXY(e.x, e.y); await sleep(300);
      } else if (k === "belt") {
        await this.once(`${stage}-belt`);
        const c = await this.centre(e.target);
        const vw = await this.ev(() => innerWidth);
        if (c && c.onscreen && c.x < vw * 0.85) { await this.tapXY(c.x, c.y); await sleep(400); } else await sleep(50);
      } else if (k === "say") {
        await this.once(`${stage}-say`);
        await this.tapSay(e.choice); await sleep(300);
      } else if (k === "game") {
        // a healing game: play it through its own debug driver until it ends
        await this.healGame(stage, e);
      } else if (k === "button") {
        const c = await this.centre(".cl-go");
        if (c) await this.tapXY(c.x, c.y);
        await sleep(200);
      } else await sleep(100);
    }
    await this.once("timeout");
    throw new Error(`${label}: timed out (last expect ${JSON.stringify(await this.ev(() => window.__clinic.expect()))})`);
  }

  async healGame(stage, e) {
    const game = e.game;
    const has = await this.ev(() => { const r = window.__clinic.Stages.heal.current; return !!(r && r.controller && r.controller.debug); });
    if (!has) { await this.once(`heal-${game}-no-driver`); await this.rec.stop(`heal ${game}: no debug driver; ended with the test's finishHeal()`); await this.ev(() => window.__clinic.finishHeal()); await sleep(400); return; }
    await this.once(`heal-${game}-start`, { settle: 300 });
    const t0 = Date.now();
    let steps = 0, mid = false;
    while (!(await this.ev(() => !!window.__clinic.last)) && (await this.ev(() => !!window.__clinic.Stages.heal.current))) {
      if (Date.now() - t0 > 90000) throw new Error(`heal ${game}: timed out playing`);
      if (this.mistakes && !this.made.has("heal-slip")) {
        const slip = await this.ev(() => { const r = window.__clinic.Stages.heal.current; return r && r.controller.debug && r.controller.debug.slip ? r.controller.debug.slip() : null; });
        if (slip) { this.made.add("heal-slip"); await this.healAct(slip); await sleep(250); await this.once(`heal-${game}-slip`, { settle: 0 }); continue; }
      }
      if (this.hints && steps > 3 && !this.bulbs.has("heal")) await this.hintMoves("heal");
      const a = await this.ev(() => { const r = window.__clinic.Stages.heal.current; return r && r.controller.debug ? r.controller.debug.next() : { do: "wait" }; });
      // while the first-time overlay runs it ignores taps for about 450 ms between its steps: go at a child's pace
      if (a.do !== "wait" && (await this.page.$(".njg-onboard"))) await sleep(700);
      await this.healAct(a);
      steps++;
      if (!mid && steps > 6 && a.do !== "wait") { mid = true; await this.once(`heal-${game}-mid`); }
    }
  }
}

function clinicFlow({ id, title, query, level = 1, timeoutMs = 240000, onboard = false, done, extra, mode = "fair", sizes }) {
  return {
    id, group: "clinic", title, timeoutMs: mode === "hint" ? timeoutMs + 120000 : timeoutMs, ...(sizes ? { sizes } : {}),
    async run(ctx) {
      const { page, rec } = ctx;
      const q = `${query}&seed=${SEED}&quiet=1&fast=1&nonav=1&onboard=${onboard || mode === "hint" ? 1 : 0}`;
      await page.goto(`${BASE}/clinic.html?${q}`, { waitUntil: "load" });
      await page.waitForFunction(() => window.__clinic && window.__clinic.ready, null, { timeout: 30000 });
      // adapter: some games' debug drivers ask `__heal.run` (the heal-host lab's hook); here the same thing lives in __clinic
      await page.evaluate(() => { if (!window.__heal) Object.defineProperty(window, "__heal", { value: { get run() { return window.__clinic.Stages.heal.current; }, get result() { return window.__clinic.last; } } }); });
      await sleep(500);
      const P = new ClinicPlayer(page, rec, { mode });
      try {
        await P.play({ label: id, ...(done ? { done } : {}), timeout: timeoutMs - 20000 });
      } finally { for (const c of P.covers) rec.note(`covered tap: ${c}`); }
      await sleep(300);
      await rec.state("end");
      ctx.extra = { badges: P.badges, mistakes: [...P.made], bulbs: [...P.bulbs], peeks: [...P.peeks] };
      ctx.reachedEnd = true;
    },
  };
}

// The parked healing games (tummy, hic, hair) are not in the clinic's pipeline yet: they run on the heal host lab page, driven through
// the controller's own debug.next() like the others (lab/clinic-heal-host.html; "maybe later; lab only" on labs.html).
export const HEAL_EXTRA = ["tummy", "hic", "hair"];
export function healExtraFlow(g) {
  return {
    id: `clinic:heal-extra-${g}`, group: "clinic", title: `Clinic: parked heal game ${g} (heal host lab), level 1`, timeoutMs: 200000,
    async run(ctx) {
      const { page, rec } = ctx;
      const src = HEAL_EXTRA.map((x) => `&src=${encodeURIComponent(`js/clinic/heal/games/${x}.js`)}`).join("");
      const url = `${BASE}/lab/clinic-heal-host.html?game=${g}&level=1&kind=girl&seed=${SEED}&quiet=1&fast=1${src}`;
      // these games have no debug driver and the first-time overlay would eat the scripted taps: mark it seen (UIStore), then load again
      await page.goto(url, { waitUntil: "load" });
      await page.evaluate((id) => { if (window.UIStore) UIStore.set("onboarded", `clinic/heal-${id}`, true); }, g);
      await page.goto(url, { waitUntil: "load" });
      await page.waitForFunction(() => window.__heal && window.__heal.run && window.__heal.run.controller, null, { timeout: 30000 });
      await sleep(500);
      // the lab bar and its output are developer chrome: fold them away (the python test does the same)
      await page.evaluate(() => { const l = document.getElementById("lab"); if (l) l.classList.add("min"); const o = document.getElementById("lab-out"); if (o) o.style.display = "none"; });
      await sleep(500);
      const P = new ClinicPlayer(page, rec);
      await P.once(`heal-${g}-start`, { settle: 300 });
      // these older games have no debug.next(): controller.expect().script is a fair play as a list of {dish|tap|drag|wait|done} steps
      const exp = () => page.evaluate(() => (window.__heal.run && window.__heal.run.controller.expect ? window.__heal.run.controller.expect() : null));
      const tapRect = async (r, what) => { if (!r) throw new Error(`no rect for ${what}`); await page.mouse.click(r.x, r.y); await sleep(150); };
      const steps = ((await exp()) || {}).script || [];
      if (!steps.length) throw new Error(`heal ${g}: expect() has no script`);
      let n = 0;
      try {
        for (const st of steps) {
          if (st.wait) { await page.waitForFunction(st.wait, null, { timeout: 12000 }); await sleep((st.pause || 0.2) * 1000); }
          else if (st.dish) { const i = (await exp()).dish[st.dish]; const r = await page.evaluate((i) => { const d = document.querySelectorAll(".cl-side-tray .cl-dish")[i]; if (!d) return null; const b = d.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }, i); await tapRect(r, `dish ${st.dish}`); }
          else if (st.tap) await tapRect(await page.evaluate((w) => window.__heal.run.controller.where(w), st.tap), st.tap);
          else if (st.drag) {
            const r = await page.evaluate((w) => window.__heal.run.controller.where(w), st.drag);
            await page.mouse.move(r.x, r.y); await page.mouse.down();
            for (let k = 1; k <= 10; k++) { await page.mouse.move(r.x + ((st.dx || 0) * k) / 10, r.y + ((st.dy || 0) * k) / 10); await sleep(30); }
            await page.mouse.up(); await sleep(200);
          } else if (st.shot) await P.once(`heal-${g}-${st.shot}`, { settle: 0 });
          else if (st.done) { const r = await page.evaluate(() => { const b = document.querySelector(".cl-actions .cl-go"); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }); await tapRect(r, "Done"); }
          if (++n === Math.ceil(steps.length / 2)) await P.once(`heal-${g}-mid`, { settle: 0 });
        }
        await page.waitForFunction(() => !!window.__heal.result, null, { timeout: 12000 });
      } finally { for (const c of P.covers) rec.note(`covered tap: ${c}`); }
      await sleep(400);
      await rec.state("end");
      ctx.reachedEnd = true;
    },
  };
}

export function clinicFlows() {
  const f = [];
  // stage x variant x level, as in labs.html (the lab bar left off)
  const stages = [
    ["waiting", "W1", 1, "Waiting room (W1)"],
    ["diagnosis", "D1", 1, "Diagnosis (D1)"],
    ["pharmacy", null, 1, "Pharmacy (belt)"],
    ["sendoff", "E1", 1, "Send-off (E1)"],
  ];
  for (const [st, v, L, t] of stages) f.push(clinicFlow({ id: `clinic:${st}`, title: `Clinic: ${t}, level ${L}`, query: `stage=${st}&level=${L}${v ? `&variant=${v}` : ""}` }));
  // level 3, where cheap
  for (const [st, v, t] of [["waiting", "W1", "Waiting room (W1)"], ["diagnosis", "D2", "Diagnosis (D2)"], ["pharmacy", null, "Pharmacy"], ["sendoff", "E2", "Send-off (E2)"]])
    f.push(clinicFlow({ id: `clinic:${st}@L3`, title: `Clinic: ${t}, level 3`, query: `stage=${st}&level=3${v ? `&variant=${v}` : ""}`, level: 3 }));
  for (const g of HEAL_GAMES) f.push(clinicFlow({ id: `clinic:heal-${g}`, title: `Clinic: heal game ${g}, level 1`, query: `stage=heal&game=${g}&level=1`, timeoutMs: 200000 }));
  f.push(clinicFlow({ id: "clinic:patient", title: "Clinic: One patient, end to end, level 1 (first-time help on)", query: "patient=1&level=1&results=1", onboard: true, timeoutMs: 420000 }));
  f.push(clinicFlow({ id: "clinic:patient@L3", title: "Clinic: One patient, end to end, level 3", query: "patient=1&level=3&results=1", level: 3, timeoutMs: 420000 }));
  // R5: a clinic morning through the one game host (session 2: two patients, an end screen after each, then "close the clinic")
  f.push({ ...clinicFlow({ id: "clinic:morning", title: "Clinic: a morning (session 2: two patients through the host, then close the clinic)", query: "morning=1&session=2&nosave=1", timeoutMs: 600000 }), deep: true });

  // ---- the deeper paths (run at the deep sizes): every level, then the mistake and hint players ----
  const D = (o) => f.push({ ...clinicFlow(o), deep: true });
  const STAGE_NAME = { waiting: "Waiting room", diagnosis: "Diagnosis", pharmacy: "Pharmacy (belt)", sendoff: "Send-off" };
  // levels: 1-3 for every stage; the waiting room goes on to 4 and 5 (the lab bar says so: "the waiting room only")
  for (const st of ["waiting", "diagnosis", "pharmacy", "sendoff"]) D({ id: `clinic:${st}@L2`, title: `Clinic: ${STAGE_NAME[st]}, level 2`, query: `stage=${st}&level=2`, level: 2 });
  for (const L of [4, 5]) D({ id: `clinic:waiting@L${L}`, title: `Clinic: Waiting room, level ${L} (the waiting room's own levels)`, query: `stage=waiting&level=${L}`, level: L });
  for (const g of HEAL_GAMES) for (const L of [2, 3]) D({ id: `clinic:heal-${g}@L${L}`, title: `Clinic: heal game ${g}, level ${L}`, query: `stage=heal&game=${g}&level=${L}`, level: L, timeoutMs: 200000 });
  for (const g of HEAL_EXTRA) f.push({ ...healExtraFlow(g), deep: true });
  // the end card with its grey ticks (mistakes) and dimmed bulb (hints) comes from a whole patient
  D({ id: "clinic:patient#mistake", title: "Clinic: One patient, level 1, mistake player (the end review with its wrong words)", query: "patient=1&level=1&results=1", mode: "mistake", timeoutMs: 600000 });
  D({ id: "clinic:patient#hint", title: "Clinic: One patient, level 1, hint player (the end card's dimmed bulb)", query: "patient=1&level=1&results=1", mode: "hint", timeoutMs: 600000 });
  D({ id: "clinic:patient@L2", title: "Clinic: One patient, end to end, level 2", query: "patient=1&level=2&results=1", level: 2, timeoutMs: 420000 });
  // mistake player: one wrong pick per stage, then on to the end (loud at level 1, quiet from level 2); heal games use their own slip
  for (const st of ["waiting", "diagnosis", "pharmacy", "sendoff"]) for (const L of [1, 3]) D({ id: `clinic:${st}${L > 1 ? `@L${L}` : ""}#mistake`, title: `Clinic: ${STAGE_NAME[st]}, level ${L}, mistake player`, query: `stage=${st}&level=${L}`, level: L, mode: "mistake" });
  for (const g of HEAL_GAMES) D({ id: `clinic:heal-${g}#mistake`, title: `Clinic: heal game ${g}, level 1, mistake player (its own slip)`, query: `stage=heal&game=${g}&level=1`, mode: "mistake", timeoutMs: 200000 });
  // hint player: the idle hint, the light bulb's English flip, a peek at a closed card (from level 3: the waiting room and the pharmacy)
  for (const st of ["waiting", "diagnosis", "pharmacy", "sendoff"]) D({ id: `clinic:${st}#hint`, title: `Clinic: ${STAGE_NAME[st]}, level 1, hint player`, query: `stage=${st}&level=1`, mode: "hint" });
  for (const st of ["waiting", "pharmacy"]) D({ id: `clinic:${st}@L3#hint`, title: `Clinic: ${STAGE_NAME[st]}, level 3, hint player (the closed card)`, query: `stage=${st}&level=3`, level: 3, mode: "hint" });
  for (const g of HEAL_GAMES) D({ id: `clinic:heal-${g}#hint`, title: `Clinic: heal game ${g}, level 1, hint player`, query: `stage=heal&game=${g}&level=1`, mode: "hint", timeoutMs: 200000 });
  return f;
}
