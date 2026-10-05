// Thin wrapper for the old per-game commands (R7): `node build/leak_find.mjs ...` runs `node build/tools/review/leak.mjs find ...`.
// The config is named after the script (leak_clinic_heal_cut -> leak-configs/clinic-heal-cut.json). A script-adapter config passes
// every flag through to the game's bot; for the heal configs the old `--n N` becomes `--rounds N --l1 N`.
import { spawnSync } from "node:child_process";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const name = basename(process.argv[1]).replace(/^leak_/, "").replace(/\.mjs$/, "").replace(/_/g, "-");
let rest = process.argv.slice(2);
const i = rest.indexOf("--n");
if (i >= 0 && rest[i + 1] !== undefined) rest = [...rest.slice(0, i), "--rounds", rest[i + 1], "--l1", rest[i + 1], ...rest.slice(i + 2)];
const r = spawnSync(process.execPath, [join(dirname(fileURLToPath(import.meta.url)), "leak.mjs"), name, ...rest], { stdio: "inherit" });
process.exit(r.status === null ? 1 : r.status);
