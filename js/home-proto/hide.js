/*
 * Hide and seek (proto-home, 2 Nov 2026; build/reports/designs/hide-and-seek.md and its critique; the glance: "Simba and Zazu are
 * hiding in Nani's bedroom, and Nani tells you where to look"). The camera eases from the doll's house into Nani's bedroom.
 *
 *   THE COUNT (a beat, never a test): Nani's hands over the play area; each tap counts one, to five; then the cats are gone.
 *   THE SEARCHES: Nani says ONE instruction at a time in her box ("Simba kida ai? Wardrobe je me nar!"), the word tiles under her
 *   (every place in the room, and the cats from L2). Every place looks closed and alike; no tail peeks out. A tap opens a place:
 *   the asked cat leaps out ("Huda!") and its pip fills; an empty place has its joke (a sock, a pigeon, towels), Nani's "Na." and
 *   her line again, and it closes itself. From L2 both cats hide and she says where each is, then asks for one: open the other
 *   cat's place and it bolts to a new place (her line changes); after two empty opens the asked cat slips to a new place too.
 *   THE CLOSE STEP: "Nana's coming!": close the place she names (the cats are always out first; under the bed never named).
 *
 *   L1  5 places (wardrobe, cupboard, box, under the bed, behind the curtain); Simba then Zazu; the named place glows as she says it
 *       (the supported level); one close
 *   L2  7 places (+ the drawer, the basket); both cats: who and where; the slip; one close among three open
 *   L3  as L2, the tile words dotted (past support); two closes
 *   L4  + a small box beside the big one: the size word decides (the small-and-big pair tile); two closes
 */
import { CAT, CATS, HANDS } from "./art.js";
import { house } from "./house.js";

// the bedroom's places, in shares of the room (x: middle, y: foot, h, w); rel: how she says it
const PLACES = {
  wardrobe: { lex: "n.wardrobe", rel: "post.in", x: 0.1, y: 0.88, h: 0.7, w: 0.16 },
  cupboard: { lex: "n.cupboard", rel: "post.in", x: 0.28, y: 0.44, h: 0.24, w: 0.14 },
  drawer: { lex: "n.drawer", rel: "post.in", x: 0.28, y: 0.88, h: 0.3, w: 0.14, lv: 2 },
  box: { lex: "n.box", rel: "post.in", x: 0.43, y: 0.88, h: 0.17, w: 0.11 },
  smallbox: { lex: "n.box", rel: "post.in", size: "small", x: 0.52, y: 0.88, h: 0.1, w: 0.065, lv: 4 },
  basket: { lex: "n.basket", rel: "post.in", x: 0.555, y: 0.88, h: 0.19, w: 0.08, lv: 2 },
  bed: { lex: "n.bed", rel: "post.under", x: 0.77, y: 0.88, h: 0.27, w: 0.27 },
  curtain: { lex: "n.curtain", rel: "post.behind", x: 0.95, y: 0.86, h: 0.66, w: 0.08 },
};
const JOKES = ["sock", "pigeon", "towels", "car", "wool"];

