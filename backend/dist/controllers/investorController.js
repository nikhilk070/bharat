"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataRoomAccess = exports.pledgeInvestment = exports.setupInvestorProfile = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
// Setup Investor Profile
const setupInvestorProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const { firmName } = req.body;
        const existingProfile = await prisma_1.default.investorProfile.findUnique({ where: { userId } });
        if (existingProfile) {
            return res.status(400).json({ message: 'Investor profile already exists' });
        }
        const investorProfile = await prisma_1.default.investorProfile.create({
            data: {
                userId,
                firmName
            }
        });
        res.status(201).json({ message: 'Investor profile created', investorProfile });
    }
    catch (error) {
        console.error('Investor profile setup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.setupInvestorProfile = setupInvestorProfile;
// Pledge an investment
const pledgeInvestment = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const { startupId, amount, equityPercent } = req.body;
        const investor = await prisma_1.default.investorProfile.findUnique({ where: { userId } });
        if (!investor)
            return res.status(404).json({ message: 'Investor profile not found' });
        const investment = await prisma_1.default.investment.create({
            data: {
                investorId: investor.id,
                startupId,
                amount,
                equityPercent,
                status: 'PENDING_FUNDS'
            }
        });
        res.status(201).json({ message: 'Investment pledged successfully', investment });
    }
    catch (error) {
        console.error('Investment pledge error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.pledgeInvestment = pledgeInvestment;
// Get Data Room Access URL (Mocking AWS S3 Presigned URL)
const getDataRoomAccess = async (req, res) => {
    try {
        const startupId = req.params.startupId;
        // Check if the user is an investor or admin
        // Normally we would check if they have requested access or have KYC completed.
        // Mock S3 Presigned URL for data room
        const accessUrl = `https://s3.amazonaws.com/bharat-ventures/data-rooms/${startupId}?token=mock-presigned-token-valid-for-1h`;
        res.status(200).json({ message: 'Data room access granted', accessUrl });
    }
    catch (error) {
        console.error('Data room access error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getDataRoomAccess = getDataRoomAccess;
