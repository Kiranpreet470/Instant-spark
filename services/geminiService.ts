import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a creative caption for an image using Gemini.
 * @param base64Image The base64 encoded image string (without the data prefix usually).
 * @param mimeType The mime type of the image.
 * @returns A generated caption string.
 */
export const generateImageCaption = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            }
          },
          {
            text: "Write a short, engaging, and witty social media caption for this photo. Include 3 relevant hashtags. Do not use quotes."
          }
        ]
      }
    });

    return response.text || "Just sparked this moment! ✨";
  } catch (error) {
    console.error("Error generating caption:", error);
    return "Caught in the moment. ✨ #InstantSpark";
  }
};

/**
 * Suggests a caption based on a simple text description if no image is analyzed (fallback).
 */
export const generateTextCaption = async (description: string): Promise<string> => {
   try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short, cool social media caption for a post about: ${description}. Include emojis and hashtags.`,
    });
    return response.text || "";
   } catch (error) {
     console.error("Error generating text caption", error);
     return description;
   }
}
