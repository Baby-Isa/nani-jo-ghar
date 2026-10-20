/*
 * The evening book's four games on its two pages (js/day/book.js mounts each one; js/day/book-games.js plans them; data/day-book.json).
 * Zafar 19-20 Oct and build/reports/s09a-fable-review.md section 2:
 *   find it         today's place across both pages, the things as separate sprites; "Where's the goat?"; a tap. Found: a bounce,
 *                   her line back, a gold tick on the corner. Wrong: a wiggle and the line again, no red. Idle help only says it again
 *   name it         the thing on the left page; three identical speaker buttons on the right, nothing written; "What's this?" (the
 *                   word is never said first); each button says its word as it is tapped; the right one flies into the sentence row,
 *                   which only then shows the written Kutchi, and she says the day's sentence; a wrong one wobbles and she asks again
 *   stick in        her sentence about the day, written under a dashed frame as she says it; three loose unlabelled photos; drag one
 *                   in: the right one snaps in and its corners appear, she says it again; a wrong one slides back and she says it again;
 *                   a placed photo can be dragged out again until the page is turned (Done)
 *   our day         the day's photos slide onto the pages as she tells the day (three left, two right, nothing on the fold); a tap
 *                   replays that photo's line; not scored
 * Each game resolves when its page is finished; the page turn is book.js's. Input is live while she speaks (E5): a tap goes ahead.
 * Every result is a first-try record (book.js keeps it for the tests; the child never sees a verdict: non-negotiable 12).
 *
 *   await runGame(g, page) where g = {api, data, place, wrap, L, R, head, thing(key) -> el, line(list, key) -> ln, say(ln, el),
 *         expect(fn), state(s), book (the book element: drags live on it), record(r)}
 */
import { createInput } from "../shared/input.js";

const SPK = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6"/><path d="M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>';
const el = (tag, cls, parent) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (parent) parent.appendChild(e);
  return e;
};
const once = (node, cls, ms) => {
  node.classList.remove(cls);
  void node.offsetWidth;
  node.classList.add(cls);
  setTimeout(() => node.classList.remove(cls), ms);
};

/** idle help (the leak rule): after `ms` with no touch on the book, the line is said again. Nothing glows. */
function idler(g, fn, ms = 8000) {
  let t = null;
  const arm = () => {
    clearTimeout(t);
    t = setTimeout(() => {
      fn();
      arm();
    }, ms / g.api.speed);
  };
  const poke = () => arm();
  g.book.addEventListener("pointerdown", poke);
  arm();
  return () => {
    clearTimeout(t);
    g.book.removeEventListener("pointerdown", poke);
  };
}

// ---------------------------------------------------------------- find it
async function find(g, page) {
  const { api, place, wrap } = g;
  wrap.classList.add("day-find");
  for (const side of ["l", "r"]) {
    const bd = g.backdrop(page.backdrop, side);
    if (bd) (side === "l" ? g.L : g.R).appendChild(bd);
  }
  const items = page.things.map((t, i) => {
    const th = place.things[t.key];
    const b = el("button", "day-find-item", t.spot.page === "l" ? g.L : g.R);
    b.type = "button";
    b.dataset.k = String(i);
    b.dataset.thing = t.key;
    b.style.left = `${t.spot.x * 100}%`;
    b.style.top = `${t.spot.y * 100}%`;
    b.style.setProperty("--h", String(th.h || 0.3));
    b.appendChild(g.thing(t.key));
    el("i", "day-contact", b);
    return b;
  });
  const idx = (key) => page.things.findIndex((t) => t.key === key);
  const found = new Set();
  for (const key of page.asks) {
    const ask = g.line("where", key);
    let firstTry = true;
    g.head(ask);
    const i = idx(key);
    g.expect(() => ({ kind: "tap", game: "find", sel: `.day-find-item[data-k="${i}"]`, wrongSel: `.day-find-item:not([data-k="${i}"]):not(.found)` }));
    const said = g.say(ask);
    void said;
    const stop = idler(g, () => g.say(ask));
    await new Promise((resolve) => {
      const onTap = (e) => {
        const b = e.currentTarget;
        if (b.classList.contains("found")) return once(b, "day-bounce", 600);
        if (b.dataset.thing === key) {
          items.forEach((x) => x.removeEventListener("click", onTap));
          resolve();
        } else {
          firstTry = false;
          once(b, "day-wiggle", 500);
          g.state("wrong-tap");
          // the wiggle first, then her line again (never a verdict, never red)
          setTimeout(() => {
            const hl = g.headLine();
            if (hl) once(hl.parentElement, "day-again", 1500);
            g.say(ask);
          }, 450 / api.speed);
        }
      };
      items.forEach((x) => x.addEventListener("click", onTap));
    });
    stop();
    const b = items[i];
    found.add(key);
    b.classList.add("found");
    once(b, "day-bounce", 700);
    el("i", "day-tick", b);
    g.record({ game: "find", key, firstTry });
    g.expect(() => ({ kind: "wait", game: "find" }));
    const back = g.line("found", key);
    g.head(back);
    await g.say(back);
  }
}

