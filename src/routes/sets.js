const express = require('express');
const router = express.Router();
const setsController = require('../controllers/setsController');

// GET all sets
router.get('/', setsController.getAllSets);

// GET single set by ID
router.get('/:id', setsController.getSetById);

// POST create new set
router.post('/', setsController.createSet);

// PUT update set
router.put('/:id', setsController.updateSet);

// DELETE set
router.delete('/:id', setsController.deleteSet);

module.exports = router;
