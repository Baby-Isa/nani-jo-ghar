/*
 * Shared relations layer: where things are, as data (docs/shared-api.md s1).
 *
 * One list of relation ids (data/relations.json), one scene schema
 * (anchors, spots, occluders, safe), one checker, used by Find it, Tidy up,
 * Monsoon rush, Snap and the clinic's courtyard. Nothing here is geometry
 * grading: a spot carries precomputed relation tags to fixed anchors, and a
 * neighbour graph, so "next to the plate" (a placed item) is derived from
 * neighbours at check time. Nothing here is Kutchi: relation words are
 * placeholders in data/relations.json until the family gives them.
 *
 *   Rel.load(relationsJson)          or  await Rel.loadJSON(url?)
 *   Rel.id(r)                        normalise an alias ("next-left" -> "left-of")
 *   Rel.info(r)                      {word, kind, derived, frame, cams, order}
 *   Rel.scene(base, ...sidecars)     normalised scene (anchors, spots with tags)
 *   Rel.validate(scene)              -> [problem strings]
 *
 *   Two forms of the checker, one per way modes hold state:
 *   Find form (items already placed, each carrying rel: [[relation, of], ...]):
 *     Rel.holds(item, where, scene?)          where = [rel, anchor] | {rel, anchor}
 *     Rel.options(scene, row)                 items (or spots) a row could mean
 *   Board form (Tidy up; state = {placements: {inst: spotId | "tray"}, items?}):
 *     Rel.holds(state, rule, scene)           one row: true / false
 *     Rel.options(state, rule, scene)         spot ids that would satisfy it
 *     Rel.check(state, rules, scene)          [{i, ok}] and .firstWrong
 *     Rel.solve(state, rules, scene, opts)    layouts satisfying every row
 *   Rel.at(spotId, rel, anchor, state, scene)  the primitive under both
 *   Rel.phrase(rule, scene)          word slots in the grammar's order
 *   Rel.visibleFraction(box, scene)  how much of a box shows past occluders
 *   Rel.inSafe(x, y, scene)          outside the outer 5% (or the scene's safe rect)
 *
 * Loaded as a plain <script> it is window.Rel (and Shared.rel); in Node,
 * require() it.
 */
