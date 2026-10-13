# Step 4e: every clinic line that changed wording (before → after)

Built by Node from the same seeds before (eefc3f1) and after: the pipeline's cards, lines and review words (39 patients × levels 1-3) and every heal game's rows (levels 1-3, 24 seeds). `<` before, `>` after.

## Pipeline (waiting, diagnosis, pharmacy, send-off, review)
```diff
- diagnosis card: [Look at] [the arm]
- diagnosis card: [Look at] [the foot]
- diagnosis card: [Look at] [the hand]
- diagnosis card: [Look at] [the knee]
- diagnosis card: [Look at] [the left arm]
- diagnosis card: [Look at] [the left finger]
- diagnosis card: [Look at] [the left foot]
- diagnosis card: [Look at] [the left hand]
- diagnosis card: [Look at] [the left knee]
- diagnosis card: [Look at] [the left leg]
- diagnosis card: [Look at] [the left toe]
- diagnosis card: [Look at] [the leg]
- diagnosis card: [Look at] [the neck]
- diagnosis card: [Look at] [the right arm]
- diagnosis card: [Look at] [the right elbow]
- diagnosis card: [Look at] [the right foot]
- diagnosis card: [Look at] [the right hand]
- diagnosis card: [Look at] [the right knee]
- diagnosis card: [Look at] [the right leg]
- diagnosis card: [Look at] [the tummy]
- diagnosis card: [Look in] [the ear]
- diagnosis card: [Look in] [the left ear]
- diagnosis card: [Look in] [the left eye]
- diagnosis card: [Look in] [the mouth]
- diagnosis card: [Look in] [the tooth]
- diagnosis card: [The temperature:] [the head]
+ diagnosis card: [Look at the arm]
+ diagnosis card: [Look at the leg]
+ diagnosis card: [Look at the neck]
+ diagnosis card: [Look at the right arm]
+ diagnosis card: [Look at the right elbow]
+ diagnosis card: [Look at the right leg]
+ diagnosis card: [Look at the right] gutan
+ diagnosis card: [Look at the right] hath
+ diagnosis card: [Look at the right] pag
+ diagnosis card: [Look at the tummy]
+ diagnosis card: [Look at the] dabo [arm]
+ diagnosis card: [Look at the] dabo [finger]
+ diagnosis card: [Look at the] dabo [leg]
+ diagnosis card: [Look at the] dabo [toe]
+ diagnosis card: [Look at the] dabo gutan
+ diagnosis card: [Look at the] dabo hath
+ diagnosis card: [Look at the] dabo pag
+ diagnosis card: [Look at the] gutan
+ diagnosis card: [Look at the] hath
+ diagnosis card: [Look at the] pag
+ diagnosis card: [Look in the left] akh
+ diagnosis card: [Look in the mouth]
+ diagnosis card: [Look in the tooth]
+ diagnosis card: [Look in the] dabo kan
+ diagnosis card: [Look in the] kan
+ diagnosis card: [The temperature: the head]
- diagnosis says: [My ear hurts]
- diagnosis says: [My foot hurts]
- diagnosis says: [My hand hurts]
- diagnosis says: [My knee hurts]
- diagnosis says: [My left eye]
- diagnosis says: [My left foot]
- diagnosis says: [My left hand]
+ diagnosis says: [My left] akh
+ diagnosis says: [My left] hath
+ diagnosis says: [My left] pag
- diagnosis says: [My right ear]
- diagnosis says: [My right eye]
- diagnosis says: [My right foot]
- diagnosis says: [My right hand]
+ diagnosis says: [My right] akh
+ diagnosis says: [My right] hath
+ diagnosis says: [My right] kan
+ diagnosis says: [My right] pag
- goodbye aabhar: Aabhar aanjo!
- goodbye achija: Achija!
+ diagnosis says: [My] gutan [hurts]
+ diagnosis says: [My] hath [hurts]
+ diagnosis says: [My] kan [hurts]
+ diagnosis says: [My] pag [hurts]
+ goodbye aabhar: Thank you.
+ goodbye achija: Khuda-fis.
- line close: [Close the clinic]
- line found: [Found it]
+ line close: [Close the clinic.]
+ line found: [Found it.]
- line next: [Next]
+ line next: [Next.]
- line onemore: [One more thing]
- line salaam-back: Wa alaikum salaam
- line salaam: Salamun alaykum
- line thanks: Aabhar aanjo!
- line thatsit: [That's it]
- line tobench: [To the bench]
- line tocounter: [To the counter]
+ line onemore: [One more thing.]
+ line salaam-back: Wa alaikum salaam.
+ line salaam: Salamun alaykum.
+ line thanks: Thank you.
+ line thatsit: [That's it!]
+ line tobench: [To the bench.]
+ line tocounter: [To the counter.]
- line whisper-ask: [Ask them how they feel]
+ line whisper-ask: [Ask them how they feel.]
+ pharmacy card: Pela [cotton]
+ pharmacy card: Pela [eye drops]
+ pharmacy card: Pela [hammer]
+ pharmacy card: Pela [jug of hot water]
+ pharmacy card: Pela [toothbrush]
+ pharmacy card: Pela [tweezers]
+ pharmacy card: Pela dudh
+ pharmacy card: Pela lilo [eye drops]
+ pharmacy card: Pela paani
- pharmacy card: ne [blue] [plaster]
+ pharmacy card: ne [blue plaster]
- pharmacy card: ne [drops]
- pharmacy card: ne [green] [drops]
- pharmacy card: ne [green] [plaster]
- pharmacy card: ne [green] [thread]
- pharmacy card: ne [red] [bandage]
- pharmacy card: ne [red] [plaster]
+ pharmacy card: ne chando
+ pharmacy card: ne laal [bandage]
+ pharmacy card: ne laal [plaster]
+ pharmacy card: ne lilo [plaster]
+ pharmacy card: ne lilo [thread]
+ pharmacy card: ne lilo chando
- pharmacy card: ne poi [blue] [plaster]
+ pharmacy card: ne poi [blue plaster]
- pharmacy card: ne poi [drops]
- pharmacy card: ne poi [green] [bandage]
- pharmacy card: ne poi [green] [drops]
- pharmacy card: ne poi [green] [plaster]
- pharmacy card: ne poi [red] [drops]
- pharmacy card: ne poi [red] [plaster]
+ pharmacy card: ne poi chando
+ pharmacy card: ne poi laal [plaster]
+ pharmacy card: ne poi laal chando
+ pharmacy card: ne poi lilo [bandage]
+ pharmacy card: ne poi lilo [plaster]
+ pharmacy card: ne poi lilo chando
- pharmacy card: pela [cotton]
- pharmacy card: pela [eye drops]
- pharmacy card: pela [green] [eye drops]
- pharmacy card: pela [hammer]
- pharmacy card: pela [jug of hot water]
- pharmacy card: pela [toothbrush]
- pharmacy card: pela [tweezers]
- pharmacy card: pela dudh
- pharmacy card: pela paani
- pharmacy head: [Bring me] []
- review: Aabhar aanjo!
- review: Achija!
+ pharmacy head: [Bring me]
+ review: Khuda-fis.
+ review: Thank you.
- review: [boy]
- review: [cold]
- review: [drops]
- review: [ear]
- review: [eye]
- review: [foot]
- review: [girl]
- review: [hand]
- review: [hot]
- review: [knee]
- review: [old man]
- review: [old woman]
+ review: akh
+ review: chando
+ review: chokri
+ review: chokro
+ review: garam
+ review: gutan
+ review: hath
+ review: kan
+ review: pag
+ review: thundo
- waiting card: [Bring in] [the boy]
- waiting card: [Bring in] [the girl]
- waiting card: [Bring in] [the man]
- waiting card: [Bring in] [the old man]
- waiting card: [Bring in] [the old woman]
- waiting card: [Bring in] [the short boy]
- waiting card: [Bring in] [the short girl]
- waiting card: [Bring in] [the short man]
- waiting card: [Bring in] [the short old man]
- waiting card: [Bring in] [the short woman]
- waiting card: [Bring in] [the short young man]
- waiting card: [Bring in] [the short young woman]
- waiting card: [Bring in] [the tall boy]
- waiting card: [Bring in] [the tall girl]
- waiting card: [Bring in] [the tall man]
- waiting card: [Bring in] [the tall old man]
- waiting card: [Bring in] [the tall woman]
- waiting card: [Bring in] [the tall young man]
- waiting card: [Bring in] [the tall young woman]
- waiting card: [Bring in] [the woman]
- waiting card: [Bring in] [the young man]
- waiting card: [Bring in] [the young woman]
+ waiting card: [Bring in man]
+ waiting card: [Bring in old man]
+ waiting card: [Bring in old woman]
+ waiting card: [Bring in short man]
+ waiting card: [Bring in short old man]
+ waiting card: [Bring in short woman]
+ waiting card: [Bring in short young man]
+ waiting card: [Bring in short young woman]
+ waiting card: [Bring in short] chokri
+ waiting card: [Bring in short] chokro
+ waiting card: [Bring in tall man]
+ waiting card: [Bring in tall old man]
+ waiting card: [Bring in tall woman]
+ waiting card: [Bring in tall young man]
+ waiting card: [Bring in tall young woman]
+ waiting card: [Bring in tall] chokri
+ waiting card: [Bring in tall] chokro
+ waiting card: [Bring in woman]
+ waiting card: [Bring in young man]
+ waiting card: [Bring in young woman]
+ waiting card: [Bring in] chokri
+ waiting card: [Bring in] chokro
```

