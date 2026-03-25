import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { success, error } from "@/lib/api";
import { prisma } from "@/lib/prisma";

// Save / unsave a resource
export async function POST(req: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const { resourceId, action } = await req.json();
        if (!resourceId) return error("resourceId is required", 400);

        if (action === "unsave") {
            await prisma.userSavedResource.deleteMany({
                where: { userId: authUser.userId, resourceId },
            });
            return success({ saved: false });
        }

        const saved = await prisma.userSavedResource.upsert({
            where: { userId_resourceId: { userId: authUser.userId, resourceId } },
            create: { userId: authUser.userId, resourceId },
            update: {},
        });

        return success({ saved: true, data: saved });
    } catch (err) {
        console.error(err);
        return error("Failed to save resource", 500);
    }
}

// Get all saved resources for the current user
export async function GET(req: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const saved = await prisma.userSavedResource.findMany({
            where: { userId: authUser.userId },
            include: {
                resource: {
                    include: { topic: { select: { title: true } } },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return success(saved);
    } catch (err) {
        console.error(err);
        return error("Failed to fetch saved resources", 500);
    }
}
