import express from 'express';
import { adminInviteInvestor, publicApplyInvestor, getPendingInvestors, getApprovedInvestors, approveInvestor, getCuratedStartups, getAdminDealFlow, grantVisibility, revokeVisibility, getAIBriefing } from '../controllers/investorController';
import { authenticate, authorizeRoles, authorizeScopes } from '../middleware/auth';

const router = express.Router();

// Public Routes
router.post('/apply', publicApplyInvestor);

// Admin Routes
router.post('/invite', authenticate, authorizeScopes('MANAGE_INVESTORS'), adminInviteInvestor);
router.get('/pending', authenticate, authorizeScopes('MANAGE_INVESTORS'), getPendingInvestors);
router.get('/approved', authenticate, authorizeScopes('MANAGE_INVESTORS'), getApprovedInvestors);
router.put('/:id/approve', authenticate, authorizeScopes('MANAGE_INVESTORS'), approveInvestor);

// Admin Deal Flow Matrix Routes
router.get('/dealflow', authenticate, authorizeScopes('MANAGE_INVESTORS'), getAdminDealFlow);
router.post('/dealflow/grant', authenticate, authorizeScopes('MANAGE_INVESTORS'), grantVisibility);
router.post('/dealflow/revoke', authenticate, authorizeScopes('MANAGE_INVESTORS'), revokeVisibility);

// Investor Dashboard Flow
router.get('/curated-startups', authenticate, authorizeRoles('INVESTOR'), getCuratedStartups);
router.get('/startups/:startupId/briefing', authenticate, authorizeRoles('INVESTOR'), getAIBriefing);

export default router;
