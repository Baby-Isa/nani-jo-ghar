/*
 * Shared star sets and ear/voice rules, as data (docs/shared-api.md s3).
 *
 * Every mode has the same four stars in its own clothes: the ear
 * ("Understood"), a hand/craft star (chef's hat, broom, umbrella...), the
 * third star (No help in Relaxed, Quick in Busy) and, where there is a
 * speaking moment, the voice star. What changes per mode is data
 * (data/shared/stars.json): how many tested rows the ear needs, what share
 * must be heard, which rows are taught rather than tested, and what the
 * voice star counts. This module only reads that data and scores rows.
 *
 *   Stars.load(json)  await Stars.loadJSON(url?)
 *   Stars.rules(mode, variant?)            the merged knobs
 *   Stars.set(mode, {busy, voice})         [{key, icon, name, tip}] in display order
 *   Stars.installInto(cookData)            add every star set to Cook.data.star_sets
 *   Stars.outcome(row, rules)              "heard" | "wrong" | "late" | "taught" | "retry" | "menu" | "placeholder"
 *   Stars.isTested(row, rules)             does this row count for the ear?
 *   Stars.ear(rows, mode|rules)            {state: earned|lost|untested, tested, heard, ratio, need}
 *   Stars.voice(moments, mode|rules)       {state: earned|open|untested|none, said, counted, ratio}
 *   Stars.progress(rows, mode|rules, {busy})  per word: {word, correct, missWeight} for progress.js
 *   Stars.isMenuWord(id)
 *   Stars.ICONS                            SVGs for the new icon names
 *
 * A row is {word | words, outcome?, ok?, stage?, taught?, retry?,
 * placeholder?}: outcome wins; else ok true/false means heard/wrong. A
 * speaking moment is what js/shared/say.js resolves: {via: "voice" |
 * "pill" | "parent", confidence?, tries?}.
 *
 * Plain <script>: window.Stars (and Shared.stars); Node: require().
 */
