"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";

interface Message {
    role: "user" | "ai";
    content: string;
    timestamp: Date;
}

export default function MentorPage() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [skills, setSkills] = useState(user?.skills?.join(", ") || "");
    const [targetRole, setTargetRole] = useState("");
    const [experience, setExperience] = useState("fresher");
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [, setShowSettings] = useState(true);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const askMentor = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;

        const currentQuestion = question.trim();
        const userMessage: Message = {
            role: "user",
            content: currentQuestion,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setQuestion("");
        setLoading(true);

        try {
            const res = await fetch("/api/mentor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ skills, targetRole, experience, question: currentQuestion }),
            });

            const data = await res.json();
            if (data.success) {
                const aiMessage: Message = {
                    role: "ai",
                    content: data.data.response,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, aiMessage]);
                setShowSettings(false);
            } else {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "ai",
                        content: data.error || "I'm having trouble connecting right now. Please check your API keys or internet connection.",
                        timestamp: new Date()
                    },
                ]);
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "ai", content: "Sorry, I'm having trouble connecting right now. Please try again.", timestamp: new Date() },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const suggestedQuestions = [
        "How do I prepare for a software interview?",
        "What projects should I build for my portfolio?",
        "What's the best path for Web Development?",
        "How to build a professional LinkedIn profile?",
    ];

    const botIcon = (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15 2H9C7.9 2 7 2.9 7 4V6H17V4C17 2.9 16.1 2 15 2ZM20 8H4C2.9 8 2 8.9 2 10V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V10C22 8.9 21.1 8 20 8ZM19 18H5V10H19V18ZM8 12H10V14H8V12ZM14 12H16V14H14V12ZM8 15H16V16H8V15Z" />
        </svg>
    );

    return (
        <ProtectedRoute>
            <Navbar />
            <div className="page-container">
                <div className="page-content max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Settings sidebar */}
                        <div className="lg:col-span-4 order-2 lg:order-1">
                            <div className="sticky top-20 space-y-6">
                                <div className="card p-6 shadow-md border border-[#e0e0e0] rounded-xl">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Career Context</h2>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#057642]/10 text-[#057642] text-[10px] font-bold ring-1 ring-[#057642]/20">
                                            <span className="w-1.5 h-1.5 bg-[#057642] rounded-full animate-pulse"></span>
                                            LIVE AGENT
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Current Skills</label>
                                            <input
                                                type="text"
                                                value={skills}
                                                onChange={(e) => setSkills(e.target.value)}
                                                className="w-full text-sm py-2.5 px-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#057642]/20 focus:border-[#057642] focus:outline-none transition-all"
                                                placeholder="e.g. React, Python"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Target Role</label>
                                            <input
                                                type="text"
                                                value={targetRole}
                                                onChange={(e) => setTargetRole(e.target.value)}
                                                className="w-full text-sm py-2.5 px-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#057642]/20 focus:border-[#057642] focus:outline-none transition-all"
                                                placeholder="e.g. Full Stack Developer"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Seniority Level</label>
                                            <select
                                                value={experience}
                                                onChange={(e) => setExperience(e.target.value)}
                                                className="w-full text-sm py-2.5 px-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#057642]/20 focus:border-[#057642] focus:outline-none transition-all cursor-pointer"
                                            >
                                                <option value="fresher">Fresher</option>
                                                <option value="student">Student</option>
                                                <option value="0-1 years">0-1 Years Junior</option>
                                                <option value="1-3 years">1-3 Years Associate</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-6 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                                        <p className="text-[10px] text-blue-600 leading-relaxed font-medium">
                                            The AI uses this context to tailor advice, interview questions, and project roadmaps to your specific career path.
                                        </p>
                                    </div>
                                </div>

                                <div className="card p-6 shadow-md border border-[#e0e0e0] rounded-xl">
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Suggested Topics</h3>
                                    <div className="space-y-2">
                                        {suggestedQuestions.map((q, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setQuestion(q)}
                                                className="w-full text-left text-xs font-semibold text-gray-700 hover:text-[#057642] hover:bg-green-50 p-3 rounded-lg border border-transparent hover:border-[#057642]/20 transition-all flex items-center gap-3 group"
                                            >
                                                <div className="w-5 h-5 text-gray-300 group-hover:text-[#057642] transition-colors">
                                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
                                                </div>
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chat area */}
                        <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col h-[calc(100vh-140px)]">
                            <div className="flex-1 overflow-y-auto card p-0 flex flex-col mb-4 shadow-xl rounded-xl border border-[#e0e0e0] bg-white">
                                <div className="p-5 border-b border-[#f0f0f0] flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-[#057642] flex items-center justify-center text-white shadow-lg">
                                            {botIcon}
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-gray-900">Career Strategist</h2>
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">System Ready</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 p-6 space-y-8 min-h-[400px]">
                                    {messages.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center px-12 py-20">
                                            <div className="w-20 h-20 bg-[#057642]/10 rounded-3xl flex items-center justify-center text-[#057642] mb-6 animate-pulse">
                                                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.2-13.8V13h-3.3v1.6H13V6.2h-.8z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">Strategy Session for {user?.name?.split(" ")[0]}</h3>
                                            <p className="text-sm text-gray-500 leading-relaxed">
                                                I am your AI Career Strategist. I can build technical roadmaps, suggest industry-relevant projects, or help you navigate your current professional challenges.
                                            </p>
                                        </div>
                                    ) : (
                                        messages.map((msg, i) => (
                                            <div key={i} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                                <div className={`w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-sm ${msg.role === "ai" ? "bg-[#057642] text-white" : "bg-gray-100 text-gray-600"}`}>
                                                    {msg.role === "ai" ? botIcon : user?.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className={`p-4 rounded-2xl max-w-[85%] text-sm shadow-sm ${msg.role === "ai" ? "bg-white border border-[#f0f0f0] text-gray-800" : "bg-[#057642] text-white"}`}>
                                                    <div
                                                        className={`prose prose-sm max-w-none whitespace-pre-line leading-relaxed ${msg.role === "user" ? "text-white" : "text-gray-800"}`}
                                                        dangerouslySetInnerHTML={{
                                                            __html: msg.content
                                                                .replace(/## (.*)/g, '<h3 class="text-sm font-bold mt-4 mb-2 uppercase tracking-wide">$1</h3>')
                                                                .replace(/### (.*)/g, '<h4 class="text-xs font-bold mt-3 mb-2 opacity-80">$1</h4>')
                                                                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold underline decoration-[#057642]/30">$1</strong>')
                                                                .replace(/- (.*)/g, '<div class="flex gap-2 ml-1 text-xs mb-1.5"><span class="opacity-50">•</span><span>$1</span></div>')
                                                                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" target="_blank" class="font-bold underline ${msg.role === "user" ? "text-white" : "text-[#057642]"}">$1</a>`),
                                                        }}
                                                    />
                                                    <div className={`text-[8px] mt-3 block font-bold uppercase tracking-widest opacity-40 ${msg.role === "user" ? "text-right" : ""}`}>
                                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    {loading && (
                                        <div className="flex gap-4">
                                            <div className="w-9 h-9 rounded-lg bg-[#057642] flex-shrink-0 flex items-center justify-center text-white">
                                                {botIcon}
                                            </div>
                                            <div className="p-4 rounded-2xl bg-white border border-[#f0f0f0] shadow-sm">
                                                <div className="flex gap-1.5">
                                                    <div className="w-1.5 h-1.5 bg-[#057642] rounded-full animate-bounce" />
                                                    <div className="w-1.5 h-1.5 bg-[#057642] rounded-full animate-bounce [animation-delay:0.1s]" />
                                                    <div className="w-1.5 h-1.5 bg-[#057642] rounded-full animate-bounce [animation-delay:0.2s]" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>
                            </div>

                            <form onSubmit={askMentor} className="relative group">
                                <input
                                    type="text"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    className="w-full pl-6 pr-24 py-4 bg-white border border-gray-400 rounded-xl focus:ring-4 focus:ring-[#057642]/10 focus:border-[#057642] focus:outline-none text-sm placeholder:text-gray-400 shadow-sm transition-all"
                                    placeholder="Ask for roadmap, project ideas, or interview prep..."
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !question.trim()}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-[#057642] text-white font-bold text-xs py-2 px-6 rounded-lg disabled:opacity-30 hover:bg-[#046237] shadow-lg hover:shadow-xl transition-all active:scale-95"
                                >
                                    SEND
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
