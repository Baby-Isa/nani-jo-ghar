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
// analyse(result, {retired, clip}) -> [{check, item, flow, level, size, state, shot, at, measured}]. A break is never
// ratcheted into the baseline: --check and --contract fail on any (exit 1).
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

export const CHECKS = {
  "contract-1": { item: "popup", title: "pop-up before play", how: "Splits the flow into stages (a Cook station from Cook.inStation, else the game host's stage) and finds each stage's first real tap in the play area. A stage that gives an order (a line said before that tap outside a pop-up, a new order card in the sidebar, or the first stage with a card) must have had the request pop-up (.njg-rq-open, Cook's #intro) on screen since the last stage ended; a line must start while it is up (read out) unless a tap closed it at once; within 2 s of closing an order card must show in the sidebar (folded)." },
  "contract-2": { item: "moves-on", title: "moves on by itself", how: "Every ✓, Next or stage button seen on screen (.cl-go, #done-btn, a button reading ✓ or →, aria 'next'/'done') and every press of one is judged with what the game expected at that moment: if it expected only that button (the clinic between stages or kind 'button', a heal game's 'button' step, Cook clicking that selector), the step was already decided, so the button is a break. A count the child finishes with Done (more can still change it) is not." },
  "contract-3": { item: "voice", title: "voice stops at every stage end", how: "Every clip's real start, length (the decoded buffer or the file's own length) and stop (ended, stop, pause, cancel) from the sound log; each belongs to the line (and so the stage) it was said for. A clip still sounding 250 ms after its stage ended, or started after it, is a break." },
  "contract-4": { item: "bubble", title: "bubble at the speaker's head", how: "Every speech bubble's box and tail (its ::after / ::before) against its speaker's head on screen: a Cook character's sprite (the top quarter of the figure), the clinic figure's head (its art's top, the head anchor), the doctor's figure. The tail (or the bubble) must be in the head's column and the bubble above it (or below it); a bubble beside the head, away from it or in a corner of the screen is a break." },
  "contract-5": { item: "badges", title: "badges in order", how: "While the end screen is up, every 40 ms: does anything of each badge show (its parts' opacity, or a picture on its spot from outside it). Each must first show after the one before it." },
  "contract-6": { item: "old-art", title: "no retired art", how: "Every image drawn (canvas drawImage, offscreen canvases a rig draws from, <img>, CSS backgrounds, Phaser WebGL textures) by file; a file on the retired list with the same content (sha256), in its scope, is a break." },
};

const TOL = 250; // ms a voice may run past its stage end (one audio frame of fade, the sampling)

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
    if (segs.length) segs[segs.length - 1].t1 = e.t;
    segs.push({ key: e.key, t0: e.t, t1: null });
  }
  if (segs.length) segs[segs.length - 1].t1 = null;
  return segs;
}
const segAt = (segs, t) => { let s = null; for (const x of segs) if (x.t0 <= t) s = x; return s; };
export const isPlayStage = (key) => /^cook:station/.test(key) || (/^host:/.test(key) && !/^host:(idle|results|done|page|loading|title|map|menu)$/.test(key) && key.includes("/"));

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
  return { lines: [...lines.values()], plays: [...plays.values()] };
}

// the state (and its screenshot) nearest after t, else the last before it
function stateAt(r, t) {
  const at = t - (r.t0 || 0);
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
    if (!play) { windowStart = end; continue; }
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
  if (exp.cook) {
    if (["count", "more"].includes(exp.cook.kind) || exp.cook.intro) return false;
    if (exp.cook.kind === "click" && exp.cook.selector && !/njg-results|rs-|lab-list|#t-|#sum-|#shop|#fin-/.test(exp.cook.selector)) return !sel || sel.includes(exp.cook.selector.replace(/^#/, "#")) || /done-btn|go/.test(exp.cook.selector);
    return false;
  }
  if (exp.heal && exp.heal.do === "button") return true;
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
  const col = { l: h.box.l - hw * 0.25, r: h.box.r + hw * 0.25 };
  const inCol = b.tail ? b.tail.x >= col.l && b.tail.x <= col.r : b.box.r >= col.l && b.box.l <= col.r;
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
      const res = hs.map((h) => ({ h, ...bubbleOk(b, h, e.vw, e.vh) }));
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
const glob = (pat) => new RegExp("^" + pat.split("*").map((x) => x.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*") + "$");
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

export function loadRetired(root) {
  const p = join(root, "build", "sandbox", "data", "retired-art.json");
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")).list : [];
}

export function analyse(r, { root = ".", retired = loadRetired(root), clip = clipSeconds } = {}) {
  const tl = (r.timeline || []).slice().sort((a, b) => a.t - b.t);
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
  return out;
}

// the voice log a reviewer reads: every line with its stage, its clips and their real start and end (seconds from the flow's start)
export function voiceLog(r, { root = "." } = {}) {
  const tl = (r.timeline || []).slice().sort((a, b) => a.t - b.t);
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
