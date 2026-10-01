/*
 * An ADAPTER over Cook (target-model's word: a thin layer that makes old code look like the new interface, so it
 * can be replaced later without the callers noticing): any Cook Station-lab key ("fetch", "chai-tray",
 * "recipe:chai" ...) as a mini-game of the one host (js/shared/host.js), WITHOUT changing a Cook file.
 *
 * How: Cook is a Phaser page with its own DOM, so the adapter runs the real cook.html in a frame filling the
 * screen (screen: "own"), waits for its Station lab, and asks it for one station through Cook's own test hook
 * (__cook.lab, the same call the sandbox uses). Cook's own end-of-round pop-up is caught instead of shown: the
 * host shows the shared end screen ONCE, for the whole plan, and pays through the core. What Cook would have
 * shown (its ticks, hints, time and word review) becomes this stage's result.
 *
 * R4 replaces this: Cook's stations become real mini-games of the host (ctx instead of Cook's globals), on the
 * module page. Until then this is the proof that a Cook mechanic plugs in unchanged.
 *
 *   cookLab("fetch", { id: "pantry", gestures: ["tap"], levels: [1, 2, 3, 4] })
 *   ctx.params: speed (Cook's test speed), guided (false: no first-time coach)
 */
import { rootFrom, stamp } from "./paths.js";

export function cookLab(key, { id = key.replace(/[^a-z0-9-]/g, "-"), gestures = ["tap"], levels = [1, 2, 3, 4], label } = {}) {
  return {
    id,
    gestures, // Cook's own input runs inside its page; declared for E13 and the lab list
    levels,
    screen: "own",
    adapter: { of: "cook", key, label: label || `Cook: ${key}` },
    mount(el, ctx) {
      const frame = document.createElement("iframe");
      frame.className = "njg-adapter-frame";
      frame.title = "Cook";
      frame.setAttribute("allow", "autoplay");
      frame.style.cssText = "position:absolute;inset:0;width:100%;height:100%;border:0;display:block;background:#e9dcc4";
      const q = new URLSearchParams();
      if (ctx.params.speed) q.set("speed", ctx.params.speed);
      frame.src = stamp(`${rootFrom(el.ownerDocument.baseURI)}cook.html${q.toString() ? "?" + q : ""}`);
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
        throw new Error(`cook adapter: Cook didn't get ready (${key})`);
      };
      return {
        frame,
        async start() {
          ctx.test.state("loading");
          await until(() => win().__cook && win().Results && win().document.querySelector("#panel h1"));
          const w = win();
          // Cook's end-of-round pop-up: caught, not shown (the host shows the one end screen)
          let round = null;
          w.Results.show = (o) => {
            round = o;
            const p = Promise.resolve({ action: "done" });
            p.el = null;
            return p;
          };
          ctx.test.state("playing");
          await w.__cook.lab(key, ctx.params.guided !== false, { level: ctx.level });
          if (stopped) return;
          const r = round || { right: 0, total: 0, hints: 0, words: [] };
          const words = (r.words || []).map((x) => ({ id: x.id, kutchi: x.kutchi, english: x.english, right: x.right }));
          ctx.done({
            right: r.right,
            total: r.total,
            marks: r.marks,
            hints: r.hints || 0,
            timeMs: r.timeMs,
            words,
            evidence: words.filter((x) => x.id).map((x) => ({ word: x.id, ok: x.right !== false })),
          });
        },
        /** Cook's own expectation, in this page's coordinates. */
        expect() {
          try {
            const e = win().__cook.expectation();
            if (!e) return null;
            const b = frame.getBoundingClientRect();
            const out = Object.assign({ in: "cook" }, e);
            ["sx", "sx1", "sx2"].forEach((k) => out[k] != null && (out[k] += b.left));
            ["sy", "sy1", "sy2"].forEach((k) => out[k] != null && (out[k] += b.top));
            return out;
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

export default cookLab;
