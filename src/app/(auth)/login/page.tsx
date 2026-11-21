"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, ArrowRight, Lock, Mail, AlertCircle, Eye, EyeOff, Loader2, UserPlus, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfoMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (isSignUp) {
        // Sign up flow
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim() || cleanEmail.split("@")[0],
            },
          },
        });

        if (signUpError) throw signUpError;

        if (data.session) {
          router.push("/dashboard");
          router.refresh();
          return;
        } else {
          setInfoMessage("Account created! If you have email confirmation enabled in Supabase, please check your email or disable confirmation in Supabase Dashboard -> Auth -> Providers -> Email.");
        }
      } else {
        // Sign in flow
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (signInError) {
          // If credentials fail, check if this is one of our demo team accounts and auto-provision it
          if (cleanEmail.includes("creativeflow.com") || cleanEmail.startsWith("head@") || cleanEmail.startsWith("photo@") || cleanEmail.startsWith("editor")) {
            const roleName = cleanEmail.startsWith("head")
              ? "Creative Head (Admin)"
              : cleanEmail.startsWith("photo")
              ? "Lead Photographer"
              : "Video Editor";

            const { data: signUpData, error: autoSignError } = await supabase.auth.signUp({
              email: cleanEmail,
              password,
              options: {
                data: {
                  full_name: roleName,
                },
              },
            });

            if (!autoSignError && signUpData?.session) {
              // Successfully auto-created and logged in
              const targetRoute = cleanEmail.startsWith("head") ? "/dashboard" : "/my-dashboard";
              router.push(targetRoute);
              router.refresh();
              return;
            }
          }

          throw signInError;
        }

        if (data.user) {
          // Fetch role from profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .single();

          if (profile?.role === "creative_head" || cleanEmail.startsWith("head")) {
            router.push("/dashboard");
          } else {
            router.push("/my-dashboard");
          }
          router.refresh();
        }
      }
    } catch (err: any) {
      const msg = err?.message || "Authentication failed.";
      if (msg.includes("Invalid login credentials")) {
        setError(
          "Invalid credentials or user not registered yet in Supabase Auth. Click 'Sign Up / Register' below to create this account, or run the SQL seed in your Supabase SQL Editor."
        );
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Quick preset loader for initial creative team testing
  const selectDemoAccount = (demoEmail: string, demoName: string) => {
    setEmail(demoEmail);
    setPassword("CreativeFlow#2026");
    setFullName(demoName);
    setError(null);
    setInfoMessage(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950">
      {/* Brand & Value Proposition Column */}
      <div className="flex-1 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-8 md:p-16 flex flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">CreativeFlow</span>
          </div>
          <p className="mt-2 text-sm text-slate-400">Team Management & Workflow Automation SaaS</p>
        </div>

        <div className="relative z-10 my-12 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            Asia/Dhaka Production Node Active
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Deterministic pipeline for creative digital agencies.
          </h1>
          <p className="mt-4 text-slate-300 text-base leading-relaxed">
            Eliminate bottlenecks across Photography, Raw Ingestion, Video Editing, and Creative Head Approvals with automated state transitions.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-800/80 pt-6">
            <div>
              <div className="text-2xl font-bold text-white">4 Roles</div>
              <div className="text-xs text-slate-400 mt-1">Admin, 2 Editors, 1 Photographer</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">100% RLS</div>
              <div className="text-xs text-slate-400 mt-1">Kernel-level data isolation</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500 flex items-center justify-between">
          <span>&copy; {new Date().getFullYear()} CreativeFlow Systems</span>
          <span className="font-mono">Timezone: UTC+6 (Dhaka)</span>
        </div>
      </div>

      {/* Authentication Form Column */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 p-8">
          {/* Sign In vs Sign Up Toggle */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {isSignUp ? "Create Workspace Account" : "Welcome back"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isSignUp ? "Register a new creative team member" : "Sign in to your production workspace"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setInfoMessage(null);
              }}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              {isSignUp ? "Sign In Instead" : "Register / Sign Up"}
            </button>
          </div>

          {/* Quick Demo Selector */}
          <div className="mt-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Select Demo Team Role:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => selectDemoAccount("head@creativeflow.com", "Creative Head (Admin)")}
                className="text-left px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-blue-500 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
              >
                👑 Creative Head
              </button>
              <button
                type="button"
                onClick={() => selectDemoAccount("photo@creativeflow.com", "Lead Photographer")}
                className="text-left px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-blue-500 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
              >
                📷 Photographer
              </button>
              <button
                type="button"
                onClick={() => selectDemoAccount("editor1@creativeflow.com", "Video Editor 01")}
                className="text-left px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-blue-500 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
              >
                🎬 Video Editor 01
              </button>
              <button
                type="button"
                onClick={() => selectDemoAccount("editor2@creativeflow.com", "Video Editor 02")}
                className="text-left px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-blue-500 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
              >
                🎬 Video Editor 02
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-rose-700 dark:text-rose-400 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {infoMessage && (
            <div className="mt-4 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-start gap-3 text-blue-700 dark:text-blue-400 text-xs">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{infoMessage}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="mt-5 space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Creative Head"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@creativeflow.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Password
                </label>
                {!isSignUp && (
                  <a
                    href="/forgot-password"
                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                  >
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isSignUp ? "Creating account..." : "Signing in..."}</span>
                </>
              ) : (
                <>
                  <span>{isSignUp ? "Register Account" : "Sign in to Dashboard"}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
