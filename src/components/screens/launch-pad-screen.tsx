"use client";

import { useState, useMemo } from "react";
import { Idea, Status } from "@/lib/types";
import { IdeaCard } from "@/components/idea-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Rocket,
  Zap,
  ArrowUpDown,
  Search,
} from "lucide-react";

interface LaunchPadScreenProps {
  ideas: Idea[];
  search: string;
  onEdit: (idea: Idea) => void;
  onDelete: (idea: Idea) => void;
  onNavigate: (page: string) => void;
  onStatusChange: (ideaId: string, newStatus: Status) => void;
}

export function LaunchPadScreen({
  ideas,
  search,
  onEdit,
  onDelete,
  onNavigate,
  onStatusChange,
}: LaunchPadScreenProps) {
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

  const inProgressIdeas = useMemo(() => {
    let result = ideas.filter((i) => i.status === "in-progress");

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (idea) =>
          idea.title.toLowerCase().includes(q) ||
          idea.description.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
        break;
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [ideas, search, sortBy]);

  const totalInProgress = ideas.filter((i) => i.status === "in-progress").length;

  return (
    <>
      {/* Page title */}
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold tracking-tight">
          Launch Pad
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ideas you&apos;re actively working on. Focus, build, and ship.
        </p>
      </div>

      {/* Mini stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:w-2/3">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-muted-foreground">Active</p>
            <Zap className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-1 font-[family-name:var(--font-space-grotesk)] text-2xl font-bold">
            {totalInProgress}
          </p>
          <p className="mt-0.5 text-[12px] font-medium text-muted-foreground">In progress</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-muted-foreground">Focus Tip</p>
            <Rocket className="h-4 w-4 text-violet-500" />
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
            {totalInProgress > 0
              ? "Stay focused — ship one idea before starting the next."
              : "Great focus! Keep the momentum going."}
          </p>
        </div>
      </div>

      {/* Sort bar */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold">
            Active Projects
          </h2>
          <Badge variant="secondary" className="text-[11px]">
            {inProgressIdeas.length}
          </Badge>
        </div>

        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="h-9 w-[130px] cursor-pointer text-xs">
            <ArrowUpDown className="mr-1.5 h-3.5 w-3.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest" className="cursor-pointer text-xs">Recently Updated</SelectItem>
            <SelectItem value="oldest" className="cursor-pointer text-xs">Oldest First</SelectItem>
            <SelectItem value="title" className="cursor-pointer text-xs">Title A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards or empty state */}
      {inProgressIdeas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30">
            <Rocket className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="mb-2 font-[family-name:var(--font-space-grotesk)] text-xl font-bold">
            {search ? "No matches" : "Nothing launched yet"}
          </h2>
          <p className="mb-6 max-w-sm text-sm text-muted-foreground">
            {search
              ? "Try adjusting your search terms."
              : "Move an idea to \"In Progress\" to see it here. Head to Brain Box Arena to get started."}
          </p>
          {!search && (
            <Button
              onClick={() => onNavigate("brainbox")}
              variant="outline"
              className="cursor-pointer gap-2 rounded-lg font-[family-name:var(--font-space-grotesk)] font-semibold"
            >
              Go to Brain Box Arena
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {inProgressIdeas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </>
  );
}
