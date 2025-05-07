// routes/points.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Earn points
router.post('/earn', async (req, res) => {
  const { email, purpose } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    let earnedPoints = 0;
    if (purpose === 'comment') earnedPoints = 5;
    else if (purpose === 'createPost') earnedPoints = 10;
    else if (purpose === 'answerQuestion') earnedPoints = 15;
    else return res.status(400).json({ message: 'Invalid purpose' });

    user.points += earnedPoints;

    user.transactions.push({
      type: 'earn',
      amount: earnedPoints,
      purpose,
    });

    await user.save();
    res.json({ message: 'Points added', points: user.points });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Spend points
router.post('/spend', async (req, res) => {
  const { email, amount, purpose } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.points < amount) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    user.points -= amount;
    user.transactions.push({
      type: 'spend',
      amount,
      purpose,
    });

    await user.save();
    res.json({ message: 'Points deducted', points: user.points });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// POST /api/points/update
router.post('/update', authenticateToken, async (req, res) => {
  const { amount, purpose } = req.body;
  const userId = req.user.id;

  if (typeof amount !== 'number' || !purpose) {
    return res.status(400).json({ message: 'Amount and purpose required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update points
    user.points += amount;

    // Log transaction
    user.transactions.push({
      amount,
      purpose,
      timestamp: new Date(),
    });

    await user.save();
    res.json({ points: user.points, transactions: user.transactions });
  } catch (err) {
    console.error('Update points error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/update', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const { action, contentId } = req.body;
    let pointsToAdd = 0;
    let actionType = '';

    switch (action) {
      case 'save':
        pointsToAdd = 10;
        actionType = 'Saved content';
        break;
      case 'report':
        pointsToAdd = 5;
        actionType = 'Reported content';
        break;
      case 'share':
        pointsToAdd = 5;
        actionType = 'Shared content';
        break;
      default:
        return res.status(400).json({ message: 'Invalid action type' });
    }

    // Update user points
    user.points += pointsToAdd;

    // Log transaction
    user.transactions.push({
      amount: pointsToAdd,
      purpose: `${actionType} (${contentId})`,
      timestamp: new Date()
    });

    await user.save();

    res.json({ message: 'Points updated', newTotal: user.points });
  } catch (err) {
    console.error('Error updating points:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/spend', auth, async (req, res) => {
  const { amount, purpose } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (user.points < amount) {
      return res.status(400).json({ message: 'Not enough points' });
    }

    user.points -= amount;
    user.transactions.push({
      amount,
      type: 'debit',
      purpose,
      timestamp: new Date()
    });

    await user.save();
    res.json({ message: `${amount} points spent for ${purpose}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error spending points' });
  }
});


module.exports = router;
