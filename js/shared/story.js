/*
 * The story player: scenes and picture panels from data, told by Nani on a
 * read-along card (docs/UX-PRINCIPLES.md 1), one scene at a time
 * (docs/first-launch-story.md; docs/shared-api.md 13). The first launch is
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
 *   choice     Yes / No; only Yes works (No runs away and Nani laughs)
 *   end        sets the story's flag (firstDone) and goes home
 *
 * Voices: a family recording (data/family-audio.json) where the line has a clip, else
 * the browser's speech (English; Kutchi read from its spelling until Mum records it),
 * else just the timing, so the read-along still moves on a device with no voices.
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
  let clips = null;
  function loadClips() {
    if (clips) return clips;
    clips = global
      .fetch(v("data/family-audio.json"))
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => []);
    return clips;
  }
  async function clipFile(id, speaker) {
    const all = await loadClips();
    const has = all.filter((c) => c.id === id && c.file);
    const c = has.find((x) => x.speaker === (speaker || "mum")) || has[0];
    return c ? c.file : null;
  }
  let blocked = false;
  let current = null; // the <audio> or utterance playing, to stop it
  function stopVoice() {
    try {
      if (current && current.pause) current.pause();
      if (global.speechSynthesis) global.speechSynthesis.cancel();
    } catch (e) {
      /* ignore */
    }
    current = null;
  }
  function playFile(file) {
    return new Promise((resolve) => {
      const a = new global.Audio(v(file));
      current = a;
      let done = false;
      const end = (ok) => {
        if (done) return;
        done = true;
        resolve(ok);
      };
      a.addEventListener("ended", () => end(true));
      a.addEventListener("error", () => end(false));
      setTimeout(() => end(true), 8000);
      const p = a.play();
      if (p && p.catch)
        p.catch((e) => {
          if (e && e.name === "NotAllowedError") blocked = true;
          end(false);
        });
    });
  }
  function voices() {
    try {
      return (global.speechSynthesis && global.speechSynthesis.getVoices()) || [];
    } catch (e) {
      return [];
    }
  }
  function tts(text, lang) {
    const vs = voices();
    if (!vs.length || !global.SpeechSynthesisUtterance) return Promise.resolve(false);
    const want = lang === "en" ? ["en-GB", "en-IN", "en"] : ["gu-IN", "hi-IN", "en-IN"];
    let voice = null;
    for (const w of want) if ((voice = vs.find((x) => x.lang && x.lang.replace("_", "-").startsWith(w)))) break;
    return new Promise((resolve) => {
      const u = new global.SpeechSynthesisUtterance(text);
      if (voice) u.voice = voice;
      u.lang = voice ? voice.lang : lang === "en" ? "en-GB" : "hi-IN";
      u.rate = lang === "en" ? 0.95 : 0.85;
      let done = false;
      const end = (ok) => !done && ((done = true), resolve(ok));
      u.onend = () => end(true);
      u.onerror = () => end(false);
      setTimeout(() => end(true), 1500 + text.split(/\s+/).length * 700);
      current = { pause: () => global.speechSynthesis.cancel() };
      global.speechSynthesis.speak(u);
    });
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
        const file = k.clip ? await clipFile(k.clip, k.speaker) : null;
        if (file) ok = await playFile(file);
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
  function stage(scene) {
    const s = el("div", "st-stage");
    if (scene.bg) s.style.backgroundImage = `url("${v(scene.bg)}")`;
    let html = "";
    (scene.props || []).forEach((p) => (html += img(p.img, `st-prop ${p.cls || ""}`, `left:${p.x}%;top:${p.y}%;width:${p.w}%`)));
    // Nani's pictures are waist-up, leaning on a counter: she always gets a ledge to lean on
    if (scene.nani) html += `<div class="st-nani-wrap${scene.nani.sip ? " sip" : ""}" style="left:${scene.nani.x}%">${img(scene.nani.img, "st-nani")}<i class="st-ledge"></i></div>`;
    if (scene.child) html += `<div class="st-child${scene.child.walk ? " walk" : ""}" style="left:${scene.child.x}%">${childSvg()}</div>`;
    if (scene.hearts) html += `<div class="st-hearts" aria-hidden="true"><i></i><i></i><i></i></div>`;
    s.innerHTML = html;
    return s;
  }
  function nextButton(host, label = "Next") {
    const b = el("button", "st-next", `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4l9 8-9 8" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
    b.type = "button";
    b.id = "st-next";
    b.setAttribute("aria-label", label);
    host.appendChild(b);
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
        (p.items || []).forEach((it) => (html += img(it.img, `st-item ${it.cls || ""}`, `left:${it.x}%;top:${it.y}%;width:${it.w}%`)));
        if (p.child) html += `<div class="st-item st-pchild" style="left:${p.child.x}%;top:${p.child.y}%;width:${p.child.w}%">${childSvg()}</div>`;
        pic.innerHTML = html;
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
      const max = (sc.no && sc.no.dodges) || 2;
      let laughing = false;
      const dodge = async (e) => {
        if (e) e.preventDefault();
        if (no.classList.contains("gone")) return;
        state.dodges++;
        // No runs away: somewhere else on the right, never under Yes
        const spots = [
          [-120, -30],
          [-40, 90],
          [-150, 70],
          [-70, -80],
        ];
        const [dx, dy] = spots[state.dodges % spots.length];
        no.style.transform = `translate(${dx}%, ${dy}%) rotate(${state.dodges % 2 ? -14 : 12}deg)`;
        if (state.dodges >= max && !laughing) {
          laughing = true;
          if (nani) nani.classList.add("laugh");
          no.classList.add("gone");
          await Story.say((sc.no && sc.no.laugh) || "laugh", { card: c });
          if (nani) nani.classList.remove("laugh");
          await Story.say(sc.line, { card: c });
        }
      };
      no.addEventListener("pointerdown", dodge);
      no.addEventListener("click", (e) => (e.preventDefault(), dodge()));
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
    loadClips();
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
