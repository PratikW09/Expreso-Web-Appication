import { getImageModel } from "../Utils/geminiUtils.js";
// import { processImageResponse } from "../utils/responseProcessor.js";
import {sanitizeInput,processImageResponse} from "../Utils/sanitizer.js";

// 🎨 Generate image controller
export async function generateImageController(req, res) {
  try {
    const userPrompt = req.body.prompt;

    // 🔍 Sanitize user input
    const content = sanitizeInput(userPrompt);
    if (!content) {
      return res.status(400).json({ error: "❌ Invalid content provided" });
    }

    // 🎯 Create a prompt to generate an image
    const imagePrompt = `Generate an image that visually represents the following article content: "${content}"`;

    // ✅ Get the Gemini image model
    const imageModel = getImageModel();

    // 🎨 Generate image
    const imageResponse = await imageModel.generateContent(imagePrompt);
    console.log("imageResponse:", JSON.stringify(imageResponse, null, 2));
    // 📸 Process the image response
    const imageUrl = processImageResponse(imageResponse);

    // 🎉 Return the generated image URL
    res.status(200).json({
      message: "✅ Image generated successfully",
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error("❌ Error generating image:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}
