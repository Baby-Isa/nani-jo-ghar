# Rules harvest: Orchestration hub 1 (24–25 Sept 2026)

These are the standing rules, preferences and product decisions Zafar gave in the first orchestration chat (session `34ca1c8b`, 24 Sept 13:11 → 25 Sept 23:25 UTC). They come from a read-through of all 68 of his messages in the transcript.

- **Dates** are UTC.
- **"(Claude proposal, Zafar approved)"** marks a rule that started as a suggestion from Claude, which Zafar then approved. It is not his own wording.
- **⟲** marks a rule he later reversed or refined. The superseding rule is given.

## How to work with Zafar

- This chat is the hub for orchestration, planning, strategy, analysis, review and feedback. Delegate the work to sub-agents, with specific instructions and a model and effort level chosen per task. Maximise results while minimising token spend, and keep the hub chat from clogging up. (24 Sept 13:11)
- When he pastes screenshots (five at a time), don't analyse or act until he says he's finished giving feedback. (24 Sept 13:11)
- He posts feedback as he goes so he doesn't forget it. Compile it into a bug/polish list, and act on it when he says he's done. (24 Sept 14:25)
- Analyse his feedback and add your own thoughts and improvements to his specific suggestions; don't just transcribe them. (24 Sept 13:42, 14:09)
- Keep him updated on the to-do list and on how items get ticked off. (24 Sept 14:09)
- Answer his open questions and have the discussion, then "go forth and do everything". (24 Sept 14:09)
- Don't wait for him on anything; run all the waves while he plays. (24 Sept 14:19)
- When he's away (e.g. "going for 2 hours"), get as much done as possible in that time. (24 Sept 17:52)
- He is on the Max plan: tokens are plentiful and there's no need to pause, but use them sensibly. (24 Sept 16:10)
- "You have full permission to access what you want." Ask for any permissions you need up front. (25 Sept 00:12)
- Save regularly. When a session limit resets, continue into the new session. After any token-limit interruption, quadruple-check that every agent restarted, and restart any in doubt. (25 Sept 00:25)
- When a chat gets full, move to a new chat with a handover doc. Finish the old chat's in-flight work, then upload the handover so he can point the new chat at it. (25 Sept 12:19, 17:51)
- Reports from agents or reviews should be short, but don't cut findings to fit: if a logical review finds a lot, 200 words may not be enough. Check on a review that is taking too long. (24 Sept 15:09)

## Git and pushing

- Push to `main` as you go (`main` is the live GitHub Pages game). (24 Sept 15:07)
- Put playable work where he can play it: e.g. "put it on the separate page link so I can play it" (Find it went live as its own page). (25 Sept 12:19)
- (Claude proposal, Zafar approved "yes to all", 25 Sept 00:25): push waves live once tests pass; big refactors ("one app, one save") go on their own branch until ready.

## Sessions, agents and cost

- Parallel agents: he questioned whether splitting Wave 2 into two agents was cost-effective, given the 2-hour merge. The lesson taken: parallelise only work on separate files. (24 Sept 20:05)
- Look for other tasks that can run in parallel. (24 Sept 15:56)
- If a run looks stuck or unhealthy, save and restart it rather than waiting. (24 Sept 17:13–17:18)
- Estimate the cost of an asset run before it starts, so he can top up the account first. (24 Sept 19:53)
- Be more conservative with API spend ($30 and 187 requests on the OpenAI API was too much). (24 Sept 22:46–22:50)
- (Claude proposal, Zafar approved, 25 Sept 00:25): OpenAI API at medium quality only, a $10 overnight cap, and his OK for any run estimated over $5.
- Model choice: he asked whether to use Fable to orchestrate the Opus agents. Claude recommended Opus as orchestrator on cost; he didn't overrule it. (25 Sept 12:19)

## Reviews and QA

