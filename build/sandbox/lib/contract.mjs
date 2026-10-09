// The contract checks (decision 75, rule C19): Zafar's "everywhere" rules, measured on every flow the sandbox plays, from what
// was on screen (the contract probe, lib/contract-hook.mjs) and what was heard (the sound hook, lib/sound.mjs), never from the
// game's code, so they hold whatever the shared host becomes. One check per contract item:
//
//   contract-1 popup     every play phase that gives an order opens with the shared request pop-up, read out, then folds
//                        into the sidebar
//   contract-2 moves-on  where the outcome is obvious the game moves on by itself: no ✓, Next or stage button once the
//                        step's result is decided
//   contract-3 voice     every stage and game end stops all voice: no line starts or keeps playing after its stage ended
//   contract-4 bubble    every speech bubble sits above (or, without room, below) its speaker's head, never in a corner
//   contract-5 badges    end-screen badges appear one, two, three in order
//   contract-6 old-art   no retired art drawn where a replacement exists (build/sandbox/data/retired-art.json)
//
// And the measurable halves of the other "every game" rows of docs/process/regressions.md (s04-f2; the rest of those rows are
// eye checks on the sprint check sheets):
//
//   contract-7 one-voice    one voice at a time: no two lines' clips sound over each other (PAN-04)
//   contract-8 highlight    one next-thing highlight at a time (SH-53)
//   contract-9 closed-card  from L3 the card is closed in the waiting room, the pharmacy and every heal game (CLN-114)
//   contract-10 your-turn   the staged talkers face the player when it is the child's turn (SH-71)
//   contract-11 background  no background stretched out of proportion (PAN-14) or drawn low-res (ART-05)
//   contract-12 greyed      a ✓ / Next / stage button is hidden until usable, never shown greyed (SH-23)
//   contract-13 stale-ui    no reply pill from an earlier stage left on screen (CLN-06)
//   contract-14 talk        one talk animation: no bob bigger or faster than the shared one, no other talk animation (ART-18)
//
// analyse(result, {retired, clip}) -> [{check, item, flow, level, size, state, shot, at, measured}]. A break is never
// ratcheted into the baseline: --check and --contract fail on any (exit 1).
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

export const CHECKS = {
  "contract-1": { item: "popup", title: "pop-up before play", how: "Splits the flow into stages (a Cook station from Cook.inStation, else the game host's stage) and finds each stage's first real tap in the play area. A stage that gives an order (a line said before that tap outside a pop-up, a new order card in the sidebar, or the first stage with a card) must have had the request pop-up (.njg-rq-open, Cook's #intro) on screen since the last stage ended; a line must start while it is up (read out) unless a tap closed it at once; within 2 s of closing an order card must show in the sidebar (folded)." },
  "contract-2": { item: "moves-on", title: "moves on by itself", how: "Every ✓, Next or stage button seen on screen (.cl-go, #done-btn, a button reading ✓ or →, aria 'next'/'done') and every press of one is judged with what the game expected at that moment: if it expected only that button (the clinic between stages or kind 'button', a heal game's 'button' step, Cook clicking that selector), the step was already decided, so the button is a break. A ✓/Done that lets the child take things back until Done (non-negotiable 12) is not: Cook's count or 'more' step, an expectation that offers a take-back (undo), Cook's pictures still taking taps (live: chaat's bowl, where more taps still change the result), a heal game's count it reported uncapped (ctx.tally without capped: the child decides when it's enough, C10). A capped count (ctx.tally {capped}) that stopped taking input and still shows its ✓ is a break (decision 79)." },
  "contract-3": { item: "voice", title: "voice stops at every stage end", how: "Every clip's real start, length (the decoded buffer or the file's own length) and stop (ended, stop, pause, cancel) from the sound log; each belongs to the line (and so the stage) it was said for. A stage ends when the shared lifecycle logged its stage-end (Lifecycle.log, at its own millisecond; else the sampled stage change), so a line queued after the stop belongs to the next stage. A clip still sounding 250 ms after its stage ended, or started after it, is a break." },
  "contract-4": { item: "bubble", title: "bubble at the speaker's head", how: "Every speech bubble's box and tail (its ::after / ::before) against its speaker's head on screen: a Cook character's sprite (the top quarter of the figure), the clinic figure's head (its measured head anchor on the art, data/clinic/heal-art.json, else the art's top fifth), the doctor's figure. The tail (or the bubble) must be in the head's column and the bubble above it (or below it); a bubble beside the head, away from it or in a corner of the screen is a break." },
  "contract-5": { item: "badges", title: "badges in order", how: "While the end screen is up, every 40 ms: does anything of each badge show (its parts' opacity, or a picture on its spot from outside it). Each must first show after the one before it." },
  "contract-6": { item: "old-art", title: "no retired art", how: "Every image drawn (canvas drawImage, offscreen canvases a rig draws from, <img>, CSS backgrounds, Phaser WebGL textures) by file; a file on the retired list with the same content (sha256), in its scope, is a break." },
  "contract-7": { item: "one-voice", title: "one voice at a time", how: "Every clip said for a line (the sound log, its real start and stop as contract-3 reads them); two clips of different lines sounding together for more than 150 ms is a break (PAN-04: the count words, the next-thing line and the order never overlap). Clips whose length is only estimated are not judged." },
  "contract-8": { item: "highlight", title: "one highlight at a time", how: "Sampled on every change: Cook's pictures carrying the shared glow (glowFx) and the clinic's next-up or pulsing tools (a tool family, all the plasters, is one highlight). More than one at once for 300 ms or more is a break (SH-53)." },
  "contract-9": { item: "closed-card", title: "closed card from L3", how: "At the first play tap of the waiting room, the pharmacy or a heal game at level 3 or more: every order card in the sidebar must be closed (OrderCard 'closed': folded, peeking or open for the bulb's time). An open card is a break (CLN-114)." },
  "contract-10": { item: "your-turn", title: "faces the player on the child's turn", how: "At every play tap the clinic asked for (it expected a tap or a pick, not 'wait'), every staged talker on screen (the staging hook's .cl-staged, data-pose) must face the player (data-pose 'front'); still turned to the other talker is a break (SH-71, rules E20, F26). Cook has no poses yet: an eye check." },
  "contract-11": { item: "background", title: "backgrounds in proportion and sharp", how: "Every picture covering half the screen or Cook's canvas (<img>, CSS background, Phaser image): screen px per source px across and down. Across and down differing by more than 3% is stretched (PAN-14); more than 1.5 screen px per source px (times the page's pixel ratio) is low-res (ART-05). Either is a break." },
  "contract-12": { item: "greyed", title: "buttons hidden until usable", how: "A ✓, Next or stage button on screen while disabled, aria-disabled, dimmed under 60% or greyscale, for 400 ms or more and not just pressed (1.5 s before), is a break: hidden until usable, never greyed (SH-23)." },
  "contract-13": { item: "stale-ui", title: "each stage clears its own UI", how: "Each reply pill (.cl-pill, .njg-pill, .cv-pill, .st-reply, .st-choice; not the sidebar's) remembers the stage it was first seen in; still on screen 600 ms into a later play stage is a break (CLN-06)." },
  "contract-14": { item: "talk", title: "one talk animation", how: "Every 400 ms: Cook's characters' repeating tweens (yoyo) and the play area's endless CSS talk or bob animations (cards, the guide box and the pop-up are not the play area). A tween lifting or tilting more than the shared Lifecycle.talk.SPEC (2 px, 0.4°) or faster than its 380 ms, or a CSS talk animation other than njg-talk, is a break (ART-18)." },
};

