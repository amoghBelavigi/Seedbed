# 🌱 Seedbed

**Seedbed** is a modern idea management platform that helps you cultivate your project ideas from conception to completion. Organize, prioritize, and track your ideas through their lifecycle with an intuitive interface.

## ✨ Features

### Core Functionality
- **Idea Management**: Create, edit, and organize your project ideas
- **Three-Stage Workflow**:
  - 🧠 **Brain Box**: Nurture draft ideas and concepts
  - 🚀 **Launch Pad**: Track active projects in development
  - 🏆 **Trophy Case**: Celebrate completed projects
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
- 🔄 Real-time updates
- 💾 Persistent storage with Supabase

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: [Supabase](https://supabase.com/)
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- A **Supabase** account (free tier works great)

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
```

#### Get Your Supabase Credentials:

1. Go to [supabase.com](https://supabase.com/)
2. Create a new project
3. Go to Settings > API
4. Copy the `Project URL` and `anon/public` key

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
2. Fill in the title and description
3. Set priority (Low, Medium, High)
4. Choose initial status (Draft, In Progress, or Completed)
5. Optionally add a GitHub repository link
6. Click **"Save"**

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

## 🏗️ Project Structure

```
Seedbed/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Main application page
│   ├── components/
│   │   ├── screens/          # Main screen components
│   │   │   ├── brain-box-screen.tsx
│   │   │   ├── launch-pad-screen.tsx
│   │   │   └── trophy-case-screen.tsx
│   │   ├── ui/               # Reusable UI components
│   │   ├── app-sidebar.tsx   # Navigation sidebar
│   │   ├── top-bar.tsx       # Search and actions bar
│   │   ├── idea-card.tsx     # Individual idea display
│   │   └── idea-dialog.tsx   # Create/Edit modal
│   ├── hooks/
│   │   └── use-ideas.ts      # Ideas state management
│   ├── lib/
│   │   ├── types.ts          # TypeScript type definitions
│   │   └── utils.ts          # Utility functions
│   └── styles/
├── public/                   # Static assets
├── .env.local               # Environment variables
└── package.json             # Dependencies
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
# Start development server
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
5. Deploy!

Vercel automatically detects Next.js and configures everything for you.

### Other Deployment Options

- **Netlify**: Similar process to Vercel
- **Self-hosted**: Run `npm run build` and `npm start`
- **Docker**: Create a Dockerfile for containerized deployment

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
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Made with care for idea cultivators everywhere** 🌱
