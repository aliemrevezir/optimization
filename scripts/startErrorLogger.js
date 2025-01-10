const errorLogger = require('./errorLogger');

// Available routes from the project structure
const routes = {
    api: [
        '/api/sets',
        '/api/parameters',
        '/api/constraints',
        '/api/decision_variables',
        '/api/objective_functions'
    ],
    pages: [
        '/',
        '/sets',
        '/parameters',
        '/constraints',
        '/decision_variables'
    ]
};

// Check database connection
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

// Initialize database connection
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'optimization_db',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

// Sample messages for testing
const testMessages = [];

// Check database connection and add status message
pool.connect()
    .then(client => {
        client.release();
        testMessages.push({
            message: 'Successfully connected to PostgreSQL database',
            type: 'SUCCESS',
            location: 'config/database.js'
        });
    })
    .catch(err => {
        testMessages.push({
            message: `Database connection failed: ${err.message}`,
            type: 'ERROR',
            location: '../config/database.js'
        });
    })
    .finally(() => {
        // Add server startup messages
        testMessages.push({
            message: 'Application initialized successfully',
            type: 'SUCCESS',
            location: 'src/server.js'
        });

        testMessages.push({
            message: 'Server listening on port 3000',
            type: 'INFO',
            location: 'src/server.js'
        });

        // Log test messages
        console.log('Starting Message Logger...');
        testMessages.forEach(msg => {
            errorLogger.logError(msg.message, msg.type, msg.location);
        });

        // Start navigation with route checking
        errorLogger.startNavigation();
    });

// Function to generate route not found message
function generateRouteNotFound(route) {
    return {
        message: `Route not found: ${route}`,
        type: 'ERROR',
        location: 'src/server.js',
        timestamp: new Date().toISOString()
    };
}

// Function to check if route exists
function isValidRoute(route) {
    return routes.api.includes(route) || routes.pages.includes(route);
}
// Function to test API endpoint
async function checkApiEndpoint(endpoint) {
    try {
        const response = await fetch(`http://localhost:3000${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const status = response.status;
        const isSuccess = response.ok; // true if status is 2xx

        errorLogger.logError(
            `API ${endpoint} - Status: ${status} ${isSuccess ? '✓' : '✗'}`,
            isSuccess ? 'SUCCESS' : 'ERROR',
            'src/server.js'
        );

        return isSuccess;
    } catch (error) {
        errorLogger.logError(
            `API ${endpoint} - Failed: ${error.message}`,
            'ERROR',
            'src/server.js'
        );
        return false;
    }
}

// Function to check all API endpoints
async function checkAllApiEndpoints() {
    console.log('\nChecking API endpoints...');
    
    const results = await Promise.all(
        routes.api.map(async endpoint => {
            const isWorking = await checkApiEndpoint(endpoint);
            return { endpoint, isWorking };
        })
    );

    // Summary
    console.log('\nAPI Status Summary:');
    results.forEach(({ endpoint, isWorking }) => {
        console.log(`${isWorking ? '✓' : '✗'} ${endpoint}`);
    });

    const workingCount = results.filter(r => r.isWorking).length;
    console.log(`\n${workingCount}/${routes.api.length} endpoints working\n`);
}


// Add new keyboard command for API check
process.stdin.on('keypress', async (str, key) => {
    if (key.name === 'r') {
        // Generate a random route to test
        const allRoutes = [...routes.api, ...routes.pages];
        console.log(allRoutes);
        const randomRoute = allRoutes[Math.floor(Math.random() * allRoutes.length)];
        const invalidRoute = `/invalid${Math.floor(Math.random() * 10)}`;
        
        // 50% chance of using valid or invalid route
        const routeToTest = checkApiEndpoint(randomRoute);
        
        if (routeToTest) {
            errorLogger.logError(
                `Route accessed: ${routeToTest}`,
                'SUCCESS',
                'src/server.js'
            );
        } else {
            errorLogger.logError(
                `Route not found: ${routeToTest}`,
                'ERROR',
                'src/server.js'
            );
        }
    } else if (key.name === 'a') {  // New command
        await checkAllApiEndpoints();
    } else if (key.name === 'q') {
        process.exit();
    } else if (key.name === 'n') {
        errorLogger.showNext();
    } else if (key.name === 'p') {
        errorLogger.showPrevious();
    } else if (key.name === 'f') {
        errorLogger.cycleFilter();
    }
});

// Update console instructions
console.log('\nUse the following keys to navigate:');
console.log('N: Next message');
console.log('P: Previous message');
console.log('F: Change filter (ALL → ERROR → SUCCESS → INFO)');
console.log('R: Test random route access');
console.log('A: Check all API endpoints');
console.log('Q: Quit'); 

