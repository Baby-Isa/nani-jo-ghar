/*
 * The end-of-round pop-up (docs/design-language/ux-principles.md s9, redrawn by s9a; one stepped
 * card since docs/design-language/ui-design-system.md s10). The same steps in every mode:
 *   page 1: three big badges side by side (stacked on a narrow phone).
 *           Time: a stopwatch outline with the time drawn inside it (per-
 *           profile best per mode+game+level); gold+buzzing on a new best,
 *           dim gold within ~25% of it, grey otherwise. Accuracy: a big
 *           chunky tick that fills gold (right) / grey (wrong) like a
 *           gauge (the app's theme, never red/green); gold+shimmer when every row is right. Hints: a big
 *           light bulb, brighter with fewer hints, off at 3+. Then a big
 *           Next.
 *   page 2: the word review (each key Kutchi word with its English, tap to
 *           hear it) -- right words outlined gold and grouped on the right,
 *           wrong ones outlined red and grouped on the left -- in the same
 *           card, with the actions at its foot: Done (and Play again when the
 *           mode offers it), or the mode's own opts.actions.
 *
 *   await Results.show({mode, game, level, timeMs, right, total, hints,
 *                       words: [{kutchi, english, audio?, id?, right?}],
 *                       onDone(out), onAgain?(out), speak?(word), container?,
 *                       actions?: [{id, label?, icon?, primary?, elId?}], onAction?(out),
 *                       sound?: true, store?: UIStore})
 *     -> out = {action: "done" | "again" | an actions id, badges, best: {ms, newBest, first}}
 *
 * A word's `right` (true/omitted = got it, false = missed it) decides which
 * side of page 2 it groups on. A caller with no per-word verdict (nothing
 * passed) just shows every word on the right, gold -- same as before.
 *
 * The badges stay mapped to the existing stars underneath (s9): Accuracy
 * gold <=> the ear star, Hints gold <=> the no-help star. Results.toStars
 * and Results.fromStars are that mapping, so progress and word stages are
 * unchanged.
 *
 * Pure (Node-testable): bestKey, seconds, clock, judgeTime, accuracyTier,
 * hintTier, badges, recordTime, toStars, fromStars.
 *
 * Plain <script>: window.Results (and Shared.results); Node: require().
 * Loads after js/shared/uistore.js and js/shared/sfx.js (both optional).
 */
