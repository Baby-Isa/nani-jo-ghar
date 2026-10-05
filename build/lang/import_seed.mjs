// Layer 0: the cited grammar the 4a seed holds (grammar-notes §1-§52: the first 38 words, the 5 word classes, the
// 16 meanings and their rules). The seed stays in data/lang/test-seed/ for the tests (the paradigms now come from data/lang/seed/paradigms.json); this importer copies it into
// the store as the base layer, so a fix goes into a hand file (build/lang/hand/) or a source, never by editing data/lang/.
import { readJSON, RANK } from "./lib.mjs";

export function importSeed(S) {
  const src = "4a seed (grammar-notes, cited per entry)";
  const lex = readJSON("data/lang/test-seed/lexicon.json").entries;
  for (const e of lex) S.add({ ...e }, { source: src, rank: RANK.hand });
  const par = readJSON("data/lang/seed/paradigms.json").paradigms;
  for (const id of Object.keys(par)) S.paradigms[id] = JSON.parse(JSON.stringify(par[id]));
  const abs = readJSON("data/lang/test-seed/abstract.json").functions;
  for (const id of Object.keys(abs)) S.functions[id] = JSON.parse(JSON.stringify(abs[id]));
  const lin = readJSON("data/lang/test-seed/concrete.json").lin;
  for (const id of Object.keys(lin)) S.lin[id] = JSON.parse(JSON.stringify(lin[id]));
  return { entries: lex.length, paradigms: Object.keys(par).length, meanings: Object.keys(abs).length };
}
