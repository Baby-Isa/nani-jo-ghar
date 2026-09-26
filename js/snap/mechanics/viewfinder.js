/*
 * Snap mechanic: the viewfinder (docs/modes/snap-design.md D3 `viewfinder`,
 * build brief task 2). NEW.
 *
 * A still scene (1.5-2 screens) under a fixed frame in the middle of the
 * stage. The world moves, the frame never does (children tap a still place
 * far better than a moving one: design 2.2). Hands:
 *   - tap-to-centre: a tap swings the view so that point is in the middle of
 *     the frame; on a fruit, aim assist pulls it to the fruit's centre;
 *   - + / -: the zoom steps (no pinch);
 *   - drag to pan (from level 2);
 *   - the shutter, on the camera body (bottom right), with the film left.
 * It emits the frame rectangle and zoom at the shutter; photo.js judges it.
 *
 * Settings (data/snap.json mechanics.viewfinder.levels; the mini-game's level
 * picks which): base {w, h} the frame at zoom 1 in world units; zooms;
 * drag; aimAssist (0..1); hesitateMs; quietMs; shutterMs (the winder).
 *
 *   const vf = Snap.Mech.defs.viewfinder.create({ lay, scene, K, film, onShot, onAct, debug });
 *   vf.setView(cx, cy, zi) · vf.zoom(+1) · vf.tapWorld(x, y) · vf.shutter() · vf.frame() · vf.destroy()
 */
