import { createClient } from "@/lib/supabase/server";
import { BarChart3, Download, TrendingUp, CheckCircle, Clock, RotateCcw } from "lucide-react";

export default async function AdminReportsPage() {
  const stats = [
    { label: "Overall Task Completion", value: "92.4%", change: "+4.1% vs last month", icon: CheckCircle, color: "text-emerald-500" },
    { label: "On-Time Delivery Rate", value: "88.6%", change: "+2.3% vs target", icon: Clock, color: "text-blue-500" },
    { label: "Avg. Revision Turnaround", value: "1.2 rounds", change: "Within threshold", icon: RotateCcw, color: "text-purple-500" },
    { label: "Studio Productivity Index", value: "9.4 / 10", change: "Top quartile", icon: TrendingUp, color: "text-indigo-500" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Performance Reports & Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Weekly and monthly team throughput, delivery punctuality, and revision logs.
          </p>
        </div>

        <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 shadow-sm flex items-center gap-1.5 cursor-pointer">
          <Download className="h-4 w-4" />
          Export CSV Report
        </button>
      </div>

      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{s.label}</span>
                <Icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{s.value}</span>
                <span className="text-[10px] text-emerald-600 font-semibold">{s.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Member-Wise Productivity Audit */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Individual Member Performance Breakdown
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Team Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Tasks Completed</th>
                <th className="py-3 px-4">Hours Logged</th>
                <th className="py-3 px-4">On-Time Rate</th>
                <th className="py-3 px-4">Avg. Revisions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Lead Photographer</td>
                <td className="py-3.5 px-4">Photographer</td>
                <td className="py-3.5 px-4 font-semibold">15 Shoots</td>
                <td className="py-3.5 px-4">62.5 hrs</td>
                <td className="py-3.5 px-4 text-emerald-600 font-semibold">96.0%</td>
                <td className="py-3.5 px-4">0.4 / shoot</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Video Editor 01</td>
                <td className="py-3.5 px-4">Video Editor</td>
                <td className="py-3.5 px-4 font-semibold">12 Edits</td>
                <td className="py-3.5 px-4">74.0 hrs</td>
                <td className="py-3.5 px-4 text-emerald-600 font-semibold">91.5%</td>
                <td className="py-3.5 px-4">1.1 / video</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Video Editor 02</td>
                <td className="py-3.5 px-4">Video Editor</td>
                <td className="py-3.5 px-4 font-semibold">9 Edits</td>
                <td className="py-3.5 px-4">68.5 hrs</td>
                <td className="py-3.5 px-4 text-emerald-600 font-semibold">89.0%</td>
                <td className="py-3.5 px-4">1.3 / video</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
