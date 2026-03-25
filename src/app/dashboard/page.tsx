"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

interface DashboardData {
    user: { id: string; name: string; email: string; skills: string[]; bio: string; role: string };
    enrollments: Array<{
        id: string;
        progress: number;
        course: { id: string; title: string; level: string; duration: string };
    }>;
    projects: Array<{ id: string; title: string; description: string; score: number | null }>;
    connections: Array<{
        sender: { id: string; name: string; skills: string[] };
        receiver: { id: string; name: string; skills: string[] };
    }>;
    recentJobs: Array<{ id: string; title: string; company: string; location: string; salary: string | null }>;
    stats: {
        coursesInProgress: number;
        completedCourses: number;
        totalProjects: number;
        totalConnections: number;
        pendingRequests: number;
    };
}

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/dashboard")
            .then((res) => res.json())
            .then((res) => {
                if (res.success) setData(res.data);
            })
            .finally(() => setLoading(false));
    }, []);

    const quickActions = [
        {
            href: "/mentor",
            label: "AI Mentor",
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15 2H9C7.9 2 7 2.9 7 4V6H17V4C17 2.9 16.1 2 15 2ZM20 8H4C2.9 8 2 8.9 2 10V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V10C22 8.9 21.1 8 20 8ZM19 18H5V10H19V18ZM8 12H10V14H8V12ZM14 12H16V14H14V12ZM8 15H16V16H8V15Z" />
                </svg>
            )
        },
        {
            href: "/learning",
            label: "My Learning",
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 13H5V21H3V13ZM19 13H21V21H19V13ZM7 10H17V21H15V12H9V21H7V10ZM12 2L2 9V11H22V9L12 2Z" />
                </svg>
            )
        },
        {
            href: "/projects",
            label: "Projects",
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6V18H4V6H20ZM6 10H18V12H6V10ZM6 14H14V16H6V14Z" />
                </svg>
            )
        },
    ];

    return (
        <ProtectedRoute>
            <Navbar />
            <div className="page-container">
                <div className="page-content">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-10 h-10 border-4 border-[#057642]/30 border-t-[#057642] rounded-full animate-spin" />
                        </div>
                    ) : data ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Left Sidebar: Profile Summary */}
                            <div className="lg:col-span-3 space-y-4">
                                <div className="card text-center relative overflow-hidden pt-0 px-0">
                                    <div className="h-14 bg-[#057642]/10" />
                                    <div className="px-6 pb-6">
                                        <div className="-mt-8 mb-4 inline-flex w-16 h-16 rounded-full border-4 border-white bg-[#057642] items-center justify-center text-white text-2xl font-bold shadow-sm">
                                            {data.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <h2 className="text-lg font-bold text-gray-900 leading-tight mb-1">{data.user.name}</h2>
                                        <p className="text-sm text-gray-500 line-clamp-2">{data.user.bio || "Career seeker"}</p>
                                    </div>
                                    <div className="border-t border-[#e0e0e0] p-4 text-left">
                                        <div className="flex justify-between text-xs font-semibold">
                                            <span className="text-gray-500">Connections</span>
                                            <span className="text-[#057642]">{data.stats.totalConnections}</span>
                                        </div>
                                        <div className="mt-1 text-xs text-gray-900 font-bold hover:underline cursor-pointer transition-all">Grow your network</div>
                                    </div>
                                </div>

                                <div className="card">
                                    <h3 className="text-sm font-bold mb-4">Quick Actions</h3>
                                    <div className="space-y-3">
                                        {quickActions.map((item, i) => (
                                            <Link key={i} href={item.href} className="flex items-center gap-3 text-sm text-gray-600 font-semibold hover:text-[#057642] group transition-all">
                                                <div className="text-gray-400 group-hover:text-[#057642] transition-colors">
                                                    {item.icon}
                                                </div>
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Main Content: Progress & Feed */}
                            <div className="lg:col-span-6 space-y-6">
                                {/* Welcome */}
                                <div className="card bg-white border border-[#e0e0e0]">
                                    <h2 className="section-title">
                                        Welcome, <span className="text-[#057642]">{data.user.name.split(" ")[0]}</span>!
                                    </h2>
                                    <p className="text-sm text-gray-500">Stay updated on your professional career growth.</p>
                                </div>

                                {/* Active Courses Progress */}
                                {data.enrollments.length > 0 && (
                                    <div className="card">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-bold text-gray-900">Education Progress</h3>
                                            <Link href="/learning" className="text-sm text-[#057642] font-semibold hover:underline">See all</Link>
                                        </div>
                                        <div className="space-y-4">
                                            {data.enrollments.map((en) => (
                                                <div key={en.id} className="group">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-sm font-semibold group-hover:text-[#057642] transition-colors line-clamp-1">{en.course.title}</span>
                                                        <span className="text-xs font-bold text-gray-500">{en.progress}%</span>
                                                    </div>
                                                    <div className="progress-bar">
                                                        <div className="progress-fill" style={{ width: `${en.progress}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Projects */}
                                <div className="card">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-gray-900">Featured Projects</h3>
                                        <Link href="/projects" className="text-sm text-[#057642] font-semibold hover:underline">Add new</Link>
                                    </div>
                                    <div className="space-y-4">
                                        {data.projects.map((p) => (
                                            <div key={p.id} className="p-3 bg-gray-50 rounded-lg border border-[#e0e0e0] hover:border-[#057642]/30 transition-all">
                                                <h4 className="text-sm font-bold text-gray-900">{p.title}</h4>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                                                {p.score && (
                                                    <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded bg-green-50 text-[#057642] text-[10px] font-bold border border-[#057642]/20">
                                                        AI Score: {p.score}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Sidebar: Jobs & Mentors */}
                            <div className="lg:col-span-3 space-y-4">
                                <div className="card">
                                    <h3 className="text-sm font-bold mb-4">Top Job Picks</h3>
                                    <div className="space-y-4">
                                        {data.recentJobs.slice(0, 3).map((job) => (
                                            <div key={job.id} className="group">
                                                <h4 className="text-sm font-bold text-gray-900 group-hover:underline cursor-pointer">{job.title}</h4>
                                                <p className="text-xs text-gray-500 mt-0.5">{job.company}</p>
                                                <p className="text-[10px] text-gray-400">{job.location}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <Link href="/jobs" className="mt-4 block w-full text-center text-sm font-semibold text-gray-600 border border-gray-600 rounded-full py-1.5 hover:bg-gray-50 transition-all">
                                        View all jobs
                                    </Link>
                                </div>

                                <div className="card overflow-hidden">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-1.5 bg-[#057642]/10 rounded text-[#057642]">
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M15 2H9C7.9 2 7 2.9 7 4V6H17V4C17 2.9 16.1 2 15 2ZM20 8H4C2.9 8 2 8.9 2 10V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V10C22 8.9 21.1 8 20 8ZM19 18H5V10H19V18ZM8 12H10V14H8V12ZM14 12H16V14H14V12ZM8 15H16V16H8V15Z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-sm font-bold">AI Career Mentor</h3>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-4 px-1">Get personalized advice for your current skill gap.</p>
                                    <Link href="/mentor" className="btn-primary w-full block text-center text-xs py-2.5">
                                        Start Chatting
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="card text-center py-20">
                            <p className="text-gray-500">Failed to load dashboard data.</p>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
