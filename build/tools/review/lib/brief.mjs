// The one loop (S13-T, docs/architecture/evidence-loop.md "The one loop (S13)"): a builder's brief -> its rows' evidence, BEFORE the
// build and AFTER it, from the same probes at the same sizes, and the judge's before-beside-after batch. Pure (no browser, no git),
// unit tested in build/tools/review/evidence.test.mjs. The CLI is build/tools/review/evidence.mjs --before|--after|--judge --brief.
//   ROW_ID                               a fix-list row id in a text (SH-19, CLN-57, DAAR-11, CHAI-02)
//   briefRows(spec, knownIds)            the brief's rows: spec.rows, then every row id its tasks name (do and accept), known ones only
//   briefSizes(spec) / briefSlug(spec)   the sizes it plays (default 740x320, 930x430, 1280x665 and 1920x1080) and its folder name
//   briefProbes(probes, spec)            a row's probes for the brief: on the brief's flows (all when none plays one), at its sizes,
//                                        and a moving thing filmed at 250 and 500 ms (strip:<sel>:4x<ms>) beside its own strip
//   panelKey(...) / pairPanels(b, a)     a panel's identity across two runs (probe, level, size, capture) and the before|after pairs
export const ROW_ID = /\b([A-Z][A-Z]*-(?:[A-Z0-9]+-)*\d+)\b/g;
export const BRIEF_SIZES = ["740x320", "930x430", "1280x665", "1920x1080"];
export const STRIP_MS = [250, 500];
export const STRIP_FRAMES = 4;

