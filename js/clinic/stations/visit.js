/*
 * The clinic: the visit (a combined station: calls -> where? -> care ->
 * stick | wrap | lift | tuck | drops -> handover). docs/modes/clinic-design.md
 * R3.3, R2.2. One engine for every visit type; the rows come from
 * js/clinic/visit.js (the same rows the Node leak bot plays).
 *
 * Also registers the lab's whole-visit entries (V0-V4 at the lab's level,
 * a clinic morning, the treatment round) and each mechanic alone.
 */
(function (global) {
  const Cook = global.Cook;
  const Clinic = global.Clinic;
  const V = global.ClinicVisit;
  const M = Cook.Mech;
  const GESTURE = { "care-plaster": "stick", "care-bandage": "wrap", "care-cloth": "lift", "care-ice": "lift", "care-bottle": "lift", "care-blanket": "tuck", "care-drops": "drops" };

  const zone = (S, ctx, level) => M.zone(S, ctx, { id: "clinic", level });

  /** The treatment: his instruction, the trolley, the hands, the hand-over. */
  async function treat(z, room, t, rows, { review, voiceRow } = {}) {
    const careRow = rows.find((r) => r.kind === "care");
    const extra = rows.filter((r) => r !== careRow);
    // the doctor says it all first (the item, then the count or the path), then the trolley
    const said = new Set();
    for (const r of [careRow].concat(extra)) {
      if (!r || !r.say || said.has(r.say)) continue;
      said.add(r.say);
      await room.say("doctor", r.say);
    }
    const pick = careRow ? await M.run("care", z, { room, row: careRow, noSay: true }) : { obj: t.item, img: null };
    const g = GESTURE[t.item] || W(t.item).gesture;
    await M.run(g, z, { room, t, rows: extra, obj: pick.obj, img: pick.img });
    if (room.trolley) room.trolley.all.forEach((o) => o.setVisible(false));
    if (review !== false) await M.run("handover", z, { room, obj: pick.obj, want: t.item, review: review || [t.item, t.part].concat(t.count != null ? [t.count] : []), voiceRow });
  }
  const W = (id) => Cook.data.words[id] || {};

  /** Run one visit in the room. */
  Clinic.runVisit = async function (S, ctx, visit) {
    ctx.visit = visit;
    Clinic.Ask.reset();
    const hasVoice = V.voiceStar(visit, {}, Cook.data.clinic) !== null;
    const hasEar = visit.ear !== false && visit.rows.some((r) => r.kind !== "voice" && r.tested);
    Clinic.card(Cook.data.clinic.visits[visit.type] ? Cook.data.clinic.visits[visit.type].name : "A visit", `Level ${visit.level}`, { ear: hasEar, voice: hasVoice, hand: !!visit.treatment && visit.type !== "you", tick: true });
    const z = zone(S, ctx, visit.level);
    if (visit.type === "you") {
      await M.run("you", z, { visit });
      z.close();
      return;
    }
    const room = Clinic.room(S, ctx, { visit, level: visit.level, patient: visit.patient });
    const byCall = (i) => visit.rows.filter((r) => r.call === i);
    for (const l of visit.lines.filter((l) => l.frame === "cl-unwell" || l.frame === "cl-dunno" || l.frame === "cl-all")) await room.say(l.speaker, l);
    if (visit.type === "checkup" || visit.type === "mystery") {
      for (let i = 0; i < visit.calls.length; i++) {
        const r = await M.run("check", z, { room, call: visit.calls[i], rows: byCall(i), first: i === 0 });
        if (!r.found && i === visit.calls.length - 1 && !visit.find) await room.say("doctor", { frame: "cl-fine" });
      }
    }
    if (visit.type === "hurt") {
      const row = visit.rows.find((r) => r.phase === "where" && r.kind === "part");
      const sideRow = visit.rows.find((r) => r.phase === "where" && r.kind === "side");
      const voiceRows = visit.rows.filter((r) => r.moment === "S2");
      await M.run("where", z, { room, row, sideRow, voiceRows });
    }
    if (visit.type === "bring") {
      // S3: you saw it (the hurt is shown); tell the doctor. He examines what he heard.
      const c = visit.complaint;
      room.patient.setExpr("ouch");
      room.patient.swirl(c.part, c.side);
      const row = visit.rows.find((r) => r.moment === "S3");
      await room.say("doctor", row.say);
      await M.run("tell", z, {
        row,
        act: async (heard, ok) => {
          room.patient.pulse(heard, c.side);
          await room.say("doctor", { frame: ok ? "cl-thatsit" : "cl-nothingwrong" });
        },
      });
      room.patient.setExpr("idle");
    }
    if (visit.treatment) {
      const rows = visit.rows.filter((r) => r.phase === "treat");
      const voiceRow = visit.rows.find((r) => r.moment === "S4");
      await treat(z, room, visit.treatment, rows, { voiceRow });
    }
    room.patient.setExpr("happy");
    await room.say("doctor", { frame: "cl-welldone" });
    z.close();
  };

  /** The treatment round (a mini-game on its own): three patients, the sore place already shown. */
  Clinic.runRound = async function (S, ctx, round) {
    ctx.visit = round;
    Clinic.Ask.reset();
    Clinic.card(round.type === "round" ? "Treatment round" : `Alone: ${round.type.slice(6)}`, `Level ${round.level}`, { ear: round.ear, voice: false, hand: true, tick: true });
    for (let i = 0; i < round.treatments.length; i++) {
      const t = round.treatments[i];
      if (i) await S.setView("marble");
      const z = zone(S, ctx, round.level);
      const room = Clinic.room(S, ctx, { visit: round, level: round.level, patient: `grey-${(i % 3) + 1}` });
      room.patient.swirl(t.part, t.side);
      await room.say("patient", { frame: "cl-hurts", x: t.side ? [t.side, t.part] : [t.part] });
      await treat(z, room, t, t.rows, { review: [t.item, t.part].concat(t.count != null ? [t.count] : []) });
      z.close();
    }
  };

  /* ---------------- lab entries ---------------- */
  const visitLab = (type, name, verb) =>
    Clinic.lab({
      key: `visit:${type}`,
      name,
      verb,
      group: "visit",
      async run(L) {
        const v = V.make(Cook.data.clinic, { type, level: L.level });
        L.ctx.visit = v;
        await Clinic.runVisit(L.S, L.ctx, v);
        return v;
      },
    });
  visitLab("you", "You're the patient", "V0 · S1 \"It's my knee\"");
  visitLab("checkup", "The check-up", "V1 · check");
  visitLab("mystery", "The mystery", "V2 · check + find");
  visitLab("hurt", "The named ailment", "V3 · where + treat (+ S2)");
  visitLab("bring", "Bring someone in", "V4 · S3 (lab stub)");
  Clinic.lab({
    key: "round",
    name: "Treatment round",
    verb: "3 patients · care + hands",
    group: "visit",
    async run(L) {
      const r = V.round(Cook.data.clinic, { level: L.level });
      await Clinic.runRound(L.S, L.ctx, r);
      return r;
    },
  });
  Clinic.lab({
    key: "morning",
    name: "A clinic morning",
    verb: "days.mix: 3-4 visits",
    group: "visit",
    async run(L) {
      const types = V.morning(Cook.data.clinic, { level: L.level });
      const all = [];
      for (const type of types) {
        await L.S.setView("marble");
        const v = V.make(Cook.data.clinic, { type, level: L.level, patient: Cook.pick(["grey-1", "grey-2", "grey-3"]) });
        all.push(v);
        const sub = Clinic.makeCtx({ level: L.level });
        await Clinic.runVisit(L.S, sub, v);
        // the morning's stars: the lab card shows the last visit's; the tally goes in the result
        L.ctx.misses.push(...sub.misses.map((m) => `${type}: ${m}`));
        sub.grades.forEach((g) => L.ctx.grades.push(g));
        L.ctx.help += sub.help;
        sub.voiceLog.forEach((v2) => L.ctx.voiceLog.push(v2));
        Cook.ctx = L.ctx;
      }
      return all;
    },
  });

  // each mechanic alone, on a greybox patient
  const alone = (key, name, verb, fn) => Clinic.lab({ key: `m:${key}`, name, verb, group: "mech", run: fn });
  alone("check", "Check", "one call (M15)", async (L) => {
    const v = V.make(Cook.data.clinic, { type: "checkup", level: L.level });
    L.ctx.visit = null;
    Clinic.card("Check", `Level ${L.level}`, { ear: true, hand: false, tick: true });
    const z = zone(L.S, L.ctx, L.level);
    const room = Clinic.room(L.S, L.ctx, { visit: v, level: L.level });
    await M.run("check", z, { room, call: v.calls[0], rows: v.rows.filter((r) => r.call === 0), first: true });
    z.close();
  });
  alone("where", "Where does it hurt?", "M1", async (L) => {
    const v = V.make(Cook.data.clinic, { type: "hurt", level: L.level });
    Clinic.card("Where", `Level ${L.level}`, { ear: true, voice: L.level >= 2, hand: false, tick: true });
    const z = zone(L.S, L.ctx, L.level);
    const room = Clinic.room(L.S, L.ctx, { visit: v, level: L.level });
    await M.run("where", z, { room, row: v.rows.find((r) => r.phase === "where" && r.kind === "part"), sideRow: v.rows.find((r) => r.phase === "where" && r.kind === "side"), voiceRows: v.rows.filter((r) => r.moment === "S2") });
    z.close();
  });
  alone("ask", "Ask the doctor (\"?\")", "the two-way rung", async (L) => {
    const v = V.make(Cook.data.clinic, { type: "hurt", level: L.level });
    Clinic.card("?", `Level ${L.level}`, { ear: true, hand: false, tick: true });
    const z = zone(L.S, L.ctx, L.level);
    const room = Clinic.room(L.S, L.ctx, { visit: v, level: L.level });
    await M.run("ask", z, { room, row: v.rows.find((r) => r.phase === "where" && r.kind === "part") });
    z.close();
  });
  const gestureLab = (g, name, verb) =>
    alone(g, name, verb, async (L) => {
      const lvl = g === "drops" ? Math.max(3, L.level) : L.level;
      const r = V.round(Cook.data.clinic, { level: lvl, n: 1, only: g });
      await Clinic.runRound(L.S, L.ctx, r);
    });
  alone("care", "The trolley", "M2 · pick what he names", async (L) => {
    const r = V.round(Cook.data.clinic, { level: L.level, n: 1 });
    Clinic.card("The trolley", `Level ${L.level}`, { ear: true, hand: false, tick: true });
    const z = zone(L.S, L.ctx, L.level);
    const room = Clinic.room(L.S, L.ctx, { visit: r, level: L.level });
    await M.run("care", z, { room, row: r.rows.find((x) => x.kind === "care") });
    z.close();
  });
  gestureLab("stick", "Plaster", "T1 · stick");
  gestureLab("wrap", "Bandage", "T2 · wrap, turns, colour, path");
  gestureLab("lift", "Cold / hot pack", "T12 · lay and lift");
  gestureLab("tuck", "Blanket", "T13 · tuck");
  gestureLab("drops", "Drops", "T11 · level 3");
  alone("handover", "Hand it over", "R3.1 · he names it", async (L) => {
    Clinic.card("Hand it over", `Level ${L.level}`, { ear: false, voice: L.level >= 2, hand: false, tick: true });
    const r = V.round(Cook.data.clinic, { level: L.level, n: 1 });
    const t = r.treatments[0];
    const z = zone(L.S, L.ctx, L.level);
    const room = Clinic.room(L.S, L.ctx, { level: L.level });
    const vr = L.level >= 2 ? { id: "hv", kind: "voice", moment: "S4", options: V.closedSet(Cook.data.clinic, t.item, room.lv.trolley, 5, Math.random), accept: [t.item], say: { frame: "cl-whatsthis" } } : null;
    await M.run("handover", z, { room, obj: t.item, want: t.item, review: [t.item, t.part], voiceRow: vr });
    z.close();
  });
  alone("tell", "Say it (S1 alone)", "tell · the stub recogniser", async (L) => {
    const v = V.make(Cook.data.clinic, { type: "you", level: L.level });
    L.ctx.visit = { rows: v.rows.filter((r) => r.kind === "voice").slice(0, 1), ear: false, type: "tell" };
    Clinic.card("Say it", `Level ${L.level}`, { ear: false, voice: true, hand: false, tick: true });
    const z = zone(L.S, L.ctx, L.level);
    const room = Clinic.room(L.S, L.ctx, { level: L.level });
    const row = v.rows[0];
    await room.say("doctor", row.say);
    await M.run("tell", z, { row, act: async (heard, ok) => room.say("doctor", { frame: ok ? "cl-this" : "cl-here" }) });
    z.close();
  });
})(window);
