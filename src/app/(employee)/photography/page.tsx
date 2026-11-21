import { createClient } from "@/lib/supabase/server";
import { Camera, MapPin, Layers, CheckCircle2, Upload, Calendar } from "lucide-react";

export default function PhotographerWorkspacePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Photography Shoot Workspace
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Shoot planning, location details, camera and lighting gear checklists, and raw media deliveries.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
              Apex Footwear Ltd.
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              Apex Summer Sneaker — Gulshan Studio Session
            </h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200">
            Today 2:30 PM (BST)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white block">Camera & Lens Checklist:</span>
            <div className="space-y-1 text-slate-600 dark:text-slate-300">
              <div>✓ Sony A7 IV Body (Firmware v3.0)</div>
              <div>✓ Sony FE 24-70mm f/2.8 GM II</div>
              <div>✓ Sony FE 90mm f/2.8 Macro G OSS</div>
              <div>✓ 3x Sony NP-FZ100 Batteries (Charged)</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white block">Lighting & Grip Checklist:</span>
            <div className="space-y-1 text-slate-600 dark:text-slate-300">
              <div>✓ Godox AD400 Pro Strobe</div>
              <div>✓ 90cm Octabox with Grid</div>
              <div>✓ 2x Godox V1S Speedlights</div>
              <div>✓ Heavy Duty C-Stands & Sandbags</div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-rose-500" />
            Studio 4, Road 11, Gulshan-1, Dhaka
          </span>
          <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 cursor-pointer">
            <Upload className="h-3.5 w-3.5" />
            Ingest Raw Photo Files
          </button>
        </div>
      </div>
    </div>
  );
}
