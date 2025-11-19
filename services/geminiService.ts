import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

// Initialize the client once. 
const ai = new GoogleGenAI({ apiKey: API_KEY });

interface EditImageParams {
  imageBase64: string;
  mimeType: string;
  prompt: string;
}

/**
 * Edits an image using the Gemini 2.5 Flash Image model (Nano Banana).
 */
export const editImageWithGemini = async ({
  imageBase64,
  mimeType,
  prompt
}: EditImageParams): Promise<string> => {
  try {
    // Gemini 2.5 Flash Image model alias
    const modelName = 'gemini-2.5-flash-image';

    // Use array structure for contents to ensure correct parsing by the API
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: imageBase64,
                mimeType: mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
        }
      ],
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    console.log("Gemini Response:", response);

    // Check for candidates
    const candidate = response.candidates?.[0];
    if (!candidate) {
      throw new Error("No candidates returned. The model might have filtered the response.");
    }

    // Check finish reason
    if (candidate.finishReason && candidate.finishReason !== 'STOP') {
        if (candidate.finishReason === 'SAFETY') {
            throw new Error("The edit was blocked by safety filters. Please try a different prompt or image.");
        }
        // Log other reasons but allow falling through to check for parts, just in case
        console.warn(`Generation finished with reason: ${candidate.finishReason}`);
    }

    const parts = candidate.content?.parts;
      
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const returnedMime = part.inlineData.mimeType || 'image/png';
          return `data:${returnedMime};base64,${part.inlineData.data}`;
        }
      }
    }

    // If we get here, no image was found
    throw new Error(`No image data found in response. The model could not generate the edit (Reason: ${candidate.finishReason || 'Unknown'}).`);

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};