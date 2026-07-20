"use client";

import { useState, useId } from "react";
import { Plus, Trash2, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface PaperFormEntry {
  id: string;
  title: string;
  authors: string;
  year: string;
  abstract: string;
}

interface PaperInputFormProps {
  onAnalyze: (papers: PaperFormEntry[], researchArea?: string) => void;
  loading: boolean;
}

export function PaperInputForm({ onAnalyze, loading }: PaperInputFormProps) {
  const uid = useId();
  const [papers, setPapers] = useState<PaperFormEntry[]>([
    { id: `${uid}-0`, title: "", authors: "", year: "", abstract: "" },
  ]);
  const [researchArea, setResearchArea] = useState("");

  function addPaper() {
    setPapers((prev) => [...prev, { id: crypto.randomUUID(), title: "", authors: "", year: "", abstract: "" }]);
  }

  function removePaper(id: string) {
    setPapers((prev) => prev.filter((p) => p.id !== id));
  }

  function updatePaper(id: string, field: keyof PaperFormEntry, value: string) {
    setPapers((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const filled = papers.filter((p) => p.title.trim());
    if (filled.length === 0) return;
    onAnalyze(filled, researchArea.trim() || undefined);
  }

  function loadDemo() {
    setPapers([
      { id: `${uid}-demo-0`, title: "Attention Is All You Need", authors: "Vaswani et al.", year: "2017", abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely." },
      { id: `${uid}-demo-1`, title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding", authors: "Devlin et al.", year: "2019", abstract: "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers." },
      { id: `${uid}-demo-2`, title: "GPT-3: Language Models are Few-Shot Learners", authors: "Brown et al.", year: "2020", abstract: "We demonstrate that scaling up language models greatly improves task-agnostic, few-shot performance. We train GPT-3, an autoregressive language model with 175 billion parameters, and test its performance in the few-shot setting." },
    ]);
    setResearchArea("Natural Language Processing");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Research Papers</CardTitle>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={loadDemo} disabled={loading}>
              <FlaskConical className="h-4 w-4 mr-1" />
              Load Demo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="researchArea">Research Area (optional)</Label>
            <Input
              id="researchArea"
              placeholder="e.g. Natural Language Processing, Computer Vision..."
              value={researchArea}
              onChange={(e) => setResearchArea(e.target.value)}
              disabled={loading}
            />
          </div>

          {papers.map((paper, index) => (
            <Card key={paper.id} className="border-dashed">
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Paper {index + 1}</span>
                  {papers.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removePaper(paper.id)} disabled={loading}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor={`title-${paper.id}`}>Title</Label>
                    <Input
                      id={`title-${paper.id}`}
                      placeholder="Paper title"
                      value={paper.title}
                      onChange={(e) => updatePaper(paper.id, "title", e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`year-${paper.id}`}>Year</Label>
                    <Input
                      id={`year-${paper.id}`}
                      placeholder="e.g. 2024"
                      value={paper.year}
                      onChange={(e) => updatePaper(paper.id, "year", e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`authors-${paper.id}`}>Authors</Label>
                  <Input
                    id={`authors-${paper.id}`}
                    placeholder="e.g. Smith et al."
                    value={paper.authors}
                    onChange={(e) => updatePaper(paper.id, "authors", e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`abstract-${paper.id}`}>Abstract</Label>
                  <Textarea
                    id={`abstract-${paper.id}`}
                    placeholder="Paste the abstract here..."
                    rows={3}
                    value={paper.abstract}
                    onChange={(e) => updatePaper(paper.id, "abstract", e.target.value)}
                    disabled={loading}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <Button type="button" variant="outline" className="w-full" onClick={addPaper} disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            Add Another Paper
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button type="submit" size="lg" disabled={loading || papers.every((p) => !p.title.trim())}>
          {loading ? "Analyzing..." : "Analyze Papers"}
        </Button>
      </div>
    </form>
  );
}
