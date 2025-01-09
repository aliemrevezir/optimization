const db = require('../../config/database');

// Create a new parameter
const createParameter = async (req, res) => {
    try {
        const { name, value, relations, description } = req.body;

        // Validation
        if (!name || value === undefined || !relations) {
            return res.status(400).json({
                success: false,
                error: 'Parameter name, value, and relations are required'
            });
        }

        // Insert into database
        const query = `
            INSERT INTO parameters (name, value, relations, description)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const values = [name, value, relations, description];
        const result = await db.query(query, values);

        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Parameter created successfully'
        });

    } catch (error) {
        console.error('Error creating parameter:', error);
        res.status(500).json({
            success: false,
            error: 'Error creating parameter',
            details: error.message
        });
    }
};

// Get all parameters
const getAllParameters = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM parameters ORDER BY id ASC');
        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching parameters:', error);
        res.status(500).json({
            success: false,
            error: 'Error fetching parameters',
            details: error.message
        });
    }
};

// Get a single parameter by ID
const getParameterById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM parameters WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Parameter not found'
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching parameter:', error);
        res.status(500).json({
            success: false,
            error: 'Error fetching parameter',
            details: error.message
        });
    }
};

// Update a parameter
const updateParameter = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, value, relations, description } = req.body;

        // Validation
        if (!name || value === undefined || !relations) {
            return res.status(400).json({
                success: false,
                error: 'Parameter name, value, and relations are required'
            });
        }

        const query = `
            UPDATE parameters 
            SET name = $1, value = $2, relations = $3, description = $4
            WHERE id = $5
            RETURNING *
        `;

        const result = await db.query(query, [name, value, relations, description, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Parameter not found'
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0],
            message: 'Parameter updated successfully'
        });

    } catch (error) {
        console.error('Error updating parameter:', error);
        res.status(500).json({
            success: false,
            error: 'Error updating parameter',
            details: error.message
        });
    }
};

// Delete a parameter
const deleteParameter = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM parameters WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Parameter not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Parameter deleted successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Error deleting parameter:', error);
        res.status(500).json({
            success: false,
            error: 'Error deleting parameter',
            details: error.message
        });
    }
};

module.exports = {
    createParameter,
    getAllParameters,
    getParameterById,
    updateParameter,
    deleteParameter
};
