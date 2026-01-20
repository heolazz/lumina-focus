import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Uses Gemini to break down a larger goal into smaller, actionable subtasks.
 * @param goal The main goal or task description provided by the user.
 * @returns A promise resolving to an array of string subtasks.
 */
export const breakDownTaskWithGemini = async (goal: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Break down the following goal into 3 to 5 concise, actionable, single-sentence subtasks suitable for a Pomodoro session. Goal: "${goal}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
    console.error("Error breaking down task with Gemini:", error);
    // Return a fallback or empty array if AI fails, to prevent app crash
    return ["Identify the first step", "Work on the core task", "Review progress"];
  }
};