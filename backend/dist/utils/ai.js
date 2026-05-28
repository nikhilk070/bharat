"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStartupProfile = void 0;
const openai_1 = __importDefault(require("openai"));
const generative_ai_1 = require("@google/generative-ai");
const prisma_1 = __importDefault(require("./prisma"));
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY || 'sk-mock-key',
});
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIza-mock-key');
const generateStartupProfile = async (questionnaireData) => {
    try {
        const settings = await prisma_1.default.systemSettings.findUnique({
            where: { id: 'global' }
        });
        const provider = settings?.aiProvider || 'OPENAI';
        const prompt = `You are an expert VC analyst for Bharat Accelerator. Analyze the following questionnaire data from a startup and extract their industry, stage, and write a comprehensive profile summary.\n\nQuestionnaire Data: ${JSON.stringify(questionnaireData)}\n\nRespond in JSON format exactly like this:\n{\n  "industry": "...",\n  "stage": "...",\n  "summary": "..."\n}`;
        if (provider === 'OPENAI') {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{ role: 'system', content: prompt }],
                response_format: { type: 'json_object' }
            });
            return JSON.parse(response.choices[0].message.content || '{}');
        }
        else {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);
        }
    }
    catch (error) {
        console.error('AI Profile generation failed:', error);
        return {
            industry: "Unknown",
            stage: "Pre-Seed",
            summary: "AI analysis failed. Please manually update the profile."
        };
    }
};
exports.generateStartupProfile = generateStartupProfile;
