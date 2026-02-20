export type Priority = "low" | "medium" | "high";

export type Status = "draft" | "in-progress" | "completed";

export interface Idea {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  githubRepo?: string;
  createdAt: string;
  updatedAt: string;
}
