# How the exemplars were chosen

This describes the process behind [EXEMPLARS.md](EXEMPLARS.md): five showcase papers for each
of the 10 design dimensions, and three for each of the 80 design patterns, selected from a
corpus of 1,748 HCI papers.

The goal was a defensible set rather than a plausible one. Every pick should be traceable to
coded evidence, and every pick should have survived somebody arguing against it.

## Selection runs per pattern, not per dimension

The obvious approach is to work dimension by dimension: take the papers coded to a dimension,
rank them, pick the best five. That approach failed, and the reason is worth recording because
it shaped everything else.

A dimension's eligible pool runs from 168 to 568 papers. No agent can read 568 papers, so
something has to cut the pool down first, and that cutting stage is where the process broke.
Three separate attempts at a deterministic ranking formula all landed at roughly the same
place, correlating between 0.20 and 0.25 with what the rating agents actually concluded. The
last attempt ranked every known-good paper *worse* than the first.

The diagnosis: term frequency separates topics, not design moves. A paper that constrains what
a generator may touch reads, lexically, as a paper about 3D printing. Style2Fab protects
load-bearing geometry from a generative model, which makes it close to a textbook instance of
Constraints and Reserved Control, and it uses none of the words that dimension's other papers
use.

Working per pattern removes the problem instead of solving it. A pattern's eligible pool has a
median of 37 papers, so for 42 of the 80 patterns the raters simply read every eligible paper
and no cutting stage exists at all. Only 9 patterns exceed 100.

Judging against a pattern is also sharper than judging against a dimension. Each pattern in the
taxonomy carries a `structural_signature` field stating what structure must be present for a
paper to instantiate it. Representativeness becomes a question with a checkable answer.

## Stages

### 1. Eligibility

A paper enters a pattern's pool if it has an edge to that pattern that is coded `central`, at
`high` confidence, with `review_status: verified`, carrying a verbatim quote of at least 40
characters.

This is a floor on evidence quality, not a judgment about the paper. It yields 3,813
paper-pattern pairs across the 80 patterns. Papers appear in several pools when they were coded
to several patterns.

`build/exemplar_patterns.py` writes one pool file per pattern.

### 2. Triage, for the 38 oversized patterns

Pools above 40 papers are split into shards of 40, and each shard is ranked.

The first version of this stage asked a model to score each paper 0 to 5 on whether it was an
instance of the pattern. Every paper scored 5. The reason is that eligibility has already
answered that question: a paper only reaches triage if its edge is coded central and verified,
so the honest answer really is yes, 81 times in a row.

The working version asks for a strict total ordering with no ties. Ranking forces
discrimination where absolute scoring does not, because the model has to prefer one paper over
another even when both qualify. Reasons come back specific, for example "timed silence
detection directly triggers unsolicited questions," rather than restating the score.

100 shards, no failures.

### 3. Rating

Three independent raters score every candidate on six criteria defined in
[build/exemplars/RUBRIC.md](build/exemplars/RUBRIC.md): representativeness (0.20), impact
(0.20), generalizability (0.20), mechanism clarity (0.15), interestingness (0.15), and evidence
strength (0.10).

The raters differ by design. A practitioner weights mechanism clarity and generalizability,
since an exemplar that cannot be rebuilt from its description is useless in a product. A
researcher weights interestingness and impact, and discounts competent work that repeats a
settled idea. A taxonomist weights representativeness and evidence strength, and checks whether
the quote demonstrates the pattern's structural signature or merely shares its subject matter.

Disagreement between the three is the signal the later stages use, so the lenses are kept
genuinely opposed rather than blended.

240 sheets, 1,873 papers per lens. The calibration came out as intended:

| lens | disqualified | mean | sd |
|---|---|---|---|
| taxonomist | 22% | 3.13 | 1.45 |
| researcher | 13% | 3.32 | 1.35 |
| practitioner | 11% | 3.38 | 1.31 |

The full 0 to 5 range is in use, top scores are held to about a fifth of ratings, and the
taxonomist disqualifies at twice the rate of the others, which is what its brief asks for. A
collapsed distribution here would have invalidated everything downstream, so it is checked
before curation runs.

### 4. Curation, per pattern

One curator per pattern weighs the top eight by consensus and picks three, writing for each a
short account of the mechanism and a sentence saying why it beat the paper below it.

Curators override the consensus where the evidence warrants it. In one case the curator dropped
the consensus runner-up for Linked Views on the grounds that an image element and its causal
prompt labels are not clearly two renderings of the same underlying item, which is what that
pattern's signature requires.

