const express = require('express');
const campaignController = require('../controllers/campaignController');
const { authenticateJWT, isNgo, isAdmin } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.get('/', campaignController.getAllCampaigns);
router.get('/:id', campaignController.getCampaignById);

// Protected routes (require authentication)
router.post('/', authenticateJWT, isNgo, campaignController.createCampaign);
router.put('/:id', authenticateJWT, campaignController.updateCampaign);
router.delete('/:id', authenticateJWT, campaignController.deleteCampaign);
router.put('/:id/amount', authenticateJWT, campaignController.updateCampaignAmount);
router.put('/:id/complete', authenticateJWT, campaignController.markCampaignComplete);

module.exports = router; 