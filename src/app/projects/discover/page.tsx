"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

interface DiscoveredRepo {
    id: number;
    name: string;
    full_name: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
    owner_avatar: string;
    html_url: string;
    discoveryTags: string[];
    difficulty: string;
}

export default function DiscoverProjectsPage() {
    const [repos, setRepos] = useState<DiscoveredRepo[]>([]);
    const [loading, setLoading] = useState(true);
    const [tech, setTech] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [domain, setDomain] = useState("");

    const fetchDiscovery = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (tech) params.append("tech", tech);
            if (difficulty) params.append("difficulty", difficulty);
            if (domain) params.append("domain", domain);

            const res = await fetch(`/api/projects/discover?${params.toString()}`);
            const data = await res.json();
            if (data.success) setRepos(data.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscovery();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchDiscovery();
    };

    return (
        <ProtectedRoute>
            <Navbar />
            <div className="min-h-screen bg-[#f8fafc] pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-10 text-center">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
                            Discover <span className="text-[#057642]">Learning Projects</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Browse trending open-source repositories analyzed and ranked specifically for students and career-seekers.
                        </p>
                    </div>

                    {/* Filter Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-10">
                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Technology</label>
                                <select
                                    value={tech}
                                    onChange={(e) => setTech(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#057642]/20 focus:outline-none"
                                >
                                    <option value="">All Languages</option>
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="typescript">TypeScript</option>
                                    <option value="java">Java</option>
                                    <option value="go">Go</option>
                                    <option value="rust">Rust</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Difficulty</label>
                                <select
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#057642]/20 focus:outline-none"
                                >
                                    <option value="">All Levels</option>
                                    <option value="Beginner">Beginner Friendly</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced / Production</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Domain</label>
                                <select
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#057642]/20 focus:outline-none"
                                >
                                    <option value="">All Domains</option>
                                    <option value="web">Web Development</option>
                                    <option value="ai">Artificial Intelligence</option>
                                    <option value="blockchain">Blockchain</option>
                                    <option value="mobile">Mobile Apps</option>
                                    <option value="security">Cybersecurity</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="w-full bg-[#057642] text-white font-bold py-2.5 rounded-xl hover:bg-[#046237] transition-all shadow-md active:scale-95"
                                >
                                    Filter Projects
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Results Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40">
                            <div className="w-12 h-12 border-4 border-[#057642]/20 border-t-[#057642] rounded-full animate-spin mb-4" />
                            <p className="text-gray-500 font-medium animate-pulse">Fetching global repositories...</p>
                        </div>
                    ) : repos.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {repos.map((repo) => (
                                <div key={repo.id} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                    <div className="flex items-center gap-3 mb-4">
                                        <img src={repo.owner_avatar} className="w-8 h-8 rounded-lg shadow-sm" alt="" />
                                        <span className="text-xs font-bold text-gray-400 group-hover:text-[#057642]">{repo.full_name}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{repo.name}</h3>
                                    <p className="text-sm text-gray-500 mb-6 flex-1 line-clamp-3">{repo.description || "No description provided."}</p>

                                    {/* Tech & Difficulty Tags */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {repo.language && (
                                            <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] font-black uppercase tracking-wider border border-blue-100 italic">
                                                {repo.language}
                                            </span>
                                        )}
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border italic ${repo.difficulty === "Beginner" ? "bg-green-50 text-green-600 border-green-100" :
                                                repo.difficulty === "Advanced" ? "bg-red-50 text-red-600 border-red-100" :
                                                    "bg-orange-50 text-orange-600 border-orange-100"
                                            }`}>
                                            {repo.difficulty}
                                        </span>
                                    </div>

                                    {/* Discovery Tags */}
                                    <div className="flex flex-wrap gap-2 mb-6 border-t pt-4 border-dashed border-gray-200">
                                        {repo.discoveryTags.map((tag, i) => (
                                            <span key={i} className="text-[10px] font-bold text-[#057642] bg-[#057642]/5 px-2 py-0.5 rounded flex items-center gap-1">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Metrics & Action */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                {repo.stars}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                                {repo.forks}
                                            </span>
                                        </div>
                                        <a
                                            href={repo.html_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-[#057642] transition-colors flex items-center gap-2"
                                        >
                                            View Repo
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 py-32 text-center flex flex-col items-center">
                            <svg className="w-16 h-16 text-gray-200 mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No projects found for current filters</h3>
                            <button onClick={() => { setTech(""); setDifficulty(""); setDomain(""); fetchDiscovery(); }} className="text-[#057642] font-bold hover:underline">Clear all filters</button>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
