const db = require('../../config/database');

// Create a new constraint
const createConstraint = async (req, res) => {
    try {
        const { name, parameters_needed, decision_needed, description, sign, format, rhs } = req.body;

        // Validation
        if (!name || !sign || rhs === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Constraint name, sign, and RHS value are required'
            });
        }

        // Insert into database
        const query = `
            INSERT INTO constraints (name, parameters_needed, decision_needed, description, sign, format, rhs)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;

        const values = [name, parameters_needed, decision_needed, description, sign, format, rhs];
        const result = await db.query(query, values);

        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Constraint created successfully'
        });

    } catch (error) {
        console.error('Error creating constraint:', error);
        res.status(500).json({
            success: false,
            error: 'Error creating constraint',
            details: error.message
        });
    }
};

// Get all constraints
const getAllConstraints = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM constraints ORDER BY id ASC');
        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching constraints:', error);
        res.status(500).json({
            success: false,
            error: 'Error fetching constraints',
            details: error.message
        });
    }
};

// Get a single constraint by ID
const getConstraintById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM constraints WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Constraint not found'
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching constraint:', error);
        res.status(500).json({
            success: false,
            error: 'Error fetching constraint',
            details: error.message
        });
    }
};

// Update a constraint
const updateConstraint = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, parameters_needed, decision_needed, description, sign, format, rhs } = req.body;

        // Validation
        if (!name || !sign || rhs === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Constraint name, sign, and RHS value are required'
            });
        }

        const query = `
            UPDATE constraints 
            SET name = $1, parameters_needed = $2, decision_needed = $3, description = $4, sign = $5, format = $6, rhs = $7
            WHERE id = $8
            RETURNING *
        `;

        const result = await db.query(query, [name, parameters_needed, decision_needed, description, sign, format, rhs, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Constraint not found'
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0],
            message: 'Constraint updated successfully'
        });

    } catch (error) {
        console.error('Error updating constraint:', error);
        res.status(500).json({
            success: false,
            error: 'Error updating constraint',
            details: error.message
        });
    }
};

// Delete a constraint
const deleteConstraint = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM constraints WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Constraint not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Constraint deleted successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Error deleting constraint:', error);
        res.status(500).json({
            success: false,
            error: 'Error deleting constraint',
            details: error.message
        });
    }
};

module.exports = {
    createConstraint,
    getAllConstraints,
    getConstraintById,
    updateConstraint,
    deleteConstraint
};
