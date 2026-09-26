/*
 * Stage 1, the waiting room: "Who's next?" (docs/modes/clinic-design.md P2,
 * Q3, Q5). The bench by the door; the doctor says who to bring in; the child
 * taps that person; they walk to the examination bench and greet him.
 * Nobody on the bench reacts until tapped. W1 kind; W2 kind + colour or
 * wadho/nindho; W3 the child calls them (a speaking moment, the pills as the
 * fallback); W4 two in the called order, with comfort rings.
 * A wrong tap at level 1: that person shakes their head and sits, and the
 * doctor says the line once more (the one gentle correction). From level 2 a
 * wrong one just looks puzzled and sits: no verdict (UX s11).
 */
(function (global) {
  "use strict";
  const Clinic = global.Clinic;
  const Kit = Clinic.Kit;
  const S = Clinic.Stages;
  const h = Kit.h;

  function seatPerson(seat, b, useSprites, bodyFile) {
    const who = h("div", "cl-seat-who", seat);
    const src = useSprites && Kit.person(b.kind, "neutral");
    if (src) {
      const img = h("img", "cl-seat-img", who);
      img.alt = "";
      img.draggable = false;
      img.src = Kit.url(src);
      return { el: who, img, react(mood) { const s2 = Kit.person(b.kind, mood) || src; img.src = Kit.url(s2); } };
    }
    const fig = Clinic.Figure.make(bodyFile, { kind: b.kind, colour: b.colour, size: b.size });
    who.appendChild(fig.el);
    fig.pose("sit");
    return { el: who, fig, react(mood) { fig.react(mood === "neutral" ? "idle" : mood === "wave" ? "happy" : mood); } };
  }

  S.waiting = {
    async run(env, plan) {
      const { screen, data } = env;
      const res = S.result("waiting");
      const stage = S.room(screen, "waiting");
      stage.dataset.variant = plan.variant;
      const bench = h("div", "cl-bench", stage);
      const exam = h("div", "cl-exam-spot", stage);
      h("div", "cl-exam-bench", exam);
      // sprites when nothing on the bench needs a colour or a size (they can't be recoloured)
      const useSprites = !plan.bench.some((b) => b.colour || b.size);
      const seats = plan.bench.map((b, i) => {
        const seat = h("button", `cl-seat${b.size ? " size-" + b.size : ""}`, bench);
        seat.type = "button";
        seat.dataset.seat = String(i);
        seat.dataset.kind = b.kind;
        if (b.colour) seat.dataset.colour = b.colour;
        const p = seatPerson(seat, b, useSprites, env.bodyFile);
        let ring = null;
        if (plan.variant === "W4") {
          ring = h("div", "cl-ring", seat);
          ring.style.setProperty("--t", `${Math.round(plan.ringsMs * (0.5 + 0.5 * env.rng()))}ms`);
        }
        return { el: seat, b, p, ring, gone: false };
      });
      Kit.Voice.speakers.bench = null;

      await S.request(screen, { title: "", rows: plan.card });
      let callIdx = 0;
      const rows = plan.rows;
      let corrected = false;
      let busy = false;
      let finish;
      const done = new Promise((r) => (finish = r));

      S.setExpect("waiting", () => {
        const r = rows[callIdx];
        if (busy) return { stage: "waiting", kind: "wait" };
        if (!r) return { stage: "waiting", kind: "button" };
        if (r.voice) return { stage: "waiting", kind: "say", choice: plan.bench[r.answer].kind };
        return { stage: "waiting", kind: "tap", target: `.cl-seat[data-seat="${r.answer}"]`, wrong: `.cl-seat:not([data-seat="${r.answer}"])` };
      });

      const walk = async (s) => {
        s.gone = true;
        s.el.classList.add("walking");
        const from = s.el.getBoundingClientRect();
        const to = exam.getBoundingClientRect();
        s.el.style.setProperty("--dx", `${to.left + to.width / 2 - (from.left + from.width / 2)}px`);
        s.el.style.setProperty("--dy", `${to.top + to.height * 0.4 - (from.top + from.height / 2)}px`);
        s.p.react("wave");
        Kit.Voice.speakers.patient = () => s.el;
        const elder = data.kinds[s.b.kind] && data.kinds[s.b.kind].elder;
        await Kit.wait(500);
        await S.say(S.line(env, "salaam"), "patient");
        await S.say(S.line(env, "salaam-back"), "doctor");
        void elder;
      };

      const onRight = async (s, r) => {
        busy = true;
        screen.card.tick(r.id === "who1" && plan.variant === "W4" ? "who" : r.id);
        S.signal("clinic-waiting-tap");
        await walk(s);
        callIdx++;
        busy = false;
        if (callIdx >= rows.length) {
          if (plan.variant === "W4") screen.card.tick("who");
          finish();
        }
      };
      const onWrong = async (s) => {
        busy = true;
        s.el.classList.add("puzzled");
        if (plan.level <= 1) s.p.react("sad");
        await Kit.wait(700);
        s.el.classList.remove("puzzled");
        s.p.react("neutral");
        if (plan.level <= 1 && !corrected) {
          corrected = true;
          await S.say(plan.card[0], "doctor");
        }
        busy = false;
      };

      seats.forEach((s, i) => {
        s.el.addEventListener("click", async () => {
          if (busy || s.gone) return;
          const r = rows[callIdx];
          if (!r || r.voice) return;
          const ok = global.ClinicPipeline.judgeWho(r, i);
          res.judge(r, ok);
          res.log.push({ type: ok ? "right" : "wrong", rowId: r.id, detail: s.b.kind });
          if (ok) await onRight(s, r);
          else await onWrong(s);
        });
      });

      // the first-ever session: the ghost finger taps the one called (UX s8; taught)
      if (env.first) {
        S.onboard(env, "waiting", [{ spotlight: seats[rows[0].answer].el, ghost: { gesture: "tap" }, wait: "clinic-waiting-tap" }]);
      }

      // W3: the child calls them (a speaking moment); the one who matches what was heard stands
      if (rows[0] && rows[0].voice) {
        const r = rows[0];
        const kinds = Array.from(new Set(plan.bench.map((b) => b.kind)));
        const target = plan.bench[r.answer].kind;
        const word = (k) => global.ClinicPipeline.line(data, "come", { kind: global.ClinicPipeline.kindWord(data, k) });
        const out = await S.moment(env, {
          choices: kinds,
          expected: target,
          word,
          caption: "Call them in",
          character: {
            act: async (k) => {
              const s = seats.find((x) => x.b.kind === k && !x.gone);
              if (!s) return;
              s.el.classList.add("standing");
              await Kit.wait(500);
              if (k !== target) {
                s.el.classList.add("puzzled");
                await Kit.wait(600);
                s.el.classList.remove("puzzled", "standing");
              }
            },
          },
          accept: (k) => {
            res.judge(r, k === target);
            return k === target;
          },
        });
        res.moments.push(out);
        const s = seats.find((x) => x.b.kind === target);
        s.el.classList.remove("standing");
        await onRight(s, r);
      }

      // W4: the comfort rings (the only timer; nobody can lose: an empty ring rocks and refills)
      if (plan.variant === "W4") seats.forEach((s) => s.ring && s.ring.addEventListener("animationiteration", () => s.el.classList.add("rock")));

      await done;
      S.current = null;
      const btn = await S.button(screen, S.line(env, "where"));
      void btn;
      res.words.push({ kutchi: null, english: data.kinds[plan.patient.kind].english.replace(/^the /, "") });
      return res;
    },
  };
})(typeof self !== "undefined" ? self : this);
