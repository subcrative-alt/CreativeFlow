-- ====================================================================
-- CREATIVEFLOW ONE-CLICK COMPLETE SUPABASE DATABASE SETUP
-- Run this in: https://supabase.com/dashboard/project/emdwruwzqpxmiiritneb/sql/new
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN CREATE TYPE user_role AS ENUM ('creative_head', 'video_editor', 'photographer'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE project_priority AS ENUM ('low', 'medium', 'high', 'urgent'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE project_status AS ENUM ('planning', 'active', 'on_hold', 'completed', 'cancelled'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE task_department AS ENUM ('photography', 'video_editing', 'creative_review', 'general'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE task_status AS ENUM ('pending', 'accepted', 'in_progress', 'submitted', 'revision_requested', 'approved', 'completed', 'cancelled', 'blocked'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE dependency_type AS ENUM ('finish_to_start', 'start_to_start'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'revision_requested', 'rejected'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'video_editor',
    phone TEXT,
    avatar_url TEXT,
    timezone TEXT NOT NULL DEFAULT 'Asia/Dhaka',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    client_name TEXT NOT NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    deadline DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '14 days'),
    priority project_priority NOT NULL DEFAULT 'medium',
    status project_status NOT NULL DEFAULT 'active',
    folder_url TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TASKS TABLE
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    department task_department NOT NULL DEFAULT 'general',
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_by UUID REFERENCES public.profiles(id),
    start_date DATE DEFAULT CURRENT_DATE,
    start_time TIME DEFAULT '10:00:00',
    due_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '3 days'),
    due_time TIME NOT NULL DEFAULT '18:00:00',
    estimated_hours NUMERIC(5,2) DEFAULT 0.0,
    actual_hours NUMERIC(5,2) DEFAULT 0.0,
    priority task_priority NOT NULL DEFAULT 'medium',
    status task_status NOT NULL DEFAULT 'pending',
    deliverable_url TEXT,
    rejection_reason TEXT,
    video_specs JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. DAILY CHECKINS TABLE
CREATE TABLE IF NOT EXISTS public.daily_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
    morning_checkin_time TIMESTAMPTZ,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    morning_notes TEXT,
    eod_submission_time TIMESTAMPTZ,
    eod_notes TEXT,
    tomorrow_plan TEXT,
    delays_reason TEXT,
    status TEXT NOT NULL DEFAULT 'present',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_daily_checkin UNIQUE (user_id, checkin_date)
);

-- 7. SHOOT SCHEDULES TABLE
CREATE TABLE IF NOT EXISTS public.shoot_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL UNIQUE REFERENCES public.tasks(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    product_sku TEXT,
    shoot_date DATE NOT NULL DEFAULT CURRENT_DATE,
    shoot_start_time TIME NOT NULL DEFAULT '14:30:00',
    shoot_end_time TIME NOT NULL DEFAULT '17:30:00',
    location_name TEXT NOT NULL,
    location_address TEXT,
    model_requirements TEXT,
    outfit_specs TEXT,
    shot_list JSONB NOT NULL DEFAULT '[]'::jsonb,
    camera_equipment_checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
    lighting_checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
    raw_images_folder_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. AUTO-CONFIRM USERS & AUTO-SYNC PROFILES
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    assigned_role user_role;
    user_name TEXT;
BEGIN
    -- Automatically confirm email so login never blocks
    NEW.email_confirmed_at := COALESCE(NEW.email_confirmed_at, NOW());
    NEW.confirmed_at := COALESCE(NEW.confirmed_at, NOW());

    IF NEW.email LIKE 'head%' OR NEW.raw_user_meta_data->>'role' = 'creative_head' THEN
        assigned_role := 'creative_head'::user_role;
    ELSIF NEW.email LIKE 'photo%' OR NEW.raw_user_meta_data->>'role' = 'photographer' THEN
        assigned_role := 'photographer'::user_role;
    ELSE
        assigned_role := 'video_editor'::user_role;
    END IF;

    user_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        CASE 
            WHEN assigned_role = 'creative_head' THEN 'Creative Head (Admin)'
            WHEN assigned_role = 'photographer' THEN 'Lead Photographer'
            WHEN NEW.email LIKE '%editor1%' THEN 'Video Editor 01'
            WHEN NEW.email LIKE '%editor2%' THEN 'Video Editor 02'
            ELSE split_part(NEW.email, '@', 1)
        END
    );

    INSERT INTO public.profiles (id, email, full_name, role, timezone)
    VALUES (NEW.id, NEW.email, user_name, assigned_role, 'Asia/Dhaka')
    ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    BEFORE INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. CONFIRM ANY EXISTING USERS (INCLUDING head@creativeflow.com)
UPDATE auth.users
SET email_confirmed_at = NOW(), confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- Backfill profile for any existing users
INSERT INTO public.profiles (id, email, full_name, role, timezone)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
    CASE 
        WHEN email LIKE 'head%' THEN 'creative_head'::user_role
        WHEN email LIKE 'photo%' THEN 'photographer'::user_role
        ELSE 'video_editor'::user_role
    END,
    'Asia/Dhaka'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shoot_schedules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are readable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles are readable by authenticated users" ON public.profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());

DROP POLICY IF EXISTS "Projects viewable by authenticated users" ON public.projects;
CREATE POLICY "Projects viewable by authenticated users" ON public.projects FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Tasks viewable by authenticated users" ON public.tasks;
CREATE POLICY "Tasks viewable by authenticated users" ON public.tasks FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Checkins viewable by authenticated users" ON public.daily_checkins;
CREATE POLICY "Checkins viewable by authenticated users" ON public.daily_checkins FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Shoot schedules viewable by authenticated users" ON public.shoot_schedules;
CREATE POLICY "Shoot schedules viewable by authenticated users" ON public.shoot_schedules FOR ALL TO authenticated USING (true);

-- 11. INITIAL SAMPLE DATA
DO $$
DECLARE
    head_id UUID;
    p_id UUID;
BEGIN
    SELECT id INTO head_id FROM public.profiles WHERE role = 'creative_head' LIMIT 1;
    
    IF head_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.projects LIMIT 1) THEN
        INSERT INTO public.projects (id, name, description, client_name, priority, status, created_by)
        VALUES (
            gen_random_uuid(),
            'Apex Footwear — Summer Campaign 2026',
            'Full multimedia campaign: 9:16 reels, 16:9 YouTube commercial, and studio photography.',
            'Apex Footwear Ltd.',
            'high',
            'active',
            head_id
        ) RETURNING id INTO p_id;

        INSERT INTO public.tasks (title, description, department, priority, status, project_id, created_by, estimated_hours)
        VALUES 
            ('Gulshan Studio Fashion Shoot', 'High-res RAW photo capture with model lookbook.', 'photography', 'high', 'completed', p_id, head_id, 4.0),
            ('Edit 9:16 Instagram Reel with Beat Cuts', 'Cut vertical teaser video synced to electronic beat.', 'video_editing', 'urgent', 'in_progress', p_id, head_id, 6.0);
    END IF;
END $$;
