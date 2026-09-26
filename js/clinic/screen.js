/*
 * The clinic's one screen layout (UX s2, s13): the sidebar on the LEFT (the
 * light bulb at its top, the instruction card, the tray), the play area
 * (the tally in its top-right corner), and the big buttons on the RIGHT
 * under the thumb. Every stage and every healing game draws into the same
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
      const bulbRow = h("div", "cl-side-top", side);
      const bulbBtn = h("button", "", bulbRow);
      const hintN = h("span", "cl-hint-n", bulbRow);
      const cardEl = h("section", "", side);
      const trayWrap = h("div", "cl-side-tray", side);
      const trayEl = h("div", "", trayWrap);
      const main = h("main", "cl-main", app);
      const play = h("div", "cl-play", main);
      const tallyEl = h("div", "cl-tally empty", main);
      const actions = h("div", "cl-actions", app);
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
      scr.resetHints = function () {
        scr.hints = 0;
        hintN.textContent = "";
      };
      scr.clearStage();
      return scr;
    },
  };
})(typeof self !== "undefined" ? self : this);
