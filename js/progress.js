/*
 * Per-word difficulty (PlayerWordProgress), read and written through the
 * ACTIVE PROFILE object (js/storage.js owns actually persisting it) - see
 * the Technical Plan's data model and Build Brief v4 section 2.1. Progress
 * itself never touches storage directly; js/shell.js calls
 * Progress.attachProfile(profile, onChange) once a profile is chosen, and
 * onChange is called (with the profile) every time a word's stage changes,
 * per "saved every time a word's stage changes".
 *
 * Stage table (understand_stage):
 *   1 Introduced   0 correct recalls   picture shown, word shown, audio auto
 *   2 Supported    1-2 correct         picture shown, word shown, audio auto
 *   3 Prompted     3-5 correct         picture shown, word hidden, audio auto
 *   4 Recalled     6-11 correct        picture shown, word hidden, audio tap-to-replay
 *   5 Known        12+ correct         picture hidden, word hidden, audio plays once
 *
 * A word advances a stage on a CORRECT RECALL from the Kutchi, not on
 * being met/shown - recordMeeting() only tracks exposure (for staleness
 * and "introduced at all" bookkeeping) and never changes the stage; only
 * recordCorrect() does. Drops a stage after two consecutive misses, or if
 * not seen for 14 days.
 *
 * produce_stage (Technical Plan): the same word, for speaking/writing,
 * always at or behind understand_stage. Nothing in bowl-01 raises it yet -
 * it exists and persists, per Build Brief v4 section 2.1, ready for a
 * later errand that actually asks the player to produce the word.
 */
(function (global) {
  const STALE_DAYS = 14;

  function stageForCorrectCount(correct) {
    if (correct <= 0) return 1;
    if (correct <= 2) return 2;
    if (correct <= 5) return 3;
    if (correct <= 11) return 4;
    return 5;
  }

  function blankRecord(wordId) {
    return { wordId, timesMet: 0, timesCorrect: 0, understand_stage: 1, produce_stage: 1, misses: 0, last_seen: null };
  }

  // Fallback store used only if no profile is ever attached (shouldn't
  // happen in normal play - js/shell.js always attaches one, real or
  // temporary), so Progress never crashes callers mid-errand.
  const fallbackWords = {};

  const Progress = {
    _profile: null,
    _onChange: null,

    /** Call once a profile is chosen (real or temporary/unsaved). Every
     * later record...() call reads/writes profile.words. */
    attachProfile(profile, onChange) {
      if (!profile.words) profile.words = {};
      this._profile = profile;
      this._onChange = onChange || null;
    },

    _words() {
      return this._profile ? this._profile.words : fallbackWords;
    },

    _persist() {
      if (this._profile && this._onChange) this._onChange(this._profile);
    },

    get(wordId) {
      const rec = this._words()[wordId];
      if (!rec) return blankRecord(wordId);
      let stage = rec.understand_stage;
      if (rec.last_seen) {
        const days = (Date.now() - rec.last_seen) / 86400000;
        if (days > STALE_DAYS && stage > 1) stage = stage - 1;
      }
      return Object.assign({}, rec, { understand_stage: stage, stage }); // `stage` kept as an alias for older call sites
    },

    /** Exposure only (introduced, seen on a shelf) - never advances a stage. */
    recordMeeting(wordId) {
      const words = this._words();
      const rec = words[wordId] || blankRecord(wordId);
      rec.timesMet += 1;
      rec.last_seen = Date.now();
      words[wordId] = rec;
      this._persist();
      return this.get(wordId);
    },

    /** A correct recall from the Kutchi - the only thing that advances
     * understand_stage. */
    recordCorrect(wordId) {
      const words = this._words();
      const rec = words[wordId] || blankRecord(wordId);
      rec.timesCorrect = (rec.timesCorrect || 0) + 1;
      rec.timesMet += 1;
      rec.last_seen = Date.now();
      rec.understand_stage = stageForCorrectCount(rec.timesCorrect);
      rec.produce_stage = Math.min(rec.produce_stage || 1, rec.understand_stage);
      rec.misses = 0;
      words[wordId] = rec;
      this._persist();
      return this.get(wordId);
    },

    /** A wrong answer. Drops a stage after two misses. */
    recordMiss(wordId) {
      const words = this._words();
      const rec = words[wordId] || blankRecord(wordId);
      rec.misses = (rec.misses || 0) + 1;
      if (rec.misses >= 2) {
        rec.understand_stage = Math.max(1, (rec.understand_stage || 1) - 1);
        rec.produce_stage = Math.min(rec.produce_stage || 1, rec.understand_stage);
        rec.misses = 0;
      }
      rec.last_seen = Date.now();
      words[wordId] = rec;
      this._persist();
      return this.get(wordId);
    },

    rulesForStage(stage) {
      switch (stage) {
        case 1: return { showPicture: true, showText: true, audio: "auto" };
        case 2: return { showPicture: true, showText: true, audio: "auto" };
        case 3: return { showPicture: true, showText: false, audio: "auto" };
        case 4: return { showPicture: true, showText: false, audio: "tap" };
        case 5: return { showPicture: false, showText: false, audio: "once" };
        default: return { showPicture: true, showText: true, audio: "auto" };
      }
    },
  };

  global.Progress = Progress;
})(window);
