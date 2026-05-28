import { Request, Response } from 'express';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '../utils/prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-mock-key',
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIza-mock-key');

export const chanakyaChat = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

    // Fetch system context (aggregate ecosystem data for Chanakya to answer questions)
    // Note: In production, you'd use RAG or function calling. We will pass a highly compressed summary here.
    const startupsCount = await prisma.startup.count({ where: { status: 'ONBOARDED' } });
    const cxosCount = await prisma.cxoProfile.count({ where: { status: 'ACCEPTED' } });
    const investorsCount = await prisma.investorProfile.count({ where: { status: 'APPROVED' } });
    
    // Get some startup details for specific querying
    const startups = await prisma.startup.findMany({
      where: { status: 'ONBOARDED' },
      select: { name: true, industry: true, aiProfileData: true }
    });

    const ecosystemContext = `
      You are Chanakya, the super-intelligent AI assistant for Bharat Ventures OS.
      You are speaking to a Super Admin or Subadmin. Answer their questions based on the following real-time database context.
      
      Ecosystem Stats:
      - Onboarded Startups: ${startupsCount}
      - Active CXOs: ${cxosCount}
      - Approved Investors: ${investorsCount}
      
      Startup Data (Name, Industry, SWOT):
      ${startups.map(s => {
        const swot = (s.aiProfileData as any)?.swot;
        return `- ${s.name} (${s.industry}): Strengths: ${swot?.strengths?.join(', ')}, Weaknesses: ${swot?.weaknesses?.join(', ')}`;
      }).join('\n')}
      
      Provide professional, strategic, and concise answers.
    `;

    const settings = await prisma.systemSettings.findUnique({ where: { id: 'global' } });
    const provider = settings?.aiProvider || 'OPENAI';

    let answer = "";

    if (provider === 'OPENAI') {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: ecosystemContext },
          { role: 'user', content: prompt }
        ]
      });
      answer = response.choices[0].message.content || 'I could not generate an answer.';
    } else {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(`${ecosystemContext}\n\nUser Question: ${prompt}`);
      answer = result.response.text();
    }

    res.status(200).json({ answer });
  } catch (error) {
    console.error('Chanakya Chat failed:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
