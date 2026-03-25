const pdfParse = require("pdf-parse");
const fs = require("fs");

async function test() {
    try {
        // Create a dummy PDF buffer if possible or just check the module
        console.log("pdf-parse version:", require("pdf-parse/package.json").version);
        console.log("Module loaded successfully");
    } catch (err) {
        console.error("Module load failed:", err.message);
    }
}

test();
