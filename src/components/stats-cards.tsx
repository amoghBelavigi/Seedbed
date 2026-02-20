"use client";

import { Lightbulb, Zap, CheckCircle2, Sparkles } from "lucide-react";
import { Idea } from "@/lib/types";

interface StatsCardsProps {
  ideas: Idea[];
}

export function StatsCards({ ideas }: StatsCardsProps) {
  const totalIdeas = ideas.length;
  const inProgress = ideas.filter((i) => i.status === "in-progress").length;
  const completed = ideas.filter((i) => i.status === "completed").length;
  const drafts = ideas.filter((i) => i.status === "draft").length;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const thisWeek = ideas.filter((i) => new Date(i.createdAt) >= oneWeekAgo).length;

  const stats = [
    {
      label: "Total Ideas",
      value: totalIdeas,
      subtitle: thisWeek > 0 ? `+${thisWeek} this week` : "Start adding ideas",
      subtitleColor: thisWeek > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
      icon: Lightbulb,
    },
    {
      label: "In Progress",
      value: inProgress,
      subtitle: "Active projects",
      subtitleColor: "text-muted-foreground",
      icon: Zap,
    },
    {
      label: "Completed",
      value: completed,
      subtitle: completed > 0 ? "Well done!" : "Finish some ideas",
      subtitleColor: completed > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
      icon: CheckCircle2,
    },
    {
      label: "Drafts",
      value: drafts,
      subtitle: "Waiting to bloom",
      subtitleColor: "text-muted-foreground",
      icon: Sparkles,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border bg-card p-4 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-muted-foreground">{stat.label}</p>
            <stat.icon className="h-4 w-4 text-muted-foreground/50" />
          </div>
          <p className="mt-1 font-[family-name:var(--font-space-grotesk)] text-2xl font-bold">
            {stat.value}
          </p>
          <p className={`mt-0.5 text-[12px] font-medium ${stat.subtitleColor}`}>
            {stat.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
}
