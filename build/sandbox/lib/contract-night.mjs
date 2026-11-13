// s19-night-shared (13 Nov overnight, Zafar's decision 13: every fix closes with its check): four shared rules, each read from the
// screen and the sound log. Registered in lib/contract.mjs (NIGHT_CHECKS, checkNight) and probed by NIGHT_HOOK (appended to
// CONTRACT_HOOK in lib/contract-hook.mjs).
//   contract-124 knob-sound   every knob turned on from off answers the tap: sfx/knob and sfx/flame (CHAI-113, Zafar 13 Nov, decision 14)
//   contract-125 one-flash    one dish card on screen at a time (SH-274)
//   contract-126 exclaim-arrow Nani's box has no drop-down while it shows "Shabash!" or "Bas!" (SH-278)
//   contract-127 end-heads    the end screen's card never leaves a head half behind its top edge (SH-272)
// What it reads: the game's want samples (contract-hook "want": the move it waits for) and the sound log's plays (lib/sound.mjs:
// "sfx/<name>" for every Sfx.play that played); the s19night samples below ({flash: n cards on screen, arrow, line, card, heads}).
export const KNOB_BEFORE_MS = 600;  // the knob's click may start this long before the game's want moves on (its tap lands first)
export const KNOB_AFTER_MS = 1500;  // ... and the flame (180 ms after the click at speed 1) by this long after
export const NIGHT_HOLD_MS = 300;   // a sample held this long is on screen
export const HEAD_EDGE_PX = 4;      // a head is across the card's top edge when it reaches more than this past it on both sides

const isCookFlow = (flow) => /^(cook:|lab:cook\/)/.test(flow || "");
const ev = (tl, k) => tl.filter((e) => e.type === "c" && e.k === k);
function held(list, i, tEnd) { const n = list[i + 1]; return (n ? n.t : tEnd) - list[i].t; }

export const NIGHT_CHECKS = {
  "contract-124": { item: "knob-sound", title: "a knob turned on always answers: its click and the flame", how: `Cook flows. Each knob the child turns on from off (the game's want moving on from a "knob-on-..." tap) must be heard: a play of sfx/knob and of sfx/flame in the sound log from ${KNOB_BEFORE_MS} ms before the want moves on to ${KNOB_AFTER_MS} ms after, even while a family line is sounding (they play under it, quieter: js/shared/sfx.js {under: true}). Either missing is a break, once per page (CHAI-113, Zafar 13 Nov, decision 14: "the knob's click and the flame play under the voice, quieter").` },
  "contract-125": { item: "one-flash", title: "one dish card on screen at a time", how: `Cook flows. Every s19night sample: two or more of the dish's flashing cards (.wc14-flash, js/shared/word-card.js WordCard.flash) on screen at once, held ${NIGHT_HOLD_MS} ms, is a break, once per page (SH-274, the S19 gate's eye judge, 12 Nov: "a second, full-strength 'ba maani' card sits in the top right corner ... chai shows one pop-out").` },
  "contract-126": { item: "exclaim-arrow", title: "no drop-down on Nani's \"Shabash!\" or \"Bas!\"", how: `Cook flows. Every s19night sample: Nani's box (#guide) showing an exclamation alone ("Shabash!", "Bas!") with its drop-down (.ng-arrow) on screen, held ${NIGHT_HOLD_MS} ms, is a break, once per page (SH-278, the S19 gate's eye judge, 12 Nov: "Nani's box keeps its drop-down on 'Shabash!' where chai's has none").` },
  "contract-127": { item: "end-heads", title: "the end screen's card covers the people cleanly", how: `Cook flows. Every s19night sample with the end screen's card on screen (.njg-results .rs-card, its laid-out box: no rise in it): a person's head on the play area (the page's NjgFaceBoxes) beside none of its sides, reaching above the card's top edge and more than ${HEAD_EDGE_PX} px below it, held ${NIGHT_HOLD_MS} ms, is a break, once per page (SH-272, the S19 gate's eye judge, 12 Nov: "the top of Nani's hijab pokes out above it ... chai's panel covers both people cleanly").` },
};

