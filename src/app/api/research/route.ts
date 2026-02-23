import { NextResponse } from "next/server";

/**
 * POST /api/research
 * Generates AI-powered research analysis for a startup idea
 * Uses Hugging Face's router API with DeepSeek model
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

    const prompt = `You are a startup analyst. Analyze this idea: "${title}" (${description || "no description"}).

Return ONLY this JSON (no other text):
{"similarProjects":[{"name":"Project1","url":"https://example1.com","description":"desc1","strengths":["s1","s2"]},{"name":"Project2","url":"https://example2.com","description":"desc2","strengths":["s1","s2"]},{"name":"Project3","url":"https://example3.com","description":"desc3","strengths":["s1","s2"]}],"feasibilityAnalysis":{"marketSize":"size","technicalComplexity":"medium","estimatedTimeToMVP":"3-6 months","challenges":["c1","c2"],"opportunities":["o1","o2"]},"differentiationSuggestions":["d1","d2","d3"],"featureEnhancements":[{"feature":"f1","description":"fd1","priority":"high","estimatedEffort":"2 weeks"},{"feature":"f2","description":"fd2","priority":"medium","estimatedEffort":"1 week"}],"sources":[{"title":"s1","url":"https://source1.com","snippet":"snippet1"}]}

Replace the placeholder values with real analysis for "${title}". JSON only:`;

    const response = await fetch(
      "https://router.huggingface.co/novita/v3/openai/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 2000,
          temperature: 0.7,
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

    const researchReport = {
      id: crypto.randomUUID(),
      ideaId: "",
      ...researchData,
      generatedAt: new Date().toISOString(),
    };

    console.log("✅ Research completed successfully");

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
