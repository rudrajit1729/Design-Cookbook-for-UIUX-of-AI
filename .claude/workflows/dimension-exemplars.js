export const meta = {
  name: 'dimension-exemplars',
  description: 'Adjudicate each dimension\'s exemplars from its patterns\' winners: two reviewers contest, a curator settles',
  whenToUse: 'After build/exemplar_codex.py has produced pattern_results/ for all 80 patterns.',
  phases: [
    { title: 'Review', detail: 'an evidence auditor and a challenger contest each dimension\'s candidates' },
    { title: 'Curate', detail: 'one curator per dimension picks the final set' },
    { title: 'Publish', detail: 'render the two-level report' },
  ],
}

const ALL = ['U01', 'U02', 'U03', 'U04', 'U05', 'U06', 'U07', 'U08', 'U09', 'U10']
const cfg = {
  dimensions: (args && args.dimensions) || ALL,
  top: (args && args.top) || 5,
}

const REVIEW_LENSES = [
  {
    key: 'evidence-auditor',
    mandate: `Verify, do not re-rate. Every candidate reached you by winning at pattern level, so it already has three raters and a curator behind it — your job is the check none of them could do, which is whether the paper's coded evidence actually says what the writeup claims. Cross-check with grep over build/paper_patterns_audit.csv (columns include rid, pattern_id, role, confidence, evidence_quote) and the paper's record in build/cookbook_v2.json. Confirm the quote exists as coded, that the role is central for the named pattern, and that the quote demonstrates the pattern's structural signature rather than merely sharing its subject matter. Anything you cannot confirm is unconfirmed, and say exactly what is missing. Do not soften a verdict because the writeup is well argued.`,
  },
  {
    key: 'challenger',
    mandate: `Argue against the set. Pattern-level curation optimised each pattern in isolation, so nobody has yet asked whether these candidates make a good set for the dimension. Your default position is that the obvious picks crowd out the dimension's range: several strong entries from one well-populated pattern while a thinly-populated pattern goes unrepresented, or several papers making essentially the same design move. For each candidate make the best available case that it should be dropped, and name which under-represented pattern should take its place and why.`,
  },
]

const REVIEW_SCHEMA = {
  type: 'object',
  required: ['category_id', 'verdicts'],
  properties: {
    category_id: { type: 'string' },
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        required: ['rid', 'pattern_id', 'verdict', 'reason'],
        properties: {
          rid: { type: 'string' },
          pattern_id: { type: 'string' },
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
        properties: { rid: { type: 'string' }, displaces: { type: 'string' }, reason: { type: 'string' } },
      },
    },
  },
}

const CURATION_SCHEMA = {
  type: 'object',
  required: ['category_id', 'selected', 'wrote_file'],
  properties: {
    category_id: { type: 'string' },
    selected: { type: 'array', items: { type: 'string' } },
    wrote_file: { type: 'string' },
    overrides: { type: 'string' },
  },
}

const BRIEF = (cid) => `Two files are your inputs; read both with \`cat\` before answering:

- \`build/exemplars/RUBRIC.md\` — the criteria, their weights, the disqualifiers, and the known limits of the input data. Binding.
- \`build/exemplars/dimension_input/${cid}.json\` — the dimension's definition and every candidate, each carrying its pattern, that pattern's structural signature, the score it earned at pattern level, the writeup its pattern curator wrote, and that curator's notes on what to distrust.

These candidates are the winners of a per-pattern pass: three independent raters scored each pattern's eligible papers, then a curator picked that pattern's best. Nothing here is unvetted — which means your value is in what the pattern-level pass could not see.`

log(`${cfg.dimensions.length} dimensions · 2 reviewers + 1 curator each · top ${cfg.top}`)