(function (global) {
  const Cook = global.Cook;
  const Snap = global.Snap;
  const Photo = Snap.Photo;
  const Req = Snap.Req;
  const $ = (s) => document.querySelector(s);
  const reduced = () => global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;

  class Viewfinder {
    constructor({ lay, scene, K, film, onShot, onAct, debug }) {
      Object.assign(this, { lay, scene, K, k: K.vf, film, onShot, onAct: onAct || (() => {}), debug: !!debug });
      this.root = $("#vf");
      this.world = $("#vf-world");
      this.frameEl = $("#vf-frame");
      this.enabled = false;
      this.cooling = false;
      this.zi = 0;
      this.cx = lay.w / 2;
      this.cy = lay.h / 2;
      this.handlers = [];
      this.mount();
    }
    mount() {
      this.root.classList.remove("hidden");
      this.root.classList.toggle("can-drag", !!this.k.drag);
      this.els = Snap.drawScene(this.world, this.lay, this.scene, { debug: this.debug });
      this.on(global, "resize", () => this.layout());
      this.on(this.root, "pointerdown", (e) => this.down(e));
      this.on(global, "pointermove", (e) => this.move(e));
      this.on(global, "pointerup", (e) => this.up(e));
      this.on(global, "pointercancel", () => (this.drag = null));
      this.on($("#vf-zoom-in"), "click", () => this.zoom(+1));
      this.on($("#vf-zoom-out"), "click", () => this.zoom(-1));
      this.on($("#vf-shutter"), "click", () => this.shutter());
      $("#tray").innerHTML = "";
      this.setFilm(this.film);
      this.layout();
      this.setView(this.cx, this.cy, 0, { anim: false });
    }
    on(el, ev, fn) {
      el.addEventListener(ev, fn);
      this.handlers.push([el, ev, fn]);
    }
    destroy() {
      this.handlers.forEach(([el, ev, fn]) => el.removeEventListener(ev, fn));
      this.handlers = [];
      this.root.classList.add("hidden");
      this.world.innerHTML = "";
    }
    enable(on) {
      this.enabled = on;
      this.root.classList.toggle("live", on);
    }

    /* ---- geometry: the 1600x900 design fitted in the stage; the frame in its middle ---- */
    layout() {
      const r = this.root.getBoundingClientRect();
      this.sw = r.width;
      this.sh = r.height;
      this.s = Math.min(r.width / 1600, r.height / 900);
      const fw = this.k.base.w * this.s;
      const fh = this.k.base.h * this.s;
      Object.assign(this.frameEl.style, { width: `${fw}px`, height: `${fh}px`, left: `${(this.sw - fw) / 2}px`, top: `${(this.sh - fh) / 2}px` });
      this.apply(false);
    }
    get zoomV() {
      return this.k.zooms[this.zi];
    }
    get S() {
      return this.s * this.zoomV;
    }
    /** Keep the frame inside the orchard (the same clamp as Photo.frameAt). */
    clamp() {
      const fw = this.k.base.w / this.zoomV;
      const fh = this.k.base.h / this.zoomV;
      this.cx = Cook.clamp(this.cx, fw / 2, this.lay.w - fw / 2);
      this.cy = Cook.clamp(this.cy, fh / 2, this.lay.h - fh / 2);
    }
    apply(anim = true) {
      const S = this.S;
      const tx = this.sw / 2 - this.cx * S;
      const ty = this.sh / 2 - this.cy * S;
      this.world.style.transition = anim && !reduced() ? "transform 220ms cubic-bezier(.3,.7,.3,1)" : "none";
      this.world.style.transform = `translate(${tx}px, ${ty}px) scale(${S})`;
    }
    setView(cx, cy, zi = this.zi, { anim = true } = {}) {
      this.cx = cx;
      this.cy = cy;
      this.zi = Cook.clamp(zi, 0, this.k.zooms.length - 1);
      this.clamp();
      this.apply(anim);
      $("#vf-zoom-in").disabled = this.zi >= this.k.zooms.length - 1;
      $("#vf-zoom-out").disabled = this.zi <= 0;
    }
    screenToWorld(x, y) {
      const r = this.root.getBoundingClientRect();
      const S = this.S;
      return [this.cx + (x - r.left - this.sw / 2) / S, this.cy + (y - r.top - this.sh / 2) / S];
    }
    worldToScreen(x, y) {
      const r = this.root.getBoundingClientRect();
      const S = this.S;
      return [r.left + this.sw / 2 + (x - this.cx) * S, r.top + this.sh / 2 + (y - this.cy) * S];
    }
    frame() {
      return Photo.frameAt(this.cx, this.cy, this.zoomV, this.k.base, { w: this.lay.w, h: this.lay.h });
    }
    state() {
      return { cx: this.cx, cy: this.cy, zi: this.zi, zoom: this.zoomV, film: this.film, frame: this.frame() };
    }

    /* ---- hands ---- */
    down(e) {
      if (!this.enabled || e.target.closest("button, #tray, .print")) return;
      this.drag = { x: e.clientX, y: e.clientY, cx: this.cx, cy: this.cy, moved: false };
    }
    move(e) {
      const d = this.drag;
      if (!d) return;
      const dx = e.clientX - d.x;
      const dy = e.clientY - d.y;
      if (!d.moved && Math.hypot(dx, dy) < 10) return;
      d.moved = true;
      if (!this.k.drag) return; // level 1: no panning by hand; the tap still works
      this.cx = d.cx - dx / this.S;
      this.cy = d.cy - dy / this.S;
      this.clamp();
      this.apply(false);
      this.onAct("drag");
    }
    up(e) {
      const d = this.drag;
      this.drag = null;
      if (!d || !this.enabled) return;
      if (d.moved && this.k.drag) return;
      if (d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 24) return;
      const [x, y] = this.screenToWorld(e.clientX, e.clientY);
      this.tapWorld(x, y);
    }
    /** Tap-to-centre, with aim assist onto a tapped fruit. */
    tapWorld(x, y) {
      const [cx, cy] = Req.tapCentre(x, y, this.lay.spots, this.k.aimAssist);
      this.setView(cx, cy);
      this.onAct("tap");
    }
    zoom(dir) {
      if (!this.enabled) return;
      Cook.sfx.pop();
      this.setView(this.cx, this.cy, this.zi + dir);
      this.onAct("zoom");
    }
    setFilm(n) {
      this.film = n;
      const total = Math.max(n, this.filmTotal || 0);
      this.filmTotal = total;
      $("#vf-shutter .vf-film").innerHTML = Array.from({ length: total }, (_, i) => `<i class="${i < n ? "on" : ""}"></i>`).join("");
      $("#vf-shutter").disabled = n <= 0;
    }
    addFilm(n) {
      this.filmTotal = this.film + n;
      this.setFilm(this.film + n);
    }
    /** The shutter: a click and a flash, never a judgement. */
    shutter() {
      if (!this.enabled || this.cooling || this.film <= 0) return null;
      const frame = this.frame();
      const print = Photo.printRecord(this.lay.spots, frame);
      Cook.sfx.click();
      const f = $("#vf-flash");
      f.classList.remove("on");
      void f.offsetWidth;
      f.classList.add("on");
      this.setFilm(this.film - 1);
      this.cooling = true;
      setTimeout(() => (this.cooling = false), (this.k.shutterMs || 700) / Cook.speed);
      const shot = { frame, print, view: { cx: this.cx, cy: this.cy, zoom: this.zoomV } };
      this.onAct("shot");
      if (this.onShot) this.onShot(shot);
      return shot;
    }
  }

  Snap.Mech.define("viewfinder", { create: (opts) => new Viewfinder(opts) });
  Snap.Viewfinder = Viewfinder;
})(window);
