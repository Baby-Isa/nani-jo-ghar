/*
 * The morning door (Zafar, 19-20 Oct; docs/sprints/S09-a-day-at-nanis.md; DOOR-01..04): the day starts at Nani's door.
 *
 *   the frame    the shared sidebar on the left and the play area (js/shared/frame.js), as in every mode
 *   the scene    the day's sky behind the cut-out empty house, the roofline a third down (js/day/sky.js paintDoor)
 *   Nani         one of her pose cut-outs at about half the screen height, her feet at the foot of the steps, every pose at one
 *                body height; her pose follows her lines (data/days.json door.poses), a short cross-fade between poses
 *   her lines    in the shared speech bubble (css/shared/conversations.css) in the sky's upper left, one at a time and IN TURN
 *                (each starts only when the one before has been said, on the one voice queue): the weather word alone, then in
 *                a sentence, then the day's lines; each line's Kutchi with its English written beneath (rule 5's door exception)
 *   the sidebar  two cards, each appearing as its sentence is said (idea 55): today's weather, then the day's activity, each
 *                the shared word card (js/shared/word-card.js; Sprint 11): its picture, the speaker, its word's Kutchi and English,
 *                the slots faded by the word's stage in the progress words (English, then the picture, then the text)
 *   the answer   the shared Ha! and Na pills (js/shared/buttons.js); Na shakes, Ha! starts the day
 * Every line is an engine meaning (data/day.json); what the engine can't say yet is its English in grey italic, to record.
 *
 *   await runDoor(el, api, day) -> {status: "done", result: {answer, no}}
 *       day: the runner's day view (js/day/day.js): day.weather, day.lines (a key of data/day.json activities or trips)
 */
import { paintDoor, rain } from "./sky.js";
import "../shared/word-card.js"; // window.WordCard (a classic script, imported for its side effect)

/** A door card's word id in the progress words (its lexicon id, or its meaning's phrase or kind). */
export function wordId(def, kind) {
  const d = def || {};
  const m = d.meaning || {};
  return String(d.word || m.x || m.kind || `door.${kind}`);
}

const SPK = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6"/><path d="M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>';
const el = (tag, cls, parent) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (parent) parent.appendChild(e);
  return e;
};

/** Which pose for each line: the weather's word and sentence, then the day's lines by their place (data/days.json door.poses). */
export function poseFor(P, wkey, kind, dayIndex) {
  const w = (P.weather && (P.weather[wkey] || P.weather.sunny)) || {};
  if (kind === "weather-word") return w.word || P.idle;
  if (kind === "weather-sentence") return w.sentence || w.word || P.idle;
  const list = P.day || [];
  return list[Math.min(dayIndex, list.length - 1)] || P.idle;
}

/** A pose picture's box, its feet's middle at (0, 0), its body (head top to feet) `B` px tall. */
export function poseBox(pose, B) {
  const k = B / Math.max(1, pose.body[1] - pose.body[0]);
  return { w: pose.w * k, h: pose.h * k, left: -pose.cx * pose.w * k, top: -pose.body[1] * k };
}

/** Her head's middle and radius in the play area's px (SH-68): the pose's head point (a share of its picture), her feet at `foot`. */
export function headPoint(pose, B, foot) {
  const b = poseBox(pose, B);
  const hd = pose.head || [pose.cx, 0.08];
  return { x: foot.x + b.left + hd[0] * b.w, y: foot.y + b.top + hd[1] * b.h, r: B * 0.075 };
}

