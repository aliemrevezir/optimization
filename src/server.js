const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const setsRoutes = require('./routes/sets');
const parametersRoutes = require('./routes/parameters');
const constraintRoutes = require('./routes/constraints');
// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/sets', setsRoutes);
app.use('/api/parameters', parametersRoutes);
app.use('/api/constraints', constraintRoutes);
// Serve frontend
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
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
app.get('/rasit', (req, res) => {
    res.send('Raşit İksir\'i çok sever.');
});
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 