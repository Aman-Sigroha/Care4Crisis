const NGO = require('../models/ngoModel');
const User = require('../models/userModel');

/**
 * NGO Controller
 */
const ngoController = {
  /**
   * Get all NGOs
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getAllNGOs(req, res) {
    try {
      // Parse query parameters for filtering
      const filters = {};
      
      if (req.query.verificationStatus) {
        filters.verificationStatus = req.query.verificationStatus;
      }
      
      if (req.query.userId) {
        filters.userId = parseInt(req.query.userId);
      }
      
      const ngos = await NGO.getAllNGOs(filters);
      
      // Format response for client
      const formattedNGOs = ngos.map(ngo => ({
        id: ngo.id,
        name: ngo.name,
        description: ngo.description,
        logoUrl: ngo.logo_url,
        website: ngo.website,
        ethereumAddress: ngo.ethereum_address,
        solanaAddress: ngo.solana_address,
        verificationStatus: ngo.verification_status,
        verifiedAt: ngo.verified_at,
        user: {
          id: ngo.user_id,
          name: ngo.user_name,
          email: ngo.user_email
        },
        createdAt: ngo.created_at
      }));
      
      return res.status(200).json({
        status: 'success',
        data: {
          ngos: formattedNGOs
        }
      });
    } catch (err) {
      console.error('Error fetching NGOs:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch NGOs'
      });
    }
  },
  
  /**
   * Get NGO by ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getNGOById(req, res) {
    try {
      const { id } = req.params;
      
      const ngo = await NGO.getNgoById(id);
      
      if (!ngo) {
        return res.status(404).json({
          status: 'error',
          message: 'NGO not found'
        });
      }
      
      // Get NGO campaigns
      const campaigns = await NGO.getNGOCampaigns(id);
      
      // Get donation stats
      const donationStats = await NGO.getNGODonationStats(id);
      
      // Format response for client
      const formattedNGO = {
        id: ngo.id,
        name: ngo.name,
        description: ngo.description,
        logoUrl: ngo.logo_url,
        website: ngo.website,
        registrationNumber: ngo.registration_number,
        ethereumAddress: ngo.ethereum_address,
        solanaAddress: ngo.solana_address,
        verificationStatus: ngo.verification_status,
        verifiedAt: ngo.verified_at,
        user: {
          id: ngo.user_id,
          name: ngo.user_name,
          email: ngo.user_email
        },
        campaigns: campaigns.map(campaign => ({
          id: campaign.id,
          title: campaign.title,
          targetAmount: parseFloat(campaign.target_amount),
          amountCollected: parseFloat(campaign.amount_collected),
          deadline: campaign.deadline,
          isComplete: campaign.is_complete,
          blockchain: campaign.blockchain,
          createdAt: campaign.created_at
        })),
        donationStats,
        createdAt: ngo.created_at,
        updatedAt: ngo.updated_at
      };
      
      return res.status(200).json({
        status: 'success',
        data: {
          ngo: formattedNGO
        }
      });
    } catch (err) {
      console.error('Error fetching NGO details:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch NGO details'
      });
    }
  },
  
  /**
   * Register a new NGO
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async registerNGO(req, res) {
    try {
      const {
        name,
        description,
        logoUrl,
        website,
        registrationNumber,
        ethereumAddress,
        solanaAddress
      } = req.body;
      
      // Get user ID from authenticated user
      const userId = req.user.id;
      
      // Validate required fields
      if (!name || !description) {
        return res.status(400).json({
          status: 'error',
          message: 'Name and description are required'
        });
      }
      
      // Check if user already has an NGO
      const existingNGO = await NGO.getNgoByUserId(userId);
      if (existingNGO) {
        return res.status(400).json({
          status: 'error',
          message: 'User already has a registered NGO'
        });
      }
      
      // Update user to be an NGO
      await User.updateUser(userId, { isNgo: true });
      
      // Register NGO
      const ngo = await NGO.registerNGO({
        userId,
        name,
        description,
        logoUrl,
        website,
        registrationNumber,
        ethereumAddress,
        solanaAddress
      });
      
      return res.status(201).json({
        status: 'success',
        message: 'NGO registration submitted for verification',
        data: {
          ngo: {
            id: ngo.id,
            name: ngo.name,
            description: ngo.description,
            verificationStatus: ngo.verification_status,
            createdAt: ngo.created_at
          }
        }
      });
    } catch (err) {
      console.error('Error registering NGO:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to register NGO'
      });
    }
  },
  
  /**
   * Update NGO
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async updateNGO(req, res) {
    try {
      const { id } = req.params;
      
      // Check if NGO exists
      const existingNGO = await NGO.getNgoById(id);
      
      if (!existingNGO) {
        return res.status(404).json({
          status: 'error',
          message: 'NGO not found'
        });
      }
      
      // Check permission - only owner or admin can update
      if (req.user.id !== existingNGO.user_id && !req.user.isAdmin) {
        return res.status(403).json({
          status: 'error',
          message: 'You do not have permission to update this NGO'
        });
      }
      
      const {
        name,
        description,
        logoUrl,
        website,
        registrationNumber,
        ethereumAddress,
        solanaAddress
      } = req.body;
      
      // Update NGO
      const ngo = await NGO.updateNGO(id, {
        name,
        description,
        logoUrl,
        website,
        registrationNumber,
        ethereumAddress,
        solanaAddress
      });
      
      return res.status(200).json({
        status: 'success',
        message: 'NGO updated successfully',
        data: {
          ngo: {
            id: ngo.id,
            name: ngo.name,
            description: ngo.description,
            logoUrl: ngo.logo_url,
            website: ngo.website,
            registrationNumber: ngo.registration_number,
            ethereumAddress: ngo.ethereum_address,
            solanaAddress: ngo.solana_address,
            verificationStatus: ngo.verification_status,
            updatedAt: ngo.updated_at
          }
        }
      });
    } catch (err) {
      console.error('Error updating NGO:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update NGO'
      });
    }
  },
  
  /**
   * Verify NGO
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async verifyNGO(req, res) {
    try {
      const { id } = req.params;
      
      // Check if NGO exists
      const existingNGO = await NGO.getNgoById(id);
      
      if (!existingNGO) {
        return res.status(404).json({
          status: 'error',
          message: 'NGO not found'
        });
      }
      
      // Only admin can verify NGOs
      if (!req.user.isAdmin) {
        return res.status(403).json({
          status: 'error',
          message: 'Only administrators can verify NGOs'
        });
      }
      
      // Verify NGO
      const ngo = await NGO.verifyNGO(id);
      
      return res.status(200).json({
        status: 'success',
        message: 'NGO verified successfully',
        data: {
          ngo: {
            id: ngo.id,
            name: ngo.name,
            verificationStatus: ngo.verification_status,
            verifiedAt: ngo.verified_at
          }
        }
      });
    } catch (err) {
      console.error('Error verifying NGO:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to verify NGO'
      });
    }
  },
  
  /**
   * Reject NGO verification
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async rejectNGO(req, res) {
    try {
      const { id } = req.params;
      
      // Check if NGO exists
      const existingNGO = await NGO.getNgoById(id);
      
      if (!existingNGO) {
        return res.status(404).json({
          status: 'error',
          message: 'NGO not found'
        });
      }
      
      // Only admin can reject NGOs
      if (!req.user.isAdmin) {
        return res.status(403).json({
          status: 'error',
          message: 'Only administrators can reject NGO applications'
        });
      }
      
      // Reject NGO
      const ngo = await NGO.rejectNGO(id);
      
      return res.status(200).json({
        status: 'success',
        message: 'NGO verification rejected',
        data: {
          ngo: {
            id: ngo.id,
            name: ngo.name,
            verificationStatus: ngo.verification_status
          }
        }
      });
    } catch (err) {
      console.error('Error rejecting NGO verification:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to reject NGO verification'
      });
    }
  },
  
  /**
   * Get current user's NGO
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getCurrentUserNGO(req, res) {
    try {
      const userId = req.user.id;
      
      const ngo = await NGO.getNgoByUserId(userId);
      
      if (!ngo) {
        return res.status(404).json({
          status: 'error',
          message: 'You do not have a registered NGO'
        });
      }
      
      // Get NGO campaigns
      const campaigns = await NGO.getNGOCampaigns(ngo.id);
      
      // Get donation stats
      const donationStats = await NGO.getNGODonationStats(ngo.id);
      
      // Format response for client
      const formattedNGO = {
        id: ngo.id,
        name: ngo.name,
        description: ngo.description,
        logoUrl: ngo.logo_url,
        website: ngo.website,
        registrationNumber: ngo.registration_number,
        ethereumAddress: ngo.ethereum_address,
        solanaAddress: ngo.solana_address,
        verificationStatus: ngo.verification_status,
        verifiedAt: ngo.verified_at,
        campaigns: campaigns.map(campaign => ({
          id: campaign.id,
          title: campaign.title,
          targetAmount: parseFloat(campaign.target_amount),
          amountCollected: parseFloat(campaign.amount_collected),
          deadline: campaign.deadline,
          isComplete: campaign.is_complete,
          blockchain: campaign.blockchain,
          createdAt: campaign.created_at
        })),
        donationStats,
        createdAt: ngo.created_at,
        updatedAt: ngo.updated_at
      };
      
      return res.status(200).json({
        status: 'success',
        data: {
          ngo: formattedNGO
        }
      });
    } catch (err) {
      console.error('Error fetching current user NGO:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch NGO details'
      });
    }
  }
};

module.exports = ngoController; 