// Clashes between two sources that a written rule or decision already settles: the settled value is used and the entry
// gets a history row (a clash nothing settles stays an open question and goes on the clash list for Zafar and Mum).
export function apply(S) {
  S.resolve("num.1", "lemma", "hakro", "the handout's hikdo for 'one' is superseded: the family says hakro / hakri by gender", "grammar-notes §2; rule G5 (docs/process/rules.md § 8); docs/language/lexicon.md stale points");
  S.resolve("num.2", "lemma", "ba", "the handout's bo for 'two' is superseded: the family says ba (voiced ber)", "grammar-notes §3, §35; rule G5; docs/language/lexicon.md stale points");
  S.resolve("num.2", "status", "confirmed", "two = ba (voiced ber) is settled; data/cook.json still flags it draft", "rule G5 (settled words); grammar-notes §35 (two is ba, confirming §3)");
  S.resolve("n.peas", "lemma", "watana", "no V at the start of a Kutchi word, always W (the content master's vatana)", "grammar-notes Spelling rules from Zafar (25 Sept), §28 (V may appear inside a word); rule G4");
}
