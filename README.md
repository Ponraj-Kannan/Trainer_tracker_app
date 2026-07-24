# 🏢 Employee Daily Work Tracker

A **production-ready, enterprise-grade** Employee Daily Work Status Tracker built with Next.js 16, Supabase, Google OAuth, TypeScript, and Tailwind CSS.

---

## ✨ Features

- 🔐 **Google OAuth Only** — No passwords, no signup. Only registered employees can login.
- 📋 **Daily Work Submission** — 7 work types, one submission per day enforced at DB level.
- 🔒 **Enterprise Security** — Row Level Security, JWT validation, server actions, Zod validation.
- 📊 **Real-time Dashboard** — Live clock, employee profile, today's status card.
- 🎨 **Professional UI** — Corporate blue theme, glassmorphism, animations, dark mode ready.
- 📱 **Fully Responsive** — Desktop, tablet, and mobile optimized.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Icons | Lucide React |
| Backend | Next.js Server Actions |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth + Google OAuth |
| Validation | Zod |
| Toasts | Sonner |
| Deployment | Vercel |

---

## 📁 Project Structure

```
employee-tracker/
├── app/
│   ├── (auth)/login/page.tsx           # Login page
│   ├── (dashboard)/dashboard/page.tsx  # Main dashboard
│   ├── auth/callback/route.ts          # OAuth callback + employee check
│   ├── auth/unauthorized/page.tsx      # Access denied page
│   ├── layout.tsx                      # Root layout
│   └── globals.css
├── actions/
│   ├── auth.ts                         # signInWithGoogle, signOut
│   └── work.ts                         # submitDailyWork
├── components/
│   ├── auth/LoginCard.tsx
│   └── dashboard/
│       ├── Header.tsx                  # Sticky header + live clock
│       ├── EmployeeInfoCard.tsx
│       ├── TodayStatusCard.tsx
│       ├── WorkTypeSelector.tsx        # Work type selection + submit
│       ├── ConfirmDialog.tsx
│       └── SuccessState.tsx
├── hooks/useLiveClock.ts
├── lib/
│   ├── constants.ts
│   ├── validations.ts
│   └── supabase/
│       ├── client.ts
│       ├── server.ts
│       └── middleware.ts
├── supabase/schema.sql                 # Complete DB schema + RLS
├── types/index.ts
├── proxy.ts                            # Route protection (Next.js 16)
├── next.config.ts                      # Security headers
└── .env.example
```

---

## 🚀 Quick Start

### Step 1 — Install Dependencies

```bash
cd employee-tracker
npm install
```

### Step 2 — Set Up Supabase

1. Go to [supabase.com](https://supabase.com) → Create new project
2. In **SQL Editor**, run contents of `supabase/schema.sql`
3. Navigate to **Settings → API**, copy:
   - Project URL
   - Anon Key (public)
   - Service Role Key (secret — never expose to browser)

### Step 3 — Set Up Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create OAuth 2.0 Client ID (Web Application)
3. Add **Authorized Redirect URI**:
   ```
   https://<your-project-id>.supabase.co/auth/v1/callback
   ```
4. In **Supabase → Authentication → Providers → Google**:
   - Enable Google, paste Client ID + Secret

### Step 4 — Configure Environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 5 — Add Employee Records (Admin Only)

```sql
INSERT INTO public.employees (employee_id, full_name, date_of_birth, gender, personal_email, contact_number, is_active)
VALUES ('EMP101', 'Ponraj Kumar', '1995-04-15', 'Male', 'ponraj@gmail.com', '9876543210', TRUE);
```

> ⚠️ `personal_email` must exactly match the Gmail used to sign in with Google.

### Step 6 — Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Deployment to Vercel

### 1. Deploy

```bash
npx vercel --prod
```

Or connect GitHub repo to Vercel for CI/CD.

### 2. Set Environment Variables in Vercel Dashboard

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |

### 3. Update Supabase Auth Settings

In **Supabase → Authentication → URL Configuration**:
- **Site URL**: `https://your-app.vercel.app`
- **Redirect URLs**: `https://your-app.vercel.app/auth/callback`

---

## 🔐 Security Architecture

```
Browser → Google OAuth → Supabase Auth
         ↓
         /auth/callback
         ├── Exchange code for session
         ├── Verify email in employees table
         ├── Not found? → Sign out → /auth/unauthorized
         └── Found? → /dashboard
                    ↓
         proxy.ts validates JWT on every request
                    ↓
         Server Actions re-validate session
                    ↓
         Supabase RLS enforces data isolation
```

**7 Security Layers:**
1. Google OAuth authentication
2. Employee whitelist check at callback
3. JWT proxy middleware on every route
4. Server-side session validation in actions
5. Zod schema validation of all inputs
6. Row Level Security in PostgreSQL
7. DB UNIQUE constraint prevents double submissions

---

## 🗄 Database Schema

### employees
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | Auto-generated |
| employee_id | TEXT UNIQUE | e.g. EMP101 |
| full_name | TEXT | |
| date_of_birth | DATE | |
| gender | TEXT | Male/Female/Other |
| personal_email | TEXT UNIQUE | Used for OAuth matching |
| contact_number | TEXT | |
| is_active | BOOLEAN | Inactive = cannot login |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | Auto-updated by trigger |

### daily_work
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| employee_uuid | UUID FK | References employees.id |
| employee_id | TEXT | Denormalized for reports |
| work_date | DATE | |
| work_type | TEXT | OIF/IT/TRAVEL/etc. |
| submitted_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | |

**Key Constraint**: `UNIQUE(employee_uuid, work_date)` — one submission per day at DB level.

---

## 🧩 Work Types

| Type | Description |
|---|---|
| OIF | Office In-Field Work |
| IT | Information Technology |
| TRAVEL | Travel / On-Site Visit |
| HALF DAY TRAVEL | Half Day Travel |
| LEAVE | Planned Leave |
| EMERGENCY LEAVE | Emergency / Urgent Leave |
| OTHER | Other Work Type |

---

## 🔮 Future Enhancements (Admin-Ready Architecture)

- **Admin Dashboard** — `app/(admin)/` route group
- **Employee Management** — CRUD via service role
- **Attendance/Leave Reports** — Filter by date + work_type
- **Monthly Reports** — Group by month
- **Export to Excel** — `xlsx` package + server action
- **Analytics Dashboard** — `recharts` charts

---

## 📝 License

Private — All rights reserved. © 2026 Tracker Corp.
