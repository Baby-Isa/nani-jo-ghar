// The geometry rules (Sprint 20 P5, build/reports/s20-plan.md section 4: "about ten rules on every moment and size"). Pure: they read
// what the box reader took (lib/boxes.mjs READ: boxes, texts and out.extra) and say, for each rule, pass or the faults, each as what,
// where and by how much. Nothing here opens a browser; `node build/tools/review/boxes.mjs --game <g> --rules` plays and judges.
//
// A page is {key, game, level, size, moments: {name: {read: {boxes, texts, info, extra}}}} (a boxes.json). A rule is judged on every
// moment of every page. A rule whose reads are missing (a run from before the extras) is "skipped", never a pass.
//
//   overlap       a card's face, item cards and words never lie over one another; Nani's face never over her words; item pop-up too
//   frame-apart   the side panel, the bottom row and the play area never overlap (the bottom row lies inside the play area today)
//   on-screen     everything read lies on the screen (the page's width and height)
//   text-whole    no cut or ellipsised words; words not wider than their box; no more lines than the text's place allows
//   light         a light sits whole round what it lights, centred on it
//   tap-size      nothing that takes a tap is under 48 CSS px either way
//   frame-slots   the side panel, the bottom row and the play area in the same place at the same size: through one game's moments
//                 and levels, and the same as chai's reference
//   headline      the order headline is one size through a round, and at most two lines on a phone
//   pill-clear    a word pop's pill keeps off what it stands by (the board, the hob, the tray, the pans): at least 6 px clear (CK-112's
//                 label, a hair above the board, was 4.7 px at 740x320; its fix is 10 px)
//   panel-holds   Nani's box, the order cards and the list lie inside the side panel
export const TOL = { overlap: 1, edge: 1, slot: 0.5, light: 0.12, tap: 48, pill: 6, phoneH: 500, headlineLines: 2, fs: 0.5 };

const px = (v) => Math.round(v * 10) / 10;
const sizeOf = (key) => { const m = /(\d+)x(\d+)/.exec(String(key)); return m ? { w: +m[1], h: +m[2] } : null; };
const wh = (b) => `${px(b[2] - b[0])}x${px(b[3] - b[1])}`;
const at = (b) => `[${b.map(px).join(", ")}]`;
/** how far two boxes overlap: {w, h} (px each way), or null when they are apart or only touch */
export function overlap(a, b) {
  const w = Math.min(a[2], b[2]) - Math.max(a[0], b[0]), h = Math.min(a[3], b[3]) - Math.max(a[1], b[1]);
  return w > 0 && h > 0 ? { w, h } : null;
}
/** the gap between two boxes (0 when they touch or overlap): px */
export function gap(a, b) {
  const dx = Math.max(0, Math.max(a[0], b[0]) - Math.min(a[2], b[2])), dy = Math.max(0, Math.max(a[1], b[1]) - Math.min(a[3], b[3]));
  return Math.hypot(dx, dy);
}
const inside = (inner, outer, tol = TOL.edge) => inner[0] >= outer[0] - tol && inner[1] >= outer[1] - tol && inner[2] <= outer[2] + tol && inner[3] <= outer[3] + tol;
const union = (bs) => [Math.min(...bs.map((b) => b[0])), Math.min(...bs.map((b) => b[1])), Math.max(...bs.map((b) => b[2])), Math.max(...bs.map((b) => b[3]))];
const by = (re, o) => Object.entries(o || {}).filter(([k]) => re.test(k));
const isPhone = (size) => { const s = sizeOf(size); return !!s && s.h < TOL.phoneH; };

