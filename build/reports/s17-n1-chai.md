# s17-n1-chai: the boil's sound, the pause after a serve, no click after a pour, one light rule

## Flaws first
- **CHAI-99 unproven:** the sandbox player taps the next pan 40 ms after a pour, so the light never comes (before or after).
  Request: the player waits about 1.5 s after the first pour.
- **SH-230's sheets show Nani's hint glow, not the box** (`rec:hint-glow`); the box is measured below.
- **The pantry's box is tighter:** 8 px round the milk (was about 14-20).
- **Shelf box tops:** 13-29 px at rest (room for the jar's hop).
- **CHAI-95 past the green:** not logged; no player boils over.

## What changed
- **CHAI-95:** the simmer from the first heat, even in dB from -24 to -2.5 dB (75%) at the bubbling picture, held through the
  green, 0 dB at the boil-over; voice ducking kept.
- **CHAI-99:** the next pan's light 0.8 s after the pour (was 0.3).
- **CHAI-100:** the fire going off after the last pour is silent (`kitchen-kit.js` `set(st, quiet, silent)`).
- **SH-230:** `Onboard.litBox` in every light: the thing's parts, a 12% margin (8-16 px), 2 px short of a neighbour, the edge
  1 px in. Chai's shelf: jar plus pill plus hop. Old pads gone. Exceptions: the pan's rim circle, a card part.

## Proof
- Logs, 1280x665, L1-L4 and chai (`sandbox/s17-n1-chai-log*`): -23.6 dB at heat 0.01, -2.5 dB from the bubbling picture
  through the green; 12 pours, 0 knob clicks without a flame; the child's turns click.
- Boxes, L1-L4, four sizes: 8 px (12-14 at 1920), 2-3 px short of a neighbour; contract-92 0 breaks; pantry, clinic 0 breaks.
- After: `build/screenshots/brief/s17-n1-chai/` (br-s17-n1-chai-after-20261106-230735-7ur).
- Contract: `CONTRACT PASSED: 0 breaks over 4 pages`.
- Checks: 12 of 12 ok (unit 658 pass).
