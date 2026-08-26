export const meta = {
  name: 'find-exemplars',
  description: 'Rank exemplar papers for each of the 10 design dimensions: independent raters, adversarial reviewers, then a curator per dimension',
  whenToUse: 'When the cookbook needs a defensible handful of showcase papers per dimension (U01-U10), or after a recoding pass has changed the evidence.',
  phases: [
    { title: 'Triage', detail: 'Haiku reads every eligible paper and scores dimension fit', model: 'haiku' },
    { title: 'Rate', detail: 'three independent raters score every shortlisted candidate against RUBRIC.md' },
    { title: 'Review', detail: 'an evidence auditor and a challenger contest the top of each ranking' },
    { title: 'Curate', detail: 'one curator per dimension resolves the conflicts and writes the final set' },
    { title: 'Publish', detail: 'render EXEMPLARS.md and exemplars.json' },
  ],
}

// ---------------------------------------------------------------- configuration
const ALL_DIMENSIONS = ['U01', 'U02', 'U03', 'U04', 'U05', 'U06', 'U07', 'U08', 'U09', 'U10']

const cfg = {
  dimensions: (args && args.dimensions) || ALL_DIMENSIONS,
  shortlist: (args && args.shortlist) || 20,  // survive triage, go to the raters
  finalists: (args && args.finalists) || 8,   // how many go through review
  top: (args && args.top) || 5,               // how many survive into the report
}

// Weights live in build/exemplars/RUBRIC.md as well; keep the two in step.
const CRITERIA = [
  ['representativeness', 0.20],
  ['impact', 0.20],
  ['generalizability', 0.20],
  ['mechanism_clarity', 0.15],
  ['interestingness', 0.15],
  ['evidence_strength', 0.10],
]

const TRIAGE_SCHEMA = {
  type: 'object',
  required: ['scores'],
  properties: {
    scores: {
      type: 'array',
      items: {
        type: 'object',
        required: ['rid', 'fit', 'reason'],
        properties: {
          rid: { type: 'string' },
          fit: { type: 'integer', minimum: 0, maximum: 5,
                 description: '5 = the dimension is the paper\'s core contribution; 0 = not an instance of it' },
          reason: { type: 'string', description: 'at most 15 words' },
        },
      },
    },
  },
}

const RATER_LENSES = [
  {
    key: 'practitioner',
    stance: `You are a senior product designer building AI interfaces. You are shopping this dimension for moves you could ship next quarter. You care most about mechanism clarity and generalizability: an exemplar that cannot be rebuilt from its description is worthless to you, however clever. You are unimpressed by novelty that only works in a lab setting.`,
  },
  {
    key: 'researcher',
    stance: `You are an HCI researcher who reads this literature for a living. You care most about interestingness and impact: which of these actually moved the design space for this dimension, and which are the fifteenth instance of an idea that was already settled. You discount competent-but-derivative work even when it is well executed.`,
  },
  {
    key: 'auditor',
    stance: `You are a taxonomist who owns this catalogue and distrusts its coding. You care most about representativeness and evidence strength: does the verbatim quote actually demonstrate the dimension's mechanism, or is it merely topical? You are quick to mark disqualify when a paper sits closer to a neighbouring dimension than to this one.`,
  },
]

const REVIEW_LENSES = [
  {
    key: 'evidence-auditor',
    mandate: `Verify, do not re-rate. For each finalist, go back to the evidence: read its entry in the candidate file, and cross-check against the corpus with grep over build/paper_patterns_audit.csv (columns include rid, pattern_id, role, confidence, evidence_quote) and the paper's record in build/cookbook_v2.json. Confirm the quote exists as coded, that the role is central for a pattern belonging to THIS dimension, and that the quote genuinely shows the dimension's mechanism rather than merely mentioning its subject matter. Anything you cannot confirm is unconfirmed, and say exactly what is missing. Do not soften a verdict because the paper is otherwise good.`,
  },
  {
    key: 'challenger',
    mandate: `Argue against the ranking. Your default position is that the consensus is wrong: it rewarded fashionable topics, or a well-written quote, over the strongest instance of the dimension. For each finalist, make the best available case that it should be demoted or dropped. Then read the candidates that did NOT reach the finalist set and nominate any that the raters underrated, naming the specific finalist each should displace and why. A promotion with no displacement argument is not a promotion.`,
  },
]

