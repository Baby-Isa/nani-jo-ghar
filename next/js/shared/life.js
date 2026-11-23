/*
 * A scene's lifetime. The runner gives each scene one as its view starts drawing, and ends it as the scene is left (or
 * skipped), before the view is told to close. Everything a scene starts while it plays goes through its lifetime, and
 * ends with it: a wait never settles, a delayed call never comes, a tween stops where it is, a frame-by-frame or resize
 * listener and a tap are let go of, a task's `finally` runs. So nothing a scene started can run on into the next scene,
 * and no scene keeps its own "am I still on?" switch to check after each wait (the 23 Nov freeze: a person's talk kept
 * flapping on a picture the next scene had taken down). It is the one door to the stage's clock and taps: the page, the
 * round and each kit piece have one too, the lifetime of whoever made them (the page's never ends).
 *
 * A scene's steps that wait on one another run as a task: a generator whose every `yield` waits on a promise (a voice, a
 * card's flight, a wait), and which is not stepped on once its lifetime is over. So the end of a scene stops it at
 * whichever wait it is in, with nothing to check.
 *
 * MIND: a wait or tween of a lifetime that has ended never settles. Inside a task that is the point; but a plain `await`
 * on one, or on anything that awaits one, goes no further, silently, and whatever waits on that hangs (a view's closing
 * awaiting it would hold up the round). So a scene's steps run as tasks (`go`), whose promise settles as the lifetime ends,
 * and only a task or a delayed call (`.then`) waits on a lifetime's wait; one asked for after the end warns in development.
 *
 *   const life = createLife(clock)    clock: { later(ms, fn) -> cancel, tween(obj, props, ms, ease, done) -> stop,
 *                                              tick(fn) -> off, resize(fn) -> off, tap(target, fn) -> off }   (the stage's)
 *   life.go(function* (life) { ...; yield promise; ... }) -> Promise   a task, handed its lifetime: settles with what it
 *       returns, or as the lifetime ends (so whoever waits on it, the runner or a chain, goes on; the task itself goes no
 *       further than its `finally`)
 *   life.wait(ms) -> Promise      life.tween(obj, props, ms, ease) -> Promise      (neither settles once the lifetime is over)
 *       props may carry the tween's own settings too (onUpdate, yoyo, repeat: -1 for one that runs until the lifetime ends)
 *   life.onTick(fn(ms)) -> off    life.onResize(fn) -> off    life.onTap(target, fn) -> off    life.onEnd(fn) -> off
 *   life.child() -> a lifetime of its own that also ends with this one (a part of a scene that may stop sooner)
 *   life.end()                    the runner's (or a child's owner's): everything above ends, once
 * The view's closing (its leave) is after the lifetime, on a lifetime of its own that the runner ends once it has closed.
 */
import { build } from "../core/env.js";

// (a store build says nothing on the console)
const late = (what) => build() !== "store" && console.warn(`life: a ${what} asked for after its lifetime ended never settles; run the steps that wait as a task (life.go)`);

export function createLife(clock) {
  let over = false;
  const ends = new Set();
  /** Keep `stop` until the lifetime ends; returns the way to let go of it sooner. */
  function own(stop) {
    if (over) {
      stop();
      return () => {};
    }
    ends.add(stop);
    return () => ends.delete(stop);
  }

  const life = {
    go(make) {
      const it = typeof make === "function" ? make(life) : make;
      return new Promise((resolve, reject) => {
        // (as the lifetime ends the task is ended where it waits, so its `finally` runs; one ended from inside its own step
        // cannot be, and simply goes no further)
        const off = own(() => {
          try {
            it.return();
          } catch (e) {
            /* ended from inside its own step */
          }
          resolve();
        });
        const step = (how, value) => {
          if (over) return;
          let r;
          try {
            r = it[how](value);
          } catch (e) {
            off();
            return reject(e);
          }
          if (r.done) {
            off();
            return resolve(r.value);
          }
          Promise.resolve(r.value).then((v) => step("next", v), (e) => step("throw", e));
        };
        step("next");
      });
    },
    wait(ms) {
      return new Promise((resolve) => {
        if (over) return void late("wait");
        let off = null;
        off = own(clock.later(ms, () => (off && off(), resolve())));
      });
    },
    tween(obj, props, ms, ease) {
      return new Promise((resolve) => {
        if (over) return void late("tween");
        let off = null;
        // (a tween of no time is done at once, before it could be kept)
        let done = false;
        off = own(clock.tween(obj, props, ms, ease, () => ((done = true), off && off(), resolve())));
        if (done) off();
      });
    },
    onTick: (fn) => own(clock.tick(fn)),
    onResize: (fn) => own(clock.resize(fn)),
    onTap: (target, fn) => own(clock.tap(target, fn)),
    onEnd: (fn) => own(fn),
    child() {
      const c = createLife(clock);
      c.onEnd(own(() => c.end()));
      return c;
    },
    end() {
      if (over) return;
      over = true;
      const all = [...ends];
      ends.clear();
      all.forEach((fn) => fn());
    },
  };
  return life;
}
