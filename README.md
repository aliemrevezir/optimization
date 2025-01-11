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
9. [Logging System](#logging-system)
10. [Styling Guide](#styling-guide)
11. [Testing](#testing)

  
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

├── config/ # Configuration files

│ └── database.js # Database configuration

├── public/ # Static files

│ ├── components/ # Reusable UI components

│ │ └── navbar.html # Navigation bar component

│ ├── css/ # Stylesheets

│ │ ├── common.css # Shared styles

│ │ ├── navbar.css # Navigation styles

│ │ ├── parameters.css # Parameters page styles

│ │ ├── constraints.css # Constraints page styles

│ │ ├── sets.css # Sets page styles

│ │ └── decision_variables.css # Decision variables styles

│ ├── js/ # Frontend JavaScript

│ │ ├── parameters.js # Parameters page logic

│ │ ├── constraints.js # Constraints page logic

│ │ ├── sets.js # Sets page logic

│ │ └── decision_variables.js # Decision variables logic

│ └── *.html # Page templates

├── src/ # Backend source code

│ ├── controllers/ # Business logic

│ │ ├── parametersController.js

│ │ ├── constraintsController.js

│ │ ├── setsController.js

│ │ └── decisionVariablesController.js

│ ├── routes/ # API routes

│ │ ├── parameters.js

│ │ ├── constraints.js

│ │ ├── sets.js

│ │ └── decisionVariables.js

│ └── server.js # Main application file

└── tests/ # Test files

  

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

	- Dark mode toggle button

	- Theme persistence

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
### Theme Management System

#### Features

1. **Dark Mode Support**

	- System preference detection
	
	- User preference persistence
	
	- Smooth theme transitions
	
	- Immediate theme application
	
	- Flash prevention on page load

2. **Theme Variables**

	- Consistent color scheme
	
	- CSS custom properties
	
	- Easy theme customization
	
	- Semantic color naming
	
	- Accessibility considerations

1. **Implementation Details**
	
	- Theme toggle in navbar
	
	- LocalStorage persistence
	
	- Preload script for flash prevention
	
	- MutationObserver for dynamic content
	
	- Fallback mechanisms

2. **File Structure**

```

public/

├── css/

│ └── themes.css # Theme definitions and variables

├── js/

│ └── themeManager.js # Theme management logic

└── components/

└── navbar.html # Theme toggle button

```

5. **Theme Variables**

```css

:root {

--bg-primary: #ffffff;

--bg-secondary: #f8f9fa;

--text-primary: #2c3e50;

--text-secondary: #6c757d;

--accent-color: #3498db;

/* ... other theme variables */

}

  

[data-theme="dark"] {

--bg-primary: #1a1a1a;

--bg-secondary: #2d2d2d;

--text-primary: #ffffff;

--text-secondary: #cccccc;

--accent-color: #3498db;

/* ... other dark theme variables */

}

```

  

6. **Usage Example**

```css

.container {

background-color: var(--bg-primary);

color: var(--text-primary);

}

```

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

4. **API Testing System**

	- Automated endpoint testing with test data
	
	- Complete CRUD operation verification
	
	- Safe test data handling with cleanup
	
	- Real-time test results logging

Test Data Structure:

```javascript

{

'/api/sets': {

create: { set_name: 'Test Set', items: ['item1', 'item2'] },

update: { set_name: 'Updated Set', items: ['item1', 'item2', 'item3'] }

},

'/api/parameters': {

create: { name: 'Test Parameter', value: 100 },

update: { name: 'Updated Parameter', value: 200 }

},

// ... other endpoints

}

```

Testing Flow:

1. Create test item with unique identifier

2. Verify GET operation

3. Test PUT with updated data

4. Confirm DELETE operation

5. Automatic cleanup of test data

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

## Logging System

### Interactive Message Logger

The application includes an interactive message logging system that provides real-time monitoring of system events, errors, and API status.
#### Features

1. **Message Types**:

	- ERROR (Red): System errors and failures
	
	- SUCCESS (Green): Successful operations
	
	- INFO (Cyan): General system information
	
	- WARNING (Yellow): Important notices

2. **Real-time Monitoring**:

	- Database connection status
	
	- Server initialization
	
	- API endpoint health
	
	- Route access attempts

3. **Interactive Navigation**:

```bash

npm run errors # Start the interactive logger

```

- `N`: Next message

- `P`: Previous message

- `F`: Cycle through filters (ALL → ERROR → SUCCESS → INFO)

- `R`: Test random route access

- `A`: Check all API endpoints

- `W`: Run complete API workflow tests

- `D`: Check database state

- `Q`: Quit

4. **API Testing Commands**:

- `A`: Quick endpoint check

	- Tests all endpoints
	
	- Uses test data
	
	- Verifies basic functionality

- `W`: Complete workflow test

	- Creates test items
	
	- Updates test data
	
	- Verifies changes

	- Cleans up after testing

- `D`: Database state check

	- Shows current records
	
	- Verifies test data cleanup
	
	- Monitors database changes

5. **Test Data Management**:

- Unique identifiers with timestamps

- Automatic cleanup after testing

- Safe separation from production data

- Comprehensive error logging


6. **Test Output Format**:

```bash

Created test item with ID: 123

API /api/endpoint [GET] - Status: 200 ✓

API /api/endpoint [POST] - Status: 201 ✓

API /api/endpoint/123 [PUT] - Status: 200 ✓

API /api/endpoint/123 [DELETE] - Status: 200 ✓

```

  

### Development Tools

1. **Browser Auto-opener**:

```bash

npm run dev # Starts server and opens browser

```

	- Automatically opens default browser
	
	- Platform-independent (Windows, macOS, Linux)
	
	- Configurable delay (default: 2s)

2. **Error Tracking**:

	- Real-time error capture
	
	- Stack trace preservation
	
	- Error categorization
	
	- Location tracking

  
3. **Database Monitoring**:

	- Connection status
	
	- Query execution
	
	- Error reporting
	
	- Performance metrics


### Usage Examples

1. **Start Development Server with Logging**:

```bash

npm run dev

```

2. **Monitor System Messages**:

```bash

npm run errors

```

3. **Check API Health**:

```bash

# In the error logger interface

Press 'A' to check all endpoints

```

4. **Test Random Routes**:

```bash

# In the error logger interface

Press 'R' to test random route access

```

All of the above is done by [Cursor](https://www.cursor.sh).