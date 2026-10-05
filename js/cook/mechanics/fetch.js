/*
 * Mechanic: fetch (the pantry). Tap the named items onto the tray, in
 * any order, among look-alike decoys. Kutchi: the nouns and counts.
 * Every item the order could have asked for is on the shelf every time
 * (milk whether or not they want it, the "no X" item too), so what you
 * fetch comes from what they said, never from what's there. Nani may ask
 * "pass me…" here too, but only for things that aren't in this order.
 * Params: need, askLines, passMe ("always": the lab tries it every time).
 * Knobs (data.mechanics.fetch): shelf, minDecoys, lookalikes, flyMs,
 * passMe (the chance she asks, in a real order), special.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  /**
   * What this dish's order could ask for but doesn't always: the options
   * in its `need` ({"if", "then"}, "$slot" picks) and the order's "no X"
   * rows. They always go on the shelf.
   */
  function optional(ctx) {
    const out = new Set();
    const dish = ctx.order && ctx.order.dishes && ctx.order.dishes[ctx.dishAt || 0];
    const def = dish && Cook.data.recipes[dish.recipe];
    const walk = (v, opt) => {
      if (v == null) return;
      if (typeof v === "string") {
        if (v[0] === "$") {
          const slot = ((def && def.slots) || {})[v.slice(1)] || {};
          [].concat(slot.pick || [], (slot.else || {}).pick || []).forEach((x) => walk(x, true));
        } else if (opt && Cook.item(v)) out.add(v);
        return;
      }
      if (Array.isArray(v)) return v.forEach((x) => walk(x, opt));
      if (typeof v === "object") ["then", "else"].forEach((key) => walk(v[key], true));
    };
    if (def) walk(def.need, false);
    const L = (ctx.ladders || [])[ctx.dishAt || 0];
    if (L && Cook.Order) Cook.Order.rows(L, { all: true }).forEach((r) => r.no && r.ids.forEach((id) => Cook.item(id) && out.add(id)));
    return [...out];
  }
  /** Every word in the current order (pass me in the pantry never asks for one). */
  function inOrder(ctx) {
    const out = new Set();
    (ctx.ladders || []).forEach((L) => Cook.Order.rows(L, { all: true }).forEach((r) => r.ids.forEach((id) => out.add(id))));
    return out;
  }

  Mech.define("fetch", {
    station: "fetch",
    view: "pantry",
    footprint: { x: 0, y: 0, w: 1600, h: 900 },
    async run(z, { need, askLines = true, passMe }, k) {
      const S = z.S;
      const ctx = z.ctx;
      // always on the shelf: what they could have asked for (the "no X" item too)
      const always = optional(ctx).filter((id) => !need.includes(id));
      // then decoys: look-alikes of what's needed first, then others
      const decoys = [...new Set(always.concat(need.flatMap((id) => St.lookalikes(id, k.lookalikes)), Cook.shuffle(Cook.data.pantry_decoys)))]
        .filter((d) => !need.includes(d))
        .slice(0, Math.max(k.minDecoys, always.length, k.shelf - need.length));
      // pantry v2 (28 Sept): the shelves and the fridge, measured from the painted
      // pantry (data.mechanics.fetch.slots). A fridge thing only goes in the fridge,
      // everything else only on the shelves; what's needed is placed first, so a full
      // fridge only ever leaves out a decoy.
      const P = Cook.data.mechanics.fetch;
      const fridge = new Set(P.fridge || []);
      const free = { shelf: Cook.shuffle(P.slots.filter((s) => s.zone === "shelf")), fridge: Cook.shuffle(P.slots.filter((s) => s.zone === "fridge")) };
      // a plain decoy needs its side-on container (data.art.sprites.shelf): no top-down plate of chips on a
      // shelf (what the order could ask for always goes up, drawn or not)
      const all = need.concat(Cook.shuffle(decoys).filter((id) => always.includes(id) || Cook.Art.refUrl(`${id}.shelf`)));
      const items = {};
      all.forEach((id) => {
        const slot = free[fridge.has(id) ? "fridge" : "shelf"].pop();
        if (!slot) return;
        const key = Cook.Art.wordTex(S, id);
        // in the fridge the small things (a yoghurt tub) come up nearer a milk carton's size, to be seen
        const f = slot.zone === "fridge" ? Math.max(Cook.Art.shelfSize(id), P.fridgeMin || 0) : Cook.Art.shelfSize(id);
        items[id] = S.prop(key, z.X(slot.x), z.Y(slot.y), z.L(slot.w * f), z.L(slot.h * f));
        items[id].label = S.label(items[id], id);
        // where it lives, so a thing taken back off the tray goes home (E14)
        items[id].home = { x: items[id].x, y: items[id].y, scale: items[id].scale, depth: items[id].depth };
      });
      // the tray on the counter: one outlined space per thing on the list, in a row, so you
      // can see how many are still missing (not which). A wrong pick takes a space too (UX 11),
      // so a space is added after the last one if the row runs out.
      const T = P.tray;
      const spaceAt = (i) => ({ x: z.X((T.x0 + T.x1) / 2 + (i - (need.length - 1) / 2) * T.gap), y: z.Y(T.y) });
      const outline = (i, id) => {
        const at = spaceAt(i);
        const key = Cook.Art.wordTex(S, id);
        const { w, h } = S.texSize(key);
        const f = Cook.Art.shelfSize(id);
        const sc = S.fitScale(key, z.L(T.w * f), z.L(T.h * f));
        // the container's own shape, a little inside its canvas: a soft rounded box
        const bw = w * sc * 0.86;
        const bh = h * sc * 0.9;
        const g = S.track(S.add.graphics().setDepth(D.front - 1));
        g.fillStyle(0xfffaf1, 0.22);
        g.fillRoundedRect(at.x - bw / 2, at.y - bh, bw, bh, Math.min(18, bw / 4));
        g.lineStyle(z.L(3), k.special ? 0xf6c35b : 0x6b4a2a, 0.55);
        g.strokeRoundedRect(at.x - bw / 2, at.y - bh, bw, bh, Math.min(18, bw / 4));
        return g;
      };
      const outlines = need.map((id, i) => outline(i, id));
      // the tally sits on the fridge's steel base, clear of the shelves and the fridge's top level
      if (P.tally && UI.tallyAt) UI.tallyAt(P.tally);
      // the tray's front edge, cut from the painted pantry itself, goes in front of what's on the tray,
      // so things stand in it rather than over it
      if (T.front && S.bg && S.bg.texture) {
        const [fx, fy, fw, fh] = T.front;
        S.track(S.add.image(S.bg.x, S.bg.y, S.bg.texture.key).setOrigin(0).setScale(S.bg.scaleX, S.bg.scaleY).setCrop(fx, fy, fw, fh).setDepth(D.front + 3));
      }
      // Nani's list (PAN-02, step 4d): every thing its own full sentence, "Muke atto de. Muke khun de." (give me: the
      // family's words); one sentence with a list waits for Mum's list rule (the engine's gap list: Fetch, L29)
      const ask = (id) => Lang.line("give", Lang.phrase([id]));
      if (ctx.guided && askLines) await z.say(Lang.join(need.map((id, i) => ask(id, i === 0))));
      const remaining = need.slice();
      const fetched = new Set();
      let n = 0;
      // "pass me" in the pantry: something on the shelf that isn't in this order
      const pantryPassMe = async () => {
        const force = passMe === "always";
        if (!force && (ctx.guided || ctx.lab || !ctx.maybePassMe || (ctx.interrupts || 0) >= (ctx.maxInterrupts || 0) || Math.random() > k.passMe)) return;
        const said = inOrder(ctx);
        // not a word whose shelf label shows it as text (you'd just match the letters)
        const pick = Cook.shuffle(Object.keys(items)).find((id) => !remaining.includes(id) && !said.has(id) && !always.includes(id) && (force || Cook.labelMode(id) !== "text"));
        if (!pick) return;
        ctx.interrupts = (ctx.interrupts || 0) + 1;
        await St.passMe(S, ctx, { want: pick });
        // she takes it off the shelf
        const obj = items[pick];
        if (obj && obj.active) {
          delete items[pick];
          await S.fly(obj, z.X(1560), z.Y(60), { scale: obj.scale * 0.5, duration: 420, arc: z.L(80) });
          obj.destroy();
        }
      };
      // Wave 6b: onto the tray, into the next space (a wrong one too, from level 2: nothing says it's wrong until the review)
      const tray = []; // C3 (E14): what's on the tray, in its spaces ({id, obj, right})
      const step = {}; // the step waiting for a tap (a take-back starts it again)
      let fetching = true;
      const trayAt = (i, id, obj) => {
        const at = spaceAt(i);
        const f = Cook.Art.shelfSize(id);
        return { x: at.x, y: at.y + z.L(4), scale: S.fitScale(obj.texture.key, z.L(T.w * f), z.L(T.h * f)) };
      };
      const onTray = (id, obj, right = false) => {
        if (n >= need.length) outlines.push(outline(n, id));
        const t = trayAt(n, id, obj);
        const space = outlines[n];
        n++;
        UI.countUp(id);
        const e = { id, obj, right, busy: true };
        tray.push(e);
        // its space's outline goes as it lands
        return S.fly(obj, t.x, t.y, { scale: t.scale, depth: D.front + 1, duration: k.flyMs }).then(() => {
          if (space && space.active) S.tweens.add({ targets: space, alpha: 0, duration: 160, onComplete: () => space.destroy() });
          e.busy = false;
          if (fetching && obj.active) S.tappable(obj, () => takeBack(e));
        });
      };
      /** C3 (E14, take it back until Done): a tap on the tray sends a thing back to its shelf; the first pick is the one scored. */
      const takeBack = (e) => {
        if (!fetching || e.busy || !tray.includes(e)) return;
        tray.splice(tray.indexOf(e), 1);
        S.untap(e.obj);
        n--;
        UI.countDown(e.id);
        if (e.right) {
          remaining.push(e.id);
          const b = ctx.basket.indexOf(e.id);
          if (b >= 0) ctx.basket.splice(b, 1);
          if (UI.mission.untickItem) UI.mission.untickItem(e.id, ctx.dishAt || 0);
        }
        Cook.sfx.pop();
        // its space on the tray is free again (the ones after it close up)
        while (outlines.length <= n) outlines.push(null);
        if (n < need.length) outlines[n] = outline(n, need[n]);
        tray.forEach((x, i) => {
          const t = trayAt(i, x.id, x.obj);
          S.tweens.add({ targets: x.obj, x: t.x, y: t.y, duration: 220, ease: "Sine.easeInOut" });
        });
        const h = e.obj.home;
        S.fly(e.obj, h.x, h.y, { scale: h.scale, depth: h.depth, duration: k.flyMs }).then(() => {
          if (!e.obj.active || !fetching) return;
          e.obj.label = S.label(e.obj, e.id);
          items[e.id] = e.obj;
          // the waiting step starts again, with it back on the shelf
          if (step.cancel) step.cancel();
        });
      };
      Cook.undoAt = () => {
        // (not while Nani's "pass me" or a first-time coach is up: only the thing they point at takes a tap)
        if (Cook.paused || (Cook.Coach && Cook.Coach.active())) return null;
        const e = fetching && tray.find((x) => !x.busy);
        return e ? S.centre(e.obj) : null;
      };
      while (remaining.length) {
        const expected = remaining[0];
        const guided = ctx.guided || Cook.wordStage(expected) === 1;
        Cook.markSeen(expected);
        const r = await S.step({
          items,
          expected,
          word: expected,
          guided,
          sayLine: ask(expected, n === 0),
          allowAny: (key) => remaining.includes(key),
          quiet: z.quiet,
          onWrong: (key, m) => {
            z.listen(false, always.includes(key) && !need.includes(key) && inOrder(ctx).has(key) ? `fetched ${key} (they said no)` : `fetched ${key}`);
            if (m === 1) z.oops();
          },
          onLand: (key, obj) => {
            if (obj.label) obj.label.destroy();
            delete items[key];
            onTray(key, obj);
          },
          io: z.io,
          ctl: step,
        });
        step.cancel = null;
        if (r.cancelled) continue;
        const id = r.key;
        remaining.splice(remaining.indexOf(id), 1);
        // the first pick of each thing is the one that counts (a thing taken back and fetched again isn't counted twice)
        const again = fetched.has(id);
        fetched.add(id);
        if (!guided && !again) Cook.markRight(id);
        if (ctx.tickItem) ctx.tickItem(id);
        const obj = items[id];
        delete items[id];
        Cook.sfx.right();
        if (obj.label) obj.label.destroy();
        z.progress({ fetched: id });
        ctx.basket.push(id);
        const landed = onTray(id, obj, true);
        // the last thing on the list: it lands and the pantry is done (the tray closes; nothing more to take back)
        if (!remaining.length) fetching = false;
        await landed;
        if (n === 1 && remaining.length && !again) await pantryPassMe();
      }
      fetching = false;
      Cook.undoAt = null;
      tray.forEach((e) => e.obj.active && S.untap(e.obj));
    },
  });

  Mech.lab("fetch", {
    name: "Pantry",
    verb: "Fetch",
    async run(L) {
      const R = Cook.Recipes;
      // Nani's pantry list (Wave 6: three things at level 1, one more each level)
      const d = R.pantry.make("nani", { level: L.level });
      L.card(d, ["Pantry"]);
      await L.station("fetch", { need: R.pantry.need(d), passMe: "always" });
    },
  });
})(window);
