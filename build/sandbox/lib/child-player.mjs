// A child's pace (Sprint 17, chai's frozen run; Fable's review 7 Nov: "test speed hides chai's timing races: the lesson race, the
// skip, the next-pan light"): the fair player at the game's real speed (speed 1), with a human's think time before every move (0.9 to
// 2.4 s, the same sequence every run: a seeded walk), and never a tap while the light is still arriving (it waits for the lit box).
// Used by the flows lab:cook/<game>@L<n>#child (flows/labs.mjs). Its own file, so cook-player.mjs keeps one owner.
import { CookPlayer } from "./cook-player.mjs";
import { sleep } from "./env.mjs";

const CALM = ["tap", "hold", "count", "more", "swipe", "roll", "knead", "stir", "drag"];
export class ChildPlayer extends CookPlayer {
  constructor(page, rec, opts = {}) {
    super(page, rec, { ...opts, mode: "child" });
    this.helped = true; // no "?" round: a child does not open the grown-ups' door mid-order
    this.seedWalk = 7;
    this.thought = 0;
  }
  think() {
    this.seedWalk = (this.seedWalk * 1103515245 + 12345) % 2147483648;
    return 900 + (this.seedWalk % 1500);
  }
  async driverMove(e) {
    if (e && !e.intro && e.kind !== "wait" && CALM.includes(e.kind)) {
      const ms = this.think();
      this.thought += ms;
      await sleep(ms);
    }
    return super.driverMove(e);
  }
}
