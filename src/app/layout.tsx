import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "স্বপনস ওয়ার্ল্ড | ক্রিয়েটিভ টিম ম্যানেজমেন্ট হাব (Swapon's World)",
  description: "স্বপনস ওয়ার্ল্ড ক্রিয়েটিভ প্রোডাকশন টিম, ভিডিও এডিটর, ডিজাইনার ও ভিডিওগ্রাফার ম্যানেজমেন্ট হাব।",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col antialiased text-slate-900 bg-slate-50 dark:bg-slate-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
