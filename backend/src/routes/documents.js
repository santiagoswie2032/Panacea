import { Router } from 'express';
import {
    getAll,
    upload as uploadDocument,
    rename,
    remove,
    download,
} from '../controllers/documentController.js';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = Router();

router.use(auth);

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/:id/download', download);
router.get('/', getAll);
router.put('/:id', rename);
router.delete('/:id', remove);

export default router;
