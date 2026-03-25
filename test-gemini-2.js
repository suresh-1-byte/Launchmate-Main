const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testSDK() {
    const key = "AIzaSyA0ZfaLUIOmVPCLO2N3c3vk5CzQQfILbAU";
    console.log("Testing with SDK and model 'gemini-2.0-flash'...");

    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("Hello! Verify your version.");
        const response = await result.response;
        console.log("SUCCESS:", response.text());
    } catch (err) {
        console.error("FAILED SDK:", err.message);
    }
}

testSDK();
