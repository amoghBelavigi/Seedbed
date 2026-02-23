import { NextResponse } from "next/server";

/**
 * POST /api/generate-prompt
 * Generate a helpful prompt based on the idea and research
 */
export async function POST(req: Request) {
  try {
    const { title, research } = await req.json();

    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Build context from research
    let researchContext = "";
    if (research) {
      researchContext = `
RESEARCH FINDINGS:
- Similar Projects: ${research.similarProjects?.map((p: any) => p.name).join(", ") || "N/A"}
- Market Size: ${research.feasibilityAnalysis?.marketSize || "N/A"}
- Technical Complexity: ${research.feasibilityAnalysis?.technicalComplexity || "N/A"}
- Time to MVP: ${research.feasibilityAnalysis?.estimatedTimeToMVP || "N/A"}
- Key Challenges: ${research.feasibilityAnalysis?.challenges?.join(", ") || "N/A"}
- Opportunities: ${research.feasibilityAnalysis?.opportunities?.join(", ") || "N/A"}
- Differentiation Ideas: ${research.differentiationSuggestions?.join(", ") || "N/A"}
- Suggested Features: ${research.featureEnhancements?.map((f: any) => f.feature).join(", ") || "N/A"}
`;
    }

    const systemPrompt = `You are an expert AI prompt engineer. Generate a well-structured prompt that the user can paste into ChatGPT, Claude, or Cursor to build their project.

Output ONLY the prompt text, nothing else. No explanations, no "here's your prompt", just the raw prompt.

The prompt must follow this structure:

## Project Overview
[One paragraph describing the app/product]

## Tech Stack
[List recommended technologies]

## Core Features (MVP)
[Numbered list of 4-6 essential features]

## User Flow
[Brief description of main user journey]

## Key Differentiators
[What makes this unique based on research]

## Constraints
[Important technical or business constraints]

## First Steps
[What to build first]

Start the prompt with: "I want to build [project name]. Help me create..."`;

    const userPrompt = `Generate a structured AI coding prompt for:

IDEA: ${title}
${researchContext}

Create a detailed, copy-paste ready prompt following the exact structure specified. Make it specific and actionable.`;

    console.log("🪄 Generating prompt for:", title);

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
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Generate prompt API error:", errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    let generatedPrompt = data.choices?.[0]?.message?.content;

    if (!generatedPrompt) {
      throw new Error("No response from AI");
    }

    // Clean up DeepSeek's thinking tags and extra content
    generatedPrompt = generatedPrompt
      .replace(/<think>[\s\S]*?<\/think>/gi, "")
      .replace(/^(Here's|Here is|I've created|This is).*?:\s*/i, "")
      .replace(/\*\*Why this prompt works[\s\S]*/gi, "")
      .replace(/---+\s*$/g, "")
      .replace(/^[\s\n]+/, "")
      .trim();

    console.log("✅ Prompt generated successfully");

    return NextResponse.json({
      success: true,
      prompt: generatedPrompt,
    });

  } catch (error) {
    console.error("❌ Generate prompt error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate prompt",
      },
      { status: 500 }
    );
  }
}
