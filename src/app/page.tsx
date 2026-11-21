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
  Layers,
  FileText,
  Video,
  ExternalLink,
  Search,
  Filter,
  HardDrive,
  FileCode,
  Image as ImageIcon,
  LogOut,
  KeyRound,
  Shield,
  User,
  Users,
  Sparkles,
  Zap,
  Mic,
  Clapperboard,
  Sliders,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Copy,
  Pencil,
  Undo2,
  CheckCheck,
  PlaySquare,
  Archive,
  Hourglass,
  FileCheck,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Team Roles for Swapon's World
export type TeamMember = "all" | "head" | "video_editor" | "designer" | "videographer";

export interface SwaponTask {
  id: string;
  title: string;
  assignee: TeamMember;
  assigneeName: string;
  department: "design" | "video" | "shoot" | "general";
  deadlineCategory: "today" | "tomorrow" | "3days" | "7days" | "15days";
  dueDate: string;
  completed: boolean;
  statusState?: "not_done" | "in_progress" | "completed";
  notes?: string;
  referenceVideoUrl?: string; // রেফারেন্স ভিডিওর লিংক (YouTube, Reels, Drive)
  scriptText?: string;        // সম্পূর্ণ স্ক্রিপ্ট বা ভয়েসওভার টেক্সট
  driveUrl?: string;
  location?: string;
  shootTime?: string;
  gearInfo?: string;
  isUrgent?: boolean;
}

export interface StudioFile {
  id: string;
  title: string;
  fileName: string;
  fileType: "video" | "image" | "project" | "document" | "folder";
  fileFormat: string;
  fileSize: string;
  driveUrl: string;
  owner: TeamMember;
  ownerName: string;
  status: "ready_for_review" | "approved" | "needs_revision" | "in_progress";
  uploadedAt: string;
  notes?: string;
  referenceVideoUrl?: string;
  scriptText?: string;
}

export interface AuthSession {
  role: TeamMember;
  isAdmin: boolean;
  displayName: string;
}

// Initial Production Tasks
const INITIAL_TASKS: SwaponTask[] = [
  // 1. 🟡 আজকের জরুরি কাজ (Action Today - Amber)
  {
    id: "task-vid-1",
    title: "সামার সেলস টিকটক ও ইনস্টাগ্রাম রিলস ভার্টিক্যাল কাট (৯:১৬)",
    assignee: "video_editor",
    assigneeName: "ভিডিও এডিটর",
    department: "video",
    deadlineCategory: "today",
    dueDate: "আজ সন্ধ্যা ৬:০০ (Today)",
    completed: false,
    isUrgent: true,
    referenceVideoUrl: "https://youtube.com/shorts/sample-reels-reference",
    scriptText: `[হুক (০-৩ সেকেন্ড)]:
"আপনি কি জানেন আপনার বিজনেসের সেলস ৩০% কমে যেতে পারে মাত্র একটি ভুলের কারণে?"

[বডি (৩-২০ সেকেন্ড)]:
"স্বপনস ওয়ার্ল্ড এর প্রিমিয়াম ভিডিও প্রোডাকশন দিয়ে আপনার ব্র‍্যান্ডকে নিয়ে যান অনন্য উচ্চতায়। হাই-কোয়ালিটি সিনেমাটিক ফুটেজ ও ট্রেন্ডিং বিটস।"

[কল টু অ্যাকশন (২০-৩০ সেকেন্ড)]:
"দেরি না করে আজই বায়োতে দেওয়া লিংকে ক্লিক করুন অথবা ইনবক্সে মেসেজ পাঠান!"`,
    notes: "প্রথম ৩ সেকেন্ডের হুক, ফাস্ট ট্রানজিশন এবং ট্রেন্ডিং সাউন্ড এফেক্টস সিঙ্ক করবেন। ড্রাইভ থেকে ফুটেজ ফোল্ডার লিঙ্ক করুন।",
  },
  // 2. 🟡 আজকের কাজ — ভয়েসওভার সিঙ্ক (Action Today - Amber)
  {
    id: "task-vid-2",
    title: "ভয়েসওভার ও সাউন্ড সিঙ্ক মাস্টার (Voiceover & Audio)",
    assignee: "video_editor",
    assigneeName: "ভিডিও এডিটর",
    department: "video",
    deadlineCategory: "today",
    dueDate: "আজ রাত ৮:০০ (Today)",
    completed: false,
    isUrgent: true,
    referenceVideoUrl: "https://drive.google.com/file/d/voiceover-audio-reference/view",
    scriptText: `[ভয়েসওভার মাস্টার স্ক্রিপ্ট — স্বপনস ওয়ার্ল্ড ক্রিয়েটিভ স্টুডিও]:
"সঠিক পরিকল্পনাই একটি সফল ব্র্যান্ডের মূল ভিত্তি। প্রতিটি ভিজ্যুয়াল, প্রতিটি কালার টোন আর প্রতিটি কাট—আমরা সাজিয়ে তুলি আপনার স্বপ্নের মতো করে। কারণ আপনার গল্পটি অসাধারণ হতে বাধ্য।"
(নির্দেশনা: ব্যাকগ্রাউন্ড সাউন্ড -14 LUFS নরম্যালাইজ করুন, নয়েজ ফ্রি অডিও মাস্টার করবেন)`,
    notes: "ভয়েসওভার ক্লিন করা, ব্যাকগ্রাউন্ড নয়েজ রিমুভ ও সাউন্ড লেভেল -14 LUFS নরম্যালাইজেশন।",
  },
  // 3. 🔴 যে কাজ হয় নাই / পেন্ডিং (Not Done / Pending - Rose/Red)
  {
    id: "task-vid-3",
    title: "প্রোডাক্ট টিজার ও বি-রোল কাট — রিভিশন পেন্ডিং",
    assignee: "video_editor",
    assigneeName: "ভিডিও এডিটর",
    department: "video",
    deadlineCategory: "tomorrow",
    dueDate: "কালকের ভেতরেই শেষ করতে হবে",
    completed: false,
    statusState: "not_done",
    referenceVideoUrl: "https://youtube.com/shorts/product-teaser-sample",
    scriptText: `[টিজার টেক্সট সুপার ও ভয়েসওভার]:
"আগামীকাল আসছে নতুন চমক। চোখ রাখুন স্বপনস ওয়ার্ল্ড পেইজে!"`,
    notes: "হেডের রিভিউ নোট: মিউজিকের বিটের সাথে কাট ফাস্ট করতে হবে। আগের কাজ এখনও সম্পন্ন হয় নাই।",
  },
  // 4. 🟣 আগামী ৭ দিনের ভেতর কাজ (Upcoming 7 Days - Purple)
  {
    id: "task-vid-4",
    title: "ইউটিউব ফুল ডকুমেন্টারি ভিডিও কাট ও কালার গ্রেডিং (১৬:৯)",
    assignee: "video_editor",
    assigneeName: "ভিডিও এডিটর",
    department: "video",
    deadlineCategory: "7days",
    dueDate: "আগামী ৭ দিনের ভেতর (7 Days)",
    completed: false,
    referenceVideoUrl: "https://youtube.com/watch?v=sample-documentary-grade",
    scriptText: `[ডকুমেন্টারি ভয়েসওভার পর্ব ০১]:
"ঢাকার বুকে ক্রিয়েটিভ ইন্ডাস্ট্রির নতুন বিপ্লব শুরু হয়েছিল এই স্টুডিও থেকেই। যেখানে আইডিয়া রূপ নেয় সেলুলয়েডের পর্দায়..."`,
    notes: "১৬:৯ ইউটিউব মাস্টার কাট, বি-রোল সিঙ্ক, সাউন্ড ডিজাইন ও Rec.709 কালার গ্রেডিং।",
  },
  // 5. 🟢 কাজ সম্পন্ন ও অ্যাপ্রুভড (Done / Approved - Emerald)
  {
    id: "task-vid-5",
    title: "ইউটিউব ইন্ট্রো ও মোশন গ্রাফিক্স কাট",
    assignee: "video_editor",
    assigneeName: "ভিডিও এডিটর",
    department: "video",
    deadlineCategory: "today",
    dueDate: "আজ দুপুর ২:০০",
    completed: true,
    statusState: "completed",
    referenceVideoUrl: "https://youtube.com/watch?v=intro-motion-ref",
    notes: "ফাইনাল রেন্ডার সম্পন্ন হয়েছে এবং ড্রাইভ স্টুডিও ফোল্ডারে আপলোড করা আছে।",
  },

  // Graphic Design Tasks
  {
    id: "task-des-1",
    title: "সামার কালেকশন সোশ্যাল মিডিয়া ব্যানার সেট (১০৮০x১০৮০)",
    assignee: "designer",
    assigneeName: "গ্রাফিক ডিজাইনার",
    department: "design",
    deadlineCategory: "today",
    dueDate: "আজ দুপুর ৩:০০ (Today)",
    completed: false,
    isUrgent: true,
    scriptText: `[ব্যানার টেক্সট ও টাইপোগ্রাফি]:
"SUMMER DROP 2026 • FLAT 40% OFF"
সাব-টেক্সট: "Shop Now at Swapon's World"`,
    notes: "ফেসবুক ও ইনস্টাগ্রাম স্কয়ার পোস্ট এবং স্টোরি সাইজ প্রস্তুত করতে হবে।",
  },
  {
    id: "task-des-2",
    title: "ক্যাটালগ ও ফটো ম্যানিপুলেশন — কারেকশন পেন্ডিং",
    assignee: "designer",
    assigneeName: "গ্রাফিক ডিজাইনার",
    department: "design",
    deadlineCategory: "tomorrow",
    dueDate: "কালকের মধ্যে",
    completed: false,
    statusState: "not_done",
    notes: "স্কিন রিটাচিং এবং প্রোডাক্টের কালার কারেকশন এখনো হয় নাই।",
  },
  {
    id: "task-des-3",
    title: "ব্র্যান্ড লুকবুক ও হাই-এন্ড ফটো রিটাচিং",
    assignee: "designer",
    assigneeName: "গ্রাফিক ডিজাইনার",
    department: "design",
    deadlineCategory: "7days",
    dueDate: "আগামী ৭ দিনের শিডিউল",
    completed: true,
    statusState: "completed",
    notes: "প্রোডাক্ট লুকবুক ও স্কিন রিটাচিং ক্লায়েন্ট ফাইনাল ডেলিভারির জন্য প্রস্তুত ও অ্যাপ্রুভড।",
  },

  // Videographer / Shooter Tasks
  {
    id: "task-sht-1",
    title: "নতুন প্রোডাক্ট ক্যাম্পেইন — আউটডোর শুট",
    assignee: "videographer",
    assigneeName: "সিনেমাটোগ্রাফার / শুটার",
    department: "shoot",
    deadlineCategory: "today",
    dueDate: "আজ দুপুর ২:৩০ PM (Today)",
    completed: false,
    isUrgent: true,
    location: "ধানমন্ডি লেক ও আউটডোর স্পট",
    shootTime: "দুপুর ২:৩০ PM – ৫:০০ PM",
    gearInfo: "Sony FX3 • 24-70mm f/2.8 • Ronin RS3 Gimbal • 4K 60fps",
    notes: "ন্যাচারাল গোল্ডেন আওয়ার লাইটিং ও স্লো-মোশন ক্লোজ-আপ শট। ফুটেজ ড্রাইভে ব্যাকআপ করতে হবে।",
  },
  {
    id: "task-sht-2",
    title: "ইনডোর মডেল ও ফ্যাশন শুট (স্বপনস ওয়ার্ল্ড স্টুডিও ২)",
    assignee: "videographer",
    assigneeName: "সিনেমাটোগ্রাফার / শুটার",
    department: "shoot",
    deadlineCategory: "7days",
    dueDate: "আগামী ৭ দিনের ভেতর",
    completed: false,
    location: "স্বপনস ওয়ার্ল্ড মেইন স্টুডিও (ফ্লোর ২)",
    shootTime: "সকাল ১১:০০ AM",
    gearInfo: "Aputure 300d II Softbox • C-Stands • Reflector Panel",
    notes: "ইনডোর থিম্যাটিক ব্যাকড্রপ ও লাইটিং গ্রিড আগে থেকে প্রস্তুত রাখা প্রয়োজন।",
  },
];

