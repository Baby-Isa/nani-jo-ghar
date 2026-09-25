/*
 * Mechanic: tell (role reversal: the child SAYS a word and a character acts
 * on it). docs/modes/clinic-design.md R3.4. Shared with every mode's
 * speaking moment; built here first and offered to js/shared/mechanics/
 * at integration.
 *
 * Every speaking moment (S1 "It's my knee", S2 "Tell him where", S3 bring
 * someone in, S4 "What's this?") runs on tell.run(), against
 *   listen({choices, timeoutMs}) -> {choice, confidence} | null
 * (js/shared/speech.js, reached through js/clinic/stubs/speech.js so the
 * lab and the voice bot can drive it).
 *
 * Rules (R3.4):
 *  - the closed set is stated and never bigger than 8;
 *  - a null or a low confidence (voice.minConfidence) gets ONE "Say it
 *    again?" from the doctor, then the audio pills slide up (a look-alike
 *    group of 3); the mic stays available;
 *  - a grown-up can judge instead ("a grown-up judges speaking"): ✓ / again;
 *  - the mic never blocks progress: at level 1 the pills are there from the
 *    start (the child may not know the word yet);
 *  - what the recogniser heard is shown BY THE CHARACTER ACTING ON IT (the
 *    doctor presses where he heard), never by an error message: a wrong
 *    hearing plays as an ordinary miss in the fiction;
 *  - the voice star: the first spoken try accepted (recogniser or grown-up).
 *    Tapping a pill is always allowed and earns no voice star.
 *
 * The core (run) is pure: the Node leak bot plays it with a fake io.
 * In the browser the same file also registers the "tell" mechanic, whose io
 * is the mic button, the pills and the character.
 */
(function (root, factory) {
  const T = factory();
  if (typeof module === "object" && module.exports) module.exports = T;
  else root.ClinicTell = T;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const T = {};

  /**
   * o: {choices, answer, io, minConfidence, timeoutMs, pillsFromStart, parentJudge, maxSpoken}
   * io: {
   *   prompt({pills, mic}) -> {via: "mic"} | {via: "pill", choice}   (what the child did)
   *   listen({choices, timeoutMs}) -> {choice, confidence} | null
   *   parent(answer) -> "yes" | "again"                                (a grown-up's call)
   *   act(choice, ok) -> the character acts on what it heard or was tapped
   *   sayAgain() -> the doctor's "Say it again?"
   * }
   * Resolves {choice, spoken, first, attempts, path}: `spoken` = the accepted
   * answer came from the voice; `first` = accepted on the first spoken try.
   */
  T.run = async function (o) {
    const { choices, answer, io } = o;
    if (!choices || choices.length < 2 || choices.length > (o.maxSet || 8)) throw new Error(`tell: a closed set of 2-8, got ${choices && choices.length}`);
    if (!choices.includes(answer)) throw new Error("tell: the answer must be in the set");
    const minC = o.minConfidence != null ? o.minConfidence : 0.35;
    const maxSpoken = o.maxSpoken || 2;
    let pills = !!o.pillsFromStart;
    let spokenTries = 0;
    let askedAgain = false;
    const path = [];
    for (let guard = 0; guard < 40; guard++) {
      const how = await io.prompt({ pills, mic: true });
      if (how.via === "pill") {
        const ok = how.choice === answer;
        path.push(ok ? "pill-right" : "pill-wrong");
        await io.act(how.choice, ok);
        if (ok) return { choice: answer, spoken: false, first: false, attempts: spokenTries, path };
        continue;
      }
      // the microphone
      if (o.parentJudge) {
        const said = await io.parent(answer);
        spokenTries++;
        if (said === "yes") {
          path.push("parent-yes");
          await io.act(answer, true);
          return { choice: answer, spoken: true, first: spokenTries === 1, attempts: spokenTries, path };
        }
        path.push("parent-again");
        if (spokenTries >= maxSpoken) pills = true;
        continue;
      }
      const r = await io.listen({ choices, timeoutMs: o.timeoutMs || 4000 });
      if (!r || r.confidence < minC || !choices.includes(r.choice)) {
        // didn't catch it: a shrug, never a wrong. One "say it again?", then the pills
        path.push("null");
        if (!askedAgain) {
          askedAgain = true;
          await io.sayAgain();
        } else pills = true;
        spokenTries++;
        continue;
      }
      spokenTries++;
      const ok = r.choice === answer;
      path.push(ok ? "heard-right" : "heard-wrong");
      await io.act(r.choice, ok);
      if (ok) return { choice: answer, spoken: true, first: spokenTries === 1, attempts: spokenTries, path };
      if (spokenTries >= maxSpoken) pills = true;
    }
    return { choice: answer, spoken: false, first: false, attempts: spokenTries, path: path.concat("gave-up") };
  };

  /** The fallback pills: the answer and its look-alikes, 3 in all (one group, so it's never the odd one out). */
  T.pills = function (choices, answer, groups, n = 3, rnd = Math.random) {
    const g = (groups || []).find((x) => x.includes(answer) && x.filter((y) => choices.includes(y)).length >= n);
    const pool = g ? g.filter((y) => choices.includes(y)) : choices;
    const others = pool.filter((y) => y !== answer).sort(() => rnd() - 0.5);
    return [answer].concat(others.slice(0, n - 1)).sort(() => rnd() - 0.5);
  };

  return T;
});

