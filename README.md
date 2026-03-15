# Jira Clone — Project Management App

A full-stack, Jira-inspired project management application built with **Next.js 14**, **Appwrite**, and **Hono**. Organize work into workspaces, projects, and tasks with a rich set of views including Kanban boards, calendar, and data tables.

---

## Features

- **Authentication** — Email/password sign-up & login, OAuth support, secure HTTP-only cookie sessions
- **Workspaces** — Create and manage multiple workspaces; invite teammates via a unique invite code
- **Projects** — Group tasks under projects within a workspace
- **Tasks** — Full task lifecycle with statuses: `Backlog`, `To Do`, `In Progress`, `In Review`, `Done`
- **Multiple Views** — Switch between Kanban board, calendar, and table views for tasks
- **Drag & Drop** — Reorder and move tasks across columns on the Kanban board
- **Members & Roles** — Workspace members with `Admin` and `Member` roles; role-based access control on all endpoints
- **Analytics Dashboard** — Per-workspace and per-project analytics with charts and stats
- **Filtering & Search** — Filter tasks by status, assignee, project, due date, and keyword
- **Responsive UI** — Mobile-friendly layout with a collapsible sidebar and drawer-based modals

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Backend / Auth / DB | [Appwrite](https://appwrite.io) |
| API Layer | [Hono](https://hono.dev) |
| State / Data Fetching | [TanStack React Query](https://tanstack.com/query) |
| Forms | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| UI Components | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com) |
| Styling | [Tailwind CSS](https://tailwindcss.com) |
| Charts | [Recharts](https://recharts.org) |
| Drag & Drop | [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) |
| Calendar View | [React Big Calendar](https://jquense.github.io/react-big-calendar) |
| URL State | [nuqs](https://nuqs.47ng.com) |
| Notifications | [Sonner](https://sonner.emilkowal.ski) |
| Deployment | [Netlify](https://netlify.com) |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Sign-in & sign-up pages
│   ├── (dashboard)/     # Main app layout with sidebar
│   ├── (standaone)/     # Standalone pages (workspace creation, join)
│   └── api/[[...route]] # Hono API catch-all route
├── components/          # Shared UI components
├── features/
│   ├── auth/            # Authentication logic, forms, hooks
│   ├── members/         # Workspace member management
│   ├── projects/        # Project CRUD and analytics
│   ├── tasks/           # Task CRUD, views, filters
│   └── workspaces/      # Workspace CRUD, invite system
├── hooks/               # Shared React hooks
└── lib/                 # Appwrite client, session middleware, utilities
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18+
- An [Appwrite](https://appwrite.io) instance (Cloud or self-hosted)

### 1. Clone the repository

```bash
git clone <repository-url>
cd jira
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root of the project:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://<your-appwrite-endpoint>/v1
NEXT_PUBLIC_APPWRITE_PROJECT=<your-project-id>
NEXT_APPWRITE_KEY=<your-appwrite-api-key>

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set up Appwrite

In your Appwrite project, create the following **Database collections** and note their IDs:

| Collection | Purpose |
|---|---|
| `workspaces` | Workspace documents |
| `members` | Workspace membership + roles |
| `projects` | Projects within workspaces |
| `tasks` | Tasks with status, assignee, due date |

Update `src/config.ts` with your database and collection IDs.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Deployment

The project includes a `netlify.toml` configuration and can be deployed directly to **Netlify**.

1. Push the repository to GitHub.
2. Connect the repo to a new Netlify site.
3. Add all environment variables from `.env.local` in the Netlify dashboard under **Site Settings → Environment Variables**.
4. Deploy.

For other platforms (Vercel, Railway, etc.), the same environment variables apply.

---

## License

This project was built as part of a web development bootcamp and is intended for educational purposes.
