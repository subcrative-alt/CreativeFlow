# CreativeFlow

**Professional Creative Team Management & Workflow Automation SaaS**

CreativeFlow is an enterprise-grade web application built to streamline operations for high-output creative agencies, video production houses, and multimedia studios. It automates sequential task dependencies, eliminates review bottlenecks, manages daily attendance, and prevents schedule conflicts.

Initially configured for a four-person creative team operating in **Asia/Dhaka (UTC+6)**:
- **1 Creative Head (Admin)**
- **2 Video Editors**
- **1 Photographer**

---

## 🚀 Key Features

- **Automated Dependency Engine**: Tasks automatically advance through stages (`Photography` → `Raw Footage Upload` → `Video Editing` → `Creative Head Review` → `Revision / Approval` → `Final Export`). Downstream tasks unlock only after prerequisite approvals.
- **Strict Role-Based Access Control (RBAC)**: Enforced directly at the PostgreSQL kernel level using Supabase Row Level Security (RLS). URL tampering and unauthorized API requests are completely prevented.
- **Daily Attendance & Work Check-in**: Asia/Dhaka synchronized morning check-in (availability confirmation, task acceptance) and End-of-Day (EOD) reporting (logged hours, delay reasons, tomorrow's plan).
- **Specialized Creative Modules**:
  - **Photography Hub**: Shot lists, SKU details, location specs, and interactive camera/lighting gear checklists.
  - **Video Editing Hub**: Aspect ratio specifications (9:16 vertical reel, 16:9 widescreen, 1:1 square), voiceover/BGM/subtitle trackers, and draft delivery links.
- **Conflict-Free Scheduling**: Visual calendar (Month, Week, Day, Team) with automated detection of double-booking.
- **Executive Analytics**: Real-time KPI dashboards, member workload indicators, weekly productivity curves, and sanitized CSV exports.
- **Premium SaaS Aesthetic**: Designed with inspiration from Linear, ClickUp, and Notion. Dark Navy sidebar (`#0F172A`), white/light workspace, subtle shadows, and complete Dark/Light mode support.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS & shadcn/ui
- **Icons**: Lucide Icons
- **Authentication**: Supabase Auth (SSR Cookie Session Management)
- **Database**: Supabase PostgreSQL with custom functions, triggers, and RLS
- **Storage**: Supabase Storage with project-level folder isolation
- **Timezone**: `Asia/Dhaka` (UTC+6) via `date-fns-tz`
- **Validation**: Zod schema validation
- **Deployment**: Vercel Managed Cloud

---

## 👥 Initial Team Roster

| Role | Initial User Account | Default Password (Dev/Seed) | Primary Permissions |
| :--- | :--- | :--- | :--- |
| **Creative Head** | `head@creativeflow.com` | `CreativeFlow#2026` | Full admin rights, project/task creation, approval gatekeeping, analytics, team management. |
| **Video Editor 01** | `editor1@creativeflow.com` | `CreativeFlow#2026` | Assigned video editing tasks, accept/reject, draft upload, revision resolution, check-in. |
| **Video Editor 02** | `editor2@creativeflow.com` | `CreativeFlow#2026` | Assigned video editing tasks, accept/reject, draft upload, revision resolution, check-in. |
| **Photographer** | `photo@creativeflow.com` | `CreativeFlow#2026` | Assigned shoot tasks, gear checklist, location details, raw upload, shoot schedule. |

---

## 🔄 Automated Workflow Pipeline

```
[Photography Task]
       │
       ▼ (Photographer uploads raw files & completes shoot)
[Raw Footage Ingestion]
       │
       ▼ (Creative Head verifies raw assets)
[Video Editing Task] ──► Automatically unblocked & assigned editor notified
       │
       ▼ (Video Editor uploads draft & submits for review)
[Creative Head Review]
       │
       ├──► If Revision Required: Task reactivated with structured notes
       │       │
       │       └──► Editor updates deliverable & resubmits
       │
       ▼ If Approved:
[Final Export & Master Delivery]
       │
       ▼ (All tasks completed)
[Project Completed]
```

---

## 📁 Repository Structure

```
CreativeFlow/
├── src/
│   ├── app/                                 # Next.js App Router routes
│   │   ├── (auth)/                          # Public auth routes (login, forgot-password)
│   │   ├── (admin)/                         # Creative Head management pages
│   │   ├── (employee)/                      # Contributor focused task workspaces
│   │   └── api/                             # Internal Route Handlers (CSV export, etc.)
│   ├── components/                          # UI components (shadcn/ui + domain widgets)
│   ├── lib/                                 # Supabase client, validations, timezone helpers
│   ├── actions/                             # Server actions for database mutations
│   └── types/                               # TypeScript database models & interfaces
├── supabase/
│   ├── migrations/                          # SQL migrations (13 tables, RLS, triggers)
│   └── seed.sql                             # Initial 4-user team seed data
├── PROJECT_PLAN.md                          # Comprehensive WBS & phase milestones
├── DATABASE_SCHEMA.md                       # Full 13-table schema DDL & RLS policies
├── ARCHITECTURE.md                          # Technical system design & component diagrams
├── IMPLEMENTATION_STATUS.md                 # Real-time implementation progress tracker
└── README.md                                # Project overview and developer guide
```

---

## ⚙️ Getting Started (Prerequisites for Phase 2)

### 1. Environment Setup
To initialize the development server in Phase 2, the following runtime is required:
- **Node.js**: v20 LTS or v22 LTS
- **Package Manager**: `npm` or `pnpm`

### 2. Supabase Configuration
Create a free project at [supabase.com](https://supabase.com) and retrieve your project credentials:
1. Navigate to **Project Settings** → **API**.
2. Copy `Project URL` and `anon public` key.
3. Copy `service_role` key (for running migrations and database seeding).

Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_TIMEZONE=Asia/Dhaka
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Migration
Run the complete SQL migration located in [DATABASE_SCHEMA.md](file:///c:/Users/SWD-E1/Desktop/CreativeFlow/DATABASE_SCHEMA.md#L150-L400) directly in the Supabase SQL Editor.

---

## 📊 Development Phases

- [x] **Phase 1: Project Architecture, Schema Design & Specs**
- [ ] **Phase 2: Next.js Foundation, Design System & Auth Shell**
- [ ] **Phase 3: Database Migrations, RLS & Projects/Tasks Modules**
- [ ] **Phase 4: Calendar, Check-in, Photography & Video Hubs**
- [ ] **Phase 5: Workflow Automation, Dependencies & Approvals**
- [ ] **Phase 6: Performance Reports, Analytics & CSV Export**
- [ ] **Phase 7: Comprehensive QA, Security Penetration Audit & Production Deploy**
