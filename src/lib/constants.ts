import { Status } from "./types";

export const STATUSES: { value: Status; label: string; color: string }[] = [
  { value: "draft", label: "Draft", color: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700" },
  { value: "in-progress", label: "In Progress", color: "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
  { value: "completed", label: "Completed", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" },
];

export function getStatusConfig(status: Status) {
  return STATUSES.find((s) => s.value === status) ?? STATUSES[0];
}
