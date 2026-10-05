# Gap list: what Cook and the clinic say today that the engine cannot say yet, or has no recording for

The minimum for step 4c (decision 38 c). **No frequency ranking and no simulator** (they wait until whole arcs are settled): each gap lists the lines that need it, in the order the game gives them. Built by `node build/lang/import_all.mjs` (re-run it after every round of Mum's answers). The English here is for grown-ups; Mum's sheet is written from it (`docs/language/fill-the-engine.md` § 3).

| | Cook | Clinic |
|---|---|---|
| Sentences and frames the engine cannot say yet | 4 | 42 |
| Words with no Kutchi yet (English placeholders in the game today) | 20 | 239 |
| A form of a word we know is missing (plural, 'with the …') | 1 | 0 |
| Is it a he-word or a she-word? (the engine used the he-form, Mum's rule, and flags it) | 30 | 4 |
| We know the word but have no recording of it | 91 | 39 |

Lines and words checked: Cook 208, clinic 375. A recording counts here if any take exists; 17 more words have a take that is not yet ticked OK in `lab/family-audio.html` (only OK takes ship, rule G16).

Gaps are listed once, however many lines need them: closing a word closes it everywhere. The words and lines that exist only in the parked modes (dress, who, snap, tidy, find, monsoon, relations) are in the lexicon as to-record entries and are not repeated here.

## Cook

146 things to ask or record, from the lines and words the game uses today.

### Sentences and frames the engine cannot say yet (4)

1. Please say these the way you would at home: "once; twice; three times (stir it three times)" Ask: L54.
   - Needed by: cook line "{x} times" (cook.line.times).
2. Please say these the way you would at home: "I'd like two samosas with mince." "I'd like one samosa with potato and one with mince." Ask: L17, L22, L23, L27.
   - Needed by: cook line "with {x}" (cook.line.with), with cook-dudh.
3. Please say these the way you would at home: "I'd like two samosas with mince, and one with potato." Ask: L23, L26, L27.
   - Needed by: cook line "and {x}" (cook.line.and_join), with cook-maani.
4. Please say these the way you would at home: "In my tea I want two sugars." Ask: L34, L9.
   - Needed by: cook line "In my chai I want {x}." (cook.line.sugar) (polite).

### Words with no Kutchi yet (English placeholders in the game today) (20)

1. How do you say "green pepper"? Please say it in a short sentence, e.g. "bring me the green pepper". Ask: B34.
   - Needed by: Cook word "green pepper" (ph-pepper).
2. How do you say "turner"? Please say it in a short sentence, e.g. "bring me the turner". Ask: new.
   - Needed by: Cook word "turner" (ph-turner).
3. Please say, the way you would at home: "I'll give you pocket money for helping. Get it all right and be quick, and you get more!" Ask: new.
   - Needed by: cook line "I'll give you pocket money for helping. Get it all right and be quick, and you get more!" (cook.line.pocket).
4. Please say, the way you would at home: "Bring these from the pantry" Ask: new.
   - Needed by: cook line "Bring these from the pantry" (cook.guide.fetch).
5. Please say, the way you would at home: "Pass me that one" Ask: new.
   - Needed by: cook line "Pass me that one" (cook.guide.passme).
6. Please say, the way you would at home: "Pour it up to the line" Ask: new.
   - Needed by: cook line "Pour it up to the line" (cook.guide.pour).
7. Please say, the way you would at home: "Put in as many spoons as they said" Ask: new.
   - Needed by: cook line "Put in as many spoons as they said" (cook.guide.count).
8. Please say, the way you would at home: "Roll the maani round" Ask: new.
   - Needed by: cook line "Roll the maani round" (cook.guide.roll).
9. Please say, the way you would at home: "Add the spices, in order" Ask: new.
   - Needed by: cook line "Add the spices, in order" (cook.guide.tadka).
10. Please say, the way you would at home: "Make the bowl, in order" Ask: new.
   - Needed by: cook line "Make the bowl, in order" (cook.guide.assemble).
11. Please say, the way you would at home: "Thread the skewers" Ask: new.
   - Needed by: cook line "Thread the skewers" (cook.guide.thread); cook line "Thread the skewers" (cook.guide.mishkaki-grill:thread).
12. Please say, the way you would at home: "Grill the skewers" Ask: new.
   - Needed by: cook line "Grill the skewers" (cook.guide.grill); cook line "Grill the skewers" (cook.guide.mishkaki-grill:grill).
13. Please say, the way you would at home: "Make each cup the way they said" Ask: new.
   - Needed by: cook line "Make each cup the way they said" (cook.guide.chai-tray).
14. Please say, the way you would at home: "Put water in the pan" Ask: new.
   - Needed by: cook line "Put water in the pan" (cook.guide.chai-tray:water).
15. Please say, the way you would at home: "Put the chai in the pan" Ask: new.
   - Needed by: cook line "Put the chai in the pan" (cook.guide.chai-tray:tea).
16. Please say, the way you would at home: "Make each pan the way they said" Ask: new.
   - Needed by: cook line "Make each pan the way they said" (cook.guide.chai-tray:cups).
17. Please say, the way you would at home: "Pour each pan into their glass" Ask: new.
   - Needed by: cook line "Pour each pan into their glass" (cook.guide.chai-tray:pour).
18. Please say, the way you would at home: "Thread the skewers, then grill them" Ask: new.
   - Needed by: cook line "Thread the skewers, then grill them" (cook.guide.mishkaki-grill).
19. Please say, the way you would at home: "Roll the maani, then cook it" Ask: new.
   - Needed by: cook line "Roll the maani, then cook it" (cook.guide.maani-line); cook line "Roll the maani, then cook it" (cook.guide.roll-tawa).
20. Please say, the way you would at home: "Cook it the way they said" Ask: new.
   - Needed by: cook line "Cook it the way they said" (cook.guide.default).

### A form of a word we know is missing (plural, 'with the …') (1)

1. One tomato, three tomatoes. Ask: Q14.
   - Needed by: Cook word "tomato" (veg-03), more than one.

### Is it a he-word or a she-word? (the engine used the he-form, Mum's rule, and flags it) (30)

1. One sugar, two sugars. (Or: "I'd like some sugar, please", said politely.) Ask: L34.
   - Needed by: Cook word "sugar" (cook-khun); Cook word "sugar" (cook-khun), more than one; cook line "I need {x}." (cook.line.need), with cook-khun (polite) … (5 lines).
2. One flour, two flours. (Or: "I'd like some flour, please", said politely.) Ask: L35.
   - Needed by: Cook word "flour" (cook-atto); Cook word "flour" (cook-atto), more than one.
3. One daal, two daals. (Or: "I'd like some daal, please", said politely.) Ask: L36.
   - Needed by: Cook word "daal" (cook-daal); Cook word "daal" (cook-daal), more than one.
4. One potato, two potatoes. (Or: "I'd like some potato, please", said politely.) Ask: Q14.
   - Needed by: Cook word "potato" (veg-01); Cook word "potato" (veg-01), more than one.
5. One onion, two onions. (Or: "I'd like some onion, please", said politely.) Ask: L46.
   - Needed by: Cook word "onion" (veg-02); Cook word "onion" (veg-02), more than one.
6. One tomato, two tomatoes. (Or: "I'd like some tomato, please", said politely.) Ask: L46.
   - Needed by: Cook word "tomato" (veg-03); Cook word "tomato" (veg-03), more than one.
7. One chilli, two chillis. (Or: "I'd like some chilli, please", said politely.) Ask: L47.
   - Needed by: Cook word "chilli" (veg-12); Cook word "chilli" (veg-12), more than one.
8. One garlic, two garlics. (Or: "I'd like some garlic, please", said politely.) Ask: L42.
   - Needed by: Cook word "garlic" (veg-13); Cook word "garlic" (veg-13), more than one.
9. One peas, two peas. (Or: "I'd like some peas, please", said politely.) Ask: Q12.
   - Needed by: Cook word "peas" (veg-10); Cook word "peas" (veg-10), more than one.
10. One ginger, two gingers. (Or: "I'd like some ginger, please", said politely.) Ask: L42.
   - Needed by: Cook word "ginger" (veg-14); Cook word "ginger" (veg-14), more than one.
11. One turmeric, two turmerics. (Or: "I'd like some turmeric, please", said politely.) Ask: L43.
   - Needed by: Cook word "turmeric" (spi-01); Cook word "turmeric" (spi-01), more than one.
12. One cumin seeds, two cumin seeds. (Or: "I'd like some cumin seeds, please", said politely.) Ask: L43.
   - Needed by: Cook word "cumin seeds" (spi-02); Cook word "cumin seeds" (spi-02), more than one.
13. One mustard seeds, two mustard seeds. (Or: "I'd like some mustard seeds, please", said politely.) Ask: L43.
   - Needed by: Cook word "mustard seeds" (spi-05); Cook word "mustard seeds" (spi-05), more than one.
14. One cardamom, two cardamoms. (Or: "I'd like some cardamom, please", said politely.) Ask: L44.
   - Needed by: Cook word "cardamom" (spi-10); Cook word "cardamom" (spi-10), more than one.
15. One salt, two salts. (Or: "I'd like some salt, please", said politely.) Ask: L34.
   - Needed by: Cook word "salt" (spi-16); Cook word "salt" (spi-16), more than one.
16. One red chilli powder, two red chilli powders. (Or: "I'd like some red chilli powder, please", said politely.) Ask: L44.
   - Needed by: Cook word "red chilli powder" (spi-04); Cook word "red chilli powder" (spi-04), more than one.
17. One chickpeas, two chickpeas. (Or: "I'd like some chickpeas, please", said politely.) Ask: L39.
   - Needed by: Cook word "chickpeas" (ph-chana); Cook word "chickpeas" (ph-chana), more than one.
18. One yoghurt, two yoghurts. (Or: "I'd like some yoghurt, please", said politely.) Ask: L38.
   - Needed by: Cook word "yoghurt" (ph-dahi); Cook word "yoghurt" (ph-dahi), more than one.
19. One sev, two sevs. (Or: "I'd like some sev, please", said politely.) Ask: L39.
   - Needed by: Cook word "sev" (ph-sev); Cook word "sev" (ph-sev), more than one.
20. One coriander, two corianders. (Or: "I'd like some coriander, please", said politely.) Ask: L40.
   - Needed by: Cook word "coriander" (ph-dhana); Cook word "coriander" (ph-dhana), more than one.
21. One mince, two minces. (Or: "I'd like some mince, please", said politely.) Ask: L37.
   - Needed by: Cook word "mince" (ph-keema); Cook word "mince" (ph-keema), more than one.
22. One meat, two meats. (Or: "I'd like some meat, please", said politely.) Ask: L37.
   - Needed by: Cook word "meat" (ph-meat); Cook word "meat" (ph-meat), more than one.
23. One ghee, two ghees. (Or: "I'd like some ghee, please", said politely.) Ask: L38.
   - Needed by: Cook word "ghee" (ph-ghee); Cook word "ghee" (ph-ghee), more than one.
24. One chaat, two chaats. (Or: "I'd like some chaat, please", said politely.) Ask: L36.
   - Needed by: Cook word "chaat" (ph-chaat); Cook word "chaat" (ph-chaat), more than one.
25. One samosa, two samosas. (Or: "I'd like some samosa, please", said politely.) Ask: L47.
   - Needed by: Cook word "samosa" (ph-samosa); Cook word "samosa" (ph-samosa), more than one.
26. One sekelo, two sekelos. (Or: "I'd like some sekelo, please", said politely.) Ask: new.
   - Needed by: Cook word "sekelo" (ph-sekelo); Cook word "sekelo" (ph-sekelo), more than one.
27. One mishkaki, two mishkakis. (Or: "I'd like some mishkaki, please", said politely.) Ask: new.
   - Needed by: Cook word "mishkaki" (ph-mishkaki); Cook word "mishkaki" (ph-mishkaki), more than one.
28. One cupboard, two cupboards. (Or: "I'd like some cupboard, please", said politely.) Ask: new.
   - Needed by: Cook word "cupboard" (ph-pantry); Cook word "cupboard" (ph-pantry), more than one.
29. One vegetable, two vegetables. (Or: "I'd like some vegetable, please", said politely.) Ask: L45.
   - Needed by: Cook word "vegetable" (ph-veg); Cook word "vegetable" (ph-veg), more than one.
30. One mixed, two mixeds. (Or: "I'd like some mixed, please", said politely.) Ask: new.
   - Needed by: Cook word "mixed" (ph-mixed); Cook word "mixed" (ph-mixed), more than one.

### We know the word but have no recording of it (91)

1. Please record: "hakro"
   - Needed by: Cook word "water" (cook-paani); Cook word "milk" (cook-dudh); Cook word "sugar" (cook-khun) … (39 lines).
2. Please record: "paani"
   - Needed by: Cook word "water" (cook-paani).
3. Please record: "trae"
   - Needed by: Cook word "water" (cook-paani), more than one; Cook word "milk" (cook-dudh), more than one; Cook word "sugar" (cook-khun), more than one … (35 lines).
4. Please record: "paani"
   - Needed by: Cook word "water" (cook-paani), more than one.
5. Please record: "hakri"
   - Needed by: Cook word "chai" (cook-chai); Cook word "chapati" (cook-maani); Cook word "millet chapati" (cook-bajrmaani) … (7 lines).
6. Please record: "chai"
   - Needed by: Cook word "chai" (cook-chai); Cook word "black (of tea: no milk)" (ph-kari); Cook word "unsweetened (of tea)" (ph-mori) … (12 lines).
7. Please record: "trae"
   - Needed by: Cook word "chai" (cook-chai), more than one; Cook word "chapati" (cook-maani), more than one; Cook word "millet chapati" (cook-bajrmaani), more than one … (6 lines).
8. Please record: "chai"
   - Needed by: Cook word "chai" (cook-chai), more than one.
9. Please record: "dudh"
   - Needed by: Cook word "milk" (cook-dudh); cook line "I need {x}." (cook.line.need), with cook-dudh (informal); cook line "I need {x}." (cook.line.need), with cook-dudh (polite) … (9 lines).
10. Please record: "dudh"
   - Needed by: Cook word "milk" (cook-dudh), more than one.
11. Please record: "khun"
   - Needed by: Cook word "sugar" (cook-khun); cook line "I need {x}." (cook.line.need), with cook-khun (informal); cook line "I need {x}." (cook.line.need), with cook-khun (polite) … (5 lines).
12. Please record: "khun"
   - Needed by: Cook word "sugar" (cook-khun), more than one; cook line "In my chai I want {x}." (cook.line.sugar) (informal); cook line "In my chai I want {x}." (cook.line.sugar) (polite).
13. Please record: "atta"
   - Needed by: Cook word "flour" (cook-atto), more than one.
14. Please record: "daar"
   - Needed by: Cook word "daal" (cook-daal); cook line "Can you make me {x}?" (cook.line.canyou), with cook-daal; cook line "First {x}." (cook.line.first), with cook-daal.
15. Please record: "daar"
   - Needed by: Cook word "daal" (cook-daal), more than one.
16. Please record: "bajr"
   - Needed by: Cook word "millet chapati" (cook-bajrmaani); Cook word "millet chapati" (cook-bajrmaani), more than one.
17. Please record: "ji"
   - Needed by: Cook word "millet chapati" (cook-bajrmaani); Cook word "millet chapati" (cook-bajrmaani), more than one; Cook word "tamarind chutney" (ph-amli) … (6 lines).
18. Please record: "bataato"
   - Needed by: Cook word "potato" (veg-01); cook line "And then {x}." (cook.line.then), with veg-01.
19. Please record: "bataata"
   - Needed by: Cook word "potato" (veg-01), more than one; Cook word "chips" (ph-chips); Cook word "chips" (ph-chips), more than one.
20. Please record: "lasan"
   - Needed by: Cook word "garlic" (veg-13).
21. Please record: "lasan"
   - Needed by: Cook word "garlic" (veg-13), more than one.
22. Please record: "aadu"
   - Needed by: Cook word "ginger" (veg-14).
23. Please record: "aadu"
   - Needed by: Cook word "ginger" (veg-14), more than one.
24. Please record: "hardar"
   - Needed by: Cook word "turmeric" (spi-01).
25. Please record: "hardar"
   - Needed by: Cook word "turmeric" (spi-01), more than one.
26. Please record: "jeeru"
   - Needed by: Cook word "cumin seeds" (spi-02).
27. Please record: "jeeru"
   - Needed by: Cook word "cumin seeds" (spi-02), more than one.
28. Please record: "rai"
   - Needed by: Cook word "mustard seeds" (spi-05).
29. Please record: "rai"
   - Needed by: Cook word "mustard seeds" (spi-05), more than one.
30. Please record: "elchi"
   - Needed by: Cook word "cardamom" (spi-10).
31. Please record: "elchi"
   - Needed by: Cook word "cardamom" (spi-10), more than one.
32. Please record: "loon"
   - Needed by: Cook word "salt" (spi-16).
33. Please record: "loon"
   - Needed by: Cook word "salt" (spi-16), more than one.
34. Please record: "marcha"
   - Needed by: Cook word "red chilli powder" (spi-04).
35. Please record: "marcha"
   - Needed by: Cook word "red chilli powder" (spi-04), more than one.
36. Please record: "ba"
   - Needed by: Cook word "two" (num-02); cook line "In my chai I want {x}." (cook.line.sugar) (informal); cook line "In my chai I want {x}." (cook.line.sugar) (polite).
37. Please record: "char"
   - Needed by: Cook word "four" (num-04).
38. Please record: "panj"
   - Needed by: Cook word "five" (num-05).
39. Please record: "chutney"
   - Needed by: Cook word "tamarind chutney" (ph-amli); Cook word "mint chutney" (ph-lili).
40. Please record: "chutney"
   - Needed by: Cook word "tamarind chutney" (ph-amli), more than one; Cook word "mint chutney" (ph-lili), more than one.
41. Please record: "fudino"
   - Needed by: Cook word "mint chutney" (ph-lili); Cook word "mint chutney" (ph-lili), more than one.
42. Please record: "chunda"
   - Needed by: Cook word "mince" (ph-keema), more than one.
43. Please record: "tarela"
   - Needed by: Cook word "chips" (ph-chips); Cook word "chips" (ph-chips), more than one.
44. Please record: "sekelo"
   - Needed by: Cook word "sekelo" (ph-sekelo).
45. Please record: "sekela"
   - Needed by: Cook word "sekelo" (ph-sekelo), more than one.
46. Please record: "ne poi"
   - Needed by: Cook word "and then" (lnk-nepoi); cook line "And then {x}." (cook.line.then), with cook-maani; cook line "And then {x}." (cook.line.then), with veg-01.
47. Please record: "kari"
   - Needed by: Cook word "black (of tea: no milk)" (ph-kari).
48. Please record: "mori"
   - Needed by: Cook word "unsweetened (of tea)" (ph-mori).
49. Please record: "wadho"
   - Needed by: Cook word "big" (ph-big).
50. Please record: "pela"
   - Needed by: Cook word "first" (lnk-pela); cook line "First {x}." (cook.line.first), with cook-daal.
51. Please record: "waari"
   - Needed by: Cook word "with (mixed in)" (cook-waari); cook line "I want chai with {x}." (cook.line.need_waari), with cook-dudh (informal); cook line "I want chai with {x}." (cook.line.need_waari), with cook-dudh (polite) … (5 lines).
52. Please record: "Ma"
   - Needed by: Cook word "Ma (mother)" (kin-ma).
53. Please record: "salamun alaykum"
   - Needed by: cook line "Peace be upon you!" (cook.line.greet).
54. Please record: "wa alaikum salaam"
   - Needed by: cook line "And peace be upon you too!" (cook.line.greet-reply).
55. Please record: "aabhar aanjo"
   - Needed by: cook line "Thank you!" (cook.line.thanks).
56. Please record: "achija"
   - Needed by: cook line "Bye!" (cook.line.bye).
57. Please record: "arre re"
   - Needed by: cook line "Oh dear!" (cook.line.oops).
58. Please record: "hedo"
   - Needed by: cook line "Hey!" (cook.line.hey).
59. Please record: "ghan"
   - Needed by: cook line "Here you are." (cook.line.here).
60. Please record: "muke"
   - Needed by: cook line "I need {x}." (cook.line.need), with cook-chai (informal); cook line "I need {x}." (cook.line.need), with cook-chai (polite); cook line "I need {x}." (cook.line.need), with cook-maani (informal) … (16 lines).
61. Please record: "khape"
   - Needed by: cook line "I need {x}." (cook.line.need), with cook-chai (informal); cook line "I need {x}." (cook.line.need), with cook-maani (informal); cook line "I need {x}." (cook.line.need), with cook-dudh (informal) … (6 lines).
62. Please record: "khapeti"
   - Needed by: cook line "I need {x}." (cook.line.need), with cook-chai (polite); cook line "I need {x}." (cook.line.need), with cook-maani (polite); cook line "I want chai with {x}." (cook.line.need_waari), with cook-dudh (polite).
63. Please record: "khapeto"
   - Needed by: cook line "I need {x}." (cook.line.need), with cook-dudh (polite); cook line "I need {x}." (cook.line.need), with cook-khun (polite).
64. Please record: "ne"
   - Needed by: cook line "And {x}." (cook.line.and), with cook-dudh; cook line "And {x}." (cook.line.and), with cook-maani.
65. Please record: "de"
   - Needed by: cook line "Give me {x}." (cook.line.give), with cook-khun; cook line "Give me {x}." (cook.line.give), with cook-maani; cook line "Leave the {x}." (cook.line.leave), with cook-maani … (4 lines).
66. Please record: "tu"
   - Needed by: cook line "How are you?" (cook.line.howareyou); cook line "Can you make me {x}?" (cook.line.canyou), with cook-chai; cook line "Can you make me {x}?" (cook.line.canyou), with cook-daal.
67. Please record: "ki"
   - Needed by: cook line "How are you?" (cook.line.howareyou).
68. Please record: "aiye"
   - Needed by: cook line "How are you?" (cook.line.howareyou).
69. Please record: "aau"
   - Needed by: cook line "I'm fine, thank you." (cook.line.fine).
70. Please record: "theek"
   - Needed by: cook line "I'm fine, thank you." (cook.line.fine).
71. Please record: "ai"
   - Needed by: cook line "I'm fine, thank you." (cook.line.fine); cook line "This is for {x}." (cook.line.forwho), with kin-nana; cook line "It's ready." (cook.line.ready).
72. Please record: "banai"
   - Needed by: cook line "Can you make me {x}?" (cook.line.canyou), with cook-chai; cook line "Can you make me {x}?" (cook.line.canyou), with cook-daal.
73. Please record: "dinda"
   - Needed by: cook line "Can you make me {x}?" (cook.line.canyou), with cook-chai; cook line "Can you make me {x}?" (cook.line.canyou), with cook-daal.
74. Please record: "jara e wandho nai"
   - Needed by: cook line "You're welcome." (cook.line.welcome).
75. Please record: "mu"
   - Needed by: cook line "Wait for me!" (cook.line.wait).
76. Please record: "lai"
   - Needed by: cook line "Wait for me!" (cook.line.wait); cook line "This is for {x}." (cook.line.forwho), with kin-nana; cook line "For {x}." (cook.line.for), with kin-nana … (4 lines).
77. Please record: "khobar"
   - Needed by: cook line "Wait for me!" (cook.line.wait).
78. Please record: "me"
   - Needed by: cook line "In my chai I want {x}." (cook.line.sugar) (informal).
79. Please record: "kadh"
   - Needed by: cook line "Lift out the {x}." (cook.line.lift), with cook-maani.
80. Please record: "chadi"
   - Needed by: cook line "Leave the {x}." (cook.line.leave), with cook-maani.
81. Please record: "tayar"
   - Needed by: cook line "It's ready." (cook.line.ready).
82. Please record: "thori"
   - Needed by: cook line "Leave it a bit longer." (cook.line.longer).
83. Please record: "war"
   - Needed by: cook line "Leave it a bit longer." (cook.line.longer).
84. Please record: "rakh"
   - Needed by: cook line "Leave it a bit longer." (cook.line.longer); cook line "Careful!" (cook.line.careful).
85. Please record: "dhyan"
   - Needed by: cook line "Careful!" (cook.line.careful).
86. Please record: "chakhan"
   - Needed by: cook line "Let me taste it." (cook.line.taste).
87. Please record: "wiji"
   - Needed by: cook line "Put it in!" (cook.line.guide-add); cook line "Put it in the pan" (cook.guide.add); cook line "Put it in the pan" (cook.guide.daar:cook).
88. Please record: "chad"
   - Needed by: cook line "Put it in!" (cook.line.guide-add); cook line "Put it in the pan" (cook.guide.add); cook line "Put it in the pan" (cook.guide.daar:cook).
89. Please record: "kap"
   - Needed by: cook line "Chop it small!" (cook.line.guide-chop); cook line "Chop what they said" (cook.guide.chop); cook line "Chop what they said" (cook.guide.daar:chop).
90. Please record: "waar"
   - Needed by: cook line "Fold the samosa!" (cook.line.guide-fold); cook line "Fold the samosa" (cook.guide.fold); cook line "Fold the samosa" (cook.guide.samosa:fold).
91. Please record: "tar"
   - Needed by: cook line "Fry it!" (cook.line.guide-fry); cook line "Fry them, then lift them out" (cook.guide.fry); cook line "Fry them, then lift them out" (cook.guide.samosa:fry).

## The clinic

324 things to ask or record, from the lines and words the game uses today.

### Sentences and frames the engine cannot say yet (42)

1. Please say these the way you would at home: "My knee hurts." Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "My {x} hurts." (clinic.line.cl-hurts).
2. Please say these the way you would at home: "The knee." Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "The {x}." (clinic.line.cl-check); clinic line "The {x}." (clinic.line.cl-colour).
3. Please say these the way you would at home: "Check the knee." Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "Check the {x}." (clinic.line.cl-checkfull).
4. Please say these the way you would at home: "Now the knee." Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "Now the {x}." (clinic.line.cl-now).
5. Please say these the way you would at home: "The knee again." Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "The {x} again." (clinic.line.cl-again).
6. Please say these the way you would at home: "Listen to the knee." Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "Listen to the {x}." (clinic.line.cl-listen).
7. Please say these the way you would at home: "Look in the knee." Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "Look in the {x}." (clinic.line.cl-look).
8. Please say these the way you would at home: "Take the temperature: the knee." Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "Take the temperature: the {x}." (clinic.line.cl-temp).
9. Please say these the way you would at home: "knee? No, my y hurts." Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "{x}? No, my {y} hurts." (clinic.line.cl-wrong).
10. Please say these the way you would at home: "No, the knee." Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "No, the {x}." (clinic.line.cl-notool).
11. Please say these the way you would at home: "My knee one." Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "My {x} one." (clinic.line.cl-side).
12. Please say these the way you would at home: "Not that one. My other knee." Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "Not that one. My other {x}." (clinic.line.cl-other).
13. Please say these the way you would at home: "knee." Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "{x}." (clinic.line.cl-treat); clinic line "{x}." (clinic.line.cl-review).
14. Please say these the way you would at home: "Round knee times." Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "Round {x} times." (clinic.line.cl-round).
15. Please say these the way you would at home: "Round the knee." Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "Round the {x}." (clinic.line.cl-roundpath).
16. Please say these the way you would at home: "knee drops." Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "{x} drops." (clinic.line.cl-drops).
17. Please say these the way you would at home: "Bring me the knee." Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "Bring me the {x}." (clinic.line.cl-bring).
18. Please say these the way you would at home: "This is the knee. The y, please." Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "This is the {x}. The {y}, please." (clinic.line.cl-isthis).
19. Please say these the way you would at home: "Is it the knee, or the y?" Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "Is it the {x}, or the {y}?" (clinic.line.cl-ask).
20. Please say these the way you would at home: "Is it your knee, or your y?" Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "Is it your {x}, or your {y}?" (clinic.line.cl-yourask).
21. Please say these the way you would at home: "What's wrong with knee?" Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "What's wrong with {x}?" (clinic.line.cl-whatwrong).
22. Please say these the way you would at home: "I'm knee." Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "I'm {x}." (clinic.line.cl-feel).
23. Please say these the way you would at home: "once; twice; three times (stir it three times)" Ask: L54.
   - Needed by: clinic line "{x} times" (clinic.line.lang.times).
24. Please say these the way you would at home: "Bring in man" Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "Bring in {kind}" (clinic.line.pipeline.bring).
25. Please say these the way you would at home: "man, come" Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "{kind}, come" (clinic.line.pipeline.come).
26. Please say these the way you would at home: "My knee hurts" Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "My {part} hurts" (clinic.line.pipeline.hurts).
27. Please say these the way you would at home: "My left knee" Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "My {side} {part}" (clinic.line.pipeline.hurts-side).
28. Please say these the way you would at home: "torch the knee" Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "{tool} the {part}" (clinic.line.pipeline.check).
29. Please say these the way you would at home: "knee. Good." Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "{x}. Good." (clinic.line.pipeline.handover-ok).
30. Please say these the way you would at home: "This is knee. Bring me y" Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "This is {x}. Bring me {y}" (clinic.line.pipeline.handover-no).
31. Please say these the way you would at home: "My knee" Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "My {part}" (clinic.line.pipeline.mypart).
32. Please say these the way you would at home: "Bring me a" Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "Bring me {a}" (clinic.line.pipeline.bringme).
33. Please say these the way you would at home: "left knee" Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "{side} {part}" (clinic.line.heal-ear-side); clinic line "{side} {part}" (clinic.line.heal-knee-side).
34. Please say these the way you would at home: "First a, then b, then c" Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "First {a}, then {b}, then {c}" (clinic.line.heal-ear-pluck3).
35. Please say these the way you would at home: "Clean it two times" Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "Clean it {n} times" (clinic.line.heal-ear-clean).
36. Please say these the way you would at home: "two drops" Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "{n} drops" (clinic.line.heal-ear-drops).
37. Please say these the way you would at home: "two drops, please" Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "{n} drops, please" (clinic.line.heal-ear-drops-patient).
38. Please say these the way you would at home: "Tap the knee two times" Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "Tap the knee {n} times" (clinic.line.heal-knee-kick).
39. Please say these the way you would at home: "Bandage: two turns" Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "Bandage: {n} turns" (clinic.line.heal-knee-wrap).
40. Please say these the way you would at home: "Bandage: first the a, then the b, then the c" Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "Bandage: first the {a}, then the {b}, then the {c}" (clinic.line.heal-knee-path).
41. Please say these the way you would at home: "X-ray the leg, then clonk the bone two times" Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "X-ray the leg, then clonk the bone {n} times" (clinic.line.heal-knee-xray).
42. Please say these the way you would at home: "Cast: two turns" Ask: Round 4 Section G (the doctor's script).
   - Needed by: clinic line "Cast: {n} turns" (clinic.line.heal-knee-cast).

### Words with no Kutchi yet (English placeholders in the game today) (239)

1. How do you say "head"? Please say it in a short sentence, e.g. "bring me the head". Ask: G42.
   - Needed by: Clinic word "head" (body-head).
2. How do you say "tummy"? Please say it in a short sentence, e.g. "bring me the tummy". Ask: G43.
   - Needed by: Clinic word "tummy" (body-tummy).
3. How do you say "arm"? Please say it in a short sentence, e.g. "bring me the arm". Ask: G44.
   - Needed by: Clinic word "arm" (body-arm).
4. How do you say "leg"? Please say it in a short sentence, e.g. "bring me the leg". Ask: G45.
   - Needed by: Clinic word "leg" (body-leg).
5. How do you say "nose"? Please say it in a short sentence, e.g. "bring me the nose". Ask: G50.
   - Needed by: Clinic word "nose" (body-nose).
6. How do you say "mouth"? Please say it in a short sentence, e.g. "bring me the mouth". Ask: G51.
   - Needed by: Clinic word "mouth" (body-mouth).
7. How do you say "tooth"? Please say it in a short sentence, e.g. "bring me the tooth". Ask: G52.
   - Needed by: Clinic word "tooth" (body-tooth).
8. How do you say "throat"? Please say it in a short sentence, e.g. "bring me the throat". Ask: G53.
   - Needed by: Clinic word "throat" (body-throat).
9. How do you say "chest"? Please say it in a short sentence, e.g. "bring me the chest". Ask: G60.
   - Needed by: Clinic word "chest" (body-chest).
10. How do you say "neck"? Please say it in a short sentence, e.g. "bring me the neck". Ask: G54.
   - Needed by: Clinic word "neck" (body-neck).
11. How do you say "shoulder"? Please say it in a short sentence, e.g. "bring me the shoulder". Ask: G55.
   - Needed by: Clinic word "shoulder" (body-shoulder).
12. How do you say "elbow"? Please say it in a short sentence, e.g. "bring me the elbow". Ask: G56.
   - Needed by: Clinic word "elbow" (body-elbow).
13. How do you say "finger"? Please say it in a short sentence, e.g. "bring me the finger". Ask: G58.
   - Needed by: Clinic word "finger" (body-finger).
14. How do you say "toe"? Please say it in a short sentence, e.g. "bring me the toe". Ask: G59.
   - Needed by: Clinic word "toe" (body-toe).
15. How do you say "plaster"? Please say it in a short sentence, e.g. "bring me the plaster". Ask: G73.
   - Needed by: Clinic word "plaster" (care-plaster); Clinic word "plaster" (clinic.item.plaster); Clinic word "plaster" (clinic.item.care-plaster) … (4 lines).
16. How do you say "bandage"? Please say it in a short sentence, e.g. "bring me the bandage". Ask: G74.
   - Needed by: Clinic word "bandage" (care-bandage); Clinic word "bandage" (clinic.item.bandage); Clinic word "bandage" (cl-bandage).
17. How do you say "cool cloth"? Please say it in a short sentence, e.g. "bring me the cool cloth". Ask: G75.
   - Needed by: Clinic word "cool cloth" (care-cloth).
18. How do you say "ice pack"? Please say it in a short sentence, e.g. "bring me the ice pack". Ask: G76.
   - Needed by: Clinic word "ice pack" (care-ice); Clinic word "ice pack" (fever-ice-pack).
19. How do you say "hot-water bottle"? Please say it in a short sentence, e.g. "bring me the hot-water bottle". Ask: G77.
   - Needed by: Clinic word "hot-water bottle" (care-bottle); Clinic word "hot-water bottle" (fever-bottle).
20. How do you say "blanket"? Please say it in a short sentence, e.g. "bring me the blanket". Ask: G78.
   - Needed by: Clinic word "blanket" (care-blanket); Clinic word "blanket" (clinic.item.blanket); Clinic word "blanket" (fever-blanket).
21. How do you say "tissue"? Please say it in a short sentence, e.g. "bring me the tissue". Ask: G79.
   - Needed by: Clinic word "tissue" (care-tissue); Clinic word "tissue" (clinic.item.tissue).
22. How do you say "pillow"? Please say it in a short sentence, e.g. "bring me the pillow". Ask: G80.
   - Needed by: Clinic word "pillow" (care-pillow).
23. How do you say "dropper"? Please say it in a short sentence, e.g. "bring me the dropper". Ask: G116.
   - Needed by: Clinic word "dropper" (care-drops).
24. How do you say "stethoscope"? Please say it in a short sentence, e.g. "bring me the stethoscope". Ask: G110.
   - Needed by: Clinic word "stethoscope" (tool-stethoscope); Clinic word "stethoscope" (clinic.item.stethoscope).
25. How do you say "torch"? Please say it in a short sentence, e.g. "bring me the torch". Ask: G110.
   - Needed by: Clinic word "torch" (tool-torch); Clinic word "torch" (clinic.item.torch); clinic line "{tool} the {part}" (clinic.line.pipeline.check).
26. How do you say "thermometer"? Please say it in a short sentence, e.g. "bring me the thermometer". Ask: G111.
   - Needed by: Clinic word "thermometer" (tool-strip); Clinic word "thermometer" (clinic.item.thermometer); Clinic word "thermometer" (clinic.item.strip).
27. How do you say "blue"? Please say it in a short sentence, e.g. "bring me the blue". Ask: E62.
   - Needed by: Clinic word "blue" (col-blue).
28. How do you say "green bottle"? Please say it in a short sentence, e.g. "bring me the green bottle". Ask: G117.
   - Needed by: Clinic word "green bottle" (med-green).
29. How do you say "red bottle"? Please say it in a short sentence, e.g. "bring me the red bottle". Ask: G117.
   - Needed by: Clinic word "red bottle" (med-red).
30. How do you say "blue bottle"? Please say it in a short sentence, e.g. "bring me the blue bottle". Ask: G117.
   - Needed by: Clinic word "blue bottle" (med-blue).
31. How do you say "syrup"? Please say it in a short sentence, e.g. "bring me the syrup". Ask: new.
   - Needed by: Clinic word "syrup" (med-syrup).
32. How do you say "honey"? Please say it in a short sentence, e.g. "bring me the honey". Ask: new.
   - Needed by: Clinic word "honey" (med-honey); Clinic word "honey" (clinic.item.honey); Clinic word "honey" (cl-honey).
33. How do you say "cloth"? Please say it in a short sentence, e.g. "bring me the cloth". Ask: new.
   - Needed by: Clinic word "cloth" (clinic.item.cloth); Clinic word "cloth" (cl-cloth).
34. How do you say "thread"? Please say it in a short sentence, e.g. "bring me the thread". Ask: new.
   - Needed by: Clinic word "thread" (clinic.item.thread); Clinic word "thread" (cl-thread).
35. How do you say "needle"? Please say it in a short sentence, e.g. "bring me the needle". Ask: new.
   - Needed by: Clinic word "needle" (clinic.item.needle).
36. How do you say "hammer"? Please say it in a short sentence, e.g. "bring me the hammer". Ask: new.
   - Needed by: Clinic word "hammer" (clinic.item.hammer).
37. How do you say "X-ray"? Please say it in a short sentence, e.g. "bring me the X-ray". Ask: new.
   - Needed by: Clinic word "X-ray" (clinic.item.xray).
38. How do you say "cast"? Please say it in a short sentence, e.g. "bring me the cast". Ask: new.
   - Needed by: Clinic word "cast" (clinic.item.cast).
39. How do you say "crutches"? Please say it in a short sentence, e.g. "bring me the crutches". Ask: new.
   - Needed by: Clinic word "crutches" (clinic.item.crutches).
40. How do you say "tweezers"? Please say it in a short sentence, e.g. "bring me the tweezers". Ask: new.
   - Needed by: Clinic word "tweezers" (clinic.item.tweezers); Clinic word "tweezers" (clinic.item.tool-tweezers).
41. How do you say "cotton bud"? Please say it in a short sentence, e.g. "bring me the cotton bud". Ask: new.
   - Needed by: Clinic word "cotton bud" (clinic.item.cotton-bud); Clinic word "cotton bud" (cl-cotton-bud).
42. How do you say "cotton"? Please say it in a short sentence, e.g. "bring me the cotton". Ask: new.
   - Needed by: Clinic word "cotton" (clinic.item.cotton).
43. How do you say "bottle"? Please say it in a short sentence, e.g. "bring me the bottle". Ask: new.
   - Needed by: Clinic word "bottle" (clinic.item.bottle).
44. How do you say "toothbrush"? Please say it in a short sentence, e.g. "bring me the toothbrush". Ask: new.
   - Needed by: Clinic word "toothbrush" (clinic.item.toothbrush).
45. How do you say "comb"? Please say it in a short sentence, e.g. "bring me the comb". Ask: new.
   - Needed by: Clinic word "comb" (clinic.item.comb).
46. How do you say "drill"? Please say it in a short sentence, e.g. "bring me the drill". Ask: new.
   - Needed by: Clinic word "drill" (clinic.item.drill).
47. How do you say "filling"? Please say it in a short sentence, e.g. "bring me the filling". Ask: new.
   - Needed by: Clinic word "filling" (clinic.item.paste).
48. How do you say "fan"? Please say it in a short sentence, e.g. "bring me the fan". Ask: new.
   - Needed by: Clinic word "fan" (clinic.item.fan).
49. How do you say "the doctor’s syringe"? Please say it in a short sentence, e.g. "bring me the the doctor’s syringe". Ask: new.
   - Needed by: Clinic word "the doctor’s syringe" (clinic.item.syringe).
50. How do you say "lollipop"? Please say it in a short sentence, e.g. "bring me the lollipop". Ask: new.
   - Needed by: Clinic word "lollipop" (clinic.item.lollipop).
51. How do you say "pointer"? Please say it in a short sentence, e.g. "bring me the pointer". Ask: new.
   - Needed by: Clinic word "pointer" (clinic.item.pointer); Clinic word "pointer" (clinic.item.tool-pointer).
52. How do you say "eye patch"? Please say it in a short sentence, e.g. "bring me the eye patch". Ask: new.
   - Needed by: Clinic word "eye patch" (clinic.item.patch); Clinic word "eye patch" (clinic.item.care-patch).
53. How do you say "tub"? Please say it in a short sentence, e.g. "bring me the tub". Ask: new.
   - Needed by: Clinic word "tub" (clinic.item.tub).
54. How do you say "spoon"? Please say it in a short sentence, e.g. "bring me the spoon". Ask: new.
   - Needed by: Clinic word "spoon" (clinic.item.spoon).
55. How do you say "sticker"? Please say it in a short sentence, e.g. "bring me the sticker". Ask: new.
   - Needed by: Clinic word "sticker" (clinic.item.sticker).
56. How do you say "eye drops"? Please say it in a short sentence, e.g. "bring me the eye drops". Ask: new.
   - Needed by: Clinic word "eye drops" (clinic.item.care-drops).
57. How do you say "jug of hot water"? Please say it in a short sentence, e.g. "bring me the jug of hot water". Ask: new.
   - Needed by: Clinic word "jug of hot water" (clinic.item.jug-hot).
58. How do you say "jug of cold water"? Please say it in a short sentence, e.g. "bring me the jug of cold water". Ask: new.
   - Needed by: Clinic word "jug of cold water" (clinic.item.jug-cold).
59. How do you say "shampoo"? Please say it in a short sentence, e.g. "bring me the shampoo". Ask: new.
   - Needed by: Clinic word "shampoo" (clinic.item.shampoo).
60. How do you say "jar"? Please say it in a short sentence, e.g. "bring me the jar". Ask: new.
   - Needed by: Clinic word "jar" (clinic.item.bug-jar).
61. How do you say "wipe"? Please say it in a short sentence, e.g. "bring me the wipe". Ask: new.
   - Needed by: Clinic word "wipe" (cl-wipe).
62. How do you say "beads"? Please say it in a short sentence, e.g. "bring me the beads". Ask: new.
   - Needed by: Clinic word "beads" (cl-beads).
63. How do you say "dabs"? Please say it in a short sentence, e.g. "bring me the dabs". Ask: new.
   - Needed by: Clinic word "dabs" (cl-dabs).
64. How do you say "stitches"? Please say it in a short sentence, e.g. "bring me the stitches". Ask: new.
   - Needed by: Clinic word "stitches" (cl-stitches).
65. How do you say "wax"? Please say it in a short sentence, e.g. "bring me the wax". Ask: new.
   - Needed by: Clinic word "wax" (cl-wax).
66. How do you say "jugs"? Please say it in a short sentence, e.g. "bring me the jugs". Ask: new.
   - Needed by: Clinic word "jugs" (cl-jugs).
67. How do you say "splinters"? Please say it in a short sentence, e.g. "bring me the splinters". Ask: new.
   - Needed by: Clinic word "splinters" (cl-splinters).
68. How do you say "big toe"? Please say it in a short sentence, e.g. "bring me the big toe". Ask: new.
   - Needed by: Clinic word "big toe" (cl-big-toe).
69. How do you say "little toe"? Please say it in a short sentence, e.g. "bring me the little toe". Ask: new.
   - Needed by: Clinic word "little toe" (cl-little-toe).
70. How do you say "up"? Please say it in a short sentence, e.g. "bring me the up". Ask: new.
   - Needed by: Clinic word "up" (tooth-up).
71. How do you say "down"? Please say it in a short sentence, e.g. "bring me the down". Ask: new.
   - Needed by: Clinic word "down" (tooth-down).
72. How do you say "brush"? Please say it in a short sentence, e.g. "bring me the brush". Ask: new.
   - Needed by: Clinic word "brush" (tooth-brush).
73. Please say, the way you would at home: "drill the bad bits" Ask: new.
   - Needed by: Clinic word "drill the bad bits" (tooth-drill).
74. Please say, the way you would at home: "fill it to the green" Ask: new.
   - Needed by: Clinic word "fill it to the green" (tooth-fill).
75. How do you say "pop"? Please say it in a short sentence, e.g. "bring me the pop". Ask: new.
   - Needed by: Clinic word "pop" (taste-pop).
76. How do you say "spots"? Please say it in a short sentence, e.g. "bring me the spots". Ask: new.
   - Needed by: Clinic word "spots" (taste-spots).
77. How do you say "soothing ointment"? Please say it in a short sentence, e.g. "bring me the soothing ointment". Ask: new.
   - Needed by: Clinic word "soothing ointment" (taste-ointment).
78. Please say, the way you would at home: "give it" Ask: new.
   - Needed by: Clinic word "give it" (taste-give).
79. How do you say "the eye test"? Please say it in a short sentence, e.g. "bring me the the eye test". Ask: new.
   - Needed by: Clinic word "the eye test" (eye-test).
80. Please say, the way you would at home: "take the temperature" Ask: new.
   - Needed by: Clinic word "take the temperature" (fever-temp).
81. How do you say "window"? Please say it in a short sentence, e.g. "bring me the window". Ask: new.
   - Needed by: Clinic word "window" (fever-window).
82. How do you say "ceiling fan"? Please say it in a short sentence, e.g. "bring me the ceiling fan". Ask: new.
   - Needed by: Clinic word "ceiling fan" (fever-ceiling-fan).
83. How do you say "hand fan"? Please say it in a short sentence, e.g. "bring me the hand fan". Ask: new.
   - Needed by: Clinic word "hand fan" (fever-hand-fan).
84. How do you say "heater"? Please say it in a short sentence, e.g. "bring me the heater". Ask: new.
   - Needed by: Clinic word "heater" (fever-heater).
85. How do you say "open"? Please say it in a short sentence, e.g. "bring me the open". Ask: new.
   - Needed by: Clinic word "open" (fever-open).
86. How do you say "close"? Please say it in a short sentence, e.g. "bring me the close". Ask: new.
   - Needed by: Clinic word "close" (fever-close).
87. How do you say "switch on"? Please say it in a short sentence, e.g. "bring me the switch on". Ask: new.
   - Needed by: Clinic word "switch on" (fever-switch-on).
88. How do you say "switch off"? Please say it in a short sentence, e.g. "bring me the switch off". Ask: new.
   - Needed by: Clinic word "switch off" (fever-switch-off).
89. Please say, the way you would at home: "give" Ask: new.
   - Needed by: Clinic word "give" (fever-give).
90. Please say, the way you would at home: "take back" Ask: new.
   - Needed by: Clinic word "take back" (fever-take-away).
91. How do you say "put on"? Please say it in a short sentence, e.g. "bring me the put on". Ask: new.
   - Needed by: Clinic word "put on" (fever-put-on).
92. Please say, the way you would at home: "take off" Ask: new.
   - Needed by: Clinic word "take off" (fever-take-off).
93. Please say, the way you would at home: "fix it" Ask: new.
   - Needed by: Clinic word "fix it" (fever-fix).
94. Please say, the way you would at home: "I'm too hot!" Ask: new.
   - Needed by: Clinic word "I'm too hot!" (fever-too-hot).
95. Please say, the way you would at home: "I'm too cold!" Ask: new.
   - Needed by: Clinic word "I'm too cold!" (fever-too-cold).
96. Please say, the way you would at home: "Still too hot!" Ask: new.
   - Needed by: Clinic word "Still too hot!" (fever-still-hot).
97. Please say, the way you would at home: "Still too cold!" Ask: new.
   - Needed by: Clinic word "Still too cold!" (fever-still-cold).
98. Please say, the way you would at home: "press it" Ask: new.
   - Needed by: Clinic word "press it" (boing-press).
99. How do you say "medicine"? Please say it in a short sentence, e.g. "bring me the medicine". Ask: new.
   - Needed by: Clinic word "medicine" (boing-medicine).
100. How do you say "middle toe"? Please say it in a short sentence, e.g. "bring me the middle toe". Ask: new.
   - Needed by: Clinic word "middle toe" (foot-middle-toe).
101. Please say, the way you would at home: "Ow!" Ask: new.
   - Needed by: Clinic word "Ow!" (foot-ow).
102. Please say, the way you would at home: "Take the wax out" Ask: new.
   - Needed by: Clinic word "Take the wax out" (ear-wax-out).
103. Please say, the way you would at home: "Which one did I say?" Ask: new.
   - Needed by: Clinic word "Which one did I say?" (ear-hear-q).
104. How do you say "yellow"? Please say it in a short sentence, e.g. "bring me the yellow". Ask: new.
   - Needed by: Clinic word "yellow" (col-yellow).
105. How do you say "lukewarm"? Please say it in a short sentence, e.g. "bring me the lukewarm". Ask: new.
   - Needed by: Clinic word "lukewarm" (feel-lukewarm).
106. Please say, the way you would at home: "Thank you, I feel better!" Ask: to record.
   - Needed by: clinic line "Thank you, I feel better!" (clinic.line.thanks-better).
107. Please say, the way you would at home: "Let's check everything." Ask: to record.
   - Needed by: clinic line "Let's check everything." (clinic.line.cl-all).
108. Please say, the way you would at home: "Nothing wrong there." Ask: to record.
   - Needed by: clinic line "Nothing wrong there." (clinic.line.cl-fine).
109. Please say, the way you would at home: "That's it!" Ask: to record.
   - Needed by: clinic line "That's it!" (clinic.line.cl-found); clinic line "That's it" (clinic.line.pipeline.thatsit).
110. Please say, the way you would at home: "I don't feel well." Ask: to record.
   - Needed by: clinic line "I don't feel well." (clinic.line.cl-unwell).
111. Please say, the way you would at home: "I don't know why." Ask: to record.
   - Needed by: clinic line "I don't know why." (clinic.line.cl-dunno).
112. Please say, the way you would at home: "Where does it hurt?" Ask: to record.
   - Needed by: clinic line "Where does it hurt?" (clinic.line.cl-where); clinic line "Where does it hurt?" (clinic.line.pipeline.where).
113. Please say, the way you would at home: "Where?" Ask: to record.
   - Needed by: clinic line "Where?" (clinic.line.cl-whereq).
114. Please say, the way you would at home: "Ahh, this one." Ask: to record.
   - Needed by: clinic line "Ahh, this one." (clinic.line.cl-this).
115. Please say, the way you would at home: "Here?" Ask: to record.
   - Needed by: clinic line "Here?" (clinic.line.cl-here).
116. Please say, the way you would at home: "Nothing there. Where?" Ask: to record.
   - Needed by: clinic line "Nothing there. Where?" (clinic.line.cl-nothere).
117. Please say, the way you would at home: "Say it again?" Ask: to record.
   - Needed by: clinic line "Say it again?" (clinic.line.cl-sayagain).
118. Please say, the way you would at home: "That tickles!" Ask: to record.
   - Needed by: clinic line "That tickles!" (clinic.line.cl-tickles); clinic line "That tickles!" (clinic.line.tickles).
119. Please say, the way you would at home: "Nothing wrong there. What else?" Ask: to record.
   - Needed by: clinic line "Nothing wrong there. What else?" (clinic.line.cl-nothingwrong).
120. Please say, the way you would at home: "That's it. Will you help me?" Ask: to record.
   - Needed by: clinic line "That's it. Will you help me?" (clinic.line.cl-thatsit).
121. Please say, the way you would at home: "You first." Ask: to record.
   - Needed by: clinic line "You first." (clinic.line.cl-youfirst).
122. Please say, the way you would at home: "Let me see." Ask: to record.
   - Needed by: clinic line "Let me see." (clinic.line.cl-letmesee).
123. Please say, the way you would at home: "All better!" Ask: to record.
   - Needed by: clinic line "All better!" (clinic.line.cl-allbetter).
124. Please say, the way you would at home: "Well done, my helper." Ask: to record.
   - Needed by: clinic line "Well done, my helper." (clinic.line.cl-welldone).
125. Please say, the way you would at home: "I feel happy." Ask: to record.
   - Needed by: clinic line "I feel happy." (clinic.line.feeling-happy).
126. Please say, the way you would at home: "I feel sad." Ask: to record.
   - Needed by: clinic line "I feel sad." (clinic.line.feeling-sad).
127. Please say, the way you would at home: "I feel hot." Ask: to record.
   - Needed by: clinic line "I feel hot." (clinic.line.feeling-hot).
128. Please say, the way you would at home: "I feel cold." Ask: to record.
   - Needed by: clinic line "I feel cold." (clinic.line.feeling-cold).
129. Please say, the way you would at home: "Say bye." Ask: to record.
   - Needed by: clinic line "Say bye." (clinic.line.cue-achija); clinic line "Say bye." (clinic.line.pipeline.saybye).
130. Please say, the way you would at home: "Say thank you to the doctor." Ask: to record.
   - Needed by: clinic line "Say thank you to the doctor." (clinic.line.cue-aabhar).
131. Please say, the way you would at home: "Get well soon!" Ask: new.
   - Needed by: clinic line "Get well soon!" (clinic.line.goodbye-getwell).
132. Please say, the way you would at home: "Say get well soon." Ask: to record.
   - Needed by: clinic line "Say get well soon." (clinic.line.cue-getwell).
133. Please say, the way you would at home: "A scrape." Ask: to record.
   - Needed by: clinic line "A scrape." (clinic.line.ailment-scrape).
134. Please say, the way you would at home: "A cut." Ask: to record.
   - Needed by: clinic line "A cut." (clinic.line.ailment-cut).
135. Please say, the way you would at home: "A bump." Ask: to record.
   - Needed by: clinic line "A bump." (clinic.line.ailment-knee-bump).
136. Please say, the way you would at home: "A break. Clonk!" Ask: to record.
   - Needed by: clinic line "A break. Clonk!" (clinic.line.ailment-leg-break).
137. Please say, the way you would at home: "Something in the ear!" Ask: to record.
   - Needed by: clinic line "Something in the ear!" (clinic.line.ailment-seed-in-ear).
138. Please say, the way you would at home: "A sugar bug!" Ask: to record.
   - Needed by: clinic line "A sugar bug!" (clinic.line.ailment-sugar-bug).
139. Please say, the way you would at home: "A cracked tooth." Ask: to record.
   - Needed by: clinic line "A cracked tooth." (clinic.line.ailment-cracked-tooth).
140. Please say, the way you would at home: "Sore spots on my tongue!" Ask: to record.
   - Needed by: clinic line "Sore spots on my tongue!" (clinic.line.ailment-coated-tongue).
141. Please say, the way you would at home: "A sore eye." Ask: to record.
   - Needed by: clinic line "A sore eye." (clinic.line.ailment-sore-eye).
142. Please say, the way you would at home: "Sore feet!" Ask: to record.
   - Needed by: clinic line "Sore feet!" (clinic.line.ailment-sore-feet).
143. Please say, the way you would at home: "A thorn!" Ask: to record.
   - Needed by: clinic line "A thorn!" (clinic.line.ailment-thorn).
144. Please say, the way you would at home: "A fever." Ask: to record.
   - Needed by: clinic line "A fever." (clinic.line.ailment-fever).
145. Please say, the way you would at home: "The jab before the trip." Ask: to record.
   - Needed by: clinic line "The jab before the trip." (clinic.line.ailment-jab).
146. Please say, the way you would at home: "Does it hurt here?" Ask: to record.
   - Needed by: clinic line "Does it hurt here?" (clinic.line.pipeline.here).
147. Please say, the way you would at home: "I don't feel well. I don't know why." Ask: to record.
   - Needed by: clinic line "I don't feel well. I don't know why." (clinic.line.pipeline.unwell).
148. Please say, the way you would at home: "To the bench" Ask: to record.
   - Needed by: clinic line "To the bench" (clinic.line.pipeline.tobench).
149. Please say, the way you would at home: "To the counter" Ask: to record.
   - Needed by: clinic line "To the counter" (clinic.line.pipeline.tocounter).
150. Please say, the way you would at home: "Is everything okay now?" Ask: to record.
   - Needed by: clinic line "Is everything okay now?" (clinic.line.pipeline.okay-now).
151. Please say, the way you would at home: "What will help?" Ask: to record.
   - Needed by: clinic line "What will help?" (clinic.line.pipeline.helps).
152. Please say, the way you would at home: "Ask them how they feel" Ask: to record.
   - Needed by: clinic line "Ask them how they feel" (clinic.line.pipeline.whisper-ask).
153. Please say, the way you would at home: "Who's next?" Ask: to record.
   - Needed by: clinic line "Who's next?" (clinic.line.pipeline.why-waiting).
154. Please say, the way you would at home: "Bring me..." Ask: to record.
   - Needed by: clinic line "Bring me..." (clinic.line.pipeline.why-pharmacy).
155. Please say, the way you would at home: "Let's have a look" Ask: to record.
   - Needed by: clinic line "Let's have a look" (clinic.line.pipeline.lookhere).
156. Please say, the way you would at home: "How do you feel?" Ask: to record.
   - Needed by: clinic line "How do you feel?" (clinic.line.pipeline.howfeel).
157. Please say, the way you would at home: "One more thing" Ask: to record.
   - Needed by: clinic line "One more thing" (clinic.line.pipeline.onemore).
158. Please say, the way you would at home: "Found it" Ask: to record.
   - Needed by: clinic line "Found it" (clinic.line.pipeline.found).
159. Please say, the way you would at home: "Next" Ask: to record.
   - Needed by: clinic line "Next" (clinic.line.pipeline.next).
160. Please say, the way you would at home: "Done" Ask: to record.
   - Needed by: clinic line "Done" (clinic.line.pipeline.done).
161. Please say, the way you would at home: "Next patient" Ask: to record.
   - Needed by: clinic line "Next patient" (clinic.line.pipeline.nextpatient).
162. Please say, the way you would at home: "Close the clinic" Ask: to record.
   - Needed by: clinic line "Close the clinic" (clinic.line.pipeline.close).
163. Please say, the way you would at home: "Look at" Ask: to record.
   - Needed by: clinic line "Look at" (clinic.line.pipeline.do-hand).
164. Please say, the way you would at home: "Look in" Ask: to record.
   - Needed by: clinic line "Look in" (clinic.line.pipeline.do-torch).
165. Please say, the way you would at home: "Listen to" Ask: to record.
   - Needed by: clinic line "Listen to" (clinic.line.pipeline.do-stethoscope).
166. Please say, the way you would at home: "The temperature:" Ask: to record.
   - Needed by: clinic line "The temperature:" (clinic.line.pipeline.do-thermometer).
167. Please say, the way you would at home: "Look at: your hand." Ask: to record.
   - Needed by: clinic line "Look at: your hand." (clinic.line.pipeline.cue-tool-hand).
168. Please say, the way you would at home: "Look in: the torch." Ask: to record.
   - Needed by: clinic line "Look in: the torch." (clinic.line.pipeline.cue-tool-torch).
169. Please say, the way you would at home: "Listen: the stethoscope." Ask: to record.
   - Needed by: clinic line "Listen: the stethoscope." (clinic.line.pipeline.cue-tool-stethoscope).
170. Please say, the way you would at home: "The temperature: the thermometer." Ask: to record.
   - Needed by: clinic line "The temperature: the thermometer." (clinic.line.pipeline.cue-tool-thermometer).
171. Please say, the way you would at home: "empty" Ask: to record.
   - Needed by: clinic line "empty" (clinic.line.pipeline.w-empty).
172. Please say, the way you would at home: "that" Ask: to record.
   - Needed by: clinic line "that" (clinic.line.pipeline.w-that).
173. Please say, the way you would at home: "Say it" Ask: to record.
   - Needed by: clinic line "Say it" (clinic.line.pipeline.cap-sayit).
174. Please say, the way you would at home: "Ask them" Ask: to record.
   - Needed by: clinic line "Ask them" (clinic.line.pipeline.cap-askthem).
175. Please say, the way you would at home: "Call them in" Ask: to record.
   - Needed by: clinic line "Call them in" (clinic.line.pipeline.cap-callthem).
176. Please say, the way you would at home: "Time for my jab." Ask: new.
   - Needed by: clinic line "Time for my jab." (clinic.line.boing-why).
177. Please say, the way you would at home: "I'll do it. You count!" Ask: new.
   - Needed by: clinic line "I'll do it. You count!" (clinic.line.boing-goal).
178. Please say, the way you would at home: "Cold!" Ask: new.
   - Needed by: clinic line "Cold!" (clinic.line.cold).
179. Please say, the way you would at home: "Oop!" Ask: new.
   - Needed by: clinic line "Oop!" (clinic.line.oop).
180. Please say, the way you would at home: "A bow, like a shoelace!" Ask: new.
   - Needed by: clinic line "A bow, like a shoelace!" (clinic.line.bow).
181. Please say, the way you would at home: "Look at that!" Ask: new.
   - Needed by: clinic line "Look at that!" (clinic.line.look).
182. Please say, the way you would at home: "I fell over and scraped my arm." Ask: new.
   - Needed by: clinic line "I fell over and scraped my arm." (clinic.line.cut-why).
183. Please say, the way you would at home: "Let's clean it and put plasters on." Ask: new.
   - Needed by: clinic line "Let's clean it and put plasters on." (clinic.line.cut-goal).
184. Please say, the way you would at home: "My ear feels blocked." Ask: new.
   - Needed by: clinic line "My ear feels blocked." (clinic.line.ear-why).
185. Please say, the way you would at home: "Let's clean it." Ask: new.
   - Needed by: clinic line "Let's clean it." (clinic.line.ear-goal).
186. Please say, the way you would at home: "I can hear again!" Ask: new.
   - Needed by: clinic line "I can hear again!" (clinic.line.ear-better).
187. Please say, the way you would at home: "My left eye" Ask: new.
   - Needed by: clinic line "My left eye" (clinic.line.side-left).
188. Please say, the way you would at home: "My right eye" Ask: new.
   - Needed by: clinic line "My right eye" (clinic.line.side-right).
189. Please say, the way you would at home: "Cover the other eye" Ask: new.
   - Needed by: clinic line "Cover the other eye" (clinic.line.patch).
190. Please say, the way you would at home: "The chart." Ask: new.
   - Needed by: clinic line "The chart." (clinic.line.chart).
191. Please say, the way you would at home: "Arrr! A pirate!" Ask: new.
   - Needed by: clinic line "Arrr! A pirate!" (clinic.line.arr).
192. Please say, the way you would at home: "Hmmm... (squints)" Ask: new.
   - Needed by: clinic line "Hmmm... (squints)" (clinic.line.squint).
193. Please say, the way you would at home: "Ooh, cold!" Ask: new.
   - Needed by: clinic line "Ooh, cold!" (clinic.line.blink).
194. Please say, the way you would at home: "Squawk!" Ask: new.
   - Needed by: clinic line "Squawk!" (clinic.line.squawk).
195. Please say, the way you would at home: "I can't see well." Ask: new.
   - Needed by: clinic line "I can't see well." (clinic.line.eye-why).
196. Please say, the way you would at home: "Drops first, then let's test your eyes." Ask: new.
   - Needed by: clinic line "Drops first, then let's test your eyes." (clinic.line.eye-goal).
197. Please say, the way you would at home: "I can see!" Ask: new.
   - Needed by: clinic line "I can see!" (clinic.line.eye-better).
198. Please say, the way you would at home: "I feel hot... no, cold!" Ask: new.
   - Needed by: clinic line "I feel hot... no, cold!" (clinic.line.fever-why).
199. Please say, the way you would at home: "Let's get you just right." Ask: new.
   - Needed by: clinic line "Let's get you just right." (clinic.line.fever-goal).
200. Please say, the way you would at home: "Ahhh..." Ask: new.
   - Needed by: clinic line "Ahhh..." (clinic.line.ahh).
201. Please say, the way you would at home: "Brrr!" Ask: new.
   - Needed by: clinic line "Brrr!" (clinic.line.brr).
202. Please say, the way you would at home: "Hee hee! That tickles!" Ask: new.
   - Needed by: clinic line "Hee hee! That tickles!" (clinic.line.tickle); clinic line "Hee hee! That tickles!" (clinic.line.giggle).
203. Please say, the way you would at home: "Ow! There's a thorn!" Ask: new.
   - Needed by: clinic line "Ow! There's a thorn!" (clinic.line.ow).
204. Please say, the way you would at home: "Phew!" Ask: new.
   - Needed by: clinic line "Phew!" (clinic.line.phew).
205. Please say, the way you would at home: "My left" Ask: new.
   - Needed by: clinic line "My left" (clinic.line.side-left).
206. Please say, the way you would at home: "My right" Ask: new.
   - Needed by: clinic line "My right" (clinic.line.side-right).
207. Please say, the way you would at home: "Ow, something's in my foot!" Ask: new.
   - Needed by: clinic line "Ow, something's in my foot!" (clinic.line.foot-why).
208. Please say, the way you would at home: "Let's take the splinters out." Ask: new.
   - Needed by: clinic line "Let's take the splinters out." (clinic.line.foot-goal).
209. Please say, the way you would at home: "Itchy, itchy! Something's in my hair!" Ask: new.
   - Needed by: clinic line "Itchy, itchy! Something's in my hair!" (clinic.line.itchy).
210. Please say, the way you would at home: "Boing! In you go!" Ask: new.
   - Needed by: clinic line "Boing! In you go!" (clinic.line.boing).
211. Please say, the way you would at home: "Bubbles! Hee hee!" Ask: new.
   - Needed by: clinic line "Bubbles! Hee hee!" (clinic.line.bubbles).
212. Please say, the way you would at home: "Bye bye, beetle!" Ask: new.
   - Needed by: clinic line "Bye bye, beetle!" (clinic.line.wave).
213. Please say, the way you would at home: "Hic!" Ask: new.
   - Needed by: clinic line "Hic!" (clinic.line.hic).
214. Please say, the way you would at home: "Glug!" Ask: new.
   - Needed by: clinic line "Glug!" (clinic.line.glug).
215. Please say, the way you would at home: "Slurrrp... it's empty!" Ask: new.
   - Needed by: clinic line "Slurrrp... it's empty!" (clinic.line.slurp).
216. Please say, the way you would at home: "Oops! Splash!" Ask: new.
   - Needed by: clinic line "Oops! Splash!" (clinic.line.splash).
217. Please say, the way you would at home: "Mmmph! (cheeks full)" Ask: new.
   - Needed by: clinic line "Mmmph! (cheeks full)" (clinic.line.mmph).
218. Please say, the way you would at home: "Boo!" Ask: new.
   - Needed by: clinic line "Boo!" (clinic.line.boo).
219. Please say, the way you would at home: "Eeek!" Ask: new.
   - Needed by: clinic line "Eeek!" (clinic.line.eek).
220. Please say, the way you would at home: "Ha ha ha! All gone!" Ask: new.
   - Needed by: clinic line "Ha ha ha! All gone!" (clinic.line.laugh).
221. Please say, the way you would at home: "...hic! Still there!" Ask: new.
   - Needed by: clinic line "...hic! Still there!" (clinic.line.back).
222. Please say, the way you would at home: "My knee hurts." Ask: new.
   - Needed by: clinic line "My knee hurts." (clinic.line.knee-why).
223. Please say, the way you would at home: "Let's check it and bandage it." Ask: new.
   - Needed by: clinic line "Let's check it and bandage it." (clinic.line.knee-goal).
224. Please say, the way you would at home: "That feels better!" Ask: new.
   - Needed by: clinic line "That feels better!" (clinic.line.knee-better).
225. Please say, the way you would at home: "My tongue is sore." Ask: new.
   - Needed by: clinic line "My tongue is sore." (clinic.line.taste-why).
226. Please say, the way you would at home: "Let's soothe the sore spots." Ask: new.
   - Needed by: clinic line "Let's soothe the sore spots." (clinic.line.taste-goal).
227. Please say, the way you would at home: "Hmm, not that one." Ask: new.
   - Needed by: clinic line "Hmm, not that one." (clinic.line.taste-notthat).
228. Please say, the way you would at home: "My tongue feels better!" Ask: new.
   - Needed by: clinic line "My tongue feels better!" (clinic.line.taste-better).
229. Please say, the way you would at home: "My tooth hurts." Ask: new.
   - Needed by: clinic line "My tooth hurts." (clinic.line.tooth-why).
230. Please say, the way you would at home: "Let's brush, fix it and fill it." Ask: new.
   - Needed by: clinic line "Let's brush, fix it and fill it." (clinic.line.tooth-goal).
231. Please say, the way you would at home: "It doesn't hurt now!" Ask: new.
   - Needed by: clinic line "It doesn't hurt now!" (clinic.line.tooth-better).
232. Please say, the way you would at home: "Ow! A chip!" Ask: new.
   - Needed by: clinic line "Ow! A chip!" (clinic.line.tooth-chip).
233. Please say, the way you would at home: "Too much!" Ask: new.
   - Needed by: clinic line "Too much!" (clinic.line.tooth-toomuch).
234. Please say, the way you would at home: "Burp!" Ask: new.
   - Needed by: clinic line "Burp!" (clinic.line.burp).
235. Please say, the way you would at home: "Ooh, my tummy! Too many sweets!" Ask: new.
   - Needed by: clinic line "Ooh, my tummy! Too many sweets!" (clinic.line.gurgle).
236. Please say, the way you would at home: "Glug glug... ahh!" Ask: new.
   - Needed by: clinic line "Glug glug... ahh!" (clinic.line.tummy-glug).
237. Please say, the way you would at home: "Whoops! It's spilling!" Ask: new.
   - Needed by: clinic line "Whoops! It's spilling!" (clinic.line.tummy-splash).
238. Please say, the way you would at home: "Ahhh, that's warm..." Ask: new.
   - Needed by: clinic line "Ahhh, that's warm..." (clinic.line.tummy-ahh).
239. Please say, the way you would at home: "Much better!" Ask: new.
   - Needed by: clinic line "Much better!" (clinic.line.better).

### Is it a he-word or a she-word? (the engine used the he-form, Mum's rule, and flags it) (4)

1. One foot, two foots. (Or: "I'd like some foot, please", said politely.) Ask: new.
   - Needed by: Clinic word "foot" (body-foot); Clinic word "foot" (body-foot), more than one.
2. One ear, two ears. (Or: "I'd like some ear, please", said politely.) Ask: new.
   - Needed by: Clinic word "ear" (body-ear); Clinic word "ear" (body-ear), more than one.
3. One drops (not sprinkle), two drops (not sprinkle). (Or: "I'd like some drops (not sprinkle), please", said politely.) Ask: new.
   - Needed by: Clinic word "drops (not sprinkle)" (clinic.item.drops); Clinic word "drops (not sprinkle)" (clinic.item.drops), more than one; Clinic word "drops (not sprinkle)" (cl-drops) … (4 lines).
4. One apple, two apples. (Or: "I'd like some apple, please", said politely.) Ask: new.
   - Needed by: Clinic word "apple" (cl-apple); Clinic word "apple" (cl-apple), more than one.

### We know the word but have no recording of it (39)

1. Please record: "hakro"
   - Needed by: Clinic word "head" (body-head); Clinic word "tummy" (body-tummy); Clinic word "arm" (body-arm) … (108 lines).
2. Please record: "hath"
   - Needed by: Clinic word "hand" (body-hand); Clinic word "hand" (tool-hand); Clinic word "hand" (clinic.item.tool-hand).
3. Please record: "trae"
   - Needed by: Clinic word "hand" (body-hand), more than one; Clinic word "foot" (body-foot), more than one; Clinic word "ear" (body-ear), more than one … (10 lines).
4. Please record: "hath"
   - Needed by: Clinic word "hand" (body-hand), more than one; Clinic word "hand" (tool-hand), more than one; Clinic word "hand" (clinic.item.tool-hand), more than one.
5. Please record: "pag"
   - Needed by: Clinic word "foot" (body-foot).
6. Please record: "pag"
   - Needed by: Clinic word "foot" (body-foot), more than one.
7. Please record: "hakri"
   - Needed by: Clinic word "eye" (body-eye); Clinic word "teaspoon" (cl-chamchi).
8. Please record: "akh"
   - Needed by: Clinic word "eye" (body-eye).
9. Please record: "trae"
   - Needed by: Clinic word "eye" (body-eye), more than one; Clinic word "teaspoon" (cl-chamchi), more than one.
10. Please record: "akhyu"
   - Needed by: Clinic word "eye" (body-eye), more than one.
11. Please record: "gutan"
   - Needed by: Clinic word "knee" (body-knee).
12. Please record: "gutan"
   - Needed by: Clinic word "knee" (body-knee), more than one.
13. Please record: "dabo"
   - Needed by: Clinic word "left" (side-left); Clinic word "left" (cl-dabo); Clinic word "left" (tooth-left).
14. Please record: "jamni"
   - Needed by: Clinic word "right (side)" (side-right); Clinic word "right (side)" (cl-jamno); Clinic word "right (side)" (tooth-right).
15. Please record: "chai"
   - Needed by: Clinic word "right (side)" (side-right); Clinic word "right (side)" (cl-jamno); Clinic word "right (side)" (tooth-right).
16. Please record: "lilo"
   - Needed by: Clinic word "green" (col-green); Clinic word "green" (green).
17. Please record: "chando"
   - Needed by: Clinic word "drops (not sprinkle)" (clinic.item.drops); Clinic word "drops (not sprinkle)" (cl-drops).
18. Please record: "chando"
   - Needed by: Clinic word "drops (not sprinkle)" (clinic.item.drops), more than one; Clinic word "drops (not sprinkle)" (cl-drops), more than one.
19. Please record: "arre re"
   - Needed by: Clinic word "oh dear!" (cl-arre).
20. Please record: "achija"
   - Needed by: Clinic word "Bye!" (cl-achija); clinic line "Good! (bye)" (clinic.line.goodbye-achija).
21. Please record: "hedo"
   - Needed by: Clinic word "Hey!" (cl-hedo).
22. Please record: "safarjan"
   - Needed by: Clinic word "apple" (cl-apple).
23. Please record: "safarjan"
   - Needed by: Clinic word "apple" (cl-apple), more than one.
24. Please record: "banai"
   - Needed by: Clinic word "make" (cl-make).
25. Please record: "waaro"
   - Needed by: Clinic word "with" (cl-waaro).
26. Please record: "kuro"
   - Needed by: clinic line "What's this?" (clinic.line.cl-whatsthis).
27. Please record: "ai"
   - Needed by: clinic line "What's this?" (clinic.line.cl-whatsthis).
28. Please record: "dudh"
   - Needed by: clinic line "{x}? No, my {y} hurts." (clinic.line.cl-wrong); clinic line "This is the {x}. The {y}, please." (clinic.line.cl-isthis); clinic line "Is it the {x}, or the {y}?" (clinic.line.cl-ask) … (7 lines).
29. Please record: "pela"
   - Needed by: clinic line "First {x}" (clinic.line.lang.first), with cook-maani; clinic line "First {a}, and then {b}" (clinic.line.pipeline.bring2); clinic line "I need {a} first, and then {rest}" (clinic.line.pipeline.needOrder) … (4 lines).
30. Please record: "ne poi"
   - Needed by: clinic line "And then {x}" (clinic.line.lang.then), with cook-maani; clinic line "First {a}, and then {b}" (clinic.line.pipeline.bring2); clinic line "I need {a} first, and then {rest}" (clinic.line.pipeline.needOrder) … (4 lines).
31. Please record: "ne"
   - Needed by: clinic line "and {x}" (clinic.line.lang.and), with cook-maani.
32. Please record: "aabhar aanjo"
   - Needed by: clinic line "Thank you!" (clinic.line.goodbye-aabhar); clinic line "Thank you!" (clinic.line.pipeline.thanks).
33. Please record: "daar"
   - Needed by: clinic line "First {a}, and then {b}" (clinic.line.pipeline.bring2); clinic line "I need {a} first, and then {rest}" (clinic.line.pipeline.needOrder); clinic line "First {a}, then {b}" (clinic.line.heal-ear-pluck2).
34. Please record: "salamun alaykum"
   - Needed by: clinic line "Peace be with you (hello)" (clinic.line.pipeline.salaam).
35. Please record: "wa alaikum salaam"
   - Needed by: clinic line "And peace be with you" (clinic.line.pipeline.salaam-back).
36. Please record: "muke"
   - Needed by: clinic line "I need {a}" (clinic.line.pipeline.need1) (informal); clinic line "I need {a}" (clinic.line.pipeline.need1) (polite); clinic line "I need {a}, and {rest}" (clinic.line.pipeline.needN) (informal) … (5 lines).
37. Please record: "khape"
   - Needed by: clinic line "I need {a}" (clinic.line.pipeline.need1) (informal); clinic line "I need {a}, and {rest}" (clinic.line.pipeline.needN) (informal); clinic line "I need {a} first, and then {rest}" (clinic.line.pipeline.needOrder).
38. Please record: "khapeti"
   - Needed by: clinic line "I need {a}" (clinic.line.pipeline.need1) (polite); clinic line "I need {a}, and {rest}" (clinic.line.pipeline.needN) (polite).
39. Please record: "khun"
   - Needed by: clinic line "First {a}, then {b}, then {c}" (clinic.line.heal-ear-pluck3); clinic line "Bandage: first the {a}, then the {b}, then the {c}" (clinic.line.heal-knee-path).

## Placeholders in a game's data that the engine can already say

A game file still shows an English placeholder (`kutchi: null`) for something the engine already knows. Step 4d and 4e (moving Cook and the clinic onto the engine) pick these up for free; nothing needs asking.

- `ph-pantry` (data/cook.json): "pantry" → *kabaat*
- `conversation.line.who-am-i` (data/conversations/lines.json): "Do you know who I am?" → *toke khabar ai, aau ker aiya* (draft)
- `body-hand` (data/clinic.json): "hand" → *hath* (draft)
- `body-eye` (data/clinic.json): "eye" → *akh* (draft)
- `body-knee` (data/clinic.json): "knee" → *gutan* (draft)
- `tool-hand` (data/clinic.json): "hand (look)" → *hath* (draft)
- `side-left` (data/clinic.json): "left" → *dabo*
- `side-right` (data/clinic.json): "right" → *jamni* (draft)
- `clinic.item.drops` (data/clinic.json items): "drops" → *chando*
- `clinic.item.cup` (data/clinic.json items): "cup" → *cup*
- `clinic.item.tool-hand` (data/clinic.json items): "hand" → *hath* (draft)
- `clinic.line.cl-whatsthis` (data/clinic.json): "What's this?" → *hi kuro ai*
- `cl-drops` (data/clinic/lang.json): "drops" → *chando*
- `cl-make` (data/clinic/lang.json): "make" → *banai*
- `tooth-left` (data/clinic/lang.json): "left" → *dabo*
- `tooth-right` (data/clinic/lang.json): "right" → *jamni* (draft)
- `clinic.pipeline.ladder.boy` (data/clinic/pipeline.json): "boy" → *chokro*
- `clinic.pipeline.ladder.girl` (data/clinic/pipeline.json): "girl" → *chokri*
- `clinic.pipeline.part.knee` (data/clinic/pipeline.json): "knee" → *gutan* (draft)
- `clinic.pipeline.part.hand` (data/clinic/pipeline.json): "hand" → *hath* (draft)
- `clinic.pipeline.part.foot` (data/clinic/pipeline.json): "foot" → *pag* (draft)
- `clinic.pipeline.part.ear` (data/clinic/pipeline.json): "ear" → *kan*
- `clinic.pipeline.part.eye` (data/clinic/pipeline.json): "eye" → *akh* (draft)
- `clinic.pipeline.feeling.hot` (data/clinic/pipeline.json): "hot" → *garam*
- `clinic.pipeline.feeling.cold` (data/clinic/pipeline.json): "cold" → *thundo*
- `pela` (data/clinic/heal/boing.json): "first" → *pela* (draft)
- `n1` (data/clinic/heal/boing.json): "one" → *hakro*
- `n2` (data/clinic/heal/boing.json): "two" → *ba*
- `n3` (data/clinic/heal/boing.json): "three" → *trae*
- `n4` (data/clinic/heal/boing.json): "four" → *char*
- `n5` (data/clinic/heal/boing.json): "five" → *panj* (draft)
- `body-ear` (data/clinic/heal/ear.json): "ear" → *kan*
- `side-left` (data/clinic/heal/ear.json): "my left" → *dabo*
- `side-right` (data/clinic/heal/ear.json): "my right" → *jamni* (draft)
- `w-drops` (data/clinic/heal/ear.json): "drops" → *chando*
- `drops` (data/clinic/heal/eye.json): "drops" → *chando*
- `hot` (data/clinic/heal/foot.json): "hot" → *garam*
- `cold` (data/clinic/heal/foot.json): "cold" → *thundo*
- `one` (data/clinic/heal/hair.json): "one" → *hakro*
- `body-knee` (data/clinic/heal/knee.json): "knee" → *gutan* (draft)
- `side-left` (data/clinic/heal/knee.json): "my left" → *dabo*
- `side-right` (data/clinic/heal/knee.json): "my right" → *jamni* (draft)
- `ph-red` (data/dress.json): "red" → *laal*
- `ph-green` (data/dress.json): "green" → *lilo*
- `ph-black` (data/dress.json): "black" → *kari*
- `ph-orange` (data/dress.json): "orange" → *santra* (draft)
- `ph-dupatta` (data/dress.json): "dupatta" → *pacheri*
- `ph-left` (data/dress.json): "left" → *dabo*
- `ph-right` (data/dress.json): "right" → *jamni* (draft)
- `ph-light` (data/who.json): "light" → *bar*
- `who.line.who-ate` (data/who.json): "Who ate the sweets?" → *ker mitai khai vyo*
- `who.line.oops` (data/who.json): "Oh dear!" → *arre re* (draft)
- `ph-rel-in` (data/relations.json): "in" → *me*
- `ph-rel-on` (data/relations.json): "on" → *mathe*
- `ph-rel-under` (data/relations.json): "under" → *niche*
- `ph-rel-behind` (data/relations.json): "behind" → *puthiya*
- `ph-rel-nextto` (data/relations.json): "next to" → *bajume*
- `ph-rel-front` (data/relations.json): "in front of" → *agiya*
- `ph-rel-first` (data/relations.json): "first" → *pela* (draft)
- `ph-door` (data/monsoon.json): "the door" → *darwajo*
- `snap.line.snap-what` (data/snap.json): "What's this?" → *hi kuro ai*
- `ph-t-bowl` (data/tidy.json): "the bowl" → *bakuli*
- `ph-t-shelf` (data/tidy.json): "the shelf" → *shelf*
- `ph-plate` (data/tidy.json): "plate" → *saani*
- `ph-cup` (data/tidy.json): "cup" → *cup*
- `ph-glass` (data/tidy.json): "glass" → *glass*
- `ph-p-nana` (data/tidy.json): "Nana" → *Nana*
- `ph-p-ma` (data/tidy.json): "Ma" → *Ma*
- `ph-p-ali` (data/tidy.json): "Ali" → *Ali*
- `ph-p-bigma` (data/tidy.json): "Big Ma" → *wadima*
- `ph-col-red` (data/tidy.json): "red" → *laal*
- `ph-col-green` (data/tidy.json): "green" → *lilo*
- `tidy.line.whatsthis` (data/tidy.json): "What's this?" → *hi kuro ai*
- `ph-shelf` (data/find.json): "shelf" → *shelf*
- `ph-table` (data/find.json): "table" → *table*
- `ph-bowl` (data/find.json): "bowl" → *bakuli*

## Recorded but not yet ticked OK

- no OK recording of "atto"
- no OK recording of "laal"
- no OK recording of "kar"
- no OK recording of "slow"
- no OK recording of "gund"
- no OK recording of "firai"
- no OK recording of "nindha"
- no OK recording of "bhar"
- no OK recording of "chulo"
- no OK recording of "bar"
- no OK recording of "kan"
- no OK recording of "kan"
- no OK recording of "garam"
- no OK recording of "thundo"
- no OK recording of "barabar"
- no OK recording of "laal"
- no OK recording of "barabar"

