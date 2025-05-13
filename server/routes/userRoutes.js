const express = require('express');
const userController = require('../controllers/userController');
const { authenticateJWT } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes (require authentication)
router.get('/profile', authenticateJWT, userController.getProfile);
router.put('/profile', authenticateJWT, userController.updateProfile);
router.put('/change-password', authenticateJWT, userController.changePassword);

module.exports = router; 