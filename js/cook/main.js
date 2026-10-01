/*
 * Cook as a mode plug-in (step 3, R4; target-model § 6; docs/architecture/building-games.md). The one game host
 * (js/shared/host.js) runs Cook's stations as mini-games, and the shell (js/shared/mode.js, lab.html) starts them
 * for a lab, story mode and free play:
 *
 *   lab.html?mode=cook&game=chai-tray&level=2          one station alone (every Station-lab station, the recipes)
 *   lab.html?mode=cook&play=story&params=…             story mode: one recipe across its stations, the pantry first (H49, H50)
 *   lab.html?mode=cook&play=free                       free play: the open kitchen, one customer a round, Next brings the next
 *
 * The stations are ADAPTERS over Cook's own code, unchanged (target-model § 11: no rewrite of the stations): each
 * stage runs the real cook.html in a frame filling the screen (screen: "own"), asks it for one station or one
 * order through Cook's test hook (__cook.lab, __cook.order), and catches Cook's end-of-round screen: the host scores
 * the whole plan once (Score.finish: the badges, the best, the pocket money, the story line) and shows the one end
 * screen. Inside the frame Cook runs with ?hosted=1, so it scores and pays nothing itself.
 *
 * Node-importable (build/gen_labs.mjs reads lab()): nothing here touches the browser until a stage is mounted.
 * Cook's own page (cook.html: the title, the story days, the shop) stays the way the house opens Cook until the hub
 * (R6) opens modes through the shell.
 */

/** The Station lab's kept stations (data/cook.json lab.stations), with the gestures each declares (E13). */
const STATIONS = [
  ["fetch", "Nani's pantry", ["tap"]],
  ["chai-tray", "Chai tray", ["tap"]],
  ["maani-line", "Maani line", ["tap", "circle", "swipe"]],
  ["mishkaki-grill", "Sekelo grill", ["tap", "drag"]],
  ["daar", "Daar", ["tap", "swipe", "circle"]],
  ["chop", "Chop", ["tap", "swipe"]],
  ["tadka", "Tadka", ["tap"]],
  ["stir", "Stir", ["circle"]],
  ["assemble", "Chaat bowl", ["tap"]],
  ["samosa", "Samosa", ["tap", "swipe"]],
];
/** Whole recipes, every station in turn (the Station lab's "recipe:<id>"). */
const RECIPES = [
  ["chai", "Chai"],
  ["maani", "Maani"],
  ["daal", "Daal"],
  ["chaat", "Chaat bowl"],
  ["samosa", "Samosa"],
  ["mishkaki", "Sekelo"],
];
const LEVELS = [1, 2, 3, 4];

/** The site root relative to the page ("" from a root page, "../" from lab/), so the URL stays stampable (B7). */
function rootFrom(baseURI) {
  try {
    const root = new URL("../../", import.meta.url);
    const page = new URL("./", baseURI);
    if (page.origin !== root.origin || !page.pathname.startsWith(root.pathname)) return root.href;
    return "../".repeat(page.pathname.slice(root.pathname.length).split("/").filter(Boolean).length);
  } catch (e) {
    return "";
  }
}
const stamp = (u) => (typeof globalThis.njgV === "function" ? globalThis.njgV(u) : u);

/**
 * One Cook mini-game over the real page. run(win, ctx) asks Cook for its round (a promise that settles when
 * Cook's own end screen would open); the caught end screen becomes this stage's result.
 */
