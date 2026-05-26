# Sprintly — AI Agent Project Context

This file serves as the definitive source of truth and context for any AI agent working on the `Sprintly` codebase. Read this carefully before making any modifications.

## Project Overview
**Sprintly** is a modern, collaborative task management SaaS application built as an intern assignment. It features real-time drag-and-drop Kanban boards, team collaboration, and a highly polished UI.

## Tech Stack & Architecture
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict typing enforced)
- **Styling**: Tailwind CSS + shadcn/ui + Lucide React
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth (Email/Password & Session Management)
- **Real-time Sync**: Pusher (WebSockets)
- **Drag & Drop**: dnd-kit

## Database Schema (Drizzle)
- `users`: Core user accounts
- `boards`: Projects/workspaces
- `board_members`: Junction table for collaboration/sharing
- `tasks`: Core task entities with `status` (todo, in-progress, done) and `position` for DnD
- `subtasks`: Checklists within tasks
- `tags` / `task_tags`: Many-to-many relationship for labeling tasks

## Implemented Features (MVP Completed)
- [x] Secure Auth (Login/Register/Protected Routes)
- [x] Dashboard Shell with responsive Sidebar/Navbar
- [x] Board Management (Create, Edit, Delete, Settings)
- [x] Real-time Kanban Board (Pusher + dnd-kit)
- [x] Task Management (Create, Update Status/Position, Subtasks, Tags)
- [x] Global Command Palette (Cmd+K navigation)
- [x] Profile & Appearance Settings
- [x] Skeleton Loaders & Optimistic UI Updates

## Missing / Future Implementations (If asked to continue)
- **Dashboard Stats**: The `/dashboard` route needs real data aggregation (Recent boards, deadlines).
- **List/Table View**: A secondary view toggle for tasks alongside the Kanban board.
- **Advanced Filtering**: Filter tasks by assignee, tag, or priority.
- **Email Invites**: Sending real emails for board collaboration invites.

## Environment Variables Needed for Local Dev
```env
DATABASE_URL=postgres://...
BETTER_AUTH_SECRET=random_32_chars
BETTER_AUTH_URL=http://localhost:3000
PUSHER_APP_ID=...
PUSHER_KEY=...
PUSHER_SECRET=...
PUSHER_CLUSTER=...
NEXT_PUBLIC_PUSHER_KEY=...
NEXT_PUBLIC_PUSHER_CLUSTER=...
```

## AI Agent Guidelines
1. **Never run `cat` or `echo` to modify files.** Always use your native `write_to_file` and `replace_file_content` tools.
2. **Server Actions**: All DB mutations MUST happen inside `src/actions/` via Next.js Server Actions. Do not use API routes for simple CRUD.
3. **Real-time**: Whenever a task is updated in `src/actions/task-actions.ts`, ensure `triggerEvent` from `src/lib/pusher/server.ts` is called to broadcast the change.
4. **Imports**: Use `@/` for absolute imports (e.g., `@/components/ui/button`).
