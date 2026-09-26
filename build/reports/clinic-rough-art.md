# Clinic rough art: report

Throwaway placeholder art. gpt-image-1, medium quality, sprite sheets sliced by `sources/art/clinic-rough/slice_sheets.py`, mapped in `data/clinic/rough-art.json`. Contact sheet: `build/contact-sheets/clinic-rough.png` (force-added, because the folder is gitignored).

**Sprites: 258** from 32 sheets. That's 13 people × 8 moods, the doctor × 6 poses, 3 rooms, and items, body parts, overlays, feeling faces, furniture and trays. There are also **100 aliases**. Each alias is written into `sprites` too (with `alias_of`), because `Kit.sprite` reads only `sprites[id]`. Every item id used by the heal games on `clinic-heal-a/-b/-c` and `clinic-core`, and every id in `data/clinic.json` items, resolves to a sprite. So do the kind ids (`girl`, `big-ma` and so on); each gives that kind's neutral face.

**Spend: $2.02 of $5** ($1.11 in the first session, $0.91 in this one). The costs are logged in `sources/art/clinic-rough/cost-log.json`.

**Fixed:**
- The sad/scared sheets drawn from reference images came back with glowing backgrounds that wouldn't slice cleanly. They are redrawn text-only; the rejects are kept as `*-v1-rejected.png`.
- `tray-3` and `tray-4` actually showed 2 and 3 dishes. They are now `tray-2` and `tray-3`, and a new `tray-4` has four dishes in a 2×2 grid.

**Still missing or weak:**
- Body parts: neck, shoulder, back and hair. `body-throat` uses the mouth.
- Faces for the taste game's reactions (sour, fire, milk moustache) and the fever game's red cheeks. The games draw these.
- A belt piece that tiles; `belt` is a single segment.
- Kasuku isn't in this pack; use `assets/cook/characters/`.
- `sugar-pot` shows the stray text "SUGA".
- The characters are consistent only within each sheet.
