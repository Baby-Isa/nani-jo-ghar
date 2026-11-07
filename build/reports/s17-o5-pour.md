# s17-o5-pour: the word moment's fill waits for the stream (CHAI-103)

## Flaws first
- Each glass's pour is 400 ms longer (the run-down at the moment's 0.75 pace). The rise keeps its speed.
- CHAI-103 has no evidence probe (only its words), so the strips come from a scratch script.
- BEFORE's frame near -10 ms shows the whole stream. This was a real one-frame bug (the hidden state was set to 104%). The paused clock makes it look bigger than it is. Fixed here.

## What changed
- `js/shared/word-moment.js` pourFill: the pour sound and the tea's rise now wait for the end of the stream's wipe. That is when its head reaches the tea's surface at the empty glass's bottom. It applies to both glasses. With no wipe, they wait for the drawn stream's 0.2 s grow. The drop, the tail, the tilt and the card are unchanged.
- The stream starts hidden.

## Proof
Chai tray L4. The page clock was stepped 60 ms per frame. The sound's start and each tea move were logged with the stream's head at that moment.
- Strips: `build/screenshots/brief/s17-o5-pour/CHAI-103/CHAI-103-pour{1,2}-{1280x665,905x298}-before-after.png`. They show BEFORE over AFTER, each frame marked with the head % and SOUND/RISE. Logs: `{before,after}/log-*.json` beside them.
- AFTER, both pours, both sizes:
  - stream on at 0 ms
  - head at 100% at 400 ms
  - sound at 400 ms, head at 100%
  - first rise at 432 ms, head at 100%
- BEFORE:
  - sound at -13 to -2 ms
  - rise at 16 ms, head at 0.2%
- Contract (@L4, 4 sizes): `CONTRACT FAILED: 1 breaks (contract-11 1)`. This is the counter art at 1920, already known from s17-n2.
- Checks: 12 of 12 ok.

QA: TXT ✅ · LAY ✅ · CMP ✅ · AUD ✅ · INT ✅ · ART ⚠ (the counter, as before)
