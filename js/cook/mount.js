/*
 * Cook mounted in an element (C4, decision 45; target-model § 6.2): the plug-in's start and stop, as the clinic's.
 *
 *   import { mount, unmount } from "./js/cook/mount.js";
 *   const cook = await mount(el, { hosted, speed });   // Cook's screen made inside el, the game started, the title up
 *   cook.Cook                                           // Cook's namespace (its rounds: Cook.testHook.lab / .order)
 *   unmount();                                          // everything Cook made or started goes again
 *
 * Mount makes Cook's screen (js/cook/dom.js) in el, follows the frame's sidebar fit, and boots Cook (flow.js
 * Cook.boot: the UI, the core, the save, the data, the Phaser game in #game). Unmount halts it (Cook.halt: every
 * round aborted, the coach, the end screen, the voice and the sound, the Phaser game and its WebGL context), ends
 * Cook's lifetime (js/cook/life.js: every timer, interval, animation frame and page-wide listener it started) and
 * removes its screen and its body classes. build/test_cook_mount.mjs mounts and unmounts it five times in a row and
 * checks that nothing is left: listeners, timers, canvases, DOM.
 *
 * One Cook at a time per page (it is one Phaser game and one screen of fixed ids); mount() unmounts the last one.
 */
import { Cook } from "./index.js";
import { end as endLife, open as openLife } from "./life.js";
import { makeScreen } from "./dom.js";

let current = null;
const BODY_CLASSES = ["ui-bulb", "ui-stars"]; // classes Cook's code sets on <body> while it plays

export async function mount(el, o = {}) {
  if (!el) throw new Error("cook: no element to mount in");
  if (current) unmount();
  const doc = el.ownerDocument;
  const W = doc.defaultView;
  const body = doc.body;
  const me = { el, nodes: [], hadW6: body.classList.contains("w6"), side: null };
  current = me;
  // Cook's page was <body class="w6"> (Wave 6: its sidebar and cards); the class goes again at unmount
  body.classList.add("w6");
  me.nodes = makeScreen(el);
  const $ = (id) => doc.getElementById(id);
  // the frame follows the sidebar's fit (js/shared/frame.js; cook.html's own grid already carries the frame's classes)
  if (W.Frame && W.Frame.mount) {
    me.side = $("side");
    W.Frame.mount({ app: $("app"), side: me.side, play: $("stage") });
  }
  if (o.speed) Cook.speed = Number(o.speed) || Cook.speed;
  await Cook.boot($("game"), { hosted: !!o.hosted });
  if (current !== me) throw Object.assign(new Error("cook: unmounted while it started"), { name: "HostLeft" });
  return { Cook, el, unmount };
}

export function unmount() {
  const me = current;
  if (!me) return;
  current = null;
  const doc = me.el.ownerDocument;
  const W = doc.defaultView;
  try {
    Cook.halt();
  } finally {
    endLife();
    if (me.side && W.Frame && W.Frame.unwatchSide) W.Frame.unwatchSide(me.side);
    me.nodes.forEach((n) => n.remove());
    BODY_CLASSES.forEach((c) => doc.body.classList.remove(c));
    if (!me.hadW6) doc.body.classList.remove("w6");
  }
}

/** Is Cook mounted now? */
export const mounted = () => !!current;
/** What Cook still has running (the mount test): timers, intervals, frames, page-wide listeners. */
export const running = () => openLife();

export { Cook };
export default { mount, unmount, mounted, running, Cook };
