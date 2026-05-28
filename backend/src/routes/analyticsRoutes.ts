import { Router } from 'express';
import { getHealthAnalytics } from '../controllers/analyticsController';
import { authenticate, authorizeScopes } from '../middleware/auth';

const router = Router();

// Only Admins can view ecosystem analytics
router.get('/', authenticate, authorizeScopes('MANAGE_SETTINGS'), getHealthAnalytics);

export default router;
