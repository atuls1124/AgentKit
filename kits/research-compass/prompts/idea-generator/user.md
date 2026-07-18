Prompt Version: 1.0.0
Node: Research Idea Generator (User)
Last Updated: 2026-07-18
Compatible With:
- prompt-contracts.md v1.0.0
- types.ts v1.0.0
---

## Input

Gap analysis:
{{gaps}}

## Instructions

For each gap with confidence >= 0.6, propose 1-2 concrete research ideas. Each idea must include a research question, proposed approach, and scores for novelty, difficulty, and expected impact.

Return the research ideas as valid JSON following the output schema.
