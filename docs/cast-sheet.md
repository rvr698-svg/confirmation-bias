# Cast sheet — for sign-off

The twelve senior colleagues who interrupt you, and how they are drawn. Mark this up and I will
apply it. Everything here maps to one line in `src/config/cast.ts`.

**Pronouns are not a proposal.** They are read from each character's own authored copy in
`src/config/interruptions.ts`, which was already internally consistent. One exception is flagged
below. `tests/cast.test.ts` fails if a pronoun and its copy ever disagree again.

**Looks are a proposal** and none of them is a guess from a surname. A name does not tell you what
somebody looks like, so the cast is varied deliberately rather than mapped from name origins. If any
individual depiction is wrong for the audience, say so and it changes in a word.

## The cast

| # | Who | Role | Seniority | Pronoun | Skin | Hair | Glasses | Jacket | Collar |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Professor Alan Vance | PVC Education | Senior leader | he | fair | receding, grey | yes | charcoal | tie |
| 2 | Nadia Oyelaran | Director of Marketing | Middle | she | brown | bob, black | no | teal | open |
| 3 | Derek Mbatha | Academic Registrar | Senior | he | light | cropped, brown | yes | navy | tie |
| 4 | Dr Helen Prosser | Dean of Health and Social Care | Senior | she | tan | bun, dark | yes | plum | open |
| 5 | Professor Ines Karim | PVC International | Senior leader | she | light | short, auburn | no | navy | open |
| 6 | Gwen Ashby | Chief Operating Officer | Senior leader | she | deep | coils, black | yes | charcoal | open |
| 7 | Marcus Lidell | Chief of Staff to the VC | Senior | **they** | olive | locs, dark | no | navy | tie |
| 8 | Sanjay Rehill | Director of Digital | Middle | he | tan | short, black | yes | teal | open |
| 9 | Bea Nkemelu | Head of Widening Participation | Middle | she | brown | locs, black | no | sand | open |
| 10 | Professor Roy Ellington | Head of School, Creative Arts | Senior | he | fair | short, grey | no | olive | open |
| 11 | Tom Brackley | Director of Estates | Middle | he | olive | shaved | no | sand | open |
| 12 | Priya Raghavan | Head of Student Recruitment | Middle | she | tan | long, dark | yes | teal | open |

Marge, Deputy Head of Admissions, is the player's ally rather than an interrupter. She is a woman in
a middle management admissions role, which matches the pattern you described. She is drawn
separately in `src/components/Mascot.tsx` and is not in this table.

## The three decisions I need from you

1. **Marcus Lidell's pronouns.** The only character whose copy never states any. The "her" in that
   card — *"on a screen in her office. She will look at it during the day"* — is the
   Vice-Chancellor, not Marcus. They is used until you say otherwise, and the test that checks
   pronoun agreement lists this card as the one deliberate exception.
2. **Ties.** Three characters wear one: Vance, Mbatha and Lidell. No woman in the cast does. That
   reflects how ties are actually worn, but it is a visual pattern, so it is your call whether it
   stays.
3. **Religious and cultural dress.** Nobody is drawn in a headscarf, turban or kippah. I did not
   want to infer anyone's faith from their name, which is exactly the stereotyping you asked me to
   avoid. If you want that representation in the cast, tell me which characters and I will add the
   silhouettes to the palette.

## What the tests now enforce

- Every bright idea has a cast entry, and every cast entry has a bright idea.
- A character's pronoun matches the pronouns in their own copy.
- No nag line uses a pronoun the character does not use.
- No two colleagues are drawn identically, and at least four skin tones and five hairstyles are in
  play.
- **No hairstyle is exclusive to one pronoun.** The first draft failed this: short and cropped hair
  went only to men, and bobs, buns, coils, locs and long hair only to women. Ines Karim and Marcus
  Lidell were recast to break it.

## Where each thing lives

| File | What you would change |
|---|---|
| `src/config/cast.ts` | Who each colleague is and how they are drawn |
| `src/config/looks.ts` | The palette: skin tones, hair colours, hairstyles, jackets |
| `src/config/pronouns.ts` | The pronoun sets and their verb agreement |
| `src/config/nags.ts` | What they say while you stall |
| `src/config/interruptions.ts` | The copy. Untouched by casting |
