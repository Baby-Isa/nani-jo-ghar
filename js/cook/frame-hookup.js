/*
 * R3a's hook-up, moved out of cook.html into its own module (R4, decision 18: the page loads as modules):
 * Cook's camera follows the shared stage (js/shared/stage.js; the same picture on a laptop, and on a
 * tablet the scene may grow to its safe area, data/layout.json stage.scenes.cook). (The light bulb is the
 * shared one, built in js/cook/ui.js since C3: no shim.)
 * R4 (decision 24): each Cook view may have its own safe area in Cook's scene data, in design units
 * (data/scenes/cook-views.json `views[<view>].safe`: what the child must reach in that view), so a tablet
 * grows that view's play items up to data/layout.json's itemScale; layout.json's "cook:<view>" wins over it.
 */
import { Cook } from "./ns.js";

(function () {
  "use strict";
  var Scene = Cook.CookScene;
  if (Scene && window.Stage) {
    Scene.prototype.fitView = function () {
      var gs = this.scale.gameSize, gw = Math.round(gs.width), gh = Math.round(gs.height);
      var scenes = (window.Frame && Frame.layout && Frame.layout.stage && Frame.layout.stage.scenes) || {};
      var own = (Cook.viewScenes || {})[this.viewName] || null;
      var spec = scenes["cook:" + this.viewName] ? Stage.scene("cook:" + this.viewName) : Object.assign(Stage.scene("cook"), own || {});
      var m = Stage.fit({ box: { w: gw, h: gh }, scene: spec, itemScale: Stage.itemScale() });
      var cam = this.cameras.main;
      cam.setSize(gw, gh);
      cam.setOrigin(0, 0);
      cam.setZoom(m.s);
      cam.setScroll(m.view.x0, m.view.y0);
      Cook.view = { left: m.view.x0, top: m.view.y0, right: m.view.x1, bottom: m.view.y1, w: gw, h: gh, ex: m.view.x1 - m.view.x0 - spec.w, ey: m.view.y1 - m.view.y0 - spec.h, s: m.s };
      this.fitBg();
      if (window.UI && UI.onViewFit) UI.onViewFit();
    };
    // a new view (the pantry, a station) has its own safe area: fit again before the station lays out its pieces
    var setBg = Scene.prototype.setBg;
    Scene.prototype.setBg = function (key) { setBg.call(this, key); this.fitView(); };
    // a new form factor (a resize past a tablet's shape) can change the item scale: fit again
    if (window.Frame) Frame.onChange(function () { if (Cook.scene && Cook.scene.fitView) Cook.scene.fitView(); });
  }
  // Cook's own scene data: a safe area per view (loaded with Cook's data, before the first view is fitted)
  if (Cook.onLoad)
    Cook.onLoad.push(function () {
      return fetch(Cook.v("data/scenes/cook-views.json"))
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) { Cook.viewScenes = (d && d.views) || {}; })
        .catch(function () { Cook.viewScenes = {}; });
    });
})();
