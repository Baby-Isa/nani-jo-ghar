# Decisions: the lasting ones

Zafar's decisions that still stand, numbered as they were made, each with its date, a one-line why and the rule it became. **The newest word from Zafar wins:** if a new decision clashes with one here, strike the old one through and point to the new one. A decision that changes a rule updates `docs/process/rules.md` in the same commit.

**What goes where (decision 49).** A lasting decision becomes a rule and a line here. A small decision (a sprint's own choices, a number, a one-off) lives in that sprint's file, `docs/sprints/Snn-<name>.md`. The numbers below skip the sprint-only ones; they are in `docs/sprints/S01-remedial-and-engine.md` (decisions 19, 21b, 23b, 28, 30–32, 35, 37, 38, 42–45). Everything before 5 Oct, in full, with Claude's working assumptions, is in `docs/archive/decisions/`.

To add one: a new row at the end, `| n | date | decision | why | rule |`.

| # | Date | Decision | Why | Rule |
|---|---|---|---|---|
| 1 | 30 Sept | Hints cost lightbulbs (the hints badge); nothing costs an ear star. | One simple model the child can feel. | E25 |
| 2 | 30 Sept | The voice star goes; correct speaking earns more pocket money, and the child isn't told the mechanism. | Praise without a verdict. | H5 |
| 3 | 30 Sept | The accuracy tick fills gold or grey, not green or red. | Progress, not verdicts. | F13 |
| 4 | 30 Sept | The quilt becomes Big Ma's quilt-making arc; the progress marker is a bookshelf with one named book per finished arc. | A book is a story the child made. | H39, I14 |
| 5 | 30 Sept | *mirchi* only, no plural, for now; Zafar confirms with Mum. | Unconfirmed forms are not invented. | G25 |
| 6 | 30 Sept | Everything stays public (repo, recordings) until the game or landing page is published; then revisit. | Nothing is hidden before anyone looks. | J1 |
| 7 | 30 Sept | Commercial model open: £2 a month with the first arc free, or free to the community. | The landing page needs it; no rule yet. | open, status.md |
| 8 | 30 Sept | Mithai at a celebration is fine; never lollies, biscuits or sweets as rewards (an apple instead). | The family's values. | I2 |
| 9 | 30 Sept | Unattended runs may make art of family members; all consent is given; Zafar supervises only each person's first character sheet. | Keeps art runs hands-free. | D12 |
| 10 | 30 Sept | Pocket money pays by volume × quality × difficulty; upgrade prices make one affordable every 2–3 games at first, then 4–5. | Doing well earns more, without explaining it. | §4 scoring |
| 11 | 30 Sept | Big Ma is called "Big Ma"; quilt-making and making outfits are two Big Ma arcs. | What the family says. | I7 |
| 12 | 30 Sept | No written English for the child, ever; story mode may speak English and then repeat in Kutchi. | The child learns from hearing and seeing. | E1, G15 |
| 13 | 30 Sept | Every word heard is a human recording, but the engine builds the sentence; the most-used phrases are recorded whole. | Natural Kutchi, family voices. | G9, G12 |
| 14 | 30 Sept | Hand over at step boundaries and about 70% context, not when the chat is full. | Compaction mid-task loses detail. | A25 |
| 15 | 30 Sept | Phones are shot in landscape: 844×390 main, 800×360 in the full matrix, one upright shot for the rotate card. | The most-used phone sizes. | C2 |
| 16 | 1 Oct | The orchestrator owns the regression list and reports open rows at every step end; one line to Zafar at every check-in. | He never has to track feedback. | §1 |
| 17 | 1 Oct | The language engine is a Kutchi engine: GF's design in our own small JavaScript engine; Sindhi only as a structural reference; the Excel is retired. | Mum is the only evidence. | G10 |
| 18 | 1 Oct | The target model is approved: a core, the shared kit, content as data, modes as plug-ins. | One clean, scalable codebase. | J6, J7 |
| 20 | 1 Oct | Screenshots and report images are not committed; the clinic's coins join the one purse; no wages; browser tests run in Node; the layout lint only gets stricter. | Site under 1 GB; never lose what you earned. | B19, B16, C11 |
| 21 | 1 Oct | An unconfirmed noun gender takes the he-form, is flagged "to check", is never recorded whole and never ships. | Mum's rule of thumb, kept honest. | G2 |
| 22 | 1 Oct | Story mode and free play; the free-play map shows every place, locked ones saying which story opens them. | A child can always see what's ahead. | H56, H57 |
| 23 | 1 Oct | Word books (a picture dictionary by topic) sit on the shelf beside the story books. | Words met become a keepsake. | §5 |
| 24 | 1 Oct | No gaps in the checks; tablets are first-class; layout is built to scale, not patched. | Every size is played. | C2, C11, F18 |
| 25 | 1 Oct | The sidebar and its text scale with the screen; the order card can lay short rows out as pills, set per screen size in data. | Flexible, not locked. | F9, F10 |
| 26 | 1 Oct | Stitched speech everywhere until the pre-publish quality pass; whole-phrase clips are switched off until then. | The engine is tested everywhere. | G12 |
| 27 | 1 Oct | The clinic's heal games follow the 1 Oct report §10 with Zafar's changes. | A design, so it lives in `modes/clinic.md`. | clinic.md |
| 29 | 5 Oct | Zafar approves art only for characters based on real people; everything else is judged pass/fail by the runner and Claude; art runs need no manual steps. | Only he can judge a likeness. | D3, D12 |
| 33 | 5 Oct | The release cycle: art finished → wired → full checks → publish to `main` → Zafar plays → fixes → round again. He plays only what is live on `main`. | No half-wired previews. | B20 |
| 34 | 5 Oct | The pre-publish check covers only what changed since the last gate, plus what a shared-file change reaches. | No repeat of unchanged screens. | B20, C8 |
| 36 | 5 Oct | Every word a game shows or plays comes from the language data by id; a missing word is a data entry flagged "to record", never English typed into code. | One central language place. | G26 |
| 39 | 5 Oct | The roadmap: finish Cook and the clinic; finish Arc 1's modes; story glue; the beach trip as template; other trips; the sewing arc. | The order of work. | H41 |
| 40 | 5 Oct | The engine holds all Kutchi knowledge; every new fact goes into it first. | One source for words and rules. | G27 |
| 41 | 5 Oct | The counting rule: at every level the order is spoken and replayable; L1 written and counted along, L2 written, L3+ spoken only. | Listening carries the later levels. | E12 |
| 46 | 5 Oct | The tools and skills are used by default whenever a task matches. | Zafar won't know when to prompt them. | B21 |
| 47 | 5 Oct | The 16 non-negotiables live in `CLAUDE.md`; the rulebook points to them. Old decisions, step-1 files and parked-mode designs are archived, never deleted. | The one file every session loads. | CLAUDE.md |
| 48 | 5 Oct | Builders run fast checks only; the full matrix, sound run and outside review run once, in `/review`, before a publish. | One consolidated check, not three. | C8 |
| 49 | 5 Oct | Work in sprints: one goal and budget, one `/review`, a publish, Zafar's play, `/feedback` and a three-line look back. | Cuts scope, never overruns. | A29 |
