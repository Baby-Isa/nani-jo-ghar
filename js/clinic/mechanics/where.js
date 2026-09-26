/*
 * Mechanic: where (M1, "Where does it hurt?"; the named ailment, V3).
 * docs/modes/clinic-design.md R2.2, 6.3, 6.5, R3.2, R3.4 (S2).
 * The patient says it ("My knee hurts."; level 3: "My left knee hurts.",
 * their own left, which is on the right of your screen: they face you).
 * Tap the place. Right: the soft sore swirl, "That's it!". Wrong: a giggle,
 * "{tapped}? No, my {part} hurts." (a recast), try again; two misses on the
 * row: the patient touches it (shown; the row's ear star goes). Hesitating
 * only ever gets the line said again, never a glow.
 *
 * S2 "Tell him where" (level 2+): the doctor, not looking, asks "Where?";
 * the child can SAY it (the microphone, `tell`) and he checks the part he
 * heard; or tap it as before. Tapping grades the ear star exactly as
 * before; only the voice star needs the word said.
 * Params: room, row (the part row), sideRow?, voiceRows? ([part, side?]), noAsk.
 * Knobs (data.mechanics.where): quietMs, replayMs, pad, minHitPx.
 */
(function (global) {
  const Cook = global.Cook;
  const Clinic = global.Clinic;
  const V = global.ClinicVisit;
  const $ = (s) => document.querySelector(s);

  /** The mic button beside the body (the "say it" way in); resolves when pressed. */
  function micButton(z) {
    const box = $("#choices");
    box.innerHTML = "";
    box.classList.remove("hidden");
    box.classList.add("cl-tell");
    return new Promise((resolve) => {
      const b = document.createElement("button");
      b.className = "cl-mic";
      b.type = "button";
      b.innerHTML = "<span>&#127908;</span><small>Say it</small>";
      b.addEventListener("click", () => {
        Cook.unlockAudio();
        box.classList.add("hidden");
        resolve(true);
      });
      box.appendChild(b);
    });
  }

  Cook.Mech.define("where", {
    async run(z, { room, row, sideRow, voiceRows, noAsk }, k) {
      const ctx = z.ctx;
      const part = row.accept[0];
      const side = sideRow ? sideRow.accept[0] : null;
      const say = () => room.say("patient", row.say);
      room.patient.setExpr("ouch");
      await say();
      room.patient.setExpr("idle");
      if (voiceRows && voiceRows.length) await room.say("doctor", voiceRows[0].say);
      if (!noAsk) Clinic.Ask.arm(row, room, { view: room.lv.parts.filter((p) => Clinic.body.isFace(p) === Clinic.body.isFace(part)) });
      let misses = 0;
      let sideMiss = 0;
      const replay = setTimeout(() => say().catch(() => {}), k.replayMs / Cook.speed);
      const found = async () => {
        room.patient.swirl(part, side);
        Cook.sfx.right();
        await room.say("doctor", { frame: "cl-found" });
      };
      try {
        // S2: the microphone, or a tap
        if (voiceRows && voiceRows.length) {
          const post = room.expectPart(z, { part, side });
          const tap = room.tapBody(z, { active: room.lv.parts, expectAt: post });
          const mic = micButton(z);
          const first = await Promise.race([tap.then((h) => ({ h })), mic.then(() => ({ mic: true }))]);
          if (first.mic) {
            tap.cancel();
            Clinic.Ask.disarm();
            const act = async (heard, ok) => {
              // he checks the part he heard (what the recogniser heard, shown by acting on it)
              room.patient.pulse(heard, side);
              if (!ok) {
                room.patient.react("giggle");
                await room.say("doctor", { frame: "cl-nothere" });
              }
            };
            const res = await Cook.Mech.run("tell", z, { row: voiceRows[0], act });
            ctx.grade(row, res.path[0] !== "pill-wrong");
            if (voiceRows[1] && sideRow) {
              const r2 = await Cook.Mech.run("tell", z, { row: voiceRows[1], act: async (heard, ok) => (ok ? null : room.say("patient", { frame: "cl-other", x: [part] })) });
              ctx.grade(sideRow, r2.path[0] !== "pill-wrong");
            }
            await found();
            return { part, side, via: "voice" };
          }
          $("#choices").classList.add("hidden");
          // tapped: voice rows get no voice star (a pill-like way in)
          voiceRows.forEach((vr) => ctx.voice(vr, { first: false, spoken: false, path: ["tapped"] }));
          if (await judgeTap(first.h)) {
            await found();
            return { part, side, via: "tap" };
          }
        }
        for (;;) {
          const post = room.expectPart(z, { part, side });
          const h = await room.tapBody(z, { active: room.lv.parts, expectAt: post });
          if (await judgeTap(h)) break;
        }
      } finally {
        clearTimeout(replay);
        Clinic.Ask.disarm();
        z.expect(null);
      }
      await found();
      return { part, side, via: "tap" };

      async function judgeTap(h) {
        Clinic.Ask.disarm();
        const okPart = V.judge(row, h.part);
        const okSide = !sideRow || (okPart && V.judge(sideRow, h.side));
        ctx.grade(row, okPart);
        // a side: graded only once the recast has been ignored (R3.2), so the first wrong side isn't a miss yet
          if (sideRow && okPart && (okSide || sideMiss++ >= 1)) ctx.grade(sideRow, okSide);
        if (okPart && okSide) return true;
        misses++;
        Cook.sfx.soft();
        if (!okPart) {
          room.patient.react("giggle");
          await room.say("patient", { frame: "cl-wrong", x: [h.part], y: side ? [side, part] : [part] });
          if (misses >= 2) {
            ctx.shown(row);
            room.patient.pulse(part, side, 0xffb0c0);
          }
        } else {
          // R3.2 step C: "Not that one. My other knee." (the recast, then the side's star)
          await room.say("patient", { frame: "cl-other", x: [part] });
          if (misses >= 2) {
            ctx.shown(sideRow);
            room.patient.pulse(part, side, 0xffb0c0);
          }
        }
        return false;
      }
    },
  });
})(window);
