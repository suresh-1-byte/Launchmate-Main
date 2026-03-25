const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

async function test() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Using Key from .env:", key);

    if (!key) {
        console.error("No API key found in .env");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello! Are you working?");
        const response = await result.response;
        console.log("SUCCESS:", response.text());
    } catch (err) {
        console.error("FAILED MESSAGE:", err.message);
        if (err.response) {
            try {
                const text = await err.response.text();
                console.error("FULL ERROR RESPONSE:", text);
            } catch(e) {}
        }
    }
}

test();
