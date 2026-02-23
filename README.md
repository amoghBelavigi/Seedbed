# Seedbed

**Seedbed** is a modern idea management platform that helps you organize, research, and develop your project ideas. It features AI-powered research capabilities that analyze your ideas and provide market insights, competitor analysis, and actionable prompts to get started building.

## Features

### Idea Management
- Create, edit, and organize project ideas
- Rich markdown editor with formatting toolbar
- Priority levels (Low, Medium, High)
- Status tracking (Draft, In Progress, Completed)
- Real-time search and filtering
- Sorting by priority, date, or title

### AI-Powered Research
- Automated market research using DeepSeek AI via Hugging Face
- Similar project discovery with competitor analysis
- Feasibility analysis including market size and technical complexity
- Time to MVP estimation
- Challenges and opportunities identification
- Feature enhancement suggestions with priority levels
- Differentiation strategies
- Research report with PDF export

### AI Prompt Generator
- Generate structured prompts based on your research
- Copy-paste ready prompts for ChatGPT, Claude, or Cursor
- Includes tech stack recommendations, MVP features, and user flows
- Helps you start building immediately after research

### Workflow Stages
- **Brain Box**: Nurture draft ideas and concepts
- **Launch Pad**: Track active projects in development
- **Trophy Case**: View completed projects

### Views
- Dashboard with statistics overview
- Kanban board with drag-and-drop
- List views for each stage

### User Experience
- Dark and light theme support
- Responsive design for mobile and desktop
- Smooth animations and transitions
- Toast notifications for all actions
- Persistent storage with Supabase

## Tech Stack

- **Framework**: Next.js 16 with App Router (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui + Radix UI
- **Database**: Supabase (PostgreSQL)
- **AI**: Hugging Face API with DeepSeek model
- **Drag and Drop**: @hello-pangea/dnd
- **Markdown**: react-markdown with rehype-raw
- **PDF Export**: jsPDF
- **Icons**: Lucide React
- **Notifications**: Sonner

## Prerequisites

- Node.js 20.x or higher
- npm or yarn package manager
- A Supabase account
- A Hugging Face API key

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Seedbed
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

#### Getting API Keys

**Supabase:**
1. Go to supabase.com
2. Create a new project
3. Go to Settings > API
4. Copy the Project URL and anon/public key

**Hugging Face:**
1. Go to huggingface.co
2. Create an account and go to Settings > Access Tokens
3. Create a new token with read permissions

### 4. Database Setup

Run this SQL in the Supabase SQL Editor:

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

CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_ideas_created_at ON ideas(created_at DESC);
```

### 5. Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Usage

### Creating an Idea
1. Click the "+ New Idea" button
2. Fill in the title and description (supports markdown)
3. Set priority and status
4. Click "Create Idea"

### AI Research
1. When creating or editing an idea, click "Research This Idea"
2. The AI analyzes your idea and provides:
   - Similar projects with their strengths
   - Feasibility analysis (market size, complexity, time to MVP)
   - Challenges and opportunities
   - Feature suggestions with priorities
   - Sources and references
3. View results in the Research tab
4. Export as PDF if needed

### Generate Building Prompt
1. After research is complete, scroll to "Get Started" section
2. Click "Generate a prompt to start building"
3. Copy the structured prompt
4. Paste into ChatGPT, Claude, or Cursor to start coding

### Managing Ideas
- Use the sidebar to navigate between Brain Box, Launch Pad, and Trophy Case
- Drag and drop ideas on the Kanban board to change status
- Use the search bar to filter ideas
- Sort ideas by different criteria using the dropdown

## Project Structure

```
Seedbed/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── research/          # AI research endpoint
│   │   │   └── generate-prompt/   # Prompt generation endpoint
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── screens/               # Main screen components
│   │   ├── ui/                    # shadcn UI components
│   │   ├── idea-card.tsx
│   │   ├── idea-dialog.tsx
│   │   ├── research-report.tsx
│   │   ├── research-skeleton.tsx
│   │   └── ...
│   ├── hooks/
│   │   └── use-ideas.ts
│   └── lib/
│       ├── types.ts
│       ├── constants.ts
│       └── utils.ts
├── .env.local
└── package.json
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run linter
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository on vercel.com
3. Add environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - HUGGINGFACE_API_KEY
4. Deploy

## Troubleshooting

### API Errors
- Verify your Hugging Face API key is valid
- Check that you have sufficient API quota
- The app uses the DeepSeek model via Hugging Face router

### Database Issues
- Verify Supabase URL and key in .env.local
- Ensure database tables are created
- Restart dev server after changing environment variables

### Build Issues
- Delete .next folder and restart: `rm -rf .next && npm run dev`
- Clear node_modules: `rm -rf node_modules && npm install`

## License

This project is private and proprietary.

## Built With

- Next.js
- Supabase
- Hugging Face
- shadcn/ui
- Tailwind CSS
