import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { success, error } from "@/lib/api";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password, skills, bio } = body;

        // 1. Basic validation
        if (!name || !email || !password) {
            return error("All required fields must be provided", 400);
        }

        if (password.length < 6) {
            return error("Password must be at least 6 characters long", 400);
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return error("Please provide a valid email address", 400);
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return error("Email already registered", 409);
        }

        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                skills: Array.isArray(skills) ? skills.join(", ") : (skills || ""),
                bio: bio || null,
            },
        });

        return success(
            {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    skills: user.skills ? user.skills.split(",").map((s: string) => s.trim()) : [],
                },
            },
            201
        );
    } catch (err) {
        console.error("Signup error:", err);
        return error("Internal server error", 500);
    }
}
