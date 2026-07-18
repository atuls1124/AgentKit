# What Happened Till — Research Compass

## Project Overview

**Research Compass** is an AI agent built for the Lamatic AgentKit Challenge. It reads multiple research papers, compares methodologies, detects evidence-backed research gaps, proposes future research directions, and generates a complete literature review.

---

## Phase 0: Problem Discovery

- Explored the AgentKit repository (113 existing kits)
- Identified that **no existing kit** does multi-paper academic literature review, gap detection, or future research suggestion
- Confirmed the idea was sufficiently distinct from `deep-search` (general-purpose Q&A) and `paper-to-project` (single paper → software roadmap)
- Decided to build a **Kit** (flows + Next.js app) rather than a template or bundle

## Phase 1: Data Contracts (types.ts)

- Designed all 25 TypeScript interfaces covering every data structure
- Key types: `PaperInput`, `PaperData`, `PaperIntelligenceOutput`, `ComparisonResult`, `Gap`, `GapAnalysis`, `ResearchIdea`, `ResearchIdeaGeneratorOutput`, `LiteratureReview`, `ResearchCompassResponse`
- Decisions made: structured `Venue` object, `Dataset` with `usage` field, `EvaluationMetric` with flexible `value`, `paperId` for cross-references, `gapId` for mapping ideas to gaps, `confidence` scores, `AgentMetadata`
- File: `types.ts`

## Phase 2: Prompt Contracts (prompt-contracts.md)

- Defined the exact input/output contract for each of the 5 nodes
- Added Global Output Rules: no null, valid JSON only, preserve IDs, no fabrication
- Added Determinism rules: prefer evidence, preserve ordering, concise academic language
- Added Error Handling per node: graceful defaults for missing data
- Added Validation rules: confidence 0-1, scores 1-10, supportingPaperCount >= evidence.length
- Added Performance Targets: total pipeline < 90s
- Added Evaluation Checklist: 27 checkpoints across structure, node-specific, performance, and quality
- Added Design Freeze (v1.0.0)
- Added Architecture diagram with data contract annotations

## Phase 3: Prompt Files (10 files)

Created system + user prompts for each node:

- **Paper Intelligence**: Information extraction, domain detection, compact summaries
- **Comparison & Insights**: Cross-paper comparison across 6 dimensions, agreements, contradictions, key insights
- **Gap Detector**: 8 typed gap categories, evidence-based reasoning, confidence scoring
- **Research Idea Generator**: Scored proposals (novelty, difficulty, impact) per gap
- **Literature Review Generator**: 6-section academic review synthesis

Each prompt follows a consistent template: Role, Objective, Input, Instructions, Constraints, Output Schema, Validation, Error Handling, Example, Notes. All files have version headers.

## Phase 4: Infrastructure

### Model Configs (5 files)
Studio export stubs for each node: `model-configs/research-compass_*.ts`

### Test Fixtures (25 files across 6 categories)

| Category | Files | Purpose |
|----------|-------|---------|
| `schema/` | 5 JSON Schema files | Validate node output structure |
| `sample-input/` | 1, 3, 5 papers | Normal test cases |
| `golden-output/` | node1–node5 | Reference examples (not exact) |
| `invalid/` | 4 cases | Error handling: empty, missing title, malformed, duplicate IDs |
| `edge-cases/` | 6 cases | No DOI, non-English, no abstract, 10/20 papers, mixed domains |
| `integration/` | 3 pipeline specs | End-to-end test definitions |

### Documentation (3 files)

| File | Content |
|------|---------|
| `docs/model-selection.md` | Required vs recommended model settings per node |
| `docs/testing-workflow.md` | Phase-based test runbook with PASS/FAIL criteria |
| `docs/deployment-checklist.md` | 40-point submission checklist |

---

## Current Status

- **Design Phase**: COMPLETE ✅ (frozen at v1.0.0)
- **Architecture**: 5-node sequential pipeline
- **Data Contracts**: 25 interfaces, locked
- **Prompts**: 10 files, versioned
- **Tests**: 25 fixture files, ready
- **Documentation**: 3 guides + this file
- **Infrastructure**: lamatic.config.ts, constitutions, flows/, apps/ scaffold ✅
- **Flow (All 5 nodes)**: Implemented ✍️, awaiting Lamatic runtime validation ⏸️
- **README + agent.md**: Drafted ✅

## Pipeline (All 5 Nodes)

```
Trigger (GraphQLInput)
  ├─ papers: PaperInput[]
  └─ researchArea?: string
       ↓
Node 1 — Paper Intelligence (LLMNode_010)
  Output: PaperIntelligenceOutput { domain, papers: PaperData[] }
       ↓
Node 2 — Comparison & Insights (LLMNode_020)
  Output: ComparisonResult { summary, dimensions, agreements, contradictions, keyInsights }
       ↓
Node 3 — Gap Detector (LLMNode_030)
  Output: GapAnalysis { gaps: Gap[] } — 8 typed gap categories
       ↓
Node 4 — Research Idea Generator (LLMNode_040)
  Output: ResearchIdeaGeneratorOutput { ideas: ResearchIdea[] }
       ↓
Node 5 — Literature Review Generator (LLMNode_050)
  Output: LiteratureReview { title, sections, markdown }
       ↓
Response (ResearchCompassResponse)
  Result: { metadata, paperIntelligence, comparison, gaps, futureWork, literatureReview }
```

## Remaining Work

| Phase | Task | Status |
|-------|------|--------|
| 5 | All 5 nodes implemented in flow | ✍️ Done (pending runtime validation) |
| 6 | Build Next.js App (full UI) | 🔲 |
| 7 | Validation (schema, integration, edge cases) | 🔲 |
| 8 | Demo video & PR submission | 🔲 |

---

## Current Blocker

Everything hinges on one runtime question inside Lamatic Studio:

**How does a downstream LLM node reference the output of an upstream LLM node?**

Once answered, the same convention applies to all 5 nodes:
- `{{papers}}` — if Lamatic passes upstream LLM output downstream automatically
- `{{LLMNode_010.output.generatedResponse}}` — if explicit references are required
- Or another Lamatic-specific convention

Verify by importing `flows/research-compass.ts` (all 5 nodes wired) and checking:
1. What does `{{papers}}` resolve to in the Paper Intelligence prompt?
2. Does the Comparison node receive PaperData[] (structured) or PaperInput[] (raw)?
3. Can the response node reference any node's output via `{{nodeId.output.fieldName}}`?

---

## Total Effort

- **Files created**: 58
- **Lines of types.ts**: ~200
- **Flow file**: 1 (research-compass.ts, all 5 nodes)
- **Prompt files**: 10 (across 5 nodes)
- **Model configs**: 5 (stubs, following Lamatic convention)
- **Test fixtures**: 25
- **Document pages**: 3 guides + this log
- **Next.js scaffold**: package.json, tsconfig, layout, page, lamatic-client, orchestrate
- **Other**: README.md, agent.md, lamatic.config.ts, constitutions/default.md
