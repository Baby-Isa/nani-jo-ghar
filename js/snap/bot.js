/*
 * Snap: the lab's bot (none / leak / oracle), in the browser. It plays the
 * real round with the same strategies as the Node leak bot (js/snap/sim.js),
 * so the lab can check phase 0's rates on the real viewfinder, hand-in and
 * Ali's camera. It sees what the Node bot sees: the orchard (a picture), the
 * card's row shapes, its own prints, Ali's picture cards; only the oracle is
 * given the rows. It drives the viewfinder's own API (setView, shutter) and
 * clicks the real hand-in prints and Ali's pills; build/test_snap.py's
 * pointer-level run is separate (real taps from __snap.expectation()).
 *
 * Speaking: the lab sets the listen() stub (oracle: hears the card; the
 * blind bots: null, so they get the pills, which credit nothing).
 */
(function (global) {
  const Cook = global.Cook;
  const Snap = global.Snap;
  const Photo = Snap.Photo;
  const Req = Snap.Req;
  const Sim = Snap.Sim;
  const $ = (s) => document.querySelector(s);

  const B = (Snap.Bot = { memory: null });
  B.STRATEGIES = Object.keys(Sim.STRATEGIES);
  B.BLIND = B.STRATEGIES.filter((k) => k !== "oracle");

  const tick = (ms = 60) => new Promise((r) => setTimeout(r, ms / Math.max(1, Cook.speed)));
  const zi = (K, zoom) => Math.max(0, K.vf.zooms.indexOf(zoom));

  B.play = async function (round, name) {
    const st = Sim.STRATEGIES[name];
    const K = round.K;
    const all = round.rows.map((r) => r.row);
    const oracle = st.blind === false || st.seesRows;
    const v = { game: round.game, K, lay: round.lay, film: round.film, shapes: all.map((r) => ({ nar: !!r.not })), rng: Req.rng(round.seed * 31 + 7), rows: oracle ? all : null, memory: B.memory };
    const tags = {}; // print index -> { forRow, forShape }
    const log = { strategy: name, shots: 0, picks: [] };
    let shot = false;
    let lastAsk = null;
    let tried = new Set();
    let aliTried = new Map();
    const shootList = async (list) => {
      for (const f of list) {
        if (!round.alive() || round.vf.film <= 0) break;
        round.vf.setView(f.cx, f.cy, zi(K, f.zoom), { anim: false });
        await tick(40);
        while (round.vf.cooling) await tick(40);
        const i = round.prints.length;
        if (round.vf.shutter()) {
          tags[i] = { forRow: f.forRow, forShape: f.forShape };
          log.shots++;
        }
        await tick(40);
      }
    };
    while (round.alive() && round.phase !== "end") {
      await tick(80);
      if (!round.alive()) break;
      if ($("#intro") && !$("#intro").classList.contains("hidden")) {
        $("#intro .ic-card").click();
        continue;
      }
      if (round.phase === "ali") {
        const A = Snap.AliCamera;
        if (A.state === "mic") $("#ali-mic").click();
        else if (A.state === "pills" && A.row) {
          // a pill it hasn't tried for this card (it can see Ali's print isn't the card)
          const t = aliTried.get(A.row.i) || new Set();
          const pills = [...document.querySelectorAll("#ali .ali-pill")];
          const fresh = pills.filter((p) => !t.has(p.dataset.w));
          const p = v.rng.pick(fresh.length ? fresh : pills);
          if (p) {
            t.add(p.dataset.w);
            aliTried.set(A.row.i, t);
            p.click();
          }
        }
        // Ali's prints are for his row
        round.prints.forEach((p, i) => p.by === "ali" && !tags[i] && A.row && (tags[i] = { forRow: A.row.i }));
        continue;
      }
      if (round.phase === "shoot" && round.vf.enabled) {
        if (!shot) {
          shot = true;
          const mine = round.rows.filter((r) => !r.ali).map((r) => r.i);
          const sub = round.game === "g4" ? Object.assign({}, v, { film: round.vf.film, shapes: mine.map((i) => v.shapes[i]), rows: v.rows ? mine.map((i) => all[i]) : null }) : Object.assign({}, v, { film: round.vf.film });
          const list = st.shoot(sub).map((f) => (round.game === "g4" && f.forRow != null ? Object.assign(f, { forRow: mine[f.forRow] }) : f));
          await shootList(list);
        } else if (round.asking) {
          // back for a frame: the oracle shoots the row's frame, the others anything
          const r = round.asking;
          const f = oracle ? Req.frameFor(r.row, round.lay, K) : null;
          const pick = f ? { cx: f.cx, cy: f.cy, zoom: f.zoom, forRow: r.i } : (() => { const s = v.rng.pick(round.lay.spots); return { cx: s.x, cy: s.y, zoom: v.rng.pick(K.vf.zooms) }; })();
          await shootList([pick]);
        }
        await tick(120);
        const show = $("#vf-show");
        if (round.phase === "shoot" && show && !show.classList.contains("hidden")) show.click();
        continue;
      }
      if (round.phase === "handin" && round.asking) {
        const r = round.asking;
        if (lastAsk !== r) {
          lastAsk = r;
          tried = new Set();
          await tick(120);
        }
        const els = [...document.querySelectorAll("#handin .hi-print:not(.given)")];
        if (!els.length) continue;
        const tray = els.map((e) => {
          const i = Number(e.dataset.i);
          return Object.assign({ i, print: round.prints[i].print }, tags[i] || {});
        });
        let k;
        if (!tried.size) k = st.pick(v, tray, r.i, round.asked.length - 1);
        else {
          const rest = tray.map((_, j) => j).filter((j) => !tried.has(tray[j].i));
          if (!rest.length) {
            $("#hi-back").click();
            await tick(300);
            continue;
          }
          k = v.rng.pick(rest);
        }
        k = Math.max(0, Math.min(tray.length - 1, k | 0));
        tried.add(tray[k].i);
        log.picks.push({ row: r.i, print: tray[k].i, first: tried.size === 1 });
        els[k].click();
        await tick(250);
        continue;
      }
    }
    // this round's right frames, for the next round's "scene memory" bot
    B.memory = round.rows.map((r) => Req.frameFor(r.row, round.lay, K)).filter(Boolean).map((f) => ({ cx: f.cx, cy: f.cy, zoom: f.zoom }));
    return log;
  };
})(window);
