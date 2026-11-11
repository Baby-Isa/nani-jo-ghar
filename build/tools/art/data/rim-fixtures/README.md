# The pink rim's real bad cut

`bataato-02b28a678.webp` is `assets/cook/items/v4/chaat/bataato.webp` as it was before the edge fix
(`git show 02b28a678:assets/cook/items/v4/chaat/bataato.webp`; 35% of its soft edge magenta-tinted). The art check's rim
measure (`artcolour.py --rim`, `artcheck.mjs` rim) must go red on it and green on the same cut at HEAD, after `edge_bleed.py`
(ART-76); `artcheck.test.mjs` holds both.
