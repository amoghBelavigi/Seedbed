import { NextResponse } from "next/server";

/**
 * POST /api/generate-prompt
 * Generate a PRD (Product Requirements Document) based on the idea and research
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

    const systemPrompt = `You are an expert product manager. Generate a comprehensive Product Requirements Document (PRD) based on the idea and research findings provided.

Output ONLY the PRD content in markdown format, nothing else. No explanations, no "here's your PRD", just the raw document.

The PRD must follow this structure:

## Product Overview
[What the product is and the problem it solves — 2-3 sentences]

## Goals & Objectives
[What success looks like — 3-5 bullet points]

## Target Audience
[Who it's for — primary and secondary audiences]

## Core Features (MVP)
[Basic features needed to launch — numbered list of 4-6 essential features with brief descriptions]

## Enhanced Features
[Suggested features from research, each with priority (High/Medium/Low) and estimated effort]

## User Stories
[Key user flows written as "As a [user], I want to [action], so that [benefit]" — 4-6 stories]

## Technical Considerations
[Complexity, constraints, recommended tech stack, time to MVP estimate]

## Competitive Landscape
[Summary of similar projects and their strengths/weaknesses]

## Differentiation Strategy
[How this product stands out from competitors — 3-5 concrete strategies]

## Success Metrics
[KPIs to track — 4-6 measurable metrics]`;

    const userPrompt = `Generate a Product Requirements Document (PRD) for:

IDEA: ${title}
${researchContext}

Create a detailed, comprehensive PRD following the exact structure specified. Make it specific, actionable, and grounded in the research findings.`;

    console.log("📋 Generating PRD for:", title);

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
          max_tokens: 2000,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Generate PRD API error:", errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    let generatedPrd = data.choices?.[0]?.message?.content;

    if (!generatedPrd) {
      throw new Error("No response from AI");
    }

    // Clean up DeepSeek's thinking tags and extra content
    generatedPrd = generatedPrd
      .replace(/<think>[\s\S]*?<\/think>/gi, "")
      .replace(/^(Here's|Here is|I've created|This is).*?:\s*/i, "")
      .replace(/---+\s*$/g, "")
      .replace(/^[\s\n]+/, "")
      .trim();

    console.log("✅ PRD generated successfully");

    return NextResponse.json({
      success: true,
      prd: generatedPrd,
    });

  } catch (error) {
    console.error("❌ Generate PRD error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate PRD",
      },
      { status: 500 }
    );
  }
}