(function (root, factory) {
  const Results = factory(root);
  if (typeof module === "object" && module.exports) module.exports = Results;
  else {
    root.Results = Results;
    (root.Shared = root.Shared || {}).results = Results;
  }
})(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const Results = {};
  const store = (o) => (o && o.store) || root.UIStore || (typeof require === "function" ? require("./uistore.js") : null);

  /* ---------------- pure ---------------- */

  /** The personal-best key: one best per mode, game (mini-game) and level. */
  Results.bestKey = (mode, game, level) => `${mode || "?"}/${game || "-"}/L${level == null ? 1 : level}`;
  /** Whole seconds, as the stopwatch shows them. */
  Results.seconds = (ms) => Math.max(0, Math.round((ms || 0) / 1000));
  /** "52s" up to 100s, then minutes and seconds: "1m 52s" (UX 9a). */
  Results.clock = function (ms) {
    const s = Results.seconds(ms);
    if (s < 100) return `${s}s`;
    return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
  };

  /**
   * This round's time against the stored best.
   *   first    no best yet: this time becomes the best, quietly (nothing beaten)
   *   newBest  faster by at least one whole shown second: bing, sparkle, "New best!"
   * A time that ties the shown seconds but is faster in ms updates the
   * stored best without a fanfare. Time is never shamed: tier is gold for
   * a new best (or the first-ever time, shown quietly), "mid" (dim gold)
   * within about 25% of the best, else "plain" (grey) (UX 9a).
   */
  Results.judgeTime = function (timeMs, prevMs) {
    const has = prevMs != null && isFinite(prevMs);
    const first = !has;
    const newBest = has && Results.seconds(timeMs) < Results.seconds(prevMs);
    const bestMs = has ? Math.min(prevMs, timeMs) : timeMs;
    const tier = first || newBest ? "gold" : timeMs <= prevMs * 1.25 ? "mid" : "plain";
    return { seconds: Results.seconds(timeMs), timeMs, prevMs: has ? prevMs : null, bestMs, first, newBest, changed: bestMs !== prevMs, tier };
  };
  /** gold = all right; mid = at least 60% right; plain below; none = nothing was asked. */
  Results.accuracyTier = function (right, total) {
    if (!total) return "none";
    if (right >= total) return "gold";
    return right / total >= 0.6 ? "mid" : "plain";
  };
  /** 0 hints gold, 1 middling, 2 or more plain. The light bulb counts. */
  Results.hintTier = (hints) => (!hints ? "gold" : hints === 1 ? "mid" : "plain");

  /** All three badges for a round. prevBestMs is the stored best (or null). */
  Results.badges = function (r, prevBestMs) {
    const right = Math.max(0, Math.min(r.right || 0, r.total || 0));
    return {
      time: r.timeMs == null ? null : Results.judgeTime(r.timeMs, prevBestMs),
      accuracy: { right, total: r.total || 0, wrong: (r.total || 0) - right, tier: Results.accuracyTier(right, r.total || 0), marks: r.marks || null },
      hints: { count: r.hints || 0, tier: Results.hintTier(r.hints || 0) },
    };
  };

  /** Read the stored best, judge this time, store the new best. Returns judgeTime's answer. */
  Results.recordTime = function (mode, game, level, timeMs, opts) {
    const S = store(opts);
    const key = Results.bestKey(mode, game, level);
    const prev = S ? S.get("bests", key) : undefined;
    const j = Results.judgeTime(timeMs, prev);
    if (S && j.changed) S.set("bests", key, j.bestMs);
    return Object.assign(j, { key });
  };
  Results.best = (mode, game, level, opts) => {
    const S = store(opts);
    return S ? S.get("bests", Results.bestKey(mode, game, level)) : undefined;
  };

  /**
   * Badges -> the existing stars (craft, ear, no-help), so progress is
   * unchanged. ear: all right (or, given rows and js/shared/stars.js, the
   * mode's own ear rule: "untested" counts as not lost); third: no hints
   * (in Busy the mode keeps its own "quick" rule and passes third); hand:
   * the craft star is the mode's own and passes straight through (default
   * true).
   */
  Results.toStars = function (r) {
    const S = root.Stars || (typeof require === "function" && typeof module === "object" ? require("./stars.js") : null);
    let ear;
    if (r.rows && S) ear = S.ear(r.rows, r.mode).state !== "lost";
    else ear = !r.total || (r.right || 0) >= r.total;
    return { ear, hand: r.hand != null ? !!r.hand : true, third: r.third != null ? !!r.third : !(r.hints || 0) };
  };
  /**
   * The existing stars (and whatever counts the mode has) -> show()'s
   * fields, for a mode that only tracks stars today, e.g. Cook:
   *   Results.fromStars(stars, {help: ctx.help, total: rows, right})
   * Unknown counts are filled so the badge tiers match the stars: an ear
   * without counts is 1/1 or 0/1; hints without a count are 0 or 1.
   */
  Results.fromStars = function (stars, extra) {
    extra = extra || {};
    const total = extra.total != null ? extra.total : 1;
    const right = extra.right != null ? extra.right : stars.ear ? total : Math.max(0, total - 1);
    const hints = extra.help != null ? extra.help : extra.hints != null ? extra.hints : stars.third ? 0 : 1;
    return { right, total, hints };
  };

  /* ---------------- the screen ---------------- */
  if (typeof document === "undefined") return Results;

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const svg = (body, vb = "0 0 24 24") => `<svg viewBox="${vb}" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  const ICON = {
    check: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
    speaker: svg('<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>'),
    next: svg('<path d="M5 12h13M13 6l6 6-6 6"/>'),
    again: svg('<path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v4.5h4.5"/>'),
    home: svg('<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/>'),
    grid: svg('<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>'),
    spark: svg('<path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" fill="currentColor"/>'),
  };
  Results.ICONS = ICON;
  const reduced = () => !!(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const sfx = (name, o) => root.Sfx && root.Sfx.play(name, o);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  // this script's own folder (however deep the page that loaded it sits),
  // so assets/ui/results/*.webp resolves from any page; njgV()/Cook.v()
  // then stamps it for cache-busting (UX 9a: no more inline-SVG badges).
  const scriptBase = (() => {
    try {
      const src = document.currentScript && document.currentScript.getAttribute("src");
      const m = src && src.match(/^(.*?)js\/shared\/results\.js(?:[?#].*)?$/);
      return m ? m[1] : "";
    } catch (e) {
      return "";
    }
  })();
  const v = root.njgV || ((u) => u);
  const IMG = (name) => v(`${scriptBase}assets/ui/results/${name}.webp`);
  const img = (cls, name, style) => `<img class="${cls}" src="${esc(IMG(name))}" alt=""${style ? ` style="${style}"` : ""}>`;

  /* -------- the big badges (UX 9a): photoreal stopwatch, tick and bulb art,
     no circle behind them -- each sits straight in its square card. -------- */
  /** The stopwatch: gold+glow (new best), dim gold (good) or grey (plain), by tier. */
  function watchImg(tier) {
    return img("rs-watch", tier === "gold" ? "stopwatch-pb" : tier === "mid" ? "stopwatch-good" : "stopwatch-plain");
  }
  /** A big chunky tick: a grey pewter tick underneath, a gold tick layered on top
   * clipped to the share right (CSS clip-path by percentage; gold+grey, never
   * red/green), or the shining gold-with-glow art when all right. */
  function tickImg(rw) {
    // The tick art sits in a canvas with ~10.9% transparent margin each side
    // (build/cut_tick_v2.py), so map the share right onto the tick's own width.
    const eff = 10.9 + (rw * 78.2) / 100;
    return img("rs-tick-base", "tick-grey") + img("rs-tick-right", "tick-gold", `--rw:${eff.toFixed(1)}%`) + img("rs-tick-gold", "tick-gold-glow");
  }
  /** A big light bulb: which art shows is set by CSS off data-hn (0, 1, 2, 3+). */
  function bulbImgs() {
    return ["0", "1", "2", "3"].map((n) => img(`rs-lamp rs-lamp-${n}`, `bulb-${n}`)).join("");
  }

  /** Play one word: the mode's hook, else its own recording, else Cook's audio path (Lang), else the local TTS placeholder. */
  Results.speakWord = function (w, speak) {
    if (speak) return Promise.resolve(speak(w));
    if (w.audio) {
      return new Promise((resolve) => {
        try {
          const a = new Audio(w.audio);
          a.onended = a.onerror = () => resolve(true);
          a.play().catch(() => resolve(fallback(w)));
        } catch (e) {
          resolve(fallback(w));
        }
      });
    }
    return fallback(w);
  };
  function fallback(w) {
    if (w.id && root.Lang && root.Lang.speakWord && root.Cook && root.Cook.data && root.Cook.data.words && root.Cook.data.words[w.id]) return root.Lang.speakWord(w.id);
    if (root.NjgAudio && root.NjgAudio.speakRaw) return root.NjgAudio.speakRaw(w.kutchi);
    if (!root.speechSynthesis || !w.kutchi) return Promise.resolve(false);
    return new Promise((resolve) => {
      const u = new SpeechSynthesisUtterance(w.kutchi);
      u.rate = 0.85;
      u.onend = u.onerror = () => resolve(true);
      root.speechSynthesis.speak(u);
      setTimeout(() => resolve(false), 4000);
    });
  }

  function timeBadge(t) {
    if (!t) return "";
    const bestLine = t.first
      ? `<span class="rs-best first">${img("rs-cap-icon", "icon-crown")}<b>${esc(Results.clock(t.bestMs))}</b></span>`
      : `<span class="rs-best">${img("rs-cap-icon", "icon-crown")}<b>${esc(Results.clock(t.newBest ? t.bestMs : t.prevMs))}</b></span>`;
    return `<div class="rs-badge rs-time tier-${t.tier}" data-badge="time" aria-label="Time ${t.seconds} seconds${t.newBest ? ", a new best" : ""}">
      <div class="rs-disc">${watchImg(t.tier)}<span class="rs-big${t.seconds >= 100 ? " long" : ""}" data-to="${t.seconds}">${esc(Results.clock(t.timeMs))}</span>
        <span class="rs-sparkles" aria-hidden="true">${ICON.spark.repeat(6)}</span></div>
      <div class="rs-foot">${bestLine}</div>
      <div class="rs-ribbon" ${t.newBest ? "" : "hidden"}>New best!</div>
    </div>`;
  }
  function accuracyBadge(a) {
    // CLN-79 (2 Oct): a round with nothing to judge never shows a dash: the tick is whole (nothing went wrong) and
    // its foot says so with a gold tick, the badge's own picture, never a number or a "–"
    const rw = a.total ? (100 * a.right) / a.total : 100;
    return `<div class="rs-badge rs-acc tier-${a.tier === "none" ? "mid" : "pending"}" data-badge="accuracy" data-tier="${a.tier}" aria-label="${a.right} right out of ${a.total}">
      <div class="rs-disc">${tickImg(rw)}
        <span class="rs-sparkles" aria-hidden="true">${ICON.spark.repeat(6)}</span></div>
      <div class="rs-foot">${a.total ? `<b class="rs-n">0</b><span class="rs-of">/${a.total}</span>` : `<span class="rs-of rs-none" aria-hidden="true">&#10003;</span>`}</div>
    </div>`;
  }
  function hintsBadge(h) {
    const hn = h.count >= 3 ? "3" : String(h.count);
    return `<div class="rs-badge rs-hints tier-${h.tier}" data-badge="hints" data-hn="${hn}" aria-label="${h.count} hints">
      <div class="rs-disc">${bulbImgs()}
        <span class="rs-sparkles" aria-hidden="true">${ICON.spark.repeat(6)}</span></div>
      <div class="rs-foot"><span class="rs-hint-count">${img("rs-cap-icon", "icon-bulb")}<b>&times; ${h.count}</b></span></div>
    </div>`;
  }
  /**
   * D12 (1 Oct, decision 27): the eye badge, only at closed-card levels (opts.looks a number): the eye is for
   * reading, apart from the bulb. Gold with no looks, dimmer per look, "× n" under it. A flat stand-in eye until
   * its art is made (the art list).
   */
  const EYE = `<svg class="rs-eye-art" viewBox="0 0 64 40" aria-hidden="true"><path d="M2 20 Q32 -6 62 20 Q32 46 2 20Z" fill="#fffaf0" stroke="currentColor" stroke-width="4"/><circle cx="32" cy="20" r="10" fill="currentColor"/><circle cx="35" cy="17" r="3" fill="#fffaf0"/></svg>`;
  Results.lookTier = (n) => (!n ? "gold" : n === 1 ? "mid" : "plain");
  function lookBadge(n) {
    const ln = n >= 3 ? "3" : String(n);
    return `<div class="rs-badge rs-looks tier-${Results.lookTier(n)}" data-badge="looks" data-ln="${ln}" aria-label="${n} looks">
      <div class="rs-disc">${EYE}<span class="rs-sparkles" aria-hidden="true">${ICON.spark.repeat(6)}</span></div>
      <div class="rs-foot"><span class="rs-hint-count">${EYE.replace("rs-eye-art", "rs-cap-icon")}<b>&times; ${n}</b></span></div>
    </div>`;
  }
  /**
   * D14 (1 Oct, decision 27; Mum: "I don't know what I got wrong"): the steps a round asked for, tapped open from
   * the tick badge: each step's line with a gold or grey tick, and for a wrong one what was done.
   * steps: [{label: {kutchi, english}, ok, done?}]
   */
  function stepsHtml(steps) {
    const row = (x) => {
      const l = x.label || {};
      // an English placeholder inside a Kutchi line ([wax]) is grey italic, never shown with its brackets (G2)
      const ph = (t) => esc(t).replace(/\[([^\]]*)\]/g, '<i class="rs-ph-in">$1</i>');
      const k = l.kutchi ? `<b>${ph(l.kutchi)}</b>` : `<b class="rs-ph">${esc(l.english || "")}</b>`;
      return `<li class="rs-step ${x.ok ? "ok" : "bad"}"><span class="rs-step-tick" aria-hidden="true">&#10003;</span><span class="rs-step-text">${k}${l.kutchi && l.english ? `<small>${esc(l.english)}</small>` : ""}</span>${!x.ok && x.done != null ? `<span class="rs-step-done">${esc(x.done)}</span>` : ""}</li>`;
    };
    return `<div class="rs-steps-list" hidden role="dialog" aria-label="The steps"><ul>${steps.map(row).join("")}</ul></div>`;
  }
  /**
   * Page 2: right words outlined gold, grouped on the right; wrong words outlined red, grouped on
   * the left (UX 9a; Zafar 28 Sept: gold is the theme, red makes you want to fix it). Each side is
   * as wide as its share of the words: one to three columns (then more rows), its width in proportion.
   */
  Results.wordCols = (n) => (n ? Math.min(3, n) : 0);
  function wordsHtml(words) {
    const card = (w, i) => `<button class="rs-word ${w.right === false ? "bad" : "ok"}" type="button" data-i="${i}" aria-label="Hear ${esc(w.kutchi)}">
          ${w.kutchi ? `<b>${esc(w.kutchi)}</b>` : `<b class="rs-ph">${esc(w.english || "")}</b><small class="rs-rec">to record</small>`}<span class="rs-en"><span class="rs-say">${ICON.speaker}</span>${w.kutchi ? esc(w.english) : ""}</span></button>`;
    const bad = [];
    const ok = [];
    words.forEach((w, i) => (w.right === false ? bad : ok).push(card(w, i)));
    const col = (cls, list) => `<div class="rs-words-col ${cls} c${Results.wordCols(list.length)}" style="--rs-cols:${Results.wordCols(list.length)}">${list.join("")}</div>`;
    return col("rs-words-bad", bad) + col("rs-words-ok", ok);
  }

  // the page-1 show: badges pop in one by one; the stopwatch counts up; the tick gauge fills
  async function animate(el, b, opts) {
    const calm = reduced();
    const beat = calm ? 0 : 1;
    const badges = [...el.querySelectorAll(".rs-badge")];
    badges.forEach((x) => x.classList.add(calm ? "in" : "pre"));
    const sound = opts.sound !== false;
    for (const x of badges) {
      if (!el.isConnected) return;
      x.classList.remove("pre");
      x.classList.add("in");
      const kind = x.dataset.badge;
      if (kind === "time" && b.time) {
        const big = x.querySelector(".rs-big");
        if (!calm && b.time.seconds < 100) {
          const n = b.time.seconds;
          const steps = Math.min(n, 20);
          for (let i = 1; i <= steps; i++) {
            big.textContent = String(Math.round((n * i) / steps));
            await wait(700 / Math.max(steps, 1));
          }
        }
        big.textContent = Results.clock(b.time.timeMs);
        if (b.time.newBest) {
          x.classList.add("celebrate");
          if (sound) sfx("bing");
        }
        await wait(350 * beat);
      } else if (kind === "accuracy") {
        const a = b.accuracy;
        const n = x.querySelector(".rs-n");
        const right = x.querySelector(".rs-tick-right");
        if (right) right.classList.add("filled");
        if (a.total && !calm) {
          if (a.right) {
            const steps = Math.min(a.right, 12);
            for (let i = 1; i <= steps; i++) {
              if (n) n.textContent = Math.round((a.right * i) / steps);
              if (sound) sfx("right", { volume: 0.5 });
              await wait(600 / steps);
            }
          } else await wait(300);
          if (a.wrong && sound) sfx("wrong", { volume: 0.5 });
        }
        if (n) n.textContent = a.right;
        x.classList.remove("tier-pending");
        x.classList.add(`tier-${a.tier === "none" ? "mid" : a.tier}`);
        if (a.tier === "gold") {
          x.classList.add("celebrate");
          if (sound) sfx("gold");
        }
        await wait(350 * beat);
      } else if (kind === "hints") {
        if (b.hints.tier === "gold") x.classList.add("celebrate");
        await wait(250 * beat);
      } else if (kind === "looks") {
        if (x.dataset.ln === "0") x.classList.add("celebrate");
        await wait(250 * beat);
      }
    }
  }

  let current = null;
  /** The buttons on the last step: the mode's own actions, else Play again (when offered) and Done. */
  function actionsHtml(opts) {
    if (opts.actions && opts.actions.length) {
      return opts.actions
        .map((a) => {
          // E1 (no written English for the child): the actions are pictures; a label is for grown-ups' screen readers only (R3a)
          const icon = ICON[a.icon] || ICON[{ list: "grid", home: "home" }[a.id] || a.id] || "";
          const cls = ["rs-btn", "rs-act", `rs-act-${esc(a.id)}`, a.primary ? "primary" : ""].filter(Boolean).join(" ");
          return `<button class="${cls}" type="button" data-act="${esc(a.id)}"${a.elId ? ` id="${esc(a.elId)}"` : ""} aria-label="${esc(a.label || a.id)}" title="${esc(a.label || a.id)}">${icon}</button>`;
        })
        .join("");
    }
    return `${opts.onAgain ? `<button class="rs-btn rs-again" type="button" data-act="again" aria-label="Play again">${ICON.again}</button>` : ""}
          <button class="rs-btn rs-done" type="button" data-act="done" aria-label="Done">${ICON.check}</button>`;
  }
  /**
   * Show the end-of-round pop-up. Resolves when an action is tapped.
   * Design system 10 (Zafar, 28 Sept, late): ONE pop-up card that steps through
   *   1. the three badges -> Next;
   *   2. the word review, inside the same card (same surface, same padding);
   *   3. on that last step, the action buttons at the bottom of the card.
   * opts.actions: [{id, label?, icon? ("again", "next", "check", "grid"), primary?, elId?}] replaces the
   * default Play again / Done; the promise resolves with out.action = the tapped action's id.
   */
  Results.show = function (opts) {
    opts = opts || {};
    if (current) current.close();
    const S = store(opts);
    const timed = opts.timeMs != null;
    const time = timed ? Results.recordTime(opts.mode, opts.game, opts.level, opts.timeMs, { store: S }) : null;
    const b = Results.badges(opts, time ? time.prevMs : null);
    if (time) b.time = time;
    const words = (opts.words || []).filter((w) => w && (w.kutchi || w.english));
    const looks = typeof opts.looks === "number" ? opts.looks : null;
    const steps = Array.isArray(opts.steps) ? opts.steps.filter((x) => x && x.label) : [];
    const host = opts.container || document.body;
    const el = document.createElement("div");
    el.className = "njg-results";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", "End of the round");
    // no words: the badges step is the last one, so the actions sit under the badges
    const acts = `<div class="rs-actions rs-last">${actionsHtml(opts)}</div>`;
    el.innerHTML = `
      <div class="rs-card" data-step="1">
        <div class="rs-steps">
          <div class="rs-page rs-p1" data-page="1">
            <div class="rs-badges n${(timed ? 3 : 2) + (looks != null ? 1 : 0)}">${timeBadge(b.time)}${accuracyBadge(b.accuracy)}${hintsBadge(b.hints)}${looks != null ? lookBadge(looks) : ""}</div>
            ${steps.length ? stepsHtml(steps) : ""}
          </div>
          ${words.length ? `<div class="rs-page rs-p2" data-page="2" aria-hidden="true"><div class="rs-words">${wordsHtml(words)}</div></div>` : ""}
        </div>
        ${words.length ? `<div class="rs-actions rs-first"><button class="rs-btn rs-next primary" type="button" aria-label="Next">${ICON.next}</button></div>` : ""}
        ${words.length ? acts.replace('class="rs-actions rs-last"', 'class="rs-actions rs-last" hidden') : acts}
      </div>`;
    host.appendChild(el);
    // a page can hide what must not show behind the pop-up (Cook: the old menu card; design system 10)
    document.documentElement.classList.add("njg-results-open");
    if (root.Sfx) root.Sfx.unlock();
    const card = el.querySelector(".rs-card");

    let resolveOut;
    const done = new Promise((r) => (resolveOut = r));
    const out = (action) => ({ action, badges: b, best: time ? { ms: time.bestMs, newBest: time.newBest, first: time.first, key: time.key } : null });
    const finish = (action) => {
      const o = out(action);
      close();
      if (action === "again" && opts.onAgain) opts.onAgain(o);
      else if (action === "done" && opts.onDone) opts.onDone(o);
      if (opts.onAction) opts.onAction(o);
      resolveOut(o);
    };
    const close = () => {
      if (!el.isConnected) return;
      el.classList.add("leaving");
      setTimeout(() => el.remove(), reduced() ? 0 : 220);
      if (current && current.el === el) current = null;
      if (!current) document.documentElement.classList.remove("njg-results-open");
    };
    current = { el, close, page: () => +card.dataset.step };

    const toWords = () => {
      const p1 = el.querySelector(".rs-p1");
      const p2 = el.querySelector(".rs-p2");
      // the card takes the words' own height (balanced, no empty band above the buttons), easing from the badges' height
      const h0 = card.getBoundingClientRect().height;
      card.dataset.step = "2";
      p1.setAttribute("aria-hidden", "true");
      p2.removeAttribute("aria-hidden");
      const h1 = card.getBoundingClientRect().height;
      if (!reduced() && card.animate && Math.abs(h1 - h0) > 2) card.animate([{ height: `${h0}px` }, { height: `${h1}px` }], { duration: 280, easing: "cubic-bezier(.3,.7,.2,1)" });
      p2.classList.add("enter");
      el.querySelector(".rs-first").hidden = true;
      const last = el.querySelector(".rs-last");
      last.hidden = false;
      last.classList.add("enter");
      if (opts.sound !== false) sfx("whoosh");
      // focus stays on the card (tabbing reaches the words, then the actions), so nothing looks picked out
      card.focus({ preventScroll: true });
    };
    const next = el.querySelector(".rs-next");
    if (next)
      next.addEventListener("click", () => {
        if (opts.sound !== false) sfx("tap");
        toWords();
      });
    el.querySelectorAll(".rs-last [data-act]").forEach((btn) => btn.addEventListener("click", () => finish(btn.dataset.act)));
    el.querySelectorAll(".rs-word").forEach((btn) =>
      btn.addEventListener("click", () => {
        const w = words[+btn.dataset.i];
        btn.classList.add("on");
        Promise.resolve(Results.speakWord(w, opts.speak))
          .catch(() => {})
          .then(() => btn.classList.remove("on"));
      })
    );
    // D14: tap the tick badge to see the steps (which went wrong); tap again (or the list) to close it
    const acc = el.querySelector(".rs-acc");
    const list = el.querySelector(".rs-steps-list");
    if (acc && list) {
      acc.classList.add("rs-tappable");
      acc.setAttribute("role", "button");
      acc.setAttribute("tabindex", "0");
      const toggle = () => {
        list.hidden = !list.hidden;
        acc.classList.toggle("open", !list.hidden);
      };
      acc.addEventListener("click", toggle);
      list.addEventListener("click", toggle);
    }
    // focus into the dialog (the card itself, so no button shows a ring before it's needed)
    card.setAttribute("tabindex", "-1");
    card.focus({ preventScroll: true });
    animate(el, b, opts);
    done.el = el;
    return done;
  };
  /** The open screen, for tests: {el, page(), close()} or null. */
  Results.current = () => current;
  return Results;
});
