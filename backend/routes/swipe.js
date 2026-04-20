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

    // Validate ObjectId format before hitting the DB
    if (!targetUserId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Prevent liking yourself
    if (targetUserId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot like yourself' });
    }

    const currentUser = await User.findById(req.user._id);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add to liked list — use string comparison to avoid ObjectId reference equality bug
    const alreadyLiked = currentUser.liked.some(id => id.toString() === targetUserId.toString());
    if (!alreadyLiked) {
      currentUser.liked.push(targetUserId);
    }

    // Check mutual match — compare as strings, not ObjectId references
    const isMutualMatch = targetUser.liked.some(id => id.toString() === currentUser._id.toString());

    if (isMutualMatch) {
      const alreadyMatchedCurrent = currentUser.matches.some(id => id.toString() === targetUserId.toString());
      const alreadyMatchedTarget = targetUser.matches.some(id => id.toString() === currentUser._id.toString());

      if (!alreadyMatchedCurrent) currentUser.matches.push(targetUserId);
      if (!alreadyMatchedTarget) targetUser.matches.push(currentUser._id);

      // Save both atomically — save currentUser first so if targetUser.save() fails,
      // we can detect the inconsistency on next like attempt
      await currentUser.save();
      await targetUser.save();
    } else {
      await currentUser.save();
    }

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

    if (!targetUserId) {
      return res.status(400).json({ message: 'Target user ID required' });
    }

    // Validate ObjectId format
    if (!targetUserId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const currentUser = await User.findById(req.user._id);

    // Add to disliked list — use string comparison to avoid ObjectId reference equality bug
    const alreadyDisliked = currentUser.disliked.some(id => id.toString() === targetUserId.toString());
    if (!alreadyDisliked) {
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
