const db = require('../db');

/**
 * NGO model for database operations
 */
const NGO = {
  /**
   * Register a new NGO
   * @param {Object} ngoData - NGO data
   * @returns {Promise<Object>} - Created NGO object
   */
  async registerNGO(ngoData) {
    const {
      userId,
      name,
      description,
      logoUrl,
      website,
      registrationNumber,
      ethereumAddress,
      solanaAddress
    } = ngoData;
    
    const query = `
      INSERT INTO ngos (
        user_id, name, description, logo_url, website, 
        registration_number, ethereum_address, solana_address, 
        verification_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const values = [
      userId,
      name,
      description,
      logoUrl || null,
      website || null,
      registrationNumber || null,
      ethereumAddress || null,
      solanaAddress || null,
      'pending' // verification status
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  },
  
  /**
   * Get all NGOs
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} - List of NGOs
   */
  async getAllNGOs(filters = {}) {
    let query = `
      SELECT n.*, u.name as user_name, u.email as user_email
      FROM ngos n
      JOIN users u ON n.user_id = u.id
    `;
    
    const queryParams = [];
    const conditions = [];
    
    // Add filter conditions if provided
    if (filters.verificationStatus) {
      conditions.push(`n.verification_status = $${queryParams.length + 1}`);
      queryParams.push(filters.verificationStatus);
    }
    
    if (filters.userId) {
      conditions.push(`n.user_id = $${queryParams.length + 1}`);
      queryParams.push(filters.userId);
    }
    
    // Add WHERE clause if conditions exist
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    // Add order by
    query += ` ORDER BY n.name ASC`;
    
    const result = await db.query(query, queryParams);
    return result.rows;
  },
  
  /**
   * Get NGO by ID
   * @param {number} id - NGO ID
   * @returns {Promise<Object>} - NGO details
   */
  async getNgoById(id) {
    const query = `
      SELECT n.*, u.name as user_name, u.email as user_email
      FROM ngos n
      JOIN users u ON n.user_id = u.id
      WHERE n.id = $1
    `;
    
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  },
  
  /**
   * Get NGO by user ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} - NGO details
   */
  async getNgoByUserId(userId) {
    const query = `
      SELECT n.*, u.name as user_name, u.email as user_email
      FROM ngos n
      JOIN users u ON n.user_id = u.id
      WHERE n.user_id = $1
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows[0] || null;
  },
  
  /**
   * Update NGO
   * @param {number} id - NGO ID
   * @param {Object} ngoData - NGO data to update
   * @returns {Promise<Object>} - Updated NGO object
   */
  async updateNGO(id, ngoData) {
    const {
      name,
      description,
      logoUrl,
      website,
      registrationNumber,
      ethereumAddress,
      solanaAddress
    } = ngoData;
    
    // Build dynamic query for only updating provided fields
    let updateFields = [];
    let values = [];
    let paramCount = 1;
    
    if (name !== undefined) {
      updateFields.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }
    
    if (description !== undefined) {
      updateFields.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }
    
    if (logoUrl !== undefined) {
      updateFields.push(`logo_url = $${paramCount}`);
      values.push(logoUrl);
      paramCount++;
    }
    
    if (website !== undefined) {
      updateFields.push(`website = $${paramCount}`);
      values.push(website);
      paramCount++;
    }
    
    if (registrationNumber !== undefined) {
      updateFields.push(`registration_number = $${paramCount}`);
      values.push(registrationNumber);
      paramCount++;
    }
    
    if (ethereumAddress !== undefined) {
      updateFields.push(`ethereum_address = $${paramCount}`);
      values.push(ethereumAddress);
      paramCount++;
    }
    
    if (solanaAddress !== undefined) {
      updateFields.push(`solana_address = $${paramCount}`);
      values.push(solanaAddress);
      paramCount++;
    }
    
    // Add updated_at timestamp
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    
    // Add NGO ID to values array
    values.push(id);
    
    const query = `
      UPDATE ngos
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    return result.rows[0];
  },
  
  /**
   * Verify an NGO
   * @param {number} id - NGO ID
   * @returns {Promise<Object>} - Updated NGO object
   */
  async verifyNGO(id) {
    const query = `
      UPDATE ngos
      SET verification_status = 'verified',
          verified_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await db.query(query, [id]);
    return result.rows[0];
  },
  
  /**
   * Reject an NGO verification
   * @param {number} id - NGO ID
   * @returns {Promise<Object>} - Updated NGO object
   */
  async rejectNGO(id) {
    const query = `
      UPDATE ngos
      SET verification_status = 'rejected',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await db.query(query, [id]);
    return result.rows[0];
  },
  
  /**
   * Get NGO campaigns
   * @param {number} ngoId - NGO ID
   * @returns {Promise<Array>} - List of campaigns
   */
  async getNGOCampaigns(ngoId) {
    const query = `
      SELECT *
      FROM campaigns
      WHERE ngo_id = $1
      ORDER BY created_at DESC
    `;
    
    const result = await db.query(query, [ngoId]);
    return result.rows;
  },
  
  /**
   * Get NGO total donations
   * @param {number} ngoId - NGO ID
   * @returns {Promise<Object>} - Donation statistics
   */
  async getNGODonationStats(ngoId) {
    // Get blockchain donations
    const blockchainQuery = `
      SELECT 
        SUM(d.amount) as total_amount,
        COUNT(d.id) as donation_count
      FROM donations d
      JOIN campaigns c ON d.campaign_id = c.id
      WHERE c.ngo_id = $1 AND d.donation_status = 'completed'
    `;
    
    // Get regular donations
    const regularQuery = `
      SELECT 
        SUM(amount) as total_amount,
        COUNT(id) as donation_count
      FROM regular_donations
      WHERE ngo_id = $1 AND donation_status = 'completed'
    `;
    
    const blockchainResult = await db.query(blockchainQuery, [ngoId]);
    const regularResult = await db.query(regularQuery, [ngoId]);
    
    const blockchainStats = blockchainResult.rows[0] || { total_amount: 0, donation_count: 0 };
    const regularStats = regularResult.rows[0] || { total_amount: 0, donation_count: 0 };
    
    return {
      totalBlockchainAmount: parseFloat(blockchainStats.total_amount || 0),
      blockchainDonationCount: parseInt(blockchainStats.donation_count || 0),
      totalRegularAmount: parseFloat(regularStats.total_amount || 0),
      regularDonationCount: parseInt(regularStats.donation_count || 0),
      totalAmount: parseFloat(blockchainStats.total_amount || 0) + parseFloat(regularStats.total_amount || 0),
      totalDonationCount: parseInt(blockchainStats.donation_count || 0) + parseInt(regularStats.donation_count || 0)
    };
  }
};

module.exports = NGO; 