Prompt Version: 1.0.0
Node: Paper Intelligence (User)
Last Updated: 2026-07-18
Compatible With:
- prompt-contracts.md v1.0.0
- types.ts v1.0.0
---

## Input

Here are the preprocessed research papers to analyze:

{{papers}}

## Instructions

Analyze all papers above and return a JSON object with:
1. The aggregate research domain across ALL papers.
2. Structured metadata for each paper following the output schema.

Preserve each paper's id exactly as provided.
