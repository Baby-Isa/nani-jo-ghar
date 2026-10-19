/* s09-mock: the window ride. The view from inside the car (or the bus: "to draw") as the farm road scrolls past, like the
   clinic's pharmacy belt; Nani names a thing and the child taps it as it passes; look-alikes pass together (the red door
   with a blue door, the she-goat with the billy goat) so only the word decides; the "stop the car!" moment (?t=stop).
   ?at=<seconds> jumps the scroll to that moment (the filmstrip); ?v=bus picks the bus page's frame. */
(function (global) {
  "use strict";
  const M = global.Mock;
  const R = M.ROOT;
  const Ride = (global.Ride = {});
  const IMG = {
    goat: `${R}assets/characters/goat/goat-walk.png`,
    goatSide: `${R}assets/characters/goat/goat-side.png`,
    goatFront: `${R}assets/characters/goat/goat-front.png`,
    goatGraze: `${R}assets/characters/goat/goat-graze.png`,
    hen: `${R}assets/characters/hen/hen-walk.png`,
    henPeck: `${R}assets/characters/hen/hen-peck.png`,
    chick: `${R}assets/characters/chick/chick-run.png`,
  };
  // the road strip, three views wide: sky, far hills, fields, the road and its fence; the houses and trees sit on it
  const STRIP_BG = `<svg class="bg" viewBox="0 0 4800 900" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id="rsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fa9e6"/><stop offset="1" stop-color="#cfe9f8"/></linearGradient></defs>
    <rect width="4800" height="900" fill="url(#rsky)"/>
    <circle cx="700" cy="150" r="70" fill="#ffe27a"/>
    <g fill="#fff" opacity=".9"><ellipse cx="1400" cy="170" rx="120" ry="40"/><ellipse cx="1460" cy="140" rx="80" ry="50"/><ellipse cx="3100" cy="130" rx="140" ry="44"/><ellipse cx="3180" cy="100" rx="90" ry="56"/></g>
    <path d="M0 470 C400 400 800 440 1200 430 C1600 420 2000 380 2400 430 C2800 480 3200 400 3600 430 C4000 460 4400 410 4800 440 V900 H0 Z" fill="#aab79a"/>
    <rect y="560" width="4800" height="340" fill="#9cbf6b"/>
    <g fill="#8bb05c"><rect x="200" y="560" width="900" height="120"/><rect x="2600" y="560" width="700" height="120"/></g>
    <rect y="740" width="4800" height="160" fill="#d9bf8f"/>
    <path d="M0 790 H4800" stroke="#c9ad7a" stroke-width="10" stroke-dasharray="90 60"/>
    <g stroke="#8a6239" stroke-width="10" stroke-linecap="round"><path d="M0 700 H4800 M0 724 H4800"/>${Array.from({ length: 40 }, (_, i) => `<path d="M${i * 120 + 40} 680 V740"/>`).join("")}</g>
  </svg>`;
  const TREE = (x) => `<svg viewBox="0 0 300 420" style="position:absolute;left:${x}%;bottom:16%;height:62%" aria-hidden="true"><rect x="135" y="220" width="30" height="200" rx="10" fill="#8a5a36"/><g fill="#6f9a52"><circle cx="90" cy="190" r="80"/><circle cx="160" cy="130" r="100"/><circle cx="230" cy="200" r="78"/></g><g fill="#89b267"><circle cx="110" cy="160" r="46"/><circle cx="180" cy="110" r="58"/></g></svg>`;
  const HOUSE = (x, colour, cls = "") => `<svg viewBox="0 0 420 380" class="mk-tap ${cls}" style="position:absolute;left:${x}%;bottom:18%;height:52%" aria-hidden="true"><rect x="10" y="90" width="400" height="260" fill="#efe3d3"/><rect x="0" y="76" width="420" height="20" fill="#dccbb3"/><rect x="20" y="96" width="380" height="12" fill="#000" opacity=".06"/><rect x="150" y="170" width="120" height="180" rx="6" fill="#b58a5a"/><rect x="160" y="180" width="100" height="170" fill="${colour}"/><path d="M185 180v170M210 180v170M235 180v170" stroke="#000" stroke-opacity=".22" stroke-width="4"/><circle cx="246" cy="268" r="7" fill="#c9962e"/><rect x="300" y="170" width="70" height="80" rx="4" fill="#b58a5a"/><rect x="308" y="178" width="54" height="64" fill="#cfe3ee"/><rect x="50" y="170" width="70" height="80" rx="4" fill="#b58a5a"/><rect x="58" y="178" width="54" height="64" fill="#cfe3ee"/></svg>`;
  const BIRD = (x, y) => `<svg viewBox="0 0 120 80" style="position:absolute;left:${x}%;top:${y}%;height:9%" aria-hidden="true"><ellipse cx="60" cy="48" rx="28" ry="18" fill="#6b4a33"/><circle cx="86" cy="36" r="13" fill="#6b4a33"/><path d="M96 36 l14 4 -14 4z" fill="#e8a33a"/><path d="M40 44 Q20 20 10 34 Q30 40 44 52z" fill="#8a5a36"/><path d="M30 60 l-14 10" stroke="#6b4a33" stroke-width="4"/></svg>`;
  const item = (x, src, cls = "") => `<div class="item ${cls}" style="left:${x}%"><img alt="" src="${src}"></div>`;

  const CAR_FRAME = `<svg viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id="panel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8c7560"/><stop offset="1" stop-color="#6b5a4a"/></linearGradient><linearGradient id="roof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9d2c7"/><stop offset="1" stop-color="#bdb5a9"/></linearGradient></defs>
    <rect x="0" y="0" width="1600" height="70" fill="url(#roof)"/>
    <rect x="0" y="0" width="100" height="620" fill="#5a4a3c"/><rect x="1500" y="0" width="100" height="620" fill="#5a4a3c"/>
    <rect x="0" y="600" width="1600" height="300" fill="url(#panel)"/>
    <rect x="0" y="600" width="1600" height="16" fill="#3b2e24"/>
    <rect x="1080" y="700" width="420" height="54" rx="27" fill="#3b2e24"/>
    <rect x="1120" y="650" width="150" height="34" rx="17" fill="#c9962e"/>
    <rect x="140" y="760" width="620" height="110" rx="26" fill="#5a4a3c"/><rect x="140" y="760" width="620" height="14" rx="7" fill="#3b2e24"/>
  </svg>`;
  const BUS_FRAME = `<svg viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
    <rect x="0" y="0" width="1600" height="54" fill="#d9d2c7"/>
    <rect x="0" y="0" width="64" height="640" fill="#7b8692"/><rect x="1536" y="0" width="64" height="640" fill="#7b8692"/>
    <rect x="0" y="612" width="1600" height="288" fill="#8c96a2"/>
    <rect x="0" y="612" width="1600" height="14" fill="#5d6670"/>
    <rect x="64" y="660" width="1472" height="18" rx="9" fill="#c9962e"/>
    <path d="M0 900 V700 Q0 660 40 660 H640 Q700 660 700 720 V900 Z" fill="#2f3e6b"/><path d="M60 900 V720 Q60 690 90 690 H610 Q650 690 650 730 V900 Z" fill="#3a4c82"/>
    <circle cx="380" cy="700" r="90" fill="#3a2a1a"/><path d="M290 760 Q380 700 470 760 V900 H290 Z" fill="#9ca78a"/>
    <rect x="1380" y="640" width="30" height="260" rx="15" fill="#c9962e"/>
  </svg>`;

  Ride.show = function (o = {}) {
    const bus = o.vehicle === "bus";
    const stop = M.q.get("t") === "stop";
    const at = Number(M.q.get("at")) || 0;
    const f = M.frame();
    // the sidebar: Nani's box with the thing she names; what has been spotted so far (a card), the dock
    const line = stop ? { k: "{Gadi} ke ubhi rakh!", e: "Stop the car!" } : { k: "{laal darwajo}", e: "the red door" };
    const card = M.card({ pics: [{ src: IMG.goatSide, cls: "gold" }, { src: IMG.henPeck, cls: "gold" }, { cls: "empty" }, { cls: "empty" }] });
    const guide = M.side(f.side, { card });
    guide.set(M.lineHtml(line), { rec: false });

    const stage = document.createElement("div");
    stage.className = `mk-stage ${stop ? "stopped" : ""}`;
    const things = `
      ${TREE(3)}
      ${item(9, IMG.goatGraze, "small")}
      ${item(14, IMG.hen, "small")}
      ${HOUSE(20, "#b72424")}${HOUSE(27, "#3f78b8")}
      ${BIRD(24, 14)}
      ${item(38, IMG.goat, "")}${item(42, IMG.goatSide, "flip")}
      ${TREE(50)}
      ${item(56, IMG.henPeck, "small")}${item(59, IMG.chick, "small")}
      ${HOUSE(66, "#9ca78a")}
      ${BIRD(72, 10)}
      ${item(78, IMG.goat, "")}
      ${HOUSE(86, "#b72424")}${HOUSE(93, "#3f78b8")}
      ${stop ? item(34, IMG.goatFront, "onroad hint mk-tap") : ""}`;
    stage.innerHTML = `
      <div class="mk-view ${bus ? "bus" : ""}">
        <div class="mk-strip" style="animation-delay:-${at}s">${STRIP_BG}${things}</div>
        <div class="mk-stopline" style="display:${stop ? "block" : "none"}">${M.lineHtml(line)}</div>
      </div>
      <div class="mk-car ${stop ? "" : "mk-shake"}">${bus ? BUS_FRAME : CAR_FRAME}</div>`;
    f.play.appendChild(stage);
    M.note(f.play, `${bus ? "the bus" : "the car"} window · the farm road${stop ? " · stop the car!" : " · the red door passes with a blue one"}`);
  };
})(window);
