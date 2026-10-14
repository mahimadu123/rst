const bcrypt = require('bcrypt');
const path = require('path');
const User = require('../models/user');
const ForgotPasswordRequests = require('../models/forgotPasswordRequest');
const passwordService = require('../services/passwordService');

// 1. Handle Forgot Password Request (Generate UUID & URL)
exports.forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const result = await passwordService.generatePasswordResetLink(user);

    return res.status(200).json({ 
      success: true, 
      message: 'Reset link generated successfully.',
      resetUrl: result.resetUrl 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// 2. Verify Request ID and Serve Reset Password HTML Page
exports.resetpassword = async (req, res) => {
  try {
    const id = req.params.id;
    const forgotPasswordRequest = await ForgotPasswordRequests.findOne({ where: { id } });

    if (!forgotPasswordRequest) {
      return res.status(400).send('Invalid request URL.');
    }

    if (!forgotPasswordRequest.isActive) {
      return res.status(400).send('This password reset link has already been used.');
    }

    // Serve the static HTML page from the public directory
    return res.sendFile(path.join(__dirname, '../public/resetpassword.html'));
  } catch (err) {
    console.error(err);
    return res.status(500).send('Something went wrong.');
  }
};

// 3. Update Password, Encrypt, and Inactivate Request UUID
exports.updatePassword = async (req, res) => {
  try {
    const { newpassword } = req.body;
    const { id } = req.params;

    const forgotPasswordRequest = await ForgotPasswordRequests.findOne({ where: { id } });
    if (!forgotPasswordRequest || !forgotPasswordRequest.isActive) {
      return res.status(400).json({ success: false, message: 'Link is invalid or expired.' });
    }

    const user = await User.findByPk(forgotPasswordRequest.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Encrypt the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newpassword, saltRounds);

    // Update user password and mark the reset request inactive (isActive = false)
    await user.update({ password: hashedPassword });
    await forgotPasswordRequest.update({ isActive: false });

    return res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};