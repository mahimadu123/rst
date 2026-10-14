const express = require('express');
const path = require('path');
const router = express.Router();
const passwordController = require('../controllers/passwordController');

// GET route to load the browser interface for requesting a reset link
router.get('/forgotpassword', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/forgotpassword.html'));
});

// POST route to process the forgot password request
router.post('/forgotpassword', passwordController.forgotpassword);

// GET route to verify UUID and load the reset form
router.get('/resetpassword/:id', passwordController.resetpassword);

// POST route to submit and update the new password
router.post('/updatepassword/:id', passwordController.updatePassword);

module.exports = router;