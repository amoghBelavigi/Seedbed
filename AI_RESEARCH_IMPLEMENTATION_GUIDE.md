# 🔍 AI Research Feature - Complete Implementation Guide

## 📚 Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step Implementation](#step-by-step-implementation)
4. [Testing Your Feature](#testing)
5. [Troubleshooting](#troubleshooting)

---

## Overview

This guide will help you add an AI-powered research feature to your Seedbed app using **Google Gemini AI** (via Google AI Studio). When a user creates an idea, they can click a "Research" button to:
- Find similar projects on the web
- Analyze feasibility (is this idea doable?)
- Get suggestions on how to stand out
- Receive feature enhancement recommendations

**Why Google Gemini?**
- 🆓 **100% FREE to start** - No credit card required
- ⚡ **Super fast** - Gemini Flash responds in seconds
- 🎯 **Accurate** - Excellent at structured analysis and JSON output
- 💪 **Powerful** - Competitive with GPT-4 at a fraction of the cost

**What you'll build:**
- A new API endpoint that talks to Google Gemini AI
- Updated database schema to store research reports
- New UI components to display research results
- Integration with the existing idea creation flow

---

## Prerequisites

### What You Need to Know (Basics)
- ✅ JavaScript/TypeScript basics (variables, functions, async/await)
- ✅ React basics (components, props, useState, useEffect)
- ✅ How to run terminal commands
- ✅ Basic understanding of APIs (making requests, getting responses)

### What You'll Learn
- 🎓 How to create API routes in Next.js
- 🎓 How to integrate AI APIs (Google Gemini)
- 🎓 How to update a database schema
- 🎓 How to work with TypeScript types
- 🎓 How to display complex data in React

### Tools You Need
- Node.js installed (you already have this if the app runs)
- A code editor (VS Code, Cursor, etc.)
- Terminal/Command Prompt access
- A Supabase account (you already have this)
- A Google AI Studio API key (we'll get this - it's FREE!)

---

## Step-by-Step Implementation

### Phase 1: Setup & Dependencies

#### Step 1: Install Required Packages

**What this does:** Adds the necessary libraries to your project so you can communicate with AI services.

Open your terminal in the project folder and run:

```bash
npm install @google/generative-ai
```

**Explanation:**
- `@google/generative-ai`: Official Google library for using Gemini AI models (from Google AI Studio)

**How to verify it worked:**
Check your `package.json` file - you should see `@google/generative-ai` listed under `dependencies`.

---

#### Step 2: Get Your API Keys

**What this does:** API keys are like passwords that let your app use AI services. Without them, the AI services won't respond.

##### Google AI Studio (Gemini) - Free and Powerful!

1. Go to https://aistudio.google.com/
2. Sign in with your Google account
3. Click "Get API Key" button (top right or in the menu)
4. Click "Create API Key"
5. Choose "Create API key in new project" (or select an existing project)
6. Copy the key (it looks like: `AIza...`)
7. **Important:** Save it somewhere safe!

**Cost:** 
- **FREE tier:** 15 requests per minute (plenty for testing!)
- **Gemini 1.5 Flash:** Very fast and free for most use cases
- **Gemini 1.5 Pro:** More powerful, also has generous free tier

**Why Google AI Studio?**
- ✅ Free to start (no credit card required)
- ✅ Very fast responses
- ✅ Large context window (handles long prompts)
- ✅ Good at structured output (JSON)

**💡 Helpful Tip:**
After getting your API key, you can test prompts directly in the Google AI Studio playground (https://aistudio.google.com/app/prompts/new_chat) before adding them to your code. This helps you refine your prompts!

---

#### Step 3: Add Environment Variables

**What this does:** Stores your API key securely so it's not visible in your code (important for security!).

1. In your project root, find or create a file called `.env.local`
2. Add this line (replace with your actual key):

```bash
GOOGLE_API_KEY=AIza_your_actual_key_here
```

**Explanation:**
- `.env.local` files store secret values
- Never commit this file to GitHub (it should be in `.gitignore`)
- Next.js automatically loads these variables
- The key should start with `AIza` for Google AI Studio

**Security Note:**
- ⚠️ Never hardcode your API key directly in your code
- ⚠️ Never commit `.env.local` to version control
- ✅ Always use environment variables for sensitive data
- ✅ The `.env.local` file should already be in your `.gitignore`

**How to verify it worked:**
Restart your development server (`npm run dev`). If there's no error, it worked!

---

### Phase 2: Update Database Schema

#### Step 4: Create Research Reports Table in Supabase

**What this does:** Creates a new table in your database to store research results so users can view them later.

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor" in the left sidebar
4. Click "New Query"
5. Paste this SQL code:

```sql
-- Create a table to store AI research reports
create table research_reports (
  id uuid default gen_random_uuid() primary key,
  idea_id text not null,
  similar_projects jsonb default '[]'::jsonb,
  feasibility_analysis jsonb default '{}'::jsonb,
  differentiation_suggestions text[] default array[]::text[],
  feature_enhancements jsonb default '[]'::jsonb,
  sources jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add an index to quickly find reports by idea_id
create index research_reports_idea_id_idx on research_reports(idea_id);

-- Enable Row Level Security (RLS) for security
alter table research_reports enable row level security;

-- Allow anyone to read research reports (you can make this more restrictive later)
create policy "Anyone can view research reports"
  on research_reports for select
  using (true);

-- Allow anyone to insert research reports (you can add authentication later)
create policy "Anyone can create research reports"
  on research_reports for insert
  with check (true);
```

6. Click "Run" button

**Explanation:**
- `uuid`: Unique identifier for each research report
- `jsonb`: JSON format that stores complex data (objects, arrays)
- `text[]`: Array of text strings
- `timestamp`: Records when the report was created
- Indexes make database searches faster
- RLS (Row Level Security) controls who can access the data

**How to verify it worked:**
- Go to "Table Editor" in Supabase
- You should see a new table called `research_reports`

---

### Phase 3: Update TypeScript Types

#### Step 5: Define TypeScript Types

**What this does:** TypeScript types help prevent bugs by specifying what shape your data should have.

Open `src/lib/types.ts` and add these new types at the end:

```typescript
// Represents a similar project found during research
export interface SimilarProject {
  name: string;
  url: string;
  description: string;
  strengths: string[];
}

// Represents the feasibility analysis of an idea
export interface FeasibilityAnalysis {
  marketSize: string;
  technicalComplexity: "low" | "medium" | "high";
  estimatedTimeToMVP: string;
  challenges: string[];
  opportunities: string[];
}

// Represents a suggested feature enhancement
export interface FeatureEnhancement {
  feature: string;
  description: string;
  priority: Priority; // Reuses the Priority type from your existing code
  estimatedEffort: string;
}

// Represents a source/citation
export interface ResearchSource {
  title: string;
  url: string;
  snippet: string;
}

// Main research report structure
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

// Update the existing Idea interface to include research
export interface Idea {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  githubRepo?: string;
  createdAt: string;
  updatedAt: string;
  researchReport?: ResearchReport; // ADD THIS LINE
}
```

**Explanation:**
- Interfaces define the structure of objects
- `?` means optional (might not exist)
- `string[]` means array of strings
- Types help your editor give you autocomplete suggestions

**How to verify it worked:**
No errors should appear in VS Code/Cursor after saving.

---

### Phase 4: Create the API Route

#### Step 6: Create API Route File

**What this does:** Creates an endpoint that your frontend can call to trigger AI research.

1. Create these folders (if they don't exist): `src/app/api/research/`
2. Create a new file: `src/app/api/research/route.ts`

**Explanation:**
- In Next.js App Router, folders in `app/api/` become API endpoints
- `route.ts` defines what happens when someone calls this endpoint
- This will be accessible at: `http://localhost:3000/api/research`

---

#### Step 7: Write the API Route Code

**What this does:** This is the "brain" of your research feature. It receives an idea, asks AI to research it, and returns the results.

Paste this code into `src/app/api/research/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google AI client
// This creates a connection to Google's Gemini API using your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// This function runs when someone makes a POST request to /api/research
export async function POST(req: Request) {
  try {
    // Step 1: Get the idea data from the request
    const { title, description } = await req.json();

    // Validate that we have the required data
    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: "Google API key not configured" },
        { status: 500 }
      );
    }

    // Step 2: Create a detailed prompt for the AI
    // This tells the AI exactly what to research and how to format the response
    const prompt = `You are a startup research analyst. Analyze this idea and provide a comprehensive research report.

IDEA TITLE: ${title}
IDEA DESCRIPTION: ${description || "No description provided"}

Please provide a detailed JSON response with the following structure:

{
  "similarProjects": [
    {
      "name": "Project name",
      "url": "https://example.com",
      "description": "What this project does",
      "strengths": ["strength 1", "strength 2"]
    }
  ],
  "feasibilityAnalysis": {
    "marketSize": "Description of potential market size",
    "technicalComplexity": "low|medium|high",
    "estimatedTimeToMVP": "e.g., 3-6 months",
    "challenges": ["challenge 1", "challenge 2"],
    "opportunities": ["opportunity 1", "opportunity 2"]
  },
  "differentiationSuggestions": [
    "suggestion 1",
    "suggestion 2"
  ],
  "featureEnhancements": [
    {
      "feature": "Feature name",
      "description": "What this feature does",
      "priority": "low|medium|high",
      "estimatedEffort": "e.g., 1 week"
    }
  ],
  "sources": [
    {
      "title": "Source title",
      "url": "https://source.com",
      "snippet": "Key information from this source"
    }
  ]
}

Find 3-5 similar projects, provide realistic analysis, and suggest 5-8 feature enhancements.
Make sure all URLs are real and relevant.
Base your analysis on real market data when possible.
IMPORTANT: Return ONLY valid JSON, no markdown formatting or additional text.`;

    // Step 3: Call Google Gemini API
    console.log("🔍 Researching idea:", title);
    
    // Get the Gemini model
    // Using gemini-1.5-flash for fast, cost-effective responses
    // You can also use "gemini-1.5-pro" for more powerful analysis
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7, // Controls creativity (0=focused, 1=creative)
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "application/json", // Forces JSON response
      },
    });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    // Step 4: Parse the AI's response
    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    // Clean the response (sometimes AI adds markdown formatting)
    let cleanResponse = aiResponse.trim();
    if (cleanResponse.startsWith("```json")) {
      cleanResponse = cleanResponse.replace(/```json\n?/g, "").replace(/```\n?$/g, "");
    } else if (cleanResponse.startsWith("```")) {
      cleanResponse = cleanResponse.replace(/```\n?/g, "");
    }

    const researchData = JSON.parse(cleanResponse);

    // Step 5: Format the response with metadata
    const researchReport = {
      id: crypto.randomUUID(), // Generate a unique ID
      ideaId: "", // Will be set when saving to database
      ...researchData,
      generatedAt: new Date().toISOString(),
    };

    // Step 6: Return the research report
    console.log("✅ Research completed successfully");
    
    return NextResponse.json({
      success: true,
      research: researchReport,
    });

  } catch (error) {
    // Handle errors gracefully
    console.error("❌ Research error:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Research failed"
      },
      { status: 500 }
    );
  }
}
```

**Explanation of Key Concepts:**

- **`async/await`**: Waits for AI response before continuing
- **`try/catch`**: Handles errors so the app doesn't crash
- **`NextResponse.json()`**: Sends data back to the frontend
- **`temperature`**: 0.7 balances between creativity and accuracy
- **`responseMimeType: "application/json"`**: Forces AI to respond in JSON format
- **`gemini-1.5-flash`**: Fast and efficient model (free tier available)
  - Alternative: Use `"gemini-1.5-pro"` for more detailed analysis
- **Text cleaning**: Removes markdown formatting if AI adds it

**Model Options:**
- **gemini-1.5-flash**: Fast, lightweight, great for most use cases (recommended)
- **gemini-1.5-pro**: More powerful, better for complex analysis (slower but more detailed)

**How to verify it worked:**
Save the file. If there are no red underlines in your editor, you're good!

---

### Phase 5: Create UI Components

#### Step 8: Create Research Report Component

**What this does:** Creates a beautiful component to display the research results to users.

1. Create a new file: `src/components/research-report.tsx`
2. Paste this code:

```typescript
"use client";

import { ResearchReport as ResearchReportType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink, TrendingUp, AlertCircle, Lightbulb, BookOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ResearchReportProps {
  report: ResearchReportType;
}

export function ResearchReport({ report }: ResearchReportProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Research Report</h2>
        <Badge variant="outline" className="text-xs">
          Generated {new Date(report.generatedAt).toLocaleDateString()}
        </Badge>
      </div>

      <Separator />

      {/* Similar Projects Section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Similar Projects</h3>
        </div>
        <div className="grid gap-3">
          {report.similarProjects.map((project, idx) => (
            <Card key={idx} className="p-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold">{project.name}</h4>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <p className="text-sm text-muted-foreground">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.strengths.map((strength, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Feasibility Analysis */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Feasibility Analysis</h3>
        </div>
        <Card className="p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Market Size</p>
              <p className="mt-1">{report.feasibilityAnalysis.marketSize}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Technical Complexity</p>
              <Badge
                variant={
                  report.feasibilityAnalysis.technicalComplexity === "low"
                    ? "default"
                    : report.feasibilityAnalysis.technicalComplexity === "medium"
                    ? "secondary"
                    : "destructive"
                }
                className="mt-1"
              >
                {report.feasibilityAnalysis.technicalComplexity.toUpperCase()}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Time to MVP</p>
              <p className="mt-1">{report.feasibilityAnalysis.estimatedTimeToMVP}</p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-3">
            <div>
              <p className="font-medium">Challenges:</p>
              <ul className="mt-2 space-y-1">
                {report.feasibilityAnalysis.challenges.map((challenge, i) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    • {challenge}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium">Opportunities:</p>
              <ul className="mt-2 space-y-1">
                {report.feasibilityAnalysis.opportunities.map((opp, i) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    • {opp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </section>

      <Separator />

      {/* Differentiation Suggestions */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">How to Stand Out</h3>
        </div>
        <Card className="p-4">
          <ul className="space-y-2">
            {report.differentiationSuggestions.map((suggestion, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary font-bold">{i + 1}.</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <Separator />

      {/* Feature Enhancements */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Suggested Features</h3>
        </div>
        <div className="grid gap-3">
          {report.featureEnhancements.map((feature, idx) => (
            <Card key={idx} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold">{feature.feature}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Estimated effort: {feature.estimatedEffort}
                  </p>
                </div>
                <Badge
                  variant={
                    feature.priority === "high"
                      ? "destructive"
                      : feature.priority === "medium"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {feature.priority}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Sources */}
      {report.sources && report.sources.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Sources</h3>
          <div className="space-y-2">
            {report.sources.map((source, idx) => (
              <Card key={idx} className="p-3">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 hover:underline"
                >
                  <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{source.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{source.snippet}</p>
                  </div>
                </a>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
```

**Explanation:**
- **Props**: Component receives `report` data
- **Conditional rendering**: Only shows sections if data exists
- **Badges**: Visual indicators for priority/complexity
- **Cards**: Containers that group related information
- **External links**: Open sources in new tabs

---

#### Step 9: Add Research Button to Idea Dialog

**What this does:** Adds a "Research This Idea" button to your existing idea creation dialog.

Open `src/components/idea-dialog.tsx` and make these changes:

**1. Add imports at the top:**

```typescript
// Add these to your existing imports
import { useState } from "react"; // Already there, just checking
import { ResearchReport as ResearchReportType } from "@/lib/types";
import { ResearchReport } from "@/components/research-report";
import { Sparkles, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
```

**2. Add state variables after the existing useState declarations:**

```typescript
// Find where you have: const [showPreview, setShowPreview] = useState(false);
// Add these lines after it:

const [isResearching, setIsResearching] = useState(false);
const [researchReport, setResearchReport] = useState<ResearchReportType | null>(null);
const [showResearchTab, setShowResearchTab] = useState(false);
```

**3. Add the research function before the `handleSubmit` function:**

```typescript
// Add this function before handleSubmit
const handleResearch = async () => {
  if (!title.trim()) {
    toast.error("Please enter a title first");
    return;
  }

  setIsResearching(true);
  
  try {
    console.log("🔍 Starting research...");
    
    const response = await fetch("/api/research", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Research failed");
    }

    console.log("✅ Research complete!");
    setResearchReport(data.research);
    setShowResearchTab(true);
    toast.success("Research completed!", {
      description: "Check out the Research tab to see the results.",
    });

  } catch (error) {
    console.error("Research error:", error);
    toast.error("Research failed", {
      description: error instanceof Error ? error.message : "Please try again",
    });
  } finally {
    setIsResearching(false);
  }
};
```

**4. Wrap the dialog content in tabs:**

Find the `<DialogContent>` section and replace everything inside with:

```typescript
<DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
  <DialogHeader>
    <DialogTitle className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold">
      {isEditing ? "Edit Idea" : "New Idea"}
    </DialogTitle>
    <DialogDescription>
      {isEditing
        ? "Update your idea details below."
        : "Capture your idea before it escapes!"}
    </DialogDescription>
  </DialogHeader>

  <Tabs defaultValue="details" value={showResearchTab ? "research" : "details"} onValueChange={(v) => setShowResearchTab(v === "research")}>
    <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="details">Details</TabsTrigger>
      <TabsTrigger value="research" disabled={!researchReport}>
        Research {researchReport && "✓"}
      </TabsTrigger>
    </TabsList>

    <TabsContent value="details" className="space-y-5">
      {/* All your existing form fields go here - keep everything between "grid gap-5 py-4" */}
      <div className="grid gap-5 py-4">
        {/* Keep all existing fields: Title, Description, Priority, Status, GitHub */}
        {/* ... your existing code ... */}
      </div>

      {/* Research Button */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleResearch}
          disabled={isResearching || !title.trim()}
          className="gap-2"
        >
          {isResearching ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Researching...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Research This Idea
            </>
          )}
        </Button>
      </div>
    </TabsContent>

    <TabsContent value="research" className="py-4">
      {researchReport ? (
        <ResearchReport report={researchReport} />
      ) : (
        <p className="text-center text-muted-foreground">No research data available</p>
      )}
    </TabsContent>
  </Tabs>

  <DialogFooter>
    <Button
      variant="outline"
      className="cursor-pointer rounded-lg transition-colors duration-200"
      onClick={() => onOpenChange(false)}
    >
      Cancel
    </Button>
    <Button
      className="cursor-pointer rounded-lg transition-colors duration-200"
      onClick={handleSubmit}
      disabled={!title.trim()}
    >
      {isEditing ? "Save Changes" : "Create Idea"}
    </Button>
  </DialogFooter>
</DialogContent>
```

**Explanation:**
- **Tabs**: Lets users switch between "Details" and "Research" views
- **Loading state**: Shows spinner while researching
- **Disabled states**: Prevents multiple clicks or research without a title
- **Toast notifications**: Shows success/error messages

---

### Phase 6: Testing

#### Step 10: Test the Feature

**What this does:** Verifies everything works correctly.

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Open your app:** Go to `http://localhost:3000`

3. **Create a new idea:**
   - Click the "New Idea" button
   - Enter a title like: "AI-powered fitness app"
   - Enter a description (optional but helpful)
   - Click "Research This Idea" button

4. **Watch the magic happen:**
   - You should see "Researching..." with a spinner
   - Wait 10-30 seconds (AI takes time!)
   - The "Research" tab should activate
   - Click it to see the results!

**Expected Results:**
- ✅ Similar projects are displayed with links
- ✅ Feasibility analysis shows market size, complexity, etc.
- ✅ Differentiation suggestions are listed
- ✅ Feature enhancements are shown with priorities
- ✅ Sources (if available) are listed at the bottom

---

### Phase 7: Save Research to Database (Optional)

#### Step 11: Add Database Storage

**What this does:** Saves research reports so users can view them later without re-researching.

Create a new file: `src/lib/supabase-helpers.ts`

```typescript
import { supabase } from "./supabase";
import { ResearchReport } from "./types";

// Save research report to database
export async function saveResearchReport(report: ResearchReport) {
  const { data, error } = await supabase
    .from("research_reports")
    .insert({
      idea_id: report.ideaId,
      similar_projects: report.similarProjects,
      feasibility_analysis: report.feasibilityAnalysis,
      differentiation_suggestions: report.differentiationSuggestions,
      feature_enhancements: report.featureEnhancements,
      sources: report.sources,
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving research:", error);
    throw error;
  }

  return data;
}

// Get research report for an idea
export async function getResearchReport(ideaId: string) {
  const { data, error } = await supabase
    .from("research_reports")
    .select("*")
    .eq("idea_id", ideaId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No results found
      return null;
    }
    console.error("Error fetching research:", error);
    throw error;
  }

  return data;
}
```

**Update your API route to save the research:**

In `src/app/api/research/route.ts`, add this at the end (before returning):

```typescript
// Optional: Save to database
// Uncomment this section once you implement saveResearchReport
/*
import { saveResearchReport } from "@/lib/supabase-helpers";

try {
  await saveResearchReport(researchReport);
  console.log("💾 Research saved to database");
} catch (dbError) {
  console.error("Database save failed:", dbError);
  // Don't fail the whole request if DB save fails
}
*/
```

---

## Testing Your Feature

### Quick Test Checklist

- [ ] Server starts without errors (`npm run dev`)
- [ ] Create new idea dialog opens
- [ ] Research button appears
- [ ] Button is disabled without a title
- [ ] Research starts when clicked (shows spinner)
- [ ] Research completes successfully
- [ ] Research tab appears and is clickable
- [ ] Research results display correctly
- [ ] All links are clickable
- [ ] Similar projects are shown
- [ ] Feasibility analysis is displayed
- [ ] Feature suggestions appear

### 💡 Google AI Free Tier Reminder

With the free tier, you get:
- **15 requests per minute** - More than enough for testing!
- **1 million tokens per day** - That's ~100+ research queries per day
- No credit card required

So feel free to test as much as you want! 🎉

### Test Ideas to Try

1. **Simple idea:** "Todo list app"
2. **Complex idea:** "AI-powered personalized learning platform"
3. **Specific idea:** "Fitness app for rock climbers"
4. **Vague idea:** "Social network" (tests how AI handles ambiguity)

---

## Troubleshooting

### Common Issues and Solutions

#### ❌ Error: "API key not found" or "Google API key not configured"

**Cause:** Environment variable not loaded

**Fix:**
1. Check `.env.local` file exists in your project root
2. Verify the key name is exactly `GOOGLE_API_KEY` (all caps)
3. Make sure your key starts with `AIza`
4. Restart your dev server (`npm run dev`)
5. Make sure there are no spaces around the `=` sign

---

#### ❌ Error: "Module not found: @google/generative-ai"

**Cause:** Package not installed

**Fix:**
```bash
npm install @google/generative-ai
```

---

#### ❌ Research takes forever / times out

**Cause:** API is slow or rate limited

**Fix:**
1. Check your Google AI Studio dashboard for rate limits (free tier: 15 requests/minute)
2. Try a different idea (shorter title/description)
3. You're already using the fast model (`gemini-1.5-flash`)
4. If you're hitting rate limits, wait 60 seconds and try again
5. Check your internet connection

**Note:** Gemini Flash is usually very fast (5-10 seconds). If it's taking longer, it might be:
- First request (API warm-up)
- Network issues
- Rate limit hit (wait and try again)

---

#### ❌ Research button doesn't appear

**Cause:** Code wasn't added correctly to idea-dialog.tsx

**Fix:**
1. Double-check all imports are added
2. Verify the button is inside the TabsContent
3. Check browser console for React errors

---

#### ❌ "Cannot read property 'similarProjects' of undefined" or "Unexpected token in JSON"

**Cause:** AI returned data in wrong format or with markdown formatting

**Fix:**
The code already includes cleaning for markdown (the part with `startsWith("```json")`), but if you still have issues, add better validation:

```typescript
// After JSON.parse(cleanResponse), add validation:
const researchData = JSON.parse(cleanResponse);

// Add default values if fields are missing
researchData.similarProjects = researchData.similarProjects || [];
researchData.differentiationSuggestions = researchData.differentiationSuggestions || [];
researchData.featureEnhancements = researchData.featureEnhancements || [];
researchData.sources = researchData.sources || [];
researchData.feasibilityAnalysis = researchData.feasibilityAnalysis || {
  marketSize: "Unknown",
  technicalComplexity: "medium",
  estimatedTimeToMVP: "Unknown",
  challenges: [],
  opportunities: []
};
```

**Alternative:** Try regenerating if the response looks malformed - Gemini usually gets it right!

---

#### ❌ TypeScript errors about missing types

**Cause:** Types file not updated or imported incorrectly

**Fix:**
1. Make sure you added all types to `src/lib/types.ts`
2. Check the imports at the top of your files
3. Restart your TypeScript server (VS Code: Cmd+Shift+P → "Restart TS Server")

---

## Next Steps & Enhancements

Once you have the basic feature working, you can add:

### 🎯 Easy Enhancements

1. **Loading progress:** Show "Searching web...", "Analyzing results...", etc.
2. **Export research:** Add a "Download as PDF" button
3. **Save automatically:** Auto-save research when creating an idea
4. **Re-research button:** Update research for existing ideas

### 🚀 Advanced Enhancements

1. **Streaming responses:** Show results as they're generated (like ChatGPT)
2. **Web search integration:** Use Brave/Tavily API for real-time web data
3. **Comparison mode:** Compare multiple ideas side-by-side
4. **AI chat:** Let users ask follow-up questions
5. **Custom prompts:** Let users customize what to research

### 🎨 UI Improvements

1. **Better animations:** Fade in research results smoothly
2. **Skeleton loaders:** Show placeholder content while loading
3. **Mobile optimization:** Make research view mobile-friendly
4. **Dark mode polish:** Ensure colors work well in dark mode

---

## Understanding the Code Flow

Here's what happens when a user clicks "Research This Idea":

```
1. User clicks button
   ↓
2. handleResearch() function runs
   ↓
3. Makes POST request to /api/research
   ↓
4. API route receives request
   ↓
5. Creates prompt with idea details
   ↓
6. Sends prompt to Google Gemini API
   ↓
7. Gemini analyzes and generates research
   ↓
8. API route receives response
   ↓
9. Parses JSON and formats data
   ↓
10. Returns research to frontend
   ↓
11. handleResearch() receives data
   ↓
12. Sets researchReport state
   ↓
13. Switches to Research tab
   ↓
14. ResearchReport component displays results
```

---

## Key Concepts Explained

### What is an API?
An API (Application Programming Interface) is like a waiter at a restaurant:
- You (frontend) tell the waiter (API) what you want
- The waiter goes to the kitchen (AI service)
- The kitchen makes your food (generates research)
- The waiter brings it back to you (API returns data)

### What is async/await?
```typescript
// Without async/await (confusing!)
fetch(url).then(response => {
  return response.json();
}).then(data => {
  console.log(data);
});

// With async/await (much clearer!)
const response = await fetch(url);
const data = await response.json();
console.log(data);
```

It's like saying "wait for this to finish before continuing."

### What is TypeScript?
TypeScript adds "types" to JavaScript:

```javascript
// JavaScript (no safety)
const name = "John";
name.toUppercase(); // Typo! Crashes at runtime

// TypeScript (catches errors)
const name: string = "John";
name.toUppercase(); // Editor shows error immediately!
      ↑ suggests: toUpperCase()
```

### What is JSON?
JSON is a way to structure data that both humans and computers can read:

```json
{
  "name": "Todo App",
  "priority": "high",
  "features": ["login", "tasks", "reminders"]
}
```

---

## Resources for Learning More

### Documentation
- **Next.js:** https://nextjs.org/docs
- **Google AI Studio:** https://ai.google.dev/docs
- **Gemini API:** https://ai.google.dev/gemini-api/docs
- **React:** https://react.dev
- **TypeScript:** https://www.typescriptlang.org/docs
- **Supabase:** https://supabase.com/docs

### Tutorials
- **Next.js App Router:** https://nextjs.org/learn
- **TypeScript Basics:** https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
- **API Routes:** https://nextjs.org/docs/app/building-your-application/routing/route-handlers

---

## Questions? Debugging Help

If you get stuck:

1. **Check the console:** Open browser DevTools (F12) → Console tab
2. **Check terminal:** Look for errors where you ran `npm run dev`
3. **Read error messages:** They usually tell you exactly what's wrong
4. **Google it:** Copy the error message and search
5. **Check API usage:** Go to Google AI Studio dashboard (https://aistudio.google.com/) to see if calls are working

---

## Summary

You've built:
- ✅ An API route that calls Google Gemini AI
- ✅ TypeScript types for structured data
- ✅ A beautiful UI component to display research
- ✅ Integration with your existing idea creation flow
- ✅ Database schema to store results (optional)

**Congratulations!** 🎉 You now have an AI-powered research feature in your app using Google's powerful (and FREE!) Gemini model!

---

*Created for Seedbed - Your Idea Management Platform*
*Last updated: [Current Date]*
