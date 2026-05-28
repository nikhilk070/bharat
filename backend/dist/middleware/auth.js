"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeScopes = exports.authorizeRoles = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key';
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
exports.authenticate = authenticate;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: insufficient permissions' });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
const authorizeScopes = (...scopes) => {
    return async (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ message: 'Authentication required' });
        if (req.user.role === 'ADMIN') {
            return next();
        }
        if (req.user.role !== 'SUB_ADMIN') {
            return res.status(403).json({ message: 'Access denied: insufficient permissions' });
        }
        try {
            const user = await prisma_1.default.user.findUnique({ where: { id: req.user.id } });
            if (!user)
                return res.status(404).json({ message: 'User not found' });
            const userScopes = Array.isArray(user.subAdminScopes) ? user.subAdminScopes : [];
            const hasScope = scopes.some(scope => userScopes.includes(scope));
            if (!hasScope) {
                return res.status(403).json({ message: `Access denied: missing scope ${scopes.join(', ')}` });
            }
            next();
        }
        catch (error) {
            res.status(500).json({ message: 'Error checking scopes' });
        }
    };
};
exports.authorizeScopes = authorizeScopes;
