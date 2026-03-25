"use client";
import { useState } from "react";
import { CareerPath, Resource } from "@/lib/learning-data";

interface Props {
    path: CareerPath;
    savedResources: Set<string>;
    onSave: (resourceId: string) => void;
}

const TYPE_TABS = [
    { key: "all", label: "All", icon: "📦" },
    { key: "article", label: "Learn", icon: "📄" },
    { key: "video", label: "Watch", icon: "▶️" },
    { key: "practice", label: "Practice", icon: "💻" },
    { key: "course", label: "Courses", icon: "🎓" },
];

const TYPE_COLORS: Record<string, string> = {
    article: "bg-blue-50 text-blue-700 border-blue-200",
    video: "bg-red-50 text-red-700 border-red-200",
    practice: "bg-green-50 text-green-700 border-green-200",
    course: "bg-purple-50 text-purple-700 border-purple-200",
    interview: "bg-orange-50 text-orange-700 border-orange-200",
};

const TYPE_ICONS: Record<string, string> = {
    article: "📄", video: "▶️", practice: "💻", course: "🎓", interview: "🎯",
};

export default function ResourceTabs({ path, savedResources, onSave }: Props) {
    const [activeType, setActiveType] = useState("all");

    // Gather all resources from all topics
    const allResources: (Resource & { topicTitle: string })[] = path.modules.flatMap(m =>
        m.topics.flatMap(t =>
            t.resources.map(r => ({ ...r, topicTitle: t.title }))
        )
    );

    const filtered = activeType === "all" ? allResources : allResources.filter(r => r.type === activeType);

    const counts: Record<string, number> = { all: allResources.length };
    allResources.forEach(r => { counts[r.type] = (counts[r.type] || 0) + 1; });

    return (
        <div className="space-y-4">
            {/* Type Filter Tabs */}
            <div className="card p-4">
                <div className="flex gap-2 flex-wrap">
                    {TYPE_TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveType(tab.key)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${activeType === tab.key ? "bg-indigo-600 text-white border-indigo-600 shadow" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"}`}
                        >
                            {tab.icon} {tab.label}
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeType === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                                {counts[tab.key] || 0}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Resource Cards */}
            <div className="grid grid-cols-1 gap-3">
                {filtered.map(res => (
                    <div key={res.id} className="card p-4 hover:shadow-md transition-all group">
                        <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 border ${TYPE_COLORS[res.type] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                                {TYPE_ICONS[res.type] || "📦"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <a href={res.url} target="_blank" rel="noopener noreferrer"
                                    className="text-sm font-bold text-gray-900 group-hover:text-indigo-700 transition-colors line-clamp-1 hover:underline">
                                    {res.title}
                                </a>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${TYPE_COLORS[res.type]}`}>
                                        {res.type}
                                    </span>
                                    {res.platform && <span className="text-[10px] text-gray-400">{res.platform}</span>}
                                    <span className="text-[10px] text-gray-400">· {res.topicTitle}</span>
                                    {res.isFree && <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded-full">FREE</span>}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={() => onSave(res.id)}
                                    className={`text-xl transition-all ${savedResources.has(res.id) ? "text-yellow-500" : "text-gray-200 hover:text-yellow-400"}`}
                                    title={savedResources.has(res.id) ? "Unsave" : "Save resource"}
                                >
                                    {savedResources.has(res.id) ? "★" : "☆"}
                                </button>
                                <a href={res.url} target="_blank" rel="noopener noreferrer"
                                    className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-100 transition-all">
                                    Open →
                                </a>
                            </div>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <div className="text-4xl mb-3">📭</div>
                        <p className="text-sm font-semibold">No resources of this type yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
