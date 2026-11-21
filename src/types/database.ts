export type UserRole = "creative_head" | "video_editor" | "photographer";
export type ProjectPriority = "low" | "medium" | "high" | "urgent";
export type ProjectStatus = "planning" | "active" | "on_hold" | "completed" | "cancelled";
export type TaskDepartment = "photography" | "video_editing" | "creative_review" | "general";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskStatus =
  | "pending"
  | "accepted"
  | "in_progress"
  | "submitted"
  | "revision_requested"
  | "approved"
  | "completed"
  | "cancelled"
  | "blocked";
export type ApprovalStatus = "pending" | "approved" | "revision_requested" | "rejected";
export type CheckinStatus = "present" | "absent" | "on_leave";
export type VideoAspectRatio = "9:16" | "16:9" | "1:1";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string | null;
  avatar_url?: string | null;
  timezone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  client_name: string;
  start_date: string;
  deadline: string;
  priority: ProjectPriority;
  status: ProjectStatus;
  folder_url?: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  tasks_count?: number;
  completed_tasks_count?: number;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description?: string | null;
  department: TaskDepartment;
  assigned_to?: string | null;
  created_by: string;
  start_date?: string | null;
  start_time?: string | null;
  due_date: string;
  due_time: string;
  estimated_hours: number;
  actual_hours: number;
  priority: TaskPriority;
  status: TaskStatus;
  deliverable_url?: string | null;
  rejection_reason?: string | null;
  video_specs?: {
    aspect_ratio?: VideoAspectRatio;
    duration_seconds?: number;
    has_subtitles?: boolean;
    audio_tracks?: string[];
  } | null;
  created_at: string;
  updated_at: string;
  assignee?: Profile | null;
  project?: Project | null;
}

export interface DailyCheckin {
  id: string;
  user_id: string;
  checkin_date: string;
  morning_checkin_time?: string | null;
  is_available: boolean;
  morning_notes?: string | null;
  eod_submission_time?: string | null;
  eod_notes?: string | null;
  tomorrow_plan?: string | null;
  delays_reason?: string | null;
  status: CheckinStatus;
  created_at: string;
  updated_at: string;
  profile?: Profile | null;
}

export interface ShootSchedule {
  id: string;
  task_id: string;
  product_name: string;
  product_sku?: string | null;
  shoot_date: string;
  shoot_start_time: string;
  shoot_end_time: string;
  location_name: string;
  location_address?: string | null;
  model_requirements?: string | null;
  outfit_specs?: string | null;
  shot_list: Array<{ id: number; description: string; completed: boolean }>;
  camera_equipment_checklist: Array<{ item: string; packed: boolean }>;
  lighting_checklist: Array<{ item: string; packed: boolean }>;
  raw_images_folder_url?: string | null;
}

export interface Approval {
  id: string;
  task_id: string;
  reviewer_id: string;
  status: ApprovalStatus;
  review_notes?: string | null;
  revision_number: number;
  deliverable_version_url?: string | null;
  reviewed_at?: string | null;
  created_at: string;
}

export interface SystemNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  task_id?: string | null;
  project_id?: string | null;
  is_read: boolean;
  created_at: string;
}
