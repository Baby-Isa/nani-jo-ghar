/*
 * The blocked nose (prototype, proto-clinic 2 Nov 2026; build/reports/designs/clinic-every-part.md §3D, its critique 4 and 11).
 *
 * The doctor: "Pela ba chando, ne poi [tissue]." (First two drops, then the tissue.) Chai's order card: one card per step.
 *   1. The drops: tap the dropper, then the nose; one drop falls from the tip per tap (the dropper stays above the nose; nothing
 *      goes inside). The drops row ticks the moment its number is reached; an extra drop doesn't land (Zafar, 1 Nov).
 *      The blocked look stays until the tissue, so the picture never says the number.
 *   2. The tissue: tap the box (a tissue pops up; only now the nose twitches: never on the drops' tick), then the nose: the
 *      sneeze comes into it ("choo!"), always caught, no timer. Then the tissue into the bin: the row ticks.
 *   A tissue before the drops are done, or the cream (the L2 decoy), is a funny shake and the line again (the row ticks plain).
 *
 *   L1  1-2 drops                L2  2-3 drops, the cream on the tray as a decoy
 *   L3  as L2, heard only (the card's picture off: chai's rule)   L4  3-5 drops
 * The design's L3 side ("two drops on the left side") and L4 counts per side wait for their frames (D-10: missing).
 */
const A = {
  cold: "assets/clinic/patients/girl/girl-head-cold.webp",
  happy: "assets/clinic/patients/girl/girl-head-happy.webp",
  dropper: "assets/clinic/sheets/drop-bottle/drop-bottle-tool.webp",
  drop: "assets/clinic/items-s08b/drop-falling-s08b.webp",
  tissue: "assets/clinic/heal-v3/tissue.webp",
  bin: "assets/clinic/sheets/bin/bin-kidney-3q.webp",
  cream: "assets/clinic/heal-v3/ointment-pot.webp",
};
const stamp = (p) => (typeof window !== "undefined" && typeof window.njgV === "function" ? window.njgV(p) : p);
const I = (kind, n) => (n ? { fn: "Item", kind, n } : { fn: "Item", kind });

