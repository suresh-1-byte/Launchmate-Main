"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProjectCard from "@/components/projects/ProjectCard";
import Link from "next/link";

interface Project {
    id: string;
    title: string;
    description: string;
    githubLink: string | null;
    stars: number;
    forks: number;
    languages: string | null;
    lastUpdated: string | null;
    owner: string | null;
    repoName: string | null;
    repoImage: string | null;
    readme: string | null;
    difficulty: string | null;
    portfolioScore: number | null;
    aiExplanation: string | null;
    resumeBullets: string | null;
    interviewQuestions: string | null;
    suggestedImprovements: string | null;
    missingFeatures: string | null;
    createdAt: string;
    user: { name: string; email: string };
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [githubLink, setGithubLink] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [analyzingId, setAnalyzingId] = useState<string | null>(null);
    const [formError, setFormError] = useState("");

    const loadProjects = async () => {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data.success) setProjects(data.data);
        setLoading(false);
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const validateGitHubUrl = (url: string) => {
        return url.match(/github\.com\/([^/]+)\/([^/]+)/);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");

        if (githubLink && !validateGitHubUrl(githubLink)) {
            setFormError("Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo)");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, githubLink: githubLink || null }),
            });
            const data = await res.json();
            if (data.success) {
                setTitle("");
                setDescription("");
                setGithubLink("");
                setShowForm(false);
                await loadProjects();
            } else {
                setFormError(data.error || "Failed to add project");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleAnalyze = async (projectId: string) => {
        setAnalyzingId(projectId);
        try {
            const res = await fetch("/api/projects/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projectId }),
            });
            const data = await res.json();
            if (data.success) {
                // Update local state with analysis
                setProjects(projects.map(p => p.id === projectId ? { ...p, ...data.data } : p));
            }
        } finally {
            setAnalyzingId(null);
        }
    };

    return (
        <ProtectedRoute>
            <Navbar />
            <div className="min-h-screen bg-[#f8fafc] pt-20 pb-10">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-[#057642] uppercase tracking-[0.3em] mb-2 bg-[#057642]/5 px-3 py-1 rounded-full w-fit">
                                <span className="w-2 h-2 bg-[#057642] rounded-full animate-pulse" />
                                Portfolio Hub
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                                Showcase Your <span className="text-[#057642]">Work.</span>
                            </h1>
                            <p className="text-gray-500 mt-2 text-base font-medium">Link your GitHub and let AI turn your code into professional credibility.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/projects/discover"
                                className="px-6 py-2.5 bg-white text-gray-900 border border-gray-200 rounded-full font-bold text-sm hover:border-[#057642] hover:text-[#057642] transition-all flex items-center gap-2 group"
                            >
                                <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                Find Inspiration
                            </Link>
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg active:scale-95 ${showForm
                                    ? "bg-red-50 text-red-600 border border-red-200"
                                    : "bg-[#057642] text-white hover:bg-[#046237]"}`}
                            >
                                {showForm ? "Cancel" : "Add Project"}
                            </button>
                        </div>
                    </div>

                    {/* Add Project Form */}
                    {showForm && (
                        <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-gray-100 mb-12 animate-slide-up relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#057642]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <h2 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-wider relative">Import Repository</h2>
                            {formError && (
                                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-bold mb-6 italic">
                                    {formError}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-6 relative">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Project Name</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full text-sm py-4 px-6 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-[6px] focus:ring-[#057642]/10 focus:border-[#057642] focus:outline-none transition-all placeholder:text-gray-300 font-bold"
                                            placeholder="e.g. Distributed Ledger Engine"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">GitHub Repository URL</label>
                                        <div className="relative">
                                            <input
                                                type="url"
                                                value={githubLink}
                                                onChange={(e) => setGithubLink(e.target.value)}
                                                className="w-full text-sm py-4 px-6 pl-12 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-[6px] focus:ring-[#057642]/10 focus:border-[#057642] focus:outline-none transition-all placeholder:text-gray-300 font-bold"
                                                placeholder="https://github.com/username/repo"
                                            />
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Brief Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full text-sm py-4 px-6 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-[6px] focus:ring-[#057642]/10 focus:border-[#057642] focus:outline-none transition-all resize-none placeholder:text-gray-300 font-bold"
                                        rows={4}
                                        placeholder="What does this project do? (Our AI will extract technical details from the repo automatically)"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-12 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-[#057642] shadow-2xl hover:shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3 uppercase tracking-widest text-[10px]"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Importing Repo...
                                            </>
                                        ) : "Sync Repository to Portfolio"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Projects Listing */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-48">
                            <div className="w-12 h-12 border-4 border-[#057642]/10 border-t-[#057642] rounded-full animate-spin mb-4" />
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Assembling projects...</p>
                        </div>
                    ) : projects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onAnalyze={handleAnalyze}
                                    isAnalyzing={analyzingId === project.id}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl py-32 text-center flex flex-col items-center">
                            <div className="w-24 h-24 bg-[#057642]/5 rounded-full flex items-center justify-center text-[#057642] mb-8">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Build Your High-Impact Portfolio</h3>
                            <p className="text-gray-500 max-w-sm mb-12 font-medium">Add your GitHub projects and get instant AI-generated resume bullets and interview preparation.</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-10 py-4 bg-[#057642] text-white font-black rounded-2xl hover:bg-[#046237] shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all text-xs uppercase tracking-widest"
                            >
                                Start Importing
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