function cookStage(id, { label, gestures = ["tap"], levels = LEVELS, run }) {
  return {
    id,
    gestures,
    levels,
    screen: "own",
    adapter: { of: "cook", key: id, label },
    mount(el, ctx) {
      const frame = el.ownerDocument.createElement("iframe");
      frame.className = "njg-adapter-frame";
      frame.title = "Cook";
      frame.setAttribute("allow", "autoplay");
      frame.style.cssText = "position:absolute;inset:0;width:100%;height:100%;border:0;display:block;background:#e9dcc4";
      const q = new URLSearchParams({ hosted: "1" });
      if (ctx.params.speed) q.set("speed", ctx.params.speed);
      frame.src = stamp(`${rootFrom(el.ownerDocument.baseURI)}cook.html?${q}`);
      el.appendChild(frame);
      let stopped = false;
      const win = () => frame.contentWindow;
      const until = async (ok, ms = 30000) => {
        for (let t = 0; t < ms; t += 100) {
          try {
            if (ok()) return true;
          } catch (e) {
            /* not loaded yet */
          }
          await ctx.wait(100);
        }
        throw new Error(`cook: the kitchen didn't get ready (${id})`);
      };
      return {
        frame,
        async start() {
          ctx.test.state("loading");
          await until(() => win().__cook && win().Results && win().document.querySelector("#panel .title-wrap"));
          const w = win();
          // Cook's end-of-round screen: caught, not shown (the host shows the one end screen for the plan)
          let round = null;
          w.Results.show = (o) => {
            round = o;
            const p = Promise.resolve({ action: "done" });
            p.el = null;
            return p;
          };
          ctx.test.state("playing");
          const out = await run(w, ctx);
          if (stopped) return;
          if (out && out.skipped) return ctx.done({ tasks: 0 });
          const r = round || { right: 0, total: 0, hints: 0, words: [] };
          ctx.done({
            right: r.right,
            total: r.total,
            marks: r.marks,
            hints: r.hints || 0,
            timeMs: r.timeMs,
            tasks: out && out.tasks,
            // the words in the forms the order used (SH-02); Cook's own word records feed word progress already
            words: (r.words || []).map((x) => ({ id: x.id, kutchi: x.kutchi, english: x.english, right: x.right })),
          });
        },
        /** Cook's own expectation, in this page's coordinates (the frame fills the screen). */
        expect() {
          try {
            const e = win().__cook.expectation();
            if (!e) return null;
            const b = frame.getBoundingClientRect();
            const o = Object.assign({ in: "cook" }, e);
            ["sx", "sx1", "sx2"].forEach((k) => o[k] != null && (o[k] += b.left));
            ["sy", "sy1", "sy2"].forEach((k) => o[k] != null && (o[k] += b.top));
            return o;
          } catch (e) {
            return null;
          }
        },
        destroy() {
          stopped = true;
          try {
            win().Cook && win().Cook.run++;
          } catch (e) {
            /* gone */
          }
          frame.src = "about:blank";
          frame.remove();
        },
      };
    },
  };
}

const labStage = (key, label, gestures) =>
  cookStage(key.replace(/[^a-z0-9-]/g, "-"), { label, gestures, run: (w, ctx) => w.__cook.lab(key, ctx.params.guided !== false, { level: ctx.level }) });

const games = {};
STATIONS.forEach(([key, label, gestures]) => (games[key] = labStage(key, label, gestures)));
RECIPES.forEach(([r, label]) => (games[`recipe-${r}`] = labStage(`recipe:${r}`, `${label} (the whole recipe)`, ["tap", "swipe", "circle", "drag"])));
// story mode's first stage: Nani's pantry list for the dish (only the first time that dish is made today: H15, H49)
games.pantry = cookStage("pantry", { label: "Nani's pantry, for the dish", gestures: ["tap"], run: (w, ctx) => w.__cook.order({ pantry: true, dish: ctx.params.dish || "chai", level: ctx.level }) });
// one customer's order (story: the errand's dish; free play: a dish already taught, chosen by Cook)
games.order = cookStage("order", {
  label: "A customer's order",
  gestures: ["tap", "swipe", "circle", "drag"],
  run: (w, ctx) => w.__cook.order({ dish: ctx.params.dish || null, who: ctx.params.who || null, free: ctx.play && ctx.play.play === "free", level: ctx.level }),
});

export default {
  id: "cook",
  data: [],
  games,
  /**
   * story: one recipe across its stations (the errand's params.dish, chai if none), the pantry first (H49, H50);
   * free: the open kitchen, one customer a round, Next brings the next (free.endless);
   * lab: one station (game) alone, or the story plan as a lab round.
   */
  plan(entry) {
    const p = entry.params || {};
    if (entry.game) return [{ game: entry.game, level: entry.level }];
    if (entry.play === "free") return { game: "open-kitchen", stages: [{ game: "order" }] };
    const dish = p.dish || "chai";
    return { game: `story-${dish}`, stages: [{ game: "pantry", params: { dish } }, { pause: "after-pantry" }, { game: "order", params: { dish } }] };
  },
  lab: () =>
    STATIONS.map(([key, label]) => ({ game: key, label: `Cook: ${label}`, note: "A Station-lab station through the one game host." }))
      .concat(RECIPES.map(([r, label]) => ({ game: `recipe-${r}`, label: `Cook: ${label}, every station`, note: "A whole recipe, every station in turn." })))
      .concat([
        { game: "order", label: "Cook: one customer", note: "One order from a family member, served, then the one end screen." },
        { game: null, label: "Cook: a story round (chai)", note: "Nani's pantry first, then the chai order: one plan, one end screen.", levels: LEVELS },
      ]),
  free: { endless: true },
  actions: ["again", "next", "home"],
  states: () => ["cook/<station>", "results"],
};