const texts = (spec) => [...(spec.tasks || []).flatMap((t) => (typeof t === "string" ? [t] : [t.do, t.accept])), spec.name || ""].filter(Boolean).map(String);
// -> {rows: [ids in order], named: [every id seen], unknown: [ids not on the fix list or its archive], newRows: [ids]}
export function briefRows(spec, knownIds) {
  const known = knownIds instanceof Set ? knownIds : new Set(knownIds || []);
  const named = [];
  const add = (id) => { if (!named.includes(id)) named.push(id); };
  for (const id of spec.rows || []) add(String(id).trim());
  for (const t of texts(spec)) for (const m of t.matchAll(ROW_ID)) add(m[1]);
  // a build ID in a task's words (S13-A1, F7, CK-48's sibling "S12") is not a row: only the fix list's ids count
  const rows = named.filter((id) => known.has(id));
  const newRows = [...new Set((spec.newRows || spec.newFeatures || []).map(String))].filter((id) => rows.includes(id));
  return { rows, named, unknown: named.filter((id) => !known.has(id) && (spec.rows || []).includes(id)), newRows };
}
export const briefSizes = (spec) => (Array.isArray(spec.sizes) && spec.sizes.length ? spec.sizes.map(String) : BRIEF_SIZES.slice());
export const briefSlug = (spec, file = "") => String(spec.report || spec.slug || String(file).split("/").pop().replace(/\.json$/, "") || "brief").toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
const baseOf = (flowId) => String(flowId || "").replace(/[@#].*$/, "");

// a row whose words are about what the sidebar says or lights (the doctor's line, the lit row, the card): a strip of the stage alone
// cannot show them, so the sidebar is cropped beside it (fix round, 26 Oct: CLN-57's .cl-heal strips dropped the sidebar)
export const SIDEBAR = ".cl-side, #side, .njg-side";
export const SIDEBAR_WORDS = /doctor'?s line|nani'?s line|her line|lit row|the row|rows?\b.*\b(lit|tick|name)|the card|order card|side ?card|sidebar|guide box|help box|the line/i;
// probes: one row's normalized probes (sandbox/lib/evidence.mjs normalizeSpec); spec: the brief. parse: parseCapture. rowText: the
// row's issue and check
export function briefProbes(probes, spec, parse, rowText = "") {
  const flows = (spec.flows || []).map(baseOf);
  const hit = probes.filter((p) => !p.repo && flows.includes(baseOf(p.flowId)));
  const use = hit.length ? probes.filter((p) => p.repo || hit.includes(p)) : probes;
  const sizes = briefSizes(spec);
  const ms = Array.isArray(spec.strips) ? spec.strips.map(Number) : STRIP_MS;
  return use.map((p) => {
    if (p.repo) return p;
    const capture = p.capture.slice();
    // (an every: probe films each of its moments already: no more strips for it)
    if (p.kind === "motion" && !p.every && parse) {
      for (const sel of [...new Set(p.capture.filter((c) => c.kind === "strip" || c.kind === "trace").map((c) => c.sel))]) {
        for (const m of ms) {
          const raw = `strip:${sel}:${STRIP_FRAMES}x${m}`;
          if (!capture.some((c) => c.raw === raw)) { const c = parse(raw); if (!c.error) capture.push(c); }
        }
      }
    }
    // the sidebar beside a strip of the stage, when the row's words live there
    const strips = capture.filter((c) => c.kind === "strip" && !/side/.test(c.sel));
    if (parse && strips.length && SIDEBAR_WORDS.test(rowText) && !capture.some((c) => c.kind === "shot" || ((c.kind === "crop" || c.kind === "zoom2") && /side|#mission|ng-|guide/.test(c.sel)))) {
      const c = parse(`crop:${SIDEBAR}`); if (!c.error) capture.push(c);
    }
    return { ...p, sizes, capture };
  });
}

// ---------- pairing by moment (fix round, 26 Oct: SH-19 paired a before's 5 frames with an after's 2) ----------
// A panel (index.json frames, a brief's panels.json) -> its units: one per frame of an every: probe, keyed by (the panel, the moment,
// the occurrence), one per strip, crop or screen keyed the same way. Old copies (before the fix round) carry no moment per frame: it is
// read from the label ("... at every <moment> (n)", "... at <moment>") and the frame's caption ("<n> · <t> s").
const rawOf = (key) => { const p = String(key || "").split("|"); return p.length >= 4 ? p.slice(3).join("|") : ""; };
export const isWhole = (p) => p.type === "room" || /^(room:)?shot$/.test(rawOf(p.key).replace(/^room:/, "")) || rawOf(p.key) === "shot" || !!p.whole;
const isStripPanel = (p) => p.type === "frames" && (/^strip:/.test(rawOf(p.key)) || / · strip:/.test(p.label || ""));
export function unitsOf(panels = []) {
  const out = [], occ = new Map();
  const next = (k) => { const n = (occ.get(k) || 0) + 1; occ.set(k, n); return n; };
  for (const p of panels) {
    const whole = isWhole(p);
    if (p.type === "frames" && !isStripPanel(p)) {
      const every = / at every (.+?) \(\d+\)$/.exec(p.label || "");
      const base = (p.label || "").replace(/ at every .*$/, "");
      p.files.forEach((f, k) => {
        const n = f.n != null ? f.n : +((/^(\d+) ·/.exec(f.cap || "") || [])[1] || k + 1);
        const moment = f.moment || (every ? every[1] : "");
        out.push({ key: `${p.key}@${moment}#${n}`, label: `${base} at ${moment} (${n})`, type: "img", files: [f], whole, from: p });
      });
      continue;
    }
    const m = / at ([^ ]+)$/.exec(p.label || "") || /· ([^ :]+(?::[^ :]+)?): the screen/.exec(p.label || "");
    const moment = p.moment || (m ? m[1] : "");
    const n = next(`${p.key}@${moment}`);
    out.push({ key: `${p.key}@${moment}#${n}`, label: p.label, type: isStripPanel(p) ? "strip" : "img", files: p.files, whole, from: p, motion: p.motion || null });
  }
  return out;
}
// before, after: units -> [{key, before, after}]: the same (panel, moment, occurrence) only; anything else stands alone, "no match"
export function pairUnits(before = [], after = []) {
  const out = [], used = new Set();
  for (const a of after) { const b = before.find((x) => x.key === a.key && !used.has(x)); if (b) used.add(b); out.push({ key: a.key, before: b || null, after: a }); }
  // the before's unmatched units go in at their place (after the last pair whose before came earlier)
  before.forEach((b, i) => {
    if (used.has(b)) return;
    let at = 0;
    for (let k = 0; k < out.length; k++) if (out[k].before && before.indexOf(out[k].before) < i) at = k + 1;
    out.splice(at, 0, { key: b.key, before: b, after: null });
  });
  return out;
}

// a strip's frames against their slots (k x ms): true where a frame landed more than `tol` ms off (fix round, 26 Oct: 0/452/738/1144)
export const SLOT_TOL = 60;
export const offSlots = (times = [], ms = 0, tol = SLOT_TOL) => times.map((t, k) => !!ms && Math.abs(+t - k * ms) > tol);
// a frame caption's ms ("452 ms", "452 ms (slot 250: off)") -> 452, else null
export const capMs = (cap) => { const m = /^(\d+) ms/.exec(String(cap || "")); return m ? +m[1] : null; };

// ---------- refuse a still strip (fix round, 26 Oct: CLN-57's .cl-heal frames 0-900 ms were one picture) ----------
// imgs: decoded frames {w, h, data}. Against the first frame: the largest share of pixels that changed by more than `level` (of 255)
// in any channel, and the largest mean change. A strip where under 2.5 % of the crop changed shows no motion: the sheet and the .md say so, and no judge
// may read it as proof of a glow, a bob or a fade. (Calibrated on S13's runs: a real glow or finger moves 2.9-44 % of its crop.)
export const NO_MOTION = { share: 0.025, level: 16 };
export function stripMotion(imgs) {
  let share = 0, mean = 0;
  for (let k = 1; k < imgs.length; k++) {
    const A = imgs[0], B = imgs[k];
    if (!A || !B || A.w !== B.w || A.h !== B.h) { share = 1; mean = 255; break; }
    let n = 0, ch = 0, d = 0;
    const step = Math.max(1, Math.floor((A.w * A.h) / 60000));
    for (let i = 0; i < A.w * A.h; i += step) {
      const o = i * 4, dr = Math.abs(A.data[o] - B.data[o]), dg = Math.abs(A.data[o + 1] - B.data[o + 1]), db = Math.abs(A.data[o + 2] - B.data[o + 2]);
      n++; d += (dr + dg + db) / 3; if (Math.max(dr, dg, db) > NO_MOTION.level) ch++;
    }
    share = Math.max(share, ch / n); mean = Math.max(mean, d / n);
  }
  const moving = imgs.length >= 2 && share >= NO_MOTION.share; // (the mean is reported, not decided on: a 1-level wobble over the whole crop is no motion)
  return { moving, share: Math.round(share * 10000) / 100, mean: Math.round(mean * 100) / 100, note: moving ? "" : `no motion captured (${Math.round(share * 10000) / 100} % of the crop changed, mean ${Math.round(mean * 100) / 100}): not proof of any movement` };
}

// a panel's identity: the same probe, level, size and capture in the before and the after run
export const panelKey = (probe, level, size, raw, type = "img") => `p${probe + 1}|L${level}|${size}|${type === "room" ? "room:" : ""}${raw}`;
// before, after: [{key, ...}] -> [{key, before, after}] in the after's order, then the before's leftovers
export function pairPanels(before = [], after = []) {
  const out = [], seen = new Set();
  for (const a of after) { out.push({ key: a.key, before: before.find((b) => b.key === a.key) || null, after: a }); seen.add(a.key); }
  for (const b of before) if (!seen.has(b.key)) { out.push({ key: b.key, before: b, after: null }); seen.add(b.key); }
  return out;
}
// what a missing before means on the sheet: a new feature (the row describes something not built yet) is "not there yet"; any other
// row's missing before is a probe fault (the judge answers EVIDENCE, never PASS)
export const beforeNote = (isNew, tool = []) => (isNew ? "not there yet (a new feature: nothing to show before the build)" : `PROBE FAULT: the before shows nothing${tool.length ? ` (${tool[0]})` : ""}`);
