const express = require('express');
const { authenticateJWT } = require('../middlewares/auth');

const router = express.Router();

// Temporary placeholder for transaction controller
const transactionController = {
  getAllTransactions: (req, res) => {
    res.status(200).json({ 
      status: 'success', 
      message: 'This endpoint will return all transactions',
      data: { transactions: [] }
    });
  },
  
  getTransactionById: (req, res) => {
    res.status(200).json({ 
      status: 'success', 
      message: `This endpoint will return transaction with ID: ${req.params.id}`,
      data: { transaction: null }
    });
  },
  
  recordTransaction: (req, res) => {
    res.status(201).json({ 
      status: 'success', 
      message: 'This endpoint will record a new transaction',
      data: { transaction: null }
    });
  },
  
  getCampaignTransactions: (req, res) => {
    res.status(200).json({ 
      status: 'success', 
      message: `This endpoint will return transactions for campaign ID: ${req.params.campaignId}`,
      data: { transactions: [] }
    });
  }
};

// Routes
router.get('/', authenticateJWT, transactionController.getAllTransactions);
router.get('/:id', authenticateJWT, transactionController.getTransactionById);
router.post('/', authenticateJWT, transactionController.recordTransaction);
router.get('/campaign/:campaignId', authenticateJWT, transactionController.getCampaignTransactions);

module.exports = router;