// ---------------------------------------------------------------- name it
async function nameit(g, page) {
  const { api, wrap } = g;
  wrap.classList.add("day-nameit");
  const pic = el("div", "day-thing-big", g.L);
  pic.appendChild(g.thing(page.answer));
  // the sentence row: the shared pill row, one pill, empty but for the gap until the right word is in
  const sentLn = g.line(["sentence", page.answer], page.answer);
  const node = el("div", "day-sent fit fit2");
  const gap = el("span", "day-gap", node);
  const NB = window.NjgButtons;
  const row = NB ? NB.pills(g.R, [{ id: "sentence", node }], () => filled && g.say(sentLn, node), { cls: "day-sentrow" }) : el("div", "njg-pills day-sentrow", g.R);
  if (!NB) row.appendChild(node);
  const pill = row.querySelector(".njg-pill") || node;
  const spks = el("div", "day-spks", g.R);
  const btns = page.choices.map((key, i) => {
    const b = el("button", "day-spk", spks);
    b.type = "button";
    b.dataset.k = String(i);
    b.innerHTML = SPK;
    b.setAttribute("aria-label", "");
    b._word = api.word(g.wordOf(key), "");
    b._key = key;
    return b;
  });
  let filled = false;
  const ask = g.line("whatsThis");
  g.head(ask);
  const ai = page.choices.indexOf(page.answer);
  g.expect(() => ({ kind: "tap", game: "nameit", sel: `.day-spk[data-k="${ai}"]`, wrongSel: `.day-spk:not([data-k="${ai}"])` }));
  g.say(ask);
  const stop = idler(g, () => g.say(ask));
  let firstTry = true;
  const chosen = await new Promise((resolve) => {
    btns.forEach((b) =>
      b.addEventListener("click", () => {
        if (filled) return;
        // each button says its own word as it is tapped (the shared voice queue: it cuts in, never waits)
        g.say(b._word, null, { min: false });
        if (b._key === page.answer) {
          filled = true;
          resolve(b);
        } else {
          firstTry = false;
          once(b, "day-wobble", 500);
          g.state("wrong-tap");
          setTimeout(() => {
            if (filled) return;
            const hl = g.headLine();
            if (hl) once(hl.parentElement, "day-again", 1500);
            g.say(ask);
          }, 700 / api.speed);
        }
      }),
    );
  });
  stop();
  g.record({ game: "nameit", key: page.answer, firstTry });
  g.expect(() => ({ kind: "wait", game: "nameit" }));
  // the button flies into the gap ...
  const a = chosen.getBoundingClientRect();
  const z = gap.getBoundingClientRect();
  chosen.style.transition = `transform ${450 / api.speed}ms ease-in-out, opacity ${450 / api.speed}ms`;
  chosen.style.transform = `translate(${z.left + z.width / 2 - (a.left + a.width / 2)}px, ${z.top + z.height / 2 - (a.top + a.height / 2)}px) scale(.8)`;
  await api.wait(480);
  chosen.style.opacity = "0";
  btns.forEach((b) => (b.disabled = true));
  // ... and only then the row shows the written Kutchi: the day's sentence, the word in its place. Rule 11: when the engine can't
  // say the day's sentence yet, the row holds the word itself (its Kutchi, the engine's) and the sentence is its grey to-record
  // English under the row: never a shorter Kutchi line in its place
  node.innerHTML = "";
  const word = g.wordOf(page.answer);
  if (sentLn.ok) {
    const r = api.render(sentLn, { cls: "day-inline" });
    r.querySelectorAll("[data-seg]").forEach((s) => {
      const seg = sentLn.result.segments[Number(s.dataset.seg)];
      if (seg && seg.w && (seg.w === word || g.sameWord(seg.w, word))) s.classList.add("day-word-in");
    });
    node.appendChild(r);
  } else {
    const w = api.render(chosen._word, { cls: "day-inline" });
    w.querySelectorAll("[data-seg]").forEach((s) => s.classList.add("day-word-in"));
    node.appendChild(w);
  }
  pill.classList.add("day-filled");
  row.classList.add("day-filled");
  let rec = null;
  if (!sentLn.ok) {
    rec = api.render(sentLn, { cls: "day-sent-rec" });
    row.after(rec);
  }
  if (window.FitText) window.FitText.run(row.parentElement);
  g.head(null);
  if (sentLn.ok) await g.say(sentLn, node.firstChild);
  // (the word was said once, as its button was tapped: never twice; the sentence is a silent placeholder until recorded)
  else await g.say(sentLn, rec);
}