80 patterns, 235 exemplars, 216 distinct papers.

### 5. Adjudication, per dimension

Each dimension's exemplars are chosen from its patterns' winners, so every candidate arriving
here already carries three raters and a curator behind it. Re-rating would waste the pass, so
the two reviewers at this stage are pointed at what pattern-level work structurally could not
see.

An evidence auditor greps `build/paper_patterns_audit.csv` and the corpus to confirm each quote
exists as coded, that the role is central for the pattern claimed, and that the quote
demonstrates the signature. Anything it cannot confirm is marked unconfirmed.

A challenger argues that the set is unbalanced. Pattern-level curation optimised each pattern
alone, so nobody had yet asked whether five picks show a dimension's range or stack its
best-populated corner. The challenger names which under-represented pattern should displace
each candidate.

A curator settles the two and writes the final five.

## Reproducing a run

```bash
python3 build/exemplar_patterns.py            # per-pattern pools
python3 build/exemplar_codex.py triage        # 100 shards
python3 build/exemplar_codex.py rate          # 240 rating sheets
python3 build/exemplar_codex.py curate        # 80 pattern results
python3 build/exemplar_dimension_input.py     # group winners by dimension
# then the dimension-exemplars workflow, then:
python3 build/exemplar_report.py
```

Every Codex stage skips work already written to disk, so an interrupted run resumes by
rerunning the same command. `--force` redoes completed work. `python3 build/exemplar_codex.py
status` reports progress.

The bulk stages run through the local Codex CLI, and the dimension stage runs on Claude
subagents. That split is a cost decision rather than a methodological one. `codex exec
--output-schema` gives the same structured-output guarantee the Claude workflow tool does, so
the prompts are identical either way.

## What to distrust

**Pattern-level curation was never contested.** Three raters and a curator stand behind each
pattern's three exemplars, but no reviewer argued against that curator the way the dimension
stage does. A pattern's picks rest on one judgment.

**No abstracts, no full text at judging time.** Raters see titles, venues, years, and the coded
evidence quotes. The rubric tells them to score conservatively where a paper cannot be judged
on what is present, and the writeups often say so, but impact and interestingness are the
weakest-grounded criteria as a result.

**Rating quality is spot-checked, not audited.** The calibration statistics look right across
1,873 papers. That is a different claim from every individual score being sound.

**Eligibility excludes papers whose coding is weaker.** A paper with a `present` rather than
`central` edge, or a medium-confidence one, never enters a pool. This is deliberate, since the
alternative is showcasing papers whose coding nobody would defend, but it means the corpus was
searched at its well-coded core rather than across its whole extent.

**The report covers 80 patterns.** `build/cookbook_v2.json` contains 80, while the README
describes 83. The pipeline covered everything present in the data.

## Approaches that did not work

Recorded because each one cost real time and the negative result is the useful part.

**Ranking papers by vocabulary overlap.** Three vocabulary designs were tried: terms drawn from
the taxonomy's own prose, terms learned from the coded quotes, and terms learned from a
thousand-character window of full text around each quote. All three correlated at about 0.2
with rater consensus. The taxonomy version is circular, since papers do not use the editors'
words. The quote version is contaminated by whichever pattern is most heavily coded in a
dimension. The window version is worse still, because the paragraphs around a coded quote
describe the paper's application domain rather than its design move.

**Absolute scoring for triage.** Covered above. Any triage question that eligibility has
already answered will return the same answer every time.

**Optional fields in an output schema.** Strict structured-output mode requires `required` to
list every key in `properties`. Four optional fields caused all 240 rating invocations to fail
at request validation. Nothing was spent, since no model ran, but the failure is silent about
its cause unless you read the API error.

## Preparing the full text

Full text is used to learn vocabulary and was needed for the ranking work above. The supplied
extractions are two-column PDF dumps, and counting terms over them directly goes wrong four
ways, each measured over a random sample:

- 46% of lines interleave both columns, so any two-word term spanning the seam is a phantom match
- roughly 95 words per paper are split across a line end, matching neither half
- PDF ligature loss drops the f from fi and fl pairs, giving `diferent` and `specifc`, costing about 10% of the occurrences of every affected word
- the references heading is findable at a line start in only 63% of papers, so truncating the tail silently fails on the rest and related-work mentions count as the paper's own contribution

`build/exemplar_text.py` rebuilds per-column streams, rejoins hyphenated words within a column,
repairs the ligatures, and truncates at the references. It keeps 44% of the raw characters.
