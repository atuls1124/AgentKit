// ============================================================
// Research Compass — Data Contracts
// ============================================================

// ---- Agent Metadata ----

export interface AgentMetadata {
  name: "Research Compass";
  version: string;
  model?: string;
}

// ---- Input Types (Preprocessed server-side before reaching Lamatic) ----

export type PaperSourceType = "pdf" | "arxiv" | "doi" | "title";

export interface PaperInput {
  id: string;
  sourceType: PaperSourceType;
  title: string;
  authors?: string[];
  year?: number;
  abstract?: string;
  fullText?: string;
  doi?: string;
  sourceUrl?: string;
}

export interface GraphQLInput {
  papers: PaperInput[];
  researchArea?: string;
}

// ---- Venue ----

export interface Venue {
  name: string;
  year: number;
  type: "conference" | "journal" | "preprint" | "workshop" | "other";
}

// ---- Dataset ----

export interface Dataset {
  name: string;
  description?: string;
  usage?: "training" | "evaluation" | "both";
}

// ---- Evaluation Metric ----

export interface EvaluationMetric {
  name: string;
  value?: number | string;
  unit?: string;
}

// ---- Node 1: Paper Intelligence ----

export interface PaperData {
  paperId: string;
  title: string;
  authors: string[];
  venue: Venue;
  doi?: string;
  sourceUrl?: string;
  keywords: string[];
  problem: string;
  methodology: string;
  dataset: Dataset[];
  evaluation: EvaluationMetric[];
  contributions: string[];
  limitations: string[];
  summary: string;
}

export interface ResearchDomain {
  domain: string;
  subDomain?: string;
  focusAreas: string[];
}

export interface PaperIntelligenceOutput {
  domain: ResearchDomain;
  papers: PaperData[];
}

// ---- Node 2: Comparison & Insights ----

export type ComparisonDimensionName =
  | "problem"
  | "methodology"
  | "dataset"
  | "evaluation"
  | "results"
  | "contributions";

export interface ComparisonValue {
  paperId: string;
  value: string;
}

export interface ComparisonDimension {
  name: ComparisonDimensionName;
  values: ComparisonValue[];
  insight?: string;
}

export interface ComparisonResult {
  summary: string;
  dimensions: ComparisonDimension[];
  agreements: string[];
  contradictions: string[];
  keyInsights: string[];
}

// ---- Node 3: Evidence-based Gap Detector ----

export type GapType =
  | "Methodology"
  | "Dataset"
  | "Evaluation"
  | "Deployment"
  | "Explainability"
  | "Scalability"
  | "Clinical"
  | "Ethical";

export interface GapEvidence {
  paperId: string;
  paperTitle: string;
  reason: string;
}

export interface Gap {
  id: string;
  type: GapType;
  description: string;
  confidence: number;
  supportingPaperCount: number;
  evidence: GapEvidence[];
  reasoning: string;
}

export interface GapAnalysis {
  gaps: Gap[];
}

// ---- Node 4: Research Idea Generator ----

export interface ResearchIdea {
  gapId: string;
  researchQuestion: string;
  proposedApproach: string;
  novelty: number;
  difficulty: number;
  expectedImpact: number;
}

export interface ResearchIdeaGeneratorOutput {
  ideas: ResearchIdea[];
}

// ---- Node 5: Literature Review Generator ----

export interface LitReviewSection {
  heading: string;
  content: string;
}

export interface LiteratureReview {
  title: string;
  sections: LitReviewSection[];
  markdown: string;
}

// ---- Confidence ----

export interface ConfidenceScores {
  comparison: number;
  gapDetection: number;
  futureWork: number;
}

// ---- Final Response ----

export interface ResearchCompassResponse {
  metadata: AgentMetadata;
  generatedAt: string;
  domain: ResearchDomain;
  paperCount: number;
  summaries: PaperData[];
  comparison: ComparisonResult;
  gaps: GapAnalysis;
  futureWork: ResearchIdeaGeneratorOutput;
  literatureReview: LiteratureReview;
  confidence: ConfidenceScores;
}
