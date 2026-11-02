/*
 * The wake-up clock (prototype, proto-school 2 Nov 2026; build/reports/designs/wake-up-clock.md §3, its critique).
 *
 * Bedtime at Nani's: three beds side by side, Ali, Nana and Ma asleep (bed order shuffled every round). Nani tells the child
 * each one's hour ("Ali wakes up at six": the engine, its frame to record, the hour in Kutchi where the engine has it); each
 * becomes a row of her order card (the sleeper's face, the hour's word). "Goodnight", the room goes dark, and the big wall clock
 * runs fast through the night, pausing at each hour (the same pause whether anyone is due or not: never a tell).
 *   Tap the sleeper whose hour it is: they sit up (the pose swap), the row ticks (gold at their hour, first tap; plain if late).
 *   A tap on someone whose hour it isn't: a sleepy shake, Nani's "hever na" (not now); nothing marked (an early tap never
 *   spoils them). Late is fine: after their hour a tap wakes them happily (the row ticks plain). Missed: at the end Nani wakes
 *   whoever is still asleep (plain). No timed hints in this game (the design's override: waiting would be the win).
 *   L1  three hours in 5-9, never all adjacent; the bedside alarms show the digits; Nani says each hour at its pause (6 s)
 *   L2  three hours inside a five-hour stretch anywhere in 1-12; the bedside alarms frosted; the hour not said at the pause
 *       (only after a wake: "Get up!"); pause 5 s
 *   L3, L4  as L2 with the design's shorter pauses (4.3 s, 3.7 s). Not built: L3's morning or night, L4's before and after
 *       (the words are not in the engine: to record), the eye on a card, the window toy, Simba on a bed, the chai at the end.
 */
import { FAMILY } from "./art.js";

const stamp = (p) => (typeof window !== "undefined" && typeof window.njgV === "function" ? window.njgV(p) : p);
const WHO = ["ali", "nana", "ma"];
/** The hour's word: one to ten from the engine (num.N; five to ten are drafts, ten suspect); eleven and twelve to record. */
const hourWord = (h) => ({ fn: "Item", kind: h <= 10 ? `num.${h}` : h === 11 ? "n.eleven" : "n.twelve" });

