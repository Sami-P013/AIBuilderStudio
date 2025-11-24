# AI Website Builder Platform

## Overview

This is an AI-powered website builder platform that enables users to create websites, web applications, chatbots, and AI agents through natural language prompts. The platform integrates with GitHub for code synchronization, provides a curated library of templates and resources, and features a project management system for organizing AI-generated code.

The application is designed with a mobile-first approach, drawing inspiration from modern developer tools like Linear, VS Code, and Notion, prioritizing productivity and professional aesthetics.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (November 24, 2025)

- **Multi-Model Support**: Added support for OpenAI, Anthropic Claude, Google Gemini, and OpenRouter models
- **MCP Integration**: Added Model Context Protocol (MCP) server configuration for extended capabilities
- **Library Management**: Created system for managing npm packages, APIs, and service integrations
- **Settings Page**: New Settings page allows users to select preferred AI models and manage integrations
- **Visual Enhancements**: Vibrant color scheme with 100% saturation, card hover effects, gradient text headings
- **Guides Section**: Comprehensive learning guides for building different project types with integrated tools
- **Database Schema**: Added tables for ModelConfig, MCPServer, and LibraryConfig with full CRUD operations

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server, chosen for its fast hot module replacement and optimized production builds
- Wouter for lightweight client-side routing instead of React Router, reducing bundle size while maintaining routing functionality

**UI Component System**
- Radix UI primitives as the foundation for accessible, unstyled components
- shadcn/ui design system (New York variant) providing pre-built, customizable components
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for managing component variants systematically

**Design System**
- Typography: Inter for UI elements, JetBrains Mono for code/technical content
- Custom color system supporting light/dark themes via CSS variables
- Spacing based on Tailwind's standard scale (2, 4, 6, 8, 12, 16)
- Mobile-first responsive breakpoints optimized for Android accessibility

**State Management**
- TanStack Query (React Query) for server state management, caching, and data synchronization
- Local component state with React hooks for UI-specific state
- Theme management via React Context API

**Key Features**
- AI code generator with multi-model support and real-time preview
- Project management (CRUD operations for user-generated projects)
- Template library with categorization and filtering
- Comprehensive learning guides for different project types
- Curated resources directory for free development tools
- GitHub repository integration and synchronization
- Settings page for AI model selection and integration management
- Support for MCP servers and library/API integrations

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- Dual-mode setup: development (Vite middleware integration) and production (static file serving)
- Custom logging middleware for request/response tracking

**API Design**
- RESTful endpoints for projects, templates, and GitHub operations
- POST `/api/generate` - AI code generation endpoint
- CRUD routes for `/api/projects` and `/api/templates`
- GitHub API routes for repository management

**AI Integration**
- Multi-model support: OpenAI, Anthropic Claude, Google Gemini, OpenRouter
- Uses Replit AI Integrations for seamless model access without separate API keys
- Context-aware system prompts tailored to project types (website, webapp, chatbot, ai-agent)
- Configurable token limits (4096 max completion tokens)
- Support for Model Context Protocol (MCP) servers for extended tool capabilities

**Session & Request Handling**
- JSON body parsing with raw body preservation for webhook verification
- Custom error handling and response logging
- CORS and security middleware considerations

### Data Layer

**Database Solution**
- PostgreSQL via Neon serverless driver for scalable, edge-compatible database access
- Drizzle ORM for type-safe database operations and schema management
- Migration system via Drizzle Kit

**Schema Design**

*Projects Table*
- Stores user-generated AI projects with full code, metadata, and versioning
- Fields: id (UUID), name, description, type, code, language, prompt, techStack (array), githubRepo, timestamps
- Supports multiple project types: website, webapp, chatbot, ai-agent

*Templates Table*
- Pre-built starter templates organized by category
- Fields: id (UUID), name, description, category, code, language, techStack, thumbnail, createdAt
- Categories: landing, saas, blog, ecommerce, chatbot, ai-agent

**Data Access Pattern**
- Repository pattern via DbStorage class implementing IStorage interface
- Centralized database client initialization with schema validation
- Automatic timestamp management for created/modified tracking

### External Dependencies

**Third-Party APIs**
- **OpenAI API**: Code generation using GPT-5 model (requires OPENAI_API_KEY environment variable)
- **GitHub API**: Repository management via Octokit REST client, using Replit's connector system for OAuth authentication
- **Neon Database**: Serverless PostgreSQL (requires DATABASE_URL environment variable)

**Replit Integration**
- GitHub connector for OAuth token management with automatic refresh
- Replit-specific Vite plugins: runtime error modal, cartographer (dev mode), dev banner
- Environment-based authentication using REPL_IDENTITY or WEB_REPL_RENEWAL tokens

**Font Services**
- Google Fonts CDN for Inter, Architects Daughter, DM Sans, Fira Code, and Geist Mono typefaces

**Build & Development Tools**
- TypeScript for static typing across client, server, and shared code
- ESBuild for production server bundling
- PostCSS with Autoprefixer for CSS processing
- Drizzle Kit for database schema migrations

**Component Libraries**
- 25+ Radix UI primitives for accessibility-compliant interactions
- React Hook Form with Zod resolvers for form validation
- date-fns for date manipulation
- cmdk for command palette functionality
- Lucide React for consistent iconography

**Authentication Architecture**
- GitHub OAuth flow managed through Replit's connector API
- Token refresh logic to prevent expired credentials
- Per-request client instantiation to ensure fresh access tokens (no caching of GitHub client)