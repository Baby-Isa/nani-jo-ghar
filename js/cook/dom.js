/*
 * Cook's screen (C4, decision 45): the page grid that was cook.html's body, made inside the element the host gives
 * Cook (js/cook/mount.js) and removed at unmount. The ids, classes and comments are cook.html's, unchanged, so
 * css/cook.css and every Cook file find what they always found. Every asset URL is stamped (B7).
 */
import { Cook } from "./ns.js";

const v = (u) => (Cook.v ? Cook.v(u) : u);

/** Cook's screen as HTML: the frame (#app: the play area and the sidebar), the overlay and the first-time coach. */
export const screenHTML = () => `
<div id="app" class="njg-frame">
  <main id="stage" class="njg-play">
    <div id="game"></div>

    <!-- a speech bubble beside a character (service view) -->
    <div id="bubble" class="hidden" role="status" aria-live="polite"><div class="say-slot"></div></div>

    <div id="gist" class="hidden"></div>
    <div id="choices" class="hidden"></div>
    <!-- Wave 6b: the picture tally, top right: what you've done so far (never the target); never takes a tap -->
    <div id="count-badge" class="hidden" aria-live="polite"></div>
    <!-- Wave 6b: at a station Nani is a voice; a line that isn't on the card shows here for a moment (never takes a tap) -->
    <div id="voice" class="hidden" role="status" aria-live="polite"></div>
    <!-- ✓ Done and → Next (between two jobs, "to the grill"): the shared kit's buttons (js/shared/buttons.js),
         made by Cook's UI.init as #done-btn and #go-btn, bottom right under the thumb -->
    <div id="toast" class="hidden"></div>

    <!-- the intro order card: when someone orders it comes up big in the middle (nothing is live yet), then flies into the sidebar -->
    <div id="intro" class="hidden" role="dialog" aria-label="The order">
      <div class="ic-card">
        <!-- 28 Sept: face | the overall request | speaker; then what's asked for, one row each. No name, no English instructions -->
        <!-- Sidebar v2 (28 Sept evening): the face is the replay button (a small speaker badge on its corner); the summary of several (skewers) under the headline -->
        <div class="ic-head"><button class="ic-say face-say" type="button" aria-label="Hear it again"><img class="ic-face" alt=""><span class="say-badge" aria-hidden="true"></span></button><div class="ic-head-text"><div class="ic-dish"></div><div class="m-sum"></div></div></div>
        <div class="ic-order"></div>
        <div class="ic-go" aria-label="Tap to start"></div>
      </div>
    </div>

  </main>

  <aside id="side" class="njg-side">
    <!-- Wave 6: the sidebar is on the LEFT (people read left to right); the big action buttons stay on the right of the picture.
         0. 28 Sept: Nani's guide box (js/shared/guide.js): her face and what to do now; tap it to mute or unmute her
            (remembered in the save); the light bulb (English for a few seconds: 5/3/2/1 s by level; it costs a hint) and her speaker -->
    <div id="guide"></div>
    <!-- 1. the order card, always on top: compact; ↻ opens it big again (the intro card). It becomes the completion card when the order is served -->
    <div id="mission" class="card hidden">
      <div class="m-head">
        <!-- Sidebar v2 (28 Sept evening): the face is the replay button: it reads the card in order, each part lighting up as it's said -->
        <button class="m-ring face-say" type="button" aria-label="Hear it again">
          <svg viewBox="0 0 48 48" aria-hidden="true"><circle class="pr-bg" cx="24" cy="24" r="22"/><circle class="pr-fg" cx="24" cy="24" r="22" pathLength="100"/></svg>
          <img class="m-face" alt="">
          <span class="say-badge" aria-hidden="true"></span>
        </button>
        <!-- the dish ("Muke chai khape."), the summary of several (skewers: "hakri lakri mixed"); who it is shows in the face (no stars: R4) -->
        <div class="m-who"><div class="m-dish"></div><div class="m-sum"></div></div>
      </div>
      <div class="m-order"></div>
      <div class="m-stamp" aria-hidden="true"></div>
    </div>
    <!-- 2. Nani's current line: one short line; at the stations she talks from here, so her words never cover a thing to tap -->
    <div id="live">
      <div id="nani-card" class="card hidden" role="status" aria-live="polite">
        <button class="nc-say face-say" type="button" aria-label="Hear it again"><img class="nc-face" src="${v("assets/cook/characters/nani-badge.webp")}" alt="Nani"><span class="say-badge" aria-hidden="true"></span></button>
        <div class="say-slot"></div>
      </div>
    </div>
    <!-- 3. the rail: "?" (what do I do here?), menu, recipe book -->
    <div class="side-rail">
      <button id="btn-help" class="rail-btn" title="What do I do here?" aria-label="What do I do here?" aria-expanded="false" data-ob-pass>?</button>
      <button id="btn-home" class="rail-btn" title="Menu" aria-label="Menu">&#8962;</button>
      <button id="btn-book" class="rail-btn" title="Nani's recipe book" aria-label="Nani's recipe book">&#128214;</button>
    </div>
  </aside>

  <!-- the "?" pops out the goal for this station (never shown on its own) -->
  <div id="help-pop" class="hidden" role="dialog" aria-label="What do I do here?" data-ob-pass><div class="hp-text"></div></div>

  <!-- Nani: "pass me…". Her card comes forward in the sidebar column, never over the play area -->
  <div id="passme" class="hidden" role="dialog" aria-label="Nani needs something">
    <div class="pm-nani"><button class="pm-face face-say" type="button" aria-label="Hear it again"><img src="${v("assets/cook/characters/nani-badge.webp")}" alt="Nani"><span class="say-badge" aria-hidden="true"></span></button><div class="pm-say"></div></div>
    <div class="pm-tray"></div>
  </div>
</div>

<div id="overlay" class="hidden"><div id="panel"></div></div>

<!-- Wave 6: the first time at each station, everything dims but one thing and a ghost finger shows the move (js/cook/coach.js); it never takes a tap -->
<div id="coach" class="hidden" aria-hidden="true"><div class="co-hole"></div><div class="co-finger"></div></div>
`;

/** Make Cook's screen inside el; returns the nodes made (unmount removes them). */
export function makeScreen(el) {
  const doc = el.ownerDocument;
  const tpl = doc.createElement("template");
  tpl.innerHTML = screenHTML();
  const nodes = [...tpl.content.childNodes].filter((n) => n.nodeType === 1);
  nodes.forEach((n) => el.appendChild(n));
  return nodes;
}
