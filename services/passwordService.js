const { v4: uuidv4 } = require('uuid');
const ForgotPasswordRequests = require('../models/forgotPasswordRequest');

const generatePasswordResetLink = async (user) => {
  try {
    const id = uuidv4(); // Generate UUID string
    
    // Explicitly create the request record in the database using foreign key userId
    await ForgotPasswordRequests.create({
      id: id,
      isActive: true,
      userId: user.id
    });

    const resetUrl = `http://localhost:3000/password/resetpassword/${id}`;
    
    // Log URL to console for testing
    console.log(`\n========================================`);
    console.log(`PASSWORD RESET LINK: ${resetUrl}`);
    console.log(`========================================\n`);

    return { success: true, resetUrl };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  generatePasswordResetLink
};