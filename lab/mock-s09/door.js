/* s09-mock: the morning door. One fixed house front and foreground (drawn in code: "to draw"), the sky from the horizon up
   swapped per weather, the light and shadows following it (a tint; a sun-shadow layer only when sunny; rain in code), Nani
   at her open door (her real standing picture), her line as short sentences one at a time (Kutchi, its English beneath:
   rule 5, Zafar 19 Oct), a thought bubble of the day's place, and the child's answer pills. */
(function (global) {
  "use strict";
  const M = global.Mock;
  const R = M.ROOT;
  const Door = (global.Door = {});

  // the house: viewBox 1600x900, the ground from y=740 (the figure's feet sit on the step at y=750)
  const HOUSE = `
<svg class="scene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
  <defs>
    <linearGradient id="skySun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fa9e6"/><stop offset=".7" stop-color="#a9d8f5"/><stop offset="1" stop-color="#eaf4f8"/></linearGradient>
    <linearGradient id="skyCloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8d9eb0"/><stop offset=".7" stop-color="#c4ccd3"/><stop offset="1" stop-color="#e3e4e2"/></linearGradient>
    <linearGradient id="skyRain" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f5f74"/><stop offset=".7" stop-color="#8291a3"/><stop offset="1" stop-color="#aab3bd"/></linearGradient>
    <linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1538"/><stop offset=".75" stop-color="#1f2a5e"/><stop offset="1" stop-color="#3c3f6e"/></linearGradient>
    <radialGradient id="sunGlow"><stop offset="0" stop-color="#fff5c8" stop-opacity=".95"/><stop offset="1" stop-color="#fff0b0" stop-opacity="0"/></radialGradient>
    <linearGradient id="inside" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2418"/><stop offset="1" stop-color="#6b4a33"/></linearGradient>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3e9db"/><stop offset="1" stop-color="#e6d6c0"/></linearGradient>
    <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dcc39a"/><stop offset="1" stop-color="#e8d2ad"/></linearGradient>
    <linearGradient id="pane" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9dc3dd"/><stop offset="1" stop-color="#cfe3ee"/></linearGradient>
  </defs>
  <!-- the sky, swapped per weather -->
  <rect class="sky" x="0" y="0" width="1600" height="560"/>
  <g class="sun"><circle cx="1180" cy="140" r="150" fill="url(#sunGlow)"/><circle cx="1180" cy="140" r="64" fill="#ffe27a"/></g>
  <g class="moon"><circle cx="1210" cy="130" r="120" fill="#ffffff" opacity=".08"/><circle cx="1210" cy="130" r="48" fill="#fff6d6"/><circle cx="1194" cy="118" r="8" fill="#efe3bd"/><circle cx="1226" cy="146" r="6" fill="#efe3bd"/></g>
  <g class="clouds small" fill="#ffffff" opacity=".9"><ellipse cx="300" cy="150" rx="90" ry="34"/><ellipse cx="350" cy="130" rx="60" ry="40"/><ellipse cx="920" cy="90" rx="70" ry="26"/><ellipse cx="960" cy="78" rx="46" ry="30"/></g>
  <g class="clouds big"><g fill="#f4f6f7"><ellipse cx="260" cy="150" rx="170" ry="54"/><ellipse cx="330" cy="110" rx="120" ry="74"/><ellipse cx="170" cy="120" rx="90" ry="56"/></g><g fill="#e9edf0"><ellipse cx="760" cy="90" rx="150" ry="48"/><ellipse cx="830" cy="60" rx="100" ry="62"/><ellipse cx="680" cy="70" rx="80" ry="50"/></g><g fill="#eef1f3"><ellipse cx="1280" cy="170" rx="190" ry="56"/><ellipse cx="1360" cy="120" rx="120" ry="78"/><ellipse cx="1190" cy="130" rx="100" ry="60"/></g></g>
  <g class="clouds rain"><g fill="#73808f"><ellipse cx="300" cy="120" rx="220" ry="60"/><ellipse cx="400" cy="70" rx="150" ry="80"/><ellipse cx="180" cy="90" rx="110" ry="64"/></g><g fill="#66727f"><ellipse cx="900" cy="80" rx="240" ry="62"/><ellipse cx="1000" cy="40" rx="150" ry="70"/><ellipse cx="760" cy="60" rx="120" ry="60"/></g><g fill="#7b8896"><ellipse cx="1400" cy="150" rx="210" ry="58"/><ellipse cx="1480" cy="100" rx="130" ry="76"/></g></g>
  <!-- far hills -->
  <path class="hills" d="M0 520 C200 470 380 480 560 500 C760 520 900 440 1100 470 C1300 500 1450 450 1600 480 L1600 600 L0 600 Z" fill="#aab79a"/>
  <!-- the tree beside the house -->
  <g class="tree"><rect x="1395" y="330" width="34" height="420" rx="10" fill="#8a5a36"/><path d="M1412 420 C1380 400 1350 380 1330 350" stroke="#8a5a36" stroke-width="14" stroke-linecap="round" fill="none"/><path d="M1412 400 C1450 380 1480 360 1500 330" stroke="#8a5a36" stroke-width="14" stroke-linecap="round" fill="none"/>
    <g fill="#6f9a52"><circle cx="1330" cy="300" r="96"/><circle cx="1430" cy="250" r="120"/><circle cx="1530" cy="310" r="96"/><circle cx="1420" cy="350" r="90"/></g>
    <g fill="#89b267"><circle cx="1350" cy="270" r="60"/><circle cx="1450" cy="220" r="74"/><circle cx="1520" cy="280" r="52"/></g></g>
  <!-- the house front: limewash, a flat roof with a parapet -->
  <rect x="0" y="340" width="1600" height="26" fill="#dccbb3"/>
  <rect x="0" y="366" width="1600" height="380" fill="url(#wall)"/>
  <rect x="0" y="366" width="1600" height="16" fill="#000" opacity=".06"/>
  <!-- the lower annex on the left, with the hen coop (a nod to the courtyard picture) -->
  <rect x="0" y="440" width="340" height="300" fill="#eadcc7"/><rect x="0" y="428" width="352" height="18" fill="#d9c7ad"/><rect x="0" y="446" width="340" height="12" fill="#000" opacity=".06"/>
  <g class="coop"><rect x="110" y="600" width="190" height="130" rx="6" fill="#b58a5a"/><rect x="124" y="614" width="162" height="70" fill="#8a6239"/><g stroke="#d9b98a" stroke-width="3" opacity=".8"><path d="M140 614v70M164 614v70M188 614v70M212 614v70M236 614v70M260 614v70M124 632h162M124 652h162M124 672h162"/></g><rect x="150" y="690" width="60" height="40" fill="#5b3b25"/><path d="M80 740 L150 700 L150 740 Z" fill="#c69a68"/></g>
  <!-- the window with its sage shutters -->
  <g class="window"><rect x="1050" y="440" width="52" height="200" rx="4" fill="#9ca78a"/><rect x="1058" y="452" width="36" height="176" rx="3" fill="#8b9779"/><rect x="1282" y="440" width="52" height="200" rx="4" fill="#9ca78a"/><rect x="1290" y="452" width="36" height="176" rx="3" fill="#8b9779"/>
    <rect x="1102" y="436" width="180" height="208" rx="6" fill="#b58a5a"/><rect class="pane" x="1116" y="450" width="152" height="180" fill="url(#pane)"/><rect x="1188" y="450" width="8" height="180" fill="#b58a5a"/><rect x="1116" y="536" width="152" height="8" fill="#b58a5a"/><rect x="1096" y="640" width="192" height="14" rx="4" fill="#d9c7ad"/></g>
  <!-- the door: an oak frame, the inside, the open blue leaf, the step -->
  <g class="door"><rect x="632" y="392" width="316" height="356" rx="8" fill="#b58a5a"/><rect x="656" y="412" width="268" height="336" fill="url(#inside)"/>
    <path class="leaf" d="M540 398 L656 412 L656 748 L540 760 Z" fill="#3f78b8"/><path d="M558 410 L558 752 M588 410 L588 752 M618 410 L618 752 M640 412 L640 749" stroke="#2f5f94" stroke-width="5" opacity=".7"/><rect x="546" y="440" width="104" height="14" fill="#2f5f94" opacity=".55"/><rect x="546" y="690" width="104" height="14" fill="#2f5f94" opacity=".55"/><circle cx="632" cy="585" r="14" fill="none" stroke="#c9962e" stroke-width="7"/>
    <rect x="612" y="748" width="356" height="22" rx="4" fill="#d9c7a8"/><rect x="612" y="748" width="356" height="6" fill="#fff" opacity=".35"/></g>
  <!-- the lantern by the door (lit at night) -->
  <g class="lantern"><rect x="978" y="430" width="8" height="34" fill="#8a6239"/><path d="M960 462 h44 l6 14 v44 l-6 10 h-44 l-6 -10 v-44 z" fill="#c9962e"/><rect x="964" y="480" width="36" height="40" rx="3" fill="#fff2c4" class="lamp-pane"/><rect x="970" y="420" width="24" height="12" rx="4" fill="#c9962e"/></g>
  <!-- the clothes line with two cloths -->
  <g class="line"><rect x="1020" y="560" width="10" height="190" rx="4" fill="#8a6239"/><rect x="1340" y="560" width="10" height="190" rx="4" fill="#8a6239"/><path d="M1025 580 Q1185 640 1345 580" stroke="#6b4a33" stroke-width="4" fill="none"/>
    <path d="M1090 598 q60 10 90 0 l-6 110 q-40 8 -78 0 z" fill="#b72424"/><path d="M1220 600 q40 6 66 -2 l-4 96 q-30 6 -58 0 z" fill="#f3e2c7"/></g>
  <!-- the ground: the courtyard sand, a lighter path to the step -->
  <rect x="0" y="740" width="1600" height="160" fill="url(#ground)"/>
  <path d="M520 760 L1060 760 L1240 900 L360 900 Z" fill="#f0dcb4" opacity=".55"/>
  <!-- the terracotta pot on its stone -->
  <g class="pot"><rect x="404" y="720" width="92" height="30" rx="4" fill="#cfc4b4"/><path d="M420 722 C380 690 384 630 420 612 C440 600 480 600 500 612 C536 630 540 690 500 722 Z" fill="#c2673f"/><ellipse cx="460" cy="612" rx="38" ry="10" fill="#8f4428"/><path d="M430 650 C440 640 470 640 490 650" stroke="#fff" stroke-width="5" opacity=".25" fill="none" stroke-linecap="round"/></g>
  <!-- the figure's contact shadow on the step -->
  <ellipse cx="790" cy="766" rx="92" ry="14" fill="#3a2a1a" opacity=".28"/>
  <!-- puddles: rain only -->
  <g class="puddles" fill="#9fb3c8" opacity=".6"><ellipse cx="420" cy="840" rx="110" ry="16"/><ellipse cx="1180" cy="860" rx="150" ry="20"/><ellipse cx="900" cy="880" rx="80" ry="12"/></g>
  <!-- the sun-shadow layer: only the sunny sky shows it (the tree's dapple, the door frame and pot, the posts) -->
  <g class="shadows" fill="#5a3a1a" opacity=".22"><path d="M948 392 L990 392 L990 748 L948 748 Z"/><ellipse cx="520" cy="752" rx="84" ry="12"/><path d="M1030 750 L1120 900 L1140 900 L1034 750 Z"/><path d="M1350 750 L1480 900 L1500 900 L1354 750 Z"/>
    <g opacity=".8"><ellipse cx="1230" cy="800" rx="150" ry="26"/><ellipse cx="1380" cy="840" rx="190" ry="30"/><ellipse cx="1100" cy="860" rx="120" ry="22"/><ellipse cx="1480" cy="790" rx="110" ry="22"/></g></g>
</svg>`;

  // the thought bubble's pictures: the real backgrounds where they exist, the beach drawn ("to draw")
  const BEACH = `<svg viewBox="0 0 400 300" aria-hidden="true"><defs><linearGradient id="bsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6cb3ea"/><stop offset="1" stop-color="#cfe9f8"/></linearGradient></defs><rect width="400" height="300" fill="url(#bsky)"/><circle cx="320" cy="70" r="34" fill="#ffe27a"/><rect y="150" width="400" height="80" fill="#4f9fd6"/><path d="M0 150 Q50 136 100 150 T200 150 T300 150 T400 150 V165 Q350 178 300 165 T200 165 T100 165 T0 165 Z" fill="#8fd0f0"/><path d="M0 220 Q200 200 400 224 V300 H0 Z" fill="#f1dca6"/><g><rect x="150" y="214" width="64" height="40" fill="#e0533f"/><rect x="146" y="206" width="72" height="12" rx="4" fill="#b73f2f"/><path d="M160 206 Q182 180 204 206" stroke="#b73f2f" stroke-width="6" fill="none"/></g><rect x="252" y="196" width="10" height="70" fill="#8a6239"/><path d="M228 196 Q257 160 286 196 Z" fill="#f3e2c7"/><path d="M228 196 Q257 206 286 196 Z" fill="#c9b08a"/></svg>`;
  Door.HOUSE = HOUSE;
  /** The same house small, under a given sky (the book's cover and its glimpse of tomorrow). */
  Door.mini = (weather) => `<div class="mk-mini wx-${weather}" style="position:relative;width:100%;aspect-ratio:16/9;border-radius:var(--njg-radius);overflow:hidden;box-shadow:var(--njg-shadow)">${HOUSE.replace('<rect class="sky"', `<rect class="sky" fill="url(#sky${weather[0].toUpperCase() + weather.slice(1)})"`).replace('preserveAspectRatio="xMidYMax slice"', 'preserveAspectRatio="xMidYMid slice"')}<div class="mk-tint" style="position:absolute;inset:0"></div></div>`;
  Door.THOUGHT = {
    beach: BEACH,
    kitchen: `<img alt="" src="${R}assets/backgrounds/bg-nani-kitchen-e-v1.webp">`,
    clinic: `<img alt="" src="${R}assets/clinic/rooms/bg-clinic-room-e-v1.webp">`,
    book: `<img alt="" src="${R}assets/backgrounds/bg-sitting-room-e-v1.webp">`,
  };

  /** o: {weather: sun|cloud|rain|night, lines: [{k,e,rec}], thought: a key of Door.THOUGHT, place: {src} for the card, note} */
  Door.show = function (o) {
    const step = Math.min(o.lines.length, Math.max(1, Number(M.q.get("s")) || o.lines.length));
    const L = o.lines[step - 1];
    const f = M.frame();
    // the sidebar: Nani's box with the sentence she is saying now, the day's card (the sky, then the place), the dock
    const skyPic = { sun: `<svg viewBox="0 0 48 48"><rect width="48" height="48" fill="#a9d8f5"/><circle cx="24" cy="24" r="11" fill="#ffe27a"/></svg>`, cloud: `<svg viewBox="0 0 48 48"><rect width="48" height="48" fill="#c4ccd3"/><ellipse cx="22" cy="28" rx="15" ry="8" fill="#fff"/><ellipse cx="27" cy="22" rx="9" ry="8" fill="#fff"/></svg>`, rain: `<svg viewBox="0 0 48 48"><rect width="48" height="48" fill="#8291a3"/><ellipse cx="24" cy="18" rx="14" ry="7" fill="#5f6b7a"/><ellipse cx="28" cy="13" rx="8" ry="7" fill="#5f6b7a"/><g stroke="#fff" stroke-width="2.5" stroke-linecap="round"><path d="M16 30l-3 8M24 30l-3 8M32 30l-3 8"/></g></svg>`, night: `<svg viewBox="0 0 48 48"><rect width="48" height="48" fill="#1f2a5e"/><circle cx="26" cy="22" r="9" fill="#fff6d6"/><circle cx="10" cy="10" r="1.6" fill="#fff"/><circle cx="40" cy="14" r="1.4" fill="#fff"/><circle cx="36" cy="36" r="1.6" fill="#fff"/><circle cx="12" cy="34" r="1.2" fill="#fff"/></svg>` }[o.weather];
    const card = M.card({ pics: [{ svg: skyPic, cls: "full" }, "→", { svg: Door.THOUGHT[o.thought], cls: "full" }] });
    const guide = M.side(f.side, { card });
    guide.set(M.lineHtml(L), { rec: !!L.rec });

    // the play area: the house, the weather layers, Nani, her bubbles, the answer
    const stage = document.createElement("div");
    stage.className = `mk-stage wx-${o.weather}`;
    stage.innerHTML = `${HOUSE}<div class="mk-stars"></div><div class="mk-tint"></div><div class="mk-lamp-glow"></div><div class="mk-rain"><i></i><i></i></div>
      <div class="mk-nani"><img alt="Nani" src="${R}assets/cook/characters/nani-stand-v3-front.webp"></div>
      <div class="mk-thought" style="left: 16%; top: 8%; width: 22%;"><div class="cloud">${Door.THOUGHT[o.thought]}</div><i class="dot a"></i><i class="dot b"></i></div>
      <div class="mk-bubble left" style="left: 60%; top: 10%;"><i class="tail"></i><span class="k ${L.rec ? "ph" : ""}">${M.lineHtml(L)}</span><span class="e">${M.esc(L.e)}</span><div class="mk-dots">${o.lines.map((_, i) => `<i class="${i + 1 === step ? "on" : i + 1 < step ? "done" : ""}"></i>`).join("")}</div></div>
      <div class="mk-answer"></div>`;
    f.play.appendChild(stage);
    // the stars: the night sky's own, drawn in code
    const stars = stage.querySelector(".mk-stars");
    let seed = 7;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < 90; i++) {
      const s = document.createElement("i");
      s.style.left = `${rnd() * 100}%`;
      s.style.top = `${rnd() * 42}%`;
      s.style.animationDelay = `${rnd() * 2}s`;
      stars.appendChild(s);
    }
    // the sky gradient per weather (CSS can't reach a <rect>'s url() fill by class in every browser, so set it here)
    stage.querySelector(".sky").setAttribute("fill", `url(#sky${o.weather[0].toUpperCase() + o.weather.slice(1)})`);
    // the child's answer: the shared pills; Ha! is the focal thing (it pulses), Na shakes when tapped (UX 14)
    if (step === o.lines.length) {
      const row = global.NjgButtons.pills(stage.querySelector(".mk-answer"), [{ id: "ha", label: "Ha!" }, { id: "na", label: "Na" }], (id, btn) => {
        if (id === "na") { btn.classList.remove("shake"); void btn.offsetWidth; btn.classList.add("shake"); }
      });
      row.pill("ha").classList.add("njg-pulse");
    }
    M.note(f.play, o.note || "");
  };
})(window);
