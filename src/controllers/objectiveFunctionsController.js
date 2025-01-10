const db = require('../../config/database');

// Create a new objective function
const createObjectiveFunction = async (req, res) => {
    try {
        const { name, parameters_needed, decision_needed, description, format } = req.body;

        // Validation
        if (!name || !parameters_needed || !decision_needed || !format) {
            return res.status(400).json({
                success: false,
                error: 'Name, parameters, decision variables, and format are required'
            });
        }

        // Insert into database
        const query = `
            INSERT INTO objective_functions (name, parameters_needed, decision_needed, description, format)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;

        const values = [name, parameters_needed, decision_needed, description, format];
        const result = await db.query(query, values);

        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Objective function created successfully'
        });

    } catch (error) {
        console.error('Error creating objective function:', error);
        res.status(500).json({
            success: false,
            error: 'Error creating objective function',
            details: error.message
        });
    }
};

// Get all objective functions
const getAllObjectiveFunctions = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM objective_functions ORDER BY id ASC');
        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching objective functions:', error);
        res.status(500).json({
            success: false,
            error: 'Error fetching objective functions',
            details: error.message
        });
    }
};

// Get a single objective function by ID
const getObjectiveFunctionById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM objective_functions WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Objective function not found'
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching objective function:', error);
        res.status(500).json({
            success: false,
            error: 'Error fetching objective function',
            details: error.message
        });
    }
};

// Update an objective function
const updateObjectiveFunction = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, parameters_needed, decision_needed, description, format } = req.body;

        // Validation
        if (!name || !parameters_needed || !decision_needed || !format) {
            return res.status(400).json({
                success: false,
                error: 'Name, parameters, decision variables, and format are required'
            });
        }

        const query = `
            UPDATE objective_functions 
            SET name = $1, parameters_needed = $2, decision_needed = $3, description = $4, format = $5
            WHERE id = $6
            RETURNING *
        `;

        const result = await db.query(query, [name, parameters_needed, decision_needed, description, format, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Objective function not found'
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0],
            message: 'Objective function updated successfully'
        });

    } catch (error) {
        console.error('Error updating objective function:', error);
        res.status(500).json({
            success: false,
            error: 'Error updating objective function',
            details: error.message
        });
    }
};

// Delete an objective function
const deleteObjectiveFunction = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM objective_functions WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Objective function not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Objective function deleted successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Error deleting objective function:', error);
        res.status(500).json({
            success: false,
            error: 'Error deleting objective function',
            details: error.message
        });
    }
};

module.exports = {
    createObjectiveFunction,
    getAllObjectiveFunctions,
    getObjectiveFunctionById,
    updateObjectiveFunction,
    deleteObjectiveFunction
};
