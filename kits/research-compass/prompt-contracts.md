# Prompt Contracts — Research Compass

**Version:** 1.0.0  
**Status:** FROZEN  
**Compatible with:** `types.ts` v1.0.0, Lamatic Flow v1.0.0  
**Last Updated:** 2026-07-18

## Design Freeze (v1.0.0)

The architecture, node responsibilities, and data contracts are frozen for v1.0.0.
Changes after this point should only be made when:

- Implementation exposes a defect,
- Schema validation consistently fails,
- Integration testing reveals a contract mismatch.

Prompt wording, model selection, and parameter tuning may continue without changing the architecture version.

## Architecture

```
                         ┌──────────────────────────┐
                         │      GraphQL Trigger      │
                         │      GraphQLInput         │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │    Paper Intelligence     │
                         │  Extract · Summarize ·    │
                         │    Domain Detection       │
                         └────────────┬─────────────┘
                                      │ PaperData[]
                                      ▼
                         ┌──────────────────────────┐
                         │  Comparison & Insights    │
                         │  Matrix · Agreements ·    │
                         │  Contradictions ·        │
                         │  Key Insights             │
                         └────────────┬─────────────┘
                                      │ ComparisonResult
                                      ▼
                         ┌──────────────────────────┐
                         │      Gap Detector         │
                         │  Typed Gaps · Evidence ·  │
                         │  Confidence · Reasoning   │
                         └────────────┬─────────────┘
                                      │ GapAnalysis
                                      ▼
                         ┌──────────────────────────┐
                         │   Research Idea Generator │
                         │  Scored Proposals per Gap │
                         └────────────┬─────────────┘
                                      │ ResearchIdea[]
                                      ▼
                         ┌──────────────────────────┐
                         │  Literature Review Gen.   │
                         │  6-Section Markdown      │
                         └────────────┬─────────────┘
                                      │ LiteratureReview
                                      ▼
                         ┌──────────────────────────┐
                         │    GraphQL Response       │
                         │ ResearchCompassResponse  │
                         └──────────────────────────┘
```

---

## Prompt Design Principles

Every node should:

- Have a single responsibility.
- Never duplicate reasoning performed by previous nodes.
- Consume only its declared input.
- Produce only its declared output.
- Preserve traceability between input and output.
- Avoid hallucination by preferring explicit evidence.
- Be deterministic whenever possible.

---

## Global Output Rules

These rules apply to every Lamatic node.

- Return only valid JSON.
- Never wrap JSON in markdown or code blocks.
- Never return `null`.
- Use empty arrays (`[]`) instead of `null`.
- Use empty strings (`""`) instead of `null`.
- Preserve all IDs exactly as received.
- Do not fabricate information.
- If information is unavailable, return an empty value rather than inventing one.
- All outputs must conform exactly to the defined schema.
- Do not explain your reasoning in the output — the JSON IS the output.
- Remove trailing commas from JSON.
- Ensure all JSON keys and string values use double quotes.

---

## Determinism

When multiple valid outputs exist:

- Prefer evidence over assumptions.
- Preserve input ordering — do not randomly reorder papers.
- Use concise academic language.
- Avoid subjective or hype wording ("revolutionary", "groundbreaking").
- When uncertain, lower confidence rather than guessing.
- If a field value is ambiguous, choose the most commonly accepted interpretation.

---

## Node 1: Paper Intelligence

### Role
Information extraction — reads preprocessed paper data and produces structured summaries.

### Objective
Extract structured metadata, infer research domain, generate compact summaries.

### Input
`PaperInput[]` from the GraphQL trigger.

### Instructions
1. Analyze each paper's abstract and/or full text.
2. Extract structured fields per the output schema.
3. Infer the overarching research domain across all papers.
4. Generate a 3-5 sentence summary per paper covering problem, method, key finding, and limitation.

### Constraints
- Domain detection must consider ALL papers together, not individually.
- Dataset usage should be inferred from context when not explicitly stated.
- Summaries must be self-contained — readable without the original paper.

