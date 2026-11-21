import { createClient } from "@/lib/supabase/server";
import { CheckCircle, AlertCircle, FileCheck2, ExternalLink, Play, MessageSquare, ThumbsUp, RefreshCw } from "lucide-react";

export default async function AdminApprovalsPage() {
  const supabase = await createClient();

  const { data: rawSubmitted } = await supabase
    .from("tasks")
    .select("*, project:projects(name, client_name), assignee:profiles(full_name, role)")
    .eq("status", "submitted");

  const submissions = rawSubmitted && rawSubmitted.length > 0 ? rawSubmitted : [
    {
      id: "sub-1",
      title: "Apex Footwear — Instagram Reel Teaser (9:16 Vertical Cut)",
      project: { name: "Apex Footwear Summer 2026", client_name: "Apex Footwear Ltd." },
      assignee: { full_name: "Video Editor 01", role: "video_editor" },
      deliverable_url: "https://drive.google.com/file/d/demo-video/view",
      submitted_at: "2026-11-21 10:45 AM (BST)",
      notes: "Full dynamic cuts synced with the custom beat. Kinetic typography applied in Bangla and English.",
      video_specs: { aspect_ratio: "9:16", duration_seconds: 45 },
    },
    {
      id: "sub-2",
      title: "Grameenphone 5G Studio Commercial — 3D Particle Intro",
      project: { name: "Grameenphone 5G Studio Commercial", client_name: "Grameenphone" },
      assignee: { full_name: "Video Editor 02", role: "video_editor" },
      deliverable_url: "https://drive.google.com/file/d/demo-vfx/view",
      submitted_at: "2026-11-21 09:15 AM (BST)",
      notes: "CGI camera move through Dhaka cityscape into 5G core network. Rendered in 4K ProRes.",
      video_specs: { aspect_ratio: "16:9", duration_seconds: 30 },
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Review & Approvals Gatekeeper
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review deliverables submitted by Video Editors and Photographer. Approving a task automatically activates dependent downstream tasks.
        </p>
      </div>

      <div className="space-y-4">
        {submissions.map((item: any) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/40">
                    {item.project?.client_name}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    Aspect Ratio: {item.video_specs?.aspect_ratio || "16:9"}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Submitted by <strong>{item.assignee?.full_name}</strong> • {item.submitted_at || "Today"}
                </p>
              </div>

              {item.deliverable_url && (
                <a
                  href={item.deliverable_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 flex items-center gap-1.5 shrink-0"
                >
                  <Play className="h-3.5 w-3.5" />
                  Inspect Media Deliverable
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white block mb-1">Editor's Submission Notes:</strong>
              <p className="leading-relaxed">{item.notes}</p>
            </div>

            {/* Approval / Revision Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>Approval triggers automatic status unblock on dependent tasks</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Request Revisions
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  Approve Deliverable
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
