"use client";

import { Idea, Priority, Status } from "@/lib/types";
import { StatsCards } from "@/components/stats-cards";
import { IdeaCard } from "@/components/idea-card";
import { KanbanBoard } from "@/components/kanban-board";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/~~(.+?)~~/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, (m) => m.replace(/`/g, ""))
    .replace(/<\/?u>/g, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^>\s+/gm, "")
    .replace(/---+/g, "")
    .replace(/\n{2,}/g, " ")
    .trim();
}

interface DashboardScreenProps {
  ideas: Idea[];
  search: string;
  onEdit: (idea: Idea) => void;
  onDelete: (idea: Idea) => void;
  onNewIdea: () => void;
  onNavigate: (page: string) => void;
  onStatusChange: (ideaId: string, newStatus: Status) => void;
}

export function DashboardScreen({
  ideas,
  search,
  onEdit,
  onDelete,
  onNewIdea,
  onNavigate,
  onStatusChange,
}: DashboardScreenProps) {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold tracking-tight">
          {greeting()} 👋
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Here&apos;s a quick overview of your ideas and projects.
        </p>
      </div>

      <div className="mb-8">
        <StatsCards ideas={ideas} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold">
              Kanban Board
            </h2>
            <button
              onClick={() => onNavigate("brainbox")}
              className="flex cursor-pointer items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              View all ideas
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {ideas.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Lightbulb className="h-7 w-7 text-primary" />
              </div>
              <p className="mb-1 font-[family-name:var(--font-space-grotesk)] text-base font-semibold">
                No ideas yet
              </p>
              <p className="mb-5 text-sm text-muted-foreground">
                Start capturing your thoughts and inspirations.
              </p>
              <Button
                onClick={onNewIdea}
                className="cursor-pointer gap-2 rounded-lg font-[family-name:var(--font-space-grotesk)] font-semibold"
              >
                <Plus className="h-4 w-4" />
                Create Your First Idea
              </Button>
            </div>
          ) : (
            <div style={{ minHeight: "500px" }}>
              <KanbanBoard
                ideas={ideas}
                search={search}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
                onNewIdea={onNewIdea}
              />
            </div>
          )}
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold">
              All Ideas
            </h3>
            <Badge variant="secondary" className="text-[11px]">
              {ideas.length}
            </Badge>
          </div>
          {ideas.length === 0 ? (
            <p className="text-[13px] text-muted-foreground">
              No ideas yet. Create one to get started!
            </p>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {[...ideas]
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .map((idea) => (
                <div
                  key={idea.id}
                  onClick={() => onEdit(idea)}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border bg-card p-3 transition-colors hover:border-primary/25 hover:shadow-sm"
                >
                  <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                    idea.status === "completed"
                      ? "bg-emerald-50 dark:bg-emerald-900/30"
                      : idea.status === "in-progress"
                        ? "bg-blue-50 dark:bg-blue-900/30"
                        : "bg-muted"
                  }`}>
                    <Lightbulb className={`h-3.5 w-3.5 ${
                      idea.status === "completed"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : idea.status === "in-progress"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-muted-foreground"
                    }`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium leading-snug line-clamp-1">
                      {idea.title}
                    </p>
                    {idea.description && (
                      <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">
                        {stripMarkdown(idea.description)}
                      </p>
                    )}
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                        idea.status === "completed"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : idea.status === "in-progress"
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                            : "bg-muted text-muted-foreground"
                      }`}>
                        {idea.status === "in-progress" ? "In Progress" : idea.status === "completed" ? "Completed" : "Draft"}
                      </span>
                      <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                        idea.priority === "high"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                          : idea.priority === "medium"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                            : "bg-muted text-muted-foreground"
                      }`}>
                        {idea.priority.charAt(0).toUpperCase() + idea.priority.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
