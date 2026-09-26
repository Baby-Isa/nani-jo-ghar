/*
 * Mechanic: ask (the "?" rung: ask the doctor). docs/modes/clinic-design.md
 * R2.4, 6.3. On a part row (a check or "where does it hurt?") the child can
 * press "?": the doctor narrows it to two, "Is it the knee, or the foot?",
 * the right one and a look-alike in random order (the which-one stub).
 * It costs the tick (Relaxed); once a visit (data: ask.perVisit); never
 * when two options are all that's left; and a row settled through it is
 * not a tested row for the ear star (visit.js minTested), so "always ask,
 * then pick one" can't earn the ear star (the leak bot's second-option and
 * echo strategies).
 * Knobs (data.mechanics.ask): perVisit.
 */
(function (global) {
  const Cook = global.Cook;
  const Clinic = (global.Clinic = global.Clinic || {});
  const $ = (s) => document.querySelector(s);
  let armed = null;
  let used = 0;

  Clinic.Ask = {
    /** A new visit: the "?" can be used again. */
    reset() {
      used = 0;
      armed = null;
      $("#cl-ask").classList.add("hidden");
    },
    /** This row can be asked about now. */
    arm(row, room, { view } = {}) {
      const k = Cook.Mech.knobs("ask", { level: room.level });
      const pool = view || row.options;
      armed = used < (k.perVisit || 1) && pool.length > 2 ? { row, room, pool } : null;
      $("#cl-ask").classList.toggle("hidden", !armed);
    },
    disarm() {
      armed = null;
      $("#cl-ask").classList.add("hidden");
    },
    /** The doctor's two-way question (the button, or the lab calling it). */
    async press() {
      if (!armed) return;
      const { row, room, pool } = armed;
      Clinic.Ask.disarm();
      used++;
      row.helped = true;
      if (room.ctx.results[row.id]) room.ctx.results[row.id].helped = true;
      room.ctx.helped("ask");
      const [a, b] = Clinic.Which.pair(row.accept[0], pool);
      await room.say("doctor", { frame: "cl-ask", x: [a], y: [b] });
    },
  };

  Cook.Mech.define("ask", {
    // alone in the lab: a "where does it hurt?" with the doctor asked straight away
    async run(z, { room, row }, k) {
      Clinic.Ask.reset();
      Clinic.Ask.arm(row, room);
      await Clinic.Ask.press();
      return Cook.Mech.run("where", z, { room, row, noAsk: true });
    },
  });
})(window);
