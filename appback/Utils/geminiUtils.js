import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// ✅ Load environment variables
dotenv.config();

// ✅ Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🧠 Get the model for generating text (keywords)
export function getTextModel() {
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash", // ✅ Optimized for fast text generation
  });
}

// 🎨 Get the model for generating images
export function getImageModel() {
  return genAI.getGenerativeModel({
    model: "gemini-1.5-pro", // 🎨 Supports image generation
  });
}
