"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Check,
  Plus,
  Clock,
  Calendar,
  Camera,
  Film,
  Palette,
  MapPin,
  Trash2,
  X,
  Lock,
  Unlock,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Video,
  FileText,
  Layers,
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
  location?: string;
  shootTime?: string;
  gearInfo?: string;
  isUrgent?: boolean;
}

const INITIAL_TASKS: SwaponTask[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    title: "সামার কালেকশন সোশ্যাল মিডিয়া ব্যানার সেট",
    assignee: "designer",
    assigneeName: "গ্রাফিক ডিজাইনার",
    department: "design",
    deadlineCategory: "today",
    dueDate: "আজ সন্ধ্যা ৬:০০",
    completed: false,
    isUrgent: true,
    notes: "ফেসবুক ও ইনস্টাগ্রাম সাইজ (1080x1080 & 1080x1920) প্রস্তুত করতে হবে।",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    title: "নতুন প্রোডাক্ট ক্যাম্পেইন — আউটডোর শুট",
    assignee: "videographer",
    assigneeName: "সিনেমাটোগ্রাফার / শুটার",
    department: "shoot",
    deadlineCategory: "today",
    dueDate: "আজ দুপুর ২:৩০ PM",
    completed: true,
    location: "ধানমন্ডি লেক ও স্টুডিও",
    shootTime: "2:30 PM – 5:00 PM",
    gearInfo: "Sony FX3 / A7S III • 24-70mm f/2.8 • Ronin RS3 Gimbal • 4K 60fps",
    notes: "ন্যাচারাল গোল্ডেন আওয়ার লাইটিং ফুটেজ এবং স্লো-মোশন ক্লোজ-আপ শট প্রয়োজন।",
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    title: "ভার্টিক্যাল টিকটক ও ইনস্টাগ্রাম রিলস এডিটিং (৯:১৬)",
    assignee: "editor1",
    assigneeName: "ভিডিও এডিটর ০১",
    department: "video",
    deadlineCategory: "today",
    dueDate: "আজ রাত ৮:০০",
    completed: false,
    isUrgent: true,
    notes: "প্রথম ৩ সেকেন্ডের স্ট্রং ভিজ্যুয়াল হুক, কাইনেটিক টাইপোগ্রাফি এবং কালার গ্রেডিং।",
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    title: "ইউটিউব মাস্টার ডকুমেন্টারি কাট ও সাউন্ড ডিজাইন (১৬:৯)",
    assignee: "editor2",
    assigneeName: "ভিডিও এডিটর ০২",
    department: "video",
    deadlineCategory: "tomorrow",
    dueDate: "আগামীকাল (Tomorrow)",
    completed: false,
    notes: "ভয়েসওভার মাস্টার ট্র‍্যাক সিঙ্ক, ব্যাকগ্রাউন্ড অ্যাম্বিয়েন্স ও এফেক্টস মিক্সিং।",
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    title: "ব্র্যান্ড লুকবুক ও ক্যাটালগ ফটো রিটাচিং",
    assignee: "designer",
    assigneeName: "গ্রাফিক ডিজাইনার",
    department: "design",
    deadlineCategory: "3days",
    dueDate: "৩ দিনের ভেতর",
    completed: false,
    notes: "হাই-এন্ড স্কিন রিটাচিং এবং প্রোডাক্ট কালার কারেকশন ক্লায়েন্ট অ্যাপ্রুভালের জন্য।",
  },
  {
    id: "66666666-6666-4666-8666-666666666666",
    title: "স্টুডিও ফ্যাশন পোর্ট্রেট ও মডেল সিনেমাটোগ্রাফি",
    assignee: "videographer",
    assigneeName: "সিনেমাটোগ্রাফার / শুটার",
    department: "shoot",
    deadlineCategory: "7days",
    dueDate: "৭ দিনের শিডিউল",
    completed: false,
    location: "স্বপনস ওয়ার্ল্ড মেইন স্টুডিও (ফ্লোর ২)",
    shootTime: "সকাল ১১:০০ AM",
    gearInfo: "Aputure 300d II Softbox • C-Stands • Reflector Panel",
    notes: "ইনডোর থিম্যাটিক ব্যাকড্রপ সেটআপ ও লাইটিং গ্রিড আগে থেকে প্রস্তুত রাখতে হবে।",
  },
  {
    id: "77777777-7777-4777-8777-777777777777",
    title: "পূর্ণাঙ্গ ব্র্যান্ড ক্যাম্পেইন ডেলিভারি ও ক্লায়েন্ট হস্তান্তর",
    assignee: "head",
    assigneeName: "ক্রিয়েটিভ ডিরেক্টর / হেড",
    department: "general",
    deadlineCategory: "15days",
    dueDate: "১৫ দিনের প্রজেক্ট মাইলস্টোন",
    completed: false,
    notes: "সবগুলো ফাইনাল মাস্টার রেন্ডার ও আর্টওয়ার্ক কোয়ালিটি চেকের পর ক্লায়েন্টকে ড্রাইভ শেয়ার।",
  },
];

