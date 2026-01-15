import OpenAI from "openai";
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
1.  Receive a 'keyword' and a 'type'.
2.  Generate a JSON object.
3.  The content MUST be in CHINESE (Simplified).
4.  The content must be cringey, pretentious, and use the specific vocabulary provided above.

### OUTPUT FORMAT
You must respond with a valid JSON object strictly matching this structure:
{
  "idName": "string (e.g. 顾景琛总)",
  "title": "string (Professional title)",
  "tags": ["string", "string", "string"],
  "bio": "string (Profile biography)",
  "location": "string (e.g. Dubai)",
  "posts": [
    {
      "content": "string (Post text)",
      "imageDescription": "string (Short English description for image generation)",
      "hashtags": ["string"],
      "likes": "string (e.g. '1.2w')"
    }
  ]
}
`;

export const generatePersonaProfile = async (
  keyword: string, 
  type: PersonaType, 
  options: GenerationOptions
): Promise<PersonaData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  // Initialize OpenAI client for DashScope (Aliyun Qwen)
  const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    dangerouslyAllowBrowser: true // Required for client-side usage
  });

  let extraInstructions = "";
  if (options.includeMCN) {
    extraInstructions += " - In the bio, you MUST include a phrase similar to '新晋[Random City]卓越MCN总裁'.\n";
  }
  if (options.includeShareholders) {
    extraInstructions += " - In the bio, you MUST include a phrase similar to '前[Random Number]万粉成为我的精神股东'.\n";
  }
  if (options.includeStats) {
    extraInstructions += " - In the bio, you MUST include realistic Height and Weight stats.\n";
  }

  const userPrompt = `
    Generate a satirical '${type}' persona based on the keyword: "${keyword}".
    Make it sound extremely pretentious and cliché.
    
    Specific Requirements for BIO:
    ${extraInstructions}
    
    IMPORTANT: Respond ONLY with the JSON object. Do not include markdown formatting like \`\`\`json.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "qwen-flash",
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const text = completion.choices[0].message.content;
    if (!text) throw new Error("No response generated");
    
    return JSON.parse(text) as PersonaData;
  } catch (error) {
    console.error("Qwen/DashScope API Error:", error);
    throw error;
  }
};