### Output Schema — `PaperIntelligenceOutput`
```typescript
{
  domain: {
    domain: string,         // e.g. "Medical Image Analysis"
    subDomain?: string,     // e.g. "Polyp Segmentation"
    focusAreas: string[]    // e.g. ["Deep Learning", "Transformers"]
  },
  papers: [
    {
      paperId: string,        // matches input id
      title: string,
      authors: string[],
      venue: { name, year, type: "conference" | "journal" | "preprint" | "workshop" | "other" },
      doi?: string,
      sourceUrl?: string,
      keywords: string[],
      problem: string,
      methodology: string,
      dataset: [{ name, description?, usage?: "training" | "evaluation" | "both" }],
      evaluation: [{ name, value?, unit? }],
      contributions: string[],
      limitations: string[],
      summary: string           // 3-5 sentences
    }
  ]
}
```

### Validation
- Every `paperId` must match an input paper `id`.
- `summary` must be 3-5 sentences.
- `keywords` must have at least 1 entry.
- At least 1 contribution and 1 limitation per paper.

### Error Handling
- If authors unavailable → `[]`.
- If venue unknown → `type: "other"`, extract name from context.
- If datasets not mentioned → `[]`.
- If evaluation metrics not mentioned → `[]`.
- If year cannot be determined → `0`.
- Never return `null` for any field.

### Example
```json
{
  "domain": {
    "domain": "Medical Image Analysis",
    "subDomain": "Polyp Segmentation",
    "focusAreas": ["Deep Learning", "Vision Transformers", "Semantic Segmentation"]
  },
  "papers": [
    {
      "paperId": "paper-0",
      "title": "Attention-Guided Polyp Segmentation",
      "authors": ["Zhang, Y.", "Li, X."],
      "venue": { "name": "MICCAI", "year": 2024, "type": "conference" },
      "doi": "10.1007/123456",
      "sourceUrl": "https://arxiv.org/abs/2501.12345",
      "keywords": ["Polyp Segmentation", "Attention", "Medical Imaging"],
      "problem": "Accurate polyp segmentation in colonoscopy images is challenged by varying polyp shapes and low contrast.",
      "methodology": "Uses a transformer-based encoder with a multi-scale attention decoder.",
      "dataset": [{ "name": "Kvasir-SEG", "usage": "both" }],
      "evaluation": [{ "name": "Dice Score", "value": 0.923 }],
      "contributions": ["Novel attention-guided decoder improves boundary detection"],
      "limitations": ["Only evaluated on single dataset", "No real-time deployment"],
      "summary": "This paper proposes a transformer-based architecture for polyp segmentation that uses a multi-scale attention decoder to improve boundary detection. The model achieves 0.923 Dice on Kvasir-SEG. However, it is only evaluated on one dataset and does not address real-time deployment constraints."
    }
  ]
}
```

---

## Node 2: Comparison & Insights Engine

### Role
Cross-paper reasoning — compares papers across predefined dimensions and extracts patterns.

### Objective
Identify agreements, contradictions, and high-level insights across all papers.

### Input
`PaperData[]` from Node 1.

### Instructions
1. Compare every paper across all 6 dimensions: problem, methodology, dataset, evaluation, results, contributions.
2. Identify statements of agreement (consensus across papers).
3. Identify contradictions or disagreements between papers.
4. Generate 3-5 key insights that a researcher would find valuable.
5. Write a one-paragraph summary of the comparative landscape.

### Constraints
- Insights should be non-obvious — prefer statistical patterns ("80% of papers use Kvasir-SEG") over generic statements ("all papers study segmentation").
- Every dimension must include all papers.
- Do not fabricate comparison data — if a paper doesn't address a dimension, state that.

### Output Schema — `ComparisonResult`
```typescript
{
  summary: string,           // one-paragraph overview
  dimensions: [
    {
      name: "problem" | "methodology" | "dataset" | "evaluation" | "results" | "contributions",
      values: [
        { paperId: string, value: string }
      ],
      insight?: string       // optional per-dimension observation
    }
  ],
  agreements: string[],      // statements of consensus
  contradictions: string[],  // statements of disagreement
  keyInsights: string[]      // 3-5 high-level patterns
}
```

### Validation
- Every `paperId` in `values` must exist in `PaperData[]`.
- All 6 dimensions must be present.
- Each dimension must have an entry for every paper.
- `agreements` and `contradictions` must cite specific paperIds or titles.
- `summary` must be at least 3 sentences.

### Error Handling
- If a dimension has no meaningful variation → state the common value.
- If no contradictions found → `[]`.
- If no agreements found → `[]`.
- Never fabricate comparisons.

