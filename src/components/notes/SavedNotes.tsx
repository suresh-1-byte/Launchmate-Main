"use client";
import { useState } from "react";
import { GeneratedNote } from "@/app/notes/page";

interface Props {
    notes: GeneratedNote[];
    onView: (note: GeneratedNote) => void;
    onDelete: (id: string) => void;
}

const DIFF_COLORS: Record<string, string> = {
    full: "bg-blue-100 text-blue-700",
    short: "bg-green-100 text-green-700",
    revision: "bg-orange-100 text-orange-700",
};

const DIFF_LABELS: Record<string, string> = {
    full: "Full Notes",
    short: "Short Notes",
    revision: "Revision",
};

export default function SavedNotes({ notes, onView, onDelete }: Props) {
    const [search, setSearch] = useState("");
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const filtered = notes.filter(n =>
        n.subject?.toLowerCase().includes(search.toLowerCase()) ||
        n.topic?.toLowerCase().includes(search.toLowerCase())
    );

    if (notes.length === 0) {
        return (
            <div className="card p-12 text-center">
                <div className="w-20 h-20 bg-violet-50 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">📂</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Saved Notes Yet</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                    Generate notes and click "Save" to store them here for future reference.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative">
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by subject or topic..."
                    className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "Total Notes", value: notes.length, color: "text-violet-700 bg-violet-50" },
                    { label: "Subjects", value: new Set(notes.map(n => n.subject)).size, color: "text-blue-700 bg-blue-50" },
                    {
                        label: "This Week", value: notes.filter(n => {
                            const d = new Date(n.createdAt || n.generatedAt || "");
                            const week = new Date(); week.setDate(week.getDate() - 7);
                            return d > week;
                        }).length, color: "text-green-700 bg-green-50"
                    },
                ].map(stat => (
                    <div key={stat.label} className={`card p-4 text-center ${stat.color}`}>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-xs font-semibold mt-0.5 opacity-80">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Notes Grid */}
            {filtered.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <p className="text-sm">No notes match your search</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map(note => (
                        <div key={note.id} className="card p-5 hover:shadow-lg transition-all group hover:-translate-y-0.5 duration-200">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                                    📄
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => onView(note)}
                                        className="p-1.5 text-gray-400 hover:text-violet-600 transition-colors"
                                        title="View notes"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                    {note.id && (
                                        confirmDelete === note.id ? (
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => { onDelete(note.id!); setConfirmDelete(null); }}
                                                    className="text-[10px] bg-red-600 text-white px-2 py-1 rounded font-bold">Yes</button>
                                                <button onClick={() => setConfirmDelete(null)}
                                                    className="text-[10px] bg-gray-200 text-gray-700 px-2 py-1 rounded font-bold">No</button>
                                            </div>
                                        ) : (
                                            <button onClick={() => setConfirmDelete(note.id!)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-violet-700 transition-colors line-clamp-2">
                                {note.topic}
                            </h3>
                            <p className="text-xs text-gray-500 mb-3">{note.subject}</p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {note.difficulty && (
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIFF_COLORS[note.difficulty] || "bg-gray-100 text-gray-600"}`}>
                                        {DIFF_LABELS[note.difficulty] || note.difficulty}
                                    </span>
                                )}
                                {note.unit && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{note.unit}</span>}
                                {note.regulation && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Reg {note.regulation}</span>}
                            </div>

                            {/* Date */}
                            <div className="text-[10px] text-gray-400 mb-3">
                                {new Date(note.createdAt || note.generatedAt || "").toLocaleDateString("en-IN", {
                                    day: "numeric", month: "short", year: "numeric"
                                })}
                            </div>

                            {/* View Button */}
                            <button
                                onClick={() => onView(note)}
                                className="w-full py-2 bg-violet-50 text-violet-700 text-xs font-bold rounded-lg hover:bg-violet-100 transition-all"
                            >
                                View Notes →
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
