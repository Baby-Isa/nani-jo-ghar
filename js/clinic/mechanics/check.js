/*
 * Mechanic: check (M15, the check-up). docs/modes/clinic-design.md R2.2,
 * 12.2 task 2. The doctor calls a part ("The head." / "Now the knee." /
 * "The knee again."); from level 2 with a tool ("Listen to the chest");
 * from level 3 the patient adds the side in their own voice ("My left one").
 * The child picks the tool from the kit (level 2+) and taps the part.
 *   - the named part (and tool, and side): the tool reacts (a heartbeat, a
 *     torch beam, a reading); on the mystery's find call the reveal plays
 *     (a swirl, a sound) and the doctor: "That's it!";
 *   - any other part: the patient giggles ("That tickles!") and he says the
 *     call again; a miss for that row (only the named part counts: sweeping
 *     the body finds nothing worth having);
 *   - the wrong tool on the right part: "No, the {tool}": a miss for the
 *     tool only;
 *   - the wrong side: "Not that one. My other {part}";
 *   - two misses on a row: the patient touches the part (shown: the row's
 *     ear star goes). Hesitating only ever gets the call said again.
 * The doctor never looks or points (his hands stay folded).
 * Params: room, call ({part, tool, side, find, frame}), rows (the call's
 * graded rows from js/clinic/visit.js), first (the first call of a visit).
 * Knobs (data.mechanics.check): quietMs, replayMs, reactMs.
 */
(function (global) {
  const Cook = global.Cook;
  const Clinic = global.Clinic;
  const V = global.ClinicVisit;
  const Lang = Cook.Lang;

  async function reaction(room, tool, part, side, find) {
    const S = room.S;
    const w = room.where(part, side);
    room.patient.pulse(part, side);
    if (tool === "tool-stethoscope") {
      for (let i = 0; i < 3; i++) {
        Cook.sfx.pop();
        await Cook.wait(220);
      }
    } else if (tool === "tool-torch") {
      const beam = S.track(S.add.circle(w.x, w.y, 40, 0xfff3a0, 0.5).setDepth(Cook.D.fx));
      await Cook.tween(S, { targets: beam, alpha: 0, scale: 1.6, duration: 600 });
      beam.destroy();
    } else if (tool === "tool-strip") {
      S.floatText(w.x, w.y - 30, find && find.reveal === "hot" ? "hot" : find && find.reveal === "cold" ? "cold" : "ok", "#ffffff", 40);
      await Cook.wait(500);
    } else {
      Cook.sfx.click();
      await Cook.wait(300);
    }
  }

  Cook.Mech.define("check", {
    async run(z, { room, call, rows, first }, k) {
      const ctx = z.ctx;
      const toolRow = rows.find((r) => r.kind === "tool");
      const partRow = rows.find((r) => r.kind === "part");
      const sideRow = rows.find((r) => r.kind === "side");
      const lv = room.lv;
      const say = async () => {
        await room.say("doctor", { frame: call.frame, x: [call.part] });
        if (sideRow) await room.say("patient", sideRow.say);
      };
      await say();
      Clinic.Ask.arm(partRow, room, { view: lv.parts.filter((p) => Clinic.body.isFace(p) === Clinic.body.isFace(call.part)) });
      let misses = 0;
      let sideMiss = 0;
      let replay = setTimeout(() => say().catch(() => {}), k.replayMs / Cook.speed);
      try {
        for (;;) {
          const post = room.expectPart(z, { part: call.part, side: call.side, tool: call.tool });
          const h = await room.tapBody(z, { active: lv.parts, expectAt: post });
          Clinic.Ask.disarm();
          const okPart = V.judge(partRow, h.part);
          const okTool = !toolRow || V.judge(toolRow, room.tool);
          const okSide = !sideRow || (okPart && V.judge(sideRow, h.side));
          if (toolRow) ctx.grade(toolRow, okTool);
          ctx.grade(partRow, okPart);
          // a side: graded only once the recast has been ignored (R3.2), so the first wrong side isn't a miss yet
          if (sideRow && okPart && (okSide || sideMiss++ >= 1)) ctx.grade(sideRow, okSide);
          if (okPart && okTool && okSide) break;
          misses++;
          Cook.sfx.soft();
          if (!okPart) {
            room.patient.react("giggle");
            await room.say("patient", { frame: "cl-tickles" });
            if (misses >= 2) {
              ctx.shown(partRow);
              room.patient.pulse(call.part, call.side, 0xffb0c0);
            }
            await say();
          } else if (!okTool) {
            await room.say("doctor", { frame: "cl-notool", x: [call.tool] });
            if (misses >= 2) ctx.shown(toolRow);
          } else {
            await room.say("patient", { frame: "cl-other", x: [call.part] });
            if (misses >= 2) {
              ctx.shown(sideRow);
              room.patient.pulse(call.part, call.side, 0xffb0c0);
            }
          }
        }
      } finally {
        clearTimeout(replay);
        z.expect(null);
      }
      await reaction(room, call.tool, call.part, call.side, call.find ? room.visit && room.visit.find : null);
      if (call.find) {
        room.patient.swirl(call.part, call.side);
        room.patient.setExpr("ouch");
        await room.say("doctor", { frame: "cl-found" });
        return { found: true };
      }
      return { found: false };
    },
  });
})(window);
