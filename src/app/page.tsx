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
} from "lucide-react";

// Team Roles for Swapon's World (Consolidated Video Editor pool)
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
  notes?: string;
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
}

export interface AuthSession {
  role: TeamMember;
  isAdmin: boolean;
  displayName: string;
}

// Initial Tasks
const INITIAL_TASKS: SwaponTask[] = [
  // Video Editing Tasks (Unified pool for both editors to divide)
  {
    id: "task-vid-1",
    title: "সামার সেলস টিকটক ও ইনস্টাগ্রাম রিলস ভার্টিক্যাল কাট (৯:১৬)",
    assignee: "video_editor",
    assigneeName: "ভিডিও এডিটর",
    department: "video",
    deadlineCategory: "today",
    dueDate: "আজ সন্ধ্যা ৬:০০",
    completed: false,
    isUrgent: true,
    notes: "প্রথম ৩ সেকেন্ডের শক্তিশালী ভিজ্যুয়াল হুক, ট্রানজিশন এবং সাউন্ড এফেক্টস সিঙ্ক।",
  },
  {
    id: "task-vid-2",
    title: "ইউটিউব ফুল ভিডিও এডিটিং ও সাউন্ড ডিজাইন মাস্টার (১৬:৯)",
    assignee: "video_editor",
    assigneeName: "ভিডিও এডিটর",
    department: "video",
    deadlineCategory: "today",
    dueDate: "আজ রাত ৯:০০",
    completed: false,
    isUrgent: true,
    notes: "ভয়েসওভার মাস্টার ট্র্যাক সিঙ্ক, অ্যাম্বিয়েন্স ও কালার গ্রেডিং Rec.709 স্ট্যান্ডার্ডে।",
  },
  {
    id: "task-vid-3",
    title: "প্রোডাক্ট টিজার ও বি-রোল কাট — ২য় ভার্সন",
    assignee: "video_editor",
    assigneeName: "ভিডিও এডিটর",
    department: "video",
    deadlineCategory: "tomorrow",
    dueDate: "আগামীকাল (Tomorrow)",
    completed: false,
    notes: "হেডের রিভিশন অনুযায়ী মিউজিকের বিটের সাথে কাট ফাস্ট করতে হবে।",
  },
  {
    id: "task-vid-4",
    title: "আসন্ন ক্যাম্পেইনের ড্রাফট কাট সিঙ্ক ও সাবটাইটেলিং",
    assignee: "video_editor",
    assigneeName: "ভিডিও এডিটর",
    deadlineCategory: "3days",
    dueDate: "৩ দিনের ভেতর",
    department: "video",
    completed: false,
    notes: "ভিডিওগ্রাফারের র ফুটেজ থেকে বেস্ট টেকগুলো নির্বাচন করে ড্রাফট সাজান।",
  },

  // Graphic Design Tasks
  {
    id: "task-des-1",
    title: "সামার কালেকশন সোশ্যাল মিডিয়া ব্যানার সেট (১০৮০x১০৮০)",
    assignee: "designer",
    assigneeName: "গ্রাফিক ডিজাইনার",
    department: "design",
    deadlineCategory: "today",
    dueDate: "আজ দুপুর ৩:০০",
    completed: true,
    isUrgent: true,
    notes: "ফেসবুক ও ইনস্টাগ্রাম স্কয়ার পোস্ট এবং স্টোরি সাইজ রেডি করা হয়েছে।",
  },
  {
    id: "task-des-2",
    title: "ব্র্যান্ড লুকবুক ও ক্যাটালগ ফটো রিটাচিং",
    assignee: "designer",
    assigneeName: "গ্রাফিক ডিজাইনার",
    department: "design",
    deadlineCategory: "3days",
    dueDate: "৩ দিনের ভেতর",
    completed: false,
    notes: "হাই-এন্ড স্কিন রিটাচিং এবং প্রোডাক্টের কালার ব্যালান্স ঠিক করতে হবে।",
  },

  // Videographer / Shooter Tasks
  {
    id: "task-sht-1",
    title: "নতুন প্রোডাক্ট ক্যাম্পেইন — আউটডোর শুট",
    assignee: "videographer",
    assigneeName: "সিনেমাটোগ্রাফার / শুটার",
    department: "shoot",
    deadlineCategory: "today",
    dueDate: "আজ দুপুর ২:৩০ PM",
    completed: true,
    location: "ধানমন্ডি লেক ও আউটডোর স্পট",
    shootTime: "দুপুর ২:৩০ PM – ৫:০০ PM",
    gearInfo: "Sony FX3 • 24-70mm f/2.8 • Ronin RS3 Gimbal • 4K 60fps",
    notes: "ন্যাচারাল গোল্ডেন আওয়ার লাইটিং ও স্লো-মোশন ক্লোজ-আপ শট। ফুটেজ ড্রাইভে ব্যাকআপ করুন।",
  },
  {
    id: "task-sht-2",
    title: "ইনডোর মডেল ও ফ্যাশন শুট (স্বপনস ওয়ার্ল্ড স্টুডিও ২)",
    assignee: "videographer",
    assigneeName: "সিনেমাটোগ্রাফার / শুটার",
    department: "shoot",
    deadlineCategory: "7days",
    dueDate: "৭ দিনের শিডিউল",
    completed: false,
    location: "স্বপনস ওয়ার্ল্ড মেইন স্টুডিও (ফ্লোর ২)",
    shootTime: "সকাল ১১:০০ AM",
    gearInfo: "Aputure 300d II Softbox • C-Stands • Reflector Panel",
    notes: "ইনডোর থিম্যাটিক ব্যাকড্রপ ও লাইটিং গ্রিড আগে থেকে প্রস্তুত রাখা প্রয়োজন।",
  },
];

