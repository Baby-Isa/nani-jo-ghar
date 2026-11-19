/*
 * The cog: one button at the top right of the play area, the same in every mode. A tap opens its menu (its buttons are
 * the kit's list: the "?" for grown-ups, home, Nani's recipe book, a new player); beside the open menu, who is playing,
 * for the grown-ups (Zafar, 19 Nov). It never skips an order and sits above the light.
 *
 *   createCog({ stage, kit, sounds, onPick, player })      onPick(id) is told which menu button was pressed
 *       player: { name, renew() }: who is playing, as the grown-ups read it, and what the new-player button does
 */
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const GEAR = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`;

export function createCog({ stage, kit, sounds, onPick = () => {}, player = null }) {
  stage.el.over.querySelectorAll(".cog-rail").forEach((el) => el.remove());
  const rail = document.createElement("div");
  rail.className = "cog-rail";
  rail.dataset.ownTaps = "1";
  // (a button that starts a new player is shown only where there is a player to renew)
  const items = kit.cog.items.filter((it) => !it.renews || player);
  const who = player ? `<div class="cog-who">${esc(kit.cog.player.label)}: <b>${esc(player.name)}</b></div>` : "";
  rail.innerHTML = `<button class="cog" aria-label="Menu">${GEAR}</button><div class="cog-menu">${who}${items.map((it) => `<button data-id="${it.id}" aria-label="${esc(it.label)}" title="${esc(it.label)}">${it.glyph}</button>`).join("")}</div>`;
  stage.el.over.appendChild(rail);
  const menu = rail.querySelector(".cog-menu");
  rail.querySelector(".cog").addEventListener("click", () => {
    sounds.play("click");
    menu.classList.toggle("open");
  });
  menu.querySelectorAll("button").forEach((b, i) =>
    b.addEventListener("click", () => {
      sounds.play("click");
      menu.classList.remove("open");
      if (items[i].renews) return player.renew();
      onPick(b.dataset.id);
    })
  );
  return { el: rail };
}
