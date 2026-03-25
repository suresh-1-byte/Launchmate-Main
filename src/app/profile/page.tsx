"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";

interface ProfileData {
    id: string;
    name: string;
    email: string;
    role: string;
    skills: string[];
    bio: string | null;
    avatar: string | null;
    createdAt: string;
    projects: Array<{
        id: string;
        title: string;
        description: string;
        githubLink: string | null;
        score: number | null;
    }>;
    enrollments: Array<{
        id: string;
        progress: number;
        course: { title: string; level: string };
    }>;
    _count: {
        sentConnections: number;
        receivedConnections: number;
        projects: number;
    };
}

export default function ProfilePage() {
    const { refreshUser } = useAuth();
    const [data, setData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [skills, setSkills] = useState("");
    const [saving, setSaving] = useState(false);

    const loadProfile = async () => {
        const res = await fetch("/api/profile");
        const json = await res.json();
        if (json.success) {
            setData(json.data);
            setName(json.data.name);
            setBio(json.data.bio || "");
            setSkills(json.data.skills.join(", "));
        }
        setLoading(false);
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    bio,
                    skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
                }),
            });
            const json = await res.json();
            if (json.success) {
                setEditing(false);
                setData({ ...data!, ...json.data });
                await refreshUser();
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <ProtectedRoute>
            <Navbar />
            <div className="page-container">
                <div className="page-content max-w-6xl mx-auto px-4">
                    {loading ? (
                        <div className="flex justify-center py-24">
                            <div className="w-10 h-10 border-4 border-[#057642]/30 border-t-[#057642] rounded-full animate-spin" />
                        </div>
                    ) : data ? (
                        <div className="space-y-8">
                            {/* Profile Header Card */}
                            <div className="card p-0 overflow-hidden shadow-xl border border-[#e0e0e0] rounded-2xl bg-white">
                                <div className="h-48 md:h-64 bg-gradient-to-r from-[#057642] to-[#046237] relative group">
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                    <div className="absolute -bottom-16 left-8 md:left-12">
                                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-[6px] border-white bg-[#057642] flex items-center justify-center text-white text-5xl md:text-6xl font-black shadow-2xl transform transition-transform hover:scale-[1.02]">
                                            {data.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-20 md:pt-24 px-8 md:px-12 pb-10">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                        <div className="flex-1">
                                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{data.name}</h1>
                                            <p className="text-lg text-gray-500 font-medium mt-1 leading-relaxed max-w-2xl">{data.bio || "Student and Aspirant at LaunchMate"}</p>
                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm font-bold text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-[#057642]" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8L12 13L20 8V18ZM12 11L4 6H20L12 11Z" />
                                                    </svg>
                                                    {data.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-[#057642]">
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                                                    </svg>
                                                    {data._count.sentConnections + data._count.receivedConnections} connections
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setEditing(true)}
                                            className="px-8 py-2.5 bg-white border-2 border-[#057642] text-[#057642] font-black rounded-full hover:bg-green-50 transition-all text-sm shadow-sm active:scale-95"
                                        >
                                            EDIT PROFILE
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Left Column */}
                                <div className="lg:col-span-8 space-y-8">
                                    {/* About Section */}
                                    <div className="card p-8 shadow-lg border border-[#e0e0e0] rounded-2xl bg-white">
                                        <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-wider flex items-center gap-3">
                                            <div className="p-1.5 bg-[#057642]/10 rounded text-[#057642]">
                                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
                                            </div>
                                            Professional Summary
                                        </h2>
                                        <p className="text-base text-gray-600 leading-relaxed whitespace-pre-line font-medium italic">
                                            {data.bio ? `"${data.bio}"` : "No summary provided. Describe your professional identity to stand out."}
                                        </p>
                                    </div>

                                    {/* Projects Section */}
                                    <div className="card p-8 shadow-lg border border-[#e0e0e0] rounded-2xl bg-white">
                                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#f0f0f0]">
                                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-wider flex items-center gap-3">
                                                <div className="p-1.5 bg-[#057642]/10 rounded text-[#057642]">
                                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6V18H4V6H20ZM6 10H18V12H6V10ZM6 14H14V16H6V14Z" /></svg>
                                                </div>
                                                Featured Work
                                            </h2>
                                            <div className="text-[10px] font-black text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">{data.projects.length} Entries</div>
                                        </div>
                                        <div className="space-y-10">
                                            {data.projects.length > 0 ? (
                                                data.projects.map((project) => (
                                                    <div key={project.id} className="group relative pl-6 border-l-2 border-[#057642]/20 hover:border-[#057642] transition-colors">
                                                        <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-4">
                                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#057642] transition-colors">{project.title}</h3>
                                                            {project.score && (
                                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-lg border border-green-100 ring-1 ring-green-600/10">
                                                                    <span className="text-green-700 text-sm font-extrabold">{project.score}</span>
                                                                    <span className="text-green-600/30 text-[9px] font-bold uppercase tracking-wider">AI Score</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-500 mb-6 leading-relaxed max-w-3xl">{project.description}</p>
                                                        {project.githubLink && (
                                                            <a href={project.githubLink} target="_blank" className="inline-flex items-center gap-2 text-xs font-bold text-[#057642] hover:underline decoration-2 underline-offset-4">
                                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                                                </svg>
                                                                View Repository
                                                            </a>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-10 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No projects showcased yet</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="lg:col-span-4 space-y-8">
                                    {/* Skills Card */}
                                    <div className="card p-8 shadow-lg border border-[#e0e0e0] rounded-2xl bg-white">
                                        <h2 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-wider flex items-center gap-3">
                                            <div className="p-1.5 bg-[#057642]/10 rounded text-[#057642]">
                                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 9L12 15L23 9L12 2ZM12 17.5L3.4 12.6L1 14L12 20L23 14L20.6 12.6L12 17.5Z" /></svg>
                                            </div>
                                            Skillset
                                        </h2>
                                        <div className="flex flex-wrap gap-2.5">
                                            {data.skills.map((skill) => (
                                                <span key={skill} className="px-4 py-1.5 bg-[#057642]/5 border border-[#057642]/20 text-[#057642] text-xs font-black rounded-lg transition-all hover:bg-[#057642] hover:text-white cursor-default shadow-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                            {data.skills.length === 0 && <p className="text-xs text-gray-400 font-medium italic">Identify and list your core skills.</p>}
                                        </div>
                                    </div>

                                    {/* Education/Courses Card */}
                                    <div className="card p-8 shadow-lg border border-[#e0e0e0] rounded-2xl bg-white">
                                        <h2 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-wider flex items-center gap-3">
                                            <div className="p-1.5 bg-[#057642]/10 rounded text-[#057642]">
                                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3ZM12 17L3 12.09V14.09L12 19L21 14.09V12.09L12 17Z" /></svg>
                                            </div>
                                            Certifications
                                        </h2>
                                        <div className="space-y-6">
                                            {data.enrollments.map((en) => (
                                                <div key={en.id} className="group">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-xs font-bold text-gray-700 truncate group-hover:text-[#057642] transition-colors">{en.course.title}</span>
                                                        <span className="text-[10px] font-black text-[#057642] bg-[#057642]/5 px-2 py-0.5 rounded">{en.progress}%</span>
                                                    </div>
                                                    <div className="progress-bar h-1.5">
                                                        <div className="progress-fill" style={{ width: `${en.progress}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                            {data.enrollments.length === 0 && (
                                                <div className="text-center py-6 bg-gray-50 rounded-xl border border-[#f0f0f0]">
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">No active learning paths</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="card text-center py-24 bg-gray-50 border-dashed border-2 rounded-2xl">
                            <p className="text-gray-400 font-bold uppercase tracking-widest">Identification Failed Profile data unavailable.</p>
                        </div>
                    )}

                    {/* Edit Modal */}
                    {editing && (
                        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                            <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-slide-up border border-white/20">
                                <div className="px-8 py-6 border-b border-[#f0f0f0] flex justify-between items-center bg-[#057642]/5">
                                    <div>
                                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest">Modify Persona</h2>
                                        <p className="text-xs text-gray-500 font-bold mt-1">Update your professional identity</p>
                                    </div>
                                    <button onClick={() => setEditing(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors text-gray-400 hover:text-gray-900">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                <form onSubmit={handleSave} className="p-8 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Legal Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full text-sm font-bold py-3 px-5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-4 focus:ring-[#057642]/10 focus:border-[#057642] focus:outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Professional Headline</label>
                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            className="w-full text-sm font-medium py-3 px-5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-4 focus:ring-[#057642]/10 focus:border-[#057642] focus:outline-none transition-all resize-none"
                                            rows={4}
                                            placeholder="Introduce yourself to the professional world..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Core Competencies <span className="text-[10px] text-gray-300 font-medium">(comma separated)</span></label>
                                        <input
                                            type="text"
                                            value={skills}
                                            onChange={(e) => setSkills(e.target.value)}
                                            className="w-full text-sm font-bold py-3 px-5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-4 focus:ring-[#057642]/10 focus:border-[#057642] focus:outline-none transition-all"
                                            placeholder="React, Next.js, Architecture..."
                                        />
                                    </div>
                                    <div className="pt-6 flex justify-end gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setEditing(false)}
                                            className="px-8 py-3 bg-gray-100 text-gray-600 font-black rounded-xl hover:bg-gray-200 transition-all text-xs"
                                        >
                                            REJECT CHANGES
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="px-10 py-3 bg-[#057642] text-white font-black rounded-xl hover:bg-[#046237] shadow-lg hover:shadow-xl transition-all text-xs disabled:opacity-50 active:scale-95"
                                        >
                                            {saving ? "PROPAGATING..." : "COMMIT UPDATE"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
