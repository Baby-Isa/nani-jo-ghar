/*
 * Stage 1, the waiting room: "Who's next?" Clinic v2 (docs/game-design/modes/clinic.md W;
 * Zafar's W3/W4/W5, CQ1/CQ2), on CB1b: the six-seat bench, the standing spots
 * by the doctor's door and the desk, two little stools in front at the top
 * levels. The doctor leans out of his half-open door and calls
 * "[Bring in] {description}"; the child taps the TICK under that person: it
 * shakes if wrong and locks in if right. Nobody moves until chosen; then the
 * chosen one rises up off the seat and stays raised (13: no walk, no slide).
 * At most 6 in the room, never two identical (13). From level 3 the card is
 * closed: the call is heard, and a tap on the card is the paid peek (13a).
 * W4: tap everyone, then the set is judged (13a). W3 left the mix (13). The level is the language ladder
 * (js/clinic/pipeline.js P.waiting): man/woman/boy/girl, + old/young,
 * + tall/short, + a colour, + with the baby/child (English placeholders, to record).
 *   W1 one call · W3 the child calls them (a speaking moment, the pills as the
 *   fallback) · W4 two in the called order, with the comfort rings.
 * A wrong tick at level 1: the person shakes their head and the doctor says the
 * line once more (the one gentle correction). From level 2 it just shakes (UX s11).
 * Stand-ins: the rough people (sitting on their stools), recoloured for the
 * colour rung; the doctor's rough sprite in the doorway.
 */
