/*
 * The window ride on a trip day (js/shared/window-ride.js: the view out of the car's window, the road going by; data/day.json
 * window.rides). The shared frame: Nani's guide box at the top of the sidebar (her face = replay, her call written as she says
 * it, the bulb), the list of what to find under it, the play area the view out of the window.
 *   RIDE-09 (Zafar, 22 Oct: "dive straight into this to save on screens"; "on the left there's the three items you have to find
 *   ... the first item is an expanded tablet, basically like that item card ... when you complete it, it collapses up, just
 *   leaves you with the word ... and the second item expands"): no order pop-up; the list on the left, the one to find now open
 *   as the shared word card (js/shared/word-card.js: its picture, speaker, Kutchi and English, faded by the word's stage) and said
 *   by Nani as it opens, the others as their word; found, it collapses to its word, ticked, and the next opens. Any of them may
 *   be found in any order ("if you're quick and you're clever ... you can just click them all").
 *   RIDE-10 (Zafar, 22 Oct): a new player's first ride shows the first find: the open card in a box (not dimmed, still), the
 *   animal in the view glowing and bouncing, the shared kit's finger tapping it for the child; it ticks off and the next card
 *   opens; the child does the rest.
 * The car goes at once: Nani asks "Where is the dog?" (an engine sentence) as each group of look-alikes comes into view, and the
 * child taps it as it passes; a missed one comes round again until it is found. Between the finds she says speed up or slow down
 * (the level's speeds; engine lines, grey to-record placeholders until Mum records them) and the whole road goes faster or
 * slower. Each thing spotted is a `saw` line in the day log (the evening book's "spotted" page).
 *
 *   await runWindow(el, api, day) -> the ride's result {right, helped, missed, calls, found, won, hints}
 *   ?ride=slow|fast (tests and the lab): Nani's speed held from the ride's start (she says it once, before the first thing)
 */
import { paintSky } from "./sky.js";
import "../shared/word-card.js"; // window.WordCard (a classic script, imported for its side effect)

