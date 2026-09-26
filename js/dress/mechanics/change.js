/*
 * Dress up mechanic `change` (new, design D.3): a change of mind. From
 * level 2, a short while after the first thing goes on, the speaker says
 * "Oh, wait!" and one row again with a new colour; one in four is a false
 * alarm ("Hmm… no, the first one."). If Done comes first, the change is
 * said then, before anything is checked. The round's `change` comes from
 * the generator (js/dress/look.js); the card updates when it's said.
 * Knobs (data.mechanics.change): afterMs.
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const Dress = global.Dress;
  const M = (Dress.Mech = Dress.Mech || {});
  M.change = {
    arm(r) {
      const ch = r.round.change;
      if (!ch) return () => Promise.resolve();
      const k = Dress.Look.knobs(Dress.data, "change", r.round.level);
      let fired = null;
      const fire = () => {
        if (fired) return fired;
        fired = (async () => {
          await r.say(Lang.line("dress-change"), { ms: 900 });
          r.round.changeSaid = true;
          r.card({ hide: r.cardHidden });
          const entry = Dress.instruction(r.round).find((e) => e.row.id === ch.row);
          if (ch.falseAlarm) await r.say(Lang.line("dress-same"));
          else if (entry) await r.say(entry.line);
          if (r.redraw) r.redraw();
        })();
        return fired;
      };
      const prev = r.onWear;
      r.onWear = (w) => {
        if (prev) prev(w);
        if (!fired) setTimeout(() => r.alive() && fire().catch(() => {}), Dress.fast ? 0 : k.afterMs / Cook.speed);
      };
      return fire;
    },
  };
})(window);
