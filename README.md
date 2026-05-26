# Sprintly

A modern, production-ready full-stack SaaS task management application.

## Features
- **Next.js 15 App Router** for fast, server-rendered React applications
- **TypeScript** for strict type safety
- **Tailwind CSS v4 & shadcn/ui** for beautiful, responsive design
- **Drizzle ORM & Neon** for powerful, serverless database interactions
- **Better Auth** for secure, session-based authentication (Email & Google)
- **Pusher** for realtime collaboration
- **dnd-kit** for fluid drag-and-drop task management
- **Zustand** for lightweight global state management

## Getting Started

### Prerequisites
- Node.js 18+
- Neon PostgreSQL database
- Pusher account
- Google OAuth credentials

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

3. Push the database schema to Neon:
   ```bash
   npm run db:push
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Development Phases
Check `Agent.md` and `task.md` for current project status and roadmap.
