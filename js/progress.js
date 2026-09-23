/*
 * Per-word difficulty (PlayerWordProgress), stored on-device only.
 * Stage table from the Game Design doc's "Per-word difficulty" section:
 *
 *   1 Introduced   0 correct recalls   picture shown, word shown, audio auto
 *   2 Supported    1-2 correct         picture shown, word shown, audio auto
 *   3 Prompted     3-5 correct         picture shown, word hidden, audio auto
 *   4 Recalled     6-11 correct        picture shown, word hidden, audio tap-to-replay
 *   5 Known        12+ correct         picture hidden, word hidden, audio plays once
 *
 * Changed 23 Sep 2026 (Roadmap doc, "Learning design decisions"): a word
 * advances on a CORRECT RECALL from the Kutchi, not on being met/shown.
 * Buying three of an item from a Kutchi-only list counts once, however
 * many times it was seen. The old version bumped on every exposure, which
 * gave the answer away by glowing/showing text automatically - recordMeeting
 * now only tracks exposure (for staleness and "has this been introduced at
 * all" bookkeeping) and never changes the stage; only recordCorrect does.
 *
 * "Drops a stage if not seen for a while, or on two wrong answers" -
 * staleness is simplified for this build to a 14-day window (there's no
 * real usage history yet to tune against); the two-wrong-answers rule is
 * implemented as stated.
 */
(function (global) {
  const STORAGE_KEY = "njg_progress_v2";
  const STALE_DAYS = 14;

  function loadAll() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveAll(all) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch (e) { /* best-effort; ignore quota/private-mode errors */ }
  }

  function stageForCorrectCount(correct) {
    if (correct <= 0) return 1;
    if (correct <= 2) return 2;
    if (correct <= 5) return 3;
    if (correct <= 11) return 4;
    return 5;
  }

  const Progress = {
    _all: loadAll(),

    get(wordId) {
      const rec = this._all[wordId];
      if (!rec) return { wordId, timesMet: 0, timesCorrect: 0, stage: 1, misses: 0, lastSeen: null };
      // staleness: drop one stage if not seen in STALE_DAYS
      let stage = rec.stage;
      if (rec.lastSeen) {
        const days = (Date.now() - rec.lastSeen) / 86400000;
        if (days > STALE_DAYS && stage > 1) stage = stage - 1;
      }
      return Object.assign({}, rec, { stage });
    },

    /** Call whenever the player meets/hears a word (introduced, seen on a
     * shelf, etc). Exposure only - does NOT advance the stage. */
    recordMeeting(wordId) {
      const rec = this._all[wordId] || { wordId, timesMet: 0, timesCorrect: 0, misses: 0, stage: 1 };
      rec.timesMet += 1;
      rec.lastSeen = Date.now();
      if (!rec.stage) rec.stage = 1;
      this._all[wordId] = rec;
      saveAll(this._all);
      return this.get(wordId);
    },

    /** Call when the player correctly recalls this word from its Kutchi
     * (picked the right item for a spoken/written Kutchi cue, or the
     * reverse). This is what advances the stage. */
    recordCorrect(wordId) {
      const rec = this._all[wordId] || { wordId, timesMet: 0, timesCorrect: 0, misses: 0, stage: 1 };
      rec.timesCorrect = (rec.timesCorrect || 0) + 1;
      rec.timesMet += 1;
      rec.lastSeen = Date.now();
      rec.stage = stageForCorrectCount(rec.timesCorrect);
      rec.misses = 0;
      this._all[wordId] = rec;
      saveAll(this._all);
      return this.get(wordId);
    },

    /** Call on a wrong answer for this word. Drops a stage after 2 misses. */
    recordMiss(wordId) {
      const rec = this._all[wordId] || { wordId, timesMet: 1, timesCorrect: 0, misses: 0, stage: 1 };
      rec.misses = (rec.misses || 0) + 1;
      if (rec.misses >= 2) {
        rec.stage = Math.max(1, (rec.stage || 1) - 1);
        rec.misses = 0;
      }
      rec.lastSeen = Date.now();
      this._all[wordId] = rec;
      saveAll(this._all);
      return this.get(wordId);
    },

    /** Display rules for a given stage, per the table above. Note: the
     * automatic "glow at stage 1" rule from the original table is
     * superseded - glow is now a delayed hint, driven separately by
     * app.js's hesitation timer, not by stage. */
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
