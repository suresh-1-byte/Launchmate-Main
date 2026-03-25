import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { success, error } from "@/lib/api";
import { generateContent, AIPersonas, buildStandardPrompt, AIModel } from "@/lib/ai-service";

export async function POST(req: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const { projectId } = await req.json();
        if (!projectId) return error("Project ID is required", 400);

        const project = await prisma.project.findUnique({
            where: { id: projectId, userId: authUser.userId }
        });

        if (!project) return error("Project not found", 404);

        const context = `
            Project Title: ${project.title}
            Description: ${project.description}
            Tech Stack: ${project.languages || "Not specified"}
            Stars: ${project.stars}
            Forks: ${project.forks}
            README Content (Snippet): ${project.readme?.substring(0, 3000) || "No README available"}
        `;

        const task = "Analyze this GitHub project and provide a comprehensive professional assessment.";

        const constraints = `
            Return a JSON object with the following fields:
            - simpleExplanation: (2-3 sentences explaining what it does)
            - resumeBullets: (3 high-impact, ATS-friendly bullet points)
            - interviewExplanation: (How to explain this in an interview)
            - interviewQuestions: (4-5 possible interview questions)
            - suggestedImprovements: (3-4 technical improvements)
            - missingFeatures: (2-3 feature suggestions)
            - difficulty: (Beginner, Intermediate, or Advanced)
            - portfolioScore: (Number from 1 to 10)
            
            Format the response as raw JSON. Do not include any extra text.
        `;

        const prompt = buildStandardPrompt(context, task, constraints);
        const aiResponse = await generateContent(prompt, AIPersonas.PROJECT_OPTIMIZER, AIModel.GROQ_LLAMA);

        if (aiResponse.error) return error(aiResponse.error, 500);

        // Sanitize AI response to extract JSON
        let analysis;
        try {
            const jsonStr = aiResponse.text.substring(
                aiResponse.text.indexOf("{"),
                aiResponse.text.lastIndexOf("}") + 1
            );
            analysis = JSON.parse(jsonStr);
        } catch (e) {
            console.error("JSON Parse Error:", aiResponse.text);
            return error("AI generated an invalid response format. Please try again.", 500);
        }

        // Save analysis to DB
        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: {
                aiExplanation: analysis.simpleExplanation,
                resumeBullets: Array.isArray(analysis.resumeBullets) ? analysis.resumeBullets.join("\n") : analysis.resumeBullets,
                interviewQuestions: Array.isArray(analysis.interviewQuestions) ? analysis.interviewQuestions.join("\n") : analysis.interviewQuestions,
                suggestedImprovements: Array.isArray(analysis.suggestedImprovements) ? analysis.suggestedImprovements.join("\n") : analysis.suggestedImprovements,
                missingFeatures: Array.isArray(analysis.missingFeatures) ? analysis.missingFeatures.join("\n") : analysis.missingFeatures,
                difficulty: analysis.difficulty,
                portfolioScore: parseInt(analysis.portfolioScore) || 0,
            }
        });

        return success(updatedProject);

    } catch (err: any) {
        console.error("Project Analysis Error:", err);
        return error("Internal server error", 500);
    }
}
