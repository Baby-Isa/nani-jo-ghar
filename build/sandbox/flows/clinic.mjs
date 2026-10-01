// The clinic, through its real page and lab URLs (labs.html: clinic.html?stage=...&level=...&variant=...; the lab
// bar is left off, it is developer chrome). The driver follows window.__clinic.expect() (what the stage wants next)
// with real pointer events, like build/test_clinic.py; the healing games are driven through the controller's own
// debug.next() (what a child who understood would do), like build/heal_play.py. Fair player only.
// &quiet=1 (no device voice) &fast=1 (short waits) &onboard=0 (no first-time ghost finger) &seed=7 (the same people every run).
import { BASE, sleep } from "../lib/env.mjs";

const SEED = 7;
export const HEAL_GAMES = ["cut", "knee", "ear", "tooth", "taste", "fever", "boing", "eye", "foot"];

class ClinicPlayer {
  constructor(page, rec) { this.page = page; this.rec = rec; this.seen = new Set(); this.covers = new Set(); }
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
      await this.page.locator(".cl-go").last().click({ timeout: 3000 }).catch(() => {});
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
      const errs = await this.ev(() => (window.__clinic ? window.__clinic.errors : []));
      if (errs.length) throw new Error(`page errors ${JSON.stringify(errs)}`);
      if (await this.ev(done)) {
        if (await this.resultsVisible()) { await this.once("results-end"); await this.results(); continue; }
        return;
      }
      if (await this.resultsVisible()) { await sleep(900); await this.once("results-" + (await this.centre(".rs-next") ? "badges" : "words")); await this.results(); continue; }
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
      const a = await this.ev(() => { const r = window.__clinic.Stages.heal.current; return r && r.controller.debug ? r.controller.debug.next() : { do: "wait" }; });
      await this.healAct(a);
      steps++;
      if (!mid && steps > 6 && a.do !== "wait") { mid = true; await this.once(`heal-${game}-mid`); }
    }
  }
}

function clinicFlow({ id, title, query, level = 1, timeoutMs = 240000, onboard = false, done, extra }) {
  return {
    id, group: "clinic", title, timeoutMs,
    async run(ctx) {
      const { page, rec } = ctx;
      const q = `${query}&seed=${SEED}&quiet=1&fast=1&onboard=${onboard ? 1 : 0}`;
      await page.goto(`${BASE}/clinic.html?${q}`, { waitUntil: "load" });
      await page.waitForFunction(() => window.__clinic && window.__clinic.ready, null, { timeout: 30000 });
      // adapter: some games' debug drivers ask `__heal.run` (the heal-host lab's hook); here the same thing lives in __clinic
      await page.evaluate(() => { if (!window.__heal) Object.defineProperty(window, "__heal", { value: { get run() { return window.__clinic.Stages.heal.current; }, get result() { return window.__clinic.last; } } }); });
      await sleep(500);
      const P = new ClinicPlayer(page, rec);
      try {
        await P.play({ label: id, ...(done ? { done } : {}), timeout: timeoutMs - 20000 });
      } finally { for (const c of P.covers) rec.note(`covered tap: ${c}`); }
      await sleep(300);
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
  return f;
}