// the route the contract run plays by default (run.mjs --contract with no --flow): what Zafar played on 8 Oct and the places his
// rules were caught. Also the sample build/tools/review/sprintcheck.mjs plays for a row about every game
export const CONTRACT_ROUTE = ["cook:chop", "lab:cook/chop", "cook:chaat@L4", "cook:fetch#speed1", "lab:cook/round#speed1", "clinic:waiting", "clinic:diagnosis", "clinic:heal-knee@L2", "clinic:morning"];

const TOL = 250; // ms a voice may run past its stage end (one audio frame of fade, the sampling)
const OVERLAP = 150; // ms two lines may sound together (a fade, a stop that lands a frame late)
const TALK_SPEC = { lift: 2, tilt: 0.4, ms: 380 }; // js/shared/request-popup.js Lifecycle.talk.SPEC, when the page did not report it

// ---- the clip's own length, when the page could not say (a silent build, metadata never loaded) ----
const clipCache = new Map();
export function clipSeconds(root, url) {
  const f = String(url || "").split("?")[0];
  if (clipCache.has(f)) return clipCache.get(f);
  let d = null;
  try {
    const p = join(root, f);
    if (existsSync(p)) d = parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], { encoding: "utf8", timeout: 5000 }).trim()) || null;
  } catch (e) { d = null; }
  clipCache.set(f, d);
  return d;
}

const levelOf = (flow) => { const m = /@L(\d)/.exec(flow) || /level=(\d)/.exec(flow); return m ? +m[1] : 1; };
const center = (b) => ({ x: (b.l + b.r) / 2, y: (b.t + b.b) / 2 });

