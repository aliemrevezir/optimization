const express = require('express');
const router = express.Router();
const objectiveFunctionsController = require('../controllers/objectiveFunctionsController');

// GET all objective functions
router.get('/', objectiveFunctionsController.getAllObjectiveFunctions);

// GET single objective function by ID
router.get('/:id', objectiveFunctionsController.getObjectiveFunctionById);

// POST create new objective function
router.post('/', objectiveFunctionsController.createObjectiveFunction);

// PUT update objective function
router.put('/:id', objectiveFunctionsController.updateObjectiveFunction);

// DELETE objective function
router.delete('/:id', objectiveFunctionsController.deleteObjectiveFunction);

module.exports = router;
