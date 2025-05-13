const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

/**
 * User Controller
 */
const userController = {
  /**
   * Register a new user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async register(req, res) {
    try {
      const { name, email, password, isNgo } = req.body;
      
      // Validate input
      if (!name || !email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Please provide name, email, and password'
        });
      }
      
      // Check if email already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'Email already registered'
        });
      }
      
      // Create user
      const user = await User.createUser({
        name,
        email,
        password,
        isNgo: !!isNgo,
        isAdmin: false
      });
      
      // Create user profile
      await User.updateUserProfile(user.id, {
        profilePicture: null,
        bio: null,
        address: null,
        phone: null,
        preferences: null
      });
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          isNgo: user.is_ngo,
          isAdmin: user.is_admin
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY || '24h' }
      );
      
      // Return user data and token
      return res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isNgo: user.is_ngo,
            createdAt: user.created_at
          },
          token
        }
      });
    } catch (err) {
      console.error('Registration error:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to register user'
      });
    }
  },
  
  /**
   * Login user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Please provide email and password'
        });
      }
      
      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid email or password'
        });
      }
      
      // Verify password
      const isValidPassword = await User.verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid email or password'
        });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          isNgo: user.is_ngo,
          isAdmin: user.is_admin
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY || '24h' }
      );
      
      // Return user data and token
      return res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isNgo: user.is_ngo,
            isAdmin: user.is_admin
          },
          token
        }
      });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to login'
      });
    }
  },
  
  /**
   * Get current user profile
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      
      // Get user profile
      const profile = await User.getUserProfile(userId);
      if (!profile) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }
      
      // Return profile data
      return res.status(200).json({
        status: 'success',
        data: {
          profile: {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            isNgo: profile.is_ngo,
            isAdmin: profile.is_admin,
            profilePicture: profile.profile_picture,
            bio: profile.bio,
            address: profile.address,
            phone: profile.phone,
            preferences: profile.preferences,
            createdAt: profile.created_at
          }
        }
      });
    } catch (err) {
      console.error('Get profile error:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to get user profile'
      });
    }
  },
  
  /**
   * Update user profile
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { name, email, profilePicture, bio, address, phone, preferences } = req.body;
      
      // Update basic user info if provided
      if (name || email) {
        await User.updateUser(userId, {
          name: name || undefined,
          email: email || undefined
        });
      }
      
      // Update profile details if any provided
      if (profilePicture || bio || address || phone || preferences) {
        await User.updateUserProfile(userId, {
          profilePicture,
          bio,
          address,
          phone,
          preferences
        });
      }
      
      // Get updated profile
      const updatedProfile = await User.getUserProfile(userId);
      
      // Return updated profile
      return res.status(200).json({
        status: 'success',
        message: 'Profile updated successfully',
        data: {
          profile: {
            id: updatedProfile.id,
            name: updatedProfile.name,
            email: updatedProfile.email,
            isNgo: updatedProfile.is_ngo,
            isAdmin: updatedProfile.is_admin,
            profilePicture: updatedProfile.profile_picture,
            bio: updatedProfile.bio,
            address: updatedProfile.address,
            phone: updatedProfile.phone,
            preferences: updatedProfile.preferences,
            updatedAt: updatedProfile.updated_at
          }
        }
      });
    } catch (err) {
      console.error('Update profile error:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update profile'
      });
    }
  },
  
  /**
   * Change user password
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;
      
      // Validate input
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          status: 'error',
          message: 'Current password and new password are required'
        });
      }
      
      // Get user with password hash
      const user = await User.findByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }
      
      // Verify current password
      const isValidPassword = await User.verifyPassword(currentPassword, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          status: 'error',
          message: 'Current password is incorrect'
        });
      }
      
      // Update password
      await User.changePassword(userId, newPassword);
      
      return res.status(200).json({
        status: 'success',
        message: 'Password changed successfully'
      });
    } catch (err) {
      console.error('Change password error:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to change password'
      });
    }
  }
};

module.exports = userController; 