// ---- stages from the probe's stage events ----
export function segments(tl, tEnd) {
  const segs = [];
  for (const e of tl) if (e.type === "c" && e.k === "stage") {
    const prev = segs[segs.length - 1];
    // the same stage, seen in more detail (Cook's station inside the host's stage once Cook's hook is there): not a boundary
    if (prev && e.key.startsWith(prev.key + "|")) { prev.key = e.key; continue; }
    if (prev) prev.t1 = e.t;
    segs.push({ key: e.key, t0: e.t, t1: null });
  }
  if (segs.length) segs[segs.length - 1].t1 = null;
  // the real end of a stage: the shared lifecycle's own stage-end (Lifecycle.log, at its own millisecond: the voice stop),
  // the latest one in the 1.5 s before the sampler saw the stage change, not the sample (100 ms apart). A line queued after
  // the stop then belongs to the next stage, not to the one that ended
  const ends = tl.filter((e) => e.type === "c" && e.k === "life" && e.what === "stage-end").map((e) => e.t);
  if (ends.length) for (let i = 1; i < segs.length; i++) {
    const s = segs[i], prev = segs[i - 1];
    const c = ends.filter((t) => t <= s.t0 + 20 && t > prev.t0 && t >= s.t0 - 1500);
    if (c.length) { const t = c[c.length - 1]; prev.t1 = t; s.t0 = t; s.fromLife = true; }
  }
  return segs;
}
const segAt = (segs, t) => { let s = null; for (const x of segs) if (x.t0 <= t) s = x; return s; };
// a stage the child plays in: a Cook station, or a host stage that is a game (not idle, results, done)
export const isPlayStage = (key) => /(^|\|)cook:station/.test(key) || (!/cook:between/.test(key) && /^host:[^|]*\//.test(key));

// lines and their clips: each clip's real interval
export function voice(tl, { root = ".", clip = clipSeconds } = {}) {
  const lines = new Map(), plays = new Map();
  for (const e of tl) {
    if (e.type === "line") lines.set(e.id, { id: e.id, text: e.text, who: e.who, t0: e.t, t1: null, plays: [] });
    else if (e.type === "line-end" && lines.has(e.id)) lines.get(e.id).t1 = e.t;
    else if (e.type === "play" && e.pid) plays.set(e.pid, { pid: e.pid, url: e.url || null, text: e.text || null, via: e.via, t0: e.t, dur: e.dur, est: !!e.est, end: null, why: null });
    else if (e.type === "play-dur" && plays.has(e.pid)) plays.get(e.pid).dur = e.dur;
    else if (e.type === "play-end" && plays.has(e.pid)) { const p = plays.get(e.pid); if (p.end == null) { p.end = e.t; p.why = e.why; } }
  }
  const stops = tl.filter((e) => e.type === "voice-stop").map((e) => e.t);
  for (const p of plays.values()) {
    if (p.dur == null && p.url) { p.dur = clip(root, p.url); p.fromFile = p.dur != null; }
    if (p.dur == null) { p.dur = 1; p.est = true; }
    const natural = p.t0 + p.dur * 1000;
    p.t1 = p.end != null ? Math.min(p.end, natural) : natural;
    // the line it was said for: the latest line that had started (and not long ended) when it played
    let best = null;
    for (const l of lines.values()) if (l.t0 <= p.t0 + 5 && (l.t1 == null || p.t0 <= l.t1 + 60) && (!best || l.t0 >= best.t0)) best = l;
    if (best) { best.plays.push(p); p.line = best; }
  }
  // a Cook line that played nothing (the test build had no clip it could play in time, or the next line replaced it before it
  // loaded): it is said in real play, so its length is its words' family clips (or about 0.45 s a word), cut by the next Cook
  // line (one channel: a new line replaces the old) or a voice stop
  const cookLines = [...lines.values()].filter((l) => l.who === "cook");
  for (const l of cookLines) {
    if (l.plays.length || !(l.text || "").trim()) continue;
    const est = l.t0 + lineSeconds(root, l.text, clip) * 1000;
    const next = cookLines.find((x) => x.t0 > l.t0 && x.id !== l.id);
    const stop = stops.find((t) => t > l.t0);
    const t1 = Math.min(est, next ? next.t0 : Infinity, stop || Infinity);
    plays.set(`line${l.id}`, { pid: `line${l.id}`, url: null, text: l.text, via: "silent line (its words' clip lengths)", t0: l.t0, dur: (est - l.t0) / 1000, est: true, t1, end: t1 < est ? t1 : null, why: t1 < est ? (next && next.t0 === t1 ? "the next line" : "a voice stop") : null, line: l });
    l.plays.push(plays.get(`line${l.id}`));
    l.silent = true;
  }
  return { lines: [...lines.values()], plays: [...plays.values()] };
}

// a line's length from its words' clips: the family's recording of the word, else the placeholder file, else 0.45 s
let famWords = null;
export function lineSeconds(root, text, clip = clipSeconds) {
  if (!famWords) {
    famWords = new Map();
    const p = join(root, "data", "family-audio.json");
    if (existsSync(p)) for (const e of JSON.parse(readFileSync(p, "utf8"))) if (e && e.file && e.kutchi && e.checked !== "redo") { const k = normW(e.kutchi); if (!famWords.has(k)) famWords.set(k, e.file); }
  }
  let s = 0;
  for (const w of String(text).split(/\s+/).map(normW).filter(Boolean)) {
    const f = famWords.get(w) || (existsSync(join(root, "assets", "audio", "cook-tts", `${w}.mp3`)) ? `assets/audio/cook-tts/${w}.mp3` : null);
    const d = f ? clip(root, f) : null;
    s += (d || 0.45) + 0.04;
  }
  return Math.max(0.3, s);
}
const normW = (s) => String(s || "").toLowerCase().normalize("NFC").replace(/[^\p{L}\p{M}\p{N} ]/gu, "").trim();

// the state (and its screenshot) nearest after t, else the last before it
function stateAt(r, t) {
  // the probe's own shot of that moment (taken as the bubble, badge, button, pop-up or stage change happened), else a state's
  const c = (r.cshots || []).filter((x) => x.t >= t - 60 && x.t <= t + 700).sort((a, b) => Math.abs(a.t - t) - Math.abs(b.t - t))[0];
  const at = t - (r.t0 || 0);
  if (c) { let s = null; for (const x of r.states || []) if (x.at != null && x.at <= at) s = x; return { state: s ? `after ${s.name}` : "start", shot: c.shot }; }
  const st = r.states || [];
  let s = st.find((x) => x.at != null && x.at >= at - 200) || st[st.length - 1];
  return s ? { state: s.name, shot: s.shot } : { state: "?", shot: null };
}

// ---- the checks ----
function check1(tl, segs, v, add) {
  const side = tl.filter((e) => e.type === "c" && e.k === "side");
  const sideAt = (t) => { let s = { n: 0, rows: 0 }; for (const e of side) if (e.t <= t) s = e; else break; return s; };
  const pops = [];
  for (const e of tl) if (e.type === "c" && e.k === "popup") {
    if (e.open && (!pops.length || pops[pops.length - 1].t1 != null)) pops.push({ t0: e.t, t1: null });
    else if (!e.open && pops.length && pops[pops.length - 1].t1 == null) pops[pops.length - 1].t1 = e.t;
  }
  const inputs = tl.filter((e) => e.type === "c" && e.k === "input");
  let windowStart = tl.length ? tl[0].t : 0, first = true, lastRows = 0;
  for (const s of segs) {
    if (!isPlayStage(s.key)) continue;
    const end = s.t1 == null ? Infinity : s.t1;
    const play = inputs.find((i) => i.t >= s.t0 && i.t < end && !i.popup && !i.side && !i.next && !(i.exp && i.exp.cook && i.exp.cook.intro));
    if (!play) continue; // no play here (a stage the flow only passed through): the window runs on
    const card = sideAt(play.t);
    const outside = v.lines.filter((l) => l.t0 >= windowStart && l.t0 < play.t && (l.text || "").trim() && !pops.some((p) => p.t0 <= l.t0 + 50 && (p.t1 == null || l.t0 <= p.t1)));
    const newCard = card.n > 0 && card.rows !== lastRows;
    const order = card.n > 0 && (first || outside.length > 0 || newCard);
    if (order) {
      const mine = pops.filter((p) => p.t0 >= windowStart - 50 && p.t0 < play.t);
      if (!mine.length) add("contract-1", play.t, `${s.key}: the play phase starts with no request pop-up${outside.length ? ` (said outside it: "${outside.map((l) => l.text).slice(0, 2).join(" / ")}")` : ""}; first tap at ${play.x},${play.y}`);
      else {
        const p = mine[mine.length - 1];
        const said = v.lines.some((l) => l.t0 >= p.t0 - 100 && (p.t1 == null || l.t0 <= p.t1) && (l.text || "").trim());
        const tappedAtOnce = inputs.some((i) => i.t >= p.t0 && i.t <= p.t0 + 600);
        if (!said && !tappedAtOnce) add("contract-1", p.t0, `${s.key}: the request pop-up was not read out (no line while it was up)`);
        if (p.t1 != null) {
          const folded = side.some((e) => e.t >= p.t1 - 100 && e.t <= p.t1 + 2000 && e.n > 0) || sideAt(p.t1 + 2000).n > 0;
          if (!folded) add("contract-1", p.t1, `${s.key}: the pop-up closed and no order card showed in the sidebar within 2 s (it did not fold)`);
        }
      }
    }
    lastRows = card.n > 0 ? card.rows : lastRows;
    first = false;
    windowStart = end;
  }
}

// what the game expected says the step is decided: only the button is left
export function decided(exp, sel) {
  if (!exp) return false;
  // the shell between rounds (the end of a morning, the results, idle) is not a game's step: its buttons are the child's choice
  if (exp.host && /^(done|results|idle)$/.test(exp.host)) return false;
  // non-negotiable 12: the child can take it back until Done. A take-back on offer, or pictures still taking taps that change
  // the result (chaat's bowl), leave the step open: its Done is the child's choice, not a decided step
  if (exp.live > 0 || (exp.cook && exp.cook.undo) || (exp.hostExp && exp.hostExp.undo)) return false;
  if (exp.cook) {
    if (["count", "more"].includes(exp.cook.kind) || exp.cook.intro) return false;
    if (exp.cook.kind === "click" && exp.cook.selector && !/njg-results|rs-|lab-list|#t-|#sum-|#shop|#fin-/.test(exp.cook.selector)) return !sel || sel.includes(exp.cook.selector.replace(/^#/, "#")) || /done-btn|go/.test(exp.cook.selector);
    return false;
  }
  if (exp.heal && exp.heal.do === "button") {
    // a count the game reported uncapped (more taps still change it: the ear's drops) is the child's to end (C10); a capped
    // count (the knee's wrap stops at it) or a step with no count is decided (decision 79)
    const c = exp.heal.count;
    if (c && !c.capped) return false;
    return true;
  }
  if ("clinic" in exp) return exp.clinic == null || exp.clinic.kind === "button";
  if (exp.hostExp && exp.hostExp.kind === "button") return true;
  return false;
}
function check2(tl, segs, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c") continue;
    if (e.k === "buttons" && e.list && e.list.length && decided(e.exp, e.list[0].sel)) {
      const s = segAt(segs, e.t);
      for (const b of e.list) { const k = `${s && s.key}|${b.sel}`; if (seen.has(k)) continue; seen.add(k); add("contract-2", e.t, `${s ? s.key : "?"}: ${b.sel}${b.text ? ` "${b.text}"` : ""} shown after the step was decided (the game expected only this button: ${JSON.stringify(e.exp)})`); }
    }
    if (e.k === "input" && e.next && decided(e.exp, e.btn)) {
      const s = segAt(segs, e.t), k = `${s && s.key}|${e.btn}`;
      if (seen.has(k)) continue;
      seen.add(k);
      add("contract-2", e.t, `${s ? s.key : "?"}: had to press ${e.btn} to move on after the step was decided (${JSON.stringify(e.exp)})`);
    }
  }
}
function check3(segs, v, add) {
  for (const p of v.plays) {
    const owner = segAt(segs, p.line ? p.line.t0 : p.t0);
    if (!owner || owner.t1 == null) continue;
    const over = p.t1 - owner.t1;
    if (over > TOL) {
      const next = segAt(segs, owner.t1 + 1);
      add("contract-3", owner.t1 + 1, `"${(p.line && p.line.text) || p.text || p.url}" (${p.url || p.via}, ${p.dur.toFixed(2)} s${p.est ? ", estimated" : p.fromFile ? ", the file's length" : ""}) ${p.t0 > owner.t1 ? `started ${Math.round(p.t0 - owner.t1)} ms after` : "kept playing"} ${Math.round(over)} ms past the end of ${owner.key} (into ${next ? next.key : "?"})${p.why ? `; it stopped by ${p.why}` : "; nothing stopped it"}`);
    }
  }
}
// the speaker's head(s) for a bubble
function headsFor(b, heads) {
  const who = b.who;
  let hs = heads.filter((h) => h.who === who);
  if (who === "cook" || !hs.length) hs = heads.filter((h) => h.src === "phaser").length && who === "cook" ? heads.filter((h) => h.src === "phaser") : hs;
  // a speaker element that is a whole standing figure: its head is its top fifth
  return hs.map((h) => {
    const w = h.box.r - h.box.l, hh = h.box.b - h.box.t;
    if (/^speaker:/.test(h.src) && hh > w * 1.5) return { ...h, box: { l: Math.round(h.box.l + w * 0.25), t: h.box.t, r: Math.round(h.box.r - w * 0.25), b: Math.round(h.box.t + hh * 0.2) }, from: "figure top" };
    return h;
  });
}
export function bubbleOk(b, h, vw, vh) {
  const hw = h.box.r - h.box.l, hh = h.box.b - h.box.t;
  // the tail must point into the head's own column; a bubble with no tail must at least overlap it
  const inCol = b.tail ? b.tail.x >= h.box.l - 4 && b.tail.x <= h.box.r + 4 : b.box.r >= h.box.l - hw * 0.25 && b.box.l <= h.box.r + hw * 0.25;
  const reach = Math.max(120, hh * 1.5);
  const above = b.box.b <= h.box.t + hh * 0.5 && b.box.b >= h.box.t - reach;
  const below = b.box.t >= h.box.b - hh * 0.5 && b.box.t <= h.box.b + reach;
  return { ok: inCol && (above || below), inCol, above, below };
}
export function inCorner(b, area) {
  const m = 24;
  const L = b.box.l - area.l <= m, Rt = area.r - b.box.r <= m, T = b.box.t - area.t <= m, B = area.b - b.box.b <= m;
  return (L || Rt) && (T || B) ? `${T ? "top" : "bottom"}-${L ? "left" : "right"}` : null;
}
function check4(tl, segs, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "bubble") continue;
    for (const b of e.list) {
      const hs = headsFor(b, e.heads || []);
      const area = e.play || { l: 0, t: 0, r: e.vw, b: e.vh };
      const corner = inCorner(b, { l: 0, t: 0, r: e.vw, b: e.vh }) || inCorner(b, area);
      // nearest head first (Cook's bubbles name no speaker: the character it was put by is the nearest one)
      const bc = b.tail || center(b.box);
      const res = hs.map((h) => ({ h, d: Math.hypot(center(h.box).x - bc.x, center(h.box).y - bc.y), ...bubbleOk(b, h, e.vw, e.vh) })).sort((x, y) => x.d - y.d);
      const good = res.find((x) => x.ok);
      if (good && !corner) continue;
      if (good && corner) { const c = center(good.h.box); if (Math.abs(c.y - center(b.box).y) < 200) continue; }
      const s = segAt(segs, e.t);
      const k = `${s && s.key}|${b.who}|${corner || ""}|${res.length ? (res[0].inCol ? "c" : "n") + (res[0].above ? "a" : res[0].below ? "b" : "s") : "none"}`;
      if (seen.has(k)) continue;
      seen.add(k);
      const h = res[0];
      const why = !hs.length ? `no head of "${b.who}" on screen` : `${h.inCol ? "in" : "not in"} the head's column, ${h.above ? "above" : h.below ? "below" : "beside or away from"} the head (${h.h.src}${h.h.from ? ", " + h.h.from : ""} ${JSON.stringify(h.h.box)})`;
      add("contract-4", e.t, `${s ? s.key : "?"}: ${b.who}'s bubble "${b.text}" at ${JSON.stringify(b.box)}${b.tail ? ` tail ${b.tail.x},${b.tail.y}` : ""}: ${why}${corner ? `; in the ${corner} corner` : ""}`);
    }
  }
}
function check5(tl, add) {
  let run = null;
  const flush = () => {
    if (!run) return;
    const { n, first, names } = run;
    run = null;
    for (let i = 1; i < n; i++) for (let j = 0; j < i; j++) {
      if (first[i] == null) continue;
      if (first[j] == null || first[i] < first[j] - 30) return add("contract-5", first[i], `badge ${i + 1} (${names[i]}) showed before badge ${j + 1} (${names[j]})${first[j] == null ? ", which never showed" : ` by ${Math.round(first[j] - first[i])} ms`}`);
    }
    if (n > 1 && first.every((x) => x != null && Math.abs(x - first[0]) <= 30)) add("contract-5", first[0], `all ${n} badges showed at once (not one, two, three)`);
  };
  for (const e of tl) {
    if (e.type === "c" && e.k === "stage") { if (e.key !== "end") flush(); }
    if (e.type !== "c" || e.k !== "badges") continue;
    if (e.list.every((b) => b.box && b.box.r - b.box.l < 2)) { flush(); continue; }
    if (!run) run = { n: e.list.length, names: e.list.map((b) => b.badge), first: e.list.map(() => null) };
    e.list.forEach((b, i) => { if (i < run.n && run.first[i] == null && b.vis > 0.35) run.first[i] = e.t; });
  }
  flush();
}
const shaCache = new Map();
const shaOf = (root, f) => { if (shaCache.has(f)) return shaCache.get(f); const p = join(root, f); const h = existsSync(p) ? createHash("sha256").update(readFileSync(p)).digest("hex").slice(0, 16) : null; shaCache.set(f, h); return h; };
// a scope pattern matches any part of the stage key ("cook:*:service" matches "host:cook/order|cook:between1:service")
const glob = (pat) => new RegExp("(^|\\|)" + pat.split("*").map((x) => x.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join("[^|]*") + "($|\\|)");
function check6(tl, retired, root, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "art") continue;
    const f = String(e.src || "").split("?")[0];
    for (const r of retired) {
      if (r.file !== f) continue;
      if (r.scope && !glob(r.scope).test(e.stage || "")) continue;
      if (r.sha256 && shaOf(root, f) !== r.sha256) continue; // redrawn under the same name: not the old picture
      const k = `${f}|${e.stage}`;
      if (seen.has(k)) continue;
      seen.add(k);
      add("contract-6", e.t, `${e.stage}: drew ${f} (${e.via}${e.key ? `, texture ${e.key}` : ""}): ${r.why}; replaced by ${r.by}`);
    }
  }
}

