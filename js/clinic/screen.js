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
      // S14: the side panel is one of the central rules' skip zones (a tap on it never skips what is said: data/rules.json
      // skip.never.side, its .side-panel) and out of bounds for a bubble (data-njg-keepout, contract-86)
      const side = h("aside", "cl-side side-panel", app);
      side.setAttribute("data-njg-keepout", "");
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
      const doctorFace = () => Kit.faceCircle("doctor", Kit.doctorFace("neutral"), "cl-face doctor");
      const trayWrap = h("div", "cl-side-tray", side);
      const trayEl = h("div", "", trayWrap);
      // the ? (what do I do here?): the goal for grown-ups, and the first-time help's skip (G7 / CQ15)
      const dock = h("div", "cl-dock", side);
      const helpBtn = h("button", "", dock, "?");
      helpBtn.type = "button";
      helpBtn.setAttribute("aria-label", "What do I do here?");
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
        main.querySelectorAll(".cl-pills, .njg-pills, .cv-line, .cl-thought, .cl-card-big, .say-moment, .njg-say").forEach((n) => n.remove());
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
      Kit.Voice.speakers.nani = Kit.Voice.speakers.guide = () => cardEl.querySelector(".oc-face") || bulbRow;
      // the ? (what do I do here?): the kit's one grown-ups' pop-up (js/shared/buttons.js NjgButtons.grownUpPop; S13-A2,
      // non-negotiable 3): the goal for grown-ups, SH-60's "Play as new" (the same as Cook's) and the first-time help's skip
      const gu = global.NjgButtons.grownUpPop(helpBtn, {
        goal: () => scr.goal || "Listen to the doctor, then do what the card says.",
        // Sprint 10 (Zafar, 21 Oct): the one fresh start (words, first-time help, Cook, clinic levels, story, conversations)
        playAsNew: () => {
          const core = global.njgTest && global.njgTest.clinic && global.njgTest.clinic.core;
          if (global.Save && global.Save.resetPlayer) global.Save.resetPlayer();
          if (core && core.progress && core.progress.reset) core.progress.reset();
        },
      });
      /*
       * S14 roll-out (the rulebook's helper card; the rollout plan 4a 4 and 4c: "the doctor's box as the helper card"): in a heal
       * round the doctor's box is the guide's helper card, as Nani's is in Cook: no bulb and no speaker of its own, an arrow
       * that opens the full answer for the step now (its picture, its Kutchi, its English: WordCard.big14 with everything
       * shown, side by side), growing in the box; a second tap folds it. The answer is the card's open row (the step's line)
       * with the picture of the tool the step lights. Opening it is the child's own help: it never counts as the guide's hint.
       */
      const help14 = { on: false, open: false, arrow: null, slot: null, key: null };
      const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      const helperWord = () => {
        const c = scr.card;
        const r = c && (c.row(c.st.now) || c.rows.find((x) => !c.st.done.has(x.id)));
        if (!r) return null;
        // the step's tool: the one lit now (the light, the next-up glow, the pick), else the tool its line names (the tool's
        // id words in the line's English: "Water lukewarm, three jugs" is jug-lukewarm)
        let lit = main.querySelector(".hs-tool.ob-lit img, .hs-tool.next-up img, .hs-tool.pulse img, .hs-tool.sel img");
        if (!lit) {
          const en = ` ${String(r.english || "").toLowerCase().replace(/[^a-z]+/g, " ")} `;
          let best = 0;
          main.querySelectorAll(".hs-tool[data-tool]").forEach((t) => {
            const img = t.querySelector("img");
            if (!img) return;
            const sc = String(t.dataset.tool).toLowerCase().split(/[^a-z]+/).filter((p) => p.length > 2 && (en.includes(` ${p} `) || en.includes(` ${p}s `))).length;
            if (sc > best) (best = sc), (lit = img);
          });
        }
        return { id: r.id, kutchi: r.kutchi || r.english, english: r.english, rec: !r.kutchi || !!r.placeholder, picture: lit ? { src: lit.currentSrc || lit.src, fit: "contain" } : null, say: () => Kit.Voice.say(r, { who: "guide", noBubble: true }) };
      };
      const paint14 = () => {
        if (!help14.slot) return;
        const w = help14.open ? helperWord() : null;
        bulbRow.classList.toggle("cl-help-open", !!w);
        help14.arrow.setAttribute("aria-expanded", w ? "true" : "false");
        const key = w ? `${w.id}|${w.picture ? w.picture.src : ""}` : null;
        if (key === help14.key) return;
        help14.key = key;
        help14.slot.innerHTML = "";
        if (!w || !global.WordCard || !global.WordCard.big14) return;
        const el = global.WordCard.big14(help14.slot, w, { all: true, variant: "side", cls: "cl-helper-card" });
        if (global.WordCard.fit14) (global.requestAnimationFrame || setTimeout)(() => global.WordCard.fit14(el));
      };
      scr.s14 = (on) => {
        help14.on = !!on;
        const tools = [bulbRow.querySelector(".ng-bulb"), bulbRow.querySelector(".ng-mute"), hintN];
        tools.forEach((t) => t && (t.style.display = on ? "none" : ""));
        if (on && !help14.arrow) {
          const a = (help14.arrow = h("button", "cl-help-arrow", bulbRow.querySelector(".ng-tools") || bulbRow));
          a.type = "button";
          a.setAttribute("aria-label", "Help");
          a.innerHTML = ARROW;
          a.addEventListener("click", (ev) => {
            ev.stopPropagation();
            help14.open = !help14.open;
            paint14();
            try {
              if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note("helper", { step: help14.open ? "open" : "close", by: "arrow" });
            } catch (e) {
              /* only a log */
            }
          });
          help14.slot = h("div", "cl-helper", bulbRow);
          // the card's open row moves on: an open helper card follows it
          if (global.MutationObserver) new global.MutationObserver(() => help14.open && paint14()).observe(side, { subtree: true, attributes: true, attributeFilter: ["class"] });
        }
        if (help14.arrow) help14.arrow.style.display = on ? "" : "none";
        bulbRow.classList.toggle("cl-s14", !!on);
        if (!on) {
          help14.open = false;
          paint14();
        }
      };
      scr.closeHelp = () => gu.close();
      scr.openHelp = () => gu.open();
      scr.helpBtn = helpBtn;
      scr.helpPop = gu.el;
      scr.clearStage();
      return scr;
    },
  };
})(typeof self !== "undefined" ? self : this);
