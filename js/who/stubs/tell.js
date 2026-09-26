/*
 * STUB (Who did it?): the shared `tell` speaking mechanic, same API as the
 * deep dive's js/shared/mechanics/tell.js (D3, 12.4 task 4). The foundation
 * session owns js/shared/, so this lives here until tell.js lands there;
 * swapping is one <script> line in who.html and the name below.
 *
 *   Who.Tell.tell({ choices, mode, timeoutMs, stage, onAgain, botPick })
 *     -> Promise<{ choice, via: "voice" | "pill" | "parent" }>
 *
 * It calls the shared recogniser, js/shared/speech.js:
 *   Speech.listen({ choices, timeoutMs }) -> { choice, confidence } | null
 * Rules (D4): the closed set is `choices` (3-6 word ids); a fallback is always
 * there; recognition never blocks: a null gets one "Again?" from the
 * character (onAgain), then the pills come up beside the mic. Only "voice"
 * and "parent" may earn the voice star; pills earn coins for helping.
 *
 * Modes (the lab's speech selector, ?speech=):
 *   mic       the mic button; nulls fall back to pills (default)
 *   pills     the word pills only (audio; text from word stage 3)
 *   parent    Grandparent mode: a grown-up taps the word they heard, or "again"
 *   bot:auto  tests: answers at once as if heard by voice (botPick), or bot:<word id>
 */
(function (global) {
  const Who = (global.Who = global.Who || {});
  const T = (Who.Tell = {});
  const loaded = new Set();

  async function templates(choices) {
    if (!global.Speech) return;
    for (const id of choices) {
      if (loaded.has(id) || !(global.Cook && Cook.hasAudio(id))) continue;
      loaded.add(id);
      await Speech.loadTemplates(id, [`assets/audio/word/${id}.mp3`]);
    }
  }

  T.tell = function (o) {
    const box = document.getElementById("tell");
    const P = Who.UI.P;
    box.classList.remove("hidden");
    box.innerHTML = "";
    const finish = (resolve, r) => {
      box.innerHTML = "";
      box.classList.add("hidden");
      T.active = null;
      resolve(r);
    };
    return new Promise((resolve) => {
      T.active = { choices: o.choices, mode: o.mode };
      const mode = o.mode || "mic";
      if (mode.startsWith("bot:")) {
        const w = mode.slice(4);
        setTimeout(() => finish(resolve, { choice: w === "auto" ? o.botPick() : w, via: "voice" }), 300 / (Cook.speed || 1));
        return;
      }
      const note = (text) => {
        const n = document.createElement("div");
        n.className = "tell-note";
        n.textContent = text;
        box.appendChild(n);
      };
      const pills = () => {
        o.choices.forEach((id, k) => {
          const b = document.createElement("button");
          b.className = "tell-pill";
          b.dataset.word = id;
          b.type = "button";
          b.innerHTML = (o.stage || 2) >= 3 ? Who.UI.wordHTML(id) : `&#128264; ${k + 1}`;
          b.onclick = () => {
            if (b.classList.contains("armed")) return finish(resolve, { choice: id, via: "pill" });
            box.querySelectorAll(".tell-pill").forEach((x) => x.classList.remove("armed"));
            b.classList.add("armed");
            Who.UI.playWord(id);
          };
          box.appendChild(b);
        });
        note("Tap to hear; tap again to tell Ali");
      };
      if (mode === "pills") return pills();
      if (mode === "parent") {
        note("Grown-up: which word did they say?");
        o.choices.forEach((id) => {
          const b = document.createElement("button");
          b.className = "tell-pill parent";
          b.dataset.word = id;
          b.type = "button";
          b.innerHTML = Who.UI.wordHTML(id);
          b.onclick = () => finish(resolve, { choice: id, via: "parent" });
          box.appendChild(b);
        });
        const again = document.createElement("button");
        again.className = "btn";
        again.id = "tell-again";
        again.type = "button";
        again.textContent = "Again";
        again.onclick = () => o.onAgain && o.onAgain();
        box.appendChild(again);
        return;
      }
      // mic first; a null gets "Again?" and brings the pills up beside the mic
      let nulls = 0;
      const mic = document.createElement("button");
      mic.className = "btn primary tell-mic";
      mic.id = "tell-mic";
      mic.type = "button";
      mic.innerHTML = "&#127908; Say it";
      mic.onclick = async () => {
        if (mic.disabled) return;
        mic.disabled = true;
        mic.innerHTML = "&#127908; Listening…";
        await templates(o.choices);
        const r = global.Speech ? await Speech.listen({ choices: o.choices, timeoutMs: o.timeoutMs || 4000 }) : null;
        mic.disabled = false;
        mic.innerHTML = "&#127908; Say it";
        if (r && r.choice) return finish(resolve, { choice: r.choice, via: "voice", confidence: r.confidence });
        nulls++;
        if (o.onAgain) await o.onAgain();
        if (nulls === 1 && !box.querySelector(".tell-pill")) pills();
      };
      box.appendChild(mic);
      const hasAny = o.choices.some((id) => global.Cook && Cook.hasAudio(id));
      if (!hasAny) note("No recordings of these words yet: the pills are here too");
      if (!hasAny) pills();
    });
  };
  T.stub = true;
})(window);
