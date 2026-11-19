/*
 * The order scene's drawing. Each person says their order part by part; as a part is said its bubble shows over their
 * head and its big card pops, then flies whole into its slot on their card. Said before shown: nothing of an order
 * appears until a voice says it. A tap on the kitchen skips the rest; a tap on a face says that card again.
 */
import { createRoom, roomKey, roomRefs } from "../kit/people.js";
import { lineHtml } from "../kit/nani-box.js";
import { atLevel } from "../round.js";
import { wordStage } from "../progress.js";

export function orderView({ stage, say, kit, people, ui, send, roomArt, picOf }) {
  const O = kit.order;
  let room = null;
  let big = null;
  let live = true; // (a part still being said when the order is skipped, or closed, stops where it is)
  let offTap = null;
  let offResize = null;
  let saying = null; // the part being said now: its bubble's seat and words, to place them again at a new size
  // (the stage's own clock: it stands still while the round is held behind the turn card)
  const wait = (ms) => stage.wait(ms);

  /**
   * One part: its bubble and its voice start together; its card pops as the line's first word is really heard (or when the
   * line ends unheard, a line with no voice at once), is held for its word's time and the line together, and flies as both are over.
   */
  async function sayPart(e, round) {
    const person = round.order.for[e.seat];
    const part = e.part;
    const head = part.kind === "headline";
    const line = head ? ui.cards.headOf(e.seat) : ui.cards.lineOf(e.seat, part.item);
    const mark = e.last ? "." : ",";
    const html = lineHtml(line, ui.itemWords).replace(/[.!?]$/, "") + mark;
    ui.cards.show(e.seat);
    ui.cards.focus(e.seat);
    // the bubble where it would sit; the big card sized to leave it room; then the bubble beside the card
    room.bubble(e.seat, html);
    const card = ui.cards.bigPlace(room.probe().filter((p) => p.kind === "head"), room.bubbleBox());
    room.bubble(e.seat, html, "", { ...card, gap: O.bubbleGap });
    saying = { seat: e.seat };
    room.talk(e.seat, true);
    room.reading(true);
    let wasHeard = false;
    let heardIt = null;
    const heard = new Promise((res) => (heardIt = res));
    // heard: a clip of the line really started (never a clip that failed to load, a piece with no voice, a sound asleep)
    const spoken = say.speak(line, { onHeard: () => ((wasHeard = true), heardIt()) }).then(() => room.reading(false));
    // a line no voice says is still given its time to be read, so a silent order is never hurried
    const quiet = Math.max(O.silentMin, Math.min(O.silentMax, O.silentBase + O.silentPerLetter * line.text.length)) * O.quietShare;
    const readTime = wait(quiet);
    const said = Promise.race([spoken.then(() => (wasHeard ? null : readTime)), wait(quiet + O.voiceCapMs)]);
    // (a clip still loading is waited for as long as the player itself waits for it: the card never pops before the word)
    await Promise.race([heard, spoken, wait(kit.voice.loadMs)]);
    if (!live) return;
    let dishCard = null;
    if (e.dishCard) dishCard = ui.cards.pop(e.seat, null, { line: say.line(person.dishCard, { row: true }), pic: picOf("dish", person) });
    const landing = part.lands[0];
    if (landing) {
      if (head) ui.cards.open(e.seat);
      // (a headline that names a thing lands it as an item's line does: the place before what lands at the row's left)
      ui.cards.lead(e.seat, part.lands);
      big = ui.cards.pop(e.seat, landing);
    }
    const word = landing ? person.items.find((i) => i.id === landing).word : person.items[0].word;
    await Promise.all([wait(kit.words.holdMs[wordStage(round.ladder, word, kit.ladder)]), said]);
    room.talk(e.seat, false);
    if (!live) return;
    if (dishCard) dishCard.out();
    if (big) {
      // the first card with a hidden part: the order waits while the child taps each part open
      if (e.lesson) {
        await big.lesson();
        if (!live) return;
        send({ type: "lessoned" });
      }
      await big.fly();
      big = null;
    }
    if (!live) return;
    if (head && !landing) {
      await wait(O.partGap);
      ui.cards.open(e.seat);
      await wait(O.cardOpen);
    } else await wait(O.partGap);
    if (live) send({ type: "said" });
  }

  /** A new size of the play area: the big card's place is worked out again, and the bubble placed beside it. */
  function relayout() {
    if (!room || !saying) return;
    room.placeBubble(null);
    const card = ui.cards.bigPlace(room.probe().filter((p) => p.kind === "head"), room.bubbleBox(), { again: true });
    room.placeBubble({ ...card, gap: O.bubbleGap });
  }

  return {
    /** The room and every picture its cards will show, all of it before the first card pops. */
    pictures: (round) => roomRefs({ roomArt, people, standing: round.people }).concat(round.order.for.flatMap((p) => p.items.map((i) => picOf(i, p)).concat(picOf("dish", p), people[p.who].face))),
    async enter(state, round) {
      ui.cards.seats.forEach((s, i) => (s.el.hidden = true));
      // after a greeting the same people are already at the counter: they stay, and never walk in again (the round is a
      // new object after every scene, so the room is known by who stands in it)
      const lift = atLevel(kit.room.liftByPeople, round.people.length);
      const here = !!ui.room && ui.room.key === roomKey(round.people, lift) && stage.showing() === "room";
      room = here ? ui.room : createRoom({ stage, kit, roomArt, people, standing: round.people, lift });
      ui.room = room;
      offResize = stage.onResize(relayout, "room");
      stage.uncover();
      offTap = stage.onTap({ view: "room", x: -kit.room.far, y: -kit.room.far, w: 2 * kit.room.far + stage.sheet.w, h: 2 * kit.room.far + stage.sheet.h }, () => live && send({ type: "skip" }));
      if (!here) {
        await room.walkIn();
        await wait(O.walkWait - O.walkIn);
      }
    },
    // (nothing of the order is said until the room is drawn: a skip while the people walk in ends it before it is heard)
    on(events, state, round) {
      for (const e of events) {
        if (e.type === "part") sayPart(e, round);
        else if (e.type === "landed") ui.cards.land(e.seat, e.items);
        else if (e.type === "person" && e.seat > 0) ui.cards.fold(e.seat - 1);
        else if (e.type === "repeat") {
          const seat = round.order.for.findIndex((p) => p.who === e.who);
          const p = round.order.for[seat];
          ui.cards.replay(seat, e.dishCard ? { line: say.line(p.dishCard, { row: true }), pic: picOf("dish", p) } : null);
        }
        else if (e.type === "skipped") {
          live = false;
          say.stop();
        }
      }
    },
    probe: () => (room ? room.probe() : []),
    async leave() {
      live = false;
      if (offTap) offTap();
      if (offResize) offResize();
      saying = null;
      if (big) big.remove();
      big = null;
      document.querySelectorAll("#over .pop, body > .pop").forEach((el) => el.remove());
      room.bubble(null);
      ui.cards.landAll();
      await wait(O.holdAlong);
    },
  };
}