### Example
```json
{
  "summary": "All six papers address polyp segmentation using deep learning, but they diverge significantly in architecture choice and evaluation methodology.",
  "dimensions": [
    {
      "name": "methodology",
      "values": [
        { "paperId": "paper-0", "value": "Transformer with attention decoder" },
        { "paperId": "paper-1", "value": "CNN with U-Net architecture" }
      ],
      "insight": "Recent papers (2024+) favor transformers, while older papers rely on CNNs."
    }
  ],
  "agreements": ["All papers use Kvasir-SEG as a primary evaluation dataset"],
  "contradictions": ["paper-0 claims attention improves boundary detection, while paper-2 finds no significant improvement"],
  "keyInsights": [
    "80% of papers evaluate only on Kvasir-SEG, limiting generalizability claims",
    "Only 1 paper studies deployment on edge devices"
  ]
}
```

---

## Node 3: Evidence-based Gap Detector

### Role
Analytical reasoning — identifies research gaps with supporting evidence from specific papers.

### Objective
Detect typed research gaps, provide evidence from papers, assign confidence scores, and explain reasoning.

### Input
`PaperData[]` + `ComparisonResult` from Node 2.

### Instructions
1. Analyze each paper's limitations, the comparison results, and identify gaps.
2. Classify each gap into one of the 8 types.
3. For each gap, cite specific evidence from papers (which paper said what).
4. Assign a confidence score based on evidence strength.
5. Write a reasoning trace explaining how the gap was derived.
6. Count the number of supporting papers.

### Constraints
- Every gap must have at least one piece of evidence.
- Confidence should follow the calibration below.
- At least 1 gap required. Recommend 3-5 for a meaningful analysis.

### Confidence Calibration
- **0.90+**: Multiple papers explicitly mention it as a limitation or future work.
- **0.70–0.89**: Strong indirect evidence (implied by results or methodology).
- **0.50–0.69**: Suggestive but not conclusive.
- **Below 0.50**: Speculative — should be flagged as such.

### Output Schema — `GapAnalysis`
```typescript
{
  gaps: [
    {
      id: string,                    // "gap-0", "gap-1", ...
      type: "Methodology" | "Dataset" | "Evaluation" | "Deployment"
          | "Explainability" | "Scalability" | "Clinical" | "Ethical",
      description: string,
      confidence: number,            // 0.0 – 1.0
      supportingPaperCount: number,
      evidence: [
        {
          paperId: string,
          paperTitle: string,
          reason: string             // specific observation or quote
        }
      ],
      reasoning: string              // concise explanation of how gap was derived
    }
  ]
}
```

### Validation
- `confidence` must be between 0 and 1.
- `supportingPaperCount >= evidence.length`.
- Every `evidence.paperId` must exist in `PaperData`.
- `reasoning` must be at least 2 sentences.

### Error Handling
- If no gaps found for a type → omit that type from results.
- If evidence is weak → lower confidence rather than omitting the gap.
- Never return `null` for any field.

### Example
```json
{
  "gaps": [
    {
      "id": "gap-0",
      "type": "Explainability",
      "description": "No paper provides interpretability analysis for their segmentation decisions.",
      "confidence": 0.91,
      "supportingPaperCount": 4,
      "evidence": [
        {
          "paperId": "paper-0",
          "paperTitle": "Attention-Guided Polyp Segmentation",
          "reason": "Authors mention interpretability as future work in the conclusion."
        },
        {
          "paperId": "paper-1",
          "paperTitle": "EfficientPolySeg",
          "reason": "No attention visualization or saliency maps are provided."
        }
      ],
      "reasoning": "Four of six papers either explicitly mention explainability as future work or lack any interpretability analysis despite using attention mechanisms. This suggests a systematic gap in the field."
    }
  ]
}
```

---

## Node 4: Research Idea Generator

### Role
Creative reasoning — proposes concrete future research directions for identified gaps.

### Objective
For each well-supported gap, generate 1-2 specific, actionable research ideas with scored attributes.

### Input
`GapAnalysis` from Node 3.

### Instructions
1. For each gap with confidence >= 0.6, generate 1-2 research ideas.
2. Each idea must be specific enough to be turned into a paper abstract.
3. Score novelty, difficulty, and expected impact on 1-10 scales.
4. Link each idea back to the gap it addresses.

