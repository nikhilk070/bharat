import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// FLOW 1: Admin Invites Investor
export const adminInviteInvestor = async (req: Request, res: Response) => {
  try {
    const { email, firmName, investorType, ticketSize, sectors, geography, stagePreference } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const tempPassword = crypto.randomBytes(8).toString('hex');
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'INVESTOR',
        investor: {
          create: {
            firmName,
            investorType,
            ticketSize,
            sectors: sectors || [],
            geography: geography || [],
            stagePreference: stagePreference || [],
            status: 'APPROVED' // Admin invited, pre-approved
          }
        }
      }
    });

    res.status(201).json({ message: 'Investor Invited successfully', email, tempPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// FLOW 2: Public Application
export const publicApplyInvestor = async (req: Request, res: Response) => {
  try {
    const { email, password, firmName, linkedin, pan, investorType, ticketSize, sectors, geography, stagePreference } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'INVESTOR',
        investor: {
          create: {
            firmName,
            linkedin,
            pan,
            investorType,
            ticketSize,
            sectors: sectors || [],
            geography: geography || [],
            stagePreference: stagePreference || [],
            status: 'PENDING'
          }
        }
      }
    });

    res.status(201).json({ message: 'Application submitted successfully. Awaiting compliance review.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Admin Endpoints
export const getPendingInvestors = async (req: Request, res: Response) => {
  try {
    const investors = await prisma.investorProfile.findMany({
      where: { status: 'PENDING' },
      include: { user: { select: { email: true } } }
    });
    res.status(200).json(investors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getApprovedInvestors = async (req: Request, res: Response) => {
  try {
    const investors = await prisma.investorProfile.findMany({
      where: { status: 'APPROVED' },
      include: { user: { select: { email: true } } }
    });
    res.status(200).json(investors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const approveInvestor = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const investor = await prisma.investorProfile.update({
      where: { id },
      data: { status: 'APPROVED' }
    });
    res.status(200).json(investor);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Dashboard Endpoint: Get Startups where Visibility == Granted
export const getCuratedStartups = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const investor = await prisma.investorProfile.findUnique({ where: { userId }});
    
    if (!investor) return res.status(404).json({ message: 'Profile not found' });

    const visibilities = await prisma.startupVisibility.findMany({
      where: { investorId: investor.id },
      include: {
        startup: true
      }
    });

    res.status(200).json(visibilities.map((v: any) => v.startup));
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Admin Endpoints for Deal Flow Routing
export const getAdminDealFlow = async (req: Request, res: Response) => {
  try {
    // 1. Fetch all ONBOARDED startups with their visibilities
    const startups = await prisma.startup.findMany({
      where: { status: 'ONBOARDED' },
      include: {
        visibilities: {
          include: { investor: true }
        }
      }
    });

    // 2. Fetch all APPROVED investors for the dropdown
    const availableInvestors = await prisma.investorProfile.findMany({
      where: { status: 'APPROVED' },
      select: { id: true, firmName: true }
    });

    res.status(200).json({ startups, availableInvestors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const grantVisibility = async (req: Request, res: Response) => {
  try {
    const { startupId, investorId } = req.body;
    const visibility = await prisma.startupVisibility.create({
      data: { startupId, investorId }
    });
    res.status(201).json(visibility);
  } catch (error) {
    console.error(error);
    // Handle unique constraint if already granted
    res.status(500).json({ message: 'Failed to grant access or access already exists.' });
  }
};

export const revokeVisibility = async (req: Request, res: Response) => {
  try {
    const { startupId, investorId } = req.body;
    await prisma.startupVisibility.delete({
      where: {
        startupId_investorId: { startupId, investorId }
      }
    });
    res.status(200).json({ message: 'Access Revoked' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to revoke access' });
  }
};

// Chanakya AI Briefing for Investors
export const getAIBriefing = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const startupId = req.params.startupId as string;

    const investor = await prisma.investorProfile.findUnique({ where: { userId }});
    if (!investor) return res.status(404).json({ message: 'Investor not found' });

    // Verify they actually have access to this startup
    const visibility = await prisma.startupVisibility.findUnique({
      where: { startupId_investorId: { startupId, investorId: investor.id } }
    });
    if (!visibility) return res.status(403).json({ message: 'Not authorized to view this startup' });

    const startup = await prisma.startup.findUnique({ where: { id: startupId }});
    if (!startup) return res.status(404).json({ message: 'Startup not found' });

    // In a real production system, this would call `gemini.generateContent` with the investor's thesis + startup data.
    // For fast demonstration, we will generate a heuristic briefing based on the AI SWOT data.
    const aiData = startup.aiProfileData as any;
    const weaknesses = aiData?.swot?.weaknesses || [];
    const strengths = aiData?.swot?.strengths || [];

    const isMatch = investor.sectors.includes(startup.industry || '');
    
    let briefingText = `Chanakya Analysis: ${startup.name} is a ${isMatch ? "strong" : "potential"} fit for your thesis. `;
    briefingText += `Their primary strength is ${strengths[0] || 'their core technology'}. `;
    briefingText += `However, you should focus your due diligence on their weakness in ${weaknesses[0] || 'market penetration'}.`;

    res.status(200).json({
      briefing: briefingText,
      matchConfidence: isMatch ? 92 : 65,
      timestamp: new Date()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
