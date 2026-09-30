# Conversations: wiring the 15 MVP placements (for the orchestrator, after merge)

**Status:** the module is built and tested on `claude/conversations-mvp` (`js/shared/conversations.js`, `css/shared/conversations.css`, `data/conversations/*.json`, `lab/conversations.html`). **Nothing is wired into `first.html`, `cook.html` or `clinic.html`**: other sessions were editing them. This doc gives the exact hook point and the code for each placement. Line numbers are from `claude/nifty-rubin-c0d431` at `2d1db16`; check them again after merging, since those files are moving.

Design: `docs/game-design/modes/conversations.md` (§10a wins). The placements are rows in `data/conversations/placements.json`.

## 0. On every page that has conversations

Load the stylesheet and the script after `save.js`, and before the page's own scripts. Add the `?v=` stamps as usual (`build/bump_version.py`).

```html
<link rel="stylesheet" href="css/shared/conversations.css">
...
<script src="js/shared/save.js"></script>
<script src="js/shared/conversations.js"></script>
```

- **The frequency clock (§10a.9)** gives one conversation per mode visit, plus one every 2 minutes. Each page calls this once, on load, so the visit's first slot is always open:
  ```js
  Conversations.startVisitNow("cook");   // or "clinic", "first"
  ```
- **The player's gender** (the child's reply voice: Zafar for a boy, Mum for a girl) is read from `Save.get("character").choices.body`. There's nothing to pass.
- **The parent setting** is `Save.setting("conversations")`: `often`, `sometimes` (the default), `story` or `off`. The grown-ups panel can add a four-way picker with `Save.setSetting("conversations", v)`.
- **The light bulb.** The page's existing bulb handler also calls `Conversations.bulb()`, which returns `false` when no conversation is on screen:
  ```js
  if (window.Conversations && Conversations.bulb()) return; // flips the bubbles to English for a moment
  ```
- **The end-of-round screen** gets the conversation's words. Add them to the words passed to `Results.show`:
  ```js
  words: words.concat(Conversations.roundWords(roundId))
  ```
- **Anchors.** `anchor(id)` returns the page-pixel point just above the speaker's head (`{x, y}`). The bubble's tail points there. With no anchor, the bubble sits at the top centre.
- **Moods.** `character.mood(id, kind)` is called with `talk`, `happy`, and the four §14 reactions: `embarrassed`, `scratch`, `puzzled`, `sigh`. They're the same names `story.js`'s Yes/No uses. Map them to the host's own expressions, or ignore them (the bubble shows a small face either way).

All `maybe()` calls return at once with `{ran: false, why}` when the rules say no, so each hook is a single `await`.

---

## 1. First launch (`first.html`, `js/shared/story.js`, `data/story/first-launch.json`)

Story beats are scripted: `Conversations.run(placementId, ctx)` has no caps.

**The hook (one change in `story.js`, plus data).** `Story.play` merges `o.kinds` over `KINDS` (story.js:343), but `KINDS` isn't exported, so the cleanest hook is a `talk` field on a scene. Add a helper near `KINDS` (story.js:~232):

```js
  // Conversations (docs/game-design/modes/conversations-wiring.md): a scene's "talk" runs a placement
  async function talk(sc, s) {
    if (!sc.talk || !global.Conversations) return false;
    const nani = s.querySelector(".st-nani");
    const kid = s.querySelector(".st-child");
    await global.Conversations.run(sc.talk, {
      mode: "first",
      anchor: (id) => {
        const e = id === "nani" ? nani : null;
        if (!e) return null;
        const r = e.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + 6 };
      },
      character: { mood: (id, kind) => nani && id === "nani" && (nani.dataset.mood = kind) },
    });
    return true;
  }
```

### FL2: arriving at Nani's house (scene `arrive`)
- **Data:** `data/story/first-launch.json`, scene `arrive`: add `"talk": "FL2", "talkFirst": true`.
- **Code:** `KINDS.scene` (story.js:234-242). Run the talk *before* the lines, so the salaam comes before *Muke chai, dudh ne khun de*:
  ```js
  async scene(sc, api) {
    const s = stage(sc); api.el.appendChild(s);
    const c = card(naniFace()); api.el.appendChild(c);
    await wait(sc.child && sc.child.walk ? 1300 : 500);
    if (sc.talkFirst) await talk(sc, s);                     // FL2
    for (const id of sc.lines || []) await Story.say(id, { card: c });
    if (sc.talk && !sc.talkFirst) await talk(sc, s);        // FL4, FL5
    await nextButton(api.el);
  },
  ```
