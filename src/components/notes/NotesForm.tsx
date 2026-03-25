"use client";
import { useState } from "react";

interface Props {
    onGenerate: (data: {
        subject: string;
        regulation: string;
        unit: string;
        topic: string;
        difficulty: string;
        department: string;
    }) => void;
    generating: boolean;
}

const DEPARTMENTS = [
    "Computer Science (CSE)",
    "Information Technology (IT)",
    "Electronics & Communication (ECE)",
    "Electrical Engineering (EEE)",
    "Mechanical Engineering (MECH)",
    "Civil Engineering (CIVIL)",
    "Biomedical Engineering (BME)",
    "Artificial Intelligence & ML (AI&ML)",
    "Data Science (DS)",
    "Other",
];

const REGULATIONS = ["2021", "2019", "2017", "2013", "Other"];

const DIFFICULTIES = [
    { value: "short", label: "Short Notes", desc: "Concise, quick read", icon: "⚡" },
    { value: "full", label: "Full Notes", desc: "Detailed, exam-ready", icon: "📖" },
    { value: "revision", label: "Revision Notes", desc: "Bullet points only", icon: "🔄" },
];

const POPULAR_SUBJECTS: Record<string, string[]> = {
    "Computer Science (CSE)": [
        "Data Structures", "Operating Systems", "Computer Networks",
        "Database Management Systems", "Theory of Computation",
        "Compiler Design", "Software Engineering", "Computer Architecture",
        "Artificial Intelligence", "Machine Learning",
    ],
    "Electronics & Communication (ECE)": [
        "Digital Electronics", "Signals and Systems", "Communication Systems",
        "VLSI Design", "Microprocessors", "Electromagnetic Theory",
        "Control Systems", "Analog Circuits",
    ],
    "Mechanical Engineering (MECH)": [
        "Engineering Thermodynamics", "Fluid Mechanics", "Strength of Materials",
        "Manufacturing Technology", "Heat Transfer", "Machine Design",
        "Dynamics of Machinery", "Engineering Mechanics",
    ],
    "Electrical Engineering (EEE)": [
        "Circuit Theory", "Electrical Machines", "Power Systems",
        "Control Systems", "Power Electronics", "Measurements & Instrumentation",
    ],
};

const COMMON_TOPICS: Record<string, string[]> = {
    "Data Structures": ["Arrays and Linked Lists", "Stacks and Queues", "Trees and Binary Trees", "Graphs", "Sorting Algorithms", "Hashing"],
    "Operating Systems": ["Process Management", "Memory Management", "File Systems", "Deadlocks", "CPU Scheduling", "Virtual Memory"],
    "Computer Networks": ["OSI Model", "TCP/IP Protocol", "Network Layer", "Transport Layer", "Application Layer", "Network Security"],
    "Database Management Systems": ["ER Model", "Relational Algebra", "SQL", "Normalization", "Transaction Management", "Indexing"],
};