export default async function hide(F) {
  const lv = F.level;
  const ids = Object.keys(PLACES).filter((id) => {
    const p = PLACES[id];
    if (lv === 4 && id === "basket") return false; // (the small box takes its spot at L4)
    return !p.lv || p.lv <= lv;
  });
  const size = (id) => PLACES[id].size || (lv === 4 && id === "box" ? "big" : null);
  const H = house(F, {});
  const room = H.room("bedroom");
  room.insertAdjacentHTML("beforeend", '<div class="hp-window"></div><div class="hp-rug"></div>');

  /* ----- the places: every one closed and alike ----- */
  const places = {};
  for (const id of ids) {
    const p = PLACES[id];
    const el = F.put(`hp-place hp-${id === "smallbox" ? "box hp-small" : id}`, { x: p.x, y: p.y, h: p.h, w: p.w, parent: room, tag: "button", html: '<span class="hp-door"></span><span class="hp-door hp-door2"></span><span class="hp-inside"></span>' });
    el.classList.add("wide");
    el.setAttribute("aria-label", id);
    places[id] = { id, el, open: false, cat: null, empties: 0 };
  }
  // the cats sit on the rug before the count, and after they're found
  const cats = {};
  for (const [k, c] of Object.entries(CATS)) {
    const el = F.put(`hp-cat ${c.cls}`, { x: k === "simba" ? 0.55 : 0.63, y: 0.99, h: 0.2, img: CAT.sit, parent: room, z: 30 });
    cats[k] = { k, el, at: null, found: false };
  }
  await F.sleep(F.T(500));
  await H.zoom("bedroom", { ms: 900 });

  /* ----- who hides where (uniform at random among the closed places; every place fits both cats) ----- */
  const closedFree = (but = []) => ids.filter((id) => !places[id].open && !places[id].cat && !but.includes(id));
  const hideCat = (k, but = []) => {
    const c = cats[k];
    if (c.at) places[c.at].cat = null;
    const id = F.pick(closedFree(but));
    c.at = id;
    places[id].cat = k;
    return id;
  };
  const order = lv === 1 ? ["simba", "zazu"] : F.shuffle(["simba", "zazu"]);

  /* ----- the lines (meanings only: the engine says them) ----- */
  const item = (kind, sz) => ({ fn: "Item", kind, mods: sz ? [`a.${sz}`] : undefined });
  const placeOf = (id) => ({ fn: "Place", anchor: item(PLACES[id].lex, size(id)), rel: PLACES[id].rel });
  const where = (k) => ({ fn: "Where", thing: item(CATS[k].lex) });
  const lookIn = (id) => ({ fn: "Command", verb: "v.look", obj: placeOf(id) });
  const isAt = (k, id) => ({ fn: "LocatedAt", thing: item(CATS[k].lex), anchor: item(PLACES[id].lex, size(id)), rel: PLACES[id].rel });
  /** The search's line from where the cats are now: L1 "where's Simba? look in the wardrobe"; L2+ both told, one asked. */
  function searchLine(k) {
    const other = order.find((x) => x !== k && !cats[x].found && cats[x].at);
    if (lv === 1 || !other) return [where(k), lookIn(cats[k].at)];
    const told = F.shuffle([isAt(k, cats[k].at), isAt(other, cats[other].at)]);
    return told.concat([where(k)]);
  }
  const tileKeys = (id) => [PLACES[id].lex === "n.box" && lv === 4 ? size(id) : null, `p-${PLACES[id].lex}`].filter(Boolean);

  /* ----- the rows: the searches, then the closes ----- */
  const searches = order.map((k) =>
    F.row({
      key: `find-${k}`,
      line: { fn: "Where", thing: item(CATS[k].lex) },
      word: item(CATS[k].lex),
      picture: CAT.sit,
      tiles: [],
      target: () => places[cats[k].at] && places[cats[k].at].el,
      data: {
        cat: k,
        before: (r) => {
          r.line = F.say(searchLine(k));
          r.tiles = tileKeys(cats[k].at).concat(lv >= 2 ? [`c-${k}`] : []);
        },
        // (L1, the supported level: the named place glows while she says it)
        onSay: () => lv === 1 && glow(places[cats[k].at].el),
      },
    })
  );
  const nClose = lv >= 3 ? 2 : 1;
  const closes = Array.from({ length: nClose }, (_, i) =>
    F.row({
      key: `close-${i}`,
      line: { fn: "Say", x: "phrase.no" },
      word: { fn: "Command", verb: "v.close" },
      tiles: [],
      target: () => places[closeWant[i]] && places[closeWant[i]].el,
      data: {
        close: i,
        before: (r) => {
          const id = pickClose(i);
          const cmd = { fn: "Command", verb: "v.close", obj: item(PLACES[id].lex, size(id)) };
          r.line = i === 0 ? [F.lineOf("hs-tidy"), F.say(cmd)] : F.say(cmd);
          r.tiles = tileKeys(id);
        },
        onSay: () => lv === 1 && glow(places[closeWant[i]].el),
      },
    })
  );
  const closeWant = [];
  function pickClose(i) {
    // (L1: the last find's place; L2 on: one named among at least three open: Zazu nudges one open if fewer)
    const openNow = () => ids.filter((id) => places[id].open && id !== "bed" && !closeWant.slice(0, i).includes(id));
    if (lv >= 2)
      while (openNow().length < 3 && closedFree(["bed"]).length) {
        const id = F.pick(closedFree(["bed"]));
        setOpen(id, true);
        F.jiggle(places[id].el);
      }
    const last = searches[searches.length - 1].data.foundAt;
    const id = lv === 1 && last && last !== "bed" ? last : F.pick(openNow());
    closeWant[i] = id;
    return id;
  }

  /* ----- the word tiles: every place in the room (and the cats from L2); the small-and-big pair at L4 ----- */
  const seen = new Set();
  const placeTiles = [];
  for (const id of ids) {
    const lex = PLACES[id].lex;
    if (seen.has(lex)) continue;
    seen.add(lex);
    placeTiles.push({ key: `p-${lex}`, id: lex, word: item(lex), lex, picture: (box) => tilePic(box, id === "smallbox" ? "box" : id) });
  }
  if (lv === 4)
    placeTiles.unshift({
      pair: ["small", "big"].map((sz) => ({ key: sz, id: `a.${sz}`, word: item("n.box", sz), lex: `a.${sz}`, picture: (box) => tilePic(box, "plainbox", sz) })),
    });
  const groups = [{ label: { en: "Places" }, tiles: placeTiles }];
  if (lv >= 2) groups.push({ label: { en: "Cats" }, tiles: order.map((k) => ({ key: `c-${k}`, id: CATS[k].lex, word: item(CATS[k].lex), lex: CATS[k].lex, picture: (box) => catPic(box, k) })) });
  F.sentence(groups);

  /* ----- play ----- */
  let phase = "count";
  function glow(el) {
    el.classList.add("sel");
    F.after(F.T(2600), () => el.classList.remove("sel"));
  }
  function setOpen(id, on) {
    const p = places[id];
    p.open = on;
    p.el.classList.toggle("open", on);
  }
  function joke(p) {
    const j = JOKES[(p.empties + ids.indexOf(p.id)) % JOKES.length];
    const s = document.createElement("span");
    s.className = `hp-joke hp-joke-${j}`;
    p.el.appendChild(s);
    F.after(F.T(1300), () => s.remove());
  }
  function catOut(k, id) {
    const c = cats[k];
    c.found = true;
    c.at = null;
    places[id].cat = null;
    c.el.classList.remove("hp-hidden");
    c.el.classList.add("hp-leap");
    const spot = { simba: 0.55, zazu: 0.63 }[k];
    c.el.style.setProperty("--x", String(spot));
    F.after(F.T(900), () => c.el.classList.remove("hp-leap"));
  }
  let emptyRun = 0;
  for (const id of ids)
    F.on(places[id].el, "click", async () => {
      F.acted();
      const p = places[id];
      const r = F.current();
      if (!r || phase !== "play") return;
      if (r.data.close != null) {
        // the close step: the place she named closes with a soft clunk; another open place shakes and stays open
        if (!p.open) return F.jiggle(p.el);
        if (id !== closeWant[r.data.close]) return F.oops(r, p.el);
        setOpen(id, false);
        F.jiggle(p.el);
        if (window.Sfx) window.Sfx.play("tap", { volume: 0.3 });
        F.add(r);
        return;
      }
      if (p.open) return F.jiggle(p.el);
      setOpen(id, true);
      const k = r.data.cat;
      if (p.cat === k) {
        // the find: a beat, two green eyes, a "mrrp" and a leap; "Huda!"
        emptyRun = 0;
        r.data.foundAt = id;
        p.el.classList.add("eyes");
        await F.sleep(F.T(450));
        p.el.classList.remove("eyes");
        catOut(k, id);
        F.speak(F.say({ fn: "Exclaim", x: "phrase.there-over-there" }));
        F.add(r);
        return;
      }
      if (p.cat) {
        // the other cat: caught, a guilty look, and it bolts to a new place (a funny miss; her line changes)
        const other = p.cat;
        p.el.classList.add("eyes", "hp-bolt");
        F.after(F.T(700), () => p.el.classList.remove("hp-bolt"));
        F.oops(r, p.el, { line: false });
        await F.sleep(F.T(700));
        p.el.classList.remove("eyes");
        hideCat(other, [id]);
        setOpen(id, false);
        F.reline(r, searchLine(k));
        return;
      }
      // empty: its joke, "Na.", her line again; it closes itself
      p.empties++;
      emptyRun++;
      joke(p);
      F.oops(r, p.el, { line: false });
      F.speak(F.say({ fn: "Say", x: "phrase.no" }));
      F.after(F.T(1100), () => setOpen(id, false));
      if (lv >= 2 && emptyRun >= 2) {
        // two empty opens: the cat slips to a new place (a patter, nothing moves on screen) and she says where now
        emptyRun = 0;
        await F.sleep(F.T(1200));
        hideCat(k);
        if (window.Sfx) window.Sfx.play("tap", { volume: 0.2 });
        F.reline(r, searchLine(k));
      } else {
        await F.sleep(F.T(900));
        F.sayLine(r);
      }
    });

  /* ----- the count: Nani's hands; each tap counts one, to five ----- */
  const veil = document.createElement("div");
  veil.className = "hp-veil";
  veil.innerHTML = `<button type="button" class="hp-hands" aria-label="Count"><img src="${HANDS}" alt=""></button><div class="hp-pips">${"<i></i>".repeat(5)}</div>`;
  F.play.appendChild(veil);
  const hands = veil.querySelector(".hp-hands");
  F.setGuide("hs-count");
  F.speak(F.lineOf("hs-count"));
  F.teach("count", hands);
  await new Promise((done) => {
    let n = 0;
    F.on(hands, "click", () => {
      F.acted();
      if (n >= 5) return;
      n++;
      veil.querySelectorAll(".hp-pips i")[n - 1].classList.add("on");
      F.jiggle(hands);
      F.stopVoice();
      F.speak(F.say({ fn: "Item", kind: `num.${n}` }));
      if (n === 5) F.after(F.T(700), done);
    });
  });
  order.forEach((k) => {
    hideCat(k);
    cats[k].el.classList.add("hp-hidden");
  });
  veil.classList.add("gone");
  F.after(F.T(500), () => veil.remove());
  F.setGuide("hs-ready");
  await F.speak(F.lineOf("hs-ready"));

  phase = "play";
  await F.ask({});
  F.begin();
  F.teach("open", () => places[cats[order[0]].at] && places[cats[order[0]].at].el);
  await new Promise((res) => F.whenAll(res));
  await F.finish(async () => {
    // both cats curl up together on the rug, purring
    Object.values(cats).forEach((c) => c.el.classList.add("hp-curl"));
  });
}

/** A tile's picture: the place's own little drawing (the same placeholder shapes as the room). */
function tilePic(box, id, sz) {
  const d = document.createElement("span");
  d.className = `hp-tpic hp-tpic-${id}${sz ? ` hp-tpic-${sz}` : ""}`;
  box.appendChild(d);
}
function catPic(box, k) {
  const i = document.createElement("img");
  i.src = CAT.sit;
  i.alt = "";
  i.className = `hp-tcat ${k}`;
  box.appendChild(i);
}
