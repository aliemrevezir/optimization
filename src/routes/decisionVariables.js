const express = require('express');
const router = express.Router();
const {
    getAllDecisionVariables,
    getDecisionVariableById,
    createDecisionVariable,
    updateDecisionVariable,
    deleteDecisionVariable
} = require('../controllers/decisionVariablesController');

// Get all decision variables
router.get('/', getAllDecisionVariables);

// Get decision variable by ID
router.get('/:id', getDecisionVariableById);

// Create new decision variable
router.post('/', createDecisionVariable);

// Update decision variable
router.put('/:id', updateDecisionVariable);

// Delete decision variable
router.delete('/:id', deleteDecisionVariable);

module.exports = router;
