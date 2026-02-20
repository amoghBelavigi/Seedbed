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
import { Github, Eye, PenLine, Bold, Italic, Underline, Heading2, List, Code } from "lucide-react";

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
  const [githubRepo, setGithubRepo] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    if (editingIdea) {
      setTitle(editingIdea.title);
      setDescription(editingIdea.description);
      setPriority(editingIdea.priority);
      setStatus(editingIdea.status);
      setGithubRepo(editingIdea.githubRepo ?? "");
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus("draft");
      setGithubRepo("");
    }
    setShowPreview(!!editingIdea && !!editingIdea.description);
  }, [editingIdea, open]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      githubRepo: githubRepo.trim() || undefined,
    });
    onOpenChange(false);
  };

  const isEditing = editingIdea !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
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

        <div className="grid gap-5 py-4">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              id="title"
              placeholder="What's your idea?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="description" className="text-sm font-medium">
                Description <span className="text-xs text-muted-foreground"></span>
              </label>
              {description && (
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex cursor-pointer items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPreview ? <PenLine className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  {showPreview ? "Edit" : "Preview"}
                </button>
              )}
            </div>
            {showPreview ? (
              <div className="min-h-[120px] rounded-md border bg-muted/30 p-3">
                <MarkdownContent content={description} />
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-0.5 rounded-t-md border border-b-0 bg-muted/40 px-1.5 py-1">
                  <button
                    type="button"
                    onClick={() => wrapSelection("**", "**")}
                    title="Bold"
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                  >
                    <Bold className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => wrapSelection("*", "*")}
                    title="Italic"
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                  >
                    <Italic className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => wrapSelection("<u>", "</u>")}
                    title="Underline"
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                  >
                    <Underline className="h-3.5 w-3.5" />
                  </button>
                  <div className="mx-1 h-4 w-px bg-border" />
                  <button
                    type="button"
                    onClick={() => wrapSelection("## ", "")}
                    title="Heading"
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                  >
                    <Heading2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => wrapSelection("- ", "")}
                    title="Bullet list"
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                  >
                    <List className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => wrapSelection("`", "`")}
                    title="Inline code"
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                  >
                    <Code className="h-3.5 w-3.5" />
                  </button>
                </div>
                <Textarea
                  ref={textareaRef}
                  id="description"
                  placeholder="Describe your idea in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={8}
                  className="resize-none rounded-t-none font-mono text-[13px]"
                />
              </div>
            )}
          </div>

          {/* Priority + Status */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select value={priority} onValueChange={(v) => setPriority(v as "low" | "medium" | "high")}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value} className="cursor-pointer">
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={status} onValueChange={(v) => setStatus(v as "draft" | "in-progress" | "completed")}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value} className="cursor-pointer">
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* GitHub Repo */}
          <div className="space-y-2">
            <label htmlFor="githubRepo" className="text-sm font-medium">
              GitHub Repository <span className="text-xs text-muted-foreground">(optional)</span>
            </label>
            <div className="relative">
              <Github className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="githubRepo"
                placeholder="https://github.com/username/repo"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer rounded-lg transition-colors duration-200"
            onClick={() => onOpenChange(false)}
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
  );
}
