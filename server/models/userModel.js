const db = require('../db');
const bcrypt = require('bcrypt');

/**
 * User model for database operations
 */
const User = {
  /**
   * Create a new user
   * @param {Object} userData - User data (name, email, password, isNgo, isAdmin)
   * @returns {Promise<Object>} - Created user object
   */
  async createUser(userData) {
    const { name, email, password, isNgo = false, isAdmin = false } = userData;
    
    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    const query = `
      INSERT INTO users (name, email, password_hash, is_ngo, is_admin)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, is_ngo, is_admin, created_at
    `;
    
    const values = [name, email, passwordHash, isNgo, isAdmin];
    
    const result = await db.query(query, values);
    return result.rows[0];
  },
  
  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object>} - User object or null
   */
  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    
    return result.rows[0] || null;
  },
  
  /**
   * Find user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object>} - User object or null
   */
  async findById(id) {
    const query = 'SELECT id, name, email, is_ngo, is_admin, created_at, updated_at FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    
    return result.rows[0] || null;
  },
  
  /**
   * Update user information
   * @param {number} id - User ID
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} - Updated user object
   */
  async updateUser(id, userData) {
    const { name, email } = userData;
    
    const query = `
      UPDATE users
      SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, name, email, is_ngo, is_admin, created_at, updated_at
    `;
    
    const values = [name, email, id];
    const result = await db.query(query, values);
    
    return result.rows[0];
  },
  
  /**
   * Change user password
   * @param {number} id - User ID
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} - Success status
   */
  async changePassword(id, newPassword) {
    // Hash new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    
    const query = `
      UPDATE users
      SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `;
    
    await db.query(query, [passwordHash, id]);
    return true;
  },
  
  /**
   * Verify user password
   * @param {string} password - Password to verify
   * @param {string} passwordHash - Stored password hash
   * @returns {Promise<boolean>} - Whether password matches
   */
  async verifyPassword(password, passwordHash) {
    return await bcrypt.compare(password, passwordHash);
  },
  
  /**
   * Get user profile
   * @param {number} userId - User ID
   * @returns {Promise<Object>} - User profile data
   */
  async getUserProfile(userId) {
    const query = `
      SELECT u.id, u.name, u.email, u.is_ngo, u.is_admin, u.created_at,
             up.profile_picture, up.bio, up.location, up.phone, up.wallet_address, up.wallet_type
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE u.id = $1
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows[0] || null;
  },
  
  /**
   * Update user profile
   * @param {number} userId - User ID 
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} - Updated profile
   */
  async updateUserProfile(userId, profileData) {
    const { profilePicture, bio, location, phone, walletAddress, walletType } = profileData;
    
    // Check if profile exists
    const checkQuery = 'SELECT id FROM user_profiles WHERE user_id = $1';
    const checkResult = await db.query(checkQuery, [userId]);
    
    let result;
    
    if (checkResult.rows.length === 0) {
      // Create new profile
      const insertQuery = `
        INSERT INTO user_profiles (user_id, profile_picture, bio, location, phone, wallet_address, wallet_type)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      
      result = await db.query(insertQuery, [
        userId, profilePicture, bio, location, phone, walletAddress, walletType
      ]);
    } else {
      // Update existing profile
      const updateQuery = `
        UPDATE user_profiles
        SET profile_picture = $1, bio = $2, location = $3, phone = $4, 
            wallet_address = $5, wallet_type = $6, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $7
        RETURNING *
      `;
      
      result = await db.query(updateQuery, [
        profilePicture, bio, location, phone, walletAddress, walletType, userId
      ]);
    }
    
    return result.rows[0];
  }
};

module.exports = User; 