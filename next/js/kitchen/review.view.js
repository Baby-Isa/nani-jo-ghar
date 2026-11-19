/*
 * The cook scene's drawing once every dish is served: the dishes looked at (a happy or a sad face at each), the wrong-order
 * card for a wrong one (the kit's, js/shared/kit/wrong-order.js), and the remake, where only the dish made again stays on
 * screen (the orders done right leave, their glasses, faces and cards, and come back when all is right). It draws what
 * the cook rules say; it decides nothing.
 *
 *   reviewView({ stage, kit, settings, game, people, ui, send, drawn, later, lookOf, counts }) -> handlers by event type
 *       drawn() -> what the cook scene has drawn (hob, shelf, serving, vessels); later(fn): after the big moves before it
 */
export function reviewView({ stage, kit, settings, game, people, ui, send, drawn, later, lookOf, counts }) {
  const G = game.rules;
  const A = settings.art;
  const faceOf = (s) => (i, right) => (right ? people[s.vessels[i].who].faceHappy : people[s.vessels[i].who].faceSad) || people[s.vessels[i].who].face;
  // where on the page what was made comes up from, and where a thing nobody asked for goes back to
  const page = (box) => {
    const r = stage.pageRect("worktop", box);
    return { left: r.x, top: r.y, width: r.w, height: r.h };
  };
  return {
    review(e, s) {
      later(async () => {
        const D = drawn();
        D.hob.stepBack();
        e.checks.forEach((c, i) => c.right && D.serving.twinkle(i, true));
        await D.serving.review(e.checks, faceOf(s));
        e.checks.forEach((c) => ui.sounds.play(c.right ? "right" : "soft"));
        send({ type: "reviewed" });
      });
    },
    "wrong-order"(e) {
      later(async () => {
        const D = drawn();
        await D.serving.closeReview();
        // (nothing of the cooking shows over the card: the count pills come back with the remake)
        counts(null);
        await ui.wrongOrder(e, {
          pan: (v) => page(D.hob.vesselBox(v)),
          home: (word) => (D.shelf.ids().includes(word) ? page(D.shelf.picBox(word)) : null),
          picOf: (word) => stage.art.file(kit.wordArt[word].art),
        });
        send({ type: "understood" });
      });
    },
    // only what is being remade stays; its card comes to the top of the list
    remake(e, s) {
      drawn().serving.away(s.away);
      ui.cards.away(s.away, e.vessels[0]);
      counts(s);
    },
    "all-right"(e, s) {
      drawn().serving.away(s.away);
      ui.cards.away(s.away);
    },
    redo(e, s) {
      const D = drawn();
      const v = e.vessel;
      D.vessels[v].pan.show(lookOf(s, v));
      D.serving.set(v, settings.serving.art.empty);
      D.hob.fire(v, "off");
      ui.cards.reopen(v);
    },
    "shown-the-way"(e, s) {
      drawn().serving.set(e.vessel, G.glass(s.vessels[e.vessel].dish, A, settings.serving.rest));
      ui.cards.served(e.vessel);
    },
  };
}