// Initial Files
const INITIAL_FILES: StudioFile[] = [
  // Video Editing Files
  {
    id: "file-vid-1",
    title: "সামার সেলস ৯:১৬ ভার্টিক্যাল রিলস — ফাইনাল রেন্ডার",
    fileName: "Summer_Reels_Hook_V3_4K.mp4",
    fileType: "video",
    fileFormat: "MP4 (4K 60fps)",
    fileSize: "285 MB",
    driveUrl: "https://drive.google.com/drive/folders/swapons_world_video",
    owner: "video_editor",
    ownerName: "ভিডিও এডিটর",
    status: "ready_for_review",
    uploadedAt: "২১ নভেম্বর, দুপুর ০১:১৫",
    notes: "কালার গ্রেডিং Rec.709 স্ট্যান্ডার্ড এবং সাউন্ড লেভেল -14 LUFS নরম্যালাইজ করা হয়েছে।",
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
    status: "ready_for_review",
    uploadedAt: "২১ নভেম্বর, সকাল ১১:৪৫",
    notes: "১৮ মিনিটের ইউটিউব মাস্টার কাট। থিম মিউজিক ও ভয়েসওভার ফাইনাল সিঙ্ক।",
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
    notes: "সম্পূর্ণ প্রোজেক্ট ফাইল ও ট্রাঞ্জিশন প্রিসেট ড্রাইভে আপলোড করা।",
  },

  // Graphic Designer Files
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
    notes: "সবগুলো লেয়ার আনগ্রুপড ও ফন্ট আউটলাইন করা অবস্থায় আপলোড করা।",
  },
  {
    id: "file-des-2",
    title: "ইনস্টাগ্রাম স্টোরি ও হাইলাইট আইকন ভেক্টর সেট",
    fileName: "Instagram_Story_Pack_5Sets.ai",
    fileType: "project",
    fileFormat: "Illustrator (.ai)",
    fileSize: "85 MB",
    driveUrl: "https://drive.google.com/drive/folders/swapons_world_design",
    owner: "designer",
    ownerName: "গ্রাফিক ডিজাইনার",
    status: "ready_for_review",
    uploadedAt: "২১ নভেম্বর, সকাল ১০:৩০",
    notes: "৫টি ভিন্ন কালার ভ্যারিয়েন্টের ভেক্টর ডিজাইন।",
  },

  // Videographer Files
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
    notes: "সনি এফএক্সথ্রি দিয়ে শুট করা ৬০টি ক্লিপ গুগল ড্রাইভ স্টুডিওতে ব্যাকআপ সম্পন্ন।",
  },
  {
    id: "file-sht-2",
    title: "ইনডোর মডেল ও ফ্যাশন শুটের টেকনিক্যাল কল শিট",
    fileName: "Indoor_Studio_Fashion_CallSheet_V2.pdf",
    fileType: "document",
    fileFormat: "PDF Document",
    fileSize: "4.5 MB",
    driveUrl: "https://drive.google.com/drive/folders/swapons_world_footage",
    owner: "videographer",
    ownerName: "সিনেমাটোগ্রাফার / শুটার",
    status: "approved",
    uploadedAt: "২০ নভেম্বর, বিকাল ০৫:০০",
    notes: "লাইটিং গ্রিড সেটআপ, শট ডিভিশন এবং মডেলদের টাইমিং চার্ট।",
  },
];

