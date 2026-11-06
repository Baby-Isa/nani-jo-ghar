// CHAI-92: the voice gate's proof from a sound log (the sandbox's sound hook, build/sandbox/lib/sound.mjs): no effect longer than a tick
// (120 ms) starts while a voice sounds, and no recorded effect or loop is heard over one (a file's play to its end or stop; a loop's
// heard-on to its heard-off, the "sfx/<name>-loop" rows). A voice is every clip that plays (a family clip or a stand-in file), from
// its start to its end (its play-end, else its length); the device voice (testing only, never in a store build) is counted, not judged.
//   node build/tools/juice/voicegate.mjs <sound-*.json | sandbox run folder | sandbox data .json> ...   exit 1 on any overlap
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";

const Sfx = createRequire(import.meta.url)("../../../js/shared/sfx.js");
const TOL = 150; // ms: the gate polls every 50 ms and fades in 30 ms; a voice clip opens on a breath (spanOf: 40 ms before its first sound)
const files = process.argv.slice(2).flatMap((p) => (statSync(p).isDirectory() ? readdirSync(join(p, "data")).filter((f) => f.endsWith(".json")).map((f) => join(p, "data", f)) : [p]));
let bad = 0;
const tot = { pages: 0, device: 0, voices: 0, effects: 0, files: 0, loops: 0, ducked: 0 };
const names = {};
for (const f of files) {
  const raw = JSON.parse(readFileSync(f, "utf8"));
  const ev = (Array.isArray(raw) ? raw : raw.timeline || []).filter((e) => e && /^(play|play-end|play-dur)$/.test(e.type));
  // the plays by page (a pid is per page)
  const pages = new Map();
  for (const e of ev) {
    const k = e.page || "";
    if (!pages.has(k)) pages.set(k, []);
    pages.get(k).push(e);
  }
  for (const [page, list] of pages) {
    tot.pages++;
    const plays = new Map();
    for (const e of list) {
      if (e.type === "play") plays.set(e.pid, { ...e, end: null });
      else if (e.type === "play-dur" && plays.has(e.pid)) plays.get(e.pid).dur = e.dur;
      else if (e.type === "play-end" && plays.has(e.pid) && plays.get(e.pid).end == null) plays.get(e.pid).end = e.t;
    }
    const all = [...plays.values()];
    // (the device voice stands in for a missing clip while testing only, never in a store build, and the gate does not hear it: the
    // sandbox's browser has no speech, so its line never ends; counted, not judged)
    tot.device += all.filter((p) => p.via === "speechSynthesis").length;
    const voices = all.filter((p) => p.via !== "sfx" && p.via !== "speechSynthesis").map((p) => ({ a: p.t, b: p.end != null ? p.end : p.t + (p.dur || 1) * 1000, what: p.url || p.text }));
    tot.voices += voices.length;
    const over = (a, b) => voices.filter((v) => Math.min(b, v.b) - Math.max(a, v.a) > TOL);
    const during = (t) => voices.filter((v) => t > v.a + 30 && t < v.b - 30);
    for (const p of all.filter((p) => p.via === "sfx")) {
      const u = String(p.url || "");
      if (/^sfx\/(osc|noise):/.test(u)) continue; // a made loop's own buffer (the hook's file-level row), not a sound by name
      if (u.startsWith("sfx/file:")) {
        tot.files++;
        // a recorded effect: from its start to its end or stop (a loop: its stop; its heard span is the -loop rows)
        if (p.loop) continue;
        const b = p.end != null ? p.end : p.t + (p.dur || 0) * 1000;
        const o = over(p.t, b);
        if (o.length) (bad++, console.log(`OVER  ${f.split("/").pop()} ${page}: ${u} ${p.t}-${b} over ${o[0].what}`));
        continue;
      }
      const name = u.replace(/^sfx\//, "");
      if (/-loop$/.test(name)) {
        tot.loops++;
        const b = p.end != null ? p.end : p.t;
        const o = over(p.t, b);
        // (the sizzle's loop is another station's, not gated: listed, never in chai)
        if (o.length && name !== "sizzle-loop") (bad++, console.log(`OVER  ${f.split("/").pop()} ${page}: ${name} heard ${p.t}-${b} over ${o[0].what}`));
        continue;
      }
      tot.effects++;
      names[name] = (names[name] || 0) + 1;
      const len = Sfx.len(name === "ching" ? "coin" : name);
      if (during(p.t).length) {
        if (len <= 120) tot.ducked++;
        else (bad++, console.log(`START ${f.split("/").pop()} ${page}: ${name} (${len} ms) started under ${during(p.t)[0].what}`));
      }
    }
  }
}
console.log(JSON.stringify({ ...tot, names, overlaps: bad }));
process.exit(bad ? 1 : 0);
