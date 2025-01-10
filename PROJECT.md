# Optimization Application Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [API Documentation](#api-documentation)
6. [Frontend Architecture](#frontend-architecture)
7. [Development Guidelines](#development-guidelines)
8. [Error Handling](#error-handling)
9. [Styling Guide](#styling-guide)
10. [Testing](#testing)

## Project Overview
A web-based optimization application that manages sets, parameters, constraints, and decision variables. The application follows a clean architecture with separate frontend and backend components, using PostgreSQL for data persistence.

## Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Development Tools**: Git, Nodemon
- **API Format**: JSON
- **Dependencies**:
  - express: ^4.18.2
  - pg: ^8.11.3
  - cors: ^2.8.5
  - dotenv: ^16.3.1
  - nodemon: ^3.0.2

## Project Structure
```
project_root/
├── config/                     # Configuration files
│   └── database.js            # Database configuration
├── public/                    # Static files
│   ├── components/            # Reusable UI components
│   │   └── navbar.html       # Navigation bar component
│   ├── css/                  # Stylesheets
│   │   ├── common.css        # Shared styles
│   │   ├── navbar.css        # Navigation styles
│   │   ├── parameters.css    # Parameters page styles
│   │   ├── constraints.css   # Constraints page styles
│   │   ├── sets.css         # Sets page styles
│   │   └── decision_variables.css # Decision variables styles
│   ├── js/                   # Frontend JavaScript
│   │   ├── parameters.js     # Parameters page logic
│   │   ├── constraints.js    # Constraints page logic
│   │   ├── sets.js          # Sets page logic
│   │   └── decision_variables.js # Decision variables logic
│   └── *.html               # Page templates
├── src/                      # Backend source code
│   ├── controllers/         # Business logic
│   │   ├── parametersController.js
│   │   ├── constraintsController.js
│   │   ├── setsController.js
│   │   └── decisionVariablesController.js
│   ├── routes/             # API routes
│   │   ├── parameters.js
│   │   ├── constraints.js
│   │   ├── sets.js
│   │   └── decisionVariables.js
│   └── server.js           # Main application file
└── tests/                  # Test files

## Database Schema

### Sets Table
```sql
CREATE TABLE sets (
    id SERIAL PRIMARY KEY,
    set_name VARCHAR(255) NOT NULL,
    description TEXT,
    items JSONB NOT NULL,
    length INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Parameters Table
```sql
CREATE TABLE parameters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    value FLOAT NOT NULL,
    relations TEXT[],
    description TEXT,
    length INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Constraints Table
```sql
CREATE TABLE constraints (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parameters_needed TEXT[],
    decision_needed TEXT[],
    description TEXT,
    sign TEXT[] CHECK (sign = ANY(ARRAY['le', 'eq', 'ge', 'lt', 'gt'])),
    format TEXT[],
    rhs FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Decision Variables Table
```sql
CREATE TABLE decision_variables (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50),
    bounds JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Response Format
All API responses follow this format:

Success Response:
```json
{
    "success": true,
    "data": [Object or Array],
    "message": "Optional success message"
}
```

Error Response:
```json
{
    "success": false,
    "error": "Error message",
    "details": "Optional error details"
}
```

### Endpoints

#### Sets
- `GET /api/sets` - Get all sets
- `GET /api/sets/:id` - Get set by ID
- `POST /api/sets` - Create new set
- `PUT /api/sets/:id` - Update set
- `DELETE /api/sets/:id` - Delete set

#### Parameters
- `GET /api/parameters` - Get all parameters
- `GET /api/parameters/:id` - Get parameter by ID
- `POST /api/parameters` - Create new parameter
- `PUT /api/parameters/:id` - Update parameter
- `DELETE /api/parameters/:id` - Delete parameter

#### Constraints
- `GET /api/constraints` - Get all constraints
- `GET /api/constraints/:id` - Get constraint by ID
- `POST /api/constraints` - Create new constraint
- `PUT /api/constraints/:id` - Update constraint
- `DELETE /api/constraints/:id` - Delete constraint

#### Decision Variables
- `GET /api/decision_variables` - Get all decision variables
- `GET /api/decision_variables/:id` - Get decision variable by ID
- `POST /api/decision_variables` - Create new decision variable
- `PUT /api/decision_variables/:id` - Update decision variable
- `DELETE /api/decision_variables/:id` - Delete decision variable

## Frontend Architecture

### Components Organization
1. **Navigation Bar**
   - Shared across pages
   - Dynamic loading
   - Responsive design

2. **Forms**
   - Input validation
   - Dynamic feedback
   - Loading states
   - Success/Error handling

3. **List Views**
   - Grid layout
   - Card-based design
   - CRUD operations
   - Loading states

4. **Notifications**
   - Success/Error messages
   - Auto-dismiss
   - Animations

### Styling Guide

#### Color Scheme
- Primary: #3498db (Blue)
- Secondary: #2ecc71 (Green)
- Danger: #ef4444 (Red)
- Text: #2c3e50 (Dark)
- Background: #f8f9fa (Light)

#### CSS Organization
1. **Common Styles** (common.css)
   - Base reset
   - Typography
   - Layout utilities
   - Button styles
   - Color variables

2. **Component Styles**
   - Modular CSS files per component
   - BEM naming convention
   - Responsive design
   - Interactive states

## Development Guidelines

### Code Style
1. **Naming Conventions**
   - Variables: snake_case
   - Functions: camelCase
   - Database Tables: snake_case
   - Files: camelCase

2. **Error Handling**
   - Try-catch blocks for async operations
   - Consistent error responses
   - Proper logging
   - User-friendly messages

3. **Code Organization**
   - Modular components
   - Single responsibility
   - Clear documentation
   - Consistent formatting

### Git Workflow
1. Meaningful commit messages
2. Regular commits
3. Feature branches
4. Pull request reviews

## Testing
1. **Unit Tests**
   - Controller functions
   - Utility functions
   - Database operations

2. **Integration Tests**
   - API endpoints
   - Database interactions
   - Frontend-backend integration

3. **UI Tests**
   - Form validation
   - User interactions
   - Responsive design
   - Cross-browser compatibility

## Security Practices
1. Input validation
2. Parameterized queries
3. Error handling
4. CORS configuration
5. Environment variables
6. No sensitive data exposure

## Performance Optimization
1. Minified assets
2. Caching strategies
3. Lazy loading
4. Efficient database queries
5. Frontend optimizations

## Deployment
1. Environment setup
2. Database migration
3. Static file serving
4. Error monitoring
5. Logging
6. Backup strategy 



All of the above is done by Cursor.