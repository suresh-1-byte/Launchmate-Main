import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { success, error } from "@/lib/api";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const authUser = await getUserFromRequest();
        if (!authUser) return error("Unauthorized", 401);

        const { role, type } = await req.json();
        if (!role) return error("role is required", 400);

        if (!process.env.GEMINI_API_KEY) {
            return error("Gemini API key missing", 500);
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const typeLabel = type === "hr" ? "HR/Behavioral" : type === "technical" ? "Technical" : "Mixed";

        const prompt = `Generate 10 ${typeLabel} interview questions for a ${role} position. 
        
Return a JSON array (no markdown, pure JSON array) with this structure:
[
  {
    "question": "Question text here",
    "type": "${type || 'mixed'}",
    "difficulty": "easy|medium|hard",
    "hint": "Brief hint or what the interviewer is looking for",
    "sampleAnswer": "A concise sample answer"
  }
]

Make questions realistic, commonly asked in Indian tech companies (TCS, Infosys, Wipro, startups, MNCs). Include a mix of difficulties.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        let questions;
        try {
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            questions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
        } catch {
            questions = [];
        }

        return success({ questions, role, type });
    } catch (err) {
        console.error("Interview questions error:", err);
        return error("Failed to generate interview questions", 500);
    }
}
