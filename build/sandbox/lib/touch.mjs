// Real touch for the players' canvas gestures. On a phone or tablet context (hasTouch, isMobile) Playwright's page.mouse still sends
// mouse events; this replaces page.mouse with one that sends touch events through the DevTools protocol (touchStart, touchMove,
// touchEnd), so a drag, a hold or a circle is what a finger does. DOM buttons clicked with page.click() are left as they are.
export async function installTouch(page, ctx) {
  const cdp = await ctx.newCDPSession(page);
  let x = 0, y = 0, down = false;
  const pt = () => ({ x, y, id: 1, radiusX: 2, radiusY: 2, force: 1 });
  const send = (type, pts) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: pts });
  const mouse = {
    async move(nx, ny, o = {}) {
      const steps = Math.max(1, (o && o.steps) || 1);
      const x0 = x, y0 = y;
      for (let s = 1; s <= steps; s++) {
        x = x0 + (nx - x0) * s / steps; y = y0 + (ny - y0) * s / steps;
        if (down) await send("touchMove", [pt()]);
      }
    },
    async down() { if (down) return; down = true; await send("touchStart", [pt()]); },
    async up() { if (!down) return; down = false; await send("touchEnd", []); },
    async click(cx, cy, o = {}) {
      x = cx; y = cy;
      await mouse.down();
      if (o && o.delay) await new Promise((r) => setTimeout(r, o.delay));
      await mouse.up();
    },
    async dblclick(cx, cy) { await mouse.click(cx, cy); await mouse.click(cx, cy); },
    async wheel() {},
  };
  Object.defineProperty(page, "mouse", { value: mouse, configurable: true });
  page.__touch = true;
}
