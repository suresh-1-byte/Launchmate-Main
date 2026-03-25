const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

async function testOpenAI() {
    const oKey = process.env.OPENAI_API_KEY;
    console.log("Using OpenAI Key:", oKey?.substring(0, 10) + "...");

    if (!oKey) {
        console.error("No OpenAI API key found in .env");
        return;
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${oKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: "Hello" }],
            }),
        });

        const data = await response.json();
        if (response.ok) {
            console.log("Success OpenAI:", data.choices[0].message.content);
        } else {
            console.error("FAILED OpenAI:", response.status, data);
        }
    } catch (err) {
        console.error("Network Error OpenAI:", err.message);
    }
}

testOpenAI();