// Initial Deliverables & Files
const INITIAL_FILES: StudioFile[] = [
  {
    id: "file-vid-1",
    title: "সামার সেলস ৯:১৬ ভার্টিক্যাল রিলস — ড্রাফট রেন্ডার",
    fileName: "Summer_Reels_Hook_V3_4K.mp4",
    fileType: "video",
    fileFormat: "MP4 (4K 60fps)",
    fileSize: "285 MB",
    driveUrl: "https://drive.google.com/drive/folders/swapons_world_video",
    owner: "video_editor",
    ownerName: "ভিডিও এডিটর",
    status: "ready_for_review",
    uploadedAt: "২১ নভেম্বর, দুপুর ০১:১৫",
    notes: "কালার গ্রেডিং Rec.709 স্ট্যান্ডার্ড এবং সাউন্ড লেভেল -14 LUFS নরম্যালাইজ করা হয়েছে। হেডের রিভিউর জন্য প্রস্তুত।",
  },
  {
    id: "file-vid-2",
    title: "ইউটিউব মাস্টার ডকুমেন্টারি কাট ও কালার গ্রেড (১৬:৯)",
    fileName: "Youtube_Documentary_16x9_Master.mp4",
    fileType: "video",
    fileFormat: "MP4 (4K UHD)",
    fileSize: "3.4 GB",
    driveUrl: "https://drive.google.com/drive/folders/swapons_world_video",
    owner: "video_editor",
    ownerName: "ভিডিও এডিটর",
    status: "needs_revision",
    uploadedAt: "২১ নভেম্বর, সকাল ১১:৪৫",
    notes: "হেডের কমেন্ট: বি-রোল কাটে আরো ২টা স্লো-মোশন শট যোগ করতে হবে। সাউন্ডের বিজিএম ভলিউম একটু কমাতে হবে।",
  },
  {
    id: "file-vid-3",
    title: "টিকটক প্রোডাক্ট অ্যাডভার্টাইজমেন্ট প্রজেক্ট ফাইল",
    fileName: "Tiktok_Product_Ad_Cut_Final.prproj",
    fileType: "project",
    fileFormat: "Premiere Pro (.prproj)",
    fileSize: "32 MB",
    driveUrl: "https://drive.google.com/drive/folders/swapons_world_video",
    owner: "video_editor",
    ownerName: "ভিডিও এডিটর",
    status: "approved",
    uploadedAt: "২০ নভেম্বর, সন্ধ্যা ০৭:০০",
    notes: "সম্পূর্ণ প্রোজেক্ট ফাইল ও ট্রাঞ্জিশন প্রিসেট ক্লায়েন্ট দ্বারা অ্যাপ্রুভড এবং ড্রাইভে ব্যাকআপ সংরক্ষিত।",
  },
  {
    id: "file-des-1",
    title: "সামার কালেকশন স্কয়ার পোস্ট ব্যানার (১০৮০x১০৮০)",
    fileName: "Summer_Collection_Banner_1080x1080.psd",
    fileType: "image",
    fileFormat: "Photoshop (.psd)",
    fileSize: "420 MB",
    driveUrl: "https://drive.google.com/drive/folders/swapons_world_design",
    owner: "designer",
    ownerName: "গ্রাফিক ডিজাইনার",
    status: "approved",
    uploadedAt: "২১ নভেম্বর, দুপুর ১২:০০",
    notes: "সবগুলো লেয়ার আনগ্রুপড ও ফন্ট আউটলাইন করা অবস্থায় আপলোড করা। হেড অ্যাপ্রুভড।",
  },
  {
    id: "file-sht-1",
    title: "ধানমন্ডি লেক আউটডোর শুট র ফুটেজ ফোল্ডার",
    fileName: "Dhanmondi_Lake_Shoot_Raw_Clips_Folder.drive",
    fileType: "folder",
    fileFormat: "Sony XAVC S (4K 60fps)",
    fileSize: "48 GB",
    driveUrl: "https://drive.google.com/drive/folders/swapons_world_footage",
    owner: "videographer",
    ownerName: "সিনেমাটোগ্রাফার / শুটার",
    status: "approved",
    uploadedAt: "২১ নভেম্বর, দুপুর ০১:০০",
    notes: "সনি এফএক্সথ্রি দিয়ে শুট করা ৬০টি ক্লিপ গুগল ড্রাইভ স্টুডিওতে ব্যাকআপ সম্পন্ন ও অ্যাপ্রুভড।",
  },
];

