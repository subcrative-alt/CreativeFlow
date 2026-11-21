import { createClient } from "@/lib/supabase/server";
import { CheckSquare, Clock, AlertCircle, Play, Pause, Upload, CheckCircle2, XCircle } from "lucide-react";

export default async function EmployeeTasksPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: rawTasks } = await supabase
    .from("tasks")
    .select("*, project:projects(name, client_name)")
    .eq("assigned_to", user?.id || "");

  const tasks = rawTasks && rawTasks.length > 0 ? rawTasks : [
    {
      id: "t-mine-1",
      title: "Apex Leather Sneaker — 9:16 Instagram Reel Edit",
      department: "video_editing",
      priority: "urgent",
      status: "in_progress",
      due_date: "2026-11-21",
      due_time: "18:00:00",
      estimated_hours: 5.0,
      actual_hours: 2.5,
      project: { name: "Apex Footwear Summer 2026", client_name: "Apex Footwear Ltd." },
      description: "Cut dynamic short-form social video synchronized to upbeat electronic music. Render in 1080x1920 MP4.",
    },
    {
      id: "t-mine-2",
      title: "Grameenphone 5G Studio Commercial — 16:9 Cut v2",
      department: "video_editing",
      priority: "high",
      status: "pending",
      due_date: "2026-11-24",
      due_time: "18:00:00",
      estimated_hours: 8.0,
      actual_hours: 0,
      project: { name: "Grameenphone 5G Studio Commercial", client_name: "Grameenphone" },
      description: "Implement motion graphics particle pass and color grade in Rec.709.",
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          My Assigned Workstation Tasks
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Accept or reject tasks with reasons, log hours, track deadlines, and submit deliverables for Creative Head review.
        </p>
      </div>

      <div className="space-y-4">
        {tasks.map((task: any) => (
          <div
            key={task.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/40">
                    {task.project?.client_name || "Client"}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      task.status === "in_progress"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600"
                    }`}
                  >
                    {task.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                  {task.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {task.description}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-semibold text-rose-600 block">
                  Due {task.due_date} • 6:00 PM (BST)
                </span>
                <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                  Est: {task.estimated_hours}h | Logged: {task.actual_hours}h
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {task.status === "pending" ? (
                <div className="flex items-center gap-2">
                  <button className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm cursor-pointer">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Accept Assignment
                  </button>
                  <button className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 flex items-center gap-1.5 cursor-pointer">
                    <XCircle className="h-3.5 w-3.5" />
                    Reject with Reason
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <Play className="h-3.5 w-3.5 text-blue-500" />
                    Resume Work Timer
                  </button>
                </div>
              )}

              <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer">
                <Upload className="h-3.5 w-3.5" />
                Upload Deliverable & Submit for Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
