const errorLogger = require('./errorLogger');

// Available routes from the project structure
const routes = {
    api: [
        // Sets routes
        '/api/sets',
        '/api/sets/:id',
        
        // Parameters routes
        '/api/parameters',
        '/api/parameters/:id',
        
        // Constraints routes
        '/api/constraints',
        '/api/constraints/:id',
        
        // Decision Variables routes
        '/api/decision_variables',
        '/api/decision_variables/:id',

        // Objective Functions routes
        '/api/objective_functions',
        '/api/objective_functions/:id'
    ],
    pages: [
        '/',
        '/sets',
        '/parameters',
        '/constraints',
        '/decision_variables',
        '/objective_functions'
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


// Function to test API endpoint
async function checkApiEndpoint(endpoint) {
    try {
        // Get test data based on the endpoint
        const testData = {
            '/api/sets': {
                create: { 
                    set_name: 'Test Set', 
                    description: `Test Description - Created at ${new Date().toISOString()}`, 
                    items: ['item1', 'item2'] 
                },
                update: { 
                    set_name: 'Updated Test Set', 
                    description: `Updated Description - Modified at ${new Date().toISOString()}`, 
                    items: ['item1', 'item2', 'item3'] 
                }
            },
            '/api/parameters': {
                create: { 
                    name: 'Test Parameter', 
                    value: 100, 
                    relations: ['rel1', 'rel2'], 
                    description: `Test Description - Created at ${new Date().toISOString()}` 
                },
                update: { 
                    name: 'Updated Parameter', 
                    value: 200, 
                    relations: ['rel1', 'rel2', 'rel3'], 
                    description: `Updated Description - Modified at ${new Date().toISOString()}` 
                }
            },
            '/api/constraints': {
                create: { 
                    name: 'Test Constraint', 
                    parameters_needed: ['param1'], 
                    decision_needed: ['dec1'], 
                    description: `Test Description - Created at ${new Date().toISOString()}`, 
                    sign: 'le', 
                    format: 'x + y <= 10', 
                    rhs: 10 
                },
                update: { 
                    name: 'Updated Constraint', 
                    parameters_needed: ['param1', 'param2'], 
                    decision_needed: ['dec1', 'dec2'], 
                    description: `Updated Description - Modified at ${new Date().toISOString()}`, 
                    sign: 'le', 
                    format: 'x + y + z <= 15', 
                    rhs: 15 
                }
            },
            '/api/decision_variables': {
                create: { 
                    name: 'Test Decision', 
                    description: `Test Description - Created at ${new Date().toISOString()}`, 
                    relations: ['rel1', 'rel2'] 
                },
                update: { 
                    name: 'Updated Decision', 
                    description: `Updated Description - Modified at ${new Date().toISOString()}`, 
                    relations: ['rel1', 'rel2', 'rel3'] 
                }
            },
            '/api/objective_functions': {
                create: { 
                    name: 'Test Function', 
                    parameters_needed: ['param1'], 
                    decision_needed: ['dec1'], 
                    description: `Test Description - Created at ${new Date().toISOString()}`, 
                    format: 'max: x + y' 
                },
                update: { 
                    name: 'Updated Function', 
                    parameters_needed: ['param1', 'param2'], 
                    decision_needed: ['dec1', 'dec2'], 
                    description: `Updated Description - Modified at ${new Date().toISOString()}`, 
                    format: 'max: 2x + 3y' 
                }
            }
        };

        // Get the base endpoint without :id
        const baseEndpoint = endpoint.replace('/:id', '');
        const data = testData[baseEndpoint];

        if (!data && !endpoint.includes('/:id')) {
            throw new Error(`No test data configured for endpoint: ${baseEndpoint}`);
        }

        let createdId = null;
        let testResults = [];

        // Create test item if needed
        if (!endpoint.includes(':id')) {
            try {
                // First, create a test item
                const createResponse = await fetch(`http://localhost:3000${baseEndpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...data.create,
                        description: `Test Description - Created at ${new Date().toISOString()}`
                    })
                });
                const createResult = await createResponse.json();
                
                if (createResult.success) {
                    createdId = createResult.data.id;
                    console.log(`Created test item with ID: ${createdId}`);
                    
                    // Test GET request
                    const getResponse = await fetch(`http://localhost:3000${baseEndpoint}`);
                    const getResult = await getResponse.json();
                    testResults.push({
                        method: 'GET',
                        status: getResponse.status,
                        isSuccess: getResult.success
                    });

                    // Test POST request (already done with creation)
                    testResults.push({
                        method: 'POST',
                        status: createResponse.status,
                        isSuccess: createResult.success
                    });
                }
            } catch (error) {
                console.error('Error in test sequence:', error);
                testResults.push({
                    method: 'POST/GET',
                    status: 500,
                    isSuccess: false,
                    error: error.message
                });
            }
        } else {
            // For ID-specific endpoints, first create a test item
            try {
                const createResponse = await fetch(`http://localhost:3000${baseEndpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...data.create,
                        description: `Test Description - Created at ${new Date().toISOString()}`
                    })
                });
                const createResult = await createResponse.json();
                
                if (createResult.success) {
                    createdId = createResult.data.id;
                    console.log(`Created test item with ID: ${createdId}`);

                    // Test sequence for ID-specific endpoints
                    const methods = ['GET', 'PUT', 'DELETE'];
                    for (const method of methods) {
                        try {
                            const response = await fetch(`http://localhost:3000${baseEndpoint}/${createdId}`, {
                                method,
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                ...(method === 'PUT' && {
                                    body: JSON.stringify({
                                        ...data.update,
                                        description: `Updated Description - Modified at ${new Date().toISOString()}`
                                    })
                                })
                            });
                            const result = await response.json();
                            testResults.push({
                                method,
                                status: response.status,
                                isSuccess: result.success
                            });
                        } catch (error) {
                            testResults.push({
                                method,
                                status: 500,
                                isSuccess: false,
                                error: error.message
                            });
                        }
                    }
                }
            } catch (error) {
                console.error('Error in test sequence:', error);
            }
        }

        // Log results
        testResults.forEach(({ method, status, isSuccess, error }) => {
            errorLogger.logError(
                `API ${endpoint}${createdId ? `/${createdId}` : ''} [${method}] - Status: ${status} ${isSuccess ? '✓' : '✗'} ${error ? `(${error})` : ''}`,
                isSuccess ? 'SUCCESS' : 'ERROR',
                'src/server.js'
            );
        });

        return testResults.some(r => r.isSuccess);
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

