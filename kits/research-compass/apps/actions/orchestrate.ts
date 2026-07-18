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
    return { success: false, error: "RESEARCH_COMPASS environment variable is not set" };
  }

  try {
    const client = getLamaticClient();
    const res = await client.executeFlow(workflowId, input);
    const raw = res?.result;
    return {
      success: true,
      data: raw ? JSON.parse(typeof raw === "string" ? raw : JSON.stringify(raw)) : null
    };
  } catch (error) {
    console.error("[research-compass] Flow execution error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}
