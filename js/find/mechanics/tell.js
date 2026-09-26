/*
 * Find it, mechanic `tell` (docs/find-it-design.md D3, D4): role reversal.
 * The child says it; a character acts on whatever came back, so the child
 * sees what they said. Built on the shared speaking moment (js/shared/say.js
 * Say.tell over js/shared/speech.js): the mic and the closed set as pills;
 * a wrong act gets one retry ("Nar!", the character puts it back), then the
 * pills; nothing ever waits on the microphone longer than timeoutMs.
 *
 *   const out = await Find.tell(round, {
 *     choices,            // the closed set on screen (2-8 word ids)
 *     expected,           // what a parent's ✓ confirms (optional)
 *     accept(choice),     // false: the act was wrong (a miss; the pills stay up)
 *     actor: {act(choice, via), miss(), ...},
 *     caption,            // the grown-up's line under the mic
 *   });
 *
 * In the lab, the microphone is Find.fakeListen (a picker: "what did the
 * child say?"); elsewhere the real Speech, which with no family recordings
 * for the set hides the mic and makes the pills live at once. Every outcome
 * goes on round.moments for the voice star (Stars.voice: a recognition or a
 * parent's ✓ counts; a pill leaves it open, never earns it).
 */
(function (global) {
  const Cook = global.Cook;
  const Find = global.Find;
  const $ = (s) => document.querySelector(s);

  Find.tell = async function (round, opts) {
    const T = Find.data.mechanics.tell || {};
    const lab = round.lab;
    const speech = lab ? { listen: Find.fakeListen, hasTemplates: () => true, status: () => "ok" } : global.Speech || null;
    const Say = global.Say;
    if (!Say) throw new Error("js/shared/say.js is not loaded");
    round.phase = "say";
    round.saying = { choices: opts.choices.slice(), accept: opts.accept || null };
    const out = await Say.tell({
      choices: opts.choices,
      mode: "find",
      actor: opts.actor || {},
      accept: opts.accept,
      expected: opts.expected,
      grandparent: !!(Find.state && Find.state.lab && Find.state.lab.parent && lab),
      pillsLive: round.level <= (T.pillsLiveToLevel || 0) && !lab,
      timeoutMs: T.timeoutMs || 4000,
      pillsAfterMs: lab ? 0 : (T.pillsAfterMs || 8000) / Math.max(1, Cook.speed),
      retries: T.retries != null ? T.retries : 1,
      label: opts.label || ((id) => (typeof id === "number" ? String(id) : Cook.display(id))),
      caption: opts.caption,
      container: $("#stage"),
      speech,
    });
    round.saying = null;
    round.moments.push(out);
    if (!round.alive()) throw new Cook.Abort("left");
    return out;
  };
})(window);
