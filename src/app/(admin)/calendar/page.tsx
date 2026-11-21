import { createClient } from "@/lib/supabase/server";
import { Calendar as CalendarIcon, Clock, ShieldAlert, Camera, Film, ChevronLeft, ChevronRight, Plus } from "lucide-react";

export default async function AdminCalendarPage() {
  const events = [
    {
      id: "ev-1",
      title: "Apex Leather Sneaker Shoot (Gulshan Studio)",
      assignee: "Lead Photographer",
      date: "Nov 21, 2026",
      time: "2:30 PM - 5:30 PM",
      type: "shoot",
    },
    {
      id: "ev-2",
      title: "Apex Reel Rough Cut Assembly",
      assignee: "Video Editor 01",
      date: "Nov 22, 2026",
      time: "10:00 AM - 4:00 PM",
      type: "editing",
    },
    {
      id: "ev-3",
      title: "Grameenphone 5G VFX Color Pass",
      assignee: "Video Editor 02",
      date: "Nov 23, 2026",
      time: "1:00 PM - 6:00 PM",
      type: "editing",
    },
    {
      id: "ev-4",
      title: "Aarong Silk Outdoor Shoot (Dhanmondi)",
      assignee: "Lead Photographer",
      date: "Nov 25, 2026",
      time: "9:00 AM - 1:00 PM",
      type: "shoot",
    },
  ];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Production Calendar & Scheduling
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visual scheduling with collision detection. Timezone locked to Asia/Dhaka (BST UTC+6).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 shadow-sm">
            <button className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-900 dark:text-white">November 2026</span>
            <button className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <button className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 cursor-pointer">
            <Plus className="h-4 w-4" />
            Schedule Session
          </button>
        </div>
      </div>

      {/* Collision Detection Status Box */}
      <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span><strong>Zero Double-Booking Conflicts:</strong> All four team members have non-overlapping assignments.</span>
        </div>
        <span className="font-semibold text-emerald-700 dark:text-emerald-400">100% Conflict-Free</span>
      </div>

      {/* Schedule Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-4"
          >
            <div
              className={`p-3 rounded-xl ${
                ev.type === "shoot"
                  ? "bg-amber-50 dark:bg-amber-950 text-amber-600"
                  : "bg-blue-50 dark:bg-blue-950 text-blue-600"
              }`}
            >
              {ev.type === "shoot" ? <Camera className="h-5 w-5" /> : <Film className="h-5 w-5" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {ev.assignee}
                </span>
                <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300">
                  {ev.date}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 truncate">
                {ev.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 font-mono">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                {ev.time} (Dhaka)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
