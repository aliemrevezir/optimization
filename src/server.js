const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const setsRoutes = require('./routes/sets');

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

// Serve frontend
app.get('/sets', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/sets.html'));
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