const outcomes = await pipeline(
  cfg.dimensions,

  async (cid) => {
    const reviews = (await parallel(REVIEW_LENSES.map(lens => () =>
      agent(
        `Contest the exemplar set for design dimension ${cid} of the AI-interface design cookbook.

${lens.mandate}

${BRIEF(cid)}

Give a verdict on every candidate. Be concrete: "the coded quote describes a chat log viewer, which is pat-057, not the pattern claimed" is a verdict; "could be stronger" is not.`,
        { label: `review:${cid}:${lens.key}`, phase: 'Review', schema: REVIEW_SCHEMA }
      )
    ))).filter(Boolean)
    return { cid, reviews }
  },

  async (state) => {
    const { cid, reviews } = state
    const verdictText = reviews.map(rev =>
      (rev.verdicts || []).map(v =>
        `  rid ${v.rid} (${v.pattern_id}): ${v.verdict.toUpperCase()} (evidence ${v.evidence_check || 'not_checked'}) — ${v.reason}`
      ).join('\n') +
      ((rev.promotions && rev.promotions.length)
        ? '\n  promotions: ' + rev.promotions.map(p => `rid ${p.rid} should displace rid ${p.displaces} — ${p.reason}`).join('; ')
        : '')
    ).join('\n---\n')

    const result = await agent(
      `You own design dimension ${cid} in the AI-interface design cookbook. Choose its final ${cfg.top} exemplars.

${BRIEF(cid)}

Two reviewers have contested the candidates.

REVIEWER VERDICTS
${verdictText || '(reviewers returned nothing — proceed on the candidates alone and say so in your notes)'}

How to decide:
- A reviewer who checked the coded evidence and found it unconfirmed or contradicted outranks a confident pattern-level writeup.
- Show the dimension's range. At most one exemplar per pattern unless a pattern is so central that two are justified, and say so if you take that liberty. Prefer covering more of the dimension's patterns over stacking its best-populated one.
- No repeated \`system_id\`, and no two exemplars making the same design move in different words.
- Every selection must survive "why this and not the one below it?" in one sentence.

Then write \`build/exemplars/results/${cid}.json\` (mkdir -p first) with exactly this shape:

{"category_id": "${cid}",
 "category_name": "<from the input file>",
 "exemplars": [{"rid": "...", "title": "...", "venue": "...", "year": 0, "url": "...",
                "pattern_id": "pat-000", "pattern_name": "...", "final_score": 0.00,
                "why": "<2-4 sentences: the mechanism, why it is this dimension's exemplar, who could lift it>",
                "over_the_runner_up": "<one sentence>"}],
 "notes": "<where you overrode a pattern-level judgement and why, which patterns went unrepresented, and anything a reader should distrust>",
 "near_misses": [{"rid": "...", "title": "...", "pattern_id": "...", "reason": "..."}]}

Every bibliographic field comes verbatim from the input file, never from memory. Validate it parses (\`python3 -m json.tool\`) before finishing.`,
      { label: `curate:${cid}`, phase: 'Curate', schema: CURATION_SCHEMA }
    )
    return { cid, curation: result }
  }
)

const done = outcomes.filter(Boolean)
log(`curated ${done.length}/${cfg.dimensions.length} dimensions`)

phase('Publish')
const publish = await agent(
  `Render the two-level exemplar report for the AI-interface design cookbook.

Run \`python3 build/exemplar_report.py\` from the repo root. It reads build/exemplars/results/*.json (dimension level) and build/exemplars/pattern_results/*.json (pattern level) and writes build/exemplars/EXEMPLARS.md and exemplars.json.

If it fails, the cause is almost always a curator writing a malformed or incomplete results file — find the offending file, report exactly which one and what was wrong, and repair only the structural fault. Never invent an exemplar, a score, or a rationale to make the script pass.

Return: whether it succeeded, the script's output, and any file you repaired.`,
  { label: 'publish', phase: 'Publish' }
)

return {
  dimensions: done.map(d => ({ category_id: d.cid, selected: d.curation.selected })),
  missing: cfg.dimensions.filter(c => !done.some(d => d.cid === c)),
  publish,
}
