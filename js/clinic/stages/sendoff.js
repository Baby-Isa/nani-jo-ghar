/*
 * Stage 5, the send-off: "Is everything okay now?" (docs/modes/clinic-design.md
 * P6, Q3, Q5; clinic v2: docs/modes/clinic-v2-design-sheets.md E, CQ6). On CB5
 * the patient stands by the half-open front door, the doctor beside them.
 *   E1 (level 1; taught): the patient's round face circle SHOWS the feeling;
 *      the child picks the matching card of four (happy, sad, hot, cold).
 *   E2 (level 2): the patient SAYS it ([I feel cold]), no picture; pick the card.
 *   level 3: the feeling shows; the child picks WHAT HELPS (cold: the blanket,
 *      hot: the fan, sad: the apple).
 *   E4 (level 3): the child asks [How do you feel?] first (a speaking moment);
 *      the first time Nani whispers the idea and the question card shows the
 *      patient's face with a "?".
 * Not happy at levels 1-2: one more thing, in the scene (the feeling's help:
 * the apple, not a lolly), then the question again: it always ends happy.
 * From level 2 the doctor cues the goodbye and the child says it, in the scene
 * (E2 and E3 merged; no left panel). Then the sticker for the album.
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
      const stage = S.room(screen, "door");
      stage.dataset.mode = plan.mode;
      screen.trayWrap.classList.add("hidden");
      const box = stage.scene || stage;
      const cfg = stage.sceneCfg && stage.sceneCfg.patient ? stage.sceneCfg : { patient: { x: 0.64, y: 0.8, h: 0.46 }, doctor: { x: 0.44, y: 0.86, h: 0.64 }, cards: { x: 0.36, y: 0.9 } };
      S.place(Kit.doctorFigure(box, "cl-doc-door"), { x: cfg.doctor.x, y: cfg.doctor.y, h: cfg.doctor.h, z: 2 });
      const layer = S.place(h("div", "cl-patient-layer v2", box), { x: cfg.patient.x, y: cfg.patient.y, h: cfg.patient.h, w: cfg.patient.h * (620 / 900) / 1.5, z: 3 });
      const fig = env.fig;
      layer.appendChild(fig.el);
      fig.focus(null, null, 1, 0);
      fig.pose("stand");
      fig.react("idle", 0);
      Kit.Voice.speakers.patient = () => fig.el.querySelector(".fig-head") || fig.el;
      // the round face circle over the patient (Cook's review face): it shows the feeling at levels 1 and 3
      const circle = h("div", "cl-feel-circle", layer);
      const showFeel = (f) => {
        circle.innerHTML = "";
        if (f) Kit.feelingFace(f, circle);
        else h("span", "cl-feel-q", circle, "…");
        circle.classList.toggle("on", !!f);
      };
      showFeel(null);
      await S.request(screen, { title: "", rows: plan.card });

      const rowOf = (id) => plan.rows.find((r) => r.id === id);
      // E4: the child asks first (Nani's whisper and the question card the first time)
      if (plan.variant === "E4") {
        const r = rowOf("ask");
        let seen = false;
        try {
          seen = !!(global.UIStore && global.UIStore.get("clinic-cue", "ask"));
          if (env.onboard && global.UIStore) global.UIStore.set("clinic-cue", "ask", true);
        } catch (e) {
          /* no storage */
        }
        let qcard = null;
        if (env.onboard && !seen) {
          qcard = h("div", "cl-ask-card", box);
          S.place(qcard, { x: cfg.patient.x, y: cfg.patient.y - cfg.patient.h - 0.02, z: 30 });
          qcard.appendChild(S.personFace(patient.kind, "neutral"));
          h("span", "cl-ask-q", qcard, "?");
          await S.say(S.line(env, "whisper-ask"), "nani");
        }
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
        if (qcard) qcard.remove();
        screen.card.tick("ask");
      } else await S.say(S.line(env, "okay-now"), "doctor");

      // the feeling: shown (level 1 and 3) or only said (level 2)
      const feel = data.feelings[plan.feeling];
      const moodOf = (f) => (f === "happy" ? "happy" : data.feelings[f].mood);
      fig.react(moodOf(plan.feeling), 0);
      if (plan.mode !== "said") showFeel(plan.feeling);
      await S.say(Object.assign({ kutchi: `[${feel.line.english}]` }, feel.line), "patient");

      const cards = S.place(h("div", "cl-feel-cards", box), { x: cfg.cards.x, y: cfg.cards.y, z: 25 });
      let busy = false;
      let finish;
      const done = new Promise((r) => (finish = r));
      let corrected = false;
      let answer = plan.feeling;
      let awaitingExtra = false;
      const nope = (b) => {
        b.classList.remove("nope");
        void b.offsetWidth;
        b.classList.add("nope");
        setTimeout(() => b.classList.remove("nope"), 500);
      };
      const toPatient = async (el) => {
        // the thing goes over to the patient
        const a = el.getBoundingClientRect();
        const b = layer.getBoundingClientRect();
        const fly = el.cloneNode(true);
        fly.classList.add("cl-fly-help");
        Object.assign(fly.style, { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px` });
        document.body.appendChild(fly);
        void fly.offsetWidth;
        fly.style.transform = `translate(${b.left + b.width / 2 - a.left - a.width / 2}px, ${b.top + b.height * 0.45 - a.top - a.height / 2}px) scale(.7)`;
        await Kit.wait(Kit.fast ? 60 : 450);
        fly.remove();
      };
      const nowHappy = async () => {
        fig.react("happy", 0);
        fig.pose("jump");
        if (plan.mode !== "said") showFeel("happy");
        await S.say(Object.assign({ kutchi: `[${data.feelings.happy.line.english}]` }, data.feelings.happy.line), "patient");
      };

      if (plan.mode === "helps") {
        // level 3: what helps? (the blanket, the fan, the apple)
        const r = rowOf("help");
        await S.say(S.line(env, "helps"), "doctor");
        const btns = plan.helps.map((id) => {
          const b = h("button", "cl-face-card cl-help-card", cards);
          b.type = "button";
          b.dataset.help = id;
          Kit.icon(id, b);
          return b;
        });
        S.setExpect("sendoff", () => (busy ? { stage: "sendoff", kind: "wait" } : { stage: "sendoff", kind: "tap", target: `.cl-help-card[data-help="${r.answer}"]`, wrong: `.cl-help-card:not([data-help="${r.answer}"])` }));
        btns.forEach((b) =>
          b.addEventListener("click", async () => {
            if (busy) return;
            const ok = b.dataset.help === r.answer;
            if (!res.judged("help")) {
              res.judge(r, ok);
              res.log.push({ type: ok ? "right" : "wrong", rowId: "help", detail: b.dataset.help });
            }
            S.signal("clinic-face");
            if (!ok) {
              nope(b);
              fig.react(moodOf(plan.feeling), 0);
              return;
            }
            busy = true;
            b.classList.add("yes");
            await toPatient(b);
            await nowHappy();
            screen.card.tick("feel");
            screen.card.tick("help");
            finish();
          })
        );
      } else {
        // levels 1-2: the four feeling cards (pictures only: the same for everyone)
        const feelRow = rowOf("feel");
        const btns = plan.faces.map((f) => {
          const b = h("button", "cl-face-card", cards);
          b.type = "button";
          b.dataset.face = f;
          b.setAttribute("aria-label", data.feelings[f].english);
          Kit.feelingFace(f, b);
          return b;
        });
        S.setExpect("sendoff", () => {
          if (awaitingExtra) return { stage: "sendoff", kind: "tap", target: ".cl-extra" };
          if (busy) return { stage: "sendoff", kind: "wait" };
          return { stage: "sendoff", kind: "tap", target: `.cl-face-card[data-face="${answer}"]`, wrong: `.cl-face-card:not([data-face="${answer}"])` };
        });
        btns.forEach((b) =>
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
              nope(b);
              if (plan.level <= 1 && !corrected) {
                corrected = true;
                busy = true;
                await S.say(Object.assign({ kutchi: `[${data.feelings[answer].line.english}]` }, data.feelings[answer].line), "patient");
                busy = false;
              }
              return;
            }
            busy = true;
            b.classList.add("yes");
            if (answer !== "happy") {
              // one more thing (in the scene, by the doctor), then the question again: it always ends happy
              awaitingExtra = true;
              await S.say(S.line(env, "onemore"), "doctor");
              const extra = h("button", "cl-extra", box);
              extra.type = "button";
              S.place(extra, { x: cfg.doctor.x + 0.07, y: cfg.doctor.y - cfg.doctor.h * 0.38, z: 30 });
              Kit.icon(plan.extra || "lollipop", extra);
              extra.addEventListener("click", async () => {
                if (!awaitingExtra) return;
                awaitingExtra = false;
                await toPatient(extra);
                extra.remove();
                await S.say(S.line(env, "okay-now"), "doctor");
                answer = "happy";
                await nowHappy();
                btns.forEach((x) => x.classList.remove("yes"));
                busy = false;
              });
              return;
            }
            fig.react("happy", 0);
            if (plan.mode !== "said") showFeel("happy");
            screen.card.tick("feel");
            finish();
          })
        );
        if (env.first) S.onboard(env, "sendoff", [{ spotlight: () => btns.find((x) => x.dataset.face === answer), ghost: { gesture: "tap" }, wait: "clinic-face" }]);
      }
      await done;
      cards.remove();

      // the goodbye, in the scene (from level 2: E2 and E3 merged)
      if (plan.goodbye) {
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
      layer.classList.add("leaving");
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
