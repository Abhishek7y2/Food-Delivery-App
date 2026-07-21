import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const sendChatMessage = async (message) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are Foodie Bot, a friendly food and health assistant for "Food Delivery App".
The user says: "${message}"

Respond strictly in JSON format with exactly this structure:
{
  "reply": "Your friendly text response here",
  "recommendedFoods": ["Food Item 1", "Food Item 2"]
}
If no specific foods are recommended, leave the recommendedFoods array empty.
Make the reply friendly, conversational, and use emojis! Keep it short.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    let jsonStr = text;
    if (jsonStr.includes("\`\`\`json")) {
        jsonStr = jsonStr.split("\`\`\`json")[1].split("\`\`\`")[0].trim();
    } else if (jsonStr.includes("\`\`\`")) {
        jsonStr = jsonStr.split("\`\`\`")[1].split("\`\`\`")[0].trim();
    }
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
};