import { createClient } from "@/lib/supabase/server";
import { Film, Play, Upload, CheckCircle2, Sliders, Layers } from "lucide-react";

export default function VideoEditorWorkspacePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Video Production Workspace
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Aspect-ratio specs (9:16 vertical reels, 16:9 widescreen, 1:1 square), audio stems, and draft delivery upload.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white">9:16 Vertical</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">Target: 45s</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1">
              Apex Summer Sneaker — TikTok & Instagram Reel
            </h2>
          </div>
          <span className="text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2.5 py-1 rounded-lg border border-rose-200">
            Due Today 6:00 PM
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">Color Grading Specs:</span>
            <span className="text-slate-600 dark:text-slate-300">Rec.709 color space, warm summer contrast with crisp leather highlights.</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">Audio Master:</span>
            <span className="text-slate-600 dark:text-slate-300">-14 LUFS integrated loudness, dynamic audio sidechain on VO.</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">Subtitles:</span>
            <span className="text-slate-600 dark:text-slate-300">Kinetic yellow/white bilingual subtitles (.srt burned in).</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            RAW: /projects/apex/raw-footage/camera-a/
          </span>
          <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 cursor-pointer">
            <Upload className="h-3.5 w-3.5" />
            Upload Video Draft (.mp4 / .mov)
          </button>
        </div>
      </div>
    </div>
  );
}
