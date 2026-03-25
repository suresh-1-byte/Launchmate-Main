import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { success, error } from "@/lib/api";
import { prisma } from "@/lib/prisma";

// Mark a topic as complete / incomplete
export async function POST(req: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const { topicId, isCompleted } = await req.json();
        if (!topicId) return error("topicId is required", 400);

        const progress = await prisma.userTopicProgress.upsert({
            where: { userId_topicId: { userId: authUser.userId, topicId } },
            create: {
                userId: authUser.userId,
                topicId,
                isCompleted: isCompleted ?? true,
                completedAt: isCompleted !== false ? new Date() : null,
            },
            update: {
                isCompleted: isCompleted ?? true,
                completedAt: isCompleted !== false ? new Date() : null,
            },
        });

        return success(progress);
    } catch (err) {
        console.error(err);
        return error("Failed to update progress", 500);
    }
}

// Get all topic progress for the current user
export async function GET(req: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const progress = await prisma.userTopicProgress.findMany({
            where: { userId: authUser.userId },
            include: { topic: { select: { title: true, moduleId: true } } },
        });

        return success(progress);
    } catch (err) {
        console.error(err);
        return error("Failed to fetch progress", 500);
    }
}
