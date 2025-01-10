const pool = require('../../config/database');

// Get all decision variables
const getAllDecisionVariables = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM decision_variables ORDER BY id ASC'
        );
        
        // Send successful response
        res.status(200).json({
            success: true,
            data: result.rows || []
        });
    } catch (error) {
        // Log the error for debugging
        console.error('Error in getAllDecisionVariables:', error);
        
        res.status(500).json({
            success: false,
            error: 'Failed to fetch decision variables',
            details: error.message
        });
    }
};

// Get decision variable by ID
const getDecisionVariableById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM decision_variables WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Decision variable not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch decision variable'
        });
    }
};

// Create new decision variable
const createDecisionVariable = async (req, res) => {
    try {
        const { name, description, relations } = req.body;
        
        // Validation
        if (!name || !relations) {
            return res.status(400).json({
                success: false,
                error: 'Name and relations are required'
            });
        }

        // Convert relations to array if it's a string
        const relationsArray = Array.isArray(relations) ? relations : relations.split(',').map(item => item.trim());
        
        const result = await pool.query(
            'INSERT INTO decision_variables (name, description, relations, length, value) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, description, relationsArray, relationsArray.length, null]
        );

        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Decision variable created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to create decision variable'
        });
    }
};

// Update decision variable
const updateDecisionVariable = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, relations, value } = req.body;

        // Validation
        if (!name || !relations) {
            return res.status(400).json({
                success: false,
                error: 'Name and relations are required'
            });
        }

        // Convert relations to array if it's a string
        const relationsArray = Array.isArray(relations) ? relations : relations.split(',').map(item => item.trim());

        const result = await pool.query(
            'UPDATE decision_variables SET name = $1, description = $2, relations = $3, length = $4, value = $5 WHERE id = $6 RETURNING *',
            [name, description, relationsArray, relationsArray.length, value, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Decision variable not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0],
            message: 'Decision variable updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update decision variable'
        });
    }
};

// Delete decision variable
const deleteDecisionVariable = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM decision_variables WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Decision variable not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0],
            message: 'Decision variable deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to delete decision variable'
        });
    }
};

module.exports = {
    getAllDecisionVariables,
    getDecisionVariableById,
    createDecisionVariable,
    updateDecisionVariable,
    deleteDecisionVariable
};
