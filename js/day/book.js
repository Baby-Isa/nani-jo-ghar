/*
 * The evening book (docs/game-design/modes/story-by-the-fire.md; the day's fixed shape, build/reports/research-trips-2026-10-19.md):
 * after the day's activity, the evening scene (the night sky over the same house), Nani and the book. Its pages are today's
 * words as pictures with their Kutchi, said in turn; photos if the day log has any; a progress mark that fills as the pages go
 * (progress, never a verdict: non-negotiable 12); goodnight; and tomorrow's door previewed by its sky.
 *
 * It reads what the modes already keep: the day log (js/core/log.js, the save's story.days: made, found, counted, saw, round ...)
 * for today, and the words this child met today (the save's words namespace, each record's `last`), never a list of its own.
 * ?log=kitchen|clinic|farm (the lab) gives it a day as that activity would leave one, in memory only.
 *
 *   await runBook(el, api, day)
 */
import { paintScene, paintSky, shapes } from "./sky.js";
import { naniFigure } from "./door.js";

const todayDate = () => new Date().toISOString().slice(0, 10);

/** Today's word ids, in the order they happened: the day log's entries (what, who), then the words met today. */
export function todaysWords({ entries = [], met = [], lexOf = () => null, max = 8 } = {}) {
  const out = [];
  const seen = new Set();
  const add = (id, from) => {
    if (!id) return;
    const e = lexOf(String(id));
    if (!e || seen.has(e.id) || !/^(N|PN)$/.test(e.pos)) return;
    seen.add(e.id);
    out.push({ id: e.id, src: String(id), from });
  };
  entries.forEach((x) => {
    if (x.type === "round") return;
    add(x.what, x.type);
    add(x.who, x.type);
  });
  met.forEach((id) => add(id, "met"));
  return out.slice(0, max);
}

