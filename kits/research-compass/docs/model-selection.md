Version: 1.0.0
Last Updated: 2026-07-18
Compatible With:
- prompt-contracts.md v1.0.0
- types.ts v1.0.0

# Model Selection Guide — Research Compass

Each node has different requirements. This document separates **required** constraints (must be met for correct operation) from **recommended** settings (optimization guidance).

---

## Node 1: Paper Intelligence

### Required
- **Supported provider:** Any LLM with >= 16K token context window (full paper texts may be long)
- **Minimum context window:** 16K tokens
- **Output format:** Strict JSON (enforced by prompt, not model)

### Recommended
| Setting | Value | Rationale |
|---------|-------|-----------|
| Provider | Gemini 1.5 Pro or GPT-4o | Strong extraction quality; large context |
| Temperature | 0.1 – 0.2 | Low for deterministic, consistent extraction |
| Max Tokens | 4096 | Per-paper output ~300-500 tokens; supports up to 8 papers |

---

## Node 2: Comparison & Insights

### Required
- **Supported provider:** Any LLM with >= 8K token context
- **Input type:** Structured JSON (PaperData[] — compact)

### Recommended
| Setting | Value | Rationale |
|---------|-------|-----------|
| Provider | Gemini 1.5 Pro or GPT-4o | Strong cross-document reasoning |
| Temperature | 0.2 – 0.3 | Slightly higher to allow pattern discovery |
| Max Tokens | 4096 | Covers 5-10 papers comfortably |

---

## Node 3: Gap Detector

### Required
- **Supported provider:** Any LLM with >= 8K token context
- **Confidence calibration:** Model must support numeric scoring in output

### Recommended
| Setting | Value | Rationale |
|---------|-------|-----------|
| Provider | Gemini 1.5 Pro or GPT-4o | Strong analytical reasoning |
| Temperature | 0.2 | Low for evidence-based reasoning; avoids speculation |
| Max Tokens | 4096 | Gap analysis is compact (few hundred tokens) |

---

## Node 4: Research Idea Generator

### Required
- **Supported provider:** Any LLM with >= 4K token context
- **Creative capability:** Model should produce varied, novel outputs

### Recommended
| Setting | Value | Rationale |
|---------|-------|-----------|
| Provider | Gemini 1.5 Pro or GPT-4o | Creative but grounded generation |
| Temperature | 0.4 – 0.6 | Higher enables novel ideas while staying grounded |
| Max Tokens | 4096 | Each idea ~150-250 tokens; covers 10+ ideas |

---

## Node 5: Literature Review Generator

### Required
- **Supported provider:** Any LLM with >= 8K token context
- **Max output length:** Must support >= 4K output tokens

### Recommended
| Setting | Value | Rationale |
|---------|-------|-----------|
| Provider | Gemini 1.5 Pro or GPT-4o | Long-form synthesis quality |
| Temperature | 0.3 – 0.4 | Balanced for structured academic writing |
| Max Tokens | 8192 | Review is 1500-3000 words; 8192 ensures full output |

---

## Summary Table

| Node | Min Context Required | Recommended Provider | Recommended Temp | Max Tokens |
|------|---------------------|---------------------|-----------------|------------|
| 1. Paper Intelligence | 16K | Gemini 1.5 Pro | 0.1-0.2 | 4096 |
| 2. Comparison & Insights | 8K | Gemini 1.5 Pro | 0.2-0.3 | 4096 |
| 3. Gap Detector | 8K | Gemini 1.5 Pro | 0.2 | 4096 |
| 4. Idea Generator | 4K | Gemini 1.5 Pro | 0.4-0.6 | 4096 |
| 5. Literature Review | 8K | Gemini 1.5 Pro | 0.3-0.4 | 8192 |

## Provider Alternatives

| Provider | Best For | Trade-off |
|----------|----------|-----------|
| Gemini 1.5 Flash | Speed, cost | Slightly lower reasoning quality |
| Claude 3.5 Sonnet | Nuanced writing | Higher cost per token |
| Groq (Llama 3) | Low-latency extraction | Smaller context window |
| GPT-4o Mini | Cost-effective simple nodes | Less reliable for complex extraction |
