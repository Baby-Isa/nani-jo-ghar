// Places where a game's data and a decision or one of Mum's answers disagree, written from the sources cited in each row
// (grammar-notes, docs/decisions.md, docs/language/lexicon.md). Hand-written because they are about what the games still show.
// Shown on the clash list (data/lang/reports/clash-list.md) section 4: [thing, what disagrees, recommendation].
export const DECISION_CLASHES = [
    ["Chilli", "Cook shows marcha (veg-12); Mum says mirchi for one and for more; decision 5 says mirchi only, no plural, for now; the content master also has marcha.", "Follow decision 5 (mirchi). Zafar to confirm with Mum (Round 5 Q13)."],
    ["Peas", "Cook's veg-10 is watana, called 'peas'; Mum says watana are fried peas and green peas are matar.", "Zafar to check which one Cook means (Round 5 Q12)."],
    ["Samosa", "Zafar asked for Nani to say sambusa (clip sambusa-r3); the game and Mum's list say samosa.", "Zafar to decide (Round 5 Q15)."],
    ["Kitchen", "rasoro is the proper Kutchi word; the family also says jikoni (Swahili).", "Zafar to decide which one the game uses."],
    ["Pantry", "Mum answered the pantry (kabaat, the cupboard); the game still shows an English placeholder.", "Wire it in step 4d (the engine already says it)."],
    ["Right (side)", "The clinic says jamno; Mum has said only jamni (with baju, a she-word); jamno is the he-form by the pattern, not heard.", "Ask Mum for jamno (Round 5 C-series left/right)."],
    ["Yes", "The clinic spells yes haa; Mum's A8.1 is ha (re-transcribed haa).", "Zafar to check the spelling against the clip."],
    ["Thank you", "Cook and the clinic still say Aabhar aanjo (class handout); the family says the English 'thank you' (Zafar 26 Sept, rule G6).", "Follow the rule: replace it in step 4d / 4e."],
    ["Goodbye", "Cook and the clinic still say Achija (class handout); Zafar's decision is khuda-fis (26 Sept, G6).", "Follow the rule."],
    ["Hedo / Ghan", "Hedo ('Hey!'/'Here!') and Ghan ('Here you are') are class-handout words never confirmed by Mum (G21).", "Ask Mum, or drop them."],
    ["The sugar sentence", "Mum said Muke chai me ba khun khapeti (a she-singular ending on a count of two); the rule for plural counts gives khapanta.", "Ask Mum (Round 5 L34, L9)."],
    ["Aau theek ai", "Mum says ai (not aiya) after aau when she says 'I'm fine'; elsewhere 'I am' is aiya.", "Ask Mum whether it is a fixed phrase."],
    ["dinda / dinde", "Mum said dinda to both an elder and a child, and dinde as Nani; Zafar says one is for an elder.", "Ask Mum (Round 5 Q8)."],
    ["khanigin / khanij / khanech", "Three spellings for take-and-bring forms across §9, §37.8 and §43.", "Ask Mum (Round 5 Q9)."],
    ["wapur / wapar", "The word for 'use' is spelled both ways in the notes.", "Zafar to listen and choose."],
    ["kenjo / khenjo / khabar / khobar", "Two spellings of food (S5 and I18) and two of wait / knowledge.", "Zafar to listen and choose."],
  ];
