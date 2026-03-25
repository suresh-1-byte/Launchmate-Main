import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { success, error } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId") || authUser.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                skills: true,
                bio: true,
                avatar: true,
                createdAt: true,
                projects: {
                    orderBy: { createdAt: "desc" },
                    take: 5,
                },
                enrollments: {
                    include: { course: true },
                    orderBy: { createdAt: "desc" },
                    take: 5,
                },
                _count: {
                    select: {
                        sentConnections: { where: { status: "accepted" } },
                        receivedConnections: { where: { status: "accepted" } },
                        projects: true,
                    },
                },
            },
        });

        if (!user) return error("User not found", 404);

        return success({
            ...user,
            skills: user.skills ? (user.skills as unknown as string).split(",").map((s: string) => s.trim()) : [],
        });
    } catch (err) {
        console.error("Profile GET error:", err);
        return error("Internal server error", 500);
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const body = await request.json();
        const { name, bio, skills } = body;

        const updateData: Record<string, unknown> = {};
        if (name) updateData.name = name;
        if (bio !== undefined) updateData.bio = bio;
        if (skills) updateData.skills = Array.isArray(skills) ? skills.join(", ") : skills;

        const user = await prisma.user.update({
            where: { id: authUser.userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                skills: true,
                bio: true,
                avatar: true,
            },
        });

        return success({
            ...user,
            skills: user.skills ? (user.skills as unknown as string).split(",").map((s: string) => s.trim()) : [],
        });
    } catch (err) {
        console.error("Profile PATCH error:", err);
        return error("Internal server error", 500);
    }
}
