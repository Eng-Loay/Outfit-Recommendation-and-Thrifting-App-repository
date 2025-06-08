const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController.js');

// Authentication routes
router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.post('/logout', auth.logout);
router.post('/forgot-password', auth.sendOtp);
router.post('/reset-password', auth.resetPassword);

// Test route to confirm session is working
router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  res.status(200).json({ message: 'Logged in user', user: req.session.user });
});

module.exports = router;