- **What plays:** Nani, *Salamun alaykum!* → **Wa alaikum salaam!** / *Khuda-fis!*. Then Kasuku repeats *Salamun alaykum!* (heard only). The first conversation ever shows the ghost finger.

### FL4: back to Nani before the chai (scene `ask-chai`)
- **Data:** scene `ask-chai`: **replace** `"lines": ["make-chai"]` with `"lines": [], "talk": "FL4"`. The conversation says *Tu muke chai banai dinda?* itself, from Mum's clip, so the story mustn't say it twice.
- **What plays:** *Tu muke chai banai dinda?* → **Ha!** / *Na.*. A *Na.* shakes, Nani cycles her embarrassed looks and asks again (§14).

### FL5: after the chai (scene `sip`, after Cook hands back with `done=chai`)
- **Data:** scene `sip`: keep `"lines": ["lovely-chai"]` and add `"talk": "FL5"`. FL5 is heard-only: its two lines are "Mmm, lovely chai!" (PH) and *Shabash, beta!*. **Remove `lovely-chai` from one side**: either keep the story's line and trim FL5's `heard` in `placements.json` to `shabash-beta`, or drop the story line.

### FL7: "Will you help me cook?" (scene `help`, kind `choice`)
- `KINDS.choice` (story.js:276-325) already does §14 with ✓/✗ buttons. Swapping it for the conversation's pills gives the same behaviour plus tracking, and the No pill dodges the finger. At the top of `choice`, after `Story.say(sc.line, …)`:
  ```js
  if (sc.talk && global.Conversations) {
    await global.Conversations.run(sc.talk, { mode: "first" });   // FL7: Ha! / Na (dodges)
    if (sc.after) await Story.say(sc.after, { card: c });
    return;
  }
  ```
  **Data:** scene `help`: add `"talk": "FL7"`, and **drop `sc.line`'s `Story.say` when `sc.talk` is set**, or the question is asked twice.
- **Choose the question before wiring.** The story's `help-cook` line (*Tu muke khaanu banai dinda?*) is a placeholder guess. The conversation's E5 question is placeholder English ("Will you help me cook?"), which shows as grey italic. Both are untested until Mum records first-launch line 8. **Recommendation:** leave FL7 on the story's Yes/No until that recording exists, then put the recorded line in `lines.json` `help-cook` and switch.

### FL8: Cook's first customer (Nana, day 1, after the chai demo)
- `js/cook/flow.js` `runOrder` (flow.js:337-347), inside `} else if (!demo) {`:
  ```js
  } else if (!demo) {
    await serviceView(who, { enter: true });
    await Cook.wait(900);
    if (day.id === 1 && who === "nana" && window.Conversations && !Conversations.state().types["wellbeing.howareyou"]) {
      await Conversations.run("FL8", conv(who, ctx));         // FL8: scripted, the first ever how are you
    } else {
      /* CK1 + CK2, below */
    }
  }
  ```

---

## 2. Cook (`cook.html`, `js/cook/flow.js`, `js/cook/stations/chai-tray.js`)

Add the tags from §0 to `cook.html`, after `onboard.js` and before `js/cook/core.js`. Call `Conversations.startVisitNow("cook")` in `js/cook/app.js` on load.

**A shared helper** in `flow.js`, next to `exchange()` (flow.js:224). The Phaser canvas is 1600×900, `Cook.CHARS[who]` holds `{x, top}` in canvas units, and a sprite's origin is (0.5, 0):

```js
  // Conversations: the ctx every Cook placement passes (round = the order)
  function conv(who, ctx, extra = {}) {
    const cvs = document.querySelector("#game canvas") || document.querySelector("canvas");
    return Object.assign({
      mode: "cook",
      round: `d${state.day && state.day.id}-o${state.ordersServed || 0}`,
      busy: Cook.save.mode === "busy",
      firstRound: !state.ordersServed && !Cook.save.rulesSeen,          // a new station's first round: none (§6.2)
      speaker: who,                                                       // "cousin" resolves to Ali
      anchor: (id) => {
        const c = Cook.CHARS[id === "ali" ? "cousin" : id];
        if (!c || !cvs) return null;
        const r = cvs.getBoundingClientRect();
        return { x: r.left + (c.x / 1600) * r.width, y: r.top + (c.top / 900) * r.height };
      },
      character: { mood: (id, kind) => S().setMood(id === "ali" ? "cousin" : id, kind === "happy" ? "happy" : kind === "talk" ? "neutral" : "neutral") },
    }, extra);
  }
```

