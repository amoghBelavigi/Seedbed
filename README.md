# Seedbed

A powerful idea management platform that helps entrepreneurs and creators capture, research, and nurture their startup ideas from conception to completion.

## Features

### Core Functionality
- **Idea Capture** - Quickly capture ideas with rich markdown descriptions
- **AI-Powered Research** - Automated market research using Google Gemini AI
  - Similar project discovery
  - Feasibility analysis
  - Market size estimation
  - Feature enhancement suggestions
  - Differentiation strategies
- **Multiple Views**
  - **Dashboard** - Overview of all ideas with stats
  - **Brain Box** - Collection view of all ideas
  - **Launch Pad** - Ideas ready to be developed
  - **Trophy Case** - Completed projects
  - **Kanban Board** - Drag-and-drop workflow management
- **Status Tracking** - Draft, In Progress, Completed
- **Priority Management** - Low, Medium, High priority levels
- **GitHub Integration** - Link ideas to repositories
- **Rich Text Editor** - Markdown support with formatting toolbar
- **Search & Filter** - Find ideas quickly
- **Dark/Light Theme** - Theme toggle support

## Tech Stack

- **Framework**: Next.js 16.1.6 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui + Radix UI
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Generative AI (Gemini 2.0 Flash)
- **Drag & Drop**: @hello-pangea/dnd
- **Markdown**: react-markdown
- **PDF Export**: jsPDF
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 20+ installed
- A Supabase account and project
- A Google AI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Seedbed
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_API_KEY=your_google_api_key
```

**Getting API Keys:**
- Supabase: https://supabase.com/dashboard
- Google AI: https://aistudio.google.com/apikey

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── research/          # AI research API endpoint
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main application
├── components/
│   ├── screens/               # Main screen components
│   │   ├── dashboard-screen.tsx
│   │   ├── brain-box-screen.tsx
│   │   ├── launch-pad-screen.tsx
│   │   ├── trophy-case-screen.tsx
│   │   └── kanban-screen.tsx
│   ├── ui/                    # Reusable UI components
│   ├── idea-dialog.tsx        # Idea creation/edit modal
│   ├── research-report.tsx    # AI research display
│   └── ...
├── hooks/
│   └── use-ideas.ts           # Ideas state management
├── lib/
│   ├── types.ts               # TypeScript type definitions
│   ├── constants.ts           # App constants
│   └── utils.ts               # Utility functions
└── styles/
    └── globals.css            # Global styles
```

## Usage

### Creating an Idea

1. Click the "New Idea" button in the top bar
2. Fill in the title and description (supports markdown)
3. Set priority (Low/Medium/High) and status (Draft/In Progress/Completed)
4. Optionally add a GitHub repository URL
5. Click "Create Idea"

### AI Research

1. When creating or editing an idea, click "Research This Idea"
2. The AI will analyze your idea and provide:
   - Similar projects and competitors
   - Feasibility analysis
   - Market opportunities
   - Feature enhancement suggestions
   - Relevant sources
3. View the research in the "Research" tab
4. Export research as PDF

### Managing Ideas

- **Edit**: Click the edit icon on any idea card
- **Delete**: Click the delete icon to remove an idea
- **Change Status**: Drag ideas between columns in Kanban view or use the status dropdown
- **Search**: Use the search bar to filter ideas
- **Navigate**: Use the sidebar to switch between different views

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `GOOGLE_API_KEY` | Google AI API key for research feature | Yes |

## Troubleshooting

### Google API Quota Errors

If you see "429 Too Many Requests" errors:
- You've exceeded the free tier quota
- Wait 24 hours for quota reset
- Upgrade to a paid plan at https://ai.google.dev/pricing
- Or get a new API key from a different Google account

### Database Connection Issues

- Verify your Supabase URL and key in `.env.local`
- Check that your Supabase project is active
- Ensure you've created the necessary database tables

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.

## Support

For questions or issues, please open an issue in the repository.