// ---------------------------------------------------------------- output schemas
const scoreProps = {}
for (const [name] of CRITERIA) {
  scoreProps[name] = { type: 'integer', minimum: 0, maximum: 5 }
}

const RATING_SCHEMA = {
  type: 'object',
  required: ['category_id', 'ratings'],
  properties: {
    category_id: { type: 'string' },
    ratings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['rid', 'scores', 'reason'],
        properties: {
          rid: { type: 'string' },
          scores: { type: 'object', required: CRITERIA.map(c => c[0]), properties: scoreProps },
          reason: { type: 'string', description: 'one sentence, specific to this candidate' },
          disqualify: { type: 'boolean' },
          disqualify_reason: { type: 'string' },
        },
      },
    },
  },
}

const REVIEW_SCHEMA = {
  type: 'object',
  required: ['category_id', 'verdicts'],
  properties: {
    category_id: { type: 'string' },
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        required: ['rid', 'verdict', 'reason'],
        properties: {
          rid: { type: 'string' },
          verdict: { type: 'string', enum: ['keep', 'demote', 'drop'] },
          evidence_check: { type: 'string', enum: ['confirmed', 'unconfirmed', 'contradicted', 'not_checked'] },
          reason: { type: 'string' },
        },
      },
    },
    promotions: {
      type: 'array',
      items: {
        type: 'object',
        required: ['rid', 'displaces', 'reason'],
        properties: {
          rid: { type: 'string' },
          displaces: { type: 'string', description: 'rid of the finalist it should displace' },
          reason: { type: 'string' },
        },
      },
    },
  },
}

const CURATION_SCHEMA = {
  type: 'object',
  required: ['category_id', 'selected', 'wrote_file'],
  properties: {
    category_id: { type: 'string' },
    selected: { type: 'array', items: { type: 'string' }, description: 'final rids, best first' },
    wrote_file: { type: 'string' },
    overrides: { type: 'string', description: 'where you departed from the consensus order and why' },
  },
}

// ---------------------------------------------------------------- helpers
function weighted(scores) {
  let total = 0
  for (const [name, w] of CRITERIA) total += (scores[name] || 0) * w
  return total
}

function consensus(ratings) {
  // rid -> per-criterion mean, weighted mean, spread between raters, disqualify votes
  const byRid = {}
  for (const sheet of ratings) {
    if (!sheet || !sheet.ratings) continue
    for (const r of sheet.ratings) {
      const slot = byRid[r.rid] || (byRid[r.rid] = { rid: r.rid, totals: [], scores: {}, reasons: [], dq: 0, dqReasons: [] })
      slot.totals.push(weighted(r.scores))
      for (const [name] of CRITERIA) (slot.scores[name] || (slot.scores[name] = [])).push(r.scores[name] || 0)
      slot.reasons.push(r.reason)
      if (r.disqualify) {
        slot.dq += 1
        if (r.disqualify_reason) slot.dqReasons.push(r.disqualify_reason)
      }
    }
  }
  const rows = Object.values(byRid).map(s => {
    const mean = s.totals.reduce((a, b) => a + b, 0) / s.totals.length
    const spread = Math.max(...s.totals) - Math.min(...s.totals)
    const means = {}
    for (const [name] of CRITERIA) means[name] = Math.round((s.scores[name].reduce((a, b) => a + b, 0) / s.scores[name].length) * 10) / 10
    return {
      rid: s.rid,
      mean: Math.round(mean * 100) / 100,
      spread: Math.round(spread * 100) / 100,
      criteria: means,
      raters: s.totals.length,
      disqualify_votes: s.dq,
      disqualify_reasons: s.dqReasons,
      reasons: s.reasons,
    }
  })
  // A majority disqualify sinks a candidate outright; otherwise rank by consensus,
  // rid ascending on ties so a rerun with the same ratings orders identically.
  rows.sort((a, b) => (b.mean - a.mean) || (Number(a.rid) - Number(b.rid)))
  return rows
}

