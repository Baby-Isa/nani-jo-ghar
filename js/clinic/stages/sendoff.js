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
      // CLN-81, CLN-98 (6 Oct, CL1, SO1): a patient with her finished art says goodbye on it. Her art sits only (the
      // standing pose comes with the art run), so until then the send-off is where she already sits: the bed's edge in
      // the doctor's room, the doctor beside her (as in the diagnosis); her own faces show the feeling. Without art:
      // the door, the stand-in body and the face circle, as before.
      const fig = env.fig;
      const artSpec = await S.artFor(fig.kind);
      const heads = (artSpec && artSpec.heads) || null;
      const onArt = !!(artSpec && artSpec.front);
      // S02-E (W12, CLN-98): at the goodbye she stands up off the bed and waves (heal-art.json patients[kind].stand.wave)
      const waveArt = onArt && artSpec.stand && artSpec.stand.wave ? Object.assign({}, artSpec.stand, { front: artSpec.stand.wave, heads: artSpec.stand.heads || artSpec.heads }) : null;
      let waveOn = () => {};
      const stage = S.room(screen, onArt ? "exam" : "door");
      stage.dataset.mode = plan.mode;
      screen.trayWrap.classList.add("hidden");
      const box = stage.scene || stage;
      let cfg;
      let docEl;
      let layer;
      if (onArt && stage.sceneCfg && stage.sceneCfg.fig) {
        const ex = stage.sceneCfg;
        cfg = { patient: { x: ex.fig.x, y: ex.fig.bottom, h: ex.fig.h }, doctor: ex.doctor, cards: { x: 0.6, y: 0.95 } };
        docEl = S.place(Kit.doctorFigure(box, "cl-doc-stand"), { x: ex.doctor.x, y: ex.doctor.y, h: ex.doctor.h, z: 2 });
        layer = S.place(h("div", "cl-patient-layer v2", box), { x: ex.fig.x, y: ex.fig.bottom, h: ex.fig.h, w: ex.fig.h * (620 / 900) / 1.5, z: 3 });
        layer.appendChild(fig.el);
        fig.focus(null, null, 1, 0);
        fig.pose("sit");
        fig.useArt(artSpec, { view: "front", figH: ex.fig.h });
        fig.artBody && fig.artBody("front");
        const seat = () => {
          layer.style.top = `${ex.fig.bottom * 100}%`;
          const q = fig.hotspot("seat", "left", box);
          const H = box.clientHeight || 1;
          if (q && isFinite(q.y)) layer.style.top = `${(ex.fig.bottom + (ex.seat * H - q.y) / H) * 100}%`;
        };
        seat();
        box.addEventListener("scenefit", seat);
        if (waveArt) {
          waveOn = () => {
            if (fig.waving) return;
            fig.waving = true;
            box.removeEventListener("scenefit", seat);
            // standing on the floor in front of the bed (scenes-v2 exam.floor)
            layer.style.top = `${(ex.floor || 0.8) * 100}%`;
            fig.useArt(waveArt, { view: "front", figH: ex.fig.h });
          };
        }
      } else {
        cfg = stage.sceneCfg && stage.sceneCfg.patient ? stage.sceneCfg : { patient: { x: 0.64, y: 0.8, h: 0.46 }, doctor: { x: 0.44, y: 0.86, h: 0.64 }, cards: { x: 0.36, y: 0.9 } };
        docEl = S.place(Kit.doctorFigure(box, "cl-doc-door"), { x: cfg.doctor.x, y: cfg.doctor.y, h: cfg.doctor.h, z: 2 });
        layer = S.place(h("div", "cl-patient-layer v2", box), { x: cfg.patient.x, y: cfg.patient.y, h: cfg.patient.h, w: cfg.patient.h * (620 / 900) / 1.5, z: 3 });
        if (fig.dropArt) fig.dropArt();
        layer.appendChild(fig.el);
        fig.focus(null, null, 1, 0);
        fig.pose("stand");
      }
      fig.swirl(null, null, false);
      fig.react("idle", 0);
      // T28, CLN-98: her lines in her bubble at her face, his at his
      Kit.Voice.speakers.patient = () => (onArt && fig.anchorEl ? fig.anchorEl("head") : fig.el.querySelector(".fig-head") || fig.el);
      Kit.Voice.speakers.doctor = () => docEl;
      // the doctor is on screen: his box holds only the child's next step, [Pick how she feels] at L1 (T28)
      screen.setNani(plan.level <= 1 ? S.line(env, "pick-feel") : null);
      // UX 16: while they talk, the doctor and the patient stand three-quarter turned to each other
      S.stage(docEl, layer, "talk");
      // level 1's hint that the feeling shows sits ON the patient's own face (13d): on her art, her own face for the
      // feeling (heal-art.json faces); on the stand-in, a circle over the head; never a second face floating beside
      const circle = h("div", "cl-feel-circle on-face", layer);
      const showFeel = (f) => {
        if (onArt) {
          fig.react(f ? (f === "happy" ? "happy" : (data.feelings[f] && data.feelings[f].mood) || f) : "idle", 0);
          return;
        }
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
      /** Her head's box in client px (the art's head anchor, else the greybox head). */
      const headBox = () => {
        const a = onArt && fig.artSpot && fig.artSpot("head");
        if (a) return { left: a.x - a.r, top: a.y - a.r, width: a.r * 2, height: a.r * 2 };
        const head = fig.el.querySelector(".fig-head");
        return head ? head.getBoundingClientRect() : layer.getBoundingClientRect();
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
          qcard.appendChild(Clinic.Figure.face(patient.kind, "neutral"));
          h("span", "cl-ask-q", qcard, "?");
          S.say(S.line(env, "whisper-ask"), "guide");
        }
        S.setExpect("sendoff", () => ({ stage: "sendoff", kind: "say", choice: "howfeel" }));
        const out = await S.moment(env, {
          choices: r.options,
          expected: "howfeel",
          word: (id) => S.line(env, id),
          caption: Kit.plain(S.line(env, "cap-askthem")).replace(/[.!?]$/, ""), // a caption, no full stop
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
        const hb = headBox();
        const bb = box.getBoundingClientRect();
        const hx = (hb.left + hb.width * 0.8 - bb.left) / Math.max(1, bb.width);
        const hy = (hb.top - bb.top) / Math.max(1, bb.height);
        cards.style.left = `${Math.min(0.62, hx + 0.03) * 100}%`;
        cards.style.bottom = `${Math.max(0.25, 1 - hy + 0.03) * 100}%`;
        if (onArt) {
          // on the bed she sits high in the room: the thought bubble opens beside her head, to the left, kept on screen
          cards.classList.add("beside");
          const hl = (hb.left - bb.left) / Math.max(1, bb.width);
          cards.style.left = "";
          cards.style.right = `${(1 - hl + 0.035) * 100}%`;
          cards.style.bottom = "";
          cards.style.top = `${Math.max(0.08, hy) * 100}%`;
        }
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
          caption: Kit.plain(S.line(env, "cap-sayit")).replace(/[.!?]$/, ""), // a caption, no full stop
          character: { act: async (id) => { waveOn(); fig.pose("wave"); await S.say(PL().goodbye(data, id), "patient"); } },
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
      waveOn();
      fig.pose("wave");
      layer.classList.add("leaving");
      S.current = null;
      S.endOnboard();
      // the sticker for the album
      const sticker = h("div", "cl-sticker", stage);
      sticker.appendChild(Clinic.Figure.face(patient.kind, "happy"));
      if (global.Sfx && global.Sfx.gold) try { global.Sfx.gold(); } catch (e) { /* no sound */ }
      await Kit.wait(Kit.fast ? 60 : 1100);
      res.words.push(global.ClinicLang.w(PL().pword("feeling", plan.feeling)));
      if (plan.goodbye) res.words.push(PL().goodbye(data, plan.goodbye));
      return res;
    },
  };
})(typeof self !== "undefined" ? self : this);
