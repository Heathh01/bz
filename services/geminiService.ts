import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PersonaType, PersonaData, GenerationOptions } from "../types";

const SYSTEM_INSTRUCTION = `
You are a satirical creative writer and expert in Chinese internet subcultures. 
Your goal is to generate a "Fake Elite" persona (Fake CEO or Fake Socialite) based on user input.
You must adhere strictly to the "Internet Persona" tropes described below.

### TONES & TROPES

**1. "霸总" (CEO) Template**
*   **Core Logic**: Emphasize wealth but deep loneliness/pressure. Implies access to "resources" and "dividends".
*   **Bio Style**: Uses compound surnames or English titles. Mentions "Holdings", "Forbes", "EMBA".
*   **Keywords**: Cognition (认知), Pattern/Layout (格局), Underlying Logic (底层逻辑), Closed Loop (闭环), Dimension Reduction Attack (降维打击), Long-termism (长期主义).
*   **Vibe**: "3 AM at The Bund", "Just refused a 20M investment", "Shouldering the livelihood of hundreds of employees".

**2. "名媛" (Socialite/Boss Babe) Template**
*   **Core Logic**: "Men are unreliable", "Making money is top priority", "I am the rich family".
*   **Bio Style**: "Founder", "6-year Entrepreneur", "Leading 3000+ women to independence".
*   **Keywords**: Female Growth (女性成长), Sober/Awake (清醒), Upward Socializing (向上社交), Economic Independence (经济独立), Landing/Execution (落地), Monetization (变现).
*   **Vibe**: Pilates, Hermes, "Money is my confidence", "Change your circle to change your fate".

### INSTRUCTIONS
1.  Receive a 'keyword' (e.g., "Coffee", "Meeting", "Dubai") and a 'type' (CEO or SOCIALITE).
2.  Generate a JSON object containing a profile and 3 social media posts.
3.  The content MUST be in CHINESE (Simplified).
4.  The content must be cringey, pretentious, and use the specific vocabulary provided above.
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    idName: { type: Type.STRING, description: "The persona's display name (e.g., 顾景琛总, Momi Boss)" },
    title: { type: Type.STRING, description: "Professional title or certification" },
    tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-4 short profile tags" },
    bio: { type: Type.STRING, description: "The profile biography/intro" },
    location: { type: Type.STRING, description: "IP location (e.g., Dubai, Shanghai)" },
    posts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          content: { type: Type.STRING, description: "The text content of the social media post" },
          imageDescription: { type: Type.STRING, description: "A short English description of the image for a placeholder (e.g., 'luxury watch steering wheel', 'pilates studio')" },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Relevant hashtags" },
          likes: { type: Type.STRING, description: "Fake like count (e.g., '1.2w')" },
        }
      }
    }
  },
  required: ["idName", "title", "tags", "bio", "location", "posts"]
};

export const generatePersonaProfile = async (
  keyword: string, 
  type: PersonaType, 
  options: GenerationOptions
): Promise<PersonaData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  let extraInstructions = "";
  if (options.includeMCN) {
    extraInstructions += " - In the bio, you MUST include a phrase similar to '新晋[Random City]卓越MCN总裁' (e.g., 新晋杭州卓越MCN总裁).\n";
  }
  if (options.includeShareholders) {
    extraInstructions += " - In the bio, you MUST include a phrase similar to '前[Random Number]万粉成为我的精神股东' (e.g., 前30万粉成为我的精神股东).\n";
  }
  if (options.includeStats) {
    extraInstructions += " - In the bio, you MUST include realistic Height and Weight stats (e.g., 185cm/75kg for CEO, 168cm/45kg for Socialite).\n";
  }

  const prompt = `
    Generate a satirical '${type}' persona based on the keyword: "${keyword}".
    Make it sound extremely pretentious and cliché.
    
    Specific Requirements for BIO (Must Include if listed):
    ${extraInstructions}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response generated");
    
    return JSON.parse(text) as PersonaData;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
