/*
 * Mechanic: you (V0, M14: You're the patient) with S1, "It's my knee".
 * docs/modes/clinic-design.md R5, R3.2 step A, R3.4 S1.
 * First person, looking down at your own lap (your left is on the LEFT of
 * the screen): a soft pink scuff on a part, or, for a cold, a shiver. The
 * doctor leans in: "You first. Where does it hurt?", hands folded. You SAY
 * it (the microphone, `tell`: the closed set is the lap view's visible
 * parts, 7) and he presses where he heard: the right part -> "Ahh, this
 * one."; a wrong hearing -> "Here?" and you say it again. At level 1 the
 * audio pills are there from the start (you may not know the word yet).
 * Level 2 adds the side, a second listen of 2 ("my left"). The second row:
 * a second scuff ("Where else?") or, the cold variant, how you feel (3).
 * Then his probe ("Does it hurt here?", yes / no: teaching, never graded;
 * he presses a wrong part first about half the time), the plaster design
 * (free, yours to choose), "All better!".
 * Params: visit (a V0 from js/clinic/visit.js).
 * Knobs (data.mechanics.you): probeWrongChance.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const Clinic = global.Clinic;
  const $ = (s) => document.querySelector(s);
  const SKIN = 0xc8a07e;
  const CLOTH = 0x6f88a8;

  /** The lap view: your legs (feet far, at the top), your hands on your knees, your arms at the sides. */
  function lap(S) {
    const L = Cook.data.clinicScene.lap;
    const P = L.parts;
    S.track(S.add.rectangle(800, 450, 1600, 900, 0xd9cdb8).setDepth(Cook.D.bg + 1));
    const g = S.track(S.add.graphics().setDepth(Cook.D.char));
    // legs: shorts over the thighs (near, at the bottom), shins up to the feet (far, at the top)
    [["left", -1], ["right", 1]].forEach(([s]) => {
      const knee = P[`body-knee.${s}`];
      const foot = P[`body-foot.${s}`];
      g.fillStyle(SKIN, 1);
      g.fillRoundedRect(knee[0] - 70, foot[1], 140, knee[1] - foot[1] + 40, 60);
      g.fillStyle(CLOTH, 1);
      g.fillRoundedRect(knee[0] - 95, knee[1] + 30, 190, 460, 50);
      g.fillStyle(SKIN, 1);
      g.fillEllipse(foot[0], foot[1], 130, 100);
      const toe = P[`body-toe.${s}`];
      g.fillEllipse(toe[0], toe[1], 90, 50);
      // arm at the side, the hand resting on the thigh, fingers forward
      const arm = P[`body-arm.${s}`];
      const elbow = P[`body-elbow.${s}`];
      const hand = P[`body-hand.${s}`];
      const fing = P[`body-finger.${s}`];
      g.fillStyle(SKIN, 1);
      g.lineStyle(110, SKIN, 1);
      g.lineBetween(elbow[0], elbow[1] + 80, arm[0], arm[1]);
      g.lineStyle(90, SKIN, 1);
      g.lineBetween(arm[0], arm[1], hand[0], hand[1]);
      g.fillCircle(elbow[0], elbow[1], 60);
      g.fillEllipse(hand[0], hand[1], 150, 120);
      g.fillRoundedRect(fing[0] - 60, fing[1] - 50, 120, 80, 30);
    });
    return P;
  }
  const keyFor = (part, side) => `${part}.${(side || "side-left").replace("side-", "")}`;

  Cook.Mech.define("you", {
    async run(z, { visit }, k) {
      const S = z.S;
      const ctx = z.ctx;
      const P = lap(S);
      const r = Cook.data.clinicScene.lap.r;
      const c = visit.complaint;
      const scuffAt = (part, side) => P[keyFor(part, side)];
      const scuff = (part, side) => {
        const [x, y] = scuffAt(part, side);
        const g = S.track(S.add.graphics().setDepth(Cook.D.item));
        g.fillStyle(0xe46d8f, 0.55);
        g.fillEllipse(x, y, 70, 46);
        g.lineStyle(3, 0xd0506f, 0.6);
        for (let i = 0; i < 4; i++) g.lineBetween(x - 26 + i * 16, y - 14, x - 20 + i * 16, y + 14);
        return g;
      };
      if (c.part) scuff(c.part, c.side);
      if (c.part2) scuff(c.part2, c.side);
      if (c.feeling) S.track(S.add.text(800, 60, c.feeling === "feel-cold" ? "brrr" : "phew", { fontFamily: "Nunito", fontSize: "40px", color: "#3a2410" }).setOrigin(0.5).setDepth(Cook.D.fx));
      // the doctor leaning in from the right (his face, big)
      const doc = S.track(S.add.graphics().setDepth(Cook.D.front));
      doc.fillStyle(0xd6b08c, 1);
      doc.fillCircle(1520, 260, 150);
      doc.fillStyle(0xf2f0ea, 1);
      doc.fillEllipse(1500, 380, 180, 110);
      doc.lineStyle(6, 0x3a3a44, 0.9);
      doc.strokeCircle(1460, 240, 30);
      doc.strokeCircle(1540, 240, 30);
      const anchor = { x: 1300, y: 150 };
      const say = (l) => UI.say(Clinic.line(l), anchor, { ms: Cook.readMs(Lang.plain(Clinic.line(l))) });
      const press = async (key, color = 0xfff3c4) => {
        const at = P[key];
        if (!at) return;
        const ring = S.track(S.add.circle(at[0], at[1], r, color, 0.35).setStrokeStyle(8, 0xffffff).setDepth(Cook.D.fx));
        await Cook.tween(S, { targets: ring, scale: 1.3, alpha: 0, duration: 650 });
        ring.destroy();
      };
      await say({ frame: "cl-youfirst" });
      // the speaking rows (S1)
      let lastPart = c.part;
      for (const row of visit.rows.filter((x) => x.kind === "voice")) {
        await say(row.say);
        const isSide = row.accept[0].startsWith("side-");
        const isFeel = row.accept[0].startsWith("feel-");
        if (!isSide && !isFeel) lastPart = row.accept[0];
        await Cook.Mech.run("tell", z, {
          row,
          act: async (heard, ok) => {
            if (isFeel) {
              await say({ frame: ok ? "cl-this" : "cl-here" });
              return;
            }
            const key = isSide ? keyFor(lastPart, heard) : keyFor(heard, c.side);
            await press(key, ok ? 0xfff3c4 : 0xdfe7ea);
            await say({ frame: ok ? "cl-this" : "cl-here" });
          },
        });
      }
      // the probe: "Does it hurt here?" (yes / no; teaching, never graded)
      const probe = visit.rows.find((x) => x.kind === "probe");
      if (probe) {
        const wrong = Math.random() < k.probeWrongChance;
        const parts = Cook.data.clinic.you.parts.filter((p) => p !== c.part);
        const at = wrong ? keyFor(Cook.pick(parts), c.side) : keyFor(c.part, c.side);
        await press(at);
        await UI.say({ segs: [{ t: "Does it hurt here?", lang: "e" }], en: "Does it hurt here?" }, anchor, { ms: 1400 });
        const right = wrong ? "nope" : "yes";
        await UI.choose(["yes", "nope"].map((kk) => ({ key: kk, line: Lang.line(kk) })), right, { glowAfter: 6000 });
        if (wrong) await press(keyFor(c.part, c.side));
      }
      // the plaster: your design, free
      const designs = Cook.data.clinic.you.designs;
      const box = $("#choices");
      box.innerHTML = "";
      box.classList.remove("hidden");
      const design = await new Promise((resolve) => {
        designs.forEach((d) => {
          const b = document.createElement("button");
          b.className = "btn cl-design";
          b.dataset.design = d;
          b.textContent = d;
          b.addEventListener("click", () => resolve(d));
          box.appendChild(b);
        });
        z.expect({ kind: "click", selector: `#choices .cl-design[data-design="${designs[0]}"]` });
      });
      box.classList.add("hidden");
      z.expect(null);
      if (c.part) {
        const [x, y] = scuffAt(c.part, c.side);
        const pl = Clinic.Overlay.image(S, "care-plaster", x, y, { w: 120, h: 100, depth: Cook.D.fx });
        pl.design = design;
        S.sparkle(x, y);
      }
      await say({ frame: "cl-allbetter" });
      Cook.sfx.fanfare();
      return { design };
    },
  });
})(window);
