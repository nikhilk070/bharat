import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getHealthAnalytics = async (req: Request, res: Response) => {
  try {
    const startups = await prisma.startup.findMany({
      select: {
        name: true,
        aiProfileData: true,
        allocatedHours: true,
        remainingHours: true
      }
    });

    // Process data for charts
    const chartData = startups.map(s => {
      // Safely parse aiProfileData to extract healthScore, default to 50 if missing
      let healthScore = 50;
      if (s.aiProfileData && typeof s.aiProfileData === 'object') {
        healthScore = (s.aiProfileData as any).healthScore || 50;
      }

      const hoursConsumed = s.allocatedHours - s.remainingHours;

      return {
        name: s.name,
        healthScore,
        hoursConsumed,
        allocatedHours: s.allocatedHours
      };
    });

    res.status(200).json(chartData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