// Function to test complete API workflow
async function testApiWorkflow(baseEndpoint) {
    try {
        const testData = {
            // Test data for different endpoints
            '/api/sets': {
                create: { 
                    set_name: 'Test Set', 
                    description: `Test Description - Created at ${new Date().toISOString()}`, 
                    items: ['item1', 'item2'] 
                },
                update: { 
                    set_name: 'Updated Test Set', 
                    description: `Updated Description - Modified at ${new Date().toISOString()}`, 
                    items: ['item1', 'item2', 'item3'] 
                }
            },
            '/api/parameters': {
                create: { 
                    name: 'Test Parameter', 
                    value: 100, 
                    relations: ['rel1', 'rel2'], 
                    description: `Test Description - Created at ${new Date().toISOString()}` 
                },
                update: { 
                    name: 'Updated Parameter', 
                    value: 200, 
                    relations: ['rel1', 'rel2', 'rel3'], 
                    description: `Updated Description - Modified at ${new Date().toISOString()}` 
                }
            },
            '/api/constraints': {
                create: { 
                    name: 'Test Constraint', 
                    parameters_needed: ['param1'], 
                    decision_needed: ['dec1'], 
                    description: `Test Description - Created at ${new Date().toISOString()}`, 
                    sign: 'le', 
                    format: 'x + y <= 10', 
                    rhs: 10 
                },
                update: { 
                    name: 'Updated Constraint', 
                    parameters_needed: ['param1', 'param2'], 
                    decision_needed: ['dec1', 'dec2'], 
                    description: `Updated Description - Modified at ${new Date().toISOString()}`, 
                    sign: 'le', 
                    format: 'x + y + z <= 15', 
                    rhs: 15 
                }
            },
            '/api/decision_variables': {
                create: { 
                    name: 'Test Decision', 
                    description: `Test Description - Created at ${new Date().toISOString()}`, 
                    relations: ['rel1', 'rel2'] 
                },
                update: { 
                    name: 'Updated Decision', 
                    description: `Updated Description - Modified at ${new Date().toISOString()}`, 
                    relations: ['rel1', 'rel2', 'rel3'] 
                }
            },
            '/api/objective_functions': {
                create: { 
                    name: 'Test Function', 
                    parameters_needed: ['param1'], 
                    decision_needed: ['dec1'], 
                    description: `Test Description - Created at ${new Date().toISOString()}`, 
                    format: 'max: x + y' 
                },
                update: { 
                    name: 'Updated Function', 
                    parameters_needed: ['param1', 'param2'], 
                    decision_needed: ['dec1', 'dec2'], 
                    description: `Updated Description - Modified at ${new Date().toISOString()}`, 
                    format: 'max: 2x + 3y' 
                }
            }
        };

        const data = testData[baseEndpoint];
        if (!data) {
            throw new Error(`No test data configured for endpoint: ${baseEndpoint}`);
        }

        // Step 1: Create new item
        console.log(`\nTesting workflow for ${baseEndpoint}`);
        console.log('Step 1: Creating new item...');
        const createResponse = await fetch(`http://localhost:3000${baseEndpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data.create)
        });
        const createResult = await createResponse.json();
        
        if (!createResult.success) {
            throw new Error(`Create operation failed: ${createResult.error}`);
        }
        
        const createdId = createResult.data.id;
        errorLogger.logError(
            `Created test item at ${baseEndpoint} with ID: ${createdId}`,
            'SUCCESS',
            'API Test'
        );

        // Step 2: Update the created item
        console.log('Step 2: Updating item...');
        const updateResponse = await fetch(`http://localhost:3000${baseEndpoint}/${createdId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...data.update,
                description: `Updated Description - Modified at ${new Date().toISOString()}`
            })
        });
        const updateResult = await updateResponse.json();
        
        if (!updateResult.success) {
            throw new Error(`Update operation failed: ${updateResult.error}`);
        }
        
        errorLogger.logError(
            `Updated test item at ${baseEndpoint}/${createdId}`,
            'SUCCESS',
            'API Test'
        );

        // Step 3: Verify the update
        console.log('Step 3: Verifying update...');
        const getResponse = await fetch(`http://localhost:3000${baseEndpoint}/${createdId}`);
        const getResult = await getResponse.json();
        
        if (!getResult.success) {
            throw new Error(`Get operation failed: ${getResult.error}`);
        }
        
        errorLogger.logError(
            `Verified test item at ${baseEndpoint}/${createdId}`,
            'SUCCESS',
            'API Test'
        );

        // Step 4: Delete the item
        console.log('Step 4: Cleaning up...');
        const deleteResponse = await fetch(`http://localhost:3000${baseEndpoint}/${createdId}`, {
            method: 'DELETE'
        });
        const deleteResult = await deleteResponse.json();
        
        if (!deleteResult.success) {
            throw new Error(`Delete operation failed: ${deleteResult.error}`);
        }
        
        errorLogger.logError(
            `Deleted test item at ${baseEndpoint}/${createdId}`,
            'SUCCESS',
            'API Test'
        );

        return true;
    } catch (error) {
        errorLogger.logError(
            `API Workflow Test Failed for ${baseEndpoint}: ${error.message}`,
            'ERROR',
            'API Test'
        );
        return false;
    }
}

