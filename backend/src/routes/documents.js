const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.use(auth);

router.post('/upload', upload.single('file'), documentController.upload);
router.get('/:id/download', documentController.download);
router.get('/', documentController.getAll);
router.put('/:id', documentController.rename);
router.delete('/:id', documentController.remove);

module.exports = router;