### Constraints
- Focus on gaps with confidence >= 0.6.
- Avoid generic suggestions like "more research is needed."
- Research questions must end with "?".
- Proposed approach must be at least 2 sentences.

### Score Guidelines
- **Novelty**: 8-10 = genuinely new direction, 5-7 = extension of existing work, 1-4 = incremental.
- **Difficulty**: 8-10 = requires major breakthrough, 5-7 = significant effort, 1-4 = straightforward.
- **Impact**: 8-10 = could change the field, 5-7 = meaningful contribution, 1-4 = minor.

### Output Schema — `ResearchIdeaGeneratorOutput`
```typescript
{
  ideas: [
    {
      gapId: string,                 // maps to Gap.id
      researchQuestion: string,
      proposedApproach: string,
      novelty: number,               // 1–10
      difficulty: number,            // 1–10
      expectedImpact: number         // 1–10
    }
  ]
}
```

### Validation
- `novelty`: 1–10 (integer).
- `difficulty`: 1–10 (integer).
- `expectedImpact`: 1–10 (integer).
- Every `gapId` must exist in `GapAnalysis.gaps[].id`.
- `researchQuestion` must end with `?`.
- `proposedApproach` must be at least 2 sentences.

### Error Handling
- If gap has confidence < 0.6 → do not generate an idea for it.
- If no ideas generated → `[]` (should not happen with valid input).

### Example
```json
{
  "ideas": [
    {
      "gapId": "gap-0",
      "researchQuestion": "How can explainable AI techniques be integrated into transformer-based polyp segmentation to provide clinically interpretable predictions?",
      "proposedApproach": "Develop an attention visualization framework that generates heatmaps highlighting which image regions most influence segmentation boundaries. Validate through a user study with gastroenterologists assessing clinical usefulness.",
      "novelty": 8,
      "difficulty": 6,
      "expectedImpact": 9
    }
  ]
}
```

---

## Node 5: Literature Review Generator

### Role
Long-form synthesis — compiles all prior analysis into a structured academic literature review.

### Objective
Synthesize all node outputs into a well-structured, professionally written literature review in markdown.

### Input
`PaperIntelligenceOutput` + `ComparisonResult` + `GapAnalysis` + `ResearchIdeaGeneratorOutput`.

### Instructions
1. Produce a complete literature review with all 6 sections in order.
2. Cite papers by title in the review text.
3. Maintain an academic, objective, precise tone.
4. Ensure proper markdown formatting with heading hierarchy.

### Constraints
- All 6 sections must be present.
- Total review should be 1500-3000 words depending on paper count.
- Include a References section at the end.
- Avoid hype language ("revolutionary", "groundbreaking", "state-of-the-art" unless specifically comparing).

### Output Schema — `LiteratureReview`
```typescript
{
  title: string,           // e.g. "A Literature Review of Medical Image Segmentation"
  sections: [
    {
      heading: string,     // section title
      content: string      // markdown content
    }
  ],
  markdown: string         // complete review as single markdown document
}
```

### Required Sections (in order)
1. **Introduction** — domain overview, review scope, number of papers analyzed.
2. **Current State of Research** — per-paper summary of the field.
3. **Comparative Analysis** — synthesized comparison across papers.
4. **Research Gaps** — evidence-backed gaps identified.
5. **Proposed Future Work** — research directions with scores.
6. **Conclusion** — summary of findings.

### Validation
- All 6 sections must be present.
- `markdown` must use proper `#`, `##`, `###` heading hierarchy.
- Review must be 1500-3000 words.
- References section must include all analyzed papers.

### Error Handling
- If a section has no content → `"Content not available."`.
- Never return `null` for any field.

### Example
```json
{
  "title": "A Literature Review of Polyp Segmentation in Colonoscopy Images",
  "sections": [
    {
      "heading": "Introduction",
      "content": "This review analyzes 6 papers on polyp segmentation..."
    },
    {
      "heading": "Current State of Research",
      "content": "## Attention-Guided Polyp Segmentation\nZhang et al. (2024) proposed..."
    }
  ],
  "markdown": "# A Literature Review of Polyp Segmentation\n\n## Introduction\n\n..."
}
```

