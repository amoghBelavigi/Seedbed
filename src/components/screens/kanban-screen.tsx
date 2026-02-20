"use client";

import { Idea, Status } from "@/lib/types";
import { KanbanBoard } from "@/components/kanban-board";
import { Button } from "@/components/ui/button";
import { Plus, Lightbulb } from "lucide-react";

interface KanbanScreenProps {
  ideas: Idea[];
  search: string;
  onEdit: (idea: Idea) => void;
  onDelete: (idea: Idea) => void;
  onStatusChange: (ideaId: string, newStatus: Status) => void;
  onNewIdea: () => void;
}

export function KanbanScreen({
  ideas,
  search,
  onEdit,
  onDelete,
  onStatusChange,
  onNewIdea,
}: KanbanScreenProps) {
  return (
    <>
      {/* Page title */}
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold tracking-tight">
          Kanban Board
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Drag and drop ideas between columns to manage their progress visually.
        </p>
      </div>

      {ideas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Lightbulb className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mb-2 font-[family-name:var(--font-space-grotesk)] text-xl font-bold">
            Your board is empty
          </h2>
          <p className="mb-6 max-w-sm text-sm text-muted-foreground">
            Create your first idea and drag it between columns to manage its progress.
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
        <KanbanBoard
          ideas={ideas}
          search={search}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onNewIdea={onNewIdea}
        />
      )}
    </>
  );
}
