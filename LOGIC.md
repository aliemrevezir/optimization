# Sets Management Application Logic

## Project Structure
```
project_root/
├── config/                     # Configuration files
│   └── database.js            # PostgreSQL configuration
├── public/                    # Static files
│   ├── css/
│   │   └── styles.css        # Main stylesheet
│   ├── sets.html             # Sets management page
│   └── js/
│       └── scripts.js        # Frontend JavaScript
├── src/                      # Source code
│   ├── controllers/          # Business logic
│   │   └── setsController.js # Sets CRUD operations
│   ├── routes/               # API routes
│   │   └── sets.js          # Sets endpoints
│   └── server.js            # Main application file
```

## API Endpoints

### GET /api/sets
- Fetches all sets
- Response format:
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "set_name": "string",
            "description": "string",
            "items": ["item1", "item2"],
            "length": 2,
            "created_at": "timestamp",
            "updated_at": "timestamp"
        }
    ]
}
```

### POST /api/sets
- Creates a new set
- Request body:
```json
{
    "set_name": "required string",
    "description": "optional string",
    "items": ["required array"]
}
```
- Response: Created set object

### GET /api/sets/:id
- Fetches single set by ID
- Response: Single set object

### PUT /api/sets/:id
- Updates existing set
- Request body: Same as POST
- Response: Updated set object

### DELETE /api/sets/:id
- Deletes set by ID
- Response: Deleted set object

## Frontend Logic

### Event Handlers
1. **Page Load**
   - Initialize event listeners
   - Fetch and display existing sets

2. **Form Submission**
   - Prevent default form action
   - Validate inputs
   - Convert comma-separated items to array
   - Send POST request
   - Show success/error notification
   - Reset form on success
   - Refresh sets display

3. **Fetch Sets**
   - Show loading state
   - Fetch sets from API
   - Display sets in grid layout
   - Show error if fetch fails
   - Reset button state

### UI Components
1. **Create Set Form**
   - Set name input (required)
   - Description textarea
   - Items input (required, comma-separated)
   - Submit button with loading state

2. **Sets Display**
   - Grid layout for sets
   - Each set card shows:
     - Name with icon
     - Description
     - Items list
     - Metadata (ID, timestamps)
   - Fetch button with loading state

3. **Notifications**
   - Success/Error messages
   - Auto-dismiss after 3 seconds
   - Slide-in animation
   - Icon indicators

## Styling
- Minimal, clean design
- Responsive grid layout
- Font Awesome icons
- Color scheme:
  - Primary: #3498db (Blue)
  - Secondary: #2ecc71 (Green)
  - Text: #2c3e50 (Dark)
  - Background: #f8f9fa (Light)
- Interactive elements:
  - Hover effects
  - Loading states
  - Focus states
  - Transitions

## Error Handling
1. **Frontend**
   - Form validation
   - API error display
   - Loading states
   - User notifications

2. **Backend**
   - Input validation
   - Database error handling
   - Consistent error responses
   - HTTP status codes

## Data Flow
1. User fills form → 
2. Frontend validates → 
3. API request → 
4. Controller processes → 
5. Database operation → 
6. Response returned → 
7. UI updated → 
8. User notified 