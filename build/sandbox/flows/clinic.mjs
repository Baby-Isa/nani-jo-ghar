// The clinic, through its real page and lab URLs (labs.html: clinic.html?stage=...&level=...&variant=...; the lab
// bar is left off, it is developer chrome). The driver follows window.njgTest?.clinic.expect() (what the stage wants next)
// with real pointer events, like build/test_clinic.py; the healing games are driven through the controller's own
// debug.next() (what a child who understood would do), like build/heal_play.py. Fair player only.
// &quiet=1 (no device voice) &fast=1 (short waits) &onboard=0 (no first-time ghost finger) &seed=7 (the same people every run).
import { BASE, sleep } from "../lib/env.mjs";
import { waitBadges, readBadges } from "../lib/results.mjs";
import { mark, watchVoice, until, popupOpen, tapPopup, stuckWait, openGrownUps } from "../drivers/index.mjs";

const SEED = 7;
// the evidence loop's named drivers on the clinic (drivers/catalog.mjs; build/sandbox/data/evidence.json _drivers): each plays fair
// except for its one move, always through njgTest.clinic.expect(), the heal games' debug.next()/slip() and real taps
//   tap-during-speech   a heal game's first move made while the doctor's line is still being said (SH-20, CLN-35)
//   tap-through-popup   the request pop-up tapped as soon as its card is up (SH-64)
//   idle-twice          8 s with no move at the heal game's first step, then 8 s more (the ghost finger, SH-46, CLN-101)
//   wrong-thrice        three wrong moves at one step: the game's own slip(), else another tool than the one asked for (CK-23)
//   takeback            the first thing placed is tapped again (a heal game's placement, the pharmacy tray, a waiting-room tick)
//   lab-log-on          the stage with the lab bar and its log showing (&lab=1: CLN-07)
//   heal-fast           a morning whose heal game is played with no waits between steps (CLN-109)
//   replay-tap          once a step is ticked and others are left, the card's face (its replay) tapped: it must say only the steps left,
//                       and count no hint (SH-102, SH-114: contract-31); 7.5 s are given for the next lines to be said
//   grab-hold           the ear's first wax drag held on the way while the zoom crops of the tweezers are taken (CLN-173: one prong behind the wax, one over it)
//   real-pace           the clinic without &fast=1: the zooms and waits take their real time (CLN-87)
//   stuck               the first ask (a stage's tap, a heal game's first step) left alone through every help rung, help on (S13-T)
//   mistake-real        the mistake player at real pace (no &fast=1): the wrong answer's shake, red and flash last their real time (CLN-107 at L3, CLN-194)
export const HEAL_GAMES = ["cut", "knee", "ear", "tooth", "taste", "fever", "boing", "eye", "foot"];

