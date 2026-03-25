import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { success, error } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const level = searchParams.get("level");
        const search = searchParams.get("search");

        const where: Record<string, unknown> = {};
        if (category && category !== "all") where.category = category;
        if (level && level !== "all") where.level = level;
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } },
            ];
        }

        const courses = await prisma.course.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                _count: { select: { enrollments: true } },
            },
        });

        return success(courses);
    } catch (err) {
        console.error("Courses GET error:", err);
        return error("Internal server error", 500);
    }
}

export async function POST(request: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const body = await request.json();
        const { title, description, level, duration, category } = body;

        if (!title || !description || !duration) {
            return error("Title, description, and duration are required", 400);
        }

        const course = await prisma.course.create({
            data: { title, description, level: level || "beginner", duration, category: category || "general" },
        });

        return success(course, 201);
    } catch (err) {
        console.error("Courses POST error:", err);
        return error("Internal server error", 500);
    }
}
