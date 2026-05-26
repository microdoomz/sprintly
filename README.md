# 🏃 Sprintly

<p align="center">
  <em>Modern, collaborative task management for teams and individuals.</em>
</p>

---

## 📖 Table of Contents
- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture & Database Schema](#-architecture--database-schema)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Assumptions & Tradeoffs](#-assumptions--tradeoffs)

---

## 🚀 About the Project

Sprintly is a production-ready Full-Stack SaaS application built as a comprehensive solution for task management. Designed with a modern, minimalist aesthetic inspired by Linear, Notion, and Vercel, Sprintly simplifies workflows through visual Kanban boards and real-time collaboration.

This project was built to demonstrate proficiency in modern web development architectures, specifically utilizing Next.js 15 App Router, Server Actions, strict TypeScript typing, and real-time WebSockets.

---

## ✨ Features

- **🔒 Secure Authentication:** Powered by Better Auth (Email/Password & Session Management).
- **📋 Real-time Kanban Boards:** Drag-and-drop tasks smoothly across columns using `dnd-kit`. Changes are instantly broadcasted to all connected clients via Pusher WebSockets.
- **🏷️ Advanced Task Management:** Tasks support custom colored tags, subtask checklists, priorities, and descriptions via a sleek modal interface.
- **⌨️ Command Palette:** Press `Cmd+K` (or `Ctrl+K`) anywhere in the app for lightning-fast, keyboard-driven navigation.
- **🎨 UI Polish:** Dark-mode first aesthetic using Tailwind CSS and `shadcn/ui`. Includes optimistic UI updates and smooth skeleton loaders.
- **⚙️ Board Settings:** Full CRUD operations for boards, including customizable titles, descriptions, and deletion.

---

## 🛠 Tech Stack

**Frontend:**
- [Next.js 15](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (Radix Primitives)
- [dnd-kit](https://dndkit.com/) (Drag & Drop)
- [Lucide React](https://lucide.dev/) (Icons)

**Backend:**
- Next.js Server Actions (No external API routes for CRUD)
- [Neon Serverless Postgres](https://neon.tech/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Better Auth](https://better-auth.com/)
- [Pusher](https://pusher.com/) (WebSockets for Real-time sync)

---

## 📐 Architecture & Database Schema

Sprintly uses a strictly typed, relational database schema deployed on Neon PostgreSQL.

- `users`: Core account information.
- `boards`: Projects/workspaces owned by a user.
- `board_members`: Junction table handling shared access and permissions.
- `tasks`: Core entities containing `status` (column) and `position` (order).
- `subtasks`: Checklists related to specific tasks.
- `tags` / `task_tags`: Many-to-many relationship allowing custom colored labels on tasks.

All data mutations occur securely on the server via **Next.js Server Actions**, ensuring typesafe inputs and preventing client-side spoofing.

---

## 🏁 Getting Started

To run Sprintly locally, you will need Node.js installed, as well as access to a PostgreSQL database (like Neon) and a Pusher account.

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/sprintly.git
cd sprintly
```

### 2. Install dependencies
```bash
npm install
# Note: We enforce specific versions for better-auth and drizzle-orm to prevent conflicts.
```

### 3. Configure Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Fill in the following variables in your `.env` file:
- `DATABASE_URL`: Your PostgreSQL connection string.
- `BETTER_AUTH_SECRET`: A random 32-character string.
- `BETTER_AUTH_URL`: `http://localhost:3000`
- `PUSHER_APP_ID`, `NEXT_PUBLIC_PUSHER_KEY`, `PUSHER_SECRET`, `NEXT_PUBLIC_PUSHER_CLUSTER`: Your Pusher credentials.

### 4. Push the Database Schema
Use Drizzle to push the schema to your database:
```bash
npm run db:push
```

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💡 Usage

1. **Register an Account:** Create a new account from the landing page.
2. **Create a Board:** Click "New Board" in the sidebar to create a workspace.
3. **Add Tasks:** Click "Add Task" in the To-Do column.
4. **Drag & Drop:** Click and hold a task to drag it across the board. If you have another browser window open, you will see it move in real-time!
5. **Quick Navigation:** Press `Cmd+K` to open the search palette and jump to your profile settings.

---

## 🤔 Assumptions & Tradeoffs

- **Manual Scaffolding:** `create-next-app` was skipped to maintain absolute control over the folder architecture and prevent bloated defaults.
- **Server Actions over API Routes:** We chose Server Actions for all CRUD operations to reduce boilerplate and guarantee end-to-end type safety, making the codebase highly maintainable.
- **Pusher over Custom WebSockets:** Setting up a custom WebSocket server in a serverless environment (Next.js/Vercel) is notoriously difficult and unreliable. Pusher was chosen to guarantee low-latency, scalable real-time broadcasts without infrastructure overhead.
- **Minimalist MVP:** Features like email invitations and complex permissions were deferred to keep the MVP focused, complete, and extremely polished.

---
*Built as a showcase for modern full-stack engineering capability.*
