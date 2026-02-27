"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Idea } from "@/lib/types";
import { STATUSES } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MarkdownContent } from "@/components/markdown-content";
import { Eye, PenLine, Bold, Italic, Heading2, List, Code, ChevronLeft, ChevronRight, Check, Sprout } from "lucide-react";
import { ResearchReport as ResearchReportType, RealityCheckReport as RealityCheckReportType } from "@/lib/types";
import { ResearchReport } from "@/components/research-report";
import { MarketScan } from "@/components/reality-check";
import { ResearchSkeleton } from "@/components/research-skeleton";
import { Sparkles, Loader2, Radar } from "lucide-react";
import { toast } from "sonner";

interface IdeaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingIdea: Idea | null;
  onSave: (idea: Omit<Idea, "id" | "createdAt" | "updatedAt">) => void;
}

const STEPS = [
  { number: 1, label: "Plant Your Seed", icon: Sprout, color: "text-emerald-500" },
  { number: 2, label: "Scan the Market", icon: Radar, color: "text-amber-500" },
  { number: 3, label: "Deep Research", icon: Sparkles, color: "text-purple-500" },
] as const;

export function IdeaDialog({
  open,
  onOpenChange,
  editingIdea,
  onSave,
}: IdeaDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"draft" | "in-progress" | "completed">("draft");
  const [showPreview, setShowPreview] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [researchProgress, setResearchProgress] = useState("");
  const [researchReport, setResearchReport] = useState<ResearchReportType | null>(null);
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const [isCheckingReality, setIsCheckingReality] = useState(false);
  const [realityCheck, setRealityCheck] = useState<RealityCheckReportType | null>(null);
  const [prd, setPrd] = useState<string | undefined>(undefined);
  const [currentStep, setCurrentStep] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if there's unsaved research, reality check, or PRD
  const hasUnsavedResearch = (researchReport && (!editingIdea?.researchReport ||
    researchReport.generatedAt !== editingIdea.researchReport.generatedAt)) ||
    (realityCheck && (!editingIdea?.realityCheck ||
    realityCheck.generatedAt !== editingIdea.realityCheck.generatedAt)) ||
    (prd && prd !== editingIdea?.prd);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && hasUnsavedResearch) {
      setShowCloseWarning(true);
    } else {
      onOpenChange(newOpen);
    }
  };

  const handleConfirmClose = () => {
    setShowCloseWarning(false);
    onOpenChange(false);
  };

  const progressMessages = [
    "Searching the web...",
    "Finding similar projects...",
    "Analyzing market size...",
    "Evaluating feasibility...",
    "Identifying challenges...",
    "Discovering opportunities...",
    "Generating suggestions...",
    "Compiling research report...",
  ];

  const wrapSelection = useCallback((before: string, after: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = description.slice(start, end);
    const newText = description.slice(0, start) + before + selected + after + description.slice(end);
    setDescription(newText);
    requestAnimationFrame(() => {
      ta.focus();
      ta.selectionStart = start + before.length;
      ta.selectionEnd = end + before.length;
    });
  }, [description]);

  // Cleanup progress interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (editingIdea) {
      setTitle(editingIdea.title);
      setDescription(editingIdea.description);
      setStatus(editingIdea.status);
      if (editingIdea.researchReport) {
        setResearchReport(editingIdea.researchReport);
      } else {
        setResearchReport(null);
      }
      setRealityCheck(editingIdea.realityCheck ?? null);
      setPrd(editingIdea.prd);
    } else {
      setTitle("");
      setDescription("");
      setStatus("draft");
      setResearchReport(null);
      setRealityCheck(null);
      setPrd(undefined);
    }
    setCurrentStep(1);
    setShowPreview(!!editingIdea && !!editingIdea.description);
  }, [editingIdea, open]);

  const startProgressMessages = () => {
    let index = 0;
    setResearchProgress(progressMessages[0]);

    progressIntervalRef.current = setInterval(() => {
      index = (index + 1) % progressMessages.length;
      setResearchProgress(progressMessages[index]);
    }, 2000);
  };

  const stopProgressMessages = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setResearchProgress("");
  };

  const handleRealityCheck = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title first");
      return;
    }

    setIsCheckingReality(true);

    try {
      const response = await fetch("/api/reality-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          ideaId: editingIdea?.id ?? "",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Reality check failed");
      }

      setRealityCheck(data.realityCheck);
      toast.success("Market scan complete!", {
        description: `Saturation score: ${data.realityCheck.score}/100`,
      });
    } catch (error) {
      console.error("Reality check error:", error);
      toast.error("Market scan failed", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsCheckingReality(false);
    }
  };

  const handleResearch = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title first");
      return;
    }

    setIsResearching(true);
    if (currentStep !== 3) setCurrentStep(3);
    startProgressMessages();

    try {
      console.log("🔍 Starting research...");

      const response = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Research failed");
      }

      console.log("✅ Research complete!");
      setResearchReport(data.research);
      toast.success("Research completed!", {
        description: "Check out the Deep Research step to see the results.",
      });

    } catch (error) {
      console.error("Research error:", error);
      toast.error("Research failed", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      stopProgressMessages();
      setIsResearching(false);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      status,
      researchReport: researchReport || undefined,
      realityCheck: realityCheck || undefined,
      prd,
    });
    onOpenChange(false);
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 3) setCurrentStep(step);
  };

  const isEditing = editingIdea !== null;

  return (
    <>
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold">
            {isEditing ? "Edit Idea" : "New Idea"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isEditing
              ? "Update your idea details below."
              : "Capture your idea before it escapes!"}
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="px-6 pt-2 pb-4">
          <div className="flex items-center justify-center">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;
              const isFuture = currentStep < step.number;

              return (
                <div key={step.number} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => isCompleted && goToStep(step.number)}
                    disabled={isFuture}
                    className={`flex items-center gap-2 transition-colors ${
                      isCompleted ? "cursor-pointer" : isFuture ? "cursor-default" : ""
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                        isCompleted
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                          : isCurrent
                          ? `border-current bg-current/10 ${step.color}`
                          : "border-muted-foreground/30 text-muted-foreground/40"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <span
                      className={`hidden sm:inline text-sm font-medium transition-colors ${
                        isCurrent ? step.color : isCompleted ? "text-foreground" : "text-muted-foreground/40"
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>

                  {i < STEPS.length - 1 && (
                    <div
                      className={`mx-3 h-px w-8 sm:w-12 transition-colors ${
                        currentStep > step.number ? "bg-emerald-500" : "bg-muted-foreground/20"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sliding Panels */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${(currentStep - 1) * 100}%)` }}
          >
            {/* Step 1 — Plant Your Seed */}
            <div className="w-full flex-shrink-0 overflow-y-auto px-6 pb-4" style={{ maxHeight: "calc(90vh - 230px)" }}>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Every great product starts with a simple idea.
                </p>
              </div>

              <div className="grid gap-5">
                {/* Title */}
                <div className="space-y-2">
                  <Input
                    id="title"
                    placeholder="What's your big idea?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full"
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="description" className="text-sm font-medium">
                      Description
                    </label>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => wrapSelection("**", "**")}
                        title="Bold"
                      >
                        <Bold className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => wrapSelection("*", "*")}
                        title="Italic"
                      >
                        <Italic className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => wrapSelection("## ", "")}
                        title="Heading"
                      >
                        <Heading2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => wrapSelection("- ", "")}
                        title="List"
                      >
                        <List className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => wrapSelection("`", "`")}
                        title="Code"
                      >
                        <Code className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => setShowPreview(!showPreview)}
                      >
                        {showPreview ? (
                          <>
                            <PenLine className="h-3.5 w-3.5 mr-1" />
                            <span className="text-xs">Edit</span>
                          </>
                        ) : (
                          <>
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            <span className="text-xs">Preview</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  {showPreview ? (
                    <div className="min-h-[150px] rounded-md border p-3">
                      <MarkdownContent content={description} />
                    </div>
                  ) : (
                    <Textarea
                      ref={textareaRef}
                      id="description"
                      placeholder="Describe your idea in detail... (Markdown supported)"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-[150px] resize-none"
                    />
                  )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    Status
                  </label>
                  <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Step 2 — Scan the Market */}
            <div className="w-full flex-shrink-0 overflow-y-auto px-6 pb-4" style={{ maxHeight: "calc(90vh - 230px)" }}>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Quick validation against GitHub, Hacker News, and npm to gauge competition.
                </p>
              </div>

              {isCheckingReality ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                  <p className="text-sm text-muted-foreground">Scanning the market...</p>
                </div>
              ) : realityCheck ? (
                <div className="space-y-4">
                  <MarketScan report={realityCheck} />
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRealityCheck}
                      disabled={!title.trim()}
                      className="gap-2"
                    >
                      <Radar className="h-4 w-4" />
                      Rescan
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
                    <Radar className="h-8 w-8 text-amber-500" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-medium">Ready to scan the market?</p>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      We&apos;ll check GitHub, Hacker News, and npm to see how crowded the space is.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleRealityCheck}
                    disabled={!title.trim()}
                    className="gap-2"
                  >
                    <Radar className="h-4 w-4" />
                    Run Market Scan
                  </Button>
                </div>
              )}
            </div>

            {/* Step 3 — Deep Research */}
            <div className="w-full flex-shrink-0 overflow-y-auto px-6 pb-4" style={{ maxHeight: "calc(90vh - 230px)" }}>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  AI-powered analysis: competitors, feasibility, market size, and differentiation strategy.
                </p>
              </div>

              {isResearching ? (
                <ResearchSkeleton progressMessage={researchProgress} />
              ) : researchReport ? (
                <div className="space-y-4">
                  <ResearchReport report={researchReport} ideaTitle={title} initialPrd={prd} onPrdGenerated={setPrd} />
                  <div className="flex justify-center pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResearch}
                      disabled={!title.trim()}
                      className="gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      Re-run Research
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10">
                    <Sparkles className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-medium">Ready for deep research?</p>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      AI will analyze competitors, market size, feasibility, and suggest how to stand out.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleResearch}
                    disabled={!title.trim()}
                    className="gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Start Research
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <DialogFooter className="px-6 pb-6 pt-2 flex-row justify-between sm:justify-between gap-2 border-t">
          <div>
            {currentStep === 1 ? (
              <Button
                variant="outline"
                className="cursor-pointer rounded-lg transition-colors duration-200"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
            ) : (
              <Button
                variant="outline"
                className="cursor-pointer rounded-lg transition-colors duration-200 gap-1"
                onClick={() => goToStep(currentStep - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {currentStep === 1 && (
              <Button
                variant="outline"
                className="cursor-pointer rounded-lg transition-colors duration-200"
                onClick={handleSubmit}
                disabled={!title.trim() || !description.trim()}
              >
                {isEditing ? "Save Changes" : "Create Idea"}
              </Button>
            )}
            {currentStep < 3 ? (
              <Button
                className="cursor-pointer rounded-lg transition-colors duration-200 gap-1"
                onClick={() => goToStep(currentStep + 1)}
                disabled={currentStep === 1 && (!title.trim() || !description.trim())}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                className="cursor-pointer rounded-lg transition-colors duration-200"
                onClick={handleSubmit}
                disabled={!title.trim()}
              >
                {isEditing ? "Save Changes" : "Create Idea"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <AlertDialog open={showCloseWarning} onOpenChange={setShowCloseWarning}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard research results?</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved research results. If you close now, your research will be lost.
            Click &quot;Save&quot; to keep your research, or &quot;Discard&quot; to close without saving.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Go Back</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmClose}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Discard
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
