/*
 * The wrong-order card: the one place a mistake is shown outside the thing itself. The asker's card comes to the
 * middle; each thing on it is said and gets a gold tick or a small red cross; then only that dish is made again.
 * Nani's soft "oh" opens it. Nothing else in play carries a cross.
 *
 *   showWrongOrder({ stage, say, kit, sounds, cards, seat, check }) -> Promise (resolves when it has been shown)
 */
export async function showWrongOrder({ stage, say, kit, sounds, cards, seat, check }) {
  const wait = (ms) => stage.wait(ms); // (stands still while the round is held)
  const veil = document.createElement("div");
  veil.className = "veil";
  veil.dataset.ownTaps = "1";
  // the card, open, its rows in the order asked, each said in turn
  const copy = cards.copy(seat);
  copy.el.querySelector(".ocard-body").style.height = "auto";
  veil.appendChild(copy.el);
  stage.el.over.appendChild(veil);
  sounds.play("oops");
  await say.speak(say.line(kit.lines.oho));
  await say.speak(cards.headOf(seat));
  for (const row of copy.rows) {
    const right = check.byRow[row.id] !== false;
    row.el.classList.add(right ? "done" : "cross");
    if (right) sounds.play("drop");
    await Promise.race([say.speak(row.line), wait(kit.lineTimes.wrongRowCap)]);
    await wait(kit.lineTimes.wrongRowGap);
  }
  await wait(kit.wrongOrder.holdMs);
  veil.remove();
}
