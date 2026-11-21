import { Settings, ShieldCheck, Database, Globe, Cloud, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Workspace Settings & Infrastructure
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Production environment variables, Supabase cloud connection, and Row Level Security audits.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="h-4 w-4 text-blue-500" />
            Supabase PostgreSQL Infrastructure
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cloud database project hosting the 13 relational tables and automated workflow triggers.
          </p>

          <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Project Endpoint:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">https://emdwruwzqpxmiiritneb.supabase.co</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Row Level Security (RLS):</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Enforced on All 13 Tables
              </span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="h-4 w-4 text-indigo-500" />
            Timezone & Regional Operations
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Operating timezone for morning attendance, due date badges, and shoot schedules.
          </p>

          <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs flex items-center justify-between">
            <span className="text-slate-500">Active Node Timezone:</span>
            <span className="font-mono font-semibold text-slate-900 dark:text-white">Asia/Dhaka (BST, UTC+6)</span>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cloud className="h-4 w-4 text-purple-500" />
            Deployment Architecture
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cloud-first continuous deployment pipeline via Vercel Edge Network.
          </p>

          <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs flex items-center justify-between">
            <span className="text-slate-500">Preview Deployments:</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Automated on GitHub Push
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
