import { NextResponse } from "next/server";
import {
  GitHubRepo,
  HNStory,
  NpmPackage,
  RealityEvidence,
  RealityCheckReport,
  SaturationLevel,
} from "@/lib/types";

async function searchGitHub(query: string): Promise<{
  totalCount: number;
  maxStars: number;
  repos: GitHubRepo[];
}> {
  try {
    const res = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&per_page=5`,
      {
        headers: { Accept: "application/vnd.github.v3+json" },
      }
    );
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const data = await res.json();
    const repos: GitHubRepo[] = (data.items ?? []).map(
      (item: Record<string, unknown>) => ({
        name: item.name as string,
        fullName: item.full_name as string,
        url: item.html_url as string,
        description: (item.description as string) ?? "",
        stars: item.stargazers_count as number,
        language: (item.language as string) ?? null,
        updatedAt: item.updated_at as string,
      })
    );
    const maxStars = repos.length > 0 ? Math.max(...repos.map((r) => r.stars)) : 0;
    return { totalCount: data.total_count ?? 0, maxStars, repos };
  } catch (err) {
    console.error("GitHub search failed:", err);
    return { totalCount: 0, maxStars: 0, repos: [] };
  }
}

async function searchHackerNews(query: string): Promise<{
  totalHits: number;
  stories: HNStory[];
}> {
  try {
    const res = await fetch(
      `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=5`
    );
    if (!res.ok) throw new Error(`HN API ${res.status}`);
    const data = await res.json();
    const stories: HNStory[] = (data.hits ?? []).map(
      (hit: Record<string, unknown>) => ({
        title: hit.title as string,
        url: (hit.url as string) ?? `https://news.ycombinator.com/item?id=${hit.objectID}`,
        points: hit.points as number,
        numComments: hit.num_comments as number,
        createdAt: hit.created_at as string,
      })
    );
    return { totalHits: data.nbHits ?? 0, stories };
  } catch (err) {
    console.error("HN search failed:", err);
    return { totalHits: 0, stories: [] };
  }
}

async function searchNpm(query: string): Promise<{
  totalCount: number;
  packages: NpmPackage[];
}> {
  try {
    const res = await fetch(
      `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=5`
    );
    if (!res.ok) throw new Error(`npm API ${res.status}`);
    const data = await res.json();
    const packages: NpmPackage[] = (data.objects ?? []).map(
      (obj: Record<string, unknown>) => {
        const pkg = obj.package as Record<string, unknown>;
        return {
          name: pkg.name as string,
          description: (pkg.description as string) ?? "",
          version: pkg.version as string,
          url: `https://www.npmjs.com/package/${pkg.name}`,
        };
      }
    );
    return { totalCount: data.total ?? 0, packages };
  } catch (err) {
    console.error("npm search failed:", err);
    return { totalCount: 0, packages: [] };
  }
}

/**
 * Use AI to extract smart, targeted search queries from the idea.
 * Returns { github, hn, npm } query strings optimized per platform.
 * Falls back to simple keyword extraction if AI is unavailable.
 */
async function extractSearchQueries(
  title: string,
  description: string
): Promise<{ github: string; hn: string; npm: string }> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (apiKey) {
    try {
      const prompt = `Given this startup idea:
Title: "${title}"${description ? `\nDescription: "${description}"` : ""}

Extract the best search queries to find competing/similar projects on each platform. Think about what the core product category is, what technical keywords describe it, and what developers would call it.

Return ONLY this JSON (no other text):
{"github":"<2-4 word technical search for repos>","hn":"<2-4 word search for HN discussions>","npm":"<1-3 word package search>"}

Examples:
- "AI-powered task manager for teams" → {"github":"ai task manager","hn":"AI task management","npm":"task manager ai"}
- "A platform that connects freelance designers" → {"github":"freelance designer marketplace","hn":"freelance design platform","npm":"freelance marketplace"}
- "Carbon footprint tracking app" → {"github":"carbon footprint tracker","hn":"carbon footprint tracking","npm":"carbon footprint"}

JSON only:`;

      const res = await fetch(
        "https://router.huggingface.co/novita/v3/openai/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-v3-0324",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 150,
            temperature: 0.2,
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        let content = data.choices?.[0]?.message?.content ?? "";
        content = content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
        content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.github && parsed.hn && parsed.npm) {
            console.log("🧠 AI-extracted queries:", parsed);
            return parsed;
          }
        }
      }
    } catch (err) {
      console.error("AI query extraction failed, using fallback:", err);
    }
  }

  // Fallback: simple keyword extraction
  const keywords = extractKeywords(title, description);
  console.log("📝 Fallback keywords:", keywords);
  return { github: keywords, hn: keywords, npm: keywords };
}

/**
 * Simple keyword extraction: remove stop words, keep meaningful terms.
 */
