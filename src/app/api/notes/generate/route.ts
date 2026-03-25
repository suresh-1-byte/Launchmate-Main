import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { success, error } from "@/lib/api";
import { generateContent, AIPersonas, buildStandardPrompt, AIModel } from "@/lib/ai-service";

export async function POST(req: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const { subject, regulation, unit, topic, difficulty, department } = await req.json();

        if (!subject || !topic) {
            return error("Subject and topic are required", 400);
        }

        const difficultyLabel = difficulty === "short" ? "Short Notes (concise, 2-3 lines per point)" :
            difficulty === "revision" ? "Quick Revision Notes (bullet points only, very concise)" :
                "Full Detailed Notes (comprehensive, exam-ready)";

        const context = `
            Subject: ${subject}
            Regulation: ${regulation || "Not specified"}
            Unit: ${unit || "Not specified"}
            Topic: ${topic}
            Department: ${department || "Engineering"}
            Detail Level: ${difficultyLabel}
        `;

        const task = `Generate comprehensive, student-friendly academic notes for the topic: ${topic}`;

        const constraints = `
            1. Use the following EXACT structure in Markdown:
               # [Topic Name]
               ## Subject: [Subject]
               ---
               ## 📌 Overview (2-3 sentences)
               ---
               ## 💡 Concept Explained Simply (with analogy)
               ---
               ## 📖 Key Definitions
               ---
               ## 🔑 Important Points (8-12 bullets)
               ---
               ## ✏️ 2-Mark Questions & Answers (5-6 Q&As)
               ---
               ## 📝 16-Mark Questions (3-4 questions)
               ---
               ## ⚡ Quick Revision Summary
               ---
               ## 🎯 Exam Tips (Focus areas, mistakes, scoring strategy)
            2. Language must be simple and easy for a second-language English speaker.
            3. Ensure all content is technically accurate for the ${subject} syllabus.
            4. Do not include any promotional text or chatbot filler.
        `;

        const prompt = buildStandardPrompt(context, task, constraints);
        const aiResponse = await generateContent(prompt, AIPersonas.ACADEMIC, AIModel.GROQ_LLAMA);

        if (aiResponse.error) return error(aiResponse.error, 500);

        return success({
            notes: aiResponse.text,
            subject,
            topic,
            unit,
            regulation,
            difficulty,
            generatedAt: new Date().toISOString(),
        });

    } catch (err: any) {
        console.error("Notes generation error:", err);
        return error("Failed to generate notes. Please try again.", 500);
    }
}
