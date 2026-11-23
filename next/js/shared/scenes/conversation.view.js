/*
 * The small conversation scenes' drawing: well done, the serve with its thanks, and the end. Each draws what its rules say and tells the runner when a line has been said or a card shown.
 */
import { createRoom, roomRefs } from "../kit/people.js";
import { lineHtml } from "../kit/nani-box.js";
import { createEndScreen } from "../kit/end-screen.js";
import { rightFirst } from "../kit/touches.rules.js";
import { listedRows } from "./conversation.rules.js";

/** Well done: one praise from Nani, in her box as she says it, with a small card by a face at the serving spot. */
export function wellDoneView({ stage, say, kit, ui, send }) {
  const T = kit.lineTimes;
  say.warm(kit.lines.wellDone); // (known from the round's start: its clips are decoded long before it is said)
  // (the stage's own clock, through the scene's lifetime: it stands still while the round is held behind the turn card)
  let life = null;
  const wait = (ms) => life.wait(ms);
  function* praise(meaning) {
    const line = say.line(meaning);
    yield wait(T.wellDoneAfter);
    if (ui.serving) ui.serving.praise(line.text);
    // every card's tick gives one pop, with its sound, as Nani says well done
    ui.cards.seats.forEach((s, i) => (ui.cards.served(i), ui.cards.cheer(i), ui.cards.fold(i)));
    ui.sounds.play("stamp");
    yield Promise.race([ui.nani.line(line, { speak: true }), wait(T.wellDoneCap)]);
    yield wait(T.wellDoneHold);
    send({ type: "said" });
  }
  return {
    // (nothing new to draw: the kitchen stays as the cooking left it, and the praise comes as the scene opens)
    enter(state, round, lifetime) {
      life = lifetime;
      if (ui.serving) ui.serving.keptBy(life);
    },
    on(events) {
      for (const e of events) if (e.type === "praise") life.go(praise(e.line));
    },
    async leave() {
      if (ui.serving) await ui.serving.closeReview();
    },
  };
}

