/*
 * The evening book's games on its two pages (js/day/book.js mounts each one; js/day/book-games.js plans them; data/day-book.json).
 * Sprint 12 (Zafar, 22-23 Oct: F2-F10, decisions 2 and 9; build/reports/s12-answers.md section 10): every game teaches itself the
 * same way as the rest of the day (the help kit's box and finger the first time), and each has one job:
 *   find it         hear the word, pick the picture. The asked word's own card comes first, big (its picture, its Kutchi, its
 *                   English while supported, Nani says it), shrinks to a quarter of a page, the other plain picture cards are
 *                   dealt beside it one by one, they shuffle for two seconds, then she asks "Bakri kida ai?" and asks again every
 *                   few seconds. A new player's first ask: the kit shows the tap. Later rounds skip the card and the shuffle.
 *                   Found: a bounce and a gold tick, her line back. A miss: a wiggle and the line again, never red.
 *   name it         see the picture, say it, or hear three Kutchi words and pick one. "Say it" first (decision 9): the picture
 *                   and her "Hi kuro ai?", and the mic (js/shared/speech.js, Speech.listen with the three words): heard right,
 *                   the word goes into the sentence. After a try (or a tap on the mic where there is none) the three words come
 *                   as pills, each with its own speaker at its start that plays it at once (never queued behind her line, a
 *                   second tap plays it again); a tap on a word picks it. A miss is a gentle shrug and her question again.
 *   stick in        read and hear a sentence, drag its picture in. Her sentence under the dashed frame, its word a gap, a
 *                   speaker at its start that says it whole (no penalty: SH-110, never a memory test); small English under
 *                   it while the word is supported. Three pictures as word cards (the shared row: picture, speaker, Kutchi,
 *                   English fading by the word's stage). A new player's first page: the kit's box and the card showing the drag.
 *                   The right card snaps into the frame as a photo (its word fills the gap) and she says it; a wrong one slides
 *                   back. A placed photo can be dragged out again until the page is turned. ("Then we use" folds into it.)
 *   our day         the day's photos slide onto the pages as she tells the day (three left, two right); a tap replays that
 *                   photo's line; not scored
 * Each game resolves when its page is finished; the page turn is book.js's. Input is live while she speaks (E5): a tap goes ahead.
 * Every result is a first-try record (book.js keeps it for the tests; the child never sees a verdict: non-negotiable 12); a
 * round the child was shown (find it's intro card, a first-time drag) is study: true.
 *
 *   await runGame(g, page) where g = {api, data, place, wrap, L, R, head, thing(key) -> el, line(list, key) -> ln, say(ln, el),
 *         sayNow(ln, el) (at once, cutting her line), wordLn(key), stageOf(key), kit(), helpDue(id), helped(id), url(p),
 *         expect(fn), state(s), book (the book element: drags live on it), record(r)}
 */
import { createInput } from "../shared/input.js";
import "../shared/word-card.js"; // window.WordCard (a classic script, imported for its side effect)

const SPK = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6"/><path d="M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>';
const MIC = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/></svg>';
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
/** Real time (the camera's and the cards' moves take their time at test speed too: a filmstrip must see them). */
const realWait = (ms) => new Promise((r) => setTimeout(r, ms));

/** idle help (the leak rule): after `ms` with no touch on the book, the line is said again (F4: every few seconds, like the
 * eye test). Nothing glows. Quiet while the mic listens (g.quiet). */
function idler(g, fn, ms = 4500) {
  let t = null;
  const arm = () => {
    clearTimeout(t);
    t = setTimeout(() => {
      if (!g.quiet) fn();
      arm();
    }, ms / g.api.speed);
  };
  const poke = () => arm();
  g.book.addEventListener("pointerdown", poke);
  // (counted from when the page shows: a page built ahead waits for g.go)
  let stopped = false;
  Promise.resolve(g.go).then(() => !stopped && arm());
  return () => {
    stopped = true;
    clearTimeout(t);
    g.book.removeEventListener("pointerdown", poke);
  };
}

