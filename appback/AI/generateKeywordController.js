import { getTextModel } from "../utils/geminiUtils.js";
// import { processTextResponse } from "../Utils/responseProcessor.js";
import {sanitizeInput,processTextResponse} from "../Utils/sanitizer.js";

// ✅ Generate keywords controller
export async function generateKeywordController(req, res) {
  try {
    const userPrompt = req.body.prompt;

    // 🔍 Sanitize user input
    const content = sanitizeInput(userPrompt);
    if (!content) {
      return res.status(400).json({ error: "❌ Invalid content provided" });
    }

    // 🎯 Create a prompt to generate keywords
    const keywordPrompt = `Generate 5 relevant and concise keywords based on the following article content: "${content}"`;

    // ✅ Get the Gemini text model
    const textModel = getTextModel();

    // 📚 Generate keywords
    const keywordResponse = await textModel.generateContent(keywordPrompt);

    // 🧠 Process the text response
    const keywords = processTextResponse(keywordResponse);

    // 🎉 Return the generated keywords
    res.status(200).json({
      message: "✅ Keywords generated successfully",
      keywords: keywords,
    });
  } catch (error) {
    console.error("❌ Error generating keywords:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}
