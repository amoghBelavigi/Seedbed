# Seedbed - Project Overview

> **Last Updated:** 2026-02-27
> **Status:** Active Development | **Branch:** main

## What is Seedbed?

Seedbed is a full-stack idea management and research platform that helps entrepreneurs capture, develop, and validate startup ideas. It uses a **gardening metaphor** with three workflow stages and integrates AI-powered market research with verified web sources.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS 4, shadcn/ui (Radix UI) |
| Icons | Lucide React |
| Drag & Drop | @hello-pangea/dnd |
| Markdown | react-markdown + rehype-raw |
| PDF Export | jsPDF |
| Notifications | Sonner |
| Database | Supabase (PostgreSQL) |
| AI Models | DeepSeek V3 (research) & R1 (PRD generation) via Hugging Face |
| Web Search | Serper API (Google Search) |
| Theming | next-themes (dark/light) |
| Fonts | DM Sans (body), Space Grotesk (headings), Geist Mono (code) |

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── reality-check/route.ts    # Reality check (GitHub + HN + npm APIs)
│   │   ├── research/route.ts         # AI research endpoint (Serper + DeepSeek V3)
│   │   └── generate-prompt/route.ts  # PRD generation (DeepSeek R1)
│   ├── globals.css                   # Global styles & CSS variables
│   ├── layout.tsx                    # Root layout with providers
│   └── page.tsx                      # Main SPA entry point & screen router
├── components/
│   ├── screens/                      # Page-level views
│   │   ├── dashboard-screen.tsx      # Stats overview + Kanban
│   │   ├── brain-box-screen.tsx      # Draft ideas (nursery)
│   │   ├── launch-pad-screen.tsx     # In-progress ideas
│   │   ├── trophy-case-screen.tsx    # Completed ideas
│   │   └── kanban-screen.tsx         # Kanban board view
│   ├── ui/                           # 14 shadcn/ui base components
│   ├── app-sidebar.tsx               # Navigation sidebar (collapsible)
│   ├── top-bar.tsx                   # Header: search, theme toggle, new idea
│   ├── idea-card.tsx                 # Idea display card
│   ├── idea-dialog.tsx               # Create/edit 3-step wizard (details → market scan → research)
│   ├── delete-dialog.tsx             # Delete confirmation
│   ├── kanban-board.tsx              # Drag-and-drop board
│   ├── kanban-card.tsx               # Kanban column card
│   ├── reality-check.tsx             # Market Scan results (opportunity score + evidence)
│   ├── research-report.tsx           # Research findings display + PDF export + PRD generation
│   ├── research-skeleton.tsx         # Loading state skeleton
│   ├── stats-cards.tsx               # Dashboard statistics
│   ├── markdown-content.tsx          # Markdown renderer
│   ├── theme-provider.tsx            # Theme context
│   └── theme-toggle.tsx              # Dark/light toggle
├── hooks/
│   ├── use-ideas.ts                  # CRUD + Supabase sync + optimistic updates
│   └── use-local-storage.ts          # SSR-safe localStorage wrapper
└── lib/
    ├── types.ts                      # TypeScript interfaces (Idea, ResearchReport, etc.)
    ├── constants.ts                  # Colors, statuses, priority config
    ├── utils.ts                      # Utilities (cn helper)
    ├── serper.ts                     # Serper API client
    └── supabase.ts                   # Supabase client initialization
```

**Config files:** `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `components.json`, `.env.local`

---

## Key Features

### 1. Idea Management (CRUD)
- Create, edit, delete ideas with rich markdown editor (formatting toolbar)
- Priority levels: Low / Medium / High (color-coded)
- Status tracking: Draft → In Progress → Completed
- Real-time search & filtering across title + description
- Sorting by priority, date, or title

### 2. Workflow Stages (Gardening Metaphor)
| Stage | Purpose | Status Filter |
|-------|---------|--------------|
| **Brain Box** | Idea nursery for drafts | `draft` |
| **Launch Pad** | Active development projects | `in-progress` |
| **Trophy Case** | Shipped/completed projects | `completed` |
| **Dashboard** | Overview with stats + Kanban | All statuses |

### 3. Market Scan (`/api/reality-check`)
- Quick market validation using **AI-powered intelligent search**
- DeepSeek V3 extracts **platform-optimized search queries** from your idea (with keyword fallback)
- Queries **3 public APIs** in parallel (no API keys needed):
  - **GitHub Search** — repository count and star data (open-source competition)
  - **Hacker News Algolia** — story mentions and discussion volume (community interest)
  - **npm Registry** — package count in the space (developer tooling)
- Calculates an **opportunity score (0–100)**: higher = less competition = better
  - GitHub repo count (30%), max stars (20%), HN stories (20%), npm packages (30%)
