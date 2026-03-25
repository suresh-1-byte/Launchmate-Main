"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { CAREER_PATHS, CareerPath } from "@/lib/learning-data";
import CareerSelector from "@/components/learning/CareerSelector";
import RoadmapSection from "@/components/learning/RoadmapSection";
import ResourceTabs from "@/components/learning/ResourceTabs";
import ProgressPanel from "@/components/learning/ProgressPanel";
import InterviewPrep from "@/components/learning/InterviewPrep";
import StudyPlanModal from "@/components/learning/StudyPlanModal";

export default function LearningPage() {
    const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null);
    const [activeTab, setActiveTab] = useState<"roadmap" | "resources" | "practice" | "interview">("roadmap");
    const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
    const [savedResources, setSavedResources] = useState<Set<string>>(new Set());
    const [showStudyPlan, setShowStudyPlan] = useState(false);
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(false);

    // Load progress from API
    useEffect(() => {
        const loadProgress = async () => {
            try {
                const [progressRes, savedRes] = await Promise.all([
                    fetch("/api/learning/progress"),
                    fetch("/api/learning/saved"),
                ]);
                const progressData = await progressRes.json();
                const savedData = await savedRes.json();
                if (progressData.success) {
                    setCompletedTopics(new Set(progressData.data.filter((p: any) => p.isCompleted).map((p: any) => p.topicId)));
                }
                if (savedData.success) {
                    setSavedResources(new Set(savedData.data.map((s: any) => s.resourceId)));
                }
            } catch (e) { /* silent */ }
        };
        loadProgress();
        // Simulate streak
        setStreak(Math.floor(Math.random() * 7) + 1);
    }, []);

    const handleTopicToggle = async (topicId: string) => {
        const isCompleted = !completedTopics.has(topicId);
        const next = new Set(completedTopics);
        isCompleted ? next.add(topicId) : next.delete(topicId);
        setCompletedTopics(next);
        try {
            await fetch("/api/learning/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topicId, isCompleted }),
            });
        } catch (e) { /* silent */ }
    };

    const handleSaveResource = async (resourceId: string) => {
        const isSaved = savedResources.has(resourceId);
        const next = new Set(savedResources);
        isSaved ? next.delete(resourceId) : next.add(resourceId);
        setSavedResources(next);
        try {
            await fetch("/api/learning/saved", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resourceId, action: isSaved ? "unsave" : "save" }),
            });
        } catch (e) { /* silent */ }
    };

    const totalTopics = selectedPath?.modules.flatMap(m => m.topics).length || 0;
    const completedCount = selectedPath
        ? selectedPath.modules.flatMap(m => m.topics).filter(t => completedTopics.has(t.id)).length
        : 0;
    const progressPct = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

    return (
        <ProtectedRoute>
            <Navbar />
            <div className="page-container">
                <div className="page-content max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Learning Hub</h1>
                        <p className="text-sm text-gray-500 mt-1">Your personalized career preparation center</p>
                    </div>

                    {/* AI Mentor Banner */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 mb-6 text-white">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                        </div>
                        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-2xl">🤖</span>
                                    <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">AI POWERED</span>
                                </div>
                                <h2 className="text-xl font-bold">Generate Your Personal Study Plan</h2>
                                <p className="text-sm text-white/80 mt-1">Tell the AI your goal, skill level & time — get a custom daily plan</p>
                            </div>
                            <button
                                onClick={() => setShowStudyPlan(true)}
                                className="flex-shrink-0 bg-white text-purple-700 font-bold px-6 py-3 rounded-xl hover:bg-purple-50 transition-all shadow-lg text-sm"
                            >
                                ✨ Generate Plan
                            </button>
                        </div>
                    </div>

                    {/* Career Path Selector */}
                    {!selectedPath ? (
                        <CareerSelector paths={CAREER_PATHS} onSelect={setSelectedPath} />
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Main Content */}
                            <div className="lg:col-span-8 space-y-4">
                                {/* Selected Path Header */}
                                <div className={`rounded-2xl bg-gradient-to-r ${selectedPath.gradient} p-5 text-white`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{selectedPath.icon}</span>
                                            <div>
                                                <h2 className="text-lg font-bold">{selectedPath.title}</h2>
                                                <p className="text-sm text-white/80">{selectedPath.description}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => { setSelectedPath(null); setActiveTab("roadmap"); }}
                                            className="text-white/70 hover:text-white text-sm bg-white/10 px-3 py-1.5 rounded-lg transition-all"
                                        >
                                            ← Change
                                        </button>
                                    </div>
                                    <div className="mt-4">
                                        <div className="flex justify-between text-xs text-white/70 mb-1">
                                            <span>Overall Progress</span>
                                            <span>{completedCount}/{totalTopics} topics · {progressPct}%</span>
                                        </div>
                                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                            <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Tab Navigation */}
                                <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
                                    {[
                                        { key: "roadmap", label: "🗺️ Roadmap" },
                                        { key: "resources", label: "📚 Resources" },
                                        { key: "practice", label: "💪 Practice" },
                                        { key: "interview", label: "🎯 Interview" },
                                    ].map(tab => (
                                        <button
                                            key={tab.key}
                                            onClick={() => setActiveTab(tab.key as any)}
                                            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all ${activeTab === tab.key ? "bg-indigo-600 text-white shadow" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Tab Content */}
                                {activeTab === "roadmap" && (
                                    <RoadmapSection
                                        path={selectedPath}
                                        completedTopics={completedTopics}
                                        onToggle={handleTopicToggle}
                                        savedResources={savedResources}
                                        onSave={handleSaveResource}
                                    />
                                )}
                                {activeTab === "resources" && (
                                    <ResourceTabs
                                        path={selectedPath}
                                        savedResources={savedResources}
                                        onSave={handleSaveResource}
                                    />
                                )}
                                {activeTab === "practice" && (
                                    <PracticeSection path={selectedPath} />
                                )}
                                {activeTab === "interview" && (
                                    <InterviewPrep path={selectedPath} />
                                )}
                            </div>

                            {/* Progress Panel */}
                            <div className="lg:col-span-4">
                                <ProgressPanel
                                    path={selectedPath}
                                    completedTopics={completedTopics}
                                    savedResources={savedResources}
                                    streak={streak}
                                    progressPct={progressPct}
                                    completedCount={completedCount}
                                    totalTopics={totalTopics}
                                    onTabChange={setActiveTab}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showStudyPlan && <StudyPlanModal onClose={() => setShowStudyPlan(false)} />}
        </ProtectedRoute>
    );
}

// Inline Practice Section
function PracticeSection({ path }: { path: CareerPath }) {
    return (
        <div className="space-y-4">
            <div className="card p-5">
                <h3 className="font-bold text-gray-900 mb-4">🏋️ Practice Platforms</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {path.practicePlatforms.map((p, i) => (
                        <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
                            className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group">
                            <span className="text-2xl">{p.icon}</span>
                            <div>
                                <div className="font-bold text-sm text-gray-900 group-hover:text-indigo-700">{p.name}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{p.description}</div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            <div className="card p-5">
                <h3 className="font-bold text-gray-900 mb-4">📋 Topic-wise Practice Links</h3>
                <div className="space-y-3">
                    {path.modules.flatMap(m => m.topics).filter(t => t.practiceLinks && t.practiceLinks.length > 0).map(topic => (
                        <div key={topic.id}>
                            <div className="text-xs font-bold text-gray-500 uppercase mb-2">{topic.title}</div>
                            <div className="flex flex-wrap gap-2">
                                {topic.practiceLinks?.map((pl, i) => (
                                    <a key={i} href={pl.url} target="_blank" rel="noopener noreferrer"
                                        className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-all font-medium">
                                        {pl.platform} →
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                    {path.modules.flatMap(m => m.topics).every(t => !t.practiceLinks?.length) && (
                        <p className="text-sm text-gray-400">Practice via the platforms above for this career path.</p>
                    )}
                </div>
            </div>

            <div className="card p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <h3 className="font-bold text-gray-900 mb-2">🎯 Recommended for {path.title}</h3>
                <div className="flex flex-wrap gap-2 mt-3">
                    {path.skills.map((skill, i) => (
                        <span key={i} className="text-xs bg-white border border-green-200 text-green-700 px-3 py-1.5 rounded-full font-semibold">{skill}</span>
                    ))}
                </div>
                <div className="mt-4 text-sm text-gray-600">
                    <span className="font-bold">Avg Salary:</span> {path.avgSalary}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                    {path.jobRoles.map((role, i) => (
                        <span key={i} className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md font-medium">{role}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}
