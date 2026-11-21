import { createClient } from "@/lib/supabase/server";
import { Calendar as CalendarIcon, Clock, Film, Camera } from "lucide-react";

export default function EmployeeCalendarPage() {
  const events = [
    {
      id: "ev-me-1",
      title: "Apex Leather Sneaker — Instagram Reel Cut",
      date: "Nov 21, 2026",
      time: "10:00 AM – 6:00 PM (BST)",
      type: "editing",
    },
    {
      id: "ev-me-2",
      title: "Weekly Creative Team Synchronization",
      date: "Nov 23, 2026",
      time: "11:00 AM – 11:45 AM (BST)",
      type: "meeting",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          My Work Schedule & Deadlines
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Personal agenda and delivery deadlines in Bangladesh Standard Time (Asia/Dhaka).
        </p>
      </div>

      <div className="space-y-4">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
                <CalendarIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{ev.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 font-mono">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {ev.date} • {ev.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