export default function SwaponsWorldApp() {
  // Theme State (Dark / Light Studio Mode)
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Authentication State
  const [session, setSession] = useState<AuthSession | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Login form state
  const [loginTab, setLoginTab] = useState<"team" | "admin">("team");
  const [teamRoleSelect, setTeamRoleSelect] = useState<TeamMember>("video_editor");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // App Data State
  const [tasks, setTasks] = useState<SwaponTask[]>(INITIAL_TASKS);
  const [files, setFiles] = useState<StudioFile[]>(INITIAL_FILES);
  const [dhakaTime, setDhakaTime] = useState("");

  // Section Tabs (Separation of Pending vs Approved)
  const [taskSectionTab, setTaskSectionTab] = useState<"pending" | "approved">("pending");
  const [fileSectionTab, setFileSectionTab] = useState<"pending" | "approved">("pending");

  // Filter States
  const [adminViewFilter, setAdminViewFilter] = useState<TeamMember>("all");
  const [statusColorFilter, setStatusColorFilter] = useState<"all" | "today" | "not_done" | "week" | "completed">("all");
  const [fileSearch, setFileSearch] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");

  // Accordion Expand State for Script Text (Keeps Task rows sleek and uncluttered)
  const [expandedScripts, setExpandedScripts] = useState<Record<string, boolean>>({});

  // Clipboard Feedback State
  const [copiedTaskId, setCopiedTaskId] = useState<string | null>(null);

  // Add Task Modal & Automation State
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAssignee, setNewAssignee] = useState<TeamMember>("video_editor");
  const [newCategory, setNewCategory] = useState<"today" | "tomorrow" | "3days" | "7days" | "15days">("today");
  const [newDepartment, setNewDepartment] = useState<"design" | "video" | "shoot" | "general">("video");
  const [newDueDate, setNewDueDate] = useState("");
  const [newReferenceVideoUrl, setNewReferenceVideoUrl] = useState("");
  const [newScriptText, setNewScriptText] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newGearInfo, setNewGearInfo] = useState("");
  const [newIsUrgent, setNewIsUrgent] = useState(false);

  // Edit Task Modal State
  const [editingTask, setEditingTask] = useState<SwaponTask | null>(null);

  // Add File Modal (For Team Deliverable Submission)
  const [showAddFileModal, setShowAddFileModal] = useState(false);
  const [newFileTitle, setNewFileTitle] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [newFileType, setNewFileType] = useState<"video" | "image" | "project" | "document" | "folder">("video");
  const [newFileFormat, setNewFileFormat] = useState("MP4 (4K 60fps)");
  const [newFileSize, setNewFileSize] = useState("");
  const [newDriveUrl, setNewDriveUrl] = useState("");
  const [newFileNotes, setNewFileNotes] = useState("");

  // Edit File Modal State
  const [editingFile, setEditingFile] = useState<StudioFile | null>(null);

  const supabase = createClient();

  // Initialize Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("swapons_world_theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const activeTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(activeTheme);
    if (activeTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("swapons_world_theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleScriptExpand = (taskId: string) => {
    setExpandedScripts((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  // Safe ID generator (UUID compliant)
  const generateId = (prefix: string) => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  };

  // Load Session & LocalStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem("swapons_world_session");
    if (savedAuth) {
      try {
        setSession(JSON.parse(savedAuth));
      } catch (e) {}
    }
    setAuthChecked(true);

    const savedTasks = localStorage.getItem("swapons_world_tasks");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {}
    }

    const savedFiles = localStorage.getItem("swapons_world_files");
    if (savedFiles) {
      try {
        setFiles(JSON.parse(savedFiles));
      } catch (e) {}
    }

    async function fetchSupabaseTasks() {
      try {
        const { data } = await supabase.from("tasks").select("*");
        if (data && data.length > 0) {
          const mapped: SwaponTask[] = data.map((t) => ({
            id: t.id,
            title: t.title,
            assignee: (t.department === "photography" ? "videographer" : t.department === "video_editing" ? "video_editor" : "designer") as TeamMember,
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

  // Clock
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

  // Robust Textarea Fallback for Clipboard Copy
  const fallbackCopyText = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleCopyScript = (taskId: string, text: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopiedTaskId(taskId);
          setTimeout(() => setCopiedTaskId(null), 2000);
        })
        .catch(() => {
          fallbackCopyText(text);
          setCopiedTaskId(taskId);
          setTimeout(() => setCopiedTaskId(null), 2000);
        });
    } else {
      fallbackCopyText(text);
      setCopiedTaskId(taskId);
      setTimeout(() => setCopiedTaskId(null), 2000);
    }
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const cleanPass = passwordInput.trim().toLowerCase();

    if (loginTab === "admin") {
      if (cleanPass === "admin123" || cleanPass === "swapon123" || cleanPass === "creativeflow#2026" || cleanPass === "admin") {
        const adminSession: AuthSession = {
          role: "head",
          isAdmin: true,
          displayName: "ক্রিয়েটিভ ডিরেক্টর (অ্যাডমিন)",
        };
        setSession(adminSession);
        localStorage.setItem("swapons_world_session", JSON.stringify(adminSession));
        setPasswordInput("");
      } else {
        setLoginError("অ্যাডমিন পাসওয়ার্ড সঠিক নয়। (ডিফল্ট: admin123)");
      }
    } else {
      if (cleanPass === "team123" || cleanPass === "1234" || cleanPass === "team" || cleanPass === "swapon") {
        const roleLabels: Record<TeamMember, string> = {
          video_editor: "ভিডিও এডিটর টিম",
          designer: "গ্রাফিক ডিজাইনার",
          videographer: "সিনেমাটোগ্রাফার / শুটার",
          head: "ক্রিয়েটিভ ডিরেক্টর",
          all: "টিম মেম্বার",
        };

        const teamSession: AuthSession = {
          role: teamRoleSelect,
          isAdmin: false,
          displayName: roleLabels[teamRoleSelect],
        };
        setSession(teamSession);
        localStorage.setItem("swapons_world_session", JSON.stringify(teamSession));
        setPasswordInput("");
      } else {
        setLoginError("টিম পাসওয়ার্ড সঠিক নয়। (ডিফল্ট: team123)");
      }
    }
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem("swapons_world_session");
    setPasswordInput("");
    setLoginError("");
  };

  const updateTasks = (newTaskList: SwaponTask[]) => {
    setTasks(newTaskList);
    localStorage.setItem("swapons_world_tasks", JSON.stringify(newTaskList));
  };

  const updateFiles = (newFileList: StudioFile[]) => {
    setFiles(newFileList);
    localStorage.setItem("swapons_world_files", JSON.stringify(newFileList));
  };

  // Toggle Task Complete (Move between Pending & Approved Archive)
  const toggleTask = async (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextCompleted = !t.completed;
        return {
          ...t,
          completed: nextCompleted,
          statusState: nextCompleted ? ("completed" as const) : undefined,
        };
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

  // Revert an accidentally approved task back to pending
  const revertTaskToPending = async (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          completed: false,
          statusState: "not_done" as const,
        };
      }
      return t;
    });
    updateTasks(updated);

    try {
      await supabase
        .from("tasks")
        .update({ status: "in_progress" })
        .eq("id", taskId);
    } catch (e) {}
  };

  // Status Cycle: [হয় নাই / লাল] -> [আজকের কাজ / হলুদ] -> [সম্পন্ন / সবুজ]
  const cycleTaskStatus = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        if (t.completed) {
          return { ...t, completed: false, statusState: "not_done" as const };
        } else if (t.statusState === "not_done") {
          return { ...t, completed: false, statusState: undefined, isUrgent: true, deadlineCategory: "today" as const, dueDate: "আজকের ভেতর (Today)" };
        } else {
          return { ...t, completed: true, statusState: "completed" as const };
        }
      }
      return t;
    });
    updateTasks(updated);
  };

  // Delete Task
  const deleteTask = async (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    updateTasks(updated);
    try {
      await supabase.from("tasks").delete().eq("id", taskId);
    } catch (e) {}
  };

  // =========================================================================
  // SMART AUTOMATION ENGINE
  // =========================================================================
  const applyAutomationPreset = (presetType: "reels" | "voiceover" | "youtube" | "banner" | "catalog" | "shoot_outdoor" | "shoot_indoor") => {
    switch (presetType) {
      case "reels":
        setNewTitle("নতুন ইনস্টাগ্রাম ও টিকটক রিলস এডিটিং (৯:১৬)");
        setNewAssignee("video_editor");
        setNewDepartment("video");
        setNewCategory("today");
        setNewDueDate("আজকের ভেতর (Today)");
        setNewIsUrgent(true);
        setNewReferenceVideoUrl("https://youtube.com/shorts/sample-reels-reference");
        setNewScriptText(`[হুক (০-৩ সেকেন্ড)]:
"আপনি কি জানেন আপনার বিজনেসের সেলস ৩০% কমে যেতে পারে মাত্র একটি ভুলের কারণে?"

[বডি (৩-২০ সেকেন্ড)]:
"স্বপনস ওয়ার্ল্ড এর প্রিমিয়াম ভিডিও প্রোডাকশন দিয়ে আপনার ব্র‍্যান্ডকে নিয়ে যান অনন্য উচ্চতায়। হাই-কোয়ালিটি সিনেমাটিক ফুটেজ ও ট্রেন্ডিং বিটস।"

[কল টু অ্যাকশন (২০-৩০ সেকেন্ড)]:
"দেরি না করে আজই বায়োতে দেওয়া লিংকে ক্লিক করুন অথবা ইনবক্সে মেসেজ পাঠান!"`);
        setNewNotes("প্রথম ৩ সেকেন্ডের হুক, দ্রুত ট্রানজিশন, কাইনেটিক সাবটাইটেল এবং ট্রেন্ডিং মিউজিক সিঙ্ক।");
        break;

      case "voiceover":
        setNewTitle("ভয়েসওভার ও সাউন্ড সিঙ্ক মাস্টার (Audio & Voiceover)");
        setNewAssignee("video_editor");
        setNewDepartment("video");
        setNewCategory("today");
        setNewDueDate("আজ রাত ৮:০০");
        setNewIsUrgent(true);
        setNewReferenceVideoUrl("https://drive.google.com/file/d/voiceover-audio-reference/view");
        setNewScriptText(`[ভয়েসওভার মাস্টার স্ক্রিপ্ট — স্বপনস ওয়ার্ল্ড ক্রিয়েটিভ স্টুডিও]:
"সঠিক পরিকল্পনাই একটি সফল ব্র্যান্ডের মূল ভিত্তি। প্রতিটি ভিজ্যুয়াল, প্রতিটি কালার টোন আর প্রতিটি কাট—আমরা সাজিয়ে তুলি আপনার স্বপ্নের মতো করে। কারণ আপনার গল্পটি অসাধারণ হতে বাধ্য।"
(নির্দেশনা: ব্যাকগ্রাউন্ড সাউন্ড -14 LUFS নরম্যালাইজ করুন, নয়েজ ফ্রি অডিও মাস্টার করবেন)`);
        setNewNotes("ভয়েসওভারের ব্যাকগ্রাউন্ড নয়েজ রিমুভ, অ্যাম্বিয়েন্স লেভেল -14 LUFS নরম্যালাইজ এবং ডায়ালগ সিঙ্ক।");
        break;

      case "youtube":
        setNewTitle("ইউটিউব ফুল ডকুমেন্টারি ভিডিও কাট ও কালার গ্রেড (১৬:৯)");
        setNewAssignee("video_editor");
        setNewDepartment("video");
        setNewCategory("7days");
        setNewDueDate("আগামী ৭ দিনের ভেতর (7 Days)");
        setNewIsUrgent(false);
        setNewReferenceVideoUrl("https://youtube.com/watch?v=sample-documentary-grade");
        setNewScriptText(`[ডকুমেন্টারি ভয়েসওভার পর্ব ০১]:
"ঢাকার বুকে ক্রিয়েটিভ ইন্ডাস্ট্রির নতুন বিপ্লব শুরু হয়েছিল এই স্টুডিও থেকেই। যেখানে আইডিয়া রূপ নেয় সেলুলয়েডের পর্দায়..."`);
        setNewNotes("১৬:৯ ফুল এইচডি/৪কে রেন্ডার, বি-রোল ফুটেজ সিঙ্ক, সাউন্ড ইফেক্টস এবং Rec.709 কালার গ্রেডিং।");
        break;

      case "banner":
        setNewTitle("সোশ্যাল মিডিয়া স্কয়ার পোস্ট ও ব্যানার ডিজাইন সেট");
        setNewAssignee("designer");
        setNewDepartment("design");
        setNewCategory("today");
        setNewDueDate("আজকের ভেতর (Today)");
        setNewIsUrgent(true);
        setNewReferenceVideoUrl("");
        setNewScriptText(`[ব্যানার টাইপোগ্রাফি ও কপি]:
"SUMMER DROP 2026 • FLAT 40% OFF"
সাব-টেক্সট: "Shop Now at Swapon's World"`);
        setNewNotes("১০৮০x১০৮০ স্কয়ার পোস্ট এবং ১০৮০x১৯২০ ইনস্টাগ্রাম স্টোরি সাইজ। লেয়ারসহ পিএসডি ফাইল রেডি করুন।");
        break;

      case "catalog":
        setNewTitle("প্রোডাক্ট লুকবুক ও হাই-এন্ড ফটো রিটাচিং");
        setNewAssignee("designer");
        setNewDepartment("design");
        setNewCategory("7days");
        setNewDueDate("আগামী ৭ দিনের শিডিউল");
        setNewIsUrgent(false);
        setNewReferenceVideoUrl("");
        setNewScriptText(`[লুকবুক কালার থিম]:
"অটাম ওয়ার্ম টোনস, রিচ শ্যাডো, হাইপার-শার্প ফ্যাব্রিক ডিটেইলস।"`);
        setNewNotes("হাই-এন্ড স্কিন রিটাচিং, ব্যাকগ্রাউন্ড ক্লিনআপ এবং কালার ব্যালান্স ক্লায়েন্ট অ্যাপ্রুভালের জন্য।");
        break;

      case "shoot_outdoor":
        setNewTitle("নতুন প্রোডাক্ট ক্যাম্পেইন — আউটডোর শুট");
        setNewAssignee("videographer");
        setNewDepartment("shoot");
        setNewCategory("today");
        setNewDueDate("আজ দুপুর ২:৩০ PM");
        setNewIsUrgent(true);
        setNewLocation("ধানমন্ডি লেক ও আউটডোর স্পট");
        setNewGearInfo("Sony FX3 • 24-70mm • Ronin RS3 Gimbal • 4K 60fps");
        setNewReferenceVideoUrl("https://youtube.com/shorts/cinematic-outdoor-shoot");
        setNewScriptText(`[শুট শট-লিস্ট]:
১. মডেলের এন্ট্রি স্লো মোশন কাট (120fps)
২. প্রোডাক্টের ম্যাক্রো ও টেক্সচার শট (24-70mm f/2.8)
৩. সানসেট সিলুয়েট গোল্ডেন আওয়ার ট্রানজিশন`);
        setNewNotes("ন্যাচারাল গোল্ডেন আওয়ার লাইট, স্লো-মোশন ক্লোজ-আপ শট। ফুটেজ দ্রুত গুগল ড্রাইভ স্টুডিওতে ব্যাকআপ দিন।");
        break;

      case "shoot_indoor":
        setNewTitle("স্টুডিও ফ্যাশন পোর্ট্রেট ও মডেল সিনেমাটোগ্রাফি");
        setNewAssignee("videographer");
        setNewDepartment("shoot");
        setNewCategory("7days");
        setNewDueDate("আগামী ৭ দিনের ভেতর");
        setNewIsUrgent(false);
        setNewLocation("স্বপনস ওয়ার্ল্ড মেইন স্টুডিও (ফ্লোর ২)");
        setNewGearInfo("Aputure 300d II Softbox • C-Stands • Reflector Panel");
        setNewReferenceVideoUrl("");
        setNewScriptText(`[স্টুডিও লাইটিং গাইড]:
৩-পয়েন্ট কি লাইট + হেয়ার লাইট রিম। ডার্ক গ্রে ব্যাকড্রপ।`);
        setNewNotes("ইনডোর থিম্যাটিক ব্যাকড্রপ ও লাইটিং গ্রিড সেটআপ। মডেল শট ডিভিশন চার্ট ফলো করুন।");
        break;
    }
  };

  // Timeline Auto Preset
  const applyTimelinePreset = (timeframe: "today" | "tomorrow" | "7days" | "15days") => {
    setNewCategory(timeframe);
    if (timeframe === "today") {
      setNewDueDate("আজকের ভেতর (Today)");
      setNewIsUrgent(true);
    } else if (timeframe === "tomorrow") {
      setNewDueDate("আগামীকাল (Tomorrow)");
      setNewIsUrgent(false);
    } else if (timeframe === "7days") {
      setNewDueDate("আগামী ৭ দিনের ভেতর (7 Days)");
      setNewIsUrgent(false);
    } else {
      setNewDueDate("১৫ দিনের প্রজেক্ট মাইলস্টোন");
      setNewIsUrgent(false);
    }
  };

  // Handle Admin Add Task Submit
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const assigneeNames: Record<TeamMember, string> = {
      all: "সবাই",
      head: "ক্রিয়েটিভ ডিরেক্টর",
      video_editor: "ভিডিও এডিটর",
      designer: "গ্রাফিক ডিজাইনার",
      videographer: "সিনেমাটোগ্রাফার / শুটার",
    };

    const newTask: SwaponTask = {
      id: generateId("task"),
      title: newTitle.trim(),
      assignee: newAssignee,
      assigneeName: assigneeNames[newAssignee],
      department: newDepartment,
      deadlineCategory: newCategory,
      dueDate: newDueDate || (newCategory === "today" ? "আজকের ভেতর (Today)" : newCategory === "tomorrow" ? "আগামীকাল" : newCategory === "7days" ? "আগামী ৭ দিনের ভেতর" : "১৫ দিনের প্রজেক্ট"),
      completed: false,
      referenceVideoUrl: newReferenceVideoUrl.trim() || undefined,
      scriptText: newScriptText.trim() || undefined,
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
          status: "pending",
        },
      ]);
    } catch (e) {}

    // Reset
    setNewTitle("");
    setNewReferenceVideoUrl("");
    setNewScriptText("");
    setNewNotes("");
    setNewLocation("");
    setNewGearInfo("");
    setNewDueDate("");
    setNewIsUrgent(false);
    setShowAddTaskModal(false);
  };

  // Handle Edit Task Save
  const handleSaveEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    const updated = tasks.map((t) => (t.id === editingTask.id ? editingTask : t));
    updateTasks(updated);

    try {
      await supabase
        .from("tasks")
        .update({
          title: editingTask.title,
          description: editingTask.notes,
          status: editingTask.completed ? "completed" : "in_progress",
        })
        .eq("id", editingTask.id);
    } catch (e) {}

    setEditingTask(null);
  };

  // Add File (Team Deliverables)
  const handleAddFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileTitle.trim() || !newFileName.trim()) return;

    const assigneeNames: Record<TeamMember, string> = {
      all: "সবাই",
      head: "ক্রিয়েটিভ ডিরেক্টর",
      video_editor: "ভিডিও এডিটর",
      designer: "গ্রাফিক ডিজাইনার",
      videographer: "সিনেমাটোগ্রাফার / শুটার",
    };

    const targetOwner = session?.isAdmin ? newAssignee : (session?.role || "video_editor");

    const newFileItem: StudioFile = {
      id: generateId("file"),
      title: newFileTitle.trim(),
      fileName: newFileName.trim(),
      fileType: newFileType,
      fileFormat: newFileFormat.trim() || "Drive File",
      fileSize: newFileSize.trim() || "Cloud Link",
      driveUrl: newDriveUrl.trim() || "#",
      owner: targetOwner,
      ownerName: assigneeNames[targetOwner],
      status: "ready_for_review",
      uploadedAt: "এখনই আপলোডকৃত",
      notes: newFileNotes.trim() || undefined,
    };

    const updatedFiles = [newFileItem, ...files];
    updateFiles(updatedFiles);

    setNewFileTitle("");
    setNewFileName("");
    setNewFileSize("");
    setNewDriveUrl("");
    setNewFileNotes("");
    setShowAddFileModal(false);
  };

  // File Quick Status Switch
  const toggleFileStatus = (fileId: string, targetStatus?: StudioFile["status"]) => {
    const updated = files.map((f) => {
      if (f.id === fileId) {
        const nextStatus: StudioFile["status"] =
          targetStatus !== undefined
            ? targetStatus
            : f.status === "ready_for_review"
            ? "approved"
            : f.status === "approved"
            ? "needs_revision"
            : "ready_for_review";
        return { ...f, status: nextStatus };
      }
      return f;
    });
    updateFiles(updated);
  };

  // Handle Edit File Save
  const handleSaveEditFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFile) return;

    const updated = files.map((f) => (f.id === editingFile.id ? editingFile : f));
    updateFiles(updated);
    setEditingFile(null);
  };

  const deleteFile = (fileId: string) => {
    const updated = files.filter((f) => f.id !== fileId);
    updateFiles(updated);
  };

  // Role Filtering
  const isHead = session?.isAdmin ?? false;

  const roleTasks = tasks.filter((t) => {
    if (isHead) {
      if (adminViewFilter === "all") return true;
      return t.assignee === adminViewFilter;
    }
    return t.assignee === session?.role;
  });

  // Sophisticated Minimalist Color Metadata
  const getTaskColorMeta = (task: SwaponTask) => {
    if (task.completed) {
      return {
        badgeText: "সম্পন্ন",
        badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        borderAccent: "border-l-[3px] border-l-emerald-500",
        categoryType: "completed",
        dotColor: "bg-emerald-500",
      };
    }
    if (task.statusState === "not_done") {
      return {
        badgeText: "পেন্ডিং / বাকি",
        badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        borderAccent: "border-l-[3px] border-l-rose-500",
        categoryType: "not_done",
        dotColor: "bg-rose-500",
      };
    }
    if (task.isUrgent || task.deadlineCategory === "today") {
      return {
        badgeText: "আজকের জরুরি",
        badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        borderAccent: "border-l-[3px] border-l-amber-500",
        categoryType: "today",
        dotColor: "bg-amber-500",
      };
    }
    if (task.deadlineCategory === "7days" || task.deadlineCategory === "3days") {
      return {
        badgeText: "৭ দিনের ভেতর",
        badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        borderAccent: "border-l-[3px] border-l-purple-500",
        categoryType: "week",
        dotColor: "bg-purple-500",
      };
    }
    return {
      badgeText: "বাকি",
      badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      borderAccent: "border-l-[3px] border-l-rose-400",
      categoryType: "not_done",
      dotColor: "bg-rose-500",
    };
  };

  // Separation of Pending vs Approved Tasks
  const pendingTasks = roleTasks.filter((t) => !t.completed);
  const approvedTasks = roleTasks.filter((t) => t.completed);

  // Active Tasks based on Tab & Filter
  const filteredTasks =
    taskSectionTab === "approved"
      ? approvedTasks
      : pendingTasks.filter((t) => {
          if (statusColorFilter === "all") return true;
          const meta = getTaskColorMeta(t);
          return meta.categoryType === statusColorFilter;
        });

  // Files Role Filtering & Separation
  const roleFiles = files.filter((f) => {
    if (isHead) {
      if (adminViewFilter === "all") return true;
      return f.owner === adminViewFilter;
    }
    return f.owner === session?.role;
  });

  const displayFiles = roleFiles.filter((f) => {
    const matchesSearch =
      f.title.toLowerCase().includes(fileSearch.toLowerCase()) ||
      f.fileName.toLowerCase().includes(fileSearch.toLowerCase()) ||
      (f.notes && f.notes.toLowerCase().includes(fileSearch.toLowerCase()));
    const matchesType = fileTypeFilter === "all" || f.fileType === fileTypeFilter;
    return matchesSearch && matchesType;
  });

  const pendingFiles = displayFiles.filter((f) => f.status !== "approved");
  const approvedFiles = displayFiles.filter((f) => f.status === "approved");

  // Task Counts for Dashboard
  const totalTasks = roleTasks.length;
  const completedTasks = approvedTasks.length;
  const notDoneTasks = roleTasks.filter((t) => !t.completed && t.statusState === "not_done").length;
  const todayActionTasks = roleTasks.filter((t) => !t.completed && (t.deadlineCategory === "today" || t.isUrgent)).length;
  const weekTasks = roleTasks.filter((t) => !t.completed && (t.deadlineCategory === "7days" || t.deadlineCategory === "3days")).length;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 1. MANDATORY LOGIN GATE FIRST
  if (!authChecked || !session) {
    return (
      <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0c0e] text-zinc-900 dark:text-zinc-100 flex items-center justify-center p-4 selection:bg-zinc-900 selection:text-white transition-colors duration-200">
        <div className="w-full max-w-md bg-white dark:bg-[#141416] rounded-2xl border border-stone-200/80 dark:border-zinc-800/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-end">
            <button
              onClick={toggleTheme}
              className="p-1.5 px-2 rounded-lg border border-stone-200 dark:border-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-600 dark:text-zinc-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
              title={theme === "dark" ? "লাইট মোড চালু করুন" : "ডার্ক মোড চালু করুন"}
            >
              {theme === "dark" ? <Sun className="h-3 w-3 text-amber-400" /> : <Moon className="h-3 w-3 text-zinc-700" />}
              <span className="text-[11px]">{theme === "dark" ? "লাইট" : "ডার্ক"}</span>
            </button>
          </div>

          <div className="text-center space-y-2.5">
            <div className="flex items-center justify-center px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 mx-auto w-fit shadow-xs">
              <img
                src="/logo.png"
                alt="স্বপনস ওয়ার্ল্ড লোগো"
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-white">
                স্বপনস ওয়ার্ল্ড স্টুডিও
              </h1>
              <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                ক্রিয়েটিভ প্রোডাকশন ও টিম পোর্টাল
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 p-1 rounded-xl bg-stone-100 dark:bg-zinc-900 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setLoginTab("team");
                setLoginError("");
                setPasswordInput("");
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                loginTab === "team"
                  ? "bg-white dark:bg-[#18181b] text-zinc-950 dark:text-white shadow-2xs"
                  : "text-stone-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>টিম মেম্বার</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginTab("admin");
                setLoginError("");
                setPasswordInput("");
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                loginTab === "admin"
                  ? "bg-white dark:bg-[#18181b] text-zinc-950 dark:text-white shadow-2xs"
                  : "text-stone-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              <span>টিম হেড / অ্যাডমিন</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs font-medium">
            {loginTab === "team" ? (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 mb-1.5 font-medium">
                    পদবী নির্বাচন করুন
                  </label>
                  <select
                    value={teamRoleSelect}
                    onChange={(e) => setTeamRoleSelect(e.target.value as TeamMember)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900/60 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-700"
                  >
                    <option value="video_editor">🎬 ভিডিও এডিটর (সব এডিটিং কাজ একসাথে)</option>
                    <option value="designer">🎨 গ্রাফিক ডিজাইনার</option>
                    <option value="videographer">📹 সিনেমাটোগ্রাফার / শুটার</option>
                  </select>
                  <p className="text-[11px] text-stone-400 mt-1">
                    ভিডিও এডিটররা ঢুকলে আজকের সব কাজ একসাথে দেখে নিজেদের ভেতর ভাগ করে নিতে পারবেন।
                  </p>
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 mb-1.5 font-medium">
                    টিম পাসওয়ার্ড (Team Password)
                  </label>
                  <input
                    type="password"
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="পাসওয়ার্ড লিখুন..."
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900/60 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-700"
                  />
                  <div className="flex items-center justify-between text-[11px] text-stone-400 mt-1">
                    <span>ডিফল্ট টিম পাসওয়ার্ড:</span>
                    <span className="font-studio-mono font-semibold text-zinc-700 dark:text-zinc-300">team123</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-zinc-900/60 border border-stone-200/60 dark:border-zinc-800/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-900 dark:text-white font-semibold">
                    <Shield className="h-3.5 w-3.5 text-amber-500" />
                    <span>অ্যাডমিন অটোমেশন হাব</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-zinc-400 leading-relaxed">
                    অ্যাডমিন হিসেবে ১-ক্লিক অটোমেশন দিয়ে রেফারেন্স লিংক, ভয়েসওভার স্ক্রিপ্ট ও ডেডলাইন সেট করে কাজ বুঝিয়ে দিন।
                  </p>
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 mb-1.5 font-medium">
                    অ্যাডমিন পাসওয়ার্ড (Admin Password)
                  </label>
                  <input
                    type="password"
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="অ্যাডমিন পাসওয়ার্ড লিখুন..."
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900/60 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-700"
                  />
                  <div className="flex items-center justify-between text-[11px] text-stone-400 mt-1">
                    <span>ডিফল্ট অ্যাডমিন পাসওয়ার্ড:</span>
                    <span className="font-studio-mono font-semibold text-zinc-700 dark:text-zinc-300">admin123</span>
                  </div>
                </div>
              </div>
            )}

            {loginError && (
              <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              {loginTab === "admin" ? "অ্যাডমিন প্যানেলে প্রবেশ →" : "কাজের বোর্ডে প্রবেশ করুন →"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. MAIN LOGGED-IN STUDIO INTERFACE
  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0c0e] text-zinc-900 dark:text-zinc-100 antialiased selection:bg-zinc-900 selection:text-white pb-24 transition-colors duration-200">
      {/* Top Header Navigation - Sleek & Compact */}
      <header className="sticky top-0 z-40 bg-[#fafaf9]/90 dark:bg-[#0c0c0e]/90 backdrop-blur-md border-b border-stone-200/80 dark:border-zinc-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-8.5 px-2 py-0.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 shadow-2xs">
              <img
                src="/logo.png"
                alt="স্বপনস ওয়ার্ল্ড"
                className="h-6 w-auto object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white tracking-tight">
                  স্বপনস ওয়ার্ল্ড
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 border border-stone-200/70 dark:border-zinc-700/70">
                  {session.displayName}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Real-time Clock */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 text-[11px] font-studio-mono text-stone-600 dark:text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{dhakaTime || "16:00:00"}</span>
            </div>

            {/* Dark / Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg border border-stone-200 dark:border-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-600 dark:text-zinc-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
              title={theme === "dark" ? "লাইট মোড চালু করুন" : "ডার্ক মোড চালু করুন"}
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-zinc-700" />}
              <span className="hidden sm:inline text-[11px]">{theme === "dark" ? "লাইট" : "ডার্ক"}</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-medium border border-stone-200 dark:border-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-600 dark:text-zinc-300 transition-colors cursor-pointer flex items-center gap-1"
              title="লগআউট করুন"
            >
              <LogOut className="h-3 w-3" />
              <span className="hidden sm:inline text-[11px]">লগআউট</span>
            </button>

            {/* Team Members Upload Button */}
            {!isHead && (
              <button
                onClick={() => setShowAddFileModal(true)}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ ফাইল জমা দিন</span>
              </button>
            )}

            {/* Admin Controls: ONLY Assignment Button */}
            {isHead && (
              <button
                onClick={() => setShowAddTaskModal(true)}
                className="px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              >
                <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span className="hidden sm:inline">+ নতুন অ্যাসাইনমেন্ট (অটোমেশন)</span>
                <span className="sm:hidden">+ কাজ দিন</span>
              </button>
            )}
          </div>
        </div>

        {/* If Admin: Department Filter Tabs */}
        {isHead && (
          <div className="border-t border-stone-200/70 dark:border-zinc-800/70 bg-stone-100/40 dark:bg-zinc-900/40">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar text-xs">
              <span className="text-[11px] font-studio-mono uppercase text-stone-400 mr-2 shrink-0 font-medium">
                ডিপার্টমেন্ট:
              </span>
              {[
                { id: "all", label: "সবার কাজ (All)" },
                { id: "video_editor", label: "🎬 ভিডিও এডিটর টিম" },
                { id: "designer", label: "🎨 গ্রাফিক ডিজাইনার" },
                { id: "videographer", label: "📹 সিনেমাটোগ্রাফার / শুট" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setAdminViewFilter(m.id as TeamMember)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    adminViewFilter === m.id
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-2xs"
                      : "text-stone-600 dark:text-zinc-400 hover:bg-stone-200/60 dark:hover:bg-zinc-800/80"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Studio Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* ========================================================= */}
        {/* SECTION 1: মিনিমালিস্ট ড্যাশবোর্ড ওভারভিউ                     */}
        {/* ========================================================= */}
        <section className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#141416] border border-stone-200/70 dark:border-zinc-800/80 shadow-2xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Progress Summary */}
              <div className="flex items-center gap-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-bold font-studio-mono text-zinc-950 dark:text-white tracking-tight">
                    {completedTasks < 10 ? "০" + completedTasks : completedTasks}
                  </span>
                  <span className="text-lg text-stone-400 dark:text-zinc-500 font-light font-studio-mono">
                    /{totalTasks < 10 ? "০" + totalTasks : totalTasks}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-900 dark:text-white">
                      প্রোডাকশন অগ্রগতি
                    </span>
                    <span className="text-[10px] font-studio-mono px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                      {taskProgress}% সম্পন্ন
                    </span>
                  </div>
                  <div className="h-1.5 w-36 sm:w-48 bg-stone-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${taskProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 4 Sleek Status Filters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {/* 1. Today Action */}
                <button
                  type="button"
                  onClick={() => {
                    setTaskSectionTab("pending");
                    setStatusColorFilter(statusColorFilter === "today" ? "all" : "today");
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                    statusColorFilter === "today" && taskSectionTab === "pending"
                      ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/40"
                      : "border-stone-200/70 dark:border-zinc-800/80 bg-stone-50/50 dark:bg-zinc-900/50 hover:bg-stone-100 dark:hover:bg-zinc-800/80 text-stone-700 dark:text-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="font-medium text-[11px]">আজকের কাজ</span>
                  </div>
                  <span className="font-bold font-studio-mono text-amber-600 dark:text-amber-400">
                    {todayActionTasks}
                  </span>
                </button>

                {/* 2. Not Done / Pending */}
                <button
                  type="button"
                  onClick={() => {
                    setTaskSectionTab("pending");
                    setStatusColorFilter(statusColorFilter === "not_done" ? "all" : "not_done");
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                    statusColorFilter === "not_done" && taskSectionTab === "pending"
                      ? "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/40"
                      : "border-stone-200/70 dark:border-zinc-800/80 bg-stone-50/50 dark:bg-zinc-900/50 hover:bg-stone-100 dark:hover:bg-zinc-800/80 text-stone-700 dark:text-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    <span className="font-medium text-[11px]">কাজ হয় নাই</span>
                  </div>
                  <span className="font-bold font-studio-mono text-rose-600 dark:text-rose-400">
                    {notDoneTasks}
                  </span>
                </button>

                {/* 3. Next 7 Days */}
                <button
                  type="button"
                  onClick={() => {
                    setTaskSectionTab("pending");
                    setStatusColorFilter(statusColorFilter === "week" ? "all" : "week");
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                    statusColorFilter === "week" && taskSectionTab === "pending"
                      ? "border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500/40"
                      : "border-stone-200/70 dark:border-zinc-800/80 bg-stone-50/50 dark:bg-zinc-900/50 hover:bg-stone-100 dark:hover:bg-zinc-800/80 text-stone-700 dark:text-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-purple-500" />
                    <span className="font-medium text-[11px]">৭ দিন</span>
                  </div>
                  <span className="font-bold font-studio-mono text-purple-600 dark:text-purple-400">
                    {weekTasks}
                  </span>
                </button>

                {/* 4. Completed & Approved */}
                <button
                  type="button"
                  onClick={() => {
                    setTaskSectionTab("approved");
                    setStatusColorFilter("all");
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                    taskSectionTab === "approved"
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/40"
                      : "border-stone-200/70 dark:border-zinc-800/80 bg-stone-50/50 dark:bg-zinc-900/50 hover:bg-stone-100 dark:hover:bg-zinc-800/80 text-stone-700 dark:text-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="font-medium text-[11px]">সম্পন্ন</span>
                  </div>
                  <span className="font-bold font-studio-mono text-emerald-600 dark:text-emerald-400">
                    {completedTasks}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TASKS SECTION: MINIMALIST ACCORDION-READY ROWS                           */}
          {/* ========================================================================= */}
          <div className="rounded-2xl bg-white dark:bg-[#141416] border border-stone-200/70 dark:border-zinc-800/80 p-5 space-y-4 shadow-2xs">
            {/* Section Header + Clean Minimal Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-zinc-800/80">
              <div>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                  <span>{session.role === "video_editor" ? "ভিডিও এডিটিং কাজের হাব" : "স্টুডিও কাজের হাব"}</span>
                  <span className="text-xs font-normal text-stone-400">
                    ({roleTasks.length} টি অ্যাসাইনমেন্ট)
                  </span>
                </h3>
              </div>

              {/* TWO DISTINCT WORKSPACE TABS */}
              <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-zinc-900 text-xs font-semibold shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setTaskSectionTab("pending");
                    setStatusColorFilter("all");
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    taskSectionTab === "pending"
                      ? "bg-white dark:bg-[#18181b] text-zinc-950 dark:text-white shadow-2xs"
                      : "text-stone-500 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  <Hourglass className="h-3.5 w-3.5 text-amber-500" />
                  <span>চলমান ও পেন্ডিং ({pendingTasks.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTaskSectionTab("approved");
                    setStatusColorFilter("all");
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    taskSectionTab === "approved"
                      ? "bg-white dark:bg-[#18181b] text-emerald-600 dark:text-emerald-400 shadow-2xs"
                      : "text-stone-500 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  <FileCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>অ্যাপ্রুভড ও সম্পন্ন ({approvedTasks.length})</span>
                </button>
              </div>
            </div>

            {/* Quick Filter Chips (Only in Pending Tab) */}
            {taskSectionTab === "pending" && (
              <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-medium pb-0.5 no-scrollbar">
                <button
                  onClick={() => setStatusColorFilter("all")}
                  className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                    statusColorFilter === "all"
                      ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-2xs"
                      : "text-stone-500 hover:bg-stone-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  সব ({pendingTasks.length})
                </button>
                <button
                  onClick={() => setStatusColorFilter("today")}
                  className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer flex items-center gap-1 ${
                    statusColorFilter === "today"
                      ? "bg-amber-500 text-white"
                      : "text-amber-700 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  আজকের কাজ ({todayActionTasks})
                </button>
                <button
                  onClick={() => setStatusColorFilter("not_done")}
                  className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer flex items-center gap-1 ${
                    statusColorFilter === "not_done"
                      ? "bg-rose-600 text-white"
                      : "text-rose-700 dark:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  কাজ হয় নাই ({notDoneTasks})
                </button>
                <button
                  onClick={() => setStatusColorFilter("week")}
                  className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer flex items-center gap-1 ${
                    statusColorFilter === "week"
                      ? "bg-purple-600 text-white"
                      : "text-purple-700 dark:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  আগামী ৭ দিন ({weekTasks})
                </button>
              </div>
            )}

            {/* Task List Rendering */}
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-stone-50/50 dark:bg-zinc-900/40 border border-stone-200/40 dark:border-zinc-800/60">
                <p className="text-xs text-stone-400 font-medium">
                  {taskSectionTab === "approved"
                    ? "কোনো কাজ এখনো অ্যাপ্রুভড আর্কাইভে জমা হয়নি। কাজ সম্পন্ন হলে এখানে প্রদর্শিত হবে।"
                    : "এই ফিল্টারে কোনো পেন্ডিং কাজ পাওয়া যায়নি।"}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredTasks.map((task) => {
                  const meta = getTaskColorMeta(task);
                  const isScriptOpen = !!expandedScripts[task.id];

                  return (
                    <div
                      key={task.id}
                      className={`p-3.5 sm:p-4 rounded-xl border transition-all ${meta.borderAccent} bg-white dark:bg-[#18181b]/80 border-stone-200/60 dark:border-zinc-800/80 hover:border-stone-300 dark:hover:border-zinc-700 flex flex-col justify-between gap-3 group`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        {/* Left: Checkbox + Title + Badges */}
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`mt-0.5 h-4.5 w-4.5 rounded-md border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                              task.completed
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "border-stone-300 dark:border-zinc-600 hover:border-zinc-950 dark:hover:border-white bg-white dark:bg-zinc-800"
                            }`}
                            title={task.completed ? "পেন্ডিংয়ে ফেরত নিতে ক্লিক করুন" : "কাজ সম্পন্ন চিহ্নিত করতে ক্লিক করুন"}
                          >
                            {task.completed && <Check className="h-3 w-3 stroke-[3]" />}
                          </button>

                          <div className="min-w-0 space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                onClick={() => toggleTask(task.id)}
                                className={`text-sm font-semibold cursor-pointer ${
                                  task.completed
                                    ? "line-through text-stone-400 dark:text-zinc-500 font-normal"
                                    : "text-zinc-950 dark:text-white"
                                }`}
                              >
                                {task.title}
                              </span>

                              {/* Status Badge */}
                              <span className={`text-[10px] font-studio-mono px-2 py-0.5 rounded-full border font-semibold ${meta.badgeClass}`}>
                                {meta.badgeText}
                              </span>

                              {isHead && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400 font-medium">
                                  {task.assigneeName}
                                </span>
                              )}

                              {/* Reference Video Pill Button */}
                              {task.referenceVideoUrl && (
                                <a
                                  href={task.referenceVideoUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-medium hover:bg-blue-500/20 transition-colors"
                                >
                                  <Film className="h-2.5 w-2.5" />
                                  <span>রেফারেন্স ↗</span>
                                </a>
                              )}

                              {/* Voiceover Script Minimal Toggle Pill */}
                              {task.scriptText && (
                                <button
                                  type="button"
                                  onClick={() => toggleScriptExpand(task.id)}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-medium hover:bg-amber-500/20 transition-colors cursor-pointer"
                                >
                                  <FileText className="h-2.5 w-2.5 text-amber-500" />
                                  <span>{isScriptOpen ? "স্ক্রিপ্ট লুকান ▲" : "স্ক্রিপ্ট পড়ুন ও কপি করুন ▼"}</span>
                                </button>
                              )}
                            </div>

                            {/* Brief / Notes */}
                            {task.notes && (
                              <p className="text-xs text-stone-600 dark:text-zinc-400 leading-relaxed font-normal">
                                <strong className="text-zinc-800 dark:text-zinc-300 font-medium">নির্দেশনা:</strong> {task.notes}
                              </p>
                            )}

                            {/* Location & Time for Videographer */}
                            {task.location && (
                              <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-0.5">
                                <span className="flex items-center gap-1 text-stone-600 dark:text-zinc-300 font-medium">
                                  <MapPin className="h-3 w-3 text-stone-400" />
                                  {task.location}
                                </span>
                                {task.shootTime && <span>• {task.shootTime}</span>}
                              </div>
                            )}

                            {/* Expandable Voiceover Script Box */}
                            {task.scriptText && isScriptOpen && (
                              <div className="mt-2 p-3 rounded-xl bg-stone-50/80 dark:bg-zinc-900/80 border border-stone-200/80 dark:border-zinc-800 space-y-2 animate-in fade-in duration-150">
                                <div className="flex items-center justify-between text-[11px] font-semibold text-stone-700 dark:text-zinc-300 pb-1.5 border-b border-stone-200/60 dark:border-zinc-800">
                                  <span className="flex items-center gap-1">
                                    <FileText className="h-3.5 w-3.5 text-amber-500" />
                                    <span>সম্পূর্ণ স্ক্রিপ্ট / ভয়েসওভার:</span>
                                  </span>
                                  <button
                                    onClick={() => handleCopyScript(task.id, task.scriptText || "")}
                                    className="px-2.5 py-0.5 rounded-md bg-white hover:bg-stone-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-stone-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-[10px] font-medium flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                                    title="পুরো স্ক্রিপ্ট কপি করুন"
                                  >
                                    {copiedTaskId === task.id ? (
                                      <>
                                        <CheckCheck className="h-3 w-3 text-emerald-600" />
                                        <span className="text-emerald-600 font-semibold">কপি হয়েছে!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="h-3 w-3" />
                                        <span>কপি করুন</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                                <pre className="text-xs font-sans text-stone-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed select-text">
                                  {task.scriptText}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right: Due Date & Action Buttons */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200/30">
                          <span className="font-studio-mono text-[11px] text-stone-400 font-medium">
                            {task.dueDate}
                          </span>

                          <div className="flex items-center gap-1">
                            {/* If task is completed: Direct 1-Click Revert Button */}
                            {task.completed ? (
                              <button
                                onClick={() => revertTaskToPending(task.id)}
                                className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer flex items-center gap-1"
                                title="ভুল করে সম্পন্ন হলে পেন্ডিংয়ে ফেরত নিন"
                              >
                                <RotateCcw className="h-2.5 w-2.5" />
                                <span>রিভার্ট</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => cycleTaskStatus(task.id)}
                                className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                                title="স্ট্যাটাস পরিবর্তন করুন (হয় নাই / আজকের কাজ / সম্পন্ন)"
                              >
                                স্ট্যাটাস ↺
                              </button>
                            )}

                            {/* Edit Button */}
                            <button
                              onClick={() => setEditingTask(task)}
                              className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer flex items-center gap-1"
                              title="কাজের বিবরণ বা স্ট্যাটাস এডিট করুন"
                            >
                              <Pencil className="h-2.5 w-2.5" />
                              <span>এডিট</span>
                            </button>

                            {isHead && (
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="কাজ ডিলিট করুন"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: প্রোডাকশন ফাইলস ও ডেলিভারেবলস                   */}
        {/* ========================================================= */}
        <section className="space-y-4">
          <div className="rounded-2xl bg-white dark:bg-[#141416] border border-stone-200/70 dark:border-zinc-800/80 p-5 space-y-4 shadow-2xs">
            {/* Section Header + Two Distinct Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-zinc-800/80">
              <div>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                  <span>প্রোডাকশন ফাইলস ও ডেলিভারেবলস</span>
                  <span className="text-xs font-normal text-stone-400">
                    ({displayFiles.length} টি ফাইল)
                  </span>
                </h3>
              </div>

              {/* TWO DISTINCT FILE TABS */}
              <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-zinc-900 text-xs font-semibold shrink-0">
                <button
                  type="button"
                  onClick={() => setFileSectionTab("pending")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    fileSectionTab === "pending"
                      ? "bg-white dark:bg-[#18181b] text-zinc-950 dark:text-white shadow-2xs"
                      : "text-stone-500 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  <Hourglass className="h-3.5 w-3.5 text-amber-500" />
                  <span>পেন্ডিং ও চলমান ফাইল ({pendingFiles.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFileSectionTab("approved")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    fileSectionTab === "approved"
                      ? "bg-white dark:bg-[#18181b] text-emerald-600 dark:text-emerald-400 shadow-2xs"
                      : "text-stone-500 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  <FileCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>অ্যাপ্রুভড ও কমপ্লিট ফাইলস ({approvedFiles.length})</span>
                </button>
              </div>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-0.5">
              <span className="text-stone-400 text-[11px]">
                {fileSectionTab === "pending"
                  ? "⏳ এই সেকশনের ফাইলগুলো রিভিউ বা সংশোধনে আছে।"
                  : "🏆 এই সেকশনের ফাইলগুলো হেড দ্বারা অ্যাপ্রুভড ও ফাইনাল।"}
              </span>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                  <input
                    type="text"
                    value={fileSearch}
                    onChange={(e) => setFileSearch(e.target.value)}
                    placeholder="ফাইল খুঁজুন..."
                    className="pl-8 pr-3 py-1 rounded-lg border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-700 w-36 sm:w-44"
                  />
                </div>

                <select
                  value={fileTypeFilter}
                  onChange={(e) => setFileTypeFilter(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none"
                >
                  <option value="all">সব টাইপ</option>
                  <option value="video">ভিডিও (.mp4)</option>
                  <option value="project">প্রজেক্ট (.prproj/.ai)</option>
                  <option value="image">ইমেজ (.psd)</option>
                  <option value="folder">ড্রাইভ ফোল্ডার</option>
                </select>
              </div>
            </div>

            {/* Files Grid Rendering */}
            {(fileSectionTab === "pending" ? pendingFiles : approvedFiles).length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-stone-50/50 dark:bg-zinc-900/40 border border-stone-200/40 dark:border-zinc-800/60 space-y-1">
                <HardDrive className="h-7 w-7 text-stone-300 dark:text-zinc-600 mx-auto" />
                <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  {fileSectionTab === "pending"
                    ? "কোনো পেন্ডিং ফাইল নেই"
                    : "কোনো ফাইল এখনো অ্যাপ্রুভড আর্কাইভে নেই"}
                </h4>
                <p className="text-[11px] text-stone-400 max-w-sm mx-auto">
                  {fileSectionTab === "pending"
                    ? "টিম মেম্বাররা নতুন ফাইল জমা দিলে এখানে প্রদর্শিত হবে।"
                    : "পেন্ডিং ফাইল এপ্রুভ করলে সাথে সাথে এই আর্কাইভে স্থানান্তরিত হবে।"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(fileSectionTab === "pending" ? pendingFiles : approvedFiles).map((file) => {
                  const isVideo = file.fileType === "video";
                  const isProject = file.fileType === "project";
                  const isFolder = file.fileType === "folder";

                  return (
                    <div
                      key={file.id}
                      className="p-4 rounded-xl bg-stone-50/50 dark:bg-zinc-900/40 border border-stone-200/60 dark:border-zinc-800/80 hover:border-stone-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-stone-200/60 dark:border-zinc-700/60">
                              {isVideo ? (
                                <Film className="h-3.5 w-3.5 text-blue-500" />
                              ) : isProject ? (
                                <FileCode className="h-3.5 w-3.5 text-purple-500" />
                              ) : isFolder ? (
                                <HardDrive className="h-3.5 w-3.5 text-amber-500" />
                              ) : (
                                <ImageIcon className="h-3.5 w-3.5 text-emerald-500" />
                              )}
                            </div>
                            <div>
                              <span className="font-studio-mono text-[10px] uppercase text-stone-400 block leading-tight">
                                {file.fileFormat} • {file.fileSize}
                              </span>
                              <span className="font-studio-mono text-[11px] font-semibold text-zinc-900 dark:text-white">
                                {file.fileName}
                              </span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <span
                            className={`text-[10px] font-studio-mono uppercase px-2 py-0.5 rounded-full border font-semibold ${
                              file.status === "approved"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : file.status === "needs_revision"
                                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            }`}
                          >
                            {file.status === "approved"
                              ? "অ্যাপ্রুভড"
                              : file.status === "needs_revision"
                              ? "সংশোধন"
                              : "রিভিউ"}
                          </span>
                        </div>

                        <h4 className="text-xs font-semibold text-zinc-950 dark:text-white mt-2">
                          {file.title}
                        </h4>

                        {file.notes && (
                          <p className="text-[11px] text-stone-500 dark:text-zinc-400 mt-1 leading-relaxed">
                            {file.notes}
                          </p>
                        )}
                      </div>

                      {/* Bottom Action Bar */}
                      <div className="pt-2 border-t border-stone-200/50 dark:border-zinc-800/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
                          <span>{file.ownerName}</span>
                          <span>•</span>
                          <span>{file.uploadedAt}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          {/* If in Pending: Admin 1-Click Approve Button */}
                          {isHead && file.status !== "approved" && (
                            <button
                              onClick={() => toggleFileStatus(file.id, "approved")}
                              className="px-2 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="ফাইল অ্যাপ্রুভ করুন"
                            >
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                              <span>অ্যাপ্রুভ</span>
                            </button>
                          )}

                          {/* If in Approved: Direct Revert Button */}
                          {isHead && file.status === "approved" && (
                            <button
                              onClick={() => toggleFileStatus(file.id, "ready_for_review")}
                              className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="পেন্ডিংয়ে ফেরত নিন"
                            >
                              <RotateCcw className="h-2.5 w-2.5" />
                              <span>রিভার্ট</span>
                            </button>
                          )}

                          {/* Edit File Button */}
                          <button
                            onClick={() => setEditingFile(file)}
                            className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-[10px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                            title="ফাইল এডিট করুন"
                          >
                            <Pencil className="h-2.5 w-2.5" />
                            <span>এডিট</span>
                          </button>

                          <a
                            href={file.driveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-[10px] font-medium flex items-center gap-1 transition-colors"
                          >
                            <ExternalLink className="h-2.5 w-2.5" />
                            <span>ড্রাইভ</span>
                          </a>

                          {isHead && (
                            <button
                              onClick={() => deleteFile(file.id)}
                              className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="ফাইল মুছুন"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* ADMIN MODAL: SMART AUTOMATED TASK DELEGATION                             */}
      {/* ========================================================================= */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl max-h-[90vh] flex flex-col bg-white dark:bg-[#141416] rounded-2xl shadow-xl border border-stone-200/80 dark:border-zinc-800/80 p-6 space-y-4 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-zinc-800 shrink-0">
              <div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span>স্মার্ট অটোমেশন — নতুন কাজ বুঝিয়ে দিন</span>
                </h3>
                <p className="text-xs text-stone-400">
                  নিচের অটোমেশন বাটনে ক্লিক করলে রেফারেন্স ভিডিও, ভয়েসওভার স্ক্রিপ্ট ও সময় একা একাই পূরণ হয়ে যাবে।
                </p>
              </div>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="text-stone-400 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto pr-1 space-y-4 flex-1">
              {/* 1-CLICK AUTOMATION PRESETS */}
              <div className="p-3 rounded-xl bg-stone-50/60 dark:bg-zinc-900/60 border border-stone-200/60 dark:border-zinc-800/60 space-y-2">
                <span className="text-[11px] font-studio-mono uppercase tracking-wider text-stone-500 font-semibold block">
                  ⚡ ১-ক্লিক অটোমেশন প্রিসেট:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => applyAutomationPreset("reels")}
                    className="p-2 rounded-lg bg-white dark:bg-[#18181b] border border-amber-200 dark:border-amber-900/40 hover:border-amber-500 text-left transition-all cursor-pointer shadow-2xs group"
                  >
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block">
                      📱 রিলস ও শর্টস (৯:১৬)
                    </span>
                    <span className="text-[10px] text-stone-400 block">ভিডিও + স্ক্রিপ্ট অটো</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyAutomationPreset("voiceover")}
                    className="p-2 rounded-lg bg-white dark:bg-[#18181b] border border-blue-200 dark:border-blue-900/40 hover:border-blue-500 text-left transition-all cursor-pointer shadow-2xs group"
                  >
                    <span className="text-xs font-bold text-blue-900 dark:text-blue-300 block">
                      🎙️ ভয়েসওভার ও সাউন্ড
                    </span>
                    <span className="text-[10px] text-stone-400 block">পূর্ণ স্ক্রিপ্ট সহ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyAutomationPreset("youtube")}
                    className="p-2 rounded-lg bg-white dark:bg-[#18181b] border border-purple-200 dark:border-purple-900/40 hover:border-purple-500 text-left transition-all cursor-pointer shadow-2xs group"
                  >
                    <span className="text-xs font-bold text-purple-900 dark:text-purple-300 block">
                      📺 ইউটিউব ফুল ভিডিও
                    </span>
                    <span className="text-[10px] text-stone-400 block">আগামী ৭ দিনের ভেতর</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyAutomationPreset("banner")}
                    className="p-2 rounded-lg bg-white dark:bg-[#18181b] border border-emerald-200 dark:border-emerald-900/40 hover:border-emerald-500 text-left transition-all cursor-pointer shadow-2xs group"
                  >
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 block">
                      🎨 সোশ্যাল ব্যানার সেট
                    </span>
                    <span className="text-[10px] text-stone-400 block">আজকের কাজ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyAutomationPreset("catalog")}
                    className="p-2 rounded-lg bg-white dark:bg-[#18181b] border border-stone-200 dark:border-zinc-800 hover:border-zinc-500 text-left transition-all cursor-pointer shadow-2xs group"
                  >
                    <span className="text-xs font-bold text-zinc-900 dark:text-white block">
                      📖 ক্যাটালগ ও ফটো
                    </span>
                    <span className="text-[10px] text-stone-400 block">৭ দিনের শিডিউল</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyAutomationPreset("shoot_outdoor")}
                    className="p-2 rounded-lg bg-white dark:bg-[#18181b] border border-amber-200 dark:border-amber-900/40 hover:border-amber-500 text-left transition-all cursor-pointer shadow-2xs group"
                  >
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block">
                      📹 আউটডোর শুট
                    </span>
                    <span className="text-[10px] text-stone-400 block">আজ দুপুর ২:৩০ PM</span>
                  </button>
                </div>
              </div>

              {/* AUTOMATED TIMELINE SWITCHER */}
              <div className="space-y-1.5">
                <label className="block text-zinc-700 dark:text-zinc-300 font-semibold text-xs">
                  কখন শেষ করতে হবে?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => applyTimelinePreset("today")}
                    className={`py-2 px-2.5 rounded-xl border font-semibold transition-all cursor-pointer ${
                      newCategory === "today"
                        ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                        : "border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 hover:bg-stone-100"
                    }`}
                  >
                    ⚡ আজকের কাজ
                  </button>

                  <button
                    type="button"
                    onClick={() => applyTimelinePreset("tomorrow")}
                    className={`py-2 px-2.5 rounded-xl border font-semibold transition-all cursor-pointer ${
                      newCategory === "tomorrow"
                        ? "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300"
                        : "border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 hover:bg-stone-100"
                    }`}
                  >
                    📅 কালকের কাজ
                  </button>

                  <button
                    type="button"
                    onClick={() => applyTimelinePreset("7days")}
                    className={`py-2 px-2.5 rounded-xl border font-semibold transition-all cursor-pointer ${
                      newCategory === "7days"
                        ? "border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300"
                        : "border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 hover:bg-stone-100"
                    }`}
                  >
                    🟣 আগামী ৭ দিন
                  </button>

                  <button
                    type="button"
                    onClick={() => applyTimelinePreset("15days")}
                    className={`py-2 px-2.5 rounded-xl border font-semibold transition-all cursor-pointer ${
                      newCategory === "15days"
                        ? "border-zinc-950 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                        : "border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 hover:bg-stone-100"
                    }`}
                  >
                    🏆 ১৫ দিনের প্রজেক্ট
                  </button>
                </div>
              </div>

              {/* FORM FIELDS */}
              <form id="add-task-form" onSubmit={handleAddTask} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                    কাজের শিরোনাম / নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="যেমন: নতুন ঈদ ক্যাম্পেইনের রিলস এডিটিং"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-700"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">কাকে দায়িত্ব দিচ্ছেন *</label>
                    <select
                      value={newAssignee}
                      onChange={(e) => {
                        const val = e.target.value as TeamMember;
                        setNewAssignee(val);
                        if (val === "video_editor") setNewDepartment("video");
                        else if (val === "designer") setNewDepartment("design");
                        else if (val === "videographer") setNewDepartment("shoot");
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                    >
                      <option value="video_editor">🎬 ভিডিও এডিটর (সব এডিটর একসাথে দেখবে)</option>
                      <option value="designer">🎨 গ্রাফিক ডিজাইনার</option>
                      <option value="videographer">📹 সিনেমাটোগ্রাফার / শুটার</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">সময়সীমা টেক্সট</label>
                    <input
                      type="text"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      placeholder="যেমন: আজকের ভেতর (Today)"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* 🎥 REFERENCE VIDEO URL FIELD */}
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1 flex items-center gap-1.5">
                    <Film className="h-3.5 w-3.5 text-blue-500" />
                    <span>রেফারেন্স ভিডিও লিংক (YouTube, Reels, TikTok বা ড্রাইভ লিংক)</span>
                  </label>
                  <input
                    type="url"
                    value={newReferenceVideoUrl}
                    onChange={(e) => setNewReferenceVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/shorts/... অথবা গুগল ড্রাইভ রেফারেন্স লিংক"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>

                {/* 📝 FULL SCRIPT / VOICEOVER TEXT FIELD */}
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-amber-500" />
                    <span>স্ক্রিপ্ট বা টেক্সট ফাইল (পুরো স্ক্রিপ্ট / ভয়েস ওভার টেক্সট)</span>
                  </label>
                  <textarea
                    rows={4}
                    value={newScriptText}
                    onChange={(e) => setNewScriptText(e.target.value)}
                    placeholder="ভয়েসওভারের পুরো ডায়ালগ, হুক, বা টেক্সট স্ক্রিপ্ট এখানে পেস্ট করুন। টিম মেম্বাররা সরাসরি এটি কপি করতে পারবেন..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white leading-relaxed font-sans"
                  />
                </div>

                {newDepartment === "shoot" && (
                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">শুটিং লোকেশন ও কল টাইম</label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="যেমন: ধানমন্ডি লেক, দুপুর ২:৩০ PM"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                    কাজের সাধারণ ব্রিফ ও নোটস
                  </label>
                  <textarea
                    rows={2}
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="কাটস স্টাইল, কোন ফুটেজ ব্যবহার করবে বা ড্রাইভ লিংক বুঝিয়ে দিন..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-5 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-300">
                    <input
                      type="checkbox"
                      checked={newIsUrgent}
                      onChange={(e) => setNewIsUrgent(e.target.checked)}
                      className="h-3.5 w-3.5 rounded text-amber-600"
                    />
                    <span>জরুরি কাজ (Urgent Priority)</span>
                  </label>
                </div>
              </form>
            </div>

            <div className="pt-3 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowAddTaskModal(false)}
                className="px-3.5 py-1.5 rounded-lg text-stone-600 hover:bg-stone-100 dark:text-zinc-400 font-medium cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                form="add-task-form"
                className="px-4 py-1.5 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold cursor-pointer shadow-2xs"
              >
                কাজ অ্যাসাইন করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT TASK MODAL                                                          */}
      {/* ========================================================================= */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg max-h-[90vh] flex flex-col bg-white dark:bg-[#141416] rounded-2xl shadow-xl border border-stone-200/80 dark:border-zinc-800/80 p-6 space-y-4 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-zinc-800 shrink-0">
              <div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                  <Pencil className="h-4 w-4 text-blue-500" />
                  <span>কাজের বিবরণ বা স্ট্যাটাস এডিট করুন</span>
                </h3>
                <p className="text-xs text-stone-400">
                  ভুল করে অ্যাপ্রুভ হয়ে থাকলে স্ট্যাটাস পরিবর্তন করে পুনরায় পেন্ডিংয়ে নিতে পারবেন।
                </p>
              </div>
              <button
                onClick={() => setEditingTask(null)}
                className="text-stone-400 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto pr-1 flex-1">
              <form id="edit-task-form" onSubmit={handleSaveEditTask} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">কাজের শিরোনাম</label>
                  <input
                    type="text"
                    required
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>

                {/* Status Switcher */}
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                    কাজের অবস্থা / স্ট্যাটাস (Status)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingTask({ ...editingTask, completed: false, statusState: "not_done" })}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        !editingTask.completed && editingTask.statusState === "not_done"
                          ? "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-semibold"
                          : "border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 hover:bg-stone-100"
                      }`}
                    >
                      🔴 কাজ হয় নাই / বাকি
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingTask({ ...editingTask, completed: false, statusState: undefined, isUrgent: true, deadlineCategory: "today" })}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        !editingTask.completed && editingTask.statusState !== "not_done"
                          ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold"
                          : "border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 hover:bg-stone-100"
                      }`}
                    >
                      🟡 আজকের কাজ / পেন্ডিং
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingTask({ ...editingTask, completed: true, statusState: "completed" })}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer col-span-2 sm:col-span-1 ${
                        editingTask.completed
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold"
                          : "border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 hover:bg-stone-100"
                      }`}
                    >
                      🟢 অ্যাপ্রুভড ও সম্পন্ন
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                    🎥 রেফারেন্স ভিডিও লিংক
                  </label>
                  <input
                    type="url"
                    value={editingTask.referenceVideoUrl || ""}
                    onChange={(e) => setEditingTask({ ...editingTask, referenceVideoUrl: e.target.value })}
                    placeholder="https://youtube.com/shorts/..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                    📝 সম্পূর্ণ স্ক্রিপ্ট বা ভয়েসওভার টেক্সট
                  </label>
                  <textarea
                    rows={4}
                    value={editingTask.scriptText || ""}
                    onChange={(e) => setEditingTask({ ...editingTask, scriptText: e.target.value })}
                    placeholder="সম্পূর্ণ স্ক্রিপ্ট এখানে পেস্ট করুন..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">সময়সীমা</label>
                    <input
                      type="text"
                      value={editingTask.dueDate}
                      onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">কাকে দেওয়া</label>
                    <select
                      value={editingTask.assignee}
                      onChange={(e) => {
                        const val = e.target.value as TeamMember;
                        const names: Record<TeamMember, string> = {
                          all: "সবাই",
                          head: "ক্রিয়েটিভ ডিরেক্টর",
                          video_editor: "ভিডিও এডিটর",
                          designer: "গ্রাফিক ডিজাইনার",
                          videographer: "সিনেমাটোগ্রাফার / শুটার",
                        };
                        setEditingTask({ ...editingTask, assignee: val, assigneeName: names[val] });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                    >
                      <option value="video_editor">🎬 ভিডিও এডিটর</option>
                      <option value="designer">🎨 গ্রাফিক ডিজাইনার</option>
                      <option value="videographer">📹 সিনেমাটোগ্রাফার / শুটার</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">সাধারণ নোটস ও ব্রিফ</label>
                  <textarea
                    rows={2}
                    value={editingTask.notes || ""}
                    onChange={(e) => setEditingTask({ ...editingTask, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
              </form>
            </div>

            <div className="pt-3 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="px-3.5 py-1.5 rounded-lg text-stone-600 hover:bg-stone-100 dark:text-zinc-400 font-medium cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                form="edit-task-form"
                className="px-4 py-1.5 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold cursor-pointer shadow-2xs"
              >
                পরিবর্তন সেভ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TEAM MODAL: SUBMIT DELIVERABLE / FILE                                     */}
      {/* ========================================================================= */}
      {showAddFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#141416] rounded-2xl shadow-xl border border-stone-200/80 dark:border-zinc-800/80 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                  নতুন ডেলিভারেবল বা ড্রাইভ লিংক জমা দিন
                </h3>
                <p className="text-xs text-stone-400">হেডের রিভিউ ও অ্যাপ্রুভালের জন্য প্রস্তুতকৃত কাজের লিংক দিন</p>
              </div>
              <button
                onClick={() => setShowAddFileModal(false)}
                className="text-stone-400 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddFile} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                  কাজের শিরোনাম *
                </label>
                <input
                  type="text"
                  required
                  value={newFileTitle}
                  onChange={(e) => setNewFileTitle(e.target.value)}
                  placeholder="যেমন: সামার রিলস ফাইনাল রেন্ডার ড্রাফট ৩"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">ফাইলের নাম *</label>
                  <input
                    type="text"
                    required
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="যেমন: Summer_Reels_V3_4K.mp4"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">ফাইলের ধরন</label>
                  <select
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  >
                    <option value="video">ভিডিও (.mp4)</option>
                    <option value="project">প্রজেক্ট (.prproj / .aep)</option>
                    <option value="image">ইমেজ (.psd / .jpg)</option>
                    <option value="folder">ড্রাইভ ফোল্ডার</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">গুগল ড্রাইভ লিংক *</label>
                <input
                  type="url"
                  required
                  value={newDriveUrl}
                  onChange={(e) => setNewDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">হেডের জন্য কোনো নোট বা কমেন্ট</label>
                <textarea
                  rows={2}
                  value={newFileNotes}
                  onChange={(e) => setNewFileNotes(e.target.value)}
                  placeholder="যেমন: কালার গ্রেডিং ও অডিও নরম্যালাইজ করা হয়েছে..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFileModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-stone-600 hover:bg-stone-100 dark:text-zinc-400 font-medium cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold cursor-pointer shadow-2xs"
                >
                  ফাইল জমা দিন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT FILE MODAL                                                          */}
      {/* ========================================================================= */}
      {editingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#141416] rounded-2xl shadow-xl border border-stone-200/80 dark:border-zinc-800/80 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                  <Pencil className="h-4 w-4 text-blue-500" />
                  <span>ফাইল এডিট ও স্ট্যাটাস পরিবর্তন</span>
                </h3>
                <p className="text-xs text-stone-400">ভুল করে অ্যাপ্রুভ হয়ে থাকলে পুনরায় রিভিউ পেন্ডিংয়ে ফেরত নিতে পারবেন</p>
              </div>
              <button
                onClick={() => setEditingFile(null)}
                className="text-stone-400 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditFile} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">ফাইলের শিরোনাম</label>
                <input
                  type="text"
                  required
                  value={editingFile.title}
                  onChange={(e) => setEditingFile({ ...editingFile, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                />
              </div>

              {/* File Status Switcher */}
              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                  ফাইলের অবস্থা / স্ট্যাটাস
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingFile({ ...editingFile, status: "ready_for_review" })}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      editingFile.status === "ready_for_review"
                        ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold"
                        : "border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 hover:bg-stone-100"
                    }`}
                  >
                    ⏳ রিভিউ পেন্ডিং
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingFile({ ...editingFile, status: "needs_revision" })}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      editingFile.status === "needs_revision"
                        ? "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-semibold"
                        : "border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 hover:bg-stone-100"
                    }`}
                  >
                    ⚠️ সংশোধন
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingFile({ ...editingFile, status: "approved" })}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      editingFile.status === "approved"
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold"
                        : "border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 hover:bg-stone-100"
                    }`}
                  >
                    🏆 অ্যাপ্রুভড
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">ড্রাইভ লিংক</label>
                <input
                  type="url"
                  required
                  value={editingFile.driveUrl}
                  onChange={(e) => setEditingFile({ ...editingFile, driveUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">রিভিউ ও ফিডব্যাক নোটস</label>
                <textarea
                  rows={2}
                  value={editingFile.notes || ""}
                  onChange={(e) => setEditingFile({ ...editingFile, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingFile(null)}
                  className="px-3.5 py-1.5 rounded-lg text-stone-600 hover:bg-stone-100 dark:text-zinc-400 font-medium cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold cursor-pointer shadow-2xs"
                >
                  পরিবর্তন সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
