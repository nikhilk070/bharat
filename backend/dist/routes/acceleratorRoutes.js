"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const acceleratorController_1 = require("../controllers/acceleratorController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Startup open request
router.post('/request-access', acceleratorController_1.requestAccess);
router.post('/onboarding-chat', acceleratorController_1.onboardingChat);
router.get('/settings', acceleratorController_1.getSettings);
// Admin & Sub-Admin operations
router.put('/settings', auth_1.authenticate, (0, auth_1.authorizeScopes)('MANAGE_SETTINGS'), acceleratorController_1.updateSettings);
router.post('/invite', auth_1.authenticate, (0, auth_1.authorizeRoles)('ADMIN', 'SUB_ADMIN'), acceleratorController_1.inviteStartup);
router.get('/requests', auth_1.authenticate, (0, auth_1.authorizeRoles)('ADMIN', 'SUB_ADMIN'), acceleratorController_1.getRequests);
router.post('/requests/:id/accept', auth_1.authenticate, (0, auth_1.authorizeRoles)('ADMIN'), acceleratorController_1.acceptRequest);
router.post('/startups/:startupId/allocate', auth_1.authenticate, (0, auth_1.authorizeRoles)('ADMIN'), acceleratorController_1.allocateTime);
// Team Management
router.get('/team', auth_1.authenticate, (0, auth_1.authorizeRoles)('ADMIN'), acceleratorController_1.getTeam);
router.post('/team', auth_1.authenticate, (0, auth_1.authorizeRoles)('ADMIN'), acceleratorController_1.createSubAdmin);
router.put('/team/:id/scopes', auth_1.authenticate, (0, auth_1.authorizeRoles)('ADMIN'), acceleratorController_1.updateSubAdminScopes);
router.post('/meetings', auth_1.authenticate, (0, auth_1.authorizeRoles)('ADMIN', 'SUB_ADMIN'), acceleratorController_1.scheduleMeeting);
router.put('/meetings/:eventId/mom', auth_1.authenticate, (0, auth_1.authorizeRoles)('ADMIN', 'SUB_ADMIN', 'STARTUP_FOUNDER'), acceleratorController_1.addMOM);
router.post('/documents', auth_1.authenticate, (0, auth_1.authorizeRoles)('ADMIN', 'SUB_ADMIN'), acceleratorController_1.uploadDocument);
router.post('/startups/:startupId/decision', auth_1.authenticate, (0, auth_1.authorizeRoles)('ADMIN'), acceleratorController_1.onboardDecision);
router.get('/problems', auth_1.authenticate, (0, auth_1.authorizeRoles)('ADMIN', 'SUB_ADMIN'), acceleratorController_1.getProblems);
// Startup operations
router.put('/questionnaire', auth_1.authenticate, (0, auth_1.authorizeRoles)('STARTUP_FOUNDER'), acceleratorController_1.submitQuestionnaire);
router.put('/documents/:id/action', auth_1.authenticate, (0, auth_1.authorizeRoles)('STARTUP_FOUNDER'), acceleratorController_1.actionDocument);
router.post('/problems', auth_1.authenticate, (0, auth_1.authorizeRoles)('STARTUP_FOUNDER'), acceleratorController_1.reportProblem);
router.get('/my-startup', auth_1.authenticate, (0, auth_1.authorizeRoles)('STARTUP_FOUNDER'), acceleratorController_1.getMyStartup);
exports.default = router;
