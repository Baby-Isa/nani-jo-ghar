/*
 * Dress up mechanic `wear` (new, design D.3): puts a picked item on a slot
 * of the current renderer (a pile on the bed, an upper-body anchor, a part
 * of Big Ma's kurta, Ma's wrist) and writes the worn state `wears[]`; a
 * tap on a worn item sends it back. Garment parts are slots too.
 *
 *   Dress.Mech.wear.put(r, {who, slot, item}, {single})  -> the wear
 *   Dress.Mech.wear.off(r, wear)                         -> sends it back
 *   Dress.Mech.wear.on(r, who, slot)                     -> wears there
 * `single`: one item per slot (the fitting): what was there goes back.
 * Knobs: none. Sending something back costs the hand star ("Neat").
 */
(function (global) {
  const Dress = global.Dress;
  const M = (Dress.Mech = Dress.Mech || {});
  M.wear = {
    put(r, w, { single = false } = {}) {
      const st = r.state;
      if (single) st.wears.filter((x) => x.who === w.who && x.slot === w.slot).forEach((x) => M.wear.off(r, x, { quiet: true }));
      const wear = Object.assign({ t: Date.now() }, w);
      st.wears.push(wear);
      global.Cook.sfx.pop && global.Cook.sfx.pop();
      if (r.onWear) r.onWear(wear);
      return wear;
    },
    off(r, wear, { quiet = false } = {}) {
      const st = r.state;
      const i = st.wears.indexOf(wear);
      if (i < 0) return;
      st.wears.splice(i, 1);
      const ch = r.round.change;
      const changed = ch && r.round.changeSaid && !ch.falseAlarm && wear.item.colour === ch.from;
      if (!quiet && !changed) {
        st.sentBack++;
        r.lose && r.state.sentBack === 1 && r.lose("hand");
      }
    },
    on: (r, who, slot) => r.state.wears.filter((x) => (who == null || x.who === who) && x.slot === slot),
  };
})(window);
