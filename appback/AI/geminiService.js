import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import sanitizeInput from "../Utils/sanitizer.js";

dotenv.config();

// ✅ Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🎯 Controller to generate keywords and an image based on content
export async function generateKeywordController(req, res) {
  try {
    const userPrompt = req.body.prompt;

    // 🔍 Sanitize user input
    const content = sanitizeInput(userPrompt);
    if (!content) {
      return res.status(400).json({ error: "❌ Invalid content provided" });
    }

    // ✅ Get Gemini model for text and image generation
    const textModel = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // ✅ For text
    });

    const imageModel = genAI.getGenerativeModel({
      model: "gemini-1.5-pro", // 🎨 For image
    });

    // 🎯 Create prompts for keywords and image generation
    const keywordPrompt = `Generate 5 relevant and concise keywords based on the following article content: "${content}"`;
    const imagePrompt = `Generate an image that visually represents the following article content: "${content}"`;

    // ✅ Generate keywords
    const keywordResponse = await textModel.generateContent(keywordPrompt);
    const keywords = processTextResponse(keywordResponse);

    // 🎨 Generate image
    const imageResponse = await imageModel.generateContent(imagePrompt);
    const imageUrl = processImageResponse(imageResponse);

    // 🎉 Return generated keywords and image to the user
    res.status(200).json({
      message: "✅ Keywords and image generated successfully",
      keywords: keywords,
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error("❌ Error generating content:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

// 🧠 Process the Gemini API response for text
function processTextResponse(response) {
  try {
    // ✅ Safely access response.candidates
    const candidates = response?.response?.candidates || response?.candidates || [];
    if (candidates.length === 0) {
      throw new Error("No valid response received.");
    }

    // ✅ Extract the text part correctly
    const text = candidates[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) {
      throw new Error("No text generated.");
    }

    // 🎯 Split and clean the keywords into an array
    const keywords = text
      .split(/[\n,]/) // Split by new lines or commas
      .map((keyword) => keyword.replace(/^\d+\.\s*/, "").trim()) // Remove bullet numbers like 1., 2., etc.
      .filter((keyword) => keyword.length > 0);

    // ✅ Return the processed array of keywords
    return keywords;
  } catch (error) {
    console.error("❌ Error processing text response:", error.message);
    throw error;
  }
}

// 🎨 Process the Gemini API response for image generation
function processImageResponse(response) {
  try {
    // ✅ Safely access image URL from the response
    const imageUrl = response?.response?.candidates?.[0]?.content?.parts?.[0]?.image_url;
    if (!imageUrl) {
      throw new Error("No image generated.");
    }

    // ✅ Return the generated image URL
    return imageUrl;
  } catch (error) {
    console.error("❌ Error processing image response:", error.message);
    throw error;
  }
}
