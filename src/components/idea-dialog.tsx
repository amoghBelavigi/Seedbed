"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Idea } from "@/lib/types";
import { PRIORITIES, STATUSES } from "@/lib/constants";
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
import { Eye, PenLine, Bold, Italic, Heading2, List, Code } from "lucide-react";
import { ResearchReport as ResearchReportType } from "@/lib/types";
import { ResearchReport } from "@/components/research-report";
import { ResearchSkeleton } from "@/components/research-skeleton";
import { Sparkles, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface IdeaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingIdea: Idea | null;
  onSave: (idea: Omit<Idea, "id" | "createdAt" | "updatedAt">) => void;
}

export function IdeaDialog({
  open,
  onOpenChange,
  editingIdea,
  onSave,
}: IdeaDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [status, setStatus] = useState<"draft" | "in-progress" | "completed">("draft");
  const [showPreview, setShowPreview] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [researchProgress, setResearchProgress] = useState("");
  const [researchReport, setResearchReport] = useState<ResearchReportType | null>(null);
  const [showResearchTab, setShowResearchTab] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if there's unsaved research (new research that wasn't in the original idea)
  const hasUnsavedResearch = researchReport && (!editingIdea?.researchReport ||
    researchReport.generatedAt !== editingIdea.researchReport.generatedAt);

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
      setPriority(editingIdea.priority);
      setStatus(editingIdea.status);
      // Load existing research report if available
      if (editingIdea.researchReport) {
        setResearchReport(editingIdea.researchReport);
        setShowResearchTab(false); // Start on details tab
      } else {
        setResearchReport(null);
        setShowResearchTab(false);
      }
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus("draft");
      setResearchReport(null);
      setShowResearchTab(false);
    }
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

  const handleResearch = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title first");
      return;
    }

    setIsResearching(true);
    setShowResearchTab(true); // Switch to research tab to show skeleton
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
      setShowResearchTab(true);
      toast.success("Research completed!", {
        description: "Check out the Research tab to see the results.",
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
      priority,
      status,
      researchReport: researchReport || undefined,
    });
    onOpenChange(false);
  };

  const isEditing = editingIdea !== null;

  return (
    <>
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold">
            {isEditing ? "Edit Idea" : "New Idea"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your idea details below."
              : "Capture your idea before it escapes!"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" value={showResearchTab ? "research" : "details"} onValueChange={(v) => setShowResearchTab(v === "research")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="research" disabled={!researchReport && !isResearching}>
              Research {isResearching ? "..." : researchReport ? "✓" : ""}
            </TabsTrigger>
            {/* All your existing form fields go here - keep everything between "grid gap-5 py-4" */}
          </TabsList>

          <TabsContent value="details" className="space-y-5">
            <div className="grid gap-5 py-4">
              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title *
                </label>
                <Input
                  id="title"
                  placeholder="What's your big idea?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
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

              {/* Priority and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="priority" className="text-sm font-medium">
                    Priority
                  </label>
                  <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          <span className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${p.color}`} />
                            {p.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    Status
                  </label>
                  <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                    <SelectTrigger>
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

            {/* Research Button */}
            <div className="flex flex-col items-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleResearch}
                disabled={isResearching || !title.trim()}
                className="gap-2"
              >
                {isResearching ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Researching...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Research This Idea
                  </>
                )}
              </Button>
              {isResearching && researchProgress && (
                <p className="text-sm text-muted-foreground animate-pulse">
                  {researchProgress}
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="research" className="py-4">
            {isResearching ? (
              <ResearchSkeleton progressMessage={researchProgress} />
            ) : researchReport ? (
              <ResearchReport report={researchReport} ideaTitle={title} />
            ) : (
              <p className="text-center text-muted-foreground">No research data available</p>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer rounded-lg transition-colors duration-200"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer rounded-lg transition-colors duration-200"
            onClick={handleSubmit}
            disabled={!title.trim()}
          >
            {isEditing ? "Save Changes" : "Create Idea"}
          </Button>
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
