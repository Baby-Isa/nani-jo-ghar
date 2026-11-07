# Glossary: one name for every part

Rules cite a part by the name in the first column. "His words" are names Zafar uses for it in his notes (as the feedback reports
and the fix list quote them), so a note can be matched to a part. "Kit element" is the element's name in `data/kit-elements.json` (what
`tool:kitsheet` and `kitmap.mjs` measure), or `-` where the part has none yet. Layer is where the code belongs after Sprint 18
(decision 13): shared kit, kitchen kit, kitchen kit stove part, or game. A file marked "(today)" is still chai's own.

## The frame

| Part (ours) | His words | Kit element (data/kit-elements.json) | File | Layer |
|---|---|---|---|---|
| the frame (side panel, play area, shelf band; the four sizes) | "left bar", "bottom panel" | - | `js/shared/frame.js`, `data/layout.json` | shared kit |
| the side panel (Nani's box, then the order cards) | "left bar", "sidebar" | - | `js/cook/ui.js`, `css/cook-side-v2.css` | shared kit |
| the play area (the stage the game draws on) | "the kitchen" | - | `js/cook/ui.js` | shared kit |
| the shelf band and the shelf line (the bottom 30%) | "bottom panel", "the shelf" | - | `js/cook/station-lib.js` | shared kit |
| the word pill (a shelf item's word chip, with its speaker) | "pill" | - | `js/cook/stations/chai-tray.js` (today) | shared kit |
| the count pills (a counted item's grouped pills) | "pills" | - | `js/cook/stations/chai-tray.js` (today) | shared kit |
| the corner buttons (the cog and its menu: "?", home, book) | "gear icon", "cog" | buttons | `js/shared/buttons.js`, `data/rules.json` | shared kit |
| the play button (a fresh page's one tap, so sound can play) | - | buttons | `js/shared/buttons.js` | shared kit |

## Cards and boxes

| Part (ours) | His words | Kit element (data/kit-elements.json) | File | Layer |
|---|---|---|---|---|
| the word card (Kutchi, English under, picture, speaker; the one shape in every slot) | "item card" | word card | `js/shared/word-card.js` | shared kit |
| the speaker (a card's or bubble's play button; tap area 48 px) | "speaker button" | word card | `js/shared/word-card.js` | shared kit |
| the reveal (the dots over a hidden word, the blur over a picture, the tap that shows it) | "the dots", "blur", "eye" | word card | `js/shared/word-card.js` | shared kit |
| the order card (face, headline, item row) | "menu card" | order card | `js/shared/order-card.js` | shared kit |
| the headline (the order card's sentence) | "the I want T words" | order card | `js/shared/order-card.js` | shared kit |
| the item row (the order card's sideways row of item cards) | - | order card | `js/shared/order-card.js` | shared kit |
| the item card (one slot of the item row) | "item card" | order card | `css/shared/order-card.css` | shared kit |
| the pop-out (the big word card that flies whole into its row) | "pop up card" | order pop-up | `js/cook/ui.js`, `js/shared/request-popup.js` | shared kit |
| Nani's box (her face, her line, the arrow) | "hint card", "green box" | - | `js/shared/guide.js` | shared kit |
| the arrow (opens and shuts the helper card) | "dropdown button" | - | `js/shared/guide.js` | shared kit |
| the helper card (opens under Nani's box with the item's card) | "help card", "dropdown" | - | `js/cook/ui.js` | shared kit |
| the "?" pop-up (the grown-ups' door) | "question mark" | ? pop-up | `js/shared/buttons.js` | shared kit |
| the end screen (badges, then the word review) | - | end screen | `js/shared/results.js` | shared kit |
| grey English (a missing Kutchi line, in grey italic) | "grey italic" | to-record text | `js/shared/say.js` | shared kit |

## People, speech and help

| Part (ours) | His words | Kit element (data/kit-elements.json) | File | Layer |
|---|---|---|---|---|
| the face circle (a person's face, with its speaker badge) | "face icons" | face circle | `js/shared/face.js`, `css/shared/face.css` | shared kit |
| the tray faces (each glass's orderer, on the tray) | "face icons next to the chai trays" | face circle | `js/cook/stations/chai-tray.js` | game |
| the bubble (a line said, its tail; replies under it) | "speech bubble", "the diamond" | bubble | `js/shared/conversations.js` | shared kit |
| the light (the dim, the lit box, the thing's jump) | "onboarding", "highlight", "lit box" | help box | `js/shared/onboard.js` | shared kit |
| the zoom-in (the light on a whole thing shrinking onto its part) | "zooms in" | help box | `js/shared/onboard.js` | shared kit |
| the glow (the one highlight colour, pulsing) | "glow" | glow | `css/shared/focus.css` | shared kit |
| the finger (shown only for a drag, hold or swipe) | "hand" | finger | `js/shared/onboard.js` | shared kit |
| the stuck hint (Nani names and lights the next undone item) | "Nani's hint", "nani hint" | help ladder | `js/shared/onboard.js` | shared kit |
| the hint stages (the waits before each step of help) | "after the pause" | help ladder | `js/shared/rules.js`, `data/rules.json` | shared kit |
| the word ladder (a word's support steps: written, dotted, blurred) | "word ladder", "blur" | - | `js/shared/rules.js` | shared kit |
| the closing scene (everyone back to say thank you) | "the end" | - | `js/cook/flow.js` | shared kit |

## The kitchen

| Part (ours) | His words | Kit element (data/kit-elements.json) | File | Layer |
|---|---|---|---|---|
| the worktop (the white marble) | "background marble" | - | `data/cook.json` | kitchen kit |
| the hob (burners, knobs, the heat ring and its green) | "hobs", "cooker", "loading circle", "green zone" | - | `js/cook/kitchen-kit.js` | kitchen kit, stove part |
| the pan (its picture per state, poured over its glass) | "saucepan", "tea pan" | - | `js/cook/kitchen-kit.js` | kitchen kit, stove part |
| the tray (chai's glasses in their wells) | "tea tray" | - | `js/cook/stations/chai-tray.js` | game |
| the word moment (a cutscene for a word a picture can't show) | "word focus", "T word focus" | - | `js/shared/word-moment.js` | shared kit |
| the snap (the word moment's corners, flash and shutter) | "camera snap", "shutter" | - | `js/shared/word-moment.js` | shared kit |
| juice (an action's effect and its sound) | "juice", "juiciness" | - | `js/shared/juice.js`, `js/shared/sfx.js` | shared kit |
