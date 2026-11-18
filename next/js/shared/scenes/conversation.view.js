/*
 * The small conversation scenes' drawing: well done, the serve with its thanks, and the end. Each draws what its rules say and tells the runner when a line has been said or a card shown.
 */
import { createRoom } from "../kit/people.js";
import { lineHtml } from "../kit/nani-box.js";
import { createEndScreen } from "../kit/end-screen.js";

/** Well done: one praise from Nani, in her box as she says it, with a small card by a face at the serving spot. */
export function wellDoneView({ stage, say, kit, ui, send }) {
  const T = kit.lineTimes;
  say.warm(kit.lines.wellDone); // (known from the round's start: its clips are decoded long before it is said)
  // (the stage's own clock: it stands still while the round is held behind the turn card)
  const wait = (ms) => stage.wait(ms);
  return {
    async enter(state) {
      const line = say.line(state.line);
      await wait(T.wellDoneAfter);
      if (ui.serving) ui.serving.praise(line.text);
      ui.cards.seats.forEach((s, i) => (ui.cards.served(i), ui.cards.fold(i)));
      await Promise.race([ui.nani.line(line, { speak: true }), wait(T.wellDoneCap)]);
      await wait(T.wellDoneHold);
      send({ type: "said" });
    },
    async leave() {
      if (ui.serving) await ui.serving.closeReview();
    },
  };
}

/** The serve: everyone back where they ordered from, one tray each, each dish landing on its own; then the thanks. */
export function serveView({ stage, say, kit, people, ui, send, roomArt, trayArt, dishArt }) {
  const R = kit.room;
  const wait = (ms) => stage.wait(ms);
  // the thanks and the goodbye are known from the round's start: their clips are decoded long before they are said
  say.warm(kit.lines.thanks);
  say.warm(kit.lines.goodbye);
  let room = null;
  let trays = [];
  let offResize = null;
  /** Each tray under its person, as wide as the gap to the next allows, whole inside the slice of the room the screen shows. */
  function layTrays() {
    const T = R.tray;
    const xs = room.seats.map((p) => p.x);
    const gap = Math.min(...xs.slice(1).map((x, i) => x - xs[i]), Infinity);
    const w = Math.min(T.w, gap * T.gapShare);
    const h = (w * T.h) / T.w;
    const v = stage.visibleX("room");
    const m = R.sideKeep / stage.scaleOf("room");
    // (its widest: its shadow, or its face label hanging off its left edge)
    const [l, r] = [Math.max((w * T.shade) / 2, -w * T.faceAt[0] + T.face / 2), (w * T.shade) / 2];
    trays.forEach((t, i) => {
      const x = Math.max(v.left + m + l, Math.min(v.right - m - r, xs[i]));
      Object.assign(t, { x, y: T.y + h * T.floor, w, h, faceAt: { x: x + w * T.faceAt[0], y: T.y + h * T.faceAt[1] } });
      t.shade.set({ x: x + w * T.shade * kit.look.shadowDx, y: T.y + h * T.shade * kit.look.shadowDy, displayWidth: w * T.shade * kit.look.textures.shadowFit[0], displayHeight: h * T.shade * kit.look.textures.shadowFit[1] });
      t.pic.set({ x, w });
      t.face.set({ x: t.faceAt.x, y: t.faceAt.y });
      if (t.dish) t.dish.set({ x, w: w * T.dish });
    });
  }
  async function line(e) {
    const l = say.line(e.line);
    // (in its .text, so the gold underline shows while it is said)
    room.bubble(e.seat, `<span class="text">${lineHtml(l)}</span>`, "warm");
    room.talk(e.seat, true);
    room.reading(true);
    const quiet = Math.max(kit.order.silentMin, Math.min(kit.order.silentMax, kit.order.silentBase + kit.order.silentPerLetter * l.text.length));
    await Promise.all([Promise.race([say.speak(l), wait(quiet + R.voiceCapMs)]), wait(l.plan.some((c) => c.file) ? kit.order.minHoldMs : quiet)]);
    room.reading(false);
    room.talk(e.seat, false);
    // their line said, the bubble goes and they rest a beat in their happy pose, a hand raised, before the next line
    room.mood(e.seat, "happy");
    room.bubble(null);
    await wait(R.talk.afterMs);
    send({ type: "said" });
  }
  async function land(seat) {
    const t = trays[seat];
    const d = (t.dish = stage.picture(stage.layer("room", "things"), dishArt, { x: t.x, y: t.y - R.tray.dishDrop, origin: [0.5, 1], w: t.w * R.tray.dish, alpha: 0 }));
    await d.to({ y: t.y, alpha: 1 }, R.tray.dishMs, "cubicOut");
    ui.sounds.play("pop");
    await wait(R.tray.between);
    send({ type: "landed" });
  }
  return {
    async enter(state, round) {
      // a beat with nothing happening, then the cooking view fades out and the kitchen fades in
      await Promise.all([wait(R.serveWait), stage.load([trayArt, dishArt])]);
      const curtain = await stage.curtain(R.fadeMs);
      await wait(R.cutGap);
      // everyone is back where they ordered from; three people spread out to the right of Nani
      const n = round.people.length;
      const spread = (i) => R.naniX + R.serveSpread[0] + ((stage.sheet.w - R.serveSpread[1] - R.naniX - R.serveSpread[0]) * i) / (n - 1);
      const standing = n > 2 ? round.people.map((p, i) => ({ ...p, spot: spread(i) })) : round.people;
      room = await createRoom({ stage, kit, roomArt, people, standing, lift: 0, walk: false, nani: true, speech: "line" });
      ui.room = room;
      // the heads with the speech strip above them, down to the foot of the widest tray's shadow, stay whole at any size, on a
      // resize too; where that cannot fit at the painting's full width the trays stay whole and the people stand lower (the room's)
      stage.keepInView("room", room.headsTop, room.strip(), R.tray.y + (R.tray.h * R.tray.shade) / 2 + R.tray.keepBelow);
      room.fit();
      curtain.lift();
      stage.glide(-R.serveGlide, R.serveGlideMs);
      await wait(R.tray.fadeAt);
      stage.layer("room", "shadows");
      const things = stage.layer("room", "things");
      // a tray under each person: narrower when people stand close, and kept whole inside the slice of the room shown
      const T = R.tray;
      trays = room.seats.map((s) => {
        const shade = stage.shadow(stage.layer("room", "shadows"), { x: 0, y: T.y, w: T.w * T.shade, h: T.h * T.shade }).set({ alpha: T.shadeAlpha });
        const pic = stage.picture(things, trayArt, { x: 0, y: T.y, w: T.w, alpha: 0 });
        pic.to({ alpha: 1 }, T.fadeMs, "out");
        const face = stage.image(things, stage.badge(people[s.id].face), { x: 0, y: T.y, w: T.face });
        face.set({ alpha: 0 }).to({ alpha: 1 }, T.fadeMs);
        return { shade, pic, face, dish: null };
      });
      layTrays();
      offResize = stage.onResize(layTrays, "room");
      await wait(R.serveGlideMs - R.tray.fadeAt);
      room.nani("happy");
      this.ready = true;
      (this.pending || []).forEach((e) => this.handle(e));
      this.pending = null;
    },
    /** For the checks: the heads, and each tray with its person's face label. */
    probe() {
      if (!room) return [];
      const B = (kind, id, x, y, w, h, more) => ({ kind, id, ...stage.pageRect("room", { x: x - w / 2, y: y - h / 2, w, h }), ...more });
      return room.probe().concat(trays.flatMap((t, i) => [B("tray", i, t.x, R.tray.y, t.w, t.h, { stands: true }), B("label", i, t.faceAt.x, t.faceAt.y, R.tray.face, R.tray.face, { on: "tray" })]));
    },
    handle(e) {
      if (e.type === "land") land(e.seat);
      else if (e.type === "line") line(e);
    },
    on(events) {
      for (const e of events) this.ready ? this.handle(e) : (this.pending = (this.pending || []).concat(e));
    },
    async leave() {
      this.ready = false;
      if (offResize) offResize();
      room.bubble(null);
      await room.walkOff();
    },
  };
}

