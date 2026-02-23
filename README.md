# 🌱 Seedbed

**Seedbed** is a modern idea management platform that helps you cultivate your project ideas from conception to completion. Organize, prioritize, and track your ideas through their lifecycle with an intuitive interface and AI-powered research capabilities.

## ✨ Features

### Core Functionality
- **Idea Management**: Create, edit, and organize your project ideas
- **AI-Powered Research**: Automated market research using Google Gemini AI
  - Similar project discovery
  - Feasibility analysis and market size estimation
  - Technical complexity assessment
  - Feature enhancement suggestions
  - Differentiation strategies
  - Research report with PDF export
- **Three-Stage Workflow**:
  - 🧠 **Brain Box**: Nurture draft ideas and concepts
  - 🚀 **Launch Pad**: Track active projects in development
  - 🏆 **Trophy Case**: Celebrate completed projects
- **Multiple Views**:
  - Dashboard with statistics overview
  - Kanban board with drag-and-drop
  - List views for each stage
- **Smart Organization**:
  - Priority levels (Low, Medium, High)
  - Status tracking (Draft, In Progress, Completed)
  - Real-time search and filtering
  - Sorting by priority, date, or title
  - GitHub repository integration

### User Experience
- 🎨 Beautiful, modern UI with smooth animations
- 🌓 Dark/Light theme support
- 📱 Responsive design
- ⌨️ Intuitive keyboard shortcuts
- 📝 Rich markdown editor with formatting toolbar
- 🔄 Real-time updates
- 💾 Persistent storage with Supabase
- 🔔 Toast notifications for all actions

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.1.6](https://nextjs.org/) with App Router (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui + Radix UI
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **AI**: Google Generative AI (Gemini 2.0 Flash)
- **Drag & Drop**: @hello-pangea/dnd
- **Markdown**: react-markdown with rehype-raw
- **PDF Export**: jsPDF
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** 20.x or higher
- **npm** or **yarn** package manager
- A **Supabase** account (free tier works great)
- A **Google AI API key** (free tier available)

## 🚀 Getting Started

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
GOOGLE_API_KEY=your_google_api_key
```

#### Get Your API Keys:

**Supabase:**
1. Go to [supabase.com](https://supabase.com/)
2. Create a new project
3. Go to Settings > API
4. Copy the `Project URL` and `anon/public` key

**Google AI:**
1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key
3. Copy the API key

### 4. Database Setup

Set up your Supabase database tables using the Supabase SQL Editor:

```sql
-- Create ideas table
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT CHECK (status IN ('draft', 'in-progress', 'completed')),
  github_repo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_ideas_created_at ON ideas(created_at DESC);
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Creating an Idea
1. Click the **"+ New Idea"** button in the top bar
2. Fill in the title and description (supports markdown)
3. Set priority (Low, Medium, High)
4. Choose initial status (Draft, In Progress, or Completed)
5. Optionally add a GitHub repository link
6. Click **"Create Idea"**

### AI Research Feature
1. When creating or editing an idea, click "Research This Idea"
2. The AI will analyze your idea and provide:
   - 3-5 similar projects with strengths
   - Feasibility analysis (market size, complexity, time to MVP)
   - Technical challenges and opportunities
   - 5-8 feature enhancement suggestions
   - Relevant sources and references
3. View the comprehensive research in the "Research" tab
4. Export research report as PDF for sharing

### Managing Ideas

**Brain Box Arena** - Your ideation workspace
- View all draft ideas
- Sort by newest, oldest, priority, or title
- Filter ideas with the search bar
- Edit or delete ideas
- Move ideas to Launch Pad when ready to start

**Launch Pad** - Active development tracking
- See all in-progress projects
- Visual priority indicators
- Quick actions to edit or complete
- GitHub repo links for easy access

**Trophy Case** - Celebrate completions
- Showcase completed projects
- Timeline view of achievements
- Filter and search completed work

**Dashboard** - Overview and analytics
- Stats cards showing idea counts by status
- Quick access to all sections
- Recent ideas view

## 🏗️ Project Structure

```
Seedbed/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── research/          # AI research API endpoint
│   │   │   └── generate-prompt/   # Prompt generation helper
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Main application page
│   ├── components/
│   │   ├── screens/               # Main screen components
│   │   │   ├── dashboard-screen.tsx
│   │   │   ├── brain-box-screen.tsx
│   │   │   ├── launch-pad-screen.tsx
│   │   │   ├── trophy-case-screen.tsx
│   │   │   └── kanban-screen.tsx
│   │   ├── ui/                    # Reusable UI components (shadcn)
│   │   ├── app-sidebar.tsx        # Navigation sidebar
│   │   ├── top-bar.tsx            # Search and actions bar
│   │   ├── idea-card.tsx          # Individual idea display
│   │   ├── idea-dialog.tsx        # Create/Edit modal
│   │   ├── research-report.tsx    # AI research display
│   │   ├── kanban-board.tsx       # Kanban view
│   │   └── ...
│   ├── hooks/
│   │   └── use-ideas.ts           # Ideas state management
│   ├── lib/
│   │   ├── types.ts               # TypeScript type definitions
│   │   ├── constants.ts           # App constants
│   │   └── utils.ts               # Utility functions
│   └── styles/
│       └── globals.css            # Global styles
├── public/                        # Static assets
├── .env.local                     # Environment variables (not in git)
└── package.json                   # Dependencies
```

## 🎨 Customization

### Changing Theme Colors
Edit `tailwind.config.ts` to customize the color palette.

### Adding New Idea Fields
1. Update the `Idea` interface in `src/lib/types.ts`
2. Update the database schema in Supabase
3. Modify `idea-dialog.tsx` to include new fields
4. Update display components as needed

### Adding New Screens
1. Create a new screen component in `src/components/screens/`
2. Add a navigation item in `src/components/app-sidebar.tsx`
3. Import and render in `src/app/page.tsx`

## 🧪 Development

### Available Scripts

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Code Style
- TypeScript strict mode enabled
- ESLint for code quality
- Consistent component patterns
- Organized file structure

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com/)
3. Import your repository
4. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GOOGLE_API_KEY`
5. Deploy!

Vercel automatically detects Next.js and configures everything for you.

### Other Deployment Options

- **Netlify**: Similar process to Vercel
- **Self-hosted**: Run `npm run build` and `npm start`
- **Docker**: Create a Dockerfile for containerized deployment

## ⚠️ Troubleshooting

### Google API Quota Errors

If you see "429 Too Many Requests" errors:
- You've exceeded the free tier quota (15 requests per minute)
- Wait a few minutes or 24 hours for quota reset
- Upgrade to a paid plan at https://ai.google.dev/pricing
- Or get a new API key from a different Google account

### Model Not Found Errors (404)

If you see "models/gemini-X is not found":
- The code uses `gemini-2.0-flash` which is the correct model name
- Ensure your Google API key is valid and active
- Check the API key at https://aistudio.google.com/apikey

### Database Connection Issues

- Verify your Supabase URL and key in `.env.local`
- Check that your Supabase project is active
- Ensure you've created the necessary database tables (see Database Setup)
- Restart the dev server after changing `.env.local`

### Development Server Issues

- Delete `.next` folder and restart: `rm -rf .next && npm run dev`
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Google Gemini AI](https://ai.google.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Made with care for idea cultivators everywhere** 🌱
