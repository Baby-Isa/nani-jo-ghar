/*
 * Stage 5, the send-off: "Is everything okay now?" (docs/archive/clinic/clinic-design-v1.md
 * P6, Q3, Q5; clinic v2: docs/game-design/modes/clinic.md E, CQ6). On CB5
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
 * Clinic fixes (13d-13f): the doctor and the patient on the left; no script card (the doctor's box says the
 * one line now); the feeling cards in a thought bubble from the patient's head at levels 1-2, the help
 * items in a tray along the bottom from level 3; reply pills only when a reply is needed, never with the
 * tray; talking three-quarter, turning to the player on the child's turn (UX 16); input never waits for
 * the talking (13i); the stage clears its own UI.
 */
(function (global) {
  "use strict";
  const Clinic = global.Clinic;
  const Kit = Clinic.Kit;
  const S = Clinic.Stages;
  const h = Kit.h;
  const PL = () => global.ClinicPipeline;
  // the patient's "I feel …" line, through the engine (data/clinic/pipeline.json feelings: clinic.line.feeling-<f>)
  const feelLine = (f) => global.ClinicLang.line(`feeling-${f}`, {}, { def: {} });

  S.sendoff = {
    async run(env, plan, patient) {
      const { screen, data } = env;
      const res = S.result("sendoff");
      const stage = S.room(screen, "door");
      stage.dataset.mode = plan.mode;
      screen.trayWrap.classList.add("hidden");
      const box = stage.scene || stage;
      const cfg = stage.sceneCfg && stage.sceneCfg.patient ? stage.sceneCfg : { patient: { x: 0.64, y: 0.8, h: 0.46 }, doctor: { x: 0.44, y: 0.86, h: 0.64 }, cards: { x: 0.36, y: 0.9 } };
      const docEl = S.place(Kit.doctorFigure(box, "cl-doc-door"), { x: cfg.doctor.x, y: cfg.doctor.y, h: cfg.doctor.h, z: 2 });
      const layer = S.place(h("div", "cl-patient-layer v2", box), { x: cfg.patient.x, y: cfg.patient.y, h: cfg.patient.h, w: cfg.patient.h * (620 / 900) / 1.5, z: 3 });
      const fig = env.fig;
      // A2 (5 Oct): the art has sitting poses only (part B): standing at the door is still the stand-in body, with
      // the patient's own face for each feeling in the circle (W2-W6's head crops, heal-art.json heads)
      if (fig.dropArt) fig.dropArt();
      const artSpec = await S.artFor(fig.kind);
      const heads = (artSpec && artSpec.heads) || null;
      layer.appendChild(fig.el);
      fig.focus(null, null, 1, 0);
      fig.pose("stand");
      fig.react("idle", 0);
      Kit.Voice.speakers.patient = () => fig.el.querySelector(".fig-head") || fig.el;
      Kit.Voice.speakers.doctor = () => docEl;
      // UX 16: while they talk, the doctor and the patient stand three-quarter turned to each other
      S.stage(docEl, layer, "talk");
      // level 1's hint that the feeling shows sits ON the patient's own face (13d): a stand-in circle over the
      // head until the real art's expressions exist; never a second face floating beside the bubble
      const circle = h("div", "cl-feel-circle on-face", layer);
      const showFeel = (f) => {
        circle.innerHTML = "";
        const own = f && heads && (heads[f] || heads[(data.feelings[f] && data.feelings[f].mood) || ""]);
        if (own) {
          const im = h("img", "cl-feel-own", circle);
          im.alt = "";
          im.src = Kit.url(own);
        } else if (f) Kit.feelingFace(f, circle);
        circle.classList.toggle("own", !!own);
        circle.classList.toggle("on", !!f);
        const head = fig.el.querySelector(".fig-head");
        if (head) {
          const hr = head.getBoundingClientRect();
          const lr = layer.getBoundingClientRect();
          const d = Math.max(hr.width, hr.height) * 1.05;
          Object.assign(circle.style, { width: `${d}px`, left: `${hr.left - lr.left + hr.width / 2}px`, top: `${hr.top - lr.top + hr.height / 2 - d / 2}px` });
        }
      };
      showFeel(null);
      // 13e: no card listing every line up front (no script cards, UX 16): the doctor's box says the one
      // line now; the scene makes the rest clear
      screen.card.setTitle("", null);
      screen.card.setRows([]);

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
          S.say(S.line(env, "whisper-ask"), "guide");
        }
        S.setExpect("sendoff", () => ({ stage: "sendoff", kind: "say", choice: "howfeel" }));
        const out = await S.moment(env, {
          choices: r.options,
          expected: "howfeel",
          word: (id) => S.line(env, id),
          caption: Kit.plain(S.line(env, "cap-askthem")),
          character: { act: async (id) => fig.react(id === "howfeel" ? "relief" : "idle") },
          accept: (id) => {
            res.judge(r, id === "howfeel");
            return id === "howfeel";
          },
        });
        res.moments.push(out);
        if (qcard) qcard.remove();
        env.screen.main.querySelectorAll(".njg-say, .cl-pills").forEach((n) => n.remove()); // no stale pills (13f)
      } else S.say(S.line(env, "okay-now"), "doctor");

      // the feeling: shown (level 1 and 3) or only said (level 2)
      const feel = data.feelings[plan.feeling];
      const moodOf = (f) => (f === "happy" ? "happy" : data.feelings[f].mood);
      fig.react(moodOf(plan.feeling), 0);
      if (plan.mode !== "said") showFeel(plan.feeling);
      void feel;
      S.say(feelLine(plan.feeling), "patient");
      // the child's turn: they turn to face the player (UX 16), and the choice opens at once (13i)
      S.stage(docEl, layer, "player");
      // levels 1-2: the four feeling cards in a thought bubble rising from the patient's head, opening out to
      // the right (13d); level 3: the help items in a tray along the bottom of the screen (13e)
      let cards;
      if (plan.mode === "helps") cards = h("div", "cl-help-tray", stage);
      else {
        cards = h("div", "cl-thought", box);
        const head = fig.el.querySelector(".fig-head");
        const hb = head ? head.getBoundingClientRect() : layer.getBoundingClientRect();
        const bb = box.getBoundingClientRect();
        const hx = (hb.left + hb.width * 0.8 - bb.left) / Math.max(1, bb.width);
        const hy = (hb.top - bb.top) / Math.max(1, bb.height);
        cards.style.left = `${Math.min(0.62, hx + 0.03) * 100}%`;
        cards.style.bottom = `${Math.max(0.25, 1 - hy + 0.03) * 100}%`;
        h("i", "cl-thought-dot d1", cards);
        h("i", "cl-thought-dot d2", cards);
      }
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
        await S.say(feelLine("happy"), "patient");
      };

      if (plan.mode === "helps") {
        // level 3: what helps? (the blanket, the fan, the apple)
        const r = rowOf("help");
        S.say(S.line(env, "helps"), "doctor");
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
                await S.say(feelLine(answer), "patient");
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
              S.place(extra, { x: cfg.doctor.x - 0.065, y: cfg.doctor.y - cfg.doctor.h * 0.36, z: 30 }); // in the doctor's hand
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
            finish();
          })
        );
        if (env.first) S.onboard(env, "sendoff", [{ spotlight: () => btns.find((x) => x.dataset.face === answer), ghost: { gesture: "tap" }, wait: "clinic-face" }]);
      }
      await done;
      cards.remove(); // the stage clears its own UI before the next thing (13f)
      S.stage(docEl, layer, "talk");

      // the goodbye, in the scene (from level 2: E2 and E3 merged); the reply pills only now, when a reply is
      // needed, with nothing else on screen (13f)
      if (plan.goodbye) {
        const r = rowOf("bye");
        S.say(plan.card.find((x) => x.id === "bye"), "doctor");
        S.stage(docEl, layer, "player");
        S.setExpect("sendoff", () => ({ stage: "sendoff", kind: "say", choice: plan.goodbye }));
        const out = await S.moment(env, {
          choices: r.options,
          expected: plan.goodbye,
          word: (id) => PL().goodbye(data, id),
          caption: Kit.plain(S.line(env, "cap-sayit")),
          character: { act: async (id) => { fig.pose("wave"); await S.say(PL().goodbye(data, id), "patient"); } },
          accept: (id) => {
            res.judge(r, id === plan.goodbye);
            return true;
          },
        });
        res.moments.push(out);
        env.screen.main.querySelectorAll(".njg-say, .cl-pills").forEach((n) => n.remove());
      } else {
        await S.say(S.line(env, "thanks"), "patient");
      }
      fig.pose("wave");
      layer.classList.add("leaving");
      S.current = null;
      S.endOnboard();
      // the sticker for the album
      const sticker = h("div", "cl-sticker", stage);
      sticker.appendChild(S.personFace(patient.kind, "happy"));
      if (global.Sfx && global.Sfx.gold) try { global.Sfx.gold(); } catch (e) { /* no sound */ }
      await Kit.wait(Kit.fast ? 60 : 1100);
      res.words.push(global.ClinicLang.w(PL().pword("feeling", plan.feeling)));
      if (plan.goodbye) res.words.push(PL().goodbye(data, plan.goodbye));
      return res;
    },
  };
})(typeof self !== "undefined" ? self : this);
