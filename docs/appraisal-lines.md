# Appraisal lines — for sign-off

Two sentences at the end of the debrief, written in the register of a personal development review.
Banded by thirds, exactly like the end-of-game signpost, and drawn from a pool of four inside each
band so two people who both scored 3 out of 5 do not get identical words.

Which line you get is **not random**: it is drawn from the seed and from the shape of the cycle
(every measure's score out of five, whether you made the number, whether you were fined). The same
run always writes the same appraisal. A different set of choices writes a different one.

**Every line is true.** That is the joke and the constraint: nothing here may claim anything the
scorecard does not already say. The names of the best and worst measure, and the worst measure's own
detail sentence, are dropped in from the real result.

Regenerate this list at any time with:

```bash
npx vite-node scripts/appraisal-lines.ts
```

Mark up anything you want changed. Each line is one entry in `src/config/appraisal.ts`.

---

## Top third — 4 and 5 out of 5

*Sample: 3,842 against 3,800, best measure intake, worst measure budget.*

### Achievement

- **A1** — Delivered 3,842 enrolments against a target of 3,800, sustaining performance on the intake number through a cycle in which most of the sector moved.
- **A2** — Led the recruitment cycle end to end to 3,842 against 3,800, protecting the intake number at the points in the year where it would have been easiest not to.
- **A3** — Managed five competing measures to an intake of 3,842 against 3,800, with the intake number the standout and no escalation to the executive at any point.
- **A4** — Achieved 3,842 enrolments against 3,800. Strength on the intake number is evidenced in the cycle debrief and was the result of decisions taken in the autumn.

### Development

- **D1** — Development area for the coming cycle: the budget position. You finished £180k over budget.
- **D2** — Objective for next year: strengthen the budget position, which closed less well than the rest. You finished £180k over budget.
- **D3** — One area to build on: the budget position. You finished £180k over budget. Worth an early conversation rather than a late one.
- **D4** — With hindsight, the budget position was the trade-off that paid for the rest. You finished £180k over budget.

---

## Middle — 3 out of 5

*Sample: 4,162 against 3,800, best measure access, worst measure team.*

### Achievement

- **A1** — Delivered 4,162 enrolments against a target of 3,800 in a competitive market, with access and participation the strongest of the five measures.
  *(If you landed on the number, this becomes: "Delivered 4,162 enrolments against a target of 3,800, landing on the number in a competitive market.")*
- **A2** — Maintained recruitment at 4,162 against 3,800 across a full cycle, holding access and participation while managing competing institutional priorities.
- **A3** — Ran the cycle to 4,162 against 3,800, balancing five measures that cannot all be met and prioritising access and participation.
- **A4** — Completed the recruitment cycle at 4,162 against a target of 3,800, with performance on access and participation maintained throughout.

### Development

- **D1** — Development area: team capacity. Your team finished the cycle depleted. Expect resignations in October.
- **D2** — Area for attention next cycle: team capacity, which did not close where it needed to. Your team finished the cycle depleted. Expect resignations in October.
- **D3** — Priority for the coming year: team capacity. Your team finished the cycle depleted. Expect resignations in October. A plan for this will be brought forward.
- **D4** — Learning point: team capacity was visible by the spring and was not recovered. Your team finished the cycle depleted. Expect resignations in October.

---

## Bottom — 1 and 2 out of 5

*Sample: 4,584 against 4,050, best measure access, worst measure team.*

### Achievement

- **A1** — Held the recruitment operation together through an exceptionally difficult cycle, finishing on 4,584 against a target of 4,050.
- **A2** — Completed a full recruitment cycle to 4,584 against 4,050 under sustained pressure across every measure, retaining access and participation as the least affected.
- **A3** — Delivered 4,584 enrolments against a target of 4,050 in circumstances where several of the levers involved sat outside the department.
- **A4** — Managed the cycle to 4,584 against 4,050 while absorbing significant in-year disruption.
  *(If the regulator got involved, this becomes: "Delivered 4,584 enrolments against 4,050 and led the institutional response to the regulatory enquiry that followed.")*

### Development

- **D1** — Development areas: team capacity and, candidly, most of the others. Your team is done. You will rebuild this function before you run another cycle.
- **D2** — Substantial development required on team capacity. Your team is done. You will rebuild this function before you run another cycle. Support has been offered.
- **D3** — Team capacity and wellbeing is the immediate priority and will be the subject of a formal plan. Your team is done. You will rebuild this function before you run another cycle.
- **D4** — Reflection for next cycle: team capacity needed intervention earlier than it got one. Your team is done. You will rebuild this function before you run another cycle.

---

## How the measures read in a sentence

Reviewing these together caught a defect: the scorecard names do not slot into prose. "Sustaining
performance on intake against target" is not English. Each measure now carries two forms, in
`config.ts`:

| Scorecard name | In a sentence |
|---|---|
| Intake against target | the intake number |
| League table position | the league table position |
| Access and participation | access and participation |
| Budget position | the budget position |
| Team capacity and wellbeing | team capacity |

The full scorecard name is still used where a sentence starts with it, which is why bottom-band D3
reads "Team capacity and wellbeing is the immediate priority".
