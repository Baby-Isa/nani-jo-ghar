/* UI layer: plain HTML/CSS beside/over the Phaser canvas - the recipe
 * sidebar, caption band, go button, notebook/quilt overlays, drawer.
 * Scene code (js/game.js) calls into this; this file never touches
 * Phaser directly except to pass a scene through to NjgAudio.speak(). */
(function (global) {
  "use strict";

  const QUILT_KEY = "njg_quilt_v1";

  const el = (id) => document.getElementById(id);
  const qs = (sel, root) => (root || document).querySelector(sel);

  function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
  function itemImgSrc(word) { return `assets/${word.image}`; }

  // ---------------- caption (shared talk/text band, English one tap away) ----------------
  function setCaption(gistText, kutchiObj, englishFallback) {
    el("caption-gist").textContent = gistText || "";
    const kEl = el("caption-kutchi");
    kEl.innerHTML = "";
    if (kutchiObj && kutchiObj.text) {
      const main = document.createElement("span");
      main.textContent = kutchiObj.text + (kutchiObj.is_draft ? " *" : "");
      kEl.appendChild(main);
      const toggle = document.createElement("span");
      toggle.className = "en-toggle";
      toggle.textContent = "English";
      toggle.onclick = () => {
        main.textContent = main.dataset.showingEnglish === "1"
          ? kutchiObj.text + (kutchiObj.is_draft ? " *" : "")
          : (englishFallback || "");
        main.dataset.showingEnglish = main.dataset.showingEnglish === "1" ? "0" : "1";
      };
      kEl.appendChild(toggle);
    } else if (englishFallback) {
      // No Kutchi drafted for this line - shown in English, honestly.
      // Never spoken (English is text-only, never spoken in-game).
      const main = document.createElement("span");
      main.textContent = englishFallback;
      main.className = "eng-shown";
      kEl.appendChild(main);
    }
  }

  /** Sets the caption then plays the line through the given Phaser scene's
   * sound manager, resolving once playback actually finishes. */
  async function speakLine(scene, kind, id, kutchiObj, englishFallback, gist) {
    setCaption(gist, kutchiObj, englishFallback);
    await NjgAudio.speak(scene, kind, id, kutchiObj && kutchiObj.text);
  }

  /** A line with NO sourced Kutchi yet: text only, never spoken. */
  async function textOnly(gist, englishText, pauseMs) {
    setCaption(gist, null, englishText);
    await sleep(pauseMs || 1400);
  }

  // ---------------- quilt persistence ----------------
  function loadQuilt() {
    try { return JSON.parse(localStorage.getItem(QUILT_KEY) || "[]"); }
    catch (e) { return []; }
  }
  function saveQuilt(patches) {
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

  // ---------------- shopping list (Kutchi text + play button, no picture) ----------------
  function resetShoppingList() {
    el("shopping-list").innerHTML = "";
  }

  function addToShoppingList(scene, wordId) {
    const word = NjgData.word(wordId);
    const list = el("shopping-list");
    const row = document.createElement("div");
    row.className = "list-item";
    row.dataset.wordId = wordId;

    const kutchi = document.createElement("div");
    kutchi.className = "li-kutchi";
    const kText = word.kutchi ? word.kutchi.text : word.english; // never invented; falls back honestly
    kutchi.innerHTML = word.kutchi
      ? `${kText}${word.kutchi.is_draft ? '<span class="draft-mark"> *</span>' : ""}`
      : kText;

    const playBtn = document.createElement("button");
    playBtn.className = "li-play";
    playBtn.textContent = "▶";
    playBtn.setAttribute("aria-label", "Play");
    playBtn.onclick = (e) => {
      e.stopPropagation();
      NjgAudio.speak(scene, "word", wordId, kText);
    };

    const englishToggle = document.createElement("div");
    englishToggle.className = "li-english";
    englishToggle.textContent = "English";
    let showingEnglish = false;
    englishToggle.onclick = (e) => {
      e.stopPropagation();
      showingEnglish = !showingEnglish;
      kutchi.textContent = showingEnglish ? word.english : kText + (word.kutchi && word.kutchi.is_draft ? " *" : "");
    };

    const textCol = document.createElement("div");
    textCol.style.flex = "1";
    textCol.style.minWidth = "0";
    textCol.appendChild(kutchi);
    textCol.appendChild(englishToggle);

    row.appendChild(textCol);
    row.appendChild(playBtn);
    list.appendChild(row);

    // narrow layouts: the drawer auto-opens when a word is added, so the
    // player sees the list grow without hunting for the tab handle
    openDrawer();
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
    if (!disabled) openDrawer(); // narrow layouts: surface the button, not just the list
  }

  // ---------------- basket ----------------
  function updateBasketCount(n) {
    el("basket-count").textContent = String(n);
  }

  // ---------------- drawer (narrow layouts) ----------------
  function openDrawer() {
    el("sidebar").classList.add("open");
    el("sidebar-scrim").classList.add("open");
  }
  function closeDrawer() {
    el("sidebar").classList.remove("open");
    el("sidebar-scrim").classList.remove("open");
  }
  el("drawer-tab").addEventListener("click", openDrawer);
  el("sidebar-scrim").addEventListener("click", closeDrawer);

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
    setCaption, speakLine, textOnly,
    loadQuilt, saveQuilt, addPatch, patchGradient,
    resetShoppingList, addToShoppingList, markListItemDone,
    setGoButton, updateBasketCount,
    openDrawer, closeDrawer,
    showPatchOverlay, renderQuiltOverlay, renderNotebookOverlay,
  };

  global.NjgUI = NjgUI;
})(window);