/** The shared help kit's first-time box and finger on `target` (once per player: id). -> stop() */
function firstHelp(g, id, target, o = {}) {
  let spot = null;
  let stopped = false;
  (async () => {
    const O = await g.kit().catch(() => null);
    if (!O || stopped || !g.helpDue(id)) return;
    await g.api.wait(o.delay || 300);
    if (stopped) return;
    spot = O.spot(target, Object.assign({ step: id }, o.spot || {}));
    if (spot && spot.layer) spot.layer.dataset.help = id;
    if (o.drag && O.demo) {
      // a drag's first time: the real card shows the move to the frame and comes home, again until the child takes it
      const loop = async () => {
        while (!stopped) {
          await O.demo(target, o.drag, { drag: true, hand: true, ms: 1700, step: id }).catch(() => {});
          await realWait(900);
        }
      };
      loop();
    }
    if (window.Lifecycle && window.Lifecycle.note) window.Lifecycle.note("help", { during: "day:book", step: id });
  })();
  return (done = true) => {
    if (stopped) return;
    stopped = true;
    if (spot) {
      spot.close();
      if (done) g.helped(id);
    }
  };
}

// ---------------------------------------------------------------- find it
/** The grid's slots in the wrap's px: a row of two cards on each page under her card (three cards: two and one), square. */
function findSlots(g, n) {
  const per = n <= 3 ? [2, Math.max(1, n - 2)] : [Math.ceil(n / 2), Math.floor(n / 2)];
  const out = [];
  [g.L, g.R].forEach((P, pi) => {
    const x0 = P.offsetLeft;
    const y0 = P.offsetTop;
    const w = P.offsetWidth;
    const h = P.offsetHeight;
    const m = per[pi];
    const top = Math.max(84, h * 0.22);
    const avail = h - top - h * 0.05;
    const gap = Math.max(12, w * 0.05);
    const size = Math.max(64, Math.min((w * 0.92 - gap * (m - 1)) / m, avail * 0.9));
    const row = m * size + (m - 1) * gap;
    for (let i = 0; i < m; i++) out.push({ x: x0 + (w - row) / 2 + i * (size + gap), y: y0 + top + (avail - size) / 2, size });
  });
  return out.slice(0, n);
}

async function find(g, page) {
  g.wrap.classList.add("day-find2");
  await g.go;
  for (let i = 0; i < page.rounds.length; i++) {
    await findRound(g, page.rounds[i], i);
    if (i < page.rounds.length - 1) await realWait(350);
  }
}

