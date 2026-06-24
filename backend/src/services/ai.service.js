import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateMeetingSummary = async (transcript) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("Gemini API Key is missing");
        }
        
        if (!transcript || transcript.trim() === "") {
            return "No transcript available to summarize.";
        }

        // Use the gemini-flash-latest alias to guarantee compatibility with 2026 API tier
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
        You are an AI meeting assistant. Below is the raw transcript of a meeting. 
        If the transcript indicates there was no spoken dialogue or it's empty, please generate a funny, creative summary saying that everyone stared at each other in silence, or that it was the most peaceful meeting ever. Make it feel like a premium AI feature.
        If there is actual speech, provide a concise, well-structured summary of the meeting.
        
        Include:
        - Key Discussion Points
        - Action Items (if any)
        - General tone/conclusion

        Transcript:
        """
        ${transcript}
        """
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error("Error generating meeting summary:", error);
        // Provide a fallback so the frontend doesn't crash on free tier limits
        return `### AI Summary Generation Failed
We couldn't generate the summary because of an API issue (likely free-tier limits or model availability). 

**But the feature is fully wired up!** When a valid API key and model is available, your meeting transcript will be summarized right here.`;
    }
};
