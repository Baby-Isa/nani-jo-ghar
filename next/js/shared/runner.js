/*
 * The runner plays the list of scenes it is given, in order, and holds the one state tree: the round, the scene now,
 * that scene's named state and its phase. It has no list of its own and knows no scene by name. It never draws: a view,
 * when one is given, is told what happened and nothing more. Without views it still plays, which is how the robot plays.
 *
 * A scene is { id, rules, view? }.
 *   rules.start(round, chance) -> state           a state named "done" means the scene has nothing to do
 *   rules.move(state, move, ctx) -> { state, events }      ctx: { round }
 *   rules.first(round, state) -> events           what the scene opens with (optional)
 *   rules.leave(round, state) -> round            what the scene hands on (optional)
 *   view.pictures(round) -> ids | { draw, then }  what the scene shows, from the round as it starts: `draw` before it can
 *                                                 be drawn, `then` straight after
 *   view.enter(state, round)                      draws the scene; a promise settles once it is drawn, never once it is played
 *   view.on(events, state, round), view.leave(state, round)      (each optional; leave may return a promise)
 *
 * A scene is in one phase at a time:
 *   loading   its pictures are coming      drawing   its view is drawing it      open   drawn: its clock runs, its view hears
 *   leaving   its view is closing (its rules have already handed on)
 * and before the first scene, idle; after the last, ended. A move in idle, leaving or ended is not taken.
 * Until a scene is open no time passes for its rules and its view hears nothing, so no clock, help or light can run
 * ahead of the screen: what its rules say waits, and is told as it opens, after its opening events. A child's moves still
 * reach the rules (a tap that skips the order while the people walk in), so a scene may end before it opens: its view
 * is let finish drawing and is then closed, but told nothing. Pictures load ahead, scene after scene in the list's order
 * from the first scene played: a later scene's while an earlier one plays, so the scene now never waits behind a later
 * one's (the old game's rule: the order's own pictures first, then the cooking's, while the customer greets and orders).
 * A load, a drawing or a closing that fails goes to onError, whether or not there is a loader: a round never hangs
 * without saying why.
 *
 *   const run = createRunner({ scenes, round, views: true|false, load(ids) -> Promise, onEnd, onError })
 *   run.start()   run.send(move) -> events   run.tree() -> { round, at, scene, state, phase }   run.settled()
 */
import { chanceFrom } from "./round.js";

const later = (p, fn) => (p && typeof p.then === "function" ? p.then(fn) : fn());

