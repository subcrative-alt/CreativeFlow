"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Sparkles,
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar,
  Camera,
  Film,
  CheckCircle,
  Clock,
  BarChart3,
  Users,
  Settings,
  LogOut,
  User,
  Bell,
} from "lucide-react";
import { UserRole } from "@/types/database";

interface SidebarProps {
  role: UserRole;
  userEmail: string;
  userName: string;
}

export function Sidebar({ role, userEmail, userName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  // Admin Navigation Items
  const adminNav = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Master Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Calendar & Schedule", href: "/calendar", icon: Calendar },
    { name: "Photography Hub", href: "/photography", icon: Camera },
    { name: "Video Production", href: "/video-editing", icon: Film },
    { name: "Review & Approvals", href: "/approvals", icon: CheckCircle },
    { name: "Daily Check-ins", href: "/checkins", icon: Clock },
    { name: "Reports & Analytics", href: "/reports", icon: BarChart3 },
    { name: "Team Roster", href: "/team", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  // Contributor Navigation Items
  const employeeNav = [
    { name: "My Dashboard", href: "/my-dashboard", icon: LayoutDashboard },
    { name: "Assigned Tasks", href: "/my-tasks", icon: CheckSquare },
    ...(role === "photographer"
      ? [{ name: "Shoot Workspace", href: "/photography", icon: Camera }]
      : []),
    ...(role === "video_editor"
      ? [{ name: "Editing Workspace", href: "/video-editing", icon: Film }]
      : []),
    { name: "My Calendar", href: "/my-calendar", icon: Calendar },
    { name: "Daily Check-in", href: "/checkin", icon: Clock },
    { name: "Profile & Focus", href: "/profile", icon: User },
  ];

  const navItems = role === "creative_head" ? adminNav : employeeNav;

  const roleLabel =
    role === "creative_head"
      ? "Creative Head (Admin)"
      : role === "photographer"
      ? "Lead Photographer"
      : "Senior Video Editor";

  const roleColor =
    role === "creative_head"
      ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
      : role === "photographer"
      ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
      : "bg-blue-500/20 text-blue-300 border-blue-500/30";

  return (
    <aside className="w-64 bg-[#0F172A] border-r border-slate-800 flex flex-col justify-between shrink-0 select-none text-slate-300">
      {/* Brand Header */}
      <div>
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80">
          <Link href={role === "creative_head" ? "/dashboard" : "/my-dashboard"} className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block leading-none">CreativeFlow</span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase block mt-1">Dhaka Studio</span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {role === "creative_head" ? "Workspace Operations" : "My Workstation"}
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
              >
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* User Footer Profile & Sign Out */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
        <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">
                {userName.charAt(0) || userEmail.charAt(0) || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{userName || userEmail.split("@")[0]}</p>
                <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold border ${roleColor} mt-0.5`}>
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-700/40 flex items-center justify-between text-xs text-slate-400">
            <span className="text-[10px] text-slate-400 truncate max-w-[140px]">{userEmail}</span>
            <button
              onClick={handleSignOut}
              title="Sign out of workspace"
              className="p-1 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