export default function SwaponsWorldApp() {
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

  // Admin filter
  const [adminViewFilter, setAdminViewFilter] = useState<TeamMember>("all");

  // Search & Filter for files
  const [fileSearch, setFileSearch] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");

  // Add Task Modal
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAssignee, setNewAssignee] = useState<TeamMember>("video_editor");
  const [newCategory, setNewCategory] = useState<"today" | "tomorrow" | "3days" | "7days" | "15days">("today");
  const [newDepartment, setNewDepartment] = useState<"design" | "video" | "shoot" | "general">("video");
  const [newDueDate, setNewDueDate] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newGearInfo, setNewGearInfo] = useState("");
  const [newIsUrgent, setNewIsUrgent] = useState(false);

  // Add File Modal
  const [showAddFileModal, setShowAddFileModal] = useState(false);
  const [newFileTitle, setNewFileTitle] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [newFileType, setNewFileType] = useState<"video" | "image" | "project" | "document" | "folder">("video");
  const [newFileFormat, setNewFileFormat] = useState("MP4 (4K 60fps)");
  const [newFileSize, setNewFileSize] = useState("");
  const [newDriveUrl, setNewDriveUrl] = useState("");
  const [newFileNotes, setNewFileNotes] = useState("");

  const supabase = createClient();

  // Load Saved Auth Session & Data
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

    // Fetch live tasks from Supabase
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

  // Live Dhaka Clock
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

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const cleanPass = passwordInput.trim();

    if (loginTab === "admin") {
      // Admin password check (admin123 or swapon123 or CreativeFlow#2026)
      if (cleanPass === "admin123" || cleanPass === "swapon123" || cleanPass === "CreativeFlow#2026" || cleanPass === "admin") {
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
      // Team Member password check (team123 or 1234 or team)
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

  // Toggle Task Complete
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

  // Delete Task
  const deleteTask = async (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    updateTasks(updated);
    try {
      await supabase.from("tasks").delete().eq("id", taskId);
    } catch (e) {}
  };

  // Admin Add Task
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
      id: "task-" + Date.now(),
      title: newTitle.trim(),
      assignee: newAssignee,
      assigneeName: assigneeNames[newAssignee],
      department: newDepartment,
      deadlineCategory: newCategory,
      dueDate: newDueDate || (newCategory === "today" ? "আজকের ভেতর" : newCategory === "tomorrow" ? "আগামীকাল" : newCategory === "3days" ? "৩ দিনের ভেতর" : newCategory === "7days" ? "৭ দিনের শিডিউল" : "১৫ দিনের প্রজেক্ট"),
      completed: false,
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

    // Reset Form
    setNewTitle("");
    setNewNotes("");
    setNewLocation("");
    setNewGearInfo("");
    setNewDueDate("");
    setNewIsUrgent(false);
    setShowAddTaskModal(false);
  };

  // Add File
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
      id: "file-" + Date.now(),
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

    // Reset Form
    setNewFileTitle("");
    setNewFileName("");
    setNewFileSize("");
    setNewDriveUrl("");
    setNewFileNotes("");
    setShowAddFileModal(false);
  };

  // Toggle File Status
  const toggleFileStatus = (fileId: string) => {
    const updated = files.map((f) => {
      if (f.id === fileId) {
        const nextStatus: StudioFile["status"] =
          f.status === "ready_for_review"
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

  // Delete File
  const deleteFile = (fileId: string) => {
    const updated = files.filter((f) => f.id !== fileId);
    updateFiles(updated);
  };

  // Filter Tasks & Files based on Role
  const isHead = session?.isAdmin ?? false;

  const visibleTasks = tasks.filter((t) => {
    if (isHead) {
      if (adminViewFilter === "all") return true;
      return t.assignee === adminViewFilter;
    }
    // Team member strictly only sees their own tasks
    return t.assignee === session?.role;
  });

  const visibleFiles = files.filter((f) => {
    if (isHead) {
      if (adminViewFilter === "all") return true;
      return f.owner === adminViewFilter;
    }
    // Team member strictly only sees their own files
    return f.owner === session?.role;
  });

  const displayFiles = visibleFiles.filter((f) => {
    const matchesSearch =
      f.title.toLowerCase().includes(fileSearch.toLowerCase()) ||
      f.fileName.toLowerCase().includes(fileSearch.toLowerCase()) ||
      (f.notes && f.notes.toLowerCase().includes(fileSearch.toLowerCase()));

    const matchesType = fileTypeFilter === "all" || f.fileType === fileTypeFilter;
    return matchesSearch && matchesType;
  });

  const todayTasks = visibleTasks.filter((t) => t.deadlineCategory === "today");
  const upcomingTasks = visibleTasks.filter((t) => t.deadlineCategory !== "today");

  const totalTasks = visibleTasks.length;
  const completedTasks = visibleTasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 1. MANDATORY LOGIN GATE FIRST:
  // If no active session, show clean minimalist login screen
  if (!authChecked || !session) {
    return (
      <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0c0d] text-[#18181b] dark:text-[#f4f4f5] flex items-center justify-center p-4 selection:bg-zinc-900 selection:text-white">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-stone-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Studio Brand */}
          <div className="text-center space-y-1.5">
            <div className="h-10 w-10 rounded-xl bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center font-studio-mono font-bold text-sm mx-auto shadow-2xs">
              SW
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
              স্বপনস ওয়ার্ল্ড স্টুডিও
            </h1>
            <p className="text-xs text-stone-500 dark:text-zinc-400">
              প্রোডাকশন ও টিম ম্যানেজমেন্ট পোর্টাল
            </p>
          </div>

          {/* Login Type Segmented Toggle */}
          <div className="grid grid-cols-2 p-1 rounded-lg bg-stone-100 dark:bg-zinc-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setLoginTab("team");
                setLoginError("");
                setPasswordInput("");
              }}
              className={`py-2 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                loginTab === "team"
                  ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-2xs"
                  : "text-stone-500 hover:text-zinc-900"
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
              className={`py-2 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                loginTab === "admin"
                  ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-2xs"
                  : "text-stone-500 hover:text-zinc-900"
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              <span>টিম হেড / অ্যাডমিন</span>
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs font-medium">
            {loginTab === "team" ? (
              // Team Member Section
              <div className="space-y-3.5">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 mb-1.5">
                    আপনার পদবী নির্বাচন করুন
                  </label>
                  <select
                    value={teamRoleSelect}
                    onChange={(e) => setTeamRoleSelect(e.target.value as TeamMember)}
                    className="w-full px-3 py-2.5 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-950"
                  >
                    <option value="video_editor">ভিডিও এডিটর (Video Editor)</option>
                    <option value="designer">গ্রাফিক ডিজাইনার (Graphic Designer)</option>
                    <option value="videographer">সিনেমাটোগ্রাফার / শুটার (Videographer)</option>
                  </select>
                  <p className="text-[11px] text-stone-400 mt-1">
                    ভিডিও এডিটররা ঢুকলে সব ভিডিও এডিটিং কাজ একসাথে দেখতে ও নিজেদের মাঝে ভাগ করে নিতে পারবেন।
                  </p>
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 mb-1.5">
                    টিম পাসওয়ার্ড (Team Password)
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="টিম পাসওয়ার্ড লিখুন..."
                    className="w-full px-3 py-2.5 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-950"
                  />
                  <div className="flex items-center justify-between text-[11px] text-stone-400 mt-1">
                    <span>ডিফল্ট টিম পাসওয়ার্ড:</span>
                    <span className="font-studio-mono font-semibold text-zinc-700 dark:text-zinc-300">team123</span>
                  </div>
                </div>
              </div>
            ) : (
              // Admin Section
              <div className="space-y-3.5">
                <div className="p-3 rounded-lg bg-stone-50 dark:bg-zinc-800/60 border border-stone-200/60 dark:border-zinc-700/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-900 dark:text-white font-semibold">
                    <Shield className="h-3.5 w-3.5 text-zinc-950 dark:text-white" />
                    <span>অ্যাডমিন ম্যানেজমেন্ট পোর্টাল</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-zinc-400 leading-relaxed">
                    অ্যাডমিন হিসেবে ঢুকে সবাইকে কাজ বুঝিয়ে দিতে পারবেন, নতুন কাজ ও ফাইল অ্যাসাইন করতে পারবেন।
                  </p>
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 mb-1.5">
                    অ্যাডমিন পাসওয়ার্ড (Admin Password)
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="অ্যাডমিন পাসওয়ার্ড লিখুন..."
                    className="w-full px-3 py-2.5 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-950"
                  />
                  <div className="flex items-center justify-between text-[11px] text-stone-400 mt-1">
                    <span>ডিফল্ট অ্যাডমিন পাসওয়ার্ড:</span>
                    <span className="font-studio-mono font-semibold text-zinc-700 dark:text-zinc-300">admin123</span>
                  </div>
                </div>
              </div>
            )}

            {loginError && (
              <div className="p-2.5 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
            >
              {loginTab === "admin" ? "অ্যাডমিন ড্যাশবোর্ডে প্রবেশ →" : "কাজের বোর্ডে প্রবেশ করুন →"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. MAIN LOGGED-IN STUDIO INTERFACE
  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0c0d] text-[#18181b] dark:text-[#f4f4f5] antialiased selection:bg-zinc-900 selection:text-white pb-24">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#fafaf9]/90 dark:bg-[#0c0c0d]/90 backdrop-blur-md border-b border-stone-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Brand & User Role */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center font-studio-mono font-bold text-xs shrink-0 shadow-2xs">
              SW
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
                  স্বপনস ওয়ার্ল্ড
                </span>
                <span className={`font-studio-mono text-[10px] px-2 py-0.5 rounded font-medium ${
                  isHead
                    ? "bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950"
                    : "bg-stone-200 dark:bg-zinc-800 text-stone-800 dark:text-zinc-200"
                }`}>
                  {session.displayName}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-zinc-400">
                {isHead
                  ? "অ্যাডমিন মোড • কাজ বুঝিয়ে দিন ও সবার কাজ পরিচালনা করুন"
                  : "টিম মেম্বার ভিউ • শুধুমাত্র আপনার আজকের কাজ ও ফাইলসমূহ"}
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Clock */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-100 dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 text-[11px] font-studio-mono text-stone-600 dark:text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>DHAKA {dhakaTime || "15:00:00"}</span>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium border border-stone-200 dark:border-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-600 dark:text-zinc-300 transition-colors cursor-pointer"
              title="লগআউট করুন"
            >
              <LogOut className="h-3 w-3" />
              <span className="hidden sm:inline">লগআউট</span>
            </button>

            {/* Admin Actions: Add File and Add Task */}
            {isHead && (
              <>
                <button
                  onClick={() => setShowAddFileModal(true)}
                  className="px-3 py-1.5 rounded bg-stone-200 hover:bg-stone-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>+ ফাইল দিন</span>
                </button>

                <button
                  onClick={() => setShowAddTaskModal(true)}
                  className="px-3.5 py-1.5 rounded bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>+ নতুন কাজ বুঝিয়ে দিন</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* If Admin is logged in: Department Filter Pill Bar */}
        {isHead && (
          <div className="border-t border-stone-200/70 dark:border-zinc-800/80 bg-stone-50/60 dark:bg-zinc-950/40">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
              <span className="text-[11px] font-studio-mono uppercase text-stone-400 mr-2 shrink-0">
                ডিপার্টমেন্ট ভিউ:
              </span>
              {[
                { id: "all", label: "সবার কাজ (All Work)" },
                { id: "video_editor", label: "🎬 ভিডিও এডিটর (সব এডিটিং কাজ)" },
                { id: "designer", label: "🎨 গ্রাফিক ডিজাইনার" },
                { id: "videographer", label: "📹 সিনেমাটোগ্রাফার / শুট" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setAdminViewFilter(m.id as TeamMember)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    adminViewFilter === m.id
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-2xs"
                      : "text-stone-600 dark:text-zinc-400 hover:bg-stone-200/60 dark:hover:bg-zinc-800"
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-7 space-y-8">
        {/* ========================================================= */}
        {/* SECTION 1: উপরে ড্যাশবোর্ড (TOP DASHBOARD SECTION)       */}
        {/* ========================================================= */}
        <section className="space-y-4">
          {/* KPI Summary Card */}
          <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-studio-mono uppercase tracking-wider text-stone-500">
                  <span>
                    {isHead ? "ADMIN PRODUCTION DASHBOARD" : "TODAY'S WORKSTATION"}
                  </span>
                  <span>•</span>
                  <span>{session.displayName}</span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-bold font-studio-mono text-zinc-950 dark:text-white">
                    {completedTasks < 10 ? "০" + completedTasks : completedTasks}
                  </span>
                  <span className="text-xl sm:text-2xl text-stone-400 font-light font-studio-mono">
                    / {totalTasks < 10 ? "০" + totalTasks : totalTasks}
                  </span>
                  <span className="text-sm font-medium text-stone-600 dark:text-zinc-400 ml-1">
                    কাজ সম্পন্ন ({taskProgress}%)
                  </span>
                </div>
              </div>

              {/* Status Columns */}
              <div className="flex items-center gap-5 sm:gap-7 text-xs border-t md:border-t-0 md:border-l border-stone-200 dark:border-zinc-800 pt-3 md:pt-0 md:pl-7">
                <div>
                  <span className="text-stone-400 block text-[11px] font-studio-mono uppercase">
                    আজকের কাজ
                  </span>
                  <span className="text-base font-semibold text-zinc-900 dark:text-white font-studio-mono mt-0.5 block">
                    {todayTasks.length} টি
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px] font-studio-mono uppercase">
                    বাকি কাজ
                  </span>
                  <span className="text-base font-semibold text-zinc-900 dark:text-white font-studio-mono mt-0.5 block">
                    {pendingTasks} টি
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px] font-studio-mono uppercase">
                    প্রোডাকশন ফাইলস
                  </span>
                  <span className="text-base font-semibold text-zinc-900 dark:text-white font-studio-mono mt-0.5 block">
                    {visibleFiles.length} টি
                  </span>
                </div>
              </div>
            </div>

            {/* Hairline Progress Bar */}
            <div className="mt-5">
              <div className="h-1.5 w-full bg-stone-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-300"
                  style={{ width: `${taskProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Today's Tasks Interactive Checklist */}
          <div className="rounded-xl bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 p-4.5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-zinc-800">
              <div>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                  {session.role === "video_editor"
                    ? "আজকের ভিডিও এডিটিং কাজসমূহ (এডিটররা নিজেদের মাঝে ভাগ করে নিবেন)"
                    : "আজকের জন্য নির্ধারিত কাজ ও অ্যাসাইনমেন্ট"}
                </h3>
                <p className="text-[11px] text-stone-500">
                  {isHead
                    ? "টিম মেম্বারদের দেওয়া আজকের কাজের তালিকা ও নির্দেশনাসমূহ।"
                    : "যে কাজটি শেষ হবে বামপাশের বক্সে টিক দিয়ে মার্ক করুন।"}
                </p>
              </div>
              <span className="text-[11px] font-studio-mono text-stone-400">
                {todayTasks.filter((t) => t.completed).length} OF {todayTasks.length} DONE
              </span>
            </div>

            {todayTasks.length === 0 ? (
              <p className="text-xs text-stone-400 py-3 text-center">
                আজকের জন্য কোনো পেন্ডিং কাজ নির্ধারিত নেই।
              </p>
            ) : (
              <div className="divide-y divide-stone-100 dark:divide-zinc-800/80">
                {todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="py-3 flex items-start justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`mt-0.5 h-4.5 w-4.5 rounded border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                          task.completed
                            ? "bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-white dark:text-zinc-950"
                            : "border-stone-300 dark:border-zinc-700 hover:border-zinc-950 bg-transparent"
                        }`}
                        title={task.completed ? "Mark incomplete" : "Mark as done"}
                      >
                        {task.completed && <Check className="h-3 w-3 stroke-[3]" />}
                      </button>

                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            onClick={() => toggleTask(task.id)}
                            className={`text-xs sm:text-sm font-medium cursor-pointer ${
                              task.completed
                                ? "line-through text-stone-400 dark:text-zinc-500 font-normal"
                                : "text-zinc-900 dark:text-white"
                            }`}
                          >
                            {task.title}
                          </span>
                          {task.isUrgent && (
                            <span className="text-[9px] font-studio-mono text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.2 rounded font-semibold">
                              URGENT
                            </span>
                          )}
                          {isHead && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 dark:bg-zinc-800 text-stone-600 font-medium">
                              {task.assigneeName}
                            </span>
                          )}
                        </div>

                        {task.notes && (
                          <p className="text-xs text-stone-500 dark:text-zinc-400 leading-relaxed">
                            <strong className="text-zinc-700 dark:text-zinc-300 font-medium">নির্দেশনা:</strong> {task.notes}
                          </p>
                        )}

                        {task.location && (
                          <div className="flex items-center gap-2 text-[11px] text-stone-500">
                            <span className="flex items-center gap-1 text-stone-600 dark:text-zinc-300">
                              <MapPin className="h-3 w-3 text-stone-400" />
                              {task.location}
                            </span>
                            {task.shootTime && <span>• {task.shootTime}</span>}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-[11px] text-stone-400 font-studio-mono">
                      <span>{task.dueDate}</span>
                      {isHead && (
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-rose-600 p-1 transition-opacity cursor-pointer"
                          title="কাজ ডিলিট করুন"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: নিচে সব ফাইলসমূহ (BOTTOM FILES & DELIVERABLES) */}
        {/* ========================================================= */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-stone-200 dark:border-zinc-800">
            <div>
              <h2 className="text-base font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                <span>প্রোডাকশন ফাইলস ও ডেলিভারেবলস</span>
                <span className="text-xs font-studio-mono text-stone-500 font-normal">
                  ({displayFiles.length} টি ফাইল)
                </span>
              </h2>
              <p className="text-xs text-stone-500">
                {isHead
                  ? "সকল সদস্যের ফাইনাল রেন্ডার, সোর্স ফাইল ও ড্রাইভ লিংক।"
                  : `শুধুমাত্র ${session.displayName}-এর প্রজেক্ট ও রেন্ডার ফাইলসমূহ।`}
              </p>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="text"
                  value={fileSearch}
                  onChange={(e) => setFileSearch(e.target.value)}
                  placeholder="ফাইল খুঁজুন..."
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 w-36 sm:w-48"
                />
              </div>

              <select
                value={fileTypeFilter}
                onChange={(e) => setFileTypeFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none"
              >
                <option value="all">সব ফাইল</option>
                <option value="video">ভিডিও (.mp4)</option>
                <option value="project">প্রজেক্ট (.prproj/.ai)</option>
                <option value="image">ইমেজ (.psd)</option>
                <option value="folder">ড্রাইভ ফোল্ডার</option>
              </select>
            </div>
          </div>

          {/* Files Grid */}
          {displayFiles.length === 0 ? (
            <div className="p-10 text-center rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 space-y-1.5">
              <HardDrive className="h-8 w-8 text-stone-300 mx-auto" />
              <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                কোনো ফাইল পাওয়া যায়নি
              </h4>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                এই ডিপার্টমেন্টের কোনো ফাইল বা ক্লাউড লিংক এখনো আপলোড করা হয়নি।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {displayFiles.map((file) => {
                const isVideo = file.fileType === "video";
                const isProject = file.fileType === "project";
                const isFolder = file.fileType === "folder";

                return (
                  <div
                    key={file.id}
                    className="p-4.5 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      {/* Top Header of Card */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded bg-stone-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                            {isVideo ? (
                              <Film className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                            ) : isProject ? (
                              <FileCode className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                            ) : isFolder ? (
                              <HardDrive className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                            ) : (
                              <ImageIcon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
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
                        <button
                          onClick={() => isHead && toggleFileStatus(file.id)}
                          className={`text-[10px] font-studio-mono uppercase px-2 py-0.5 rounded transition-colors border ${
                            file.status === "approved"
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                              : file.status === "needs_revision"
                              ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                              : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                          } ${isHead ? "cursor-pointer" : "cursor-default"}`}
                          title={isHead ? "স্ট্যাটাস পরিবর্তন করতে ক্লিক করুন" : ""}
                        >
                          {file.status === "approved"
                            ? "অ্যাপ্রুভড"
                            : file.status === "needs_revision"
                            ? "সংশোধন প্রয়োজন"
                            : "রিভিউ পেন্ডিং"}
                        </button>
                      </div>

                      <h4 className="text-sm font-semibold text-zinc-950 dark:text-white mt-2.5">
                        {file.title}
                      </h4>

                      {file.notes && (
                        <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1 leading-relaxed">
                          {file.notes}
                        </p>
                      )}
                    </div>

                    {/* Bottom Metadata & Links */}
                    <div className="pt-2.5 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-[11px] text-stone-400">
                        <span>{file.ownerName}</span>
                        <span>•</span>
                        <span>{file.uploadedAt}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={file.driveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-xs font-medium flex items-center gap-1 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>ড্রাইভ লিংক</span>
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
        </section>
      </main>

      {/* ADMIN MODAL: ADD TASK (কাজ বুঝিয়ে দেওয়া ও অ্যাসাইন করা) */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-stone-200 dark:border-zinc-800 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                  নতুন কাজ অ্যাসাইন করুন ও বুঝিয়ে দিন
                </h3>
                <p className="text-xs text-stone-400">অ্যাডমিন হিসেবে টিম মেম্বারদের জন্য কাজ বুঝিয়ে দিন</p>
              </div>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="text-stone-400 hover:text-zinc-950 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                  কাজের শিরোনাম / নাম *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="যেমন: সামার সেলস ভার্টিক্যাল রিলস এডিটিং"
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-950"
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
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  >
                    <option value="video_editor">🎬 ভিডিও এডিটর (যেকোনো এডিটর নিতে পারবেন)</option>
                    <option value="designer">🎨 গ্রাফিক ডিজাইনার</option>
                    <option value="videographer">📹 সিনেমাটোগ্রাফার / শুটার</option>
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
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">শুটিং লোকেশন ও কল টাইম</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="যেমন: ধানমন্ডি লেক, দুপুর ২:৩০ PM"
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                  কাজের সম্পূর্ণ নির্দেশনা ও ব্রিফ (যাতে মেম্বার কাজ বুঝে নিতে পারে) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="ভিডিও সাইজ, কাটস স্টাইল, কোন ফুটেজ ব্যবহার করবে বা ড্রাইভ লিংক বুঝিয়ে দিন..."
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
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-3.5 py-1.5 rounded text-stone-600 hover:bg-stone-100 dark:text-zinc-400 font-medium"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold"
                >
                  কাজ অ্যাসাইন করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN MODAL: ADD FILE */}
      {showAddFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-stone-200 dark:border-zinc-800 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                  নতুন ড্রাইভ লিংক বা ফাইল যুক্ত করুন
                </h3>
                <p className="text-xs text-stone-400">টিমের মেম্বারদের জন্য সোর্স বা রেন্ডার ফাইল লিংক দিন</p>
              </div>
              <button
                onClick={() => setShowAddFileModal(false)}
                className="text-stone-400 hover:text-zinc-950 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddFile} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                  ফাইলের শিরোনাম *
                </label>
                <input
                  type="text"
                  required
                  value={newFileTitle}
                  onChange={(e) => setNewFileTitle(e.target.value)}
                  placeholder="যেমন: সামার কালেকশন ৯:১৬ রেন্ডার ড্রাফট"
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">ফাইল নেম *</label>
                  <input
                    type="text"
                    required
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="যেমন: Summer_Reels_V1.mp4"
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">কার ফাইল *</label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value as TeamMember)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  >
                    <option value="video_editor">ভিডিও এডিটর</option>
                    <option value="designer">গ্রাফিক ডিজাইনার</option>
                    <option value="videographer">সিনেমাটোগ্রাফার / শুটার</option>
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
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFileModal(false)}
                  className="px-3.5 py-1.5 rounded text-stone-600 hover:bg-stone-100 dark:text-zinc-400 font-medium"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold"
                >
                  ফাইল সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