function table(rows) {
  return rows.map((r, i) =>
    `${i + 1}. rid ${r.rid} — consensus ${r.mean.toFixed(2)} (rater spread ${r.spread.toFixed(2)}` +
    `${r.disqualify_votes ? `, ${r.disqualify_votes}/${r.raters} disqualify votes: ${r.disqualify_reasons.join('; ')}` : ''})\n` +
    `   per-criterion: ${CRITERIA.map(c => `${c[0]} ${r.criteria[c[0]]}`).join(', ')}\n` +
    `   rater notes: ${r.reasons.map(x => `"${x}"`).join(' | ')}`
  ).join('\n')
}

const BRIEF = (cid) => `The catalogue lives in this repo. Two files are your inputs, and you must read both before answering:

- \`build/exemplars/RUBRIC.md\` — the criteria, their weights, the disqualifiers, and the known limits of the input data. This is binding.
- \`build/exemplars/candidates/${cid}.json\` — the dimension's definition and its shortlisted candidates, each with title, venue, year, the coded pattern edges for this dimension with verbatim evidence quotes, the other dimensions the paper touches, and the human factors it addresses.

Read them with \`cat\`. The shortlist survived a cheap triage pass that asked only "is this an instance of this dimension?" — it carries \`triage_fit\`/\`triage_reason\` per candidate. Triage sorted in-scope from out-of-scope and said nothing about quality; ignore those fields when scoring.`

// Shard paths are discovered by the caller and passed in, since a workflow script
// has no filesystem access of its own.
const SHARDS = (args && args.shards) || {}

// ---------------------------------------------------------------- the run
log(`${cfg.dimensions.length} dimensions · 3 raters + 2 reviewers + 1 curator each · finalists ${cfg.finalists} → top ${cfg.top}`)

