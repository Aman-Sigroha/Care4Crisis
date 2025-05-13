const Campaign = require('../models/campaignModel');
const NGO = require('../models/ngoModel');

/**
 * Campaign Controller
 */
const campaignController = {
  /**
   * Get all campaigns
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getAllCampaigns(req, res) {
    try {
      // Parse query parameters for filtering
      const filters = {};
      
      if (req.query.ngoId) {
        filters.ngoId = parseInt(req.query.ngoId);
      }
      
      if (req.query.isComplete) {
        filters.isComplete = req.query.isComplete === 'true';
      }
      
      if (req.query.category) {
        filters.category = req.query.category;
      }
      
      if (req.query.blockchain) {
        filters.blockchain = req.query.blockchain;
      }
      
      const campaigns = await Campaign.getAllCampaigns(filters);
      
      // Format response for client
      const formattedCampaigns = campaigns.map(campaign => ({
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        targetAmount: parseFloat(campaign.target_amount),
        deadline: campaign.deadline,
        imageUrl: campaign.image_url,
        category: campaign.category,
        blockchain: campaign.blockchain,
        contractAddress: campaign.contract_address,
        onChainId: campaign.on_chain_id,
        isComplete: campaign.is_complete,
        amountCollected: parseFloat(campaign.amount_collected),
        progress: parseFloat(((parseFloat(campaign.amount_collected) / parseFloat(campaign.target_amount)) * 100).toFixed(2)),
        ngo: {
          id: campaign.ngo_id,
          name: campaign.ngo_name,
          logoUrl: campaign.ngo_logo
        },
        createdAt: campaign.created_at,
        updatedAt: campaign.updated_at
      }));
      
      return res.status(200).json({
        status: 'success',
        data: {
          campaigns: formattedCampaigns
        }
      });
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch campaigns'
      });
    }
  },
  
  /**
   * Get campaign by ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getCampaignById(req, res) {
    try {
      const { id } = req.params;
      
      const campaign = await Campaign.getCampaignById(id);
      
      if (!campaign) {
        return res.status(404).json({
          status: 'error',
          message: 'Campaign not found'
        });
      }
      
      // Get campaign donations
      const donations = await Campaign.getCampaignDonations(id);
      
      // Format response for client
      const formattedCampaign = {
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        targetAmount: parseFloat(campaign.target_amount),
        deadline: campaign.deadline,
        imageUrl: campaign.image_url,
        category: campaign.category,
        blockchain: campaign.blockchain,
        contractAddress: campaign.contract_address,
        transactionHash: campaign.transaction_hash,
        onChainId: campaign.on_chain_id,
        isComplete: campaign.is_complete,
        amountCollected: parseFloat(campaign.amount_collected),
        progress: parseFloat(((parseFloat(campaign.amount_collected) / parseFloat(campaign.target_amount)) * 100).toFixed(2)),
        ngo: {
          id: campaign.ngo_id,
          name: campaign.ngo_name,
          logoUrl: campaign.ngo_logo,
          ethereumAddress: campaign.ethereum_address,
          solanaAddress: campaign.solana_address
        },
        donations: donations.map(donation => ({
          id: donation.id,
          amount: parseFloat(donation.amount),
          donorName: donation.is_anonymous ? 'Anonymous' : donation.donor_name,
          currency: donation.currency,
          blockchain: donation.blockchain,
          transactionHash: donation.transaction_hash,
          message: donation.message,
          isAnonymous: donation.is_anonymous,
          status: donation.donation_status,
          createdAt: donation.created_at
        })),
        createdAt: campaign.created_at,
        updatedAt: campaign.updated_at
      };
      
      return res.status(200).json({
        status: 'success',
        data: {
          campaign: formattedCampaign
        }
      });
    } catch (err) {
      console.error('Error fetching campaign details:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch campaign details'
      });
    }
  },
  
  /**
   * Create a new campaign
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async createCampaign(req, res) {
    try {
      const {
        ngoId,
        title,
        description,
        targetAmount,
        deadline,
        imageUrl,
        category,
        blockchain,
        contractAddress,
        transactionHash,
        onChainId
      } = req.body;
      
      // Validate required fields
      if (!ngoId || !title || !description || !targetAmount || !deadline || !blockchain) {
        return res.status(400).json({
          status: 'error',
          message: 'Missing required fields: ngoId, title, description, targetAmount, deadline, and blockchain are required'
        });
      }
      
      // Validate NGO exists
      // This assumes we have an NGO model
      if (NGO) {
        const ngo = await NGO.getNgoById(ngoId);
        if (!ngo) {
          return res.status(404).json({
            status: 'error',
            message: 'NGO not found'
          });
        }
        
        // Check if user is associated with this NGO or is admin
        if (req.user.id !== ngo.user_id && !req.user.isAdmin) {
          return res.status(403).json({
            status: 'error',
            message: 'You do not have permission to create a campaign for this NGO'
          });
        }
      }
      
      // Create campaign
      const campaign = await Campaign.createCampaign({
        ngoId,
        title,
        description,
        targetAmount,
        deadline,
        imageUrl,
        category,
        blockchain,
        contractAddress,
        transactionHash,
        onChainId
      });
      
      return res.status(201).json({
        status: 'success',
        message: 'Campaign created successfully',
        data: {
          campaign: {
            id: campaign.id,
            title: campaign.title,
            description: campaign.description,
            targetAmount: parseFloat(campaign.target_amount),
            deadline: campaign.deadline,
            imageUrl: campaign.image_url,
            category: campaign.category,
            blockchain: campaign.blockchain,
            contractAddress: campaign.contract_address,
            transactionHash: campaign.transaction_hash,
            onChainId: campaign.on_chain_id,
            isComplete: campaign.is_complete,
            amountCollected: parseFloat(campaign.amount_collected),
            ngoId: campaign.ngo_id,
            createdAt: campaign.created_at
          }
        }
      });
    } catch (err) {
      console.error('Error creating campaign:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create campaign'
      });
    }
  },
  
  /**
   * Update campaign
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async updateCampaign(req, res) {
    try {
      const { id } = req.params;
      
      // Check if campaign exists
      const existingCampaign = await Campaign.getCampaignById(id);
      
      if (!existingCampaign) {
        return res.status(404).json({
          status: 'error',
          message: 'Campaign not found'
        });
      }
      
      // Check permission - only NGO owner or admin can update
      if (req.user.id !== existingCampaign.user_id && !req.user.isAdmin && !req.user.isNgo) {
        return res.status(403).json({
          status: 'error',
          message: 'You do not have permission to update this campaign'
        });
      }
      
      const {
        title,
        description,
        targetAmount,
        deadline,
        imageUrl,
        category,
        contractAddress,
        transactionHash,
        onChainId,
        isComplete,
        amountCollected
      } = req.body;
      
      // Update campaign
      const campaign = await Campaign.updateCampaign(id, {
        title,
        description,
        targetAmount,
        deadline,
        imageUrl,
        category,
        contractAddress,
        transactionHash,
        onChainId,
        isComplete,
        amountCollected
      });
      
      return res.status(200).json({
        status: 'success',
        message: 'Campaign updated successfully',
        data: {
          campaign: {
            id: campaign.id,
            title: campaign.title,
            description: campaign.description,
            targetAmount: parseFloat(campaign.target_amount),
            deadline: campaign.deadline,
            imageUrl: campaign.image_url,
            category: campaign.category,
            blockchain: campaign.blockchain,
            contractAddress: campaign.contract_address,
            transactionHash: campaign.transaction_hash,
            onChainId: campaign.on_chain_id,
            isComplete: campaign.is_complete,
            amountCollected: parseFloat(campaign.amount_collected),
            ngoId: campaign.ngo_id,
            updatedAt: campaign.updated_at
          }
        }
      });
    } catch (err) {
      console.error('Error updating campaign:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update campaign'
      });
    }
  },
  
  /**
   * Delete campaign
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async deleteCampaign(req, res) {
    try {
      const { id } = req.params;
      
      // Check if campaign exists
      const existingCampaign = await Campaign.getCampaignById(id);
      
      if (!existingCampaign) {
        return res.status(404).json({
          status: 'error',
          message: 'Campaign not found'
        });
      }
      
      // Check permission - only NGO owner or admin can delete
      if (req.user.id !== existingCampaign.user_id && !req.user.isAdmin) {
        return res.status(403).json({
          status: 'error',
          message: 'You do not have permission to delete this campaign'
        });
      }
      
      // Delete campaign
      await Campaign.deleteCampaign(id);
      
      return res.status(200).json({
        status: 'success',
        message: 'Campaign deleted successfully'
      });
    } catch (err) {
      console.error('Error deleting campaign:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete campaign'
      });
    }
  },
  
  /**
   * Update campaign amount collected
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async updateCampaignAmount(req, res) {
    try {
      const { id } = req.params;
      const { amount } = req.body;
      
      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Valid amount is required'
        });
      }
      
      // Check if campaign exists
      const existingCampaign = await Campaign.getCampaignById(id);
      
      if (!existingCampaign) {
        return res.status(404).json({
          status: 'error',
          message: 'Campaign not found'
        });
      }
      
      // Update amount collected
      const campaign = await Campaign.updateAmountCollected(id, parseFloat(amount));
      
      return res.status(200).json({
        status: 'success',
        message: 'Campaign amount updated successfully',
        data: {
          campaign: {
            id: campaign.id,
            amountCollected: parseFloat(campaign.amount_collected),
            isComplete: campaign.is_complete,
            updatedAt: campaign.updated_at
          }
        }
      });
    } catch (err) {
      console.error('Error updating campaign amount:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update campaign amount'
      });
    }
  },
  
  /**
   * Mark campaign as complete
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async markCampaignComplete(req, res) {
    try {
      const { id } = req.params;
      
      // Check if campaign exists
      const existingCampaign = await Campaign.getCampaignById(id);
      
      if (!existingCampaign) {
        return res.status(404).json({
          status: 'error',
          message: 'Campaign not found'
        });
      }
      
      // Check permission - only NGO owner or admin can update
      if (req.user.id !== existingCampaign.user_id && !req.user.isAdmin) {
        return res.status(403).json({
          status: 'error',
          message: 'You do not have permission to update this campaign'
        });
      }
      
      // Mark as complete
      const campaign = await Campaign.markAsComplete(id);
      
      return res.status(200).json({
        status: 'success',
        message: 'Campaign marked as complete',
        data: {
          campaign: {
            id: campaign.id,
            isComplete: campaign.is_complete,
            updatedAt: campaign.updated_at
          }
        }
      });
    } catch (err) {
      console.error('Error marking campaign as complete:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to mark campaign as complete'
      });
    }
  }
};

module.exports = campaignController; 