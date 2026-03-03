import { Router } from 'express';
import {
    getAll,
    getTodaySchedule,
    getOne,
    create,
    update,
    remove,
    takeDose,
} from '../controllers/medicationController.js';
import auth from '../middlewares/auth.js';

const router = Router();

router.use(auth);

router.get('/schedule/today', getTodaySchedule);
router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
router.post('/dose/take', takeDose);

export default router;
