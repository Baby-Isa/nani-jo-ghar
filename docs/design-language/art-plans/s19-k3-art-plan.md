# S19 fixes run (s19-k3): the plan

One hand-written block, `s19-k3-chrome-block.txt`: the pieces the last run (s19-k2, `sources/art/s19-k2/results/run-report.txt`)
left unsolved that a game uses. References: `sources/art/s19-k3/refs/` (19 jpg, one drag) and `refs.zip`. Save-as:
`s19-k3-<line>-<try>.png`. Three ChatGPT windows at a time, five chats (CHAT K only if Zafar says yes to KF before the run).

The runner section carries the last run's lessons: the references are filed once in a "Reference Pictures Archive" chat and added
from the library (attachment quota; at most 4 a message); plan in text, then the image, then a short text-only review, then the
edit; the review goes into the image viewer's "Describe edits" (a long review pasted as a chat message failed four times); the
Comment tool, pinned on the object, for spot fixes; the stubborn-picture method (K8r from the start).

| Line | What it fixes | Game | Row |
|---|---|---|---|
| B5r | The four full jugs (flour, milk, sugar, yoghurt) on magenta: s19-k2's B5 was drawn on a wall and marble and could not be cut | baking | CK-84 (baking's pictures); audit (a) jugs |
| B6 | The flour, sugar and salt jars in the house's walnut-lid glass jar, told apart by height and contents, no label | baking | CK-84 ("atto and khun told apart by their picture, waiting on its redraws") |
| D4 | Daar's chopped onion: golden-brown frying and raw, from the golden-skinned onion on the card (the board shows the old red onion, `v3/daar/chop-heap-onion`) | daar | CK-79 ("the onion is one colour on the card and the board"; "not a speck") |
| C12 | Chaat's potato, chickpea and sev layers as loose top-down scatters (today stamped from the bowls and blurred) | chaat | CK-85 ("the scatters: waiting on art, the next run") |
| K10 | Sekelo's plain steel serving tray, long enough for two skewers side by side, no slots or ridges | sekelo | CK-81 ("the served skewer whole on its tray") |
| PH-K8r, K8r | Samosa's karahi as a real wok-shaped karahi (s19-k2's K8 came out as daar's two-handled pot) | samosa | CK-82 ("the pan empty oil"; the samosa seen in its karahi) |
| G1r | The grill redrawn on magenta (added, see below) | sekelo, corn | ART-76 ("the grill's white patches still open") |
| KF (OPTIONAL) | The passed kitchen KG: the island's front a deeper walnut, the marble without pink, the wall less peach; a Comment-tool edit, nothing else changes | every kitchen game's serve | ART-77 |
| KF-O, KF-S (with KF) | The same touch on the ordering and serving views, so the three stay one room (added, see below) | as KF | ART-77 |

ART-73 (naan in four stages) needs no art: s19-k2's B3a and B3b passed; their trays at ~90% of each panel, not 80%, is a code fix (scale both the same), left out.

## What was added beyond the brief, and why

- **G1r, the grill on magenta.** ART-76 is still open on "the grill's white patches": the mini run's G1 was drawn on marble with a
  shadow, and the flood-fill cut (`s19_cut_mini.py`) leaves patches by the handles and a ragged edge (the art audit, corn and sekelo).
  A redraw on magenta is the clean fix; the look stays G1's.
- **KF-O and KF-S.** The ordering and serving views (KO-2, KS-3) were made from KG-4; if KF changes KG's island and marble, the two
  views must take the same three comments or the room changes between moments.
- **B6 has three jars, not two.** The line asked for flour and salt, but in the game `khun` is sugar (chai's "hakro khun = one sugar")
  and `loon` is salt; CK-84 names atto and khun, and baking's shelf shows all three (`shelf-cook-atto-bare-f`,
  `shelf-cook-khun-bare-f`, `shelf-loon-jar-v2-f`). So the line draws flour (tall, matte), sugar (medium, fine sparkle) and salt (short,
  coarse crystals). The walnut-lid jars in `items-s17-stove` are `f-salt-jar` and `f-sugar-jar`; there is no walnut flour jar
  (`f-chapati-flour-atta`, `f-plain-flour-maida` are steel tins), so the flour jar is new.

## Left out (code, not art)

SD1-SD3 served dishes larger than their shares (scale in code when placed); the magenta never exactly #FF00FF (the cutter's
flat-fill and `edge_bleed.py`); B3 trays at 90% (code); corn's six dressing bowls' peachier rims (tint in code, audit).

## The four stages (art bible, section 8)

D4 draws raw and cooked, as Zafar's line asks; the frying stages between (soft, then golden) are D3's onion discs in the pot, and an
overdone onion is not used by daar today. If a game needs it, it is one more panel in a later run.

## After the run

Judge (`artjudge.py`), cut, and move each row above in the cut's commit (`/art-run`).
