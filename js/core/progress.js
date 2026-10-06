/*
 * Per-word progress (target-model § 3.3; rule G23): one record per word per player, in the save's `words`
 * namespace. Each word has an understand_stage and a produce_stage (1 to 5). A word goes UP a stage on
 * correct recall from the Kutchi (enough of them, by stage: data/progress.json) and DOWN after two misses
 * in a row. Modes report evidence, never stages:
 *
 *   const P = createProgress({ save, data });       // data = data/progress.json
 *   P.meet(id)                                      // first meeting / seen again (exposure: never counts as recall)
 *   P.heard(id, { ok, cue = "kutchi", firstTry })   // understanding: only cue "kutchi" (nothing else to go on) is recall
 *   P.said(id, { ok, via = "speech" })              // speaking: "speech" | "pill" | "parent"
 *   P.get(id) -> record      P.stage(id) -> understand_stage      P.produceStage(id)
 *   P.support(id, { placeholder }) -> { label, card, hintAfterMs, autoPlay, picture }   (how much help to give)
 *   P.cookStage(id) -> 1..4  // Cook's own four stages, for Cook's callers until R4 moves them
 *   P.importCook(cookWords)  // Cook's seen/right/miss records in; safe to call again (only what changed since)
 *                            // (done by itself on every read while Cook keeps its own words: followCook)
 *
 * The pure functions below (meet, heard, said, fromCook, importCook, support) work on plain records, so
 * tests and the save migration use them without a save.
 *
 * A record:
 *   { understand_stage, produce_stage, u_streak, u_misses, p_streak, p_misses,
 *     seen, right, miss, spoken, spokenOk, last, core?: true, src?: { cook: {seen, right, miss, streakMiss} } }
 * `u_streak` is the correct recalls at this stage so far; `u_misses` the misses in a row. `core` marks a record
 * that has had evidence from the core itself (not only imported from Cook).
 */

const MIN = 1;

/** The defaults if no data file is given (a copy of data/progress.json's rules; the file wins). */
export const DEFAULT_DATA = {
  version: 1,
  stages: { min: 1, max: 5 },
  recallCues: ["kutchi"],
  understand: { meetAdvances: true, advanceAfter: { 1: 0, 2: 4, 3: 5, 4: 6 }, dropAfterMisses: 2, floorOnceMet: 2, dropStreak: { 2: 1, 3: 0, 4: 0 } },
  produce: { advanceAfter: { 1: 1, 2: 2, 3: 3, 4: 3 }, dropAfterMisses: 2, floor: 1, dropStreak: {} },
  cookImport: { base: { 1: 0, 2: 0, 3: 4, 4: 9 } },
  support: {
    1: { label: "text", card: "text", hintAfterMs: 7000, autoPlay: true, picture: true },
    2: { label: "speaker", card: "text", hintAfterMs: 8000, autoPlay: true, picture: true },
    3: { label: "speaker", card: "dots", hintAfterMs: 11000, autoPlay: false, picture: true },
    4: { label: "speaker", card: "dots", hintAfterMs: 15000, autoPlay: false, picture: true },
    5: { label: "speaker", card: "dots", hintAfterMs: 15000, autoPlay: false, picture: false },
  },
};

const rules = (data) => data || DEFAULT_DATA;
const maxStage = (data) => ((rules(data).stages || {}).max || 5);
const num = (v) => (typeof v === "number" && isFinite(v) ? v : 0);

export function blankWord() {
  return { understand_stage: 1, produce_stage: 1, u_streak: 0, u_misses: 0, p_streak: 0, p_misses: 0, seen: 0, right: 0, miss: 0, spoken: 0, spokenOk: 0, last: null };
}
const fresh = (rec) => Object.assign(blankWord(), rec || {});

