/*
 * The order scene's drawing. Each person says their order part by part; as a part is said its bubble shows over their
 * head and its big card pops, then flies whole into its slot on their card. Said before shown: nothing of an order
 * appears until a voice says it. A tap on the kitchen skips the rest; a tap on a face says that card again.
 *   meet(key): what the child has now met, kept for good at once (the first-time lesson, as it plays)
 */
import { createRoom, roomKey, roomRefs } from "../kit/people.js";
import { lineHtml } from "../kit/nani-box.js";
import { atLevel } from "../round.js";
import { wordStage } from "../progress.js";

export function orderView({ stage, say, kit, people, ui, send, roomArt, picOf, meet = null }) {
  const O = kit.order;
  let room = null;
  let big = null;
  // the scene's lifetime (the runner's): a part still being said when the order is skipped, or closed, stops where it is
  let life = null;
  let saying = null; // the part being said now: its bubble's seat and words, to place them again at a new size
  // (the stage's own clock, through the scene's lifetime: it stands still while the round is held behind the turn card)
  const wait = (ms) => life.wait(ms);

  /** The least time a big card is held: by how well the child knows its word (the kit's words.holdMs). */
  const holdOf = (round, word) => wait(kit.words.holdMs[wordStage(round, word)]);

  /**
   * One part: its bubble and its voice start together; its card pops as the line's first word is really heard (or when the
   * line ends unheard, a line with no voice at once), is held for its word's time and the line together, and flies as both
   * are over. At the levels that show it, the dish's own card comes first, as any item card does but on the dish's own
   * word, held by that word's time and the line, then goes where it stands: one big card at a time, so a headline's own
   * item card pops only after it. A task of the scene's lifetime: each yield waits, and the scene's end stops it there.
   */
  function* sayPart(e, round) {
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
    room.reading(true);
    let wasHeard = false;
    let heardIt = null;
    const heard = new Promise((res) => (heardIt = res));
    let dishIt = null;
    const dishHeard = new Promise((res) => (dishIt = res));
    const dishEntry = e.dishCard && person.dishWord ? say.entry(person.dishWord) : null;
    const dishSaid = !!dishEntry && line.tokens.some((tk) => tk.word === dishEntry.id);
    // past the dish card's levels, a thing the opening sentence names pops on its own word, as the dish card does, and is
    // held its own time, not the sentence's (Zafar, 21 Nov: "arriving when the word ... is spoken and lasting the same time
    // as the other item cards")
    const named = head && !e.dishCard && part.lands[0] ? person.items.find((i) => i.id === part.lands[0]) : null;
    const namedEntry = named ? say.entry(named.word) : null;
    const namedSaid = !!namedEntry && line.tokens.some((tk) => tk.word === namedEntry.id);
    // heard: a clip of the line really started (never a clip that failed to load, a piece with no voice, a sound asleep)
    const spoken = say.speak(line, { onHeard: () => ((wasHeard = true), heardIt()), onWord: dishSaid ? { word: dishEntry.id, then: dishIt } : namedSaid ? { word: namedEntry.id, then: dishIt } : null }).then(() => room.reading(false));
    // a line no voice says is still given its time to be read, so a silent order is never hurried
    const quiet = Math.max(O.silentMin, Math.min(O.silentMax, O.silentBase + O.silentPerLetter * line.text.length)) * O.quietShare;
    const readTime = wait(quiet);
    const said = Promise.race([spoken.then(() => (wasHeard ? null : readTime)), wait(quiet + O.voiceCapMs)]);
    // the person talks for as long as their line is said, whatever its cards do meanwhile (held, a lesson, a flight): the
    // room's to end, and its talk ends with the scene's lifetime too, skipped or over
    room.says(e.seat, said);
    // (a clip still loading is waited for as long as the player itself waits for it: the card never pops before the word)
    yield Promise.race([heard, spoken, wait(kit.voice.loadMs)]);
    if (e.dishCard) {
      // (a line heard waits for its dish word; a line no voice says shows it as its other cards would show)
      if (wasHeard && dishSaid) yield Promise.race([dishHeard, spoken]);
      const dishCard = ui.cards.pop(e.seat, null, { line: say.line(person.dishCard, { row: true }), pic: picOf("dish", person) });
      yield Promise.all([holdOf(round, person.dishWord), said]);
      const gone = dishCard.out();
      if (part.lands.length) yield gone;
    }
    const landing = part.lands[0];
    // (a line heard waits for the named thing's own word)
    if (landing && named && wasHeard && namedSaid) yield Promise.race([dishHeard, spoken]);
    if (landing) {
      if (head) ui.cards.open(e.seat);
      // (a headline that names a thing lands it as an item's line does: the place before what lands at the row's left)
      ui.cards.lead(e.seat, part.lands);
      big = ui.cards.pop(e.seat, landing);
    }
    // (a part with no card of its own waits only for its line)
    yield Promise.all([landing ? holdOf(round, person.items.find((i) => i.id === landing).word) : null, named ? null : said]);
    if (big) {
      // the first card that hides a part: the order waits while the child taps each hidden part open; it is met for good
      // the moment it plays, so a round left early never shows it again
      if (e.lesson) {
        if (meet) meet(e.lesson);
        yield big.lesson();
        send({ type: "lessoned" });
      }
      yield big.fly();
      big = null;
    }
    // (the rest of the sentence after the named thing's card has gone)
    if (named) yield said;
    if (head && !landing) {
      yield wait(O.partGap);
      ui.cards.open(e.seat);
      yield wait(O.cardOpen);
    } else yield wait(O.partGap);
    send({ type: "said" });
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
    enter(state, round, lifetime) {
      life = lifetime;
      ui.cards.seats.forEach((s, i) => (s.el.hidden = true));
      // after a greeting the same people are already at the counter: they stay, and never walk in again (the round is a
      // new object after every scene, so the room is known by who stands in it)
      const lift = atLevel(kit.room.liftByPeople, round.people.length);
      const here = !!ui.room && ui.room.key === roomKey(round.people, lift) && stage.showing() === "room";
      room = here ? ui.room : createRoom({ stage, kit, roomArt, people, standing: round.people, lift, life });
      if (here) room.keptBy(life);
      ui.room = room;
      life.onResize(relayout);
      stage.uncover();
      life.onTap({ view: "room", x: -kit.room.far, y: -kit.room.far, w: 2 * kit.room.far + stage.sheet.w, h: 2 * kit.room.far + stage.sheet.h }, () => send({ type: "skip" }));
      return life.go(function* () {
        if (!here) {
          yield room.walkIn();
          yield wait(O.walkWait - O.walkIn);
        }
      });
    },
    // (nothing of the order is said until the room is drawn: a skip while the people walk in ends it before it is heard)
    on(events, state, round) {
      for (const e of events) {
        if (e.type === "part") life.go(sayPart(e, round));
        else if (e.type === "landed") ui.cards.land(e.seat, e.items);
        else if (e.type === "person" && e.seat > 0) ui.cards.fold(e.seat - 1);
        else if (e.type === "repeat") {
          const seat = round.order.for.findIndex((p) => p.who === e.who);
          const p = round.order.for[seat];
          ui.cards.replay(seat, e.dishCard ? { line: say.line(p.dishCard, { row: true }), pic: picOf("dish", p) } : null);
        }
        // (a skip ends the scene: its voice, every talk with it, ends with the scene's lifetime)
      }
    },
    probe: () => (room ? room.probe() : []),
    // (its closing's own lifetime: the cards are let land before the next scene)
    async leave(state, round, closing) {
      saying = null;
      if (big) big.remove();
      big = null;
      document.querySelectorAll("#over .pop, body > .pop").forEach((el) => el.remove());
      room.bubble(null);
      ui.cards.landAll();
      await closing.wait(O.holdAlong);
    },
  };
}
