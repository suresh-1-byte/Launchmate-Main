import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { success, error } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) {
            return error("Unauthorized", 401);
        }

        const user = await prisma.user.findUnique({
            where: { id: authUser.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                skills: true,
                bio: true,
                avatar: true,
                createdAt: true,
            },
        });

        if (!user) {
            return error("User not found", 404);
        }

        return success({
            ...user,
            skills: user.skills ? (user.skills as unknown as string).split(",").map((s: string) => s.trim()) : [],
        });
    } catch (err) {
        console.error("Me error:", err);
        return error("Internal server error", 500);
    }
}
