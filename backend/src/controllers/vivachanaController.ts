import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { notificationService } from '../utils/notificationService';

// FLOW 1: Admin Invites CXO
export const inviteCxo = async (req: Request, res: Response) => {
  try {
    const { email, expertise, industries } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Generate secure temporary password for invite
    const tempPassword = crypto.randomBytes(8).toString('hex');
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'CXO',
        cxo: {
          create: {
            expertise: expertise || [],
            industries: industries || [],
            status: 'INVITED'
          }
        }
      }
    });

    // Send an email with the tempPassword and an onboarding link.
    await notificationService.sendWelcomeInvite(email, tempPassword, 'CXO / Think Tank Member');

    res.status(201).json({ message: 'CXO Invited successfully', email, tempPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// FLOW 2: CXO Public Application
export const applyCxo = async (req: Request, res: Response) => {
  try {
    const { email, password, name, expertise, linkedin, bio, previousCompanies, industries } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'CXO',
        cxo: {
          create: {
            expertise: expertise || [],
            linkedin,
            bio,
            previousCompanies: previousCompanies || [],
            industries: industries || [],
            status: 'PENDING'
          }
        }
      }
    });

    res.status(201).json({ message: 'Application submitted successfully. Awaiting review.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Dashboard Intelligence: Get Assigned Startups for a CXO
export const getMyAssignedStartups = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    
    const cxo = await prisma.cxoProfile.findUnique({
      where: { userId },
      include: {
        assignments: {
          include: {
            startup: true
          }
        }
      }
    });

    if (!cxo) return res.status(404).json({ message: 'CXO profile not found' });

    res.status(200).json(cxo.assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Dashboard Intelligence: Matchmaking Engine
export const getStartupMatches = async (req: Request, res: Response) => {
  try {
    const startupId = req.params.startupId as string;
    const startup = await prisma.startup.findUnique({ where: { id: startupId }});
    
    if (!startup) return res.status(404).json({ message: 'Startup not found' });

    const cxos = await prisma.cxoProfile.findMany({
      where: { status: 'ACCEPTED' },
      include: { user: { select: { id: true, email: true } } }
    });

    const aiData = startup.aiProfileData as any;
    const weaknesses = aiData?.swot?.weaknesses || [];
    const industry = startup.industry || '';

    // Smart Matchmaking: Compare CXO Expertise against AI-generated Startup Weaknesses
    const scoredMatches = cxos.map(cxo => {
      let score = 0;
      
      // Base industry match
      if (cxo.industries.includes(industry)) score += 40;
      
      // Strategic Weakness match
      cxo.expertise.forEach(exp => {
        const expLower = exp.toLowerCase();
        weaknesses.forEach((w: string) => {
          if (w.toLowerCase().includes(expLower)) score += 30; // High weight for solving a weakness
        });
      });

      // Ensure minimum score if they have any expertise
      if (score === 0 && cxo.expertise.length > 0) score = 15;

      return { ...cxo, matchScore: Math.min(score, 98) }; // Max 98% match
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json(scoredMatches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Admin Flow: Get Pending CXOs
export const getPendingCxos = async (req: Request, res: Response) => {
  try {
    const cxos = await prisma.cxoProfile.findMany({
      where: { status: 'PENDING' },
      include: { user: { select: { email: true } } }
    });
    res.status(200).json(cxos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Admin Flow: Get Active CXOs
export const getActiveCxos = async (req: Request, res: Response) => {
  try {
    const cxos = await prisma.cxoProfile.findMany({
      where: { status: 'ACCEPTED' },
      include: { user: { select: { email: true } } }
    });
    res.status(200).json(cxos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Admin Flow: Approve CXO
export const approveCxo = async (req: any, res: Response) => {
  try {
    const cxoId = req.params.cxoId;
    const adminId = req.user.id; // From auth middleware

    const cxo = await prisma.cxoProfile.update({
      where: { id: cxoId },
      data: { status: 'ACCEPTED' },
      include: { user: true }
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        action: 'CXO_APPROVED',
        entityType: 'USER',
        entityId: cxo.userId,
        adminId: adminId,
        details: { email: cxo.user.email, cxoId }
      }
    });

    res.status(200).json({ message: 'CXO Approved', cxo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Think Tank: Get Discussions
export const getDiscussions = async (req: Request, res: Response) => {
  try {
    const discussions = await prisma.thinkTankDiscussion.findMany({
      include: {
        author: {
          select: { email: true, cxo: { select: { expertise: true, previousCompanies: true, rating: true, id: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(discussions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Think Tank: Create Discussion
export const createDiscussion = async (req: any, res: Response) => {
  try {
    const { title, content, channel } = req.body;
    const authorId = req.user.id;
    
    const discussion = await prisma.thinkTankDiscussion.create({
      data: {
        title,
        content,
        channel: channel || 'GENERAL',
        authorId
      }
    });
    res.status(201).json(discussion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
