/*
 * The clinic's screen kit (DOM; no Phaser): the pieces every stage and
 * every healing game shares, so the screen looks and behaves the same all
 * the way through a patient (docs/design-language/ux-principles.md s1-s4, s11, s13).
 *
 *   Kit.Card     the instruction card (the master): rows that tick when a
 *                step closes, a throbbing hint, one speaker (reads the rows
 *                in order, lighting each), the light bulb's English flip
 *   Kit.Bulb     the one light bulb: English for 5/3/2 s by level; counts a hint
 *   Kit.Tally    pictures with how many you did (never the target)
 *   Kit.Tray     the fixed-slot tray of dishes (the pharmacy fills it, heal uses it)
 *   Kit.Voice    say a line: the family's audio when there is some, else the
 *                device voice (quietly skipped in tests), with a bubble
 *   Kit.icon     an item's picture: rough art if data/clinic/rough-art.json has it, else a greybox disc
 *   Kit.text     how a word shows: Kutchi, or the English placeholder in grey italic
 *
 * Words: {kutchi, english, placeholder?}. A row's `kutchi` may mix real
 * Kutchi with bracketed placeholders ("Ne poi [cloth]"): the brackets show
 * as grey italic English. Never invent Kutchi.
 */
(function (global) {
  "use strict";
  const Clinic = (global.Clinic = global.Clinic || {});
  const Kit = (Clinic.Kit = Clinic.Kit || {});

  const h = (Kit.h = function (tag, cls, parent, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    if (parent) parent.appendChild(n);
    return n;
  });
  Kit.wait = (ms) => new Promise((r) => setTimeout(r, Kit.fast ? Math.min(ms, 60) : ms));

  /* ---------------- words ---------------- */
  /** A word or row as DOM: Kutchi in plain text, placeholders grey italic. */
  // decision 84 (CLN-14, S05-G): a placeholder keeps its hidden "to record" tag in the markup (data-rec), as Cook's and the
  // shared Say's do, so the tools can tell it from words the child reads
  const ph = (parent, text) => {
    const n = h("span", "ph", parent, text);
    n.dataset.rec = "to record";
    return n;
  };
  Kit.text = function (w, parent) {
    const span = h("span", "cl-words", parent);
    if (!w) return span;
    const k = w.kutchi;
    if (!k || w.placeholder === true) {
      ph(span, w.english || "");
      return span;
    }
    String(k)
      .split(/(\[[^\]]*\])/)
      .filter((seg) => seg && seg.trim()) // the space between two segments is the CSS margin (no double gap)
      .forEach((seg) => {
        if (seg.startsWith("[")) return ph(span, seg.slice(1, -1).replace(/^EN:\s*/, ""));
        // CLN-68: punctuation that follows a word ("[Wipe], ba") joins that word, so there's never a space before a
        // comma; the words after it keep their gap (the CSS margin between spans)
        // (it rides on the word before it, so it's never a tiny span of its own under the 14 px floor)
        const m = /^\s*([,.;:!?]+)(.*)$/.exec(seg);
        if (m && span.lastChild) {
          span.lastChild.textContent += m[1];
          if (m[2].trim()) h("span", "ku", span, m[2].replace(/^\s+/, ""));
        } else h("span", "ku", span, seg);
      });
    return span;
  };
  /** Plain text of a word for the device voice (English for placeholders). */
  Kit.plain = (w) => {
    if (!w) return "";
    if (!w.kutchi || w.placeholder === true) return w.english || "";
    return String(w.kutchi).replace(/\[(?:EN:\s*)?([^\]]*)\]/g, "$1");
  };

  /* ---------------- art ---------------- */
  Kit.art = null; // data/clinic/rough-art.json, once loaded
  Kit.root = ""; // path prefix to the site root ("../" from lab/)
  Kit.url = (u) => (global.njgV ? global.njgV(Kit.root + u) : Kit.root + u);
  // CLN-88 (load times): each file is fetched once per page (the same text shared by every caller, each gets its own
  // parsed copy) and through the browser's cache: the URL carries the version stamp (njgV), so no revalidation trip
  const jsonText = new Map();
  Kit.loadJSON = async function (path) {
    const u = Kit.url(path);
    if (!jsonText.has(u))
      jsonText.set(
        u,
        fetch(u, global.njgV ? {} : { cache: "no-cache" })
          .then((r) => (r.ok ? r.text() : null))
          .catch(() => null)
      );
    try {
      const t = await jsonText.get(u);
      return t == null ? null : JSON.parse(t);
    } catch (e) {
      return null;
    }
  };
  Kit.loadArt = async function () {
    const a = await Kit.loadJSON("data/clinic/rough-art.json");
    Kit.art = a || null;
    return Kit.art;
  };
  /** The sprite path for an id (an item, a kind, a scene piece) or null. Accepts {sprites: {id: path}} or {id: path} or {id: {src}}. */
  Kit.sprite = function (id) {
    const a = Kit.art;
    if (!a || !id) return null;
    const pools = [a.sprites, a.items, a.people, a.kinds, a.scene, a.props, a];
    const find = (key) => {
      for (const p of pools) {
        if (!p || typeof p !== "object") continue;
        const v = p[key];
        if (typeof v === "string" && /\.(png|webp|svg|jpg)$/i.test(v)) return v;
        if (v && typeof v === "object" && (v.src || v.file || v.path)) return v.src || v.file || v.path;
      }
      return null;
    };
    // the manifest's aliases (care-*, tool-*, body-*, Kutchi item names), then an item's own `sprite` or `same`
    const d = Kit.ITEMS[id] || {};
    return find(id) || (a.alias && a.alias[id] && find(a.alias[id])) || (d.sprite && find(d.sprite)) || (d.same && d.same !== id ? Kit.sprite(d.same) : null);
  };
  /** A room background (the manifest's `rooms`): "waiting" | "exam" | "pharmacy". */
  Kit.room = function (name) {
    const a = Kit.art;
    const id = a && a.rooms && a.rooms[name];
    return id ? Kit.sprite(id) : null;
  };
  /** A patient kind's sprite for a mood (neutral, ouch, giggle, relief, happy, wave), or null. */
  Kit.person = function (kind, mood) {
    const a = Kit.art;
    const p = a && a.patients && a.patients[kind];
    if (!p) return null;
    return Kit.sprite(p[mood] || p.neutral);
  };

  /**
   * CLN-150 (s07-clinic-a): the doctor is ONE man everywhere, the real one (sources/art/s07, his sheet): his art is
   * data/clinic/heal-art.json `doctor` (loaded with the clinic's base data, js/clinic/heal/host.js loadBase), which every
   * stage reads: `box` = his box and card faces (neutral, talk, laugh, think), `views` = his standing views on one feet
   * line and one drawn size, `poses` = which view each staging turn draws.
   */
  Kit.doctorArt = function () {
    const HH = Clinic.HealHost;
    const S = Clinic.Stages;
    const a = (HH && HH.healArt) || (S && S._healArt);
    return (a && a.doctor) || null;
  };
  /**
   * The contact shadows (s08-placement-judge, CLN-154..157: "pasted on" until his feet and hers touch the floor as every
   * painted thing does): a soft ellipse under each foot of a standing (or the seated girl's) picture, black at 0.30 (the token), 1.2x
   * the foot's width and 0.35x of that tall, centred on the foot's lowest row and 0.06x of its width right of the foot (heal-art.json `shoes`, measured by
   * build/tools/art/shoes.py: [cx, bottom, w, h] as canvas fractions, keyed by the picture's file). The spec's "0.25x its
   * height" is read as the ellipse's own: a quarter of the foot's measured height (h) is 2 px under the sole on a phone,
   * where nothing shows. host = the box drawn at that picture's canvas (the picture fills it), aspect = its width over its
   * height; the shadows go under the picture. A file with no measured feet draws none (and clears the old ones).
   */
  Kit._shadows = 0;
  Kit.contactShadows = function (host, file, aspect) {
    if (!host) return;
    host.querySelectorAll(":scope > .cl-shadow").forEach((n) => n.remove());
    const HH = Clinic.HealHost;
    const S = Clinic.Stages;
    const a = (HH && HH.healArt) || (S && S._healArt);
    const key = String(file || "").replace(/[?#].*$/, "").replace(/^.*?(assets\/)/, "$1").replace(/@2x(\.webp)$/, "$1");
    // CLN-162 (Zafar, 18 Oct: "her feet have a drop shadow underneath them, so it looks like her feet aren't resting on
    // the wooden stool"; clinic decision 5: her dangling feet were not meant, her shadow goes under the stool): a seated
    // patient (her front, blanket and bottle pictures: patients.<kind>.front / blanket / bottle) casts no shadow under
    // her feet, which rest on the stool; the stool's own painted shadow on the floor is the one under her. Standing
    // pictures (hers and the doctor's) keep one under each measured foot, and a picture with no measured feet has none
    const P = (a && a.patients) || {};
    const seated = Object.keys(P).some((k) => ["front", "blanket", "bottle"].some((v) => P[k] && P[k][v] === key));
    const feet = seated ? [] : (a && a.shoes && a.shoes[key]) || [];
    feet.forEach(([cx, bottom, w]) => {
      // an ellipse blurred at its edge (in its own units, so it is as soft at every size); the colour is a token
      const id = `cl-shadow-${++Kit._shadows}`;
      const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      e.setAttribute("class", "cl-shadow");
      e.setAttribute("aria-hidden", "true");
      e.setAttribute("viewBox", "0 0 100 100");
      e.setAttribute("preserveAspectRatio", "none");
      e.innerHTML = `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter><ellipse cx="50" cy="50" rx="40" ry="40" filter="url(#${id})"/>`;
      const ew = 1.2 * w;
      // s08-rejudge-fixes: 0.35x its width tall (0.25x did not ground anyone on a phone), centred 0.06x of its width right of
      // the foot (the window light is on the left, shadows fall right)
      const eh = 0.35 * ew * (aspect || 0.45);
      const ecx = cx + 0.06 * ew;
      Object.assign(e.style, { left: `${(ecx - ew / 2) * 100}%`, top: `${(bottom - eh / 2) * 100}%`, width: `${ew * 100}%`, height: `${eh * 100}%` });
      host.insertBefore(e, host.firstChild);
    });
  };
  /** His face for a box or a card (neutral, talk, laugh, think), as a URL. */
  Kit.doctorFace = function (mood) {
    const A = Kit.doctorArt();
    const box = (A && A.box) || {};
    return Kit.url(box[mood || "neutral"] || box.neutral || "assets/clinic/patients/doctor/v2/faces/neutral.webp");
  };
  /** The doctor's face for his box and the heal card: his neutral face (Kit.doctorFace). */
  Object.defineProperty(Kit, "DOCTOR_FACE", { get: () => Kit.doctorFace("neutral"), configurable: true });
  Kit.ITEMS = {}; // filled from data/clinic.json items
  Kit.COLOURS = {
    red: "#d23b3b", blue: "#3b6fd2", green: "#3fa35b", yellow: "#f0c43a", white: "#f4f1ea", black: "#33333b",
    pink: "#e77fb0", orange: "#e8872f", purple: "#8e5bb5", brown: "#8a5a3a",
  };
  /** Split an item id into its base and colour: "drops-blue" -> {base: "drops", colour: "blue"}. */
  Kit.itemParts = function (id) {
    const s = String(id || "");
    if (Kit.ITEMS[s]) return { base: s, colour: Kit.ITEMS[s].colour || null };
    const m = /^(.*)-(red|blue|green|yellow|white|black|pink|orange|purple|brown)$/.exec(s);
    if (m) return { base: m[1], colour: m[2] };
    return { base: s, colour: null };
  };
  Kit.itemInfo = function (id) {
    const it = typeof id === "object" ? id : { id };
    const { base, colour } = Kit.itemParts(it.id);
    let d = Kit.ITEMS[it.id] || Kit.ITEMS[base] || {};
    if (d.same && Kit.ITEMS[d.same]) d = Object.assign({}, Kit.ITEMS[d.same], d);
    const out = Object.assign({ glyph: "•" }, d, {
      id: it.id,
      base,
      colour: it.colour || d.colour || colour || null,
      size: it.size || d.size || null,
    });
    // the item's name is the language engine's (js/clinic/lang.js; step 4e): its word, or its gap's placeholder
    const CL = global.ClinicLang;
    const lex = CL && CL.engine && (CL.lex(it.id, ["clinic.item.", ""]) || CL.lex(d.same || base, ["clinic.item.", ""]));
    const w = lex ? CL.w(lex) : { kutchi: null, english: String(base).replace(/-/g, " "), placeholder: true, plan: [] };
    return Object.assign(out, { kutchi: w.kutchi, english: w.english, placeholder: w.placeholder, plan: w.plan });
  };
  /**
   * Clinic v2 stand-ins (flat shapes, no new art: docs/game-design/modes/clinic.md "Prototype first"):
   * an item whose data names a `standin` draws it instead of its rough sprite (the apple for the lolly,
   * the filling's tube, a torch that looks like a torch); the four feeling faces; the doctor's silhouette.
   */
  Kit.STANDIN = {
    apple: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 18c-4-4-10-5-15-2-8 5-8 18-3 28 4 8 9 12 13 11 2 0 3-1 5-1s3 1 5 1c4 1 9-3 13-11 5-10 5-23-3-28-5-3-11-2-15 2z" fill="#d23b3b"/><path d="M22 22c-4 3-5 9-4 13" stroke="#f08a80" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 18c0-5 1-9 4-12" stroke="#6b4a2b" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M35 12c5-5 12-5 15-3-3 5-9 7-15 3z" fill="#3fa35b"/></svg>',
    tube: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="8" y="24" width="36" height="16" rx="3" fill="#f4f1ea" stroke="#9aa0a8" stroke-width="2.5"/><path d="M8 24l-4 3v10l4 3z" fill="#c9ced6" stroke="#9aa0a8" stroke-width="2"/><rect x="44" y="27" width="7" height="10" rx="1.5" fill="#3b6fd2"/><rect x="51" y="29" width="8" height="6" rx="1.5" fill="#3b6fd2"/><rect x="14" y="29" width="22" height="6" rx="2" fill="#bfe0d7"/></svg>',
    torch: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M44 22l14-8v36l-14-8z" fill="#fff4b0" opacity=".9"/><rect x="8" y="26" width="26" height="12" rx="3" fill="#3b6fd2"/><path d="M34 22h10v20H34z" fill="#2d5aa8"/><rect x="44" y="24" width="3" height="16" fill="#ffe26a"/><rect x="16" y="23" width="7" height="4" rx="1.5" fill="#e2a33a"/></svg>',
  };
  Kit.FEEL = {
    happy: { fill: "#f7c948", mouth: '<path d="M20 40q12 12 24 0" stroke="#5a3a1a" stroke-width="3.5" fill="none" stroke-linecap="round"/>' },
    sad: { fill: "#9cc3e6", mouth: '<path d="M20 46q12-10 24 0" stroke="#2d4a6a" stroke-width="3.5" fill="none" stroke-linecap="round"/>', extra: '<path d="M22 30q-2 6 0 8q2-2 0-8z" fill="#3b6fd2"/>' },
    hot: { fill: "#f08a5d", mouth: '<ellipse cx="32" cy="44" rx="6" ry="4" fill="#7a2a1a"/>', extra: '<path d="M48 14q-3 6 0 8q3-2 0-8z" fill="#3b9ad2"/><path d="M54 24q-3 5 0 7q3-2 0-7z" fill="#3b9ad2"/>' },
    cold: { fill: "#bfe3f2", mouth: '<path d="M20 44l4-3 4 3 4-3 4 3 4-3 4 3" stroke="#2d4a6a" stroke-width="2.5" fill="none"/>', extra: '<path d="M6 10l5 5M11 10l-5 5M52 48l5 5M57 48l-5 5M8 44l4 4M12 44l-4 4" stroke="#fff" stroke-width="2.5"/>' },
  };
  /** A flat feeling face (happy, sad, hot, cold): the same for everyone (CQ6). */
  Kit.feelingFace = function (f, parent) {
    const d = h("div", `cl-feel feel-${f}`, parent);
    const F = Kit.FEEL[f] || Kit.FEEL.happy;
    d.innerHTML = `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="28" fill="${F.fill}" stroke="rgba(0,0,0,.12)" stroke-width="2"/><circle cx="23" cy="26" r="3.5" fill="#2a2522"/><circle cx="41" cy="26" r="3.5" fill="#2a2522"/>${F.mouth}${F.extra || ""}</svg>`;
    return d;
  };
  /**
   * The doctor standing (CLN-150, s07-clinic-a): his real art (heal-art.json doctor.views), one man on one feet line.
   * o.h = his body's height as a share of the room (scenes-v2 `doctor.h`); place it with S.place WITHOUT a height (the
   * element is his view's canvas, sized from o.h). Each view stands by its own measured feet line and the x between
   * his feet, so a turn (S.pose: talk left or right, front to the player, the wave, the waiting room's call) swaps the
   * picture in place, never stretched or squashed, never mirrored (he is a real person). el.__doc.head is his head (the
   * bubbles' anchor); while he talks his talking mouth (DF1, a head layer) flaps on the view that has it, and he
   * blinks (DF3) now and then; a view without them bobs (the shared talk). o.view: the first view (default talk-left).
   */
  Kit.doctorFigure = function (parent, cls, o = {}) {
    const A = Kit.doctorArt() || { views: {}, poses: {}, fig_h: 676 };
    const d = h("div", `cl-doc cl-doc-art ${cls || ""}`, parent);
    d.dataset.talker = "doctor";
    d.setAttribute("aria-hidden", "true");
    // his own box: never the stand-in's aspect, mirror or tint (css/clinic.css .cl-doc, .cl-doc-stand, .cl-staged)
    Object.assign(d.style, { aspectRatio: "auto", filter: "none", transition: "none", pointerEvents: "none" });
    const inner = h("div", "cl-doc-in", d);
    Object.assign(inner.style, { position: "absolute", inset: "0" });
    const pic = (cls2) => {
      const i = h("img", cls2, inner);
      i.alt = "";
      i.draggable = false;
      // (no inline display: the hidden attribute must still hide a layer)
      Object.assign(i.style, { position: "absolute", inset: "0", width: "100%", height: "100%" });
      return i;
    };
    const base = pic("cl-doc-base");
    const layer = pic("cl-doc-face");
    layer.hidden = true;
    const head = h("i", "cl-doc-head", d);
    Object.assign(head.style, { position: "absolute", display: "block", pointerEvents: "none" });
    const H = o.h || 0.66;
    const set = (img, src) => {
      const u = Kit.url(src);
      if (img.dataset.src === u) return;
      img.dataset.src = u;
      img.src = u;
      img.srcset = `${u} 1x, ${Kit.url(String(src).replace(/\.webp$/, "@2x.webp"))} 2x`;
    };
    const st = { view: null, name: null, talking: false, flap: null, blink: null };
    const rest = () => {
      const V = st.view;
      const f = (V && V.faces) || {};
      // DD1 calls with his mouth open; DD2's closed mouth is his face at rest
      if (f.closed && !st.talking) {
        set(layer, f.closed);
        layer.hidden = false;
      } else layer.hidden = true;
    };
    const show = (name) => {
      const key = (A.poses && A.poses[name]) || name;
      const V = A.views && (A.views[key] || A.views["3q-left"]);
      if (!V) return;
      st.name = key;
      st.view = V;
      set(base, V.file);
      const r = 0.075; // his head's half height, as a share of the canvas
      const rw = (r * V.canvas[1]) / V.canvas[0];
      Object.assign(d.style, {
        height: `${((H * V.h) / (A.fig_h || 676)) * 100}%`,
        aspectRatio: `${V.w} / ${V.h}`,
        transform: `translate(${-V.stand * 100}%, ${-V.feet * 100}%)`,
      });
      Object.assign(head.style, { left: `${(V.head[0] - rw) * 100}%`, top: `${(V.head[1] - r) * 100}%`, width: `${rw * 200}%`, height: `${r * 200}%` });
      Kit.contactShadows(d, V.file, V.w / V.h);
      rest();
    };
    const blinkLoop = () => {
      if (Kit.fast || st.blink) return;
      const tick = () => {
        if (!d.isConnected) return void (st.blink = null);
        const f = st.view && st.view.faces;
        if (f && f.blink && !st.talking) {
          set(layer, f.blink);
          layer.hidden = false;
          setTimeout(() => !st.talking && rest(), 140);
        }
        st.blink = setTimeout(tick, 3200 + Math.random() * 2200);
      };
      st.blink = setTimeout(tick, 2400);
    };
    d.__doc = {
      head,
      /** A staging turn: "talk" (facing "left" | "right"), "front", "wave" (facing), "call". */
      pose(pose, facing) {
        // (the waiting room's call is his face-on view there: "front" keeps him standing and waving)
        const name = pose === "front" ? (o.view === "call" ? "call" : "front") : pose === "call" ? "call" : pose === "wave" ? (facing === "left" ? "front" : "wave-right") : facing === "right" ? "talk-right" : "talk-left";
        show(name);
      },
      get view() {
        return st.name;
      },
    };
    // the talk (Kit.Voice.say): his talking mouth on the view that has one (DF1; DD1's open mouth over DD2's closed),
    // else the shared bob
    d.__talk = () => {
      const f = (st.view && st.view.faces) || {};
      st.talking = true;
      if (f.talk || f.closed) {
        let open = false;
        const flap = () => {
          open = !open;
          if (f.talk) {
            set(layer, f.talk);
            layer.hidden = !open;
          } else layer.hidden = open; // the closed mouth off = DD1's open mouth
        };
        flap();
        st.flap = setInterval(flap, Kit.fast ? 60 : 170);
        return () => {
          clearInterval(st.flap);
          st.talking = false;
          rest();
        };
      }
      const stop = global.Lifecycle && global.Lifecycle.talk ? global.Lifecycle.talk.dom(inner) : null;
      return () => {
        st.talking = false;
        if (stop) stop();
      };
    };
    show(o.view || "talk-left");
    blinkLoop();
    return d;
  };

  /** An item's picture: <div class="cl-item"> with a sprite, or a greybox glyph disc tinted by colour. */
  Kit.icon = function (item, parent, cls) {
    const info = Kit.itemInfo(item);
    const d = h("div", `cl-item ${cls || ""}`, parent);
    d.dataset.item = info.id;
    // an item whose data names its own picture (`img`, a path: the clinic v2 item art, e.g. the apple) draws it;
    // s07-clinic-b: a coloured one draws its own-colour picture (`imgs[colour]`, the s07 belt sheets), so the CSS tint
    // (.cl-item[data-colour]:not(.own-colour)) never applies to it
    const own = info.colour && info.imgs && info.imgs[info.colour];
    if (own || (info.img && !info.colour)) {
      if (own) {
        d.classList.add("own-colour");
        d.dataset.colour = info.colour;
        d.style.setProperty("--tint", Kit.COLOURS[info.colour] || info.colour);
      }
      const img = h("img", "cl-item-img", d);
      img.alt = "";
      img.draggable = false;
      img.src = Kit.url(own || info.img);
      return d;
    }
    if (info.standin && Kit.STANDIN[info.standin]) {
      d.classList.add("standin");
      d.innerHTML = Kit.STANDIN[info.standin];
      return d;
    }
    if (info.colour) d.dataset.colour = info.colour;
    if (info.size) d.dataset.size = info.size;
    const src = (info.colour && (Kit.sprite(`${info.base}-${info.colour}`) || Kit.sprite(`${info.id}-${info.colour}`))) || Kit.sprite(info.id) || Kit.sprite(info.base);
    if (src && info.colour && (Kit.sprite(`${info.base}-${info.colour}`) || Kit.sprite(`${info.id}-${info.colour}`))) d.classList.add("own-colour");
    if (src) {
      const img = h("img", "cl-item-img", d);
      img.alt = "";
      img.draggable = false;
      img.src = Kit.url(src);
    } else h("span", "cl-item-glyph", d, info.glyph);
    if (info.colour) d.style.setProperty("--tint", Kit.COLOURS[info.colour] || info.colour);
    if (info.size === "small") d.classList.add("small");
    if (info.size === "big") d.classList.add("big");
    return d;
  };

  /* ---------------- the voice ---------------- */
  const Voice = (Kit.Voice = {
    quiet: false, // no device voice (tests, ?quiet=1)
    speakers: {}, // who -> () => element to anchor the bubble to (or null: the card)
    busy: false,
    queue: Promise.resolve(),
    log: [],
  });
  const estimate = (text) => Math.max(900, Math.min(4200, 420 + 330 * String(text || "").split(/\s+/).length));
  Voice.tts = function (text, o = {}) {
    if (!live(o.gen)) return Promise.resolve(true);
    if (Voice.quiet || !text || !global.speechSynthesis) return Promise.resolve(false);
    return new Promise((res) => {
      try {
        const u = new global.SpeechSynthesisUtterance(text);
        u.rate = 0.9;
        if (o.soft) u.volume = 0.5;
        let done = false;
        const end = () => !done && ((done = true), res(true));
        u.onend = end;
        u.onerror = end;
        global.speechSynthesis.cancel();
        global.speechSynthesis.speak(u);
        setTimeout(end, estimate(text) + 1500);
      } catch (e) {
        res(false);
      }
    });
  };
  /*
   * The voice stop (S03-A; SH-64, CLN-109; S04-B, SH-66): the clinic's voice is part of the shared lifecycle's one voice
   * layer (js/shared/request-popup.js Lifecycle.voice): every stop it makes (a stage end, the end screen, a tap through
   * the request pop-up) runs cutAll here. Voice.gen goes up; a line takes the generation when it's queued and plays only
   * while it's unchanged, so the lines already chained on the queue fall silent too; the playing clip (Voice.playing)
   * is paused and the device voice cancelled.
   */
  Voice.gen = 0;
  // a line made stale by the game (opts.stale(): its step closed before its turn came): skipped, or cut between words
  const stale = (o) => {
    try {
      return !!(o && typeof o.stale === "function" && o.stale());
    } catch (e) {
      return false;
    }
  };
  Voice.playing = new Set(); // the family clips playing now
  const VS = () => (global.Lifecycle && global.Lifecycle.voice) || null;
  const live = (g) => g == null || g === Voice.gen;
  const cutAll = () => {
    Voice.gen++;
    Voice.playing.forEach((a) => a._cut && a._cut());
    Voice.playing.clear();
    try {
      global.speechSynthesis && global.speechSynthesis.cancel();
    } catch (e) {
      /* no voice */
    }
  };
  if (VS()) VS().onStop(cutAll);
  // a stage that ended takes the queue with it (the next stage starts silent), and its speakers (a speaker of the last
  // stage is gone from the screen: its bubble must never be placed by an element that isn't there any more)
  if (global.Lifecycle) global.Lifecycle.onStageEnd(() => {
    Voice.queue = Promise.resolve();
    Voice.busy = false;
    Object.keys(Voice.speakers).forEach((k) => delete Voice.speakers[k]);
  });
  Voice.audio = function (src, o = {}) {
    if (!live(o.gen)) return Promise.resolve(true);
    return new Promise((res) => {
      try {
        const a = new Audio(Kit.url(src));
        if (o.soft) a.volume = 0.45; // a whisper (the ear's hearing check): the same family clip, quieter
        let done = false;
        let untrack = () => {};
        const end = (ok) => {
          if (done) return;
          done = true;
          Voice.playing.delete(a);
          untrack();
          res(ok);
        };
        // stopped: the clip pauses and the line counts as said (no device voice in its place)
        a._cut = () => {
          try {
            a.pause();
          } catch (e) {
            /* gone */
          }
          end(true);
        };
        Voice.playing.add(a);
        if (VS()) untrack = VS().track(a, a._cut);
        a.onended = () => end(true);
        a.onerror = () => end(false);
        a.play().catch(() => end(false));
        setTimeout(() => end(true), 8000);
      } catch (e) {
        res(false);
      }
    });
  };
  /**
   * Say a line. line: {kutchi, english, audio?, who?} or a string (English
   * placeholder). opts.who: "doctor" | "patient" | "nani" | "kasuku".
   * Shows a bubble by the speaker for as long as it plays. Resolves when done.
   */
  /**
   * Play the engine's clip plan for a line (js/core/lang/engine/clips.js; decision 26: stitched from the family's word
   * recordings): each piece's family clip in order, and a piece with no recording yet by the device voice (test build
   * only; TTS never ships, rule 10). Resolves true when anything played.
   */
  Voice.plan = async function (plan, o = {}) {
    if (!plan || !plan.length) return false;
    let any = false;
    for (let i = 0; i < plan.length; i++) {
      if (!live(o.gen)) return true; // stopped mid-line: the rest of it stays quiet
      if (i > 0 && stale(o)) return true; // CLN-119: its step closed mid-line: the rest of it stays quiet
      const c = plan[i];
      let ok = false;
      if (c.file) ok = await Voice.audio(c.file, o);
      if (!ok) ok = await Voice.tts(c.text, o);
      any = any || ok;
      if (i < plan.length - 1 && !Kit.fast) await new Promise((r) => setTimeout(r, 120));
    }
    return any;
  };
  /**
   * Say a line. line: a display word {kutchi, english, plan, audio?, who?} (js/clinic/lang.js) or a string (English
   * placeholder). opts.who: "doctor" | "patient" | "nani" | "kasuku".
   * Shows a bubble by the speaker for as long as it plays. Resolves when done.
   */
  Voice.say = function (line, opts = {}) {
    const w = typeof line === "string" ? { english: line, kutchi: null } : line || {};
    const who = opts.who || w.who || "doctor";
    Voice.log.push({ who, text: Kit.plain(w), t: Date.now() });
    const gen = Voice.gen; // a stop before this line's turn (Voice.clear, a tap through the pop-up) skips it
    const run = async () => {
      if (!live(gen)) return;
      // CLN-119 (a child heard "laal" while the yellow plaster's row was lit): a step's line still waiting in the queue
      // when its step closes is never said late, under the next step's row
      if (stale(opts)) return;
      Voice.busy = true;
      // decision 55 (F26), S04-B (SH-68): the doctor with no face on screen (the pharmacy belt) speaks by his green box
      // at the top left, never from a bubble with no head under it
      const offGuide = !opts.noBubble && who === "doctor" && Voice.toGuide && !Voice.onScreen(who) ? Voice.toGuide(w) : null;
      const bubble = opts.noBubble || offGuide ? null : Voice.bubble(w, who, opts);
      // the one talk animation (S04-B, ART-13): a speaker drawn as one picture bobs a little while the line plays
      let stopTalk = null;
      if (bubble && global.Lifecycle) {
        let el = null;
        try {
          el = Voice.speakers[who] && Voice.speakers[who]();
        } catch (e) {
          /* no speaker */
        }
        // a figure with its own talking face (the doctor's DF1, the girl's GM1: data-talker, __talk) moves its mouth
        const tk = el && el.closest ? el.closest("[data-talker]") : null;
        if (tk && tk.__talk) stopTalk = tk.__talk();
        else if (el && el.tagName === "IMG") stopTalk = global.Lifecycle.talk.dom(el);
      }
      const t0 = Date.now();
      let played = false;
      const ao = { soft: !!opts.soft, gen, stale: opts.stale };
      if (w.audio) played = await Voice.audio(w.audio, ao);
      // the engine's clip plan: the family's recordings of each word (a placeholder piece has none)
      if (!played && w.kutchi && w.placeholder !== true && w.plan && w.plan.length) played = await Voice.plan(w.plan, ao);
      if (!played) await Voice.tts(Kit.plain(w), ao);
      const left = (Kit.fast ? 150 : estimate(Kit.plain(w))) - (Date.now() - t0);
      if (left > 0 && live(gen) && !stale(opts)) await new Promise((r) => setTimeout(r, left));
      if (stopTalk) stopTalk();
      if (offGuide) offGuide();
      setTimeout(() => bubble && bubble.remove(), live(gen) ? (Kit.fast ? 50 : 500) : 0);
      Voice.busy = false;
    };
    const p = (Voice.queue = Voice.queue.then(run, run));
    return p;
  };
  /** Say a short word at once, outside the queue (a count as you tap: it never holds up the lines). */
  Voice.now = async function (w) {
    let played = false;
    const c = w && w.plan && w.plan.length === 1 ? w.plan[0] : null;
    if (c && c.file) played = await Voice.audio(c.file, { gen: Voice.gen });
    if (!played && !Voice.quiet && global.speechSynthesis) {
      try {
        const u = new global.SpeechSynthesisUtterance(Kit.plain(w));
        u.rate = 0.95;
        global.speechSynthesis.speak(u);
      } catch (e) {
        /* no voice */
      }
    }
  };
  /**
   * The voice stop: nothing queued or playing is heard any more (CLN-109: no heal-game line carries into the send-off).
   * Every stage change and game end calls it; every stop of the shared lifecycle's voice layer (a stage end, a tap through
   * the pop-up) runs the same cut.
   */
  Voice.clear = function () {
    if (VS()) VS().stop("clinic");
    else cutAll();
    Voice.queue = Promise.resolve();
    Voice.busy = false;
    document.querySelectorAll(".cl-bubble").forEach((b) => b.remove());
  };
  Voice.layer = null; // the element bubbles are placed in (the play area)
  Voice.toGuide = null; // screen.js: (line) -> restore(): the line in the doctor's green box while it's said
  /** A speaker with something drawn on the page to speak from (an element still on screen, with a size). */
  Voice.onScreen = function (who) {
    let el = null;
    try {
      el = Voice.speakers[who] && Voice.speakers[who]();
    } catch (e) {
      return false;
    }
    if (!el || !el.isConnected || !el.getBoundingClientRect) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 || r.height > 0;
  };
  Voice.bubble = function (w, who, opts = {}) {
    const layer = opts.layer || Voice.layer || document.body;
    // the speaker's last bubble (kept for half a second after its line) goes when they speak again: two bubbles never
    // stack in the same place (the eye test's rows, read one after another)
    document.querySelectorAll(`.cl-bubble.who-${who}`).forEach((x) => x.remove());
    const b = h("div", `cl-bubble who-${who}`, layer);
    Kit.text(w, b);
    // CLN-76 (E1, G2): a line with no Kutchi yet is a flagged placeholder (grey italic, "to record"), never dark text
    // the child is meant to read
    if (w && (!w.kutchi || w.placeholder === true)) {
      b.classList.add("rec");
      h("small", "cl-rec", b, "to record");
    }
    const anchor = Voice.speakers[who] && Voice.speakers[who]();
    if (anchor) {
      b.classList.add("anchored");
      // the other speakers in the play area (the close-up's round face) are never covered by this one's bubble
      const others = () =>
        Object.keys(Voice.speakers)
          .filter((k) => k !== who)
          .map((k) => {
            try {
              return Voice.speakers[k] && Voice.speakers[k]();
            } catch (e) {
              return null;
            }
          })
          .filter((el) => el && el.isConnected && el.getBoundingClientRect);
      Voice.place(b, anchor, layer, others());
      // the words can settle a frame later (fonts, fitting): place it again then; and while it's up it follows its
      // speaker (S04-B, SH-68: a camera still zooming out moves the head after the bubble came up)
      // CLN-146: every frame, not every 150 ms: her figure steps down at the send-off (about 115 px at 800x360) and a bubble a
      // tick behind sat on her face; it re-places only when the head has moved
      let last = "";
      const follow = () => {
        if (!b.isConnected || !anchor.isConnected) return;
        const r = anchor.getBoundingClientRect();
        // CLN-127: and when something it must not cover (data-njg-avoid: the fever's sweat drop) comes or goes
        const key = `${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.width)},${Math.round(r.height)},${b.offsetWidth},${b.offsetHeight},${document.querySelectorAll("[data-njg-avoid]").length}`;
        if (key !== last) { last = key; Voice.place(b, anchor, layer, others()); }
        if (global.requestAnimationFrame) global.requestAnimationFrame(follow);
        else setTimeout(follow, 16);
      };
      if (global.requestAnimationFrame) global.requestAnimationFrame(follow);
      else setTimeout(follow, 16);
    } else b.classList.add("top");
    return b;
  };
  /**
   * S04-B (SH-68, CLN-86, Z1; decision 75 (4)): the one placement every mode uses (js/shared/request-popup.js
   * Lifecycle.bubble.place): above the speaker's head, below it when there's no room, inside the play area, off the
   * other speakers. The old rule below (CLN-71: above, else beside, else below) is only for a page without the
   * shared lifecycle.
   */
  Voice.place = function (b, anchor, layer, avoid = []) {
    const L = global.Lifecycle;
    if (L && L.bubble && L.bubble.place(b, anchor, layer, { avoid })) return;
    const M = 8;
    const lr = layer.getBoundingClientRect();
    const r = anchor.getBoundingClientRect ? anchor.getBoundingClientRect() : anchor;
    b.style.transform = "none";
    b.style.left = "0px";
    b.style.top = "0px";
    const bw = b.offsetWidth;
    const bh = b.offsetHeight;
    const W = lr.width;
    const H = lr.height;
    const ax = r.left - lr.left;
    const ay = r.top - lr.top;
    let x = ax + r.width / 2 - bw * 0.3; // the tail end of the bubble near the speaker's middle
    let y = ay - M - bh; // above
    if (y < M) {
      if (ax + r.width + M + bw <= W - M) {
        x = ax + r.width + M; // beside, to the right
        y = ay + Math.min(r.height / 2, Math.max(0, r.height - bh) / 2);
      } else if (ax - M - bw >= M) {
        x = ax - M - bw; // beside, to the left
        y = ay;
      } else y = ay + r.height + M; // below
    }
    x = Math.max(M, Math.min(W - bw - M, x));
    y = Math.max(M, Math.min(H - bh - M, y));
    // CLN-71: a bubble clamped in from a speaker outside the play area (the doctor in the guide box) can land on
    // another speaker (the patient's round face, top left): it moves beside that speaker, else under it
    avoid.forEach((el) => {
      const o = el.getBoundingClientRect();
      if (!o.width || !o.height) return;
      const ox = o.left - lr.left;
      const oy = o.top - lr.top;
      if (x >= ox + o.width + M / 2 || x + bw <= ox - M / 2 || y >= oy + o.height + M / 2 || y + bh <= oy - M / 2) return;
      if (ox + o.width + M + bw <= W - M) x = ox + o.width + M;
      else y = Math.min(H - bh - M, oy + o.height + M);
    });
    b.style.left = `${Math.round(x)}px`;
    b.style.top = `${Math.round(y)}px`;
  };

  /* ---------------- the instruction card ---------------- */
  /**
   * new Kit.Card(el, {who: "doctor", face: element|null, title})
   * Clinic fixes (13c, 13h): drawn by the shared order card (js/shared/order-card.js), so it behaves
   * exactly like Cook's: ordered jobs show the sequence line with the next step in the grey band,
   * rows tick when their step closes, the read-along lights each row as it's said, and the higher
   * levels can close the card (a tap is the paid peek). One card per person (the patient's card, the
   * doctor's request); the doctor's box sits above it (screen.js).
   *
   * setRows([{id, kutchi, english, audio?, who?, seq?}]) · addRow(r) · tick(id) · untick(id) · miss(id)
   * pulse(id) · now(id) · count(id, n) · english(on) · speak(ids?) (the read-along)
   * ordered(on): every row is one ordered job (the heal games' steps, the pharmacy's pela ... ne poi ...)
   * rows sharing a `seq` key are one ordered job too; other rows are plain rows
   * close(on, {onPeek}) the closed card (the call is heard, not read): a tap peeks for 3.5 s and counts a hint
   * row(id).el is the row's element as drawn now (tests: .cl-row[data-row=id]).
   */
  Kit.Card = function (el, opts = {}) {
    this.el = el;
    el.classList.add("cl-card");
    el.innerHTML = "";
    this.rows = [];
    this.who = opts.who || "doctor";
    this.big = !!opts.big; // the request pop-up's card at full size (the shared OrderCard {big: true})
    this.onReplay = opts.onReplay || null;
    this.faceEl = null;
    // CLN-140 (R4 in the clinic): the sidebar's doctor card always wears his face (opts.face: () => element), the one
    // face of his on screen; a card set for someone else (faceEl) shows theirs instead
    this.defaultFace = typeof opts.face === "function" ? opts.face : null;
    this.titleText = "";
    this.isOrdered = false;
    this.closed = null;
    this.fold = {};
    this.st = { done: new Set(), miss: new Set(), pulse: null, now: null, reading: null, counts: {} };
    if (global.FitText && global.FitText.watch) try { global.FitText.watch(el); } catch (e) { /* no fitting */ }
    if (opts.title) this.setTitle(opts.title);
  };
  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  /** A row's label for the order card: the Kutchi (placeholders grey italic) and its English for the bulb. */
  Kit.rowHtml = function (r) {
    const t = document.createElement("span");
    t.className = "cl-row-text";
    Kit.text(r, t);
    // CLN-76 (E1, G2): a line with no Kutchi yet stays a flagged placeholder under the bulb too (grey italic), never
    // the bulb's dark translation colour: there is nothing to translate. Boing (S06 r2): so does a row only part Kutchi
    // ("[Wipe], ba": its English "Wipe, two" read as a whole translation, with no to-record tag): the same rule as the
    // guide's box (screen.js setGuide: a line with a bracketed placeholder is to record). The tag is the hidden one
    // (data-rec, decision 84); data-bulb-en marks the bulb's English for the tools
    const ph = !r.kutchi || r.placeholder === true || /\[/.test(String(r.kutchi));
    return `${t.outerHTML}<span class="cl-row-en${ph ? " ph" : ""}" aria-hidden="true" data-bulb-en=""${ph ? ' data-rec="to record"' : ""}>${esc(r.english || "")}</span>`;
  };
  Kit.Card.prototype.render = function () {
    const card = this;
    const st = this.st;
    // the end of the morning hides the empty card (CLN-111); it comes back as soon as it has something to show
    if (this.el.style.display === "none" && (this.titleText || this.rows.length)) this.el.style.display = "";
    const OC = global.OrderCard;
    // D8 (1 Oct) / T29 (6 Oct, decision 55): a progressive card shows the WHOLE step list from the start, the rows
    // still to come greyed ("later") until their step opens, so the child sees what's coming
    const rows = this.rows;
    const pending = this.progressive && this.shown < this.rows.length - 1;
    const part = (r) => ({ label: Kit.rowHtml(r), done: st.done.has(r.id), key: r.id, miss: st.miss.has(r.id) });
    const items = [];
    const groups = {};
    // CLN-54 (P47): a row marked `head` names its `seq` group (a drink, its recipe rows under it: the order card's
    // item with parts); the band marks the part the child is on (now), and each part ticks as its own step is done (SH-10:
    // a nested part is a step, not a count; the game ticks it), the name's row when the whole thing is
    let headed = false;
    rows.forEach((r) => {
      const g = r.seq || (this.isOrdered ? "__all" : null);
      if (g) {
        if (!groups[g]) {
          groups[g] = { label: null, ordered: true, parts: [] };
          items.push(groups[g]);
        }
        if (r.head) {
          headed = true;
          Object.assign(groups[g], { label: Kit.rowHtml(r), key: r.id, done: st.done.has(r.id), miss: st.miss.has(r.id), headed: true });
          return;
        }
        groups[g].parts.push(part(r));
      } else items.push({ label: Kit.rowHtml(r), parts: [], done: st.done.has(r.id), key: r.id, miss: st.miss.has(r.id) });
    });
    // a job with a single step is a plain row (no sequence line for one thing)
    items.forEach((it, i) => {
      if (it.label === null && it.parts.length === 1) items[i] = Object.assign({ parts: [] }, it.parts[0]);
    });
    if (headed) items.forEach((it) => it.parts.forEach((p) => (p.next = !!it.headed && !it.done && st.now === p.key)));
    // decision 95 (contract-8, SH-53): one thing lit at a time: while a row is being read aloud (its read-along light),
    // the next-step band waits (it comes back when the reading ends)
    // CLN-144, CLN-145: and while a tool's hint glows (the next tool, a game's nudge), the band steps back (hush)
    if (st.reading || st.hush) items.forEach((it) => it.parts.forEach((p) => (p.next = false)));
    const tt = this.titleText;
    const headHtml = !tt ? null : typeof tt === "string" ? esc(tt) : Kit.rowHtml(tt);
    // a headline still to record (the heal games' goal, D9) carries the grown-ups' "to record" flag (G2)
    const rec = !!(tt && typeof tt === "object" && !tt.kutchi);
    const data = { person: null, headline: headHtml ? { html: headHtml, key: "__head", rec } : null, items, strip: this.strip || null };
    if (pending) data.done = false;
    card.rows.forEach((r) => (r.el = null));
    const opts = {
      big: this.big,
      fold: this.big ? null : this.fold,
      foldAfter: 900,
      onEl: (key, rowEl) => {
        if (key === "__head") {
          card.headEl = rowEl;
          rowEl.classList.toggle("reading", st.reading === "__head");
          return;
        }
        const r = card.row(key);
        if (!r) return;
        r.el = rowEl;
      },
      decorate: (rowEl, node) => {
        if (node.key == null) return;
        const r = card.row(node.key);
        if (!r) return;
        rowEl.classList.add("cl-row");
        rowEl.dataset.row = r.id;
        rowEl.classList.toggle("later", !!card.progressive && card.rows.indexOf(r) > card.shown);
        rowEl.classList.toggle("pulse", st.pulse === r.id);
        rowEl.classList.toggle("now", st.now === r.id);
        rowEl.classList.toggle("reading", st.reading === r.id);
        const n = st.counts[r.id];
        if (n > 0) {
          const chip = document.createElement("span");
          chip.className = "cl-row-count";
          chip.textContent = Kit.num(n);
          rowEl.insertBefore(chip, rowEl.querySelector(".oc-tk"));
        }
      },
    };
    if (this.closed) {
      opts.closed = true;
      opts.onPeek = this.closed.onPeek || null;
      opts.look = this.closed.look || null; // decision 57: a spoken card's look is a small bulb
      opts.open = !!this.bulbOn; // D11: the bulb opens a closed card for its time
      opts.peekMs = Kit.peekMs(Kit.Bulb && Kit.Bulb.last ? Kit.Bulb.last.level : 3); // SH-101: the peek's time by level
      this.closedSeen = true; // the round had a closed card: the end screen shows the eye badge (D12)
    }
    this.el.innerHTML = "";
    if (!OC) return this;
    const c = OC.card(data, opts);
    // decision 95 (contract-8, SH-53): one thing lit at a time. The drink's recipe (CLN-54) is the card's second item, so
    // the shared card tints its box, and a tinted box round the row now lit reads as a second highlight: no tint here
    if (headed) c.querySelectorAll(".oc-item.tint").forEach((x) => x.classList.remove("tint"));
    // the person's face (= replay), drawn by the clinic (a stand-in face element, not a picture file)
    // CLN-140: his default face is ONE element, moved into each redraw (a new <img> each time showed a blank circle
    // for a frame while it decoded)
    if (this.defaultFace && !this.defFaceEl) this.defFaceEl = this.defaultFace();
    const faceEl = this.faceEl || (this.defFaceEl && this.who === "doctor" ? this.defFaceEl : null);
    if (faceEl) {
      const f = document.createElement("button");
      f.type = "button";
      f.className = "oc-face face-say cl-card-face";
      f.setAttribute("aria-label", "Hear it again");
      f.appendChild(faceEl);
      f.insertAdjacentHTML("beforeend", '<span class="say-badge" aria-hidden="true"></span>');
      f.addEventListener("click", (e) => {
        e.stopPropagation();
        if (card.onReplay) card.onReplay();
        card.speak();
      });
      const head = c.querySelector(".oc-head");
      head.insertBefore(f, head.firstChild);
    }
    if (!rows.length && !faceEl && !this.titleText) c.classList.add("cl-empty");
    // CLN-140 (decision 80): a card that only says the doctor's goal, while he asks on screen in his own bubble (the
    // send-off), is his how-to line, not an order: no request pop-up is owed for it (contract-1)
    if (this.howto && !rows.length) c.dataset.howto = "";
    this.el.appendChild(c);
    this.ocEl = c;
    // SH-41 (S05-D): the card in English for the bulb's time is the card itself (the shared .oc-card), redrawn or not
    if (this.el.classList.contains("english")) c.classList.add("english");
    if (global.FitText && global.FitText.run) try { global.FitText.run(c); } catch (e) { /* no fitting */ }
    return this;
  };
  Kit.Card.prototype.setTitle = function (title, faceEl) {
    this.titleText = title || "";
    this.faceEl = faceEl || null;
    return this.render();
  };
  /** R4 (decision 55): the guide's line as the card's top strip (the doctor is both the asker and the guide). */
  Kit.Card.prototype.setStrip = function (s) {
    this.strip = s && s.html ? s : null;
    const OC = global.OrderCard;
    const c = this.el.querySelector(".oc-card");
    if (OC && OC.setStrip && c) OC.setStrip(c, this.strip);
    return this;
  };
  /**
   * CLN-144, CLN-145 (decision 95, contract-8: one thing lit at a time): while a tool glows to say "this next" (the host's
   * next-tool reveal, a game's nudge), the card's next-step band steps back; hush(false) brings it back. A new set of
   * rows clears it.
   */
  Kit.Card.prototype.hush = function (on = true) {
    if (!!this.st.hush === !!on) return this;
    this.st.hush = !!on;
    return this.render();
  };
  Kit.Card.prototype.ordered = function (on = true) {
    this.isOrdered = !!on;
    return this.render();
  };
  /** The closed card (13a, 13c: from level 3 the call is heard, not read): a tap peeks and counts a hint. */
  Kit.Card.prototype.close = function (on = true, o = {}) {
    this.closed = on ? { onPeek: o.onPeek || null, look: o.look || null } : null;
    this.fold = {};
    return this.render();
  };
  Kit.Card.prototype.setRows = function (rows) {
    this.howto = false; // a new set of rows is an ask again (CLN-140: only the send-off's goal-only card is his how-to)
    this.rows = (rows || []).map((r, i) => Object.assign({ id: r.id || `r${i}` }, r, { el: null }));
    this.st = { done: new Set(), miss: new Set(), pulse: null, now: null, reading: null, counts: {} };
    this.fold = {};
    this.shown = this.progressive ? this.stepEnd(0) : this.rows.length - 1;
    return this.render();
  };
  Kit.Card.prototype.addRow = function (r) {
    this.rows.push(Object.assign({ id: r.id || `r${this.rows.length}` }, r, { el: null }));
    if (this.progressive && this.shown === this.rows.length - 2) this.shown = this.rows.length - 1;
    return this.render();
  };
  /**
   * D8 (1 Oct, SH-45): one instruction at a time. progressive(on): the card shows the first step's rows only;
   * now(stepId) opens the rows of that step (its row, or its parts "<step>0", "<step>1"... and the rows sharing their
   * `seq`), and onReveal(ids) is told, so the doctor says the new line as it appears (never the whole job up front).
   */
  Kit.Card.prototype.setProgressive = function (on = true, onReveal = null) {
    this.progressive = !!on;
    this.onReveal = onReveal;
    this.shown = this.progressive ? this.stepEnd(0) : this.rows.length - 1;
    return this;
  };
  /** The last index of the step group that starts at i (rows sharing the first row's `seq`). */
  Kit.Card.prototype.groupEnd = function (i) {
    if (!this.rows.length) return -1;
    const r = this.rows[i];
    let j = i;
    if (r && r.seq) while (j + 1 < this.rows.length && this.rows[j + 1].seq === r.seq) j++;
    return j;
  };
  /**
   * SH-45 (S05-D): the last index of the STEP that starts at i (its row, or its parts <step>0, <step>1 ...). A sequence
   * (`seq`) may run across several steps (the scrape: the wash, the cloth, each plaster on one line): it is drawn as
   * one sequence, but each step still opens, and is said, on its own (never the whole job up front).
   */
  Kit.Card.prototype.stepEnd = function (i) {
    const r = this.rows[i];
    if (!r) return this.rows.length ? 0 : -1;
    const base = String(r.id).replace(/\d+$/, "");
    let j = i;
    const part = new RegExp(`^${base.replace(/[^\w-]/g, "")}\\d*$`);
    while (j + 1 < this.rows.length && part.test(String(this.rows[j + 1].id)) && base !== String(r.id)) j++;
    return j;
  };
  /** The rows of a step: its own row, or its parts (<step>0, <step>1 ...). */
  Kit.Card.prototype.stepRows = function (stepId) {
    const re = new RegExp(`^${String(stepId).replace(/[^\w-]/g, "")}\\d+$`);
    return this.rows.filter((r) => r.id === stepId || re.test(r.id));
  };
  Kit.Card.prototype.reveal = function (stepId) {
    if (!this.progressive || stepId == null) return [];
    const mine = this.stepRows(stepId);
    if (!mine.length) return [];
    const last = Math.max(...mine.map((r) => this.rows.indexOf(r))); // the step's own rows only (SH-45)
    if (last <= this.shown) return [];
    const fresh = this.rows.slice(this.shown + 1, last + 1).map((r) => r.id);
    this.shown = last;
    return fresh;
  };
  /** Decision 52 (CLN-82): the step after the open one (its first row id), for the L2+ "what's next" reveal. */
  Kit.Card.prototype.nextStepId = function () {
    const cur = this.st.now ? this.rows.findIndex((r) => r.id === this.st.now) : -1;
    const from = cur >= 0 ? this.stepEnd(cur) + 1 : this.shown + 1;
    const r = this.rows.slice(Math.max(0, from)).find((x) => !this.st.done.has(x.id));
    return r ? r.id : null;
  };
  Kit.Card.prototype.row = function (id) {
    return this.rows.find((r) => r.id === id) || null;
  };
  /** Auto-tick when a step CLOSES (UX s11). */
  Kit.Card.prototype.tick = function (id, o = {}) {
    if (!this.row(id) || this.st.done.has(id)) return;
    this.st.done.add(id);
    if (this.st.pulse === id) this.st.pulse = null;
    if (this.st.now === id) this.st.now = null;
    this.render();
    if (!o.quiet && global.Sfx && global.Sfx.right) try { global.Sfx.right(); } catch (e) { /* no sound */ }
  };
  Kit.Card.prototype.untick = function (id) {
    if (this.st.done.delete(id)) this.render();
  };
  /** A wrong pick marks its row in the review only (13c): never shown during play. */
  Kit.Card.prototype.miss = function (id) {
    this.st.miss.add(id);
  };
  Kit.Card.prototype.isTicked = function (id) {
    return this.st.done.has(id);
  };
  /**
   * G6 (the Cook counting rule, Q7): at level 1 a row counts up as you tap, written as the
   * Kutchi number word and said aloud, instead of showing nothing until the step closes.
   */
  /** A number word: the language engine's (js/clinic/lang.js); a number it has no word for shows as the digit. */
  Kit.num = (n) => (global.ClinicLang && global.ClinicLang.engine && global.ClinicLang.numId(n) ? global.ClinicLang.num(n).kutchi : String(n));
  Kit.Card.prototype.count = function (id, n) {
    const r = id ? this.row(id) : this.row(this.st.now) || this.rows.find((x) => !this.st.done.has(x.id));
    if (!r) return null;
    this.st.counts[r.id] = n;
    this.render();
    const chip = r.el && r.el.querySelector(".cl-row-count");
    if (chip) chip.classList.add("bump");
    return r.id;
  };
  /** The throbbing hint (free). pulse(null) stops every pulse. */
  Kit.Card.prototype.pulse = function (id, on = true) {
    this.st.pulse = on && id != null ? id : null;
    this.render();
  };
  /** Mark the row being worked on now (a soft highlight, not a hint). */
  Kit.Card.prototype.now = function (id) {
    const fresh = this.reveal(id);
    if (this.st.now === id && !fresh.length) return;
    this.st.now = id;
    this.render();
    if (fresh.length && this.onReveal) this.onReveal(fresh);
  };
  /** D11: the light bulb is on (or off): a closed card opens for the bulb's whole time, in English. */
  Kit.Card.prototype.bulbOpen = function (on) {
    if (!!this.bulbOn === !!on) return;
    this.bulbOn = !!on;
    // SH-41 (S05-D): a look (peek) running when the bulb is pressed ends now: its timer would fold the card the bulb
    // holds open (the shared card's fold state is this card's own)
    if (on && this.fold) {
      clearTimeout(this.fold.timer);
      this.fold.peekUntil = 0;
    }
    if (this.closed) this.render();
  };
  Kit.Card.prototype.english = function (on) {
    this.el.classList.toggle("english", !!on);
    if (this.ocEl) this.ocEl.classList.toggle("english", !!on);
  };
  /** The read-along: read the rows in order, lighting each as it plays (the card's face is the replay). */
  Kit.Card.prototype.speak = async function (only) {
    const tt = this.titleText;
    // decision 95 (contract-8, SH-53): one thing lit at a time: the next-step band waits while a line is read aloud
    const hold = (on) => {
      // every clinic card's band (the sidebar card's shows under the request pop-up's big card as it reads)
      const doc = this.el.ownerDocument || document;
      if (on) doc.querySelectorAll(".oc-row.next").forEach((x) => (x.classList.remove("next"), (x.dataset.nextHeld = "1")));
      else doc.querySelectorAll("[data-next-held]").forEach((x) => (delete x.dataset.nextHeld, x.isConnected && x.classList.add("next")));
    };
    const gen = Voice.gen; // a voice stop mid-card: the rows still to read stay quiet (SH-64)
    // SH-114, SH-102 (Zafar, 18 Oct: "they should just read out starting from the remaining steps"): a replay (the face, no `only`) says
    // the steps not yet done once some are, and not the headline then; the whole card while none is done, and when all are
    const shown = this.rows.slice(0, this.progressive ? this.shown + 1 : this.rows.length);
    const left = !only && shown.some((r) => this.st.done.has(r.id)) && shown.some((r) => !this.st.done.has(r.id));
    if (!only && !left && tt && typeof tt === "object") {
      this.st.reading = "__head";
      hold(true);
      if (this.headEl) this.headEl.classList.add("reading");
      await Voice.say(tt, { who: this.who, noBubble: true });
      if (this.st.reading === "__head") this.st.reading = null;
      if (this.headEl) this.headEl.classList.remove("reading");
      hold(false);
    }
    const rows = only ? this.rows.filter((r) => only.includes(r.id)) : left ? shown.filter((r) => !this.st.done.has(r.id)) : shown;
    for (const r of rows) {
      if (gen !== Voice.gen) break;
      if (!this.rows.includes(r)) continue;
      this.st.reading = r.id;
      hold(true);
      if (r.el) r.el.classList.add("reading");
      // CLN-119: a row read for its step (it was open when asked) goes quiet if its step closes before its turn: the
      // next step's row is lit by then, and the late line ("ne poi laal plaster") would sound under it
      const was = this.st.done.has(r.id);
      const st = this.st;
      const stale = () => st !== this.st || !this.rows.includes(r) || (!was && st.done.has(r.id));
      await Voice.say(r, { who: r.who || this.who, noBubble: true, stale });
      if (this.st.reading === r.id) this.st.reading = null;
      if (r.el) r.el.classList.remove("reading");
      hold(false);
    }
  };

  /* ---------------- the light bulb ---------------- */
  // the bulb's time per level: data/clinic/pipeline.json "bulb_ms" (D11, 1 Oct: 8 s at every level to start); this is
  // only the fallback before the data loads
  Kit.BULB_MS = { 1: 8000, 2: 8000, 3: 8000, 4: 8000 };
  // SH-101 (Zafar, 17 Oct: level 3 double, the same seconds added to the others): how long the closed card's small bulb holds it open (the
  // peek), by level; was a flat 3.5 s. Cook's table is data/cook.json calm.peekMs (contract-29 reads both as 7 s)
  Kit.PEEK_MS = { 1: 7000, 2: 7000, 3: 7000, 4: 7000, 5: 7000 };
  Kit.peekMs = (level) => Kit.PEEK_MS[level] || Kit.PEEK_MS[3];
  Kit.Bulb = function (btn, opts = {}) {
    this.btn = btn;
    this.level = opts.level || 1;
    Kit.Bulb.last = this; // the screen's bulb: its level is the stage's (the peek's time follows it, SH-101)
    this.onUse = opts.onUse || null;
    // SH-41 (S05-D): the bulb's on and off reach the card (a closed card opens, in English, for the bulb's time); these
    // were passed by the screen and never called
    this.onOn = opts.onOn || null;
    this.onOff = opts.onOff || null;
    this.targets = opts.targets || (() => document.querySelectorAll(".cl-card"));
    this.uses = 0;
    this._h = () => this.use();
    if (opts.keepArt) return; // Nani's box draws the bulb and calls use() (the shared guide, clinic v2)
    btn.classList.add("cl-bulb");
    btn.type = "button";
    btn.setAttribute("aria-label", "Light bulb: show it in English for a moment");
    // SH-100: the one bulb picture (assets/ui/results/icon-bulb.webp), as Nani's and the card's small bulb
    btn.innerHTML = `<img src="${Kit.url("assets/ui/results/icon-bulb.webp")}" alt="" draggable="false">`;
    btn.addEventListener("click", this._h);
  };
  Kit.Bulb.prototype.use = function () {
    if (this.on) return false;
    this.uses++;
    this.on = true;
    const ms = Kit.BULB_MS[this.level] || 3000;
    const cards = Array.from(this.targets());
    cards.forEach((c) => c.classList.add("english"));
    if (this.onOn) this.onOn();
    // the card drawn inside (the shared order card) shows it too, also when it is redrawn while the bulb is on
    cards.forEach((c) => c.querySelectorAll(".oc-card").forEach((o) => o.classList.add("english")));
    document.body.classList.add("cl-english");
    this.btn.classList.add("lit");
    if (this.onUse) this.onUse(this.uses);
    clearTimeout(this._t);
    // SH-41 (S05-D): the bulb's whole time (data, 8 s), never cut by the test speed: it is a reading time (as the shared bulb)
    this._off = () => {
      this._off = null;
      cards.forEach((c) => c.classList.remove("english"));
      cards.forEach((c) => c.querySelectorAll(".oc-card").forEach((o) => o.classList.remove("english")));
      document.body.classList.remove("cl-english");
      this.btn.classList.remove("lit");
      this.on = false;
      if (this.onOff) this.onOff();
    };
    this._t = setTimeout(() => this._off && this._off(), ms);
    return true;
  };
  /** The stage ended: the English flip ends with it (it never carries into the next stage's card). */
  Kit.Bulb.prototype.off = function () {
    clearTimeout(this._t);
    if (this._off) this._off();
  };
  Kit.Bulb.prototype.destroy = function () {
    clearTimeout(this._t);
    this.btn.removeEventListener("click", this._h);
  };

  /* ---------------- the tally ---------------- */
  Kit.Tally = function (el) {
    this.el = el;
    el.classList.add("cl-tally");
    this.counts = {};
  };
  Kit.Tally.prototype.set = function (itemId, n) {
    this.counts[itemId] = n;
    let chip = this.el.querySelector(`[data-tally="${CSS.escape(itemId)}"]`);
    if (!chip) {
      chip = h("div", "cl-tally-chip", this.el);
      chip.dataset.tally = itemId;
      Kit.icon(itemId, chip, "tiny");
      h("span", "cl-tally-n", chip);
    }
    chip.querySelector(".cl-tally-n").textContent = String(n);
    chip.classList.remove("bump");
    void chip.offsetWidth;
    chip.classList.add("bump");
    this.el.classList.toggle("empty", !Object.keys(this.counts).length);
  };
  Kit.Tally.prototype.clear = function () {
    this.counts = {};
    this.el.innerHTML = "";
    this.el.classList.add("empty");
  };

  /* ---------------- the tray (fixed slots) ---------------- */
  /**
   * new Kit.Tray(el, nSlots, {onTap(i, item)}) — a column (sidebar) or a row
   * (pharmacy) of dishes. fill(i, item) · clear(i) · items() · light(i) ·
   * used(i) · pulse(i) · select(i).
   */
  Kit.Tray = function (el, n, opts = {}) {
    this.el = el;
    el.classList.add("cl-tray");
    el.innerHTML = "";
    this.slots = [];
    this.onTap = opts.onTap || null;
    for (let i = 0; i < n; i++) this._slot();
  };
  Kit.Tray.prototype._slot = function () {
    const i = this.slots.length;
    const d = h("button", "cl-dish", this.el);
    d.type = "button";
    d.dataset.slot = String(i);
    const s = { el: d, item: null };
    d.addEventListener("click", () => this.onTap && this.onTap(i, s.item));
    this.slots.push(s);
    return s;
  };
  Kit.Tray.prototype.fill = function (i, item) {
    const s = this.slots[i] || this._slot();
    s.item = item;
    s.el.innerHTML = "";
    if (item) {
      Kit.icon(item, s.el);
      s.el.classList.add("full");
      s.el.dataset.item = item.id;
      if (item.count > 1) h("span", "cl-dish-n", s.el, String(item.count));
      if (item.wrong) s.el.classList.add("wrong");
    } else {
      s.el.classList.remove("full", "wrong", "used", "lit", "sel");
      delete s.el.dataset.item;
    }
    return s.el;
  };
  Kit.Tray.prototype.firstEmpty = function () {
    return this.slots.findIndex((s) => !s.item);
  };
  Kit.Tray.prototype.items = function () {
    return this.slots.map((s) => s.item);
  };
  Kit.Tray.prototype.light = function (i) {
    this.slots.forEach((s, j) => s.el.classList.toggle("lit", j === i));
  };
  Kit.Tray.prototype.select = function (i) {
    this.slots.forEach((s, j) => s.el.classList.toggle("sel", j === i));
  };
  Kit.Tray.prototype.used = function (i, on = true) {
    if (this.slots[i]) this.slots[i].el.classList.toggle("used", on);
  };
  Kit.Tray.prototype.pulse = function (i, on = true) {
    this.slots.forEach((s, j) => s.el.classList.toggle("pulse", on && j === i));
  };

  /* ---------------- the buttons (the shared kit, UX 15) ---------------- */
  /**
   * The clinic's buttons come from the shared button kit (js/shared/buttons.js): "✓" (or cls "done")
   * is the round gold ✓ Done; anything else is the → Next pill with its label. They sit in the play
   * area's bottom-right corner (screen.actions), inside its edges on every screen.
   */
  Kit.button = function (parent, label, onPress, cls) {
    const NB = global.NjgButtons;
    const isDone = label === "✓" || /\bdone\b/.test(cls || "");
    const glow = /\bthrob\b/.test(cls || "");
    let b;
    if (NB) {
      const lab = typeof label === "string" || label == null ? label : Kit.text(label, null);
      b = isDone ? NB.done(parent, (e) => onPress && onPress(e), { glow }) : NB.next(parent, lab, (e) => onPress && onPress(e), { glow });
      b.classList.add("cl-go");
      (cls || "").split(/\s+/).filter((c) => c && c !== "throb").forEach((c) => b.classList.add(c));
      if (b.parentNode !== parent && parent) parent.appendChild(b);
      return b;
    }
    b = h("button", `cl-go ${cls || ""}`, parent);
    b.type = "button";
    if (typeof label === "string") b.textContent = label;
    else if (label) Kit.text(label, b);
    b.addEventListener("click", (e) => {
      if (b.disabled) return;
      onPress && onPress(e);
    });
    return b;
  };

  /* ---------------- a small seeded rng (the lab and the host) ---------------- */
  Kit.rng = function (seed) {
    let a = seed >>> 0 || 0x9e3779b9;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
})(typeof self !== "undefined" ? self : this);
