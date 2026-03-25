const { Groq } = require("groq-sdk");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

async function test() {
    const key = process.env.GROQ_API_KEY;
    console.log("Using Groq Key:", key?.substring(0, 10));

    if (!key) {
        console.error("No Groq key found in .env");
        return;
    }

    try {
        const groq = new Groq({ apiKey: key });
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: "Hello" }],
            model: "llama-3.1-8b-instant",
        });
        console.log("Success:", chatCompletion.choices[0]?.message?.content);
    } catch (err) {
        console.error("FAILED:", err.message);
    }
}

test();
