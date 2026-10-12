// A fair Cook player: reads __cook.expectation() (what the game wants next) and does it with real pointer
// events at screen coordinates. A Node port of build/test_cook.py's Player, without the deliberate mistakes.
// It records each new view and each new kind of expectation as a state, once.
import { sleep, ROOT } from "./env.mjs";
import { waitBadges, readBadges } from "./results.mjs";
import { mark, watchVoice, until, canvasObjects, popupOpen, tapPopup, numberWords, isCountLine } from "../drivers/index.mjs";

// the evidence loop's named drivers this player plays (drivers/catalog.mjs, build/sandbox/data/evidence.json _drivers): each plays
// fair except for its one move (driverMove before an expectation is done, driverWatch on what the page shows, and a few in act())
const VOICE_MODES = new Set(["tap-during-speech", "tap-during-pause", "tap-quick"]);
const CALM = ["tap", "hold", "count", "more", "swipe", "roll", "knead", "stir"];
// tawa-empty-then-off (MAA-11): Cook's sizzle loop is in the sound log as "sfx/sizzle-loop" on every page (the game's own
// "njg-sfx" event, lib/sound.mjs 3b; s04-hooks), so this driver no longer wraps it

const STIR = { slow: 0.45, quick: 1.4, default: 0.7, spill: 3.4 };

// mode: "fair" does what the game asks. "mistake" makes the wrong pick, tap or amount where the mini-game allows it (a wrong item, the
// wrong greeting, one too many, a decoy sliced, the wrong stir speed), then goes on to the end. "hint" asks for help: it leaves the first
// thing alone until the hesitation hint and glow come (the lab is played unguided), presses the light bulb, and peeks at a closed card.
export class CookPlayer {
  constructor(page, rec, { speed = 3, prefix = "", mode = "fair" } = {}) {
    this.page = page; this.rec = rec; this.speed = speed; this.prefix = prefix; this.mode = mode;
    this.mistakes = mode === "mistake";
    // "takeback" (E14, R4): once something has been placed and the station offers to take it back
    // (__cook.expectation().undo), tap it back, then carry on to the end
    this.takeback = mode === "takeback";
    this.tookBack = 0;
    this.hints = mode === "hint";
    this.seen = new Set();
    // the "?" and bulb round (tryHelp) is the fair, mistake and take-back players' own: a driver's timing must not wait for it
    this.lastKey = null; this.repeats = 0; this.helped = this.hints || !["fair", "mistake", "takeback"].includes(mode); this.intros = 0;
    this.covers = new Set();
    this.taps = 0;
    this.made = new Set();   // the mistakes already made, by kind
    this.waited = false;     // the hesitation wait, once
    this.bulbs = 0;          // bulb presses in hint mode
    this.peeks = 0;
    this.badges = [];        // what the end card showed, for the report
    // the drivers' bookkeeping: wrongs made (n) and at which step (key), the chai pans' asked items, the last page flags
    this.drv = { n: 0, key: null, pan: null, panKeys: {}, poured: {}, choices: 0, choicesUp: false, doneRows: null, counted: false };
    this.voice = null;
    // from the first moment (the request pop-up reads before the play loop starts)
    if (VOICE_MODES.has(mode)) watchVoice(page).then((v) => { this.voice = this.voice || v; }).catch(() => {});
    if (mode === "tap-during-pause") this.drv.pause = this.pauseWatch().catch(() => null);
    this.afterIntro = null;  // a flow's own move once the first order card is in the sidebar (start-over)
  }
  onboardUp() { return this.page.evaluate("!!document.querySelector('.njg-onboard')").catch(() => false); }
  // tap-during-pause (LNG-07): from the start, watches the request pop-up's read-out (the probe's own events) and taps the play
  // area in the first pause of it: a line has ended, none is open for 80 ms, the pop-up is still up. Then pause-skipped (the
  // pop-up folded on the tap) or pause-kept
  async pauseWatch() {
    const p = this.page;
    const v = await watchVoice(p);
    this.voice = this.voice || v;
    const V = v.state();
    if (!V) { this.rec.note("tap-during-pause: no evidence probe on the page to hear the reading"); return null; }
    const t0 = Date.now();
    while (Date.now() - t0 < 90000) {
      if (V.popup && V.open.size === 0 && V.lastEnd > V.popupAt && Date.now() - V.lastEnd >= 80) {
        const at = await p.evaluate("(() => { const s = document.querySelector('#stage') || document.body; const r = s.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height * 0.75 }; })()").catch(() => null);
        if (at && V.popup && V.open.size === 0) {
          await mark(p, "tap-during-pause", { block: false });
          await p.mouse.click(at.x, at.y);
          await sleep(450);
          await this.once("tap-during-pause", { settle: 0 });
          await this.once((await popupOpen(p)) ? "pause-kept" : "pause-skipped", { settle: 0 });
          return true;
        }
      }
      await sleep(15);
    }
    this.rec.note("tap-during-pause: no pause in the pop-up's reading came");
    return null;
  }

