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
    <html lang="bn" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full flex flex-col antialiased bg-[#fafaf9] text-[#18181b] dark:bg-[#0c0c0d] dark:text-[#f4f4f5] selection:bg-zinc-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
