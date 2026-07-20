"use client";

import { useState } from "react";
import { Toaster, toast } from "sonner";
import { Header } from "@/components/header";
import { PaperInputForm, type PaperFormEntry } from "@/components/paper-input-form";
import { ResultsDashboard, type ResearchResult } from "@/components/results-dashboard";
import { researchCompass } from "@/actions/orchestrate";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze(papers: PaperFormEntry[], researchArea?: string) {
    setLoading(true);
    setResult(null);
    setError(null);

    const payload = {
      papers: papers.map((p) => ({
        id: p.id,
        sourceType: "title" as const,
        title: p.title,
        authors: p.authors ? p.authors.split(",").map((a) => a.trim()).filter(Boolean) : undefined,
        year: p.year ? Number(p.year) : undefined,
        abstract: p.abstract || undefined,
      })),
      researchArea,
    };

    try {
      const res = await researchCompass(payload);
      if (res.success && res.data) {
        setResult(res.data as ResearchResult);
        toast.success("Analysis complete");
      } else {
        setError(res.error || "Unknown error");
        toast.error(res.error || "Analysis failed");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unexpected error";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900">
      <Toaster position="top-center" richColors />
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {!result && !error && (
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold mb-2">Analyze Research Papers</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Enter paper details below to generate a comprehensive literature review with comparative analysis, research gap detection, and future direction suggestions.
            </p>
          </div>
        )}

        <PaperInputForm onAnalyze={handleAnalyze} loading={loading} />

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="relative flex h-12 w-12">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-12 w-12 bg-primary/20" />
            </div>
            <p className="text-muted-foreground animate-pulse">Analyzing papers through the Research Compass pipeline...</p>
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        {result && !loading && (
          <div className="mt-8">
            <ResultsDashboard result={result} />
          </div>
        )}
      </main>
    </div>
  );
}
