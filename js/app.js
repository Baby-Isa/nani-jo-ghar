/* Nani jo Ghar - fruit-bowl test errand.
 * Kitchen (ask + pre-exposure) -> bazaar (buy, Kutchi-only list) -> kitchen
 * (put purchases in the bowl) -> quilt patch. Rebuilt 23 Sep 2026 per the
 * Roadmap doc's "Lessons from the first build" after the first version
 * failed on a real phone - see that doc for the full list of fixes this
 * version makes. Only one errand in scope this pass (bowl-01). */
(function () {
  "use strict";

  const QUILT_KEY = "njg_quilt_v1";
  const HESITATION_MS = 5000;

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
      // No Kutchi drafted for this line - shown in English, honestly, per
      // the "never author Kutchi" rule. Never spoken (design principle:
      // English is text-only, never spoken in-game), so no audio call
      // accompanies this branch - see textOnly() below.
      const main = document.createElement("span");
      main.textContent = englishFallback;
      main.className = "eng-shown";
      kEl.appendChild(main);
    }
  }

  function setCharacter(elId, name, state) {
    el(elId).style.backgroundImage = `url(assets/characters/${name}/${name}-${state}.png)`;
  }

  /** A line WITH sourced Kutchi: shows the mouth-moving talking pose, plays
   * the pre-baked audio, then returns to neutral. */
  async function talk(charElId, charName, kind, audioId, kutchiObj, englishFallback, gist) {
    setCharacter(charElId, charName, "talking");
    setCaption(gist, kutchiObj, englishFallback);
    await NjgAudio.speak(kind, audioId, kutchiObj.text);
    setCharacter(charElId, charName, "neutral");
  }

  /** A line with NO sourced Kutchi yet: text only, never spoken (design
   * principle: English is never spoken in-game) and no talking animation,
   * since nothing is actually being "said" in Kutchi. */
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
  }

  // ---------------- game state ----------------
  const state = {
    errand: null,
    listState: {}, // word_id -> { qty, have, noCount }
    hesitationTimer: null,
  };

  function clearHesitationTimer() {
    if (state.hesitationTimer) { clearTimeout(state.hesitationTimer); state.hesitationTimer = null; }
    document.querySelectorAll(".item-slot.hint-glow").forEach((s) => s.classList.remove("hint-glow"));
  }

  /** Hint-only glow: NOT shown automatically on first meeting (that gave
   * the answer away). Shown after a wrong tap or ~5s of not finding the
   * right item - see Roadmap doc, "Glow is a hint, not a giveaway". */
  function armHesitationGlow(getUnboughtSlots) {
    clearHesitationTimer();
    state.hesitationTimer = setTimeout(() => {
      getUnboughtSlots().forEach((slot) => slot.classList.add("hint-glow"));
    }, HESITATION_MS);
  }

  // ================= SCENES =================
  function showScene(sceneId) {
    document.querySelectorAll(".scene").forEach((s) => s.classList.remove("active"));
    el(sceneId).classList.add("active");
  }

  function renderRow(rowElId, wordIds, mode) {
    // mode: "gap" (kitchen, before collected) | "filled" (kitchen, after
    // the bowl step) | "stall" (bazaar, tappable)
    const row = el(rowElId);
    row.innerHTML = "";
    const slotWidthPct = Math.max(14, Math.floor(70 / Math.max(1, wordIds.length)));
    wordIds.forEach((wid) => {
      const word = NjgData.word(wid);
      const slot = document.createElement("div");
      slot.className = "item-slot";
      slot.dataset.wordId = wid;
      slot.style.width = slotWidthPct + "%";

      if (mode === "gap") {
        slot.classList.add("gap");
        const outline = document.createElement("div");
        outline.className = "gap-outline";
        slot.appendChild(outline);
      } else {
        const img = document.createElement("img");
        img.className = "sprite";
        img.src = itemImgSrc(word);
        slot.appendChild(img);
      }
      row.appendChild(slot);
    });
  }

  // ================= KITCHEN INTRO =================
  async function runKitchenIntro(errand) {
    showScene("scene-kitchen");
    setCharacter("nani-sprite", "nani", "neutral");
    el("recipe-bowl").classList.remove("active");
    el("bowl-items").innerHTML = "";
    el("go-btn").disabled = true;
    el("go-btn").textContent = "…";
    el("shopping-list").innerHTML = "";
    state.listState = {};

    renderRow("kitchen-back-row", errand.pantry_back_row, "gap");
    renderRow("kitchen-front-row", errand.pantry_front_row, "gap");

    setCaption("Nani is making a fruit bowl for tonight's guests.", null,
      "Nani is making a fruit bowl for tonight's guests.");
    await sleep(500);

    const greet = NjgData.sentence("snt-01");
    const hey = NjgData.sentence("snt-03");
    await talk("nani-sprite", "nani", "word", "snt-01", greet.kutchi, greet.english, "");
    await talk("nani-sprite", "nani", "word", "snt-03", hey.kutchi, hey.english, "");

    // --- pre-exposure: Nani names what's already in the bowl (heard, not
    // taught yet) - Roadmap doc "Pre-exposure" ---
    if (errand.pre_exposure && errand.pre_exposure.length) {
      el("recipe-bowl").classList.add("active");
      for (const wid of errand.pre_exposure) {
        const word = NjgData.word(wid);
        await talk("nani-sprite", "nani", "word", wid, word.kutchi, word.english,
          "Nani's already put these in:");
        const img = document.createElement("img");
        img.src = itemImgSrc(word);
        el("bowl-items").appendChild(img);
        Progress.recordMeeting(wid);
        await sleep(300);
      }
    }

    // --- ask for the new items, one at a time, glowing the shelf gap
    // she's pointing at (directed, not a generic stage-based auto-glow) ---
    for (const it of errand.items) {
      const word = NjgData.word(it.word_id);
      const carrier = NjgData.carrier(it.word_id);
      const kutchiObj = carrier ? { text: carrier.kutchi_singular, is_draft: true } : word.kutchi;
      const slot = qs(`.item-slot[data-word-id="${it.word_id}"]`);
      slot.classList.add("hint-glow");
      await talk("nani-sprite", "nani", "carrier", it.word_id, kutchiObj,
        carrier ? carrier.english : `I need ${word.english}`, "Nani needs:");

      await new Promise((resolve) => {
        slot.onclick = () => {
          slot.classList.remove("hint-glow", "gap");
          slot.classList.add("tapped");
          slot.innerHTML = "";
          const img = document.createElement("img");
          img.className = "sprite";
          img.src = itemImgSrc(word);
          img.style.opacity = "0.55";
          slot.appendChild(img);
          Progress.recordMeeting(it.word_id);
          addToShoppingList(it.word_id, it.qty, it.no_count);
          slot.onclick = null;
          resolve();
        };
      });
    }

    const go = NjgData.sentence("snt-06");
    await talk("nani-sprite", "nani", "word", "snt-06", go.kutchi, go.english, "Time to go shopping.");

    el("go-btn").disabled = false;
    el("go-btn").textContent = "Go to the bazaar →";
    el("go-btn").onclick = () => runBazaar(errand);
  }

  // ---------------- Kutchi-only shopping list: text + play button, no
  // picture, no English by default (English stays one tap away) ----------------
  function addToShoppingList(wordId, qty, noCount) {
    state.listState[wordId] = { qty, have: 0, noCount: !!noCount };
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
      NjgAudio.speak("word", wordId, kText);
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
    textCol.appendChild(kutchi);
    textCol.appendChild(englishToggle);

    row.appendChild(textCol);
    row.appendChild(playBtn);
    list.appendChild(row);
  }

  function markListItemDone(wordId) {
    const row = qs(`.list-item[data-word-id="${wordId}"]`);
    if (row) row.classList.add("done");
  }

  function allCollected() {
    return Object.values(state.listState).every((s) => s.have >= s.qty);
  }

  // ================= BAZAAR =================
  async function runBazaar(errand) {
    showScene("scene-bazaar");
    setCharacter("shopkeeper-sprite", "shopkeeper", "neutral");
    el("go-btn").disabled = true;
    el("go-btn").textContent = "…";

    renderRow("bazaar-back-row", errand.stall_back_row, "stall");
    renderRow("bazaar-front-row", errand.stall_front_row, "stall");

    const reply = NjgData.sentence("snt-02");
    await talk("shopkeeper-sprite", "shopkeeper", "word", "snt-02", reply.kutchi, reply.english, "");
    // snt-08 "What would you like?" has no sourced Kutchi yet - shown in
    // English, never spoken (see textOnly()).
    const ask = NjgData.sentence("snt-08");
    await textOnly("The shopkeeper is ready for you.", ask.english, 1200);

    function unboughtTargetSlots() {
      return [...document.querySelectorAll("#scene-bazaar .item-slot")].filter((slot) => {
        const st = state.listState[slot.dataset.wordId];
        return st && st.have < st.qty;
      });
    }
    armHesitationGlow(unboughtTargetSlots);

    document.querySelectorAll("#scene-bazaar .item-slot").forEach((slot) => {
      slot.onclick = async () => {
        const wid = slot.dataset.wordId;
        const st = state.listState[wid];
        const word = NjgData.word(wid);
        if (!st) {
          // decoy item, not on the list - gentle "not this one" shake,
          // then a slightly sooner hint for the real target
          slot.style.transform = "translateX(-4px)";
          setTimeout(() => (slot.style.transform = ""), 150);
          Progress.recordMiss(wid);
          armHesitationGlow(unboughtTargetSlots);
          return;
        }
        if (st.have >= st.qty) return; // already at cap

        clearHesitationTimer();
        st.have += 1;

        if (st.noCount) {
          // "one bunch, no number" - single tap, no counting sequence
          Progress.recordCorrect(wid);
        } else {
          Progress.recordCorrect(wid);
          const numWord = NjgData.word(`num-${String(st.have).padStart(2, "0")}`);
          if (numWord && numWord.kutchi) {
            setCaption(`${word.english}, counting:`, numWord.kutchi, numWord.english);
            await NjgAudio.speak("word", numWord.id, numWord.kutchi.text);
          }
        }

        if (st.have >= st.qty) {
          slot.style.opacity = "0.35";
          slot.onclick = null;
          markListItemDone(wid);
        }
        if (allCollected()) {
          const thanks = NjgData.sentence("snt-11");
          await talk("shopkeeper-sprite", "shopkeeper", "word", "snt-11", thanks.kutchi, thanks.english,
            "You have everything on the list!");
          el("go-btn").disabled = false;
          el("go-btn").textContent = "Go home →";
          el("go-btn").onclick = () => runBowlStep(errand);
        } else {
          armHesitationGlow(unboughtTargetSlots);
        }
      };
    });
  }

  // ================= PUT IT IN THE BOWL (replaces the old modal recall
  // quiz - the design principle is "the task is the test, no quiz
  // screens", so this happens in-scene rather than in a full overlay) ====
  async function runBowlStep(errand) {
    clearHesitationTimer();
    showScene("scene-kitchen");
    setCharacter("nani-sprite", "nani", "happy");
    el("go-btn").disabled = true;
    el("go-btn").textContent = "…";

    const uniqueWords = [...new Set(errand.items.map((i) => i.word_id))];
    let remaining = [...uniqueWords];

    const overlay = el("overlay-recall");
    overlay.style.display = "flex";
    el("recall-caption").textContent = "Put them in the bowl:";

    function renderTray() {
      const container = el("recall-basket-items");
      container.innerHTML = "";
      const shuffled = [...remaining].sort(() => Math.random() - 0.5);
      shuffled.forEach((wid) => {
        const word = NjgData.word(wid);
        const div = document.createElement("div");
        div.className = "recall-item";
        div.dataset.wordId = wid;
        const img = document.createElement("img");
        img.src = itemImgSrc(word);
        div.appendChild(img);
        container.appendChild(div);
      });
    }

    async function askNext() {
      if (remaining.length === 0) {
        overlay.style.display = "none";
        return finishErrand(errand);
      }
      const wid = remaining[0];
      const carrier = NjgData.carrier(wid);
      const word = NjgData.word(wid);
      const kutchiObj = carrier ? { text: carrier.kutchi_singular, is_draft: true } : word.kutchi;
      setCaption("Nani wants the:", kutchiObj, carrier ? carrier.english : `the ${word.english}`);
      await NjgAudio.speak("carrier", wid, kutchiObj.text);
      renderTray();
      document.querySelectorAll("#recall-basket-items .recall-item").forEach((item) => {
        item.onclick = () => {
          if (item.dataset.wordId === wid) {
            item.classList.add("correct");
            remaining = remaining.filter((w) => w !== wid);
            Progress.recordCorrect(wid);
            const img = document.createElement("img");
            img.src = itemImgSrc(word);
            el("bowl-items").appendChild(img);
            setTimeout(askNext, 500);
          } else {
            item.classList.add("wrong");
            Progress.recordMiss(item.dataset.wordId);
            setTimeout(() => item.classList.remove("wrong"), 300);
          }
        };
      });
    }
    await askNext();
  }

  // ================= PATCH + QUILT =================
  function patchGradient(colors) {
    return `linear-gradient(135deg, ${colors.join(", ")})`;
  }

  async function finishErrand(errand) {
    const praise = NjgData.sentence("snt-13"); // "Well done!" - no sourced Kutchi yet
    await textOnly("", praise.english, 1600);

    renderRow("kitchen-back-row", errand.pantry_back_row, "filled");
    renderRow("kitchen-front-row", errand.pantry_front_row, "filled");

    const patch = { motif: errand.reward_patch.motif, colors: errand.reward_patch.colors, at: Date.now() };
    addPatch(patch);

    el("patch-preview").style.background = patchGradient(patch.colors);
    el("patch-caption").textContent = `The ${patch.motif.replace(/-/g, " ")} patch joins the quilt.`;
    el("overlay-patch").style.display = "flex";
    el("patch-continue").onclick = () => {
      el("overlay-patch").style.display = "none";
      setCharacter("nani-sprite", "nani", "happy");
      el("go-btn").disabled = false;
      el("go-btn").textContent = "Play again →";
      el("go-btn").onclick = () => startErrand();
    };
  }

  // ================= QUILT / NOTEBOOK OVERLAYS =================
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

  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => (el(btn.dataset.close).style.display = "none"));
  });
  el("tab-quilt").addEventListener("click", () => {
    renderQuiltOverlay();
    el("overlay-quilt").style.display = "flex";
  });
  el("tab-notebook").addEventListener("click", () => {
    const seen = Object.keys(NjgData.wordsById)
      .map((id) => ({ word: NjgData.word(id), prog: Progress.get(id) }))
      .filter((x) => x.prog.timesMet > 0)
      .sort((a, b) => a.prog.stage - b.prog.stage);
    const lines = seen.length
      ? seen.map((x) => `${x.word.english} — ${x.word.kutchi ? x.word.kutchi.text : "?"} (stage ${x.prog.stage})`).join("\n")
      : "No words met yet - play the errand first.";
    alert("Notebook:\n\n" + lines);
  });

  // ================= BOOT =================
  function startErrand() {
    const errand = NjgData.errand("bowl-01");
    state.errand = errand;
    state.listState = {};
    runKitchenIntro(errand);
  }

  async function unlockAudioAndFullscreen() {
    // Tap-to-start unlocks audio autoplay on mobile browsers and gives a
    // real user gesture to request fullscreen/landscape from.
    try {
      const a = new Audio();
      a.play().catch(() => {});
    } catch (e) {}
    try {
      const root = document.documentElement;
      if (root.requestFullscreen) await root.requestFullscreen().catch(() => {});
    } catch (e) {}
    try {
      if (screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock("landscape").catch(() => {});
      }
    } catch (e) {}
  }

  async function boot() {
    await NjgData.load();
    el("start-btn").onclick = async () => {
      el("overlay-start").style.display = "none";
      await unlockAudioAndFullscreen();
      startErrand();
    };
  }

  boot();
})();
