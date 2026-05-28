"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCxoDirectory = exports.updateCxoStatus = exports.applyForCxo = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
// CXO applies to become part of the think-tank
const applyForCxo = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const { expertise, linkedin } = req.body;
        const existingProfile = await prisma_1.default.cxoProfile.findUnique({ where: { userId } });
        if (existingProfile) {
            return res.status(400).json({ message: 'Application already exists' });
        }
        const cxoProfile = await prisma_1.default.cxoProfile.create({
            data: {
                userId,
                expertise,
                linkedin,
                status: 'PENDING'
            }
        });
        res.status(201).json({ message: 'Application submitted successfully', cxoProfile });
    }
    catch (error) {
        console.error('CXO application error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.applyForCxo = applyForCxo;
// Admin updates CXO status
const updateCxoStatus = async (req, res) => {
    try {
        const cxoId = req.params.cxoId;
        const { status } = req.body;
        const updatedCxo = await prisma_1.default.cxoProfile.update({
            where: { id: cxoId },
            data: { status }
        });
        res.status(200).json({ message: 'CXO status updated', cxo: updatedCxo });
    }
    catch (error) {
        console.error('CXO status update error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateCxoStatus = updateCxoStatus;
// Public/Startup directory of accepted CXOs
const getCxoDirectory = async (req, res) => {
    try {
        const cxos = await prisma_1.default.cxoProfile.findMany({
            where: { status: 'ACCEPTED' },
            include: {
                user: { select: { email: true } }
            }
        });
        res.status(200).json({ cxos });
    }
    catch (error) {
        console.error('Get CXO directory error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getCxoDirectory = getCxoDirectory;
