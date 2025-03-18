// Basic sanitization to prevent script injection
export  function sanitizeInput(input) {
    if (typeof input !== "string" || input.trim().length === 0) {
      return null;
    }
    return input.replace(/[<>]/g, ""); // Remove potentially harmful characters
  }
  
;
  

// 🧠 Process Gemini API response for text (keywords)
export   function processTextResponse(response) {
  try {
    const candidates = response?.response?.candidates || response?.candidates || [];
    if (candidates.length === 0) {
      throw new Error("No valid response received.");
    }

    // ✅ Extract and process text content
    const text = candidates[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) {
      throw new Error("No text generated.");
    }

    // 🎯 Split and clean the keywords
    const keywords = text
      .split(/[\n,]/)
      .map((keyword) => keyword.replace(/^\d+\.\s*/, "").trim())
      .filter((keyword) => keyword.length > 0);

    return keywords;
  } catch (error) {
    console.error("❌ Error processing text response:", error.message);
    throw error;
  }
}

// 🎨 Process Gemini API response for images
export  // 🎨 Process the Gemini API response for image generation
function processImageResponse(response) {
  try {
    // ✅ Safely access the candidate's content parts
    const candidates = response?.response?.candidates || [];
    if (candidates.length === 0) {
      throw new Error("No candidates found in the response.");
    }

    // ✅ Check for valid parts in the candidate's content
    const parts = candidates[0]?.content?.parts || [];
    if (parts.length === 0) {
      throw new Error("No valid parts found in the response.");
    }

    // ✅ Extract image URL if it exists
    const imageUrlPart = parts.find((part) => part?.inlineData?.mimeType === "image/png");
    if (!imageUrlPart || !imageUrlPart.inlineData?.data) {
      throw new Error("No image data found in the response.");
    }

    // ✅ Convert base64 data to a proper image URL if needed
    const imageBase64 = imageUrlPart.inlineData.data;
    const imageUrl = `data:image/png;base64,${imageBase64}`;

    // 🎉 Return the correct image URL
    return imageUrl;
  } catch (error) {
    console.error("❌ Error processing image response:", error.message);
    throw error;
  }
}
