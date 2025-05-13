const express = require('express');
const ngoController = require('../controllers/ngoController');
const { authenticateJWT, isAdmin } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.get('/', ngoController.getAllNGOs);
router.get('/:id', ngoController.getNGOById);

// Protected routes (require authentication)
router.post('/', authenticateJWT, ngoController.registerNGO);
router.put('/:id', authenticateJWT, ngoController.updateNGO);
router.get('/user/me', authenticateJWT, ngoController.getCurrentUserNGO);

// Admin-only routes
router.put('/:id/verify', authenticateJWT, isAdmin, ngoController.verifyNGO);
router.put('/:id/reject', authenticateJWT, isAdmin, ngoController.rejectNGO);

module.exports = router; 