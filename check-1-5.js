async function testWithFullModelPathListAll() {
    const key = "AIzaSyA0ZfaLUIOmVPCLO2N3c3vk5CzQQfILbAU";
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("FULL MODEL DATA:");
        data.models.forEach(m => {
            if (m.name.includes('gemini-1.5')) {
                console.log(`- ${m.name} [${m.supportedGenerationMethods.join(', ')}]`);
            }
        });
    } catch (err) {
        console.error("Fetch Error:", err.message);
    }
}

testWithFullModelPathListAll();
