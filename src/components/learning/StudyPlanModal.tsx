"use client";
import { useState } from "react";

interface Props {
    onClose: () => void;
}

interface StudyPlan {
    overview: string;
    totalWeeks: number;
    weeklyTargets: {
        week: number;
        theme: string;
        goals: string[];
        dailyPlan: { day: string; tasks: string[]; duration: string }[];
        resources: string[];
    }[];
    keyMilestones: string[];
    tips: string[];
}

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const TIME_OPTIONS = ["1", "2", "3", "4", "5", "6"];
const ROLES = [
    "Software Developer", "Data Scientist", "Web Developer",
    "Full Stack Developer", "ML Engineer", "DevOps Engineer",
    "Android Developer", "Product Manager", "Government Exam (SSC/UPSC)",
    "Bank PO", "MBA (CAT)", "Core Engineering (GATE)"
];

export default function StudyPlanModal({ onClose }: Props) {
    const [step, setStep] = useState<"form" | "loading" | "result">("form");
    const [targetRole, setTargetRole] = useState("");
    const [skillLevel, setSkillLevel] = useState("Beginner");
    const [dailyTime, setDailyTime] = useState("2");
    const [plan, setPlan] = useState<StudyPlan | null>(null);
    const [error, setError] = useState("");
    const [activeWeek, setActiveWeek] = useState(0);

    const generate = async () => {
        if (!targetRole) { setError("Please select a target role"); return; }
        setError("");
        setStep("loading");
        try {
            const res = await fetch("/api/learning/study-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetRole, skillLevel, dailyTime }),
            });
            const data = await res.json();
            if (data.success) {
                setPlan(data.data.plan);
                setStep("result");
            } else {
                setError(data.error || "Failed to generate plan");
                setStep("form");
            }
        } catch (e) {
            setError("Network error. Please try again.");
            setStep("form");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <div>
                        <h2 className="font-bold text-lg">🤖 AI Study Plan Generator</h2>
                        <p className="text-xs text-white/70 mt-0.5">Personalized daily & weekly learning plan</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all text-white font-bold">✕</button>
                </div>

                <div className="overflow-y-auto flex-1">
                    {/* Form */}
                    {step === "form" && (
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">🎯 Target Job Role</label>
                                <select
                                    value={targetRole}
                                    onChange={e => setTargetRole(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">Select your target role...</option>
                                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">📊 Current Skill Level</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {SKILL_LEVELS.map(level => (
                                        <button
                                            key={level}
                                            onClick={() => setSkillLevel(level)}
                                            className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${skillLevel === level ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-600 hover:border-indigo-300"}`}
                                        >
                                            {level === "Beginner" ? "🌱" : level === "Intermediate" ? "🌿" : "🌳"} {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">⏰ Available Time Per Day</label>
                                <div className="grid grid-cols-6 gap-2">
                                    {TIME_OPTIONS.map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setDailyTime(t)}
                                            className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${dailyTime === t ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-600 hover:border-indigo-300"}`}
                                        >
                                            {t}h
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</p>}

                            <button
                                onClick={generate}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 transition-all text-sm shadow-lg"
                            >
                                ✨ Generate My Study Plan
                            </button>
                        </div>
                    )}

                    {/* Loading */}
                    {step === "loading" && (
                        <div className="flex flex-col items-center justify-center py-20 px-6">
                            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-6" />
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Creating Your Plan...</h3>
                            <p className="text-sm text-gray-500 text-center">AI is generating a personalized study plan for <strong>{targetRole}</strong></p>
                            <div className="mt-6 space-y-2 w-full max-w-xs">
                                {["Analyzing your skill level...", "Building daily schedule...", "Attaching resources..."].map((msg, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                                        <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                        </div>
                                        {msg}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Result */}
                    {step === "result" && plan && (
                        <div className="p-6 space-y-5">
                            {/* Overview */}
                            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">🎯</span>
                                    <span className="font-bold text-indigo-800">{targetRole} · {skillLevel} · {dailyTime}h/day</span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">{plan.overview}</p>
                            </div>

                            {/* Key Milestones */}
                            {plan.keyMilestones?.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-3 text-sm">🏆 Key Milestones</h3>
                                    <div className="space-y-2">
                                        {plan.keyMilestones.map((m, i) => (
                                            <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                <span className="text-indigo-500 font-bold mt-0.5">→</span> {m}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Weekly Plan */}
                            {plan.weeklyTargets?.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-3 text-sm">📅 Weekly Plan</h3>
                                    {/* Week Tabs */}
                                    <div className="flex gap-2 flex-wrap mb-4">
                                        {plan.weeklyTargets.map((w, i) => (
                                            <button key={i} onClick={() => setActiveWeek(i)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeWeek === i ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                                                Week {w.week}
                                            </button>
                                        ))}
                                    </div>

                                    {plan.weeklyTargets[activeWeek] && (() => {
                                        const week = plan.weeklyTargets[activeWeek];
                                        return (
                                            <div className="space-y-3">
                                                <div className="p-3 bg-indigo-50 rounded-xl">
                                                    <div className="font-bold text-indigo-800 text-sm mb-2">{week.theme}</div>
                                                    <div className="space-y-1">
                                                        {week.goals?.map((g, i) => (
                                                            <div key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                                                                <span className="text-indigo-500">✓</span> {g}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    {week.dailyPlan?.map((day, i) => (
                                                        <div key={i} className="p-3 border border-gray-200 rounded-xl">
                                                            <div className="flex items-center justify-between mb-1.5">
                                                                <span className="text-xs font-bold text-gray-900">{day.day}</span>
                                                                <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">⏱ {day.duration}</span>
                                                            </div>
                                                            <div className="space-y-1">
                                                                {day.tasks?.map((task, j) => (
                                                                    <div key={j} className="text-xs text-gray-600 flex items-start gap-1.5">
                                                                        <span className="text-gray-400 mt-0.5">•</span> {task}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}

                            {/* Tips */}
                            {plan.tips?.length > 0 && (
                                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                                    <h3 className="font-bold text-amber-800 mb-2 text-sm">💡 Pro Tips</h3>
                                    <div className="space-y-1">
                                        {plan.tips.map((tip, i) => (
                                            <div key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                                                <span className="text-amber-500">→</span> {tip}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => setStep("form")}
                                className="w-full py-3 border-2 border-indigo-200 text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-all text-sm"
                            >
                                ← Generate Another Plan
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
