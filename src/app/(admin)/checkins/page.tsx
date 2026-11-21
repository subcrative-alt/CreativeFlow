import { createClient } from "@/lib/supabase/server";
import { Clock, CheckCircle2, AlertCircle, Calendar, User, ArrowRight } from "lucide-react";

export default async function AdminCheckinsPage() {
  const checkins = [
    {
      user: "Lead Photographer",
      email: "photo@creativeflow.com",
      status: "present",
      morningTime: "09:42 AM (BST)",
      focus: "Apex Leather Sneaker Shoot at Gulshan Studio. Testing new Godox softboxes.",
      eodSubmitted: false,
    },
    {
      user: "Video Editor 01",
      email: "editor1@creativeflow.com",
      status: "present",
      morningTime: "09:15 AM (BST)",
      focus: "Finishing 9:16 vertical reel for Apex. Syncing audio sweeps and Bengali voiceover.",
      eodSubmitted: true,
      eodNotes: "Draft submitted for Creative Head review. Rendered cleanly with zero dropped frames.",
    },
    {
      user: "Video Editor 02",
      email: "editor2@creativeflow.com",
      status: "present",
      morningTime: "09:30 AM (BST)",
      focus: "Grameenphone 5G Particle VFX intro pass in After Effects.",
      eodSubmitted: true,
      eodNotes: "Heavy particle simulation rendered. Need sound design stems from client.",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Team Daily Attendance & EOD Reports
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Asia/Dhaka synchronized morning check-ins and End-of-Day wrap-up audits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {checkins.map((item) => (
          <div
            key={item.email}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                    {item.user.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">{item.user}</h3>
                    <span className="text-[10px] text-slate-400 block">{item.email}</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Present
                </span>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Morning Check-in ({item.morningTime}):
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    "{item.focus}"
                  </p>
                </div>

                {item.eodSubmitted && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                      End-of-Day Wrap-up:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-emerald-50/40 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-200/50 dark:border-emerald-900/40">
                      "{item.eodNotes}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Timezone: BST (UTC+6)</span>
              <span className={item.eodSubmitted ? "text-emerald-600 font-semibold" : "text-amber-600 font-semibold"}>
                {item.eodSubmitted ? "EOD Complete" : "EOD Pending"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
