import { Compass } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center max-w-lg px-6">
        <Compass className="w-16 h-16 mx-auto mb-6 text-primary" />
        <h1 className="text-4xl font-semibold mb-3">Research Compass</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Upload research papers and generate comprehensive literature reviews with gap analysis and future research directions.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          Coming soon
        </div>
      </div>
    </div>
  );
}
