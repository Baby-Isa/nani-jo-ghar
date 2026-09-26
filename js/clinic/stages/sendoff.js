/*
 * Stage 5, the send-off: "Is everything okay now?" (docs/modes/clinic-design.md
 * P6, Q3, Q5). The patient stands, healed. The doctor asks; the patient says
 * how they feel; the child taps the face that matches what was said.
 *   E1 (level 1; taught): happy or sad. Sad -> one more thing from the
 *      sidebar (the lollipop), then the question again: it always ends happy.
 *   E2 four faces (five at level 3, with scared after the boing).
 *   E3 the goodbye the doctor cues (a speaking moment; pills as the fallback).
 *   E4 the child asks [How do you feel?] (speaking), then the face.
 * Then the sticker for the album; the runner shows the end-of-round screen.
 */
(function (global) {
  "use strict";
  const Clinic = global.Clinic;
  const Kit = Clinic.Kit;
  const S = Clinic.Stages;
  const h = Kit.h;

  S.sendoff = {
    async run(env, plan, patient) {
      const { screen, data } = env;
      const res = S.result("sendoff");
      const stage = S.room(screen, "exam");
      screen.trayWrap.classList.add("hidden");
      const layer = h("div", "cl-patient-layer", stage);
      const fig = env.fig;
      layer.appendChild(fig.el);
      fig.focus(null, null, 1, 0);
      fig.pose("stand");
      fig.react("idle", 0);
      Kit.Voice.speakers.patient = () => fig.el.querySelector(".fig-head") || fig.el;
      await S.request(screen, { title: "", rows: plan.card });

      const rowOf = (id) => plan.rows.find((r) => r.id === id);
      // E4: the child asks first
      if (plan.variant === "E4") {
        const r = rowOf("ask");
        S.setExpect("sendoff", () => ({ stage: "sendoff", kind: "say", choice: "howfeel" }));
        const out = await S.moment(env, {
          choices: r.options,
          expected: "howfeel",
          word: (id) => S.line(env, id),
          caption: "Ask them",
          character: { act: async (id) => fig.react(id === "howfeel" ? "relief" : "idle") },
          accept: (id) => {
            res.judge(r, id === "howfeel");
            return id === "howfeel";
          },
        });
        res.moments.push(out);
        screen.card.tick("ask");
      } else await S.say(S.line(env, "okay-now"), "doctor");

      // the feeling
      const feelRow = rowOf("feel");
      const feel = data.feelings[plan.feeling];
      fig.react(feel.mood === "happy" ? "happy" : feel.mood, 0);
      await S.say(feel.line, "patient");
      const cards = h("div", "cl-faces", stage);
      const faceBtns = plan.faces.map((f) => {
        const b = h("button", "cl-face-card", cards);
        b.type = "button";
        b.dataset.face = f;
        h("span", "cl-face-emoji", b, data.feelings[f].face);
        Kit.text({ kutchi: null, english: data.feelings[f].english }, h("span", "cl-face-word", b));
        return b;
      });
      let answer = plan.feeling;
      let busy = false;
      let finish;
      const done = new Promise((r) => (finish = r));
      let corrected = false;
      let extraBtn = null;
      let awaitingExtra = false;
      S.setExpect("sendoff", () => {
        if (awaitingExtra) return { stage: "sendoff", kind: "tap", target: ".cl-extra" };
        if (busy) return { stage: "sendoff", kind: "wait" };
        return { stage: "sendoff", kind: "tap", target: `.cl-face-card[data-face="${answer}"]`, wrong: `.cl-face-card:not([data-face="${answer}"])` };
      });
      faceBtns.forEach((b) => {
        b.addEventListener("click", async () => {
          if (busy || awaitingExtra) return;
          const f = b.dataset.face;
          const ok = f === answer;
          if (!res.judged("feel")) {
            res.judge(feelRow, ok);
            res.log.push({ type: ok ? "right" : "wrong", rowId: "feel", detail: f });
          }
          S.signal("clinic-face");
          if (!ok) {
            b.classList.add("nope");
            setTimeout(() => b.classList.remove("nope"), 500);
            if (plan.level <= 1 && !corrected) {
              corrected = true;
              busy = true;
              await S.say(answer === "happy" ? data.feelings.happy.line : data.feelings[answer].line, "patient");
              busy = false;
            }
            return;
          }
          busy = true;
          b.classList.add("yes");
          if (answer === "sad") {
            // one more thing (from the sidebar), then the question again: it always ends happy
            awaitingExtra = true;
            await S.say(S.line(env, "onemore"), "doctor");
            const extra = data.extras.list[0];
            extraBtn = h("button", "cl-extra", screen.side);
            extraBtn.type = "button";
            Kit.icon(extra, extraBtn);
            extraBtn.addEventListener("click", async () => {
              extraBtn.remove();
              awaitingExtra = false;
              fig.react("happy", 0);
              fig.pose("jump");
              await S.say(S.line(env, "okay-now"), "doctor");
              answer = "happy";
              await S.say(data.feelings.happy.line, "patient");
              faceBtns.forEach((x) => x.classList.remove("yes"));
              busy = false;
            });
            return;
          }
          fig.react("happy", 0);
          screen.card.tick("feel");
          finish();
        });
      });
      if (env.first) S.onboard(env, "sendoff", [{ spotlight: () => faceBtns.find((x) => x.dataset.face === answer), ghost: { gesture: "tap" }, wait: "clinic-face" }]);
      await done;
      cards.remove();

      // E3: the goodbye (speaking)
      if (plan.variant === "E3") {
        const r = rowOf("bye");
        await S.say(plan.card.find((x) => x.id === "bye"), "doctor");
        S.setExpect("sendoff", () => ({ stage: "sendoff", kind: "say", choice: plan.goodbye }));
        const out = await S.moment(env, {
          choices: r.options,
          expected: plan.goodbye,
          word: (id) => ({ kutchi: data.goodbyes[id].kutchi, english: data.goodbyes[id].english }),
          caption: "Say it",
          character: { act: async (id) => { fig.pose("wave"); await S.say({ kutchi: data.goodbyes[id].kutchi, english: data.goodbyes[id].english }, "patient"); } },
          accept: (id) => {
            res.judge(r, id === plan.goodbye);
            return true;
          },
        });
        res.moments.push(out);
        screen.card.tick("bye");
      } else {
        await S.say(S.line(env, "thanks"), "patient");
      }
      fig.pose("wave");
      S.current = null;
      // the sticker for the album
      const sticker = h("div", "cl-sticker", stage);
      sticker.appendChild(S.personFace(patient.kind, "happy"));
      if (global.Sfx && global.Sfx.gold) try { global.Sfx.gold(); } catch (e) { /* no sound */ }
      await Kit.wait(Kit.fast ? 60 : 1100);
      res.words.push({ kutchi: null, english: data.feelings[plan.feeling].english });
      if (plan.goodbye) res.words.push({ kutchi: data.goodbyes[plan.goodbye].kutchi, english: data.goodbyes[plan.goodbye].english });
      return res;
    },
  };
})(typeof self !== "undefined" ? self : this);
