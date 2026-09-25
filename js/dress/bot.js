/*
 * Dress up: the on-screen bot (design 8.3's "leak-bot toggle"; 8.5's UI
 * pass). It plays the round on screen through real clicks and pointer
 * events and sees only the screen: the things on show (their shape, colour
 * and size: the data-kind / data-colour / data-size of what's drawn, which
 * is what anyone can see), how many rows the card has, and how many piles
 * are on the bed. It never reads the round. Strategies (the same names as
 * build/leak_dress.mjs): random, salient (the most eye-catching colour),
 * frequent (the most common colour on show). After its first Done it keeps
 * pressing Done without fixing anything, so the round ends.
 */
(function (global) {
  const Dress = global.Dress;
  const Pick = Dress.Pick;
  const Bot = (Dress.Bot = {});
  const $$ = (s) => [...document.querySelectorAll(s)];
  const visible = (e) => {
    if (!e) return false;
    const r = e.getBoundingClientRect();
    return r.width > 1 && r.height > 1 && getComputedStyle(e).display !== "none" && !e.closest(".hidden");
  };
  const sal = (id) => (Dress.data.words[id] || {}).salience || 0;
  const click = (el) => el && el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: global }));

  Bot.play = function (r, strat) {
    let stopped = false;
    const rng = Pick.rng((r.seed ^ 0x5bd1e995) >>> 0);
    const until = async (fn, ms = 20000) => {
      const t0 = Date.now();
      for (;;) {
        if (stopped || !r.alive()) throw new Dress.Abort();
        const v = fn();
        if (v) return v;
        if (Date.now() - t0 > ms) throw new Error("bot waited too long");
        await new Promise((res) => setTimeout(res, 15));
      }
    };
    const choose = (els) => {
      if (!els.length) return null;
      if (strat === "salient") {
        const best = Math.max(...els.map((e) => sal(e.dataset.colour)));
        return Pick.choose(rng, els.filter((e) => sal(e.dataset.colour) === best));
      }
      if (strat === "frequent") {
        const c = {};
        els.forEach((e) => (c[e.dataset.colour] = (c[e.dataset.colour] || 0) + 1));
        const best = Math.max(...Object.values(c));
        return Pick.choose(rng, els.filter((e) => c[e.dataset.colour] === best));
      }
      return Pick.choose(rng, els);
    };
    const rowsOnCard = () => $$("#mission .lr").length;
    const done = async () => {
      await until(() => visible(document.querySelector("#dress-done")) && !r.busy);
      click(document.querySelector("#dress-done"));
      await new Promise((res) => setTimeout(res, 30));
    };
    const keepDoning = async () => {
      for (let i = 0; i < 4 && r.alive() && r.phase !== "pass" && r.phase !== "stitch" && r.phase !== "say"; i++) {
        const d = document.querySelector("#dress-done");
        if (!visible(d) || r.busy) {
          await new Promise((res) => setTimeout(res, 30));
          continue;
        }
        click(d);
        await new Promise((res) => setTimeout(res, 30));
      }
    };
    const stitchAll = async () => {
      for (let n = 0; n < 12; n++) {
        const e = await until(() => (Dress.expect && (Dress.expect.kind === "swipe" || Dress.expect.end || r.phase === "done") ? Dress.expect || {} : null)).catch(() => null);
        if (!e || e.kind !== "swipe") return;
        const svg = r.svg;
        const ev = (type, a) => svg.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerId: 7, clientX: e.sx + e.sr * Math.cos(a), clientY: e.sy + e.sr * Math.sin(a) }));
        ev("pointerdown", 0);
        for (let a = 0; a <= Math.PI * 2.1; a += 0.12) ev("pointermove", a);
        ev("pointerup", 0);
        await new Promise((res) => setTimeout(res, 20));
      }
    };
    const run = async () => {
      await until(() => visible(document.querySelector("#intro .ic-go")) && document.querySelector("#intro .ic-go"));
      click(document.querySelector("#intro .ic-go"));
      await until(() => rowsOnCard() > 0);
      // the scene is drawn just after the card: wait for things to tap
      await until(() => $$("#scene [data-act]").length > 0 && !r.busy);
      const game = r.spec.game;
      const n = rowsOnCard();
      if (game === "fitting") {
        const slots = [...new Set($$('#scene [data-act="wear"]').map((e) => e.dataset.slot))];
        for (const slot of slots) {
          const el = choose($$(`#scene [data-act="wear"][data-slot="${slot}"]`));
          await until(() => !r.busy);
          click(el);
        }
      }
      if (game === "layout") {
        const piles = $$('#scene [data-act="pile"]').map((e) => e.dataset.who);
        for (let i = 0; i < n; i++) {
          await until(() => !r.busy);
          const el = choose($$('#scene [data-act="take"]'));
          click(el);
          if (piles.length > 1) {
            const who = piles[i % piles.length];
            await until(() => document.querySelector(`#scene [data-act="pile"][data-who="${who}"] .pile-hit`));
            click(document.querySelector(`#scene [data-act="pile"][data-who="${who}"] .pile-hit`));
          }
        }
      }
      if (game === "table") {
        const tin = $$('#scene [data-act="tin"]');
        if (tin.length) {
          const pickId = choose(tin).dataset.id;
          const count = Pick.int(rng, [1, 3]);
          for (let i = 0; i < count; i++) click(document.querySelector(`#scene [data-act="tin"][data-id="${pickId}"]`));
        }
        const tray = $$('#scene [data-act="tray"]');
        if (tray.length) {
          const id = choose(tray).dataset.id;
          const count = Pick.int(rng, [1, 2]);
          const part = Pick.choose(rng, $$('#scene [data-act="part"]'));
          for (let i = 0; i < count; i++) {
            click(document.querySelector(`#scene [data-act="tray"][data-id="${id}"]`));
            click(document.querySelector(`#scene [data-act="part"][data-part="${part.dataset.part}"][data-side="${part.dataset.side}"]`));
          }
        }
      }
      if (game === "bangles") {
        const cols = $$('#scene [data-act="take"]');
        let chosen;
        if (strat === "salient") chosen = cols.slice().sort((a, b) => sal(b.dataset.colour) - sal(a.dataset.colour) || rng() - 0.5).slice(0, n);
        else chosen = Pick.sample(rng, cols, n);
        for (const c of chosen) {
          const colour = c.dataset.colour;
          const k = Pick.int(rng, [1, 4]);
          for (let i = 0; i < k; i++) click(document.querySelector(`#scene [data-act="take"][data-colour="${colour}"]`));
        }
      }
      await done();
      await keepDoning();
      if (game === "table") {
        const tool = await until(() => $$("#moment .mo-tool").filter(visible).length && $$("#moment .mo-tool").filter(visible));
        click(Pick.choose(rng, tool));
        // a wrong tool: Big Ma asks again; the bot then passes each in turn
        for (let i = 0; i < 4 && r.phase === "pass"; i++) {
          await new Promise((res) => setTimeout(res, 40));
          const again = $$("#moment .mo-tool").filter(visible);
          if (again.length) click(again[i % again.length]);
        }
        await stitchAll();
      }
      if (game === "bangles" && r.round.say) {
        const pills = await until(() => $$("#moment .mo-pill").filter(visible).length && $$("#moment .mo-pill").filter(visible), 8000).catch(() => null);
        if (pills) click(Pick.choose(rng, pills));
      }
    };
    const p = run().catch((e) => {
      if (!(e instanceof Dress.Abort)) console.warn("bot:", e.message);
    });
    return { stop: () => (stopped = true), done: p };
  };
})(window);
