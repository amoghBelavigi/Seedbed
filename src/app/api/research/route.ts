import { NextResponse } from "next/server";
import { searchWeb } from "@/lib/serper";

/**
 * POST /api/research
 * Generates AI-powered research analysis for a startup idea.
 * Grounds results in real web search data via Serper API.
 */
export async function POST(req: Request) {
  try {
    const { title, description } = await req.json();

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Hugging Face API key not configured" },
        { status: 500 }
      );
    }

    console.log("🔍 Researching idea:", title);

    // Phase 1: Parallel web searches via Serper
    const [generalResults, competitorResults, marketResults] =
      await Promise.all([
        searchWeb(title),
        searchWeb(`${title} competitors alternatives`),
        searchWeb(`${title} market size industry`),
      ]);

    // Top 5 per query — V3 handles larger context without timeouts
    const topGeneral = generalResults.organic.slice(0, 5);
    const topCompetitor = competitorResults.organic.slice(0, 5);
    const topMarket = marketResults.organic.slice(0, 5);

    const allResults = [...topGeneral, ...topCompetitor, ...topMarket];
    const hasSearchData = allResults.length > 0;

    // Collect all URLs from search results for validation
    const searchUrls = new Set(allResults.map((r) => r.link));
    const searchDomains = new Set(
      allResults.map((r) => {
        try {
          return new URL(r.link).hostname.replace(/^www\./, "");
        } catch {
          return "";
        }
      })
    );

    // Phase 2: Build prompt with search results including snippets for context
    const formatResults = (results: typeof allResults) =>
      results.map((r) => `- ${r.title} | ${r.link}\n  ${r.snippet}`).join("\n");

    const searchContext = hasSearchData
      ? `=== SEARCH RESULTS ===
General:
${formatResults(topGeneral)}

Competitors & alternatives:
${formatResults(topCompetitor)}

Market & industry:
${formatResults(topMarket)}
===`
      : "";

    const prompt = `You are a startup analyst. Analyze: "${title}"${description ? ` — ${description}` : ""}
${hasSearchData ? `\n${searchContext}\n\nUse ONLY URLs from the search results above. NEVER invent URLs. Reference real data points from snippets when available.` : "\nNo search data available. Leave sources as empty array []."}

Return ONLY this JSON (no other text):
{"similarProjects":[{"name":"str","url":"str","description":"str","strengths":["str"]}],"feasibilityAnalysis":{"marketSize":"str","technicalComplexity":"low|medium|high","estimatedTimeToMVP":"str","challenges":["str"],"opportunities":["str"]},"differentiationSuggestions":["str"],"featureEnhancements":[{"feature":"str","description":"str","priority":"low|medium|high","estimatedEffort":"str"}],"sources":[{"title":"str","url":"str","snippet":"str"}]}

3-5 similar projects, 3-5 differentiation suggestions, 3-5 feature enhancements, up to 5 sources. JSON only:`;

    const response = await fetch(
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
          max_tokens: 2000,
          temperature: 0.3,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error:", errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    // Clean thinking tags and extract JSON from response
    aiResponse = aiResponse.trim();
    aiResponse = aiResponse.replace(/<think>[\s\S]*?<\/think>/gi, "");
    aiResponse = aiResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "");

    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse AI response");
    }

    const researchData = JSON.parse(jsonMatch[0]);

    // Phase 3: Validate URLs against search results
    if (hasSearchData) {
      // Strict filter for sources — only keep URLs that were in search results
      if (Array.isArray(researchData.sources)) {
        researchData.sources = researchData.sources.filter(
          (s: { url?: string }) => s.url && searchUrls.has(s.url)
        );
      }

      // Soft match for similarProjects — keep if domain matches
      if (Array.isArray(researchData.similarProjects)) {
        researchData.similarProjects = researchData.similarProjects.map(
          (p: { url?: string; name?: string }) => {
            if (!p.url) return p;
            try {
              const domain = new URL(p.url).hostname.replace(/^www\./, "");
              if (searchDomains.has(domain) || searchUrls.has(p.url)) {
                return p;
              }
            } catch {
              // invalid URL
            }
            return { ...p, url: "" };
          }
        );
      }
    } else {
      researchData.sources = [];
    }

    const researchReport = {
      id: crypto.randomUUID(),
      ideaId: "",
      ...researchData,
      generatedAt: new Date().toISOString(),
    };

    console.log(
      "✅ Research completed successfully",
      hasSearchData ? "(with web search)" : "(LLM-only, no search data)"
    );

    return NextResponse.json({
      success: true,
      research: researchReport,
    });
  } catch (error) {
    console.error("❌ Research error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Research failed",
      },
      { status: 500 }
    );
  }
}
