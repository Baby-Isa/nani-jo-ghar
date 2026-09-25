/*
 * G3 "Look closer" (K1 at L1, K2 at L2, with hidden traces): every suspect
 * has something on their paws or hands that only the magnifier shows
 * (yellow hardar, white atto, red tameto...). Nani names the trace; peek,
 * then tap. From L2 traces mix with the Keep-who-fits clues. The deciding
 * word is an existing food noun, so this is a real Kutchi test today.
 * Zones: examine + lineup + accuse (the examine zone is mounted by the flow
 * whenever the level says `examine`).
 */
(function (global) {
  const Who = (global.Who = global.Who || {});
  const G = (Who.Games = Who.Games || {});

  G["look-closer"] = {
    async run(ctx) {
      await G.intro(ctx, "who-ate");
      await Who.UI.say("look-closer");
      if (ctx.c.kind === "K1") await G.runK1(ctx);
      else await G.runK2(ctx);
    },
  };
})(window);
