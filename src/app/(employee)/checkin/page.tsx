"use client";

import { useState } from "react";
import { Clock, CheckCircle2, AlertCircle, Sun, Moon, Calendar, Send } from "lucide-react";

export default function EmployeeCheckinPage() {
  const [morningDone, setMorningDone] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [focusNotes, setFocusNotes] = useState("");
  const [eodHours, setEodHours] = useState("6.5");
  const [eodNotes, setEodNotes] = useState("");
  const [delaysReason, setDelaysReason] = useState("");
  const [tomorrowPlan, setTomorrowPlan] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitEod = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Daily Attendance & Work Check-in
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Synchronized to Bangladesh Standard Time (Asia/Dhaka UTC+6).
        </p>
      </div>

      {/* Morning Status Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600">
              <Sun className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Morning Availability Check-in</h2>
              <span className="text-[11px] text-slate-400">Scheduled: 09:00 AM – 10:30 AM (BST)</span>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
            ✓ Completed at 09:34 AM
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300">
          Status: <strong>Available & Ready for Studio Assignments</strong>
        </p>
      </div>

      {/* End of Day Report Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
            <Moon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">End-of-Day (EOD) Wrap-up Report</h2>
            <span className="text-[11px] text-slate-400">Submitted at wrap-up (05:30 PM – 08:00 PM BST)</span>
          </div>
        </div>

        {submitted ? (
          <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs">
            <div className="flex items-center gap-2 font-bold mb-1">
              <CheckCircle2 className="h-4 w-4" />
              EOD Report Submitted to Creative Head
            </div>
            <p>Your work summary and logged hours have been updated on the studio dashboard.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitEod} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Hours Logged Today
              </label>
              <input
                type="number"
                step="0.5"
                value={eodHours}
                onChange={(e) => setEodHours(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Completed & Progress Notes
              </label>
              <textarea
                rows={3}
                value={eodNotes}
                onChange={(e) => setEodNotes(e.target.value)}
                placeholder="Summary of finished cuts, render status, or photo files uploaded..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reasons for Any Delays (If applicable)
              </label>
              <input
                type="text"
                value={delaysReason}
                onChange={(e) => setDelaysReason(e.target.value)}
                placeholder="e.g. Waiting on client audio stem revision, 4K render time..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tomorrow's Focus Plan
              </label>
              <input
                type="text"
                value={tomorrowPlan}
                onChange={(e) => setTomorrowPlan(e.target.value)}
                placeholder="Next planned editing pass or upcoming shoot..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              Submit End-of-Day Report
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