### CK1 and CK2: a customer arrives; the ask (flow.js:340-345)
Replace the three random `exchange()` calls:
```js
    await serviceView(who, { enter: true });
    await Cook.wait(900);
    const c1 = await Conversations.maybe(conv(who, ctx, { placement: "CK1" }));      // salaam (first meeting today) or how are you
    if (!c1.ran) await Conversations.maybe(conv(who, ctx, { placement: "CK2", x: { dish: dishWordId(order.dishes[0].recipe) } }));
```
- `dishWordId` maps a recipe to the noun ids in `lines.json` `nouns`: `chai → "cook-chai"`, `samosa → "ph-samosa"`, `chaat → "ph-chaat"`, `mishkaki → "ph-mishkaki"`, `maani → "cook-maani"`, `daar → "cook-daar"`. `R.dishWord(recipe)` already returns Cook's word id, so check it matches.
- **Only chai has Mum's whole-line clip.** The other dishes show the built line, text only, until Mum records them (§9.2 items 10-12).
- The cap is one per round, so CK2 runs only when CK1 didn't. **Retire `exchange()`, `EX()` and `data/cook.json` `exchanges` once this is in.** Migrate the old counts once, on load:
  ```js
  const s = Conversations.state(); Conversations.migrateCook(s, Cook.save.exchanges); Conversations.saveState(s);
  ```

### CK7: the chai tray's boil (Relaxed only; `chai-tray.js`, after `await litP;` at line 512)
```js
    await litP;
    if (window.Conversations && Cook.save.mode !== "busy") {
      // the pan is heating: Nani looks for the teaspoon (E9). Never in Busy, never during the knob's window
      await Conversations.maybe({ placement: "CK7", mode: "cook", round: ctx.roundId, busy: false, speaker: "nani",
                                  x: { thing: "chamchi", where: "near" } });
    }
```
- The boil waits on `saidP` (`ready`), so the pan won't reach its window while the bubble is up.
- `where` is `"near"` when the teaspoon is on the child's side of the counter, else `"far"` (*Hida!* / *Huda!*).
- E9's question, *Chamchi kida ai?*, has an unconfirmed word order (§15), so the moment plays **untested** until Mum says it.

### CK9: after the hand-over (flow.js:530-539)
```js
    } else {
      const c9 = await Conversations.maybe(conv(who, ctx, { placement: "CK9" }));      // "Thank you!" -> Jara e wandho nai (then Khuda-fis, heard)
      if (!c9.ran) {
        await S().talk(who, Lang.line("thanks"), { after: n >= 2 ? "happy" : "neutral" });
        await S().talk("nani", Lang.line("welcome"), { ms: 900 });
        await S().talk(who, Lang.line("bye"));
      }
    }
```
- **§10a:** Cook's own `Lang.line("bye")` / `"thanks"` must become *Khuda-fis* and the English "Thank you" too. That's the Cook session's word list.

### CK11: Nani's treat, before the end-of-round screen (flow.js:541)
```js
    if (who !== "nani") await S().leaveChar(who);
    await Conversations.maybe(conv("nani", ctx, { placement: "CK11", speaker: "nani",
                                                  x: { offers: ["cook-chai", "cook-paani", "cook-dudh"] } }));   // Toke kuro khapeto?
    await roundEnd(ctx, { ... });
```
- In `roundEnd` (flow.js:433-439), pass `words: words.concat(Conversations.roundWords(round))` to `R.show`.
- For the voice star, pass `Stars.voice(hostMoments.concat(Conversations.roundMoments(round)), "cook")`. It's empty in the MVP: speaking (R4) isn't on yet.

---

## 3. The clinic (`clinic.html`, `js/clinic/run.js`, `js/clinic/stages/*.js`)

Add the tags from §0 to `clinic.html`, after `say.js`. Call `Conversations.startVisitNow("clinic")` before `Run.morning` (the inline script, clinic.html:~129).

**A helper** in `js/clinic/stages/common.js`:
```js
  // Conversations: the ctx for a clinic placement. kind = the patient's kind (girl, boy, old-man, old-woman,
  // auntie, uncle), which the speakers roster maps to tu / aai (§10a.3)
  S.conv = function (env, plan, placement, speaker, el) {
    return {
      placement, mode: "clinic", round: `p${plan.index != null ? plan.index : plan.kind}`, speaker,
      firstRound: !!env.first,                                   // the first-ever tiny patient: none
      anchor: () => {
        const head = el && (el.querySelector(".fig-head") || el);
        if (!head) return null;
        const r = head.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top };
      },
      character: { mood: (id, kind) => env.fig && env.fig.react(kind === "happy" ? "happy" : kind === "talk" ? "idle" : "puzzled", 0) },
    };
  };
```

