import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { success, error } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ pathId: string }> }) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const { pathId } = await params;

        const path = await prisma.learningPath.findUnique({
            where: { id: pathId },
            include: {
                modules: {
                    orderBy: { order: "asc" },
                    include: {
                        topics: {
                            orderBy: { order: "asc" },
                            include: {
                                resources: true,
                                userProgress: {
                                    where: { userId: authUser.userId },
                                    select: { isCompleted: true, completedAt: true },
                                },
                            },
                        },
                    },
                },
                userProgress: {
                    where: { userId: authUser.userId },
                },
            },
        });

        if (!path) return error("Learning path not found", 404);

        return success(path);
    } catch (err) {
        console.error(err);
        return error("Failed to fetch learning path", 500);
    }
}