export async function runDoor(host, api, day) {
  const { data, url } = api;
  const look = api.days.door;
  const wkey = data.weather[day.weather] ? day.weather : "sunny";
  const W = data.weather[wkey];
  const set = data.activities[day.lines] || data.trips[day.lines] || data.activities.kitchen;
  api.test.state("day/door");
  // the page's idle clock (js/shared/guide.js) watches from the door on: the stages after it count from the child's Ha!
  if (window.NaniGuide && window.NaniGuide.watch) window.NaniGuide.watch();
  api.test.expect(() => ({ kind: "wait" }));
  window.Day.stage = "door";

  // ---- the frame: the sidebar (the two cards) and the play area (the scene) ----
  const root = el("div", "day-root day-door", host);
  root.dataset.weather = wkey;
  root.dataset.activity = day.lines;
  const side = el("aside", "day-side", root);
  const play = el("main", "day-play", root);
  if (window.Frame && window.Frame.mount) window.Frame.mount({ app: root, side, play });
  const scn = paintDoor(play, { look, wkey, weather: W, url, speed: () => api.speed });

  // ---- Nani: her pose cut-outs, feet at the foot of the steps (DOOR-05: standing on the ground, no pill under her) ----
  const NP = look.nani;
  const wrap = el("div", "day-nani-wrap", scn.figs);
  wrap.style.setProperty("--day-fade", `${NP.fadeMs || 260}ms`);
  let front = null;
  let pose = null;
  const headAt = (g) => (pose && NP.poses[pose] ? headPoint(NP.poses[pose], g.H * (NP.height || 0.5), g.foot) : null);
  const placeImg = (im) => {
    const g = scn.geo();
    const b = poseBox(NP.poses[im.dataset.pose], g.H * (NP.height || 0.5));
    Object.assign(im.style, { left: `${b.left.toFixed(1)}px`, top: `${b.top.toFixed(1)}px`, width: `${b.w.toFixed(1)}px`, height: `${b.h.toFixed(1)}px` });
  };
  const placeNani = (g) => {
    Object.assign(wrap.style, { left: `${g.foot.x.toFixed(1)}px`, top: `${g.foot.y.toFixed(1)}px` });
    wrap.style.setProperty("--day-b", `${(g.H * (NP.height || 0.5)).toFixed(1)}px`);
    wrap.querySelectorAll("img.day-nani").forEach(placeImg);
  };
  // the poses this door can use, fetched now (decision 68: only this screen's pictures)
  const used = new Set([look.poses.idle, look.poses.wait, ...(look.poses.day || []), ...Object.values(look.poses.weather[wkey] || {})].filter(Boolean));
  used.forEach((p) => NP.poses[p] && (new Image().src = url(NP.poses[p].art)));
  const setPose = async (name) => {
    if (!NP.poses[name] || name === pose) return;
    pose = name;
    wrap.dataset.pose = name;
    const im = el("img", "day-nani");
    im.alt = "";
    im.draggable = false;
    im.dataset.pose = name;
    im.src = url(NP.poses[name].art);
    placeImg(im);
    wrap.appendChild(im);
    // her head moved with the pose: the thought's dots follow it
    if (scn.geo()) placeThought(scn.geo());
    if (im.decode) await im.decode().catch(() => {});
    if (pose !== name) return im.remove();
    requestAnimationFrame(() => {
      im.classList.add("on");
      const old = front;
      front = im;
      if (old) {
        old.classList.remove("on");
        setTimeout(() => old.remove(), (NP.fadeMs || 260) + 80);
      }
    });
  };

  // ---- the thought bubble of the day's place, beside her head, away from her lines ----
  const thought = el("div", "day-thought", play);
  const tdef = set.thought || {};
  const A = (look.cards.activity || {})[day.lines] || {};
  if (tdef.art) {
    const im = el("img", "", thought);
    im.alt = "";
    im.src = url(tdef.art);
  } else if (A.pic && A.pic.bg) {
    // no cut-out of the place yet: the activity card's own picture, round in the cloud
    const im = el("img", "day-thought-bg", thought);
    im.alt = "";
    im.src = url(A.pic.bg);
    im.style.objectPosition = A.pic.pos || "50% 50%";
  }
  const dots = [0, 1].map((i) => el("i", `day-thought-dot d${i}`, thought));
  // SH-68 (Zafar, 22 Oct: "the dot, dot, dot should always be coming from her head"): the bubble sits up and to the side of
  // her HEAD (the pose's own head point, data/days.json nani.poses.<pose>.head), and its dots rise from the top of her head to
  // its corner, the small one nearest her; on the side with room (her right, else her left)
  const placeThought = (g) => {
    const hd = headAt(g);
    if (!hd) return;
    const h = Math.max(72, g.H * ((look.thought && look.thought.h) || 0.2));
    const w = h * 1.3;
    const gap = Math.max(10, hd.r * 0.5);
    let right = hd.x + hd.r * 0.6 + gap + w <= g.W - 12;
    let x = right ? hd.x + hd.r * 0.6 + gap : hd.x - hd.r * 0.6 - gap - w;
    if (!right && x < 12) {
      right = true;
      x = Math.min(g.W - w - 12, hd.x + hd.r * 0.6 + gap);
    }
    const y = Math.max(12, hd.y - hd.r * 1.1 - gap - h);
    Object.assign(thought.style, { left: `${x.toFixed(1)}px`, top: `${y.toFixed(1)}px`, width: `${w.toFixed(1)}px`, height: `${h.toFixed(1)}px`, transformOrigin: right ? "0% 100%" : "100% 100%" });
    // the dots: from just above her head (on the bubble's side) to the bubble's near bottom corner
    const p0 = { x: hd.x + (right ? 1 : -1) * hd.r * 0.45, y: hd.y - hd.r * 1.15 };
    const c = { x: right ? x + w * 0.16 : x + w * 0.84, y: y + h * 0.9 };
    const sizes = [Math.max(14, h * 0.15), Math.max(8, h * 0.08)];
    [0.55, 0.12].forEach((k, i) => {
      const d = sizes[i];
      const px = p0.x + (c.x - p0.x) * k;
      const py = p0.y + (c.y - p0.y) * k;
      Object.assign(dots[i].style, { width: `${d.toFixed(1)}px`, height: `${d.toFixed(1)}px`, left: `${(px - x - d / 2).toFixed(1)}px`, top: `${(py - y - d / 2).toFixed(1)}px` });
    });
    thought.dataset.head = `${Math.round(hd.x)},${Math.round(hd.y)},${Math.round(hd.r)}`;
  };

  // ---- her lines: the shared speech bubble in the sky's upper left ----
  const cv = el("div", "cv-layer day-door-cv", root);
  const bubble = el("div", "cv-bubble cv-say day-lines", cv);
  bubble.dataset.speaker = "nani";
  const bubbleText = el("span", "cv-text", bubble);
  const spk = el("button", "cv-spk", bubble);
  spk.type = "button";
  spk.setAttribute("aria-label", "");
  spk.innerHTML = SPK;
  let shown = null;
  const placeBubble = () => {
    const g = scn.geo();
    const pr = play.getBoundingClientRect();
    const B = g.H * (NP.height || 0.5);
    const pad = g.H < 500 ? 12 : 24;
    // its right edge stays clear of her: at the bubble's height only her head and shoulders (her arms move on the other side
    // or at her waist), about a quarter of her height left of her middle
    const room = g.foot.x - B * 0.25 - pad * 2;
    bubble.style.maxWidth = `${Math.round(Math.max(220, Math.min(room, 600)))}px`;
    const w = bubble.offsetWidth;
    const h = bubble.offsetHeight;
    const lift = parseFloat(getComputedStyle(bubble).getPropertyValue("--njg-u")) || 1;
    // the shared bubble hangs above its point (translate -50%, -100% and its tail's room): its box lands at the play area's top left
    Object.assign(bubble.style, { left: `${(pr.left + pad + w / 2).toFixed(1)}px`, top: `${(pr.top + pad + h + 14 * lift).toFixed(1)}px` });
  };
  spk.addEventListener("click", () => {
    if (!shown) return;
    bubble.classList.add("speaking");
    api.say(shown.ln, { el: shown.row, who: "nani", min: false }).then(() => bubble.classList.remove("speaking"));
  });

  // ---- the sidebar's two cards (idea 55): the weather, then the day's activity, each the shared word card ----
  // (Sprint 11, Step 0: js/shared/word-card.js; its slots fade by the word's stage: English, then the picture, then the text)
  const WordCard = window.WordCard;
  WordCard.useCss(url("css/shared/word-card.css"));
  const progress = api.core && api.core.progress;
  window.Day.doorCards = [];
  const card = (kind, picFill, ln, def) => {
    const id = wordId(def, kind);
    const line = api.render(ln, { cls: "day-wline" });
    const c = WordCard.card(
      side,
      {
        id,
        kutchi: line,
        english: ln.en,
        rec: !ln.ok,
        picture: (box) => picFill(box),
        say: () => api.say(ln, { el: line, who: "nani", min: false }),
      },
      { progress, cls: "day-wcard" }
    );
    c.dataset.card = kind;
    window.Day.doorCards.push({ kind, id, stage: c.wc.stage, slots: c.wc.slots });
    return c;
  };
  const SK = look.skies[wkey] || look.skies.sunny;
  const stops = [];
  const weatherCard = card(
    "weather",
    (pic) => {
      const im = el("img", "day-wbg", pic);
      im.alt = "";
      im.src = url(SK.art);
      im.style.objectPosition = SK.card || "50% 30%";
      if (W.rain) stops.push(rain(pic, W.rain, 400, 300, () => api.speed));
    },
    // DOOR-07 (Zafar, 22 Oct: "they need to be singular words ... we're trying to build up vocabulary"): the card's word is the
    // weather's own single word (data/day.json weather.<w>.card), her line keeps the phrase
    api.line(W.card || W.word),
    W.card || W.word
  );
  const activityCard = card(
    "activity",
    (pic) => {
      const P = A.pic || {};
      if (P.fill) pic.style.background = P.fill;
      if (P.bg) {
        const im = el("img", "day-wbg", pic);
        im.alt = "";
        im.src = url(P.bg);
        im.style.objectPosition = P.pos || "50% 50%";
      } else if (tdef.art) {
        const im = el("img", "day-wbg contain", pic);
        im.alt = "";
        im.src = url(tdef.art);
      }
      (P.sprites || []).forEach((s) => {
        const sp = el("img", "day-wsprite", pic);
        sp.alt = "";
        sp.src = url(s.art);
        Object.assign(sp.style, { left: `${s.x * 100}%`, top: `${s.y * 100}%`, height: `${s.h * 100}%` });
      });
    },
    api.line(A.word || { meaning: { fn: "Item", kind: `n.${day.lines}` }, en: day.lines }),
    A.word || { meaning: { fn: "Item", kind: `n.${day.lines}` } }
  );

  scn.onFit((g) => {
    placeNani(g);
    placeThought(g);
    if (shown) placeBubble();
  });

  // ---- the lines in their order: the weather word, the weather sentence, then the day's own lines ----
  const defs = [];
  if (W.word) defs.push({ ...W.word, kind: "weather-word" });
  if (W.sentence) defs.push({ ...W.sentence, kind: "weather-sentence" });
  (set.lines || []).forEach((l, i) => defs.push({ ...l, kind: "day", at: i }));
  const lines = defs.map((d) => ({ ...api.line(d), d }));
  window.Day.doorLines = lines.map((l) => ({ text: l.text, ok: l.ok, en: l.en, kind: l.d.kind }));

  // ---- the child's answer: the shared Ha! and Na pills, shown as she asks (input is never held back for her voice) ----
  const yes = api.line(data.door.yes);
  const no = api.line(look.no);
  let answered = false;
  let nos = 0;
  let resolveAnswer;
  const answer = new Promise((r) => (resolveAnswer = r));
  const pills = el("div", "day-answer", play);
  const showAnswer = () => {
    if (pills.childElementCount) return;
    const B = window.NjgButtons;
    const pick = (id, btn) => {
      if (answered) return;
      // input is live while she speaks (E5): the tap is the child's act at once
      if (window.Lifecycle && window.Lifecycle.note) window.Lifecycle.note("act", { during: "day:door", choice: id });
      if (id === "no") {
        // Na shakes (UX 14): the day waits for Ha!, nothing else happens
        nos++;
        btn.classList.remove("shake");
        void btn.offsetWidth;
        btn.classList.add("shake");
        return;
      }
      answered = true;
      endHelp();
      // Ha! goes ahead: her line stops where it is
      try {
        api.core.voice.stop("day");
      } catch (e) {
        /* nothing playing */
      }
      resolveAnswer();
    };
    const choices = [
      { id: "yes", node: api.render(yes, { cls: "day-yes-word" }) },
      { id: "no", node: api.render(no, { cls: "day-yes-word" }) },
    ];
    if (B && B.pills) {
      const row = B.pills(pills, choices, pick, { cls: "day-yes" });
      const y = row.pill("yes");
      if (y) y.classList.add("njg-pulse");
    } else {
      choices.forEach((c) => {
        const b = el("button", "njg-pill", pills);
        b.type = "button";
        b.dataset.choice = c.id;
        b.appendChild(c.node);
        b.addEventListener("click", () => pick(c.id, b));
      });
    }
    pills.classList.add("in");
    api.test.expect(() => (answered ? { kind: "wait" } : { kind: "tap", sel: '.day-answer button[data-choice="yes"]', wrongSel: '.day-answer button[data-choice="no"]' }));
    startHelp();
  };

  // ---- SH-19 (Zafar, 22 Oct: "this will probably be the first thing the person ever plays, so the onboarding needs to exist
  // here as well ... the highlight, the bounce up and down, and the shadow with ... the rectangle with the rounded corners"): a new
  // player's first door, the shared kit's help on Ha!: the dim with its box round the pill, the pill's glow and bounce, the kit's
  // finger tapping it (again every couple of seconds) until the child answers. Once per player (a New player has it again).
  const HELP_ID = "day/door";
  let help = null;
  const startHelp = async () => {
    if (help || answered) return;
    help = { stop: false };
    const O = await api.kit().catch(() => null);
    const yesBtn = pills.querySelector('button[data-choice="yes"]');
    if (!O || !yesBtn || answered || help.stop || !api.helpDue(HELP_ID)) return;
    await api.wait(400); // the pills land first
    if (answered || help.stop) return;
    help.spot = O.spot(yesBtn, {});
    help.spot.layer.dataset.help = HELP_ID;
    if (window.Lifecycle && window.Lifecycle.note) window.Lifecycle.note("help", { during: "day:door", step: "yes" });
    const tapOnce = () => {
      const r = yesBtn.getBoundingClientRect();
      const at = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      // the finger comes in from just below and to the right of the pill (on screen), taps it, and lifts off
      const below = Math.max(18, Math.min(56, (window.innerHeight || 0) - at.y - 24));
      return O.demo({ x: at.x + Math.min(48, r.width * 0.4), y: at.y + below }, [at], { hand: true, ms: 1100, step: "door-yes", quiet: true });
    };
    while (!answered && !help.stop) {
      await tapOnce();
      await new Promise((ok) => setTimeout(ok, 500));
    }
  };
  const endHelp = () => {
    if (!help) return;
    help.stop = true;
    if (help.spot) {
      help.spot.close();
      api.helped(HELP_ID);
    }
  };

  setPose(look.poses.idle);
  await api.wait(500); // a moment of quiet first (E27)
  const talk = window.Lifecycle && window.Lifecycle.talk && window.Lifecycle.talk.dom ? window.Lifecycle.talk : null;
  for (let i = 0; i < lines.length && !answered; i++) {
    const ln = lines[i];
    setPose(poseFor(look.poses, wkey, ln.d.kind, ln.d.at || 0));
    if (ln.d.kind === "weather-word") weatherCard.classList.add("in");
    if (ln.d.thought) {
      thought.classList.add("in");
      activityCard.classList.add("in");
    }
    // the bubble shows the line being said (its Kutchi, the English beneath)
    const row = api.render(ln, { english: true, cls: "day-say" });
    row.dataset.kind = ln.d.kind;
    bubbleText.innerHTML = "";
    bubbleText.appendChild(row);
    shown = { ln, row };
    placeBubble();
    bubble.classList.add("in", "speaking");
    if (i === lines.length - 1) showAnswer();
    const stopTalk = talk && front ? talk.dom(front) : null;
    await Promise.race([api.say(ln, { el: row, who: "nani" }), answer]);
    if (typeof stopTalk === "function") stopTalk();
    bubble.classList.remove("speaking");
    if (i < lines.length - 1) await api.wait(data.door.gapMs || 450);
  }
  // both cards are up by the time she asks (a day with no weather word or no place line still shows them)
  weatherCard.classList.add("in");
  activityCard.classList.add("in");
  setPose(look.poses.wait);
  showAnswer();
  await answer;
  pills.querySelectorAll('button[data-choice="yes"]').forEach((b) => b.classList.add("chosen"));
  // the child's own Ha!, heard
  await api.say(yes, { who: "child", min: false });
  // DOOR-08 (Zafar, 22 Oct: "after you say yes, you should say come ... and have the face"): her answer, glad, in her
  // come-here pose when the art has one (data/days.json door.poses.come: the first that exists), in the bubble like every line
  const come = data.door.come ? api.line(data.door.come) : null;
  if (come) {
    const cp = [].concat(look.poses.come || []).find((p) => NP.poses[p]);
    if (cp) setPose(cp);
    wrap.classList.remove("day-glad");
    void wrap.offsetWidth;
    wrap.classList.add("day-glad");
    const row = api.render(come, { english: true, cls: "day-say" });
    row.dataset.kind = "come";
    bubbleText.innerHTML = "";
    bubbleText.appendChild(row);
    shown = { ln: come, row };
    placeBubble();
    bubble.classList.add("in", "speaking");
    window.Day.doorLines.push({ text: come.text, ok: come.ok, en: come.en, kind: "come" });
    const stopTalk = talk && front ? talk.dom(front) : null;
    await api.say(come, { el: row, who: "nani" });
    if (typeof stopTalk === "function") stopTalk();
    bubble.classList.remove("speaking");
  }
  thought.classList.add("go");
  api.test.expect(() => ({ kind: "end" }));
  await api.wait(700);
  scn.stop();
  stops.forEach((f) => f());
  return { status: "done", result: { answer: "yes", no: nos } };
}
