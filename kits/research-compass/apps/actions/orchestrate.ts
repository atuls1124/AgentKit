"use server";

import { getLamaticClient } from "@/lib/lamatic-client";

export async function researchCompass(input: {
  papers: Array<{
    id: string;
    sourceType: string;
    title: string;
    authors?: string[];
    year?: number;
    abstract?: string;
    doi?: string;
    sourceUrl?: string;
  }>;
  researchArea?: string;
}) {
  const workflowId = process.env.RESEARCH_COMPASS;

  if (!workflowId) {
    throw new Error("RESEARCH_COMPASS environment variable is not set");
  }

  try {
    const client = getLamaticClient();
    const res = await client.executeFlow(workflowId, input);
    return { success: true, data: res?.result };
  } catch (error) {
    console.error("[research-compass] Flow execution error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}