(function (root, factory) {
  const Rel = factory();
  if (typeof module === "object" && module.exports) module.exports = Rel;
  else {
    root.Rel = Rel;
    (root.Shared = root.Shared || {}).rel = Rel;
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const Rel = {};

  // Used only until relations.json is loaded, so a mode that forgets to load
  // it still checks the common relations the same way.
  const FALLBACK = {
    relations: {
      in: { kind: "anchor" },
      on: { kind: "anchor" },
      under: { kind: "anchor" },
      behind: { kind: "anchor", derived: "back" },
      "next-to": { kind: "anchor", derived: "adjacent" },
      "left-of": { kind: "anchor", derived: "left" },
      "right-of": { kind: "anchor", derived: "right" },
      "in-front": { kind: "anchor", derived: "front" },
      between: { kind: "anchor2", derived: "between" },
      "on-top": { kind: "anchor", derived: "stack" },
      middle: { kind: "unary" },
      corner: { kind: "unary" },
      "top-row": { kind: "unary" },
      "bottom-row": { kind: "unary" },
      first: { kind: "unary" },
      last: { kind: "unary" },
      stay: { kind: "leave" },
    },
    aliases: { "next-left": "left-of", "next-right": "right-of", "in-front-of": "in-front", front: "in-front", leave: "stay" },
    grammar: { place: "{x} {anchor} {rel}", unary: "{x} {rel}", between: "{x} {anchor} {anchor2} {rel}" },
  };
  let DATA = FALLBACK;
  Rel.data = () => DATA;
  Rel.load = (json) => {
    DATA = json || FALLBACK;
    return Rel;
  };
  Rel.loadJSON = async (url) => Rel.load(await (await fetch(url || "data/relations.json")).json());

  Rel.id = (r) => {
    if (r == null) return r;
    const a = (DATA.aliases || {})[r];
    return typeof a === "string" ? a : r;
  };
  Rel.info = (r) => (DATA.relations || {})[Rel.id(r)] || { kind: "anchor" };
  Rel.known = (r) => !!(DATA.relations || {})[Rel.id(r)];
  /** Merge the placeholder relation words into a words table (Cook.data.words); never overwrites. */
  Rel.mergeWords = (words) => {
    for (const [id, w] of Object.entries(DATA.words || {})) if (id[0] !== "_" && !words[id]) words[id] = Object.assign({}, w);
    return words;
  };

  /* ------------------------------------------------------------ scenes */
  const toRect = (a) => {
    if (a.rect) return a.rect.slice(0, 4);
    if (a.box) return [a.box[0], a.box[1], a.box[0] + a.box[2], a.box[1] + a.box[3]];
    return null;
  };
  function tagList(sp) {
    const tags = [];
    const push = (rel, anchor, anchor2) => {
      if (rel == null) return;
      const t = { rel: Rel.id(rel) };
      if (anchor != null) t.anchor = anchor;
      if (anchor2 != null) t.anchor2 = anchor2;
      if (!tags.some((p) => p.rel === t.rel && p.anchor === t.anchor && p.anchor2 === t.anchor2)) tags.push(t);
    };
    if (sp.rel) push(sp.rel, sp.anchor);
    for (const a of sp.also || []) Array.isArray(a) ? push(a[0], a[1], a[2]) : push(a.rel, a.anchor, a.anchor2);
    for (const t of sp.tags || []) push(t.rel, t.anchor, t.anchor2);
    return tags;
  }

  /**
   * A normalised scene: anchors and spots keyed by id, every spot with a
   * tags list, nbr, cap and x/y. Sidecars (kitchen-tidy.json and the like)
   * are merged in order: anchors and spots by id (a sidecar spot extends the
   * base spot), other keys shallow. Unknown keys (a mode's own block) pass
   * through untouched.
   */
  Rel.scene = function (base, ...sidecars) {
    const out = { stage: [1600, 900], anchors: {}, spots: {}, occluders: [], surfaces: {}, groups: {} };
    const addAnchors = (list) => {
      if (!list) return;
      const entries = Array.isArray(list) ? list.map((a) => [a.id, a]) : Object.entries(list);
      for (const [id, a] of entries) {
        if (id[0] === "_") continue;
        const prev = out.anchors[id] || {};
        const m = Object.assign({}, prev, a, { id });
        m.rect = toRect(a) || prev.rect || null;
        delete m.box;
        out.anchors[id] = m;
      }
    };
    const addSpots = (list) => {
      if (!list) return;
      const entries = Array.isArray(list) ? list.map((s) => [s.id, s]) : Object.entries(list);
      for (const [id, s] of entries) {
        if (id[0] === "_") continue;
        const prev = out.spots[id] || {};
        const m = Object.assign({}, prev, s, { id });
        if (m.y == null && m.baseline != null) m.y = m.baseline;
        m.nbr = Object.assign({}, prev.nbr || {}, s.nbr || {});
        m.cap = m.cap == null ? 1 : m.cap;
        const extra = tagList(s);
        m.tags = (prev.tags || []).concat(extra.filter((t) => !(prev.tags || []).some((p) => p.rel === t.rel && p.anchor === t.anchor && p.anchor2 === t.anchor2)));
        out.spots[id] = m;
      }
    };
    for (const src of [base].concat(sidecars)) {
      if (!src) continue;
      for (const [k, v] of Object.entries(src)) {
        if (k === "anchors") addAnchors(v);
        else if (k === "spots") addSpots(v);
        else if (k === "occluders") out.occluders = out.occluders.concat(Array.isArray(v) ? v : v ? [v] : []);
        else if (k === "surfaces") (Array.isArray(v) ? v : Object.values(v)).forEach((s) => (out.surfaces[s.id] = Object.assign({}, s, { rect: toRect(s) })));
        else if (k === "groups") Object.assign(out.groups, v);
        else if (k === "stacks") out.stacks = (out.stacks || []).concat(v || []);
        else out[k] = v;
      }
      for (const st of src.stacks || []) if (out.spots[st.spot]) out.spots[st.spot].cap = st.max;
    }
    out._normal = true;
    return out;
  };
  const norm = (scene) => (scene && scene._normal ? scene : Rel.scene(scene || {}));

  /** Problems with a scene's data, as plain strings (the tests and the lab print them). */
  Rel.validate = function (raw) {
    const s = norm(raw);
    const probs = [];
    for (const a of Object.values(s.anchors)) {
      if (!a.rect) probs.push(`anchor ${a.id}: no rect`);
      else if (a.rect[2] <= a.rect[0] || a.rect[3] <= a.rect[1]) probs.push(`anchor ${a.id}: rect is [x0, y0, x1, y1] and must have x1 > x0, y1 > y0`);
    }
    const opp = { left: "right", right: "left", front: "back", back: "front", below: "above", above: "below" };
    for (const sp of Object.values(s.spots)) {
      if (typeof sp.x !== "number" || typeof sp.y !== "number") probs.push(`spot ${sp.id}: needs x and y (or baseline)`);
      for (const t of sp.tags) {
        if (!Rel.known(t.rel)) probs.push(`spot ${sp.id}: unknown relation "${t.rel}"`);
        const k = Rel.info(t.rel).kind;
        if ((k === "anchor" || k === "anchor2") && t.anchor == null) probs.push(`spot ${sp.id}: "${t.rel}" needs an anchor`);
        if (t.anchor != null && !s.anchors[t.anchor] && !isPersonRef(t.anchor)) probs.push(`spot ${sp.id}: unknown anchor "${t.anchor}"`);
      }
      for (const [dir, other] of Object.entries(sp.nbr || {})) {
        if (!other) continue;
        const o = s.spots[other];
        if (!o) probs.push(`spot ${sp.id}: nbr.${dir} "${other}" is not a spot`);
        else if (opp[dir] && o.nbr && o.nbr[opp[dir]] && o.nbr[opp[dir]] !== sp.id) probs.push(`spot ${sp.id}: nbr.${dir} is ${other} but ${other}.nbr.${opp[dir]} is ${o.nbr[opp[dir]]}`);
      }
      if (typeof sp.x === "number" && typeof sp.y === "number" && !sp.edgeOk && !Rel.inSafe(sp.x, sp.y, s)) probs.push(`spot ${sp.id}: in the outer safe margin`);
    }
    return probs;
  };

  /** The safe area: scene.safe as [x0,y0,x1,y1], else the scene minus its outer 5%. */
  Rel.safeRect = (raw) => {
    const s = norm(raw);
    if (Array.isArray(s.safe)) return s.safe;
    const [w, h] = Array.isArray(s.stage) ? s.stage : [1600, 900];
    const m = (s.safe && s.safe.margin) != null ? s.safe.margin : 0.05;
    return [w * m, h * m, w * (1 - m), h * (1 - m)];
  };
  Rel.inSafe = (x, y, raw) => {
    const r = Rel.safeRect(raw);
    return x >= r[0] && x <= r[2] && y >= r[1] && y <= r[3];
  };

  function inPoly(x, y, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i];
      const [xj, yj] = poly[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }
  /**
   * Fraction of box [x0,y0,x1,y1] not covered by the scene's occluders
   * (rect [x0,y0,x1,y1] or poly [[x,y],...]); only occluders with z above
   * `z` count (default: all). Sampled on a 24x24 grid, good to ~2%.
   */
  Rel.visibleFraction = function (box, raw, z) {
    const s = norm(raw);
    const occ = s.occluders.filter((o) => z == null || (o.z || 0) > z);
    const N = 24;
    let seen = 0;
    for (let i = 0; i < N; i++)
      for (let j = 0; j < N; j++) {
        const x = box[0] + ((i + 0.5) * (box[2] - box[0])) / N;
        const y = box[1] + ((j + 0.5) * (box[3] - box[1])) / N;
        const hid = occ.some((o) => (o.poly ? inPoly(x, y, o.poly) : o.rect && x >= o.rect[0] && x <= o.rect[2] && y >= o.rect[1] && y <= o.rect[3]));
        if (!hid) seen++;
      }
    return seen / (N * N);
  };

  /* --------------------------------------------------- matching things */
  const isPersonRef = (r) => typeof r === "string" && r[0] === "@";
  const wordOfAnchor = (s, id) => {
    const a = s.anchors[id];
    return a ? a.word || a.en || id : id;
  };
  function instRecord(state, inst) {
    const rec = (state.items && state.items[inst]) || {};
    const noun = rec.noun || rec.item || String(inst).split("#")[0];
    return Object.assign({ id: inst, noun }, rec.attrs || {}, rec, { noun });
  }
  const instances = (state) => Array.from(new Set(Object.keys(state.items || {}).concat(Object.keys(state.placements || {}))));
  const placedAt = (state, inst) => {
    const p = (state.placements || {})[inst];
    return p == null || p === "tray" ? null : p;
  };
  /** Does an instance match a selector (a word id, "@group", or an attrs object)? */
  function selects(scene, state, rec, item, attrs) {
    if (item != null) {
      if (isPersonRef(item)) {
        const name = item.slice(1);
        const grp = (state.groups || {})[name] || scene.groups[name];
        if (grp) {
          if (!grp.includes(rec.noun) && !grp.includes(rec.id)) return false;
        } else if (rec.noun !== name && rec.id !== name && rec.who !== name) return false;
      } else if (rec.noun !== item && rec.id !== item) return false;
    }
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === "kind") {
        if (rec.kind !== v && rec.noun !== v) return false;
      } else if (rec[k] !== v) return false;
    }
    return true;
  }
  const matching = (scene, state, item, attrs) => instances(state).map((i) => instRecord(state, i)).filter((r) => selects(scene, state, r, item, attrs));

  /**
   * What an anchor reference means on this board: a set of scene anchor ids
   * (matched by id, by "@person" seated there, or by word), plus the spots of
   * placed instances it names (for derived relations like "next to the plate").
   * {most|least: attr} picks the placed instance with the extreme value.
   */
  function resolveAnchor(scene, state, ref, opts) {
    const ids = new Set();
    const spots = new Set();
    if (ref == null) return { ids, spots };
    if (typeof ref === "object") {
      const key = ref.most != null ? "most" : "least";
      const attr = ref[key];
      const ranks = (opts && opts.ranks && opts.ranks[attr]) || null;
      const val = (r) => (ranks ? ranks.indexOf(r[attr]) : Number(r[attr]));
      const cands = matching(scene, state, ref.item, ref.attrs).filter((r) => r[attr] != null && placedAt(state, r.id));
      if (cands.length) {
        cands.sort((a, b) => (key === "most" ? val(b) - val(a) : val(a) - val(b)));
        spots.add(placedAt(state, cands[0].id));
      }
      return { ids, spots };
    }
    if (isPersonRef(ref)) {
      const who = ref.slice(1);
      const seated = state.who || {};
      for (const a of Object.values(scene.anchors)) if ((seated[a.id] || a.who) === who) ids.add(a.id);
    } else if (scene.anchors[ref]) {
      ids.add(ref);
      if (opts && opts.byWord) {
        const w = wordOfAnchor(scene, ref);
        for (const a of Object.values(scene.anchors)) if (wordOfAnchor(scene, a.id) === w) ids.add(a.id);
      }
    } else {
      for (const a of Object.values(scene.anchors)) if (a.word === ref || a.en === ref) ids.add(a.id);
    }
    // a placed item named by word id or "@name" (derived relations)
    if (state && state.placements) for (const r of matching(scene, state, ref, null)) {
      const p = placedAt(state, r.id);
      if (p) spots.add(p);
    }
    return { ids, spots };
  }

  /**
   * The primitive: does spot `spotId` stand in `rel` to `anchor` (and
   * `anchor2` for "between")? True by a precomputed tag on the spot, or,
   * when the anchor is a placed item, by the neighbour graph.
   */
  Rel.at = function (spotId, rel, anchor, state, raw, anchor2, opts) {
    const s = norm(raw);
    state = state || {};
    const sp = s.spots[spotId];
    if (!sp) return false;
    rel = Rel.id(rel);
    const info = Rel.info(rel);
    if (info.kind === "unary") return sp.tags.some((t) => t.rel === rel && (anchor == null || t.anchor == null || resolveAnchor(s, state, anchor, opts).ids.has(t.anchor)));
    const A = resolveAnchor(s, state, anchor, opts);
    const B = info.kind === "anchor2" ? resolveAnchor(s, state, anchor2, opts) : null;
    for (const t of sp.tags) {
      if (t.rel !== rel) continue;
      if (!B && A.ids.has(t.anchor)) return true;
      // "between" is symmetric: the tag may name the two anchors either way round
      if (B && ((A.ids.has(t.anchor) && B.ids.has(t.anchor2)) || (B.ids.has(t.anchor) && A.ids.has(t.anchor2)))) return true;
    }
    const n = sp.nbr || {};
    const has = (set, id) => id != null && set.has(id);
    switch (info.derived) {
      case "adjacent":
        return has(A.spots, n.left) || has(A.spots, n.right);
      case "left":
        return has(A.spots, n.right);
      case "right":
        return has(A.spots, n.left);
      case "front":
        return has(A.spots, n.back);
      case "back":
        return has(A.spots, n.front);
      case "stack":
        return has(A.spots, n.below);
      case "between":
        return !!B && ((has(A.spots, n.left) && has(B.spots, n.right)) || (has(B.spots, n.left) && has(A.spots, n.right)));
      default:
        return false;
    }
  };

  /* ---------------------------------------------------- the Find form */
  const whereOf = (w) => (Array.isArray(w) ? { rel: w[0], anchor: w[1], anchor2: w[2] } : w || {});
  /**
   * Find form: does a placed item (rel: [[relation, of], ...]) stand where a
   * row says? Anchors match by WORD, not id (two crates are both "the crate"
   * until a level names which; Find it D3); pass {byWord: false} for ids.
   */
  function holdsItem(item, where, raw, opts) {
    const s = norm(raw);
    const w = whereOf(where);
    const byWord = !opts || opts.byWord !== false;
    const rel = Rel.id(w.rel);
    const word = (id) => {
      if (s.anchors[id]) return wordOfAnchor(s, id);
      const it = (s.items || []).find ? (s.items || []).find((x) => x.id === id) : null;
      return it ? it.noun : id;
    };
    return (item.rel || []).some((r) => {
      if (Rel.id(r[0]) !== rel) return false;
      if (Rel.info(rel).kind === "unary" && w.anchor == null) return true;
      if (r[1] === w.anchor) return true;
      return byWord && word(r[1]) === word(w.anchor);
    });
  }

  /* --------------------------------------------------- the board form */
  function ruleParts(rule) {
    const anchor = Array.isArray(rule.anchor) ? rule.anchor[0] : rule.anchor;
    const anchor2 = Array.isArray(rule.anchor) ? rule.anchor[1] : rule.anchor2;
    return { rel: Rel.id(rule.rel), anchor, anchor2 };
  }
  const satisfies = (s, state, r, rule, opts) => {
    const p = placedAt(state, r.id);
    if (!p) return false;
    const { rel, anchor, anchor2 } = ruleParts(rule);
    return Rel.at(p, rel, anchor, state, s, anchor2, opts);
  };
  const ruleType = (rule) => {
    if (rule.not) return "not";
    if (rule.items && rule.by) return "order";
    if (rule.n != null) return "count";
    if (rule.all) return "class";
    if (Rel.id(rule.rel) === "stay") return "leave";
    if (rule.anchor && typeof rule.anchor === "object" && !Array.isArray(rule.anchor)) return "compare";
    if (Rel.info(rule.rel).kind === "unary") return "unary";
    return "place";
  };
  Rel.ruleType = ruleType;

  function holdsRule(state, rule, raw, opts) {
    const s = norm(raw);
    opts = Object.assign({ byWord: false }, opts || {}, rule.byWord != null ? { byWord: rule.byWord } : {});
    switch (ruleType(rule)) {
      case "place":
      case "unary":
      case "compare":
        return matching(s, state, rule.item, rule.attrs).some((r) => satisfies(s, state, r, rule, opts));
      case "class": {
        const m = matching(s, state, rule.all.item, Object.assign({}, rule.all, { item: undefined }));
        return m.length > 0 && m.every((r) => satisfies(s, state, r, rule, opts));
      }
      case "count":
        return matching(s, state, rule.item, rule.attrs).filter((r) => satisfies(s, state, r, rule, opts)).length === rule.n;
      case "leave": {
        const start = state.start || {};
        return matching(s, state, rule.item, rule.attrs).every((r) => (placedAt(state, r.id) || "tray") === (start[r.id] || "tray"));
      }
      case "not": {
        const inner = rule.not;
        if (ruleType(inner) === "leave") return !holdsRule(state, inner, s, opts);
        const sel = inner.all ? [inner.all.item, Object.assign({}, inner.all, { item: undefined })] : [inner.item, inner.attrs];
        return !matching(s, state, sel[0], sel[1]).some((r) => satisfies(s, state, r, inner, opts));
      }
      case "order": {
        const m = matching(s, state, rule.items, rule.attrs);
        if (!m.length) return false;
        const along = (sp) => sp && (sp.anchor === rule.along || sp.surface === rule.along || sp.tags.some((t) => t.anchor === rule.along));
        const placed = m.map((r) => ({ r, sp: s.spots[placedAt(state, r.id)] }));
        if (placed.some((p) => !along(p.sp))) return false;
        placed.sort((a, b) => a.sp.x - b.sp.x);
        if (rule.from != null) {
          const fa = s.anchors[rule.from];
          const fx = fa && fa.rect ? (fa.rect[0] + fa.rect[2]) / 2 : null;
          const mean = placed.reduce((t, p) => t + p.sp.x, 0) / placed.length;
          if (fx != null && fx > mean) placed.reverse();
        }
        const ranks = (opts.ranks || {})[rule.by];
        const v = (r) => (ranks ? ranks.indexOf(r[rule.by]) : Number(r[rule.by]));
        for (let i = 1; i < placed.length; i++) {
          const d = v(placed[i].r) - v(placed[i - 1].r);
          if (rule.dir === "asc" ? d <= 0 : d >= 0) return false;
        }
        return true;
      }
    }
    return false;
  }

  /**
   * Rel.holds, both forms:
   *   holds(item, where, scene?, opts?)  Find: a placed item with item.rel
   *   holds(state, rule, scene, opts?)   Tidy: state.placements, one rule
   */
  Rel.holds = function (a, b, scene, opts) {
    if (a && a.placements) return holdsRule(a, b, scene, opts);
    return holdsItem(a, b, scene, opts);
  };

  /** Every row checked; .firstWrong is the index Nani recasts first (or -1). */
  Rel.check = function (state, rules, raw, opts) {
    const s = norm(raw);
    const out = rules.map((r, i) => ({ i, ok: holdsRule(state, r, s, opts) }));
    const bad = out.find((x) => !x.ok);
    out.firstWrong = bad ? bad.i : -1;
    out.allOk = !bad;
    return out;
  };

  const used = (s, state, exceptInst) => {
    const n = {};
    for (const [inst, p] of Object.entries(state.placements || {})) if (p && p !== "tray" && inst !== exceptInst) n[p] = (n[p] || 0) + 1;
    return n;
  };

  /**
   * Rel.options, both forms:
   *   options(scene, row)          Find: the scene's placed items (scene.items)
   *                                that the row's noun + where could mean, or,
   *                                with no items, the spot ids tagged so
   *   options(state, rule, scene)  Tidy: free spot ids (cap respected; the
   *                                rule's own item may move) where placing the
   *                                rule's item satisfies the rule's relation
   *                                given everything else ("not" rules: where it
   *                                doesn't). This is what Ali picks among, and
   *                                what the ">= 3 options" check counts.
   */
  Rel.options = function (a, b, c, opts) {
    if (a && a.placements) return optionsBoard(a, b, c, opts);
    const s = norm(a);
    const row = b || {};
    const w = whereOf(row.where);
    if (Array.isArray(s.items) && s.items.length) {
      return s.items.filter((it) => (row.noun == null || it.noun === row.noun) && (!row.where || holdsItem(it, w, s, opts)));
    }
    return Object.values(s.spots)
      .filter((sp) => !row.where || sp.tags.some((t) => t.rel === Rel.id(w.rel) && (w.anchor == null || t.anchor === w.anchor || wordOfAnchor(s, t.anchor) === wordOfAnchor(s, w.anchor))))
      .map((sp) => sp.id);
  };
  function optionsBoard(state, rule, raw, opts) {
    const s = norm(raw);
    opts = Object.assign({ byWord: false }, opts || {});
    const type = ruleType(rule);
    const inner = type === "not" ? rule.not : rule;
    const sel = inner.all ? [inner.all.item, Object.assign({}, inner.all, { item: undefined })] : [inner.item || inner.items, inner.attrs];
    const mover = matching(s, state, sel[0], sel[1])[0];
    const moverId = mover ? mover.id : null;
    const busy = used(s, state, moverId);
    if (type === "leave") return [(state.start || {})[moverId] || "tray"];
    const { rel, anchor, anchor2 } = ruleParts(inner);
    const out = [];
    for (const sp of Object.values(s.spots)) {
      if ((busy[sp.id] || 0) >= sp.cap) continue;
      if (type === "order") {
        if (sp.anchor === rule.along || sp.surface === rule.along || sp.tags.some((t) => t.anchor === rule.along)) out.push(sp.id);
        continue;
      }
      const ok = Rel.at(sp.id, rel, anchor, state, s, anchor2, opts);
      if (type === "not" ? !ok : ok) out.push(sp.id);
    }
    return out;
  }

  /**
   * Layouts that satisfy every rule, by backtracking (small boards: about 10
   * movable items x 40 spots). state.items lists the instances; those named
   * by no rule stay where state.placements has them (or the tray). Each
   * named instance tries the tray and the spots its rules allow. Returns up
   * to opts.limit placements maps (default 1); opts.maxNodes caps the search
   * (default 200000) and result.exhausted says whether it finished.
   */
  Rel.solve = function (state, rules, raw, opts) {
    const s = norm(raw);
    opts = Object.assign({ limit: 1, maxNodes: 200000 }, opts || {});
    const base = Object.assign({}, state.placements || {});
    const insts = instances(state).map((i) => instRecord(state, i));
    const spotIds = Object.keys(s.spots);
    const named = new Map();
    for (const r of insts) {
      for (const rule of rules) {
        const t = ruleType(rule);
        const inner = t === "not" ? rule.not : rule;
        const sel = inner.all ? [inner.all.item, Object.assign({}, inner.all, { item: undefined })] : [inner.item || inner.items, inner.attrs];
        if (!selects(s, state, r, sel[0], sel[1])) continue;
        if (!named.has(r.id)) named.set(r.id, new Set(["tray"]));
        const dom = named.get(r.id);
        if (t === "leave") {
          dom.clear();
          dom.add((state.start || {})[r.id] || "tray");
          continue;
        }
        const { rel, anchor, anchor2 } = ruleParts(inner);
        const derived = Rel.info(rel).derived && !resolveAnchor(s, {}, anchor, opts).ids.size;
        for (const id of spotIds) {
          if (t === "not" || t === "order" || t === "compare" || derived || Rel.at(id, rel, anchor, {}, s, anchor2, opts)) dom.add(id);
        }
      }
    }
    const order = Array.from(named.keys());
    const found = [];
    let nodes = 0;
    const cur = Object.assign({}, base);
    order.forEach((i) => (cur[i] = "tray"));
    const count = {};
    for (const [i, p] of Object.entries(cur)) if (p !== "tray" && !named.has(i)) count[p] = (count[p] || 0) + 1;
    const st = Object.assign({}, state, { placements: cur });
    function rec(k) {
      if (found.length >= opts.limit || nodes > opts.maxNodes) return;
      nodes++;
      if (k === order.length) {
        if (rules.every((r) => holdsRule(st, r, s, opts))) found.push(Object.assign({}, cur));
        return;
      }
      const inst = order[k];
      for (const p of named.get(inst)) {
        if (p !== "tray" && (count[p] || 0) >= s.spots[p].cap) continue;
        cur[inst] = p;
        if (p !== "tray") count[p] = (count[p] || 0) + 1;
        rec(k + 1);
        if (p !== "tray") count[p]--;
        cur[inst] = "tray";
        if (found.length >= opts.limit || nodes > opts.maxNodes) return;
      }
    }
    rec(0);
    found.exhausted = nodes <= opts.maxNodes;
    found.nodes = nodes;
    return found;
  };

  /**
   * The word slots for a row in the grammar's order ({x} {anchor} {rel}):
   * [x, anchorWord, relWord] as word ids, ready for Cook.Lang.phrase. The
   * anchor's word comes from the scene (anchor.word), else the ref itself.
   */
  Rel.phrase = function (rule, raw, x) {
    const s = norm(raw);
    const { rel, anchor, anchor2 } = ruleParts(rule);
    const info = Rel.info(rel);
    const g = DATA.grammar || FALLBACK.grammar;
    const tpl = info.kind === "unary" ? g.unary : info.kind === "anchor2" ? g.between : g.place;
    const aw = (ref) => {
      if (ref == null) return null;
      if (s.anchors[ref]) return s.anchors[ref].word || ref;
      if (isPersonRef(ref)) return ref.slice(1);
      return ref;
    };
    const slots = { x: x != null ? x : rule.item, anchor: aw(anchor), anchor2: aw(anchor2), rel: info.word || rel };
    return tpl.match(/\{(\w+)\}/g).map((m) => slots[m.slice(1, -1)]).filter((v) => v != null);
  };

  return Rel;
});
