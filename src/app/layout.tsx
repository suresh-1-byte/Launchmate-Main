import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "LaunchMate — Your Career Launch Platform",
  description: "LaunchMate is the all-in-one career platform for students and freshers. Learn skills, build projects, find jobs, network with peers, and get AI-powered career mentoring.",
  keywords: ["career", "jobs", "learning", "networking", "AI mentor", "students", "freshers"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
