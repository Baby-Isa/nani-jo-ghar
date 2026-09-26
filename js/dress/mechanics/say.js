/*
 * Dress up mechanic `say`: a STUB of the shared speaking moment (design
 * D.4, brief section 12: "`say` with the same API, pills only, listen()
 * when the recogniser exists"). js/shared/speech.js exists, so this calls
 * Speech.listen({choices, timeoutMs}) -> {choice, confidence} | null.
 * When the foundation's shared `say` lands, swap this file for it.
 *
 * Rules it keeps: the closed set is shown as pills (always there, so
 * recognition never blocks); a grown-up can tick "they said it" instead;
 * the character acts on what was heard; the VOICE star is earned only by
 * a recognised right answer or a grown-up's tick, never by a pill.
 * If the family's recordings of every choice aren't there yet (templates
 * are the family's own voices), the microphone says so and the pills and
 * the grown-up's tick carry the moment.
 *
 *   await Dress.Mech.say.run(r, {choices, prompt, answer, who, act}) -> {choice, via, voice}
 *   via: "voice" | "pill" | "parent"; act(choiceId) is what the character does.
 * Knobs (data.mechanics.say.levels): timeoutMs.
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const Dress = global.Dress;
  const M = (Dress.Mech = Dress.Mech || {});
  const Speech = () => global.Speech || (global.Shared && global.Shared.speech) || null;
  let loaded = {};
  /** Load the family's recordings of the choices as templates (inside a tap, for iOS). */
  async function templates(choices) {
    const S = Speech();
    if (!S || !S.loadTemplates) return false;
    for (const id of choices) {
      if (loaded[id] || !Cook.hasAudio(id)) continue;
      loaded[id] = true;
      await S.loadTemplates(id, [`assets/audio/word/${id}.mp3`]).catch(() => 0);
    }
    return S.hasTemplates(choices);
  }
  M.say = {
    async run(r, { choices, prompt, answer, who, act }) {
      const k = Dress.Look.knobs(Dress.data, "say", r.round.level);
      const box = document.querySelector("#moment");
      const S = Speech();
      const pill = (id) => `<button class="mo-pill" type="button" data-choice="${id}"><span class="wp-text">${Lang.html(Lang.wordLine(id))}</span></button>`;
      box.innerHTML = `<div class="mo-say"><button class="mo-mic" type="button" ${S ? "" : "disabled"}><span class="mic-dot"></span><span class="mo-mic-t">Say it</span></button><div class="mo-note"></div></div><div class="mo-pills">${choices.map(pill).join("")}</div><button class="mo-parent" type="button">A grown-up heard it right &#10003;</button>`;
      box.classList.remove("hidden");
      await r.say(prompt, { who });
      const note = (t) => (box.querySelector(".mo-note").textContent = t);
      if (!S) note("Tap the number (no microphone here).");
      r.expect({ kind: "tap", sel: `#moment .mo-pill[data-choice="${choices[answer - 1]}"]`, say: choices[answer - 1] });
      const res = await new Promise((resolve) => {
        const h = async (ev) => {
          const p = ev.target.closest(".mo-pill");
          if (p) return resolve({ choice: p.dataset.choice, via: "pill" });
          if (ev.target.closest(".mo-parent")) return resolve({ choice: choices[answer - 1], via: "parent" });
          const mic = ev.target.closest(".mo-mic");
          if (!mic || mic.disabled) return;
          mic.disabled = true;
          const ready = await templates(choices);
          if (!ready) {
            note("The microphone needs the family's recordings of all these words first. Tap the number, or a grown-up can tick.");
            return;
          }
          const heard = await S.listen({ choices, timeoutMs: k.timeoutMs, onState: (s) => note(s === "listening" ? "Listening…" : s === "speaking" ? "…" : "") });
          mic.disabled = false;
          if (heard) resolve({ choice: heard.choice, via: "voice", confidence: heard.confidence });
          else note("I didn't catch that. Try again, or tap the number.");
        };
        box.addEventListener("click", h);
        r.offs.push(() => box.removeEventListener("click", h));
      });
      r.check();
      box.classList.add("hidden");
      const right = res.choice === choices[answer - 1];
      const voice = (res.via === "voice" && right) || res.via === "parent";
      if (act) await act(res.choice, res);
      return Object.assign(res, { right, voice });
    },
  };
})(window);
