import axios from "axios";
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
5.  You must return ONLY the JSON object, without any additional explanation or text.
6.  The JSON must have the following structure:
    {
      "idName": string, // The persona's display name (e.g., 顾景琛总, Momi Boss)
      "title": string, // Professional title or certification
      "tags": string[], // 3-4 short profile tags
      "bio": string, // The profile biography/intro
      "location": string, // IP location (e.g., Dubai, Shanghai)
      "posts": [
        {
          "content": string, // The text content of the social media post
          "imageDescription": string, // A short English description of the image for a placeholder (e.g., 'luxury watch steering wheel', 'pilates studio')
          "hashtags": string[], // Relevant hashtags
          "likes": string // Fake like count (e.g., '1.2w')
        }
      ]
    }
`;

export const generatePersonaProfile = async (
  keyword: string, 
  type: PersonaType, 
  options: GenerationOptions
): Promise<PersonaData> => {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) {
    throw new Error("DASHSCOPE_API_KEY is missing");
  }

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
    const response = await axios.post(
      "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
      {
        model: "qwen-flash",
        input: {
          messages: [
            { role: "system", content: SYSTEM_INSTRUCTION },
            { role: "user", content: prompt }
          ]
        },
        parameters: {
          result_format: "json",
          temperature: 0.7,
          top_p: 0.95,
          max_tokens: 2000
        }
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const data = response.data;
    if (!data.output || !data.output.text) {
      throw new Error("No response generated");
    }
    
    const text = data.output.text;
    return JSON.parse(text) as PersonaData;
  } catch (error) {
    console.error("Qwen API Error:", error);
    throw error;
  }
};