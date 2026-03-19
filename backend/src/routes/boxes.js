/**
 * Boxes Routes — API endpoints for medication box management
 */

const express = require('express');
const router = express.Router();
const boxController = require('../controllers/boxController');
const auth = require('../middlewares/auth');

// All routes require authentication
router.use(auth);

// Box endpoints
router.get('/', boxController.getBoxes);
router.post('/', boxController.createBox);
router.get('/:id', boxController.getBox);
router.put('/:id', boxController.updateBox);
router.delete('/:id', boxController.deleteBox);

// Medication endpoints per box
router.post('/:boxId/medications', boxController.addMedicationToBox);
router.put('/:boxId/medications/:medId', boxController.updateBoxMedication);
router.delete('/:boxId/medications/:medId', boxController.deleteBoxMedication);

module.exports = router;
