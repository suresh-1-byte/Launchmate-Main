"use client";
import { useState, useRef } from "react";
import { GeneratedNote } from "@/app/notes/page";

interface Props {
    note: GeneratedNote;
    onSave: () => void;
    saving: boolean;
    saveSuccess: boolean;
}

export default function NotesViewer({ note, onSave, saving, saveSuccess }: Props) {
    const [copied, setCopied] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(note.notes);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;
        printWindow.document.write(`
            <html>
            <head>
                <title>${note.topic} - ${note.subject} Notes</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #1a1a1a; line-height: 1.6; }
                    h1 { color: #6d28d9; border-bottom: 2px solid #6d28d9; padding-bottom: 8px; }
                    h2 { color: #4c1d95; margin-top: 24px; }
                    h3 { color: #5b21b6; }
                    strong { color: #1e1b4b; }
                    hr { border: 1px solid #e5e7eb; margin: 16px 0; }
                    code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
                    pre { background: #1e1b4b; color: #e5e7eb; padding: 16px; border-radius: 8px; overflow-x: auto; }
                    blockquote { border-left: 4px solid #6d28d9; padding-left: 16px; color: #6b7280; margin: 12px 0; }
                    @media print { body { padding: 0; } }
                </style>
            </head>
            <body>${renderMarkdownToHTML(note.notes)}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="card p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <h2 className="font-bold text-gray-900 text-base">{note.topic}</h2>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold">{note.subject}</span>
                            {note.unit && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">{note.unit}</span>}
                            {note.regulation && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Reg {note.regulation}</span>}
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold capitalize">{note.difficulty} notes</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={handleCopy}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${copied ? "bg-green-50 text-green-700 border-green-200" : "border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-700"}`}>
                            {copied ? "✓ Copied!" : "📋 Copy"}
                        </button>
                        <button onClick={handlePrint}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-700 transition-all">
                            🖨️ Print
                        </button>
                        <button onClick={onSave} disabled={saving || saveSuccess}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${saveSuccess ? "bg-green-600 text-white" : "bg-violet-600 text-white hover:bg-violet-700"} disabled:opacity-70`}>
                            {saving ? (
                                <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                            ) : saveSuccess ? "✓ Saved!" : "💾 Save"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Notes Content */}
            <div className="card p-6 sm:p-8" ref={contentRef}>
                <MarkdownRenderer content={note.notes} />
            </div>
        </div>
    );
}

// Simple markdown renderer for the notes
function MarkdownRenderer({ content }: { content: string }) {
    const lines = content.split("\n");

    return (
        <div className="notes-content space-y-1">
            {lines.map((line, i) => {
                // H1
                if (line.startsWith("# ")) {
                    return <h1 key={i} className="text-2xl font-bold text-violet-800 mb-2 mt-4 first:mt-0">{line.slice(2)}</h1>;
                }
                // H2
                if (line.startsWith("## ")) {
                    return <h2 key={i} className="text-lg font-bold text-violet-700 mt-6 mb-2 flex items-center gap-2">{line.slice(3)}</h2>;
                }
                // H3
                if (line.startsWith("### ")) {
                    return <h3 key={i} className="text-base font-bold text-gray-800 mt-4 mb-1">{line.slice(4)}</h3>;
                }
                // HR
                if (line.startsWith("---")) {
                    return <hr key={i} className="border-violet-100 my-4" />;
                }
                // Bullet points
                if (line.startsWith("- ") || line.startsWith("* ")) {
                    return (
                        <div key={i} className="flex items-start gap-2 py-0.5">
                            <span className="text-violet-500 mt-1 flex-shrink-0">•</span>
                            <span className="text-sm text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(line.slice(2)) }} />
                        </div>
                    );
                }
                // Numbered list
                if (/^\d+\.\s/.test(line)) {
                    const num = line.match(/^(\d+)\./)?.[1];
                    return (
                        <div key={i} className="flex items-start gap-2 py-0.5">
                            <span className="text-violet-600 font-bold text-sm flex-shrink-0 w-5">{num}.</span>
                            <span className="text-sm text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(line.replace(/^\d+\.\s/, "")) }} />
                        </div>
                    );
                }
                // Bold Q&A pattern
                if (line.startsWith("**Q") || line.startsWith("**Ans")) {
                    const isQ = line.startsWith("**Q");
                    return (
                        <div key={i} className={`${isQ ? "mt-4" : "mt-1"} py-1`}>
                            <span className={`text-sm font-bold ${isQ ? "text-violet-800" : "text-green-700"}`}
                                dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
                        </div>
                    );
                }
                // Italic or footnote
                if (line.startsWith("*") && line.endsWith("*")) {
                    return <p key={i} className="text-xs text-gray-400 italic mt-4">{line.slice(1, -1)}</p>;
                }
                // Empty line
                if (!line.trim()) {
                    return <div key={i} className="h-1" />;
                }
                // Regular paragraph
                return (
                    <p key={i} className="text-sm text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
                );
            })}
        </div>
    );
}

function formatInline(text: string): string {
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
        .replace(/\*(.+?)\*/g, '<em class="italic text-gray-700">$1</em>')
        .replace(/`(.+?)`/g, '<code class="bg-violet-50 text-violet-800 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');
}

function renderMarkdownToHTML(content: string): string {
    return content
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^---$/gm, '<hr>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
        .replace(/\n/g, '<br>');
}
