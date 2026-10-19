/*
 * The window ride on a trip day (js/shared/window-ride.js, the clinic's belt over a scrolling view; data/day.json window.rides).
 * The shared frame: Nani's guide box at the top of the sidebar (her face = replay, her call written as she says it, the bulb),
 * the card of what we'll see under it (the things' words, each ticked when spotted), the play area the view out of the window.
 * The request pop-up opens first and reads the card out (decision 53), folds into the sidebar, then the car goes: Nani asks
 * "Where is the dog?" (an engine sentence) as each group of look-alikes comes by, and the child taps it as it passes.
 * Each thing spotted is a `saw` line in the day log (the evening book's "spotted" page).
 *
 *   await runWindow(el, api, day) -> the ride's result {right, helped, missed, calls, won, hints}
 */
import { paintSky } from "./sky.js";

export async function runWindow(el, api, day) {
  const { data, url, core } = api;
  const trip = data.trips[day.trip] || data.trips[Object.keys(data.trips)[0]];
  const ride = data.window.rides[(trip && trip.ride) || Object.keys(data.window.rides)[0]];
  const level = Number(api.q.get("level")) || 1;
  const WR = window.WindowRide;
  api.test.state("day/window/intro");
  api.test.expect(() => ({ kind: "wait" }));
  window.Day.stage = "window";

  // the things as the engine says them: a thing it can't say yet is never named (it may pass as scenery)
  const meaningOf = (t) => (typeof t.say === "string" ? { fn: "Item", kind: t.say } : t.say);
  const callable = (id) => {
    const t = ride.things[id];
    try {
      return !!t && api.E.check(meaningOf(t)).ok;
    } catch (e) {
      return false;
    }
  };
  Object.keys(ride.things).forEach((id) => !callable(id) && api.gaps.push({ en: id, meaning: meaningOf(ride.things[id]), gaps: ["never named: the engine can't say it yet"] }));
  const plan = WR.plan(ride, level, api.rng, { callable });
  const words = plan.calls.map((c) => api.line({ meaning: meaningOf(ride.things[c.named]), en: c.named }));
  // Nani's call: the ride's frame (data: "Where is {thing}?") around the thing, built by the engine
  const callOf = (thing) => Object.assign({ fn: (ride.call && ride.call.fn) || "Where" }, { [(ride.call && ride.call.arg) || "thing"]: thing });
  const asks = plan.calls.map((c) => api.line({ meaning: callOf(meaningOf(ride.things[c.named])), en: `Where is the ${c.named}?` }));
  const head = ride.headline ? api.line(ride.headline) : null;
  window.Day.ride = { plan, level };

  // ---- the frame: sidebar (guide, card) and the play area ----
  const root = document.createElement("div");
  root.className = "day-root day-window";
  el.appendChild(root);
  const side = document.createElement("aside");
  side.className = "day-side";
  const play = document.createElement("main");
  play.className = "day-play";
  root.append(side, play);
  if (window.Frame && window.Frame.mount) window.Frame.mount({ app: root, side, play });
  const guideEl = document.createElement("div");
  side.appendChild(guideEl);
  const cardBox = document.createElement("section");
  cardBox.className = "day-card";
  side.appendChild(cardBox);

  let current = -1;
  let hints = 0;
  let bulbOn = false;
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
          if (current < 0 || bulbOn) return;
          hints++;
          bulbOn = true;
          guide.set(`<span class="bulb-en" data-bulb-en>${api.esc(asks[current].en)}</span>`);
          setTimeout(() => {
            bulbOn = false;
            showCall(current);
          }, 5000 / api.speed);
        },
      })
    : null;
  const html = (ln) => {
    const n = api.render(ln, { cls: "day-inline" });
    return n.innerHTML;
  };
  const showCall = (i) => {
    if (!guide || bulbOn) return;
    if (i < 0) guide.set("");
    else guide.set(html(asks[i]), { rec: !asks[i].ok });
  };

  const done = plan.calls.map(() => false);
  const fold = {};
  const cardData = () => ({
    person: null,
    headline: head ? { html: html(head), rec: !head.ok } : null,
    items: plan.calls.map((c, i) => ({ label: html(words[i]), count: 1, parts: [], done: done[i], key: i })),
  });
  const closed = plan.card === "closed";
  const drawCard = () => {
    if (!window.OrderCard) return;
    window.OrderCard.render(cardBox, [cardData()], { fold, closed, onPeek: () => hints++ });
  };

  // ---- the request pop-up first: the card at full size, read out row by row, then into the sidebar ----
  const LC = window.Lifecycle;
  if (LC && LC.request && window.OrderCard) {
    await LC.request({
      reason: "day:window",
      host: play,
      target: () => cardBox,
      fast: api.speed > 2,
      wait: (ms) => api.wait(ms),
      build(box) {
        box.appendChild(window.OrderCard.card(cardData(), { big: true, closed }));
      },
      read: async () => {
        await api.wait(250);
        if (head) await api.say(head, { who: "nani" });
        for (const w of words) await api.say(w, { who: "nani" });
      },
      onStop: () => core.voice.stop("day"),
    });
  }
  drawCard();
  if (LC && LC.stageStart) LC.stageStart("day:window");

  // ---- the ride ----
  api.test.state("day/window/ride");
  const result = await new Promise((resolve) => {
    const r = WR.mount(play, {
      ride,
      plan,
      url,
      speed: api.speed,
      rng: api.rng,
      hintMs: ride.hintMs,
      sky: (box) => paintSky(box, data.weather[day.weather] || data.weather.sunny, { w: 1600, h: 900, url }),
      say: (i) => {
        current = i;
        showCall(i);
        api.say(asks[i], { who: "nani", min: false });
      },
      sayStop: () => {
        const ln = api.line({ meaning: ride.stopCar.meaning, en: ride.stopCar.en });
        if (guide && !bulbOn) guide.set(html(ln), { rec: !ln.ok });
        return api.say(ln, { who: "nani" }).then(() => current < 0 && showCall(-1));
      },
      onTap: (t) => {
        if (window.Lifecycle && window.Lifecycle.note) window.Lifecycle.note("act", { during: "day:window" });
        void t;
      },
      onResult: (i, outcome) => {
        done[i] = outcome !== "missed";
        drawCard();
        if (window.Lifecycle && window.Lifecycle.note && done[i]) window.Lifecycle.note("step-close", { step: String(i) });
        if (done[i]) core.log.log({ arc: "day", errand: `day${day.id}:window`, type: "saw", what: meaningOf(ride.things[plan.calls[i].named]).kind });
        if (i === current) {
          current = -1;
          showCall(-1);
        }
      },
      onEnd: (res) => resolve(Object.assign(res, { hints: res.hints + hints })),
    });
    api.test.expect(() => r.expect());
    window.Day.rideApi = r;
    r.start();
  });
  window.Day.rideResult = result;
  if (LC && LC.stageEnd) LC.stageEnd("day:window");
  api.test.state("day/window-end");
  api.test.expect(() => ({ kind: "end" }));
  await api.wait(600);
  return result;
}
