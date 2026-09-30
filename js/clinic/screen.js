/*
 * The clinic's one screen layout (UX s2, s13, s15): the sidebar on the LEFT (the
 * doctor's box at its top with the light bulb, the instruction card, the tray), the play area
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
      const cardEl = h("section", "", side);
      const trayWrap = h("div", "cl-side-tray", side);
      const trayEl = h("div", "", trayWrap);
      // the ? (what do I do here?): the goal for grown-ups, and the first-time help's skip (G7 / CQ15)
      const dock = h("div", "cl-dock", side);
      const helpBtn = h("button", "cl-help-btn", dock, "?");
      helpBtn.type = "button";
      helpBtn.setAttribute("aria-label", "What do I do here?");
      helpBtn.setAttribute("data-ob-pass", "");
      const helpPop = h("div", "cl-help-pop hidden", document.body);
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
        card: new Kit.Card(cardEl, { who: "doctor" }),
        tally: new Kit.Tally(tallyEl),
        stage: null,
      };
      scr.bulb = new Kit.Bulb(bulbBtn, {
        keepArt: !!nani,
        level: opts.level || 1,
        targets: () => app.querySelectorAll(".cl-card, .cl-tray, .cl-belt"),
        onUse: () => {
          scr.hints++;
          hintN.textContent = scr.hints ? String(scr.hints) : "";
          scr.onHint && scr.onHint(scr.hints);
        },
      });
      Kit.Voice.layer = main;
      scr.clearStage = function () {
        // every stage clears its own UI (13f): pills, bubbles, pop-ups and fly-overs left in the play area go too
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
      /** The closed card's paid peek (13a, 13c): a tap opens it for a moment and counts as a hint, like the bulb. */
      scr.peek = function (what) {
        scr.hints++;
        hintN.textContent = String(scr.hints);
        scr.onHint && scr.onHint(scr.hints, what);
      };
      scr.resetHints = function () {
        scr.hints = 0;
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
        nani.set(span.innerHTML, { rec: !!(w && (!w.kutchi || /\[/.test(w.kutchi))) });
      };
      Kit.Voice.speakers.nani = Kit.Voice.speakers.guide = () => bulbRow.querySelector(".ng-face") || bulbRow;
      scr.closeHelp = () => helpPop.classList.add("hidden");
      scr.openHelp = () => {
        helpPop.innerHTML = "";
        h("div", "cl-help-text", helpPop, scr.goal || "Listen to the doctor, then do what the card says.");
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
