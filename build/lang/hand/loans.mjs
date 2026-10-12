// Borrowed words (decision 87, 12 Oct; LNG-13): English words the family uses in Kutchi are Kutchi. Each confirmed one is
// marked loan: "en", so every checker, lint and reviewer reads it as Kutchi, never as English for the child. Only the
// loans Zafar named are marked here; every other English-looking word is on the borrowing audit (build/reports/s05b-words.md)
// for Zafar and Mum to confirm first (never a guess, non-negotiable 4). Applied after settle(), like confirmed.mjs.
const D87 = "decision 87 (Zafar, 12 Oct): English words the family uses in Kutchi are Kutchi, marked loan: \"en\"";
export const LOANS = [
  ["n.mixed", "mixed: Mum 26 Sept (B18), named by Zafar in decision 87"],
  ["n.cup", "cup: grammar-notes §35 C1, §40 C24 (wadha cup), named by Zafar in decision 87"],
  ["n.film", "film: grammar-notes, Zafar's corrections to A5-A7 (film khalas thai vai), named by Zafar in decision 87"],
  ["phrase.thank-you-the-english-words-the-family-says-them", "thank you: Zafar 26 Sept (Conversations), decisions 81 and 87"],
  ["phrase.no-thank-you", "na, thank you: grammar-notes §23 (the English 'thank you'), decisions 81 and 87"],
  // the borrowing audit (S05-B): words whose source already says "the English word"; Zafar said yes, 12 Oct
  ...["n.chips-english", "n.glass", "n.shelf", "n.table", "n.time", "v.help", "v.mix", "adv.slow"].map((id) => [id, "its source says the family uses the English word; Zafar's yes to the borrowing audit, 12 Oct"]),
];
// on the audit but not confirmed: a draft, and a question on Mum's list (Zafar, 12 Oct)
const ASK_MUM = [["n.peach", "Is 'peach' the word the family uses (an English loan), or is there a Kutchi word? (borrowing audit, Zafar 12 Oct)"]];
// for the borrowing audit (build/lang/loan-audit.mjs): words English took from South Asia (a checker may read them as
// English; they are not loans from English), and the game's own names whose gloss is the word itself
export const SOUTH_ASIAN = new Set(["chai", "chaat", "chutney", "ghee", "kebab", "keema", "samosa", "sev", "tawa", "bhajiya", "garam", "masalo"]);
export const OWN = new Set(["mishkaki", "sekelo", "mmm"]);
// decision 87 (3): the unconfirmed draft 'aabhar aanjo' for Thank you goes; its game lines are the family's "thank you"
const DROP = { id: "phrase.thank-you", into: "phrase.thank-you-the-english-words-the-family-says-them" };

export function apply(S) {
  for (const [id, why] of LOANS) {
    const e = S.entries.get(id);
    if (!e) {
      S.errors.push(`hand/loans.mjs: no entry ${id}`);
      continue;
    }
    e.loan = "en";
    e.src = [...new Set([...(Array.isArray(e.src) ? e.src : [e.src].filter(Boolean)), `${D87}; ${why}`])];
  }
  for (const [id, q] of ASK_MUM) {
    const e = S.entries.get(id);
    if (e) e.open = [...(e.open || []), { q, src: "S05-B borrowing audit; Zafar, 12 Oct" }];
  }
  // the grown-ups' English (the bulb, Mum's sheet): "mixed" has no English plural ("two skewers of mixed", never
  // "mixeds", SH-52); the automatic -s plural is made only where none is given
  const mixed = S.entries.get("n.mixed");
  if (mixed) mixed.glossPl = "mixed";
  const old = S.entries.get(DROP.id);
  const into = S.entries.get(DROP.into);
  if (old && into) {
    into.aliases = [...new Set([...(into.aliases || []), ...(old.aliases || [])])];
    into.history = [...(into.history || []), { date: "2026-10-12", change: `took over the lines of the dropped draft '${old.lemma}' (${(old.aliases || []).join(", ")})`, src: "decisions 81 and 87" }];
    S.entries.delete(DROP.id);
  }
}
