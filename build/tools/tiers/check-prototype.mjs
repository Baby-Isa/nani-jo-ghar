#!/usr/bin/env node
// check-prototype (tier 1, "show me": a new screen or mechanic before it is built properly; Zafar, 9-10 Nov). The lab page at the
// four sizes with 0 page errors and no word leaving its card (labcheck.mjs), and a first-play film at the phone size for the
// pictures or gif Zafar sees the same hour. Thin: labcheck.mjs and film.mjs; check-push first.
import { join } from "node:path";
import { mkdirSync } from "node:fs";
import { args, help } from "../review/lib/common.mjs";
import * as T from "./lib.mjs";

const HELP = `
node build/tools/tiers/check-prototype.mjs --lab <page> [--states "q1|q2"] [--until <selector>] [--dry-run]
  Tier 1. e.g. --lab lab.html --states "mode=party-proto&game=balloon&level=1&nonav=1"
  Runs: check-push; labcheck.mjs <page> <states> --sizes the four (screenshots, page errors, spills, a contact sheet; blocks);
  film.mjs --page <page>?<first state> --size ${T.CONFIG.tiers.prototype.film.size} --seconds ${T.CONFIG.tiers.prototype.film.seconds} --video --every 5 --play (a film and a strip, for Zafar).
  Writes build/reports/tiers/prototype-<commit>.json and .md; exit 1 when it fails.`;
const a = args(); help(HELP, a);
const { dry } = T.common(a);
const page = a.val("lab");
if (!page) { console.log(HELP.trim()); process.exit(2); }
const P = T.CONFIG.tiers.prototype;
const states = a.val("states") ? a.val("states").split("|") : [];
const sizes = T.sizesOf(P.sizes);
const id = T.short(T.head()), name = page.replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");
const work = join(T.WORK, `prototype-${id}-${name}`);
const steps = [
  { id: "push", what: "tier 0 first (reused when it passed on this commit)", cmd: "node", argv: ["build/tools/tiers/check-push.mjs"], minutes: 3, blocks: true },
  { id: "labcheck", what: `${page} at the four sizes: page errors, words leaving their cards, a contact sheet`, cmd: "node", argv: ["build/tools/review/labcheck.mjs", page, ...states, "--sizes", sizes.join(","), "--out", T.rel(join(work, "labcheck")), ...(a.val("until") ? ["--until", a.val("until")] : [])], browser: true, minutes: Math.ceil(sizes.length * Math.max(1, states.length) * 0.3) + 1, blocks: true },
  { id: "film", what: `a first-play film at ${P.film.size} (${P.film.seconds} s, tapping what it asks), for Zafar`, cmd: "node", argv: ["build/tools/tiers/film.mjs", "--page", `${page}${states[0] ? `?${states[0]}` : ""}`, "--size", P.film.size, "--seconds", String(P.film.seconds), "--video", "--every", "5", ...(P.film.play ? ["--play"] : []), "--out", T.rel(join(work, "film"))], browser: true, minutes: Math.ceil(P.film.seconds / 60) + 1, blocks: false },
];
if (dry) { T.printPlan("check-prototype (tier 1)", steps, [`page ${page}${states.length ? `, states ${states.join(" | ")}` : ""}`]); process.exit(0); }
const t0 = Date.now();
mkdirSync(work, { recursive: true });
const r = T.newResult("prototype", { games: [page], gamesWhy: "--lab", notes: [], artefacts: {} });
const done = await T.runAll(steps, join(work, "logs"));
r.failures = T.stepFailures(done);
r.artefacts = { "contact sheet": T.rel(join(work, "labcheck", "sheet.png")), film: T.rel(join(work, "film", "film.webm")), strip: T.rel(join(work, "film", "strip.jpg")) };
const res = T.finish(r, done, t0);
process.exit(res.ok ? 0 : 1);
