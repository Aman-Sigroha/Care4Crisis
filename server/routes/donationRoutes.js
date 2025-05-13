const express = require('express');
const donationController = require('../controllers/donationController');
const { authenticateJWT } = require('../middlewares/auth');

const router = express.Router();

// Protected routes (require authentication)
router.get('/', authenticateJWT, donationController.getUserDonations);
router.post('/blockchain', authenticateJWT, donationController.createBlockchainDonation);
router.post('/regular', authenticateJWT, donationController.createRegularDonation);
router.get('/campaign/:campaignId', authenticateJWT, donationController.getCampaignDonations);
router.get('/stats', authenticateJWT, donationController.getDonationStats);

module.exports = router; 