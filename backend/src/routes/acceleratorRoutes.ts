import { Router } from 'express';
import { 
  inviteStartup, requestAccess, acceptRequest, getRequests, submitQuestionnaire, 
  allocateTime, scheduleMeeting, addMOM, 
  reportProblem, getProblems, getMyStartup, onboardingChat,
  getSettings, updateSettings,
  getTeam, createSubAdmin, updateSubAdminScopes,
  uploadDocument, actionDocument, onboardDecision
} from '../controllers/acceleratorController';
import { authenticate, authorizeRoles, authorizeScopes } from '../middleware/auth';
import { upload } from '../utils/upload';

const router = Router();

// Startup open request
router.post('/request-access', requestAccess);
router.post('/onboarding-chat', onboardingChat);
router.get('/settings', getSettings);

// Admin & Sub-Admin operations
router.put('/settings', authenticate, authorizeScopes('MANAGE_SETTINGS'), updateSettings);
router.post('/invite', authenticate, authorizeScopes('MANAGE_STARTUPS'), inviteStartup);
router.get('/requests', authenticate, authorizeScopes('MANAGE_STARTUPS'), getRequests);
router.post('/requests/:id/accept', authenticate, authorizeScopes('MANAGE_STARTUPS'), acceptRequest);
router.post('/startups/:startupId/allocate', authenticate, authorizeScopes('MANAGE_STARTUPS'), allocateTime);

// Team Management (Super Admin Only)
router.get('/team', authenticate, authorizeRoles('ADMIN'), getTeam);
router.post('/team', authenticate, authorizeRoles('ADMIN'), createSubAdmin);
router.put('/team/:id/scopes', authenticate, authorizeRoles('ADMIN'), updateSubAdminScopes);

router.post('/meetings', authenticate, authorizeScopes('MANAGE_EVENTS'), scheduleMeeting);
router.put('/meetings/:eventId/mom', authenticate, authorizeScopes('MANAGE_EVENTS', 'STARTUP_FOUNDER'), addMOM);
router.post('/documents', authenticate, authorizeScopes('MANAGE_DOCUMENTS', 'STARTUP_FOUNDER'), upload.single('file'), uploadDocument);
router.post('/startups/:startupId/decision', authenticate, authorizeScopes('MANAGE_STARTUPS'), onboardDecision);
router.get('/problems', authenticate, authorizeScopes('MANAGE_STARTUPS'), getProblems);

// Startup operations
router.put('/questionnaire', authenticate, authorizeRoles('STARTUP_FOUNDER'), submitQuestionnaire);
router.put('/documents/:id/action', authenticate, authorizeRoles('STARTUP_FOUNDER'), actionDocument);
router.post('/problems', authenticate, authorizeRoles('STARTUP_FOUNDER'), reportProblem);
router.get('/my-startup', authenticate, authorizeRoles('STARTUP_FOUNDER'), getMyStartup);

export default router;
