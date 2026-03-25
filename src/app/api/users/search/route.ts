import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { success, error } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q") || "";

        const where: any = {
            id: { not: authUser.userId }
        };

        if (query) {
            where.OR = [
                { name: { contains: query } },
                { skills: { contains: query } },
                { email: { contains: query } },
                { headline: { contains: query } },
            ];
        }

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                skills: true,
                avatar: true,
                headline: true,
                banner: true,
                _count: {
                    select: {
                        sentConnections: { where: { status: "accepted" } },
                        receivedConnections: { where: { status: "accepted" } },
                    },
                },
            } as any,
            take: 40,
        });

        const formattedUsers = users.map((u: any) => ({
            ...u,
            skills: u.skills ? (u.skills as string).split(",").map((s: string) => s.trim()) : [],
        }));

        return success(formattedUsers);
    } catch (err) {
        console.error("Users search error:", err);
        return error("Internal server error", 500);
    }
}
