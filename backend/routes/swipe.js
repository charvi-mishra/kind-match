const express = require('express');
const User    = require('../models/User');
const auth    = require('../middleware/auth');

const router = express.Router();

const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// POST /api/swipe/like
router.post('/like', auth, async (req, res) => {
  try {
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ message: 'Target user ID required' });
    }

    if (!isValidObjectId(targetUserId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (targetUserId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot like yourself' });
    }

    const [currentUser, targetUser] = await Promise.all([
      User.findById(req.user._id),
      User.findById(targetUserId),
    ]);

    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add to liked list (idempotent)
    const alreadyLiked = currentUser.liked.some(
      id => id.toString() === targetUserId.toString()
    );
    if (!alreadyLiked) {
      currentUser.liked.push(targetUserId);
    }

    // Check for mutual match
    const isMutualMatch = targetUser.liked.some(
      id => id.toString() === currentUser._id.toString()
    );

    if (isMutualMatch) {
      const alreadyMatchedCurrent = currentUser.matches.some(
        id => id.toString() === targetUserId.toString()
      );
      const alreadyMatchedTarget = targetUser.matches.some(
        id => id.toString() === currentUser._id.toString()
      );

      if (!alreadyMatchedCurrent) currentUser.matches.push(targetUserId);
      if (!alreadyMatchedTarget)  targetUser.matches.push(currentUser._id);

      await Promise.all([currentUser.save(), targetUser.save()]);
    } else {
      await currentUser.save();
    }

    res.json({
      message:     isMutualMatch ? "It's a KindMatch! 💚" : 'Liked!',
      isMatch:     isMutualMatch,
      matchedUser: isMutualMatch
        ? { _id: targetUser._id, name: targetUser.name, photos: targetUser.photos }
        : null,
    });
  } catch (error) {
    console.error('swipe/like error:', error);
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

    if (!isValidObjectId(targetUserId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add to disliked list (idempotent)
    const alreadyDisliked = currentUser.disliked.some(
      id => id.toString() === targetUserId.toString()
    );
    if (!alreadyDisliked) {
      currentUser.disliked.push(targetUserId);
    }

    await currentUser.save();

    res.json({ message: 'Passed' });
  } catch (error) {
    console.error('swipe/dislike error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
