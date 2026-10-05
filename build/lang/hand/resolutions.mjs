// Clashes between two sources that a written rule or decision already settles: the settled value is used and the entry
// gets a history row (a clash nothing settles stays an open question and goes on the clash list for Zafar and Mum).
export function apply(S) {
  S.resolve("num.1", "lemma", "hakro", "the handout's hikdo for 'one' is superseded: the family says hakro / hakri by gender", "grammar-notes §2; rule G5 (docs/process/rules.md § 8); docs/language/lexicon.md stale points");
  S.resolve("num.2", "lemma", "ba", "the handout's bo for 'two' is superseded: the family says ba (voiced ber)", "grammar-notes §3, §35; rule G5; docs/language/lexicon.md stale points");
  S.resolve("num.2", "status", "confirmed", "two = ba (voiced ber) is settled; data/cook.json still flags it draft", "rule G5 (settled words); grammar-notes §35 (two is ba, confirming §3)");
  S.resolve("n.peas", "lemma", "watana", "no V at the start of a Kutchi word, always W (the content master's vatana)", "grammar-notes Spelling rules from Zafar (25 Sept), §28 (V may appear inside a word); rule G4");
  S.resolve("v.put", "status", "confirmed", "rakh itself is confirmed by Mum's own sentences (thori war rakh, dhyan rakh, saani je agiya rakh); the warning in lexicon §6.1 is about rakhi chad, which stays a draft on its own form", "grammar-notes §16, §25 B16, §27 B49, §38 I18");
  S.resolve("n.skewer", "status", "confirmed", "lakri is Mum's own word (hakri lakri, char lakri, mishkaki ji lakri); data/cook.json's draft flag is about using it with gos, boga and mixed, which is a draft on the Unit rule, not on the word", "grammar-notes §25, §34 P8, §39 I28");
  S.resolve("n.kitchen", "status", "confirmed", "rasoro is Mum's own word (Aau rasore me aiya); only its -e form before a postposition is a draft, and that is the paradigm cell's status", "grammar-notes §20, §51 C61");
  S.resolve("post.mixed-in", "status", "confirmed", "Mum said waari in the 25 Sept recording (dudh waari chai, khun waari chai, kesar waari chai); data/cook.json's draft flag is about its frame lines, which stay drafts", "grammar-notes §6");
}