export default function NotesForm({ onGenerate, generating }: Props) {
    const [department, setDepartment] = useState("Computer Science (CSE)");
    const [subject, setSubject] = useState("");
    const [customSubject, setCustomSubject] = useState("");
    const [regulation, setRegulation] = useState("2021");
    const [unit, setUnit] = useState("");
    const [topic, setTopic] = useState("");
    const [customTopic, setCustomTopic] = useState("");
    const [difficulty, setDifficulty] = useState("full");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const deptSubjects = POPULAR_SUBJECTS[department] || [];
    const subjectTopics = COMMON_TOPICS[subject] || [];
    const finalSubject = subject === "Other" || !deptSubjects.includes(subject) ? customSubject : subject;
    const finalTopic = topic === "Other" || !subjectTopics.includes(topic) ? customTopic : topic;

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!finalSubject.trim()) errs.subject = "Subject is required";
        if (!finalTopic.trim()) errs.topic = "Topic is required";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        onGenerate({ subject: finalSubject, regulation, unit, topic: finalTopic, difficulty, department });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Department */}
            <div className="card p-4">
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">🏫 Department</label>
                <select
                    value={department}
                    onChange={e => { setDepartment(e.target.value); setSubject(""); setTopic(""); }}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
                >
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>

            {/* Subject */}
            <div className="card p-4">
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">📚 Subject *</label>
                {deptSubjects.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {deptSubjects.map(s => (
                            <button
                                key={s} type="button"
                                onClick={() => { setSubject(s); setTopic(""); }}
                                className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${subject === s ? "bg-violet-600 text-white border-violet-600" : "border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-700"}`}
                            >
                                {s}
                            </button>
                        ))}
                        <button type="button" onClick={() => setSubject("Other")}
                            className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${subject === "Other" ? "bg-violet-600 text-white border-violet-600" : "border-dashed border-gray-300 text-gray-400 hover:border-violet-300"}`}>
                            + Custom
                        </button>
                    </div>
                )}
                {(subject === "Other" || !deptSubjects.length) && (
                    <input
                        type="text" value={customSubject}
                        onChange={e => setCustomSubject(e.target.value)}
                        placeholder="e.g., Engineering Mathematics, Digital Signal Processing"
                        className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                )}
                {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
            </div>

            {/* Regulation & Unit */}
            <div className="card p-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">📋 Regulation</label>
                        <select value={regulation} onChange={e => setRegulation(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white">
                            {REGULATIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">📂 Unit No.</label>
                        <select value={unit} onChange={e => setUnit(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white">
                            <option value="">Any Unit</option>
                            {["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"].map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Topic */}
            <div className="card p-4">
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">🎯 Topic / Concept *</label>
                {subjectTopics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {subjectTopics.map(t => (
                            <button key={t} type="button" onClick={() => setTopic(t)}
                                className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${topic === t ? "bg-violet-600 text-white border-violet-600" : "border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-700"}`}>
                                {t}
                            </button>
                        ))}
                        <button type="button" onClick={() => setTopic("Other")}
                            className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${topic === "Other" ? "bg-violet-600 text-white border-violet-600" : "border-dashed border-gray-300 text-gray-400 hover:border-violet-300"}`}>
                            + Custom
                        </button>
                    </div>
                )}
                {(topic === "Other" || !subjectTopics.length || !subjectTopics.includes(topic)) && (
                    <input
                        type="text" value={customTopic}
                        onChange={e => setCustomTopic(e.target.value)}
                        placeholder="e.g., Deadlock Detection, Dijkstra's Algorithm, ER Diagram"
                        className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                )}
                {errors.topic && <p className="text-xs text-red-500 mt-1">{errors.topic}</p>}
            </div>

            {/* Difficulty */}
            <div className="card p-4">
                <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">📊 Notes Type</label>
                <div className="space-y-2">
                    {DIFFICULTIES.map(d => (
                        <button key={d.value} type="button" onClick={() => setDifficulty(d.value)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${difficulty === d.value ? "border-violet-600 bg-violet-50" : "border-gray-200 hover:border-violet-300"}`}>
                            <span className="text-xl">{d.icon}</span>
                            <div>
                                <div className={`text-sm font-bold ${difficulty === d.value ? "text-violet-700" : "text-gray-800"}`}>{d.label}</div>
                                <div className="text-xs text-gray-500">{d.desc}</div>
                            </div>
                            {difficulty === d.value && (
                                <div className="ml-auto w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={generating}
                className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-2xl hover:opacity-90 transition-all disabled:opacity-50 text-sm shadow-lg shadow-violet-200 flex items-center justify-center gap-2"
            >
                {generating ? (
                    <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating Notes...
                    </>
                ) : (
                    <>✨ Generate Notes</>
                )}
            </button>

            <p className="text-[10px] text-gray-400 text-center">
                AI generates original content based on Anna University syllabus patterns
            </p>
        </form>
    );
}