const outcomes = await pipeline(
  cfg.dimensions,

  // -- Triage ----------------------------------------------------------------
  // Replaces the deterministic ranker that used to sit here. Three vocabulary
  // designs (taxonomy prose, coded quotes, full-text windows) all correlated at
  // about r=0.25 with the rating agents' consensus: term frequency separates
  // topics, not design moves, so a paper that constrains a generator reads as a
  // paper about 3D printing. A cheap model judges fit directly instead.
  async (cid) => {
    const shards = SHARDS[cid] || []
    const scored = (await parallel(shards.map((file, i) => () =>
      agent(
        `Score how well each paper in this shard exemplifies design dimension ${cid} of the AI-interface design cookbook.

Read \`${file}\` with cat. It holds the dimension's definition, its classification boundary, its patterns, and a slice of the eligible papers — each with title, venue, year, and the coded pattern edges for this dimension with verbatim evidence quotes.

This is triage, not judgement. One question only: **is this paper an instance of THIS dimension, and how central is it?**

- 5 — the dimension's mechanism is the paper's core contribution
- 3 — a real but secondary instance
- 1 — the dimension appears incidentally, or the paper sits closer to a neighbouring dimension
- 0 — not an instance: a survey, a study of someone else's interface, or a quote that is topical rather than demonstrative

Judge only from the evidence quotes and title. Do not reward a paper for being recent, well-known, or from a strong venue — later stages weigh quality; you are only sorting in-scope from out-of-scope. Score every paper in the shard and return them all.`,
        { label: `triage:${cid}:${i}`, phase: 'Triage', schema: TRIAGE_SCHEMA, model: 'haiku', effort: 'low' }
      )
    ))).filter(Boolean).flatMap(r => r.scores || [])

    // Ties at the boundary are common on a 0-5 scale, so the cut is by score and
    // the shortlist runs a little over cfg.shortlist rather than dropping papers
    // that scored identically.
    scored.sort((a, b) => (b.fit - a.fit) || (Number(a.rid) - Number(b.rid)))
    const floor = scored.length ? scored[Math.min(cfg.shortlist, scored.length) - 1].fit : 0
    const keep = scored.filter(s => s.fit >= floor && s.fit > 0)
    log(`${cid}: triaged ${scored.length}, ${keep.length} kept (fit >= ${floor})`)

    await agent(
      `Assemble the rated shortlist for design dimension ${cid}.

The triage pass kept these ${keep.length} papers, best fit first:
${keep.map(k => `  ${k.rid}  fit ${k.fit}  ${k.reason}`).join('\n')}

Read every shard under \`build/exemplars/pool/${cid}/\` and write \`build/exemplars/candidates/${cid}.json\` containing:

{"dimension": <the "dimension" object, copied verbatim from any shard>,
 "candidates": [ <the full candidate object for each rid above, copied verbatim, in the order listed> ]}

Copy the candidate objects exactly as they appear in the shards — do not summarise, reorder keys, or drop fields; the rating agents read this file. Add \`"triage_fit"\` and \`"triage_reason"\` to each. Confirm it parses with \`python3 -m json.tool\` and that the candidate count matches.`,
      { label: `shortlist:${cid}`, phase: 'Triage', model: 'haiku' }
    )
    return cid
  },

  // -- Rate ------------------------------------------------------------------
  (cid) => parallel(RATER_LENSES.map(lens => () =>
    agent(
      `Score every candidate in design dimension ${cid} of the AI-interface design cookbook.

${lens.stance}

${BRIEF(cid)}

Score all candidates on all six criteria, 0-5, applying the rubric's calibration: 3 is competent-but-ordinary and 5 should be rare. Judge each paper AS AN INSTANCE OF THIS DIMENSION, not as a paper in general — a landmark paper that only glances at this dimension scores low on representativeness. Use \`disqualify\` where the rubric's disqualifiers apply instead of scoring low.

Say what you actually see. You have titles and verbatim coded quotes but no abstracts and no full text; where a candidate cannot be judged on what is present, score conservatively and say so in the reason rather than inventing detail about the system.

Then write your raw sheet to \`build/exemplars/ratings/${cid}-${lens.key}.json\` (mkdir -p first) so the run stays auditable, and return the same data as your structured output.`,
      { label: `rate:${cid}:${lens.key}`, phase: 'Rate', schema: RATING_SCHEMA }
    )
  )),

  // -- Review ----------------------------------------------------------------
  async (ratings, cid) => {
    const rows = consensus((ratings || []).filter(Boolean))
    if (!rows.length) {
      log(`${cid}: every rater failed — skipping`)
      return null
    }
    const live = rows.filter(r => r.disqualify_votes * 2 <= r.raters)
    const finalists = live.slice(0, cfg.finalists)
    const bench = live.slice(cfg.finalists)
    log(`${cid}: ${rows.length} rated, ${rows.length - live.length} disqualified, ${finalists.length} to review`)

    const reviews = await parallel(REVIEW_LENSES.map(lens => () =>
      agent(
        `Contest the exemplar ranking for design dimension ${cid} of the AI-interface design cookbook.

${lens.mandate}

${BRIEF(cid)}

Three independent raters have scored the shortlist. Their consensus, best first:

FINALISTS (under review)
${table(finalists)}

NOT SELECTED (the bench, for reference and for promotions)
${table(bench) || '(none)'}

Give a verdict on every finalist. A high rater spread means the raters disagreed — those are the ones worth your attention. Be concrete: "the quote describes a chat log viewer, which is dimension U08, not this one" is a verdict; "could be stronger" is not.`,
        { label: `review:${cid}:${lens.key}`, phase: 'Review', schema: REVIEW_SCHEMA }
      )
    ))
    return { cid, rows, finalists, bench, reviews: reviews.filter(Boolean) }
  },

  // -- Curate ----------------------------------------------------------------
  async (state, cid) => {
    if (!state) return null
    const verdictText = state.reviews.map(rev =>
      (rev.verdicts || []).map(v => `  rid ${v.rid}: ${v.verdict.toUpperCase()} (evidence ${v.evidence_check || 'not_checked'}) — ${v.reason}`).join('\n') +
      ((rev.promotions && rev.promotions.length)
        ? '\n  promotions: ' + rev.promotions.map(p => `rid ${p.rid} should displace rid ${p.displaces} — ${p.reason}`).join('; ')
        : '')
    ).join('\n---\n')

    const result = await agent(
      `You own design dimension ${cid} in the AI-interface design cookbook. Decide its final ${cfg.top} exemplars and write them up.

${BRIEF(cid)}

Three raters scored the shortlist; two reviewers then contested the result. You settle it.

CONSENSUS RANKING (all candidates that survived rating)
${table(state.rows)}

REVIEWER VERDICTS
${verdictText || '(reviewers returned nothing — proceed on the consensus alone and say so in your notes)'}

How to decide:
- The consensus order is a starting point, not a result. A reviewer who checked the evidence and found it unconfirmed or contradicted outranks three raters who did not check.
- Apply the rubric's set-level rules: at most two exemplars leading with the same pattern_id, no repeated system_id, prefer domain spread when scores are within 0.3. Look up each finalist's pattern_id and system_id in the candidate file — do not guess them.
- Accept a promotion from the bench only if the challenger's displacement argument holds up against the candidate's own evidence.
- Every selection must survive "why this and not the one below it?" in one sentence. That sentence is \`over_the_runner_up\`.

Then write \`build/exemplars/results/${cid}.json\` (mkdir -p first) with exactly this shape:

{"category_id": "${cid}",
 "category_name": "<from the candidate file>",
 "exemplars": [{"rid": "...", "title": "...", "venue": "...", "year": 0, "url": "...", "system_id": "...",
                "lead_pattern_id": "pat-000", "final_score": 0.00,
                "scores": {${CRITERIA.map(c => `"${c[0]}": 0`).join(', ')}},
                "why": "<2-4 sentences: the mechanism the paper shows, why it is the dimension's exemplar, and who could lift it>",
                "over_the_runner_up": "<one sentence>"}],
 "notes": "<where you overrode the consensus and why, plus anything a reader should distrust>",
 "near_misses": [{"rid": "...", "title": "...", "reason": "..."}]}

\`final_score\` is the consensus mean adjusted by your own judgement of the reviews — state any adjustment larger than 0.3 in \`notes\`. \`scores\` are the per-criterion consensus means from the table above. Titles, venues, years, urls, system_ids and pattern_ids all come from the candidate file verbatim — never from memory. Validate the file parses (\`python3 -m json.tool\`) before you finish.`,
      { label: `curate:${cid}`, phase: 'Curate', schema: CURATION_SCHEMA }
    )
    return { cid, curation: result, rated: state.rows.length }
  }
)

const done = outcomes.filter(Boolean)
log(`curated ${done.length}/${cfg.dimensions.length} dimensions`)

// -- Publish -----------------------------------------------------------------
phase('Publish')
const publish = await agent(
  `Render the exemplar report for the AI-interface design cookbook.

Run \`python3 build/exemplar_report.py\` from the repo root. It reads build/exemplars/results/*.json and writes build/exemplars/EXEMPLARS.md and build/exemplars/exemplars.json.

If it fails, the cause is almost always a curator agent writing a malformed or incomplete results file — find the offending file, report exactly which one and what was wrong with it, and repair only the structural fault (a missing key, a trailing comma). Never invent an exemplar, a score, or a rationale to make the script pass.

Return: whether it succeeded, the script's output, the dimensions present in build/exemplars/results/, and any file you had to repair.`,
  { label: 'publish', phase: 'Publish' }
)

return {
  dimensions_curated: done.map(d => ({ category_id: d.cid, rated: d.rated, selected: d.curation.selected })),
  missing: cfg.dimensions.filter(c => !done.some(d => d.cid === c)),
  publish,
}
