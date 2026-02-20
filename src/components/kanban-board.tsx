"use client";

import { useMemo } from "react";
import { Idea, Status } from "@/lib/types";
import { KanbanCard } from "./kanban-card";
import {
  DragDropContext,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { FileEdit, Zap, CheckCircle2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Column {
  id: Status;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  headerColor: string;
  dotColor: string;
  emptyText: string;
}

const COLUMNS: Column[] = [
  {
    id: "draft",
    label: "Draft",
    icon: FileEdit,
    headerColor: "text-zinc-600 dark:text-zinc-400",
    dotColor: "bg-zinc-400 dark:bg-zinc-500",
    emptyText: "No drafts. Create a new idea!",
  },
  {
    id: "in-progress",
    label: "In Progress",
    icon: Zap,
    headerColor: "text-blue-600 dark:text-blue-400",
    dotColor: "bg-blue-500 dark:bg-blue-400",
    emptyText: "Drag a draft here to start working on it.",
  },
  {
    id: "completed",
    label: "Completed",
    icon: CheckCircle2,
    headerColor: "text-emerald-600 dark:text-emerald-400",
    dotColor: "bg-emerald-500 dark:bg-emerald-400",
    emptyText: "Drag finished ideas here to celebrate!",
  },
];

interface KanbanBoardProps {
  ideas: Idea[];
  search: string;
  onEdit: (idea: Idea) => void;
  onDelete: (idea: Idea) => void;
  onStatusChange: (ideaId: string, newStatus: Status) => void;
  onNewIdea: () => void;
}

export function KanbanBoard({
  ideas,
  search,
  onEdit,
  onDelete,
  onStatusChange,
  onNewIdea,
}: KanbanBoardProps) {
  const filteredIdeas = useMemo(() => {
    if (!search) return ideas;
    const q = search.toLowerCase();
    return ideas.filter(
      (idea) =>
        idea.title.toLowerCase().includes(q) ||
        idea.description.toLowerCase().includes(q)
    );
  }, [ideas, search]);

  const columns = useMemo(() => {
    const grouped: Record<Status, Idea[]> = {
      draft: [],
      "in-progress": [],
      completed: [],
    };
    filteredIdeas.forEach((idea) => {
      grouped[idea.status].push(idea);
    });
    // Sort each column by updatedAt (most recent first)
    Object.values(grouped).forEach((col) =>
      col.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    );
    return grouped;
  }, [filteredIdeas]);

  const handleDragEnd = (result: DropResult) => {
    const { draggableId, destination } = result;
    if (!destination) return;

    const newStatus = destination.droppableId as Status;
    const idea = ideas.find((i) => i.id === draggableId);
    if (!idea || idea.status === newStatus) return;

    onStatusChange(draggableId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-4" style={{ minHeight: "calc(100vh - 280px)" }}>
        {COLUMNS.map((column) => (
          <div
            key={column.id}
            className="flex flex-col rounded-xl bg-muted/30 dark:bg-muted/20"
          >
            {/* Column header */}
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <div className={cn("h-2.5 w-2.5 rounded-full", column.dotColor)} />
                <h3 className={cn("text-sm font-semibold", column.headerColor)}>
                  {column.label}
                </h3>
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-background px-1.5 text-[11px] font-semibold text-muted-foreground shadow-sm">
                  {columns[column.id].length}
                </span>
              </div>
              {column.id === "draft" && (
                <button
                  onClick={onNewIdea}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background hover:text-foreground hover:shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Droppable area */}
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "flex-1 space-y-2 overflow-y-auto px-2 pb-2 transition-colors duration-200",
                    snapshot.isDraggingOver && "bg-primary/5 dark:bg-primary/10"
                  )}
                >
                  {columns[column.id].length === 0 && !snapshot.isDraggingOver ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <column.icon className="mb-2 h-6 w-6 text-muted-foreground/30" />
                      <p className="px-4 text-[12px] text-muted-foreground/60">
                        {column.emptyText}
                      </p>
                    </div>
                  ) : (
                    columns[column.id].map((idea, index) => (
                      <KanbanCard
                        key={idea.id}
                        idea={idea}
                        index={index}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
