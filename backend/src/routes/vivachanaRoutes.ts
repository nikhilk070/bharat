import { Router } from 'express';
import { inviteCxo, applyCxo, getMyAssignedStartups, getStartupMatches, getPendingCxos, getActiveCxos, approveCxo, getDiscussions, createDiscussion } from '../controllers/vivachanaController';
import { authenticate, authorizeRoles, authorizeScopes } from '../middleware/auth';

const router = Router();

// Public Flow
router.post('/apply', applyCxo);

// Admin Flow
router.post('/invite', authenticate, authorizeScopes('MANAGE_VIVACHANA'), inviteCxo);
router.get('/pending', authenticate, authorizeScopes('MANAGE_VIVACHANA'), getPendingCxos);
router.get('/active', authenticate, authorizeScopes('MANAGE_VIVACHANA'), getActiveCxos);
router.put('/:cxoId/approve', authenticate, authorizeScopes('MANAGE_VIVACHANA'), approveCxo);

// Matchmaking Engine
router.get('/startups/:startupId/matches', authenticate, authorizeRoles('ADMIN', 'SUB_ADMIN', 'STARTUP_FOUNDER'), getStartupMatches);

// CXO Dashboard Flow
router.get('/my-startups', authenticate, authorizeRoles('CXO'), getMyAssignedStartups);

// Think Tank Flow
router.get('/discussions', authenticate, getDiscussions);
router.post('/discussions', authenticate, createDiscussion);

export default router;
