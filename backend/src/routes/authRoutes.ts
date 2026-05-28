import { Router } from 'express';
import { register, login, applyStartup } from '../controllers/authController';
import { upload } from '../utils/upload';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/apply', upload.single('pitchDeck'), applyStartup);

export default router;
