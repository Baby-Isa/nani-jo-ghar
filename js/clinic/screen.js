/*
 * The clinic's one screen layout (UX s2, s13, s15): the sidebar on the LEFT (the
 * bulb and sound buttons at its top (a small row, no face), the doctor's one card under it (CLN-140, R4), the tray), the play area
 * (the tally in its top-right corner), and the shared buttons in the play area's bottom-right
 * corner under the thumb. Every stage and every healing game draws into the same
 * frame, so nothing jumps between stages.
 *
 *   const scr = Clinic.Screen.build(container, {level});
 *   scr.card (Kit.Card) · scr.bulb (Kit.Bulb) · scr.tally (Kit.Tally)
 *   scr.trayEl · scr.play (the play area) · scr.actions (right rail)
 *   scr.stage (a fresh layer in the play area; clearStage() empties it)
 */
(function (global) {
  "use strict";
  const Clinic = (global.Clinic = global.Clinic || {});
  const Kit = Clinic.Kit;
  const h = Kit.h;

  Clinic.Screen = {
    build(container, opts = {}) {
      container.innerHTML = "";
      const app = h("div", "cl-app", container);
      const side = h("aside", "cl-side", app);
      // the doctor's box at the top (13f: Nani isn't at the clinic, so the doctor fills her guidance
      // role): the shared guide box with his face (= replay), his line now, the light bulb and mute
      const bulbRow = h("div", "cl-side-top cl-nani cl-docbox", side);
      let nani = null;
      let bulbBtn;
      if (global.NaniGuide) {
        nani = global.NaniGuide.mount(bulbRow, {
          face: Kit.DOCTOR_FACE,
          name: "The doctor",
          bulb: Kit.url("assets/ui/results/icon-bulb.webp"),
          onBulb: () => scr.bulb.use(),
          onReplay: (btn) => {
            if (!scr.naniLine) return;
            btn.classList.add("on");
            Kit.Voice.say(scr.naniLine, { who: "guide", noBubble: true }).then(() => btn.classList.remove("on"));
          },
        });
        bulbBtn = bulbRow.querySelector(".ng-bulb");
      } else bulbBtn = h("button", "", bulbRow);
      const hintN = h("span", "cl-hint-n", bulbRow.querySelector(".ng-tools") || bulbRow);
      // CLN-140 (Zafar, 14 Oct, R4 in the clinic): the doctor is always both the guide and the asker, so he has ONE card
      // at the top of the sidebar: his face once (on the card), his current-step line as its top strip (T22, T29), then
      // the goal headline and the steps. His box keeps only the bulb and sound buttons, a small row above with no face.
      if (nani && nani.strip) nani.strip(true);
      const cardEl = h("section", "", side);
      /** The doctor's face on his card (= replay): the real man's face (CLN-150, Kit.doctorFace). */
      const doctorFace = () => {
        const f = h("div", "cl-face doctor");
        const img = h("img", "", f);
        img.alt = "";
        img.src = Kit.doctorFace("neutral");
        return f;
      };
      const trayWrap = h("div", "cl-side-tray", side);
      const trayEl = h("div", "", trayWrap);
      // the ? (what do I do here?): the goal for grown-ups, and the first-time help's skip (G7 / CQ15)
      const dock = h("div", "cl-dock", side);
      const helpBtn = h("button", "cl-help-btn", dock, "?");
      helpBtn.type = "button";
      helpBtn.setAttribute("aria-label", "What do I do here?");
      helpBtn.setAttribute("data-ob-pass", "");
      const helpPop = h("div", "cl-help-pop hidden", document.body);
      helpPop.dataset.njgKeep = ""; // the page's one pop-up: kept between stages (the host's E17 check)
      helpPop.setAttribute("data-ob-pass", "");
      helpPop.setAttribute("role", "dialog");
      const main = h("main", "cl-main", app);
      const play = h("div", "cl-play", main);
      const tallyEl = h("div", "cl-tally empty", main);
      // the buttons (the shared kit, UX 15): the bottom-right corner of the play area, inside its edges
      const actions = h("div", "cl-actions", main);
      const scr = {
        app,
        side,
        main,
        play,
        actions,
        trayEl,
        trayWrap,
        hints: 0,
        card: new Kit.Card(cardEl, { who: "doctor", face: doctorFace }),
        tally: new Kit.Tally(tallyEl),
        stage: null,
      };
      scr.bulb = new Kit.Bulb(bulbBtn, {
        keepArt: !!nani,
        level: opts.level || 1,
        targets: () => app.querySelectorAll(".cl-card, .cl-tray, .cl-belt"),
        // D11 (1 Oct, decision 27): the bulb is for language: on a closed card it opens the card, in English, for its time
        onOn: () => scr.card && scr.card.bulbOpen && scr.card.bulbOpen(true),
        onOff: () => scr.card && scr.card.bulbOpen && scr.card.bulbOpen(false),
        onUse: () => {
          scr.hints++;
          hintN.textContent = scr.hints ? String(scr.hints) : "";
          scr.onHint && scr.onHint(scr.hints);
        },
      });
      Kit.Voice.layer = main;
      // decision 55: the doctor off screen says his line from his green box (the line there while it's said, then back)
      Kit.Voice.toGuide = (w) => {
        if (!nani) return null;
        const prev = scr.naniLine;
        scr.setNani(w);
        return () => scr.naniLine === w && scr.setNani(prev);
      };
      scr.clearStage = function () {
        // every stage clears its own UI (13f): pills, bubbles, pop-ups and fly-overs left in the play area go too
        // CLN-109, S04-B (decision 75 (3)): a stage end through the shared lifecycle: every voice stops (a heal game's
        // lines never reach the send-off), every bubble goes
        if (global.Lifecycle) global.Lifecycle.stageEnd("clinic:stage");
        else if (Kit.Voice && Kit.Voice.clear) Kit.Voice.clear();
        // SH-66 (S05-D): a fresh room is the next stage starting: mark it, so its own opening lines (the heal game's
        // request pop-up) are known to be its own, never the last stage's carrying over
        if (global.Lifecycle && global.Lifecycle.stageStart) global.Lifecycle.stageStart("clinic:stage");
        if (scr.bulb && scr.bulb.off) scr.bulb.off(); // SH-41: the bulb's English ends with its stage
        main.querySelectorAll(".cl-pills, .njg-pills, .cl-bubble, .cl-thought, .cl-card-big, .say-moment, .njg-say").forEach((n) => n.remove());
        document.querySelectorAll("body > .cl-fly").forEach((n) => n.remove());
        play.innerHTML = "";
        scr.stage = h("div", "cl-stage", play);
        return scr.stage;
      };
      scr.clearActions = function () {
        actions.innerHTML = "";
      };
      scr.go = function (label, onPress, cls) {
        return Kit.button(actions, label, onPress, cls);
      };
      scr.setLevel = function (l) {
        scr.bulb.level = l;
      };
      /**
       * A look at the closed card (D12, 1 Oct, decision 27: the eye is for reading): a tap on the card (or its small
       * eye) opens it for a moment. Counted on its own (the end screen's eye badge), never as a bulb.
       */
      scr.looks = 0;
      scr.peek = scr.look = function (what) {
        scr.looks++;
        scr.onLook && scr.onLook(scr.looks, what);
      };
      scr.resetHints = function () {
        scr.hints = 0;
        scr.looks = 0;
        hintN.textContent = "";
      };
      scr.goal = "";
      scr.nani = nani;
      scr.naniLine = null;
      /** The doctor's line now, in his box: {kutchi, english} (an English placeholder is flagged "to record"). */
      scr.setNani = scr.setGuide = (w) => {
        scr.naniLine = w || null;
        if (!nani) return;
        const span = document.createElement("span");
        if (w) Kit.text(w, span);
        const rec = !!(w && (!w.kutchi || /\[/.test(w.kutchi)));
        nani.set(span.innerHTML, { rec });
        // CLN-140 (R4): the doctor is the asker and the guide in every stage: his line is his card's top strip
        scr.card.setStrip(w ? { html: span.innerHTML, rec } : null);
      };
      /** R4 in the clinic (CLN-140): always one card (the strip is on in every stage); kept for the stages that ask. */
      scr.stripMode = () => {};
      // his face on the card replays the card; a card with only his line in its strip replays that line
      scr.card.onReplay = () => {
        if (!scr.card.rows.length && !scr.card.titleText && scr.naniLine) Kit.Voice.say(scr.naniLine, { who: "guide", noBubble: true });
      };
      Kit.Voice.speakers.nani = Kit.Voice.speakers.guide = () => cardEl.querySelector(".cl-card-face") || bulbRow;
      scr.closeHelp = () => helpPop.classList.add("hidden");
      scr.openHelp = () => {
        helpPop.innerHTML = "";
        h("div", "cl-help-text", helpPop, scr.goal || "Listen to the doctor, then do what the card says.");
        // SH-60: the grown-ups' "play as new" (the same as Cook's): every word is new again, the first-time help too
        global.NjgButtons.playAsNew(helpPop, () => {
          // Sprint 10 (Zafar, 21 Oct): the one fresh start (words, first-time help, Cook, clinic levels, story, conversations)
          const core = global.__clinic && global.__clinic.core;
          if (global.Save && global.Save.resetPlayer) global.Save.resetPlayer();
          if (core && core.progress && core.progress.reset) core.progress.reset();
          scr.closeHelp();
        }, { cls: "cl-help-new" });
        if (global.Onboard && global.Onboard.active && global.Onboard.active()) {
          const sk = global.Onboard.skipButton(helpPop);
          if (sk) sk.addEventListener("skipped", scr.closeHelp);
        }
        const r = helpBtn.getBoundingClientRect();
        helpPop.style.left = `${Math.round(r.left)}px`;
        helpPop.style.bottom = `${Math.round(global.innerHeight - r.top + 8)}px`;
        helpPop.classList.remove("hidden");
      };
      helpBtn.addEventListener("click", () => (helpPop.classList.contains("hidden") ? scr.openHelp() : scr.closeHelp()));
      document.addEventListener("pointerdown", (e) => !helpPop.classList.contains("hidden") && !e.target.closest(".cl-help-pop, .cl-help-btn") && scr.closeHelp(), true);
      scr.helpBtn = helpBtn;
      scr.helpPop = helpPop;
      scr.clearStage();
      return scr;
    },
  };
})(typeof self !== "undefined" ? self : this);