export default async function clock(F) {
  const lv = F.level;
  const pauseMs = F.T([6000, 5000, 4300, 3700][lv - 1]);
  // the hours: L1 three of 5-9, never all three adjacent; L2+ three inside a five-hour stretch anywhere in 1-12
  let hours;
  for (let tries = 0; tries < 50; tries++) {
    const lo = lv === 1 ? 5 : 1 + Math.floor(F.rng() * 8); // (the stretch lo..lo+4 stays inside 1-12)
    const pool = [0, 1, 2, 3, 4].map((k) => lo + k);
    hours = F.shuffle(pool).slice(0, 3).sort((a, b) => a - b);
    if (!(hours[1] === hours[0] + 1 && hours[2] === hours[1] + 1)) break;
  }
  const order = F.shuffle(WHO); // bed order (left to right)
  const timeOf = {};
  F.shuffle(hours).forEach((h, i) => (timeOf[order[i]] = h)); // never tied to bed order
  const first = hours[0];
  const last = hours[2];

  /* ----- the scene: the bedroom at night ----- */
  F.root.classList.add("sp-night");
  F.scene.insertAdjacentHTML(
    "beforeend",
    '<div class="sp-wall"></div><div class="sp-floor"></div><div class="sp-window"><span class="sp-moon"></span><span class="sp-sun"></span></div>'
  );
  const wall = F.put("sp-wallclock", { x: 0.55, y: 0.3, h: 0.17, html: '<span class="sp-digits"></span>' });
  const digits = wall.querySelector(".sp-digits");
  const show = (h, m) => (digits.textContent = `${h}:${String(m).padStart(2, "0")}`);
  const xs = [0.2, 0.5, 0.8];
  const beds = {};
  order.forEach((who, i) => {
    const bed = F.put("sp-bed", { x: xs[i], y: 0.95, h: 0.32, tag: "button", html: '<span class="sp-headboard"></span><span class="sp-pillow"></span><span class="sp-blanket"></span>' });
    bed.setAttribute("aria-label", who);
    const head = document.createElement("img");
    head.className = "sp-sleeper";
    head.alt = "";
    head.src = stamp(FAMILY[who].asleep);
    bed.appendChild(head);
    const alarm = F.put(`sp-alarm${lv >= 2 ? " frosted" : ""}`, { x: xs[i] + 0.1, y: 0.6, h: 0.08, html: `<span>${lv === 1 ? `${timeOf[who]}:00` : ""}</span>` });
    beds[who] = { el: bed, head, alarm, up: false };
  });

  /* ----- her asks: one row each, in bed order (never time order) ----- */
  const rowOf = {};
  order.forEach((who) => {
    const h = timeOf[who];
    rowOf[who] = F.row({
      key: who,
      line: { fn: "WhoWakesUpAtN", who: { fn: "Item", kind: FAMILY[who].lex }, n: hourWord(h) },
      word: hourWord(h),
      picture: (box) => pic(box, who, lv === 1 ? h : null),
      target: () => beds[who].el,
      data: { who, h },
    });
  });

  // (bed taps only count once the clock runs)
  let running = false;
  let hourNow = first - 1;
  const notNow = F.say({ fn: "Say", x: "phrase.not-now" });
  const getUp = F.lineOf("clock-getup");
  function wake(who, { late = false, byNani = false } = {}) {
    const b = beds[who];
    if (b.up) return;
    b.up = true;
    b.head.src = stamp(FAMILY[who].up);
    b.el.classList.add("up");
    F.jiggle(b.el);
    const r = rowOf[who];
    if (late || byNani) r.miss = true;
    F.add(r);
  }
  order.forEach((who) =>
    F.on(beds[who].el, "click", () => {
      F.acted();
      const b = beds[who];
      if (!running || b.up) return;
      const h = timeOf[who];
      if (hourNow === h || hourNow > h) {
        wake(who, { late: hourNow > h });
        if (lv >= 2) {
          F.stopVoice();
          F.speak([hourWord(h).kind ? F.say(hourWord(h)) : null, getUp].filter(Boolean));
        }
      } else {
        // not their hour: a sleepy shake and a roll-over; "not now"; nothing marked
        F.jiggle(b.el, "sp-shake");
        F.stopVoice();
        F.speak(notNow);
      }
    })
  );

  await F.ask({ headline: "clock-head", guide: "clock-guide" });
  F.setGuide("clock-goodnight");
  await F.speak(F.lineOf("clock-goodnight"));
  F.root.classList.add("sp-dark");
  await F.sleep(F.T(700));
  // first time: light a bed (the first sleeper due) at their hour
  running = true;

  /* ----- the clock runs: minutes whizz, then it pauses at each hour ----- */
  show(first - 1 || 12, 55);
  for (let h = first; h <= last && !F.dead; h++) {
    const from = h === first ? 55 : 1;
    for (let m = from; m < 60 && !F.dead; m += h === first ? 1 : 2) {
      show(h - 1 || 12, m);
      await F.sleep(F.T(h === first ? 120 : 1500 / 30));
    }
    hourNow = h;
    show(h, 0);
    F.jiggle(wall);
    if (lv === 1) F.speak({ fn: "ItSNOClock", n: hourWord(h) });
    if (h === first) {
      const due = order.find((w) => timeOf[w] === h);
      if (due) F.teach("wake", beds[due].el);
    }
    await F.sleep(pauseMs);
    // (move on only once the pause's own line and any wake have settled)
    if (order.every((w) => beds[w].up)) break;
  }
  running = false;
  // whoever is still asleep: Nani opens the curtains and wakes them (plain)
  F.root.classList.remove("sp-dark");
  F.root.classList.add("sp-morning");
  for (const who of order) if (!beds[who].up) wake(who, { byNani: true });

  await new Promise((res) => (order.every((w) => rowOf[w].done) ? res() : F.whenAll(res)));
  F.root.classList.remove("sp-dark");
  F.root.classList.add("sp-morning");
  await F.finish(async () => {
    F.setGuide("clock-morning");
    await F.speak(F.lineOf("clock-morning"));
    order.forEach((w) => F.jiggle(beds[w].el));
  });
}

/** The order card's picture: the sleeper's face and their bedside alarm (its digits at L1; frosted from L2). */
function pic(box, who, h) {
  const d = document.createElement("div");
  d.className = "sp-pic";
  d.innerHTML = `<img src="${stamp(FAMILY[who].asleep)}" alt=""><span class="sp-alarm-pic${h == null ? " frosted" : ""}">${h == null ? "" : `${h}:00`}</span>`;
  box.appendChild(d);
}
