"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const startupController_1 = require("../controllers/startupController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public/Investor access to see all startups
router.get('/', auth_1.authenticate, startupController_1.getAllStartups);
// Only STARTUP_FOUNDER can create a profile for themselves
router.post('/', auth_1.authenticate, (0, auth_1.authorizeRoles)('STARTUP_FOUNDER', 'ADMIN'), startupController_1.createStartupProfile);
// Anyone authenticated can view a specific startup profile
router.get('/:id', auth_1.authenticate, startupController_1.getStartupProfile);
exports.default = router;
