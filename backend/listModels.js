import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    console.log("Fetching available models...");
    try {
        // Unfortunately, the Node SDK doesn't expose listModels directly easily, but wait, it might?
        // Let's just make a REST call to see.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        const validModels = data.models.filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'));
        console.log("Valid generateContent models:");
        console.log(validModels.map(m => m.name).join("\\n"));
    } catch (e) {
        console.error(e);
    }
}

listModels();
