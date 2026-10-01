// `node --test build/host/` runs this file, which loads every build/host/*.test.mjs (one process).
// The same tests run one by one with: node --test build/host/*.test.mjs
const { readdirSync } = require("node:fs");
const { join } = require("node:path");
const { pathToFileURL } = require("node:url");
for (const f of readdirSync(__dirname).filter((f) => f.endsWith(".test.mjs")).sort()) import(pathToFileURL(join(__dirname, f)).href);
