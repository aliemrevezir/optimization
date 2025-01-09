const express = require('express');
const router = express.Router();
const constraintsController = require('../controllers/constraintsController');

// GET all constraints
router.get('/', constraintsController.getAllConstraints);

// GET single constraint by ID
router.get('/:id', constraintsController.getConstraintById);

// POST create new constraint
router.post('/', constraintsController.createConstraint);

// PUT update constraint
router.put('/:id', constraintsController.updateConstraint);

// DELETE constraint
router.delete('/:id', constraintsController.deleteConstraint);

module.exports = router;
