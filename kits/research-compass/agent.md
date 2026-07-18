# Research Compass

## Overview
Research Compass is an AgentKit project that enables automated academic literature review. It ingests multiple research papers and produces a structured analysis including paper summaries, cross-paper comparison, evidence-backed research gaps, scored future research directions, and a complete literature review. The system uses a 5-node sequential LLM pipeline deployed as a single Lamatic flow.

## Purpose
To accelerate the literature review process for researchers by automatically synthesizing findings from multiple papers, identifying where the field is lacking, and proposing concrete next research directions — all grounded in specific paper evidence.

## Flows

### `1. Research Compass - Full Pipeline`

- **Flow ID / Env key mapping:** `research-compass` (configured via `RESEARCH_COMPASS`)

#### Trigger
- **Invocation type:** API/GraphQL request via `API Request (graphqlNode)`
- **Expected input shape:**
  - `papers` (array): Preprocessed paper objects with id, title, authors, abstract, DOI, source URL
  - `researchArea` (string, optional): Hint for domain detection

#### What it does

1. `API Request` — Receives the paper payload from the caller.

2. `Paper Intelligence (LLMNode_010)` — Extracts structured metadata per paper (venue, keywords, problem, methodology, datasets, evaluation metrics, contributions, limitations), infers the overarching research domain, and generates compact 3-5 sentence summaries.

3. `Comparison & Insights (LLMNode_020)` — Compares all papers across 6 dimensions (problem, methodology, dataset, evaluation, results, contributions). Identifies agreements, contradictions, and generates non-obvious key insights.

4. `Gap Detector (LLMNode_030)` — Identifies research gaps across 8 types (Methodology, Dataset, Evaluation, Deployment, Explainability, Scalability, Clinical, Ethical) with evidence from specific papers and calibrated confidence scores.

5. `Research Idea Generator (LLMNode_040)` — For each gap with confidence >= 0.6, proposes 1-2 concrete research ideas with scored attributes (novelty, difficulty, expected impact).

6. `Literature Review Generator (LLMNode_050)` — Synthesizes all prior outputs into a 6-section academic literature review with proper markdown formatting.

7. `API Response` — Returns the complete analysis as a structured JSON object.

#### Output structure (provisional — pending Lamatic runtime validation)
```json
{
  "metadata": { "name": "Research Compass", "version": "1.0.0" },
  "paperIntelligence": "...",
  "comparison": "...",
  "gaps": "...",
  "futureWork": "...",
  "literatureReview": "..."
}
```
Note: Each field returns the raw LLM output (JSON string). If Lamatic exposes parsed objects, this structure will be refined to return nested fields directly. Response format is finalized after runtime validation.

#### Dependencies
- Lamatic API runtime (`LAMATIC_API_URL`, `LAMATIC_PROJECT_ID`, `LAMATIC_API_KEY`)
- LLM provider for text generation (5 nodes, configured in Lamatic Studio)
- `RESEARCH_COMPASS` deployed flow ID

## Guardrails
- **Prohibited tasks:** Must not generate harmful or discriminatory content. Must not fabricate research findings. Must not plagiarize.
- **Input constraints:** `papers` array must contain at least 1 paper. Each paper must have at least an `id` and `title`.
- **Output constraints:** All outputs must be valid JSON. No hallucinated papers or citations.
- **Operational limits:** Total pipeline latency target < 90s for 3-5 papers.

## Environment Setup

| Variable | Source |
|---|---|
| `RESEARCH_COMPASS` | Lamatic Studio — deployed flow ID |
| `LAMATIC_API_URL` | Lamatic project settings |
| `LAMATIC_PROJECT_ID` | Lamatic project settings |
| `LAMATIC_API_KEY` | Lamatic project settings |

## Quickstart
1. Deploy the `research-compass` flow in Lamatic Studio.
2. Copy the Flow ID and API credentials into `apps/.env.local`.
3. `cd apps && npm install && npm run dev`
4. Send papers via the UI or direct API call.

## Common Failure Modes

| Symptom | Cause | Fix |
|---|---|---|
| Flow not found | `RESEARCH_COMPASS` env var missing | Set the deployed Flow ID |
| LLM returns invalid JSON | Prompt constraints insufficient | Tighten output schema instructions |
| Empty gap analysis | Papers have no detectable gaps | Increase paper count or diversity |
| Pipeline timeout | Total latency exceeds 90s | Use faster LLM or reduce paper count |
