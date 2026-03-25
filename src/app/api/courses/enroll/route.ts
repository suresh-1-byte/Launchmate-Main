import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { success, error } from "@/lib/api";

export async function POST(request: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const body = await request.json();
        const { courseId } = body;

        if (!courseId) return error("Course ID is required", 400);

        const existing = await prisma.enrollment.findUnique({
            where: { userId_courseId: { userId: authUser.userId, courseId } },
        });

        if (existing) return error("Already enrolled", 409);

        const enrollment = await prisma.enrollment.create({
            data: { userId: authUser.userId, courseId },
            include: { course: true },
        });

        return success(enrollment, 201);
    } catch (err) {
        console.error("Enroll error:", err);
        return error("Internal server error", 500);
    }
}

export async function GET(request: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const enrollments = await prisma.enrollment.findMany({
            where: { userId: authUser.userId },
            include: { course: true },
            orderBy: { createdAt: "desc" },
        });

        return success(enrollments);
    } catch (err) {
        console.error("Enrollments GET error:", err);
        return error("Internal server error", 500);
    }
}