// ---- the measurable halves of the other "every game" rows ----
// 7 (PAN-04): two lines' clips sounding together
function check7(segs, v, add) {
  const ps = v.plays.filter((p) => p.line && !p.est && p.t1 > p.t0).sort((a, b) => a.t0 - b.t0);
  const seen = new Set();
  for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length && ps[j].t0 < ps[i].t1; j++) {
    const a = ps[i], b = ps[j];
    if (a.line === b.line) continue;
    const over = Math.min(a.t1, b.t1) - b.t0;
    if (over <= OVERLAP) continue;
    const s = segAt(segs, b.t0), k = `${s && s.key}|${a.line.text}|${b.line.text}`;
    if (seen.has(k)) continue;
    seen.add(k);
    add("contract-7", b.t0, `${s ? s.key : "?"}: "${b.line.text}" (${b.url || b.via}) started while "${a.line.text}" (${a.url || a.via}) was still sounding: ${Math.round(over)} ms together`);
  }
}
// 8 (SH-53): more than one highlight at once, held 300 ms or more
function check8(tl, segs, add) {
  const hs = tl.filter((e) => e.type === "c" && e.k === "hl");
  const seen = new Set();
  hs.forEach((e, i) => {
    if (!(e.n > 1)) return;
    const until = i + 1 < hs.length ? hs[i + 1].t : tl[tl.length - 1].t;
    if (until - e.t < 300) return;
    const s = segAt(segs, e.t), k = `${s && s.key}|${e.list.join(",")}`;
    if (seen.has(k)) return;
    seen.add(k);
    add("contract-8", e.t, `${s ? s.key : "?"}: ${e.n} highlights at once for ${Math.round(until - e.t)} ms (${e.list.join(", ")}); one at a time`);
  });
}
// 9 (CLN-114): from L3 the card is closed in the waiting room, the pharmacy and every heal game
const CLOSED_FROM_L3 = /(^|\|)host:clinic\/(waiting|pharmacy|heal)|(^|\|)host:heal\//;
function check9(tl, segs, level, add) {
  if (level < 3) return;
  const side = tl.filter((e) => e.type === "c" && e.k === "side");
  const sideAt = (t) => { let s = null; for (const e of side) if (e.t <= t) s = e; else break; return s; };
  const inputs = tl.filter((e) => e.type === "c" && e.k === "input" && !e.popup && !e.side && !e.next);
  for (const s of segs) {
    if (!CLOSED_FROM_L3.test(s.key)) continue;
    const end = s.t1 == null ? Infinity : s.t1;
    const first = inputs.find((i) => i.t >= s.t0 && i.t < end);
    if (!first) continue;
    const c = sideAt(first.t);
    if (!c || !c.n || c.closed == null) continue;
    if (c.closed < c.n) add("contract-9", first.t, `${s.key} at L${level}: ${c.n - c.closed} of ${c.n} sidebar cards open at the first play tap (from L3 the card is closed)`);
  }
}
// 10 (SH-71): on the child's turn (a tap the clinic asked for), every staged talker faces the player
function check10(tl, segs, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "input" || e.popup || e.side || !(e.poses && e.poses.length)) continue;
    const k0 = e.exp && e.exp.clinic && e.exp.clinic.kind;
    if (!k0 || k0 === "wait") continue;
    const turned = e.poses.filter((p) => p.pose !== "front");
    if (!turned.length) continue;
    const s = segAt(segs, e.t), k = `${s && s.key}|${turned.map((p) => p.who).join(",")}`;
    if (seen.has(k)) continue;
    seen.add(k);
    add("contract-10", e.t, `${s ? s.key : "?"}: the child's turn (${k0}) with ${turned.map((p) => `${p.who} still "${p.pose}"${p.facing ? ` facing ${p.facing}` : ""}`).join(", ")}: talkers turn to face the player`);
  }
}
// 11 (PAN-14, ART-05): a background stretched (across and down differ) or drawn low-res (more screen px than source px)
function check11(tl, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "bg" || !(e.sx > 0) || !(e.sy > 0)) continue;
    const ratio = Math.max(e.sx, e.sy) / Math.min(e.sx, e.sy);
    const up = Math.max(e.sx, e.sy) * (e.dpr || 1);
    const what = [];
    if (ratio > 1.03) what.push(`stretched: ${e.sx.toFixed(2)} across, ${e.sy.toFixed(2)} down (${Math.round((ratio - 1) * 100)}% out of proportion)`);
    if (up > 1.5) what.push(`low-res: ${up.toFixed(2)} screen px per source px`);
    if (!what.length) continue;
    const k = `${e.src}|${what.map((w) => w.split(":")[0]).join("+")}`;
    if (seen.has(k)) continue;
    seen.add(k);
    add("contract-11", e.t, `${e.stage || "?"}: background ${e.src} (${e.via}) ${what.join("; ")}`);
  }
}
// 12 (SH-23): a ✓ / Next / stage button shown greyed for 400 ms or more, not just pressed
function check12(tl, segs, add) {
  const gs = tl.filter((e) => e.type === "c" && e.k === "greyed");
  const presses = tl.filter((e) => e.type === "c" && e.k === "input" && (e.next || e.btn));
  const seen = new Set();
  gs.forEach((e, i) => {
    for (const b of e.list || []) {
      // how long this button stayed greyed: until an event without it
      let until = tl[tl.length - 1].t;
      for (let j = i + 1; j < gs.length; j++) if (!(gs[j].list || []).some((x) => x.sel === b.sel && x.why === b.why)) { until = gs[j].t; break; }
      if (until - e.t < 400) continue;
      if (presses.some((p) => p.t <= e.t + 50 && p.t >= e.t - 1500)) continue; // pressed: the button on its way out
      const s = segAt(segs, e.t), k = `${s && s.key}|${b.sel}`;
      if (seen.has(k)) continue;
      seen.add(k);
      add("contract-12", e.t, `${s ? s.key : "?"}: ${b.sel}${b.text ? ` "${b.text}"` : ""} shown ${b.why} for ${Math.round(until - e.t)} ms (hidden until usable, never greyed)`);
    }
  });
}
// 13 (CLN-06): a reply pill from an earlier stage still on screen in a later play stage
function check13(tl, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "stale" || !isPlayStage(e.stage || "")) continue;
    const k = `${e.from}|${e.stage}|${e.sel}`;
    if (seen.has(k)) continue;
    seen.add(k);
    add("contract-13", e.t, `${e.stage}: ${e.sel}${e.text ? ` "${e.text}"` : ""} from ${e.from} still on screen (each stage clears its own UI)`);
  }
}
// 14 (ART-18): one talk animation, no bigger or faster than the shared one
function check14(tl, segs, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "talk") continue;
    const S = { ...TALK_SPEC, ...(e.spec || {}) };
    for (const a of e.list || []) {
      let why = null;
      if (a.via === "phaser") {
        const w = [];
        if (a.dy > S.lift + 0.5) w.push(`lifts ${a.dy} px (shared: ${S.lift})`);
        if (a.da > S.tilt + 0.15) w.push(`tilts ${a.da}° (shared: ${S.tilt})`);
        if (a.ms && a.ms < S.ms - 30) w.push(`every ${a.ms} ms (shared: ${S.ms})`);
        if (w.length) why = w.join(", ");
      } else if (a.name !== "njg-talk") why = `its own talk animation "${a.name}" (${a.ms} ms), not the shared njg-talk`;
      else if (a.ms && a.ms < S.ms - 30) why = `njg-talk every ${a.ms} ms (shared: ${S.ms})`;
      if (!why) continue;
      const s = segAt(segs, e.t), k = `${s && s.key}|${a.who}|${a.via}|${a.name || ""}`;
      if (seen.has(k)) continue;
      seen.add(k);
      add("contract-14", e.t, `${s ? s.key : "?"}: ${a.who} talking (${a.via}) ${why}`);
    }
  }
}

