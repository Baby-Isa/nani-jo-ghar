/*
 * The stove-top kitchen, as the runner sees it: this family's list of scenes, in the order a round is played.
 * The runner has no list of its own; a caller such as story mode may pass a different one.
 *
 *   kitchenScenes({ game, settings, kitchen, kit, views? }) -> [{ id, rules, view? }]      the rules alone
 *   scenesWithViews({ ...the same, stage, say, people, send, tree, round, player?, meet? }) -> the same list with its drawing
 *       player: { name, renew() } who is playing, for the cog; meet(key): a first-time thing kept as it is shown
 *       round.lab "wrong-order" (the labs page): the list from the cooking on, its dishes made (./lab.rules.js)
 */
import { orderRules } from "../shared/scenes/order.rules.js";
import { greetingRules } from "../shared/scenes/greeting.rules.js";
import { checkRules, wordMomentRules, wellDoneRules, serveRules, endRules } from "../shared/scenes/conversation.rules.js";
import { cookRules } from "./cook.rules.js";
import { LAB_WRONG_ORDER } from "./lab.rules.js";

export function kitchenScenes({ game, settings, kitchen, kit, views = () => null }) {
  const parts = { game, settings, kitchen, kit };
  const list = [
    ["word-moment", wordMomentRules(parts)],
    ["greeting", greetingRules(parts)],
    ["order", orderRules(parts)],
    ["check", checkRules(parts)],
    ["cook", cookRules(parts)],
    ["well-done", wellDoneRules(parts)],
    ["serve", serveRules(parts)],
    ["end", endRules(parts)],
  ];
  return list.map(([id, rules]) => ({ id, rules, view: views(id, rules) }));
}

/** The same list with a screen: the kit's cards and sounds are made once for the round and shared by its scenes. */
export async function scenesWithViews(parts) {
  const { game, settings, kitchen, kit, stage, say, people, round } = parts;
  const [{ createNaniBox }, { createCards }, { createSounds }, { showWrongOrder }, { orderView }, conv, { cookView }, { createLight }, { createCog }, { greetingView }, { wordMomentView }, { pourMoment }] = await Promise.all([
    import("../shared/kit/nani-box.js"),
    import("../shared/kit/order-card.js"),
    import("../shared/kit/sounds.js"),
    import("../shared/kit/wrong-order.js"),
    import("../shared/scenes/order.view.js"),
    import("../shared/scenes/conversation.view.js"),
    import("./cook.view.js"),
    import("../shared/kit/light.js"),
    import("../shared/kit/cog.js"),
    import("../shared/scenes/greeting.view.js"),
    import("../shared/scenes/word-moment.view.js"),
    import("./pour-moment.js"),
  ]);
  const A = settings.art;
  const G = game.rules;
  const picOf = (item, person) => G.cardArt(item, person.asks, A) || kit.wordArt[item.word].art;
  const sounds = createSounds({ kit, say, stage });
  document.querySelectorAll(".light").forEach((el) => el.remove());
  const ui = { round, sounds, room: null, serving: null, light: createLight({ kit, stage }) };
  ui.cog = createCog({ stage, kit, sounds, player: parts.player });
  stage.el.side.style.backgroundImage = `url(${stage.art.file(kit.art.panel)})`;
  ui.nani = createNaniBox({ stage, say, kit, face: people.nani.face });
  ui.cards = createCards({ stage, say, kit, round, people, picOf, light: ui.light, sounds, onPeek: (word, what) => parts.send({ type: "peek", word, what }), onFace: (seat) => parts.send({ type: stage.showing() === "room" ? "repeat" : "face", who: round.order.for[seat].who, vessel: seat }) });
  ui.itemWords = new Set(round.order.for.flatMap((p) => p.items.map((i) => say.entry(i.word).id)));
  ui.wrongOrder = (e, room, covered) => showWrongOrder({ stage, say, kit, sounds, cards: ui.cards, cog: ui.cog, right: e.right, wrong: e.wrong, room, covered });
  // a view may look at the state only while its own scene is the one being played
  const peekFor = (id) => () => (parts.tree().scene === id ? parts.tree().state : null);
  const make = {
    "word-moment": (v) => wordMomentView({ ...v, sounds, words: settings.wordMoment.words, wordCardArt: (word) => G.wordMomentArt(word, A), act: pourMoment({ ...v, sounds, kitchen }) }),
    greeting: (v) => greetingView(v),
    order: (v) => orderView(v),
    cook: (v, rules) => cookView({ ...v, ctxOf: rules.ctxOf }),
    "well-done": (v) => conv.wellDoneView(v),
    serve: (v) => conv.serveView({ ...v, trayArt: kitchen.art.servingTray, dishArt: A.served }),
    end: (v) => conv.endView({ ...v, endArt: kit.art.end }),
  };
  const views = (id, rules) => (make[id] ? make[id]({ ...parts, ui, roomArt: kitchen.art.room, picOf, peek: peekFor(id) }, rules) : null);
  if (round.lab && round.lab !== LAB_WRONG_ORDER) throw new Error(`which lab? the kitchen offers "${LAB_WRONG_ORDER}", not "${round.lab}"`);
  const scenes = kitchenScenes({ game, settings, kitchen, kit, views });
  // the labs page's wrong order starts at the cooking, its dishes already made (./lab.rules.js)
  return round.lab === LAB_WRONG_ORDER ? scenes.slice(scenes.findIndex((x) => x.id === "cook")) : scenes;
}