/* ---------------- the browser mechanic ---------------- */
(function (global) {
  const Cook = global && global.Cook;
  if (!Cook || !Cook.Mech || typeof document === "undefined") return;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const T = global.ClinicTell;
  const $ = (s) => document.querySelector(s);

  /** The speaking panel: the mic button and (when due) the pills, in #choices (never over the patient). */
  function prompt(z, { choices, answer, pills, pillSet }) {
    const box = $("#choices");
    box.innerHTML = "";
    box.classList.remove("hidden");
    box.classList.add("cl-tell");
    return new Promise((resolve) => {
      const mic = document.createElement("button");
      mic.className = "cl-mic";
      mic.type = "button";
      mic.setAttribute("aria-label", "Say it");
      mic.innerHTML = "<span>&#127908;</span><small>Say it</small>";
      mic.addEventListener("click", () => {
        Cook.unlockAudio();
        box.classList.add("hidden");
        resolve({ via: "mic" });
      });
      box.appendChild(mic);
      if (pills) {
        pillSet.forEach((id) => {
          const b = document.createElement("div");
          b.className = "choice";
          b.dataset.key = id;
          b.setAttribute("role", "button");
          // audio pills: text only at the reads stage (the pill builder hides it by word stage)
          b.appendChild(UI.pill(Lang.wordLine(id), { shape: "choice", noTranslate: true, hide: (w) => Cook.wordStage(w) < 99 && !global.ClinicReads }));
          b.addEventListener("click", () => {
            Cook.unlockAudio();
            box.classList.add("hidden");
            resolve({ via: "pill", choice: id });
          });
          box.appendChild(b);
        });
      }
      z.expect({ kind: "click", selector: "#choices .cl-mic", tell: true, answer, pills: pills ? pillSet : null, pillSel: (id) => `#choices .choice[data-key="${id}"]` });
    });
  }
  /** A grown-up judges: ✓ / again. */
  function parent(z, answer) {
    const box = $("#choices");
    box.innerHTML = "";
    box.classList.remove("hidden");
    return new Promise((resolve) => {
      const q = document.createElement("div");
      q.className = "cl-parent";
      q.innerHTML = `<small>Grown-up: did they say it?</small>`;
      q.appendChild(UI.pill(Lang.wordLine(answer), { noTranslate: true }));
      const yes = document.createElement("button");
      yes.className = "btn primary";
      yes.id = "cl-parent-yes";
      yes.textContent = "✓ Yes";
      const again = document.createElement("button");
      again.className = "btn";
      again.id = "cl-parent-again";
      again.textContent = "Again";
      yes.addEventListener("click", () => (box.classList.add("hidden"), resolve("yes")));
      again.addEventListener("click", () => (box.classList.add("hidden"), resolve("again")));
      q.appendChild(yes);
      q.appendChild(again);
      box.appendChild(q);
      z.expect({ kind: "click", selector: "#cl-parent-yes", parent: true });
    });
  }

  Cook.Mech.define("tell", {
    /**
     * params: {row (a ClinicVisit voice row), act(choice, ok) -> Promise (the character acts),
     *          sayAgain() -> Promise}
     * Returns tell.run's result, and reports the voice (never the ear) star.
     */
    async run(z, { row, act, sayAgain }, k) {
      const C = global.Clinic;
      const vc = (Cook.data.clinic && Cook.data.clinic.voice) || {};
      const groups = (Cook.data.lookalike_groups || {}).groups || [];
      const answer = row.accept[0];
      const pillSet = T.pills(row.options, answer, groups, 3);
      const res = await T.run({
        choices: row.options,
        answer,
        minConfidence: vc.minConfidence,
        timeoutMs: vc.timeoutMs,
        maxSet: vc.maxSet,
        pillsFromStart: !!k.pillsWithMic,
        parentJudge: !!(C && C.settings.parentJudges),
        io: {
          prompt: (o) => prompt(z, { choices: row.options, answer, pills: o.pills, pillSet }),
          listen: (o) => C.Speech.listen(o, { answer }),
          parent: (a) => parent(z, a),
          act: (choice, ok) => (act ? act(choice, ok) : Promise.resolve()),
          sayAgain: () => (sayAgain ? sayAgain() : z.say(Lang.line("cl-sayagain"))),
        },
      });
      $("#choices").classList.remove("cl-tell");
      z.expect(null);
      if (z.ctx && z.ctx.voice) z.ctx.voice(row, res);
      return res;
    },
  });
})(typeof window !== "undefined" ? window : null);
