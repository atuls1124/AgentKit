Version: 1.0.0
Last Updated: 2026-07-18
Compatible With:
- prompt-contracts.md v1.0.0
- types.ts v1.0.0

# Deployment Checklist — Research Compass

Use this checklist before submitting to the AgentKit Challenge.

---

## Lamatic Flow

- [ ] Flow exports successfully from Lamatic Studio
- [ ] `flows/research-compass.ts` contains all 5 nodes with correct node/edge definitions
- [ ] GraphQL trigger node configured with input schema matching `GraphQLInput`
- [ ] GraphQL response node configured with output matching `ResearchCompassResponse`
- [ ] Each LLM node references the correct prompt files via `@prompts/...`
- [ ] Each LLM node references the correct model config via `@model-configs/...`
- [ ] All `@reference` paths resolve to existing files
- [ ] No hardcoded credentials or API keys in flow files

## Environment & Configuration

- [ ] `.env.example` created with all required variables
- [ ] All `envKey` values in `lamatic.config.ts` match `.env.example`
- [ ] `lamatic.config.ts` has correct `type: "kit"`, `author`, `tags`, `links`
- [ ] `links.github` points to `kits/research-compass/`
- [ ] `links.deploy` has `root-directory=kits/research-compass/apps`

## Testing

- [ ] Schema validation passes for all 5 nodes
- [ ] 1-paper integration test passes
- [ ] 3-paper integration test passes
- [ ] 5-paper integration test passes
- [ ] Invalid input tests pass (graceful error handling)
- [ ] Edge case tests pass
- [ ] Pipeline latency within targets (< 90s for 3-5 papers)

## Documentation

- [ ] `README.md` written with: problem statement, setup, usage, architecture, V2 roadmap
- [ ] `agent.md` written with agent identity, flows, guardrails, quickstart
- [ ] `constitutions/default.md` written
- [ ] Screenshots captured (input page, results dashboard, sample output)
- [ ] Demo video recorded (3-5 minutes)

## Challenge Submission

- [ ] PR title starts with `feat:` (e.g., `feat: Add Research Compass kit`)
- [ ] PR includes label `agentkit-challenge`
- [ ] PR touches only files inside `kits/research-compass/`
- [ ] No `.env` or `.env.local` committed (only `.env.example`)
- [ ] No generated files committed (only source)
- [ ] PR description explains: problem, solution, architecture, how to run

## Post-Deployment

- [ ] Vercel deployment works (demo link functional)
- [ ] Lamatic flow responds to API requests
- [ ] All environment variables set in deployment
- [ ] Demo link added to `lamatic.config.ts` `links.demo`