/** Exposure: the word was met (said, shown). Moves a brand-new word from stage 1 to 2 when the data says so. */
export function meet(rec, data, now = Date.now()) {
  const r = fresh(rec);
  const U = rules(data).understand;
  r.seen++;
  r.last = now;
  if (r.understand_stage === MIN && U.meetAdvances) r.understand_stage = MIN + 1;
  return r;
}

// one skill (understand or produce) takes a right or a miss
function step(r, skill, ok, R, data) {
  const st = `${skill}_stage`;
  const k = skill === "understand" ? "u" : "p";
  if (ok) {
    r[`${k}_misses`] = 0;
    r[`${k}_streak`]++;
    const need = (R.advanceAfter || {})[r[st]];
    if (r[st] < maxStage(data) && need != null && r[`${k}_streak`] >= need) {
      r[st]++;
      r[`${k}_streak`] = 0;
    }
    return;
  }
  r[`${k}_misses`]++;
  if (r[`${k}_misses`] >= (R.dropAfterMisses || 2)) {
    const floor = skill === "understand" ? (r[st] > MIN ? R.floorOnceMet || MIN : MIN) : R.floor || MIN;
    const to = Math.max(floor, r[st] - 1);
    if (to < r[st]) {
      r[st] = to;
      r[`${k}_streak`] = (R.dropStreak || {})[to] || 0;
    }
    r[`${k}_misses`] = 0;
  }
}

/**
 * Understanding evidence. ok + a recall cue (only the Kutchi to go on) counts towards the next stage;
 * ok with other help (a picture, the text) is exposure only; a miss counts towards a drop either way.
 */
export function heard(rec, { ok, cue = "kutchi" } = {}, data, now = Date.now()) {
  const D = rules(data);
  const r = fresh(rec);
  r.last = now;
  r.core = true;
  if (ok) {
    const recall = (D.recallCues || ["kutchi"]).includes(cue);
    if (!recall) {
      r.seen++;
      return r;
    }
    // a right answer to a word never met before is its meeting too (Cook's markRight does the same)
    if (r.understand_stage === MIN && D.understand.meetAdvances) r.understand_stage = MIN + 1;
    r.seen = Math.max(1, r.seen);
    r.right++;
    step(r, "understand", true, D.understand, data);
  } else {
    r.miss++;
    step(r, "understand", false, D.understand, data);
  }
  return r;
}

/** Speaking evidence: a right reply said aloud (or picked, or said by a parent) after the model. */
export function said(rec, { ok, via = "speech" } = {}, data, now = Date.now()) {
  const D = rules(data);
  const r = fresh(rec);
  r.last = now;
  r.core = true;
  r.spoken++;
  if (ok) r.spokenOk++;
  // a pill or a parent's help is practice, not recall: it never moves the stage up, but a miss still counts
  if (ok && via !== "speech") return r;
  step(r, "produce", !!ok, D.produce, data);
  return r;
}

/** Cook's stage for a Cook record, exactly as js/cook/core.js Cook.wordStage computes it. */
export function cookStageOf(w) {
  if (!w || !w.seen) return 1;
  if (w.right >= 9) return 4;
  if (w.right >= 4) return 3;
  return 2;
}

/** A progress record from one of Cook's {seen, right, miss, streakMiss, last} records. */
export function fromCook(w, data) {
  const D = rules(data);
  const base = (D.cookImport || DEFAULT_DATA.cookImport).base;
  const st = cookStageOf(w);
  const r = blankWord();
  r.understand_stage = st;
  r.u_streak = Math.max(0, num(w && w.right) - (base[st] || 0));
  r.u_misses = num(w && w.streakMiss);
  r.seen = num(w && w.seen);
  r.right = num(w && w.right);
  r.miss = num(w && w.miss);
  r.last = (w && w.last) || null;
  r.src = { cook: { seen: r.seen, right: r.right, miss: r.miss, streakMiss: r.u_misses } };
  return r;
}

/**
 * Cook's words into the progress words (a new object; neither input is changed). A word only Cook has
 * written is (re)imported exactly; a word the core has also written gets only what Cook added since the
 * last import (rights as recalls, misses as misses), so nothing is counted twice and nothing is lost.
 */
