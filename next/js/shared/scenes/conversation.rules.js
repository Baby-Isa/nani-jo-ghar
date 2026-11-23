/*
 * The small conversation scenes' rules, with no screen: the check, the word moment, well done, the serve with its
 * thanks, and the end (the greeting has its own file). Each has named states and named slots; a scene whose slots are empty for this game
 * starts "done", so it costs no time. Pure: a view (or a robot) says when a line has been said or a card shown.
 */
import { machine } from "../machine.js";

/** The check: the person checks the order back with the child. No game fills it yet. */
export function checkRules({ settings }) {
  if (settings.check) throw new Error("check: the check slot is not built yet");
  return { states: ["done"], slots: ["check"], start: () => ({ name: "done" }), move: machine({ states: { done: {} } }) };
}

/**
 * A word moment as a scene: its words are shown once, when due(round) says so (always, by itself: a labs page), and the
 * round has met it after.
 */
export function momentRules({ id, words, due = () => true }) {
  const move = machine({ states: { showing: { shown: (s) => ({ state: { ...s, name: "done" } }), time: (s) => ({ state: s }) }, done: {} } });
  return {
    states: ["showing", "done"],
    start: (round) => (id && !round.met[id] && due(round) ? { name: "showing", words, id } : { name: "done" }),
    first: () => [{ type: "show" }],
    move,
    leave: (round, s) => (s.id ? { ...round, met: { ...round.met, [s.id]: true } } : round),
  };
}

/**
 * The game's word moment: a word no picture can show is shown first, once, while it is still new to the child. Its act is
 * named in the game's settings ("none": the game has no word moment, and the scene is over as it starts); its words are
 * the settings' own, or its sides' where the kit's pictures show them.
 */
export function wordMomentRules({ settings }) {
  const wm = settings.wordMoment;
  if (!wm || !wm.act) throw new Error('word moment: the game\'s settings name its act ("none" for no word moment)');
  if (wm.act === "none") return momentRules({});
  const words = wm.words || wm.sides.map((s) => s.word);
  const due = (round) => {
    const asked = new Set(round.order.for.flatMap((p) => p.items.map((i) => i.word)));
    return words.every((w) => asked.has(w)) && words.some((w) => (round.ladder[w] || 0) <= wm.newUntilStage);
  };
  return momentRules({ id: wm.id, words, due });
}

/** Well done: one praise from Nani, once every person's whole card is right. */
export function wellDoneRules({ kit }) {
  const move = machine({ states: { praising: { said: (s) => ({ state: { ...s, name: "done" } }), time: (s) => ({ state: s }) }, done: {} } });
  return { states: ["praising", "done"], slots: ["praise"], start: () => ({ name: "praising", line: kit.lines.wellDone }), first: (round, s) => [{ type: "praise", line: s.line }], move };
}

/** The serve: each dish goes to its asker, then each person thanks and says goodbye. */
export function serveRules({ settings, kit }) {
  const mode = settings.serve.mode;
  if (!["auto", "child"].includes(mode)) throw new Error(`serve: "${mode}" is not a way of serving`);
  if (mode !== "auto") throw new Error(`serve: the "${mode}" serve is not built yet`);
  const lineEvent = (s) => ({ type: "line", seat: s.seat, slot: s.name === "thanking" ? "thanks" : "goodbye", line: s.name === "thanking" ? kit.lines.thanks : kit.lines.goodbye });
  const move = machine({
    states: {
      serving: {
        // each dish lands on its own person's tray, in the order they stand
        landed(s, mv, { round }) {
          const landed = s.landed + 1;
          if (landed < round.dishes.length) return { state: { ...s, landed }, events: [{ type: "land", seat: landed }] };
          const next = { ...s, landed, name: "thanking", seat: 0 };
          return { state: next, events: [lineEvent(next)] };
        },
        time: (s) => ({ state: s }),
      },
      thanking: {
        said(s, mv, { round }) {
          const next = s.seat + 1 < round.people.length ? { ...s, seat: s.seat + 1 } : { ...s, name: "leaving", seat: 0 };
          return { state: next, events: [lineEvent(next)] };
        },
        time: (s) => ({ state: s }),
      },
      leaving: {
        said(s, mv, { round }) {
          if (s.seat + 1 < round.people.length) {
            const next = { ...s, seat: s.seat + 1 };
            return { state: next, events: [lineEvent(next)] };
          }
          return { state: { ...s, name: "done" }, events: [{ type: "left" }] };
        },
        time: (s) => ({ state: s }),
      },
      done: {},
    },
  });
  return { states: ["serving", "thanking", "leaving", "done"], slots: ["thanks", "goodbye"], start: () => ({ name: "serving", landed: 0, seat: 0 }), first: () => [{ type: "land", seat: 0 }], move };
}

/** The end: two pages, the badges and then the words of the order; no verdict. */
export function endRules({ kit }) {
  const E = kit.end;
  const move = machine({
    states: {
      badges: { next: (s) => ({ state: { ...s, name: "words" }, events: [{ type: "page", page: "words" }] }), time: (s) => ({ state: s }) },
      words: {
        hear: (s, mv) => ({ state: s, events: [{ type: "hear", word: mv.word }] }),
        again: (s) => ({ state: { ...s, name: "done", choice: "again" } }),
        leave: (s) => ({ state: { ...s, name: "done", choice: "leave" } }),
        time: (s) => ({ state: s }),
      },
      done: {},
    },
  });
  return {
    states: ["badges", "words", "done"],
    start(round) {
      const rows = round.dishes.flatMap((d) => d.rowsRight);
      const [timeMs, best, right, hints] = [round.cookMs || 0, round.best || 0, rows.filter(Boolean).length, round.hints || 0];
      // the gold edge: a first time or a new best; every row right; no help
      const timeTier = !best || timeMs <= best ? "gold" : timeMs <= best * E.nearBest ? "mid" : "plain";
      const rightTier = right === rows.length ? "gold" : right >= rows.length * E.midShare ? "mid" : "plain";
      const hintTier = hints === 0 ? "gold" : hints === 1 ? "mid" : "plain";
      return { name: "badges", timeMs, bestMs: best ? Math.min(best, timeMs) : timeMs, newBest: !!best && timeMs < best, timeTier, right, rows: rows.length, rightTier, hints, hintTier };
    },
    move,
    leave: (round, s) => ({ ...round, choice: s.choice }),
  };
}
