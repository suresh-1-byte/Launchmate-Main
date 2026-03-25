"use client";
import { CareerPath } from "@/lib/learning-data";

interface Props {
    path: CareerPath;
    completedTopics: Set<string>;
    savedResources: Set<string>;
    streak: number;
    progressPct: number;
    completedCount: number;
    totalTopics: number;
    onTabChange: (tab: "roadmap" | "resources" | "practice" | "interview") => void;
}

export default function ProgressPanel({ path, completedTopics, savedResources, streak, progressPct, completedCount, totalTopics, onTabChange }: Props) {
    const allTopics = path.modules.flatMap(m => m.topics);
    const recentCompleted = allTopics.filter(t => completedTopics.has(t.id)).slice(-3);

    // Weekly chart data (simulated)
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weekData = [2, 3, 1, 4, 2, 5, 3];
    const maxVal = Math.max(...weekData);

    return (
        <div className="space-y-4 sticky top-20">
            {/* Progress Card */}
            <div className="card p-5">
                <h3 className="font-bold text-gray-900 mb-4 text-sm">📊 Your Progress</h3>

                {/* Circular Progress */}
                <div className="flex items-center justify-center mb-4">
                    <div className="relative w-28 h-28">
                        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                            <circle
                                cx="50" cy="50" r="40" fill="none"
                                stroke="#6366f1" strokeWidth="10"
                                strokeDasharray={`${2 * Math.PI * 40}`}
                                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressPct / 100)}`}
                                strokeLinecap="round"
                                className="transition-all duration-700"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-gray-900">{progressPct}%</span>
                            <span className="text-[10px] text-gray-500">Complete</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-indigo-50 rounded-xl p-3 text-center">
                        <div className="text-xl font-bold text-indigo-700">{completedCount}</div>
                        <div className="text-[10px] text-indigo-500 font-semibold">Topics Done</div>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-3 text-center">
                        <div className="text-xl font-bold text-orange-600">{totalTopics - completedCount}</div>
                        <div className="text-[10px] text-orange-500 font-semibold">Remaining</div>
                    </div>
                </div>

                {/* Streak */}
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <span className="text-2xl">🔥</span>
                    <div>
                        <div className="text-sm font-bold text-amber-700">{streak} Day Streak!</div>
                        <div className="text-[10px] text-amber-500">Keep it up! Come back tomorrow</div>
                    </div>
                </div>
            </div>

            {/* Weekly Activity Chart */}
            <div className="card p-5">
                <h3 className="font-bold text-gray-900 mb-4 text-sm">📈 Weekly Activity</h3>
                <div className="flex items-end gap-1.5 h-20">
                    {weekDays.map((day, i) => (
                        <div key={day} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full rounded-t-md bg-indigo-100 relative overflow-hidden" style={{ height: `${(weekData[i] / maxVal) * 64}px` }}>
                                <div className="absolute inset-0 bg-indigo-500 opacity-80" />
                            </div>
                            <span className="text-[9px] text-gray-400 font-medium">{day}</span>
                        </div>
                    ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-center">Topics studied per day this week</p>
            </div>

            {/* Module Progress */}
            <div className="card p-5">
                <h3 className="font-bold text-gray-900 mb-4 text-sm">🗺️ Module Progress</h3>
                <div className="space-y-3">
                    {path.modules.map(module => {
                        const done = module.topics.filter(t => completedTopics.has(t.id)).length;
                        const pct = module.topics.length > 0 ? Math.round((done / module.topics.length) * 100) : 0;
                        return (
                            <div key={module.id}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-semibold text-gray-700 truncate max-w-[140px]">{module.title}</span>
                                    <span className="text-xs text-indigo-600 font-bold">{pct}%</span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Saved Resources */}
            {savedResources.size > 0 && (
                <div className="card p-5">
                    <h3 className="font-bold text-gray-900 mb-3 text-sm">⭐ Saved Resources</h3>
                    <div className="text-center py-2">
                        <div className="text-3xl font-bold text-yellow-500">{savedResources.size}</div>
                        <div className="text-xs text-gray-500 mt-1">resources bookmarked</div>
                    </div>
                    <button
                        onClick={() => onTabChange("resources")}
                        className="w-full mt-3 text-xs font-bold text-indigo-700 bg-indigo-50 py-2 rounded-lg hover:bg-indigo-100 transition-all"
                    >
                        View All Resources →
                    </button>
                </div>
            )}

            {/* Quick Actions */}
            <div className="card p-5">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">⚡ Quick Actions</h3>
                <div className="space-y-2">
                    {[
                        { label: "📄 Resume Tips", tab: "interview" as const },
                        { label: "🎯 Interview Prep", tab: "interview" as const },
                        { label: "💻 Practice Now", tab: "practice" as const },
                    ].map(action => (
                        <button
                            key={action.label}
                            onClick={() => onTabChange(action.tab)}
                            className="w-full text-left text-xs font-semibold text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-100 transition-all"
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