/** The serve: everyone back where they ordered from, one tray each, each dish landing on its own; then the thanks. */
export function serveView({ stage, say, kit, people, ui, send, roomArt, trayArt, dishArt }) {
  const R = kit.room;
  // (the stage's own clock, through the scene's lifetime)
  let life = null;
  const wait = (ms) => life.wait(ms);
  // the thanks and the goodbye are known from the round's start: their clips are decoded long before they are said
  say.warm(kit.lines.thanks);
  say.warm(kit.lines.goodbye);
  let room = null;
  let trays = [];
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
  function* line(e) {
    const l = say.line(e.line);
    // (in its .text, so the gold underline shows while it is said)
    room.bubble(e.seat, `<span class="text">${lineHtml(l)}</span>`, "warm");
    room.reading(true);
    const quiet = Math.max(kit.order.silentMin, Math.min(kit.order.silentMax, kit.order.silentBase + kit.order.silentPerLetter * l.text.length));
    // they talk while the line is said, and stop as it ends (the room's), or as the scene's lifetime does
    yield room.says(e.seat, Promise.all([Promise.race([say.speak(l), wait(quiet + R.voiceCapMs)]), wait(l.plan.some((c) => c.file) ? kit.order.minHoldMs : quiet)]));
    room.reading(false);
    // their line said, the bubble goes and they rest a beat in their happy pose, a hand raised, before the next line
    room.mood(e.seat, "happy");
    room.bubble(null);
    yield wait(R.talk.afterMs);
    send({ type: "said" });
  }
  function* land(seat) {
    const t = trays[seat];
    const d = (t.dish = stage.picture(stage.layer("room", "things"), dishArt, { x: t.x, y: t.y - R.tray.dishDrop, origin: [0.5, 1], w: t.w * R.tray.dish, alpha: 0 }));
    yield life.tween(d.obj, { y: t.y, alpha: 1 }, R.tray.dishMs, "cubicOut");
    ui.sounds.play("pop");
    yield wait(R.tray.between);
    send({ type: "landed" });
  }
  /** The serve drawn: a beat, the curtain, the room with Nani, then a tray under each person (a task of the scene's lifetime). */
  function* drawn(round) {
    // a beat with nothing happening, then the cooking view fades out and the kitchen fades in
    yield wait(R.serveWait);
    const curtain = yield stage.curtain(R.fadeMs);
    yield wait(R.cutGap);
    // everyone is back where they ordered from; three people spread out to the right of Nani
    const n = round.people.length;
    const spread = (i) => R.naniX + R.serveSpread[0] + ((stage.sheet.w - R.serveSpread[1] - R.naniX - R.serveSpread[0]) * i) / (n - 1);
    const standing = n > 2 ? round.people.map((p, i) => ({ ...p, spot: spread(i) })) : round.people;
    room = createRoom({ stage, kit, roomArt, people, standing, lift: 0, walk: false, nani: true, speech: "line", life });
    ui.room = room;
    // the heads with the speech strip above them, down to the foot of the widest tray's shadow, stay whole at any size, on a
    // resize too; where that cannot fit at the painting's full width the trays stay whole and the people stand lower (the room's)
    stage.keepInView("room", room.headsTop, room.strip(), R.tray.y + (R.tray.h * R.tray.shade) / 2 + R.tray.keepBelow);
    room.fit();
    curtain.lift();
    stage.glide(-R.serveGlide, R.serveGlideMs);
    yield wait(R.tray.fadeAt);
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
    life.onResize(layTrays);
    yield wait(R.serveGlideMs - R.tray.fadeAt);
    room.nani("happy");
  }
  return {
    pictures: (round) => roomRefs({ roomArt, people, standing: round.people, nani: true }).concat(trayArt, dishArt),
    enter(state, round, lifetime) {
      life = lifetime;
      return life.go(drawn(round));
    },
    /** For the checks: the heads, and each tray with its person's face label. */
    probe() {
      if (!room) return [];
      const B = (kind, id, x, y, w, h, more) => ({ kind, id, ...stage.pageRect("room", { x: x - w / 2, y: y - h / 2, w, h }), ...more });
      return room.probe().concat(trays.flatMap((t, i) => [B("tray", i, t.x, R.tray.y, t.w, t.h, { stands: true }), B("label", i, t.faceAt.x, t.faceAt.y, R.tray.face, R.tray.face, { on: "tray" })]));
    },
    // (each dish lands on its own, as the rules say: the first as the serve opens, with Nani and the trays in place)
    on(events) {
      for (const e of events) {
        if (e.type === "land") life.go(land(e.seat));
        else if (e.type === "line") life.go(line(e));
      }
    },
    // (no one talks on as they walk off: every talk has ended with the scene's lifetime)
    async leave() {
      room.bubble(null);
      await room.walkOff();
    },
  };
}

/** The end: two pages on one card, the badges and then the order's words; no verdict. */
export function endView({ stage, say, kit, ui, send, endArt }) {
  let screen = null;
  return {
    pictures: () => Object.values(endArt).flatMap((v) => (typeof v === "string" ? v : Object.values(v))),
    enter(state, round, life) {
      ui.nani.line(null);
      // one tile per thing and number the order used, in the form it was said: the dish first, then each row the end lists
      // (listedRows, the rows the tick tile counts) in turn
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
      for (const p of round.order.for) {
        add(say.line(p.headline.meaning, { register: p.headline.register }), true, true);
        listedRows(kit, p).forEach((it) => add(say.line(it.meaning, { row: true }), !!rightFirst(round.touches, { who: p.who, key: it.word, filler: it.id })));
      }
      screen = createEndScreen({ stage, kit, say, sounds: ui.sounds, endArt, state, words, life, onNext: () => send({ type: "next" }), onAgain: () => send({ type: "again" }), onLeave: () => send({ type: "leave" }) });
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