// Function to test all API workflows
async function testAllApiWorkflows() {
    console.log('\nStarting API Workflow Tests...');
    
    const baseEndpoints = [
        '/api/sets',
        '/api/parameters',
        '/api/constraints',
        '/api/decision_variables',
        '/api/objective_functions'
    ];

    const results = await Promise.all(
        baseEndpoints.map(async endpoint => {
            const success = await testApiWorkflow(endpoint);
            return { endpoint, success };
        })
    );

    // Print summary
    console.log('\nAPI Workflow Test Summary:');
    results.forEach(({ endpoint, success }) => {
        console.log(`${success ? '✓' : '✗'} ${endpoint}`);
    });

    const successCount = results.filter(r => r.success).length;
    console.log(`\n${successCount}/${baseEndpoints.length} workflows completed successfully\n`);

    return results;
}

// Function to check database state
async function checkDatabaseState() {
    try {
        console.log('\nChecking Database State...');
        
        const tables = [
            'sets',
            'parameters',
            'constraints',
            'decision_variables',
            'objective_functions'
        ];

        for (const table of tables) {
            const result = await pool.query(`SELECT * FROM ${table} ORDER BY id ASC`);
            console.log(`\n=== ${table.toUpperCase()} TABLE ===`);
            if (result.rows.length === 0) {
                console.log('No records found');
            } else {
                result.rows.forEach(row => {
                    console.log('\nRecord ID:', row.id);
                    Object.entries(row).forEach(([key, value]) => {
                        if (key !== 'id') {
                            console.log(`${key}: ${Array.isArray(value) ? JSON.stringify(value) : value}`);
                        }
                    });
                });
            }
        }
        console.log('\nDatabase check complete.\n');
    } catch (error) {
        console.error('Error checking database:', error);
        errorLogger.logError(
            `Database check failed: ${error.message}`,
            'ERROR',
            'Database Check'
        );
    }
}

// Add new keyboard command for API check
process.stdin.on('keypress', async (str, key) => {
    if (key.name === 'r') {
        // Generate a random route to test
        const allRoutes = [...routes.api, ...routes.pages];
        console.log(allRoutes);
        const randomRoute = allRoutes[Math.floor(Math.random() * allRoutes.length)];
        
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
    } else if (key.name === 'a') {
        await checkAllApiEndpoints();
    } else if (key.name === 'w') {
        await testAllApiWorkflows();
    } else if (key.name === 'd') {
        await checkDatabaseState();
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
console.log('W: Run complete API workflow tests');
console.log('D: Check database state');
console.log('Q: Quit'); 

