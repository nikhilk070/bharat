"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const investorController_1 = require("../controllers/investorController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Setup profile
router.post('/profile', auth_1.authenticate, (0, auth_1.authorizeRoles)('INVESTOR'), investorController_1.setupInvestorProfile);
// Pledge investment
router.post('/pledge', auth_1.authenticate, (0, auth_1.authorizeRoles)('INVESTOR'), investorController_1.pledgeInvestment);
// Data Room Access
router.get('/data-room/:startupId', auth_1.authenticate, (0, auth_1.authorizeRoles)('INVESTOR', 'ADMIN'), investorController_1.getDataRoomAccess);
exports.default = router;
