"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Plus,
  Users,
  Camera,
  Film,
  Palette,
  Filter,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Check,
  ChevronRight,
  MapPin,
  X,
  AlertCircle,
  Lock,
  Unlock,
} from "lucide-react";

// Team Roles for Swapon's World
export type TeamMember = "all" | "head" | "designer" | "editor1" | "editor2" | "videographer";

export interface SwaponTask {
  id: string;
  title: string;
  assignee: TeamMember;
  assigneeName: string;
  department: "design" | "video" | "shoot" | "general";
  deadlineCategory: "today" | "tomorrow" | "3days" | "7days" | "15days";
  dueDate: string;
  completed: boolean;
  notes?: string;
  driveUrl?: string;
  location?: string; // For videographer shoots
  shootTime?: string;
  isUrgent?: boolean;
}

const INITIAL_TASKS: SwaponTask[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    title: "আজকের নতুন সোশ্যাল মিডিয়া ব্যানার ডিজাইন (Summer Sale)",
    assignee: "designer",
    assigneeName: "গ্রাফিক ডিজাইনার",
    department: "design",
    deadlineCategory: "today",
    dueDate: "আজকের ভেতর (Today)",
    completed: false,
    isUrgent: true,
    notes: "ফেসবুক ও ইনস্টাগ্রাম সাইজ (1080x1080 & 1080x1920)",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    title: "নতুন প্রোডাক্ট শুট — আউটডোর লোকেশন (ধানমন্ডি লেক)",
    assignee: "videographer",
    assigneeName: "ভিডিওগ্রাফার / শুটার",
    department: "shoot",
    deadlineCategory: "today",
    dueDate: "আজ দুপুর ২:৩০ PM",
    completed: true,
    location: "ধানমন্ডি লেক ও স্টুডিও",
    shootTime: "2:30 PM - 5:00 PM",
    notes: "সনি ক্যামেরা ও গিম্বল রেডি রাখতে হবে। ৪কে ৬০এফপিএস ফুটেজ দরকার।",
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    title: "টিকটক ও রিলস ভার্টিক্যাল ভিডিও এডিটিং (৯:১৬)",
    assignee: "editor1",
    assigneeName: "ভিডিও এডিটর ০১",
    department: "video",
    deadlineCategory: "today",
    dueDate: "আজ সন্ধ্যা ৬:০০ PM",
    completed: false,
    isUrgent: true,
    notes: "ট্রেন্ডিং ব্যাকগ্রাউন্ড মিউজিক এবং দ্রুত কাটস দিয়ে ৪ সেকেন্ডের হুক বানাতে হবে।",
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    title: "ইউটিউব ফুল ভিডিও এডিটিং ও কালার গ্রেডিং (১৬:৯)",
    assignee: "editor2",
    assigneeName: "ভিডিও এডিটর ০২",
    department: "video",
    deadlineCategory: "tomorrow",
    dueDate: "আগামীকাল (Tomorrow)",
    completed: false,
    notes: "ভয়েসওভার সিনক্রোনাইজেশন ও ব্যাকগ্রাউন্ড মিউজিক অ্যাড করতে হবে।",
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    title: "ক্যাটালগ ও ফটো ম্যানিপুলেশন ডিজাইন",
    assignee: "designer",
    assigneeName: "গ্রাফিক ডিজাইনার",
    department: "design",
    deadlineCategory: "3days",
    dueDate: "৩ দিনের ভেতর",
    completed: false,
    notes: "ক্লায়েন্ট রিভিউয়ের জন্য খসড়া ড্রাফট তৈরি করতে হবে।",
  },
  {
    id: "66666666-6666-4666-8666-666666666666",
    title: "ইনডোর মডেল ও ফ্যাশন শুট (স্বপনস ওয়ার্ল্ড স্টুডিও)",
    assignee: "videographer",
    assigneeName: "ভিডিওগ্রাফার / শুটার",
    department: "shoot",
    deadlineCategory: "7days",
    dueDate: "৭ দিনের ভেতর (Next Week)",
    completed: false,
    location: "স্বপনস ওয়ার্ল্ড মেইন স্টুডিও",
    shootTime: "সকাল ১১:০০ AM",
    notes: "সফটবক্স ও রিফ্লেক্টর লাইটিং সেটআপ করতে হবে।",
  },
  {
    id: "77777777-7777-4777-8777-777777777777",
    title: "১৫ দিনের পূর্ণাঙ্গ ব্র্যান্ড ক্যাম্পেইন প্যাকেজ ডেলিভারি",
    assignee: "head",
    assigneeName: "ক্রিয়েটিভ টিম হেড",
    department: "general",
    deadlineCategory: "15days",
    dueDate: "১৫ দিনের ভেতর (15-Day Milestone)",
    completed: false,
    notes: "সব ডিজাইনার ও এডিটরদের ফাইনাল ফাইল রিভিউর পর ক্লায়েন্টকে পাঠানো হবে।",
  },
];