---

## GraphQL Response

The final response is assembled from Node 5 output + metadata.

### Output — `ResearchCompassResponse`
```typescript
{
  metadata: { name: "Research Compass", version: string, model?: string },
  generatedAt: string,                    // ISO timestamp
  domain: ResearchDomain,
  paperCount: number,
  summaries: PaperData[],
  comparison: ComparisonResult,
  gaps: GapAnalysis,
  futureWork: ResearchIdeaGeneratorOutput,
  literatureReview: LiteratureReview,
  confidence: ConfidenceScores
}
```

### Notes
- `paperCount` should be computed from input length — not from LLM.
- `generatedAt` should be set at response time.
- `confidence` scores should be derived from Node 3 and Node 4 outputs.

---

## Evaluation Checklist

Run this checklist after every test to validate output quality consistently.

### Structural Validation
- [ ] Output is valid JSON (no parse errors)
- [ ] Output passes its JSON Schema (in `tests/schema/`)
- [ ] All paper IDs from input are preserved in output
- [ ] No hallucinated papers (papers not in input)
- [ ] No `null` values anywhere in output
- [ ] All required fields are present (per schema)
- [ ] All enum values are valid (e.g., venue types, gap types)

### Node-Specific Checks
- [ ] **Node 1**: Each paper has at least 1 keyword, 1 contribution, 1 limitation
- [ ] **Node 1**: Summary is 3-5 sentences (> 50 chars)
- [ ] **Node 2**: All 6 dimensions are present with entries for every paper
- [ ] **Node 2**: At least 1 key insight generated
- [ ] **Node 3**: confidence is 0.0–1.0 for every gap
- [ ] **Node 3**: supportingPaperCount >= evidence.length
- [ ] **Node 3**: Gap IDs are unique
- [ ] **Node 4**: novelty, difficulty, expectedImpact are integers 1–10
- [ ] **Node 4**: Every researchQuestion ends with "?"
- [ ] **Node 4**: Every gapId maps to an existing gap
- [ ] **Node 5**: All 6 required sections are present
- [ ] **Node 5**: References section cites all input papers
- [ ] **Node 5**: markdown is >= 500 chars and renders without errors

### Performance
- [ ] Node 1 latency < 20s (for 3-5 papers)
- [ ] Node 2 latency < 15s
- [ ] Node 3 latency < 15s
- [ ] Node 4 latency < 10s
- [ ] Node 5 latency < 30s
- [ ] Total pipeline < 90s

### Content Quality
- [ ] Agreements and contradictions are specific (cite paper IDs/titles)
- [ ] Gap evidence cites specific observations — not generic statements
- [ ] Research ideas are concrete and actionable — not "more research needed"
- [ ] Literature review has academic tone (no hype language)
- [ ] No contradictory statements across nodes

---

## Performance Targets

These are measurable goals for the Lamatic flow. Not strict SLAs — they guide optimization decisions.

| Node | Target Latency | Notes |
|------|---------------|-------|
| Node 1: Paper Intelligence | < 20 s | Scales linearly with paper count; 5 papers ≈ 15 s |
| Node 2: Comparison & Insights | < 15 s | Depends on number of papers and dimensions |
| Node 3: Gap Detector | < 15 s | Depends on number of gaps detected |
| Node 4: Research Idea Generator | < 10 s | Fastest node — pure generation from structured input |
| Node 5: Literature Review Generator | < 30 s | Longest node — full review synthesis |
| **Total pipeline** | **< 90 s** | For 3-5 papers with standard LLM provider |

### Scalability Notes
- 1 paper: < 40 s total
- 3-5 papers: < 90 s total (target)
- 10 papers: < 180 s total (acceptable)
- 20 papers: May exceed context windows; test before relying on it

If latency exceeds targets, consider: reducing prompt length, switching to a faster LLM provider, or splitting Paper Intelligence into parallel processing.

---

## Node Dependency Graph

```
Node 1 (Paper Intelligence)
  └──► Node 2 (Comparison & Insights) ──┐
        └──► Node 3 (Gap Detector) ─────┤
              └──► Node 4 (Idea Generator) ─┤
                    └──► Node 5 (Lit Review) ──► Response
```

Each node depends only on the output of the previous node(s). No node should re-read raw paper data after Node 1.
