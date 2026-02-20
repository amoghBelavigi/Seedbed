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
  Trophy,
  ArrowUpDown,
  PartyPopper,
  CalendarCheck,
  Star,
} from "lucide-react";

interface TrophyCaseScreenProps {
  ideas: Idea[];
  search: string;
  onEdit: (idea: Idea) => void;
  onDelete: (idea: Idea) => void;
  onNavigate: (page: string) => void;
  onStatusChange: (ideaId: string, newStatus: Status) => void;
}

export function TrophyCaseScreen({
  ideas,
  search,
  onEdit,
  onDelete,
  onNavigate,
  onStatusChange,
}: TrophyCaseScreenProps) {
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

  const completedIdeas = useMemo(() => {
    let result = ideas.filter((i) => i.status === "completed");

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

  const totalCompleted = ideas.filter((i) => i.status === "completed").length;

  const completedThisWeek = (() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return ideas.filter(
      (i) => i.status === "completed" && new Date(i.updatedAt) >= oneWeekAgo
    ).length;
  })();

  const completedThisMonth = (() => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return ideas.filter(
      (i) => i.status === "completed" && new Date(i.updatedAt) >= oneMonthAgo
    ).length;
  })();

  return (
    <>
      {/* Page title */}
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold tracking-tight">
          Trophy Case
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Shipped and Proud
        </p>
      </div>

      {/* Achievement stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:w-2/3">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-muted-foreground">Total Wins</p>
            <Trophy className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-1 font-[family-name:var(--font-space-grotesk)] text-2xl font-bold">
            {totalCompleted}
          </p>
          <p className="mt-0.5 text-[12px] font-medium text-amber-600 dark:text-amber-400">
            {totalCompleted > 0 ? "Ideas shipped" : "Start shipping!"}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-muted-foreground">This Week</p>
            <CalendarCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-1 font-[family-name:var(--font-space-grotesk)] text-2xl font-bold">
            {completedThisWeek}
          </p>
          <p className="mt-0.5 text-[12px] font-medium text-emerald-600 dark:text-emerald-400">
            {completedThisWeek > 0 ? "Great progress!" : "Keep pushing"}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-muted-foreground">This Month</p>
            <Star className="h-4 w-4 text-violet-500" />
          </div>
          <p className="mt-1 font-[family-name:var(--font-space-grotesk)] text-2xl font-bold">
            {completedThisMonth}
          </p>
          <p className="mt-0.5 text-[12px] font-medium text-muted-foreground">
            Completed
          </p>
        </div>
      </div>

      {/* Sort bar */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold">
            Completed Ideas
          </h2>
          <Badge variant="secondary" className="text-[11px]">
            {completedIdeas.length}
          </Badge>
        </div>

        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="h-9 w-[150px] cursor-pointer text-xs">
            <ArrowUpDown className="mr-1.5 h-3.5 w-3.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest" className="cursor-pointer text-xs">Recently Completed</SelectItem>
            <SelectItem value="oldest" className="cursor-pointer text-xs">Oldest First</SelectItem>
            <SelectItem value="title" className="cursor-pointer text-xs">Title A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards or empty state */}
      {completedIdeas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/30">
            <PartyPopper className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="mb-2 font-[family-name:var(--font-space-grotesk)] text-xl font-bold">
            {search ? "No matches" : "No trophies yet"}
          </h2>
          <p className="mb-6 max-w-sm text-sm text-muted-foreground">
            {search
              ? "Try adjusting your search terms."
              : "Complete your first idea to earn a trophy. Your wins will be celebrated here!"}
          </p>
          {!search && (
            <Button
              onClick={() => onNavigate("launchpad")}
              variant="outline"
              className="cursor-pointer gap-2 rounded-lg font-[family-name:var(--font-space-grotesk)] font-semibold"
            >
              Go to Launch Pad
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {completedIdeas.map((idea) => (
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
