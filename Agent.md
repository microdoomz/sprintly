# Sprintly - Agent Operations Document

This document serves as the "working memory on disk" and state tracking for the AI agent(s) operating on the Sprintly codebase.

## Current Status
- **Phase 1 (Project Setup & Architecture):** Completed. Folder structure scaffolded, base UI components created, layout setup complete.
- **Phase 2 (Database & ORM):** Completed in code. Schema defined with 8 tables. Migrations pending DB setup.
- **Next Immediate Step:** Run `npm install` to install all dependencies defined in `package.json`, then initialize the git repository and move on to Phase 3 (Authentication).

## Architecture Decisions
- **Manual Scaffolding:** `create-next-app` was skipped due to initial disk space constraints and to avoid bloated defaults. The project was manually structured to enforce clean architecture from step one.
- **Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4 (PostCSS), shadcn/ui (Radix), Drizzle ORM, Better Auth, Zustand.
- **Styling:** Dark mode first. Custom CSS variables in `globals.css`.
- **Database:** Neon Serverless Postgres.

## Open Questions / Credentials Needed
*Note: The system is designed to use placeholder credentials if real ones are not provided.*
- Neon PostgreSQL connection string (`DATABASE_URL`).
- Better Auth secret (`BETTER_AUTH_SECRET`).
- Google OAuth credentials (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`).
- Pusher credentials for realtime collaboration.

## Feature Phases
See `task.md` or `Implementation Plan.md` for detailed breakdown of phases.
