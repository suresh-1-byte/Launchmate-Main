"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";

interface RoasterOutput {
    score: number;
    strengths: string[];
    problems: string[];
    missing: string[];
    suggestions: string[];
    improvedBullets: string[];
}

export default function ResumeRoasterPage() {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<RoasterOutput | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setError(null);
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a PDF or DOCX file first.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/resume-roaster", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || "Failed to analyze resume.");
            }

            setResult(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                        AI Resume <span className="text-[#057642]">Roaster</span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg text-gray-500 mx-auto">
                        Get brutally honest AI feedback, discover missing sections, and instantly find out why your resume is being ignored.
                    </p>
                </div>

                {!result && !loading && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200"
                    >
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-10 bg-gray-50 hover:bg-gray-100 transition-colors">
                            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Upload your resume</h3>
                            <p className="text-sm text-gray-500 mb-6">PDF or DOCX max 5MB</p>
                            
                            <label className="cursor-pointer bg-[#057642] text-white px-6 py-3 rounded-lg font-semibold shadow-md shadow-[#057642]/20 hover:bg-[#046135] hover:scale-105 transition-all">
                                Select File
                                <input type="file" className="hidden" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileChange} />
                            </label>

                            {file && (
                                <div className="mt-6 flex items-center space-x-3 bg-white px-4 py-2 rounded-lg border border-gray-200">
                                    <svg className="w-6 h-6 text-[#057642]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">{file.name}</span>
                                    <button onClick={() => setFile(null)} className="text-gray-400 hover:text-red-500">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {file && (
                            <button 
                                onClick={handleUpload}
                                className="w-full mt-6 bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg"
                            >
                                Roast My Resume 🔥
                            </button>
                        )}
                    </motion.div>
                )}

                {loading && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center p-12"
                    >
                        <div className="relative w-24 h-24">
                            <div className="absolute top-0 left-0 w-full h-full border-4 border-[#057642]/20 rounded-full"></div>
                            <div className="absolute top-0 left-0 w-full h-full border-4 border-[#057642] rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <h2 className="mt-8 text-2xl font-bold text-gray-900">AI is analyzing your resume...</h2>
                        <p className="mt-2 text-gray-500">Preparing critical feedback. Don't take it personally!</p>
                    </motion.div>
                )}

                <AnimatePresence>
                {result && (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Score Section */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 flex flex-col items-center justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13H5.5L12 6.5z"/>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Resume Score</h2>
                            <div className="relative">
                                <div className="w-40 h-40 flex items-center justify-center rounded-full border-8 border-gray-100 shadow-inner">
                                    <span className={`text-6xl font-black ${
                                        result.score >= 8 ? "text-green-500" :
                                        result.score >= 5 ? "text-orange-500" : "text-red-500"
                                    }`}>
                                        {result.score}
                                    </span>
                                    <span className="text-2xl text-gray-400 font-bold ml-1 mt-6">/10</span>
                                </div>
                                {/* Circular progress ring wrapper here if desired */}
                            </div>
                            <p className="mt-6 text-gray-600 font-medium text-center max-w-lg">
                                {result.score >= 8 ? "Excellent! Your resume is ATS-friendly and professional." : 
                                 result.score >= 5 ? "Needs work. You have the basics but lacking impact and strong framing." : 
                                 "Needs a major overhaul. Recruiters might skip this completely."}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Strengths */}
                            <div className="bg-green-50/50 rounded-2xl p-6 border border-green-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-green-100 p-2 rounded-lg text-green-600">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-green-900">Strengths</h3>
                                </div>
                                <ul className="space-y-3">
                                    {result.strengths.map((str, idx) => (
                                        <li key={idx} className="flex gap-3 text-green-800">
                                            <span className="font-bold text-green-600">•</span>
                                            <span>{str}</span>
                                        </li>
                                    ))}
                                    {result.strengths.length === 0 && <span className="text-gray-500 italic">None found.</span>}
                                </ul>
                            </div>

                            {/* Problems */}
                            <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-red-100 p-2 rounded-lg text-red-600">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-red-900">Major Problems</h3>
                                </div>
                                <ul className="space-y-3">
                                    {result.problems.map((prob, idx) => (
                                        <li key={idx} className="flex gap-3 text-red-800">
                                            <span className="font-bold text-red-600">•</span>
                                            <span>{prob}</span>
                                        </li>
                                    ))}
                                    {result.problems.length === 0 && <span className="text-gray-500 italic">None found.</span>}
                                </ul>
                            </div>
                        </div>

                        {/* Missing & Suggestions */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                                <div className="pr-0 md:pr-8">
                                    <h3 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        Missing Sections
                                    </h3>
                                    <ul className="space-y-3 text-gray-700">
                                        {result.missing.map((item, idx) => (
                                            <li key={idx} className="flex gap-2">
                                                <span className="text-orange-400 font-bold ml-1">→</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="pt-8 md:pt-0 pl-0 md:pl-8">
                                    <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                        Actionable Suggestions
                                    </h3>
                                    <ul className="space-y-3 text-gray-700">
                                        {result.suggestions.map((item, idx) => (
                                            <li key={idx} className="flex gap-2 bg-blue-50/50 p-2 rounded-lg text-sm">
                                                <span className="text-blue-500">•</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Improved Bullets */}
                        <div className="bg-gray-900 rounded-2xl p-8 shadow-lg text-white">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <span className="bg-[#057642] p-2 rounded-lg">✨</span> 
                                Example Improved Bullet Points
                            </h3>
                            <div className="space-y-4">
                                {result.improvedBullets.map((bullet, idx) => (
                                    <div key={idx} className="bg-gray-800/80 p-4 rounded-xl border border-gray-700 hover:border-gray-500 transition-colors">
                                        <p className="text-emerald-400 font-mono text-sm leading-relaxed">&gt; {bullet}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Generate Improved Resume Button */}
                        <div className="flex justify-center pt-6 pb-12">
                            <button 
                                onClick={() => alert("This feature will open Launchmate Builder to construct a new PDF. Coming soon!")}
                                className="bg-[#057642] hover:bg-[#046135] text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-[#057642]/30 transform transition-all hover:-translate-y-1 hover:scale-105 flex items-center gap-3"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                                </svg>
                                Generate Improved Resume Version
                            </button>
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
    );
}