- Review every game mode on whether it actually teaches the Kutchi: the "can you win without the Kutchi?" review, at design time and again as Wave 4. (24 Sept 13:42, 14:16)
- Do your own hand-by-hand (asset-by-asset) review before showing him, and fix what you find. (24 Sept 19:53)
- Backgrounds need strict checks that they fit everything placed on them. (24 Sept 18:00)
- Review screen space across all stations: how much of the screen the play area takes, kept roughly consistent. (24 Sept 13:42)
- Remove leaked internal numbers (e.g. a raw percentage on "roll done"). (24 Sept 13:42)

## Art pipeline and costs

- Image generation takes about 1 minute each, with at most 3 at once. Space prompts out with an automatic timer; the code should regulate itself. (24 Sept 16:59, 17:02)
- A state change (whole onion → diced) must be generated fresh, never edited from the whole item: it's too big a transformation to carry across. (24 Sept 17:50)
- Make the hands first and in excess, in many poses and orientations, since they're least likely to change. (24 Sept 14:09, 18:00)
- ⟲ **Hands** were first generated per pose by API. From 25 Sept 00:37: rethink from scratch. Use the set we have, skin it in code for colour, and add jewellery in code. From 25 Sept 10:40: rings must be placed per pose (landmarks), never at fixed coordinates.
- ⟲ **Where art is generated:** first the OpenAI API, which he connected on 24 Sept 16:41. From 24 Sept 22:53–23:24: generate as much as possible free in ChatGPT via Claude in Chrome on his laptop. Claude writes the prompt packs, image packs and instructions.
- For characters based on real people, he wants to be there. When he can't be ("so I can sleep"), generate only things that don't look like real people; do the real people with him. (24 Sept 23:38)
- ChatGPT results go in the repo under the assets "chat gpt dump" folder for processing. (25 Sept 10:40)

## UX, UI and art style