async function findRound(g, round, ri) {
  const { api, wrap } = g;
  const key = round.ask;
  const cards = round.cards;
  const slots = () => findSlots(g, cards.length);
  // each card's slot (its index in slots()); the shuffle swaps them
  const at = cards.map((_, i) => i);
  const place = (b, s, ms = 0) => {
    b.style.transition = `${ms ? `left ${ms}ms ease-in-out, top ${ms}ms ease-in-out, ` : ""}scale 300ms cubic-bezier(.3, .7, .3, 1), opacity 300ms`;
    Object.assign(b.style, { left: `${s.x}px`, top: `${s.y}px`, width: `${s.size}px`, height: `${s.size}px` });
  };
  const btns = cards.map((k, i) => {
    const b = el("button", "day-pcard", wrap);
    b.type = "button";
    b.dataset.k = String(i);
    b.dataset.thing = k;
    b.appendChild(g.thing(k));
    place(b, slots()[at[i]]);
    return b;
  });
  const ai = cards.indexOf(key);
  // keep the cards on their slots when the screen changes
  const ro = typeof ResizeObserver === "function" ? new ResizeObserver(() => btns.forEach((b, i) => place(b, slots()[at[i]]))) : null;
  if (ro) ro.observe(g.L);
  g.cleanup(() => ro && ro.disconnect());
  g.expect(() => ({ kind: "wait", game: "find" }));
  g.state(round.intro ? "find-intro" : "find-deal");
  if (round.intro) {
    // F3 (Zafar, 22 Oct): the item's card, big: its picture, its Kutchi, its English while supported; she says it ...
    const W = window.WordCard;
    W.useCss(g.url("css/shared/word-card.css"));
    const wl = g.wordLn(key);
    const kt = api.render(wl, { cls: "day-wline" });
    const card = W.card(
      wrap,
      { id: g.wordOf(key), kutchi: kt, english: wl.en, rec: !wl.ok, picture: (box) => box.appendChild(g.thing(key)), say: () => g.sayNow(wl, kt) },
      { progress: g.progress, cls: "day-fintro", slots: { picture: true, english: g.stageOf(key) <= 2, kutchiText: true } },
    );
    const P = g.L;
    const w = Math.min(P.offsetWidth * 0.62, 340);
    Object.assign(card.style, { left: `${P.offsetLeft + (P.offsetWidth - w) / 2}px`, top: `${P.offsetTop + Math.max(84, P.offsetHeight * 0.2)}px`, width: `${w}px` });
    g.head(null);
    requestAnimationFrame(() => card.classList.add("in"));
    await realWait(350);
    await g.say(wl, kt);
    await realWait(500);
    // ... it shrinks to a quarter of a page, into its place in the grid (the plain card takes over as it lands) ...
    const s = slots()[at[ai]];
    const r = card.getBoundingClientRect();
    const wr = wrap.getBoundingClientRect();
    const k = s.size / r.width;
    card.style.transition = "transform 650ms cubic-bezier(.45,.05,.35,1), opacity 250ms ease-in 450ms";
    card.style.transformOrigin = "0 0";
    card.style.transform = `translate(${s.x - (r.left - wr.left)}px, ${s.y - (r.top - wr.top)}px) scale(${k})`;
    card.style.opacity = "0";
    await realWait(450);
    btns[ai].classList.add("in");
    await realWait(300);
    card.remove();
  }
  // ... the other cards are dealt one by one ...
  for (let i = 0; i < btns.length; i++) {
    if (btns[i].classList.contains("in")) continue;
    btns[i].classList.add("in");
    await realWait(round.intro ? 380 : 220);
  }
  await realWait(300);
  if (round.intro) {
    // ... and shuffled for two seconds (cards swap places, lifted as they go)
    g.state("find-shuffle");
    wrap.classList.add("day-shuffling");
    const swaps = 3;
    for (let t = 0; t < swaps; t++) {
      const a = Math.floor(Math.random() * at.length);
      let b = Math.floor(Math.random() * (at.length - 1));
      if (b >= a) b++;
      [at[a], at[b]] = [at[b], at[a]];
      const S = slots();
      [a, b].forEach((i) => {
        btns[i].classList.add("day-moving");
        place(btns[i], S[at[i]], 560);
      });
      await realWait(620);
      [a, b].forEach((i) => btns[i].classList.remove("day-moving"));
    }
    wrap.classList.remove("day-shuffling");
    btns.forEach((b, i) => place(b, slots()[at[i]]));
  }
  // the question, said again every few seconds (F4), the cards live
  const ask = g.line("where", key);
  g.head(ask);
  btns.forEach((b) => b.classList.add("live"));
  let firstTry = true;
  g.expect(() => ({ kind: "tap", game: "find", sel: `.day-pcard[data-k="${ai}"]`, wrongSel: `.day-pcard.live:not([data-k="${ai}"])` }));
  g.state("find-ask");
  g.say(ask);
  const stop = idler(g, () => g.say(ask));
  // a new player's first ask: the kit's box and finger on the card (EASY-08, SH-19)
  const help = ri === 0 ? firstHelp(g, "day/book/find", btns[ai], { spot: { live: btns, avoid: btns.filter((_, i) => i !== ai) } }) : () => {};
  await new Promise((resolve) => {
    const onTap = (e) => {
      const b = e.currentTarget;
      if (b.dataset.thing === key) {
        btns.forEach((x) => x.removeEventListener("click", onTap));
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
    btns.forEach((x) => x.addEventListener("click", onTap));
  });
  help(true);
  stop();
  const b = btns[ai];
  btns.forEach((x) => x.classList.remove("live"));
  b.classList.add("found");
  once(b, "day-bounce", 700);
  el("i", "day-tick", b);
  g.record({ game: "find", key, firstTry, study: !!round.intro });
  g.expect(() => ({ kind: "wait", game: "find" }));
  g.state("find-found");
  const back = g.line("found", key);
  g.head(back);
  await g.say(back);
  await realWait(400);
  // the round's cards go (the next round deals its own)
  btns.forEach((x) => x !== b && (x.style.opacity = "0"));
  await realWait(300);
  if (ri === 0) btns.forEach((x) => x.remove());
}

// ---------------------------------------------------------------- name it
/** js/shared/speech.js, loaded the first time name it needs it (decision 68). */
let speechP = null;
const speech = (g) =>
  (speechP =
    speechP ||
    import("../shared/speech.js")
      .then(() => window.Speech || null)
      .catch(() => null));

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
  let filled = false;
  const row = NB ? NB.pills(g.R, [{ id: "sentence", node }], () => filled && g.say(sentLn, node), { cls: "day-sentrow" }) : el("div", "njg-pills day-sentrow", g.R);
  if (!NB) row.appendChild(node);
  const pill = row.querySelector(".njg-pill") || node;
  // "Say it" (decision 9): the mic first, the three words after a try or a tap
  const sayBox = el("div", "day-sayit", g.R);
  const mic = el("button", "day-mic", sayBox);
  mic.type = "button";
  mic.setAttribute("aria-label", "");
  mic.innerHTML = `<i class="day-mic-ring"></i>${MIC}`;
  const picks = el("div", "day-picks", g.R);
  const words = page.choices.map((k) => ({ key: k, ln: g.wordLn(k), id: g.wordOf(k) }));
  const btns = words.map((w, i) => {
    const r = el("div", "day-pick", picks);
    r.dataset.k = String(i);
    const spk = el("button", "day-pick-spk", r);
    spk.type = "button";
    spk.setAttribute("aria-label", "");
    spk.innerHTML = SPK;
    const word = el("button", "day-pick-word", r);
    word.type = "button";
    const txt = api.render(w.ln, { cls: "day-inline" });
    // the Kutchi on the pill while it is still read (stage 5: the speaker only; SH-110: the speaker always there)
    if (g.stageOf(w.key) < 5) word.appendChild(txt);
    else word.classList.add("day-pick-blank");
    r._w = w;
    r._txt = txt;
    r._spk = spk;
    r._word = word;
    // F8: each speaker plays its own word at once (never behind her line; a second tap plays it again)
    spk.addEventListener("click", () => {
      spk.classList.add("on");
      window.Day.book.played = (window.Day.book.played || []).concat({ k: i, text: w.ln.text });
      g.sayNow(w.ln, txt).finally(() => spk.classList.remove("on"));
    });
    return r;
  });
  const ask = g.line("whatsThis");
  g.head(ask);
  const ai = page.choices.indexOf(page.answer);
  let picksIn = false;
  let firstTry = true;
  let listening = false;
  let done = null;
  const result = new Promise((r) => (done = r));
  const showPicks = () => {
    if (picksIn || filled) return;
    picksIn = true;
    sayBox.classList.add("gone");
    picks.classList.add("in");
    g.state("nameit-picks");
    g.expect(() => ({ kind: "tap", game: "nameit", sel: `.day-pick[data-k="${ai}"] .day-pick-word`, wrongSel: `.day-pick:not([data-k="${ai}"]) .day-pick-word`, speakers: ".day-pick-spk" }));
  };
  g.expect(() => ({ kind: "tap", game: "nameit", sel: ".day-mic", say: true }));
  g.state("nameit-say");
  await g.go;
  // the mic's templates: the family's own clips of the three words (none recorded yet: it hears nothing, a try still counts)
  const SP = await speech(g);
  const choiceIds = words.map((w) => w.id);
  if (SP && SP.loadTemplates) {
    words.forEach((w) => {
      const urls = ((w.ln.result && w.ln.result.clipPlan) || []).map((c) => c.file || c.url).filter(Boolean).map((u) => g.url(u));
      if (urls.length && !(SP.hasTemplates && SP.hasTemplates([w.id]))) SP.loadTemplates(w.id, urls).catch(() => 0);
    });
  }
  const micOk = () => !!(SP && SP.listen && !(SP.status && ["refused", "absent"].includes(SP.status())));
  const listen = async () => {
    if (listening || filled || picksIn) return;
    if (!micOk()) return showPicks();
    listening = true;
    g.quiet = true;
    mic.classList.add("listening");
    g.state("nameit-listening");
    let res = null;
    try {
      res = await SP.listen({ choices: choiceIds, timeoutMs: 4000 });
    } catch (e) {
      res = null;
    }
    listening = false;
    g.quiet = false;
    mic.classList.remove("listening");
    if (filled || picksIn) return;
    if (res && res.choice === g.wordOf(page.answer)) return done(words[ai]);
    // a miss is a shrug, never a wrong (the mic mishears: it never costs the first try): the words come
    once(mic, "day-shrug", 700);
    g.state("nameit-shrug");
    await realWait(500);
    showPicks();
  };
  mic.addEventListener("click", () => listen());
  g.say(ask).then(() => {
    // the mic listens quietly first where it already may (no permission asked unbidden)
    if (micOk() && SP.status && SP.status() === "ok") listen();
  });
  const stop = idler(g, () => g.say(ask));
  btns.forEach((b, i) =>
    b._word.addEventListener("click", () => {
      if (filled || !picksIn) return;
      if (i === ai) return done(b._w);
      firstTry = false;
      once(b, "day-wobble", 500);
      g.state("wrong-tap");
      setTimeout(() => {
        if (filled) return;
        const hl = g.headLine();
        if (hl) once(hl.parentElement, "day-again", 1500);
        g.say(ask);
      }, 700 / api.speed);
    }),
  );
  const chosen = await result;
  filled = true;
  stop();
  if (SP && SP.cancel) SP.cancel();
  g.record({ game: "nameit", key: page.answer, firstTry, via: picksIn ? "pick" : "voice" });
  g.expect(() => ({ kind: "wait", game: "nameit" }));
  // the right word goes into the gap ...
  const from = picksIn ? btns[ai] : mic;
  if (picksIn) btns[ai].classList.add("day-right");
  const a = from.getBoundingClientRect();
  const z = gap.getBoundingClientRect();
  from.style.transition = `transform ${450 / api.speed}ms ease-in-out, opacity ${450 / api.speed}ms`;
  from.style.transform = `translate(${z.left + z.width / 2 - (a.left + a.width / 2)}px, ${z.top + z.height / 2 - (a.top + a.height / 2)}px) scale(.8)`;
  await api.wait(480);
  from.style.opacity = "0";
  picks.classList.add("done");
  sayBox.classList.add("gone");
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
    const w = api.render(chosen.ln, { cls: "day-inline" });
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
  g.state("nameit-filled");
  // the word, then the sentence (the word is said once here: a pick's own speaker may have said it before)
  if (sentLn.ok) await g.say(sentLn, node.firstChild);
  else {
    await g.say(chosen.ln, node.firstChild);
    await g.say(sentLn, rec);
  }
}

// ---------------------------------------------------------------- stick in the photo
async function photo(g, page) {
  const { api, wrap } = g;
  wrap.classList.add("day-photo");
  const frameBox = el("div", "day-frame-box", g.L);
  const frame = el("div", "day-photo-frame", frameBox);
  ["tl", "tr", "bl", "br"].forEach((c) => el("i", `day-mount ${c}`, frame));
  // her sentence under the frame: a speaker at its start (it says it whole, the word too: never a memory test, SH-110), the
  // word a gap until its photo is in, small English under while the word is supported (ok lines only: a to-record line is its
  // English already)
  const under = el("div", "day-under", frameBox);
  const sentLn = g.line(["sentence", page.answer], page.answer);
  const sRow = el("div", "day-sentline", under);
  const sSpk = el("button", "day-sent-spk", sRow);
  sSpk.type = "button";
  sSpk.setAttribute("aria-label", "");
  sSpk.innerHTML = SPK;
  const r = api.render(sentLn);
  sRow.appendChild(r);
  const word = g.wordOf(page.answer);
  const enWord = (g.wordLn(page.answer).en || "").toLowerCase();
  const gaps = [];
  if (sentLn.ok) {
    r.querySelectorAll("[data-seg]").forEach((s) => {
      const seg = sentLn.result.segments[Number(s.dataset.seg)];
      if (seg && seg.w && (seg.w === word || g.sameWord(seg.w, word))) gaps.push(s);
    });
  } else {
    const p = r.querySelector(".day-k");
    const t = p ? p.textContent : "";
    const at = enWord ? t.toLowerCase().lastIndexOf(enWord) : -1;
    if (p && at >= 0) {
      p.textContent = "";
      p.append(t.slice(0, at));
      const s = el("span", "", p);
      s.textContent = t.slice(at, at + enWord.length);
      p.append(t.slice(at + enWord.length));
      gaps.push(s);
    }
  }
  gaps.forEach((s) => s.classList.add("day-gapword"));
  if (sentLn.ok && g.stageOf(page.answer) <= 2 && sentLn.en) {
    const en = el("p", "day-sent-en english", under);
    en.lang = "en";
    en.textContent = sentLn.en;
  }
  sSpk.addEventListener("click", () => {
    sSpk.classList.add("on");
    g.sayNow(sentLn, r).finally(() => sSpk.classList.remove("on"));
  });
  // the pictures, as word cards (the shared card's row: its picture, speaker, Kutchi and English by the word's stage)
  const W = window.WordCard;
  W.useCss(g.url("css/shared/word-card.css"));
  const loose = el("div", "day-loose", g.R);
  const photos = page.choices.map((key, i) => {
    const wl = g.wordLn(key);
    const kt = api.render(wl, { cls: "day-wline" });
    const p = W.row(
      loose,
      { id: g.wordOf(key), kutchi: kt, english: wl.en, rec: !wl.ok, picture: (box) => box.appendChild(g.thing(key, { photo: true })), say: () => g.sayNow(wl, kt) },
      { progress: g.progress, cls: "day-photo-loose", slots: { picture: true, english: g.stageOf(key) <= 2, kutchiText: g.stageOf(key) < 5 } },
    );
    p.dataset.k = String(i);
    p.dataset.thing = key;
    p.style.setProperty("--tilt", `${[-2, 1.5, -1][i % 3]}deg`);
    return p;
  });
  g.head(null);
  const ai = page.choices.indexOf(page.answer);
  g.expect(() => ({ kind: "drag", game: "photo", sel: `.day-photo-loose[data-k="${ai}"]`, to: ".day-photo-frame", wrongSel: `.day-photo-loose:not([data-k="${ai}"])` }));
  g.say(sentLn, r);
  const stop = idler(g, () => g.say(sentLn, r));
  // a new player's first drag: the kit's box round the card and the frame, the card showing the move (F9, F10)
  let help = () => {};
  g.go.then(() => {
    help = firstHelp(g, "day/book/photo", photos[ai], { delay: 900, drag: frame, spot: { live: [photos[ai]], finger: false } });
    g.cleanup(() => help(false));
  });
  let helped = false;
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
  const fillGap = (on) => gaps.forEach((s) => s.classList.toggle("day-gapword-in", on));
  photos.forEach((p) =>
    I.drag(
      p,
      {
        start() {
          helped = helped || !!document.querySelector('[data-help="day/book/photo"]');
          help(true);
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
            fillGap(true);
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
            // let go anywhere else: back to the page; the photo taken back out of the frame (until the page is turned)
            if (p === placed) {
              placed = null;
              p.classList.remove("day-in");
              frame.classList.remove("day-mounted");
              fillGap(false);
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
  help(true);
  g.record({ game: "photo", key: page.answer, firstTry, study: helped });
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
