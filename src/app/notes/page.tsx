"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotesForm from "@/components/notes/NotesForm";
import NotesViewer from "@/components/notes/NotesViewer";
import SavedNotes from "@/components/notes/SavedNotes";

export interface GeneratedNote {
    id?: string;
    subject: string;
    topic: string;
    unit?: string;
    regulation?: string;
    difficulty: string;
    notes: string;
    generatedAt?: string;
    createdAt?: string;
}

export default function NotesPage() {
    const [activeTab, setActiveTab] = useState<"generate" | "saved">("generate");
    const [currentNote, setCurrentNote] = useState<GeneratedNote | null>(null);
    const [savedNotes, setSavedNotes] = useState<GeneratedNote[]>([]);
    const [generating, setGenerating] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState("");
    const viewerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadSavedNotes();
    }, []);

    const loadSavedNotes = async () => {
        try {
            const res = await fetch("/api/notes/saved");
            const data = await res.json();
            if (data.success) setSavedNotes(data.data);
        } catch { /* silent */ }
    };

    const handleGenerate = async (formData: {
        subject: string;
        regulation: string;
        unit: string;
        topic: string;
        difficulty: string;
        department: string;
    }) => {
        setGenerating(true);
        setError("");
        setCurrentNote(null);
        setSaveSuccess(false);

        try {
            const res = await fetch("/api/notes/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                setCurrentNote(data.data);
                // Scroll to viewer
                setTimeout(() => viewerRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
            } else {
                setError(data.error || "Failed to generate notes");
            }
        } catch {
            setError("Network error. Please check your connection.");
        } finally {
            setGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!currentNote) return;
        setSaving(true);
        try {
            const res = await fetch("/api/notes/saved", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentNote),
            });
            const data = await res.json();
            if (data.success) {
                setSaveSuccess(true);
                loadSavedNotes();
                setTimeout(() => setSaveSuccess(false), 3000);
            }
        } catch { /* silent */ }
        finally { setSaving(false); }
    };

    const handleDelete = async (id: string) => {
        try {
            await fetch("/api/notes/saved", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            setSavedNotes(prev => prev.filter(n => n.id !== id));
        } catch { /* silent */ }
    };

    const handleViewSaved = (note: GeneratedNote) => {
        setCurrentNote(note);
        setActiveTab("generate");
        setTimeout(() => viewerRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    };

    return (
        <ProtectedRoute>
            <Navbar />
            <div className="page-container">
                <div className="page-content max-w-7xl mx-auto">

                    {/* Hero Header */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-6 mb-6 text-white">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute -top-8 -right-8 w-48 h-48 bg-white rounded-full" />
                            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white rounded-full" />
                        </div>
                        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-3xl">📚</span>
                                    <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full tracking-wide">AI NOTES GENERATOR</span>
                                </div>
                                <h1 className="text-2xl font-bold">Academic Notes Generator</h1>
                                <p className="text-sm text-white/80 mt-1">
                                    Anna University exam-ready notes • Original content • Instant generation
                                </p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {["2-Mark Q&A", "16-Mark Questions", "Exam Tips", "Key Formulas", "Quick Revision"].map(tag => (
                                        <span key={tag} className="text-[10px] bg-white/15 px-2.5 py-1 rounded-full font-medium">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-shrink-0 text-right">
                                <div className="text-3xl font-bold">{savedNotes.length}</div>
                                <div className="text-xs text-white/70">Notes Saved</div>
                            </div>
                        </div>
                    </div>

                    {/* Tab Bar */}
                    <div className="flex gap-2 mb-6">
                        {[
                            { key: "generate", label: "✨ Generate Notes", count: null },
                            { key: "saved", label: "📂 My Notes", count: savedNotes.length },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as any)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.key
                                    ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                                    : "bg-white text-gray-600 border border-gray-200 hover:border-violet-300 hover:text-violet-700"
                                    }`}
                            >
                                {tab.label}
                                {tab.count !== null && tab.count > 0 && (
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.key ? "bg-white/20" : "bg-violet-100 text-violet-700"}`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {activeTab === "generate" && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Form Panel */}
                            <div className="lg:col-span-4">
                                <NotesForm
                                    onGenerate={handleGenerate}
                                    generating={generating}
                                />
                            </div>

                            {/* Notes Viewer */}
                            <div className="lg:col-span-8" ref={viewerRef}>
                                {generating && <GeneratingLoader />}

                                {error && !generating && (
                                    <div className="card p-6 border-red-200 bg-red-50">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">⚠️</span>
                                            <div>
                                                <div className="font-bold text-red-700">Generation Failed</div>
                                                <div className="text-sm text-red-600 mt-0.5">{error}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {!generating && !error && !currentNote && (
                                    <EmptyState />
                                )}

                                {!generating && currentNote && (
                                    <NotesViewer
                                        note={currentNote}
                                        onSave={handleSave}
                                        saving={saving}
                                        saveSuccess={saveSuccess}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "saved" && (
                        <SavedNotes
                            notes={savedNotes}
                            onView={handleViewSaved}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}

function GeneratingLoader() {
    const steps = [
        "Analyzing topic structure...",
        "Generating key definitions...",
        "Creating exam questions...",
        "Writing revision summary...",
        "Adding exam tips...",
    ];
    const [step, setStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStep(prev => (prev + 1) % steps.length);
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="card p-10 flex flex-col items-center justify-center min-h-[400px]">
            <div className="relative mb-6">
                <div className="w-20 h-20 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-2xl">📚</div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Generating Your Notes...</h3>
            <p className="text-sm text-violet-600 font-medium animate-pulse">{steps[step]}</p>
            <div className="mt-6 flex gap-1.5">
                {steps.map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? "w-6 bg-violet-600" : "w-1.5 bg-gray-200"}`} />
                ))}
            </div>
            <p className="text-xs text-gray-400 mt-4">AI is writing original, exam-ready content for you</p>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="card p-10 flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-20 h-20 bg-violet-50 rounded-2xl flex items-center justify-center text-4xl mb-4">📝</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to Generate Notes</h3>
            <p className="text-sm text-gray-500 max-w-xs">
                Fill in the form on the left with your subject, topic, and preferences — then click Generate!
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-sm">
                {[
                    { icon: "✏️", label: "2-Mark Q&A" },
                    { icon: "📝", label: "16-Mark Questions" },
                    { icon: "⚡", label: "Quick Revision" },
                    { icon: "🎯", label: "Exam Tips" },
                ].map(item => (
                    <div key={item.label} className="flex items-center gap-2 p-3 bg-violet-50 rounded-xl text-sm text-violet-700 font-medium">
                        <span>{item.icon}</span> {item.label}
                    </div>
                ))}
            </div>
        </div>
    );
}
