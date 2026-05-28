"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubAdminScopes = exports.createSubAdmin = exports.getTeam = exports.updateSettings = exports.getSettings = exports.getMyStartup = exports.getProblems = exports.reportProblem = exports.onboardDecision = exports.actionDocument = exports.uploadDocument = exports.addMOM = exports.scheduleMeeting = exports.allocateTime = exports.submitQuestionnaire = exports.onboardingChat = exports.getRequests = exports.acceptRequest = exports.requestAccess = exports.inviteStartup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const mail_1 = require("../utils/mail");
const ai_1 = require("../utils/ai");
const openai_1 = __importDefault(require("openai"));
// Phase 1: Access & Invites
const inviteStartup = async (req, res) => {
    try {
        const { email, startupName } = req.body;
        const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser)
            return res.status(400).json({ message: 'User already exists' });
        const password = Math.random().toString(36).slice(-8); // Random temp password
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                email,
                passwordHash,
                role: 'STARTUP_FOUNDER',
                startup: {
                    create: {
                        name: startupName,
                        status: 'INVITED',
                    }
                }
            }
        });
        await (0, mail_1.sendEmail)(email, 'You are invited to Bharat Accelerator', `<p>Welcome to Bharat Accelerator. Your temp password is: <b>${password}</b></p>`);
        res.status(201).json({ message: 'Startup invited', userId: user.id });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.inviteStartup = inviteStartup;
