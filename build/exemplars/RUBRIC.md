# Exemplar rubric

Every rating and review agent in `find-exemplars` reads this file. It is the single
place the criteria live — edit it here and the next run uses the new definitions
without any change to the workflow script.

The question every score answers: **if the cookbook could show only a handful of
papers under this dimension, is this one of them?**

## Criteria

Score each 0–5 (integers). 3 is competent-but-ordinary; 5 is reserved and should be
rare. Judge the paper *as an instance of this dimension*, not as a paper overall.

| # | Criterion | Weight | 5 looks like | 0–1 looks like |
|---|---|---|---|---|
| 1 | **Representativeness** — is this a clean instance of *this* dimension? | 0.20 | The dimension's mechanism is the paper's core contribution; you could define the dimension from this paper alone | The dimension shows up incidentally, or the paper sits closer to a neighbouring dimension |
| 2 | **Impact** — does the design move change what the user can actually do? | 0.20 | Addresses a real breakdown; the interface move plausibly (or demonstrably) shifts outcomes, not just preference | Cosmetic, or the interface change is incidental to the reported contribution |
| 3 | **Generalizability** — does it transfer past its own domain and task? | 0.20 | The mechanism is domain-independent; a reader in an unrelated field can lift it directly | Only works given this paper's dataset, population, or hardware |
| 4 | **Mechanism clarity** — can a designer rebuild it from the description? | 0.15 | Concrete, nameable interaction: what the user does, what the system does back, what is on screen | Described only at the level of intent ("supports reflection") with no legible mechanism |
| 5 | **Interestingness** — is the move non-obvious? | 0.15 | Reframes the problem, or resolves a tension a careful designer would expect to be unresolvable | The default thing anyone would build first |
| 6 | **Evidence strength** — is the coding actually supported? | 0.10 | Central role, high confidence, and the verbatim quote plainly demonstrates the mechanism | The quote is topical but does not show the mechanism; role or confidence is weak |

Weighted total = Σ(score × weight), so totals land on a 0–5 scale.

## Disqualifiers

Set `disqualify: true` (and say why) rather than scoring low, when:

- the evidence quote does not support the dimension assignment at all;
- the paper is a survey, position paper, or dataset with no interface of its own;
- the "example" is a study *about* an interface the authors did not build or specify.

## Set-level rules — for the reviewers and the curator, not the raters

Raters score each candidate independently. The final set is chosen against the set:

- **Pattern spread** — at most 2 exemplars in a dimension may lead with the same
  `pattern_id`. A dimension's exemplars should show its range, not its most-coded corner.
- **No repeated system** — one entry per `system_id`.
- **Domain spread** — prefer displacing the lower-scoring of two exemplars from the
  same application domain, when the gap is under 0.3.
- **A rank is a claim** — anything in the final set must survive the question "why this
  and not the candidate directly below it?" in one sentence.

## Known limits of the inputs

Candidates carry title, venue, year, coded pattern edges with verbatim quotes, and
factor coverage — **no abstracts and no full text**. Score impact and interestingness
from the coded evidence and the title, and say so when a candidate is unjudgeable on
what is present rather than guessing.