export default function SwaponsWorldHub() {
  const [tasks, setTasks] = useState<SwaponTask[]>(INITIAL_TASKS);
  const [selectedMember, setSelectedMember] = useState<TeamMember>("all");
  const [activeTab, setActiveTab] = useState<"today" | "upcoming" | "shoots" | "overview">("today");
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
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
  const [newGearInfo, setNewGearInfo] = useState("");
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

    async function fetchSupabaseTasks() {
      try {
        const { data } = await supabase.from("tasks").select("*");
        if (data && data.length > 0) {
          const mapped: SwaponTask[] = data.map((t) => ({
            id: t.id,
            title: t.title,
            assignee: (t.department === "photography" ? "videographer" : t.department === "video_editing" ? "editor1" : "designer") as TeamMember,
            assigneeName: t.department === "photography" ? "সিনেমাটোগ্রাফার" : t.department === "video_editing" ? "ভিডিও এডিটর" : "গ্রাফিক ডিজাইনার",
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

  const updateTasks = (newTaskList: SwaponTask[]) => {
    setTasks(newTaskList);
    localStorage.setItem("swapons_world_tasks", JSON.stringify(newTaskList));
  };

  // Clock in Dhaka
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDhakaTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Dhaka",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now)
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

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

  // Toggle task complete (টিক দিয়ে কাজ সম্পন্ন)
  const toggleTask = async (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    updateTasks(updated);

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
      head: "ক্রিয়েটিভ ডিরেক্টর",
      designer: "গ্রাফিক ডিজাইনার",
      editor1: "ভিডিও এডিটর ০১",
      editor2: "ভিডিও এডিটর ০২",
      videographer: "সিনেমাটোগ্রাফার / শুটার",
    };

    const newId = getUUID();

    const newTask: SwaponTask = {
      id: newId,
      title: newTitle.trim(),
      assignee: newAssignee,
      assigneeName: assigneeNames[newAssignee],
      department: newDepartment,
      deadlineCategory: newCategory,
      dueDate: newDueDate || (newCategory === "today" ? "আজকের ভেতর" : newCategory === "tomorrow" ? "আগামীকাল" : newCategory === "3days" ? "৩ দিনের ভেতর" : newCategory === "7days" ? "৭ দিনের শিডিউল" : "১৫ দিনের প্রজেক্ট"),
      completed: isCompletedImmediately,
      notes: newNotes.trim() || undefined,
      location: newLocation.trim() || undefined,
      gearInfo: newGearInfo.trim() || undefined,
      isUrgent: newIsUrgent,
    };

    const updated = [newTask, ...tasks];
    updateTasks(updated);

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
    setNewGearInfo("");
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

  const todayTasks = filteredTasks.filter((t) => t.deadlineCategory === "today");
  const upcomingTasks = filteredTasks.filter((t) => t.deadlineCategory !== "today");
  const shootTasks = filteredTasks.filter((t) => t.department === "shoot");

  const totalCount = filteredTasks.length;
  const completedCount = filteredTasks.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0c0d] text-[#18181b] dark:text-[#f4f4f5] antialiased selection:bg-zinc-900 selection:text-white pb-24">
      {/* Studio Minimalist Header */}
      <header className="sticky top-0 z-40 bg-[#fafaf9]/90 dark:bg-[#0c0c0d]/90 backdrop-blur-md border-b border-stone-200 dark:border-zinc-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Studio Brandmark */}
          <div className="flex items-center gap-3.5">
            <div className="h-9 w-9 rounded-lg bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center font-studio-mono font-bold text-xs tracking-wider shadow-xs shrink-0">
              SW
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-zinc-950 dark:text-white">
                  স্বপনস ওয়ার্ল্ড
                </span>
                <span className="font-studio-mono text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-stone-200/70 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300">
                  STUDIO
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-zinc-400 font-medium">
                প্রোডাকশন ও টিম অ্যাসাইনমেন্ট ওয়ার্কবোর্ড
              </p>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Minimalist Clock */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-stone-100 dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 text-[11px] font-studio-mono text-stone-600 dark:text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>DHAKA {dhakaTime || "14:40:00"}</span>
            </div>

            {/* Admin Switch */}
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border ${
                isAdmin
                  ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  : "bg-transparent border-transparent text-stone-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {isAdmin ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
              <span>{isAdmin ? "হেড মোড" : "টিম ভিউ"}</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 rounded-md bg-zinc-950 hover:bg-zinc-800 active:scale-[0.98] text-white dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>নতুন কাজ</span>
            </button>
          </div>
        </div>

        {/* Minimalist Filter Navigation */}
        <div className="border-t border-stone-200/70 dark:border-zinc-800/80 bg-stone-50/50 dark:bg-zinc-950/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[11px] font-studio-mono uppercase tracking-wider text-stone-400 shrink-0 mr-1.5">
              ফিল্টার:
            </span>

            {[
              { id: "all", label: "সকল কাজ", count: tasks.length },
              { id: "designer", label: "গ্রাফিক ডিজাইন", count: tasks.filter((t) => t.assignee === "designer").length },
              { id: "editor1", label: "ভিডিও এডিটিং ০১", count: tasks.filter((t) => t.assignee === "editor1").length },
              { id: "editor2", label: "ভিডিও এডিটিং ০২", count: tasks.filter((t) => t.assignee === "editor2").length },
              { id: "videographer", label: "সিনেমাটোগ্রাফি ও শুট", count: tasks.filter((t) => t.assignee === "videographer").length },
              { id: "head", label: "ডিরেকশন", count: tasks.filter((t) => t.assignee === "head").length },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMember(m.id as TeamMember)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedMember === m.id
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-2xs"
                    : "text-stone-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-zinc-900"
                }`}
              >
                <span>{m.label}</span>
                <span
                  className={`text-[10px] font-studio-mono ${
                    selectedMember === m.id
                      ? "text-zinc-300 dark:text-zinc-700 font-semibold"
                      : "text-stone-400 dark:text-zinc-500"
                  }`}
                >
                  {m.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-7 space-y-7">
        {/* Studio Dispatch Progress Strip */}
        <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-studio-mono uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                <span>PRODUCTION STATUS</span>
                <span>•</span>
                <span>{selectedMember === "all" ? "OVERALL TEAM" : tasks.find(t => t.assignee === selectedMember)?.assigneeName}</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white font-studio-mono">
                  {completedCount < 10 ? "০" + completedCount : completedCount}
                </span>
                <span className="text-xl sm:text-2xl text-stone-400 dark:text-zinc-500 font-light font-studio-mono">
                  / {totalCount < 10 ? "০" + totalCount : totalCount}
                </span>
                <span className="text-sm font-medium text-stone-600 dark:text-zinc-400 ml-1">
                  কাজ সম্পন্ন ({progressPercent}%)
                </span>
              </div>
            </div>

            {/* Quick Metrics Columns */}
            <div className="flex items-center gap-5 sm:gap-7 text-xs border-t md:border-t-0 md:border-l border-stone-200 dark:border-zinc-800 pt-3 md:pt-0 md:pl-7">
              <div>
                <span className="text-stone-400 dark:text-zinc-500 block text-[11px] font-studio-mono uppercase">
                  আজকের শিডিউল
                </span>
                <span className="text-base font-semibold text-zinc-900 dark:text-white font-studio-mono mt-0.5 block">
                  {todayTasks.length} টি
                </span>
              </div>
              <div>
                <span className="text-stone-400 dark:text-zinc-500 block text-[11px] font-studio-mono uppercase">
                  বাকি কাজ
                </span>
                <span className="text-base font-semibold text-zinc-900 dark:text-white font-studio-mono mt-0.5 block">
                  {pendingCount} টি
                </span>
              </div>
              <div>
                <span className="text-stone-400 dark:text-zinc-500 block text-[11px] font-studio-mono uppercase">
                  আসন্ন শুট
                </span>
                <span className="text-base font-semibold text-zinc-900 dark:text-white font-studio-mono mt-0.5 block">
                  {shootTasks.length} স্পট
                </span>
              </div>
            </div>
          </div>

          {/* Minimalist hairline progress bar */}
          <div className="mt-5">
            <div className="h-1.5 w-full bg-stone-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* View Segmented Tabs */}
        <div className="flex items-center gap-1 border-b border-stone-200 dark:border-zinc-800 pb-2">
          <button
            onClick={() => setActiveTab("today")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "today"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-2xs"
                : "text-stone-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-900"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>আজকের শিডিউল ({todayTasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "upcoming"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-2xs"
                : "text-stone-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-900"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>৭–১৫ দিনের পাইপলাইন ({upcomingTasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("shoots")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "shoots"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-2xs"
                : "text-stone-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-900"
            }`}
          >
            <Camera className="h-3.5 w-3.5" />
            <span>সিনেমাটোগ্রাফি ও শুট ট্র্যাকার ({shootTasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-2xs"
                : "text-stone-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-900"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>টিম পারফরম্যান্স</span>
          </button>
        </div>

        {/* TAB 1: আজকের কাজ (TODAY'S PRODUCTION SHEET) */}
        {activeTab === "today" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
                  আজকের প্রোডাকশন অ্যাসাইনমেন্ট
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-zinc-400">
                  কাজ সম্পন্ন হলে বামপাশের বক্সে টিক দিন।
                </p>
              </div>
              <span className="font-studio-mono text-[11px] text-stone-400">
                {todayTasks.filter(t => t.completed).length} of {todayTasks.length} DONE
              </span>
            </div>

            {todayTasks.length === 0 ? (
              <div className="p-10 text-center rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800">
                <CheckCircle2 className="h-8 w-8 text-stone-400 mx-auto mb-2.5" />
                <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  আজকের কোনো পেন্ডিং অ্যাসাইনমেন্ট নেই
                </h4>
                <p className="text-xs text-stone-400 mt-1">সব কাজ সম্পন্ন হয়েছে অথবা নতুন কোনো শিডিউল নেই।</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-3.5 px-3.5 py-1.5 rounded-md bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-medium cursor-pointer"
                >
                  + নতুন অ্যাসাইনমেন্ট যোগ করুন
                </button>
              </div>
            ) : (
              <div className="divide-y divide-stone-200/80 dark:divide-zinc-800 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 overflow-hidden shadow-2xs">
                {todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 sm:p-4.5 transition-colors flex items-start justify-between gap-4 ${
                      task.completed
                        ? "bg-stone-50/50 dark:bg-zinc-950/30"
                        : "hover:bg-stone-50/60 dark:hover:bg-zinc-800/40"
                    }`}
                  >
                    {/* Left: Checkbox & Content */}
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      {/* Minimalist Round Checkbox */}
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                          task.completed
                            ? "bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-white dark:text-zinc-950"
                            : "border-stone-300 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-400 bg-transparent"
                        }`}
                        title={task.completed ? "Mark incomplete" : "Mark as done"}
                      >
                        {task.completed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </button>

                      <div className="min-w-0 space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-sm font-medium leading-snug cursor-pointer ${
                              task.completed
                                ? "line-through text-stone-400 dark:text-zinc-500 font-normal"
                                : "text-zinc-900 dark:text-white"
                            }`}
                            onClick={() => toggleTask(task.id)}
                          >
                            {task.title}
                          </span>

                          {task.isUrgent && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-studio-mono font-medium text-rose-600 dark:text-rose-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                              URGENT
                            </span>
                          )}
                        </div>

                        {task.notes && (
                          <p className="text-xs text-stone-500 dark:text-zinc-400 leading-relaxed font-normal">
                            {task.notes}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2.5 pt-1 text-[11px] text-stone-500 dark:text-zinc-400">
                          {/* Assignee Badge */}
                          <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 font-medium">
                            {task.assigneeName}
                          </span>

                          <span className="font-studio-mono text-stone-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.dueDate}
                          </span>

                          {task.location && (
                            <span className="flex items-center gap-1 text-stone-600 dark:text-zinc-300">
                              <MapPin className="h-3 w-3 text-stone-400" />
                              {task.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`text-[11px] font-medium px-2.5 py-1 rounded border transition-all cursor-pointer ${
                          task.completed
                            ? "bg-transparent border-stone-200 dark:border-zinc-800 text-stone-400 hover:text-zinc-800"
                            : "bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border-transparent"
                        }`}
                      >
                        {task.completed ? "সম্পন্ন" : "টিক দিন"}
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1.5 rounded text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="অ্যাসাইনমেন্ট ডিলিট"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: আগামী ৭–১৫ দিনের কাজের শিডিউল (UPCOMING PIPELINE) */}
        {activeTab === "upcoming" && (
          <div className="space-y-4">
            <div className="pb-1">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
                অগ্রিম কাজের পাইপলাইন (৭ থেকে ১৫ দিন)
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-zinc-400">
                আসন্ন প্রোডাকশন ডেলিভারি ও মাইলস্টোন শিডিউল।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4.5 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 shadow-2xs flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-studio-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300">
                        {task.deadlineCategory === "tomorrow"
                          ? "আগামীকাল"
                          : task.deadlineCategory === "3days"
                          ? "৩ দিনের ভেতর"
                          : task.deadlineCategory === "7days"
                          ? "৭ দিনের শিডিউল"
                          : "১৫ দিনের প্রজেক্ট"}
                      </span>

                      <span className="font-studio-mono text-[11px] text-stone-400">
                        {task.dueDate}
                      </span>
                    </div>

                    <h4 className={`text-sm font-semibold text-zinc-950 dark:text-white mt-2 ${task.completed ? "line-through text-stone-400 dark:text-zinc-500" : ""}`}>
                      {task.title}
                    </h4>

                    {task.notes && (
                      <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1 leading-relaxed">
                        {task.notes}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-xs text-stone-600 dark:text-zinc-400 font-medium">
                      {task.assigneeName}
                    </span>

                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer border ${
                        task.completed
                          ? "bg-transparent border-stone-200 dark:border-zinc-800 text-stone-400"
                          : "bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 border-transparent hover:bg-zinc-800"
                      }`}
                    >
                      {task.completed && <Check className="h-3 w-3" />}
                      <span>{task.completed ? "সম্পন্ন" : "সম্পন্ন করুন"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: সিনেমাটোগ্রাফি ও শুট ট্র্যাকার (CINEMATOGRAPHY CALL SHEET) */}
        {activeTab === "shoots" && (
          <div className="space-y-4">
            <div className="pb-1">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
                সিনেমাটোগ্রাফি ও শুটিং কল শিট
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-zinc-400">
                শুটিং স্পট, কল-টাইম, গিয়ার তালিকা ও টেকনিক্যাল ডিরেকশন।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shootTasks.map((shoot, idx) => (
                <div
                  key={shoot.id}
                  className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 shadow-2xs space-y-3.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-studio-mono text-[10px] uppercase tracking-wider text-stone-400">
                        CALL SHEET #{idx + 1 < 10 ? "0" + (idx + 1) : idx + 1}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white mt-0.5">
                        {shoot.title}
                      </h4>
                    </div>

                    <span
                      className={`text-[10px] font-studio-mono uppercase px-2 py-0.5 rounded border ${
                        shoot.completed
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300"
                          : "border-stone-200 bg-stone-100 text-stone-800 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      {shoot.completed ? "WRAPPED & BACKED UP" : "UPCOMING SHOOT"}
                    </span>
                  </div>

                  {/* Production specs table */}
                  <div className="rounded-lg bg-stone-50 dark:bg-zinc-950/50 p-3 border border-stone-200/60 dark:border-zinc-800/80 space-y-1.5 text-xs">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-stone-400 font-studio-mono text-[11px]">লোকেশন:</span>
                      <span className="text-zinc-900 dark:text-white font-medium text-right">{shoot.location || "মেইন স্টুডিও"}</span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-stone-400 font-studio-mono text-[11px]">কল-টাইম:</span>
                      <span className="text-zinc-900 dark:text-white font-medium font-studio-mono">{shoot.shootTime || shoot.dueDate}</span>
                    </div>
                    {shoot.gearInfo && (
                      <div className="flex items-baseline justify-between gap-2 pt-1 border-t border-stone-200/40 dark:border-zinc-800/60">
                        <span className="text-stone-400 font-studio-mono text-[11px]">গিয়ার সেটআপ:</span>
                        <span className="text-stone-700 dark:text-zinc-300 text-right text-[11px] font-mono">{shoot.gearInfo}</span>
                      </div>
                    )}
                  </div>

                  {shoot.notes && (
                    <p className="text-xs text-stone-500 dark:text-zinc-400 leading-relaxed">
                      <strong className="text-zinc-800 dark:text-zinc-200">ডিরেক্টর্স ব্রিফ:</strong> {shoot.notes}
                    </p>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-stone-500">
                      {shoot.assigneeName}
                    </span>

                    <button
                      onClick={() => toggleTask(shoot.id)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        shoot.completed
                          ? "bg-stone-200 text-stone-800 dark:bg-zinc-800 dark:text-zinc-200"
                          : "bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 hover:bg-zinc-800 shadow-2xs"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                      <span>{shoot.completed ? "শুট সম্পন্ন হয়েছে" : "শুট শেষ হলে টিক দিন"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: টিম পারফরম্যান্স (TEAM WORKLOAD) */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="pb-1">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
                টিম মেম্বারদের কাজের বিশ্লেষণ
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-zinc-400">
                কার কয়টি অ্যাসাইনমেন্ট সম্পন্ন হয়েছে এবং কার কতটুকু বাকি আছে।
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: "designer", title: "গ্রাফিক ডিজাইনার", roleTag: "DESIGN" },
                { id: "editor1", title: "ভিডিও এডিটর ০১", roleTag: "VIDEO 01" },
                { id: "editor2", title: "ভিডিও এডিটর ০২", roleTag: "VIDEO 02" },
                { id: "videographer", title: "সিনেমাটোগ্রাফার", roleTag: "CINEMA" },
              ].map((member) => {
                const memberTasks = tasks.filter((t) => t.assignee === member.id);
                const done = memberTasks.filter((t) => t.completed).length;
                const remaining = memberTasks.length - done;
                const pct = memberTasks.length > 0 ? Math.round((done / memberTasks.length) * 100) : 0;

                return (
                  <div
                    key={member.id}
                    className="p-4.5 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 shadow-2xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
                          {member.title}
                        </h4>
                        <span className="font-studio-mono text-[10px] text-stone-400 px-1.5 py-0.5 rounded bg-stone-100 dark:bg-zinc-800">
                          {member.roleTag}
                        </span>
                      </div>

                      <div className="mt-4 flex items-baseline justify-between">
                        <div>
                          <span className="text-2xl font-bold font-studio-mono text-zinc-900 dark:text-white">
                            {done}
                          </span>
                          <span className="text-stone-400 font-studio-mono text-sm"> / {memberTasks.length}</span>
                        </div>
                        <span className="text-xs font-semibold font-studio-mono text-stone-600 dark:text-zinc-400">
                          {pct}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="h-1.5 w-full bg-stone-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2 font-studio-mono">
                        <span>বাকি: {remaining}টি</span>
                        <span>সম্পন্ন: {done}টি</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* MINIMALIST STUDIO ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-stone-200 dark:border-zinc-800 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                  নতুন কাজের অ্যাসাইনমেন্ট
                </h3>
                <p className="text-xs text-stone-400">স্বপনস ওয়ার্ল্ড ক্রিয়েটিভ টিমের জন্য কাজ বরাদ্দ করুন</p>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded text-stone-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                  শিরোনাম / কাজের বিবরণ *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="যেমন: নতুন ঈদ ক্যাম্পেইনের ইনস্টাগ্রাম রিলস"
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">কার অ্যাসাইনমেন্ট *</label>
                  <select
                    value={newAssignee}
                    onChange={(e) => {
                      const val = e.target.value as TeamMember;
                      setNewAssignee(val);
                      if (val === "designer") setNewDepartment("design");
                      else if (val === "editor1" || val === "editor2") setNewDepartment("video");
                      else if (val === "videographer") setNewDepartment("shoot");
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  >
                    <option value="designer">গ্রাফিক ডিজাইনার</option>
                    <option value="editor1">ভিডিও এডিটর ০১</option>
                    <option value="editor2">ভিডিও এডিটর ০২</option>
                    <option value="videographer">সিনেমাটোগ্রাফার / শুটার</option>
                    <option value="head">ক্রিয়েটিভ ডিরেক্টর</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">সময়সীমা / ডেডলাইন *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  >
                    <option value="today">আজকের কাজ (Today)</option>
                    <option value="tomorrow">আগামীকালকের কাজ (Tomorrow)</option>
                    <option value="3days">৩ দিনের ভেতর</option>
                    <option value="7days">৭ দিনের শিডিউল</option>
                    <option value="15days">১৫ দিনের মাইলস্টোন</option>
                  </select>
                </div>
              </div>

              {newDepartment === "shoot" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">শুটিং লোকেশন</label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="যেমন: ধানমন্ডি লেক / স্টুডিও ২"
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">গিয়ার ও টেকনিক্যাল স্পেক্স</label>
                    <input
                      type="text"
                      value={newGearInfo}
                      onChange={(e) => setNewGearInfo(e.target.value)}
                      placeholder="যেমন: Sony FX3 • 4K 60fps • RS3"
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">ডিরেক্টর্স ব্রিফ ও নোট</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="রেফারেন্স লিংক, কালার প্যালেট, সাইজ বা ড্রাইভ লিংক..."
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-5 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={newIsUrgent}
                    onChange={(e) => setNewIsUrgent(e.target.checked)}
                    className="h-3.5 w-3.5 rounded text-zinc-900"
                  />
                  <span>জরুরি কাজ (Urgent Priority)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={isCompletedImmediately}
                    onChange={(e) => setIsCompletedImmediately(e.target.checked)}
                    className="h-3.5 w-3.5 rounded text-zinc-900"
                  />
                  <span>ইতোমধ্যে শেষ হয়েছে?</span>
                </label>
              </div>

              <div className="pt-3 border-t border-stone-200/80 dark:border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 rounded text-stone-600 hover:bg-stone-100 dark:text-zinc-400 dark:hover:bg-zinc-800 font-medium"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 font-semibold cursor-pointer shadow-2xs"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
