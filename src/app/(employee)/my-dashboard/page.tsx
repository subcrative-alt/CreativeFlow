import { createClient } from "@/lib/supabase/server";
import {
  Camera,
  Film,
  CheckCircle2,
  Clock,
  AlertCircle,
  Play,
  Upload,
  Calendar,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { UserRole } from "@/types/database";

export default async function EmployeeDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id || "")
    .single();

  const role: UserRole = (profile?.role as UserRole) || "video_editor";
  const isPhotographer = role === "photographer";

  // Fetch tasks assigned to this user from Supabase
  const { data: assignedTasks } = await supabase
    .from("tasks")
    .select("*, project:projects(name, client_name)")
    .eq("assigned_to", user?.id || "");

  const tasks = assignedTasks || [];
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress" || t.status === "accepted");
  const submittedTasks = tasks.filter((t) => t.status === "submitted");
  const revisionTasks = tasks.filter((t) => t.status === "revision_requested");
  const completedTasks = tasks.filter((t) => t.status === "completed" || t.status === "approved");

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Employee Workstation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                isPhotographer
                  ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900"
                  : "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900"
              }`}
            >
              {isPhotographer ? "Photographer Workstation" : "Video Editor Workstation"}
            </span>
            <span className="text-xs text-slate-400">• Asia/Dhaka Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1.5">
            Welcome, {profile?.full_name || "Creator"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isPhotographer
              ? "Manage scheduled photo sessions, gear checklists, and deliver raw media."
              : "Review assigned timelines, render aspect-ratio formats, and submit drafts for approval."}
          </p>
        </div>

        {/* Morning Check-in CTA Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/checkin"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/20 hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Clock className="h-4 w-4" />
            Daily Check-in
          </Link>
          <Link
            href="/my-tasks"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-sm transition-all"
          >
            All My Tasks ({tasks.length})
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Active Tasks</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {inProgressTasks.length}
            </span>
            <span className="text-xs text-blue-600 font-semibold">In Progress</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-medium text-slate-500">In Creative Review</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
              {submittedTasks.length}
            </span>
            <span className="text-xs text-purple-600 font-semibold">Awaiting Head</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Revisions Requested</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
              {revisionTasks.length}
            </span>
            <span className="text-xs text-rose-600 font-semibold">Action needed</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Delivered & Approved</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {completedTasks.length}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">Production ready</span>
          </div>
        </div>
      </div>

      {/* Role-Specific Workstation Core */}
      {isPhotographer ? (
        /* PHOTOGRAPHER WORKSTATION VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Shoot Sessions & Shot List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Camera className="h-5 w-5 text-amber-500" />
                  Upcoming Photography Shoot Sessions
                </h2>
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 font-semibold">
                  Today in Dhaka
                </span>
              </div>

              {/* Sample Shoot Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Client: Apex Footwear • Campaign: Spring 2026
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      Summer Leather Collection — Model & Product Lookbook
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-amber-600 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 shrink-0">
                    2:30 PM – 5:30 PM (BST)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <div>
                    <strong className="text-slate-900 dark:text-white">Location:</strong> Gulshan Studio 4, Dhaka
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Product SKU:</strong> APX-LEA-4091
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Model Specs:</strong> 1 Female Model (Casual Outdoor)
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Deliverable:</strong> High-Res RAW + JPEGs
                  </div>
                </div>

                {/* Shot List Checklist */}
                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    Shot List (3 of 4 Completed):
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <input type="checkbox" defaultChecked className="rounded text-blue-600 h-4 w-4" />
                      <span className="line-through text-slate-400">Front angle 45-degree hero product shot</span>
                    </label>
                    <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <input type="checkbox" defaultChecked className="rounded text-blue-600 h-4 w-4" />
                      <span className="line-through text-slate-400">Close-up macro texture & stitching</span>
                    </label>
                    <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <input type="checkbox" defaultChecked className="rounded text-blue-600 h-4 w-4" />
                      <span className="line-through text-slate-400">Model walking lifestyle sequence</span>
                    </label>
                    <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <input type="checkbox" className="rounded text-blue-600 h-4 w-4" />
                      <span className="font-medium">Flat lay with complementary accessories</span>
                    </label>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm">
                    <Upload className="h-3.5 w-3.5" />
                    Upload Raw Footage
                  </button>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Mark Shoot Completed
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Equipment Checklists */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-500" />
                Equipment Checklist
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Verify all camera bodies and lighting gear are packed before heading out.
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                  <span className="font-medium text-slate-800 dark:text-slate-200">Sony A7 IV + 24-70mm GM II</span>
                  <span className="text-[10px] font-bold text-emerald-600 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950">Packed</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                  <span className="font-medium text-slate-800 dark:text-slate-200">Godox AD400 Pro + Softbox</span>
                  <span className="text-[10px] font-bold text-emerald-600 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950">Packed</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                  <span className="font-medium text-slate-800 dark:text-slate-200">4x 128GB V90 SD Cards</span>
                  <span className="text-[10px] font-bold text-emerald-600 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950">Formatted</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                  <span className="font-medium text-slate-800 dark:text-slate-200">C-Stands & Sandbags</span>
                  <span className="text-[10px] font-bold text-amber-600 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950">Check in Van</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* VIDEO EDITOR WORKSTATION VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Editing Projects */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Film className="h-5 w-5 text-blue-500" />
                  Active Video Editing Projects
                </h2>
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 font-semibold">
                  Premiere / DaVinci Pipeline
                </span>
              </div>

              {/* Sample Video Project Card */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                        9:16 Vertical Cut
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        Target Duration: 45s
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">
                      Apex Footwear — Instagram & TikTok Teaser Reel
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900 shrink-0">
                    Due Today 6:00 PM
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Fast-paced cuts timed to beat. Add dynamic kinetic captions and sound design sweeps. Color grade in Rec.709 with vibrant summer tones.
                </p>

                {/* Asset Links & Stems */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block font-semibold">RAW FOOTAGE</span>
                    <span className="font-semibold text-blue-600 truncate block">Drive Folder ↗</span>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block font-semibold">VOICEOVER</span>
                    <span className="font-semibold text-emerald-600 truncate block">Bengali_VO.wav</span>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block font-semibold">MUSIC TRACK</span>
                    <span className="font-semibold text-purple-600 truncate block">Energetic_Beat.mp3</span>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block font-semibold">CAPTIONS</span>
                    <span className="font-semibold text-amber-600 truncate block">Subtitles.srt</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1.5">
                      <Play className="h-3 w-3" />
                      Start Timer
                    </button>
                  </div>
                  <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 cursor-pointer">
                    <Upload className="h-3.5 w-3.5" />
                    Submit Video Draft for Review
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Revision Feedback & Notes */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-purple-500" />
                Creative Head Feedback
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Structured feedback and timestamps for requested revisions.
              </p>

              <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-purple-900 dark:text-purple-300">
                  <span>Re: YouTube Main Cut</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-200 dark:bg-purple-900">v2 Revision</span>
                </div>
                <p className="text-purple-800 dark:text-purple-300 text-xs leading-relaxed">
                  "At 0:14 please trim the pause before the model speaks. The logo sting at the end needs to be 100% white on dark background."
                </p>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 block pt-1 border-t border-purple-200/50">
                  Reviewed by Creative Head • 1 hour ago
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
