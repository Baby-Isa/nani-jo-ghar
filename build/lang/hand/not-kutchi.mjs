// Words that appear in the notes' emphasis marks (bold or italic) but are not entries, and why. The source-coverage report
// (data/lang/reports/source-coverage.md) lists every other emphasised word the lexicon cannot say, so a new answer from
// Mum that nobody has loaded shows up. Each group is a reason, never a silent skip (rule G1: two AIs agreeing is not evidence).
export const NOT_LOADED = {
  "an English word, a grammar term or a placeholder letter in the notes": "be boiling burning can confirmed coriander course dine done draft el enough green handout how it leave lift m make mince more nope now of only or out ph pepper pocket quickly slowly spoons stir tamarind tea this times turn unconfirmed usual veg vegetable wait watch welcome well yes dupatta cups x y a i n s the in thing place name clear and for not one my your is are nta nti ti yu mum round heard questions dish colour room stop start under person where noun sometimes fried answered paradigm agreement oblique postposition perfective tomato vs w v to an ue e tho tha to",
  "a superseded spelling the notes themselves replace (rules G4, G5, decision 32)": "chindo vadho vadhi daal hikdo vatana vatana lal thandu aastethi ghos channa narr arse teh barr ako aki khand jal dee udd wudd nindh oar bernstein ber",
  "a Whisper hearing the notes flag as wrong (⚠) or a mishearing Zafar removed": "biyein weo ida aiyo faine ayin aayn aaya aanya khanech-red-herring tumata",
  "a Sindhi, Gujarati, Hindi or Swahili comparison (Claude's checks: not evidence)": "baghair kujh rahyo khuno darvaja pachhal vich khe ko jiko mgeni chhokro bakiro tapeli pherav tunjo muhinjo tuhinjo asaan paan loko lok unhan sabh garm thadho kuku nahi chha satt nav ek eto indi wiyo kapyo kape tha jun hun",
  "a word Mum or Zafar discussed and did not give as Kutchi (kept as an open question on the entry it belongs to)": "kale koso thadhu dhor kat ginje gin maanu dikra hafiz wadi bakriyu gutanyu jado moro bhajiya ni nu maa loka jamno",
  "a spelling variant of an entry, kept as an open question or a clash row (data/lang/reports/clash-list.md)": "bateta bateto bha wado vagar asan mun",
  "a stand-in or a phrase part named in the notes, not a word of its own": "ubhi wada pate saag aakha khanje korishad kuru ni nu",
};
