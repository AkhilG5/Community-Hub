const express = require('express');
const router = express.Router();
const User = require('../models/user'); // adjust path if needed
// const verifyToken = require('../middleware/verifyToken'); // optional

// Route to get user data
router.get('/:id', /* verifyToken, */ async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      name: user.name,
      email: user.email,
      points: user.points,
      transactions: user.transactions || [],
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