// 124: the knob's click and the flame on every knob turned on from off
function check124(r, tl, add) {
  if (!isCookFlow(r.flow)) return;
  const wants = ev(tl, "want");
  const plays = tl.filter((e) => e.type === "play" && /^sfx\/(knob|flame)$/.test(e.url || ""));
  const tEnd = tl.length ? tl[tl.length - 1].t : 0;
  for (let i = 0; i < wants.length; i++) {
    const w = wants[i];
    if (!/^knob-on-/.test(String(w.key || ""))) continue;
    const nx = wants.slice(i + 1).find((x) => x.key !== w.key);
    if (!nx || nx.t + KNOB_AFTER_MS > tEnd) continue;
    // (the same want sampled again is one turn: skip to the change)
    if (wants[i + 1] && wants[i + 1].key === w.key) continue;
    const near = plays.filter((p) => p.t >= nx.t - KNOB_BEFORE_MS && p.t <= nx.t + KNOB_AFTER_MS).map((p) => p.url);
    const miss = ["sfx/knob", "sfx/flame"].filter((u) => !near.includes(u));
    if (!miss.length) continue;
    add("contract-124", nx.t, `the knob (${w.key}) turned on and ${miss.join(" and ")} never played: the child's tap is silent (they play under a voice, quieter)`);
    return;
  }
}

function checkSamples(r, tl, add) {
  if (!isCookFlow(r.flow)) return;
  const s = ev(tl, "s19night");
  const tEnd = tl.length ? tl[tl.length - 1].t : 0;
  const once = new Set();
  s.forEach((x, i) => {
    const h = held(s, i, tEnd);
    if (h < NIGHT_HOLD_MS) return;
    if (!once.has(125) && x.flash >= 2) {
      once.add(125);
      add("contract-125", x.t, `${x.flash} dish cards on screen at once for ${Math.round(h)} ms: only one copy is ever on screen`);
    }
    if (!once.has(126) && x.arrow && /^\s*(shabash|bas)\s*!?\s*$/i.test(x.line || "")) {
      once.add(126);
      add("contract-126", x.t, `Nani's box shows "${(x.line || "").trim()}" with its drop-down (.ng-arrow) for ${Math.round(h)} ms: no drop-down on an exclamation`);
    }
    if (!once.has(127) && x.card) {
      const [l, t, rr] = x.card;
      const poke = (x.heads || []).find((b) => b[2] > l && b[0] < rr && b[1] < t - HEAD_EDGE_PX && b[3] > t + HEAD_EDGE_PX);
      if (poke) {
        once.add(127);
        add("contract-127", x.t, `a head [${poke.map(Math.round).join(",")}] pokes above the end screen's card (its top at ${Math.round(t)}) for ${Math.round(h)} ms: the card covers the people cleanly`);
      }
    }
  });
}

export function checkNight(r, tl, v, add) {
  check124(r, tl, add);
  checkSamples(r, tl, add);
}

// ---- the probe: a function, not a string: the page gets its source ----
//   k: "s19night" {flash: dish cards shown, arrow: Nani's drop-down shown, line: her box's line, card: the end card's laid-out box | null,
//   heads: [[l, t, r, b]] (only while the card is up)}
function nighthook() {
  if (window.__njgNightHook) return;
  window.__njgNightHook = true;
  const emit = (e) => {
    try {
      e.type = "c"; e.t = Date.now(); e.page = location.pathname.replace(/^\//, "");
      if (window.__njgLog) window.__njgLog(e); else (window.__njgPending = window.__njgPending || []).push(e);
    } catch (x) { /* a probe only */ }
  };
  const shown = (el) => {
    if (!el || !el.isConnected) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    for (let x = el; x && x.nodeType === 1; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.05) return false; }
    return true;
  };
  let last = "";
  setInterval(() => {
    try {
      const flash = [...document.querySelectorAll(".wc14-flash")].filter(shown).length;
      const g = document.querySelector("#guide");
      const a = g && g.querySelector(".ng-arrow");
      const arrow = !!(a && !a.hidden && shown(a));
      const ln = g && g.querySelector(".ng-line");
      const line = ln && shown(ln) ? (ln.textContent || "").trim().slice(0, 60) : "";
      const c = [...document.querySelectorAll(".njg-results .rs-card")].find(shown);
      // (its laid-out box, offsetTop in the fixed overlay: the rise animation's transform is not where it rests)
      const card = c ? [c.offsetLeft, c.offsetTop, c.offsetLeft + c.offsetWidth, c.offsetTop + c.offsetHeight] : null;
      let heads = [];
      if (card && typeof window.NjgFaceBoxes === "function") {
        try { heads = (window.NjgFaceBoxes() || []).map((b) => [b.left, b.top, b.right, b.bottom].map(Math.round)); } catch (e) { heads = []; }
      }
      const s = { k: "s19night", flash, arrow, line, card, heads };
      const j = JSON.stringify(s);
      if (j === last) return;
      last = j;
      emit(s);
    } catch (e) { /* a probe only */ }
  }, 100);
}
export const NIGHT_HOOK = `(${nighthook.toString()})()`;
