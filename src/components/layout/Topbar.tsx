"use client";

import { useEffect, useState } from "react";
import { Search, Bell, Clock, Calendar as CalendarIcon, ShieldCheck } from "lucide-react";
import { UserRole } from "@/types/database";

interface TopbarProps {
  role: UserRole;
  userName: string;
}

export function Topbar({ role, userName }: TopbarProps) {
  const [dhakaTime, setDhakaTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Dhaka",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(now);
      setDhakaTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
      {/* Quick Search Bar */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects, tasks, deliverables... (⌘K)"
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Right Action Widgets */}
      <div className="flex items-center gap-3">
        {/* Asia/Dhaka Live Studio Clock */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
          <Clock className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
          <span className="font-mono font-medium">{dhakaTime || "Dhaka 12:00 PM"}</span>
          <span className="text-[10px] text-slate-400 font-semibold px-1 rounded bg-slate-200/60 dark:bg-slate-700">
            BST UTC+6
          </span>
        </div>

        {/* Security RLS Verified Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>RLS Active</span>
        </div>

        {/* Notification Bell */}
        <button
          title="Notifications"
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600" />
        </button>

        {/* User Mini Avatar */}
        <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300">
          {userName.charAt(0) || "U"}
        </div>
      </div>
    </header>
  );
}
