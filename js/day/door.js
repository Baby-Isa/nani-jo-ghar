/*
 * The morning door (Zafar, 19 Oct; docs/game-design/story-and-arcs.md Part 1 "The door, 19 Oct"): the day starts at Nani's door.
 * The sky shows the day's weather over the one fixed house; Nani says the weather word alone, then in a sentence with a
 * gesture, then the day as short lines, IN TURN (each starts only when the one before has been said, on the one voice queue),
 * each line's Kutchi with its English written beneath (rule 5's door exception). A thought bubble shows the day's place; the
 * child answers Ha! and the day's activity starts: Cook, the clinic's own entry, or a trip (the window ride).
 * Every line is an engine meaning from data/day.json; what the engine can't say yet is its English in grey italic, to record.
 *
 *   await runDoor(el, api, day) -> {next: "window"} | {next: "handoff", url}
 */
import { paintScene, shapes } from "./sky.js";

/** Nani standing in the scene: her picture's feet on the base line at x (scene px), her height h; returns the picture. */
export function naniFigure(scn, N, url) {
  const wrap = document.createElement("div");
  wrap.className = "day-nani-wrap";
  Object.assign(wrap.style, { left: `${N.x}px`, top: `${N.base - N.h}px`, height: `${N.h}px` });
  // her contact shadow under her feet, whatever the weather (ART-06: nothing floats)
  const contact = document.createElement("i");
  contact.className = "day-contact";
  wrap.appendChild(contact);
  const nani = document.createElement("img");
  nani.className = "day-nani";
  nani.alt = "";
  nani.src = url(N.art);
  wrap.appendChild(nani);
  scn.figs.appendChild(wrap);
  return nani;
}

export async function runDoor(el, api, day) {
  const { data, url } = api;
  const W = data.weather[day.weather] || data.weather.sunny;
  const act = data.activities[day.activity] || data.activities.kitchen;
  const trip = day.activity === "trip" ? data.trips[day.trip] : null;
  api.test.state("day/door");
  api.test.expect(() => ({ kind: "wait" }));
  window.Day.stage = "door";

  const root = document.createElement("div");
  root.className = "day-root day-door";
  root.dataset.weather = day.weather;
  root.dataset.activity = day.activity;
  el.appendChild(root);
  const scn = paintScene(root, { scene: data.scene, weather: W, url, speed: () => api.speed });

  // Nani at her door, standing on the step (her picture's feet on the scene's base line)
  const nani = naniFigure(scn, data.scene.nani, url);

  // the thought bubble of the day's place: its picture, or its placeholder shapes (no text)
  const T = data.scene.thought;
  const thought = document.createElement("div");
  thought.className = "day-thought";
  Object.assign(thought.style, { left: `${T.x}px`, top: `${T.y}px`, width: `${T.w}px`, height: `${T.h}px` });
  const tdef = (trip && trip.thought) || act.thought || {};
  if (tdef.art) {
    const im = document.createElement("img");
    im.alt = "";
    im.src = url(tdef.art);
    thought.appendChild(im);
  } else thought.appendChild(shapes(tdef.shapes || [], 260, 200));
  for (let i = 0; i < 2; i++) {
    const dot = document.createElement("i");
    dot.className = `day-thought-dot d${i}`;
    thought.appendChild(dot);
  }
  scn.box.appendChild(thought);

  // the lines' card, top left: each line appears as it is said, Kutchi with its English beneath
  const card = document.createElement("div");
  card.className = "day-lines";
  root.appendChild(card);

  // the lines in their order: the weather word, the weather sentence (with her gesture), then the day's own lines
  const defs = [];
  if (W.word) defs.push({ ...W.word, gesture: W.gesture, kind: "weather-word" });
  if (W.sentence) defs.push({ ...W.sentence, gesture: W.gesture, kind: "weather-sentence" });
  ((trip && trip.lines) || act.lines || []).forEach((l) => defs.push({ ...l, kind: "day" }));
  const lines = defs.map((d) => ({ ...api.line(d), d }));
  window.Day.doorLines = lines.map((l) => ({ text: l.text, ok: l.ok, en: l.en, kind: l.d.kind }));

  // the child's answer, Ha!, shown when Nani asks (the last line starts): input is never held back for her voice
  const yes = api.line(data.door.yes);
  let answered = false;
  let resolveAnswer;
  const answer = new Promise((r) => (resolveAnswer = r));
  const pills = document.createElement("div");
  pills.className = "day-answer";
  root.appendChild(pills);
  const showYes = () => {
    if (pills.childElementCount) return;
    const B = window.NjgButtons;
    const node = api.render(yes, { cls: "day-yes-word" });
    const pick = () => {
      if (answered) return;
      answered = true;
      resolveAnswer();
    };
    if (B && B.pills) B.pills(pills, [{ id: "yes", node }], pick, { cls: "day-yes" });
    else {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "day-yes";
      b.appendChild(node);
      b.addEventListener("click", pick);
      pills.appendChild(b);
    }
    pills.classList.add("in");
    api.test.expect(() => (answered ? { kind: "wait" } : { kind: "tap", sel: ".day-answer button" }));
  };

  const talk = window.Lifecycle && window.Lifecycle.talk && window.Lifecycle.talk.dom ? window.Lifecycle.talk : null;
  await api.wait(500); // a moment of quiet first (E27)
  for (let i = 0; i < lines.length && !answered; i++) {
    const ln = lines[i];
    const row = api.render(ln, { english: true });
    row.dataset.kind = ln.d.kind;
    card.appendChild(row);
    card.querySelectorAll(".day-line").forEach((r) => r.classList.toggle("past", r !== row));
    if (ln.d.thought) thought.classList.add("in");
    if (ln.d.gesture && ln.d.kind === "weather-sentence") {
      nani.dataset.gesture = ln.d.gesture;
      nani.classList.add("gesture");
    }
    if (i === lines.length - 1) showYes();
    const stopTalk = talk ? talk.dom(nani) : null;
    await api.say(ln, { el: row, who: "nani" });
    if (typeof stopTalk === "function") stopTalk();
    nani.classList.remove("gesture");
    if (i < lines.length - 1) await api.wait(data.door.gapMs || 450);
  }
  showYes();
  await answer;
  pills.querySelectorAll("button").forEach((b) => b.classList.add("chosen"));
  // the child's own Ha!, heard
  await api.say(yes, { who: "child", min: false });
  thought.classList.add("go");
  api.setToday({ date: new Date().toISOString().slice(0, 10), day: day.id, weather: day.weather, activity: day.activity, trip: day.trip || null, at: "activity" });
  api.test.expect(() => ({ kind: "end" }));
  await api.wait(700);
  scn.stop();
  if (day.activity === "trip") return { next: "window" };
  const to = act.go;
  api.go(to);
  root.dataset.handoff = to;
  if (api.nonav) {
    const note = document.createElement("p");
    note.className = "day-lab-note";
    note.dataset.grown = "";
    note.textContent = `Hand-off: ${to}`;
    root.appendChild(note);
  }
  return { next: "handoff", url: to };
}