export function createRunner({ scenes, round, views = true, load = null, onEnd = null, onError = null }) {
  if (!Array.isArray(scenes) || !scenes.length) throw new Error("runner: it needs a list of scenes");
  scenes.forEach((s) => {
    if (!s || !s.id || !s.rules || typeof s.rules.start !== "function" || typeof s.rules.move !== "function") throw new Error("runner: every scene is { id, rules: { start, move } }");
  });
  const tree = { round: { ...round }, at: -1, scene: null, state: null, phase: "idle" };
  const chance = () => chanceFrom(tree.round)(); // (the round is the holder of the seed, whichever scene has it now)
  const viewOf = (i) => (views && scenes[i] && scenes[i].view) || null;
  const fail = (e) => {
    if (!onError) throw e;
    onError(e);
  };
  let loads = null; // each scene's pictures to draw it with, by its place in the list
  let held = []; // what the scene's rules said before its view opened
  let drawing = null; // the scene's drawing, while it is in flight
  let moving = Promise.resolve();

  function tell(method, ...args) {
    const v = viewOf(tree.at);
    return v && typeof v[method] === "function" ? v[method](...args) : undefined;
  }

  /** Every view's pictures from scene `from` on, one scene after another; started once, by the first scene played. */
  function loadAhead(from) {
    const asStarted = tree.round; // (who is here and what they ordered is known from the round's start)
    let queue = Promise.resolve();
    loads = scenes.map((s, i) => {
      const v = viewOf(i);
      if (i < from || !load || !v || typeof v.pictures !== "function") return null;
      const named = v.pictures(asStarted) || [];
      const [draw, then] = Array.isArray(named) ? [named, []] : [named.draw || [], named.then || []];
      const ready = queue.then(() => load(draw));
      // (a failed load is its own scene's to report, as it opens; the loads after it still run)
      queue = ready.catch(() => {}).then(() => then.length && load(then)).catch(fail);
      return ready;
    });
  }

  /** Scene i: its pictures, then its drawing, then open. */
  function open(i) {
    tree.phase = "loading";
    held = [];
    const now = (phase) => tree.at === i && tree.phase === phase;
    const opened = () => {
      drawing = null;
      if (!now("drawing")) return;
      tree.phase = "open";
      const first = typeof scenes[i].rules.first === "function" ? scenes[i].rules.first(tree.round, tree.state) : [];
      const events = first.concat(held);
      held = [];
      if (events.length) tell("on", events, tree.state, tree.round);
    };
    const draw = () => {
      if (!now("loading")) return; // (it ended while its pictures came: it is never drawn)
      tree.phase = "drawing";
      drawing = tell("enter", tree.state, tree.round);
      return later(drawing, opened);
    };
    // (one way for every failure: a drawing that throws at once, or a load or drawing that rejects later)
    const drawOrFail = () => {
      try {
        return draw();
      } catch (e) {
        fail(e);
      }
    };
    const going = later(loads && loads[i], drawOrFail);
    if (going && typeof going.then === "function") going.catch(fail);
  }

  /** Enter scene i; a scene that starts "done" is passed over at once, so an empty scene costs no time. */
  function enter(i) {
    while (i < scenes.length) {
      tree.at = i;
      tree.scene = scenes[i].id;
      tree.state = scenes[i].rules.start(tree.round, chance);
      if (!tree.state || typeof tree.state.name !== "string") throw new Error(`runner: scene "${scenes[i].id}" started without a named state`);
      if (tree.state.name !== "done") {
        if (!loads) loadAhead(i);
        return open(i);
      }
      handOn();
      i += 1;
    }
    tree.at = scenes.length;
    tree.scene = null;
    tree.state = null;
    tree.phase = "ended";
    if (onEnd) onEnd(tree.round);
  }

  function handOn() {
    const r = scenes[tree.at].rules;
    if (typeof r.leave === "function") tree.round = { ...r.leave(tree.round, tree.state) };
  }

  /** The scene is over: its rules hand on at once; its view, once drawn, is closed; then the next scene. */
  function finish() {
    const was = tree.phase;
    const [state, before] = [tree.state, tree.round];
    tree.phase = "leaving";
    handOn();
    const close = () => tell("leave", state, before);
    let closing = null;
    try {
      closing = was === "loading" ? null : was === "drawing" ? Promise.resolve(drawing).then(close) : close();
    } catch (e) {
      fail(e);
    }
    const next = tree.at + 1;
    if (closing && typeof closing.then === "function") moving = closing.catch(fail).then(() => enter(next)).catch(fail);
    else enter(next);
  }

  /** A move for the scene now. Returns the events at once: a tap is never held up by a view. */
  function send(move) {
    if (tree.phase === "idle" || tree.phase === "leaving" || tree.phase === "ended") return []; // (before, between or after the scenes)
    if (tree.phase !== "open" && move.type === "time") return []; // (its clock starts as it opens)
    const out = scenes[tree.at].rules.move(tree.state, move, { round: tree.round });
    tree.state = out.state;
    const events = out.events || [];
    if (events.length) {
      if (tree.phase === "open") tell("on", events, tree.state, tree.round);
      else held.push(...events);
    }
    if (tree.state.name === "done") finish();
    return events;
  }

  return {
    start() {
      enter(0);
    },
    send,
    tree: () => tree,
    settled: () => moving,
  };
}
