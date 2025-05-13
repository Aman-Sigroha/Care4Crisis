const db = require('../db');

/**
 * Campaign model for database operations
 */
const Campaign = {
  /**
   * Create a new campaign
   * @param {Object} campaignData - Campaign data
   * @returns {Promise<Object>} - Created campaign object
   */
  async createCampaign(campaignData) {
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
    } = campaignData;
    
    const query = `
      INSERT INTO campaigns (
        ngo_id, title, description, target_amount, deadline, 
        image_url, category, blockchain, contract_address, 
        transaction_hash, on_chain_id, is_complete, amount_collected
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
    
    const values = [
      ngoId,
      title,
      description,
      targetAmount,
      deadline,
      imageUrl || null,
      category || null,
      blockchain,
      contractAddress || null,
      transactionHash || null,
      onChainId || null,
      false, // is_complete
      0 // amount_collected
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  },
  
  /**
   * Get all campaigns
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} - List of campaigns
   */
  async getAllCampaigns(filters = {}) {
    let query = `
      SELECT c.*, n.name as ngo_name, n.logo_url as ngo_logo
      FROM campaigns c
      JOIN ngos n ON c.ngo_id = n.id
    `;
    
    const queryParams = [];
    const conditions = [];
    
    // Add filter conditions if provided
    if (filters.ngoId) {
      conditions.push(`c.ngo_id = $${queryParams.length + 1}`);
      queryParams.push(filters.ngoId);
    }
    
    if (filters.isComplete !== undefined) {
      conditions.push(`c.is_complete = $${queryParams.length + 1}`);
      queryParams.push(filters.isComplete);
    }
    
    if (filters.category) {
      conditions.push(`c.category = $${queryParams.length + 1}`);
      queryParams.push(filters.category);
    }
    
    if (filters.blockchain) {
      conditions.push(`c.blockchain = $${queryParams.length + 1}`);
      queryParams.push(filters.blockchain);
    }
    
    // Add WHERE clause if conditions exist
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    // Add order by
    query += ` ORDER BY c.created_at DESC`;
    
    const result = await db.query(query, queryParams);
    return result.rows;
  },
  
  /**
   * Get campaign by ID
   * @param {number} id - Campaign ID
   * @returns {Promise<Object>} - Campaign details
   */
  async getCampaignById(id) {
    const query = `
      SELECT c.*, n.name as ngo_name, n.logo_url as ngo_logo,
             n.ethereum_address, n.solana_address
      FROM campaigns c
      JOIN ngos n ON c.ngo_id = n.id
      WHERE c.id = $1
    `;
    
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  },
  
  /**
   * Update campaign
   * @param {number} id - Campaign ID
   * @param {Object} campaignData - Campaign data to update
   * @returns {Promise<Object>} - Updated campaign object
   */
  async updateCampaign(id, campaignData) {
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
    } = campaignData;
    
    // Build dynamic query for only updating provided fields
    let updateFields = [];
    let values = [];
    let paramCount = 1;
    
    if (title !== undefined) {
      updateFields.push(`title = $${paramCount}`);
      values.push(title);
      paramCount++;
    }
    
    if (description !== undefined) {
      updateFields.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }
    
    if (targetAmount !== undefined) {
      updateFields.push(`target_amount = $${paramCount}`);
      values.push(targetAmount);
      paramCount++;
    }
    
    if (deadline !== undefined) {
      updateFields.push(`deadline = $${paramCount}`);
      values.push(deadline);
      paramCount++;
    }
    
    if (imageUrl !== undefined) {
      updateFields.push(`image_url = $${paramCount}`);
      values.push(imageUrl);
      paramCount++;
    }
    
    if (category !== undefined) {
      updateFields.push(`category = $${paramCount}`);
      values.push(category);
      paramCount++;
    }
    
    if (contractAddress !== undefined) {
      updateFields.push(`contract_address = $${paramCount}`);
      values.push(contractAddress);
      paramCount++;
    }
    
    if (transactionHash !== undefined) {
      updateFields.push(`transaction_hash = $${paramCount}`);
      values.push(transactionHash);
      paramCount++;
    }
    
    if (onChainId !== undefined) {
      updateFields.push(`on_chain_id = $${paramCount}`);
      values.push(onChainId);
      paramCount++;
    }
    
    if (isComplete !== undefined) {
      updateFields.push(`is_complete = $${paramCount}`);
      values.push(isComplete);
      paramCount++;
    }
    
    if (amountCollected !== undefined) {
      updateFields.push(`amount_collected = $${paramCount}`);
      values.push(amountCollected);
      paramCount++;
    }
    
    // Add updated_at timestamp
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    
    // Add campaign ID to values array
    values.push(id);
    
    const query = `
      UPDATE campaigns
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    return result.rows[0];
  },
  
  /**
   * Delete campaign
   * @param {number} id - Campaign ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteCampaign(id) {
    const query = 'DELETE FROM campaigns WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows.length > 0;
  },
  
  /**
   * Get campaign donations
   * @param {number} campaignId - Campaign ID
   * @returns {Promise<Array>} - List of donations
   */
  async getCampaignDonations(campaignId) {
    const query = `
      SELECT d.*, u.name as donor_name
      FROM donations d
      LEFT JOIN users u ON d.user_id = u.id
      WHERE d.campaign_id = $1
      ORDER BY d.created_at DESC
    `;
    
    const result = await db.query(query, [campaignId]);
    return result.rows;
  },
  
  /**
   * Update campaign amount collected
   * @param {number} campaignId - Campaign ID
   * @param {number} amount - Amount to add to collection
   * @returns {Promise<Object>} - Updated campaign
   */
  async updateAmountCollected(campaignId, amount) {
    const query = `
      UPDATE campaigns
      SET amount_collected = amount_collected + $1,
          is_complete = CASE WHEN amount_collected + $1 >= target_amount THEN true ELSE is_complete END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    
    const result = await db.query(query, [amount, campaignId]);
    return result.rows[0];
  },
  
  /**
   * Mark campaign as complete
   * @param {number} campaignId - Campaign ID
   * @returns {Promise<Object>} - Updated campaign
   */
  async markAsComplete(campaignId) {
    const query = `
      UPDATE campaigns
      SET is_complete = true,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await db.query(query, [campaignId]);
    return result.rows[0];
  },
  
  /**
   * Get campaigns by NGO ID
   * @param {number} ngoId - NGO ID
   * @returns {Promise<Array>} - List of campaigns
   */
  async getCampaignsByNgoId(ngoId) {
    return this.getAllCampaigns({ ngoId });
  }
};

module.exports = Campaign; 