"use client";

import { Compass } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center gap-3 px-4">
        <Compass className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-lg font-semibold leading-tight">Research Compass</h1>
          <p className="text-xs text-muted-foreground">AI-Powered Literature Review Agent</p>
        </div>
      </div>
    </header>
  );
}
