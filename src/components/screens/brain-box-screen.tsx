"use client";

import { useState, useMemo } from "react";
import { Idea, Status } from "@/lib/types";
import { IdeaCard } from "@/components/idea-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Lightbulb,
  LayoutGrid,
  Clock,
  ArrowUpDown,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ViewTab = "all" | "in-progress" | "completed" | "draft";

interface BrainBoxScreenProps {
  ideas: Idea[];
  search: string;
  onEdit: (idea: Idea) => void;
  onDelete: (idea: Idea) => void;
  onNewIdea: () => void;
  onStatusChange: (ideaId: string, newStatus: Status) => void;
}

export function BrainBoxScreen({
  ideas,
  search,
  onEdit,
  onDelete,
  onNewIdea,
  onStatusChange,
}: BrainBoxScreenProps) {
  const [activeTab, setActiveTab] = useState<ViewTab>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

  const filteredIdeas = useMemo(() => {
    let result = [...ideas];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (idea) =>
          idea.title.toLowerCase().includes(q) ||
          idea.description.toLowerCase().includes(q)
      );
    }

    if (activeTab !== "all") {
      result = result.filter((idea) => idea.status === activeTab);
    }

    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [ideas, search, activeTab, sortBy]);

  const tabs: { id: ViewTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "all", label: "All Ideas", icon: LayoutGrid },
    { id: "in-progress", label: "In Progress", icon: Clock },
    { id: "completed", label: "Completed", icon: () => <span className="text-xs">&#10003;</span> },
    { id: "draft", label: "Drafts", icon: () => <span className="text-xs opacity-60">&#9998;</span> },
  ];

  return (
    <>
      {/* Page title */}
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold tracking-tight">
          Brain Box Arena
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your repository for raw thoughts, future projects, and sudden inspirations.
        </p>
      </div>

      {/* Tabs + Sort */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-150",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="h-9 w-[130px] cursor-pointer text-xs">
            <ArrowUpDown className="mr-1.5 h-3.5 w-3.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest" className="cursor-pointer text-xs">Newest</SelectItem>
            <SelectItem value="oldest" className="cursor-pointer text-xs">Oldest</SelectItem>
            <SelectItem value="title" className="cursor-pointer text-xs">Title A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards grid or empty state */}
      {ideas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Lightbulb className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mb-2 font-[family-name:var(--font-space-grotesk)] text-xl font-bold">
            Your seedbed is empty
          </h2>
          <p className="mb-6 max-w-sm text-sm text-muted-foreground">
            Every great project starts with an idea. Capture your first one and watch your collection grow.
          </p>
          <Button
            onClick={onNewIdea}
            className="cursor-pointer gap-2 rounded-lg font-[family-name:var(--font-space-grotesk)] font-semibold"
          >
            <Plus className="h-4 w-4" />
            Create Your First Idea
          </Button>
        </div>
      ) : filteredIdeas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <Search className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="mb-1 font-[family-name:var(--font-space-grotesk)] text-base font-semibold">
            No ideas match
          </p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredIdeas.map((idea) => (
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