// ---------------------------------------------------------------- stick in the photo
async function photo(g, page) {
  const { api, wrap } = g;
  wrap.classList.add("day-photo");
  const frameBox = el("div", "day-frame-box", g.L);
  const frame = el("div", "day-photo-frame", frameBox);
  ["tl", "tr", "bl", "br"].forEach((c) => el("i", `day-mount ${c}`, frame));
  const under = el("div", "day-under", frameBox);
  const sentLn = g.line(["sentence", page.answer], page.answer);
  const loose = el("div", "day-loose", g.R);
  const photos = page.choices.map((key, i) => {
    const p = el("div", "day-photo-loose", loose);
    p.dataset.k = String(i);
    p.dataset.thing = key;
    p.style.setProperty("--tilt", `${[-4, 3, -2][i % 3]}deg`);
    const pic = el("div", "day-print", p);
    pic.appendChild(g.thing(key, { photo: true }));
    return p;
  });
  // her sentence, written under the frame as she says it
  const r = api.render(sentLn);
  under.appendChild(r);
  g.head(null);
  const ai = page.choices.indexOf(page.answer);
  g.expect(() => ({ kind: "drag", game: "photo", sel: `.day-photo-loose[data-k="${ai}"]`, to: ".day-photo-frame", wrongSel: `.day-photo-loose:not([data-k="${ai}"])` }));
  g.say(sentLn, r);
  const stop = idler(g, () => g.say(sentLn, r));
  let firstTry = true;
  let placed = null;
  let settled = null;
  const I = createInput(g.book, { gestures: ["drag"] });
  g.cleanup(() => I.destroy());
  I.drop(frame, { id: "frame" });
  const home = (p) => {
    p.classList.add("day-back");
    p.style.transform = "";
    if (p.parentElement !== loose) {
      loose.insertBefore(p, photos.slice(photos.indexOf(p) + 1).find((x) => x.parentElement === loose) || null);
    }
    setTimeout(() => p.classList.remove("day-back"), 450 / api.speed);
  };
  photos.forEach((p) =>
    I.drag(
      p,
      {
        start() {
          p.classList.add("day-lifted");
          p.classList.remove("day-back");
        },
        move(a) {
          p.style.transform = `translate(${a.dx}px, ${a.dy}px) rotate(0deg) scale(1.04)`;
        },
        drop(a) {
          p.classList.remove("day-lifted");
          if (a.over === "frame" && p.dataset.thing === page.answer) {
            p.style.transform = "";
            frame.appendChild(p);
            p.classList.add("day-in");
            frame.classList.add("day-mounted");
            placed = p;
            g.state("photo-in");
            g.say(sentLn, r);
            g.turnOn(true);
            if (settled) settled();
          } else if (a.over === "frame") {
            firstTry = false;
            home(p);
            g.state("wrong-tap");
            g.say(sentLn, r);
          } else {
            // let go anywhere else: back to the page; the photo taken back out of the frame (until Done)
            if (p === placed) {
              placed = null;
              p.classList.remove("day-in");
              frame.classList.remove("day-mounted");
              g.turnOn(false);
              g.state("taken-back");
              g.expect(() => ({ kind: "drag", game: "photo", sel: `.day-photo-loose[data-k="${ai}"]`, to: ".day-photo-frame" }));
            }
            home(p);
          }
        },
      },
      { id: `photo-${p.dataset.k}` },
    ),
  );
  await new Promise((res) => (settled = res));
  stop();
  g.record({ game: "photo", key: page.answer, firstTry });
  g.expect(() => ({ kind: "wait", game: "photo" }));
  // the page stays open: a placed photo can still come out until the page is turned (book.js waits on the corner; the drag stays live)
  g.keepTurnBy(() => !!placed);
}

// ---------------------------------------------------------------- our day
async function ourday(g, page) {
  const { api, wrap } = g;
  wrap.classList.add("day-ourday");
  const n = page.things.length;
  const leftN = Math.min(3, Math.ceil(n / 2) + (n > 4 ? 0 : 0));
  const lines = page.things.map((k) => g.line(["told", k], k));
  g.expect(() => ({ kind: "wait", game: "ourday" }));
  const cells = [];
  for (let i = 0; i < n; i++) {
    const side = i < leftN ? g.L : g.R;
    const holder = side.querySelector(".day-path") || el("div", "day-path", side);
    const b = el("button", "day-photo-ours", holder);
    b.type = "button";
    b.dataset.k = String(i);
    b.style.setProperty("--tilt", `${[-3, 2, -1.5, 2.5, -2][i % 5]}deg`);
    const pic = el("div", "day-print", b);
    pic.appendChild(g.thing(page.things[i], { photo: true }));
    ["tl", "tr", "bl", "br"].forEach((c) => el("i", `day-mount ${c}`, b));
    b.addEventListener("click", () => {
      g.head(lines[i]);
      g.say(lines[i], g.headLine());
    });
    cells.push(b);
  }
  for (let i = 0; i < n; i++) {
    cells[i].classList.add("in");
    g.head(lines[i]);
    await g.say(lines[i], g.headLine());
    await api.wait(250);
  }
  g.record({ game: "ourday", told: n });
}

export const GAMES = { find, nameit, photo, ourday };
export async function runGame(g, page) {
  const fn = GAMES[page.game];
  if (!fn) throw new Error(`book: no game "${page.game}"`);
  return fn(g, page);
}
