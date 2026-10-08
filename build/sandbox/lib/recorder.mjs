// Records each visually distinct state of a flow: a screenshot and a lint pass, at the current size.
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { lintPage } from "../../lint/layout.mjs";
import { lintPhaser } from "../../lint/phaser.mjs";

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

export class Recorder {
  constructor({ flow, size, dir, page }) {
    this.flow = flow; this.size = size; this.page = page;
    this.dir = join(dir, slug(flow), size);
    mkdirSync(this.dir, { recursive: true });
    this.states = [];
    this.t0 = Date.now();
    this.names = new Map();
    this.stops = [];      // where the flow could not go on, and why
    this.notes = [];
    this.pending = [];    // findings the player noticed itself (a tap that was covered), attached to the next recorded state
  }
  // a finding the player saw while playing: {check, selector, measured, text}
  pend(check, selector, measured, text = "") { if (!this.pending.some((p) => p.check === check && p.selector === selector)) this.pending.push({ check, selector, measured, text }); }
  pagePath() { try { return new URL(this.page.url()).pathname.replace(/^\//, "") || "?"; } catch (e) { return "?"; } }
  // name: a stable, human name for the state. opts.settle: ms to wait first (animations)
  async state(name, opts = {}) {
    const page = this.page;
    if (opts.settle) await page.waitForTimeout(opts.settle);
    try { await page.evaluate(() => document.fonts && document.fonts.ready); } catch (e) { /* navigating */ }
    const n = (this.names.get(name) || 0) + 1;
    this.names.set(name, n);
    const unique = n > 1 ? `${name}-${n}` : name;
    const idx = String(this.states.length + 1).padStart(2, "0");
    const shot = `${idx}-${slug(unique)}.png`;
    let findings = [];
    let shotOk = true;
    try { await page.screenshot({ path: join(this.dir, shot), animations: "allow", timeout: 15000 }); } catch (e) { shotOk = false; this.notes.push(`screenshot of ${unique} failed: ${e.message.split("\n")[0]}`); }
    // two lint passes 300 ms apart; only what is on screen in both counts (an animation half-way through is not a finding)
    try {
      const both = async () => [...(await lintPage(page)), ...(await lintPhaser(page).catch(() => []))];
      const a = await both();
      await page.waitForTimeout(300);
      const b = await both();
      const inB = new Map(b.map((f) => [f.check + "|" + f.selector, f]));
      findings = a.filter((f) => inB.has(f.check + "|" + f.selector)).map((f) => inB.get(f.check + "|" + f.selector));
    } catch (e) { this.notes.push(`lint of ${unique} failed: ${e.message.split("\n")[0]}`); }
    for (const p of this.pending.splice(0)) if (!findings.some((f) => f.check === p.check && f.selector === p.selector)) findings.push(p);
    const pg = this.pagePath();
    this.states.push({ name: unique, page: pg, shot: shotOk ? shot : null, findings: findings.map((f) => ({ ...f, page: pg })), note: opts.note || "", at: Date.now() - this.t0 });
    return unique;
  }
  // the contract probe's moments (a bubble, the badges, a ✓ or Next, a pop-up, a stage boundary): a plain screenshot at once, so a
  // contract break has the shot of its own moment (not linted, not a state). At most one per kind every 300 ms, 80 a page
  contractShot(e) {
    if (!e || e.type !== "c" || !/^(bubble|badges|buttons|popup|stage|input)$/.test(e.k)) return;
    if (e.k === "buttons" && !(e.list && e.list.length)) return;
    if (e.k === "input" && !e.next) return;
    this.cshots = this.cshots || [];
    this.clast = this.clast || {};
    if (this.cshots.length >= 80 || (this.clast[e.k] && e.t - this.clast[e.k] < 300)) return;
    this.clast[e.k] = e.t;
    const shot = `c${String(this.cshots.length + 1).padStart(2, "0")}-${e.k}.png`;
    const entry = { t: e.t, k: e.k, shot };
    this.cshots.push(entry);
    this.page.screenshot({ path: join(this.dir, shot), animations: "allow", timeout: 5000 }).catch(() => { entry.shot = null; });
  }
  stop(reason) { this.stops.push(reason); }
  note(s) { if (!this.notes.includes(s)) this.notes.push(s); }
}