export function loadRetired(root) {
  const p = join(root, "build", "sandbox", "data", "retired-art.json");
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")).list : [];
}

// the run's timeline in time order; a lifecycle log entry at its own time (at), not when the probe read it
export function timeline(r) {
  return (r.timeline || []).map((e) => (e && e.type === "c" && e.k === "life" && e.at ? { ...e, t: e.at } : e)).sort((a, b) => a.t - b.t);
}

export function analyse(r, { root = ".", retired = loadRetired(root), clip = clipSeconds } = {}) {
  const tl = timeline(r);
  const out = [];
  if (!tl.length) return out;
  const segs = segments(tl);
  const v = voice(tl, { root, clip });
  const add = (check, t, measured) => out.push({ check, item: CHECKS[check].item, flow: r.flow, level: levelOf(r.flow), size: r.size, ...stateAt(r, t), at: Math.round((t - (r.t0 || tl[0].t)) / 100) / 10, measured });
  check1(tl, segs, v, add);
  check2(tl, segs, add);
  check3(segs, v, add);
  check4(tl, segs, add);
  check5(tl, add);
  check6(tl, retired, root, add);
  check7(segs, v, add);
  check8(tl, segs, add);
  check9(tl, segs, levelOf(r.flow || ""), add);
  check10(tl, segs, add);
  check11(tl, add);
  check12(tl, segs, add);
  check13(tl, add);
  check14(tl, segs, add);
  return out;
}

