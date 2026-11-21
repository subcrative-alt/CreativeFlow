import { createClient } from "@/lib/supabase/server";
import { CheckSquare, Plus, Clock, Filter, AlertCircle, Camera, Film, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export default async function AdminTasksPage() {
  const supabase = await createClient();

  const { data: rawTasks } = await supabase
    .from("tasks")
    .select("*, project:projects(name), assignee:profiles(full_name, role)");

  // Default tasks for initial preview if DB has not been seeded yet
  const tasks = rawTasks && rawTasks.length > 0 ? rawTasks : [
    {
      id: "t1",
      title: "Shoot Apex Leather Summer Sneaker",
      department: "photography",
      priority: "high",
      status: "completed",
      due_date: "2026-11-20",
      estimated_hours: 4.5,
      project: { name: "Apex Footwear Summer 2026" },
      assignee: { full_name: "Lead Photographer" },
    },
    {
      id: "t2",
      title: "Raw Footage Color Conversion & Ingestion",
      department: "photography",
      priority: "medium",
      status: "completed",
      due_date: "2026-11-21",
      estimated_hours: 2.0,
      project: { name: "Apex Footwear Summer 2026" },
      assignee: { full_name: "Lead Photographer" },
    },
    {
      id: "t3",
      title: "Edit 9:16 Instagram Reel with Beat Cuts",
      department: "video_editing",
      priority: "urgent",
      status: "in_progress",
      due_date: "2026-11-22",
      estimated_hours: 6.0,
      project: { name: "Apex Footwear Summer 2026" },
      assignee: { full_name: "Video Editor 01" },
    },
    {
      id: "t4",
      title: "Grameenphone 5G Particle VFX Animation",
      department: "video_editing",
      priority: "high",
      status: "submitted",
      due_date: "2026-11-23",
      estimated_hours: 8.0,
      project: { name: "Grameenphone 5G Studio Commercial" },
      assignee: { full_name: "Video Editor 02" },
    },
    {
      id: "t5",
      title: "Audio Mastering & Sound Design Polish",
      department: "video_editing",
      priority: "medium",
      status: "pending",
      due_date: "2026-11-25",
      estimated_hours: 3.5,
      project: { name: "Grameenphone 5G Studio Commercial" },
      assignee: { full_name: "Video Editor 01" },
    },
  ];

  const columns = [
    { id: "pending", title: "Pending / Blocked", color: "border-slate-300 dark:border-slate-700 bg-slate-100/50" },
    { id: "in_progress", title: "In Progress", color: "border-blue-400 dark:border-blue-800 bg-blue-50/20" },
    { id: "submitted", title: "In Review", color: "border-purple-400 dark:border-purple-800 bg-purple-50/20" },
    { id: "completed", title: "Completed / Approved", color: "border-emerald-400 dark:border-emerald-800 bg-emerald-50/20" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Master Task Workflow
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kanban board tracking dependent state machines across Photography and Video Editing.
          </p>
        </div>

        <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 cursor-pointer">
          <Plus className="h-4 w-4" />
          Create Task
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => {
            if (col.id === "completed") return t.status === "completed" || t.status === "approved";
            if (col.id === "in_progress") return t.status === "in_progress" || t.status === "accepted";
            return t.status === col.id;
          });

          return (
            <div
              key={col.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm min-h-[500px] flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  {col.title}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List in Column */}
              <div className="space-y-3 flex-1">
                {colTasks.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    No tasks
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 shadow-xs hover:shadow-md transition-all space-y-2.5 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider truncate max-w-[150px]">
                          {task.project?.name || "CreativeFlow Project"}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            task.priority === "urgent"
                              ? "bg-rose-100 text-rose-700"
                              : task.priority === "high"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {task.priority.toUpperCase()}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {task.title}
                      </h4>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          {task.department === "photography" ? (
                            <Camera className="h-3 w-3 text-amber-500" />
                          ) : (
                            <Film className="h-3 w-3 text-blue-500" />
                          )}
                          <span className="truncate max-w-[90px]">{task.assignee?.full_name || "Unassigned"}</span>
                        </span>
                        <span className="font-mono text-[10px]">{task.estimated_hours}h</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
