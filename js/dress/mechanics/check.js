/*
 * Dress up mechanic `check` (new, design D.3): the Done pass. The client
 * at the mirror (or Nani over the bed, Big Ma at her table, Ma with her
 * wrist) looks over what was done; if something is wrong she recasts from
 * the first wrong row ("Arre re!" and the row again; an extra thing gets
 * "Nar …") and the player fixes it. The ear star is judged at the FIRST
 * Done (and on any live miss at level 1); later Dones just let the player
 * finish. After `maxDones` wrong Dones the round ends anyway, never stuck.
 *
 *   await Dress.Mech.check.run(r, {grade: (state) => Grade result}) -> final grade
 * Level 1's live check is `Dress.Mech.check.live(r, wear)`.
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const Dress = global.Dress;
  const M = (Dress.Mech = Dress.Mech || {});
  const extraLine = (x) => {
    const it = x.item;
    const row = it.kind === "ph-bangle" ? { garment: "ph-bangle", colour: it.colour, count: null } : it.kind === "motif" ? { thing: "motif", motif: it.motif, colour: it.colour, count: 1 } : { garment: it.kind, colour: it.colour };
    return Lang.line(Dress.data.real.lines.no, Dress.phrase(row));
  };
  M.check = {
    maxDones: 3,
    /** Say what's wrong, first thing first. */
    async recast(r, g) {
      const who = r.round.who;
      await r.say(Lang.line(Dress.data.real.lines.oops), { who, ms: 900 });
      const rc = g.recast;
      if (!rc) return;
      if (rc.id === "extra") return r.say(extraLine(rc.extra), { who });
      const entry = Dress.instruction(r.round).find((e) => e.row.id === rc.id);
      if (entry) return r.say(entry.line, { who });
    },
    async run(r, { grade, before, onOk }) {
      for (;;) {
        if (r.redraw) r.redraw();
        await r.done();
        if (before) await before();
        r.busy = true;
        const g = grade(r.state);
        r.state.dones++;
        if (r.state.firstDone == null) {
          r.state.firstDone = g;
          if (!g.ok) r.lose("ear");
        }
        if (g.ok) {
          r.busy = false;
          if (onOk) await onOk(g);
          return g;
        }
        await M.check.recast(r, g);
        r.busy = false;
        if (r.redraw) r.redraw();
        if (r.state.dones >= M.check.maxDones) return g;
      }
    },
    /** Level 1: judge one piece as it goes on. true / false / null (nothing asked there). */
    live(r, wear) {
      const v = Dress.Grade.live(r.round, r.state, wear);
      if (v === false) {
        r.state.misses++;
        r.lose("ear");
      }
      return v;
    },
  };
})(window);