// the voice log a reviewer reads: every line with its stage, its clips and their real start and end (seconds from the flow's start)
export function voiceLog(r, { root = "." } = {}) {
  const tl = timeline(r);
  const segs = segments(tl);
  const v = voice(tl, { root });
  const T = (t) => ((t - (r.t0 || (tl[0] && tl[0].t) || 0)) / 1000).toFixed(2);
  const rows = [];
  for (const s of segs) rows.push(`${T(s.t0)} ---- stage ${s.key}`);
  for (const l of v.lines) rows.push(`${T(l.t0)} line "${l.text}" [${segAt(segs, l.t0) ? segAt(segs, l.t0).key : "?"}]${l.plays.length ? "" : " (silent)"}${l.plays.map((p) => `\n${T(p.t0)}   clip ${p.url || p.via} ${p.dur.toFixed(2)} s, sounding to ${T(p.t1)}${p.why ? ` (${p.why})` : ""}`).join("")}`);
  return rows.sort((a, b) => parseFloat(a) - parseFloat(b));
}

// many results -> the contract report (markdown) and the list of breaks
export function report(results, opts = {}) {
  const all = [];
  for (const r of results) if (r.size !== "static") all.push(...analyse(r, opts));
  let md = `## Contract checks (decision 75): ${all.length} breaks over ${results.filter((r) => r.size !== "static").length} pages\n\n| check | breaks | how it measures |\n|---|---|---|\n`;
  for (const [k, c] of Object.entries(CHECKS)) md += `| ${k} ${c.title} | ${all.filter((f) => f.check === k).length} | ${c.how} |\n`;
  md += `\n| check | flow | level | size | state (shot) | at s | what |\n|---|---|---|---|---|---|---|\n`;
  for (const f of all) md += `| ${f.check} | ${f.flow} | L${f.level} | ${f.size} | ${f.state}${f.shot ? ` (${f.shot})` : ""} | ${f.at} | ${String(f.measured).replace(/\|/g, "/")} |\n`;
  return { breaks: all, md };
}
