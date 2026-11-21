import { createClient } from "@/lib/supabase/server";
import { FolderKanban, Plus, Calendar, Clock, ArrowUpRight, Search, Filter } from "lucide-react";
import Link from "next/link";

export default async function AdminProjectsPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*, tasks(id, status)");

  const projectList = projects || [
    {
      id: "p1",
      name: "Apex Footwear — Summer Campaign 2026",
      client_name: "Apex Footwear Ltd.",
      description: "Complete multimedia brand campaign including 4K YouTube hero commercial, 6x vertical reels, and high-res billboard photography.",
      start_date: "2026-11-15",
      deadline: "2026-12-05",
      status: "active",
      priority: "high",
      folder_url: "https://drive.google.com/drive/folders/demo",
      tasks: [{ id: "t1", status: "completed" }, { id: "t2", status: "in_progress" }, { id: "t3", status: "pending" }],
    },
    {
      id: "p2",
      name: "Grameenphone 5G Studio Commercial",
      client_name: "Grameenphone",
      description: "High-octane VFX video editing and motion graphics showcase for new fiber network launch.",
      start_date: "2026-11-18",
      deadline: "2026-11-28",
      status: "active",
      priority: "urgent",
      folder_url: "https://drive.google.com/drive/folders/demo2",
      tasks: [{ id: "t4", status: "in_progress" }],
    },
    {
      id: "p3",
      name: "Aarong Heritage Silk Collection Shoot",
      client_name: "Aarong",
      description: "Studio and outdoor fashion photography across Dhaka heritage landmarks.",
      start_date: "2026-11-01",
      deadline: "2026-11-14",
      status: "completed",
      priority: "medium",
      folder_url: "https://drive.google.com/drive/folders/demo3",
      tasks: [{ id: "t5", status: "completed" }, { id: "t6", status: "completed" }],
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Projects Portfolio
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage client campaigns, track progress, and organize master media folders.
          </p>
        </div>

        <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 cursor-pointer">
          <Plus className="h-4 w-4" />
          Create New Project
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter projects by client or name..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Status:</span>
          <select className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            <option>All Projects</option>
            <option>Active</option>
            <option>Planning</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectList.map((project) => {
          const totalTasks = project.tasks?.length || 0;
          const completedTasks = project.tasks?.filter((t: any) => t.status === "completed").length || 0;
          const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

          return (
            <div
              key={project.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/40">
                    {project.client_name}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      project.priority === "urgent"
                        ? "bg-rose-50 text-rose-600 border border-rose-200"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {project.priority.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3 leading-snug">
                  {project.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">Task Completion</span>
                    <span className="font-bold text-slate-900 dark:text-white">{progressPercent}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Due {project.deadline}
                  </span>
                  {project.folder_url && (
                    <a
                      href={project.folder_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      Drive Assets
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
