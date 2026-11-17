/*
 * The cog: one button at the top right of the play area, the same in every mode. A tap opens its menu: the "?" (what
 * to do here, for grown-ups), home, and Nani's recipe book. It never skips an order and sits above the light.
 *
 *   createCog({ stage, kit, sounds, onPick })      onPick(id) is told which menu button was pressed
 */
const GEAR = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`;

export function createCog({ stage, kit, sounds, onPick = () => {} }) {
  stage.el.over.querySelectorAll(".cog-rail").forEach((el) => el.remove());
  const rail = document.createElement("div");
  rail.className = "cog-rail";
  rail.dataset.ownTaps = "1";
  rail.innerHTML = `<button class="cog" aria-label="Menu">${GEAR}</button><div class="cog-menu">${kit.cog.items.map((it) => `<button data-id="${it.id}" aria-label="${it.label}">${it.glyph}</button>`).join("")}</div>`;
  stage.el.over.appendChild(rail);
  const menu = rail.querySelector(".cog-menu");
  rail.querySelector(".cog").addEventListener("click", () => {
    sounds.play("click");
    menu.classList.toggle("open");
  });
  menu.querySelectorAll("button").forEach((b) =>
    b.addEventListener("click", () => {
      sounds.play("click");
      menu.classList.remove("open");
      onPick(b.dataset.id);
    })
  );
  return { el: rail };
}