// each rule: (ctx) -> faults [string]; ctx: {page, moment, read, size, W, H}. A rule may return null for "no data to judge".
export const RULES = [
  {
    id: "overlap", needs: "extra",
    run({ read }) {
      const out = [], ex = read.extra;
      if (!ex) return null;
      const T = read.texts || {};
      const pair = (an, a, bn, b, what) => { const o = a && b && overlap(a, b); if (o && o.w > TOL.overlap && o.h > TOL.overlap) out.push(`${what || `${an} over ${bn}`}: ${an} ${at(a)} overlaps ${bn} ${at(b)} by ${px(o.w)} x ${px(o.h)} px`); };
      // a card's face against its own item cards and words
      for (const [n, f] of Object.entries(ex.faces)) {
        const area = n === "nani" ? "nani" : n;
        if (n.startsWith("pop/")) { for (const [k, b] of by(/^pop\/item-/, ex.items)) pair(n, f, k, b); continue; }
        for (const [k, b] of by(new RegExp("^" + n + "/item-"), ex.items)) pair(n, f, k, b);
        for (const [k, t] of by(new RegExp("^" + area + "/"), T)) if (!/^card-\d+\/(wc-slot|word)#/.test(k) || t.box[1] < f[3] + 1) pair(n, f, k + ` "${t.text}"`, t.box);
      }
      // a card's item cards against each other
      for (const n of new Set(Object.keys(ex.items).map((k) => k.split("/")[0]))) {
        const its = by(new RegExp("^" + n + "/item-"), ex.items);
        for (let i = 0; i < its.length; i++) for (let j = i + 1; j < its.length; j++) pair(its[i][0], its[i][1], its[j][0], its[j][1]);
      }
      // Nani's box over the cards below it
      const bx = read.boxes;
      if (bx.nani) for (const [k, b] of by(/^card-\d+$/, bx)) pair("nani", bx.nani, k, b);
      return out;
    },
  },
  {
    id: "frame-apart",
    run({ read }) {
      const b = read.boxes, out = [];
      const pr = (an, a, bn, c) => { const o = a && c && overlap(a, c); if (o && o.w > TOL.slot && o.h > TOL.slot) out.push(`${an} ${at(a)} overlaps ${bn} ${at(c)} by ${px(o.w)} x ${px(o.h)} px`); };
      pr("side panel", b.side, "play area", b.play);
      pr("side panel", b.side, "bottom row", b["bottom-row"]);
      pr("side panel", b.side, "canvas", b.canvas);
      // (until the frame function makes the play area the box above the bottom row, the bottom row lies inside the play area)
      if (b["bottom-row"] && b.play && !inside(b["bottom-row"], b.play, TOL.edge)) out.push(`bottom row ${at(b["bottom-row"])} is not inside the play area ${at(b.play)}`);
      return out;
    },
  },
  {
    id: "on-screen",
    run({ read, W, H }) {
      const out = [], b = read.boxes, ex = read.extra || {};
      const scr = [0, 0, W, H];
      const chk = (k, bb) => {
        if (!bb) return;
        const d = [["left", scr[0] - bb[0]], ["top", scr[1] - bb[1]], ["right", bb[2] - scr[2]], ["bottom", bb[3] - scr[3]]].filter(([, v]) => v > TOL.edge);
        if (d.length) out.push(`${k} ${at(bb)} is off the ${W}x${H} screen: ${d.map(([s, v]) => `${s} by ${px(v)} px`).join(", ")}`);
      };
      for (const k of ["canvas", "stage", "side", "list", "bottom-row", "hob", "tray", "shelf-first", "shelf-last", "nani", "nani/face", "end-card", "pop", "board", "tawa"]) chk(k, b[k]);
      for (const [k, v] of Object.entries(b)) if (/^(pan|light|glow)-\d+$/.test(k)) chk(k, v);
      for (const [k, v] of Object.entries(ex.pills || {})) chk(k, v);
      for (const [k, v] of Object.entries(ex.faces || {})) chk(k + " face", v);
      return out;
    },
  },
  {
    id: "text-whole",
    run({ read }) {
      const out = [], b = read.boxes, ex = read.extra || {};
      for (const [k, t] of Object.entries(read.texts || {})) if (t.cut) out.push(`"${t.text}" (${k}) is cut at ${at(t.box)}: its words run past a box that hides them`);
      const lim = (k) => (/oc-headline/.test(k) ? TOL.headlineLines : /ng-line/.test(k) ? 2 : 3);
      for (const [k, f] of Object.entries(ex.fit || {})) {
        if (f.sw > f.cw + 1) out.push(`"${f.text}" (${k}) is ${f.sw - f.cw} px wider than its box (${f.sw} in ${f.cw})`);
        if (f.lines > lim(k)) out.push(`"${f.text}" (${k}) is ${f.lines} lines at ${f.fs} px, ${f.lines - lim(k)} more than the ${lim(k)} it may have`);
        const area = k.split("/")[0], ab = b[area];
        if (ab && !inside(f.box, [ab[0], ab[1], ab[2], Infinity], TOL.edge) && (f.box[0] < ab[0] - TOL.edge || f.box[2] > ab[2] + TOL.edge)) out.push(`"${f.text}" (${k}) ${at(f.box)} runs past its ${area} ${at(ab)} sideways`);
      }
      return out;
    },
  },
  {
    id: "light",
    run({ read }) {
      const out = [], b = read.boxes;
      for (const [ln, lb] of by(/^light-\d+$/, b)) {
        const glows = by(/^glow-\d+$/, b);
        const hit = glows.filter(([, g]) => overlap(lb, g));
        if (!hit.length) { if (glows.length) out.push(`${ln} ${at(lb)} holds none of the ${glows.length} lit thing(s) (nearest ${px(Math.min(...glows.map(([, g]) => gap(lb, g))))} px away)`); continue; }
        for (const [gn, g] of hit) if (!inside(g, lb, 0.5)) out.push(`${gn} ${at(g)} sticks out of ${ln} ${at(lb)}: the light does not sit whole round it`);
        const u = union(hit.map(([, g]) => g));
        const cx = (lb[0] + lb[2]) / 2 - (u[0] + u[2]) / 2, cy = (lb[1] + lb[3]) / 2 - (u[1] + u[3]) / 2;
        const mx = TOL.light * (lb[2] - lb[0]), my = TOL.light * (lb[3] - lb[1]);
        if (Math.abs(cx) > mx || Math.abs(cy) > my) out.push(`${ln} ${at(lb)} is off its target ${hit.map(([n]) => n).join("+")} ${at(u)} by ${px(cx)} px across, ${px(cy)} px down (most ${px(mx)} and ${px(my)})`);
        for (const [rn, r] of by(new RegExp("^" + ln + "/ring-\\d+$"), b)) {
          const own = glows.filter(([, g]) => overlap(r, g));
          if (!own.length) out.push(`${rn} ${at(r)} rings nothing lit`);
          else for (const [gn, g] of own) if (!inside(g, r, 0.5)) out.push(`${rn} ${at(r)} does not hold ${gn} ${at(g)} whole`);
        }
      }
      return out;
    },
  },
  {
    id: "tap-size", needs: "extra",
    run({ read, W, H }) {
      const ex = read.extra;
      if (!ex) return null;
      const out = [];
      for (const [k, t] of Object.entries(ex.taps)) {
        if (t[2] <= 0 || t[0] >= W || t[3] <= 0 || t[1] >= H) continue; // not on the screen: nothing to tap
        const w = t[2] - t[0], h = t[3] - t[1];
        if (w < TOL.tap || h < TOL.tap) out.push(`${k} is ${px(w)} x ${px(h)} px at ${at(t)}: under ${TOL.tap} px by ${px(Math.max(TOL.tap - w, TOL.tap - h, 0))}`);
      }
      return out;
    },
  },
  {
    id: "headline", needs: "extra", page: true,
    // (judged over a whole page: its moments together)
    runPage({ page, size }) {
      const out = [], seen = {};
      for (const [m, v] of Object.entries(page.moments || {})) {
        const ex = v.read && v.read.extra;
        if (!ex) return null;
        for (const [k, f] of Object.entries(ex.fit)) if (/\/oc-headline#\d+$/.test(k)) (seen[k] = seen[k] || []).push({ m, ...f });
      }
      for (const [k, list] of Object.entries(seen)) {
        const sizes = [...new Set(list.map((x) => x.fs))];
        if (Math.max(...sizes) - Math.min(...sizes) > TOL.fs) out.push(`${k} is set ${sizes.length} ways in one round: ${list.map((x) => `${x.m} ${x.fs} px in ${x.lines} line${x.lines > 1 ? "s" : ""}`).join(", ")}`);
        if (isPhone(size)) for (const x of list) if (x.lines > TOL.headlineLines) out.push(`${k} at ${x.m} is ${x.lines} lines at ${x.fs} px on a phone (${size}), most ${TOL.headlineLines}`);
      }
      return out;
    },
  },
  {
    id: "pill-clear", needs: "extra",
    run({ read }) {
      const ex = read.extra;
      if (!ex) return null;
      const out = [], b = read.boxes;
      const things = Object.entries(b).filter(([k]) => /^(board|tawa|hob|tray|pan-\d+)$/.test(k));
      for (const [pn, p] of Object.entries(ex.pills || {})) for (const [k, t] of things) {
        const o = overlap(p, t);
        if (o) { out.push(`${pn} ${at(p)} lies over ${k} ${at(t)} by ${px(o.w)} x ${px(o.h)} px`); continue; }
        const g = gap(p, t);
        if (g < TOL.pill) out.push(`${pn} ${at(p)} touches ${k} ${at(t)}: ${px(g)} px between (at least ${TOL.pill})`);
      }
      return out;
    },
  },
  {
    id: "panel-holds",
    run({ read }) {
      const out = [], b = read.boxes;
      if (!b.side) return null;
      for (const k of ["nani", "nani/face", "list"]) if (b[k] && !inside(b[k], b.side, TOL.edge)) out.push(`${k} ${at(b[k])} is not inside the side panel ${at(b.side)}`);
      for (const [k, c] of by(/^card-\d+(\/face)?$/, b)) if (c[0] < b.side[0] - TOL.edge || c[2] > b.side[2] + TOL.edge) out.push(`${k} ${at(c)} runs ${px(Math.max(b.side[0] - c[0], c[2] - b.side[2]))} px past the side panel's sides ${at(b.side)}`);
      return out;
    },
  },
];
// (frame-slots is judged over pages, not one moment: below)
export const RULE_IDS = [...RULES.map((r) => r.id), "frame-slots"];

/** the slots of a read: the side panel, the play area and the bottom row, as the frame will place them */
export const slotsOf = (read) => { const b = (read && read.boxes) || {}; return { side: b.side || null, play: b.play || null, "bottom-row": b["bottom-row"] || (read && read.extra && read.extra.slab) || null }; };

/**
 * judge pages -> [{id, pass, skipped, faults: [{where, msg}]}]. ref: another game's pages (chai's reference) for the frame's slots
 * pages: [{key, game, level, size, moments}]; ref: pages in the same form (or null)
 */
export function judge(pages, { ref = null, only = null } = {}) {
  const res = [];
  const ids = only || RULE_IDS;
  for (const id of ids) {
    const r = { id, pass: true, skipped: false, faults: [], judged: 0 };
    if (id === "frame-slots") {
      judgeSlots(pages, ref, r);
    } else {
      const rule = RULES.find((x) => x.id === id);
      if (!rule) continue;
      for (const page of pages) {
        const sz = sizeOf(page.size || page.key);
        if (!sz) continue;
        if (rule.runPage) {
          const f = rule.runPage({ page, size: page.size });
          if (f === null) { r.skipped = true; continue; }
          r.judged++;
          for (const m of f) r.faults.push({ where: `${page.key}`, msg: m });
          continue;
        }
        for (const [m, v] of Object.entries(page.moments || {})) {
          if (!v.read) continue;
          const f = rule.run({ page, moment: m, read: v.read, size: page.size, W: sz.w, H: sz.h });
          if (f === null) { r.skipped = true; continue; }
          r.judged++;
          for (const msg of f) r.faults.push({ where: `${page.key} ${m}`, msg });
        }
      }
    }
    if (r.skipped && !r.judged) r.pass = null;
    else r.pass = r.faults.length === 0;
    res.push(r);
  }
  return res;
}

function judgeSlots(pages, ref, r) {
  // every (size, view) has one canon: chai's reference when there is one, else the first read; every other read must sit the same
  const canon = new Map();
  const view = (read) => (read.info && read.info.view) || "-";
  const add = (label, page, m, read, isRef) => {
    const key = `${page.size || sizeOf(page.key) && page.key.split("@")[1]}|${view(read)}`;
    const s = slotsOf(read);
    if (!s.side && !s.play) return;
    const c = canon.get(key);
    if (!c && (isRef || !ref)) { canon.set(key, { label: `${label} ${m}`, s }); return; }
    return { key, s, label: `${label} ${m}` };
  };
  const todo = [];
  for (const page of ref || []) for (const [m, v] of Object.entries(page.moments || {})) if (v.read && !canon.has(`${page.size}|${view(v.read)}`)) add(`${page.game || "reference"} ${page.key}`, page, m, v.read, true);
  for (const page of pages) for (const [m, v] of Object.entries(page.moments || {})) { if (!v.read) continue; const t = add(`${page.game || ""} ${page.key}`, page, m, v.read, false); if (t) todo.push(t); }
  // (with no reference the first read is the canon and is not judged against itself)
  for (const t of todo) {
    const c = canon.get(t.key);
    if (!c) { canon.set(t.key, { label: t.label, s: t.s }); continue; }
    r.judged++;
    for (const slot of ["side", "play", "bottom-row"]) {
      const a = c.s[slot], b = t.s[slot];
      if (!a || !b) continue; // (a slot not drawn at a moment: the bottom row is not on the serve view)
      const d = [0, 1, 2, 3].map((i) => b[i] - a[i]);
      if (d.some((x) => Math.abs(x) > TOL.slot)) r.faults.push({ where: t.label, msg: `${slot} ${at(b)} is not where it is in ${c.label}, ${at(a)}: left ${px(d[0])}, top ${px(d[1])}, right ${px(d[2])}, bottom ${px(d[3])} px` });
    }
  }
}

/** a one-line summary per rule, and the faults under it (at most `max` each) */
export function formatRules(res, { max = 8 } = {}) {
  const lines = [];
  for (const r of res) {
    lines.push(`${r.pass === null ? "skip" : r.pass ? "pass" : "FAIL"} ${r.id}${r.pass === null ? ": no extra reads in this run (play again)" : r.pass ? ` (${r.judged} reads)` : `: ${r.faults.length} fault${r.faults.length > 1 ? "s" : ""} in ${r.judged} reads`}`);
    const seen = new Set();
    let n = 0;
    for (const f of r.faults) { const t = `${f.where}: ${f.msg}`; if (seen.has(t)) continue; seen.add(t); if (n++ < max) lines.push(`    ${t}`); }
    if (seen.size > max) lines.push(`    ... and ${seen.size - max} more`);
  }
  return lines.join("\n");
}
