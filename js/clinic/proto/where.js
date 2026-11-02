/*
 * Where does it hurt? (prototype, proto-clinic 2 Nov 2026; build/reports/designs/clinic-every-part.md §3A, its critique 2, 5, 10).
 *
 * The patient sits on the bed, hands in her lap, looking ahead (never at the sore part), and says what hurts: "[My] gutan
 * [hurts]." THE SENTENCE LAYOUT (proto brief, 2 Nov): her line in the box, one at a time, its key word underlined; word tiles
 * under it (Body / Face): a tile for every part in play, asked for or not; no tile glows for the answer (a tile lights only while
 * its word is spoken, at L1-L2); from L3 the tile's word dots out (tap the dots to see it: a hint).
 *   Tap the part on her. A tap anywhere on her head opens the face (the camera glides in; it always opens, right or wrong:
 *   not a verdict); inside, the forehead (= the head), the ears, the eyes, the nose, the mouth. A tap off the face glides out.
 *   A right tap: "ow!", a soft red glow, the row ticks (gold first try, plain after a miss). A wrong tap: a giggle, a wriggle or
 *   a shrug, never a frown, and her line again. Every part stays live.
 *
 *   L1  7 parts (knee, hand, arm, leg, foot; head and ear in the face), two calls
 *   L2  13 parts (adds elbow, tummy, chest; eye, nose, mouth in the face), three calls
 *   L3  as L2, the tiles' words dotted out                L4  as L3, four calls
 * Not yet: two parts in one line (P-2: frame missing), the side ask and its showing (L3), the why ("I've got a cough": P-7
 * missing), the hand and foot zooms and the small parts (finger, thumb, toe, cheek, chin: L4).
 */
const A = {
  girl: "assets/clinic/patients/girl/girl-front.webp",
  head: "assets/clinic/patients/girl/girl-head-neutral.webp",
  sore: "assets/clinic/patients/girl/girl-head-sore.webp",
  face: "assets/shared/faces/girl.webp",
};
// the tiles' pictures: what the repo has (closeups); a part with none is a plain tile (art to come)
const PIC = {
  knee: "assets/clinic/closeups/child/knee.webp",
  arm: "assets/clinic/closeups/child/forearm.webp",
  foot: "assets/clinic/closeups/child/sole.webp",
  ear: "assets/clinic/closeups/girl/ear.webp",
  eye: "assets/clinic/closeups/girl/eyes.webp",
  mouth: "assets/clinic/closeups/girl/mouth.webp",
  head: "assets/clinic/patients/girl/girl-head-neutral.webp",
  nose: "assets/clinic/patients/girl/girl-head-cold.webp",
};
// the body's spots, in shares of her picture (x, y of its width and height; r of its width); both sides where there are two
const BODY = {
  chest: [[0.5, 0.42, 0.13]],
  tummy: [[0.5, 0.52, 0.11]],
  hand: [[0.44, 0.61, 0.09], [0.56, 0.61, 0.09]],
  arm: [[0.25, 0.47, 0.08], [0.75, 0.47, 0.08]],
  elbow: [[0.28, 0.56, 0.07], [0.72, 0.56, 0.07]],
  knee: [[0.37, 0.69, 0.1], [0.63, 0.69, 0.1]],
  leg: [[0.37, 0.8, 0.09], [0.63, 0.8, 0.09]],
  foot: [[0.35, 0.93, 0.1], [0.65, 0.93, 0.1]],
};
// the face's spots, in shares of the close-up (a square)
const FACE = {
  head: [[0.5, 0.22, 0.14]],
  ear: [[0.19, 0.53, 0.08], [0.81, 0.52, 0.08]],
  eye: [[0.36, 0.43, 0.07], [0.63, 0.41, 0.07]],
  nose: [[0.5, 0.5, 0.055]],
  mouth: [[0.51, 0.59, 0.07]],
};
const L1 = { body: ["knee", "hand", "arm", "leg", "foot"], face: ["head", "ear"] };
const L2 = { body: ["knee", "hand", "arm", "elbow", "leg", "foot", "tummy", "chest"], face: ["head", "ear", "eye", "nose", "mouth"] };
const stamp = (p) => (typeof window !== "undefined" && typeof window.njgV === "function" ? window.njgV(p) : p);
const I = (part) => ({ fn: "Item", kind: `n.${part}` });

