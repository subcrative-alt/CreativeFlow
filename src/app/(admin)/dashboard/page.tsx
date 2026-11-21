import { createClient } from "@/lib/supabase/server";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck2,
  Users,
  ArrowUpRight,
  Sparkles,
  Camera,
  Film,
  Plus,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch real database metrics
  const [{ count: totalProjects }, { count: totalTasks }, { data: rawTasks }, { data: teamMembers }] =
    await Promise.all([
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("tasks").select("*", { count: "exact", head: true }),
      supabase.from("tasks").select("*, assigned_user:profiles(full_name, role, avatar_url)"),
      supabase.from("profiles").select("*").neq("role", "creative_head"),
    ]);

  // Aggregate task statuses
  const tasks = rawTasks || [];
  const inProgressCount = tasks.filter((t) => t.status === "in_progress" || t.status === "accepted").length;
  const completedCount = tasks.filter((t) => t.status === "completed" || t.status === "approved").length;
  const reviewCount = tasks.filter((t) => t.status === "submitted").length;
  const overdueCount = tasks.filter((t) => {
    if (t.status === "completed" || t.status === "approved" || !t.due_date) return false;
    return new Date(t.due_date) < new Date();
  }).length;

  const kpis = [
    {
      title: "Active Projects",
      value: totalProjects ?? 0,
      change: "+2 this month",
      icon: FolderKanban,
      color: "from-blue-600 to-indigo-600",
      accent: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Tasks In Progress",
      value: inProgressCount,
      change: `${tasks.length} total tasks`,
      icon: Clock,
      color: "from-amber-500 to-orange-600",
      accent: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "Awaiting Review",
      value: reviewCount,
      change: "Action required",
      icon: FileCheck2,
      color: "from-purple-600 to-pink-600",
      accent: "text-purple-600 dark:text-purple-400",
      highlight: reviewCount > 0,
    },
    {
      title: "Overdue Deliverables",
      value: overdueCount,
      change: overdueCount > 0 ? "Requires attention" : "All on schedule",
      icon: AlertTriangle,
      color: "from-rose-600 to-red-600",
      accent: "text-rose-600 dark:text-rose-400",
    },
  ];

  // Team roster default representation
  const defaultTeam = [
    {
      name: "Video Editor 01",
      role: "Video Editor",
      assignedCount: 4,
      completedCount: 12,
      status: "Active on YouTube Vlog #14",
      avatar: "VE1",
      icon: Film,
    },
    {
      name: "Video Editor 02",
      role: "Video Editor",
      assignedCount: 3,
      completedCount: 9,
      status: "Rendering 9:16 Instagram Reels",
      avatar: "VE2",
      icon: Film,
    },
    {
      name: "Lead Photographer",
      role: "Photographer",
      assignedCount: 2,
      completedCount: 15,
      status: "On Location (Gulshan Studio)",
      avatar: "PH",
      icon: Camera,
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header & Fast Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-900/40">
              Creative Operations Command
            </span>
            <span className="text-xs text-slate-400">• Asia/Dhaka Node</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1.5">
            Creative Head Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time production velocity, dependency pipelines, and team workload.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/tasks"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-sm transition-all"
          >
            View Kanban Board
          </Link>
          <Link
            href="/projects"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
                kpi.highlight
                  ? "border-purple-300 dark:border-purple-800 ring-2 ring-purple-500/10 shadow-lg shadow-purple-500/5"
                  : "border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{kpi.title}</span>
                <div className={`p-2 rounded-xl bg-gradient-to-tr ${kpi.color} text-white shadow-sm`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {kpi.value}
                </span>
                <span className={`text-[11px] font-medium ${kpi.accent}`}>{kpi.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Automated Dependency Pipeline Visualizer */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              Automated Creative Pipeline Engine
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tasks unlock sequentially: Downstream editing tasks remain blocked until photography raw assets are approved.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold">
            Auto-Transition Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {[
            { step: "01", title: "Shoot & Gear Plan", role: "Photographer", status: "Completed", color: "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400" },
            { step: "02", title: "Raw Media Ingest", role: "Photographer", status: "Verified", color: "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400" },
            { step: "03", title: "Video Editing", role: "Video Editor", status: "In Progress", color: "border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400" },
            { step: "04", title: "Creative Review", role: "Creative Head", status: "Gatekeeper", color: "border-purple-500/50 bg-purple-50/50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400" },
            { step: "05", title: "Final Master Export", role: "System", status: "Pending", color: "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-500" },
          ].map((item, idx) => (
            <div key={item.step} className={`p-3.5 rounded-xl border ${item.color} relative`}>
              <div className="flex items-center justify-between text-[10px] font-bold tracking-wider">
                <span>STAGE {item.step}</span>
                <span className="font-semibold">{item.status}</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">{item.title}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Assigned: {item.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column Section: Team Capacity & Workload + Review Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Workload & Presence */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                Creative Team Workload & Attendance
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Current capacity and task distribution across Dhaka team members.
              </p>
            </div>
            <Link
              href="/team"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Manage Roster
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {defaultTeam.map((member) => {
              const Icon = member.icon;
              return (
                <div key={member.name} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300 shrink-0">
                      <Icon className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{member.name}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {member.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{member.status}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0 text-right">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{member.assignedCount} Active</div>
                      <div className="text-[10px] text-slate-400">{member.completedCount} Completed</div>
                    </div>
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" title="Morning Check-in Complete" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Approvals Gatekeeper Fast Queue */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-purple-500" />
                Review Gatekeeper
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                {reviewCount} Pending
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Submitted creative drafts requiring Creative Head sign-off before downstream exports can activate.
            </p>

            <div className="mt-4 space-y-3">
              {reviewCount === 0 ? (
                <div className="p-6 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">All submissions reviewed</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">No pending approval requests in the queue.</p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/60 text-xs">
                  <span className="font-bold text-purple-900 dark:text-purple-300">New draft ready for review</span>
                  <p className="text-purple-700 dark:text-purple-400 text-[11px] mt-0.5">
                    Spring Campaign Hero Video (9:16 Vertical Cut)
                  </p>
                </div>
              )}
            </div>
          </div>

          <Link
            href="/approvals"
            className="mt-6 w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all text-center cursor-pointer"
          >
            Open Approvals Workstation
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
