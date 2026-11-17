/*
 * The end screen: one card that steps through two pages. First three badges with no words (the time, how many rows
 * were right, how much help was used), shown one after another; then the words of the order, each with its English
 * small beneath for the grown-up reading along. No verdict, no stars to earn, no sweets.
 *
 *   const end = createEndScreen({ stage, kit, say, sounds, endArt, state, words, onNext, onAgain, onLeave })
 *   end.page("words")     end.close()
 *   state: { timeMs, bestMs, timeTier, newBest, right, rows, rightTier, hints, hintTier }   tiers: gold | mid | plain
 */
const esc = (t) => String(t).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const svg = (body, w = 2.6) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const ARROW = svg(`<path d="M5 12h14M13 6l6 6-6 6"/>`);
const AGAIN = svg(`<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>`);
const GRID = svg(`<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>`, 2.2);

export function createEndScreen({ stage, kit, sounds, say, endArt, state, words, onNext, onAgain, onLeave }) {
  const E = kit.end;
  const file = (ref) => stage.art.file(ref);
  const clock = (ms) => {
    const secs = Math.round(ms / 1000);
    return secs < E.shortSecs ? `${secs}s` : `${Math.floor(secs / 60)}m ${secs % 60}s`;
  };
  const short = Math.round(state.timeMs / 1000) < E.shortSecs;
  const allRight = state.right === state.rows;
  const stars = E.stars.map(([x, y, at]) => `<i class="star" style="left:${x}%;top:${y}%;animation-delay:${at}s"></i>`).join("");
  const tile = (kind, tier, pic, under) => `<div class="btile ${kind} ${tier}"><div class="in"><div class="pic">${pic}</div><div class="under">${under}</div></div>${stars}</div>`;
  const el = document.createElement("div");
  el.className = "end";
  el.innerHTML = `<div class="end-card">
    <div class="badges">
      ${tile("time", state.timeTier, `<img class="burst" src="${file(endArt.burst)}" alt=""><img src="${file(endArt.stopwatch[state.timeTier])}" alt=""><span class="time${short ? "" : " long"}">${clock(state.timeMs)}</span>`, `<img src="${file(endArt.crown)}" alt=""><b>${clock(state.bestMs)}</b>`)}
      ${tile("rows", state.rightTier, `<img class="big" src="${file(endArt.tickGrey)}" alt=""><img class="big fill" src="${file(endArt.tick)}" alt=""><img class="big glow" src="${file(endArt.tickGlow)}" alt="">`, `<img src="${file(endArt.tick)}" alt="">× <b class="n">0</b>`)}
      ${tile("hints", state.hintTier, `<img class="bigger" src="${file(endArt.bulbs[Math.min(endArt.bulbs.length - 1, state.hints)])}" alt="">`, `<img src="${file(endArt.bulbIcon)}" alt="">× <b>${state.hints}</b>`)}
    </div>
    <div class="end-foot"><button class="end-btn main nudge" data-act="next" aria-label="Next">${ARROW}</button></div>
  </div>`;
  document.body.appendChild(el);
  const card = el.querySelector(".end-card");
  const tiles = [...el.querySelectorAll(".btile")];
  let open = true;
  el.querySelector("[data-act=next]").addEventListener("click", () => (sounds.play("tap"), onNext()));

  /** Count a number up on the page in a few steps. */
  async function count(node, to, steps, ms, show, each = () => {}) {
    for (let i = 1; i <= steps && open; i++) {
      node.textContent = show(Math.round((to * i) / steps));
      each();
      await wait(ms / steps);
    }
    node.textContent = show(to);
  }

  /** The show: the three tiles one after another. Before its turn a tile is empty. */
  async function show() {
    const [time, rows, hints] = tiles;
    time.classList.add("in-view");
    await wait(E.popMs);
    const secs = Math.round(state.timeMs / 1000);
    if (short) await count(time.querySelector(".time"), secs, Math.min(E.countSteps, Math.max(1, secs)), E.countMs, (n) => `${n}s`);
    if (!open) return;
    time.classList.add("burst-on");
    sounds.play(state.newBest ? "bing" : "sparkle");
    if (state.newBest) time.classList.add("cheer");
    await wait(E.waits[0]);
    if (!open) return;
    rows.classList.add("in-view");
    rows.querySelector(".fill").style.setProperty("--share", `${Math.round((100 * state.right) / Math.max(1, state.rows))}%`);
    await wait(E.popMs);
    await count(rows.querySelector(".n"), state.right, Math.min(state.right, E.tickSteps), E.tickMs, (n) => n, () => sounds.play("right", { volume: E.tickVolume }));
    if (!open) return;
    if (!allRight) sounds.play("oops", { volume: E.tickVolume });
    else {
      sounds.play("gold");
      rows.classList.add("all", "cheer");
    }
    await wait(E.waits[1]);
    if (!open) return;
    hints.classList.add("in-view");
    if (!state.hints) hints.classList.add("cheer");
  }
  show();

  return {
    page(name) {
      if (name !== "words") return;
      open = false;
      sounds.play("whoosh");
      const from = card.offsetHeight;
      const missed = words.filter((w) => !w.right);
      const right = words.filter((w) => w.right);
      const many = Math.max(missed.length, right.length);
      const tileOf = (w) => `<button class="wtile${w.right ? "" : " missed"}" data-i="${words.indexOf(w)}" aria-label="Hear ${esc(w.kutchi)}"><span class="ku">${esc(w.kutchi)}</span><span class="en"><i class="spk"></i>${esc(w.english)}</span></button>`;
      const group = (list, kind) => (list.length ? `<div class="wgroup ${kind}" style="--cols:${Math.min(E.wordCols, list.length)}">${list.map(tileOf).join("")}</div>` : "");
      card.innerHTML = `<div class="words slide${many > E.tightOver ? " tight" : ""}${many >= E.smallFrom ? " small" : ""}${missed.length ? " split" : ""}">${group(missed, "missed")}${missed.length && right.length ? `<i class="divider"></i>` : ""}${group(right, "right")}</div>
        <div class="end-foot slide"><button class="end-btn" data-act="again" aria-label="Again">${AGAIN}</button><button class="end-btn main" data-act="leave" aria-label="All games">${GRID}</button></div>`;
      const to = card.offsetHeight;
      card.style.height = `${from}px`;
      void card.offsetHeight;
      card.classList.add("easing");
      card.style.height = `${to}px`;
      wait(E.pageMs).then(() => (card.classList.remove("easing"), (card.style.height = "")));
      card.querySelectorAll(".wtile").forEach((t) =>
        t.addEventListener("click", async () => {
          t.classList.add("sounding");
          await say.speak(words[Number(t.dataset.i)].line);
          t.classList.remove("sounding");
        })
      );
      card.querySelector("[data-act=again]").addEventListener("click", onAgain);
      card.querySelector("[data-act=leave]").addEventListener("click", onLeave);
    },
    close() {
      open = false;
      el.remove();
    },
  };
}
