import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { success, error } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const paths = await prisma.learningPath.findMany({
            include: {
                _count: { select: { modules: true } },
                userProgress: {
                    where: { userId: authUser.userId },
                    select: { status: true, startedAt: true },
                },
            },
        });

        return success(paths);
    } catch (err) {
        console.error(err);
        return error("Failed to fetch learning paths", 500);
    }
}
