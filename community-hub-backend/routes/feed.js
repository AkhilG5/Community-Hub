const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/Auth');
const User = require('../models/User');

const sampleFeeds = [
  {
    id: '1',
    title: '10 Tips to Ace Your Next Interview',
    preview: 'A quick guide to mastering technical interviews...',
    source: 'LinkedIn',
    url: 'https://linkedin.com/some-post'
  },
  {
    id: '2',
    title: 'Top 5 JavaScript Tricks',
    preview: 'Learn how to write cleaner JS with these 5 tips...',
    source: 'Twitter',
    url: 'https://twitter.com/some-post'
  },
  {
    id: '3',
    title: 'Redditors Share Their Best Learning Resources',
    preview: 'Compilation of top books, websites, and tutorials...',
    source: 'Reddit',
    url: 'https://reddit.com/r/learnprogramming'
  }
];

// Fetch the feed
router.get('/', async (req, res) => {
  try {
    res.json(sampleFeeds);
  } catch (err) {
    console.error('Feed fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch feeds' });
  }
});

// Save content
router.post('/save', authenticate, async (req, res) => {
  const { contentId } = req.body;
  const userId = req.user.id;

  try {
    await User.findByIdAndUpdate(userId, {
      $addToSet: { savedContent: contentId }
    });
    res.json({ message: 'Content saved' });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ message: 'Failed to save content' });
  }
});

// Report content
router.post('/report', authenticate, async (req, res) => {
  const { contentId } = req.body;

  try {
    // Save to a database collection in real setup
    console.log(`Reported content ID: ${contentId}`);
    res.json({ message: 'Content reported for review' });
  } catch (err) {
    console.error('Report error:', err);
    res.status(500).json({ message: 'Failed to report content' });
  }
});

// Share content (simple track)
router.post('/share', authenticate, async (req, res) => {
  const { contentId } = req.body;
  try {
    console.log(`User ${req.user.id} shared content: ${contentId}`);
    res.json({ message: 'Content shared!' });
  } catch (err) {
    console.error('Share error:', err);
    res.status(500).json({ message: 'Failed to share content' });
  }
});

module.exports = router;
