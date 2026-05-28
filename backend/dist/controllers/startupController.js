"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllStartups = exports.getStartupProfile = exports.createStartupProfile = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const createStartupProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const { name, industry, stage } = req.body;
        const startup = await prisma_1.default.startup.create({
            data: {
                name,
                industry,
                stage,
                founderId: userId,
                allocatedHours: 20, // Default hours allocated upon profile creation
                remainingHours: 20
            }
        });
        res.status(201).json({ message: 'Startup profile created', startup });
    }
    catch (error) {
        console.error('Create startup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createStartupProfile = createStartupProfile;
const getStartupProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const startup = await prisma_1.default.startup.findUnique({
            where: { id },
            include: {
                founder: { select: { id: true, email: true } },
                events: true,
                documents: true,
                investments: true
            }
        });
        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }
        res.status(200).json({ startup });
    }
    catch (error) {
        console.error('Get startup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getStartupProfile = getStartupProfile;
const getAllStartups = async (req, res) => {
    try {
        const startups = await prisma_1.default.startup.findMany({
            include: {
                founder: { select: { email: true } }
            }
        });
        res.status(200).json({ startups });
    }
    catch (error) {
        console.error('Get all startups error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllStartups = getAllStartups;
