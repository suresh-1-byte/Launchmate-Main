import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import Groq from "groq-sdk";

/**
 * LaunchMate Centralized AI Service
 * Standardizes AI interactions across the app to ensure high-quality, professional responses.
 */

if (!process.env.GEMINI_API_KEY) console.warn("GEMINI_API_KEY is missing.");
if (!process.env.GROQ_API_KEY) console.warn("GROQ_API_KEY is missing.");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

export enum AIModel {
    FLASH = "gemini-1.5-flash",
    PRO = "gemini-1.5-pro",
    GROQ_LLAMA = "llama-3.3-70b-versatile",
}

export interface AIResponse {
    text: string;
    error?: string;
}

const DEFAULT_SAFETY_SETTINGS = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

const DEFAULT_CONFIG = {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
};

/**
 * Standard AI generation function with error handling and consistent configuration.
 */
export async function generateContent(
    prompt: string,
    systemInstruction?: string,
    modelName: AIModel = AIModel.FLASH
): Promise<AIResponse> {
    try {
        // Handle Groq Models
        if (modelName === AIModel.GROQ_LLAMA) {
            if (!groq) return { text: "", error: "Groq API key is not configured." };

            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    ...(systemInstruction ? [{ role: "system", content: systemInstruction } as const] : []),
                    { role: "user", content: prompt },
                ],
                model: modelName,
                temperature: DEFAULT_CONFIG.temperature,
                max_tokens: DEFAULT_CONFIG.maxOutputTokens,
            });

            return { text: chatCompletion.choices[0]?.message?.content || "" };
        }

        // Handle Gemini Models (Default)
        if (!process.env.GEMINI_API_KEY) {
            return { text: "", error: "Gemini API key is not configured." };
        }

        const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: systemInstruction,
            safetySettings: DEFAULT_SAFETY_SETTINGS,
            generationConfig: DEFAULT_CONFIG,
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return { text: response.text() };
    } catch (err: any) {
        console.error("AI Service Error:", err);
        return {
            text: "",
            error: err.message || "Failed to generate AI response. Please try again later."
        };
    }
}

/**
 * Advanced Prompt Building Utilities
 */
export const AIPersonas = {
    MENTOR: `You are LaunchMate AI Mentor, a world-class career strategist and senior software engineer. 
    Your goal is to provide intelligent, actionable, and encouraging professional advice.
    - Style: Professional, empathetic, direct, and slightly inspiring.
    - Format: Use Markdown for structure, bolding for emphasis, and bullet points for lists.
    - Depth: Provide deep insights, not just surface-level answers.`,

    ACADEMIC: `You are an expert Professor and Academic content specialist for Anna University engineering students.
    Your goal is to explain complex engineering concepts in simple, easy-to-understand language that helps students ace their exams.
    - Style: Simple, organized, exam-focused, and student-friendly.
    - Philosophy: Focus on conceptual clarity first, then exam writing techniques.`,

    SDE_INTERVIEWER: `You are a Senior SDE Interviewer from a Top Tier Product Company (FAANG/MAANG).
    Your goal is to challenge the user with high-quality, relevant interview questions and provide constructive feedback.
    - Style: Analytical, detail-oriented, and strictly technical for coding roles.`,

    CAREER_PLANNER: `You are a Career Architect. You look at a student's current skills and target role to design the most efficient learning path possible.
    - Strategy: Prioritize high-impact skills first. Use time-boxed milestones.`,

    PROJECT_OPTIMIZER: `You are a Senior Project Architect and Technical Recruiter. Your goal is to help students turn raw GitHub code into world-class portfolio projects.
    - Focus: Technical clarity, impact, role-relevance, and resume potential.
    - Style: Professional, analytical, and highly structured.`,
};

export function buildStandardPrompt(context: string, task: string, constraints: string): string {
    return `
    ### CONTEXT
    ${context}

    ### TASK
    ${task}

    ### CONSTRAINTS
    ${constraints}
    
    Please provide your response now:
    `;
}
