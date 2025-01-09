const db = require('../../config/database');

// Create a new set
const createSet = async (req, res) => {
    try {
        const { set_name, description, items } = req.body;

        // Validation
        if (!set_name || !items) {
            return res.status(400).json({
                success: false,
                error: 'Set name and items are required'
            });
        }

        // Calculate length from items array
        const length = Array.isArray(items) ? items.length : 0;

        // Insert into database
        const query = `
            INSERT INTO sets (set_name, description, items, length)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const values = [set_name, description, items, length];
        const result = await db.query(query, values);

        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Set created successfully'
        });

    } catch (error) {
        console.error('Error creating set:', error);
        res.status(500).json({
            success: false,
            error: 'Error creating set',
            details: error.message
        });
    }
};

// Get all sets
const getAllSets = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM sets ORDER BY id ASC');
        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching sets:', error);
        res.status(500).json({
            success: false,
            error: 'Error fetching sets',
            details: error.message
        });
    }
};

// Get a single set by ID
const getSetById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM sets WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Set not found'
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching set:', error);
        res.status(500).json({
            success: false,
            error: 'Error fetching set',
            details: error.message
        });
    }
};

// Update a set
const updateSet = async (req, res) => {
    try {
        const { id } = req.params;
        const { set_name, description, items } = req.body;

        // Validation
        if (!set_name || !items) {
            return res.status(400).json({
                success: false,
                error: 'Set name and items are required'
            });
        }

        const length = Array.isArray(items) ? items.length : 0;

        const query = `
            UPDATE sets 
            SET set_name = $1, description = $2, items = $3, length = $4, updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING *
        `;

        const result = await db.query(query, [set_name, description, items, length, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Set not found'
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0],
            message: 'Set updated successfully'
        });

    } catch (error) {
        console.error('Error updating set:', error);
        res.status(500).json({
            success: false,
            error: 'Error updating set',
            details: error.message
        });
    }
};

// Delete a set
const deleteSet = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM sets WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Set not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Set deleted successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Error deleting set:', error);
        res.status(500).json({
            success: false,
            error: 'Error deleting set',
            details: error.message
        });
    }
};

module.exports = {
    createSet,
    getAllSets,
    getSetById,
    updateSet,
    deleteSet
};


