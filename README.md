# AI Website Builder Platform

An AI-powered website builder that enables users to create websites, web applications, chatbots, and AI agents through natural language prompts. Built with fullstack JavaScript and designed for accessibility on all devices.

## Features

### Core Functionality
- **AI Code Generation**: Generate complete websites and applications using OpenAI GPT-4
- **Project Management**: Create, save, preview, and manage your AI-generated projects
- **Template Library**: Browse and use pre-built templates for quick starts
- **Resource Directory**: Curated collection of free development tools and services
- **GitHub Integration**: Connect your GitHub account to manage repositories
- **Dark Mode**: Full dark/light theme support with system preference detection
- **Mobile-Responsive**: Optimized for Android devices and all screen sizes

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, shadcn/ui
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL (Neon serverless)
- **AI**: OpenAI GPT-4 API
- **Integration**: GitHub API via Octokit

## Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (automatically configured on Replit)
- OpenAI API key (optional, for AI code generation)
- GitHub account (optional, for repository management)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Optional: Add your OpenAI API key for AI code generation
OPENAI_API_KEY=your_api_key_here

# Database URL is automatically configured
DATABASE_URL=your_database_url
```

3. Push database schema:
```bash
npm run db:push
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Usage

### AI Code Generation
1. Navigate to the AI Generator page
2. Enter a project name
3. Select project type (Website, Webapp, Chatbot, or AI Agent)
4. Write a detailed prompt describing what you want to build
5. Click "Generate Code" to create your project
6. Preview the generated code in the live preview pane
7. Save the project to your library

### Using Templates
1. Go to the Templates page
2. Browse available templates by category
3. Click "Preview" to see the template code
4. Click "Use" to create a new project from the template

### Managing Projects
1. Visit the Projects page to see all your saved projects
2. Click "View" to preview any project
3. Use the download button to export project code
4. Delete projects you no longer need

### GitHub Integration
1. Navigate to the GitHub page
2. The integration automatically uses your Replit GitHub connection
3. View your repositories and manage them directly

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components (routes)
│   │   ├── lib/           # Utilities and helpers
│   │   └── App.tsx        # Main app component with routing
├── server/                # Backend Express application
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database access layer
│   ├── db.ts              # Database client setup
│   └── openai.ts          # OpenAI integration
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema with Drizzle
└── design_guidelines.md   # UI/UX design system
```

## API Routes

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Templates
- `GET /api/templates` - List all templates

### AI Generation
- `POST /api/generate` - Generate code with AI (requires OpenAI API key)

### GitHub
- `GET /api/github/repos` - List user repositories
- `POST /api/github/repos` - Create new repository

## Database Schema

### Projects Table
- `id` - Unique identifier (UUID)
- `name` - Project name
- `description` - Project description
- `type` - Project type (website, webapp, chatbot, ai-agent)
- `code` - Generated code content
- `language` - Programming language
- `techStack` - Array of technologies used
- `githubRepo` - Associated GitHub repository URL
- `prompt` - Original AI prompt
- `createdAt` - Creation timestamp
- `lastModified` - Last modification timestamp

### Templates Table
- `id` - Unique identifier (UUID)
- `name` - Template name
- `description` - Template description
- `category` - Template category
- `code` - Template code
- `language` - Programming language
- `techStack` - Array of technologies
- `thumbnail` - Preview image URL
- `createdAt` - Creation timestamp

## Configuration

### Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (auto-configured)
- `OPENAI_API_KEY` - OpenAI API key (optional)
- `SESSION_SECRET` - Session encryption key (auto-configured)

### Design System

The application follows a professional design system inspired by Linear, VS Code, and Notion:
- **Typography**: Inter (UI), JetBrains Mono (code)
- **Colors**: Custom HSL-based theme with dark mode support
- **Spacing**: Consistent 4px grid system
- **Components**: shadcn/ui New York variant

See `design_guidelines.md` for complete design specifications.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio (database GUI)

### Adding New Features

1. Define data models in `shared/schema.ts`
2. Update storage interface in `server/storage.ts`
3. Add API routes in `server/routes.ts`
4. Create frontend components in `client/src/`
5. Update routing in `client/src/App.tsx`

## Troubleshooting

### OpenAI API Errors
- Ensure `OPENAI_API_KEY` is set in environment variables
- Check API key validity and quota
- The app gracefully handles missing API keys

### Database Connection Issues
- Verify `DATABASE_URL` is configured
- Run `npm run db:push` to sync schema
- Check database logs in Replit

### GitHub Integration
- Ensure GitHub connector is set up in Replit
- The app returns empty arrays if GitHub is not connected

## License

This project is private and intended for personal use.

## Support

For issues or questions, please refer to the project documentation or contact the development team.
