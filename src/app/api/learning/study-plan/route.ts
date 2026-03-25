import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { success, error } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { generateContent, AIPersonas, buildStandardPrompt, AIModel } from "@/lib/ai-service";

export async function POST(req: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const { targetRole, skillLevel, dailyTime } = await req.json();
        if (!targetRole || !skillLevel || !dailyTime) {
            return error("targetRole, skillLevel, and dailyTime are required", 400);
        }

        const context = `
            Target Role: ${targetRole}
            Current Skill Level: ${skillLevel}
            Available Time Per Day: ${dailyTime} hours
        `;

        const task = "Generate a detailed 4-week study plan in JSON format.";

        const constraints = `
            1. Return ONLY pure JSON (no markdown code blocks, no extra text).
            2. Match this structure exactly:
            {
                "overview": "Brief 2-sentence overview",
                "totalWeeks": 4,
                "weeklyTargets": [
                    {
                        "week": 1,
                        "theme": "Theme title",
                        "goals": ["goal 1", "goal 2"],
                        "dailyPlan": [
                            { "day": "Monday", "tasks": ["task 1"], "duration": "X hours" }
                        ],
                        "resources": ["Resource 1 with URL"]
                    }
                ],
                "keyMilestones": ["M1", "M2"],
                "tips": ["Tip 1"]
            }
            3. Ensure the resources have real, helpful links (e.g. YouTube, documentation).
            4. Tailor to the difficulty of ${skillLevel} level.
        `;

        const prompt = buildStandardPrompt(context, task, constraints);
        const aiResponse = await generateContent(prompt, AIPersonas.CAREER_PLANNER, AIModel.GROQ_LLAMA);

        if (aiResponse.error) return error(aiResponse.error, 500);

        let planData;
        try {
            const rawText = aiResponse.text;
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            planData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(rawText);
        } catch {
            return error("AI generated an invalid format. Please try again.", 500);
        }

        const savedPlan = await prisma.userStudyPlan.create({
            data: {
                userId: authUser.userId,
                targetRole,
                skillLevel,
                dailyTime,
                planJson: JSON.stringify(planData),
            },
        });

        return success({ plan: planData, id: savedPlan.id });
    } catch (err) {
        console.error("Study plan error:", err);
        return error("Failed to generate study plan", 500);
    }
}

export async function GET(req: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const plans = await prisma.userStudyPlan.findMany({
            where: { userId: authUser.userId },
            orderBy: { createdAt: "desc" },
            take: 5,
        });

        return success(plans.map((p: { planJson: string;[key: string]: any }) => ({ ...p, plan: JSON.parse(p.planJson) })));
    } catch (err) {
        console.error(err);
        return error("Failed to fetch study plans", 500);
    }
}
