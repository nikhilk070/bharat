import { Router } from 'express';
import { createStartupProfile, getStartupProfile, getAllStartups } from '../controllers/startupController';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = Router();

// Public/Investor access to see all startups
router.get('/', authenticate, getAllStartups);

// Only STARTUP_FOUNDER can create a profile for themselves
router.post('/', authenticate, authorizeRoles('STARTUP_FOUNDER', 'ADMIN'), createStartupProfile);

// Anyone authenticated can view a specific startup profile
router.get('/:id', authenticate, getStartupProfile);

export default router;
