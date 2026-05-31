# 🏃 Sprintly (Task Manager App)

<p align="center">
  <em>Modern, collaborative task management built for the Indpro Intern Assignment.</em>
</p>

---

## 🔗 Live Deployment

Sprintly is a Full-Stack Next.js application. Both the frontend and backend are deployed together on Vercel.

- **Live Demo Link:** [Insert Vercel URL Here]
- **GitHub Repository:** [Insert GitHub URL Here]

*(Note: Since Next.js API Routes and Server Actions act as the backend, deploying to Vercel satisfies both the mandatory frontend and optional backend deployment requirements in a single platform).*

---

## 📖 Table of Contents
- [Assignment Requirements](#-assignment-requirements)
- [Tech Stack](#-tech-stack)
- [Technical Decisions & Architecture](#-technical-decisions--architecture)
- [Assumptions & Tradeoffs](#-assumptions--tradeoffs)
- [Features](#-features)
- [Getting Started Locally](#-getting-started-locally)

---

## ✅ Assignment Requirements

This project successfully fulfills all mandatory and bonus requirements outlined in the intern assignment:
- **Auth (Mandatory):** Login & Register flow implemented securely using Better Auth.
- **Tasks (Mandatory):** Create, update, and delete tasks.
- **Stages (Mandatory):** Tasks support Todo, In Progress, and Done columns.
- **UI (Mandatory):** Clean, responsive design with comprehensive loading skeletons, optimistic updates, and error handling.
- **Database Integration (Bonus):** Fully integrated with Neon Serverless Postgres using Drizzle ORM.
- **Backend Authentication (Bonus):** Secure session-based backend authentication (not just client-side).
- **Custom Backend APIs (Bonus):** Backend logic handled securely via Next.js Server Actions and custom API routes.

---

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 & shadcn/ui
- **Database:** Neon Serverless Postgres
- **ORM:** Drizzle ORM
- **Authentication:** Better Auth (Session-based)
- **Drag & Drop:** `dnd-kit`

---

## 📐 Technical Decisions & Architecture

1. **Next.js 15 (App Router) over Separate Frontend/Backend:** 
   I chose a monolithic full-stack framework rather than separating React (Frontend) and Node/Express (Backend). This decision guarantees end-to-end type safety, eliminates the need for manual CORS configuration, and drastically reduces boilerplate.
2. **Server Actions for Data Mutations:**
   Instead of traditional REST APIs, all database mutations (creating/deleting tasks) are executed via strictly typed Next.js Server Actions. This prevents client-side spoofing and improves security.
3. **Dedicated API Routes for Media:**
   I implemented a custom REST API route (`/api/users/[id]/avatar`) specifically to serve user profile images. This prevents massive base64 strings from bloating standard JSON responses and allows the browser to aggressively cache binary assets.
4. **Neon Serverless Postgres:**
   Chosen for its edge compatibility, instant provisioning, and seamless integration with Vercel and Drizzle ORM.

---

## 🤔 Assumptions & Tradeoffs

1. **Optimistic UI Updates:** 
   *Tradeoff:* For the Kanban drag-and-drop experience, I implemented optimistic UI updates. This means the UI assumes the backend call will succeed and updates the screen instantly. While this requires more complex client-side state management (handling rollbacks if the server fails), it is a necessary tradeoff to provide a native-feeling, lag-free user experience.
2. **Avatar Storage:** 
   *Tradeoff:* Instead of integrating AWS S3 or a heavy blob storage provider, user avatars are stored as base64 data in a dedicated database table (`user_avatars`). This kept the architecture simple and easy to deploy for a 3-4 hour assignment, while maintaining excellent performance via the custom API route.
3. **Strict Column Structure:** 
   *Assumption:* The assignment specified "Every task has a stage — Todo, In Progress, Done." I assumed these three stages were strict and sufficient, so custom user-generated columns were not implemented to keep the MVP focused.

---

## ✨ Features

- **🔒 Secure Authentication:** Email/Password & Session Management.
- **📋 Kanban Boards:** Smooth drag-and-drop interface across columns.
- **🎨 Liquid Glass UI:** Apple-inspired frosted glass components with dynamic animated mesh gradients and dark-mode aesthetics.
- **⚡ Instant UX:** Global transition spinners on action buttons and instant Suspense skeleton streaming.
- **📱 Mobile Optimized:** Full touch-sensor support for Kanban drag-and-drop on mobile devices.
- **👥 Multiple Boards:** Create and manage distinct boards/workspaces.

---

## 🏁 Getting Started Locally

To run Sprintly locally, you will need Node.js installed and access to a PostgreSQL database.

### 1. Clone the repository
```bash
git clone [repository-url]
cd sprintly
```

### 2. Install dependencies
```bash
npm install
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
