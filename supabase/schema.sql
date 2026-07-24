-- ============================================================
-- Employee Daily Work Tracker — Supabase Schema
-- Run this in the Supabase SQL Editor (in order)
-- ============================================================

-- ── 1. Enable UUID extension ────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── 2. Employees Table ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.employees (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id      TEXT        UNIQUE NOT NULL,
  full_name        TEXT        NOT NULL,
  date_of_birth    DATE,
  gender           TEXT        CHECK (gender IN ('Male', 'Female', 'Other')),
  personal_email   TEXT        UNIQUE NOT NULL,
  contact_number   TEXT,
  is_active        BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast email lookup (used in auth callback)
CREATE INDEX IF NOT EXISTS idx_employees_email ON public.employees (personal_email);
CREATE INDEX IF NOT EXISTS idx_employees_active ON public.employees (is_active);

-- ── 3. Daily Work Table ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.daily_work (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_uuid   UUID        NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  employee_id     TEXT        NOT NULL,
  work_date       DATE        NOT NULL DEFAULT CURRENT_DATE,
  work_type       TEXT        NOT NULL CHECK (
                                work_type IN (
                                  'OIF', 'IT', 'TRAVEL',
                                  'HALF DAY TRAVEL', 'LEAVE',
                                  'EMERGENCY LEAVE', 'OTHER'
                                )
                              ),
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Core security constraint: ONE submission per employee per calendar day
  CONSTRAINT unique_employee_work_date UNIQUE (employee_uuid, work_date)
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_daily_work_employee_uuid ON public.daily_work (employee_uuid);
CREATE INDEX IF NOT EXISTS idx_daily_work_date ON public.daily_work (work_date);
CREATE INDEX IF NOT EXISTS idx_daily_work_employee_date ON public.daily_work (employee_uuid, work_date);

-- ── 4. Auto-update updated_at trigger ──────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_employees_updated
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ── 5. Enable Row Level Security ────────────────────────────
ALTER TABLE public.employees  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_work ENABLE ROW LEVEL SECURITY;

-- ── 6. RLS Policies: employees table ────────────────────────

-- Employees can only read their OWN profile row
CREATE POLICY "employees_select_own"
  ON public.employees
  FOR SELECT
  USING (personal_email = auth.jwt() ->> 'email');

-- No INSERT/UPDATE/DELETE for employees (admin only via service role)
-- Admin uses service_role key which bypasses RLS

-- ── 7. RLS Policies: daily_work table ───────────────────────

-- Employees can read only their own submissions
CREATE POLICY "daily_work_select_own"
  ON public.daily_work
  FOR SELECT
  USING (
    employee_uuid IN (
      SELECT id FROM public.employees
      WHERE personal_email = auth.jwt() ->> 'email'
    )
  );

-- Employees can insert only their own submission
-- The UNIQUE constraint ensures only one per day
CREATE POLICY "daily_work_insert_own"
  ON public.daily_work
  FOR INSERT
  WITH CHECK (
    employee_uuid IN (
      SELECT id FROM public.employees
      WHERE personal_email = auth.jwt() ->> 'email'
        AND is_active = TRUE
    )
  );

-- NO UPDATE policy — submissions cannot be modified
-- NO DELETE policy — submissions cannot be deleted

-- ── 8. Sample Data (Run only for testing) ───────────────────
-- Uncomment to insert test employees
/*
INSERT INTO public.employees (employee_id, full_name, date_of_birth, gender, personal_email, contact_number, is_active)
VALUES
  ('EMP101', 'Ponraj Kumar', '1995-04-15', 'Male', 'ponraj.kumar@gmail.com', '9876543210', TRUE),
  ('EMP102', 'Anita Sharma', '1992-08-22', 'Female', 'anita.sharma@gmail.com', '9876543211', TRUE),
  ('EMP103', 'Rahul Singh', '1990-12-10', 'Male', 'rahul.singh@gmail.com', '9876543212', TRUE);
*/

-- ── 9. Verification Queries ─────────────────────────────────
-- Run these to verify the setup:
-- SELECT * FROM public.employees;
-- SELECT * FROM public.daily_work;
-- SELECT schemaname, tablename, policyname, cmd, qual FROM pg_policies WHERE tablename IN ('employees', 'daily_work');
