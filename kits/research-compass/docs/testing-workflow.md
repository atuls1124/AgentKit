Version: 1.0.0
Last Updated: 2026-07-18
Compatible With:
- prompt-contracts.md v1.0.0
- types.ts v1.0.0

# Testing Workflow — Research Compass

Standard testing sequence for validating changes to the Lamatic flow or prompts.

---

## Prerequisites

- Lamatic flow deployed with current prompts and model configs
- Node.js 18+ installed (for optional schema validation scripts)
- `tests/` directory available with all fixtures

---

## Phase A: Schema Validation

Validate each node's output against its JSON Schema to catch structural errors.

```bash
ajv validate -s tests/schema/paper-intelligence.schema.json -d node1-output.json
ajv validate -s tests/schema/comparison.schema.json -d node2-output.json
ajv validate -s tests/schema/gap-analysis.schema.json -d node3-output.json
ajv validate -s tests/schema/research-ideas.schema.json -d node4-output.json
ajv validate -s tests/schema/literature-review.schema.json -d node5-output.json
```

**PASS IF:** All 5 schemas pass. No structural errors.

---

## Phase B: Single Paper Test

Run with `tests/sample-input/1-paper.json`.

1. Send input to Lamatic flow
2. Save raw output
3. Validate against all 5 schemas
4. Compare structure against `golden-output/node*.json` (not exact text)
5. Run Evaluation Checklist (from `prompt-contracts.md`)
6. Record latency per node

**PASS IF:**
- [ ] Schema validation passes for all 5 nodes
- [ ] No null values in any output
- [ ] Paper ID preserved (`paper-0`)
- [ ] Domain detected despite single paper
- [ ] Node 2 produces comparison (minimal but valid)
- [ ] Pipeline completes under 40s

---

## Phase C: Three Paper Test

Run with `tests/sample-input/3-papers.json`.

**PASS IF:**
- [ ] Schema validation passes for all 5 nodes
- [ ] All 3 paper IDs preserved
- [ ] Comparison has entries for all 3 papers per dimension
- [ ] At least 1 agreement and 1 contradiction found
- [ ] At least 3 gaps detected with evidence from 2+ papers
- [ ] Research ideas map to existing gap IDs
- [ ] Literature review references all 3 papers
- [ ] Total pipeline < 90s

---

## Phase D: Five Paper Test

Run with `tests/sample-input/5-papers.json`.

**PASS IF:**
- [ ] Schema validation passes
- [ ] All 5 paper IDs preserved
- [ ] Richer comparison than 3-paper output (more insights, more contradictions)
- [ ] Gaps draw evidence from 3+ papers
- [ ] Literature review reaches 1500+ words
- [ ] No context window issues
- [ ] Total pipeline < 120s (expected: < 90s)

---

## Phase E: Invalid Input Tests

For each file in `tests/invalid/`:

| Fixture | Expected Behavior |
|---------|------------------|
| `empty-papers.json` | Graceful error or empty analysis (not crash) |
| `missing-title.json` | Node 1 handles empty title |
| `malformed-metadata.json` | Node 1 produces output with empty arrays where data missing |
| `duplicate-paper-ids.json` | Node 1 preserves duplicates (no silent dedup) |

**PASS IF:**
- [ ] Flow does not crash on any invalid input
- [ ] Error responses contain meaningful messages
- [ ] Valid JSON always returned (even for empty input)

---

## Phase F: Edge Case Tests

Run each edge case individually:

| Fixture | What to Check |
|---------|---------------|
| `no-doi-no-abstract.json` | Node 1 produces structured output from title alone |
| `non-english-abstract.json` | Output stays in English (consistent language) |
| `only-metadata-no-abstract.json` | Node 1 extracts what's available, empty arrays for rest |
| `many-papers-10.json` | Context window holds; latency < 180s |
| `many-papers-20.json` | Note any truncation or quality degradation (informational) |
| `different-domains.json` | Domain detection identifies mixed domains or flags heterogeneity |

**PASS IF:**
- [ ] Each edge case produces valid JSON
- [ ] No crashes or timeouts on 10-paper case
- [ ] Non-English input handled gracefully (not ignored)
- [ ] Mixed domains produce reasonable output (even if imperfect)

---

## Phase G: Integration Tests

For each file in `tests/integration/`:

| Test | Papers | Validation Focus |
|------|--------|-----------------|
| `end-to-end-1-paper.json` | 1 | Minimal pipeline validity |
| `end-to-end-3-papers.json` | 3 | Primary integration test |
| `end-to-end-5-papers.json` | 5 | Rich output quality |

**PASS IF:**
- [ ] Complete pipeline runs without errors
- [ ] Cross-node consistency: gapIds match, paperIds preserved
- [ ] All 5 schemas pass
- [ ] Full Evaluation Checklist passes
- [ ] Latency within targets

---

## Regression Test (Full Suite)

Run before every significant change to prompts, models, or flow:

```
□ Phase A: Schema validation (all 5)
□ Phase B: 1-paper test
□ Phase C: 3-paper test
□ Phase D: 5-paper test
□ Phase E: Invalid inputs (all 4)
□ Phase F: Edge cases (all 6)
□ Phase G: Integration tests (all 3)
```

## Quick Check (before every commit)

```
□ JSON Schema passes (all 5)
□ 3-paper integration test passes
□ No null values in output
□ All IDs preserved
□ Pipeline latency within targets
□ Evaluation Checklist completed
```

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Node 1 returns empty fields | Prompt too restrictive | Relax error-handling instructions |
| Node 2 has no contradictions | Papers too similar; temp too low | Increase temp to 0.3 |
| Node 3 confidence always 0.9+ | Model uncalibrated | Add calibration examples to prompt |
| Node 4 ideas feel generic | Temp too low | Increase to 0.5+ |
| Node 5 review truncated | Max tokens too low | Increase to 8192 |
| Pipeline timeout | Model too slow or context too large | Switch provider or reduce papers |
