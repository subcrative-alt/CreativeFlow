import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Strict role check: Non-admin users cannot access admin pages
  if (profile?.role !== "creative_head") {
    redirect("/my-dashboard");
  }

  const userName = profile?.full_name || user.email?.split("@")[0] || "Creative Head";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar role="creative_head" userEmail={user.email || ""} userName={userName} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar role="creative_head" userName={userName} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
