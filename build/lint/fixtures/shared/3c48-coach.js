// The real bad code: js/cook/coach.js at commit 3c4882609 (before the September overlay was deleted, e9f8afa4c), its nextLight's
// round light and the Wave 6 overlay's draw(), verbatim (lines 775-779 and 1119-1135). The shared-pieces lint must go red on it.
    const fire = () => {
      if (!Onboard || !Onboard.light || !o.target) return;
      if (o.ok && !o.ok()) return;
      lit = Onboard.light(o.target, { look: "glow", pad: o.pad != null ? o.pad : 2, round: o.round !== false, pass: true, ms: (o.litMs != null ? o.litMs : W.nextLit) / speed(), quitIf: o.quitIf, note: o.note });
      note("next-pan", { step: o.who != null ? String(o.who) : "", by: "light" });
    draw(null);
  };

  /* ---------------- the Wave 6 fallback overlay (no shared kit) ---------------- */
  function draw(t) {
    const box = $("#coach");
    if (!box) return;
    if (!t) {
      box.classList.add("hidden");
      return;
    }
    box.classList.remove("hidden");
    const hole = box.querySelector(".co-hole");
    hole.style.left = `${t.x - t.r}px`;
    hole.style.top = `${t.y - t.r}px`;
    hole.style.width = hole.style.height = `${t.r * 2}px`;
    // (S13-A2: its own finger went: one finger in every game, the kit's .ob-finger, SH-119)
