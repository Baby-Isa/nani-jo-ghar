/* s09-mock: the evening book (docs/game-design/modes/story-by-the-fire.md). Nani and the child in the sitting room at
   night (the real sitting-room picture, relit in code), the book in her lap built from a fake day log of the farm day:
   the words met today as pictures with their Kutchi (no English for the child), the photos taken, a progress mark (never
   a verdict), then goodnight and a glimpse of tomorrow's door with its sky. ?p=1..6 picks the page; → turns it. */
(function (global) {
  "use strict";
  const M = global.Mock;
  const R = M.ROOT;
  const Book = (global.Book = {});
  const IMG = {
    goat: `${R}assets/characters/goat/goat-side.png`,
    goatWalk: `${R}assets/characters/goat/goat-walk.png`,
    hen: `${R}assets/characters/hen/hen-side.png`,
    chick: `${R}assets/characters/chick/chick-side.png`,
    potato: `${R}assets/items/vegetable/veg-01.png`,
  };
  // drawn pieces ("to draw"): the car, the corn on the fire, a red door, a lamp
  const CAR = `<svg viewBox="0 0 320 180" aria-hidden="true"><path d="M30 120 L60 70 Q70 56 90 56 L220 56 Q238 56 250 70 L290 120 Z" fill="#c0443c"/><rect x="20" y="118" width="280" height="36" rx="12" fill="#a63b3b"/><path d="M80 70 L100 66 L150 66 L150 112 L70 112 Z" fill="#cfe3ee"/><path d="M165 66 L215 66 L235 112 L165 112 Z" fill="#cfe3ee"/><circle cx="90" cy="150" r="24" fill="#2a2522"/><circle cx="90" cy="150" r="10" fill="#d9d2c7"/><circle cx="230" cy="150" r="24" fill="#2a2522"/><circle cx="230" cy="150" r="10" fill="#d9d2c7"/><rect x="292" y="112" width="14" height="14" rx="3" fill="#ffe27a"/></svg>`;
  const CORN = `<svg viewBox="0 0 320 220" aria-hidden="true"><ellipse cx="160" cy="190" rx="120" ry="18" fill="#8a6239"/><path d="M60 180 Q160 120 260 180" stroke="#5b3b25" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M130 160 Q160 90 190 160 Z" fill="#e8a33a"/><path d="M110 165 Q160 110 210 165 Z" fill="#f2b64c" opacity=".8"/><g transform="rotate(-18 160 90)"><rect x="90" y="70" width="140" height="42" rx="21" fill="#f5c542"/><g fill="#d9a441"><circle cx="110" cy="91" r="5"/><circle cx="130" cy="84" r="5"/><circle cx="130" cy="99" r="5"/><circle cx="150" cy="91" r="5"/><circle cx="170" cy="84" r="5"/><circle cx="170" cy="99" r="5"/><circle cx="190" cy="91" r="5"/><circle cx="210" cy="86" r="5"/></g><path d="M226 80 Q262 70 270 92 Q250 100 226 102 Z" fill="#7a9b55"/></g></svg>`;
  const REDDOOR = `<svg viewBox="0 0 300 300" aria-hidden="true"><rect width="300" height="300" fill="#a9d8f5"/><rect y="60" width="300" height="190" fill="#efe3d3"/><rect y="48" width="300" height="14" fill="#dccbb3"/><rect x="100" y="90" width="110" height="160" rx="6" fill="#b58a5a"/><rect x="110" y="100" width="90" height="150" fill="#b72424"/><path d="M130 100v150M155 100v150M180 100v150" stroke="#8e1b1b" stroke-width="4" opacity=".6"/><circle cx="186" cy="178" r="6" fill="#c9962e"/><rect y="250" width="300" height="50" fill="#e2c79b"/></svg>`;
  const FARMBG = (w = 400, h = 300) => `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="${w}" height="${h}" fill="#a9d8f5"/><circle cx="${w - 60}" cy="50" r="26" fill="#ffe27a"/><path d="M0 150 C100 120 200 130 ${w} 140 V${h} H0 Z" fill="#aab79a"/><rect y="180" width="${w}" height="${h}" fill="#9cbf6b"/><rect y="236" width="${w}" height="${h}" fill="#e2c79b"/><g stroke="#8a6239" stroke-width="5"><path d="M0 206h${w}M0 222h${w}"/><path d="M30 196v40M110 196v40M190 196v40M270 196v40M350 196v40"/></g></svg>`;
  const LAMP = `<svg viewBox="0 0 160 240" aria-hidden="true"><rect x="70" y="120" width="20" height="90" fill="#c9962e"/><ellipse cx="80" cy="216" rx="46" ry="12" fill="#a67a24"/><path d="M30 120 L50 40 L110 40 L130 120 Z" fill="#f3d9a4"/><path d="M30 120 L50 40 L110 40 L130 120 Z" fill="#fff" opacity=".25"/><rect x="24" y="116" width="112" height="10" rx="4" fill="#c9962e"/><circle cx="80" cy="80" r="58" fill="#ffd27a" opacity=".22"/></svg>`;
  const MOON = `<svg viewBox="0 0 300 200" aria-hidden="true"><rect width="300" height="200" rx="14" fill="#1f2a5e"/><circle cx="210" cy="80" r="40" fill="#fff6d6"/><g fill="#fff"><circle cx="40" cy="40" r="3"/><circle cx="90" cy="110" r="2.5"/><circle cx="140" cy="50" r="3"/><circle cx="60" cy="150" r="2"/><circle cx="250" cy="150" r="2.5"/><circle cx="120" cy="160" r="3"/><circle cx="270" cy="30" r="2"/></g><path d="M0 170 Q150 150 300 170 V200 H0 Z" fill="#3c3f6e"/></svg>`;

  /** The fake day log (story-by-the-fire 2): what the child did on the farm day, in order. Pages are built from it. */
  Book.DAY = {
    arc: "farm",
    weather: "sun",
    tomorrow: "cloud",
    entries: [
      { errand: "go", type: "saw", what: "car" },
      { errand: "go", type: "saw", what: "goat" },
      { errand: "go", type: "saw", what: "red-door" },
      { errand: "patch", type: "counted", what: "potato", count: 3 },
      { errand: "picnic", type: "made", what: "corn" },
      { errand: "snap", type: "photo", what: "goat-chick" },
      { errand: "snap", type: "photo", what: "red-door" },
    ],
  };

  // the pages: each a left and right page plus Nani's line (what she says as it opens)
  const page = (left, right) => `<div class="mk-page">${left}</div><div class="mk-page">${right}</div>`;
  const word = (pic, k) => `<div class="art">${pic}</div><div class="cap">${k}</div>`;
  const img = (src, cls = "") => `<img alt="" class="${cls}" src="${src}">`;
  Book.PAGES = [
    {
      // 1 the cover: today's door, then the first group cover (we went in the car)
      line: { e: "Shall I tell you what we did today?", rec: true },
      left: () => `<div class="art">${global.Door.mini(Book.DAY.weather)}</div>`,
      right: () => word(CAR, "<span class='word'>gadi</span>"),
    },
    {
      // 2 spotted (gap rung G1): the road with the goat where it was tapped; the gap and its two picture pills
      line: { e: "You spotted a ___!", rec: true },
      left: () => `<div class="art" style="position:relative"><div class="mk-print tilt-l" style="width:88%;border-width:0;background:none;box-shadow:none;transform:none">${FARMBG()}${img(IMG.goatWalk)}</div></div>`,
      right: () => `<div class="art"><span class="mk-pic empty" style="width:calc(var(--njg-tap)*1.6);height:calc(var(--njg-tap)*1.6)"></span></div><div class="gap"></div>`,
      after(el) {
        const row = global.NjgButtons.pills(el.querySelector(".gap"), [{ id: "goat", html: img(IMG.goat) }, { id: "hen", html: img(IMG.hen) }], () => {});
        row.pill("goat").classList.add("njg-pulse");
      },
    },
    {
      // 3 counted and made: three potatoes (recorded whole), corn on the fire
      line: { e: "You pulled three potatoes.", rec: true },
      left: () => word(`<div class="row">${img(IMG.potato)}${img(IMG.potato)}${img(IMG.potato)}</div>`, "<span class='word'>trae bateta</span>"),
      right: () => word(CORN, "<span class='word'>makai</span>"),
    },
    {
      // 4 the photos taken (Snap): the prints, a gold corner for first-time-right
      line: { e: "Here's the photo.", rec: true },
      left: () => `<div class="art"><div class="mk-print tilt-l" style="width:84%">${FARMBG()}<img alt="" src="${IMG.goat}" style="left:8%;top:28%;width:52%;height:auto;inset:auto"><img alt="" src="${IMG.chick}" style="left:58%;top:52%;width:24%;height:auto;inset:auto"><i class="gold"></i></div></div><div class="cap"><span class="word">bakri sathe</span></div>`,
      right: () => `<div class="art"><div class="mk-print tilt-r" style="width:84%">${REDDOOR}</div></div><div class="cap"><span class="word">laal darwajo</span></div>`,
    },
    {
      // 5 progress, not a verdict: today's words as gold-edged cards; the shelf of days gains today's book
      line: { k: "{Shabash}!", e: "Well done!" },
      left: () => `<div class="mk-words">${[[img(IMG.goat), "bakri"], [img(IMG.hen), "murgi"], [REDDOOR, "laal darwajo"], [CAR, "gadi"], [img(IMG.potato), "bateto"], [CORN, "makai"]].map(([p, k]) => `<div class="mk-word">${p}<b>${k}</b></div>`).join("")}</div>`,
      right: () => `<div class="art"><div class="mk-shelf"><i class="sun"></i><i class="today"></i><i class="empty"></i><i class="empty"></i><i class="empty"></i></div></div>`,
    },
    {
      // 6 goodnight, and a glimpse of tomorrow's door with its sky
      line: { e: "Goodnight.", rec: true },
      left: () => `<div class="art" style="gap:6%"><div class="box" style="aspect-ratio:160/240">${LAMP}</div><div class="box" style="height:70%;aspect-ratio:3/2">${MOON}</div></div>`,
      right: () => `<div class="art">${global.Door.mini(Book.DAY.tomorrow)}</div>`,
    },
  ];

  Book.show = async function () {
    const p = Math.min(Book.PAGES.length, Math.max(1, Number(M.q.get("p")) || 1));
    const P = Book.PAGES[p - 1];
    const f = M.frame();
    const guide = M.side(f.side, { card: M.card({ pics: [{ src: IMG.goat, cls: "gold" }, { src: IMG.hen, cls: "gold" }, { svg: REDDOOR, cls: "gold full" }, { src: IMG.potato, cls: "gold" }] }) });
    guide.set(M.lineHtml(P.line), { rec: !!P.line.rec });
    const stage = document.createElement("div");
    stage.className = "mk-stage";
    stage.innerHTML = `<div class="mk-room"></div><div class="mk-window-night"><i class="bar v"></i><i class="bar h" style="top:30%"></i><i class="bar h" style="top:62%"></i></div><div class="mk-night"></div><div class="mk-room-lamp"></div><div class="mk-lamp">${LAMP}</div>
      <div class="mk-sitter nani"><img alt="Nani" src="${R}assets/cook/characters/nani-happy-v3.webp"></div>
      <div class="mk-sitter child"></div>
      <div class="mk-book">${page(P.left(), P.right())}<div class="pageno" style="position:absolute;left:50%;bottom:var(--njg-s2);transform:translateX(-50%);display:flex;gap:var(--njg-s1)">${Book.PAGES.map((_, i) => `<i style="width:7px;height:7px;border-radius:50%;background:${i + 1 === p ? "var(--njg-gold)" : "var(--njg-grey)"}"></i>`).join("")}</div></div>`;
    f.play.appendChild(stage);
    if (P.after) P.after(stage);
    // the child: the player's own character (js/shared/character.js), as the game draws it today
    try {
      await global.Character.load(`${R}data/character-options.json`);
      stage.querySelector(".mk-sitter.child").innerHTML = global.Character.svg(global.Character.defaults(), { title: "You" });
    } catch (e) {
      /* no character: the seat stays empty */
    }
    // the shared go-on button turns the page; the last page ends with the ✓
    if (p < Book.PAGES.length) global.NjgButtons.next(f.play, "", () => (location.search = `?p=${p + 1}`), {});
    else global.NjgButtons.done(f.play, () => {}, { glow: true });
    M.note(f.play, `the evening book · page ${p} of ${Book.PAGES.length}`);
  };
})(window);
