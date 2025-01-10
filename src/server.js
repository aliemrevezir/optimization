const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const errorLogger = require('../scripts/errorLogger');

const setsRoutes = require('./routes/sets');
const parametersRoutes = require('./routes/parameters');
const constraintRoutes = require('./routes/constraints');
const decisionVariablesRoutes = require('./routes/decisionVariables');
const objectiveFunctionsRoutes = require('./routes/objectiveFunctions');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Error handling middleware
app.use((err, req, res, next) => {
    errorLogger.logError(err.message, 'SERVER_ERROR', req.path);
    res.status(500).json({ error: 'Something went wrong!' });
});

// API Routes
app.use('/api/sets', setsRoutes);
app.use('/api/parameters', parametersRoutes);
app.use('/api/constraints', constraintRoutes);
app.use('/api/decision_variables', decisionVariablesRoutes);
app.use('/api/objective_functions', objectiveFunctionsRoutes);

// Frontend routes
app.get('/decision_variables', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/decision_variables.html'));
});

app.get('/parameters', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/parameters.html'));
});

app.get('/sets', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/sets.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/constraints', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/constraints.html'));
});

app.get('/objective_functions', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/objectiveFunctions.html'));
});

// Test error logging
app.get('/test-error', (req, res, next) => {
    next(new Error('This is a test error'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // Log initial startup
    errorLogger.logError('Server started successfully', 'INFO', 'server.js');
}); 