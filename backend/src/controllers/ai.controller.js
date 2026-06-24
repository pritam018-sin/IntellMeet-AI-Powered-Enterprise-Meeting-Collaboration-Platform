import Meeting from "../models/meeting.model.js";
import { generateMeetingSummary } from "../services/ai.service.js";

export const generateSummary = async (req, res) => {
    try {
        const { meetingCode } = req.params;
        const { transcript } = req.body;

        const meeting = await Meeting.findOne({ meetingCode: meetingCode.toUpperCase() });
        
        if (!meeting) {
            return res.status(404).json({ success: false, message: "Meeting not found" });
        }

        // Generate summary using Gemini
        const summary = await generateMeetingSummary(transcript);

        // Save transcript and summary to meeting document
        meeting.transcript = transcript;
        meeting.summary = summary;
        await meeting.save();

        res.status(200).json({
            success: true,
            data: {
                summary,
                transcript
            }
        });

    } catch (error) {
        console.error("Generate Summary Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
