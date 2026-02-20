"use client";

import { Idea } from "@/lib/types";
import { getPriorityConfig } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, GripVertical } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";

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

interface KanbanCardProps {
  idea: Idea;
  index: number;
  onEdit: (idea: Idea) => void;
  onDelete: (idea: Idea) => void;
}

export function KanbanCard({ idea, index, onEdit, onDelete }: KanbanCardProps) {
  const priorityConfig = getPriorityConfig(idea.priority);

  const priorityDot = {
    low: "bg-slate-400",
    medium: "bg-amber-500",
    high: "bg-rose-500",
  };

  return (
    <Draggable draggableId={idea.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`group rounded-lg border bg-card p-3.5 transition-all duration-150 ${
            snapshot.isDragging
              ? "shadow-md ring-2 ring-primary/20"
              : "hover:shadow-sm"
          }`}
        >
          <div className="mb-2 flex items-center gap-2">
            <div
              {...provided.dragHandleProps}
              className="cursor-grab text-muted-foreground/30 transition-colors hover:text-muted-foreground active:cursor-grabbing"
            >
              <GripVertical className="h-3.5 w-3.5" />
            </div>
            <div className={`h-2 w-2 rounded-full ${priorityDot[idea.priority]}`} />
            <span className="flex-1 text-[11px] font-medium text-muted-foreground">
              {priorityConfig.label}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit(idea)}>
                  <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={() => onDelete(idea)}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p
            onClick={() => onEdit(idea)}
            className="mb-1 cursor-pointer text-[13px] font-semibold leading-snug line-clamp-2 hover:text-primary"
          >
            {idea.title}
          </p>

          {idea.description && (
            <p className="mb-2 text-[11px] leading-relaxed text-muted-foreground line-clamp-2">
              {stripMarkdown(idea.description)}
            </p>
          )}

        </div>
      )}
    </Draggable>
  );
}
