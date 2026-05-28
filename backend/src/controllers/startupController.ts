import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

export const createStartupProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { name, industry, stage } = req.body;

    const startup = await prisma.startup.create({
      data: {
        name,
        industry,
        stage,
        founderId: userId,
        allocatedHours: 20, // Default hours allocated upon profile creation
        remainingHours: 20
      }
    });

    res.status(201).json({ message: 'Startup profile created', startup });
  } catch (error) {
    console.error('Create startup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getStartupProfile = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const startup = await prisma.startup.findUnique({
      where: { id },
      include: {
        founder: { select: { id: true, email: true } },
        events: true,
        documents: true,
        investments: true
      }
    });

    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    res.status(200).json({ startup });
  } catch (error) {
    console.error('Get startup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllStartups = async (req: AuthRequest, res: Response) => {
  try {
    const startups = await prisma.startup.findMany({
      include: {
        founder: { select: { email: true } }
      }
    });
    res.status(200).json({ startups });
  } catch (error) {
    console.error('Get all startups error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
