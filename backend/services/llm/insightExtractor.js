import { GoogleGenerativeAI } from '@google/generative-ai';
import { getInsightPrompt } from './promptTemplates.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function extractCallInsight(transcript, customerContext) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = getInsightPrompt(transcript, customerContext);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let textResponse = response.text();

    const cleanJsonText = textResponse.replace(/```json/gi, '').replace(/```/g, '').trim();

    const insightData = JSON.parse(cleanJsonText);
    return insightData;

  } catch (error) {
    console.error("❌ Lỗi khi gọi Gemini trích xuất insight:", error);
    throw error;
  }
}