/*
 * Mechanic: handover (R3.1, Zafar's decision 2: the child never gives
 * medicine). docs/modes/clinic-design.md R3.1, R3.4 (S4).
 * The doctor opens his hand; the child puts what they fetched, mixed or
 * used into it. He lifts it and NAMES it, the part and the count ("The
 * bandage. The knee. Twice."): the visit's words heard again, from him, in
 * order (the word review inside the fiction). Right: he uses it (or nods at
 * the work). Wrong (the dispensary, the syrup): he names what it IS and
 * repeats what he asked ("This is the red one. The green bottle, please.")
 * and the child goes back.
 * S4 "What's this?" (from level 2): before naming it he asks the child;
 * the child says it (tell); he names it himself either way.
 * Params: room, obj (what the child hands over: "care-bandage#col-red",
 * "med-green"), want (the item he asked for), review ([item, part, count?]),
 * voiceRow (S4, optional), from ({x, y}: where the thing sits).
 * Returns {ok}.
 * Knobs (data.mechanics.handover): flyMs.
 */
(function (global) {
  const Cook = global.Cook;
  const Clinic = global.Clinic;

  Cook.Mech.define("handover", {
    async run(z, { room, obj, want, review, voiceRow, from }, k) {
      const S = room.S;
      const d = room.doctor;
      const at = from || { x: 1250, y: 760 };
      const it = Clinic.Overlay.image(S, obj, at.x, at.y, { w: 120, h: 100, depth: Cook.D.hand });
      d.openHand(true);
      z.expect({ kind: "tap", x: it.x, y: it.y, key: "handover" });
      await new Promise((resolve) => S.tappable(it, resolve));
      S.untap(it);
      z.expect(null);
      Cook.sfx.whoosh();
      await S.fly(it, d.hand.x, d.hand.y - 20, { duration: k.flyMs });
      if (voiceRow) {
        await room.say("doctor", voiceRow.say);
        await Cook.Mech.run("tell", z, { row: voiceRow, act: async () => {} });
      }
      const given = String(obj).split("#")[0];
      const ok = !want || given === want;
      if (ok) {
        await room.say("doctor", { frame: "cl-review", x: review || [given] });
        await d.laugh();
      } else {
        await room.say("doctor", { frame: "cl-isthis", x: [given], y: [want] });
        await S.fly(it, at.x, at.y, { duration: k.flyMs });
      }
      it.destroy();
      d.openHand(false);
      return { ok };
    },
  });
})(window);
