/*
 * The wrong-order card: the one place a mistake is shown outside the thing itself. The asker's card comes to the
 * middle; each thing on it is said and gets a gold tick or a small red cross; then only that dish is made again.
 * Nani's soft "oh" opens it. Nothing else in play carries a cross.
 *
 *   showWrongOrder({ stage, say, kit, sounds, cards, seat, check }) -> Promise (resolves when it has been shown)
 */
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export async function showWrongOrder({ stage, say, kit, sounds, cards, seat, check }) {
  const veil = document.createElement("div");
  veil.className = "veil";
  veil.dataset.ownTaps = "1";
  const s = cards.seats[seat];
  const copy = s.el.cloneNode(true);
  copy.classList.remove("folded", "served");
  copy.querySelector(".ocard-body").style.height = "auto";
  copy.querySelectorAll(".icard").forEach((c) => c.classList.remove("done", "cross", "waiting"));
  veil.appendChild(copy);
  stage.el.over.appendChild(veil);
  sounds.play("oops");
  await say.speak(say.line(kit.lines.oho));
  await say.speak(s.head);
  const els = [...copy.querySelectorAll(".icard")];
  for (const [n, it] of s.person.items.entries()) {
    const right = check.byRow[it.id] !== false;
    els[n].classList.add(right ? "done" : "cross");
    if (right) sounds.play("drop");
    await Promise.race([say.speak(s.items.get(it.id).line), wait(kit.lineTimes.wrongRowCap)]);
    await wait(kit.lineTimes.wrongRowGap);
  }
  await wait(kit.wrongOrder.holdMs);
  veil.remove();
}