/** The end: two pages on one card, the badges and then the order's words; no verdict. */
export function endView({ stage, say, kit, ui, send, endArt }) {
  let screen = null;
  return {
    enter(state, round) {
      say.stop();
      ui.nani.line(null);
      // one tile per thing and number the order used, in the form it was said: the dish first, then each row in turn
      const words = [];
      const listed = (piece) => piece.kind === "k" && kit.end.listKinds.includes(String(piece.word).split(".")[0]);
      const add = (line, right, headFirst = false) => {
        const pieces = line.pieces.filter(listed);
        // in a headline the dish is named last, after what goes with it: it leads the list
        for (const piece of headFirst ? pieces.reverse() : pieces) {
          const had = words.find((w) => w.kutchi === piece.t);
          if (had) had.right = had.right && right;
          else words.push({ kutchi: piece.t, english: (say.entry(piece.word) || {}).english || "", line: { ...line, plan: line.plan.filter((c) => c.text === piece.t) }, right });
        }
      };
      for (const [i, p] of round.order.for.entries()) {
        add(say.line(p.headline.meaning, { register: p.headline.register }), true, true);
        p.items.forEach((it, n) => add(say.line(it.meaning, { row: true }), round.dishes[i].rowsRight[n]));
      }
      screen = createEndScreen({ stage, kit, say, sounds: ui.sounds, endArt, state, words, onNext: () => send({ type: "next" }), onAgain: () => send({ type: "again" }), onLeave: () => send({ type: "leave" }) });
    },
    on(events) {
      for (const e of events) if (e.type === "page") screen.page(e.page);
    },
    leave() {
      if (screen) screen.close();
      ui.cards.clear();
    },
  };
}