// mode: "fair" does what the stage asks. "mistake" makes one wrong pick per stage where the stage offers one (e.wrong: a wrong dish, probe,
// seat, card), and in a healing game the game's own deliberate slip (debug.slip()), then goes on to the end. "hint" asks for help: it
// leaves the first thing alone for the first-time help's idle hint, presses the light bulb (the English flip), and peeks at a closed card.
export class ClinicPlayer {
  constructor(page, rec, { mode = "fair" } = {}) {
    this.page = page; this.rec = rec; this.seen = new Set(); this.covers = new Set();
    this.mode = mode; this.mistakes = mode === "mistake" || mode === "mistake-real"; this.hints = mode === "hint";
    this.made = new Set(); this.idled = false; this.bulbs = new Set(); this.peeks = new Set(); this.badges = [];
    this.fast = mode === "heal-fast";
    this.drv = { turns: new Set(), wrongs: 0, tapped: false, tookBack: false, spoke: false };
    this.voice = null;
  }
  // tap-through-popup: the open request pop-up tapped 0.25 s after it opens (its card is up, the read-out has begun)
  async tapThrough() {
    if ((this.mode !== "tap-through-popup" && this.mode !== "tap-card-1s") || this.drv.tapped || !(await popupOpen(this.page))) return false;
    this.drv.tapped = true;
    const opened = Date.now();
    // the clinic plays at its real pace for this driver (S05-T2): tap half a second into the first line, so a cut-off would show
    const v = await watchVoice(this.page);
    // SH-64 (s09; the judge: every tap landed as the first line ended, "plaster" and "Pela paani" are short): 0.2 s in
    // tap-card-1s (CK-48's Check, S13-V): 1 s after the pop-up opened
    if (this.mode === "tap-card-1s") await sleep(Math.max(0, 1000 - (Date.now() - opened)));
    else if (await v.speaking() || await v.nextLine(3000)) await sleep(200); else this.rec.note("tap-through-popup: no line was said within 3 s of the pop-up opening");
    if (!(await popupOpen(this.page))) { this.rec.note("tap-through-popup: the pop-up folded by itself within 0.25 s"); return false; }
    await mark(this.page, "tapped-through", { block: false });
    await tapPopup(this.page);
    await sleep(250);
    await this.once("tapped-through", { settle: 0 });
    return true;
  }
  // the clinic's take-back (CLN-112, CLN-22): the stage's first pick tapped again (the pharmacy's tray dish, else the same target)
  async stageTakeBack(target) {
    if (this.mode !== "takeback" || this.drv.tookBack) return;
    this.drv.tookBack = true;
    await sleep(500);
    await this.once("before-takeback", { settle: 0 });
    const dish = await this.centre(".cl-tray .cl-dish.full");
    if (dish && dish.onscreen) await this.tapXY(dish.x, dish.y);
    else if (!(await this.tapSel(target, false))) this.rec.note(`takeback: ${target} was gone after the first pick`);
    await sleep(700);
    await this.once("after-takeback", { settle: 0 });
  }
  // replay-tap (SH-102's clinic half, SH-114): the face on the side card is the replay. Once a row is ticked and another is left it
  // is tapped once; the next 7.5 s are given to the doctor's reading (contract-31 judges the lines said in them)
  async replayTap() {
    if (this.mode !== "replay-tap" || this.drv.replayed) return false;
    const st = await this.ev(() => {
      const c = Array.from(document.querySelectorAll(".cl-side .oc-card")).find((x) => !x.closest(".njg-rq-card, .njg-rq") && x.getBoundingClientRect().height > 1);
      return c ? { done: c.querySelectorAll(".oc-row.done").length, left: c.querySelectorAll(".oc-row:not(.done)").length } : null;
    }).catch(() => null);
    if (!st || st.done < 1 || st.left < 1) return false;
    const f = await this.centre(".cl-side .cl-card-face, .cl-side .oc-face");
    if (!f || !f.onscreen) return false;
    this.drv.replayed = true;
    await this.once("replay-tap", { settle: 0 });
    await this.tapXY(f.x, f.y);
    await sleep(7500);
    await this.once("after-replay-tap", { settle: 0 });
    return true;
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
        // hold the pick while the bulb's English is open (SH-41: its 8 s must be measurable before the stage moves on and ends it)
        for (let i = 0; i < 100 && (await p.evaluate(() => !!document.querySelector(".oc-card.english, .cl-side.english, #side.english")).catch(() => false)); i++) await sleep(100);
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
      await this.page.waitForTimeout(this.fast ? 10 : a.after || 90);
    } else if (a.do === "drag") {
      const pts = a.pts;
      await m.move(pts[0][0], pts[0][1]); await m.down();
      for (const [x, y] of pts.slice(1)) {
        await m.move(x, y, { steps: a.steps || 3 });
        // grab-hold (CLN-173): the ear's first wax drag held at its first waypoint, the tweezers closed on the blob, while the probes' zoom crops are taken
        if (this.mode === "grab-hold" && !this.drv.grabHeld && /^wax/.test(String(a.what || ""))) { this.drv.grabHeld = true; await mark(this.page, "grab-held", { block: true }); }
      }
      await m.up();
      await this.page.waitForTimeout(this.fast ? 10 : 120);
    } else if (a.do === "hold") {
      await m.move(a.x, a.y); await m.down();
      const t0 = Date.now();
      while (!(await this.page.evaluate(a.until)) && Date.now() - t0 < 12000) await this.page.waitForTimeout(15);
      await m.up();
      await this.page.waitForTimeout(this.fast ? 10 : 150);
    } else if (a.do === "button") {
      // D7 (R5): the ✓ is hidden until it can do something (at level 1 a counted step closes itself): then wait a beat
      const vis = await this.page.locator(".cl-go:not(.hidden)").count();
      if (vis) await this.page.locator(".cl-go:not(.hidden)").last().click({ timeout: 3000 }).catch(() => {});
      else await this.page.waitForTimeout(this.fast ? 20 : 300);
      await this.page.waitForTimeout(this.fast ? 10 : 150);
    } else if (a.do === "wait") {
      await this.page.waitForTimeout(a.ms || 150);
    } else throw new Error(`unknown heal action ${JSON.stringify(a)}`);
  }

  async play({ done = () => !!(window.njgTest?.clinic && window.njgTest?.clinic.last), timeout = 240000, label = "" } = {}) {
    const page = this.page;
    const t0 = Date.now();
    let lastStage = null;
    if (this.mode === "tap-during-speech") this.voice = await watchVoice(page);
    while (Date.now() - t0 < timeout) {
      if (await this.tapThrough()) continue;
      // "ResizeObserver loop completed with undelivered notifications" is a browser notice, not a bug: it fires now and then on layout
      const errs = (await this.ev(() => (window.njgTest?.clinic ? window.njgTest?.clinic.errors : []))).filter((e) => !/ResizeObserver loop/.test(e));
      if (errs.length) throw new Error(`page errors ${JSON.stringify(errs)}`);
      if (await this.ev(done)) {
        if (await this.resultsVisible()) { await this.once("results-end"); await this.results(); continue; }
        return;
      }
      if (await this.resultsVisible()) {
        // CLN-111 (s04-r2k2): the end of the morning, the receipt in the shared end pop-up with its end buttons
        if (await this.ev(() => !!document.querySelector(".njg-results .rs-receipt"))) { await sleep(500); await this.once("morning-end"); await this.results(); continue; }
        const badges = !!(await this.centre(".rs-next"));
        if (badges) { await waitBadges(page); this.badges = await readBadges(page); } else await sleep(500);
        await this.once("results-" + (badges ? "badges" : "words"));
        await this.results();
        continue;
      }
      const e = await this.ev(() => (window.njgTest?.clinic && window.njgTest?.clinic.expect ? window.njgTest?.clinic.expect() : null));
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
      // the child's turn (SH-71, contract-10: the talkers face the player): each stage's first ask of each kind
      if (["tap", "act", "point", "say", "belt"].includes(k) && !this.drv.turns.has(`${stage}-${k}`)) { this.drv.turns.add(`${stage}-${k}`); await mark(page, `your-turn-${stage}-${k}`); }
      if (this.hints && ["tap", "act", "point", "belt"].includes(k) && !(await this.page.evaluate(() => !!document.querySelector(".njg-onboard.on")))) await this.hintMoves(stage);
      if (this.mistakes && ["tap", "act", "belt"].includes(k) && (await this.mistakeMoves(stage, e))) continue;
      // stuck (S13-T): the stage's first ask left alone through every help rung (drivers/index.mjs stuckWait), then fair
      if (this.mode === "stuck" && !this.drv.stuck && ["tap", "act", "point", "belt"].includes(k)) { this.drv.stuck = true; await stuckWait(page, (n, o) => this.once(n, o)); continue; }
      if (k === "tap" || k === "act") {
        await this.once(`${stage}-${k}`);
        if (!(await this.tapSel(e.target))) await sleep(100); else { await sleep(250); await this.stageTakeBack(e.target); await this.replayTap(); }
      } else if (k === "point") {
        await this.once(`${stage}-point`);
        await this.tapXY(e.x, e.y); await sleep(300);
      } else if (k === "belt") {
        await this.once(`${stage}-belt`);
        const c = await this.centre(e.target);
        const vw = await this.ev(() => innerWidth);
        if (c && c.onscreen && c.x < vw * 0.85) { await this.tapXY(c.x, c.y); await sleep(400); await this.stageTakeBack(e.target); } else await sleep(50);
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
    throw new Error(`${label}: timed out (last expect ${JSON.stringify(await this.ev(() => window.njgTest?.clinic.expect()))})`);
  }

  async healGame(stage, e) {
    const game = e.game;
    const has = await this.ev(() => { const r = window.njgTest?.clinic.Stages.heal.current; return !!(r && r.controller && r.controller.debug); });
    if (!has) { await this.once(`heal-${game}-no-driver`); await this.rec.stop(`heal ${game}: no debug driver; ended with the test's finishHeal()`); await this.ev(() => window.njgTest?.clinic.finishHeal()); await sleep(400); return; }
    await this.once(`heal-${game}-start`, { settle: 300 });
    // D13: a fresh child's first round of a heal game is taught (shown, then copied; nothing scored): CLN-118's "taught"
    if (await this.ev(() => { const r = window.njgTest?.clinic.Stages.heal.current; return !!(r && r.ctx && r.ctx.taught); }).catch(() => false)) await this.once(`taught-${game}`, { settle: 300 });
    const t0 = Date.now();
    let steps = 0, mid = false, lastA = null;
    const tools = () => this.ev(() => Array.from(document.querySelectorAll(".hs-tool[data-tool]")).map((t) => t.dataset.tool)).catch(() => []);
    while (!(await this.ev(() => !!window.njgTest?.clinic.last)) && (await this.ev(() => !!window.njgTest?.clinic.Stages.heal.current))) {
      if (await this.tapThrough()) continue;
      if (Date.now() - t0 > 90000) {
        // what the game and the first-time help were doing when it stalled (F2: so a stall names its cause)
        const why = await this.ev(() => {
          const r = window.njgTest?.clinic.Stages.heal.current, ob = window.Onboard && Onboard.active && Onboard.active();
          const lay = document.querySelector(".njg-onboard");
          return { next: r && r.controller.debug ? r.controller.debug.next() : null, onboard: ob ? ob.id : null, layer: lay ? lay.className : null };
        }).catch(() => null);
        throw new Error(`heal ${game}: timed out playing (last ${JSON.stringify(lastA)}; ${JSON.stringify(why)})`);
      }
      if (this.mistakes && !this.made.has("heal-slip")) {
        const slip = await this.ev(() => { const r = window.njgTest?.clinic.Stages.heal.current; return r && r.controller.debug && r.controller.debug.slip ? r.controller.debug.slip() : null; });
        if (slip) { this.made.add("heal-slip"); await this.healAct(slip); await sleep(250); await this.once(`heal-${game}-slip`, { settle: 0 }); continue; }
      }
      if (this.hints && steps > 3 && !this.bulbs.has("heal")) await this.hintMoves("heal");
      const next = () => this.ev(() => { const r = window.njgTest?.clinic.Stages.heal.current; return r && r.controller.debug ? r.controller.debug.next() : { do: "wait" }; });
      let a = await next();
      // (s08 w6L, CLN-107 at L2) the slip is looked for once more as the move is chosen: at the game's real pace a row can open between the
      // look above and next(), and the player then judged it right and never made its mistake
      if (this.mistakes && !this.made.has("heal-slip") && a.do !== "wait") {
        const slip2 = await this.ev(() => { const r = window.njgTest?.clinic.Stages.heal.current; return r && r.controller.debug && r.controller.debug.slip ? r.controller.debug.slip() : null; }).catch(() => null);
        if (slip2) { this.made.add("heal-slip"); await this.healAct(slip2); await sleep(250); await this.once(`heal-${game}-slip`, { settle: 0 }); continue; }
      }
      // CLN-184: the mistake player's tooth is overfilled once (the game's own debug.over(): hold past the green), then filled fair
      if (this.mistakes && game === "tooth" && a.what === "fill" && !this.made.has("heal-over")) {
        const o = await this.ev(() => { const r = window.njgTest?.clinic.Stages.heal.current; return r && r.controller.debug && r.controller.debug.over ? r.controller.debug.over() : null; }).catch(() => null);
        if (o) { this.made.add("heal-over"); a = o; }
      }
      if (a.do !== "wait" && this.mode !== "fair" && (await this.healDriver(game, a, next, tools))) continue;
      // while the first-time overlay runs it ignores taps for about 450 ms between its steps: go at a child's pace
      if (a.do !== "wait" && !this.fast && (await this.page.$(".njg-onboard"))) await sleep(700);
      // the middle, looked for before the move too (the open row's mark can land a beat after the move that opened it)
      if (!mid && a.do !== "wait" && steps > 0 && (await this.pastHalf())) { mid = true; await this.once(`heal-${game}-mid`); }
      await this.healAct(a);
      lastA = a;
      steps++;
      // CLN-138: the boing's takeback is a drop in the syringe, tapped where it sits (a lever tapped again adds one): once two
      // drops are in, the first (the bottom one) is tapped, so the strip shows that drop going back up and the other staying
      if (this.mode === "takeback" && game === "boing" && !this.drv.tookBack && /^lever/.test(String(a.what || "")) && (await this.ev(() => document.querySelectorAll(".bo-drop").length).catch(() => 0)) >= 2) {
        this.drv.tookBack = true;
        await sleep(500);
        await this.once("before-takeback", { settle: 0 });
        await sleep(450); // the strip films the two drops in first (it runs alongside: the tap must not beat its first frame)
        // (the drops are SVG bands with no data attribute: the bottom one is the lowest on screen)
        const at = await this.ev(() => { const rs = Array.from(document.querySelectorAll(".bo-drop")).map((e) => e.getBoundingClientRect()).filter((r) => r.width > 1 && r.height > 1).sort((x, y) => y.top - x.top); const r = rs[0]; return r ? [r.left + r.width / 2, r.top + r.height / 2] : null; }).catch(() => null);
        if (at) await this.healAct({ do: "tap", x: at[0], y: at[1], what: "take a drop back" });
        await sleep(700);
        await this.once("after-takeback", { settle: 0 });
      }
      // takeback (CLN-112): the first thing placed (not a tool pick, not the ✓) is tapped again where it went
      if (this.mode === "takeback" && game !== "boing" && !this.drv.tookBack && ["tap", "drag"].includes(a.do) && !(await tools()).includes(a.what)) {
        this.drv.tookBack = true;
        await sleep(400);
        await this.once("before-takeback", { settle: 0 });
        const [x, y] = a.do === "tap" ? [a.x, a.y] : a.pts[a.pts.length - 1];
        await this.healAct({ do: "tap", x, y, what: "take it back" });
        await sleep(700);
        await this.once("after-takeback", { settle: 0 });
      }
      // the game's middle: seven moves in, or (the short games: the scrape, the tooth, the fever have four to six moves) the side card's
      // open row past half its rows
      if (!mid && a.do !== "wait" && (steps > 6 || (await this.pastHalf()))) { mid = true; await this.once(`heal-${game}-mid`); }
      if (this.mode === "replay-tap") await this.replayTap();
      if (game === "knee") await this.kneeTurn();
      if (game === "fever") await this.feverChange();
      if (game === "eye") await this.eyeMoments();
    }
    if (this.fast) await mark(this.page, "heal-fast-done", { block: false });
    if (this.mode === "tap-during-speech" && !this.drv.spoke) this.rec.note("tap-during-speech: no line was said within 1.5 s of any move of this heal game");
  }
  // is the heal game's side card on a row past half its rows (its open row: .oc-row.next)?
  pastHalf() {
    return this.ev(() => {
      const card = Array.from(document.querySelectorAll(".cl-side .oc-card")).find((c) => !c.closest(".njg-rq-card, .njg-rq") && c.getBoundingClientRect().height > 1);
      if (!card) return false;
      const rows = Array.from(card.querySelectorAll(".oc-row"));
      const i = rows.findIndex((r) => r.classList.contains("next"));
      return rows.length >= 2 && i >= Math.ceil(rows.length / 2);
    }).catch(() => false);
  }
  // a driver's own move in a heal game instead of debug.next()'s (true: done, the loop asks again)
  async healDriver(game, a, next, tools) {
    const d = this.drv, m = this.mode;
    if (m === "idle-twice" && !d.idled) {
      d.idled = true;
      await sleep(8000);
      await this.once("idle-hint", { settle: 0 });
      await sleep(8000);
      await this.once("idle-again", { settle: 0 });
      return true;
    }
    if (m === "stuck" && !d.stuck) { d.stuck = true; await stuckWait(this.page, (n, o) => this.once(n, o)); return true; }
    if (m === "tap-during-speech" && !d.spoke) {
      // the doctor speaks between moves: at each move, up to 1.5 s for her next line (twenty moves at most), then the move at once
      d.tries = (d.tries || 0) + 1;
      const came = (await this.voice.speaking()) || !!(await this.voice.nextLine(1500));
      if (!came && d.tries < 20) return false;
      d.spoke = true;
      const b = came ? a : await next();
      const act = b && b.do !== "wait" ? b : a;
      await mark(this.page, "tap-during-speech", { block: false });
      await this.healAct(act);
      const still = await this.voice.speaking();
      const moved = await until(async () => JSON.stringify(await next()) !== JSON.stringify(act), 900, 30);
      await this.once(!came ? "tap-during-speech" : moved && still ? "tap-taken-while-speaking" : moved ? "tap-during-speech" : "tap-held-till-quiet", { settle: 0 });
      if (!came) this.rec.note("tap-during-speech: no line was said within 1.5 s of any of the first twenty moves");
      return true;
    }
    if (m === "wrong-thrice" && d.wrongs < 3) {
      let w = await this.ev(() => { const r = window.njgTest?.clinic.Stages.heal.current; return r && r.controller.debug && r.controller.debug.slip ? r.controller.debug.slip() : null; }).catch(() => null);
      if (!w && a.do === "tap") {
        const ids = await tools();
        const other = ids.includes(a.what) ? ids.find((t) => t !== a.what) : null;
        const c = other ? await this.centre(`.hs-tool[data-tool="${other}"]`) : null;
        if (c && c.onscreen) w = { do: "tap", x: c.x, y: c.y, what: `wrong tool ${other}` };
      }
      if (w) {
        d.wrongs++;
        await this.healAct(w);
        await sleep(450);
        await this.once(`wrong-${d.wrongs}`, { settle: 0 });
        return true;
      }
    } else if (m === "wrong-thrice" && d.wrongs >= 3) await this.once("shown-right", { settle: 0 });
    return false;
  }
  // CLN-62 evidence (s04-r2k2): the dropper over her eye after a "na", and the "I can see" moment before the pull-out
  async eyeMoments() {
    const s = await this.ev(() => { const r = window.njgTest?.clinic.Stages.heal.current; const d = r && r.controller.debug; return d ? { redrop: !!d.redrop, seeing: !!d.seeing } : {}; });
    if (s.redrop) await this.once("heal-eye-redrop", { settle: 0 });
    if (s.seeing) { await sleep(150); await this.once("heal-eye-can-see", { settle: 0 }); }
  }
  // CLN-100 evidence (s04-r2k2): a state after every bandage turn the knee draws
  async kneeTurn() {
    const n = await this.ev(() => document.querySelectorAll(".knee-turn").length);
    if (n > (this.turns || 0)) { this.turns = n; await this.once(`heal-knee-turn-${String(n).padStart(2, "0")}`, { settle: 0 }); }
  }
  // CLN-105 evidence (s04-r2k2): a state at every change of the gauge or her look, and a note when her bubble still says
  // "just right" while the gauge and her look say hot or cold (what she says, looks and the gauge must agree)
  async feverChange() {
    const s = await this.ev(() => {
      const g = document.querySelector("[data-reading]");
      const m = document.querySelector(".fv-mood");
      const b = Array.from(document.querySelectorAll(".cv-line")).map((e) => e.textContent.trim()).join(" / ");
      let ok = null;
      try { const L = window.Clinic.HealScene.L; const w = L.show(L.word("fever-just-right")); ok = (w.kutchi || w.english || "").replace(/[[\]]/g, "").trim(); } catch (e) { /* no engine */ }
      return { reading: g ? g.dataset.reading : "", mood: m ? m.dataset.state || "" : "", bubble: b, ok };
    });
    const sig = `${s.reading}|${s.mood}`;
    if (sig !== this.feverSig) {
      this.feverSig = sig;
      this.feverN = (this.feverN || 0) + 1;
      await this.once(`heal-fever-change-${String(this.feverN).padStart(2, "0")}`, { settle: 0 });
    }
    if (s.ok && s.mood && s.bubble.includes(s.ok)) this.rec.note(`CLN-105: she says "${s.ok}" while she looks ${s.mood} (gauge ${s.reading})`);
  }
}

export function clinicFlow({ id, title, query, level = 1, timeoutMs = 240000, onboard = false, done, extra, mode = "fair", sizes, levels = null }) {
  // flows/index.mjs resolveFlow builds a morning's path (clinic:morning#heal-fast) without naming its mode: the id carries it
  if (mode === "fair") { const m = /#([a-z][\w-]*)$/.exec(id || ""); if (m) mode = m[1]; }
  return {
    id, group: "clinic", title, timeoutMs: mode === "hint" ? timeoutMs + 120000 : timeoutMs, ...(sizes ? { sizes } : {}),
    async run(ctx) {
      const { page, rec } = ctx;
      // the evidence loop's spec can set the seed (a wanted order) and the profile: fresh (storage cleared, first-time help on) or seen (help off);
      // second-play keeps the help on (SH-46: help met in the first play is shown again after a pause in the second; with
      // &onboard=0 the heal games' ghost finger never plays at all: s04-hooks, Lifecycle.ghost counted 0)
      const help = ctx.profile === "fresh" || ctx.profile === "second-play" ? 1 : ctx.profile === "seen" ? 0 : onboard || mode === "hint" || mode === "stuck" ? 1 : 0;
      const q = `${query}&seed=${ctx.seed ?? SEED}&quiet=1&fast=${mode === "real-pace" || mode === "mistake-real" || mode === "tap-through-popup" || mode === "tap-card-1s" ? 0 : 1}${mode === "variant-e4" ? "&variant=E4" : ""}&nonav=1&onboard=${help}${mode === "lab-log-on" ? "&lab=1" : ""}`;
      if (ctx.profile === "fresh") { await page.goto(`${BASE}/clinic.html?lab=1&nonav=1&quiet=1`, { waitUntil: "load" }); await page.evaluate(() => localStorage.clear()); }
      // a morning at a level: every stage's saved level set first (the lab bar's page, then the morning with &nosave=1)
      if (levels) {
        await page.goto(`${BASE}/clinic.html?lab=1&nonav=1&quiet=1&fast=1`, { waitUntil: "load" });
        await page.waitForFunction(() => window.njgTest?.clinic && window.njgTest?.clinic.ready && window.Clinic && Clinic.Run, null, { timeout: 30000 });
        await page.evaluate((L) => { const s = Clinic.Run.state(); Clinic.Run.save({ ...s, levels: { waiting: L, diagnosis: L, pharmacy: L, heal: L, sendoff: L } }); }, levels);
      }
      await page.goto(`${BASE}/clinic.html?${q}`, { waitUntil: "load" });
      await page.waitForFunction(() => window.njgTest?.clinic && window.njgTest?.clinic.ready, null, { timeout: 30000 });
      // adapter: some games' debug drivers ask `__heal.run` (the heal-host lab's hook); here the same thing lives in njgTest.clinic
      await page.evaluate(() => { if (!window.__heal) Object.defineProperty(window, "__heal", { value: { get run() { return window.njgTest?.clinic.Stages.heal.current; }, get result() { return window.njgTest?.clinic.last; } } }); });
      await sleep(500);
      await openGrownUps(page, rec, ".cl-dock .njg-gu-btn");
      const P = new ClinicPlayer(page, rec, { mode });
      if (mode === "lab-log-on") await rec.state("lab-log-on", { settle: 300 });
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
  // S04-A (decision 76, the route run): the morning end to end at levels 2 and 3 (every stage's saved level)
  // s04-r2k2: session 3, two patients (session 2's own entry sets every stage to level 1, so it never played L2 or L3)
  for (const L of [2, 3]) f.push({ ...clinicFlow({ id: `clinic:morning@L${L}`, title: `Clinic: a morning (session 3, two patients) with every stage at level ${L}`, query: "morning=1&session=3&patients=2&nosave=1", level: L, levels: L, timeoutMs: 600000 }), deep: true });

  // ---- the deeper paths (run at the deep sizes): every level, then the mistake and hint players ----
  const D = (o) => f.push({ ...clinicFlow(o), deep: true });
  const STAGE_NAME = { waiting: "Waiting room", diagnosis: "Diagnosis", pharmacy: "Pharmacy (belt)", sendoff: "Send-off" };
  // levels: 1-3 for every stage; the waiting room goes on to 4 and 5 (the lab bar says so: "the waiting room only")
  for (const st of ["waiting", "diagnosis", "pharmacy", "sendoff"]) D({ id: `clinic:${st}@L2`, title: `Clinic: ${STAGE_NAME[st]}, level 2`, query: `stage=${st}&level=2`, level: 2 });
  for (const L of [4, 5]) D({ id: `clinic:waiting@L${L}`, title: `Clinic: Waiting room, level ${L} (the waiting room's own levels)`, query: `stage=waiting&level=${L}`, level: L });
  // S14 roll-out (the rulebook's section 3, Zafar 29-30 Oct): every heal game has its own L4 numbers, so each has an @L4 flow
  // (the ear's busier round, CLN-45, and the eye test's L4 had theirs before)
  for (const g of HEAL_GAMES) for (const L of [2, 3, 4]) D({ id: `clinic:heal-${g}@L${L}`, title: `Clinic: heal game ${g}, level ${L}`, query: `stage=heal&game=${g}&level=${L}`, level: L, timeoutMs: 200000 });
  for (const g of HEAL_EXTRA) f.push({ ...healExtraFlow(g), deep: true });
  // the end card with its grey ticks (mistakes) and dimmed bulb (hints) comes from a whole patient
  D({ id: "clinic:patient#mistake", title: "Clinic: One patient, level 1, mistake player (the end review with its wrong words)", query: "patient=1&level=1&results=1", mode: "mistake", timeoutMs: 600000 });
  D({ id: "clinic:patient#hint", title: "Clinic: One patient, level 1, hint player (the end card's dimmed bulb)", query: "patient=1&level=1&results=1", mode: "hint", timeoutMs: 600000 });
  D({ id: "clinic:patient@L2", title: "Clinic: One patient, end to end, level 2", query: "patient=1&level=2&results=1", level: 2, timeoutMs: 420000 });
  // mistake player: one wrong pick per stage, then on to the end (loud at level 1, quiet from level 2); heal games use their own slip
  // the diagnosis at level 1 is the fair flow's D1 (dots; its expect offers a wrong dot: CLN-93): without it the stage points, and a
  // point has no wrong pick, so the mistake player made none
  for (const st of ["waiting", "diagnosis", "pharmacy", "sendoff"]) for (const L of [1, 3]) D({ id: `clinic:${st}${L > 1 ? `@L${L}` : ""}#mistake`, title: `Clinic: ${STAGE_NAME[st]}, level ${L}, mistake player`, query: `stage=${st}&level=${L}${st === "diagnosis" && L === 1 ? "&variant=D1" : ""}`, level: L, mode: "mistake" });
  for (const g of HEAL_GAMES) D({ id: `clinic:heal-${g}#mistake`, title: `Clinic: heal game ${g}, level 1, mistake player (its own slip)`, query: `stage=heal&game=${g}&level=1`, mode: "mistake", timeoutMs: 200000 });
  // hint player: the idle hint, the light bulb's English flip, a peek at a closed card (from level 3: the waiting room and the pharmacy)
  for (const st of ["waiting", "diagnosis", "pharmacy", "sendoff"]) D({ id: `clinic:${st}#hint`, title: `Clinic: ${STAGE_NAME[st]}, level 1, hint player`, query: `stage=${st}&level=1`, mode: "hint" });
  for (const st of ["waiting", "pharmacy"]) D({ id: `clinic:${st}@L3#hint`, title: `Clinic: ${STAGE_NAME[st]}, level 3, hint player (the closed card)`, query: `stage=${st}&level=3`, level: 3, mode: "hint" });
  for (const g of HEAL_GAMES) D({ id: `clinic:heal-${g}#hint`, title: `Clinic: heal game ${g}, level 1, hint player`, query: `stage=heal&game=${g}&level=1`, mode: "hint", timeoutMs: 200000 });
  return f;
}