export async function runBook(el, api, day) {
  const { data, core, url, E } = api;
  const B = data.book;
  api.test.state("day/book");
  api.test.expect(() => ({ kind: "wait" }));
  window.Day.stage = "book";

  // ---- what happened today ----
  const fixture = api.q.get("log") && B.lab[api.q.get("log")];
  let entries = [];
  let met = [];
  if (fixture) {
    entries = fixture.entries || [];
    met = fixture.words || [];
  } else {
    const today = todayDate();
    entries = core.log.days().filter((d) => d.date === today).flatMap((d) => d.entries || []);
    const words = core.save.get("words") || {};
    met = Object.keys(words).filter((id) => words[id] && words[id].last && new Date(words[id].last).toISOString().slice(0, 10) === today);
  }
  const lexOf = (id) => E.linearizer.lexOf(id);
  const pages = todaysWords({ entries, met, lexOf, max: B.maxPages || 8 });
  const photos = entries.filter((x) => x.type === "photo" && x.src).map((x) => ({ photo: x.src }));
  window.Day.bookPages = pages.map((p) => p.id);

  // ---- the evening scene ----
  const root = document.createElement("div");
  root.className = "day-root day-book-scene";
  el.appendChild(root);
  const scn = paintScene(root, { scene: data.scene, weather: data.weather.night, url, speed: () => api.speed });
  const nani = naniFigure(scn, Object.assign({}, data.scene.nani, B.art.nani ? { art: B.art.nani } : {}), url);

  const book = document.createElement("div");
  book.className = "day-book";
  if (B.art.book) book.style.backgroundImage = `url("${url(B.art.book)}")`;
  book.innerHTML = `<div class="day-page day-page-l"><div class="day-pic"></div></div><div class="day-page day-page-r"><div class="day-word"></div></div><div class="day-marks" aria-hidden="true"></div>`;
  root.appendChild(book);
  const pic = book.querySelector(".day-pic");
  const word = book.querySelector(".day-word");
  const marks = book.querySelector(".day-marks");
  const all = [...pages, ...photos];
  all.forEach(() => marks.appendChild(document.createElement("i")));

  // the pictures: a word's own, else its mode's (loaded only for the words on these pages), else a plain shape
  const tables = {};
  const pictureOf = async (p) => {
    if (p.photo) return p.photo;
    const own = B.pictures.own || {};
    if (own[p.id]) return own[p.id];
    if (own[p.src]) return own[p.src];
    const e = lexOf(p.id) || {};
    const ids = [p.src, ...(e.aliases || [])];
    for (const s of B.pictures.sources || []) {
      if (!(s.data in tables)) tables[s.data] = await fetch(url(s.data)).then((r) => r.json()).catch(() => null);
      const T = tables[s.data] && tables[s.data][s.table];
      if (!T) continue;
      for (const id of ids) {
        const key = s.strip && String(id).startsWith(s.strip) ? String(id).slice(s.strip.length) : id;
        const row = Array.isArray(T) ? T.find((x) => x && x.id === key) : T[key];
        if (row && row[s.field]) return s.path.replace("{v}", row[s.field]);
      }
    }
    return null;
  };

  let skip = null;
  book.addEventListener("pointerdown", () => skip && skip());
  const turn = (ms) => new Promise((r) => {
    const t = setTimeout(r, ms / api.speed);
    skip = () => (clearTimeout(t), r());
  });

  await api.wait(600);
  book.classList.add("open");
  for (let i = 0; i < all.length; i++) {
    const p = all[i];
    book.classList.remove("turned");
    void book.offsetWidth;
    book.classList.add("turned");
    pic.innerHTML = "";
    const src = await pictureOf(p);
    if (src) {
      const im = document.createElement("img");
      im.alt = "";
      im.src = url(src);
      im.onerror = () => (im.replaceWith(shapes([{ t: "circle", cx: 100, cy: 100, r: 80, fill: "#e0cba6" }], 200, 200)));
      pic.appendChild(im);
    } else pic.appendChild(shapes([{ t: "circle", cx: 100, cy: 100, r: 80, fill: "#e0cba6" }], 200, 200));
    word.innerHTML = "";
    let ln = null;
    if (!p.photo) {
      const e = lexOf(p.id) || {};
      ln = api.word(p.id, String(e.gloss || p.id).split(/[,(]/)[0].trim());
      word.appendChild(api.render(ln));
    }
    marks.children[i].classList.add("on");
    api.test.expect(() => ({ kind: "wait", page: i }));
    if (ln) await api.say(ln, { el: word.firstChild, who: "nani" });
    await turn(B.pageMs || 900);
  }
  skip = null;

  // goodnight, then tomorrow's door by its sky
  word.innerHTML = "";
  pic.innerHTML = "";
  book.classList.add("closed");
  const gn = api.line(B.goodnight);
  const say = document.createElement("div");
  say.className = "day-lines day-evening-lines";
  root.appendChild(say);
  const gl = api.render(gn);
  say.appendChild(gl);
  await api.say(gn, { el: gl, who: "nani" });
  const next = api.dayDef(day.id + 1);
  const tw = data.weather[next.weather] || data.weather.sunny;
  const prev = document.createElement("div");
  prev.className = "day-tomorrow";
  prev.dataset.weather = next.weather;
  const skyBox = document.createElement("div");
  skyBox.className = "day-tomorrow-sky";
  paintSky(skyBox, tw, { w: 400, h: 300, url });
  prev.appendChild(skyBox);
  const door = document.createElement("i");
  door.className = "day-tomorrow-door";
  prev.appendChild(door);
  root.appendChild(prev);
  requestAnimationFrame(() => prev.classList.add("in"));
  const tm = api.line({ word: "adv.tomorrow", en: "tomorrow" });
  const tl = api.render(tm);
  say.appendChild(tl);
  await api.say(tm, { el: tl, who: "nani" });
  void nani;
  if (!fixture && !api.q.get("stage")) {
    api.setToday({ at: "done" });
    core.save.update("story", (s) => ((s.dayNo = (Number(s.dayNo) || 1) + 1), s));
  }
  api.test.expect(() => ({ kind: "end" }));
  root.dataset.done = "";
  await api.wait(2500);
  scn.stop();
  if (!fixture && !api.q.get("stage")) api.home();
}
