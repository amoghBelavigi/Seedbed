"use client";

import { Idea, Status } from "@/lib/types";
import { getStatusConfig, STATUSES } from "@/lib/constants";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Lightbulb,
  ArrowRightLeft,
  Check,
} from "lucide-react";
import { MarkdownContent } from "@/components/markdown-content";

interface IdeaCardProps {
  idea: Idea;
  onEdit: (idea: Idea) => void;
  onDelete: (idea: Idea) => void;
  onStatusChange?: (ideaId: string, newStatus: Status) => void;
}

export function IdeaCard({ idea, onEdit, onDelete, onStatusChange }: IdeaCardProps) {
  const statusConfig = getStatusConfig(idea.status);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const statusAccent = {
    "draft": { bg: "bg-zinc-100 dark:bg-zinc-800/50", icon: "text-zinc-500 dark:text-zinc-400" },
    "in-progress": { bg: "bg-blue-100 dark:bg-blue-900/40", icon: "text-blue-600 dark:text-blue-400" },
    "completed": { bg: "bg-emerald-100 dark:bg-emerald-900/40", icon: "text-emerald-600 dark:text-emerald-400" },
  };
  const accent = statusAccent[idea.status];

  return (
    <Card
      className="group relative flex cursor-pointer flex-col rounded-xl border bg-card p-5 transition-all duration-200 hover:border-primary/25 hover:shadow-sm"
      onClick={() => onEdit(idea)}
    >
      <div className="mb-3.5 flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.bg}`}>
          <Lightbulb className={`h-5 w-5 ${accent.icon}`} />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-visible:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={(e) => { e.stopPropagation(); onEdit(idea); }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>

            {onStatusChange && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger
                  className="cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ArrowRightLeft className="mr-2 h-4 w-4" />
                  Move to
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {STATUSES.map((s) => (
                    <DropdownMenuItem
                      key={s.value}
                      className="cursor-pointer"
                      disabled={idea.status === s.value}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (idea.status !== s.value) onStatusChange(idea.id, s.value);
                      }}
                    >
                      {idea.status === s.value && <Check className="mr-2 h-3.5 w-3.5" />}
                      {idea.status !== s.value && <span className="mr-2 w-3.5" />}
                      {s.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={(e) => { e.stopPropagation(); onDelete(idea); }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h3 className="mb-1.5 font-[family-name:var(--font-space-grotesk)] text-[15px] font-semibold leading-snug line-clamp-2">
        {idea.title}
      </h3>

      {idea.description && (
        <div className="mb-4 flex-1 line-clamp-4 overflow-hidden">
          <MarkdownContent content={idea.description} />
        </div>
      )}
      {!idea.description && <div className="mb-4 flex-1" />}

      <div className="flex items-center justify-between">
        <Badge variant="outline" className={`text-[11px] ${statusConfig.color}`}>
          {statusConfig.label}
        </Badge>
        <span className="text-[11px] text-muted-foreground">
          {formatDate(idea.createdAt)}
        </span>
      </div>
    </Card>
  );
}