(function (global) {
  "use strict";
  const Clinic = global.Clinic;
  const Kit = Clinic.Kit;
  const S = Clinic.Stages;
  const h = Kit.h;

  // the rough sprite kinds that stand in for each kind (a second one when two share a kind)
  const SPRITES = { uncle: ["uncle"], "old-man": ["old-man"], auntie: ["auntie"], "old-woman": ["old-woman", "bigma"], boy: ["boy", "cousin"], girl: ["girl"] };
  const TICK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function spriteFor(b, used) {
    if (b.with === "baby") return Kit.person("baby", "neutral"); // the woman holding the baby
    const list = SPRITES[b.kind] || [b.kind];
    const n = used[b.kind] = (used[b.kind] || 0) + 1;
    return Kit.person(list[(n - 1) % list.length], "neutral") || Kit.person(list[0], "neutral");
  }

  /** One person in the room: the sprite (recoloured for the colour rung), the child beside them, the tick under them. */
  function personEl(box, cfg, b, i, used) {
    const slot = cfg.slots[b.slot] || cfg.slots.bench0;
    const child = b.who === "boy" || b.who === "girl";
    const hgt = cfg.adult * (child ? cfg.child : 1) * (b.height === "tall" ? cfg.tall : b.height === "short" ? cfg.short : 1) * (slot.scale || 1);
    const wrap = S.place(h("div", `cl-wp${child ? " child" : ""}`, box), { x: slot.x, y: slot.y, h: hgt, z: slot.z });
    wrap.dataset.seat = String(i);
    wrap.dataset.slot = b.slot;
    const src = spriteFor(b, used);
    const fig = h("div", "cl-wp-fig", wrap);
    const img = h("img", "cl-wp-img", fig);
    img.alt = "";
    img.draggable = false;
    if (src) img.src = Kit.url(src);
    if (b.colour) {
      // the colour rung: the clothes (the middle band of the sprite) take the colour; a stand-in for the art
      const tint = h("div", "cl-wp-tint", fig);
      tint.style.setProperty("--tint", Kit.COLOURS[b.colour] || b.colour);
      tint.style.setProperty("--mask", `url("${img.src}")`);
      wrap.dataset.colour = b.colour;
    }
    if (b.with === "child") {
      const k = h("img", "cl-wp-kid", wrap);
      k.alt = "";
      k.draggable = false;
      k.src = Kit.url(Kit.person(i % 2 ? "girl" : "boy", "neutral"));
    }
    // the tick under them (the one thing to tap: W3)
    const tick = S.place(h("button", "cl-wtick", box), { x: slot.x, y: Math.min(0.995, slot.y + 0.075), z: 20 });
    tick.type = "button";
    tick.dataset.seat = String(i);
    tick.setAttribute("aria-label", "This one");
    tick.innerHTML = TICK;
    // A2 (5 Oct, F1's finding): a spot low in the room (the desk) put its tick under a phone's crop (10 px off at
    // 844x390): after each fit the tick is lifted just enough to stay on screen, never moved otherwise
    const keepIn = () => {
      tick.style.marginTop = "";
      const view = box.parentElement;
      if (!view || !tick.isConnected) return;
      const over = tick.getBoundingClientRect().bottom - (view.getBoundingClientRect().bottom - 4);
      if (over > 0) tick.style.marginTop = `${-Math.ceil(over)}px`;
    };
    box.addEventListener("scenefit", keepIn);
    if (global.requestAnimationFrame) global.requestAnimationFrame(keepIn);
    else keepIn();
    return { wrap, tick, b, i, gone: false };
  }

  S.waiting = {
    async run(env, plan) {
      const { screen, data } = env;
      const res = S.result("waiting");
      const stage = S.room(screen, "waiting");
      stage.dataset.variant = plan.variant;
      stage.dataset.level = String(plan.level);
      const box = stage.scene || stage;
      const cfg = stage.sceneCfg && stage.sceneCfg.slots ? stage.sceneCfg : null;
      // the doctor leans out of his half-open door (the rough sprite's top half: a stand-in)
      const doc = S.place(h("div", "cl-wdoc", box), { x: cfg.doctor.x, y: cfg.doctor.y + cfg.doctor.h, h: cfg.doctor.h, z: 1 });
      const dimg = h("img", "", doc);
      dimg.alt = "";
      dimg.src = Kit.url(Kit.person("doctor", "neutral") || Kit.sprite("doctor-neutral"));
      Kit.Voice.speakers.doctor = () => doc;
      const used = {};
      const seats = plan.bench.map((b, i) => personEl(box, cfg, b, i, used));
      if (plan.variant === "W4") {
        seats.forEach((s) => {
          const ring = h("div", "cl-ring", s.wrap);
          ring.style.setProperty("--t", `${Math.round(plan.ringsMs * (0.5 + 0.5 * env.rng()))}ms`);
          s.ring = ring;
        });
      }
      Kit.Voice.speakers.bench = null;

      // the why beat (G5): the doctor looks out, then calls. Input is live at once (13i): nothing waits for the talking
      doc.classList.add("lean");
      S.pose(doc, "front");
      S.say(S.line(env, "why-waiting"), "doctor");
      // from level 3 the card is closed: the call is heard, not read; a tap on it is the paid peek (13a, 13c)
      const closed = plan.level >= 3;
      await S.request(screen, { title: "", rows: plan.card, closed, onPeek: () => screen.peek("waiting-card") });
      let callIdx = 0;
      const rows = plan.rows;
      const W4 = plan.variant === "W4";
      let corrected = false;
      let busy = false;
      let finish;
      const done = new Promise((r) => (finish = r));
      let picks = []; // W4: the ticks tapped so far, in order (numbered 1, 2)

      S.setExpect("waiting", () => {
        const r = rows[callIdx];
        if (busy) return { stage: "waiting", kind: "wait" };
        if (W4 && picks.length < rows.length) {
          const want = rows[picks.length];
          return { stage: "waiting", kind: "tap", target: `.cl-wtick[data-seat="${want.answer}"]`, wrong: `.cl-wtick:not([data-seat="${want.answer}"]):not(.locked):not(.picked)` };
        }
        if (!r) return { stage: "waiting", kind: "button" };
        if (r.voice) return { stage: "waiting", kind: "say", choice: plan.bench[r.answer].who };
        return { stage: "waiting", kind: "tap", target: `.cl-wtick[data-seat="${r.answer}"]`, wrong: `.cl-wtick:not([data-seat="${r.answer}"]):not(.locked)` };
      });

      // the chosen one rises up off the seat and stays raised (13: no walk, no slide to the door)
      const rise = async (s) => {
        s.gone = true;
        s.wrap.classList.add("risen");
        Kit.Voice.speakers.patient = () => s.wrap;
        await Kit.wait(Kit.fast ? 60 : 450);
        S.say(S.line(env, "salaam"), "patient");
        S.say(S.line(env, "salaam-back"), "doctor");
      };

      const onRight = async (s, r) => {
        busy = true;
        s.tick.classList.add("locked");
        if (global.Sfx && global.Sfx.right) try { global.Sfx.right(); } catch (e) { /* no sound */ }
        screen.card.tick(r.id);
        S.signal("clinic-waiting-tap");
        await rise(s);
        callIdx++;
        busy = false;
        if (callIdx >= rows.length) finish();
      };
      const onWrong = async (s) => {
        busy = true;
        s.tick.classList.remove("nope");
        void s.tick.offsetWidth;
        s.tick.classList.add("nope");
        s.wrap.classList.add("puzzled");
        await Kit.wait(Kit.fast ? 80 : 700);
        s.tick.classList.remove("nope");
        s.wrap.classList.remove("puzzled");
        busy = false;
        if (plan.level <= 1 && !corrected) {
          corrected = true;
          S.say(plan.card[0], "doctor");
        }
      };
      // W4 (13a): tap everyone straight away, each tick showing its number; the whole set is judged once the
      // last one is tapped (a numbered tick tapped again is taken back: UX 17). All right: they lock in and rise;
      // any wrong: the ticks shake and clear, and everyone sits back down to try again. The first set is scored.
      const number = () => seats.forEach((x) => {
        const k = picks.indexOf(x.i);
        x.tick.classList.toggle("picked", k >= 0);
        x.tick.dataset.n = k >= 0 ? String(k + 1) : "";
      });
      const judgeSet = async () => {
        busy = true;
        const ok = rows.map((r, k) => global.ClinicPipeline.judgeWho(r, picks[k]));
        rows.forEach((r, k) => res.judge(r, ok[k]));
        res.log.push({ type: ok.every(Boolean) ? "right" : "wrong", rowId: "set", detail: picks.map((i) => plan.bench[i].kind).join(",") });
        await Kit.wait(Kit.fast ? 40 : 350);
        if (ok.every(Boolean)) {
          for (let k = 0; k < picks.length; k++) {
            const s = seats[picks[k]];
            s.tick.classList.add("locked");
            screen.card.tick(rows[k].id);
            await rise(s);
          }
          if (global.Sfx && global.Sfx.right) try { global.Sfx.right(); } catch (e) { /* no sound */ }
          S.signal("clinic-waiting-tap");
          callIdx = rows.length;
          busy = false;
          finish();
          return;
        }
        picks.forEach((i) => {
          const s = seats[i];
          s.tick.classList.remove("nope");
          void s.tick.offsetWidth;
          s.tick.classList.add("nope");
          s.wrap.classList.add("puzzled");
        });
        await Kit.wait(Kit.fast ? 80 : 700);
        seats.forEach((s) => s.wrap.classList.remove("puzzled", "risen", "standing"));
        seats.forEach((s) => s.tick.classList.remove("nope"));
        picks = [];
        number();
        busy = false;
      };

      seats.forEach((s, i) => {
        s.tick.addEventListener("click", async () => {
          if (busy || s.gone || s.tick.classList.contains("locked")) return;
          if (W4) {
            const k = picks.indexOf(i);
            if (k >= 0) picks.splice(k, 1); // take it back (UX 17)
            else picks.push(i);
            s.wrap.classList.toggle("standing", picks.includes(i));
            number();
            if (picks.length === rows.length) await judgeSet();
            return;
          }
          const r = rows[callIdx];
          if (!r || r.voice) return;
          const ok = global.ClinicPipeline.judgeWho(r, i);
          res.judge(r, ok);
          res.log.push({ type: ok ? "right" : "wrong", rowId: r.id, detail: plan.bench[i].kind });
          if (ok) await onRight(s, r);
          else await onWrong(s);
        });
      });

      // the first-ever session: the ghost finger taps the tick under the one called (UX s8; taught)
      if (env.first) S.onboard(env, "waiting", [{ spotlight: seats[rows[0].answer].tick, ghost: { gesture: "tap" }, wait: "clinic-waiting-tap" }]);

      // W3: the child calls them (a speaking moment); the one who matches what was heard stands
      if (rows[0] && rows[0].voice) {
        const r = rows[0];
        const whos = Array.from(new Set(plan.bench.map((b) => b.who)));
        const target = plan.bench[r.answer].who;
        const word = (k) => global.ClinicPipeline.line(data, "come", { kind: global.ClinicPipeline.describe(data, { who: k }, ["kind"]) });
        const out = await S.moment(env, {
          choices: whos,
          expected: target,
          word,
          caption: Kit.plain(S.line(env, "cap-callthem")).replace(/[.!?]$/, ""), // a caption, no full stop
          character: {
            act: async (k) => {
              const s = seats.find((x) => x.b.who === k && !x.gone);
              if (!s) return;
              s.wrap.classList.add("standing");
              await Kit.wait(500);
              if (k !== target) {
                s.wrap.classList.add("puzzled");
                await Kit.wait(600);
                s.wrap.classList.remove("puzzled", "standing");
              }
            },
          },
          accept: (k) => {
            res.judge(r, k === target);
            return k === target;
          },
        });
        res.moments.push(out);
        const s = seats[r.answer];
        s.wrap.classList.remove("standing");
        callIdx = 0;
        await onRight(s, r);
      }

      // W4: the comfort rings (the only timer; nobody can lose: an empty ring rocks and refills)
      if (plan.variant === "W4") seats.forEach((s) => s.ring && s.ring.addEventListener("animationiteration", () => s.wrap.classList.add("rock")));

      await done;
      S.current = null;
      S.endOnboard();
      await S.button(screen, S.line(env, "where"));
      res.words.push(plan.calls[plan.calls.length - 1].say);
      return res;
    },
  };
})(typeof self !== "undefined" ? self : this);
