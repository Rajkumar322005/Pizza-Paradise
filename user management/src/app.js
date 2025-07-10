const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { check } = require('express-validator');
const config = require('./env');
const { signup, signin } = require('./controllers/authController');
const { getProfile, updateProfile } = require('./controllers/userController');
const { protect } = require('./middleware/auth');

// Create Express app
const app = express();

// Connect to MongoDB with better error handling
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
    console.log('Database connection string:', config.MONGODB_URI);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Connection string used:', config.MONGODB_URI);
    process.exit(1);
  });

// CORS Configuration with specific options
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'https://pizza-paradise-v1io.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Create router
const router = express.Router();

// Auth routes
router.post(
  '/auth/signup',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  signup
);

router.post(
  '/auth/signin',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  signin
);

// Protected user routes
router.get('/users/profile', protect, getProfile);

router.put(
  '/users/profile',
  protect,
  [
    check('name', 'Name is required').optional().not().isEmpty(),
    check('phone').optional()
  ],
  updateProfile
);

// Use router with /api prefix

app.use('/api', router);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: err.message
  });
});

// Start server with better logging
const PORT = config.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
  console.log(`API base URL: http://localhost:${PORT}/api`);
}); 