function extractKeywords(title: string, description: string): string {
  const stopWords = new Set([
    "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "can", "shall", "to", "of", "in", "for",
    "on", "with", "at", "by", "from", "as", "into", "through", "during",
    "before", "after", "above", "below", "between", "out", "off", "over",
    "under", "again", "further", "then", "once", "and", "but", "or", "nor",
    "not", "so", "yet", "both", "each", "few", "more", "most", "other",
    "some", "such", "no", "only", "own", "same", "than", "too", "very",
    "just", "about", "up", "its", "it", "that", "this", "which", "who",
    "what", "where", "when", "how", "all", "any", "my", "your", "their",
    "our", "app", "application", "platform", "tool", "system", "website",
    "web", "helps", "help", "people", "users", "using", "use", "based",
    "built", "like", "make", "makes", "creating", "create",
  ]);

  const text = `${title} ${description}`.toLowerCase();
  const words = text
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  // Deduplicate while preserving order
  const seen = new Set<string>();
  const unique = words.filter((w) => {
    if (seen.has(w)) return false;
    seen.add(w);
    return true;
  });

  return unique.slice(0, 4).join(" ");
}

function calculateScore(evidence: RealityEvidence): number {
  // Logarithmic scaling — spreads scores across orders of magnitude
  // instead of bottoming out instantly.
  //   0 results → 0 saturation
  //   ceiling results → full saturation for that signal
  const logScale = (value: number, ceiling: number) =>
    Math.min(Math.log10(value + 1) / Math.log10(ceiling + 1), 1);

  const ghCount = logScale(evidence.github.totalCount, 10000) * 30;
  const ghStars = logScale(evidence.github.maxStars, 50000) * 20;
  const hn      = logScale(evidence.hackerNews.totalHits, 5000) * 20;
  const npm     = logScale(evidence.npm.totalCount, 500) * 30;
  const rawSaturation = ghCount + ghStars + hn + npm;

  // Invert: high score = open space (good), low score = crowded (bad)
  return Math.round(100 - rawSaturation);
}

function deriveSaturation(score: number): SaturationLevel {
  // score is already inverted: high = good, low = bad
  if (score >= 70) return "low";    // open space
  if (score >= 40) return "medium"; // some competition
  return "high";                     // crowded
}

async function generatePivotSuggestions(
  title: string,
  description: string,
  topProjects: GitHubRepo[]
): Promise<string[]> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) return [];

  try {
    const projectList = topProjects
      .map((p) => `- ${p.name} (${p.stars} stars): ${p.description}`)
      .join("\n");

    const prompt = `Given the startup idea "${title}"${description ? ` (${description})` : ""} and these existing competitors:
${projectList}

Suggest exactly 3 short, actionable pivot ideas that differentiate from the competition. Each should be 1 sentence. Return ONLY a JSON array of 3 strings, no other text.`;

    const res = await fetch(
      "https://router.huggingface.co/novita/v3/openai/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-v3-0324",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 300,
          temperature: 0.7,
        }),
      }
    );

    if (!res.ok) return [];

    const data = await res.json();
    let content = data.choices?.[0]?.message?.content ?? "";
    content = content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) return parsed.slice(0, 3).map(String);
    return [];
  } catch (err) {
    console.error("Pivot suggestions failed (non-critical):", err);
    return [];
  }
}

export async function POST(req: Request) {
  try {
    const { title, description, ideaId } = await req.json();

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    console.log("🛡️ Reality check for:", title);

    // Step 1: AI-powered query extraction (or fallback to keyword extraction)
    const queries = await extractSearchQueries(title.trim(), (description ?? "").trim());

    // Step 2: Parallel fetches with platform-optimized queries
    const [github, hackerNews, npm] = await Promise.all([
      searchGitHub(queries.github),
      searchHackerNews(queries.hn),
      searchNpm(queries.npm),
    ]);

    const evidence: RealityEvidence = { github, hackerNews, npm };
    const score = calculateScore(evidence);
    const saturation = deriveSaturation(score);

    // Top 3 GitHub repos by stars
    const topProjects = [...github.repos]
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 3);

    // Best-effort AI pivot suggestions
    const pivotSuggestions = await generatePivotSuggestions(
      title.trim(),
      description ?? "",
      topProjects
    );

    const realityCheck: RealityCheckReport = {
      id: crypto.randomUUID(),
      ideaId: ideaId ?? "",
      score,
      saturation,
      evidence,
      topProjects,
      pivotSuggestions,
      generatedAt: new Date().toISOString(),
    };

    console.log(`✅ Reality check complete — score: ${score}, saturation: ${saturation}`);

    return NextResponse.json({ success: true, realityCheck });
  } catch (error) {
    console.error("❌ Reality check error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Reality check failed",
      },
      { status: 500 }
    );
  }
}