export function importCook(words, cookWords, data) {
  const out = Object.assign({}, words || {});
  Object.entries(cookWords || {}).forEach(([id, w]) => {
    if (!w || typeof w !== "object") return;
    const cur = out[id];
    const snap = cur && cur.src && cur.src.cook;
    if (!cur || !cur.core) {
      if (!snap || snap.seen !== num(w.seen) || snap.right !== num(w.right) || snap.miss !== num(w.miss) || snap.streakMiss !== num(w.streakMiss) || !cur) out[id] = fromCook(w, data);
      return;
    }
    let r = Object.assign({}, cur);
    const dRight = num(w.right) - num(snap && snap.right);
    const dMiss = num(w.miss) - num(snap && snap.miss);
    const dSeen = num(w.seen) - num(snap && snap.seen) - Math.max(0, dRight);
    for (let i = 0; i < dSeen; i++) r = meet(r, data, w.last || Date.now());
    for (let i = 0; i < dRight; i++) r = heard(r, { ok: true, cue: "kutchi" }, data, w.last || Date.now());
    for (let i = 0; i < dMiss; i++) r = heard(r, { ok: false }, data, w.last || Date.now());
    r.src = { cook: { seen: num(w.seen), right: num(w.right), miss: num(w.miss), streakMiss: num(w.streakMiss) } };
    out[id] = r;
  });
  return out;
}

/** How much help a word gets at its stage (replaces Cook's labelMode, cardHidden and hintDelay). */
export function support(rec, data, { placeholder = false } = {}) {
  const D = rules(data);
  const st = fresh(rec).understand_stage;
  const s = Object.assign({}, (D.support || DEFAULT_DATA.support)[st] || DEFAULT_DATA.support[1]);
  // an English placeholder is never "known" Kutchi: never dotted out on the card
  if (placeholder && s.card === "dots") s.card = "text";
  s.stage = st;
  return s;
}

/** The progress service over the one save's `words` namespace. */
export function createProgress({ save, data, followCook = true } = {}) {
  const D = rules(data);
  // While Cook still writes its own word records (until R4), what it adds is brought over on the next read,
  // so a mode already on the core never sees stale stages. Cheap: only when Cook's words changed.
  let lastCook = null;
  const follow = () => {
    if (!save || !followCook || !save.has || !save.has("cook")) return;
    const cw = save.get("cook").words;
    if (!cw || typeof cw !== "object") return;
    const key = JSON.stringify(cw);
    if (key === lastCook) return;
    lastCook = key;
    const cur = save.get("words");
    const next = importCook(cur, cw, D);
    if (JSON.stringify(next) !== JSON.stringify(cur)) save.set("words", next);
  };
  const all = () => {
    follow();
    return save ? save.get("words") : {};
  };
  const put = (id, rec) => {
    if (save) save.update("words", (w) => ((w[id] = rec), w));
    return rec;
  };
  const P = {
    data: D,
    all,
    get: (id) => fresh(all()[id]),
    stage: (id) => fresh(all()[id]).understand_stage,
    produceStage: (id) => fresh(all()[id]).produce_stage,
    cookStage: (id) => Math.min(4, fresh(all()[id]).understand_stage),
    meet: (id) => put(id, meet(all()[id], D)),
    heard: (id, ev) => put(id, heard(all()[id], ev, D)),
    said: (id, ev) => put(id, said(all()[id], ev, D)),
    support: (id, o) => support(all()[id], D, o),
    importCook: (cookWords) => save && save.set("words", importCook(all(), cookWords, D)),
    /** SH-60 (PA5): forget every learned word ("Start over", the grown-ups' "play as new"): each word is new again. */
    reset: () => {
      lastCook = null;
      if (save) save.set("words", {});
    },
  };
  return P;
}

export default createProgress;