  // ---- the drivers ----
  // what the page shows, each turn of the play loop: the fair path's moments (your turn, a retry, the daar going in) and the
  // drivers' records (the combined order served, a forced pass-me, a redone cup, the right way shown)
  async driverWatch(view) {
    const p = this.page, d = this.drv, m = this.mode;
    const s = await p.evaluate(() => {
      const C = window.Cook;
      const pm = document.querySelector("#passme");
      return {
        choices: !!document.querySelector("#choices:not(.hidden) .choice"),
        passme: !!pm && !pm.classList.contains("hidden") && pm.getBoundingClientRect().height > 2,
        doneRows: document.querySelectorAll("#mission .oc-row.done").length,
        // the done stamps on screen (a card folded away or a hidden sidebar does not count)
        stamps: Array.from(document.querySelectorAll(".oc-done-tk")).filter((e) => { const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; for (let x = e; x && x.nodeType === 1; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity < 0.05) return false; } return true; }).length,
        pans: C && C.chaiPans ? C.chaiPans() : null,
        daar: C ? C.daarPhase || null : null,
      };
    }).catch(() => null);
    if (!s) return;
    // the child's turn to answer (a greeting's reply pills): SH-71's every:your-turn
    if (s.choices && !d.choicesUp) { d.choices++; await mark(p, `your-turn-${d.choices}`); }
    d.choicesUp = s.choices;
    // a retry after a mistake (decision 51): the card's ticked rows open again (CHT-08)
    if (this.made.size !== (d.madeN || 0)) { d.madeN = this.made.size; d.madeView = view; }
    else if (this.made.size && d.doneRows != null && s.doneRows < d.doneRows && view === d.madeView && !d.retried) { d.retried = true; await mark(p, "retry", { settle: 250 }); }
    d.doneRows = s.doneRows;
    if (m === "serve-combined" && view === "service" && s.stamps >= 2) await this.once("served-combined", { settle: 300 });
    if (m === "force-passme" && s.passme) await this.once("passme-forced", { settle: 0 });
    if (s.pans) for (const q of s.pans) {
      // wrong-extra-person: a poured cup that comes back empty and cold is the wrong cup being redone (CHAI-11)
      if (m === "wrong-extra-person" && d.extraDone && (d.poured[q.who] || 0) > 0 && q.poured === 0 && q.state === "cold") await this.once("wrong-redo", { settle: 400 });
      d.poured[q.who] = Math.max(d.poured[q.who] || 0, q.poured || 0);
    }
    if (m === "wrong-spice-thrice" && d.n >= 3 && s.daar && s.daar !== "hot") await this.once("shown-right", { settle: 0 });
  }
  // a driver's own move instead of the expectation (true: done, the loop reads the next expectation)
  async driverMove(e) {
    const p = this.page, d = this.drv, m = this.mode;
    if (!e || e.intro || e.kind === "wait") return false;
    // idle-twice (MAA-13): at the first move, wait 8 s (the ghost finger), still no move, 8 s more, then play
    if (m === "idle-twice" && !d.idled && CALM.includes(e.kind)) {
      d.idled = true;
      await sleep(8000);
      await this.once("idle-hint", { settle: 0 });
      await sleep(8000);
      await this.once("idle-again", { settle: 0 });
      return true;
    }
    // wrong-thrice (CK-23): three wrong picks at the same step, one after the other, then the help and the right way
    if (m === "wrong-thrice") {
      if (e.kind === "tap" && d.n < 3 && e.swrongs && e.swrongs.length && (d.key == null || d.key === e.key)) {
        d.key = e.key;
        const w = e.swrongs[d.n % e.swrongs.length];
        d.n++;
        await this.tap(w.x, w.y, "wrong item");
        await sleep(450);
        await this.once(`wrong-${d.n}`, { settle: 0 });
        this.made.add("wrong-thrice");
        return true;
      }
      if (d.n >= 3 && e.key !== d.key) await this.once("shown-right", { settle: 0 });
    }
    // wrong-spice-thrice (DAAR-09): a wrong spice in the tadka on three tries (each try is the whole tadka again: the game
    // takes the seeds out and asks again), then the game shows the right way
    if (m === "wrong-spice-thrice" && e.kind === "tap" && e.swrongs && e.swrongs.length && d.n < 3 && (await p.evaluate("window.Cook && Cook.daarPhase").catch(() => null)) === "hot") {
      if (d.key == null) d.key = e.key;
      if (e.key === d.key && d.rightK) { d.rightK = false; d.inTry = false; }
      if (!d.inTry && e.key === d.key) {
        d.inTry = true;
        const w = e.swrongs[d.n % e.swrongs.length];
        d.n++;
        await this.tap(w.x, w.y, "wrong spice");
        await sleep(450);
        await this.once(`wrong-${d.n}`, { settle: 0 });
        return true;
      }
      if (e.key === d.key && d.inTry) d.rightK = true;
    }
    // wrong-extra-person (SH-50, CHAI-11): the last person's pan, once everything they asked for is in (the knob is next),
    // gets a spice from the shelf they did not ask for
    if (m === "wrong-extra-person" && e.kind === "tap" && e.key) {
      if (/^pan-/.test(e.key)) d.pan = e.key.slice(4);
      else if (d.pan && !/^(knob|pour)/.test(e.key)) (d.panKeys[d.pan] = d.panKeys[d.pan] || []).push(e.key);
      if (!d.extraDone && /^knob-on-/.test(e.key)) {
        const who = e.key.slice(8);
        const pans = await p.evaluate("window.Cook && Cook.chaiPans ? Cook.chaiPans() : []").catch(() => []);
        if (pans.length > 1 && pans[pans.length - 1].who === who) {
          const asked = new Set(d.panKeys[who] || []);
          const jars = (await canvasObjects(p, /^jar-/)).filter((j) => j.alpha > 0.05).map((j) => ({ ...j, id: j.key.slice(4) }));
          const free = jars.filter((j) => !/^cook-/.test(j.id) && j.id !== "spi-16" && !asked.has(j.id));
          const pick = free.find((j) => /aadu|veg-14/.test(j.id)) || free[0];
          d.extraDone = true;
          if (pick) {
            await this.tap(pick.x, pick.y, `unasked ${pick.id}`);
            await sleep(900);
            await this.once("wrong-extra-person", { settle: 0 });
            this.rec.note(`wrong-extra-person: put ${pick.id} in ${who}'s pan (they asked for ${[...asked].join(", ")})`);
            this.made.add("wrong-extra-person");
            return true;
          }
          this.rec.note(`wrong-extra-person: no spice jar ${who} did not ask for (jars: ${jars.map((j) => j.id).join(", ")})`);
        }
      }
    }
    // tap-during-speech (SH-20, PAN-11): a thing asked is tapped while a line is still being said. Nani speaks after a move (the
    // pantry's next "Muke ... de."): at each of the first ten taps, up to 3 s for her next line, else the tap as usual
    if (m === "tap-during-speech" && !d.spoke && e.kind === "tap" && !(await this.onboardUp())) {
      d.tries = (d.tries || 0) + 1;
      // a line's start is an event (a silent test-build line is open about 140 ms): tap at once, where the item already is
      const came = (await this.voice.speaking()) || !!(await this.voice.nextLine(3000));
      if (!came && d.tries < 10) return false;
      d.spoke = true;
      const cur = came ? e : await this.exp(); const t = cur && cur.kind === "tap" ? cur : e;
      await mark(p, "tap-during-speech", { block: false });
      await this.tap(t.sx, t.sy, t.key || "item");
      const still = await this.voice.speaking();
      const moved = await until(async () => JSON.stringify(await this.exp()) !== JSON.stringify(t), 900, 30);
      await this.once(!came ? "tap-during-speech" : moved && still ? "tap-taken-while-speaking" : moved ? "tap-during-speech" : "tap-held-till-quiet", { settle: 0 });
      if (!came) this.rec.note("tap-during-speech: no line was said within 3 s of any of the first ten taps");
      if (moved) await this.waitChange(t, 3000);
      return true;
    }
    // tawa-empty-then-off (MAA-11): the tawa lit with nothing on it (2 s), the knob turned off (high, low, off: 2 s), on again
    if (m === "tawa-empty-then-off" && !d.tawa && CALM.includes(e.kind)) {
      d.tawa = true;
      await mark(p, "tawa-empty", { block: false });
      await sleep(2000);
      await this.once("tawa-empty", { settle: 0 });
      const knob = (await canvasObjects(p, /^kit-knob-off$/))[0];
      if (!knob) { this.rec.note("tawa-empty-then-off: no burner knob (kit-knob-off) on the canvas"); return false; }
      await this.tap(knob.x, knob.y, "the knob (low)");
      await sleep(450);
      await this.tap(knob.x, knob.y, "the knob (off)");
      await sleep(300);
      await mark(p, "knob-off", { block: false });
      await sleep(2000);
      await this.once("knob-off", { settle: 0 });
      await this.tap(knob.x, knob.y, "the knob (high again)");
      await sleep(450);
      return true;
    }
    return false;
  }
  exp() { this.tExp = Date.now(); return this.page.evaluate("__cook.expectation()"); }
  gauge() { return this.page.evaluate("__cook.gauge()"); }
  // record a state once per flow
  async once(name, opts) { if (this.seen.has(name)) return; this.seen.add(name); await this.rec.state(this.prefix + name, opts); }

  async cover(x, y, what) {
    const tag = await this.page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e ? e.tagName + "#" + e.id + "." + (typeof e.className === "string" ? e.className : "") : "none"; }, [x, y]);
    if (!tag.startsWith("CANVAS")) {
      this.covers.add(`${what} at (${Math.round(x)},${Math.round(y)}) is covered by ${tag}`);
      this.rec.pend("covered", `canvas tap: ${what}`, `covered by ${tag} at (${Math.round(x)},${Math.round(y)})`);
    }
  }
  async tap(x, y, what = "tap") { await this.cover(x, y, what); await this.page.mouse.click(x, y); this.taps++; }

  async waitChange(prev, timeout = 20000) {
    const t0 = Date.now();
    const prevJ = JSON.stringify(prev);
    while (Date.now() - t0 < timeout) {
      const e = await this.exp();
      if (JSON.stringify(e) !== prevJ) return e;
      await sleep(60);
    }
    return this.exp();
  }

  async intro() {
    this.intros++;
    const p = this.page;
    // tap-through-popup (SH-64): the request pop-up is tapped 0.25 s after it opens (at test speed it folds by itself within a
    // second); a probe of its card takes it at "popup-open"
    if (this.mode === "tap-through-popup") {
      await until(() => popupOpen(p), 3000, 15);
      // at a child's pace (speed 1, S05-T2) the read-out is tapped half a second into the first line, so a cut-off would show;
      // at test speed it folds within ~0.25 s: tap as soon as it is seen open
      if (this.speed === 1) {
        const v = await watchVoice(p);
        if (await v.speaking() || await v.nextLine(3000)) await sleep(500); else this.rec.note("tap-through-popup: no line was said within 3 s of the pop-up opening");
      } else await sleep(60);
      if (await popupOpen(p)) {
        await mark(p, "tapped-through", { block: false });
        await tapPopup(p);
        await sleep(250);
        await this.once("tapped-through", { settle: 0 });
      } else this.rec.note("tap-through-popup: the pop-up folded by itself within 0.25 s");
      await sleep(600);
      if (this.intros === 1) await this.once("order-card-in-sidebar");
      if (this.intros === 1 && this.afterIntro) await this.afterIntro(this);
      return;
    }
    // tap-during-pause: its tap is the watcher's (pauseWatch); the pop-up may already have folded on it
    if (this.mode === "tap-during-pause" && this.drv.pause) await Promise.race([this.drv.pause, sleep(1500)]);
    if (this.mode === "tap-during-pause" && !(await popupOpen(p))) return;
    await sleep(120);
    if (this.intros === 1) await this.once("order-card-big", { settle: 150 });
    await sleep(400);
    if (await this.page.$("#intro:not(.hidden) .ic-card")) { try { await this.page.click("#intro .ic-card", { force: true, timeout: 2000 }); } catch (e) { /* it flew in by itself */ } }
    await sleep(600);
    if (this.intros === 1) await this.once("order-card-in-sidebar");
    if (this.intros === 1 && this.afterIntro) await this.afterIntro(this);
  }

  // the "?" and the order card's helpers, once per run (the first tap-kind moment)
  async tryHelp() {
    if (this.helped || !(await this.page.$("#btn-help"))) return;
    await sleep(400);
    if (await this.page.$(".njg-onboard")) return;
    this.helped = true;
    await this.page.click("#btn-help", { force: true }).catch(() => {});
    await sleep(300);
    if (await this.page.$("#help-pop:not(.hidden)")) {
      await this.once("help-open");
      await this.page.click("#btn-help", { force: true }).catch(() => {});
      await sleep(200);
    }
    const bulb = await this.page.$("#btn-bulb");
    if (bulb && (await bulb.isVisible()) && (await this.page.$("#mission:not(.hidden):not(.stamped)"))) {
      await bulb.click().catch(() => {});
      await sleep(120);
      if (await this.page.$("#side.english")) await this.once("bulb-english");
      const ms = await this.page.evaluate("Cook.UI.bulbMs() / Cook.speed");
      await sleep(ms + 400);
    }
  }

  async act(e) {
    const p = this.page, k = e.kind;
    if (k === "wait") { await sleep(50); return; }
    if (e.intro) { await this.intro(); return; }
    if (k === "click") {
      const sel = e.selector;
      if (this.mistakes && e.wrong && !this.made.has("click-wrong") && (await p.$(e.wrong))) {
        this.made.add("click-wrong");
        await p.click(e.wrong);
        await sleep(500);
        await this.once("wrong-choice");
      }
      await p.waitForSelector(sel, { state: "visible", timeout: 10000 });
      if (sel.includes(".njg-results")) {
        if (sel.includes("rs-next")) { await waitBadges(p); this.badges = await readBadges(p); } else await sleep(600);
        await this.once("results-" + (sel.includes("rs-next") ? "badges" : "words"));
      }
      await p.click(sel);
    } else if (k === "tap") {
      // mistake: a wrong item first (the first three different things asked for), then the right one
      if (this.mistakes && e.swrongs && e.swrongs.length && !this.made.has("tap:" + e.key) && this.made.size < 6) {
        this.made.add("tap:" + e.key);
        const w = e.swrongs[this.made.size % e.swrongs.length];
        await this.tap(w.x, w.y, "wrong item");
        await sleep(350);
        await this.once("wrong-tap", { settle: 0 });
        await sleep(500);
      }
      await this.tap(e.sx, e.sy, e.key || "item");
      // the daar station's bowl tipped into the pot (DAAR-10: the trivet stays on the counter)
      if (e.key === "daar") await mark(p, "daar-in", { settle: 60 });
    } else if (k === "hold") {
      await this.cover(e.sx, e.sy, "hold");
      await p.mouse.move(e.sx, e.sy); await p.mouse.down();
      const t0 = Date.now();
      while (Date.now() - t0 < 15000) { const g = await this.gauge(); if (g && g.level >= (g.lo + g.hi) / 2) break; await sleep(15); }
      await p.mouse.up();
    } else if (k === "timing") {
      // turn-early-late (SEK-09): the first skewer turned before its green, the next one after it, then fair
      if (this.mode === "turn-early-late" && e.key === "turn" && !this.drv.late) {
        if (!this.drv.early) {
          this.drv.early = true;
          await this.tap(e.sx, e.sy, "turn too early");
          await sleep(500);
          await this.once("wrong-early", { settle: 0 });
          return;
        }
        const t1 = Date.now();
        while (Date.now() - t1 < 15000) {
          const g = await this.gauge();
          if (g && g.level >= g.hi + 0.06) break;
          const cur = await this.exp();
          if (!cur || cur.kind !== "timing" || cur.x !== e.x || cur.y !== e.y) break;
          await sleep(15);
        }
        this.drv.late = true;
        await this.tap(e.sx, e.sy, "turn too late");
        await sleep(500);
        await this.once("wrong-late", { settle: 0 });
        return;
      }
      const t0 = Date.now();
      while (Date.now() - t0 < 30000) {
        const g = await this.gauge();
        if (g && g.level >= (g.lo + g.hi) / 2) break;
        const cur = await this.exp();
        if (cur && cur.kind !== "timing") return;
        if (cur && (cur.x !== e.x || cur.y !== e.y)) return;
        await sleep(15);
      }
      await this.tap(e.sx, e.sy, "timing");
    } else if (k === "count") {
      // wrong-count (SH-50): the first counted step gets one fewer than asked, and is closed
      const short = this.mode === "wrong-count" && !this.drv.counted && e.target >= 2;
      if (short) this.drv.counted = true;
      for (let i = 0; i < Math.max(0, e.target - (e.count || 0) - (short ? 1 : 0)); i++) { await this.tap(e.sx, e.sy, "count"); await sleep(350); }
      await sleep(300);
      await p.click("#done-btn").catch(() => {});
      if (short) { await sleep(400); await this.once("wrong-count", { settle: 0 }); this.made.add("wrong-count"); }
    } else if (k === "more") {
      if (this.mode === "wrong-count" && !this.drv.counted && e.target >= 2 && e.count === e.target - 1) {
        this.drv.counted = true;
        await p.click("#done-btn").catch(() => {});
        await sleep(500);
        await this.once("wrong-count", { settle: 0 });
        this.made.add("wrong-count");
      } else if (e.count < e.target) await this.tap(e.sx, e.sy, "another");
      else if (this.mistakes && e.extra && !this.made.has("more-extra")) {
        // one more than they asked for (the Maani line)
        this.made.add("more-extra");
        await this.tap(e.sx, e.sy, "one too many");
        await sleep(400);
        await this.once("wrong-extra", { settle: 0 });
      } else await p.click("#done-btn").catch(() => {});
    } else if (k === "knead") {
      for (let i = 0; i < 10; i++) { await this.tap(e.sx, e.sy, "knead"); await sleep(100); if (JSON.stringify(await this.exp()) !== JSON.stringify(e)) break; }
    } else if (k === "roll") {
      const cx = e.sx, cy = e.sy, r = e.sr;
      let y = cy + r * 0.7, sign = -1;
      await p.mouse.move(cx, y); await p.mouse.down();
      for (let i = 0; i < 20; i++) {
        const g = await this.gauge();
        if (g && g.level >= 0.95) break;
        const cur = await this.exp();
        if (!cur || cur.kind !== "roll") break;
        const f = Math.min(1, Math.max(0.15, (1 - (g ? g.level : 0)) / 0.3));
        const n = Math.max(2, Math.round(8 * f));
        const y0 = y;
        for (let s = 1; s <= n; s++) { y = y0 + sign * (r * 1.4 * f) * s / n; await p.mouse.move(cx, y); }
        sign = -sign;
      }
      await p.mouse.up();
      await sleep(500);
    } else if (k === "swipe" || k === "slice") {
      if (k === "slice" && this.mistakes && e.swrongs && e.swrongs.length && !this.made.has("slice-wrong")) {
        // one slice through a decoy in flight
        this.made.add("slice-wrong");
        const w = e.swrongs[0];
        await p.mouse.move(w.x - 60, w.y - 20); await p.mouse.down();
        for (let s = 1; s <= 4; s++) await p.mouse.move(w.x - 60 + 120 * s / 4, w.y - 20 + 40 * s / 4);
        await p.mouse.up();
        await sleep(150);
        await this.once("wrong-slice", { settle: 0 });
        return;
      }
      await p.mouse.move(e.sx1, e.sy1); await p.mouse.down();
      const steps = k === "slice" ? 1 : 10;
      for (let s = 1; s <= steps; s++) {
        await p.mouse.move(e.sx1 + (e.sx2 - e.sx1) * s / steps, e.sy1 + (e.sy2 - e.sy1) * s / steps);
        if (k === "swipe") await sleep(10);
      }
      if (k === "slice") {
        // the chop aims where a vegetable will be when the cut lands: tell it how long our swipes take
        const lat = (Date.now() - this.tExp) / 1000;
        const old = this.lead || 0.25;
        this.lead = old * 0.6 + lat * 0.4;
        if (Math.abs(this.lead - old) > 0.05) await p.evaluate((v) => { window.__cookSwipeLead = v; }, +this.lead.toFixed(3));
      }
      await p.mouse.up();
    } else if (k === "stir") {
      await this.stir(e);
    } else throw new Error(`unknown expectation ${k}`);
  }

  async stir(e) {
    const p = this.page;
    const cx = e.sx, cy = e.sy, r = e.srx, target = e.target;
    let speed = e.speed, a = 0, count = e.count || 0;
    // mistake: slosh back and forth far too fast (it spills; not a lap), then the wrong speed until Nani says it
    const mistake = this.mistakes && !this.made.has("stir");
    if (mistake) this.made.add("stir");
    await p.mouse.move(cx + r, cy); await p.mouse.down();
    const t0 = Date.now();
    let anchorT = t0, anchorA = 0, curWant = null, shot = false;
    while (count < target && Date.now() - t0 < 90000) {
      const now = Date.now();
      let want = STIR[speed == null ? "default" : speed];
      const wiggle = mistake && now - t0 < 1200;
      // the slosh's moment, once it has gone on 0.7 s (a slow page can step past the wiggle's window: record it on the next turn)
      if (mistake && !shot && now - t0 > 700) { shot = true; await this.once("wrong-stir", { settle: 0 }); }
      if (mistake && !wiggle && speed && count < target - 1 && now - t0 < 3800) want = STIR[speed === "slow" ? "quick" : "slow"];
      if (wiggle) {
        a = 0.9 * Math.sin(2 * Math.PI * 5 * (now - t0) / 1000);
        anchorT = now; anchorA = a; curWant = null;
      } else {
        if (want !== curWant) { curWant = want; anchorT = now; anchorA = a; }
        const goal = anchorA + 2 * Math.PI * want * (now - anchorT) / 1000;
        a += Math.min(goal - a, 1.2);
      }
      await p.mouse.move(cx + r * Math.cos(a), cy + r * Math.sin(a));
      const cur = await this.exp();
      // the slosh spilled and the stir stopped to say so (Nani speaks; the stir comes back after): that is the wrong stir's moment
      if (!cur || cur.kind !== "stir") { if (mistake && !shot && Date.now() - t0 < 1500) { shot = true; await this.once("wrong-stir", { settle: 0 }); } break; }
      if ((cur.count || 0) >= 1 && count < 1) await this.once("stir-mid");
      count = cur.count != null ? cur.count : count;
      speed = cur.speed;
      await sleep(5);
    }
    await p.mouse.up();
    const t1 = Date.now();
    while (Date.now() - t1 < 5000) { const cur = await this.exp(); if (!cur || cur.kind !== "stir") break; await sleep(50); }
  }

  // the hint player's moves, at the first things it is asked to do: wait for the hesitation hint and glow, press the light bulb (three
  // times over the run: the end card's bulb goes dim), peek at a folded card
  async hintMoves(e) {
    const p = this.page;
    const calm = ["tap", "hold", "count", "more", "swipe", "roll"].includes(e.kind); // not the timed gestures: a wait would cost the window
    if (calm && !this.waited) {
      this.waited = true;
      // the lab is unguided: Nani names the thing after the word's hesitation delay, and it glows 4 s later (real time, not game time)
      const d = await p.evaluate("Cook.hintDelay(Object.keys(Cook.save.words)[0] || 'x')").catch(() => 4000);
      await sleep(Math.min(d, 13000) + 700);
      await this.once("hint-nani-says", { settle: 0 });
      await sleep(4300);
      await this.once("hint-glow", { settle: 0 });
    }
    // peek at a folded card (a closed order card: from level 3 the call is heard, not read)
    if (this.peeks < 2) {
      const closed = await p.$("#side .oc-card.closed.folded .oc-head");
      if (closed && (await closed.isVisible())) {
        this.peeks++;
        await closed.click({ force: true }).catch(() => {});
        await sleep(300);
        await this.once("peek-open", { settle: 0 });
        await sleep(300);
      }
    }
    if (calm && this.bulbs < 3 && !this.bulbBusy) {
      const bulb = await p.$("#btn-bulb");
      if (bulb && (await bulb.isVisible()) && (await p.$("#mission:not(.hidden):not(.stamped)"))) {
        this.bulbBusy = true;
        try {
          await bulb.click({ force: true }).catch(() => {});
          this.bulbs++;
          await sleep(120);
          if (await p.$("#side.english")) await this.once("bulb-english", { settle: 0 });
          const ms = await p.evaluate("Cook.UI.bulbMs() / Cook.speed");
          await sleep(ms + 400);
        } finally { this.bulbBusy = false; }
      }
    }
  }

  // play until until() says so. Records `view-<name>` and `kind-<kind>` once each.
  async play(until, { timeout = 300000, closeKitchenAfter = null } = {}) {
    try { return await this.playLoop(until, { timeout, closeKitchenAfter }); } finally { if (this.drv.poll) clearInterval(this.drv.poll); }
  }
  async playLoop(until, { timeout = 300000, closeKitchenAfter = null } = {}) {
    const t0 = Date.now();
    let lastKind = null, lastView = null, idle = 0, closed = false;
    if (VOICE_MODES.has(this.mode)) this.voice = await watchVoice(this.page);
    if (this.mode === "tap-quick") {
      // tap-quick (PAN-12): each count word as it starts (drv:count-word), so the gap between them is measured
      const nums = await numberWords(ROOT), since = await this.voice.now(), marked = new Set();
      let busy = false;
      this.drv.poll = setInterval(async () => {
        if (busy) return;
        busy = true;
        try { for (const l of await this.voice.lines(since)) { const k = `${l.t0}|${l.text}`; if (!marked.has(k) && isCountLine(l.text, nums)) { marked.add(k); await mark(this.page, "count-word", { block: false }); } } } catch (e) { /* the page moved on */ }
        busy = false;
      }, 40);
    }
    while (!(await until())) {
      // open kitchen (free cooking): close it ourselves once enough customers have been served
      if (closeKitchenAfter != null && !closed) {
        const served = await this.page.evaluate("__cook.state().dayCards").catch(() => 0);
        if (served >= closeKitchenAfter && (await this.page.$("#close-kitchen:not([disabled])"))) {
          await this.once("close-kitchen");
          await this.page.click("#close-kitchen");
          closed = true;
          await sleep(200);
        }
      }
      if (Date.now() - t0 > timeout) { await this.once("timeout"); throw new Error(`timed out after ${Math.round((Date.now() - t0) / 1000)}s playing (last expectation ${JSON.stringify(lastKind)}, view ${lastView})`); }
      let view = null;
      try { view = await this.page.evaluate("__cook.state().view"); } catch (e) { /* navigating */ }
      if (view !== lastView) {
        lastView = view;
        await sleep(300);
        const ex = await this.exp();
        if (!ex || !["timing", "hold", "slice"].includes(ex.kind)) await this.once(`view-${view}`);
      }
      await this.driverWatch(view);
      const e = await this.exp();
      if (!e) { await sleep(100); if (++idle > 600) { await this.once("stuck"); throw new Error("no expectation for 60 s"); } continue; }
      idle = 0;
      if (e.kind === "click" && ["#sum-shop", "#sum-finale", "#shop-done", "#t-start", "#t-free", "#fin-menu", "#lab-list", ".njg-results #lab-list"].includes(e.selector)) { await sleep(100); continue; }
      if (e.kind === "tap" && !this.helped && !(await this.page.evaluate("Cook.save.mode === 'busy' || !!document.querySelector('.njg-onboard')"))) { await this.tryHelp(); continue; }
      if (e.intro) { lastKind = "intro"; await this.act(e); await this.waitChange(e, 10000); continue; }
      if (this.takeback && !this.tookBack && e.undo && e.kind === "tap") {
        this.tookBack++;
        await this.once("before-takeback");
        await this.tap(e.undo.x, e.undo.y, "take it back");
        await sleep(700);
        await this.once("after-takeback");
        continue;
      }
      if (this.hints && !(await this.page.evaluate("!!document.querySelector('.njg-onboard')"))) await this.hintMoves(e);
      if (this.mode !== "fair" && (await this.driverMove(e))) { lastKind = e.kind; continue; }
      if (e.kind !== "wait" && e.kind !== lastKind) await this.once(`kind-${e.kind}`, { settle: ["timing", "hold", "slice", "stir", "roll"].includes(e.kind) ? 0 : 150 });
      lastKind = e.kind;
      // a swipe has no x/y, only x1..y2: leave them out and a round with more than 8 swipes in a row (3 samosas, 3 folds each) looks stuck
      const key = JSON.stringify({ kind: e.kind, key: e.key, x: e.x, y: e.y, selector: e.selector, x1: e.x1, y1: e.y1, x2: e.x2, y2: e.y2 });
      this.repeats = key === this.lastKey && !["wait", "slice"].includes(e.kind) ? this.repeats + 1 : 0;
      this.lastKey = key;
      if (this.repeats > 8) { await this.once("stuck"); throw new Error(`stuck repeating ${key}`); }
      await this.act(e);
      if (!["wait", "slice"].includes(e.kind)) await this.waitChange(e, 25000);
    }
  }
}