export default function SwaponsWorldHub() {
  const [tasks, setTasks] = useState<SwaponTask[]>(INITIAL_TASKS);
  const [selectedMember, setSelectedMember] = useState<TeamMember>("all");
  const [activeTab, setActiveTab] = useState<"today" | "upcoming" | "shoots" | "overview">("today");
  const [isAdmin, setIsAdmin] = useState<boolean>(true); // Admin toggle for Head
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [dhakaTime, setDhakaTime] = useState<string>("");

  // New task form state
  const [newTitle, setNewTitle] = useState("");
  const [newAssignee, setNewAssignee] = useState<TeamMember>("designer");
  const [newCategory, setNewCategory] = useState<"today" | "tomorrow" | "3days" | "7days" | "15days">("today");
  const [newDepartment, setNewDepartment] = useState<"design" | "video" | "shoot" | "general">("design");
  const [newDueDate, setNewDueDate] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newIsUrgent, setNewIsUrgent] = useState(false);
  const [isCompletedImmediately, setIsCompletedImmediately] = useState(false);

  const supabase = createClient();

  // Load from Supabase and LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("swapons_world_tasks");
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {}
    }

    // Also fetch live tasks from Supabase
    async function fetchSupabaseTasks() {
      try {
        const { data, error } = await supabase.from("tasks").select("*");
        if (data && data.length > 0) {
          const mapped: SwaponTask[] = data.map((t) => ({
            id: t.id,
            title: t.title,
            assignee: (t.department === "photography" ? "videographer" : t.department === "video_editing" ? "editor1" : "designer") as TeamMember,
            assigneeName: t.department === "photography" ? "ভিডিওগ্রাফার / শুটার" : t.department === "video_editing" ? "ভিডিও এডিটর" : "গ্রাফিক ডিজাইনার",
            department: (t.department === "photography" ? "shoot" : t.department === "video_editing" ? "video" : "design"),
            deadlineCategory: "today",
            dueDate: t.due_date || "আজকের ভেতর",
            completed: t.status === "completed" || t.status === "approved",
            notes: t.description,
            isUrgent: t.priority === "urgent",
          }));
          setTasks((prev) => [...mapped, ...prev.filter((p) => !mapped.some((m) => m.id === p.id))]);
        }
      } catch (err) {}
    }
    fetchSupabaseTasks();
  }, []);

  // Save to LocalStorage
  const updateTasks = (newTaskList: SwaponTask[]) => {
    setTasks(newTaskList);
    localStorage.setItem("swapons_world_tasks", JSON.stringify(newTaskList));
  };

  // Clock
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setDhakaTime(
        new Intl.DateTimeFormat("bn-BD", {
          timeZone: "Asia/Dhaka",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(now)
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper for generating UUID
  const getUUID = () => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  // Toggle task complete (টিক দিয়ে শেষ করা)
  const toggleTask = async (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    updateTasks(updated);

    // Sync to Supabase in background
    try {
      const target = updated.find((t) => t.id === taskId);
      if (target) {
        await supabase
          .from("tasks")
          .update({ status: target.completed ? "completed" : "in_progress" })
          .eq("id", taskId);
      }
    } catch (e) {}
  };

  // Delete task
  const deleteTask = async (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    updateTasks(updated);
    try {
      await supabase.from("tasks").delete().eq("id", taskId);
    } catch (e) {}
  };

  // Add new task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const assigneeNames: Record<TeamMember, string> = {
      all: "সবাই",
      head: "ক্রিয়েটিভ টিম হেড",
      designer: "গ্রাফিক ডিজাইনার",
      editor1: "ভিডিও এডিটর ০১",
      editor2: "ভিডিও এডিটর ০২",
      videographer: "ভিডিওগ্রাফার / শুটার",
    };

    const newId = getUUID();

    const newTask: SwaponTask = {
      id: newId,
      title: newTitle.trim(),
      assignee: newAssignee,
      assigneeName: assigneeNames[newAssignee],
      department: newDepartment,
      deadlineCategory: newCategory,
      dueDate: newDueDate || (newCategory === "today" ? "আজকের ভেতর" : newCategory === "tomorrow" ? "আগামীকাল" : newCategory === "3days" ? "৩ দিনের ভেতর" : newCategory === "7days" ? "৭ দিনের ভেতর" : "১৫ দিনের ভেতর"),
      completed: isCompletedImmediately,
      notes: newNotes.trim() || undefined,
      location: newLocation.trim() || undefined,
      isUrgent: newIsUrgent,
    };

    const updated = [newTask, ...tasks];
    updateTasks(updated);

    // Sync to Supabase
    try {
      await supabase.from("tasks").insert([
        {
          id: newTask.id,
          title: newTask.title,
          description: newTask.notes,
          department: newDepartment === "shoot" ? "photography" : newDepartment === "video" ? "video_editing" : "general",
          priority: newIsUrgent ? "urgent" : "medium",
          status: isCompletedImmediately ? "completed" : "pending",
        },
      ]);
    } catch (e) {}

    // Reset Form
    setNewTitle("");
    setNewNotes("");
    setNewLocation("");
    setNewDueDate("");
    setNewIsUrgent(false);
    setIsCompletedImmediately(false);
    setShowAddModal(false);
  };

  // Filter tasks based on selected member
  const filteredTasks = tasks.filter((t) => {
    if (selectedMember === "all") return true;
    return t.assignee === selectedMember;
  });

  // Category filters
  const todayTasks = filteredTasks.filter((t) => t.deadlineCategory === "today");
  const upcomingTasks = filteredTasks.filter((t) => t.deadlineCategory !== "today");
  const shootTasks = filteredTasks.filter((t) => t.department === "shoot");

  // Metrics
  const totalCount = filteredTasks.length;
  const completedCount = filteredTasks.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans pb-16">
      {/* Top Banner / Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          {/* Company Brand */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 shrink-0">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  স্বপনস ওয়ার্ল্ড
                </h1>
                <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  ক্রিয়েটিভ টিম
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Swapon's World • টিম ওয়ার্কফ্লো ও কাজের শিডিউল
              </p>
            </div>
          </div>

          {/* Right Actions: Clock, Admin Mode & Add Task */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Dhaka Clock */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Clock className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
              <span>{dhakaTime || "ঢাকা সময়"}</span>
            </div>

            {/* Admin Toggle */}
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isAdmin
                  ? "bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {isAdmin ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
              <span>{isAdmin ? "হেড / অ্যাডমিন মোড" : "ইউজার মোড"}</span>
            </button>

            {/* Fast Add Task CTA */}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-blue-500/25 hover:shadow-lg transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>নতুন কাজ যোগ করুন</span>
            </button>
          </div>
        </div>

        {/* Team Filter Pills Bar */}
        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> কার কাজ দেখবেন:
            </span>

            {[
              { id: "all", label: "👥 সবার কাজ (All Team)", count: tasks.length },
              { id: "designer", label: "🎨 গ্রাফিক ডিজাইনার", count: tasks.filter((t) => t.assignee === "designer").length },
              { id: "editor1", label: "🎬 ভিডিও এডিটর ০১", count: tasks.filter((t) => t.assignee === "editor1").length },
              { id: "editor2", label: "🎬 ভিডিও এডিটর ০২", count: tasks.filter((t) => t.assignee === "editor2").length },
              { id: "videographer", label: "📹 ভিডিওগ্রাফার / শুটার", count: tasks.filter((t) => t.assignee === "videographer").length },
              { id: "head", label: "👑 টিম হেড", count: tasks.filter((t) => t.assignee === "head").length },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMember(m.id as TeamMember)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedMember === m.id
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700"
                }`}
              >
                <span>{m.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedMember === m.id ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-500"
                  }`}
                >
                  {m.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Progress & Quick Stats Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800">
                  রিয়েল-টাইম কাজের অগ্রগতি
                </span>
                <span className="text-xs text-slate-400 font-medium">• স্বপনস ওয়ার্ল্ড টিম</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                {selectedMember === "all" ? "পুরো ক্রিয়েটিভ টিমের কাজের সার্বিক অবস্থা" : `${tasks.find(t => t.assignee === selectedMember)?.assigneeName || "টিম মেম্বার"}-এর কাজের অবস্থা`}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                যে কাজ শেষ হবে শুধু টিক দিন। স্বয়ংক্রিয়ভাবে ডাটাবেজে ও টিম বোর্ডে সেভ হয়ে যাবে।
              </p>
            </div>

            {/* Completion Percentage Ring/Bar */}
            <div className="flex items-center gap-6 shrink-0 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {progressPercent}%
                </div>
                <div className="text-[11px] font-bold text-slate-400">কাজের সমাপ্তি</div>
              </div>

              <div className="h-10 w-px bg-slate-200 dark:bg-slate-700" />

              <div className="flex items-center gap-4 text-xs font-bold">
                <div>
                  <div className="text-emerald-600 dark:text-emerald-400 text-lg sm:text-xl font-extrabold">{completedCount} টি</div>
                  <div className="text-[10px] text-slate-400">কাজ শেষ হয়েছে</div>
                </div>
                <div>
                  <div className="text-blue-600 dark:text-blue-400 text-lg sm:text-xl font-extrabold">{pendingCount} টি</div>
                  <div className="text-[10px] text-slate-400">কাজ বাকি আছে</div>
                </div>
              </div>
            </div>
          </div>

          {/* Linear Progress Bar */}
          <div className="mt-4">
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* View Switcher Tabs (সহজ ৪টি ট্যাব) */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab("today")}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "today"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>আজকের কাজ ({todayTasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "upcoming"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>আগামী ৭–১৫ দিনের কাজের শিডিউল ({upcomingTasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("shoots")}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "shoots"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Camera className="h-4 w-4 text-amber-500" />
            <span>ভিডিওগ্রাফি ও শুট ট্র্যাকার ({shootTasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Users className="h-4 w-4 text-indigo-500" />
            <span>কার কাজ হয়েছে / কার বাকি</span>
          </button>
        </div>

        {/* TAB 1: আজকের কাজ (TODAY'S TASKS) */}
        {activeTab === "today" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>আজকের জন্য নির্ধারিত কাজসমূহ</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    আজকের ডেডলাইন
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  যে কাজটি হয়ে গেছে বামপাশের টিক বক্সে চাপ দিয়ে সম্পন্ন করুন।
                </p>
              </div>
            </div>

            {todayTasks.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  আজকের কোনো পেন্ডিং কাজ নেই!
                </h4>
                <p className="text-xs text-slate-400 mt-1">সব কাজ শেষ হয়েছে অথবা নতুন কাজ যোগ করা হয়নি।</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  + নতুন কাজ যুক্ত করুন
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all flex items-start justify-between gap-4 ${
                      task.completed
                        ? "border-emerald-200/80 dark:border-emerald-950 bg-emerald-50/20 dark:bg-emerald-950/10 opacity-75"
                        : "border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md"
                    }`}
                  >
                    {/* Left: Checkbox & Task details */}
                    <div className="flex items-start gap-3.5 min-w-0">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`mt-0.5 h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                          task.completed
                            ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                            : "border-slate-300 dark:border-slate-600 hover:border-blue-500 bg-white dark:bg-slate-800"
                        }`}
                        title={task.completed ? "Mark incomplete" : "Mark as done"}
                      >
                        {task.completed && <Check className="h-4 w-4 stroke-[3]" />}
                      </button>

                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-sm sm:text-base font-bold leading-snug ${
                              task.completed
                                ? "line-through text-slate-400 dark:text-slate-500"
                                : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {task.title}
                          </span>

                          {task.isUrgent && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                              জরুরি (Urgent)
                            </span>
                          )}
                        </div>

                        {task.notes && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            {task.notes}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
                          {/* Assignee badge */}
                          <span className="inline-flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-lg">
                            {task.department === "design" ? (
                              <Palette className="h-3 w-3 text-purple-500" />
                            ) : task.department === "video" ? (
                              <Film className="h-3 w-3 text-blue-500" />
                            ) : task.department === "shoot" ? (
                              <Camera className="h-3 w-3 text-amber-500" />
                            ) : (
                              <Users className="h-3 w-3 text-slate-500" />
                            )}
                            <span>{task.assigneeName}</span>
                          </span>

                          <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                            <Clock className="h-3 w-3" />
                            {task.dueDate}
                          </span>

                          {task.location && (
                            <span className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                              <MapPin className="h-3 w-3" />
                              {task.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isAdmin && (
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer"
                          title="কাজ ডিলিট করুন"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: আগামী ৭–১৫ দিনের কাজের শিডিউল (7-15 DAYS SCHEDULE) */}
        {activeTab === "upcoming" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>কালকের ও আগামী ৭ থেকে ১৫ দিনের কাজের প্ল্যান</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  অগ্রিম শিডিউল
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                কোন কাজ কতদিনের ভেতর শেষ করতে হবে তা এখানে সাজানো আছে।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">
                        {task.deadlineCategory === "tomorrow"
                          ? "আগামীকালকের কাজ"
                          : task.deadlineCategory === "3days"
                          ? "৩ দিনের ভেতর"
                          : task.deadlineCategory === "7days"
                          ? "৭ দিনের শিডিউল"
                          : "১৫ দিনের প্রজেক্ট"}
                      </span>

                      <span className="text-xs font-bold text-slate-500 font-mono">
                        {task.dueDate}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2.5">
                      {task.title}
                    </h4>

                    {task.notes && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {task.notes}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      {task.department === "design" ? (
                        <Palette className="h-3.5 w-3.5 text-purple-500" />
                      ) : task.department === "video" ? (
                        <Film className="h-3.5 w-3.5 text-blue-500" />
                      ) : (
                        <Camera className="h-3.5 w-3.5 text-amber-500" />
                      )}
                      {task.assigneeName}
                    </span>

                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        task.completed
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      {task.completed ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                      <span>{task.completed ? "সম্পন্ন" : "টিক দিন (Done)"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ভিডিওগ্রাফি ও শুট ট্র্যাকার (VIDEOGRAPHY & SHOOT TRACKER) */}
        {activeTab === "shoots" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Camera className="h-5 w-5 text-amber-500" />
                <span>ভিডিওগ্রাফি ও শুট ট্র্যাকার</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  ভিডিওগ্রাফারের কাজ
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                কখন কোন শুট হবে, লোকেশন কোথায়, কোন ক্যামেরা রেডি থাকবে এবং ফুটেজ আপলোড হয়েছে কিনা তা এখান থেকে ম্যানেজ করুন।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {shootTasks.map((shoot) => (
                <div
                  key={shoot.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-md">
                        শুট শিডিউল
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">
                        {shoot.title}
                      </h4>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        shoot.completed
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800 animate-pulse"
                      }`}
                    >
                      {shoot.completed ? "শুট শেষ ও ফুটেজ ডান" : "আসন্ন শুট"}
                    </span>
                  </div>

                  {/* Shoot Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                    <div>
                      <strong className="text-slate-900 dark:text-white block">লোকেশন:</strong>
                      <span>{shoot.location || "স্বপনস ওয়ার্ল্ড স্টুডিও"}</span>
                    </div>
                    <div>
                      <strong className="text-slate-900 dark:text-white block">সময়সূচি:</strong>
                      <span>{shoot.shootTime || shoot.dueDate}</span>
                    </div>
                  </div>

                  {shoot.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong>ইন্সট্রাকশন:</strong> {shoot.notes}
                    </p>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => toggleTask(shoot.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        shoot.completed
                          ? "bg-emerald-600 text-white"
                          : "bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                      }`}
                    >
                      <Check className="h-4 w-4" />
                      <span>{shoot.completed ? "শুট সম্পন্ন হয়েছে" : "শুট শেষ হলে টিক দিন"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: কার কাজ হয়েছে / কার বাকি (TEAM OVERVIEW) */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>টিম মেম্বার অনুযায়ী কার কাজ শেষ, কার কাজ বাকি</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                স্বপনস ওয়ার্ল্ড ক্রিয়েটিভ টিমের প্রতিটি সদস্যের আলাদা কাজের হিসাব।
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { id: "designer", title: "গ্রাফিক ডিজাইনার", icon: Palette, color: "from-purple-500 to-indigo-600" },
                { id: "editor1", title: "ভিডিও এডিটর ০১", icon: Film, color: "from-blue-500 to-cyan-600" },
                { id: "editor2", title: "ভিডিও এডিটর ০২", icon: Film, color: "from-blue-600 to-indigo-600" },
                { id: "videographer", title: "ভিডিওগ্রাফার / শুটার", icon: Camera, color: "from-amber-500 to-orange-600" },
              ].map((member) => {
                const memberTasks = tasks.filter((t) => t.assignee === member.id);
                const done = memberTasks.filter((t) => t.completed).length;
                const remaining = memberTasks.length - done;
                const pct = memberTasks.length > 0 ? Math.round((done / memberTasks.length) * 100) : 0;
                const Icon = member.icon;

                return (
                  <div
                    key={member.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl bg-gradient-to-tr ${member.color} text-white flex items-center justify-center font-bold text-sm shadow-md`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                            {member.title}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-medium">স্বপনস ওয়ার্ল্ড টিম</span>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900">
                          <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 block">{done} টি</span>
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">কাজ শেষ</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900">
                          <span className="text-base font-extrabold text-blue-600 dark:text-blue-400 block">{remaining} টি</span>
                          <span className="text-[10px] text-blue-700 dark:text-blue-400 font-bold">কাজ বাকি</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1 font-bold text-slate-600 dark:text-slate-400">
                        <span>অগ্রগতি</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* QUICK ADD TASK MODAL (নতুন কাজ যোগ করুন) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Plus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">নতুন কাজ যুক্ত করুন</h3>
                  <p className="text-xs text-slate-400">স্বপনস ওয়ার্ল্ড টিম মেম্বারদের জন্য কাজ অ্যাসাইন করুন</p>
                </div>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">
                  কাজের নাম বা শিরোনাম (Task Title) *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="যেমন: নতুন ঈদ কালেকশন ভিডিও এডিটিং"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">কার কাজ (Assignee) *</label>
                  <select
                    value={newAssignee}
                    onChange={(e) => {
                      const val = e.target.value as TeamMember;
                      setNewAssignee(val);
                      if (val === "designer") setNewDepartment("design");
                      else if (val === "editor1" || val === "editor2") setNewDepartment("video");
                      else if (val === "videographer") setNewDepartment("shoot");
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="designer">🎨 গ্রাফিক ডিজাইনার</option>
                    <option value="editor1">🎬 ভিডিও এডিটর ০১</option>
                    <option value="editor2">🎬 ভিডিও এডিটর ০২</option>
                    <option value="videographer">📹 ভিডিওগ্রাফার / শুটার</option>
                    <option value="head">👑 ক্রিয়েটিভ টিম হেড</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">সময়সীমা / ডেডলাইন *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="today">আজকের কাজ (Today)</option>
                    <option value="tomorrow">আগামীকালকের কাজ (Tomorrow)</option>
                    <option value="3days">৩ দিনের ভেতর</option>
                    <option value="7days">৭ দিনের শিডিউল (১ সপ্তাহ)</option>
                    <option value="15days">১৫ দিনের শিডিউল</option>
                  </select>
                </div>
              </div>

              {newDepartment === "shoot" && (
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">শুটিং লোকেশন (Location)</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="যেমন: স্বপনস ওয়ার্ল্ড স্টুডিও, গুলশান, বা আউটডোর"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">কাজের বিবরণ বা নির্দেশনা (Instructions)</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="ভিডিও সাইজ, ডিজাইনের কালার বা ড্রাইভ লিংক..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={newIsUrgent}
                    onChange={(e) => setNewIsUrgent(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600"
                  />
                  <span>জরুরি কাজ (Urgent Priority)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-emerald-600 dark:text-emerald-400">
                  <input
                    type="checkbox"
                    checked={isCompletedImmediately}
                    onChange={(e) => setIsCompletedImmediately(e.target.checked)}
                    className="h-4 w-4 rounded text-emerald-600"
                  />
                  <span>কাজটি ইতোমধ্যে শেষ হয়েছে? (Mark Done)</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 text-xs font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  সংরক্ষণ করুন (Add Task)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
