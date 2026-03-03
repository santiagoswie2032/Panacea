import { Router } from 'express';
import { getProfile, updateProfile, getEmergencyInfo, updateEmergencyInfo } from '../controllers/userController.js';
import auth from '../middlewares/auth.js';

const router = Router();

router.use(auth);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/emergency', getEmergencyInfo);
router.put('/emergency', updateEmergencyInfo);

export default router;
