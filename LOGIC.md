# Sets Management Application Logic

## Project Structure
```
project_root/
├── config/                     # Configuration files
│   └── database.js            # PostgreSQL configuration
├── public/                    # Static files
│   ├── components/            # Reusable UI components
│   │   └── navbar.html       # Navigation bar component
│   ├── css/                  # Stylesheets
│   │   ├── common.css        # Shared styles
│   │   ├── navbar.css        # Navigation styles
│   │   ├── homePage.css      # Homepage specific styles
│   │   └── sets.css          # Sets page specific styles
│   ├── js/
│   │   └── scripts.js        # Frontend JavaScript
│   ├── index.html            # Homepage
│   └── sets.html             # Sets management page
├── src/                      # Source code
│   ├── controllers/          # Business logic
│   │   └── setsController.js # Sets CRUD operations
│   ├── routes/               # API routes
│   │   └── sets.js          # Sets endpoints
│   └── server.js            # Main application file
└── tests/                    # Test files
    └── sets.test.js         # Sets tests
```

## Implementation Pattern for Database Tables

### 1. Database Schema Template
```sql
CREATE TABLE table_name (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    items JSONB NOT NULL,
    length INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Backend Implementation

#### Controller Pattern (src/controllers/[table]Controller.js)
```javascript
const db = require('../../config/database');

// Create operation
const create[Table] = async (req, res) => {
    try {
        const { name, description, items } = req.body;
        
        // Validation
        if (!name || !items) {
            return res.status(400).json({
                success: false,
                error: 'Required fields missing'
            });
        }

        const query = `
            INSERT INTO table_name (name, description, items, length)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        
        const values = [name, description, items, items.length];
        const result = await db.query(query, values);

        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error creating record',
            details: error.message
        });
    }
};

// Read all operation
const getAll = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM table_name ORDER BY id ASC');
        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error fetching records',
            details: error.message
        });
    }
};

// Read single operation
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM table_name WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Record not found'
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error fetching record',
            details: error.message
        });
    }
};

// Update operation
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, items } = req.body;

        if (!name || !items) {
            return res.status(400).json({
                success: false,
                error: 'Required fields missing'
            });
        }

        const query = `
            UPDATE table_name 
            SET name = $1, description = $2, items = $3, length = $4
            WHERE id = $5
            RETURNING *
        `;

        const result = await db.query(query, [name, description, items, items.length, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Record not found'
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0],
            message: 'Updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error updating record',
            details: error.message
        });
    }
};

// Delete operation
const delete[Table] = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM table_name WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Record not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Deleted successfully',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error deleting record',
            details: error.message
        });
    }
};
```

#### Routes Pattern (src/routes/[table].js)
```javascript
const express = require('express');
const router = express.Router();
const controller = require('../controllers/[table]Controller');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
```

### 3. Frontend Implementation

#### HTML Template Pattern (public/[table].html)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Table] Management</title>
    <link rel="stylesheet" href="/css/common.css">
    <link rel="stylesheet" href="/css/navbar.css">
    <link rel="stylesheet" href="/css/[table].css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div id="nav-placeholder"></div>

    <div class="container">
        <!-- Create Form -->
        <div class="form-container">
            <h2><i class="fas fa-plus-circle"></i> Create New [Item]</h2>
            <form id="createForm">
                <div class="form-group">
                    <label for="name">Name:</label>
                    <input type="text" id="name" required>
                </div>
                <div class="form-group">
                    <label for="description">Description:</label>
                    <textarea id="description"></textarea>
                </div>
                <div class="form-group">
                    <label for="items">Items:</label>
                    <input type="text" id="items" required>
                </div>
                <button type="submit">Create</button>
            </form>
        </div>

        <!-- List Section -->
        <div class="list-section">
            <div class="section-header">
                <h2>Existing [Items]</h2>
                <button id="fetchButton">Refresh</button>
            </div>
            <div id="listContainer"></div>
        </div>
    </div>

    <script src="/js/[table].js"></script>
</body>
</html>
```

#### JavaScript Pattern (public/js/[table].js)
```javascript
document.addEventListener('DOMContentLoaded', () => {
    // Core Functions
    async function fetchAll() {
        try {
            const response = await fetch('http://localhost:3000/api/[table]');
            const result = await response.json();
            if (result.success) {
                displayItems(result.data);
            }
        } catch (error) {
            showNotification(error.message, 'error');
        }
    }

    async function createItem(data) {
        try {
            const response = await fetch('http://localhost:3000/api/[table]', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.success) {
                showNotification('Created successfully', 'success');
                await fetchAll();
            }
        } catch (error) {
            showNotification(error.message, 'error');
        }
    }

    async function updateItem(id, data) {
        try {
            const response = await fetch(`http://localhost:3000/api/[table]/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.success) {
                showNotification('Updated successfully', 'success');
                await fetchAll();
            }
        } catch (error) {
            showNotification(error.message, 'error');
        }
    }

    async function deleteItem(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/[table]/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            if (result.success) {
                showNotification('Deleted successfully', 'success');
                await fetchAll();
            }
        } catch (error) {
            showNotification(error.message, 'error');
        }
    }

    // UI Functions
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    function displayItems(items) {
        const container = document.getElementById('listContainer');
        container.innerHTML = items.map(item => `
            <div class="item">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="actions">
                    <button onclick="editItem(${item.id})">Edit</button>
                    <button onclick="deleteItem(${item.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    // Event Listeners
    document.getElementById('createForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            items: document.getElementById('items').value.split(',').map(item => item.trim())
        };
        await createItem(data);
    });

    // Initial Load
    fetchAll();
});
```

### 4. CSS Pattern (public/css/[table].css)
```css
/* Form Styles */
.form-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

/* List Styles */
.list-section {
    margin-top: 30px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.item {
    background-color: white;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.actions {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

/* Modal Styles */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
}

/* Notification Styles */
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    border-radius: 4px;
    color: white;
    z-index: 1000;
}

.notification.success {
    background-color: #2ecc71;
}

.notification.error {
    background-color: #e74c3c;
}
```

## API Response Format

### Success Response
```json
{
    "success": true,
    "data": [Object or Array],
    "message": "Optional success message"
}
```

### Error Response
```json
{
    "success": false,
    "error": "Error message",
    "details": "Optional error details"
}
```

## Best Practices

1. **Error Handling**
   - Use try-catch blocks for async operations
   - Return consistent error responses
   - Include meaningful error messages

2. **Data Validation**
   - Validate required fields
   - Sanitize input data
   - Check data types and formats

3. **UI/UX**
   - Show loading states
   - Provide feedback for actions
   - Confirm destructive operations
   - Use consistent styling

4. **Code Organization**
   - Separate concerns (MVC pattern)
   - Use meaningful variable names
   - Comment complex logic
   - Keep functions focused and small

5. **Security**
   - Validate input data
   - Use parameterized queries
   - Handle errors gracefully
   - Don't expose sensitive information