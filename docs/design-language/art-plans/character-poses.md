# Character poses: the one register (ART-34)

**Made:** 1 Nov 2026, for fix-list row ART-34 ("collate every pose we've used for characters, so new art runs know what to add"). Rules for how characters are drawn: `docs/design-language/art-bible.md` section 6. Who they are and where they appear: `docs/game-design/cast.md`. This file does not repeat either; it lists **what exists, where it loads, and what is missing**.

**How it was built:** a search of `js/`, `data/*.json`, `css/` and the page `.html` files for character pictures under `assets/`, then the folders listed beside each table. "Used in" names the mode or screen whose code or data loads the file, by name or by a built path (for example `${who}-badge.webp`). **"Not loaded" means no code or data path was found on 1 Nov**; check once more before spending art on it. Hands (`assets/characters/hands/`) are parked (H13) and not listed.

**States:**
- **current:** the new 3D style.
- **old:** an older model, or the old storybook style (the art bible's anti-reference).
- **placeholder:** cropped from a mock-up, or a rough stand-in (the clinic's `rough/` sprites), until real art lands.

**Framing words:** *behind counter* = seated as on a bar stool, nothing resting on the counter (Zafar, 16 Oct and 1 Nov); *standing* = full body on the floor; *seated* = full body on a bench, bed or stool; *upper body* = waist up; *face* = head only; *badge* = the round face circle (`js/shared/face.js`, `data/faces.json`).

---

## 1. What is wrong or missing, worst first

| # | Flag | Rows |
|---|---|---|
| 1 | **Ali's, Ma's and Nana's counter poses are old models** (the customers sheet look, `assets/cook/characters/{ma,cousin,nana}-{neutral,happy,impatient}.webp`, plus their talk and blink frames in `assets/characters/`). Their hands and forearms rest on the counter edge. Nani was redrawn behind the counter (the `-v3` set); they were not. Each needs a new behind-the-counter set (section 3) | ART-33, CK-46 |
| 2 | **The impatient faces smile smugly** (Nana, Ma, Ali), and Nani has only one calm mood plus point | ART-10 |
| 3 | **Mood faces are not loaded anywhere.** `Cook.facePath` returns one shared face for Nani and Nana at every mood (ART-08), so Nani's `nani-face-{happy,frown,blink,talk}.webp` and the doctor's `v2/faces/{neutral,talk,laugh,think}.webp` are never shown; the girl's `girl-head-*.webp` are not loaded either (her heads use the one shared face). `data/faces.json` says moods join "when that art lands" (FC2) | ART-08 |
| 4 | **Nana, Ma and Ali's clinic art is built but nothing loads it:** the seated set (`assets/clinic/patients/{nana,ma,ali}/*-sit*.webp`) and the 12 head-and-shoulders feelings each (`assets/characters/{nana,ma,ali}/*-feeling-*.png`) sit in the clinic manifest (`data/clinic/rough-art.json` `final`), but the clinic's patient is the girl (the boy as a fallback) and no screen asks for them. They are 3D style, so they can be reused (for example the party's feelings) before any new art is ordered | none yet |
| 5 | **The shopkeeper is the old storybook look** (`assets/characters/shopkeeper/`), used in Find's stall. Goat, hen and chick (`assets/characters/{goat,hen,chick}/`) are old storybook too and the farm designs list them as the anti-reference (`farm-animals.md` section 7) | ART-26 |
| 6 | **Placeholders cropped from mock-ups:** Hannah Mami's face (`assets/farm/proto/hannah-face.webp`), the lone chick (`assets/farm/proto/chick.webp`), Simba (`assets/cook/proto/cat-peek.webp`, `cat-sit.webp`). Simba's paw in Tidy is a paw emoji; the Who-did-it suspects (Simba, Zazu, Kasuku, Ali, Nana, guests) are grey silhouettes | |
| 7 | **No art at all yet:** Big Ma, Masi, Zazu, Kasuku (a badge only), the teacher, the party family (Zara, her mum, baby brother, dada, dadima, her masi, Yusuf, Sana), the stallholders and boatman, the fruit seller, Isa's body (face only), a proper Hannah Mami | designs, section 4 |
| 8 | **The boy as a patient has only his bench pose and head.** Baby, cousin, Big Ma and Nani exist only as rough stand-ins in the clinic manifest (the bench falls back to them) | |
| 9 | **The child's own character is code-drawn SVG layers** (`assets/character/*.svg`, `data/character-options.json`), no posed art. Farm, party and do-it designs all ask for child poses | |
| 10 | **Doctor and girl are missing reactions** the rough set had: the doctor's thumbs-up, syringe and happy; the girl's scared, giggle and relief | |

---

## 2. The register, one table per character

Paths are given from the folder named under each heading. Sizes are the picture's own pixels where checked.

### Nani (real likeness; the sheet `sources/art/s08/sheet-nani-final-1.png`)

**Cook counter and the story ledge:** folder `assets/cook/characters/`.

| Pose or expression | View | Framing | File | Used in | State |
|---|---|---|---|---|---|
| Neutral, small smile | front | behind counter, arms crossed low | `nani-neutral-v3.webp` (460x501) | Cook counter, every station | current |
| Talking (mouth open) | front | behind counter | `nani-talk-v3.webp` | Cook counter; flaps with neutral while she speaks | current |
| Happy | front | behind counter | `nani-happy-v3.webp` | Cook counter on a right tick; Cook end cards (`js/cook/flow.js`) | current |
| Blink | front | behind counter | `nani-blink-v3.webp` | Cook counter, idle | current |
| Pointing | front | behind counter, arm up | `nani-point-v3.webp` | Cook counter | current |
| Point, hand over the counter | front | forearm and hand only, drawn over the counter's front | `nani-point-front-v3.webp` | Cook counter (with the point) | current |
| Ledge: neutral, talk, happy, point (+ point hand) | front | seated behind a ledge, hands in lap (443x578) | `nani-ledge-{neutral,talk,happy,point}-v3.webp`, `nani-ledge-point-front-v3.webp` | Story mode (`data/story/first-launch.json`); the Snap and Find flows (`js/snap/flow.js`, `js/find/flow.js`) | current |
| Standing | front | standing, full body (266x776) | `nani-stand-v3-front.webp` | Story mode; Day (`data/day.json`) | current |

**Day mode:** folders `assets/day/s09b/` and `assets/day/s12/`.

| Pose | View | Framing | File | Used in | State |
|---|---|---|---|---|---|
| Wave, welcome, point up, umbrella, listen, fan, shade eyes | not checked | standing, full body | `s09b/nani-{wave,welcome,point-up,umbrella,listen,fan,shade-eyes}.webp` | Day (`data/days.json`) | current |
| Come in (open door), beckon | not checked | standing, full body | `s12/nani-come-{open,beckon}.webp` | Day door (`data/day.json`) | current |
| Face by the fire | face | face | `s09b/nani-face-fire.webp` | Day book page (`data/day-book.json`) | current |

**Faces:**

| Pose | View | Framing | File | Used in | State |
|---|---|---|---|---|---|
| Face circle | front | badge | `assets/shared/faces/nani.webp` | every `Face.circle` (cards, guide, rows) | current |
| Badge | front | badge | `assets/cook/characters/nani-badge.webp` | Cook guide box, hub (`index.html`), Find, Snap, Tidy, Monsoon, Story | current |
| Neutral, happy, frown, blink, talk faces | front | face | `assets/cook/characters/nani-face{,-happy,-frown,-blink,-talk}.webp` | **not loaded** since ART-08 (flag 3) | current, unused |
| Old set: badge, happy, neutral, point, talk | front | upper body | `assets/cook/characters/old/nani-*.webp` | not loaded | old (retired) |
| Clinic stand-in, 8 moods | front | seated on a stool | `assets/clinic/rough/patients/nani/*.webp` | clinic manifest only | placeholder |

### Nana (generic grandfather; sheet `sources/cook/customers-sheet.webp`)

| Pose or expression | View | Framing | File | Used in | State |
|---|---|---|---|---|---|
| Neutral | front | behind counter; hands rest on the counter edge (370x389) | `assets/cook/characters/nana-neutral.webp` | Cook counter; Dress up (grey doll base); Cook end cards | **old** |
| Happy | front | behind counter | `.../nana-happy.webp` | Cook counter on a right tick, as his "talk" fallback; end cards | **old** |
| Impatient | front | behind counter | `.../nana-impatient.webp` | Cook counter (smug, ART-10) | **old** |
| Talk (mouth open) | front | behind counter | `assets/characters/nana/nana-talk.webp` | Cook counter | old (edit of old neutral) |
| Blink | front | behind counter | `assets/characters/nana/nana-blink.webp` | Cook counter, idle | old (edit of old neutral) |
| Badge | front | badge | `assets/cook/characters/nana-badge.webp` | Day, Tidy, Story | current |
| Face circle | front | badge | `assets/shared/faces/nana.webp` | every `Face.circle` | current |
| Faces: neutral, happy, frown | front | face | `assets/cook/characters/nana-face{,-happy,-frown}.webp` | not loaded (flag 3) | current, unused |
| Seated, plus head, tummy and knee variants | front | seated full body | `assets/clinic/patients/nana/nana-sit{,-head,-tummy,-knee}.webp` (+ `.png`) | clinic manifest only (flag 4) | current, unused |
| 12 feelings: happy, sad, scared, poorly, tired, better, ouch, sneeze, hot, cold, "not me", caught | front | upper body | `assets/characters/nana/nana-feeling-*.png` | clinic manifest only (flag 4) | current, unused |
| Clinic stand-in, 8 moods | front | seated on a stool | `assets/clinic/rough/patients/nana/*.webp` | clinic manifest only | placeholder |
| Old set | front | upper body | `assets/cook/characters/old/nana-*.webp` | not loaded | old (retired) |

### Ma (the player's mum; generic)

| Pose or expression | View | Framing | File | Used in | State |
|---|---|---|---|---|---|
| Neutral | front | behind counter; hands clasped on the counter (341x405) | `assets/cook/characters/ma-neutral.webp` | Cook counter; Dress up base | **old** (flag 1) |
| Happy | front | behind counter | `.../ma-happy.webp` | Cook counter; Dress up (`js/dress/flow.js`); end cards | **old** |
| Impatient | front | behind counter | `.../ma-impatient.webp` | Cook counter (smug, ART-10) | **old** |
| Talk, blink | front | behind counter | `assets/characters/ma/ma-{talk,blink}.webp` | Cook counter | old (edits of old neutral) |
| Badge | front | badge | `assets/cook/characters/ma-badge.webp` | Tidy, Story | current |
| Faces: neutral, happy, frown | front | face | `assets/cook/characters/ma-face{,-happy,-frown}.webp` | Cook order-card faces (`Cook.facePath`) | current |
| Seated set (4) and 12 feelings | front | seated full body; upper body | `assets/clinic/patients/ma/ma-sit*.webp`, `assets/characters/ma/ma-feeling-*.png` | clinic manifest only (flag 4) | current, unused |
| Clinic stand-in, 8 moods | front | seated on a stool | `assets/clinic/rough/patients/ma/*.webp` | clinic manifest only | placeholder |
| Old set | front | upper body | `assets/cook/characters/old/ma-*.webp` | not loaded | old (retired) |

### Ali (the cousin; "cousin" in file names and code; generic)

| Pose or expression | View | Framing | File | Used in | State |
|---|---|---|---|---|---|
| Neutral | front | behind counter; hands folded on the counter (255x379) | `assets/cook/characters/cousin-neutral.webp` | Cook counter; Find's actor (`js/find/view.js`); Dress up base | **old** (flag 1) |
| Happy | front | behind counter | `.../cousin-happy.webp` | Cook counter; Tidy "tell Ali" (`js/tidy/mechanics/tell.js`); Snap end card; end cards | **old** |
| Impatient | front | behind counter | `assets/characters/ali/cousin-impatient.webp` | Cook counter (smug, ART-10) | **old** |
| Talk, blink | front | behind counter | `assets/characters/ali/cousin-{talk,blink}.webp` | Cook counter | old (edits of old neutral) |
| Badge | front | badge | `assets/cook/characters/cousin-badge.webp` | Day, Snap, Tidy, Story | current |
| Faces: neutral, happy, frown | front | face | `assets/cook/characters/cousin-face{,-happy,-frown}.webp` | Cook order-card faces | current |
| Seated set (4) and 12 feelings | front | seated full body; upper body | `assets/clinic/patients/ali/ali-sit*.webp`, `assets/characters/ali/ali-feeling-*.png` | clinic manifest only (flag 4) | current, unused |
| Clinic stand-ins ("cousin" and "ali", 8 moods each) | front | seated on a stool | `assets/clinic/rough/patients/{ali,cousin}/*.webp` | clinic manifest; the bench falls back to "cousin" for a second boy | placeholder |
| Old set | front | upper body | `assets/cook/characters/old/cousin-*.webp` | not loaded | old (retired) |

### Isa (baby; no design yet)

| Pose | View | Framing | File | Used in | State |
|---|---|---|---|---|---|
| Badge | front | badge | `assets/cook/characters/isa-badge.webp` | Story | current |
| Faces: neutral, happy, frown | front | face | `assets/cook/characters/isa-face{,-happy,-frown}.webp` | Cook order-card faces | current |

No body poses.

### The doctor (real likeness: Hannah's granddad; photos to come)

Folder `assets/clinic/patients/doctor/v2/`. Data: `data/clinic/heal-art.json` `doctor`. One feet line across the views.

| Pose or expression | View | Framing | File | Used in | State |
|---|---|---|---|---|---|
| Standing, arms down | front | standing | `doctor-front-front.webp` | Clinic: waiting room call, exam, pharmacy | current |
| Pointing | front | standing | `doctor-front-front-point.webp` | Clinic | current |
| Gesturing | front | standing | `doctor-front-front-gesture.webp` | Clinic | current |
| Talk, blink (head layers) | front | face on the body | `doctor-front-face-{talk,blink}.webp` | Clinic | current |
| Standing | 3/4 left | standing | `doctor-3q-left-front.webp` + `doctor-3q-left-face-{talk,blink}.webp` | Clinic (talks to the patient) | current |
| Standing, pointing, gesturing | 3/4 right | standing | `doctor-3q-right-front{,-point,-gesture}.webp` + `doctor-3q-right-face-{talk,blink}.webp` | Clinic | current |
| Waving (eyes closed in a smile) | front, 3/4 right | standing | `doctor-wave-front-front.webp`, `doctor-wave-front-face-closed.webp`, `doctor-wave-3q-right-front.webp` | Clinic (waiting-room call, send-off) | current |
| Face circle (one mood for neutral, talk, laugh, think) | front | badge | `assets/shared/faces/doctor.webp` | Clinic cards, `Face.circle` | current |
| Faces: neutral, talk, laugh, think | front | face | `v2/faces/{neutral,talk,laugh,think}.webp` | **not loaded** (flag 3) | current, unused |
| Rough stand-in: neutral, talk, point, thumbs, syringe, happy | front | standing | `assets/clinic/rough/patients/doctor/*.webp` | fallback only | placeholder |

Back view, walking, sitting, thumbs-up and holding a syringe do not exist in the 3D style.

### The girl (the clinic's default patient; generic)

Folder `assets/clinic/patients/girl/`. Data: `heal-art.json` `patients.girl`. Every `@2x` sits beside its file.

| Pose or expression | View | Framing | File | Used in | State |
|---|---|---|---|---|---|
| Sitting, hands in lap | front | seated full body | `girl-front.webp` | Clinic: bench, diagnosis, heal games | current |
| Under a blanket | front | seated | `girl-front-blanket.webp` | Clinic care steps (cold) | current |
| Holding a hot-water bottle | front | seated | `girl-front-bottle-v2.webp` (v1: `girl-front-bottle.webp`) | Clinic care steps | current (v1 old) |
| Side, happy face | side | seated | `girl-side.webp`, `girl-side-face-happy.webp` | Clinic heal games | current |
| Faces on the sitting body: happy, sad, sore, hot, cold, blink, talk | front | face layers | `girl-face-{happy,sad,sore,hot,cold,blink,talk}.webp` | Clinic diagnosis, send-off | current |
| Standing, palms to us; waving | front | standing | `girl-stand-front.webp`, `girl-stand-front-wave.webp` | Clinic send-off | current |
| Standing turns | 3/4 left, 3/4 right | standing | `girl-stand-3q-{left,right}.webp` | Clinic send-off | current |
| Standing faces: happy, sad, sore, hot, cold, blink, talk | front | face layers | `girl-stand-face-*.webp` | Clinic send-off | current |
| Corner heads (one mood) | front | badge | `assets/shared/faces/girl.webp` | Clinic cards and heal-game corners | current |
| Heads: neutral, happy, sad, sore, hot, cold | front | face | `girl-head-*.webp`, `girl-stand-head-neutral.webp` | **not loaded** (flag 3) | current, unused |
| Close-ups: ear, eyes (open, sore, closed), eye-test, mouth, brushing, tongue, tooth drill, "aah" | front | face parts | `assets/clinic/closeups/girl/*.webp` | Clinic heal games (`data/clinic/heal/*.json`) | current (several versions; older ones `eyes.webp`, `mouth.webp`, `tongue.webp` are fallbacks) |
| Child close-ups: forearm (graze, cut, stain), knee (bump, kick, graze), sole, upper arm | front | body parts | `assets/clinic/closeups/child/*.webp` | Clinic heal games | current |
| Rough stand-in, 8 moods | front | seated on a stool | `assets/clinic/rough/patients/girl/*.webp` | fallback only | placeholder |

### The bench people and other patients (generic)

Folders `assets/clinic/patients/{boy,old-man,old-woman,auntie,uncle,mother-baby}/`. Data: `heal-art.json` `waiting`.

| Person | Pose | View | Framing | File | Used in | State |
|---|---|---|---|---|---|---|
| Boy, old man, old woman, auntie, uncle, woman with a baby | sitting | front | seated on the bench | `<kind>-front.webp` | Clinic waiting room | current |
| the same six | neutral head | front | badge | `<kind>-head-neutral.webp` | Clinic cards | current |
| Old man, old woman | clothes in four colours | front | waist up | `clinic-oldman-waist-{blue,green,red,yellow}.webp`, `clinic-oldwoman-waist-{blue,green,yellow,purple}.webp` | manifest only (the room recolours by tint instead) | current, unused |
| Boy, old man, old woman, auntie, uncle, baby, Big Ma, cousin: 8 moods each | neutral, ouch, giggle, relief, happy, wave, sad, scared | front | seated on a stool | `assets/clinic/rough/patients/<kind>/*.webp` | waiting room fallback (second old woman = "bigma", second boy = "cousin"); the boy as patient | placeholder |

Nothing for the boy as a patient beyond his bench pose and head (flag 8). All six are one pose each; there are no moods.

### Shopkeeper (generic; Find mode)

| Pose | View | Framing | File | Used in | State |
|---|---|---|---|---|---|
| Neutral, talking, mouth, happy, happy aligned | front | standing behind the stall, hand held out | `assets/characters/shopkeeper/shopkeeper-{neutral,talking,mouth,happy,happy-aligned}.png` | Find (`js/find/view.js`, `round.js`) | **old** (storybook) |

### Hannah Mami (placeholder look until Zafar says; likeness settled before shipping)

| Pose | View | Framing | File | Used in | State |
|---|---|---|---|---|---|
| Face | 3/4, eyes right | face | `assets/farm/proto/hannah-face.webp` (256x256) | Farm: the guide box and asker (`js/farm/photo.js`, `art.js`) | **placeholder** (cut from Zafar's mock-up) |

### Big Ma, Masi (beach host), Zazu, Kasuku, Simba

| Who | Pose | View | Framing | File | Used in | State |
|---|---|---|---|---|---|---|
| Big Ma | none | | | rough clinic stand-in only: `assets/clinic/rough/patients/bigma/*.webp` | clinic manifest; the second old woman on the bench | placeholder (no sheet) |
| Masi | none | | | none | beach design | **missing** |
| Simba | peeking over the counter edge | front | face and paws | `assets/cook/proto/cat-peek.webp` | Cook baking station | placeholder (mock-up crop) |
| Simba | sitting | 3/4 | seated | `assets/cook/proto/cat-sit.webp` | Cook eggs station | placeholder (mock-up crop) |
| Simba | paw | | emoji | none (a paw emoji in code) | Tidy | placeholder |
| Zazu | none | | | none | | **missing** |
| Kasuku | perched | front | on a perch | `assets/cook/characters/kasuku-badge.webp` | no screen found (loaded only as `${who}-badge` if a caller asks) | current, unused |

### Animals with a character role (old storybook look)

| Who | Poses in the folder | File | Used in | State |
|---|---|---|---|---|
| Goat | front, 3/4, side, back, walk, graze, lie, jump, bleat | `assets/characters/goat/goat-*.png` | Day (`goat-side`, `goat-three-quarter`), Day book, farm prototypes | old |
| Hen | front, 3/4, side, back, walk, peck, sit, flap, cluck | `assets/characters/hen/hen-*.png` | Day, Day book, farm prototypes | old |
| Chick | front, 3/4, side, back, run, hop, peck, sit, cheep | `assets/characters/chick/chick-*.png` | farm prototypes (`js/farm/art.js`) | old |
| Lone chick | | `assets/farm/proto/chick.webp` | Farm photo prototype | placeholder |
| Ride animals (cow, sheep, dog, goat, hen, bird) | one pose each | `assets/day/s09b/`, `assets/day/ride/s09r/` | Day, the window ride | current (one pose; ART-26 wants more) |

### The child (the player)

| Pose | View | Framing | File | Used in | State |
|---|---|---|---|---|---|
| Layers: body, head, eyes, hair (boy, girl), top, bottom | front | standing | `assets/character/*.svg` (`data/character-options.json`) | the character picker | placeholder (code-drawn SVG) |

---

## 3. For the next character art run

Each person is edited from their signed-off sheet, never freshly generated (art bible section 6, "sheet-first"). Counts are the designs' own; the design files are in `build/reports/designs/` (section 7, "Art and layout"). Tick a box when the art is cut and wired, and move the row out of the fix list.

### 3a. Behind-the-counter redraws (do first; ART-33, CK-46, ART-10)

**The rule for every figure here:** seated as on a bar stool behind the counter; hands in the lap or out of sight; the counter's edge covers the lower forearms; nothing rests on the counter. One canvas per person with every frame registered on the neutral one (as Nani's `build/tools/art/specs/s08-nani.cut.json`), so a swap moves nothing. These replace the old files; Zafar approves each likeness.

- [ ] **Ali** (replaces the old set): the five the game uses now (neutral, blink, talk with the mouth open, happy, impatient and not smug), plus five from the section 6 customer list: gentle "tsk" (wrong item), thinking, surprised, proud, laughing
- [ ] **Ma:** the same ten
- [ ] **Nana:** the same ten
- [ ] **Nani:** the cooking moods she lacks (ART-10): thinking, surprised, gentle "tsk", laughing, plus "oh oh oh" on a miss; her five existing frames stay
- [ ] **Face circles for all four** in the moods the sheet calls for (neutral, happy, frown, talking, blink), so `Face.circle` and the guide can show moods again (flag 3)
- [ ] **Doctor and girl:** face circles in four moods (doctor: neutral, talk, laugh, think already exist as files, so first wire them); girl: scared, giggle, relief

### 3b. Poses the new designs need from people who already exist

| Who | Poses to add | Design |
|---|---|---|
| **Nani** | holding a camera (3/4 and front); holding out a corn cob; hands over eyes (the count); sitting with the cats on her lap; holding her basket; the monocle; staggering under something big; handing over the purse; clapping (2 frames); calling (3/4); front-facing "now you!"; holding the breakfast tray at the door; 3/4 in a doorway and laughing; front-facing for a handover; the tray at the end of the wake-up game | farm-animals, hide-and-seek, shops, do-it-engine, clean-up-day, wake-up-clock |
| **Ali** | at the board tracing; sitting at a desk; at the door (standing, doing it, oops); doing each care (a cob into the bowl, the jug, the brush, tucking a blanket); asking, front-facing, using it; in bed (asleep, sitting up, bolt upright, stretching); a plain base body and the stuck-in-the-small-kurta gag | school-day, clean-up-day, adoption-centre, pick-it-up-put-it-back, wake-up-clock, sewing |
| **Ma** | asking, front-facing, using it; in bed (6 poses); a dupatta worn layer; a small walker (front, back, 3-frame walk) | pick-it-up-put-it-back, wake-up-clock, sewing, town-map |
| **Nana** | squinting at a newspaper; glasses on, eyes huge; at the door (pointing, "I think ..."); in bed (6 poses); a front-facing speaking handover; a party sheet (receiving, eating with crumbs on his moustache, comic); mended kurta worn layer; a walker | pick-it-up-put-it-back, hide-and-seek, wake-up-clock, party-gifts, party-guests, town-map, sewing |
| **Simba** | the cat sheet: sitting, lying, sleeping curled, walking, pouncing, eating, guilty face, carrying something; peek (eyes in the dark), leap out, curled on a lap, stretch, squint and roll, curled on a mat, trotting in, paw reaching in at a table edge, with a sneeze at the sill; head and tail as separate layers; from Zafar's photos | art bible section 6 (cats), hide-and-seek, clean-up-day, cook-baking-eggs, sewing |
| **Girl** | scared, giggle, relief; the front pose in the party-feelings set if the clinic's feeling heads are reused (flag 4) | clinic-every-part |
| **Doctor** | thumbs-up, syringe, happy; back view if a design asks | clinic |

### 3c. Characters with no art yet

Each starts with a **character sheet signed off by Zafar**, then every pose is cut from it.

- [ ] **Zazu:** the cat sheet as Simba's, drawn as a kitten (cast.md); poses as Simba's list; a head layer for blinking
- [ ] **Kasuku:** perched, head tilt (head as its own layer), beak open "talking", wings flapping (2 frames), walking along the perch (2 frames); plus a face circle (the clinic's eye game already names Kasuku as a speaker, `data/clinic/heal/eye.json`)
- [ ] **Big Ma** (real likeness; photos `bigma-01` to `bigma-03` in `sources/private/`): sheet first, then 3 poses (3/4, front, laughing), the camera pose and a face cut-out; seated full length on her low stool in the room; the overhead table view with a face circle; going out in the black abaya and headscarf; a walker (front, back, walk); at the door; a fitting twirl; a stall pose. Home dress: maroon with a white paisley print
- [ ] **Masi** (the beach host: a placeholder character, not a likeness; Zafar, 1 Nov; look from cast.md: forties, teal headscarf, embroidered blouse, gold earrings): 3/4 and front; kneeling by the sandcastle (3/4 and front); standing at the stalls; sitting at the picnic (3/4 and front); at the boat rail; holding her purse open; handing it over. Her name clashes with the party's aunty ("Zara's masi", in red): keep the two looks apart
- [ ] **Hannah Mami** (placeholder look and lines, Zafar 1 Nov: Nani or another placeholder): 3/4 and front-facing, waist up and full; pointing, clapping, leading an animal; laughing; with binoculars; gesturing to the counter; hands clasped ("aah"); handing over the clipboard; a walker (front, back, walk); stepping off a train (visit 2); a face crop to replace `hannah-face.webp`
- [ ] **The teacher** (school-day, new): 3/4 talking, front-facing pointing, pressing a sticker, stepping back; head-and-shoulders crop for the phone
- [ ] **The party family** (party-gifts section 7, party-guests section 7; one run, looks fixed in party-gifts section 0; modest modern clothes, no religious markers): each person's character sheet and five poses (idle 3/4, front-facing, receiving, eating, one comic) for **Zara** (4, marigold), **her baby brother** (comic: cream on his nose; asleep in the high chair), **her mum** (deep plum, grey scarf), **dada** (tall, grey beard, pale shirt tucked in), **dadima** (lilac kameez, grey dupatta), **Zara's masi** (red), **Yusuf** (6, striped top), **Sana** (5), then the 12-cell pose sheet for the five guests (standing neutral 3/4, front-facing, seated; six feelings: hungry, thirsty, tired, sad, hot, cold; holding a balloon overhead, laughing, waving) and a 12-cell fix-and-miss sheet for Zara, Yusuf, Sana and Zara's masi (108 cells in all for visit 1). Later: Zara at 5, a red-kurta uncle, the dancers' statue poses (Zara and Yusuf), the girl hugging a pet and holding a carry basket, the mother waving
- [ ] **Fruit seller and general-store shopkeeper**, and a cloth seller later (shops): neutral, talking, smile, big happy, thinking, surprised, gentle "tsk", 3/4 and front-facing (the handover); the shopkeeper also cups his ear, waves, holds out his open hand and flings a bolt. **This also replaces the old Find shopkeeper** (flag 5)
- [ ] **Three beach stallholders and the boatman** (beach-boat): two poses each, 3/4 and front; one or two generic beach-goers
- [ ] **Isa** (baby): a body pose or two when a design needs her; no design yet
- [ ] **Customers for the Cook counter** beyond the family (the aunty, the boy and the old man, reused from the waiting room or the customers sheet): behind-the-counter versions in the 3a rule
- [ ] **The child:** posed art on the shared layers: standing at the gate holding a cob, sliding in for the crown, getting ready, dancing (farm-animals, do-it-engine)
- [ ] **Animals as characters** (ART-26, farm designs): replace the old storybook goat, hen and chick with the 3D set (hens: red-brown mother, small white, big white, three chicks; poses walk, peck, drink, sleep, flap, 3/4, front); more ride animals in several poses

### 3d. Keeping this register true

When an art run lands, add its rows here the same day and flip the state. A pose is **current** only when it is in the 3D style and registered on its sheet; a file nothing loads is listed as unused rather than dropped, so nothing is made twice.
