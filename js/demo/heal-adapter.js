/*
 * An ADAPTER over the clinic's healing games: any game registered with Clinic.Heal.register (cut, knee, ear ...)
 * as a mini-game of the one host (js/shared/host.js), WITHOUT changing a clinic file.
 *
 * How: the host loads the clinic's classic scripts and stylesheet first (needs), then the adapter builds the
 * clinic's own screen (js/clinic/screen.js) in the frame (screen: "own") and mounts the game through the clinic's
 * own heal host (Clinic.HealHost.mount), exactly as the clinic's pipeline and its heal lab do. The game's result
 * (rows right, hints, time, words) becomes this stage's result; the end screen is the host's, once per plan.
 * The adapter clears what the clinic's screen adds to the page (its "?" pop-up, the body class) so the host's
 * E17 check finds nothing left.
 *
 * R5 replaces this: the heal host's ctx is already the model for the host's ctx (clinic-heal-api.md), so a heal
 * game becomes a mini-game of the host directly.
 *
 *   healGame("cut", { id: "scrape", gestures: ["tap", "drag"], levels: [1, 2, 3] })
 *   ctx.params: side, kind (the patient), quiet (no device voice), fast (short waits), onboard (false: none)
 */
import { rootFrom } from "./paths.js";

const CLINIC = ["js/clinic/body.js", "js/clinic/kit.js", "js/clinic/figure.js", "js/clinic/screen.js", "js/clinic/heal/registry.js", "js/clinic/heal/host.js", "js/clinic/heal/scene.js"];

export function healGame(game, { id = game, gestures = ["tap"], levels = [1, 2, 3], label } = {}) {
  return {
    id,
    gestures, // the heal game's own, declared in its register() call
    levels,
    screen: "own",
    adapter: { of: "clinic-heal", key: game, label: label || `Clinic heal: ${game}` },
    needs: { scripts: CLINIC.concat([`js/clinic/heal/games/${game}.js`]), styles: ["css/clinic.css"] },
    mount(el, ctx) {
      const Clinic = globalThis.Clinic;
      if (!Clinic || !Clinic.HealHost || !Clinic.Screen) throw new Error("heal adapter: the clinic's scripts aren't loaded (the game's needs)");
      const doc = el.ownerDocument;
      const bodyBefore = new Set(Array.from(doc.body.children));
      const hadClass = doc.body.classList.contains("clinic");
      doc.body.classList.add("clinic");
      const root = doc.createElement("div");
      root.id = "clinic-root";
      el.appendChild(root);
      let run = null;
      let stopped = false;
      return {
        async start() {
          const Kit = Clinic.Kit;
          // the clinic's paths are from the site root: the page may be anywhere
          Kit.root = rootFrom(doc.baseURI);
          Kit.Voice.quiet = !!ctx.params.quiet;
          Kit.fast = !!ctx.params.fast;
          await Clinic.HealHost.loadBase();
          if (stopped) return;
          const screen = Clinic.Screen.build(root, { level: ctx.level });
          ctx.test.state("playing");
          run = await Clinic.HealHost.mount(screen, game, {
            level: ctx.level,
            side: ctx.params.side || null,
            seed: Math.floor(ctx.rng() * 1e6) + 1,
            kind: ctx.params.kind || "girl",
            onboard: ctx.params.onboard !== false && ctx.params.onboard !== "0",
          });
          const r = await run.result;
          if (stopped) return;
          ctx.done({ right: r.right, total: r.total, hints: r.hints || 0, timeMs: r.timeMs, words: (r.words || []).map((w) => Object.assign({}, w)) });
        },
        /** The game's own "what next" (its debug driver: one call per move). */
        expect() {
          const c = run && run.controller;
          try {
            return c && c.expect ? Object.assign({ in: "clinic-heal" }, c.expect()) : null;
          } catch (e) {
            return null;
          }
        },
        run: () => run,
        destroy() {
          stopped = true;
          try {
            if (run) run.destroy();
          } catch (e) {
            /* the clinic's own teardown */
          }
          root.remove();
          if (!hadClass) doc.body.classList.remove("clinic");
          // what the clinic's screen put on the page itself (the "?" pop-up): it goes with the stage (E17)
          Array.from(doc.body.children)
            .filter((n) => !bodyBefore.has(n) && !n.classList.contains("njg-results"))
            .forEach((n) => n.remove());
        },
      };
    },
  };
}

export default healGame;
