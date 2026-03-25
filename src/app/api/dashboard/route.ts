import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { success, error } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const [user, enrollments, projects, connections, recentJobs] = await Promise.all([
            prisma.user.findUnique({
                where: { id: authUser.userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    skills: true,
                    bio: true,
                    role: true,
                    avatar: true,
                    headline: true,
                    banner: true
                } as any,
            }),
            prisma.enrollment.findMany({
                where: { userId: authUser.userId },
                include: { course: true },
                orderBy: { createdAt: "desc" },
                take: 3,
            }),
            prisma.project.findMany({
                where: { userId: authUser.userId },
                orderBy: { createdAt: "desc" },
                take: 3,
            }),
            prisma.connection.findMany({
                where: {
                    OR: [
                        { senderId: authUser.userId, status: "accepted" },
                        { receiverId: authUser.userId, status: "accepted" },
                    ],
                },
                include: {
                    sender: { select: { id: true, name: true, skills: true, avatar: true, headline: true } },
                    receiver: { select: { id: true, name: true, skills: true, avatar: true, headline: true } },
                } as any,
                take: 5,
            }),
            prisma.job.findMany({
                orderBy: { postedAt: "desc" },
                take: 5,
            }),
        ]);

        const pendingRequests = await prisma.connection.count({
            where: { receiverId: authUser.userId, status: "pending" },
        });

        const totalConnections = await prisma.connection.count({
            where: {
                OR: [
                    { senderId: authUser.userId, status: "accepted" },
                    { receiverId: authUser.userId, status: "accepted" },
                ],
            },
        });

        return success({
            user: user ? {
                ...user,
                skills: (user as any).skills ? ((user as any).skills as string).split(",").map((s: string) => s.trim()) : [],
            } : null,
            enrollments,
            projects,
            connections: (connections as any[]).map((c) => ({
                ...c,
                sender: {
                    ...c.sender,
                    skills: c.sender.skills ? (c.sender.skills as string).split(",").map((s: string) => s.trim()) : [],
                },
                receiver: {
                    ...c.receiver,
                    skills: c.receiver.skills ? (c.receiver.skills as string).split(",").map((s: string) => s.trim()) : [],
                },
            })),
            recentJobs,
            stats: {
                coursesInProgress: enrollments.filter((e) => e.progress < 100).length,
                completedCourses: enrollments.filter((e) => e.progress === 100).length,
                totalProjects: projects.length,
                totalConnections,
                pendingRequests,
            },
        });
    } catch (err) {
        console.error("Dashboard error:", err);
        return error("Internal server error", 500);
    }
}