- Score bands: **Wide open** (70–100, green), **Some competition** (40–69, amber), **Crowded** (0–39, red)
- Displays top 3 GitHub repos as closest competitors with descriptions
- **Best-effort AI pivot suggestions** via DeepSeek V3 (works without API key)
- Includes inline guidance: interpretation tips, score breakdown, and expandable "How to read this" section
- Inline results on the Details tab before Research — flow: Market Scan → Research → PRD

### 4. AI-Powered Research (`/api/research`)
- **3 parallel web searches** via Serper (general, competitors, market size)
- **DeepSeek V3** analyzes results and produces:
  - Similar projects (3-5 with URLs & strengths)
  - Feasibility analysis (market size, complexity, time to MVP)
  - Challenges & opportunities (3-5 each)
  - Feature enhancements with priority & effort estimates
  - Differentiation suggestions
  - Verified sources (strict URL validation - no hallucinated links)
- Graceful fallback to LLM-only mode when Serper key is missing

### 5. PRD Generation (`/api/generate-prompt`)
- Generates a comprehensive Product Requirements Document (PRD) from research findings
- Uses **DeepSeek R1** for reasoning-enhanced output
- Includes: product overview, goals, target audience, core/enhanced features, user stories, technical considerations, competitive landscape, differentiation strategy, success metrics

### 6. Kanban Board
- Drag-and-drop across Draft / In Progress / Completed columns
- Search filtering, status-aware column styling

### 7. UI/UX
- Dark/light theme (system-aware with toggle)
- Responsive design (mobile + desktop)
- Toast notifications (Sonner)
- PDF export for research reports
- Smooth animations & transitions

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│  page.tsx (SPA Router)                          │
│  ├── AppSidebar (navigation)                    │
│  ├── TopBar (search, theme, new idea)           │
│  └── Screen Router                              │
│      ├── DashboardScreen (stats + kanban)        │
│      ├── BrainBoxScreen (drafts)                │
│      ├── LaunchPadScreen (in-progress)          │
│      └── TrophyCaseScreen (completed)           │
├─────────────────────────────────────────────────┤
│  State Management                               │
│  ├── useIdeas() hook → Supabase + localStorage  │
│  ├── useState (local component state)           │
│  └── ThemeProvider (context)                    │
├─────────────────────────────────────────────────┤
│  API Routes (Next.js)                           │
│  ├── POST /api/reality-check → GitHub+HN+npm   │
│  ├── POST /api/research → Serper + DeepSeek V3  │
│  └── POST /api/generate-prompt → DeepSeek R1 PRD│
├─────────────────────────────────────────────────┤
│  External Services                              │
│  ├── Supabase (PostgreSQL DB + Auth)            │
│  ├── Hugging Face (DeepSeek V3/R1 inference)    │
│  ├── Serper (Google Search API)                 │
│  ├── GitHub API (repo search, public)           │
│  ├── HN Algolia API (story search, public)      │
│  └── npm Registry API (package search, public)  │
└─────────────────────────────────────────────────┘
```

**Data flow:** Components → useIdeas hook → Supabase (primary) + localStorage (cache/fallback) → optimistic UI updates

---

## Database Schema

```sql
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT CHECK (status IN ('draft', 'in-progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

Research reports are stored client-side in **localStorage**, not in Supabase.

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public (anon) key |
| `HUGGINGFACE_API_KEY` | Hugging Face inference API key |
| `SERPER_API_KEY` | Serper web search API key (optional) |

---

## Running the Project

```bash
npm install       # Install dependencies
npm run dev       # Dev server at http://localhost:3000
npm run build     # Production build
npm start         # Run production build
npm run lint      # ESLint
```

**Prerequisites:** Node.js 20+, Supabase account, Hugging Face API key, Serper API key (optional)

---

## File Count Summary

| Category | Count |
|----------|-------|
| API Routes | 3 |
| Screen Components | 5 |
| UI Components (shadcn) | 14 |
| Custom Components | 10+ |
| Hooks | 2 |
| Lib/Utility Files | 5 |
| **Total Source Files** | **32+** |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-02-27 | Redesign New Idea dialog from tab layout to 3-step wizard (Plant Your Seed → Scan the Market → Deep Research) with slide animation, step indicator, and footer navigation |
| 2026-02-27 | Add Market Scan feature — quick idea validation via GitHub, HN, and npm APIs with opportunity scoring, AI-powered search queries, and inline guidance |
| 2026-02-27 | Replace "Generate Prompt" with "Generate PRD" — now generates a full Product Requirements Document instead of a coding prompt |
| 2026-02-27 | Initial project overview created |

<!-- NOTE: Keep this file updated when making changes to the project. -->
<!-- Add entries to the Changelog table and update relevant sections. -->
