"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vivachanaController_1 = require("../controllers/vivachanaController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Anyone authenticated can view the accepted CXOs
router.get('/', auth_1.authenticate, vivachanaController_1.getCxoDirectory);
// CXO applies
router.post('/apply', auth_1.authenticate, (0, auth_1.authorizeRoles)('CXO'), vivachanaController_1.applyForCxo);
// Admin updates application status
router.patch('/:cxoId/status', auth_1.authenticate, (0, auth_1.authorizeRoles)('ADMIN'), vivachanaController_1.updateCxoStatus);
exports.default = router;
