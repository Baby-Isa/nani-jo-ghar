/*
 * The clinic: the visit engine (pure logic; no browser, no Phaser).
 *
 * docs/modes/clinic-design.md, R2.2 (visit types), R2.3 (the ladder),
 * R3.1-R3.4 (hand-over, sides in the patient's voice, speaking moments).
 *
 * One engine for every visit: a visit is a list of CALLS (the doctor names
 * a part, from level 2 with a tool; from level 3 the patient adds "my left
 * one") and/or a COMPLAINT (the patient: "my knee hurts"), then a
 * TREATMENT with slots {item, part, side?, count?, colour?, path?} that the
 * doctor names, then the HAND-OVER (he looks over the work and names it).
 *
 * Every decision the player makes is a graded ROW:
 *   {id, kind, options, accept, tested, voice?, say, ...}
 * The browser mechanics (js/clinic/mechanics/*.js) play the rows one by one
 * and grade a pick with ClinicVisit.judge(row, pick); the Node leak bot
 * (build/leak_clinic.mjs) plays exactly the same rows with strategies that
 * never hear the words. So the bot's numbers are numbers for this code.
 *
 * Stars (R3.4, R3.5):
 *   ear   = no missed graded row AND at least visits[type].minTested rows
 *           that were tested (not taught at word stage 1, not settled
 *           through the "?" rung). V0's rows are teaching: no ear slot.
 *   voice = every speaking row accepted on the first try (recogniser or a
 *           grown-up's tick) AND at least voice.voicePass.minRows of them.
 *           Tapping a pill instead is allowed and earns no voice star.
 *
 * Loaded in the browser as window.ClinicVisit, in Node with require/import.
 */
