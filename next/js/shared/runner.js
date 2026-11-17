/*
 * The runner plays the list of scenes it is given, in order, and holds the one state tree: the round, the scene now
 * and that scene's named state. It has no list of its own and knows no scene by name. It never draws: a view, when one
 * is given, is told what happened and nothing more. Without views it still plays, which is how the robot plays rounds.
 *
 * A scene is { id, rules, view? }.
 *   rules.start(round, chance) -> state           a state named "done" means the scene has nothing to do
 *   rules.move(state, move, ctx) -> { state, events }      ctx: { round }
 *   rules.first(round, state) -> events           what the scene opens with (optional)
 *   rules.leave(round, state) -> round            what the scene hands on (optional)
 *   view.enter(state, round), view.on(events, state, round), view.leave(state, round)   (each optional; leave may return a promise)
 *
 *   const run = createRunner({ scenes, round, views: true|false, onEnd })
 *   run.start()            run.send(move) -> events            run.tree() -> { round, at, scene, state }
 */
import { chanceFrom } from "./round.js";

export function createRunner({ scenes, round, views = true, onEnd = null }) {
  if (!Array.isArray(scenes) || !scenes.length) throw new Error("runner: it needs a list of scenes");
  scenes.forEach((s) => {
    if (!s || !s.id || !s.rules || typeof s.rules.start !== "function" || typeof s.rules.move !== "function") throw new Error("runner: every scene is { id, rules: { start, move } }");
  });
  const tree = { round: { ...round }, at: -1, scene: null, state: null, ended: false };
  const chance = () => chanceFrom(tree.round)(); // (the round is the holder of the seed, whichever scene has it now)
  const viewOf = (i) => (views && scenes[i] && scenes[i].view) || null;
  let moving = Promise.resolve();

  function tell(method, ...args) {
    const v = viewOf(tree.at);
    return v && typeof v[method] === "function" ? v[method](...args) : undefined;
  }

  /** Enter scene i; a scene that starts "done" is passed over at once, so an empty scene costs no time. */
  function enter(i) {
    while (i < scenes.length) {
      tree.at = i;
      tree.scene = scenes[i].id;
      tree.state = scenes[i].rules.start(tree.round, chance);
      if (!tree.state || typeof tree.state.name !== "string") throw new Error(`runner: scene "${scenes[i].id}" started without a named state`);
      if (tree.state.name !== "done") {
        tell("enter", tree.state, tree.round);
        const first = typeof scenes[i].rules.first === "function" ? scenes[i].rules.first(tree.round, tree.state) : [];
        if (first.length) tell("on", first, tree.state, tree.round);
        return;
      }
      handOn();
      i += 1;
    }
    tree.at = scenes.length;
    tree.scene = null;
    tree.state = null;
    tree.ended = true;
    if (onEnd) onEnd(tree.round);
  }

  function handOn() {
    const r = scenes[tree.at].rules;
    if (typeof r.leave === "function") tree.round = { ...r.leave(tree.round, tree.state) };
  }

  /** A move for the scene now. Returns the events at once: a tap is never held up by a view. */
  function send(move) {
    if (tree.ended || tree.at < 0 || tree.scene === null) return []; // (between two scenes: the last one's picture is finishing)
    const scene = scenes[tree.at];
    const out = scene.rules.move(tree.state, move, { round: tree.round });
    tree.state = out.state;
    const events = out.events || [];
    if (events.length) tell("on", events, tree.state, tree.round);
    if (tree.state.name === "done") {
      const leaving = tell("leave", tree.state, tree.round);
      handOn();
      const next = tree.at + 1;
      if (leaving && typeof leaving.then === "function") {
        // the next scene's picture waits for this one's to finish; the rules have already moved on
        tree.scene = null;
        moving = leaving.then(() => enter(next));
      } else enter(next);
    }
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
