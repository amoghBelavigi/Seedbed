"use client";

import { useState } from "react";
import { ResearchReport as ResearchReportType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink, TrendingUp, AlertCircle, Lightbulb, BookOpen, Download, Loader2, Wand2, Copy, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { MarkdownContent } from "@/components/markdown-content";

interface ResearchReportProps {
  report: ResearchReportType;
  ideaTitle?: string;
}

export function ResearchReport({ report, ideaTitle }: ResearchReportProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);

    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let y = 20;

      const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        const lines = doc.splitTextToSize(text, contentWidth);

        if (y + lines.length * fontSize * 0.4 > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          y = 20;
        }

        doc.text(lines, margin, y);
        y += lines.length * fontSize * 0.4 + 2;
      };

      const addSpace = (space: number = 5) => {
        y += space;
      };

      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text(ideaTitle || "Research Report", margin, y);
      y += 10;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated: ${new Date(report.generatedAt).toLocaleDateString()}`, margin, y);
      y += 15;

      addText("SIMILAR PROJECTS", 14, true);
      addSpace(3);

      report.similarProjects.forEach((project, idx) => {
        addText(`${idx + 1}. ${project.name}`, 11, true);
        addText(project.description, 10);
        addText(`URL: ${project.url}`, 9);
        addText(`Strengths: ${project.strengths.join(", ")}`, 9);
        addSpace(5);
      });

      addSpace(10);

      addText("FEASIBILITY ANALYSIS", 14, true);
      addSpace(3);
      addText(`Market Size: ${report.feasibilityAnalysis.marketSize}`, 10);
      addText(`Technical Complexity: ${report.feasibilityAnalysis.technicalComplexity.toUpperCase()}`, 10);
      addText(`Time to MVP: ${report.feasibilityAnalysis.estimatedTimeToMVP}`, 10);
      addSpace(3);

      addText("Challenges:", 11, true);
      report.feasibilityAnalysis.challenges.forEach((challenge) => {
        addText(`  • ${challenge}`, 10);
      });
      addSpace(3);

      addText("Opportunities:", 11, true);
      report.feasibilityAnalysis.opportunities.forEach((opp) => {
        addText(`  • ${opp}`, 10);
      });

      addSpace(10);

      addText("HOW TO STAND OUT", 14, true);
      addSpace(3);
      report.differentiationSuggestions.forEach((suggestion, idx) => {
        addText(`${idx + 1}. ${suggestion}`, 10);
      });

      addSpace(10);

      addText("SUGGESTED FEATURES", 14, true);
      addSpace(3);
      report.featureEnhancements.forEach((feature, idx) => {
        addText(`${idx + 1}. ${feature.feature} [${feature.priority.toUpperCase()}]`, 11, true);
        addText(feature.description, 10);
        addText(`Estimated effort: ${feature.estimatedEffort}`, 9);
        addSpace(3);
      });

      addSpace(10);

      if (report.sources && report.sources.length > 0) {
        addText("SOURCES", 14, true);
        addSpace(3);
        report.sources.forEach((source, idx) => {
          addText(`${idx + 1}. ${source.title}`, 10, true);
          addText(source.snippet, 9);
          addText(`URL: ${source.url}`, 9);
          addSpace(3);
        });
      }

      const filename = `research-report-${ideaTitle?.toLowerCase().replace(/\s+/g, "-") || "idea"}-${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(filename);

    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleGeneratePrompt = async () => {
    setIsGeneratingPrompt(true);

    try {
      const response = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: ideaTitle,
          research: report,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate prompt");
      }

      setGeneratedPrompt(data.prompt);
      toast.success("Prompt generated!");
    } catch (error) {
      console.error("Generate prompt error:", error);
      toast.error("Failed to generate prompt", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const handleCopyPrompt = async () => {
    if (!generatedPrompt) return;

    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setIsCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      {/* Header with Download Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold">Research Report</h2>
        <div className="flex items-center gap-2 sm:gap-3">
          <Badge variant="outline" className="text-xs whitespace-nowrap">
            {new Date(report.generatedAt).toLocaleDateString()}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="gap-2"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Generating...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download PDF</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <Separator className="dark:bg-zinc-700" />

      {/* Similar Projects Section */}
      <section
        className="space-y-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
        style={{ animationDelay: "100ms", animationFillMode: "both" }}
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          <h3 className="text-base sm:text-lg font-semibold">Similar Projects</h3>
        </div>
        <div className="grid gap-3">
          {report.similarProjects.map((project, idx) => (
            <Card
              key={idx}
              className="p-3 sm:p-4 bg-card/50 dark:bg-zinc-800/50 border-border/50 hover:border-border transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm sm:text-base">{project.name}</h4>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 shrink-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">{project.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.strengths.map((strength, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-0"
                    >
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="dark:bg-zinc-700" />

      {/* Feasibility Analysis */}
      <section
        className="space-y-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
        style={{ animationDelay: "200ms", animationFillMode: "both" }}
      >
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
          <h3 className="text-base sm:text-lg font-semibold">Feasibility Analysis</h3>
        </div>
        <Card className="p-3 sm:p-4 bg-card/50 dark:bg-zinc-800/50 border-border/50">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Market Size</p>
              <p className="mt-1 text-sm sm:text-base">{report.feasibilityAnalysis.marketSize}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Technical Complexity</p>
              <Badge
                className={`mt-1 ${
                  report.feasibilityAnalysis.technicalComplexity === "low"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    : report.feasibilityAnalysis.technicalComplexity === "medium"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                } border-0`}
              >
                {report.feasibilityAnalysis.technicalComplexity.toUpperCase()}
              </Badge>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Time to MVP</p>
              <p className="mt-1 text-sm sm:text-base">{report.feasibilityAnalysis.estimatedTimeToMVP}</p>
            </div>
          </div>

          <Separator className="my-4 dark:bg-zinc-700" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="font-medium text-sm sm:text-base text-red-600 dark:text-red-400">Challenges</p>
              <ul className="mt-2 space-y-1.5">
                {report.feasibilityAnalysis.challenges.map((challenge, i) => (
                  <li key={i} className="text-xs sm:text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-red-500 dark:text-red-400">•</span>
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium text-sm sm:text-base text-green-600 dark:text-green-400">Opportunities</p>
              <ul className="mt-2 space-y-1.5">
                {report.feasibilityAnalysis.opportunities.map((opp, i) => (
                  <li key={i} className="text-xs sm:text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-green-500 dark:text-green-400">•</span>
                    {opp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </section>

      <Separator className="dark:bg-zinc-700" />

      {/* Differentiation Suggestions */}
      <section
        className="space-y-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
        style={{ animationDelay: "300ms", animationFillMode: "both" }}
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
          <h3 className="text-base sm:text-lg font-semibold">How to Stand Out</h3>
        </div>
        <Card className="p-3 sm:p-4 bg-gradient-to-br from-yellow-50/50 to-amber-50/50 dark:from-yellow-900/10 dark:to-amber-900/10 border-yellow-200/50 dark:border-yellow-800/30">
          <ul className="space-y-2 sm:space-y-3">
            {report.differentiationSuggestions.map((suggestion, i) => (
              <li key={i} className="flex items-start gap-2 sm:gap-3">
                <span className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-yellow-500 dark:bg-yellow-600 text-white text-xs font-bold">
                  {i + 1}
                </span>
                <span className="text-sm sm:text-base">{suggestion}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <Separator className="dark:bg-zinc-700" />

      {/* Feature Enhancements */}
      <section
        className="space-y-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
        style={{ animationDelay: "400ms", animationFillMode: "both" }}
      >
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-purple-500 dark:text-purple-400" />
          <h3 className="text-base sm:text-lg font-semibold">Suggested Features</h3>
        </div>
        <div className="grid gap-3">
          {report.featureEnhancements.map((feature, idx) => (
            <Card
              key={idx}
              className="p-3 sm:p-4 bg-card/50 dark:bg-zinc-800/50 border-border/50 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base">{feature.feature}</h4>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{feature.description}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Effort: <span className="font-medium">{feature.estimatedEffort}</span>
                  </p>
                </div>
                <Badge
                  className={`shrink-0 self-start ${
                    feature.priority === "high"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      : feature.priority === "medium"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  } border-0`}
                >
                  {feature.priority}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="dark:bg-zinc-700" />

      {/* Sources */}
      {report.sources && report.sources.length > 0 && (
        <section
          className="space-y-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: "500ms", animationFillMode: "both" }}
        >
          <h3 className="text-base sm:text-lg font-semibold">Sources</h3>
          <div className="space-y-2">
            {report.sources.map((source, idx) => (
              <Card
                key={idx}
                className="p-2.5 sm:p-3 bg-card/50 dark:bg-zinc-800/50 border-border/50 hover:bg-accent/50 transition-colors"
              >
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 group"
                >
                  <ExternalLink className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                  <div className="min-w-0">
                    <p className="font-medium text-xs sm:text-sm group-hover:text-primary transition-colors truncate">
                      {source.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{source.snippet}</p>
                  </div>
                </a>
              </Card>
            ))}
          </div>
        </section>
      )}

      <Separator className="dark:bg-zinc-700" />

      {/* Generate Prompt Section */}
      <section
        className="space-y-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
        style={{ animationDelay: "600ms", animationFillMode: "both" }}
      >
        <div className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          <h3 className="text-base sm:text-lg font-semibold">Get Started</h3>
        </div>

        {!generatedPrompt ? (
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border-primary/20">
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Ready to build? Generate a prompt you can paste into ChatGPT or Claude to start coding your MVP.
              </p>
              <Button
                onClick={handleGeneratePrompt}
                disabled={isGeneratingPrompt}
                className="gap-2"
              >
                {isGeneratingPrompt ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Generate a prompt to start building
                  </>
                )}
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-4 bg-card/50 dark:bg-zinc-800/50 border-border/50">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Copy this prompt into ChatGPT or Claude:</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyPrompt}
                  className="gap-2 h-8"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-xs">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span className="text-xs">Copy</span>
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-muted/50 dark:bg-zinc-900/50 rounded-lg p-3 sm:p-4 max-h-[400px] overflow-y-auto">
                <div className="text-sm prose prose-sm dark:prose-invert prose-headings:text-base prose-headings:font-semibold prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 max-w-none">
                  <MarkdownContent content={generatedPrompt} />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGeneratePrompt}
                disabled={isGeneratingPrompt}
                className="gap-2"
              >
                {isGeneratingPrompt ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Regenerate
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}
      </section>
    </div>
  );
}
