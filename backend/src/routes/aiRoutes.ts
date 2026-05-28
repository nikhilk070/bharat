import { Router } from 'express';
import { chanakyaChat } from '../controllers/aiController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Only authenticated admins/subadmins can access Chanakya chat.
// We allow all subadmins regardless of scope so they have an AI assistant for their department.
router.post('/chat', authenticate, chanakyaChat);

export default router;
