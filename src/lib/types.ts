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
  priority: "low" | "medium" | "high";
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

export type SaturationLevel = "low" | "medium" | "high";

export interface GitHubRepo {
  name: string;
  fullName: string;
  url: string;
  description: string;
  stars: number;
  language: string | null;
  updatedAt: string;
}

export interface HNStory {
  title: string;
  url: string;
  points: number;
  numComments: number;
  createdAt: string;
}

export interface NpmPackage {
  name: string;
  description: string;
  version: string;
  url: string;
}

export interface RealityEvidence {
  github: { totalCount: number; maxStars: number; repos: GitHubRepo[] };
  hackerNews: { totalHits: number; stories: HNStory[] };
  npm: { totalCount: number; packages: NpmPackage[] };
}

export interface RealityCheckReport {
  id: string;
  ideaId: string;
  score: number;
  saturation: SaturationLevel;
  evidence: RealityEvidence;
  topProjects: GitHubRepo[];
  pivotSuggestions: string[];
  generatedAt: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
  researchReport?: ResearchReport;
  realityCheck?: RealityCheckReport;
  prd?: string;
}
