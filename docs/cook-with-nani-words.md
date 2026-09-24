# Cook with Nani: words, lines and recordings for the family

**Date:** 24 Sept 2026
**For:** Zafar, Mum and the family.
**Status:** every Kutchi string in the prototype is listed here. Nothing else is Kutchi.

## Rules followed

- **No Kutchi is invented.** Sentences only recombine frames that are already in the content master: *Muke … khape*, *Ne …*, *Salamun alaykum*, *Wa alaikum salaam*, *Aabhar aanjo*, *Achija*, *Arre re*, *Hedo*.
- **No computer voice.** A line plays a family recording if one exists (`assets/audio/word/<id>.mp3`). Otherwise the bubble shows a small "needs recording" dot.
- **Cooking verbs have no Kutchi yet.** Nani shows each action by making the item glow, and a short English how-to line appears in the sidebar. When the family gives the verbs, they replace those English lines.

## 1. Words used

| id | Kutchi (draft) | English | Where from | Recording? |
|---|---|---|---|---|
| cook-paani | paani | water | Zafar, 24 Sept (OK for now) | needed |
| cook-chai | chai | tea (leaves) | Zafar, 24 Sept (OK for now) | needed |
| cook-dudh | dudh | milk | Zafar, 24 Sept (OK for now) | needed |
| cook-khun | **khun** (not *khand*) | sugar | Zafar, 24 Sept (corrected) | needed |
| cook-atto | atto | flour | Zafar, 24 Sept (OK for now) | needed |
| cook-daal | daal | lentils, daal | Zafar, 24 Sept (OK for now) | needed |
| cook-maani | maani | chapati | Zafar, 24 Sept (OK for now) | needed |
| veg-02 | dungri | onion | content master | needed |
| veg-03 | tameto | tomato | content master | needed |
| veg-12 | marcha | green chilli | content master | needed |
| veg-13 | lasan | garlic (pantry decoy only) | content master | needed |
| spi-01 | hardar | turmeric | content master | needed |
| spi-02 | jeeru | cumin seeds | content master | needed |
| spi-05 | rai | mustard seeds | content master | needed |
| spi-10 | elchi | cardamom | content master | needed |
| spi-16 | loon | salt (tadka decoy) | content master | needed |
| num-01 to num-05 | hikdo, bo, trae, char, panj | 1 to 5 | handout | 1 to 3 exist (placeholder voice); 4 and 5 needed |

The seven words confirmed on 24 Sept should be added to the content master spreadsheet. For now they live in `data/cook.json`.

## 2. Lines used

| Line | Who says it | When |
|---|---|---|
| Salamun alaykum! | Nani (day 1), every customer | Arriving. **The player answers** by picking *Wa alaikum salaam!* from three choices |
| Wa alaikum salaam! | The player (a choice); Nani models it after a wrong pick | Replying to a greeting |
| Muke {dish} khape. | Customers ordering; Nani asking for things in the pantry | Orders, pantry |
| Ne {thing}. | Customers (extras); Nani (next thing, tadka order) | "And …" |
| {number} {noun} | Inside orders: *bo maani*, *trae khun* | Quantities |
| {number}! | Nani, before stirring | "Stir three times" |
| Aabhar aanjo! | Customers | When served |
| Achija! | Customers leaving; **from day 3 the player answers it too** | Farewell |
| Arre re! | Nani | A wrong tap, or an order that wasn't quite right |
| Hedo! | Nani | Before a customer's "the usual" order |

Full orders the prototype builds, for recording as whole sentences:

- Muke chai khape. Ne bo khun. / Ne trae khun. / Ne hikdo khun. Ne elchi.
- Muke chai khape. (Nana's and Ma's "usual": the player has to remember how they like it)
- Muke bo maani khape. / Muke trae maani khape. / Muke char maani khape.
- Muke daal khape. Ne bo maani. / Ne hikdo maani. / Ne trae maani.
- Muke daal khape. Ne tameto. Ne trae maani.
- Tadka orders: Jeeru. Ne rai. / Rai. Ne jeeru. Ne hardar. / Jeeru. Ne marcha. Ne hardar.

## 3. Questions for the family

1. **Plurals.** Is it *bo maani*, or does maani change for two or more? What about *trae khun*? Would you say three *spoons* of sugar, and if so, what's the word for spoon?
2. **Ordering food.** Is *Muke chai khape* ("I need chai") natural for someone asking for food at home? Or would they say *Muke chai dine* (the "give me" frame from the handout), or something else?
3. **Verbs, to replace the English how-to lines.** Pour (to the line), boil, turn it down, add, knead, roll, flip, press, chop, stir, serve, enough, first/then, *It's boiling!*, *well done*, *your turn*, *watch me*, *the usual*.
4. **Kinship.** The customers are shown as Nana, Ma and Bilal (a cousin). What does a child call their mother, and a cousin, in Kutchi?
5. **Nani's look.** In the new art, Nani's grey hair shows at the front of her headscarf. Is that right for the family?
6. **Dishes.** Are chai, maani and daal (with a jeeru and rai tadka) how Nani would really cook them? What would she add?

## 4. Recording list (in the order the prototype needs them)

1. The seven new words, each twice with a pause: paani, chai, dudh, khun, atto, daal, maani.
2. Spices and vegetables: jeeru, rai, hardar, marcha, elchi, loon, dungri, tameto, lasan.
3. Numbers: char, panj (hikdo, bo and trae only have a placeholder voice so far).
4. The whole orders in section 2, in each customer's voice if possible (Nana, a mum, a child). Different voices for the same words are good for learning.
5. Nani: Salamun alaykum, Wa alaikum salaam, Arre re, Hedo, and the pantry lines (*Muke chai khape. Ne dudh. Ne khun.* …).

Recordings drop in as files named `assets/audio/word/<id>.mp3` (for example `cook-khun.mp3`). The whole-sentence recordings need a small code change, noted in the build log.
