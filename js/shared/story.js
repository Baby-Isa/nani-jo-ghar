/*
 * The story player: scenes and picture panels from data, told by Nani on a
 * read-along card (docs/design-language/ux-principles.md 1), one scene at a time
 * (docs/game-design/modes/first-launch.md; docs/architecture/shared-api.md 13). The first launch is
 * data/story/first-launch.json; the arcs can reuse this with their own file.
 *
 *   Story.play(url, {el, kinds, params})   load the story and run it from where this
 *                                          player left it (their save, namespace "story")
 *   Story.say(lineOrId, {card, face})      a line on the read-along card: English, then
 *                                          Kutchi (or Kutchi only: the "Story help" setting)
 *   Story.help() / Story.setHelp(v)        the grown-ups' setting: "en-k" (default) or "k"
 *
 * Scene kinds (each scene: {id, kind, ...}; the data file's _about has the fields):
 *   character  the page's own (kinds.character(scene, api) -> Promise)
 *   scene      a background, Nani, the child, props; its lines; then the big arrow
 *   cook       a Cook round: opens scene.url + &then=<this page>&done=<id>; Cook comes back
 *   panels     a picture story, one line per panel, the arrow between them
 *   choice     Yes / No; only Yes works (No shakes, Nani looks embarrassed and asks again: UX §14)
 *   end        sets the story's flag (firstDone) and goes home
 *
 * Voices: a family recording (js/shared/family-voice.js) where the line names one
 * (`clip`) or its Kutchi text matches one, else the browser's speech (English; Kutchi
 * read from its spelling until Mum records it), else just the timing, so the
 * read-along still moves on a device with no voices.
 * If the browser won't play sound before a tap, the card's speaker pulses.
 */