export default {
  opts: { sentence: true, person: { id: "girl", name: "The patient", face: A.face } },
  async run(F) {
    const lv = F.level;
    const set = lv === 1 ? L1 : L2;
    const pool = set.body.concat(set.face);
    const calls = [2, 3, 3, 4][lv - 1];
    // the parts asked: drawn at random, never the same twice in a row; a face part at most every other call
    const asks = [];
    while (asks.length < calls) {
      const p = F.pick(pool);
      if (asks.includes(p)) continue;
      asks.push(p);
    }

    /* ----- the word tiles: every part in play ----- */
    F.tiles([
      { label: "Body", tiles: set.body.map((p) => ({ key: p, word: I(p), picture: PIC[p] || null })) },
      { label: "Face", tiles: set.face.map((p) => ({ key: p, word: I(p), picture: PIC[p] || null })) },
    ]);

    /* ----- the scene: the wall, the bed, the patient sitting on it ----- */
    F.scene.insertAdjacentHTML("beforeend", '<div class="cp-wall"></div><div class="cp-floor"></div><div class="cp-bed"></div>');
    const body = F.put("cp-body-girl", { x: 0.5, y: 0.97, h: 0.94, img: A.girl, z: 5 });
    const faceEl = document.createElement("div");
    faceEl.className = "cp-face";
    faceEl.innerHTML = `<div class="cp-facebox"><img alt="" src="${stamp(A.head)}"></div>`;
    F.play.appendChild(faceEl);
    const faceBox = faceEl.firstElementChild;
    const spots = [];
    const spot = (parent, part, [x, y, r]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "cp-spot";
      b.dataset.part = part;
      b.setAttribute("aria-label", part);
      Object.assign(b.style, { left: `${x * 100}%`, top: `${y * 100}%` });
      b.style.setProperty("--r", `${r * 100}%`);
      // (a circle: its height is its width; the width is a share of the parent's width)
      b.style.height = "auto";
      b.style.aspectRatio = "1";
      parent.appendChild(b);
      spots.push(b);
      F.on(b, "click", (ev) => {
        ev.stopPropagation();
        tapPart(part, b);
      });
      return b;
    };
    Object.entries(BODY).forEach(([part, list]) => list.forEach((s) => spot(body, part, s)));
    // the head: a tap anywhere on it opens the face (right or wrong: not a verdict, not a try)
    const head = document.createElement("button");
    head.type = "button";
    head.className = "cp-spot cp-headzone";
    head.setAttribute("aria-label", "her face");
    Object.assign(head.style, { left: "50%", top: "17%", width: "62%", height: "32%", borderRadius: "45%" });
    body.appendChild(head);
    F.on(head, "click", (ev) => {
      ev.stopPropagation();
      F.acted();
      openFace(true);
    });
    Object.entries(FACE).forEach(([part, list]) => list.forEach((s) => spot(faceBox, part, s)));
    F.on(faceEl, "click", () => {
      F.acted();
      openFace(false);
    });
    function openFace(on) {
      faceEl.classList.toggle("open", !!on);
      faceBox.querySelector("img").src = stamp(A.head);
    }

    /* ----- the calls: one at a time ----- */
    let cur = null;
    const SILLY = ["hee hee!", "na!", "?", "hee!"];
    let silly = 0;
    function tapPart(part, el) {
      F.acted();
      if (!cur || cur.done) return;
      if (part === cur.data.part) {
        el.classList.add("found");
        bubble("ow!", el);
        if (faceEl.classList.contains("open")) faceBox.querySelector("img").src = stamp(A.sore);
        F.add(cur);
        F.after(F.T(1400), () => el.classList.remove("found"));
        return;
      }
      // a wrong tap: a different small reaction each time, never a frown; her line again (the row will tick plain)
      bubble(SILLY[silly++ % SILLY.length], el);
      F.oops(cur, faceEl.classList.contains("open") ? faceBox : body);
    }
    function bubble(text, at) {
      const a = at.getBoundingClientRect();
      const pr = F.play.getBoundingClientRect();
      const b = document.createElement("div");
      b.className = "cp-bubble";
      b.textContent = text;
      Object.assign(b.style, { left: `${a.left + a.width / 2 - pr.left}px`, top: `${a.top - pr.top}px` });
      F.play.appendChild(b);
      F.after(F.T(1000), () => b.remove());
    }

    const rows = asks.map((part, i) => F.row({ key: `${part}${i}`, line: { fn: "MyXHurts", x: I(part) }, word: I(part), need: 1, data: { part }, target: () => (FACE[part] && !faceEl.classList.contains("open") ? head : spots.find((s) => s.dataset.part === part && s.isConnected)) }));
    F.begin();
    for (const r of rows) {
      cur = r;
      F.focus(r);
      const tile = F.tileEl(r.data.part);
      if (tile && lv <= 2) tile.classList.add("on"); // lit while its word is said, only while supported
      await F.instruct(r);
      if (tile) tile.classList.remove("on");
      if (r === rows[0]) F.teach("tap-part", body);
      await new Promise((res) => {
        const t = setInterval(() => {
          if (r.done || F.dead) {
            clearInterval(t);
            res();
          }
        }, 120);
      });
      if (F.dead) return;
      await F.sleep(F.T(900));
      openFace(false);
    }
    await F.finish(async () => {
      F.jiggle(body, "cp-bounce");
      await F.sleep(F.T(700));
    });
  },
};
