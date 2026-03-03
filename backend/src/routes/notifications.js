import { Router } from 'express';
import { getVapidKey, subscribe, unsubscribe } from '../controllers/notificationController.js';
import auth from '../middlewares/auth.js';

const router = Router();

router.get('/vapid-key', getVapidKey);
router.use(auth);
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

export default router;
