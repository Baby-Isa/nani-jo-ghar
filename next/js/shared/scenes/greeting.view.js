/*
 * The greeting's drawing. The person's line shows in a bubble over their head with their face, a button to hear it
 * again and a button to pass; the child's two answers rise along the bottom, each with its own button to hear it.
 * A right answer flies up to the bubble and the person is pleased; a wrong one only shakes. Answered or not, the person's
 * reply is said and they are pleased, then the answers go: the scene's own steps, so its closing only tidies.
 */
import { createRoom, roomRefs } from "../kit/people.js";
import { lineHtml } from "../kit/nani-box.js";
import { atLevel } from "../round.js";

export function greetingView({ stage, say, kit, people, ui, send, roomArt }) {
  const K = kit.greeting;
  // (the stage's own clock, through the scene's lifetime: it stands still while the round is held behind the turn card)
  let life = null;
  const wait = (ms) => life.wait(ms);
  // the asking (the ask said and the answers rising, a wrong answer's wobble), a part of the scene's lifetime: the reply
  // ends it where it was, its voice with it
  let asking = null;
  // the greeting's lines are few and known from the round's start: their clips are decoded long before they are said
  Object.values(kit.greetings).forEach((g) => g && g.meaning && say.warm(g.meaning));
  let room = null;
  let bubble = null;
  let row = null;
  const lines = {};

  const quietMs = (line) => K.silentBase + K.silentPerLetter * line.text.length;
  /** A line is said if it has a recording; if not, its bubble is simply held a reading's length (the reply). */
  const sayOr = (line) => (line.plan.some((c) => c.file) ? say.speak(line) : wait(quietMs(line)));

  /** The person asks, and the answers rise: a task of the asking, so an answer stops it where it is. */
  function* ask(state) {
    bubble.classList.add("speaking");
    yield say.speak(lines.ask);
    bubble.classList.remove("speaking");
    yield wait(K.afterClipMs);
    row.classList.add("up");
  }

  /** The person's reply, said whether or not the child answered, and their pleased beat; then the answers go. */
  function* reply(state) {
    asking.end();
    bubble.classList.remove("speaking", "wobble");
    const line = lines[state.right];
    if (!state.answered) bubble.querySelector(".text").innerHTML = lineHtml(line);
    yield sayOr(line);
    room.mood(0, "happy");
    yield wait(K.afterReplyMs);
    row.classList.remove("up");
    yield wait(K.fadeMs);
    send({ type: "said" });
  }

  return {
    pictures: (round) => roomRefs({ roomArt, people, standing: round.people }),
    enter(state, round, lifetime) {
      life = lifetime;
      asking = life.child();
      asking.onEnd(() => say.stop());
      return life.go(function* () {
        room = createRoom({ stage, kit, roomArt, people, standing: round.people, lift: atLevel(kit.room.liftByPeople, round.people.length), life });
        ui.room = room;
        ui.cards.seats.forEach((s) => (s.el.hidden = true));
        stage.uncover();
        yield room.walkIn();
        yield wait(kit.order.walkWait - kit.order.walkIn);
        lines.ask = say.line(kit.greetings[state.line].meaning);
        const face = stage.art.file(people[state.who].face);
        room.bubble(0, `<button class="say round" data-act="again"></button><span class="face" style="background-image:url(${face})"></span><span class="text">${lineHtml(lines.ask)}</span><button class="round pass" data-act="skip">${K.passGlyph}</button>`, "greet");
        bubble = stage.el.over.querySelector(".bubble");
        bubble.dataset.ownTaps = "1";
        bubble.querySelector("[data-act=again]").addEventListener("click", () => (send({ type: "hear", what: "ask" }), say.speak(lines.ask)));
        bubble.querySelector("[data-act=skip]").addEventListener("click", () => send({ type: "skip" }));
        row = document.createElement("div");
        row.className = "replies";
        row.dataset.ownTaps = "1";
        for (const opt of state.options) {
          const o = kit.greetings[opt];
          lines[opt] = say.line(o.meaning);
          const wrap = document.createElement("div");
          wrap.className = "reply-wrap";
          wrap.innerHTML = `<button class="round hear" aria-label="Hear it"></button><button class="reply${state.lit && opt === state.right ? " lit" : ""}" data-choice="${opt}"><span class="emoji">${o.emoji}</span><span>${lineHtml(lines[opt])}</span></button>`;
          wrap.querySelector(".hear").addEventListener("click", () => (send({ type: "hear", what: opt }), sayOr(lines[opt])));
          wrap.querySelector(".reply").addEventListener("click", () => send({ type: "answer", choice: opt }));
          row.appendChild(wrap);
        }
        stage.el.over.appendChild(row);
      });
    },
    on(events, state) {
      for (const e of events) {
        const b = row && row.querySelector(`[data-choice="${e.choice}"]`);
        if (e.type === "ask") asking.go(ask(state));
        else if (e.type === "wrong-answer" && b) {
          b.classList.remove("shake");
          void b.offsetWidth;
          b.classList.add("shake");
          bubble.classList.add("wobble");
          asking.wait(K.wrongPauseMs).then(() => (bubble.classList.remove("wobble"), asking.go(ask(state))));
          if (e.light) row.querySelector(`[data-choice="${state.right}"]`).classList.add("lit");
        } else if (e.type === "answered" && b) b.classList.add("chosen");
        else if (e.type === "modelled" && b) b.classList.add("lit");
        else if (e.type === "reply") life.go(reply(state));
      }
    },
    leave() {
      if (row) row.remove();
      if (!room) return;
      room.bubble(null);
      room.mood(0, "neutral");
    },
    probe: () => (room ? room.probe() : []),
  };
}
