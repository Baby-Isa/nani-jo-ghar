/*
 * The clinic: the dispensary (T6: fetch -> handover; later T5: pour/count +
 * stir -> handover) and the doctor's bag (M8, pass me).
 * docs/modes/clinic-design.md R2.5 (T5, T6), R3.1, R3.3.
 *
 * These REUSE Cook's mechanics by id, loaded unchanged from
 * js/cook/mechanics/ (fetch, count, stir, passme): the clinic's bottles and
 * syrups are words in data/clinic.json with a `heap`, so Cook's shelf and
 * bowls draw them; its look-alike groups (the three bottles) are merged
 * into Cook.data at load, so the shelf's decoys and "pass me"'s tray come
 * from one group. Phase 3 gives the dispensary its own view; here Cook's
 * pantry and hob stand in for the doctor's shelf and counter.
 * The child never gives medicine (R3.1): everything ends in the hand-over,
 * where the doctor names it (and the count) and gives it himself.
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const St = Cook.Stations;
  const Clinic = global.Clinic;
  const M = Cook.Mech;
  const BOTTLES = ["med-green", "med-red", "med-blue"];

  async function handOver(L, obj, want, review) {
    await L.S.setView("marble");
    const z = M.zone(L.S, L.ctx, { id: "disp", level: L.level });
    const room = Clinic.room(L.S, L.ctx, { level: L.level, bench: true });
    const r = await M.run("handover", z, { room, obj, want, review });
    z.close();
    return r;
  }

  Clinic.lab({
    key: "disp:fetch",
    name: "The dispensary",
    verb: "Cook's fetch -> handover (T6)",
    group: "cook",
    async run(L) {
      Clinic.card("The dispensary", `Level ${L.level}`, { ear: true, hand: false, tick: true });
      const want = Cook.pick(BOTTLES);
      const n = L.level >= 2 ? 1 + Math.floor(Math.random() * 2) : null;
      // "Bring me the green bottle." (the doctor, before the shelf)
      await L.S.setView("marble");
      const room = Clinic.room(L.S, L.ctx, { level: L.level });
      await room.say("doctor", { frame: "cl-bring", x: [want] });
      L.ctx.basket = [];
      await M.station("fetch", L.S, L.ctx, { need: [want] }, { level: L.level });
      await handOver(L, L.ctx.basket[0] || want, want, n ? [want, n] : [want]);
    },
  });

  Clinic.lab({
    key: "disp:mix",
    name: "Mix the medicine",
    verb: "Cook's count + stir -> handover (T5, later)",
    group: "cook",
    async run(L) {
      Clinic.card("Mix the medicine", `Level ${L.level}`, { ear: true, hand: true, tick: true });
      const n = 1 + Math.floor(Math.random() * 3);
      const laps = 1 + Math.floor(Math.random() * 3);
      await L.S.setView("marble");
      const room = Clinic.room(L.S, L.ctx, { level: L.level });
      await room.say("doctor", { frame: "cl-treat", x: [n, "med-syrup"] });
      await room.say("doctor", Lang.line("times", Lang.phrase([laps])));
      // Cook's count: spoons of syrup into the cup, look-alike bowls beside it
      await St.begin(L.S, L.ctx, "count", "hob");
      const z = M.zone(L.S, L.ctx, { id: "mix", level: L.level });
      const cup = St.vessel(L.S, "cup", St.BURNER.left.x, St.BURNER.left.y - 30, 1.2);
      const items = {};
      Cook.shuffle(["med-syrup", "med-honey", "med-red"]).forEach((id, i) => (items[id] = L.S.ingredient(id, 300 + i * 250, St.STRIP_Y - 20)));
      const got = await M.run("count", z, { bowl: items["med-syrup"], n, into: cup, word: "med-syrup", items });
      z.close();
      St.end();
      // Cook's stir, as it is
      await M.station("stir", L.S, L.ctx, { laps, speed: null }, { level: 1 });
      // the hand-over: he names what's in the cup ("Two spoons of syrup."), and gives it himself
      await handOver(L, "med-syrup", "med-syrup", [got, "med-syrup"]);
    },
  });

  Clinic.lab({
    key: "disp:passme",
    name: "The doctor's bag",
    verb: "Cook's pass me (M8)",
    group: "cook",
    async run(L) {
      Clinic.card("The doctor's bag", `Level ${L.level}`, { ear: true, hand: false, tick: true });
      await L.S.setView("marble");
      Clinic.room(L.S, L.ctx, { level: L.level });
      const want = Cook.pick(["care-cloth", "care-ice", "care-blanket", "care-bottle", "care-plaster", "care-bandage"]);
      await M.station("passme", L.S, L.ctx, { want });
    },
  });

  // the hotspot editor (lab only; 12.2 task 1): click to add points to a part's polygon,
  // see the mirrored side, copy the JSON from the console / the panel
  Clinic.lab({
    key: "tools:hotspots",
    name: "Hotspot editor",
    verb: "draw polygons, mirror, save JSON",
    group: "tools",
    async run(L) {
      await L.S.setView("marble");
      Clinic.settings.hotspots = true;
      const room = Clinic.room(L.S, L.ctx, { level: 3 });
      room.patient.showDev(true, Cook.data.clinic.levels[2].parts);
      Clinic.card("Hotspot editor", "Tap to add points; pick a part below", { ear: false, tick: false });
      const file = JSON.parse(JSON.stringify(Clinic.body.file));
      const box = document.querySelector("#choices");
      box.innerHTML = "";
      box.classList.remove("hidden");
      const sel = document.createElement("select");
      sel.id = "cl-hs-part";
      Object.keys(file.parts).forEach((k) => sel.appendChild(Object.assign(document.createElement("option"), { value: k, textContent: k })));
      const clear = Object.assign(document.createElement("button"), { className: "btn", textContent: "Clear part", id: "cl-hs-clear" });
      const save = Object.assign(document.createElement("button"), { className: "btn primary", textContent: "Save JSON", id: "cl-hs-save" });
      const done = Object.assign(document.createElement("button"), { className: "btn", textContent: "Done", id: "cl-hs-done" });
      [sel, clear, save, done].forEach((e) => box.appendChild(e));
      const g = L.S.track(L.S.add.graphics().setDepth(Cook.D.top));
      const redraw = () => {
        g.clear();
        const b = ClinicBody.build(file);
        Object.entries(b.polys).forEach(([k, p]) => {
          g.lineStyle(k === sel.value ? 5 : 2, k === sel.value ? 0x00a0ff : 0xff2d9a, 0.9);
          g.strokePoints(p.map(([x, y]) => new Phaser.Geom.Point(x, y)), true);
        });
      };
      redraw();
      sel.addEventListener("change", redraw);
      clear.addEventListener("click", () => ((file.parts[sel.value] = []), redraw()));
      save.addEventListener("click", () => {
        const json = JSON.stringify(file, null, 1);
        console.log(json);
        Clinic.editorJSON = json;
        Cook.UI.toast("Saved to the console (and Clinic.editorJSON)");
      });
      const off = L.S.input.on("pointerdown", (p) => {
        if (p.worldX > 1580) return;
        file.parts[sel.value] = (file.parts[sel.value] || []).concat([[Math.round(p.worldX), Math.round(p.worldY)]]);
        redraw();
      });
      Cook.expect = { kind: "click", selector: "#cl-hs-done" };
      await new Promise((r) => done.addEventListener("click", r));
      box.classList.add("hidden");
      Clinic.settings.hotspots = false;
      // round-trip check: the edited file builds the same body keys
      return { roundTrip: JSON.stringify(ClinicBody.build(JSON.parse(JSON.stringify(file))).keys) === JSON.stringify(ClinicBody.build(file).keys) };
    },
  });
})(window);
