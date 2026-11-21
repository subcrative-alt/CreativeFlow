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
  Download,
  ExternalLink,
  Search,
  Filter,
  Eye,
  FolderArchive,
  HardDrive,
  UserCheck,
  LogOut,
  AlertCircle,
  FileCode,
  Image as ImageIcon,
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

const INITIAL_FILES: StudioFile[] = [
  // Video Editor 01 Files
  {
    id: "file-ed1-1",
    title: "সামার সেলস ৯:১৬ ভার্টিক্যাল রিলস — ফাইনাল রেন্ডার",
    fileName: "Summer_Reels_Hook_V3_4K.mp4",
    fileType: "video",
    fileFormat: "MP4 (4K 60fps)",
    fileSize: "285 MB",
    driveUrl: "https://drive.google.com/drive/folders/swapons_world_editor01",
    owner: "editor1",
    ownerName: "ভিডিও এডিটর ০১",
    status: "ready_for_review",
    uploadedAt: "২১ নভেম্বর, দুপুর ০১:১৫",
    notes: "কালার গ্রেডিং Rec.709 স্ট্যান্ডার্ড এবং সাউন্ড লেভেল -14 LUFS নরম্যালাইজ করা হয়েছে।",
  },
  {
    id: "file-ed1-2",
    title: "টিকটক প্রোডাক্ট অ্যাডভার্টাইজমেন্ট মাস্টার প্রজেক্ট",
    fileName: "Tiktok_Product_Ad_Cut_Final.prproj",
    fileType: "project",
    fileFormat: "Premiere Pro (.prproj)",
    fileSize: "32 MB",
    driveUrl: "https://drive.google.com/drive/folders/swapons_world_editor01",
    owner: "editor1",
    ownerName: "ভিডিও এডিটর ০১",
    status: "approved",
    uploadedAt: "২০ নভেম্বর, সন্ধ্যা ০৭:০০",
    notes: "সম্পূর্ণ প্রোজেক্ট ফাইল ও ট্রাঞ্জিশন প্রিসেটসহ ড্রাইভে ব্যাকআপ করা আছে।",
  },
  {
    id: "file-ed1-3",
    title: "বি-রোল সিঙ্ক ও ড্রাফট রাফ কাট",
    fileName: "B-Roll_Sync_Timeline_Draft.mp4",
    fileType: "video",
    fileFormat: "MP4 (1080p)",
    fileSize: "1.2 GB",
    driveUrl: "https://drive.google.com/drive/folders/swapons_world_editor01",
    owner: "editor1",
    ownerName: "ভিডিও এডিটর ০১",
    status: "needs_revision",
    uploadedAt: "১৯ নভেম্বর, বিকাল ০৪:৩০",
    notes: "হেড থেকে মিউজিকের বিটের সাথে কাট ফাস্ট করার নির্দেশনা দেওয়া হয়েছে।",
  },

  // Video Editor 02 Files
  {
    id: "file-ed2-1",
    title: "ইউটিউব মাস্টার ডকুমেন্টারি কাট ও কালার গ্রেড",
    fileName: "Youtube_Documentary_16x9_Master.mp4",
    fileType: "video",
    fileFormat: "MP4 (4K UHD)",
    fileSize: "3.4 GB",
    driveUrl: "https://drive.google.com/drive/folders/swapons_world_editor02",
    owner: "editor2",
    ownerName: "ভিডিও এডিটর ০২",
    status: "ready_for_review",
    uploadedAt: "২১ নভেম্বর, সকাল ১১:৪৫",
    notes: "সম্পূর্ণ ১৮ মিনিটের ইউটিউব মাস্টার কাট। থিম মিউজিক ও ভয়েসওভার ফাইনাল সিঙ্ক।",
  },
  {
    id: "file-ed2-2",
    title: "অডিও অ্যাম্বিয়েন্স ও ভয়েসওভার মাস্টার মিক্স",
    fileName: "Audio_Voiceover_Sync_Mix_Stereo.wav",
    fileType: "document",
    fileFormat: "WAV (24-bit 48kHz)",
    fileSize: "140 MB",
    driveUrl: "https://drive.google.com/drive/folders/swapons_world_editor02",
    owner: "editor2",
    ownerName: "ভিডিও এডিটর ০২",
    status: "approved",
    uploadedAt: "২০ নভেম্বর, দুপুর ০৩:২০",
    notes: "নয়েজ রিডাকশন ও ডায়ালগ ক্ল্যারিটি প্রসেস করা মাস্টার সাউন্ড ফাইল।",
  },

  // Graphic Designer Files
  {
    id: "file-ds-1",
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
    notes: "সবগুলো লেয়ার আনগ্রুপড ও ফন্ট আউটলাইন করা অবস্থায় ড্রাইভ লিংকে আপলোড করা।",
  },
  {
    id: "file-ds-2",
    title: "ইনস্টাগ্রাম স্টোরি ও হাইলাইট আইকন সেট",
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
  {
    id: "file-ds-3",
    title: "লুকবুক ও হাই-রেজোলিউশন প্রোডাক্ট ক্যাটালগ",
    fileName: "Catalog_Lookbook_HighRes_Retouched.pdf",
    fileType: "document",
    fileFormat: "PDF (Print Ready)",
    fileSize: "18 MB",
    driveUrl: "https://drive.google.com/drive/folders/swapons_world_design",
    owner: "designer",
    ownerName: "গ্রাফিক ডিজাইনার",
    status: "approved",
    uploadedAt: "১৯ নভেম্বর, সন্ধ্যা ০৬:০০",
    notes: "প্রিন্ট এবং ক্লায়েন্ট প্রিভিউয়ের জন্য অপ্টিমাইজড ভার্সন।",
  },

  // Videographer / Shooter Files
  {
    id: "file-vg-1",
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
    notes: "সনি এফএক্সথ্রি দিয়ে শুট করা ৬০টি ক্লিপ এসএসডি এবং গুগল ড্রাইভ স্টুডিওতে ক্লাউড ব্যাকআপ করা হয়েছে।",
  },
  {
    id: "file-vg-2",
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

export default function SwaponsWorldHub() {
  // Current logged in station (designer | editor1 | editor2 | videographer | head)
  const [currentStation, setCurrentStation] = useState<TeamMember | null>("editor1");
  const [adminPinInput, setAdminPinInput] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinError, setPinError] = useState("");

  const [tasks, setTasks] = useState<SwaponTask[]>(INITIAL_TASKS);
  const [files, setFiles] = useState<StudioFile[]>(INITIAL_FILES);
  const [activeTab, setActiveTab] = useState<"dashboard" | "files" | "shoots" | "all_team">("dashboard");
  const [dhakaTime, setDhakaTime] = useState<string>("");

  // Search & Filter for files
  const [fileSearch, setFileSearch] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState<string>("all");

  // Admin file member filter (only for head)
  const [adminMemberFilter, setAdminMemberFilter] = useState<TeamMember>("all");

  // Add Task modal
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAssignee, setNewAssignee] = useState<TeamMember>("editor1");
  const [newCategory, setNewCategory] = useState<"today" | "tomorrow" | "3days" | "7days" | "15days">("today");
  const [newDepartment, setNewDepartment] = useState<"design" | "video" | "shoot" | "general">("video");
  const [newDueDate, setNewDueDate] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newGearInfo, setNewGearInfo] = useState("");
  const [newIsUrgent, setNewIsUrgent] = useState(false);
  const [isCompletedImmediately, setIsCompletedImmediately] = useState(false);

  // Add File modal
  const [showAddFileModal, setShowAddFileModal] = useState(false);
  const [newFileTitle, setNewFileTitle] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [newFileType, setNewFileType] = useState<"video" | "image" | "project" | "document" | "folder">("video");
  const [newFileFormat, setNewFileFormat] = useState("MP4 (4K 60fps)");
  const [newFileSize, setNewFileSize] = useState("");
  const [newDriveUrl, setNewDriveUrl] = useState("");
  const [newFileNotes, setNewFileNotes] = useState("");

  const supabase = createClient();

  // Load Station & Data from LocalStorage
  useEffect(() => {
    const savedStation = localStorage.getItem("swapons_world_station") as TeamMember;
    if (savedStation) {
      setCurrentStation(savedStation);
    }

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

  // Change Station Handler
  const selectStation = (station: TeamMember) => {
    if (station === "head") {
      setShowPinModal(true);
      setPinError("");
      return;
    }
    setCurrentStation(station);
    localStorage.setItem("swapons_world_station", station);
  };

  const handleAdminPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPinInput === "1234" || adminPinInput === "CreativeFlow#2026" || adminPinInput.trim() === "admin") {
      setCurrentStation("head");
      localStorage.setItem("swapons_world_station", "head");
      setShowPinModal(false);
      setAdminPinInput("");
    } else {
      setPinError("পিন কোড সঠিক নয় (ডিফল্ট পিন: 1234)");
    }
  };

  const logoutStation = () => {
    setCurrentStation(null);
    localStorage.removeItem("swapons_world_station");
  };

  const updateTasks = (newTaskList: SwaponTask[]) => {
    setTasks(newTaskList);
    localStorage.setItem("swapons_world_tasks", JSON.stringify(newTaskList));
  };

  const updateFiles = (newFileList: StudioFile[]) => {
    setFiles(newFileList);
    localStorage.setItem("swapons_world_files", JSON.stringify(newFileList));
  };

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

  // Add Task
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

    const targetAssignee = currentStation === "head" ? newAssignee : (currentStation || "editor1");

    const newTask: SwaponTask = {
      id: getUUID(),
      title: newTitle.trim(),
      assignee: targetAssignee,
      assigneeName: assigneeNames[targetAssignee],
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
    setShowAddTaskModal(false);
  };

  // Add File / Drive Link
  const handleAddFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileTitle.trim() || !newFileName.trim()) return;

    const assigneeNames: Record<TeamMember, string> = {
      all: "সবাই",
      head: "ক্রিয়েটিভ ডিরেক্টর",
      designer: "গ্রাফিক ডিজাইনার",
      editor1: "ভিডিও এডিটর ০১",
      editor2: "ভিডিও এডিটর ০২",
      videographer: "সিনেমাটোগ্রাফার / শুটার",
    };

    const targetOwner = currentStation === "head" ? newAssignee : (currentStation || "editor1");

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

  // Toggle File Status (e.g. approve or mark needs revision)
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

  // Delete file
  const deleteFile = (fileId: string) => {
    const updated = files.filter((f) => f.id !== fileId);
    updateFiles(updated);
  };

  // Delete task
  const deleteTask = async (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    updateTasks(updated);
    try {
      await supabase.from("tasks").delete().eq("id", taskId);
    } catch (e) {}
  };

  // STRICT ROLE ISOLATION:
  // If currentStation is NOT "head", they ONLY see their own tasks and files!
  const isHead = currentStation === "head";

  const userTasks = tasks.filter((t) => {
    if (isHead) {
      if (adminMemberFilter === "all") return true;
      return t.assignee === adminMemberFilter;
    }
    return t.assignee === currentStation;
  });

  const userFiles = files.filter((f) => {
    if (isHead) {
      if (adminMemberFilter === "all") return true;
      return f.owner === adminMemberFilter;
    }
    return f.owner === currentStation;
  });

  // Filtered files by search and format
  const displayFiles = userFiles.filter((f) => {
    const matchesSearch =
      f.title.toLowerCase().includes(fileSearch.toLowerCase()) ||
      f.fileName.toLowerCase().includes(fileSearch.toLowerCase()) ||
      (f.notes && f.notes.toLowerCase().includes(fileSearch.toLowerCase()));

    const matchesType = fileTypeFilter === "all" || f.fileType === fileTypeFilter;
    return matchesSearch && matchesType;
  });

  const todayTasks = userTasks.filter((t) => t.deadlineCategory === "today");
  const upcomingTasks = userTasks.filter((t) => t.deadlineCategory !== "today");
  const shootTasks = userTasks.filter((t) => t.department === "shoot");

  const totalTasks = userTasks.length;
  const completedTasks = userTasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getStationLabel = (role: TeamMember) => {
    switch (role) {
      case "editor1":
        return "ভিডিও এডিটর ০১";
      case "editor2":
        return "ভিডিও এডিটর ০২";
      case "designer":
        return "গ্রাফিক ডিজাইনার";
      case "videographer":
        return "সিনেমাটোগ্রাফার / শুটার";
      case "head":
        return "ক্রিয়েটিভ ডিরেক্টর / হেড (অ্যাডমিন)";
      default:
        return "ক্রিয়েটিভ ওয়ার্কস্টেশন";
    }
  };

  // IF NO STATION SELECTED: Show Workstation Gateway
  if (!currentStation) {
    return (
      <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0c0d] text-[#18181b] dark:text-[#f4f4f5] flex items-center justify-center p-4 selection:bg-zinc-900 selection:text-white">
        <div className="w-full max-w-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-xl bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center font-studio-mono font-bold text-base mx-auto">
              SW
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
              স্বপনস ওয়ার্ল্ড স্টুডিও
            </h1>
            <p className="text-xs text-stone-500 dark:text-zinc-400">
              আপনি কোন স্টেশনে কাজ করছেন তা নির্বাচন করুন। প্রত্যেকে শুধুমাত্র নিজের ফাইল ও টাস্ক দেখতে পাবেন।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: "editor1" as TeamMember,
                title: "ভিডিও এডিটর ০১",
                desc: "রিলস, শর্টস ও কমার্শিয়াল ভিডিও",
                icon: Film,
                badge: "EDITOR 01",
              },
              {
                id: "editor2" as TeamMember,
                title: "ভিডিও এডিটর ০২",
                desc: "ইউটিউব ফুল ভিডিও ও সাউন্ড ডিজাইন",
                icon: Video,
                badge: "EDITOR 02",
              },
              {
                id: "designer" as TeamMember,
                title: "গ্রাফিক ডিজাইনার",
                desc: "সোশ্যাল মিডিয়া ব্যানার ও ক্যাটালগ",
                icon: Palette,
                badge: "DESIGN",
              },
              {
                id: "videographer" as TeamMember,
                title: "সিনেমাটোগ্রাফার / শুটার",
                desc: "আউটডোর ও স্টুডিও শুট, র ফুটেজ",
                icon: Camera,
                badge: "CINEMA",
              },
            ].map((station) => {
              const Icon = station.icon;
              return (
                <button
                  key={station.id}
                  onClick={() => selectStation(station.id)}
                  className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 hover:border-zinc-950 dark:hover:border-zinc-400 text-left transition-all group cursor-pointer shadow-2xs hover:shadow-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-studio-mono text-[10px] text-stone-400 px-1.5 py-0.5 rounded bg-stone-100 dark:bg-zinc-800">
                      {station.badge}
                    </span>
                    <Icon className="h-4 w-4 text-stone-400 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                    {station.title}
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    {station.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Admin Station Card */}
          <button
            onClick={() => selectStation("head")}
            className="w-full p-4 rounded-xl bg-stone-100/70 dark:bg-zinc-900/60 border border-stone-200 dark:border-zinc-800 hover:border-zinc-900 text-left transition-all flex items-center justify-between cursor-pointer"
          >
            <div>
              <span className="font-studio-mono text-[10px] text-stone-500 uppercase">MASTER ADMIN ACCESS</span>
              <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                ক্রিয়েটিভ ডিরেক্টর / টিম হেড
              </h3>
              <p className="text-[11px] text-stone-500">
                সব বিভাগের ফাইল, ডেলিভারেবল এবং পুরো টিমের কাজের সার্বিক ওভারভিউ
              </p>
            </div>
            <Lock className="h-4 w-4 text-stone-400 shrink-0" />
          </button>
        </div>

        {/* PIN Modal for Head */}
        {showPinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-xl p-5 border border-stone-200 dark:border-zinc-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white">অ্যাডমিন সিকিউরিটি পিন</h3>
                <button onClick={() => setShowPinModal(false)} className="text-stone-400 hover:text-zinc-900">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleAdminPinSubmit} className="space-y-3">
                <p className="text-xs text-stone-500">
                  টিম হেডের জন্য পিন কোড প্রবেশ করুন (ডিফল্ট: 1234)
                </p>
                <input
                  type="password"
                  autoFocus
                  required
                  value={adminPinInput}
                  onChange={(e) => setAdminPinInput(e.target.value)}
                  placeholder="PIN কোড লিখুন..."
                  className="w-full px-3 py-2 text-center text-lg font-mono rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 focus:outline-none focus:border-zinc-950"
                />
                {pinError && <p className="text-xs text-rose-600 font-medium">{pinError}</p>}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowPinModal(false)}
                    className="px-3 py-1.5 rounded text-xs text-stone-600"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold"
                  >
                    আনলক করুন
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0c0d] text-[#18181b] dark:text-[#f4f4f5] antialiased selection:bg-zinc-900 selection:text-white pb-24">
      {/* Studio Header & Workstation Bar */}
      <header className="sticky top-0 z-40 bg-[#fafaf9]/90 dark:bg-[#0c0c0d]/90 backdrop-blur-md border-b border-stone-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Brand & Active Station */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center font-studio-mono font-bold text-xs shrink-0">
              SW
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
                  স্বপনস ওয়ার্ল্ড
                </span>
                <span className="font-studio-mono text-[10px] px-2 py-0.5 rounded bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-medium">
                  {getStationLabel(currentStation)}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-zinc-400">
                {isHead
                  ? "মাস্টার কন্ট্রোল প্যানেল • সকল বিভাগের ফাইল ও কাজের ভিউ"
                  : "ব্যক্তিগত স্টুডিও স্টেশন • শুধুমাত্র আপনার ফাইল ও টাস্ক দৃশ্যমান"}
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Minimalist Clock */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-100 dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 text-[11px] font-studio-mono text-stone-600 dark:text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>DHAKA {dhakaTime || "14:40:00"}</span>
            </div>

            {/* Switch Station / Logout button */}
            <button
              onClick={logoutStation}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium border border-stone-200 dark:border-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-600 dark:text-zinc-300 transition-colors cursor-pointer"
              title="স্টেশন পরিবর্তন করুন"
            >
              <LogOut className="h-3 w-3" />
              <span className="hidden sm:inline">স্টেশন পরিবর্তন</span>
            </button>

            {/* Add File / Deliverable Button */}
            <button
              onClick={() => setShowAddFileModal(true)}
              className="px-3 py-1.5 rounded bg-stone-200 hover:bg-stone-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ ফাইল যোগ করুন</span>
            </button>

            {/* Add Task Button */}
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="px-3.5 py-1.5 rounded bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ নতুন কাজ</span>
            </button>
          </div>
        </div>

        {/* If Admin/Head is logged in: Member switcher */}
        {isHead && (
          <div className="border-t border-stone-200/70 dark:border-zinc-800/80 bg-stone-50/60 dark:bg-zinc-950/40">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
              <span className="text-[11px] font-studio-mono uppercase text-stone-400 mr-2 shrink-0">
                টিম ভিউয়ার:
              </span>
              {[
                { id: "all", label: "সবার ফাইল ও কাজ" },
                { id: "editor1", label: "ভিডিও এডিটর ০১" },
                { id: "editor2", label: "ভিডিও এডিটর ০২" },
                { id: "designer", label: "গ্রাফিক ডিজাইনার" },
                { id: "videographer", label: "সিনেমাটোগ্রাফার" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setAdminMemberFilter(m.id as TeamMember)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    adminMemberFilter === m.id
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
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

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-7 space-y-8">
        {/* ========================================================= */}
        {/* SECTION 1: উপরের অংশ — ড্যাশবোর্ড (TOP DASHBOARD)       */}
        {/* ========================================================= */}
        <section className="space-y-4">
          {/* Dashboard Summary Card */}
          <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-studio-mono uppercase tracking-wider text-stone-500">
                  <span>WORKSTATION DASHBOARD</span>
                  <span>•</span>
                  <span>{getStationLabel(isHead && adminMemberFilter !== "all" ? adminMemberFilter : currentStation)}</span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-bold font-studio-mono text-zinc-950 dark:text-white">
                    {completedTasks < 10 ? "০" + completedTasks : completedTasks}
                  </span>
                  <span className="text-xl sm:text-2xl text-stone-400 font-light font-studio-mono">
                    / {totalTasks < 10 ? "০" + totalTasks : totalTasks}
                  </span>
                  <span className="text-sm font-medium text-stone-600 dark:text-zinc-400 ml-1">
                    কাজের অগ্রগতি ({taskProgress}%)
                  </span>
                </div>
              </div>

              {/* Quick KPI stats */}
              <div className="flex items-center gap-5 sm:gap-7 text-xs border-t md:border-t-0 md:border-l border-stone-200 dark:border-zinc-800 pt-3 md:pt-0 md:pl-7">
                <div>
                  <span className="text-stone-400 block text-[11px] font-studio-mono uppercase">
                    আজকের অ্যাসাইনমেন্ট
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
                    সংযুক্ত ফাইল
                  </span>
                  <span className="text-base font-semibold text-zinc-900 dark:text-white font-studio-mono mt-0.5 block">
                    {userFiles.length} টি ফাইল
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

          {/* Today's Tasks Checklist in Dashboard */}
          <div className="rounded-xl bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 p-4.5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-zinc-800">
              <div>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                  আজকের জন্য নির্ধারিত কাজ ও ডেডলাইন
                </h3>
                <p className="text-[11px] text-stone-500">
                  কাজ সম্পন্ন হলে বামপাশের বক্সে টিক দিন।
                </p>
              </div>
              <span className="text-[11px] font-studio-mono text-stone-400">
                {todayTasks.filter((t) => t.completed).length} OF {todayTasks.length} COMPLETED
              </span>
            </div>

            {todayTasks.length === 0 ? (
              <p className="text-xs text-stone-400 py-3 text-center">
                আজকের জন্য কোনো পেন্ডিং কাজ নেই।
              </p>
            ) : (
              <div className="divide-y divide-stone-100 dark:divide-zinc-800/80">
                {todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="py-2.5 flex items-start justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`mt-0.5 h-4.5 w-4.5 rounded border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                          task.completed
                            ? "bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-white dark:text-zinc-950"
                            : "border-stone-300 dark:border-zinc-700 hover:border-zinc-950 bg-transparent"
                        }`}
                      >
                        {task.completed && <Check className="h-3 w-3 stroke-[3]" />}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            onClick={() => toggleTask(task.id)}
                            className={`text-xs sm:text-sm font-medium cursor-pointer ${
                              task.completed
                                ? "line-through text-stone-400 dark:text-zinc-500"
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
                        </div>
                        {task.notes && (
                          <p className="text-[11px] text-stone-500 dark:text-zinc-400 mt-0.5">
                            {task.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-[11px] text-stone-400 font-studio-mono">
                      <span>{task.dueDate}</span>
                      {isHead && (
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-rose-600 p-1"
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
        {/* SECTION 2: নিচের অংশ — সব ফাইলসমূহ (FILES & DELIVERABLES) */}
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
                  : `শুধুমাত্র ${getStationLabel(currentStation)}-এর কাজের ফাইল ও রেন্ডারসমূহ।`}
              </p>
            </div>

            {/* Search & Type Filter */}
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
                <option value="all">সব ধরনের ফাইল</option>
                <option value="video">ভিডিও রেন্ডার (.mp4)</option>
                <option value="project">প্রজেক্ট ফাইল (.prproj/.ai)</option>
                <option value="image">ইমেজ ও আর্ট (.psd)</option>
                <option value="folder">র ফুটেজ ড্রাইভ</option>
              </select>
            </div>
          </div>

          {/* Files List / Grid */}
          {displayFiles.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 space-y-2">
              <FolderArchive className="h-8 w-8 text-stone-300 mx-auto" />
              <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                এই স্টেশনে কোনো ফাইল পাওয়া যায়নি
              </h4>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                আপনার কাজের ফাইনাল রেন্ডার, ড্রাইভ লিংক বা প্রজেক্ট ফাইল যুক্ত করতে উপরের &quot;+ ফাইল যোগ করুন&quot; বাটনে চাপ দিন।
              </p>
              <button
                onClick={() => setShowAddFileModal(true)}
                className="mt-2 px-3.5 py-1.5 rounded bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-medium cursor-pointer"
              >
                + ফাইল সংযুক্ত করুন
              </button>
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
                          onClick={() => toggleFileStatus(file.id)}
                          className={`text-[10px] font-studio-mono uppercase px-2 py-0.5 rounded cursor-pointer transition-colors border ${
                            file.status === "approved"
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                              : file.status === "needs_revision"
                              ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                              : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                          }`}
                          title="স্ট্যাটাস পরিবর্তন করতে ক্লিক করুন"
                        >
                          {file.status === "approved"
                            ? "অ্যাপ্রুভড (Approved)"
                            : file.status === "needs_revision"
                            ? "সংশোধন (Revision)"
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

      {/* MODAL 1: ADD FILE / DRIVE LINK */}
      {showAddFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-stone-200 dark:border-zinc-800 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                  নতুন প্রোডাকশন ফাইল / ড্রাইভ লিংক যুক্ত করুন
                </h3>
                <p className="text-xs text-stone-400">
                  আপনার রেন্ডার, প্রজেক্ট ফাইল বা ক্লাউড ড্রাইভ লিংক যুক্ত করুন।
                </p>
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
                  কাজের শিরোনাম / বিবরণ *
                </label>
                <input
                  type="text"
                  required
                  value={newFileTitle}
                  onChange={(e) => setNewFileTitle(e.target.value)}
                  placeholder="যেমন: সামার সেলস ভার্টিক্যাল রিলস V1"
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-950"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                    ফাইল নেম *
                  </label>
                  <input
                    type="text"
                    required
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="যেমন: Summer_Reels_4K_Final.mp4"
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                    ফাইলের ধরন
                  </label>
                  <select
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  >
                    <option value="video">ভিডিও রেন্ডার (.mp4 / .mov)</option>
                    <option value="project">প্রজেক্ট সোর্স ফাইল (.prproj / .aep / .ai)</option>
                    <option value="image">ইমেজ ও ফটোশপ আর্ট (.psd / .png)</option>
                    <option value="folder">র ফুটেজ ড্রাইভ ফোল্ডার</option>
                    <option value="document">কল শিট বা অডিও (.pdf / .wav)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                    ফরম্যাট / রেজোলিউশন
                  </label>
                  <input
                    type="text"
                    value={newFileFormat}
                    onChange={(e) => setNewFileFormat(e.target.value)}
                    placeholder="যেমন: MP4 (4K 60fps) বা PSD"
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                    ফাইলের সাইজ
                  </label>
                  <input
                    type="text"
                    value={newFileSize}
                    onChange={(e) => setNewFileSize(e.target.value)}
                    placeholder="যেমন: 450 MB বা 1.2 GB"
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                  গুগল ড্রাইভ / ক্লাউড লিংক *
                </label>
                <input
                  type="url"
                  required
                  value={newDriveUrl}
                  onChange={(e) => setNewDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                  নোট বা ডেলিভারি ব্রিফ
                </label>
                <textarea
                  rows={2}
                  value={newFileNotes}
                  onChange={(e) => setNewFileNotes(e.target.value)}
                  placeholder="যেমন: কালার গ্রেডিং ফাইনাল, সাউন্ড মিক্স করা হয়েছে..."
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFileModal(false)}
                  className="px-3 py-1.5 rounded text-stone-600 hover:bg-stone-100 dark:text-zinc-400 font-medium"
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

      {/* MODAL 2: ADD TASK */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-stone-200 dark:border-zinc-800 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                  নতুন কাজের অ্যাসাইনমেন্ট
                </h3>
                <p className="text-xs text-stone-400">টিম মেম্বারের জন্য কাজ নির্ধারণ করুন</p>
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
                  শিরোনাম / কাজের বিবরণ *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="যেমন: নতুন ঈদ ক্যাম্পেইনের ইনস্টাগ্রাম রিলস"
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-950"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {isHead && (
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
                      <option value="editor1">ভিডিও এডিটর ০১</option>
                      <option value="editor2">ভিডিও এডিটর ০২</option>
                      <option value="designer">গ্রাফিক ডিজাইনার</option>
                      <option value="videographer">সিনেমাটোগ্রাফার / শুটার</option>
                      <option value="head">ক্রিয়েটিভ ডিরেক্টর</option>
                    </select>
                  </div>
                )}

                <div className={!isHead ? "col-span-2" : ""}>
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

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">নির্দেশনা ও ব্রিফ</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="ভিডিও সাইজ, ডিজাইনের কালার বা ড্রাইভ লিংক..."
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
                  <span>জরুরি কাজ (Urgent)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={isCompletedImmediately}
                    onChange={(e) => setIsCompletedImmediately(e.target.checked)}
                    className="h-3.5 w-3.5 rounded text-zinc-900"
                  />
                  <span>কাজটি ইতোমধ্যে শেষ হয়েছে?</span>
                </label>
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-3 py-1.5 rounded text-stone-600 hover:bg-stone-100 dark:text-zinc-400 font-medium"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold"
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
