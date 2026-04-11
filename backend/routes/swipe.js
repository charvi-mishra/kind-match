const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/swipe/like
router.post('/like', auth, async (req, res) => {
  try {
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ message: 'Target user ID required' });
    }

    const currentUser = await User.findById(req.user._id);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add to liked list
    if (!currentUser.liked.includes(targetUserId)) {
      currentUser.liked.push(targetUserId);
    }

    // Check if it's a mutual match
    const isMutualMatch = targetUser.liked.includes(currentUser._id);
    
    if (isMutualMatch) {
      // Add to each other's matches
      if (!currentUser.matches.includes(targetUserId)) {
        currentUser.matches.push(targetUserId);
      }
      if (!targetUser.matches.includes(currentUser._id)) {
        targetUser.matches.push(currentUser._id);
      }
      await targetUser.save();
    }

    await currentUser.save();

    res.json({
      message: isMutualMatch ? "It's a KindMatch! 💚" : 'Liked!',
      isMatch: isMutualMatch,
      matchedUser: isMutualMatch ? {
        _id: targetUser._id,
        name: targetUser.name,
        photos: targetUser.photos
      } : null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/swipe/dislike
router.post('/dislike', auth, async (req, res) => {
  try {
    const { targetUserId } = req.body;

    const currentUser = await User.findById(req.user._id);

    if (!currentUser.disliked.includes(targetUserId)) {
      currentUser.disliked.push(targetUserId);
    }

    await currentUser.save();

    res.json({ message: 'Passed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
