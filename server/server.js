const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { errorHandler } = require('./middlewares/errorHandler');
const userRoutes = require('./routes/userRoutes');
const donationRoutes = require('./routes/donationRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const ngoRoutes = require('./routes/ngoRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
})); // Enable CORS with more specific settings
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Test route for CORS and POST requests
app.post('/test-post', (req, res) => {
  console.log('Test POST route called');
  console.log('Request body:', req.body);
  return res.status(200).json({
    message: 'POST test route works!',
    receivedData: req.body
  });
});

// Direct test login route
app.post('/direct-login', (req, res) => {
  console.log('Direct login route called');
  console.log('Login credentials:', req.body);
  return res.status(200).json({
    status: 'success',
    message: 'Direct login route works!',
    data: {
      user: {
        id: 1,
        name: 'Test User',
        email: req.body.email || 'test@example.com',
        isNgo: false,
        isAdmin: false
      },
      token: 'test-token-123'
    }
  });
});

// Routes
console.log('Registering API routes...');
app.use('/api/users', userRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/ngos', ngoRoutes);
app.use('/api/transactions', transactionRoutes);
console.log('API routes registered');

// Debug available routes
const availableRoutes = app._router.stack
  .filter(r => r.route)
  .map(r => {
    return {
      path: r.route.path,
      methods: Object.keys(r.route.methods)
    };
  });
console.log('Available direct routes:', availableRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Welcome to Care4Crisis API',
    version: '1.0.0',
    documentation: process.env.NODE_ENV === 'production' 
      ? 'https://api.care4crisis.com/docs' 
      : 'http://localhost:5000/docs'
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 route
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Node environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database connection: ${process.env.PGDATABASE ? 'Configured' : 'Not configured'}`);
});

module.exports = app; 