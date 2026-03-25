"use client";

import { useState } from "react";

interface ProjectCardProps {
    project: any;
    onAnalyze: (projectId: string) => Promise<void>;
    isAnalyzing: boolean;
}

export default function ProjectCard({ project, onAnalyze, isAnalyzing }: ProjectCardProps) {
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [showResume, setShowResume] = useState(false);

    // Format GitHub languages into badges
    const languages = project.languages ? project.languages.split(",").map((s: string) => s.trim()) : [];

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group relative">
            {/* Header / Banner */}
            <div className="h-32 bg-gradient-to-br from-[#057642] to-[#046237] relative flex items-center px-8">
                <div className="absolute top-4 right-4 flex gap-2">
                    {project.difficulty && (
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white border border-white/20 uppercase tracking-widest italic">
                            {project.difficulty}
                        </span>
                    )}
                    {project.portfolioScore && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-white rounded-full shadow-lg border border-gray-100 scale-100 group-hover:scale-110 transition-transform">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-1">Score</span>
                            <span className="text-sm font-black text-[#057642]">{project.portfolioScore}/10</span>
                        </div>
                    )}
                </div>

                {/* Repo Image/Avatar overlay */}
                <div className="absolute -bottom-10 left-8">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-2xl p-1 border-4 border-white overflow-hidden">
                        <img
                            src={project.repoImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(project.title)}&background=057642&color=fff`}
                            className="w-full h-full object-cover rounded-xl"
                            alt=""
                        />
                    </div>
                </div>
            </div>

            <div className="pt-14 pb-8 px-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-black text-gray-900 group-hover:text-[#057642] transition-colors tracking-tight">
                        {project.title}
                    </h3>
                    {project.githubLink && (
                        <div className="flex items-center gap-3 text-gray-400">
                            <div className="flex items-center gap-1 text-[10px] font-bold">
                                <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3-.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                {project.stars}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                {project.forks}
                            </div>
                        </div>
                    )}
                </div>

                <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3">
                    {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {languages.map((lang: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-gray-100">
                            {lang}
                        </span>
                    ))}
                    {languages.length === 0 && (
                        <span className="px-3 py-1 bg-gray-50 text-gray-400 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-gray-100 italic">
                            Auto-detecting stack...
                        </span>
                    )}
                </div>

                {/* Primary Actions */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <a
                        href={project.githubLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-2xl text-xs font-bold hover:bg-[#057642] transition-colors shadow-lg active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                        View Code
                    </a>
                    <button
                        onClick={() => project.aiExplanation ? setShowAnalysis(!showAnalysis) : onAnalyze(project.id)}
                        disabled={isAnalyzing}
                        className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all shadow-lg active:scale-95 border-2 ${project.aiExplanation
                                ? "bg-[#057642]/5 text-[#057642] border-[#057642]/10 hover:bg-[#057642]/10 shadow-none border-dashed"
                                : "bg-[#057642] text-white border-transparent hover:bg-[#046237]"
                            }`}
                    >
                        {isAnalyzing ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                        )}
                        {project.aiExplanation ? "Project Insights" : "AI Explain Project"}
                    </button>
                </div>

                {/* AI Insights Section */}
                {project.aiExplanation && showAnalysis && (
                    <div className="mt-6 p-6 bg-gray-50 rounded-3xl border border-gray-100 animate-slide-up">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-[#057642] rounded-lg flex items-center justify-center text-white shadow-lg">
                                🤖
                            </div>
                            <h4 className="font-black text-gray-900 text-xs uppercase tracking-widest">AI Mentor Analysis</h4>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] font-black text-[#057642] uppercase tracking-[0.2em] mb-2">Technical Summary</p>
                                <p className="text-sm text-gray-600 leading-relaxed font-medium italic">"{project.aiExplanation}"</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Suggested Improvements</p>
                                    <ul className="text-xs text-gray-600 space-y-2 font-medium">
                                        {project.suggestedImprovements?.split("\n").map((line: string, i: number) => (
                                            <li key={i} className="flex gap-2">
                                                <span className="text-[#057642]">•</span>
                                                {line.replace(/^\d+\.\s*/, "").replace(/^•\s*/, "")}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Interview Prep</p>
                                    <ul className="text-xs text-gray-600 space-y-1 font-bold">
                                        {project.interviewQuestions?.split("\n").map((line: string, i: number) => (
                                            <li key={i} className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm text-[10px] text-[#057642]">
                                                Q: {line.replace(/^\d+\.\s*/, "").replace(/^•\s*/, "")}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowResume(!showResume)}
                            className="w-full mt-6 py-2 bg-gray-900/5 hover:bg-gray-900/10 text-gray-900 text-[10px] font-bold rounded-xl flex items-center justify-center gap-2 transition-all uppercase tracking-widest"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            {showResume ? "Hide Resume Bullets" : "Generate Resume Bullet Points"}
                        </button>

                        {showResume && project.resumeBullets && (
                            <div className="mt-4 p-4 bg-gray-900 text-white rounded-2xl animate-fade-in">
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-3">ATS-Friendly Resume Content</p>
                                <div className="space-y-2 text-xs font-medium font-mono text-gray-300">
                                    {project.resumeBullets.split("\n").map((bullet: string, i: number) => (
                                        <p key={i} className="leading-relaxed tracking-tight select-all cursor-pointer hover:text-white transition-colors">
                                            {bullet.startsWith("-") ? bullet : `• ${bullet}`}
                                        </p>
                                    ))}
                                </div>
                                <div className="mt-3 flex justify-end">
                                    <span className="text-[8px] bg-white/10 px-2 py-0.5 rounded text-white/50">Click items to copy</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Recruiter Metrics Overlay (Small) */}
                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Freshness</p>
                            <span className="text-[10px] font-bold text-gray-900">
                                {project.lastUpdated ? new Date(project.lastUpdated).toLocaleDateString() : "Active"}
                            </span>
                        </div>
                        <div className="text-center border-l border-gray-100 pl-4">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Verified</p>
                            <span className="text-[10px] font-bold text-green-600 flex items-center gap-0.5">
                                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                                GitHub
                            </span>
                        </div>
                    </div>
                    <div className="flex -space-x-1.5 overflow-hidden">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center">
                                <span className="text-[8px] font-bold text-gray-400">{i}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