export async function runWindow(el, api, day) {
  const { data, url, core } = api;
  const trip = data.trips[day.trip] || data.trips[Object.keys(data.trips)[0]];
  const ride = data.window.rides[(trip && trip.ride) || Object.keys(data.window.rides)[0]];
  const level = Number(api.q.get("level")) || 1;
  const hold = /^(slow|normal|fast)$/.test(api.q.get("ride") || "") ? api.q.get("ride") : null;
  const WR = window.WindowRide;
  api.test.state("day/window/intro");
  api.test.expect(() => ({ kind: "wait" }));
  window.Day.stage = "window";

  // the things as the engine says them: a thing it can't say yet is never named (it still passes by, unasked)
  const meaningOf = (t) => (typeof t.say === "string" ? { fn: "Item", kind: t.say } : t.say);
  const enOf = (id) => ride.things[id].en || id;
  const callable = (id) => {
    const t = ride.things[id];
    try {
      return !!t && api.E.check(meaningOf(t)).ok;
    } catch (e) {
      return false;
    }
  };
  Object.keys(ride.things).forEach((id) => !callable(id) && api.gaps.push({ en: enOf(id), meaning: meaningOf(ride.things[id]), gaps: ["unsaid"] }));
  const plan = WR.plan(ride, level, api.rng, { callable });
  const words = plan.calls.map((c) => api.line({ meaning: meaningOf(ride.things[c.named]), en: enOf(c.named) }));
  // Nani's call: the ride's frame (data: "Where is {thing}?") around the thing, built by the engine
  const callOf = (thing) => Object.assign({ fn: (ride.call && ride.call.fn) || "Where" }, { [(ride.call && ride.call.arg) || "thing"]: thing });
  const asks = plan.calls.map((c) => api.line({ meaning: callOf(meaningOf(ride.things[c.named])), en: String((ride.call && ride.call.en) || "{x}").replace("{x}", enOf(c.named)) }));
  const head = ride.headline ? api.line(ride.headline) : null;
  // speed up / slow down (data: the ride's speedLines; the engine's sentence or the grey placeholder)
  const speedLine = {};
  Object.entries(ride.speedLines || {}).forEach(([k, d]) => !k.startsWith("_") && (speedLine[k] = api.line(d)));
  const order = WR.SPEED_ORDER;
  window.Day.ride = { plan, level, hold };

  // ---- the frame: sidebar (guide, card) and the play area ----
  const root = document.createElement("div");
  root.className = "day-root day-window";
  el.appendChild(root);
  const side = document.createElement("aside");
  side.className = "day-side";
  const play = document.createElement("main");
  play.className = "day-play";
  // behind the sidebar: the car's inside runs on under it (window-ride.js draws it there), so the column under the card is the
  // car, never a plain strip; the sidebar is lifted over it (its look unchanged)
  const under = document.createElement("div");
  under.className = "day-car-under";
  Object.assign(under.style, { position: "absolute", left: "0", top: "0", bottom: "0", width: "100%", pointerEvents: "none", overflow: "hidden" });
  root.append(under, side, play);
  Object.assign(side.style, { position: "relative", zIndex: "1" });
  if (window.Frame && window.Frame.mount) window.Frame.mount({ app: root, side, play });
  const guideEl = document.createElement("div");
  side.appendChild(guideEl);
  const cardBox = document.createElement("section");
  cardBox.className = "day-find";
  side.appendChild(cardBox);

  let current = -1;
  let hints = 0;
  let bulbOn = false;
  let speaking = null; // a speed line on show in the guide box
  const G = window.NaniGuide;
  const guide = G
    ? G.mount(guideEl, {
        face: url(data.door.naniFace),
        bulb: url("assets/ui/results/icon-bulb.webp"),
        onReplay: (btn) => {
          if (current < 0) return;
          btn.classList.add("on");
          api.say(asks[current], { who: "nani", min: false }).then(() => btn.classList.remove("on"));
        },
        onBulb: () => {
          // (between groups: the one to find now, the open card's)
          const at = current >= 0 ? current : openAt;
          if (at < 0 || bulbOn) return;
          hints++;
          bulbOn = true;
          guide.set(`<span class="bulb-en" data-bulb-en>${api.esc(asks[at].en)}</span>`);
          setTimeout(() => {
            bulbOn = false;
            showCall(current);
          }, 5000 / api.speed);
        },
      })
    : null;
  // SH-96 (contract-25): the light bulb pulses once the child has done nothing for the guide's BULB_PULSE (15-20 s), as in every game;
  // the slower ride (RIDE-03) leaves long stretches between finds
  // (the page's idle clock: the door starts it, so the child's Ha! is its last action, never the page's load)
  if (G && G.watch) G.watch();
  const bulbT = G
    ? setInterval(() => {
        if (G.watch) G.watch();
        G.pulseBulbs(G.idleMs() >= (G.BULB_PULSE || 17000));
      }, 250)
    : 0;
  const html = (ln) => {
    const n = api.render(ln, { cls: "day-inline" });
    return n.innerHTML;
  };
  const showCall = (i) => {
    if (!guide || bulbOn) return;
    if (speaking && i < 0) return guide.set(html(speaking), { rec: !speaking.ok });
    // nothing asked this moment: her box keeps the question of the one to find now (the open card's), never empty
    const at = i >= 0 ? i : openAt;
    if (at < 0 || !asks[at]) guide.set(head ? html(head) : "", { rec: !!head && !head.ok });
    else guide.set(html(asks[at]), { rec: !asks[at].ok });
    return;
  };

  // ---- the list of what to find (RIDE-09): the one to find now open as the shared word card, the rest their word ----
  const done = plan.calls.map(() => false);
  const closed = plan.card === "closed";
  const WordCard = window.WordCard;
  if (WordCard && WordCard.useCss) WordCard.useCss(url("css/shared/word-card.css"));
  const progress = core && core.progress;
  let openAt = -1; // the list's open card
  let boxed = false; // the first-time help's box round it (RIDE-10)
  // her ride lines in turn: each starts when the one before has been said (one at a time, never two open at once)
  let turn = Promise.resolve();
  const sayInTurn = (ln, o) => (turn = turn.then(() => api.say(ln, o)).catch(() => {}));
  const sayWord = (i, el) => sayInTurn(words[i], { el, who: "nani", min: false });
  const drawCard = () => {
    const next = done.indexOf(false);
    const opened = next !== openAt;
    openAt = next;
    cardBox.innerHTML = "";
    plan.calls.forEach((c, i) => {
      const t = ride.things[c.named] || {};
      if (i === next && WordCard) {
        const line = api.render(words[i], { cls: "day-wline" });
        const card = WordCard.card(
          cardBox,
          {
            id: meaningOf(t).kind || c.named,
            kutchi: line,
            english: words[i].en,
            rec: !words[i].ok,
            picture: t.art ? { src: url(t.art), fit: "contain" } : null,
            say: () => sayWord(i, line),
          },
          // L3 (a closed card): the picture is not on the card, only the word (its free reveal is the card's own)
          { progress, cls: "day-find-card", slots: closed ? { picture: false, english: false, kutchiText: true } : undefined }
        );
        card.dataset.find = String(i);
        card.dataset.thing = c.named;
        if (boxed) card.classList.add("day-help-box");
        // as it opens Nani says its word (the first one after her "Look!")
        if (opened) setTimeout(() => sayWord(i, line), 0);
        return;
      }
      const row = document.createElement("button");
      row.type = "button";
      row.className = `day-find-row${done[i] ? " done" : ""}`;
      row.dataset.find = String(i);
      row.dataset.thing = c.named;
      const w = api.render(words[i], { cls: "day-inline" });
      row.appendChild(w);
      if (done[i]) {
        const tick = document.createElement("i");
        tick.className = "day-find-tick";
        tick.setAttribute("aria-hidden", "true");
        row.appendChild(tick);
      }
      // a word on the list says itself when tapped
      row.addEventListener("click", () => sayWord(i, w));
      cardBox.appendChild(row);
    });
  };

  // ---- the ride's own pictures, fetched while the pop-up reads the card (decision 68: only this ride's, at their drawn size) ----
  const v = ride.view || {};
  const pics = [v.frame && v.frame.art, v.frame && v.frame.left, v.frame && v.frame.right, ...(v.layers || []).map((l) => l.art), ...Object.values(v.props || {}).map((p) => p.art), ...Object.values(ride.things).map((t) => t.art)].filter(Boolean);
  const loaded = Promise.all(
    [...new Set(pics)].map(
      (p) =>
        new Promise((ok) => {
          const im = new Image();
          im.onload = im.onerror = () => (im.decode ? im.decode().catch(() => {}).then(ok) : ok());
          im.src = url(p);
        }),
    ),
  );

  // ---- no order pop-up (RIDE-09): her "Look!" in the guide box, the list with its first card open, and the car goes ----
  const LC = window.Lifecycle;
  // RIDE-10: a new player's first ride shows the first find (the shared kit's finger; once per player)
  const HELP_ID = "day/ride";
  const O = await api.kit().catch(() => null);
  let helping = !!O && api.helpDue(HELP_ID);
  boxed = helping;
  // the view comes on whole (never a half-drawn road): wait for its pictures, at most a moment more
  await Promise.race([loaded, new Promise((r) => setTimeout(r, 2500))]);
  if (head) {
    if (guide) guide.set(html(head), { rec: !head.ok });
    sayInTurn(head, { who: "nani" });
  }
  drawCard();
  if (LC && LC.stageStart) LC.stageStart("day:window");

  // ---- RIDE-10: the first find shown: as Nani asks, the thing glows and bounces, then the kit's finger taps it for the child ----
  let ride0 = null;
  let showing = false;
  const showFind = async (i) => {
    if (showing || !O) return;
    showing = true;
    try {
      await api.wait(700); // her call has begun
      if (!helping || !ride0 || current !== i) return;
      const uid = ride0.help();
      if (uid == null) return;
      if (LC && LC.note) LC.note("help", { during: "day:window", step: String(i) });
      await api.wait(1200); // it glows and bounces a moment first
      if (!helping || current !== i) return;
      const MS = 1400;
      const PRESS = 0.67; // the kit's demo reaches its point two thirds of the way through
      const at = ride0.ahead(uid, MS * PRESS);
      if (!at) return;
      // the finger comes in from below and to the right of where the thing will be, taps it, lifts off
      const start = { x: at.x + Math.min(90, at.w * 0.5), y: Math.min((window.innerHeight || 600) - 24, at.y + Math.min(110, at.h * 0.8)) };
      const pressed = new Promise((ok) => setTimeout(ok, MS * PRESS));
      O.demo(start, [{ x: at.x, y: at.y }], { hand: true, ms: MS, step: "ride-first" });
      await pressed;
      if (helping && current === i) ride0.tap(uid);
    } finally {
      showing = false;
    }
  };

  // ---- the ride ----
  api.test.state("day/window/ride");
  const result = await new Promise((resolve) => {
    const r = WR.mount(play, {
      ride,
      plan,
      url,
      under,
      speed: api.speed,
      rng: api.rng,
      hintMs: ride.hintMs,
      hold,
      sky: (box) => paintSky(box, data.weather[day.weather] || data.weather.sunny, { w: 1600, h: 900, url }),
      say: (i) => {
        current = i;
        speaking = null;
        showCall(i);
        sayInTurn(asks[i], { who: "nani", min: false });
        if (helping) showFind(i);
      },
      // Nani to the driver: faster or slower (the whole road eases to the new speed as she says it)
      saySpeed: (to, from) => {
        const ln = speedLine[order.indexOf(to) > order.indexOf(from) ? "up" : "down"];
        if (!ln) return;
        speaking = ln;
        if (current < 0) showCall(-1);
        sayInTurn(ln, { who: "nani" }).then(() => {
          if (speaking === ln) speaking = null;
          if (current < 0) showCall(-1);
        });
      },
      onPass: (i) => {
        // gone by unfound: it comes round again (her call shows again when it does)
        if (i === current) {
          current = -1;
          showCall(-1);
        }
      },
      onTap: () => {
        if (window.Lifecycle && window.Lifecycle.note) window.Lifecycle.note("act", { during: "day:window" });
      },
      onResult: (i, outcome) => {
        done[i] = true;
        if (helping) {
          // the first find shown (or found by the child first): the help is over, the box goes
          helping = false;
          boxed = false;
          api.helped(HELP_ID);
        }
        drawCard();
        if (window.Lifecycle && window.Lifecycle.note) window.Lifecycle.note("step-close", { step: String(i) });
        core.log.log({ arc: "day", errand: `day${day.id}:window`, type: "saw", what: meaningOf(ride.things[plan.calls[i].named]).kind });
        void outcome;
        if (i === current) {
          current = -1;
          showCall(-1);
        }
      },
      onEnd: (res) => resolve(Object.assign(res, { hints: (res.hints || 0) + hints })),
    });
    // (while the help shows the first find, the ride wants nothing of the player: the finger does it)
    api.test.expect(() => (helping ? { kind: "wait", help: true } : r.expect()));
    window.Day.rideApi = r;
    ride0 = r;
    r.start();
  });
  window.Day.rideResult = result;
  clearInterval(bulbT);
  if (G) G.pulseBulbs(false);
  if (LC && LC.stageEnd) LC.stageEnd("day:window");
  api.test.state("day/window-end");
  api.test.expect(() => ({ kind: "end" }));
  await api.wait(600);
  return result;
}
