import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from './prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-mock-key',
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIza-mock-key');

export const generateStartupProfile = async (questionnaireData: any) => {
  try {
    const settings = await prisma.systemSettings.findUnique({
      where: { id: 'global' }
    });
    
    const provider = settings?.aiProvider || 'OPENAI';
    const prompt = `You are an expert VC analyst for Bharat Accelerator, known as 'Chanakya'. Analyze the following questionnaire data from a startup.
    
    Questionnaire Data: ${JSON.stringify(questionnaireData)}
    
    Extract their industry, stage, and write a comprehensive profile summary. 
    Additionally, generate a 1-100 Investment Readiness Score, and a detailed SWOT analysis (Strengths, Weaknesses, Opportunities, Threats).
    
    Respond in JSON format exactly like this:
    {
      "industry": "...",
      "stage": "...",
      "summary": "...",
      "healthScore": 85,
      "swot": {
        "strengths": ["...", "..."],
        "weaknesses": ["...", "..."],
        "opportunities": ["...", "..."],
        "threats": ["...", "..."]
      }
    }`;

    if (provider === 'OPENAI') {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: prompt }],
        response_format: { type: 'json_object' }
      });
      return JSON.parse(response.choices[0].message.content || '{}');
    } else {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonStr);
    }
  } catch (error) {
    console.error('AI Profile generation failed:', error);
    return {
      industry: "Unknown",
      stage: "Pre-Seed",
      summary: "AI analysis failed. Please manually update the profile.",
      healthScore: 0,
      swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] }
    };
  }
};
