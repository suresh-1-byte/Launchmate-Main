import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Groq } from "groq-sdk";
// @ts-expect-error - no types available
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let text = "";

    try {
      const upload = file as File;
      const isPdf = upload.type === "application/pdf" || (upload.name && upload.name.endsWith(".pdf"));
      const isDocx = upload.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
        upload.type === "application/msword" ||
        (upload.name && (upload.name.endsWith(".docx") || upload.name.endsWith(".doc")));

      if (isPdf) {
        const pdfData = await pdfParse(buffer);
        text = pdfData.text;
      } else if (isDocx) {
        const docxData = await mammoth.extractRawText({ buffer });
        text = docxData.value;
      } else {
        return NextResponse.json({ error: `Unsupported file type: ${file.type}. Please upload a PDF or DOCX.` }, { status: 400 });
      }
    } catch (parseError) {
      console.error("Parse Error:", parseError);
      return NextResponse.json({ error: "Failed to extract text from the file." }, { status: 500 });
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "No text found in the document." }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    const performAnalysis = async (useGroqFallback = false) => {
        const prompt = `You are an expert, brutally honest but constructive AI Resume Reviewer (a "Resume Roaster").
        Analyze the following resume text and provide exactly the requested output in JSON format.
        Make sure to be detailed and give actionable advice.
        Return ONLY raw JSON.

        Required JSON format:
        {
          "score": <number 1-10>,
          "strengths": [<string array of strengths>],
          "problems": [<string array of major weaknesses/faults>],
          "missing": [<string array of missing sections/elements like impact, links, etc.>],
          "suggestions": [<string array of precise improvements>],
          "improvedBullets": [<string array of 2-3 rewritten example bullet points with good action verbs and metrics>]
        }

        Resume Text:
        ${text.substring(0, 15000)}
        `;

        if (useGroqFallback && groqKey) {
            console.log("Using Groq Fallback...");
            const groq = new Groq({ apiKey: groqKey });
            const completion = await groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "llama-3.1-8b-instant",
                temperature: 0.5,
            });
            return completion.choices[0]?.message?.content || "";
        } else if (geminiKey) {
            const genAI = new GoogleGenerativeAI(geminiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        }
        throw new Error("No API keys available");
    }

    let aiOutput = "";
    try {
        aiOutput = await performAnalysis();
    } catch (e: any) {
        console.error("Gemini failed, trying Groq fallback:", e.message);
        if (groqKey) {
            aiOutput = await performAnalysis(true);
        } else {
            throw e;
        }
    }

    // Extraction logic
    try {
      const jsonStart = aiOutput.indexOf('{');
      const jsonEnd = aiOutput.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1) throw new Error("No JSON found");
      const cleanedJson = aiOutput.substring(jsonStart, jsonEnd + 1);
      const jsonResponse = JSON.parse(cleanedJson);
      return NextResponse.json(jsonResponse);
    } catch (e) {
      console.error("Failed to parse AI JSON:", aiOutput);
      return NextResponse.json({ error: "The AI analysis returned an invalid format. Please try again." }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Resume analysis error:", error);
    if (error.status === 429 || error.message?.includes("429") || error.message?.includes("quota")) {
        return NextResponse.json({ error: "The AI service is currently overwhelmed (Rate limit exceeded). Please try again in 1 minute." }, { status: 429 });
    }
    return NextResponse.json({ error: "Internal server error: " + (error.message || "Unknown error") }, { status: 500 });
  }
}
