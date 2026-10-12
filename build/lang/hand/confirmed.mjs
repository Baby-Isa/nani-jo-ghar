// Confirmations that used to live only in data/lang/lexicon.json (set by hand there, so a rebuild demoted them to
// draft: S05 plan, flaw 2). Each word was recorded by Mum and its take picked by Zafar (S02-D2, blind-verified
// clips in data/family-audio.json), which is the family's word on it (fill-the-engine.md: Mum said it, Zafar
// confirms the spelling). Nothing new is claimed here: these are the same eight entries, now with their source.
// Applied after settle() (status: the worst source wins there), so a draft flag elsewhere can never demote them.
const FA = "data/family-audio.json";
export const CONFIRMED = [
  ["n.mince", "chundo: Zafar 26 Sept (grammar-notes §26, B33), correcting the recording's chindo; Mum's take picked by Zafar", `${FA} chundo (B33); grammar-notes §26`],
  ["n.onion", "dungri: Mum recorded it and its count (trae dungri, Round 3 P2, 28 Sept); Zafar picked the take", `${FA} dungri (P2); grammar-notes §34`],
  ["n.tomato", "tameto: Mum recorded it (Round 3 P3, 28 Sept); Zafar picked the take as the game's spelling (its plural stays an open question, Q14)", `${FA} tameto (P3); grammar-notes §34 P3`],
  ["phrase.ali", "Ali!: Mum's call by name (Round 3 K14, 28 Sept); Zafar picked the take", `${FA} ali (K14); grammar-notes §30`],
  ["phrase.nana", "Nana!: Mum's call by name (Round 3 K14, 28 Sept); Zafar picked the take", `${FA} nana (K14); grammar-notes §30`],
  ["phrase.nani", "Nani!: Mum's call by name (Round 3 K14, 28 Sept); Zafar picked the take", `${FA} nani (K14); grammar-notes §30`],
  ["phrase.here-by-you", "hida: Mum recorded it (A8.11, 26 Sept); Zafar's spelling (hida, not ida) and his pick of the take", `${FA} hida (A8.11); grammar-notes §17, §23`],
  ["phrase.there-over-there", "huda: Mum recorded it (A8.11, 26 Sept); Zafar picked the take", `${FA} huda (A8.11); grammar-notes §17, §23`],
];

export function apply(S) {
  for (const [id] of CONFIRMED) {
    const e = S.entries.get(id);
    if (!e) S.errors.push(`hand/confirmed.mjs: no entry ${id} to confirm`);
    else e.status = "confirmed";
  }
}