- Every order is a sequence, shown as dots down the sidebar joined by a dashed line with the item beside each dot. Items that can go in any order share a dot. Don't use numbers (they read as quantities). The voice says "and then" (*ne poi*). (24 Sept 13:42) He widened this on 25 Sept 00:25: every order shows one line and one dot per item.
- Each order row has a consistent format: a play (hear) button, an English/translate icon and a tap-to-reveal icon, reusable across game modes. (24 Sept 13:42)
- Give generic tips on the result card, e.g. "Next time, try to stir at the right speed" or "finish within the time". (24 Sept 13:42)
- Show a visible timer in the busy/rush modes. (24 Sept 13:42)
- Give clear feedback while doing an action, e.g. red too-fast/too-slow zones on the stir dial. (24 Sept 13:42)
- Show a clear cue when a step needs a tap, e.g. a flashing arrow from the tadka pan to the pot. (24 Sept 13:42)
- The chai boil needs an obvious on/off switch for the burner. (24 Sept 14:28)
- Pouring from jars and jugs: the jug icon stays where it is. Hold it to pour longer, while a pouring jug comes in from the side or top. (24 Sept 15:06)
- Nani and "pass me" must never cover a play element, such as the boiling pan. Review every mode, including the multi-station ones. (24 Sept 15:06)
- Stars are styled per game mode (Cook: a chef's hat; detective: a magnifying glass), with a collection to see them. Fix the padding and spacing of the star icons. (24 Sept 14:25)
- Calm UI (25 Sept 00:25):
  - an intro card shows the family member and their sequenced order, then shrinks to the sidebar;
  - Nani is quieter, and players get silence at the start to work out what to do;
  - the sidebar text must fit and stay readable without taking space from the game;
  - no English word pills (water, tea, boil);
  - help is just a "?" that pops out when pressed;
  - the result card is a word review (Kutchi → English) instead of "they asked / you said";
  - drop the star/coin counter at the top of the sidebar.
- Art style: modern, with "hints and nods, not caricature". Don't do too much or it looks old; this was his wife's comment. Sprinkle or rotate the cultural objects rather than showing them all at once. (24 Sept 16:38)
- Scenes should feel alive: ambient motion such as bunting swaying. (24 Sept 15:56)
- Plan for evening and night versions of scenes. (24 Sept 16:24)
- Use Nani's close-up framing, leaning on the cooking counter, as the in-game style (e.g. for the kitchen). (24 Sept 23:50)
- Skin tone: use Zafar's own (a light brown, a little more brown than beige, near a generic game skin tone) for the player's hands and as the basis for generated characters. (24 Sept 16:24, 18:21)
- Hands: slimmer, with a better finger-to-palm ratio. No bones or veins (they have to animate). Option B's skin was better. (24 Sept 18:14)
- ⟲ **Cuff:** first an embroidered cuff. From 24 Sept 18:18: a white linen shirt rolled back between elbow and wrist, only visible sometimes. More modern.

## Kutchi language and voice

- *Ne poi* (rhymes with "koi") = "and then". It's Kutchi; *ne pacchi* is probably Gujarati. Use it for now; Mum will confirm. (24 Sept 14:09)
- Temporary words, **not** to be marked confirmed: yoghurt = *dai* (said "day"), chickpeas = *channa*, meat = *ghos* (rhymes with "horse"). The second dough is *Bajr jo maani*. (24 Sept 14:09)
- Temporary phonetic words (25 Sept 10:40): no = narr, slowly = arse-teh-tea, quickly = jal-dee, half = udd, full = barr-el-or, big = wudd-oar, small = nindh-oar. Write them in the correct spelling, but use the phonetic style for the voices.
- English placeholder words don't matter; one session with Mum fixes them. (24 Sept 14:09)
- The Questions for Mum doc must list the words needed and the order to collect them in. He asked whether a voice recording is enough for Claude to draft spellings. (25 Sept 12:19)
- Kasuku the parrot occasionally repeats words, e.g. "Salaam alaikum" when you come in, or random words, to reinforce the learning in a funny way. (24 Sept 16:24)
- Numbers can be learned by showing the numeral as a running count, translated to the Kutchi number word in the sidebar, from the start. (24 Sept 13:42; Claude adapted this to a tally to avoid giving the answer away)

## Game design

- Each mechanic is judged on five things: fun; educational (forces the Kutchi); distinct; helps the plot; play-again appeal. (24 Sept 20:18) For every remaining mode: research, several self-check loops with different player personas, one agent per mode, and output a future builder agent can start from. (25 Sept 10:55)
- Not every station needs to be elaborate; some can be simple tasks. (24 Sept 13:42)
- First levels should be a bit harder and more fun, with variety: types of skewer, types of tea, several items to chop. (25 Sept 00:25)
- Chop: a visible countdown timer. In the first levels, several items to chop (ideally what goes in the dish) plus decoys and time pressure are enough. (25 Sept 00:25) Items sit higher on the screen. (24 Sept 13:42)
- Grill:
  - vertical skewers pointing away from the player, with a wooden handle near the bottom and clearly off the grill;
  - 3–4 skewers at once to juggle;
  - the customer says how many and what type (meat only, veg only), which teaches numbers.
  (24 Sept 13:42) He called the merge into the Mishkaki grill "good". (24 Sept 14:09)
- Maani line:
  - at most three things on screen: select dough, roll, fry;
  - run as a production line, or roll everything first (a real choice when making maani);
  - water is probably not needed;
  - two doughs, maani and *Bajr jo maani*, in sizes (big/small).
  (24 Sept 13:42, 14:09)
- Tawa: take a stack of dough to put on the pan (so you get the right number), with two pans to juggle. (24 Sept 13:42)
- Chaat: bigger bowl, ingredients on two rows, and the order must come through. (24 Sept 13:42)
- Chai tray: "take it and run with it", emphasising the learning parts. (24 Sept 14:09)
- Add "pass me" to the pantry and to the slower, more boring modes. (24 Sept 14:16)
- Free play in every mode: fire up the game and jump into the favourite thing. (24 Sept 14:09)
- Story mode: one recipe across a few stations. Free play is the kitchen with people arriving at different times, and you choose when to stop. (24 Sept 13:42)
- No tutorial. Throw players straight in, playing within seconds; explain things slowly as needed. (24 Sept 21:09)
- Future, don't block it: a world map with fog of war that clears as you visit (maybe a side tab); travelling to places instead of an explicit free-play toggle, with story mode always offering "the next thing". (24 Sept 21:09)
- Future, keep in mind: role reversal, where the player tells someone where things are ("under the sofa", "above the TV"). Do now only what makes it easy later; otherwise log it as tech debt. (24 Sept 21:09)
- Scalability: a new recipe from Mum should be near-instant as data, built from the individual mechanics (including those inside the combined stations). "Design level 1, and levels 2–20 make themselves." (24 Sept 14:09)

## Story and characters

- **Nani** is modelled on Zafar's mum (she agreed, 24 Sept 16:24).
  - The mole above her lip is on her right (the viewer's left). Include it, not exaggerated. (24 Sept 16:49, 16:59)
  - She wears the bracelet from the reference photos.
  - ⟲ **Rings:** first given as "red and yellow gold aqiq on her right ring finger, and a yellow gold and diamond ring". From 24 Sept 20:05: **no bangles**; both rings are yellow gold, one a red aqiq and one a solitaire diamond. Simplify if needed, as long as it's replicable.
  - ⟲ The first sheet was "too short and fat and round-faced"; it was redone and v2 approved. (24 Sept 23:30–23:50)
- **Big Ma** is his wife's great-grandma.
  - A recurring family member at things like Eid and dinner; the family seamstress.
  - You visit Big Ma's room, not a shop. She fixes clothing problems while singing a song, which his wife will record.
  - Her relationship is never explained; she's the warm senior pillar of the family.
  - She always wears a headscarf.
  (24 Sept 16:38, 16:59)
- **The doctor** is his wife's granddad (real likeness from photos). (24 Sept 16:24)
- All other family members are generic. (24 Sept 16:24)
- **Cats:**
  - Simba: the big brother, 5, a black Russian blue.
  - Zazu: the little brother, 1, a grey Russian blue who looks like a kitten.
  - Both have green eyes.
  - They are mischief makers (eating or hiding the sweets), recurring characters, and sometimes just sit around to make scenes feel alive.
  (24 Sept 15:56, 16:10, 16:24)
- **Kasuku** is an African grey parrot that repeats words. (24 Sept 16:24, 16:38)
- **Renames and cast:**
  - Bilal → **Ali**, tall and lanky.
  - A baby called **Isa** (that spelling).
  - Aisha → **Layla**.
  (24 Sept 16:38, 16:49, 18:23)
- List every character in the first story arc (shopkeepers, seamstresses, family) so he can choose who is who. (24 Sept 16:24)

## Family and cultural rules

- Cultural objects to include, sprinkled in over time (24 Sept 16:24, 16:38):
  - a small three-legged wooden stool;
  - an East African straw broom;
  - a panga (machete);
  - woven or reed baskets;
  - a flask of chai with enamel mugs and plates;
  - a kanga;
  - the mat and the "greater stall" (his wording, probably a grater stool);
  - a Swahili-style door.
- ⟲ Take out the charcoal stove; use a tandoor instead, at some point or in the background. (24 Sept 16:38)
- Grand plan: if Kutchi works, keep the Indian elements and reuse the game for other diaspora languages (Gujarati next), with someone from each community filling in the language data sheet. (24 Sept 14:19)

## Open questions he asked (not rules; answered in chat)

- Should the goal or Nani sit at the top of the sidebar? (24 Sept 13:42)
- Is modelling Nani and the cats on real family workable in the style? (Answered yes.) (24 Sept 15:56)
- Art for Cook first, or the other modes first? (Answered: hands first, then Cook's art.) (24 Sept 14:09)
