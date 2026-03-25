const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
    // Test with the EXACT key provided
    const key = "AIzaSyA0ZfaLUIOmVPCLO2N3c3vk5CzQQfILbAU";
    console.log("Testing with direct key:", key);

    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log("--- SUCCESS ---");
        console.log("Response:", response.text());
    } catch (err) {
        console.log("--- FAILED ---");
        console.error("Error Message:", err.message);
    }
}

test();