(function (root, factory) {
  const Stars = factory();
  if (typeof module === "object" && module.exports) module.exports = Stars;
  else {
    root.Stars = Stars;
    (root.Shared = root.Shared || {}).stars = Stars;
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const Stars = {};
  const BUILTIN = {
    earPass: 1,
    minTested: 2,
    taughtStage: 1,
    placeholdersTested: false,
    voicePass: 1,
    voiceMin: 1,
    firstTry: false,
    minConfidence: 0.5,
    busyWrongWeight: 1,
    lateCounts: true,
    maxMissWeightPerRound: null,
  };
  let DATA = { rules: { defaults: BUILTIN }, star_sets: {}, aliases: {}, menu_words: { ids: [] } };
  Stars.load = (json) => {
    DATA = json;
    return Stars;
  };
  Stars.loadJSON = async (url) => Stars.load(await (await fetch(url || "data/shared/stars.json")).json());
  Stars.data = () => DATA;
  const modeId = (m) => (DATA.aliases && DATA.aliases[m]) || m;

  /** Knobs for a mode (and a variant: a visit type, a mechanic), defaults filled in. */
  Stars.rules = function (mode, variant) {
    if (mode && typeof mode === "object") return Object.assign({}, BUILTIN, mode);
    const R = DATA.rules || {};
    const m = R[modeId(mode)] || {};
    const v = (variant && m.variants && m.variants[variant]) || {};
    const out = Object.assign({}, BUILTIN, R.defaults || {}, m, v);
    delete out.variants;
    return out;
  };
  const rulesOf = (r, variant) => (r && typeof r === "object" ? Stars.rules(r) : Stars.rules(r, variant));

  /** The star slots to show, in order: ear, hand, third (relaxed or busy), and voice when the round has a speaking moment. */
  Stars.set = function (mode, opts) {
    opts = opts || {};
    const s = (DATA.star_sets || {})[modeId(mode)] || {};
    const slot = (key, from) => Object.assign({ key }, s[from || key] || { icon: key, name: key });
    const out = [slot("ear"), slot("hand"), slot("third", opts.busy ? "busy" : "relaxed")];
    if (opts.voice) out.push(slot("voice"));
    return out;
  };
  /** Add every mode's star set to a Cook-shaped data object (never overwrites what a mode's own data set). */
  Stars.installInto = function (cookData) {
    cookData.star_sets = cookData.star_sets || {};
    for (const [m, set] of Object.entries(DATA.star_sets || {})) {
      cookData.star_sets[m] = Object.assign({}, set, cookData.star_sets[m] || {});
    }
    return cookData;
  };

  Stars.isMenuWord = (id) => ((DATA.menu_words && DATA.menu_words.ids) || []).includes(id);
  const wordsOf = (row) => (row.words ? row.words : row.word != null ? [row.word] : []);

  /** What a row counts as for the ear. */
  Stars.outcome = function (row, r) {
    r = rulesOf(r);
    if (row.retry || row.outcome === "retry") return "retry";
    if (row.taught || row.outcome === "taught" || (row.stage != null && row.stage <= r.taughtStage)) return "taught";
    const ws = wordsOf(row);
    if (ws.length && ws.every((w) => Stars.isMenuWord(w))) return "menu";
    if (row.placeholder && !r.placeholdersTested) return "placeholder";
    if (row.outcome) return row.outcome;
    return row.ok ? "heard" : "wrong";
  };
  Stars.isTested = (row, r) => ["heard", "wrong", "late"].includes(Stars.outcome(row, r));

  /**
   * The ear star. untested (shown dashed, "not tested this time") when fewer
   * than minTested rows were tested; else earned when heard / tested >= earPass.
   * A late answer is tested and not heard.
   */
  Stars.ear = function (rows, mode, variant) {
    const r = rulesOf(mode, variant);
    let tested = 0;
    let heard = 0;
    for (const row of rows || []) {
      const o = Stars.outcome(row, r);
      if (o === "heard" || o === "wrong" || o === "late") tested++;
      if (o === "heard") heard++;
    }
    const ratio = tested ? heard / tested : 0;
    const state = tested < r.minTested ? "untested" : ratio >= r.earPass - 1e-9 ? "earned" : "lost";
    return { state, tested, heard, ratio, need: r.minTested };
  };

  /**
   * The voice star, from the speaking moments of a round. A moment counts
   * when the recogniser accepted it (confidence >= minConfidence; with
   * firstTry, only on the first try) or a parent ticked it. A pill tap
   * counts as said, not counted: the star stays open, never lost.
   *   none      no speaking moment: no voice slot
   *   untested  fewer than voiceMin moments
   *   earned    counted / said >= voicePass
   *   open      otherwise
   */
  Stars.voice = function (moments, mode, variant) {
    const r = rulesOf(mode, variant);
    const said = (moments || []).filter((m) => m && m.via && m.via !== "skip");
    const counted = said.filter((m) => {
      if (m.via === "parent") return !r.firstTry || (m.tries || 1) <= 1;
      if (m.via !== "voice") return false;
      if (m.confidence != null && m.confidence < r.minConfidence) return false;
      return !r.firstTry || (m.tries || 1) <= 1;
    }).length;
    const ratio = said.length ? counted / said.length : 0;
    let state = "none";
    if (said.length) state = said.length < r.voiceMin ? "untested" : ratio >= r.voicePass - 1e-9 ? "earned" : "open";
    return { state, said: said.length, counted, ratio };
  };

  /**
   * What a round means for each word's stage (feed js/progress.js): per
   * word, how many correct first answers, and the miss weight (a wrong is
   * 1, or busyWrongWeight in Busy; a late is 1 only when lateCounts; taught,
   * retry and menu rows are nothing), capped per round by maxMissWeightPerRound.
   */
  Stars.progress = function (rows, mode, opts) {
    const r = rulesOf(mode, opts && opts.variant);
    const busy = !!(opts && opts.busy);
    const per = {};
    for (const row of rows || []) {
      const o = Stars.outcome(row, r);
      for (const w of wordsOf(row)) {
        const e = (per[w] = per[w] || { word: w, correct: 0, missWeight: 0 });
        if (o === "heard") e.correct++;
        else if (o === "wrong") e.missWeight += busy ? r.busyWrongWeight : 1;
        else if (o === "late" && r.lateCounts) e.missWeight += 1;
      }
    }
    const out = Object.values(per);
    if (r.maxMissWeightPerRound != null) out.forEach((e) => (e.missWeight = Math.min(e.missWeight, r.maxMissWeightPerRound)));
    return out;
  };

  /** New icon names (24x24, currentColor), until the shell merges them into UI.ICON. */
  const svg = (body) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  Stars.ICONS = {
    mic: svg('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/>'),
    megaphone: svg('<path d="M3 10v4h3l8 4V6L6 10z"/><path d="M17 9a4 4 0 0 1 0 6M8 14l1 5"/>'),
    broom: svg('<path d="M14 3 10.5 11M7 11h7l2 10H5z"/><path d="M8.5 15v5M11 15v5M13.5 15v5"/>'),
    umbrella: svg('<path d="M3 12a9 9 0 0 1 18 0z"/><path d="M12 12v6a2 2 0 0 0 4 0M12 3v0"/>'),
    needle: svg('<path d="M5 19 19 5"/><ellipse cx="17.5" cy="6.5" rx="1" ry="2.2" transform="rotate(45 17.5 6.5)"/><path d="M8 20c2-4 5-3 6-6"/>'),
    "nani-glasses": svg('<circle cx="7" cy="14" r="3.5"/><circle cx="17" cy="14" r="3.5"/><path d="M10.5 14h3M3.5 13 2 9M20.5 13 22 9"/>'),
    plaster: svg('<rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-35 12 12)"/><path d="M10.5 11.5h.01M13.5 12.5h.01M11.5 13.5h.01M12.5 10.5h.01"/>'),
    lens: svg('<rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13.5" r="3.5"/><path d="M8 7l1.5-3h5L16 7"/>'),
  };

  return Stars;
});
