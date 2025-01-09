const express = require('express');
const router = express.Router();
const parametersController = require('../controllers/parametersController');

// GET all parameters
router.get('/', parametersController.getAllParameters);

// GET single parameter by ID
router.get('/:id', parametersController.getParameterById);

// POST create new parameter
router.post('/', parametersController.createParameter);

// PUT update parameter
router.put('/:id', parametersController.updateParameter);

// DELETE parameter
router.delete('/:id', parametersController.deleteParameter);

module.exports = router;
