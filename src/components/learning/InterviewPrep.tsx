"use client";
import { useState } from "react";
import { CareerPath } from "@/lib/learning-data";

interface Props {
    path: CareerPath;
}

interface AIQuestion {
    question: string;
    type: string;
    difficulty: string;
    hint: string;
    sampleAnswer: string;
}

const DIFF_COLORS: Record<string, string> = {
    easy: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    hard: "bg-red-100 text-red-700",
};

export default function InterviewPrep({ path }: Props) {
    const [activeSection, setActiveSection] = useState<"technical" | "hr" | "resume" | "projects" | "ai">("technical");
    const [expandedQ, setExpandedQ] = useState<number | null>(null);
    const [aiQuestions, setAiQuestions] = useState<AIQuestion[]>([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiType, setAiType] = useState("mixed");
    const [expandedAiQ, setExpandedAiQ] = useState<number | null>(null);

    const generateAIQuestions = async () => {
        setAiLoading(true);
        setAiQuestions([]);
        try {
            const res = await fetch("/api/learning/interview-questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: path.title, type: aiType }),
            });
            const data = await res.json();
            if (data.success) setAiQuestions(data.data.questions);
        } catch (e) {
            console.error(e);
        } finally {
            setAiLoading(false);
        }
    };

    const sections = [
        { key: "technical", label: "⚙️ Technical", count: path.interviewPrep.technical.length },
        { key: "hr", label: "👔 HR", count: path.interviewPrep.hr.length },
        { key: "resume", label: "📄 Resume Tips", count: path.interviewPrep.resumeTips.length },
        { key: "projects", label: "💡 Project Ideas", count: path.interviewPrep.projectIdeas.length },
        { key: "ai", label: "🤖 AI Generate", count: null },
    ];

    return (
        <div className="space-y-4">
            {/* Section Tabs */}
            <div className="card p-3">
                <div className="flex gap-2 flex-wrap">
                    {sections.map(s => (
                        <button
                            key={s.key}
                            onClick={() => setActiveSection(s.key as any)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeSection === s.key ? "bg-indigo-600 text-white shadow" : "text-gray-600 hover:bg-gray-100"}`}
                        >
                            {s.label}
                            {s.count !== null && (
                                <span className={`text-[10px] px-1.5 rounded-full ${activeSection === s.key ? "bg-white/20" : "bg-gray-100 text-gray-500"}`}>
                                    {s.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Technical Q&A */}
            {activeSection === "technical" && (
                <div className="space-y-3">
                    <p className="text-xs text-gray-500 px-1">Common technical interview questions for <strong>{path.title}</strong></p>
                    {path.interviewPrep.technical.map((item, i) => (
                        <div key={i} className="card p-0 overflow-hidden">
                            <button
                                onClick={() => setExpandedQ(expandedQ === i ? null : i)}
                                className="w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                                <span className="text-sm font-semibold text-gray-900 flex-1">{item.q}</span>
                                <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5 transition-transform ${expandedQ === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {expandedQ === i && (
                                <div className="px-4 pb-4 border-t border-gray-100">
                                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                                        <div className="text-xs font-bold text-green-700 mb-1">✅ Sample Answer</div>
                                        <p className="text-sm text-gray-700 leading-relaxed">{item.a}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* HR Q&A */}
            {activeSection === "hr" && (
                <div className="space-y-3">
                    <p className="text-xs text-gray-500 px-1">HR & behavioral interview questions</p>
                    {path.interviewPrep.hr.map((item, i) => (
                        <div key={i} className="card p-0 overflow-hidden">
                            <button
                                onClick={() => setExpandedQ(expandedQ === i + 100 ? null : i + 100)}
                                className="w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">HR</span>
                                <span className="text-sm font-semibold text-gray-900 flex-1">{item.q}</span>
                                <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5 transition-transform ${expandedQ === i + 100 ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {expandedQ === i + 100 && (
                                <div className="px-4 pb-4 border-t border-gray-100">
                                    <div className="mt-3 p-3 bg-pink-50 border border-pink-200 rounded-xl">
                                        <div className="text-xs font-bold text-pink-700 mb-1">💡 How to Answer</div>
                                        <p className="text-sm text-gray-700 leading-relaxed">{item.a}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Resume Tips */}
            {activeSection === "resume" && (
                <div className="card p-5">
                    <h3 className="font-bold text-gray-900 mb-4">📄 Resume Tips for {path.title}</h3>
                    <div className="space-y-3">
                        {path.interviewPrep.resumeTips.map((tip, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                                <span className="text-blue-500 font-bold text-sm flex-shrink-0">✓</span>
                                <p className="text-sm text-gray-700">{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Project Ideas */}
            {activeSection === "projects" && (
                <div className="card p-5">
                    <h3 className="font-bold text-gray-900 mb-4">💡 Project Ideas for {path.title}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {path.interviewPrep.projectIdeas.map((idea, i) => (
                            <div key={i} className="p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">🚀</span>
                                    <p className="text-sm font-semibold text-gray-800">{idea}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* AI Question Generator */}
            {activeSection === "ai" && (
                <div className="space-y-4">
                    <div className="card p-5">
                        <h3 className="font-bold text-gray-900 mb-1">🤖 AI Interview Question Generator</h3>
                        <p className="text-xs text-gray-500 mb-4">Generate fresh interview questions using AI for {path.title}</p>
                        <div className="flex gap-3 flex-wrap">
                            {["mixed", "technical", "hr"].map(t => (
                                <button key={t} onClick={() => setAiType(t)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all capitalize ${aiType === t ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600 hover:border-indigo-300"}`}>
                                    {t === "mixed" ? "🔀 Mixed" : t === "technical" ? "⚙️ Technical" : "👔 HR"}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={generateAIQuestions}
                            disabled={aiLoading}
                            className="mt-4 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 text-sm"
                        >
                            {aiLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Generating questions...
                                </span>
                            ) : "✨ Generate 10 Questions"}
                        </button>
                    </div>

                    {aiQuestions.length > 0 && (
                        <div className="space-y-3">
                            {aiQuestions.map((q, i) => (
                                <div key={i} className="card p-0 overflow-hidden">
                                    <button
                                        onClick={() => setExpandedAiQ(expandedAiQ === i ? null : i)}
                                        className="w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-900">{q.question}</p>
                                            <div className="flex gap-2 mt-1">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIFF_COLORS[q.difficulty] || "bg-gray-100 text-gray-600"}`}>{q.difficulty}</span>
                                                <span className="text-[10px] text-gray-400 capitalize">{q.type}</span>
                                            </div>
                                        </div>
                                        <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5 transition-transform ${expandedAiQ === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {expandedAiQ === i && (
                                        <div className="px-4 pb-4 border-t border-gray-100 space-y-2">
                                            {q.hint && (
                                                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                                                    <div className="text-xs font-bold text-yellow-700 mb-1">💡 Hint</div>
                                                    <p className="text-sm text-gray-700">{q.hint}</p>
                                                </div>
                                            )}
                                            {q.sampleAnswer && (
                                                <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                                                    <div className="text-xs font-bold text-green-700 mb-1">✅ Sample Answer</div>
                                                    <p className="text-sm text-gray-700 leading-relaxed">{q.sampleAnswer}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
