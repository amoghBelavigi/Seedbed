"use client";

import { RealityCheckReport } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ExternalLink,
  GitBranch,
  Star,
  MessageSquare,
  Package,
  Lightbulb,
  Info,
} from "lucide-react";

interface MarketScanProps {
  report: RealityCheckReport;
}

/**
 * Score is now an opportunity score:
 *   high (70–100) = green  = open space, good to go
 *   mid  (40–69)  = amber  = some competition
 *   low  (0–39)   = red    = crowded, tough market
 */

function getScoreColor(score: number) {
  if (score >= 70) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 40) return "text-amber-500 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function getBadgeBg(score: number) {
  if (score >= 70)
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
  if (score >= 40)
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
  return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
}

function getLabel(score: number) {
  if (score >= 70) return "Wide open";
  if (score >= 40) return "Some competition";
  return "Crowded market";
}

function getGuidance(score: number) {
  if (score >= 70)
    return "Few established players in this space — looks promising. Validate that real demand exists (an empty market can also mean nobody wants it yet), then move fast.";
  if (score >= 40)
    return "Healthy competition signals real demand, but you'll share the space. Focus on a clear differentiator — what angle is nobody else taking?";
  return "This market is packed with established players. You'll need a sharp niche, a 10x better experience, or a completely fresh angle to break through.";
}

export function MarketScan({ report }: MarketScanProps) {
  const { score, evidence, topProjects, pivotSuggestions } = report;

  return (
    <Card className="p-4 space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      {/* Score Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`text-3xl font-bold tabular-nums ${getScoreColor(score)}`}>
            {score}
          </span>
          <div>
            <Badge className={`${getBadgeBg(score)} border-0 text-xs`}>
              {getLabel(score)}
            </Badge>
            <p className="text-xs text-muted-foreground mt-0.5">
              Opportunity score — higher is better
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {new Date(report.generatedAt).toLocaleDateString()}
        </Badge>
      </div>

      {/* Guidance */}
      <div className="flex gap-2 rounded-md bg-muted/50 dark:bg-zinc-800/50 p-3">
        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          {getGuidance(score)}
        </p>
      </div>

      <Separator className="dark:bg-zinc-700" />

      {/* Evidence Grid */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Where we looked
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <GitBranch className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">GitHub</span>
            </div>
            <p className="text-lg font-semibold tabular-nums">
              {evidence.github.totalCount.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">repos found</p>
            {evidence.github.maxStars > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3" />
                {evidence.github.maxStars.toLocaleString()} top stars
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MessageSquare className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Hacker News</span>
            </div>
            <p className="text-lg font-semibold tabular-nums">
              {evidence.hackerNews.totalHits.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">discussions</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Package className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">npm</span>
            </div>
            <p className="text-lg font-semibold tabular-nums">
              {evidence.npm.totalCount.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">packages</p>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground/70 mt-2">
          More repos, discussions &amp; packages = more competition = lower score.
        </p>
      </div>

      {/* Top Similar Projects */}
      {topProjects.length > 0 && (
        <>
          <Separator className="dark:bg-zinc-700" />
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Closest competitors
            </p>
            <div className="space-y-1.5">
              {topProjects.map((project, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-muted-foreground shrink-0">
                      {idx + 1}.
                    </span>
                    <span className="shrink-0 font-medium">{project.name}</span>
                    {project.description && (
                      <span className="truncate text-xs text-muted-foreground hidden sm:inline">
                        — {project.description}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3" />
                      {project.stars.toLocaleString()}
                    </div>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground/70">
              Ranked by GitHub stars. Study these to find gaps you can fill.
            </p>
          </div>
        </>
      )}

      {/* Pivot Suggestions */}
      {pivotSuggestions.length > 0 && (
        <>
          <Separator className="dark:bg-zinc-700" />
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Lightbulb className="h-3.5 w-3.5 text-yellow-500 dark:text-yellow-400" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Pivot ideas
              </p>
            </div>
            <ol className="space-y-1.5">
              {pivotSuggestions.map((suggestion, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-yellow-500 dark:bg-yellow-600 text-white text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-muted-foreground">{suggestion}</span>
                </li>
              ))}
            </ol>
            <p className="text-[11px] text-muted-foreground/70">
              AI-generated angles based on gaps in the existing competition.
            </p>
          </div>
        </>
      )}

      {/* How to read this */}
      <Separator className="dark:bg-zinc-700" />
      <details className="group">
        <summary className="text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors flex items-center gap-1.5">
          <Info className="h-3 w-3" />
          How to read this report
        </summary>
        <div className="mt-2 space-y-2 text-[11px] text-muted-foreground/80 leading-relaxed">
          <p>
            The score measures how much <strong>open opportunity</strong> exists, based on GitHub repos (30%), top repo stars (20%), Hacker News discussions (20%), and npm packages (30%). Less existing activity = higher score.
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded bg-emerald-50 dark:bg-emerald-900/20 p-2">
              <p className="font-medium text-emerald-700 dark:text-emerald-300">70–100: Wide open</p>
              <p>Low competition — validate demand exists.</p>
            </div>
            <div className="rounded bg-amber-50 dark:bg-amber-900/20 p-2">
              <p className="font-medium text-amber-700 dark:text-amber-300">40–69: Some competition</p>
              <p>Proven demand — find your niche.</p>
            </div>
            <div className="rounded bg-red-50 dark:bg-red-900/20 p-2">
              <p className="font-medium text-red-700 dark:text-red-300">0–39: Crowded</p>
              <p>Strong competition — differentiate hard.</p>
            </div>
          </div>
          <p>
            A low score doesn&apos;t mean &quot;don&apos;t build it&quot; — it means &quot;know your competition well.&quot; Run a full <strong>Research</strong> next for deeper analysis.
          </p>
        </div>
      </details>
    </Card>
  );
}
