# Kutchi Language NLP Engine Blueprint & Morphology Matrix

This document provides a complete, structured specification for building a rule-based natural language processing (NLP) engine or grammatical parser for the **Kutchi Language**. It synthesizes structural data from foundational academic literature—specifically *"Complete and Defective Agreement in Kutchi"* (Keine, Nisar, & Bhatt)—alongside a morphosyntactic paradigm database covering past, present, future tenses, honorific variations, and feature alignments.

---

## 1. Structural Engine Logic (The Syntactic Matrix)

Unlike mainstream Indo-Aryan languages (e.g., Hindi, Punjabi) that trigger ergativity using overt postpositional case markers like *ne*, **Kutchi tracks ergativity purely through verbal agreement changes**. 

Your engine must evaluate sentences through an **Aspect** and **Person** decision matrix to resolve variable bindings for **Person (π)**, **Number (#)**, and **Gender (γ)**.

### The Code Resolution Flow

```
                  ┌──────────────────────────────┐
                  │      Sentence Input          │
                  └──────────────┬───────────────┘
                                 ▼
                    Is Aspect PERFECTIVE?
                   /                                     YES                       NO
                 /                             Is Transitive?                          ▼
    /            \               [PATH A: COMPLETE AGREEMENT]
 YES              NO              Verb aligns with Subject φ-features:
 /                 \              Person (π) + Number (#) + Gender (γ)
▼                   ▼
Is Subject 1st Person?   [PATH A: COMPLETE AGREEMENT]
/               YES              NO
/                 ▼                  ▼
[PATH C: OBJECT    [PATH B: DEFECTIVE AGREEMENT]
 AGREEMENT]         Subject agreement drops Gender (γ) & Singular.
                    Verb targets Object or defaults.
```

### The Three Structural Engine Paths

1. **Path A: Complete Agreement** *(Triggered by Non-Perfective Aspects OR Intransitive Perfective Verbs)*
   * **Rule:** The engine fully binds all verb inflection variables (`person`, `number`, `gender`) to the **Subject**.
   * **Example Structure:** `Subject[Masc, Sg, 3rd] + Object + Verb[Masc, Sg, 3rd]`

2. **Path B: Defective Agreement** *(Triggered by Transitive Perfective Verbs + 2nd/3rd Person Subject)*
   * **Rule:** The engine blocks the verb from inheriting the subject's **Gender (γ)** and **Singular (#)** features. 
   * **Resolution:** The verb defaults its number value or seeks feature valuation from the **Direct Object**'s bundle.

3. **Path C: The Person Split Exception** *(Triggered by Transitive Perfective Verbs + 1st Person Subject)*
   * **Rule:** The engine completely kills subject agreement. 
   * **Resolution (Singular "I"):** The verb features adapt fully to the **Object's** gender and number characteristics.
   * **Resolution (Plural "We"):** Resolves to a dialect-dependent split fallback routine.

---

## 2. Core Lexicon & Paradigm Bundles

Every lexical item in your database requires precise metadata tagging. Use the structural layout below to format your lexicon schemas.

### Word Order Constraints
* **Syntactic Typography:** Strictly **SOV** (Subject-Object-Verb).
* **Head Directionality:** Head-Final. Postpositions follow nouns (`Noun + Postposition`); auxiliary verbs follow main verbs (`Verb Root + Aspect Suffix + Auxiliary`).

### Primitives & Feature Bundles
* **Genders (γ):** `M` (Masculine), `F` (Feminine), `N` (Neuter - e.g., *Marchu* / Chilli).
* **Numbers (#):** `Sg` (Singular), `Pl` (Plural).
* **Honorific Levels (H):** `Informal/Peer` ($H_0$), `Formal/Honorific` ($H_1$).

### Pronoun Paradigm Database

| Person | Register | Number | String Token (Latin) | Script Token (Gujarati) | Feature Metadata Tags |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1st** | Neutral | Sg | Aaũ | આઉં | `[pers:1, num:Sg, hon:0]` |
| **1st** | Neutral | Pl | Asĩ | અસીં | `[pers:1, num:Pl, hon:0]` |
| **2nd** | Informal | Sg | Tũ | તું | `[pers:2, num:Sg, hon:0]` |
| **2nd** | Formal | Sg/Pl | Tavĩ / Aap | તવીં / આપ | `[pers:2, num:Pl, hon:1]` |
| **3rd (Prox)**| Neutral | Sg | He | હે | `[pers:3, num:Sg, prox:1]` |
| **3rd (Dist)**| Neutral | Sg | Ho | હો | `[pers:3, num:Sg, prox:0]` |
| **3rd** | Neutral | Pl | Heo / Hoa | હેઓ / હોઆ | `[pers:3, num:Pl]` |

---

## 3. Verbal Inflection Suffix Tables

To map root verbs into fully formed surface-level strings, execute lookup arrays using the following morphological paradigms. 

*(Example root verb used for clarity: **Khaa-** [To Eat])*

### 3.1 Present Tense Paradigms (Habitual / Progressive)
Present actions evaluate entirely along **Path A (Complete Agreement)**. Suffixes vary by gender and number.

| Person | Number | Gender | Suffix Token | Surface Output Example | Notes / Context |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1st** | Sg | Masc | `-dũs` / `-thõ` | Khaa-dũs (ખાધુંસ) | "I eat / I am eating" |
| **1st** | Sg | Fem | `-dĩs` / `-thĩ` | Khaa-dĩs (ખાદીંસ) | "I eat (F)" |
| **2nd ($H_0$)**| Sg | Masc | `-de` | Khaa-de (ખાદે) | "You eat" |
| **2nd ($H_0$)**| Sg | Fem | `-dĩ` | Khaa-dĩ (ખાદીં) | "You eat (F)" |
| **2nd ($H_1$)**| Pl / Hon | Common | `-do` / `-ta` | Khaa-do (ખાદો) | Formal / Plural address |
| **3rd** | Sg | Masc | `-te` / `-tho` | Khaa-te (ખાતે) | "He eats" |
| **3rd** | Sg | Fem | `-tĩ` / `-thĩ` | Khaa-tĩ (ખાતીં) | "She eats" |
| **1st/3rd**| Pl | Common | `-ta` / `-dhasĩ` | Khaa-ta (ખાતા) | "We / They eat" |

### 3.2 Past Tense Paradigms (Perfective Aspect)
*Crucial Engine Rule:* If the verb root is tagged `[transitive: true]`, switch execution to **Path B** or **Path C**.

| Core Feature Focus | Number | Gender | Suffix Token | Surface Output Example | Engine Resolution Rule |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Object Target** | Sg | Masc | `-dho` | Khaa-dho (ખાધો) | Agrees with Masc Sg Object |
| **Object Target** | Sg | Fem | `-dhĩ` | Khaa-dhĩ (ખાધી) | Agrees with Fem Sg Object |
| **Object Target** | Sg | Neut | `-dhũ` | Khaa-dhũ (ખાધું) | Agrees with Neut Sg Object (*Marchu*) |
| **Object Target** | Pl | Masc | `-dha` | Khaa-dha (ખાધા) | Agrees with Masc Pl Objects |
| **Object Target** | Pl | Fem | `-dhiyũ` | Khaa-dhiyũ (ખાધિયું) | Agrees with Fem Pl Objects |
| **Object Target** | Pl | Neut | `-dha` | Khaa-dha (ખાધા) | Agrees with Neut Pl Objects (*Marcha*) |

### 3.3 Future Tense Paradigms
Future tense markers in Kutchi bypass aspectual splitting and employ distinct modal suffix markers bound to person metrics.

| Person | Number | Register | Suffix Token | Surface Output Example | Functional Meaning |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1st** | Sg | Neutral | `-ndũs` | Khaa-ndũs (ખાઇન્દુસ) | "I will eat" |
| **1st** | Pl | Neutral | `-ndasĩ` | Khaa-ndasĩ (ખાઇન્દસીં) | "We will eat" |
| **2nd** | Sg | Informal ($H_0$)| `-nde` | Khaa-nde (ખાઇન્દે) | "You (informal) will eat" |
| **2nd** | Pl / Formal | Formal ($H_1$)| `-ndo` | Khaa-ndo (ખાઇન્દો) | "You (formal) will eat" |
| **3rd** | Sg | Neutral | `-ndos` / `-nde`| Khaa-ndos (ખાઇન્દોસ) | "He/She/It will eat" |
| **3rd** | Pl | Neutral | `-nda` | Khaa-nda (ખાઇન્દા) | "They will eat" |

---

## 4. Pure Python Architecture Blueprint

This algorithmic script functions as an executable rule execution blueprint. You can pipeline this file directly into an AI code-generation machine to compile fully productionized components.

```python
class LexicalEntity:
    def __init__(self, token, person=None, number=None, gender=None, transitive=False):
        self.token = token
        self.person = person       # 1, 2, 3
        self.number = number       # 'Sg', 'Pl'
        self.gender = gender       # 'M', 'F', 'N'
        self.transitive = transitive # Boolean (Only for verbs)

class KutchiGrammarEngine:
    def __init__(self):
        # Suffix matrices mapped explicitly to grammatical resolution paths
        self.past_suffixes = {
            ('Sg', 'M'): 'dho',  ('Sg', 'F'): 'dhĩ',  ('Sg', 'N'): 'dhũ',
            ('Pl', 'M'): 'dha',  ('Pl', 'F'): 'dhiyũ', ('Pl', 'N'): 'dha'
        }
        self.present_suffixes = {
            (1, 'Sg', 'M'): 'dũs', (1, 'Sg', 'F'): 'dĩs',
            (2, 'Sg', 'M'): 'de',   (2, 'Sg', 'F'): 'dĩ',   (2, 'Pl', 'Common'): 'do',
            (3, 'Sg', 'M'): 'te',   (3, 'Sg', 'F'): 'tĩ',   (3, 'Pl', 'Common'): 'ta',
            (1, 'Pl', 'Common'): 'dhasĩ'
        }
        self.future_suffixes = {
            (1, 'Sg'): 'ndũs',  (1, 'Pl'): 'ndasĩ',
            (2, 'Sg'): 'nde',   (2, 'Pl'): 'ndo',
            (3, 'Sg'): 'ndos',  (3, 'Pl'): 'nda'
        }

    def generate_verb_surface_form(self, verb_root, subject, direct_object, tense, is_honorific=False):
        """
        Resolves structural agreement constraints using formal linguistic paths 
        to output the correctly inflected verbal suffix.
        """
        resolved_features = {'number': None, 'gender': None, 'person': None}
        
        # Effective number resolution forcing formal attributes to evaluate as plural
        subj_num = 'Pl' if (subject.number == 'Pl' or is_honorific) else 'Sg'
        
        # PATH RESOLUTION MATRIX
        
        # 1. FUTURE TENSE EVALUATION
        if tense == 'FUTURE':
            person_key = 2 if is_honorific else subject.person
            suffix = self.future_suffixes.get((person_key, subj_num), 'nde')
            return f"{verb_root.token}-{suffix}"
            
        # 2. PRESENT TENSE EVALUATION (PATH A: Complete Subject Agreement)
        elif tense == 'PRESENT':
            if subj_num == 'Pl':
                suffix = self.present_suffixes.get((subject.person, 'Pl', 'Common'), 'ta')
            else:
                suffix = self.present_suffixes.get((subject.person, 'Sg', subject.gender), 'te')
            return f"{verb_root.token}-{suffix}"
            
        # 3. PAST TENSE EVALUATION (Aspect Split Routing)
        elif tense == 'PAST':
            if not verb_root.transitive:
                # Intransitive Past behaves like Path A (Agrees with subject)
                suffix = self.past_suffixes.get((subj_num, subject.gender), 'dho')
                return f"{verb_root.token}-{suffix}"
            
            # Transitive Past triggers Ergative Split Logic
            else:
                if subject.person == 1:
                    # PATH C: Complete Person Split Exception (Target Object properties explicitly)
                    if subj_num == 'Sg':
                        suffix = self.past_suffixes.get((direct_object.number, direct_object.gender), 'dhũ')
                    else:
                        # Plural "We" Dialect Fork (Engine Defaulting to Direct Object Valuation)
                        suffix = self.past_suffixes.get((direct_object.number, direct_object.gender), 'dhũ')
                    return f"{verb_root.token}-{suffix}"
                else:
                    # PATH B: Defective Subject Agreement (Drop gender and lock plural elements)
                    # Resolves validation dynamically via target object structure
                    suffix = self.past_suffixes.get((direct_object.number, direct_object.gender), 'dhũ')
                    return f"{verb_root.token}-{suffix}"

# SYSTEM INSTANTIATION & DEMONSTRATION RUNS
if __name__ == "__main__":
    engine = KutchiGrammarEngine()
    
    # Define entities based on user criteria: Subject, Object ("Chilli" / Marchu), Transitive Verb
    subject_he = LexicalEntity(token="Ho", person=3, number="Sg", gender="M")
    chilli_object = LexicalEntity(token="Marchu", person=3, number="Sg", gender="N")
    eat_verb = LexicalEntity(token="Khaa", transitive=True)
    
    print("--- EMULATOR VALIDATION CHECKS ---")
    
    # Scenario 1: Present Habitual (Path A - Verb targets "He" [Masc Sg 3rd])
    pres_out = engine.generate_verb_surface_form(eat_verb, subject_he, chilli_object, 'PRESENT')
    print(f"Present (Path A): {subject_he.token} {chilli_object.token} {pres_out} -> Expected suffix: -te")
    
    # Scenario 2: Past Transitive (Path B - Verb drops Subject properties, matches Neuter Sg Object "Marchu")
    past_out = engine.generate_verb_surface_form(eat_verb, subject_he, chilli_object, 'PAST')
    print(f"Past (Path B/C):   {subject_he.token} {chilli_object.token} {past_out} -> Expected suffix: -dhũ")
```

---

## 5. NLP Pipeline Design Directives (For AI Coding Engines)

When prompt-engineering or feeding this architecture to an LLM or code generator, supply these design constraints:

1. **Enforce Token-Level Tagging:** Ensure that the input tokenizers explicitly differentiate between `M`, `F`, and `N` (Neuter) nouns. If a vocabulary token like *Marchu* is parsed, its structural metadata must trigger neuter suffix forks (`-dhũ`/`-dha`).
2. **Handle Contextual Ellipsis:** Kutchi frequently drops subject pronouns in conversational registers. Instruct your AI agent to construct an **unexpressed-subject recovery node** that infers person traits directly from present/future suffixes (`-dũs` safely implies a 1st person singular speaker).
3. **Phonotactic Sandhi Rules:** When connecting roots ending in vowels (like *Khaa-*) to vowel-initial suffixes (like `-andasĩ`), the implementation pipeline should enforce glide insertion rules (e.g., converting `Khaa + andasĩ` smoothly to `Khaandasĩ` or `Khaayandasĩ`).
