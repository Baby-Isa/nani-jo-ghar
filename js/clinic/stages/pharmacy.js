/*
 * Stage 3, the pharmacy counter: "Bring me..." (docs/archive/clinic/clinic-design-v1.md
 * P4, Q1, Q3, Q5; clinic v2: docs/game-design/modes/clinic.md P). On
 * CB4c the items ride the PAINTED belt, right to left, edge to edge: no
 * hatches, they slide in from off-screen and out the other side, and the
 * loop brings them round again: nothing is ever lost and nobody can lose.
 * Level 3 is a faster belt with the items closer together; no timer (CQ5). The doctor's
 * prescription is the request card. The child TAPS the asked item as it
 * passes (tap at every level, Q1): it hops into the next empty dish of the
 * fixed-slot tray (bottom right: always as many dishes as asked, never a
 * picture of what's wanted). A counted item (level 3) adds to its own dish.
 * When the tray is full the doctor lifts each dish and names it (the
 * handover check, R3.1): a wrong one goes back on the belt with its name, so
 * the heal stage always starts with the right tray. The rows are judged on
 * the first handover (and the order of taps at level 3). The belt stopper
 * (level 3) pauses the belt: a hint, like the light bulb.
 */
(function (global) {
  "use strict";
  const Clinic = global.Clinic;
  const Kit = Clinic.Kit;
  const S = Clinic.Stages;
  const h = Kit.h;
  const PL = () => global.ClinicPipeline;

  /**
   * The request pop-up (decision 53, T27; S03-A, CLN-84, SH-64): the shared one (js/shared/request-popup.js), the same
   * as Cook's and every heal game's, through the shared lifecycle (S04-B). The doctor's card at full size over the play area, read out row by row (the
   * read-along); a tap anywhere stops the voice at once and folds it into the sidebar; then the belt runs, quiet.
   */
  S.requestPopup = function (screen, { title, rows, ordered, face }) {
    const LC = global.Lifecycle; // S04-B: through the shared lifecycle (decision 75 (1))
    if (!LC) return Promise.resolve({ skipped: false });
    let card = null;
    return LC.request({
      reason: "clinic:pharmacy",
      host: screen.main,
      target: () => screen.card.el,
      fast: Kit.fast,
      wait: (ms) => Kit.wait(ms),
      build(box) {
        card = new Kit.Card(box, { who: "doctor", big: true });
        card.isOrdered = !!ordered;
        card.titleText = title || "";
        card.faceEl = face || S.doctorFace();
        card.setRows(rows.map((r) => Object.assign({}, r)));
      },
      read: () => card.speak(),
      onStop: () => Kit.Voice.clear(),
    });
  };
  const requestPopup = S.requestPopup;

  S.pharmacy = {
    async run(env, plan) {
      const { screen, data } = env;
      Kit.Voice.clear(); // the voice stop at the stage change (CLN-109): the diagnosis's last lines never queue ahead of the request
      const res = S.result("pharmacy");
      const stage = S.room(screen, "pharmacy");
      stage.classList.add("cl-pharmacy");
      const box = stage.scene;
      const cfg = stage.sceneCfg || {};
      const belt = h("div", `cl-belt${box ? " v2" : ""}`, stage);
      const track = h("div", "cl-belt-track", belt);
      // the tray on the counter strip, pantry style (outlined dishes)
      const trayBox = h("div", `cl-counter-tray${box ? " v2" : ""}`, box || stage);
      if (box && cfg.tray) S.place(trayBox, { x: cfg.tray.x, y: cfg.tray.y, z: 5 });
      // a tap on a filled dish takes the item back until ✓ Done (13b, UX 17); the first placement is scored
      const tray = new Kit.Tray(trayBox, plan.asked.length, { onTap: (i) => takeBack(i) });
      // the belt band sits on the painted belt: the items' bases on its surface, the band across the whole stage
      const fitBelt = () => {
        if (!box || cfg.beltY == null) return;
        const top = box.offsetTop + (cfg.beltY - cfg.itemH) * box.clientHeight;
        Object.assign(belt.style, { top: `${top}px`, height: `${cfg.itemH * box.clientHeight}px` });
        belt.style.setProperty("--item", `${cfg.itemH * box.clientHeight}px`);
        // the tray stays inside the play area on a short screen (phone landscape cut its bottom off)
        trayBox.style.marginTop = "0px";
        const tr = trayBox.getBoundingClientRect();
        const sr = stage.getBoundingClientRect();
        const over = tr.bottom - (sr.bottom - 6);
        if (over > 0) trayBox.style.marginTop = `${-over}px`;
      };
      fitBelt();
      if (box) box.addEventListener("scenefit", fitBelt);
      screen.trayWrap.classList.add("hidden");
      const st = PL().beltState(plan);
      const wordOf = (it) => PL().itemWord(data, it.id, it);

      // T27, decision 53 (P1, P8, CLN-84): the request first. The doctor's [Bring me] ... comes up in a pop-up over the
      // counter and is read out (a tap skips it); then it folds into the sidebar and the belt starts, quiet.
      // From level 3 the sidebar card is closed: the counts and the order are heard, not read (13c, Q7)
      screen.setNani(null);
      await requestPopup(screen, { title: plan.cardHead || "", rows: plan.card, ordered: plan.card.some((r) => r.seq) });
      await S.request(screen, { title: plan.cardHead || "", rows: plan.card, ordered: plan.card.some((r) => r.seq), closed: plan.level >= 3, onPeek: () => screen.peek("pharmacy-card"), read: false });

      // the belt: dishes enter on the right every everyMs, cross in crossMs, loop through plan.loop
      const everyMs = plan.slow ? plan.everyMs * 1.3 : plan.everyMs;
      const crossMs = plan.slow ? plan.crossMs * 1.3 : plan.crossMs;
      const live = new Set();
      let li = Math.floor(env.rng() * plan.loop.length);
      let paused = 0; // >0 = paused (handover, stopper)
      let tBelt = 0;
      let lastT = null;
      let sinceSpawn = everyMs; // the first one enters at once
      let raf = 0;
      let dead = false;
      const spawn = () => {
        const it = plan.loop[li++ % plan.loop.length];
        const d = h("button", "cl-belt-dish", track);
        d.type = "button";
        d.dataset.key = PL().beltKey(it);
        Kit.icon({ id: it.id, colour: it.colour }, d);
        const o = { el: d, it, born: tBelt };
        live.add(o);
        d.addEventListener("pointerdown", (e) => {
          e.preventDefault();
          grab(o);
        });
        position(o);
      };
      const position = (o) => {
        const k = (tBelt - o.born) / crossMs; // 0 = entering right, 1 = gone left
        const w = track.clientWidth;
        const dw = o.el.offsetWidth || 80;
        o.el.style.transform = `translateX(${w - k * (w + dw)}px)`;
        o.el.classList.toggle("hint", helpKeys.has(o.el.dataset.key));
        if (k > 1) {
          o.el.remove();
          live.delete(o);
        }
      };
      const frame = (t) => {
        if (dead) return;
        if (lastT == null) lastT = t;
        const dt = Math.min(100, t - lastT);
        lastT = t;
        if (!paused) {
          tBelt += dt * (Kit.fast ? 4 : 1);
          sinceSpawn += dt * (Kit.fast ? 4 : 1);
          if (sinceSpawn >= everyMs) {
            sinceSpawn = 0;
            spawn();
          }
          live.forEach(position);
        }
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);

      // the stopper (level 3): a hint
      if (plan.stopper) {
        const stop = h("button", "cl-stopper", stage);
        stop.type = "button";
        stop.setAttribute("aria-label", "Stop the belt for a moment");
        stop.textContent = "✋";
        stop.addEventListener("click", async () => {
          if (stop.disabled) return;
          stop.disabled = true;
          screen.hints++;
          res.log.push({ type: "hint", detail: "stopper" });
          paused++;
          belt.classList.add("stopped");
          await Kit.wait(4000);
          paused--;
          belt.classList.remove("stopped");
          stop.disabled = false;
        });
      }

      let busy = false;
      let finish;
      const done = new Promise((r) => (finish = r));
      const counts = {};

      const hop = async (o, dishIdx) => {
        // the dish hops from the belt into the tray
        const from = o.el.getBoundingClientRect();
        const to = tray.slots[dishIdx].el.getBoundingClientRect();
        const fly = o.el.cloneNode(true);
        fly.classList.add("cl-fly");
        Object.assign(fly.style, { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px`, transform: "none" });
        document.body.appendChild(fly);
        void fly.offsetWidth;
        fly.style.transform = `translate(${to.left + to.width / 2 - (from.left + from.width / 2)}px, ${to.top + to.height / 2 - (from.top + from.height / 2)}px) scale(.8)`;
        await Kit.wait(Kit.fast ? 40 : 320);
        fly.remove();
      };

      // T27: a pause with nothing picked: the doctor's box names the next thing and it glows as it passes (E16: a
      // glow only after a hesitation); it goes quiet again at the next pick
      let idle = 0;
      const idleHint = () => {
        clearTimeout(idle);
        idle = setTimeout(() => {
          if (dead || busy) return;
          const want = plan.asked.find((a) => !st.dishes.some((d) => d && d.key === PL().beltKey(a)));
          if (!want) return;
          screen.setNani(S.line(env, "bringme", { a: wordOf(want) }));
          helpKeys.add(PL().beltKey(want));
          idleHinted = PL().beltKey(want);
        }, Kit.fast ? 400 : 7000);
      };
      let idleHinted = null;
      const counted = plan.asked.some((a) => a.count);
      const grab = async (o) => {
        if (busy || o.taken) return;
        if (idleHinted) {
          helpKeys.delete(idleHinted);
          idleHinted = null;
          screen.setNani(null);
        }
        idleHint();
        const r = PL().beltGrab(plan, st, o.it);
        if (!r) return;
        o.taken = true;
        if (global.Sfx && global.Sfx.pop) try { global.Sfx.pop(); } catch (e) { /* no sound */ }
        S.signal("clinic-belt-tap");
        const d = st.dishes[r.dish];
        await hop(o, r.dish);
        o.el.remove();
        live.delete(o);
        counts[d.key] = r.count;
        tray.fill(r.dish, { id: d.id, colour: d.colour, count: r.count });
        if (counted) screen.tally.set(d.id, r.count);
        if (PL().beltFull(st)) await check();
      };
      // decision 52 (P2, P5, CLN-83, CLN-96): the tray is full, so the doctor takes it by himself after a beat (no ✓: a
      // ✓ appearing on a full tray read as "right" even with the wrong colour in it); during the beat a dish can
      // still be taken back (UX 17)
      let checkBtn = null;
      const check = async () => {
        if (checkBtn) return;
        checkBtn = { pending: true };
        const me = checkBtn;
        await Kit.wait(Kit.fast ? 120 : 1100);
        if (checkBtn !== me || busy || !PL().beltFull(st)) return;
        checkBtn = null;
        handover();
      };
      const takeBack = (i) => {
        if (busy || committed || !st.dishes[i]) return;
        const d = PL().beltTakeBack(st, i);
        tray.fill(i, null);
        counts[d.key] = 0;
        if (counted) screen.tally.set(d.id, 0);
        res.log.push({ type: "takeback", detail: d.key });
        if (global.Sfx && global.Sfx.tap) try { global.Sfx.tap(); } catch (e) { /* no sound */ }
        if (checkBtn && !PL().beltFull(st)) checkBtn = null;
      };
      let committed = false;
      const redo = global.OrderCard && global.OrderCard.redo ? global.OrderCard.redo({ max: 3 }) : { wrong: () => ({ tries: 1, action: "redo" }), help: () => false };
      const helpKeys = new Set(); // the items to glow on the belt (a second try)
      const shows = [];
      const showRight = async (dishIdx, want) => {
        const key = PL().beltKey(want);
        const r = PL().beltGrab(plan, st, { id: want.id, colour: want.colour || null });
        if (!r) return;
        const ghost = h("button", "cl-belt-dish cl-belt-show", track);
        Kit.icon({ id: want.id, colour: want.colour }, ghost);
        ghost.style.transform = `translateX(${Math.max(0, track.clientWidth / 2 - 40)}px)`;
        await Kit.wait(Kit.fast ? 60 : 700);
        await hop({ el: ghost }, r.dish);
        ghost.remove();
        const d = st.dishes[r.dish];
        tray.fill(r.dish, { id: d.id, colour: d.colour, count: r.count });
        helpKeys.delete(key);
        void dishIdx;
      };

      const handover = async () => {
        busy = true;
        paused++;
        const out = PL().beltHandover(plan, st);
        for (const r of out) {
          const dish = tray.slots[r.dish].el;
          dish.classList.add("lifted");
          const it = r.key ? plan.loop.find((x) => PL().beltKey(x) === r.key) || { id: r.key.split(":")[0] } : null;
          if (r.ok) {
            await S.say(S.line(env, "handover-ok", { x: wordOf(it) }), "doctor");
            const k = plan.asked.findIndex((a) => PL().beltKey(a) === r.key);
            if (k >= 0) screen.card.tick(`grab${k}`);
          }
          else {
            // decision 51 (E35, CLN-96): only this item is redone: the dish empties, its row stays open, the rest
            // stays done. The second try has help (the right one glows on the belt); at the third the right one
            // comes over by itself (the shared rule, OrderCard.redo)
            const want = r.want ? plan.asked.find((a) => PL().beltKey(a) === r.want) : null;
            const k = want ? plan.asked.indexOf(want) : -1;
            const step = redo.wrong(k >= 0 ? `grab${k}` : `dish${r.dish}`);
            await S.say(S.line(env, "handover-no", { x: it ? wordOf(it) : "clinic.line.pipeline.w-empty", y: want ? wordOf(want) : "clinic.line.pipeline.w-that" }), "doctor");
            tray.fill(r.dish, null);
            if (it) screen.tally.set(it.id, 0);
            if (want) {
              if (step.action === "show") shows.push({ dish: r.dish, want });
              else if (redo.help(`grab${k}`)) helpKeys.add(r.want);
            }
          }
          dish.classList.remove("lifted");
        }
        // the third wrong try: the right one rides in and hops into its dish by itself
        for (const sh of shows.splice(0)) await showRight(sh.dish, sh.want);
        if (!res.rows.length) {
          PL().beltRows(plan, st).forEach((r) => res.judge(r.row, r.ok));
          res.log.push({ type: "handover", taps: st.taps.slice() });
        }
        paused--;
        busy = false;
        if (PL().beltFull(st) && !out.every((r) => r.ok)) check(); // the right one came over by itself: hand over again
        if (out.every((r) => r.ok)) {
          committed = true;
          trayBox.classList.add("committed");
          plan.card.forEach((r) => screen.card.tick(r.id, { quiet: true }));
          finish();
        }
      };

      S.setExpect("pharmacy", () => {
        if (busy || (checkBtn && PL().beltFull(st))) return { stage: "pharmacy", kind: "wait" };
        const want = plan.asked.find((a) => {
          const k = PL().beltKey(a);
          const d = st.dishes.find((x) => x && x.key === k);
          return !d || (a.count && d.count < a.count);
        });
        const orderNext = want || plan.asked[0];
        const k = PL().beltKey(orderNext);
        return { stage: "pharmacy", kind: "belt", key: k, target: `.cl-belt-dish[data-key="${k}"]`, wrong: `.cl-belt-dish:not([data-key="${k}"])` };
      });

      idleHint();
      if (env.first) S.onboard(env, "pharmacy", [{ spotlight: () => track, ghost: { gesture: "tap" }, wait: "clinic-belt-tap" }]);

      await done;
      dead = true;
      clearTimeout(idle);
      cancelAnimationFrame(raf);
      // T27: on the right tray, the doctor's "Achija" in his box (he is off screen here)
      screen.setNani(S.line(env, "handover-ok", { x: wordOf(plan.asked[plan.asked.length - 1]) }));
      S.current = null;
      S.endOnboard();
      if (global.Sfx && global.Sfx.right) try { global.Sfx.right(); } catch (e) { /* no sound */ }
      // decision 52 (P2): the tray is right, so it moves on by itself after a beat (no "To the bench" button)
      await Kit.wait(Kit.fast ? 60 : 1000);
      plan.words.forEach((w) => res.words.push(w.word));
      Kit.Voice.clear(); // the voice stop at every stage end (CLN-109): nothing from the counter carries into the bench
      return res;
    },
  };
})(typeof self !== "undefined" ? self : this);
