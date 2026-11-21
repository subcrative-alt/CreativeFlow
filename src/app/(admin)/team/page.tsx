import { createClient } from "@/lib/supabase/server";
import { Users, Mail, Phone, Calendar, Clock, ShieldCheck, Film, Camera, Sparkles } from "lucide-react";

export default async function AdminTeamPage() {
  const supabase = await createClient();

  const { data: profiles } = await supabase.from("profiles").select("*").order("created_at");

  const initialTeam = [
    {
      id: "u1",
      email: "head@creativeflow.com",
      full_name: "Creative Head (Admin)",
      role: "creative_head",
      phone: "+880 1711-000001",
      timezone: "Asia/Dhaka",
      is_active: true,
      bio: "Oversees creative vision, project assignments, workflow dependencies, and final quality approvals.",
    },
    {
      id: "u2",
      email: "editor1@creativeflow.com",
      full_name: "Video Editor 01",
      role: "video_editor",
      phone: "+880 1711-000002",
      timezone: "Asia/Dhaka",
      is_active: true,
      bio: "Specializes in dynamic short-form social reels (9:16), Premiere Pro beat cuts, and pacing.",
    },
    {
      id: "u3",
      email: "editor2@creativeflow.com",
      full_name: "Video Editor 02",
      role: "video_editor",
      phone: "+880 1711-000003",
      timezone: "Asia/Dhaka",
      is_active: true,
      bio: "Specializes in 16:9 YouTube documentaries, After Effects motion graphics, and audio mixing.",
    },
    {
      id: "u4",
      email: "photo@creativeflow.com",
      full_name: "Lead Photographer",
      role: "photographer",
      phone: "+880 1711-000004",
      timezone: "Asia/Dhaka",
      is_active: true,
      bio: "Manages studio & location shoots, lighting gear checklists, high-res RAW capture, and shot lists.",
    },
  ];

  const team = profiles && profiles.length > 0 ? profiles : initialTeam;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Creative Team Roster
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Four dedicated creative specialists operating in the Asia/Dhaka studio node.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {team.map((member: any) => {
          const isHead = member.role === "creative_head";
          const isPhoto = member.role === "photographer";

          return (
            <div
              key={member.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-base text-white shadow-md ${
                        isHead
                          ? "bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-purple-500/20"
                          : isPhoto
                          ? "bg-gradient-to-tr from-amber-500 to-orange-600 shadow-amber-500/20"
                          : "bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-blue-500/20"
                      }`}
                    >
                      {isHead ? (
                        <Sparkles className="h-6 w-6" />
                      ) : isPhoto ? (
                        <Camera className="h-6 w-6" />
                      ) : (
                        <Film className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {member.full_name}
                      </h3>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                          isHead
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                            : isPhoto
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        }`}
                      >
                        {member.role.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                  {member.bio || "Dedicated member of the CreativeFlow digital agency production unit."}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{member.phone || "+880 1711-XXXXXX"}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                    <Clock className="h-3 w-3" />
                    <span>Asia/Dhaka</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
