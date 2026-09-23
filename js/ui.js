/* UI layer: plain HTML/CSS beside/over the Phaser canvas - the recipe
 * sidebar, speech bubble, narration strip, go button, notebook/quilt
 * overlays, drawer. Scene code (js/game.js) calls into this; this file
 * never touches Phaser directly except to pass a scene through to
 * NjgAudio.speak(). */
(function (global) {
  "use strict";

  const QUILT_KEY = "njg_quilt_v1";
  const WORLD_W = 1600, WORLD_H = 900;

  const el = (id) => document.getElementById(id);
  const qs = (sel, root) => (root || document).querySelector(sel);

  function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
  function itemImgSrc(word) { return `assets/${word.image}`; }

  /** Fills `target` with the Kutchi line (+ draft mark) and a tap-to-toggle
   * "English" link; or, when there's no Kutchi yet, the English honestly
   * (text only - English is never spoken in-game). */
  function fillLine(target, kutchiObj, englishFallback) {
    target.innerHTML = "";
    if (kutchiObj && kutchiObj.text) {
      const main = document.createElement("span");
      main.className = "line-kutchi";
      const kText = kutchiObj.text + (kutchiObj.is_draft ? "\u00a0*" : ""); // nbsp: the draft mark never wraps alone
      main.textContent = kText;
      target.appendChild(main);
      const toggle = document.createElement("span");
      toggle.className = "en-toggle";
      toggle.textContent = "English";
      let showing = false;
      toggle.onclick = (e) => {
        e.stopPropagation();
        showing = !showing;
        main.textContent = showing ? (englishFallback || "") : kText;
        toggle.textContent = showing ? "Kutchi" : "English";
      };
      target.appendChild(toggle);
    } else if (englishFallback) {
      const main = document.createElement("span");
      main.textContent = englishFallback;
      main.className = "eng-shown";
      target.appendChild(main);
    }
  }

  // ---------------- speech bubble (anchored beside the speaker) ----------------
  let bubbleAnchor = null;

  /** Positions the bubble from its world-space anchor ({right, top, maxW}
   * in background pixels) using the canvas's actual on-screen rect. */
  function repositionBubble() {
    const b = el("speech-bubble");
    const canvas = qs("#game canvas");
    if (!bubbleAnchor || !canvas) return;
    const wrap = el("game-wrap").getBoundingClientRect();
    const r = canvas.getBoundingClientRect();
    const s = r.width / WORLD_W;
    b.style.right = `${wrap.right - (r.left + bubbleAnchor.right * s)}px`;
    b.style.top = `${r.top - wrap.top + bubbleAnchor.top * s}px`;
    b.style.maxWidth = `${bubbleAnchor.maxW * s}px`;
    b.style.fontSize = `${Math.max(11, Math.min(24, 30 * s))}px`;
  }

  function showBubble(anchor, gist, kutchiObj, englishFallback) {
    bubbleAnchor = anchor;
    el("bubble-gist").textContent = gist || "";
    el("bubble-gist").style.display = gist ? "block" : "none";
    fillLine(el("bubble-line"), kutchiObj, englishFallback);
    el("speech-bubble").classList.add("show");
    repositionBubble();
  }

  function hideBubble() {
    el("speech-bubble").classList.remove("show");
  }

  // ---------------- narration strip (top centre; scene-setting, "You say:") ----------------
  function showNarration(gist, kutchiObj, englishText) {
    el("narration-gist").textContent = gist || "";
    el("narration-gist").style.display = gist ? "block" : "none";
    fillLine(el("narration-line"), kutchiObj, englishText);
    el("narration").classList.add("show");
  }
  function hideNarration() { el("narration").classList.remove("show"); }

  /** A plain scene-setting line in English, e.g. "Nani is making...". */
  async function narrate(text, pauseMs) {
    showNarration("", null, text);
    await sleep(pauseMs || 1400);
  }

  /** A Kutchi line said by the player (e.g. greeting the shopkeeper). */
  async function narrateLine(scene, kind, id, kutchiObj, englishFallback, gist) {
    showNarration(gist, kutchiObj, englishFallback);
    await NjgAudio.speak(scene, kind, id, kutchiObj && kutchiObj.text);
  }

  /** A character's line: bubble beside them, then the recording (or the
   * speech-synthesis fallback), resolving when playback finishes. */
  async function speakLine(scene, anchor, kind, id, kutchiObj, englishFallback, gist) {
    hideNarration();
    showBubble(anchor, gist, kutchiObj, englishFallback);
    await NjgAudio.speak(scene, kind, id, kutchiObj && kutchiObj.text);
  }

  /** A line with NO sourced Kutchi yet: text only, never spoken. In a
   * bubble when a speaker anchor is given, else in the narration strip. */
  async function textOnly(gist, englishText, pauseMs, anchor) {
    if (anchor) { hideNarration(); showBubble(anchor, gist, null, englishText); }
    else showNarration(gist, null, englishText);
    await sleep(pauseMs || 1400);
  }

  // ---------------- quilt persistence ----------------
  // Each profile keeps its own quilt (js/shell.js sets global.NjgProfile
  // once a profile is chosen) - a shared blob would mean every profile on
  // the device saw the same patches, defeating "each keeps their own
  // progress". Falls back to a flat localStorage key only if no shell/
  // profile system is wired in (e.g. a page that loads ui.js standalone).
  function loadQuilt() {
    if (global.NjgProfile && global.NjgProfile.get()) return global.NjgProfile.get().patches || [];
    try { return JSON.parse(localStorage.getItem(QUILT_KEY) || "[]"); }
    catch (e) { return []; }
  }
  function saveQuilt(patches) {
    if (global.NjgProfile && global.NjgProfile.get()) {
      global.NjgProfile.get().patches = patches;
      global.NjgProfile.save();
      return;
    }
    try { localStorage.setItem(QUILT_KEY, JSON.stringify(patches)); } catch (e) {}
  }
  function addPatch(patch) {
    const all = loadQuilt();
    all.push(patch);
    saveQuilt(all);
    return all;
  }
  function patchGradient(colors) {
    return `linear-gradient(135deg, ${colors.join(", ")})`;
  }

  // ---------------- recipe list (Kutchi + quantity + play button, no picture) ----------------
  function resetShoppingList() {
    el("shopping-list").innerHTML = "";
    setListMode("buy");
  }

  /** "buy" in the kitchen/bazaar, "bowl" once home: the dots then count
   * what's gone into Nani's bowl rather than what's been bought. */
  function setListMode(mode) {
    el("sidebar").dataset.mode = mode;
    el("list-hint").textContent = mode === "bowl" ? "Into the bowl" : "To buy";
    document.querySelectorAll(".list-item").forEach((r) => r.classList.remove("done"));
  }

  function addToShoppingList(scene, wordId, qty, noCount) {
    const word = NjgData.word(wordId);
    const list = el("shopping-list");
    const row = document.createElement("div");
    row.className = "list-item";
    row.dataset.wordId = wordId;

    const kText = word.kutchi ? word.kutchi.text : word.english; // never invented; falls back honestly
    const draft = word.kutchi && word.kutchi.is_draft ? " *" : "";

    const kutchi = document.createElement("div");
    kutchi.className = "li-kutchi";
    const qtyEl = document.createElement("span");
    qtyEl.className = "li-qty";
    qtyEl.textContent = noCount ? "" : `${qty} × `;
    const name = document.createElement("span");
    name.textContent = kText;
    const draftEl = document.createElement("span");
    draftEl.className = "draft-mark";
    draftEl.textContent = draft;
    kutchi.append(qtyEl, name, draftEl);

    const pips = document.createElement("div");
    pips.className = "li-pips";
    if (!noCount) {
      for (let i = 0; i < qty; i++) {
        const p = document.createElement("span");
        p.className = "pip";
        pips.appendChild(p);
      }
    }

    const playBtn = document.createElement("button");
    playBtn.className = "li-play";
    playBtn.textContent = "▶";
    playBtn.setAttribute("aria-label", "Play");
    playBtn.onclick = (e) => {
      e.stopPropagation();
      NjgAudio.speak(scene.scene.manager.getScenes(true)[0] || scene, "word", wordId, kText);
    };

    const englishToggle = document.createElement("div");
    englishToggle.className = "li-english";
    englishToggle.textContent = "English";
    let showingEnglish = false;
    englishToggle.onclick = (e) => {
      e.stopPropagation();
      showingEnglish = !showingEnglish;
      name.textContent = showingEnglish ? word.english : kText;
      draftEl.textContent = showingEnglish ? "" : draft;
      englishToggle.textContent = showingEnglish ? "Kutchi" : "English";
    };

    const textCol = document.createElement("div");
    textCol.className = "li-text";
    textCol.append(kutchi, pips, englishToggle);

    row.append(textCol, playBtn);
    list.appendChild(row);

    // narrow layouts: never open the drawer over the scene mid-task (it
    // would cover the next thing to tap) - pulse its tab instead
    nudgeDrawerTab();
  }

  function nudgeDrawerTab() {
    const tab = el("drawer-tab");
    tab.classList.remove("nudge");
    void tab.offsetWidth; // restart the animation
    tab.classList.add("nudge");
  }

  function setListProgress(wordId, n, qty, noCount) {
    const row = qs(`.list-item[data-word-id="${wordId}"]`);
    if (!row) return;
    row.querySelectorAll(".pip").forEach((p, i) => p.classList.toggle("on", i < n));
    if (noCount) row.classList.toggle("done", n >= qty);
  }

  function markListItemDone(wordId) {
    const row = qs(`.list-item[data-word-id="${wordId}"]`);
    if (row) row.classList.add("done");
  }

  // ---------------- go button ----------------
  function setGoButton(label, disabled, onClick) {
    const btn = el("go-btn");
    btn.textContent = label;
    btn.disabled = !!disabled;
    btn.onclick = onClick || null;
    if (!disabled) openDrawer(); // narrow layouts: surface the button
  }

  // ---------------- drawer (portrait / narrow layouts only) ----------------
  const isDrawerMode = () => getComputedStyle(el("drawer-tab")).display !== "none";
  function openDrawer() {
    if (!isDrawerMode()) return;
    el("sidebar").classList.add("open");
    el("sidebar-scrim").classList.add("open");
  }
  function closeDrawer() {
    el("sidebar").classList.remove("open");
    el("sidebar-scrim").classList.remove("open");
  }
  el("drawer-tab").addEventListener("click", openDrawer);
  el("drawer-close").addEventListener("click", closeDrawer);
  el("sidebar-scrim").addEventListener("click", closeDrawer);

  /** Every scene change: the drawer must never sit over a fresh scene. */
  function onSceneStart() {
    closeDrawer();
    hideBubble();
    hideNarration();
  }

  window.addEventListener("resize", repositionBubble);

  // ---------------- overlays ----------------
  function showPatchOverlay(patch, onContinue) {
    el("patch-preview").style.background = patchGradient(patch.colors);
    el("patch-caption").textContent = `The ${patch.motif.replace(/-/g, " ")} patch joins the quilt.`;
    el("overlay-patch").style.display = "flex";
    el("patch-continue").onclick = () => {
      el("overlay-patch").style.display = "none";
      if (onContinue) onContinue();
    };
  }

  function renderQuiltOverlay() {
    const grid = el("quilt-grid");
    grid.innerHTML = "";
    const patches = loadQuilt();
    const totalCells = Math.max(8, patches.length);
    for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement("div");
      const p = patches[i];
      if (p) {
        cell.className = "quilt-patch";
        cell.style.background = patchGradient(p.colors);
      } else {
        cell.className = "quilt-patch empty";
      }
      grid.appendChild(cell);
    }
  }

  function renderNotebookOverlay() {
    const list = el("notebook-list");
    list.innerHTML = "";
    const seen = Object.keys(NjgData.wordsById)
      .map((id) => ({ word: NjgData.word(id), prog: Progress.get(id) }))
      .filter((x) => x.prog.timesMet > 0)
      .sort((a, b) => a.prog.stage - b.prog.stage);
    if (!seen.length) {
      list.innerHTML = '<div class="notebook-row">No words met yet - play the errand first.</div>';
      return;
    }
    seen.forEach((x) => {
      const row = document.createElement("div");
      row.className = "notebook-row";
      row.textContent = `${x.word.english} — ${x.word.kutchi ? x.word.kutchi.text : "?"} (stage ${x.prog.stage})`;
      list.appendChild(row);
    });
  }

  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => (el(btn.dataset.close).style.display = "none"));
  });
  el("tab-quilt").addEventListener("click", () => {
    renderQuiltOverlay();
    el("overlay-quilt").style.display = "flex";
  });
  el("tab-notebook").addEventListener("click", () => {
    renderNotebookOverlay();
    el("overlay-notebook").style.display = "flex";
  });

  const NjgUI = {
    el, qs, sleep, itemImgSrc,
    speakLine, textOnly, narrate, narrateLine, hideNarration,
    showBubble, hideBubble, repositionBubble,
    loadQuilt, saveQuilt, addPatch, patchGradient,
    resetShoppingList, setListMode, addToShoppingList, setListProgress, markListItemDone,
    setGoButton,
    openDrawer, closeDrawer, onSceneStart,
    showPatchOverlay, renderQuiltOverlay, renderNotebookOverlay,
  };

  global.NjgUI = NjgUI;
})(window);
