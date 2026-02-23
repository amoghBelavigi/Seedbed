export type Priority = "low" | "medium" | "high";

export type Status = "draft" | "in-progress" | "completed";

export interface SimilarProject {
  name: string;
  url: string;
  description: string;
  strengths: string[];
}

export interface FeasibilityAnalysis {
  marketSize: string;
  technicalComplexity: "low" | "medium" | "high";
  estimatedTimeToMVP: string;
  challenges: string[];
  opportunities: string[];
}

export interface FeatureEnhancement {
  feature: string;
  description: string;
  priority: Priority;
  estimatedEffort: string;
}

export interface ResearchSource {
  title: string;
  url: string;
  snippet: string;
}

export interface ResearchReport {
  id: string;
  ideaId: string;
  similarProjects: SimilarProject[];
  feasibilityAnalysis: FeasibilityAnalysis;
  differentiationSuggestions: string[];
  featureEnhancements: FeatureEnhancement[];
  sources: ResearchSource[];
  generatedAt: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  githubRepo?: string;
  createdAt: string;
  updatedAt: string;
  researchReport?: ResearchReport;
}
