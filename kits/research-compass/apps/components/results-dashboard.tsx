"use client";

import { FileText, GitCompare, Search, Lightbulb, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface ResearchResult {
  domain?: { domain: string; subDomain?: string; focusAreas?: string[] };
  paperCount?: number;
  summaries?: Array<{
    paperId: string;
    title: string;
    authors: string[];
    venue?: { name: string; year: number; type: string };
    keywords?: string[];
    summary: string;
    contributions?: string[];
    limitations?: string[];
  }>;
  comparison?: {
    summary: string;
    dimensions?: Array<{ name: string; values: Array<{ paperId: string; value: string }>; insight?: string }>;
    agreements?: string[];
    contradictions?: string[];
    keyInsights?: string[];
  };
  gaps?: {
    gaps: Array<{
      id: string;
      type: string;
      description: string;
      confidence: number;
      supportingPaperCount: number;
      evidence?: Array<{ paperId: string; paperTitle: string; reason: string }>;
      reasoning: string;
    }>;
  };
  futureWork?: {
    ideas: Array<{
      gapId: string;
      researchQuestion: string;
      proposedApproach: string;
      novelty: number;
      difficulty: number;
      expectedImpact: number;
    }>;
  };
  literatureReview?: {
    title: string;
    sections: Array<{ heading: string; content: string }>;
    markdown?: string;
  };
}

interface ResultsDashboardProps {
  result: ResearchResult;
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground w-24 shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-medium w-8 text-right">{pct}%</span>
    </div>
  );
}

export function ResultsDashboard({ result }: ResultsDashboardProps) {
  return (
    <div className="space-y-6">
      {result.domain && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Research Domain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant="secondary" className="text-sm px-3 py-1">{result.domain.domain}</Badge>
              {result.domain.subDomain && <Badge variant="outline" className="text-sm px-3 py-1">{result.domain.subDomain}</Badge>}
              {result.domain.focusAreas?.map((area) => (
                <Badge key={area} variant="outline" className="text-xs">{area}</Badge>
              ))}
            </div>
            {result.paperCount !== undefined && (
              <p className="text-sm text-muted-foreground mt-3">Analyzed {result.paperCount} paper(s)</p>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="summaries" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="summaries">
            <FileText className="h-4 w-4 mr-1.5" />
            Summaries
          </TabsTrigger>
          <TabsTrigger value="comparison">
            <GitCompare className="h-4 w-4 mr-1.5" />
            Comparison
          </TabsTrigger>
          <TabsTrigger value="gaps">
            <Search className="h-4 w-4 mr-1.5" />
            Gaps
          </TabsTrigger>
          <TabsTrigger value="ideas">
            <Lightbulb className="h-4 w-4 mr-1.5" />
            Future Work
          </TabsTrigger>
          <TabsTrigger value="review">
            <BookOpen className="h-4 w-4 mr-1.5" />
            Lit Review
          </TabsTrigger>
        </TabsList>

        {/* Summaries Tab */}
        <TabsContent value="summaries" className="mt-4">
          <div className="space-y-4">
            {result.summaries?.map((paper) => (
              <Card key={paper.paperId}>
                <CardHeader>
                  <CardTitle className="text-base">{paper.title}</CardTitle>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {paper.authors?.map((author) => (
                      <Badge key={author} variant="secondary" className="text-xs">{author}</Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{paper.summary}</ReactMarkdown>
                  </div>
                  {paper.keywords && paper.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {paper.keywords.map((kw) => (
                        <Badge key={kw} variant="outline" className="text-xs">{kw}</Badge>
                      ))}
                    </div>
                  )}
                  {paper.contributions && paper.contributions.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Contributions</p>
                      <ul className="list-disc list-inside text-sm space-y-0.5">
                        {paper.contributions.map((c, i) => (
                          <li key={i} className="text-muted-foreground">{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {paper.limitations && paper.limitations.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Limitations</p>
                      <ul className="list-disc list-inside text-sm space-y-0.5">
                        {paper.limitations.map((l, i) => (
                          <li key={i} className="text-muted-foreground">{l}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="mt-4">
          {result.comparison && (
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{result.comparison.summary}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>

              {result.comparison.dimensions?.map((dim) => (
                <Card key={dim.name}>
                  <CardHeader>
                    <CardTitle className="text-base capitalize">{dim.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {dim.values.map((v) => (
                      <div key={`${dim.name}-${v.paperId}`} className="text-sm">
                        <span className="font-medium">{v.paperId}: </span>
                        <span className="text-muted-foreground">{v.value}</span>
                      </div>
                    ))}
                    {dim.insight && (
                      <>
                        <Separator className="my-2" />
                        <p className="text-sm text-primary italic">{dim.insight}</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.comparison.agreements && result.comparison.agreements.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Agreements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {result.comparison.agreements.map((a, i) => (
                          <li key={i} className="text-muted-foreground">{a}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                {result.comparison.contradictions && result.comparison.contradictions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Contradictions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {result.comparison.contradictions.map((c, i) => (
                          <li key={i} className="text-muted-foreground">{c}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              {result.comparison.keyInsights && result.comparison.keyInsights.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Key Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {result.comparison.keyInsights.map((k, i) => (
                        <li key={i} className="text-muted-foreground">{k}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* Gaps Tab */}
        <TabsContent value="gaps" className="mt-4">
          <div className="space-y-4">
            {result.gaps?.gaps.map((gap) => (
              <Card key={gap.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{gap.description}</CardTitle>
                    <Badge variant={gap.confidence >= 0.8 ? "default" : "secondary"}>
                      {gap.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4">
                    <ScoreBar label="Confidence" value={gap.confidence} color="bg-primary" />
                    <span className="text-xs text-muted-foreground shrink-0">
                      {gap.supportingPaperCount} paper(s)
                    </span>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{gap.reasoning}</ReactMarkdown>
                  </div>
                  {gap.evidence && gap.evidence.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Evidence</p>
                      <ul className="list-disc list-inside text-sm space-y-0.5">
                        {gap.evidence.map((e, i) => (
                          <li key={i} className="text-muted-foreground">
                            <span className="font-medium">{e.paperTitle}</span>: {e.reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Future Work Tab */}
        <TabsContent value="ideas" className="mt-4">
          <div className="space-y-4">
            {result.futureWork?.ideas.map((idea, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-base">{idea.researchQuestion}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{idea.proposedApproach}</ReactMarkdown>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <ScoreBar label="Novelty" value={idea.novelty} color="bg-blue-500" />
                    <ScoreBar label="Difficulty" value={idea.difficulty} color="bg-amber-500" />
                    <ScoreBar label="Impact" value={idea.expectedImpact} color="bg-green-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Lit Review Tab */}
        <TabsContent value="review" className="mt-4">
          {result.literatureReview && (
            <Card>
              <CardHeader>
                <CardTitle>{result.literatureReview.title || "Literature Review"}</CardTitle>
              </CardHeader>
              <CardContent>
                {result.literatureReview.markdown ? (
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{result.literatureReview.markdown}</ReactMarkdown>
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="space-y-4">
                    {result.literatureReview.sections?.map((section, i) => (
                      <div key={i}>
                        <h3 className="text-base font-semibold mb-2">{section.heading}</h3>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown>{section.content}</ReactMarkdown>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
