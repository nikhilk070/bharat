import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key';

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

export const authorizeScopes = (...scopes: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });

    if (req.user.role === 'ADMIN') {
      return next();
    }

    if (req.user.role !== 'SUB_ADMIN') {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }

    try {
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (!user) return res.status(404).json({ message: 'User not found' });

      const userScopes = Array.isArray(user.subAdminScopes) ? (user.subAdminScopes as string[]) : [];
      
      const hasScope = scopes.some(scope => userScopes.includes(scope));
      if (!hasScope) {
        return res.status(403).json({ message: `Access denied: missing scope ${scopes.join(', ')}` });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: 'Error checking scopes' });
    }
  };
};
