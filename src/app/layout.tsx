import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CreativeFlow — Creative Team Management & Workflow Automation",
  description: "Enterprise SaaS for creative production teams, video editors, and photographers.",
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