## Heal games' rows and words
```diff
+ Chando hakro
+ Chando, ba
+ Chando, char
+ Chando, panj
+ Chando, trae
+ Chando: ba [yellow], ba [blue]
+ Chando: ba [yellow], ba laal
+ Chando: ba [yellow], ba lilo
+ Chando: ba laal, ba [blue]
+ Chando: ba laal, ba [yellow]
+ Chando: ba lilo, ba [blue]
+ Chando: ba lilo, ba [yellow]
+ Chando: ba lilo, ba laal
+ Chando: hakro [blue], hakro [yellow]
+ Chando: hakro [blue], hakro laal
+ Chando: hakro [blue], hakro lilo
+ Chando: hakro [yellow], hakro [blue]
+ Chando: hakro [yellow], hakro lilo
+ Chando: hakro laal, hakro [blue]
+ Chando: hakro lilo, hakro [blue]
+ Chando: hakro lilo, hakro [yellow]
+ Chando: hakro lilo, hakro laal
- Ne poi [drops], ba
- Ne poi [drops], char
- Ne poi [drops], hakro
- Ne poi [drops], panj
- Ne poi [drops], trae
+ Ne poi chando, ba
+ Ne poi chando, char
+ Ne poi chando, hakro
+ Ne poi chando, panj
+ Ne poi chando, trae
- Paani [feel hot], ba [jugs]
- Paani [feel hot], char [jugs]
- Paani [feel hot], hakro [jugs]
- Paani [feel hot], panj [jugs]
- Paani [feel hot], trae [jugs]
+ Paani garam, ba [jugs]
+ Paani garam, char [jugs]
+ Paani garam, hakro [jugs]
+ Paani garam, panj [jugs]
+ Paani garam, trae [jugs]
- [Drops] hakro
- [Drops], ba
- [Drops], char
- [Drops], panj
- [Drops], trae
- [Drops]: ba [yellow], ba [blue]
- [Drops]: ba [yellow], ba laal
- [Drops]: ba [yellow], ba lilo
- [Drops]: ba laal, ba [blue]
- [Drops]: ba laal, ba [yellow]
- [Drops]: ba lilo, ba [blue]
- [Drops]: ba lilo, ba [yellow]
- [Drops]: ba lilo, ba laal
- [Drops]: hakro [blue], hakro [yellow]
- [Drops]: hakro [blue], hakro laal
- [Drops]: hakro [blue], hakro lilo
- [Drops]: hakro [yellow], hakro [blue]
- [Drops]: hakro [yellow], hakro lilo
- [Drops]: hakro laal, hakro [blue]
- [Drops]: hakro lilo, hakro [blue]
- [Drops]: hakro lilo, hakro [yellow]
- [Drops]: hakro lilo, hakro laal
- [Make] hakro chamchi [honey] waaro dudh
- [Make] hakro chamchi aadu ne paani
- [Make] hakro chamchi hardar waaro dudh
- [Make] hakro chamchi limu ne paani
+ [Make] hakri chamchi [honey] waaro dudh
+ [Make] hakri chamchi aadu ne paani
+ [Make] hakri chamchi hardar waaro dudh
+ [Make] hakri chamchi limu ne paani
- [body ear]
- [body knee]
- [body tooth]
- [drops]
- [feel hot]
- [left]
+ [tooth]
+ chando
- haa
+ garam
+ gutan
+ ha
- jamno
+ kan
- marcha
+ mirchi
- ne poi [left]
- ne poi jamno
```
