import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role, subAdminScopes } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: role || 'STARTUP_FOUNDER',
        subAdminScopes: role === 'SUB_ADMIN' ? subAdminScopes : undefined
      }
    });

    res.status(201).json({ message: 'User registered successfully', userId: user.id, role: user.role });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        scopes: user.role === 'SUB_ADMIN' ? user.subAdminScopes : []
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const applyStartup = async (req: Request, res: Response) => {
  try {
    const {
      startupName,
      industry,
      stage,
      website,
      founderName,
      email,
      password,
      problem,
      solution,
      revenue
    } = req.body;

    if (!email || !password || !startupName) {
      return res.status(400).json({ message: 'Email, password, and startup name are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const pitchDeckUrl = req.file ? (req.file as any).path : null;

    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create User and Startup in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          role: 'STARTUP_FOUNDER',
        }
      });

      const startup = await tx.startup.create({
        data: {
          name: startupName,
          industry,
          stage,
          founderId: user.id,
          status: 'REQUESTED',
          questionnaireData: {
            founderName,
            website,
            problem,
            solution,
            revenue,
            pitchDeckUrl
          }
        }
      });

      return { user, startup };
    });

    res.status(201).json({ message: 'Application submitted successfully', startupId: result.startup.id });
  } catch (error) {
    console.error('Application error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
