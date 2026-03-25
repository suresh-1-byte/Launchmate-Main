import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { success, error } from "@/lib/api";
import { generateContent, AIPersonas, buildStandardPrompt, AIModel } from "@/lib/ai-service";

export async function POST(req: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const body = await req.json();
        const { message, question, skills, targetRole, experience } = body;

        const userQuestion = question || message;
        if (!userQuestion) return error("Please provide a question", 400);

        const context = `
            User Skills: ${skills || "Not specified"}
            Target Role: ${targetRole || "Not specified"}
            Experience Level: ${experience || "Fresher"}
        `;

        const task = `Answer the following user query: "${userQuestion}"`;

        const constraints = `
            1. Respond as a top-tier career mentor.
            2. If technical, provide code snippets or architecture diagrams in Markdown.
            3. If career-related, give specific, actionable steps.
            4. Keep the tone encouraging but professional.
            5. Provide high-depth answers that go beyond surface level.
        `;

        const prompt = buildStandardPrompt(context, task, constraints);
        const aiResponse = await generateContent(prompt, AIPersonas.MENTOR, AIModel.GROQ_LLAMA);

        if (aiResponse.error) {
            return error(aiResponse.error, 500);
        }

        return success({ response: aiResponse.text });

    } catch (err) {
        console.error("AI ERROR:", err);
        return error("AI mentor failed to respond", 500);
    }
}
