export default {
  name: "Research Compass",
  description: "AI agent that reads multiple research papers, compares methodologies, detects evidence-backed research gaps, proposes future research directions, and generates a complete literature review.",
  version: "1.0.0",
  type: "kit" as const,
  author: { name: "Lamatic AI", email: "info@lamatic.ai" },
  tags: ["research", "literature-review", "academic"],
  steps: [
    {
      id: "research-compass",
      type: "mandatory",
      envKey: "RESEARCH_COMPASS"
    }
  ],
  links: {
    github: "https://github.com/Lamatic/AgentKit/tree/main/kits/research-compass",
    docs: "https://lamatic.ai/templates/agentkits/research-compass"
  }
};