const requestAccess = async (req, res) => {
    try {
        const { email, startupName, questionnaireData } = req.body;
        const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser)
            return res.status(400).json({ message: 'User already exists' });
        const placeholderPassword = Math.random().toString(36).slice(-8);
        const passwordHash = await bcrypt_1.default.hash(placeholderPassword, 10);
        const user = await prisma_1.default.user.create({
            data: {
                email,
                passwordHash,
                role: 'STARTUP_FOUNDER',
                isVerified: false,
                startup: {
                    create: {
                        name: startupName,
                        status: 'REQUESTED',
                        questionnaireData,
                    }
                }
            },
            include: { startup: true }
        });
        res.status(201).json({ message: 'Application submitted successfully. AI Profiling started.' });
        if (user.startup) {
            const startupId = user.startup.id;
            (async () => {
                try {
                    const aiProfile = await (0, ai_1.generateStartupProfile)(questionnaireData);
                    await prisma_1.default.startup.update({
                        where: { id: startupId },
                        data: {
                            aiProfileData: aiProfile,
                            industry: aiProfile.industry,
                            stage: aiProfile.stage
                        }
                    });
                }
                catch (err) {
                    console.error('Background AI profiling error on organic request', err);
                }
            })();
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.requestAccess = requestAccess;
const acceptRequest = async (req, res) => {
    try {
        const id = req.params.id;
        const startup = await prisma_1.default.startup.findUnique({ where: { id }, include: { founder: true } });
        if (!startup)
            return res.status(404).json({ message: 'Startup not found' });
        if (startup.status !== 'REQUESTED')
            return res.status(400).json({ message: 'Startup is not in REQUESTED state' });
        const password = Math.random().toString(36).slice(-8);
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        await prisma_1.default.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: startup.founderId },
                data: { passwordHash, isVerified: true }
            });
            await tx.startup.update({
                where: { id },
                data: { status: 'AI_PROFILED' }
            });
        });
        await (0, mail_1.sendEmail)(startup.founder.email, 'Your Application to Bharat Accelerator is Approved', `<p>Congratulations! Your startup has been accepted. Your temporary login password is: <b>${password}</b></p><p>Please log in at /login.</p>`);
        res.status(200).json({ message: 'Startup accepted and email sent.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.acceptRequest = acceptRequest;
const getRequests = async (req, res) => {
    try {
        const requests = await prisma_1.default.startup.findMany({
            where: { status: 'REQUESTED' },
            include: { founder: { select: { email: true } } }
        });
        res.status(200).json(requests);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getRequests = getRequests;
const onboardingChat = async (req, res) => {
    try {
        const { messages } = req.body;
        const settings = await prisma_1.default.systemSettings.findUnique({ where: { id: 'global' } });
        const schema = settings?.questionnaireSchema;
        let keysList = "";
        let totalKeys = 0;
        if (schema && schema.steps) {
            schema.steps.forEach((step) => {
                step.fields.forEach((field) => {
                    totalKeys++;
                    keysList += `${totalKeys}. ${field.name} (${field.label})\n`;
                });
            });
        }
        else {
            keysList = "1. startupName\n2. problemStatement\n";
            totalKeys = 2;
        }
        const openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
        const systemPrompt = `You are the Bharat Accelerator Onboarding Agent. Your goal is to collect the following details from the startup founder:
${keysList}

Ask conversational, friendly questions one or two at a time. If they give brief answers, that's fine. 
If you have collected ALL ${totalKeys} details (or a reasonable approximation of them), you MUST output EXACTLY and ONLY a JSON object containing these ${totalKeys} keys. DO NOT output any other text when complete.`;
        const apiMessages = [
            { role: 'system', content: systemPrompt },
            ...messages
        ];
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: apiMessages,
            temperature: 0.7,
        });
        const reply = response.choices[0].message.content || "";
        res.status(200).json({ reply });
    }
    catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({ message: 'Error processing AI chat' });
    }
};
exports.onboardingChat = onboardingChat;
// Phase 2: Questionnaire & AI Profiling
const submitQuestionnaire = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { questionnaireData } = req.body;
        const startup = await prisma_1.default.startup.findUnique({ where: { founderId: userId } });
        if (!startup)
            return res.status(404).json({ message: 'Startup not found' });
        await prisma_1.default.startup.update({
            where: { id: startup.id },
            data: { questionnaireData, status: 'QUESTIONNAIRE_SUBMITTED' }
        });
        res.status(200).json({ message: 'Questionnaire submitted. AI Profile generation started in background.' });
        // Background job for AI profiling
        (async () => {
            try {
                const aiProfile = await (0, ai_1.generateStartupProfile)(questionnaireData);
                await prisma_1.default.startup.update({
                    where: { id: startup.id },
                    data: {
                        aiProfileData: aiProfile,
                        status: 'AI_PROFILED',
                        industry: aiProfile.industry,
                        stage: aiProfile.stage
                    }
                });
            }
            catch (err) {
                console.error('Background AI profiling error', err);
            }
        })();
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.submitQuestionnaire = submitQuestionnaire;
// Phase 3: Time Allocation & Meetings
const allocateTime = async (req, res) => {
    try {
        const startupId = req.params.startupId;
        const { allocatedHours, allocatedDays } = req.body;
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + allocatedDays);
        await prisma_1.default.startup.update({
            where: { id: startupId },
            data: {
                allocatedHours,
                remainingHours: allocatedHours,
                allocatedDays,
                onboardingDeadline: deadline,
                status: 'UNDER_REVIEW'
            }
        });
        res.status(200).json({ message: 'Time allocated and startup under review' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.allocateTime = allocateTime;
const scheduleMeeting = async (req, res) => {
    try {
        const { startupId, heading, meetingLink, isOffline, scheduledAt, durationHours } = req.body;
        const event = await prisma_1.default.event.create({
            data: {
                startupId, heading, meetingLink, isOffline,
                scheduledAt: new Date(scheduledAt),
                durationHours, status: 'SCHEDULED'
            }
        });
        res.status(201).json({ message: 'Meeting scheduled', event });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.scheduleMeeting = scheduleMeeting;
const addMOM = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const { mom } = req.body;
        const event = await prisma_1.default.event.findUnique({ where: { id: eventId } });
        if (!event)
            return res.status(404).json({ message: 'Event not found' });
        if (event.status !== 'COMPLETED') {
            await prisma_1.default.$transaction(async (tx) => {
                await tx.event.update({ where: { id: eventId }, data: { mom, status: 'COMPLETED' } });
                await tx.timeLedger.create({ data: { startupId: event.startupId, hoursDeducted: event.durationHours, reason: 'Meeting MOM' } });
                await tx.startup.update({ where: { id: event.startupId }, data: { remainingHours: { decrement: event.durationHours } } });
            });
        }
        else {
            await prisma_1.default.event.update({ where: { id: eventId }, data: { mom } });
        }
        res.status(200).json({ message: 'MOM added and Time-Bank updated' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.addMOM = addMOM;
// Phase 4: Document Pipeline
const uploadDocument = async (req, res) => {
    try {
        const { startupId, heading, fileUrl, signatureRequired } = req.body;
        const doc = await prisma_1.default.document.create({
            data: { startupId, heading, fileUrl, signatureRequired, status: 'UPLOADED' }
        });
        const startup = await prisma_1.default.startup.findUnique({ where: { id: startupId }, include: { founder: true } });
        if (startup) {
            await (0, mail_1.sendEmail)(startup.founder.email, 'New Document Uploaded', '<p>Please review your new document.</p>');
        }
        res.status(201).json({ message: 'Document uploaded', doc });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.uploadDocument = uploadDocument;
const actionDocument = async (req, res) => {
    try {
        const id = req.params.id;
        const { action } = req.body; // 'READ' or 'SIGN'
        const status = action === 'SIGN' ? 'SIGNED' : 'READ_BY_STARTUP';
        await prisma_1.default.document.update({ where: { id }, data: { status } });
        res.status(200).json({ message: `Document marked as ${status}` });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.actionDocument = actionDocument;
// Phase 5: Final Decision & Problems
const onboardDecision = async (req, res) => {
    try {
        const startupId = req.params.startupId;
        const { decision } = req.body; // 'ONBOARDED' or 'REJECTED'
        await prisma_1.default.startup.update({ where: { id: startupId }, data: { status: decision } });
        res.status(200).json({ message: `Startup ${decision}` });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.onboardDecision = onboardDecision;
const reportProblem = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { title, description } = req.body;
        const startup = await prisma_1.default.startup.findUnique({ where: { founderId: userId } });
        if (!startup)
            return res.status(404).json({ message: 'Startup not found' });
        await prisma_1.default.problemReport.create({
            data: { startupId: startup.id, title, description }
        });
        res.status(201).json({ message: 'Problem reported' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.reportProblem = reportProblem;
const getProblems = async (req, res) => {
    try {
        const problems = await prisma_1.default.problemReport.findMany({ include: { startup: true } });
        res.status(200).json(problems);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getProblems = getProblems;
const getMyStartup = async (req, res) => {
    try {
        const userId = req.user?.id;
        const startup = await prisma_1.default.startup.findUnique({
            where: { founderId: userId },
            include: { events: true, documents: true, problemReports: true, timeLedger: true }
        });
        res.status(200).json(startup);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getMyStartup = getMyStartup;
// System Settings
const getSettings = async (req, res) => {
    try {
        const settings = await prisma_1.default.systemSettings.findUnique({ where: { id: 'global' } });
        if (!settings) {
            const defaultSchema = {
                steps: [
                    {
                        title: "Company Basics",
                        fields: [
                            { name: "startupName", label: "Startup Name", type: "text", required: true },
                            { name: "city", label: "City", type: "text", required: true },
                            { name: "registrationYear", label: "Reg. Year", type: "text", required: true },
                            { name: "problemStatement", label: "Core Problem Solved", type: "textarea", required: true }
                        ]
                    },
                    {
                        title: "Product & Market",
                        fields: [
                            { name: "productDescription", label: "Solution / Product Description", type: "textarea", required: true },
                            { name: "targetMarket", label: "Target Market", type: "text", required: true },
                            { name: "competitors", label: "Top Competitors", type: "text", required: true }
                        ]
                    },
                    {
                        title: "Traction & Metrics",
                        fields: [
                            { name: "stage", label: "Current Stage", type: "select", options: ["Idea", "MVP Developed", "Early Revenue", "Growth / Scale"], required: true },
                            { name: "mrr", label: "Current MRR / Active Users", type: "text", required: true },
                            { name: "keyMilestone", label: "Key Milestone Achieved", type: "text", required: true }
                        ]
                    },
                    {
                        title: "Funding & Team",
                        fields: [
                            { name: "founderName", label: "Founder Name", type: "text", required: true },
                            { name: "linkedin", label: "LinkedIn URL", type: "text", required: true },
                            { name: "totalFunding", label: "Total Funding Raised (USD)", type: "text", required: true },
                            { name: "currentAsk", label: "Current Ask & Equity Offered", type: "text", required: true }
                        ]
                    }
                ]
            };
            const defaultSettings = await prisma_1.default.systemSettings.create({
                data: {
                    id: 'global',
                    onboardingMode: 'USER_CHOICE',
                    questionnaireSchema: defaultSchema
                }
            });
            return res.status(200).json(defaultSettings);
        }
        res.status(200).json(settings);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getSettings = getSettings;
const updateSettings = async (req, res) => {
    try {
        const { aiProvider, onboardingMode, questionnaireSchema } = req.body;
        const settings = await prisma_1.default.systemSettings.upsert({
            where: { id: 'global' },
            update: { aiProvider, onboardingMode, questionnaireSchema },
            create: { id: 'global', aiProvider, onboardingMode, questionnaireSchema }
        });
        res.status(200).json(settings);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.updateSettings = updateSettings;
// Team Management (Sub-Admin RBAC)
const getTeam = async (req, res) => {
    try {
        const team = await prisma_1.default.user.findMany({
            where: { role: 'SUB_ADMIN' },
            select: { id: true, email: true, subAdminScopes: true, createdAt: true }
        });
        res.status(200).json(team);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getTeam = getTeam;
const createSubAdmin = async (req, res) => {
    try {
        const { email, password, scopes } = req.body;
        const existing = await prisma_1.default.user.findUnique({ where: { email } });
        if (existing)
            return res.status(400).json({ message: 'User already exists' });
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const subAdmin = await prisma_1.default.user.create({
            data: {
                email,
                passwordHash,
                role: 'SUB_ADMIN',
                isVerified: true,
                subAdminScopes: scopes || []
            },
            select: { id: true, email: true, subAdminScopes: true }
        });
        res.status(201).json(subAdmin);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.createSubAdmin = createSubAdmin;
const updateSubAdminScopes = async (req, res) => {
    try {
        const id = req.params.id;
        const { scopes } = req.body;
        const existingUser = await prisma_1.default.user.findUnique({ where: { id } });
        if (!existingUser || existingUser.role !== 'SUB_ADMIN') {
            return res.status(404).json({ message: 'Sub-Admin not found' });
        }
        const user = await prisma_1.default.user.update({
            where: { id },
            data: { subAdminScopes: scopes },
            select: { id: true, email: true, subAdminScopes: true }
        });
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.updateSubAdminScopes = updateSubAdminScopes;
