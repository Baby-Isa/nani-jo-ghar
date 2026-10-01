// A tiny stand-in for the DOM, enough for the host and input tests in Node (no jsdom here): elements with
// children, a box, events (Node's own EventTarget), dataset and classList.
export class FakeEl extends EventTarget {
  constructor(tag = "div", { id = "", className = "", rect = null } = {}) {
    super();
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.className = className;
    this.children = [];
    this.parent = null;
    this.dataset = {};
    this.hidden = false;
    this.rect = rect || { left: 0, top: 0, width: 100, height: 100 };
    const self = this;
    this.classList = {
      add: (c) => (self.className = [...new Set((self.className + " " + c).trim().split(/\s+/))].join(" ")),
      remove: (c) => (self.className = self.className.split(/\s+/).filter((x) => x !== c).join(" ")),
      contains: (c) => self.className.split(/\s+/).includes(c),
    };
  }
  get isConnected() {
    let n = this;
    while (n.parent) n = n.parent;
    return !!n.isRoot;
  }
  appendChild(c) {
    if (c.parent) c.remove();
    c.parent = this;
    this.children.push(c);
    return c;
  }
  remove() {
    if (!this.parent) return;
    const p = this.parent;
    p.children = p.children.filter((x) => x !== this);
    this.parent = null;
  }
  get childElementCount() {
    return this.children.length;
  }
  getBoundingClientRect() {
    return Object.assign({ right: this.rect.left + this.rect.width, bottom: this.rect.top + this.rect.height }, this.rect);
  }
}

/** A page: body and a root element (the play area), connected. */
export function fakeDoc() {
  const html = new FakeEl("html");
  html.isRoot = true;
  const body = html.appendChild(new FakeEl("body", { rect: { left: 0, top: 0, width: 1366, height: 768 } }));
  const doc = {
    body,
    head: new FakeEl("head"),
    createElement: (t) => new FakeEl(t),
  };
  return doc;
}

/** Fire a pointer event at (x, y). */
export function pointer(el, type, x, y, t = 0, id = 1) {
  const e = new Event(type);
  Object.assign(e, { clientX: x, clientY: y, pointerId: id, button: 0 });
  Object.defineProperty(e, "timeStamp", { value: t });
  el.dispatchEvent(e);
}

/** A stroke: down at the first point, moves, up at the last. points: [[x, y, t]]. */
export function stroke(el, points) {
  pointer(el, "pointerdown", ...points[0]);
  for (const p of points.slice(1)) pointer(el, "pointermove", ...p);
  pointer(el, "pointerup", ...points[points.length - 1]);
}

/** Manual timers: tick(ms) runs what's due. */
export function fakeTimers() {
  let t = 0;
  let n = 0;
  const q = new Map();
  const T = {
    now: () => t,
    setTimeout(f, ms) {
      const id = ++n;
      q.set(id, { at: t + ms, f });
      return id;
    },
    clearTimeout: (id) => q.delete(id),
    setInterval(f, ms) {
      const id = ++n;
      q.set(id, { at: t + ms, f, every: ms });
      return id;
    },
    clearInterval: (id) => q.delete(id),
    async tick(ms) {
      const end = t + ms;
      for (;;) {
        const due = [...q.entries()].filter(([, v]) => v.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
        if (!due) break;
        const [id, v] = due;
        t = Math.max(t, v.at);
        if (v.every) v.at += v.every;
        else q.delete(id);
        v.f();
        await new Promise((r) => setImmediate(r));
      }
      t = end;
      await new Promise((r) => setImmediate(r));
    },
    pending: () => q.size,
  };
  return T;
}

export const flush = () => new Promise((r) => setImmediate(r));
