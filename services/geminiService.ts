
import { GoogleGenAI, Type } from "@google/genai";
import { Ticket, AISuggestion } from "../types";

// Note: API_KEY is expected to be set in the environment variables.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled. Please set process.env.API_KEY.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const suggestionSchema = {
  type: Type.OBJECT,
  properties: {
    solutions: {
      type: Type.ARRAY,
      description: "A list of 2-3 brief, actionable troubleshooting steps or solutions for the user to try.",
      items: {
        type: Type.STRING
      }
    },
    keywords: {
      type: Type.ARRAY,
      description: "A list of 3-5 relevant keywords for searching a knowledge base.",
      items: {
        type: Type.STRING
      }
    }
  },
  required: ["solutions", "keywords"]
};


export const getTicketSuggestions = async (ticket: Ticket): Promise<AISuggestion | null> => {
  if (!API_KEY) {
    // Return mock data if API key is not available
    return {
        solutions: ["Restart the computer.", "Check network cable connection.", "Clear browser cache and cookies."],
        keywords: ["VPN", "Connection Error", "Windows 11", "Network"]
    };
  }

  try {
    const prompt = `
      Analyze the following IT helpdesk ticket and provide potential solutions and relevant knowledge base keywords.
      Ticket Title: "${ticket.title}"
      Ticket Description: "${ticket.description}"
      Ticket Category: "${ticket.category}"
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: suggestionSchema,
      },
    });

    const jsonText = response.text.trim();
    const suggestions = JSON.parse(jsonText) as AISuggestion;
    return suggestions;

  } catch (error) {
    console.error("Error fetching suggestions from Gemini API:", error);
    return null;
  }
};
