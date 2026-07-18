# Research Compass by Lamatic.ai

**Research Compass** is an AI-powered research analysis system built with [Lamatic.ai](https://lamatic.ai). It reads multiple research papers, compares methodologies, detects evidence-backed research gaps, proposes future research directions, and generates a complete literature review.

## Pipeline

```
Upload Papers
     ↓
Paper Intelligence  — extract metadata, detect domain, generate summaries
     ↓
Comparison & Insights  — compare across 6 dimensions, find agreements/contradictions
     ↓
Gap Detector  — identify 8 types of research gaps with evidence and confidence scores
     ↓
Research Idea Generator  — propose scored research directions per gap
     ↓
Literature Review  — synthesize everything into a 6-section academic review
```

## Lamatic Setup

Pre: Build in Lamatic
1. Sign in at https://lamatic.ai
2. Create a project
3. Import the flow from `flows/research-compass.ts`
4. Configure LLM providers for each of the 5 nodes
5. Deploy the flow and copy your env keys

Post: Wire into this repo
1. Create `apps/.env.local` with your keys
2. `npm install`
3. `npm run dev`

### Environment Variables

```
RESEARCH_COMPASS="Flow ID from Lamatic Studio"
LAMATIC_API_URL="Lamatic API URL"
LAMATIC_PROJECT_ID="Your project ID"
LAMATIC_API_KEY="Your API key"
```

## Project Structure

```
kits/research-compass/
├── lamatic.config.ts         Kit metadata
├── flows/
│   └── research-compass.ts   5-node pipeline flow
├── prompts/                  10 prompt files (system + user per node)
├── model-configs/            5 model config stubs
├── constitutions/
│   └── default.md            Guardrails
├── tests/                    25 test fixtures
│   ├── schema/               JSON Schema per node
│   ├── sample-input/         1, 3, 5 paper fixtures
│   ├── golden-output/        Reference outputs
│   ├── invalid/              Error handling tests
│   ├── edge-cases/           Boundary condition tests
│   └── integration/          End-to-end pipeline specs
├── docs/                     Model selection, testing workflow, deployment checklist
├── apps/                     Next.js frontend
└── types.ts                  All TypeScript interfaces
```

## Tech Stack

- **Flow Engine:** Lamatic (5-node sequential LLM pipeline)
- **Frontend:** Next.js 15, React 18, Tailwind CSS v4
- **UI:** shadcn/ui, lucide-react
- **SDK:** lamatic npm package
- **Markdown:** react-markdown
