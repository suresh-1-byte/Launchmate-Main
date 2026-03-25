"use client";
import { useState } from "react";
import { CareerPath } from "@/lib/learning-data";

interface Props {
    path: CareerPath;
    completedTopics: Set<string>;
    onToggle: (topicId: string) => void;
    savedResources: Set<string>;
    onSave: (resourceId: string) => void;
}

const LEVEL_COLORS: Record<string, string> = {
    beginner: "bg-green-100 text-green-700 border-green-200",
    intermediate: "bg-blue-100 text-blue-700 border-blue-200",
    advanced: "bg-purple-100 text-purple-700 border-purple-200",
};

const RESOURCE_ICONS: Record<string, string> = {
    article: "📄",
    video: "▶️",
    course: "🎓",
    practice: "💻",
    interview: "🎯",
};

export default function RoadmapSection({ path, completedTopics, onToggle, savedResources, onSave }: Props) {
    const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set([path.modules[0]?.id]));
    const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
    const [activeVideo, setActiveVideo] = useState<string | null>(null);

    const toggleModule = (id: string) => {
        const next = new Set(expandedModules);
        next.has(id) ? next.delete(id) : next.add(id);
        setExpandedModules(next);
    };

    const toggleTopic = (id: string) => {
        const next = new Set(expandedTopics);
        next.has(id) ? next.delete(id) : next.add(id);
        setExpandedTopics(next);
    };

    return (
        <div className="space-y-4">
            {path.modules.map((module, moduleIdx) => {
                const isOpen = expandedModules.has(module.id);
                const moduleCompleted = module.topics.filter(t => completedTopics.has(t.id)).length;
                const modulePct = module.topics.length > 0 ? Math.round((moduleCompleted / module.topics.length) * 100) : 0;

                return (
                    <div key={module.id} className="card overflow-hidden p-0">
                        {/* Module Header */}
                        <button
                            onClick={() => toggleModule(module.id)}
                            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                    {moduleIdx + 1}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-gray-900 text-sm">{module.title}</h3>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${LEVEL_COLORS[module.level]}`}>
                                            {module.level}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <span>⏱ {module.duration}</span>
                                        <span>📚 {module.topics.length} topics</span>
                                        <span className="text-indigo-600 font-semibold">{modulePct}% done</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden hidden sm:block">
                                    <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${modulePct}%` }} />
                                </div>
                                <svg className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </button>

                        {/* Topics */}
                        {isOpen && (
                            <div className="border-t border-gray-100">
                                {module.topics.map((topic, topicIdx) => {
                                    const isCompleted = completedTopics.has(topic.id);
                                    const isTopicOpen = expandedTopics.has(topic.id);

                                    return (
                                        <div key={topic.id} className={`border-b border-gray-50 last:border-0 ${isCompleted ? "bg-green-50/30" : ""}`}>
                                            <div className="flex items-start gap-3 p-4">
                                                {/* Checkbox */}
                                                <button
                                                    onClick={() => onToggle(topic.id)}
                                                    className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${isCompleted ? "bg-green-500 border-green-500" : "border-gray-300 hover:border-green-400"}`}
                                                >
                                                    {isCompleted && (
                                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </button>

                                                <div className="flex-1 min-w-0">
                                                    <button
                                                        onClick={() => toggleTopic(topic.id)}
                                                        className="text-left w-full"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-gray-400 font-mono">{moduleIdx + 1}.{topicIdx + 1}</span>
                                                            <span className={`text-sm font-semibold ${isCompleted ? "line-through text-gray-400" : "text-gray-900"}`}>
                                                                {topic.title}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-0.5 ml-8">{topic.description}</p>
                                                        <div className="flex items-center gap-3 mt-1 ml-8 text-xs text-gray-400">
                                                            <span>⏱ {topic.duration}</span>
                                                            <span>📦 {topic.resources.length} resources</span>
                                                            {topic.videoId && <span>▶️ Video</span>}
                                                        </div>
                                                    </button>

                                                    {/* Expanded Topic Content */}
                                                    {isTopicOpen && (
                                                        <div className="mt-4 ml-8 space-y-3">
                                                            {/* Video Player */}
                                                            {topic.videoId && (
                                                                <div>
                                                                    {activeVideo === topic.id ? (
                                                                        <div className="rounded-xl overflow-hidden aspect-video bg-black">
                                                                            <iframe
                                                                                src={`https://www.youtube.com/embed/${topic.videoId}?autoplay=1`}
                                                                                className="w-full h-full"
                                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                                allowFullScreen
                                                                            />
                                                                        </div>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => setActiveVideo(topic.id)}
                                                                            className="w-full flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-all text-left"
                                                                        >
                                                                            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                                                    <path d="M8 5v14l11-7z" />
                                                                                </svg>
                                                                            </div>
                                                                            <div>
                                                                                <div className="text-sm font-bold text-red-700">Watch Video Lesson</div>
                                                                                <div className="text-xs text-red-500">Click to play embedded YouTube video</div>
                                                                            </div>
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* Resources */}
                                                            <div className="space-y-2">
                                                                {topic.resources.map(res => (
                                                                    <div key={res.id} className="flex items-center gap-2 p-2.5 bg-white border border-gray-200 rounded-lg hover:border-indigo-200 transition-all">
                                                                        <span className="text-base">{RESOURCE_ICONS[res.type]}</span>
                                                                        <div className="flex-1 min-w-0">
                                                                            <a href={res.url} target="_blank" rel="noopener noreferrer"
                                                                                className="text-xs font-semibold text-indigo-700 hover:underline line-clamp-1">
                                                                                {res.title}
                                                                            </a>
                                                                            <div className="text-[10px] text-gray-400">{res.platform} · {res.type}</div>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => onSave(res.id)}
                                                                            className={`text-lg transition-all ${savedResources.has(res.id) ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400"}`}
                                                                            title={savedResources.has(res.id) ? "Unsave" : "Save"}
                                                                        >
                                                                            {savedResources.has(res.id) ? "★" : "☆"}
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => toggleTopic(topic.id)}
                                                    className="text-gray-300 hover:text-gray-600 transition-colors mt-0.5"
                                                >
                                                    <svg className={`w-4 h-4 transition-transform ${isTopicOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