(function (global) {
  "use strict";
  const doc = global.document;
  const Save = global.Save;
  const App = global.NjgApp;
  const v = global.njgV || ((u) => u);
  const Story = (global.Story = {});
  const HELP = ["en-k", "k"];

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const el = (tag, cls, html) => {
    const e = doc.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };
  let speed = 1;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms / speed));

  Story.help = () => {
    const h = Save && Save.setting && Save.setting("storyHelp");
    return HELP.includes(h) ? h : "en-k";
  };
  Story.setHelp = (h) => Save.setSetting("storyHelp", HELP.includes(h) ? h : "en-k");

  /* ---------------- voices ---------------- */
  const FamilyVoice = global.FamilyVoice;
  /** A line's clip, by its data-given id first, else by its Kutchi text (js/shared/family-voice.js). */
  async function clipFor(k) {
    if (!FamilyVoice) return null;
    await FamilyVoice.load();
    return (k.clip && FamilyVoice.byId(k.clip, k.speaker)) || FamilyVoice.match(k.text);
  }
  // S13-V: every clip and device-voice word through the one voice (js/core/voice.js, window.NjgVoice): the store app plays only
  // OK family clips and never the device voice; the test build keeps its stand-ins
  let blocked = false;
  let current = null; // the clip playing, to stop it
  const NV = () => global.NjgVoice || null;
  function stopVoice() {
    try {
      if (current) current.cut();
      if (NV()) NV().stop();
    } catch (e) {
      /* ignore */
    }
    current = null;
  }
  function playFile(file) {
    if (!NV()) return Promise.resolve(false);
    const h = (current = NV().clip(v(file)));
    return Promise.race([h.done, new Promise((r) => setTimeout(() => r(true), 8000))]).then((ok) => {
      if (h.blocked) blocked = true;
      return ok;
    });
  }
  function tts(text, lang) {
    if (!NV()) return Promise.resolve(false);
    return Promise.race([NV().device(text, { lang: lang === "en" ? "en" : "k", rate: lang === "en" ? 0.95 : 0.85 }), new Promise((r) => setTimeout(() => r(true), 1500 + text.split(/\s+/).length * 700))]);
  }
  const estimate = (text) => 500 + String(text).split(/\s+/).length * 330;

  /* ---------------- the read-along card ---------------- */
  /** The chunks a line is said in: English then Kutchi (or Kutchi only). */
  Story.chunks = function (line, help = Story.help()) {
    const out = [];
    if (help !== "k" || !line.kutchi) out.push({ lang: "en", text: line.en });
    if (line.kutchi && !(line.sound && help !== "k")) out.push({ lang: "k", text: line.kutchi, clip: line.clip, speaker: line.speaker, placeholder: !!line.placeholder });
    return out.filter((c) => c.text);
  };
  let lines = {};
  const lineOf = (x) => (typeof x === "string" ? Object.assign({ id: x }, lines[x] || { en: x }) : x);

  function card(face) {
    const c = el("div", "st-card", `<span class="st-face">${face || ""}</span><div class="st-text"></div><button type="button" class="st-speak" aria-label="Say it again"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>`);
    return c;
  }
  const naniFace = () => `<img alt="Nani" src="${esc(v("assets/cook/characters/nani-badge.webp"))}">`;

  /** Say a line on a card (made if not given). Resolves when it's been said once. */
  Story.say = async function (x, o = {}) {
    const line = lineOf(x);
    const c = o.card || card(o.face || naniFace());
    if (!c.parentNode && o.host) o.host.appendChild(c);
    c.classList.toggle("is-child", line.who === "child");
    const chunks = Story.chunks(line);
    const text = c.querySelector(".st-text");
    text.innerHTML = chunks.map((k, i) => `<p class="chunk ${k.lang}${k.placeholder ? " placeholder" : ""}" data-i="${i}" lang="${k.lang === "en" ? "en" : "gu-Latn"}">${esc(k.text)}</p>`).join("");
    c.hidden = false;
    requestAnimationFrame(() => c.classList.add("in"));
    const run = async () => {
      stopVoice();
      blocked = false;
      c.classList.add("speaking");
      c.classList.remove("needs-tap");
      const ps = text.querySelectorAll(".chunk");
      ps.forEach((p) => p.classList.remove("on", "said"));
      for (let i = 0; i < chunks.length; i++) {
        const k = chunks[i];
        ps[i].classList.add("on");
        state.speaking = k.lang;
        const t0 = Date.now();
        let ok = false;
        const clip = k.lang === "k" ? await clipFor(k) : null;
        if (clip) ok = await playFile(clip.file);
        if (!ok && !blocked) ok = await tts(k.text, k.lang);
        const left = estimate(k.text) - (Date.now() - t0) * speed;
        if (!ok && left > 0) await wait(left);
        ps[i].classList.remove("on");
        ps[i].classList.add("said");
        if (i < chunks.length - 1) await wait(350);
      }
      state.speaking = null;
      c.classList.remove("speaking");
      if (blocked) c.classList.add("needs-tap");
    };
    const btn = c.querySelector(".st-speak");
    btn.onclick = (e) => {
      e.stopPropagation();
      if (!c.classList.contains("speaking")) run();
    };
    state.lines.push(line.id || line.en);
    await run();
    return c;
  };

  /* ---------------- pictures ---------------- */
  let childSvg = () => "";
  Story.setChild = (fn) => (childSvg = fn);
  function img(src, cls, style) {
    return `<img alt="" class="${esc(cls || "")}" style="${esc(style || "")}" src="${esc(v(src))}">`;
  }
  /*
   * s08-nani-ground (Zafar, 16 Oct): Nani sits on a stool behind the ledge, her hands in her lap: the ledge (in front of
   * her) covers the lower part of her forearms, its top on the line where her picture meets the counter (css/first.css
   * --st-ledge-top). Pointing, her hand comes up over the ledge: `front` (the point frame's hand, cut on the same canvas,
   * build/tools/art/specs/s08-nani.cut.json "front") is drawn over the ledge, the fingertip on its top.
   */
  function seated(n, cls, ledge = true) {
    return `${img(n.img, `st-nani ${cls || ""}`)}${ledge ? `<i class="st-ledge"></i>` : ""}${n.front ? img(n.front, "st-nani-front") : ""}`;
  }
  /*
   * s08-nani-ground (the s08 gate, flaw 1: "Nani leans on a bare brown block standing alone in the courtyard"): nobody
   * leans on a lone block. A scene with no counter shows her standing (nani.stand: her standing picture, feet on the floor
   * with a contact shadow, nani.hold: what she holds, placed on her hand as fractions of her picture). A scene whose picture
   * has a counter (scene.counter.y: its back edge as a share of the picture's height) seats her behind that counter: the
   * picture is drawn again from that edge down over her (.st-occ, as Cook's occluder), and props with `on` (the share of the
   * picture's height their base stands at) stand on its top with a contact shadow. layout() places them as the picture is
   * cropped (cover) on this screen.
   */
  function stage(scene) {
    const s = el("div", "st-stage");
    if (scene.bg) s.style.backgroundImage = `url("${v(scene.bg)}")`;
    let html = "";
    (scene.props || []).forEach((p, i) => {
      if (p.on != null) html += `<i class="st-contact st-prop-shadow" data-for="${i}"></i>`;
      html += img(p.img, `st-prop ${p.cls || ""}`, `left:${p.x}%;top:${p.on != null ? 0 : p.y}%;width:${p.w}%`).replace("<img ", `<img data-i="${i}" `);
    });
    const n = scene.nani;
    if (n && n.stand) {
      const hold = n.hold ? img(n.hold.img, "st-hold", `left:${n.hold.x}%;top:${n.hold.y}%;width:${n.hold.w}%`) : "";
      html += `<div class="st-nani-stand${n.sip ? " sip" : ""}" style="left:${n.x}%"><i class="st-contact"></i><div class="st-fig">${img(n.stand, "st-nani")}${hold}</div></div>`;
    } else if (n) html += `<div class="st-nani-wrap${n.sip ? " sip" : ""}" style="left:${n.x}%">${seated(n, "", !scene.counter)}</div>`;
    if (scene.counter) html += `<div class="st-occ" aria-hidden="true" style="background-image:url(&quot;${esc(v(scene.bg))}&quot;)"></div>`;
    if (scene.child) html += `<div class="st-child${scene.child.walk ? " walk" : ""}" style="left:${scene.child.x}%">${childSvg()}</div>`;
    if (scene.hearts) html += `<div class="st-hearts" aria-hidden="true"><i></i><i></i><i></i></div>`;
    s.innerHTML = html;
    return s;
  }
  /** Places what stands on the scene picture's counter for this screen (see stage); again on a resize, until the scene goes. */
  function layout(s, sc, cardEl) {
    if (!sc.counter && !(sc.props || []).some((p) => p.on != null)) return;
    const [iw, ih] = sc.bgSize || [1536, 1024];
    const fit = () => {
      if (!s.isConnected) return global.removeEventListener("resize", fit);
      const W = s.clientWidth;
      const H = s.clientHeight;
      if (!W || !H) return;
      const k = Math.max(W / iw, H / ih); // background-size: cover, centred
      const Y = (f) => (H - ih * k) / 2 + f * ih * k;
      if (sc.counter) {
        const edge = Y(sc.counter.y);
        const occ = s.querySelector(".st-occ");
        if (occ) occ.style.clipPath = `inset(${edge.toFixed(1)}px 0 0 0)`;
        const wrap = s.querySelector(".st-nani-wrap");
        if (wrap) {
          // her body line (ledge canvas row 452.3 of 578 = 78.25%, her crown at row 11 = 1.9%) 3 px under the counter's back
          // edge; a little smaller where her head would go under the line's card
          wrap.style.height = "";
          const h0 = wrap.offsetHeight;
          const top = cardEl ? cardEl.getBoundingClientRect().bottom - s.getBoundingClientRect().top + 6 : 0;
          const h = Math.max(40, Math.min(h0, (edge + 3 - top) / (0.7825 - 0.019)));
          wrap.style.height = `${h.toFixed(1)}px`;
          wrap.style.bottom = `${(H - (edge + 3) - 0.2175 * h).toFixed(1)}px`;
        }
      }
      (sc.props || []).forEach((p, i) => {
        if (p.on == null) return;
        const im = s.querySelector(`.st-prop[data-i="${i}"]`);
        const sh = s.querySelector(`.st-prop-shadow[data-for="${i}"]`);
        if (!im || !im.offsetHeight) return;
        const base = Y(p.on);
        im.style.top = `${(base - im.offsetHeight).toFixed(1)}px`;
        if (sh) Object.assign(sh.style, { left: `${im.offsetLeft + im.offsetWidth * 0.06}px`, width: `${im.offsetWidth * 0.86}px`, top: `${(base - im.offsetWidth * 0.06).toFixed(1)}px`, height: `${(im.offsetWidth * 0.12).toFixed(1)}px` });
      });
    };
    fit();
    s.querySelectorAll("img").forEach((x) => x.complete || x.addEventListener("load", fit, { once: true }));
    global.addEventListener("resize", fit);
  }
  function nextButton(host, label = "Next") {
    // S13-B2 (contract-34): the kit's → Next (js/shared/buttons.js NjgButtons.next: its look, its arrow, its corner), the
    // pressable one (manual): the story waits for the child's tap on it, as it always has (it never presses itself)
    const b = global.NjgButtons.next(host, "", null, { manual: true, id: "st-next", cls: "st-next" });
    b.setAttribute("aria-label", label);
    return new Promise((resolve) => {
      requestAnimationFrame(() => b.classList.add("in"));
      b.addEventListener(
        "click",
        () => {
          b.disabled = true;
          b.classList.add("go");
          stopVoice();
          setTimeout(() => (b.remove(), resolve()), 120);
        },
        { once: true }
      );
    });
  }

  /* ---------------- the kinds ---------------- */
  const state = { scene: null, kind: null, panel: null, speaking: null, lines: [], choice: null, dodges: 0 };
  const KINDS = {
    async scene(sc, api) {
      const s = stage(sc);
      api.el.appendChild(s);
      const c = card(naniFace());
      api.el.appendChild(c);
      layout(s, sc, c);
      await wait(sc.child && sc.child.walk ? 1300 : 500);
      for (const id of sc.lines || []) await Story.say(id, { card: c });
      await nextButton(api.el);
    },
    async cook(sc, api) {
      const back = `${api.page}?app=1&done=${encodeURIComponent(sc.id)}${api.speedParam}`;
      App.go(`${sc.url}${api.speedParam}&then=${encodeURIComponent(back)}`);
      return new Promise(() => {}); // the page is leaving
    },
    async panels(sc, api) {
      const wrap = el("div", "st-panels");
      const frame = el("div", "st-frame");
      const dots = el("div", "st-dots", sc.panels.map(() => "<i></i>").join(""));
      wrap.append(frame, dots);
      api.el.appendChild(wrap);
      const c = card(naniFace());
      api.el.appendChild(c);
      for (let i = 0; i < sc.panels.length; i++) {
        const p = sc.panels[i];
        state.panel = i;
        dots.querySelectorAll("i").forEach((d, j) => d.classList.toggle("on", j <= i));
        const pic = el("div", "st-panel");
        pic.style.backgroundImage = `url("${v(p.art)}")`;
        let html = "";
        (p.items || []).forEach((it) => {
          const at = `left:${it.x}%;top:${it.y}%;width:${it.w}%`;
          // Nani on a panel sits behind her ledge too (seated, above)
          html += it.ledge ? `<div class="st-pnani" style="${at}">${seated(it, it.cls)}</div>` : img(it.img, `st-item ${it.cls || ""}`, at);
        });
        if (p.child) html += `<div class="st-item st-pchild" style="left:${p.child.x}%;top:${p.child.y}%;width:${p.child.w}%">${childSvg()}</div>`;
        pic.innerHTML = html;
        // ART-18 (s04-fxc): a bobbing guest bobs with the one shared talk animation (Lifecycle.talk), never its own
        const L = global.Lifecycle;
        if (L && L.talk) pic.querySelectorAll(".st-item.bob").forEach((x) => (x.classList.remove("bob"), L.talk.dom(x)));
        const old = frame.firstChild;
        frame.appendChild(pic);
        requestAnimationFrame(() => pic.classList.add("in"));
        if (old) setTimeout(() => old.remove(), 400);
        await wait(450);
        await Story.say(p.line, { card: c });
        await nextButton(api.el);
      }
      state.panel = null;
    },
    async choice(sc, api) {
      const s = stage(sc);
      api.el.appendChild(s);
      const c = card(naniFace());
      api.el.appendChild(c);
      layout(s, sc, c);
      await wait(400);
      await Story.say(sc.line, { card: c });
      const box = el("div", "st-choice");
      box.innerHTML = `<button type="button" class="st-yes" aria-label="Yes"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button type="button" class="st-no" aria-label="No"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/></svg></button>`;
      api.el.appendChild(box);
      requestAnimationFrame(() => box.classList.add("in"));
      state.choice = "asked";
      const no = box.querySelector(".st-no");
      const yes = box.querySelector(".st-yes");
      const nani = s.querySelector(".st-nani");
      // UX §14 (Zafar, 26 Sept): a wrong reply shakes, Nani looks embarrassed
      // (cycling through a few reactions) and asks again, until the child taps Yes.
      const reactions = ["embarrassed", "scratch", "puzzled", "sigh"];
      let busy = false;
      const wrong = async (e) => {
        if (e) e.preventDefault();
        if (busy) return;
        busy = true;
        state.dodges++;
        no.classList.remove("shake");
        void no.offsetWidth;
        no.classList.add("shake");
        try { if (navigator.vibrate) navigator.vibrate(120); } catch (err) {}
        const r = reactions[(state.dodges - 1) % reactions.length];
        if (nani) nani.classList.add(r);
        await wait(700);
        if (nani) nani.classList.remove(r);
        no.classList.remove("shake");
        await Story.say(sc.line, { card: c });
        busy = false;
      };
      no.addEventListener("click", wrong);
      await new Promise((resolve) => yes.addEventListener("click", resolve, { once: true }));
      state.choice = "yes";
      yes.classList.add("chosen");
      no.classList.add("gone");
      stopVoice();
      const kid = card(`<span class="st-kid">${childSvg("badge")}</span>`);
      kid.classList.add("st-reply");
      api.el.appendChild(kid);
      await Story.say(sc.yes || "yes", { card: kid });
      if (nani) nani.classList.add("happy-hop");
      if (sc.after) await Story.say(sc.after, { card: c });
      await wait(500);
    },
    async end(sc, api) {
      api.finish();
      await wait(250);
      App.home(sc.home || "story");
      return new Promise(() => {});
    },
  };

  /* ---------------- running a story ---------------- */
  Story.play = async function (url, o = {}) {
    const params = o.params || new URLSearchParams(global.location.search);
    speed = Number(params.get("speed")) || 1;
    const data = await global.fetch(v(url)).then((r) => r.json());
    lines = data.lines || {};
    if (FamilyVoice) FamilyVoice.load();
    const scenes = data.scenes;
    const host = o.el;
    const kinds = Object.assign({}, KINDS, o.kinds || {});
    const where = () => (Save.get("story")[data.id] || {});
    const mark = (at) =>
      Save.update("story", (d) => {
        d[data.id] = Object.assign({}, d[data.id], { at, started: (d[data.id] && d[data.id].started) || new Date().toISOString() });
        return d;
      });
    let i = Math.max(0, scenes.findIndex((s) => s.id === where().at));
    // back from a Cook round: that scene is done
    if (params.get("done") && scenes[i] && scenes[i].id === params.get("done")) i++;
    const page = (global.location.pathname.split("/").pop() || "first.html").replace(/[^\w.-]/g, "");
    const api = {
      el: host,
      page,
      speedParam: params.get("speed") ? `&speed=${encodeURIComponent(params.get("speed"))}` : "",
      finish() {
        if (data.flag) Save.setFlag(data.flag, true);
        Save.update("story", (d) => ((d[data.id] = Object.assign({}, d[data.id], { at: null, done: new Date().toISOString() })), d));
      },
    };
    for (; i < scenes.length; i++) {
      const sc = scenes[i];
      mark(sc.id);
      Object.assign(state, { scene: sc.id, kind: sc.kind, panel: null, choice: null, dodges: 0 });
      host.innerHTML = "";
      host.dataset.scene = sc.id;
      host.dataset.kind = sc.kind;
      const run = kinds[sc.kind];
      if (!run) continue;
      await run(sc, api);
    }
  };
  // test hook
  global.__story = { state: () => Object.assign({}, state, { help: Story.help(), lines: state.lines.slice() }) };
})(window);
