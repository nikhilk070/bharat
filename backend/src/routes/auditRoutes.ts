import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditController';
import { authenticate, authorizeScopes } from '../middleware/auth';

const router = Router();

// Only Admins can view audit logs
router.get('/', authenticate, authorizeScopes('MANAGE_SETTINGS'), getAuditLogs);

export default router;
