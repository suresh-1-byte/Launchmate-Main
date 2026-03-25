"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    applyUrl: string;
    salary: string | null;
    postedAt: string;
}

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [searched, setSearched] = useState(false);

    const searchJobs = async (q?: string, loc?: string) => {
        setLoading(true);
        setSearched(true);
        const params = new URLSearchParams();
        params.set("q", q || query || "software developer");
        if (loc || location) params.set("location", loc || location);

        try {
            const res = await fetch(`/api/jobs/search?${params}`);
            const data = await res.json();
            if (data.success) {
                setJobs(data.data);
                if (data.data.length > 0) setSelectedJob(data.data[0]);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        searchJobs("software developer", "");
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        searchJobs();
    };

    const quickSearches = [
        "React Developer",
        "Data Scientist",
        "Full Stack",
        "UI/UX Designer",
    ];

    return (
        <ProtectedRoute>
            <Navbar />
            <div className="page-container">
                <div className="page-content max-w-6xl mx-auto">
                    {/* Top Search Section */}
                    <div className="card mb-6 p-6">
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#057642] transition-colors">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.5L20.5 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057642]/20 focus:border-[#057642] text-sm"
                                    placeholder="Search by title, company, or skills"
                                />
                            </div>
                            <div className="md:w-64 relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#057642] transition-colors">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057642]/20 focus:border-[#057642] text-sm"
                                    placeholder="City or state"
                                />
                            </div>
                            <button type="submit" className="px-10 py-3 bg-[#057642] text-white font-bold rounded-lg hover:bg-[#046237] shadow-sm hover:shadow-md transition-all text-sm">
                                Search Jobs
                            </button>
                        </form>
                        <div className="flex flex-wrap gap-2 mt-6 items-center">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2">Quick filters:</span>
                            {quickSearches.map((qs) => (
                                <button
                                    key={qs}
                                    onClick={() => { setQuery(qs); searchJobs(qs); }}
                                    className="px-4 py-1.5 text-xs font-semibold border border-gray-300 rounded-full hover:border-[#057642] hover:bg-[#057642] hover:text-white transition-all text-gray-600 shadow-sm"
                                >
                                    {qs}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-24">
                            <div className="w-10 h-10 border-4 border-[#057642]/30 border-t-[#057642] rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Job list (LinkedIn-style left panel) */}
                            <div className="lg:w-2/5 flex flex-col gap-3">
                                <h2 className="text-sm font-bold text-gray-900 px-2 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-[#057642]" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM11 7H13V9H11V7ZM11 11H13V13H11V11ZM11 15H13V17H11V15ZM7 7H9V9H7V7ZM7 11H9V13H7V11ZM7 15H9V17H7V15ZM15 7H17V9H15V7ZM15 11H17V13H15V11ZM15 15H17V17H15V15Z" />
                                    </svg>
                                    Job results
                                </h2>
                                <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-2 scrollbar-hide">
                                    {jobs.length > 0 ? (
                                        jobs.map((job) => (
                                            <div
                                                key={job.id}
                                                onClick={() => setSelectedJob(job)}
                                                className={`p-5 border rounded-xl cursor-pointer transition-all duration-200 ${selectedJob?.id === job.id ? "bg-[#057642]/5 border-[#057642] shadow-md ring-1 ring-[#057642]/30" : "bg-white border-[#e0e0e0] hover:border-[#057642]/30 hover:shadow-md"}`}
                                            >
                                                <h3 className="text-base font-bold text-[#057642] mb-1 line-clamp-1">{job.title}</h3>
                                                <p className="text-sm text-gray-900 font-semibold mb-1">{job.company}</p>
                                                <p className="text-sm text-gray-500 mb-3">{job.location}</p>
                                                <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#f0f0f0]">
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                                        {new Date(job.postedAt).toLocaleDateString()}
                                                    </span>
                                                    {job.salary && (
                                                        <span className="text-xs font-bold text-[#057642] px-2 py-1 rounded bg-green-50">{job.salary}</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-20 text-gray-400 card border-dashed">
                                            <p className="text-sm font-semibold">No jobs found matching your search.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Detailed view (LinkedIn-style right panel) */}
                            <div className="lg:w-3/5">
                                {selectedJob ? (
                                    <div className="card sticky top-20 p-8 shadow-lg border border-[#e0e0e0] rounded-xl">
                                        <div className="pb-8 border-b border-[#f0f0f0] mb-8">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedJob.title}</h2>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8">
                                                <span className="text-base font-bold text-gray-700">{selectedJob.company}</span>
                                                <span className="text-gray-300">|</span>
                                                <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" />
                                                    </svg>
                                                    {selectedJob.location}
                                                </div>
                                                {selectedJob.salary && (
                                                    <>
                                                        <span className="text-gray-300">|</span>
                                                        <div className="flex items-center gap-1.5 text-[#057642] text-sm font-bold">
                                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                                                            </svg>
                                                            {selectedJob.salary}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <div className="flex gap-4">
                                                <a
                                                    href={selectedJob.applyUrl}
                                                    target="_blank"
                                                    className="px-10 py-3 bg-[#057642] text-white font-bold rounded-lg hover:bg-[#046237] shadow-sm hover:shadow-md transition-all text-sm flex items-center gap-2"
                                                >
                                                    Apply Now
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M19 19H5V5H12V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V12H19V19ZM14 3V5H17.59L7.76 14.83L9.17 16.24L19 6.41V10H21V3H14Z" />
                                                    </svg>
                                                </a>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(selectedJob.applyUrl)}
                                                    className="px-8 py-3 border border-[#057642] text-[#057642] font-bold rounded-lg hover:bg-green-50 transition-all text-sm"
                                                >
                                                    Copy Link
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-base font-bold text-gray-900 mb-4">About the Job</h3>
                                                <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50/50 p-5 rounded-xl border border-[#f0f0f0]">
                                                    {selectedJob.description}
                                                </div>
                                            </div>
                                            <div className="pt-6 border-t border-[#f0f0f0] flex justify-between items-center bg-white">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                    Posted on {new Date(selectedJob.postedAt).toLocaleDateString()}
                                                </p>
                                                <p className="text-xs text-gray-400 font-medium">Job ID: {selectedJob.id.toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : !loading && jobs.length > 0 ? (
                                    <div className="card h-96 flex flex-col items-center justify-center text-gray-400 bg-gray-50 border-dashed">
                                        <svg className="w-16 h-16 mb-4 opacity-10" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20 6V19C20 20.1 19.1 21 18 21H6C4.9 21 4 20.1 4 19V6C4 4.9 4.9 4 6 4H8V2C8 0.9 8.9 0 10 0H14C15.1 0 16 0.9 16 2V4H18C19.1 4 20 4.9 20 6Z" />
                                        </svg>
                                        <p className="text-base font-semibold">Select a job to see more details</p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