(function (root, factory) {
  const V = factory();
  if (typeof module === "object" && module.exports) module.exports = V;
  else root.ClinicVisit = V;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const V = {};

  /* ---------------- randomness (seedable, so the bot is repeatable) ---------------- */
  V.rng = function (seed) {
    let a = (seed >>> 0) || 0x9e3779b9;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  const pick = (arr, r) => arr[Math.floor(r() * arr.length)];
  const int = (range, r) => (Array.isArray(range) ? range[0] + Math.floor(r() * (range[1] - range[0] + 1)) : range);
  const shuffle = (arr, r) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  V.shuffle = shuffle;
  V.pick = pick;

  /* ---------------- the level's knobs (each level lists only what changes) ---------------- */
  V.level = function (data, n) {
    const levels = data.levels || [];
    const out = {};
    for (let i = 0; i < Math.min(n, levels.length); i++) Object.assign(out, levels[i]);
    out.n = Math.max(1, Math.min(n, levels.length));
    return out;
  };
  const W = (data, id) => (data.words || {})[id] || {};
  V.sided = (data, id) => !!W(data, id).sided;
  V.isFace = (data, id) => W(data, id).group === "face";

  /** The tools that work on `part` at this level (the hand works on every part). */
  function toolsFor(data, lv, part) {
    if (!lv.tools) return [];
    return lv.tools.filter((t) => {
      const p = ((data.instruments || {})[t] || {}).parts;
      return p === "*" || (p || []).includes(part);
    });
  }
  V.toolsFor = toolsFor;
  /** Care items on this level's trolley that fit `part` (never a decoy). */
  function caresFor(data, lv, part) {
    return lv.trolley.filter((c) => !W(data, c).decoy && ((data.cares || {})[c] || []).includes(part));
  }
  V.caresFor = caresFor;

  /** A closed set for a speaking moment: the answer, its look-alikes, then others; never over `max`. */
  function closedSet(data, answer, pool, max, r) {
    const groups = ((data.lookalike_groups || {}).groups || []).filter((g) => g.includes(answer));
    const near = [...new Set(groups.flat())].filter((x) => x !== answer && pool.includes(x));
    const rest = shuffle(pool.filter((x) => x !== answer && !near.includes(x)), r);
    return shuffle([answer].concat(near, rest).slice(0, max), r);
  }
  V.closedSet = closedSet;

  /* ---------------- rows ---------------- */
  let rowSeq = 0;
  function row(kind, o) {
    return Object.assign({ id: `r${++rowSeq}`, kind, tested: true }, o);
  }
  /** A line as data: {frame, x: [ids or numbers], y?, speaker}. The UI builds it with Cook.Lang. */
  const line = (speaker, frame, x, y) => ({ speaker, frame, x: x == null ? [] : [].concat(x), y: y == null ? undefined : [].concat(y) });

  /** Part rows: a tap on the body (the part), then, from level 3 on a sided part, the side (the patient's own). */
  function partRows(data, lv, part, side, extra) {
    const out = [row("part", Object.assign({ options: lv.parts.slice(), accept: [part], part }, extra))];
    if (side) out.push(row("side", { options: ["side-left", "side-right"], accept: [side], part, say: extra.sideSay }));
    return out;
  }

  /* ---------------- the treatment (what the doctor names) ---------------- */
  function treatment(data, lv, part, side, r, { care } = {}) {
    const fits = caresFor(data, lv, part);
    const item = care && lv.trolley.includes(care) ? care : pick(fits, r);
    const t = { item, part, side: side || null, gesture: W(data, item).gesture, colour: null, count: null, path: null };
    const slots = lv.treatSlots || ["item"];
    if (slots.includes("extra")) {
      const cols = (lv.colours || {})[item];
      if (item === "care-bandage") {
        if (lv.path && (data.paths || {})[part] && slots.includes("side") && r() < lv.path) t.path = data.paths[part].slice();
        else if (cols && r() < 0.5) t.colour = pick(cols, r);
        else t.count = int(lv.wrapTurns || [1, 4], r);
      } else if (item === "care-plaster" && cols) t.colour = pick(cols, r);
      else if (item === "care-blanket") t.count = int([1, 3], r);
      else if (item === "care-drops") t.count = int(lv.dropCount || [1, 3], r);
    }
    return t;
  }
  /** The trolley as objects on screen: every unlocked item, rolls and tins in their colours. */
  function trolleyObjects(data, lv) {
    const objs = [];
    lv.trolley.forEach((c) => {
      const cols = (lv.colours || {})[c];
      if (cols) cols.forEach((col) => objs.push(`${c}#${col}`));
      else objs.push(c);
    });
    return objs;
  }
  V.trolleyObjects = trolleyObjects;
  /** The treatment line(s) the doctor says, and its graded rows. */
  function treatRows(data, lv, t) {
    const lines = [];
    const rows = [];
    const objs = trolleyObjects(data, lv);
    const accept = objs.filter((o) => o.split("#")[0] === t.item && (!t.colour || o.split("#")[1] === t.colour));
    const itemLine = t.colour ? line("doctor", "cl-colour", [t.colour, t.item]) : t.gesture === "tuck" && t.count != null ? line("doctor", "cl-treat", [t.count, t.item]) : line("doctor", "cl-treat", [t.item]);
    lines.push(itemLine);
    rows.push(row("care", { options: objs, accept, item: t.item, say: itemLine }));
    if (t.path) {
      const l = line("doctor", "cl-roundpath", t.path);
      lines.push(l);
      t.path.forEach((p, i) => rows.push(row("path", { options: [...new Set(t.path)], accept: [p], step: i, say: l })));
    } else if (t.count != null && t.gesture === "wrap") {
      const l = line("doctor", "cl-round", [t.count]);
      lines.push(l);
      rows.push(row("count", { options: [1, 2, 3, 4], accept: [t.count], what: "turns", say: l }));
    } else if (t.count != null && t.gesture === "drops") {
      const l = line("doctor", "cl-drops", [t.count]);
      lines.push(l);
      rows.push(row("count", { options: [1, 2, 3], accept: [t.count], what: "drops", say: l }));
    } else if (t.count != null && t.gesture === "tuck") {
      rows.push(row("count", { options: [1, 2, 3], accept: [t.count], what: "blankets", say: itemLine }));
    }
    return { lines, rows };
  }
  /** The hand-over (R3.1): he names the item, the part and the count. From level 2 he asks "What's this?" first (S4). */
  function handover(data, lv, t, r) {
    const review = [t.item, t.part].concat(t.count != null ? [t.count] : []);
    const rows = [];
    const vc = data.voice || {};
    if (lv.n >= (vc.whatsThisFromLevel || 99)) {
      rows.push(row("voice", { moment: "S4", options: closedSet(data, t.item, lv.trolley, 5, r), accept: [t.item], say: line("doctor", "cl-whatsthis") }));
    }
    return { review, rows, line: line("doctor", "cl-review", review) };
  }

  /* ---------------- visit types ---------------- */
  function callFrame(data, lv, i, part, prev, tool) {
    if (tool && tool !== "tool-hand") return ((data.instruments || {})[tool] || {}).frame || "cl-checkfull";
    if (i === 0) return "cl-checkfull";
    return part === prev ? "cl-again" : "cl-now";
  }
  function makeCall(data, lv, part, i, prev, r, { find = false } = {}) {
    const tools = toolsFor(data, lv, part);
    const tool = tools.length ? pick(tools, r) : null;
    const side = lv.sides && V.sided(data, part) ? pick(["side-left", "side-right"], r) : null;
    return { speaker: "doctor", part, tool, side, find, frame: callFrame(data, lv, i, part, prev, tool) };
  }
  /** A free check-up call: from level 2 the tool is drawn first, evenly, then a part it works on (so no tool is the safe bet). */
  function freeCall(data, lv, i, prev, r, not) {
    const ok = (p) => p !== not;
    if (!lv.tools) return makeCall(data, lv, pick(lv.parts.filter(ok), r), i, prev, r);
    for (let g = 0; g < 20; g++) {
      const tool = pick(lv.tools, r);
      const ps = lv.parts.filter((p) => ok(p) && toolsFor(data, lv, p).includes(tool));
      if (!ps.length) continue;
      const part = pick(ps, r);
      const side = lv.sides && V.sided(data, part) ? pick(["side-left", "side-right"], r) : null;
      return { speaker: "doctor", part, tool, side, find: false, frame: callFrame(data, lv, i, part, prev, tool) };
    }
    return makeCall(data, lv, pick(lv.parts.filter(ok), r), i, prev, r);
  }
  function callRows(data, lv, c) {
    const out = [];
    const say = line("doctor", c.frame, [c.part]);
    if (c.tool) out.push(row("tool", { options: lv.tools.slice(), accept: [c.tool], say, part: c.part }));
    partRows(data, lv, c.part, c.side, { say, sideSay: c.side ? line("patient", "cl-side", [c.side]) : null }).forEach((x) => out.push(x));
    return out;
  }

  function checkup(data, lv, r, { find } = {}) {
    const n = int(lv.calls, r);
    const calls = [];
    let prev = null;
    // any part possible on every call, repeats allowed (R2.2 rule 2): no elimination
    for (let i = 0; i < n; i++) {
      const c = freeCall(data, lv, i, prev, r);
      calls.push(c);
      prev = c.part;
    }
    return calls;
  }
  function mysteryCalls(data, lv, r) {
    const finds = ((data.finds || {}).list || []).filter((f) => lv.parts.includes(f.part) && (f.minLevel || 1) <= lv.n && (!lv.tools || lv.tools.includes(f.tool)));
    const f = pick(finds, r);
    const n = Math.max(3, int(lv.calls, r) - 1);
    // the find sits on a call from the second on (R2.2 rule 3); the calls before it never name the sore part
    const at = 1 + Math.floor(r() * (n - 1));
    const calls = [];
    let prev = null;
    for (let i = 0; i < at; i++) {
      const c = freeCall(data, lv, i, prev, r, f.part);
      calls.push(c);
      prev = c.part;
    }
    const fc = makeCall(data, lv, f.part, at, prev, r, { find: true });
    if (lv.tools) {
      fc.tool = f.tool;
      fc.frame = callFrame(data, lv, at, f.part, prev, f.tool);
    }
    calls.push(fc);
    return { calls, find: f };
  }

  /**
   * Make a visit. opts: type ("you" | "checkup" | "mystery" | "hurt" | "bring"),
   * level (1-3), rng, patient (a people id).
   */
  V.make = function (data, { type = "checkup", level = 1, rng = Math.random, patient = "grey-1" } = {}) {
    const r = rng;
    const lv = V.level(data, level);
    const vc = data.voice || {};
    const visit = { type, level: lv.n, patient, lines: [], calls: [], complaint: null, treatment: null, review: null, rows: [], find: null };
    const add = (rows) => rows.forEach((x) => visit.rows.push(x));

    if (type === "you") {
      // V0: the lap view, first person. The hurt is SHOWN (a scuff); the child says where (S1)
      const Y = data.you || {};
      const part = pick(Y.parts, r);
      const side = lv.n >= 2 ? pick(["side-left", "side-right"], r) : null;
      visit.complaint = { part, side, shown: true };
      visit.lines.push(line("doctor", "cl-youfirst"), line("doctor", "cl-where"));
      add([row("voice", { moment: "S1", options: Y.parts.slice(), accept: [part], cue: part, say: line("doctor", "cl-where") })]);
      if (side) add([row("voice", { moment: "S1", options: ["side-left", "side-right"], accept: [side], cue: side, say: line("doctor", "cl-whereq") })]);
      // the second row: a second scuff, or (the cold variant) how you feel
      if (r() < (Y.coldChance || 0)) {
        const feel = pick(["feel-hot", "feel-cold"], r);
        visit.complaint.feeling = feel;
        add([row("voice", { moment: "S1", options: Y.feelings.slice(), accept: [feel], cue: feel, say: line("doctor", "cl-feel", ["feel-right"]) })]);
      } else {
        const p2 = pick(Y.parts.filter((p) => p !== part), r);
        visit.complaint.part2 = p2;
        add([row("voice", { moment: "S1", options: Y.parts.slice(), accept: [p2], cue: p2, say: line("doctor", "cl-whereq") })]);
      }
      // the probe (does it hurt here? yes/no) is teaching: never graded
      add([row("probe", { options: ["yes", "no"], accept: ["yes", "no"], tested: false })]);
      visit.treatment = { item: "care-plaster", part, side, gesture: "stick", design: true };
      visit.review = { review: ["care-plaster", part], line: line("doctor", "cl-review", ["care-plaster", part]), rows: [] };
      visit.ear = false; // V0's ear rows are taught, never graded (R3.4 S1)
      return finish(data, visit);
    }

    if (type === "checkup" || type === "mystery") {
      let calls;
      if (type === "mystery") {
        const m = mysteryCalls(data, lv, r);
        calls = m.calls;
        visit.find = m.find;
        visit.lines.push(line("patient", "cl-unwell"), line("patient", "cl-dunno"));
      } else {
        calls = checkup(data, lv, r);
        // from level 2 a check-up sometimes finds something (R2.2 V1)
        if (lv.n >= 2 && r() < 0.3) {
          const m = mysteryCalls(data, lv, r);
          // the calls before the find never name the sore part (the find is quiet until it's found)
          calls = calls.slice(0, Math.max(1, calls.length - 1)).map((c, i) => (c.part === m.find.part ? freeCall(data, lv, i, null, r, m.find.part) : c));
          const fc = m.calls[m.calls.length - 1];
          if (!lv.tools || fc.tool === "tool-hand") fc.frame = "cl-now";
          calls.push(fc);
          visit.find = m.find;
        }
        visit.lines.push(line("doctor", "cl-all"));
      }
      visit.calls = calls;
      calls.forEach((c) => add(callRows(data, lv, c)));
      if (visit.find) {
        const fc = calls[calls.length - 1];
        visit.treatment = treatment(data, lv, fc.part, fc.side, r, { care: visit.find.care });
      }
    }

    if (type === "hurt" || type === "bring") {
      // parts that can be treated at this level (the complaint must have a care on the trolley)
      const pool = lv.parts.filter((p) => caresFor(data, lv, p).length);
      const part = pick(pool, r);
      const side = lv.sides && V.sided(data, part) ? pick(["side-left", "side-right"], r) : null;
      visit.complaint = { part, side };
      if (type === "hurt") {
        const say = line("patient", "cl-hurts", side ? [side, part] : [part]);
        visit.lines.push(say);
        const pr = partRows(data, lv, part, side, { say, sideSay: say });
        // S2 (level 2+): the doctor, not looking: "Where?" The child can say it (voice) or tap it (ear, as before)
        if (lv.n >= (vc.s2FromLevel || 99)) {
          const view = lv.parts.filter((p) => V.isFace(data, p) === V.isFace(data, part));
          pr[0].speak = { moment: "S2", options: closedSet(data, part, view, Math.min(vc.maxSet || 8, 6), r) };
          add([row("voice", { moment: "S2", options: pr[0].speak.options, accept: [part], say: line("doctor", "cl-whereq"), with: pr[0].id })]);
          if (side) add([row("voice", { moment: "S2", options: ["side-left", "side-right"], accept: [side], say: line("doctor", "cl-whereq"), with: pr[1].id })]);
        }
        add(pr);
      } else {
        // V4 bring someone in (a lab stub in phase 1): you SAW the hurt; you tell the doctor (S3), he checks what you said
        visit.complaint.shown = true;
        visit.lines.push(line("doctor", "cl-whatwrong", [], null));
        const view = lv.parts.filter((p) => V.isFace(data, p) === V.isFace(data, part) && caresFor(data, lv, p).length);
        add([row("voice", { moment: "S3", options: closedSet(data, part, view, 6, r), accept: [part], cue: part, say: line("doctor", "cl-whatwrong") })]);
        // R3.4 S3: HE examines the part he heard (a V1 call on it, his hands, not the child's): no row for the child
        const c = makeCall(data, lv, part, 1, null, r);
        c.side = side;
        c.byDoctor = true;
        visit.calls = [c];
        // its test is the voice (the mode's production moment); its treatment rows are V3's, measured there
        visit.ear = false;
      }
      visit.treatment = treatment(data, lv, part, side, r);
    }

    if (visit.treatment) {
      const tr = treatRows(data, lv, visit.treatment);
      tr.lines.forEach((l) => visit.lines.push(l));
      add(tr.rows);
      visit.review = handover(data, lv, visit.treatment, r);
      add(visit.review.rows);
    }
    return finish(data, visit);
  };

  /**
   * The treatment round (a mini-game on its own): three patients, the sore
   * place already found (the swirl shows), the doctor names the treatment.
   * The item varies across every first-set treatment (a station that was
   * always "the bandage" would answer itself). `only`: a gesture, for the
   * lab's stand-alone hands (then only its extras are graded).
   */
  V.round = function (data, { level = 1, rng = Math.random, n = 3, only = null } = {}) {
    const r = rng;
    const lv = V.level(data, level);
    const visit = { type: only ? `round:${only}` : "round", level: lv.n, patients: [], lines: [], calls: [], rows: [], treatments: [] };
    for (let i = 0; i < n; i++) {
      const pool = lv.parts.filter((p) => caresFor(data, lv, p).some((c) => !only || W(data, c).gesture === only));
      const part = pick(pool, r);
      const side = lv.sides && V.sided(data, part) ? pick(["side-left", "side-right"], r) : null;
      const care = only ? pick(caresFor(data, lv, part).filter((c) => W(data, c).gesture === only), r) : null;
      const t = treatment(data, lv, part, side, r, { care });
      const tr = treatRows(data, lv, t);
      if (only) {
        // the item is given (the hands are the point); a colour, if he says one, is graded among its own rolls
        const c0 = tr.rows[0];
        if (t.colour) c0.options = c0.options.filter((o) => o.split("#")[0] === t.item);
        else c0.tested = false;
      }
      tr.rows.forEach((x) => (x.patient = i));
      visit.treatments.push(Object.assign(t, { lines: tr.lines, rows: tr.rows }));
      tr.rows.forEach((x) => visit.rows.push(x));
    }
    visit.ear = visit.rows.some((x) => x.tested);
    visit.minTested = n;
    visit.voiceRows = 0;
    return visit;
  };

  function finish(data, visit) {
    const spec = (data.visits || {})[visit.type] || {};
    visit.minTested = spec.minTested || 0;
    if (visit.ear === undefined) visit.ear = true;
    visit.voiceRows = visit.rows.filter((x) => x.kind === "voice").length;
    return visit;
  }

  /* ---------------- judging ---------------- */
  /** Is `pick` right for this row? (The one place a pick is graded, in the game and the bot.) */
  V.judge = (row, pickVal) => row.accept.some((a) => a === pickVal || String(a) === String(pickVal));

  /**
   * results: {rowId: {first: bool (right on the first try), helped?: bool (settled through "?"),
   *           taught?: bool (word stage 1), spoken?: bool (a voice row answered by voice, not a pill)}}
   */
  V.earStar = function (visit, results) {
    if (!visit.ear) return null;
    // too few listening rows to be more than a guess (a V4 whose only test is the trolley): no ear slot
    if (visit.rows.filter((r) => r.kind !== "voice" && r.tested).length < visit.minTested) return null;
    let tested = 0;
    for (const r of visit.rows) {
      if (r.kind === "voice" || !r.tested) continue;
      const res = results[r.id];
      if (!res || !res.first) return false;
      if (!res.helped && !res.taught) tested++;
    }
    return tested >= visit.minTested;
  };
  V.voiceStar = function (visit, results, data) {
    const rows = visit.rows.filter((r) => r.kind === "voice");
    if (!rows.length) return null;
    const min = (((data || {}).voice || {}).voicePass || {}).minRows || 1;
    // too few speaking rows to be more than a guess: the rows still play, but there's no voice slot
    if (rows.length < min) return null;
    return rows.every((r) => {
      const res = results[r.id];
      return res && res.spoken && res.first;
    });
  };

  /* ---------------- a clinic morning ---------------- */
  V.morning = function (data, { level = 1, rng = Math.random } = {}) {
    const mix = ((data.days || {}).mix || [])[Math.min(level, (data.days.mix || []).length) - 1] || { first: "checkup", draw: { checkup: 2, hurt: 2 } };
    const bag = [];
    Object.entries(mix.draw).forEach(([t, n]) => {
      for (let i = 0; i < n; i++) bag.push(t);
    });
    const at = bag.indexOf(mix.first);
    if (at >= 0) bag.splice(at, 1);
    return [mix.first].concat(shuffle(bag, rng));
  };

  /* ---------------- the words a visit says (for the word review and the placeholder report) ---------------- */
  V.words = function (visit) {
    const out = new Set();
    const walk = (l) => l && [].concat(l.x || [], l.y || []).forEach((w) => typeof w === "string" && out.add(w));
    visit.lines.forEach(walk);
    visit.rows.forEach((r) => {
      walk(r.say);
      r.accept.forEach((a) => typeof a === "string" && a.split("#").forEach((w) => out.add(w)));
    });
    return [...out];
  };
  V.placeholderRows = function (visit, data) {
    return visit.rows.filter((r) => r.accept.some((a) => typeof a === "string" && a.split("#").some((w) => W(data, w).kutchi == null && (data.words || {})[w]))).length;
  };

  return V;
});
