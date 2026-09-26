/*
 * Make your character (docs/first-launch-story.md, "Character creation").
 * Pictures only, no reading: the character big on the left, updating live;
 * on the right a row of tabs (each a picture of that part, in its current
 * colour), the swatches for the chosen tab (each a picture of the part in
 * that choice), and a big ✓ under the thumb (docs/UX-PRINCIPLES.md 2).
 * Everything comes from data/character-options.json through js/shared/character.js.
 *
 *   CharMaker.open(host, {choices}) -> Promise<choices>   resolves on ✓
 */
(function (global) {
  "use strict";
  const C = global.Character;
  const CharMaker = (global.CharMaker = {});
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  CharMaker.open = async function (host, o = {}) {
    const opts = await C.load();
    let ch = C.normalize(o.choices);
    let tab = opts.categories[0].id;
    const root = document.createElement("div");
    root.className = "cm";
    root.innerHTML = `
      <div class="cm-char" aria-live="polite"></div>
      <div class="cm-side">
        <div class="cm-tabs" role="tablist"></div>
        <div class="cm-swatches" role="radiogroup"></div>
        <button type="button" class="cm-done" id="cm-done" aria-label="Done"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      </div>`;
    host.appendChild(root);
    const $ = (s) => root.querySelector(s);
    const cat = (id) => opts.categories.find((c) => c.id === id);
    const touched = new Set();

    function drawChar() {
      $(".cm-char").innerHTML = C.svg(ch, { title: "You" });
      root.dataset.choices = JSON.stringify(ch);
    }
    function drawTabs() {
      $(".cm-tabs").innerHTML = opts.categories
        .map(
          (c) =>
            `<button type="button" role="tab" class="cm-tab${c.id === tab ? " on" : ""}${touched.has(c.id) ? " done" : ""}" data-cat="${esc(c.id)}" aria-selected="${c.id === tab}" aria-label="${esc(c.label || c.id)}">${C.svg(ch, { view: c.id })}</button>`
        )
        .join("");
      root.querySelectorAll(".cm-tab").forEach((b) =>
        b.addEventListener("click", () => {
          tab = b.dataset.cat;
          drawTabs();
          drawSwatches();
        })
      );
    }
    function drawSwatches() {
      const c = cat(tab);
      $(".cm-swatches").innerHTML = c.swatches
        .map((s) => {
          const pic = C.svg(Object.assign({}, ch, { [c.id]: s.id }), { view: c.id });
          const dot = s.color ? `<i class="cm-dot" style="background:${esc(s.color)}"></i>` : "";
          return `<button type="button" role="radio" class="cm-sw${ch[c.id] === s.id ? " on" : ""}" data-sw="${esc(s.id)}" aria-checked="${ch[c.id] === s.id}" aria-label="${esc(s.label || s.id)}">${pic}${dot}</button>`;
        })
        .join("");
      $(".cm-swatches").dataset.cat = c.id;
      root.querySelectorAll(".cm-sw").forEach((b) =>
        b.addEventListener("click", () => {
          ch = Object.assign({}, ch, { [c.id]: b.dataset.sw });
          touched.add(c.id);
          drawChar();
          const i = opts.categories.findIndex((x) => x.id === c.id);
          drawTabs();
          drawSwatches();
          // invite the next part (one job at a time), without moving there by itself
          const next = root.querySelectorAll(".cm-tab")[i + 1];
          if (next) next.classList.add("invite");
          else $(".cm-done").classList.add("invite");
          $(".cm-char").classList.remove("pop");
          void $(".cm-char").offsetWidth;
          $(".cm-char").classList.add("pop");
        })
      );
    }
    drawChar();
    drawTabs();
    drawSwatches();
    global.__charmaker = { choices: () => Object.assign({}, ch), tab: () => tab };
    await new Promise((resolve) => $(".cm-done").addEventListener("click", resolve, { once: true }));
    root.classList.add("leaving");
    return ch;
  };
})(window);
