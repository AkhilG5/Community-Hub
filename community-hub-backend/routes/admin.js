const express = require('express');
const router = express.Router();
const auth = require('../middleware/Auth');
const isAdmin = require('../middleware/admin');
const User = require('../models/User');

router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    const topUsers = await User.find().sort({ points: -1 }).limit(5).select('name email points');
    res.json({ topUsers });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});


router.get('/stats', verifyToken, async (req, res) => {
    try {
      const topUsers = await User.find().sort({ points: -1 }).limit(5).select('name email points');
      res.json({ topUsers });
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });


  // Admin-only route (add role check if needed)
router.get('/stats', authenticate, async (req, res) => {
    try {
      const reported = await Content.find({ reports: { $exists: true, $ne: [] } });
      const topSaved = await Content.find().sort({ savedCount: -1 }).limit(5);
      const activeUsers = await User.find().sort({ points: -1 }).limit(5);
  
      res.json({
        reportedContent: reported,
        topSavedContent: topSaved,
        topUsers: activeUsers
      });
    } catch (err) {
      console.error('Admin stats error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
module.exports = router;