### CL1: arriving at the clinic, the morning's first patient (the doctor)
`run.js` `R.morning`, in the patient loop (run.js:~143):
```js
    for (let i = 0; i < m.patients.length; i++) {
      const plan = m.patients[i];
      if (i === 0 && window.Conversations && !m.entry.first) {
        await Conversations.maybe({ placement: "CL1", mode: "clinic", round: "p0", speaker: "doctor",
                                    anchor: () => { const f = screen.el.querySelector(".cl-face.doctor"); if (!f) return null; const r = f.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top }; } });
      }
      const out = await R.patient(screen, plan, Object.assign({}, o, { rng }));
```
- The doctor has no figure on stage. Their face is on the request card (`S.doctorFace()`, common.js:46), so the anchor falls back to the top centre if the card isn't up.
- At S2 the placement chains *Tu ki aiye?* after the salaam. The doctor is an elder, so the right return question is *Aai ki aayo?*.

### CL2: the waiting room, as the called patient walks up (`waiting.js` `walk()`, lines 78-92)
After the patient's salaam to the doctor (their salaam stays heard, as designed):
```js
        await S.say(S.line(env, "salaam"), "patient");
        await S.say(S.line(env, "salaam-back"), "doctor");
        if (window.Conversations) await Conversations.maybe(S.conv(env, plan, "CL2", s.b.kind, s.el));   // Tu ki aiye? by kind
```
- **The register by kind:** a girl or boy gets *tu*; an old man, old woman, auntie or uncle gets *aai*. A baby never asks (`canSpeak: false`).
- To stop "always formal" from winning (§6.5), the module declines when the bench runs elder-heavy.

### CL3: a family patient on the bench (Nana, Big Ma, Ali)
- **There are no family patients in the pipeline yet.** `pipeline.json` `kinds` has no family entry, though `figure.js` can draw nana, nani, ali and bigma. When a family kind is added, add the same call in `walk()` for a family seat:
  ```js
        if (["nana", "bigma", "ali"].includes(s.b.kind)) await Conversations.maybe(S.conv(env, plan, "CL3", s.b.kind, s.el));  // "Do you know who I am?"
        else await Conversations.maybe(S.conv(env, plan, "CL2", s.b.kind, s.el));
  ```
- The question is placeholder English, so it's **untested** until Mum records §9.2 item 18. So is *Big Ma!* (E89).

### CL9: the send-off, after the feelings (`sendoff.js`, after `cards.remove();` at ~line 131)
```js
      await done;
      cards.remove();
      // Conversations CL9: thanks (E7) or goodbye (E2) from the patient
      if (plan.variant !== "E3" && window.Conversations) {
        const c9 = await Conversations.maybe(S.conv(env, plan, "CL9", patient.kind, env.fig.el));
        if (!c9.ran) await S.say(S.line(env, "thanks"), "patient");
      } else if (plan.variant === "E3") { /* the clinic's spoken goodbye, unchanged (below) */ }
```
- **E3 "Say goodbye"** stays on the clinic's own `S.moment` (a speaking moment) for now. The MVP bubbles stop at R3 (tap); spoken R4 needs `Say.moment` and family speech templates for *Khuda-fis*, which has no clip yet.
- **§10a:** the clinic's `data.goodbyes` should use *Khuda-fis*, not *achija*. Its yes/no should be `ha` / `na`, not *haa / nar* (design §4, the spelling flag).

---

## 4. A1.1: Arc 1 "The guests are coming"
This is the first launch itself: `Conversations.run("A1.1")` runs FL2, FL4, FL5, FL7 and FL8 in order (the lab uses it). In the game, the story's scenes call them one by one (§1).

## 5. After wiring: check
- `node --test build/test_shared_conversations.mjs`: engine and data.
- `node build/test_conversations-browser.mjs`: the lab at 390×844 and 1366×768.
- The existing mode tests (`build/test_cook.py`, `build/test_first_launch.py`, `build/test_clinic.py`). Their bots answer Cook's old `exchange()` pills, so they'll now meet `.cv-pill` buttons instead. The right one is the pill whose `data-line` is the exchange's correct line (`data-correct` is set only with `lab: true`). Or the bots can press the ✋ skip (`.cv-skip`).
- Grown-ups: a Conversations frequency picker (Often / Sometimes / Story only / Off) in the ⚙ panel.
