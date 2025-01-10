# Sets Management Application Logic

# Project Structure

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
```

# Implementation Patterns Documentation

## Table Structure Pattern

Each table in the application follows a consistent pattern with these components:

### 1. Frontend Structure
```
public/
├── ${table_name}.html         # Main HTML file
├── css/
│   └── ${table_name}.css     # Table-specific styles
└── js/
    └── ${table_name}.js      # Table-specific JavaScript
```

### 2. Backend Structure
```
src/
├── controllers/
│   └── ${table_name}Controller.js
└── routes/
    └── ${table_name}.js
```

## Implementation Pattern

### 1. HTML Template (`public/${table_name}.html`)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${TableName} Management | Optimization Application</title>
    <link rel="stylesheet" href="/css/common.css">
    <link rel="stylesheet" href="/css/navbar.css">
    <link rel="stylesheet" href="/css/${table_name}.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Navigation -->
    <div id="nav-placeholder"></div>

    <div class="container">
        <!-- Header -->
        <header class="header">
            <h1><i class="fas fa-[icon]"></i> ${TableName} Management</h1>
        </header>
        
        <!-- Create Form -->
        <div class="form-container">
            <h2><i class="fas fa-plus-circle"></i> Create New ${TableName}</h2>
            <form id="create${TableName}Form">
                <!-- Form fields -->
            </form>
        </div>

        <!-- Items List -->
        <div class="${table_name}-section">
            <div class="section-header">
                <h2><i class="fas fa-database"></i> Existing ${TableName}s</h2>
                <button id="fetch${TableName}s" class="btn btn-secondary">
                    <i class="fas fa-sync-alt"></i> Fetch ${TableName}s
                </button>
            </div>
            <div id="${table_name}Container" class="${table_name}-container"></div>
        </div>
    </div>

    <script src="/js/${table_name}.js"></script>
    <script>
        // Load navigation
        fetch('/components/navbar.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('nav-placeholder').innerHTML = data;
            });
    </script>
</body>
</html>
```

### 2. CSS Pattern (`public/css/${table_name}.css`)
```css
/* Form Container */
.form-container {
    max-width: 600px;
    margin: 0 auto 40px;
    padding: 25px;
    background-color: #f8f9fa;
    border-radius: 12px;
    border: 1px solid #e9ecef;
}

/* Form Groups */
.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: #495057;
    font-weight: 500;
}

/* Input Styles */
.form-group input,
.form-group textarea,
.form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ced4da;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.3s, box-shadow 0.3s;
}

/* Items Container */
.${table_name}-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

/* Item Card */
.${table_name}-item {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #3498db;
    transition: transform 0.3s, box-shadow 0.3s;
}

/* Modal Styles */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1000;
}
```

### 3. JavaScript Pattern (`public/js/${table_name}.js`)
```javascript
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const fetchButton = document.getElementById(`fetch${TableName}s`);
    const container = document.getElementById(`${table_name}Container`);
    const createForm = document.getElementById(`create${TableName}Form`);

    // CRUD Functions
    async function fetchAndDisplay${TableName}s() {
        try {
            const response = await fetch(`http://localhost:3000/api/${table_name}s`);
            const result = await response.json();
            // Display logic
        } catch (error) {
            showNotification(error.message, 'error');
        }
    }

    // Create Form Handler
    createForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Create logic
    });

    // Edit Modal
    function showEditModal(item) {
        // Edit modal logic
    }

    // Delete Handler
    async function deleteItem(id, name) {
        // Delete logic
    }

    // Notifications
    function showNotification(message, type = 'success') {
        // Notification logic
    }

    // Initial fetch
    fetchAndDisplay${TableName}s();
});
```

### 4. Controller Pattern (`src/controllers/${table_name}Controller.js`)
```javascript
const pool = require('../../config/database');

// Get all items
const getAll${TableName}s = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM ${table_name}s ORDER BY created_at DESC'
        );
        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: `Failed to fetch ${table_name}s`
        });
    }
};

// Get single item
const get${TableName}ById = async (req, res) => {
    // Get by ID logic
};

// Create item
const create${TableName} = async (req, res) => {
    // Create logic with validation
};

// Update item
const update${TableName} = async (req, res) => {
    // Update logic with validation
};

// Delete item
const delete${TableName} = async (req, res) => {
    // Delete logic
};

module.exports = {
    getAll${TableName}s,
    get${TableName}ById,
    create${TableName},
    update${TableName},
    delete${TableName}
};
```

### 5. Routes Pattern (`src/routes/${table_name}.js`)
```javascript
const express = require('express');
const router = express.Router();
const {
    getAll${TableName}s,
    get${TableName}ById,
    create${TableName},
    update${TableName},
    delete${TableName}
} = require('../controllers/${table_name}Controller');

// Routes
router.get('/', getAll${TableName}s);
router.get('/:id', get${TableName}ById);
router.post('/', create${TableName});
router.put('/:id', update${TableName});
router.delete('/:id', delete${TableName});

module.exports = router;
```

## API Response Format

### Success Response
```json
{
    "success": true,
    "data": [/* data objects */]
}
```

### Error Response
```json
{
    "success": false,
    "error": "Error message"
}
```

## UI/UX Patterns

1. **Form Layout**:
   - Clean, single-column layout
   - Clear labels with icons
   - Helpful placeholder text
   - Validation feedback

2. **List View**:
   - Grid layout for items
   - Card-based design
   - Hover effects
   - Action buttons (edit/delete)

3. **Interactions**:
   - Loading states
   - Success/error notifications
   - Confirmation dialogs
   - Smooth animations

4. **Responsive Design**:
   - Mobile-friendly layouts
   - Flexible grids
   - Readable text at all sizes

## Best Practices

1. **Error Handling**:
   - Consistent error messages
   - User-friendly error display
   - Proper error logging

2. **Data Validation**:
   - Frontend validation
   - Backend validation
   - Sanitize inputs

3. **Code Organization**:
   - Modular components
   - Clear file structure
   - Consistent naming

4. **Security**:
   - Input sanitization
   - Proper error handling
   - No sensitive data exposure

## Example Tables

1. **Sets**:
   - Name, Items, Description
   - Grid layout with item lists
   - Edit/Delete functionality

2. **Parameters**:
   - Name, Value, Relations, Description
   - Numeric value handling
   - Relation management

3. **Constraints**:
   - Name, Sign, RHS Value, Parameters, Decision Variables
   - Format string display
   - Mathematical notation