export default {
  opts: {},
  async run(F) {
    const lv = F.level;
    const n = lv === 1 ? 1 + Math.floor(F.rng() * 2) : lv === 4 ? 3 + Math.floor(F.rng() * 3) : 2 + Math.floor(F.rng() * 2);

    /* ----- the scene: the wall, her face (front on, the head close-up), the tools on the right ----- */
    F.scene.insertAdjacentHTML("beforeend", '<div class="cp-wall"></div><div class="cp-floor"></div>');
    const face = F.put("cp-nose-face", { x: 0.38, y: 1.0, h: 0.94, img: A.cold, z: 5 });
    const nose = document.createElement("button");
    nose.type = "button";
    nose.className = "cp-spot";
    nose.setAttribute("aria-label", "nose");
    Object.assign(nose.style, { left: "50%", top: "48%", "--r": "11%" });
    nose.style.setProperty("--r", "min(11vh, 60px)");
    face.appendChild(nose);
    const tray = F.put("cp-traybox", { x: 0.83, y: 0.62, h: 0.5, z: 2 });
    tray.style.width = "28%";
    const dropper = F.put("cp-tool", { x: 0.77, y: 0.56, h: 0.36, img: A.dropper, tag: "button", z: 10 });
    dropper.setAttribute("aria-label", "dropper");
    const box = F.put("cp-tool", { x: 0.89, y: 0.5, h: 0.2, img: A.tissue, tag: "button", z: 10 });
    box.setAttribute("aria-label", "tissue box");
    let cream = null;
    if (lv >= 2) {
      cream = F.put("cp-tool", { x: 0.9, y: 0.6, h: 0.1, img: A.cream, tag: "button", z: 11 });
      cream.setAttribute("aria-label", "cream");
    }
    const bin = F.put("cp-tool", { x: 0.83, y: 0.97, h: 0.2, img: A.bin, tag: "button", z: 10 });
    bin.setAttribute("aria-label", "bin");

    /* ----- the order card: the drops, then the tissue ----- */
    const line = { fn: "FirstThen", a: I("n.drops", n), b: I("n.tissue") };
    const drops = F.row({ key: "drops", line, word: I("n.drops", n), need: n, picture: A.dropper, target: () => (held === "dropper" ? nose : dropper) });
    const wipe = F.row({ key: "tissue", line: { fn: "Now", x: I("n.tissue") }, word: I("n.tissue"), need: 1, picture: A.tissue, target: () => (held === "used" ? bin : held === "tissue" ? nose : box) });

    /* ----- play ----- */
    let held = null; // "dropper" | "cream" | "tissue" | "used"
    const hold = (what, el) => {
      held = what;
      [dropper, box, cream].forEach((t) => t && t.classList.toggle("sel", t === el));
      [dropper, box, cream].forEach((t) => t && t.classList.toggle("lift", t === el));
    };
    F.on(dropper, "click", () => {
      F.acted();
      if (drops.done) return F.jiggle(dropper, "cp-shake");
      hold("dropper", dropper);
      F.focus(drops);
    });
    if (cream)
      F.on(cream, "click", () => {
        F.acted();
        hold("cream", cream);
      });
    F.on(box, "click", () => {
      F.acted();
      if (!drops.done) {
        // the order: first the drops (not blocked from trying: a shake and the line again)
        F.oops(drops, box);
        return;
      }
      if (held === "used" || wipe.done) return;
      hold("tissue", box);
      F.focus(wipe);
      F.jiggle(face); // the twitch starts on this tap, never on the drops' tick
      bubble("…", 0.38, 0.12, 900);
    });
    F.on(nose, "click", async (ev) => {
      ev.stopPropagation();
      F.acted();
      if (held === "dropper") {
        if (F.full(drops)) return F.jiggle(dropper, "cp-shake"); // the number is reached: the extra drop doesn't land
        F.add(drops);
        await dropFall();
        return;
      }
      if (held === "cream") return F.oops(F.rows.find((r) => !r.done), cream);
      if (held === "tissue") {
        held = "used";
        box.classList.remove("sel", "lift");
        const t = document.createElement("img");
        t.src = stamp(A.tissue);
        t.className = "cp-flyer";
        Object.assign(t.style, { left: "38%", top: "40%", width: "16%", translate: "-50% -50%", zIndex: 30 });
        F.play.appendChild(t);
        await F.sleep(F.T(250));
        bubble("choo!", 0.38, 0.3, 1200);
        if (window.Sfx) window.Sfx.play("pop", { volume: 0.5 });
        F.jiggle(face, "cp-bounce");
        face.querySelector("img").src = stamp(A.happy);
        await F.sleep(F.T(600));
        t.remove();
        heldTissue = F.put("cp-tool used-tissue", { x: 0.55, y: 0.75, h: 0.12, img: A.tissue, tag: "button", z: 12 });
        heldTissue.classList.add("sel");
        F.on(heldTissue, "click", () => F.acted());
        return;
      }
      F.jiggle(face); // a tap on her with nothing in hand: a giggle
    });
    let heldTissue = null;
    F.on(bin, "click", async () => {
      F.acted();
      if (held !== "used" || !heldTissue) return F.jiggle(bin);
      await F.fly(A.tissue, heldTissue, bin, { ms: 420 });
      heldTissue.remove();
      heldTissue = null;
      held = null;
      F.add(wipe);
    });

    function bubble(text, x, y, ms) {
      const b = document.createElement("div");
      b.className = "cp-bubble";
      b.textContent = text;
      Object.assign(b.style, { left: `${x * 100}%`, top: `${y * 100}%` });
      F.play.appendChild(b);
      F.after(F.T(ms), () => b.remove());
    }
    async function dropFall() {
      // the dropper stays above the nose; a drop falls from its tip and lands on the outside of the nose
      const fb = face.getBoundingClientRect();
      const pr = F.play.getBoundingClientRect();
      const nx = fb.left + fb.width * 0.5 - pr.left;
      const ny = fb.top + fb.height * 0.47 - pr.top;
      const d = document.createElement("img");
      d.src = stamp(A.drop);
      d.className = "cp-drop";
      Object.assign(d.style, { left: `${nx}px`, top: `${ny - fb.height * 0.3}px` });
      F.play.appendChild(d);
      try {
        await d.animate([{ transform: "translateY(0)", opacity: 1 }, { transform: `translateY(${fb.height * 0.28}px)`, opacity: 0.9 }], { duration: F.T(450), easing: "ease-in", fill: "forwards" }).finished;
      } catch (e) {
        /* left */
      }
      d.remove();
    }

    await F.ask({ headline: line, guide: line });
    F.begin();
    F.teach("dropper", dropper).then(() => F.teach("nose", nose));
    F.focus(drops);
    await new Promise((res) => F.whenAll(res));
    await F.finish(async () => {
      F.jiggle(face, "cp-bounce");
      await F.sleep(F.T(700));
    });
  },
};
