import { Priority, Status } from "./types";

export const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700" },
  { value: "medium", label: "Medium", color: "bg-amber-50 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200 dark:border-amber-800" },
  { value: "high", label: "High", color: "bg-rose-50 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 border-rose-200 dark:border-rose-800" },
];

export const STATUSES: { value: Status; label: string; color: string }[] = [
  { value: "draft", label: "Draft", color: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700" },
  { value: "in-progress", label: "In Progress", color: "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
  { value: "completed", label: "Completed", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" },
];

export function getPriorityConfig(priority: Priority) {
  return PRIORITIES.find((p) => p.value === priority) ?? PRIORITIES[0];
}

export function getStatusConfig(status: Status) {
  return STATUSES.find((s) => s.value === status) ?? STATUSES[0];
}
