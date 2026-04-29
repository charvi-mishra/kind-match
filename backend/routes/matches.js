const express = require('express');
const User    = require('../models/User');
const auth    = require('../middleware/auth');

const router = express.Router();

// Scoring algorithm for match compatibility
function calculateCompatibilityScore(currentUser, candidate) {
  let score = 0;

  // PRIORITY 1: Opposite hidden wound (most important)
  if (currentUser.hiddenWound && candidate.hiddenWound) {
    if (currentUser.hiddenWound !== candidate.hiddenWound) score += 40;
  }

  // PRIORITY 2: Opposite visible wound
  if (currentUser.visibleWound && candidate.visibleWound) {
    if (currentUser.visibleWound !== candidate.visibleWound) score += 30;
  }

  // PRIORITY 3: Similar mental disorders
  if (currentUser.mentalDisorders?.length > 0 && candidate.mentalDisorders?.length > 0) {
    const commonDisorders = currentUser.mentalDisorders.filter(d =>
      candidate.mentalDisorders.includes(d)
    );
    const similarityRatio = commonDisorders.length /
      Math.max(currentUser.mentalDisorders.length, candidate.mentalDisorders.length);
    score += similarityRatio * 20;
  }

  // PRIORITY 4: Similar age group
  if (currentUser.age && candidate.age) {
    const ageDiff = Math.abs(currentUser.age - candidate.age);
    if (ageDiff <= 3)      score += 7;
    else if (ageDiff <= 5) score += 5;
    else if (ageDiff <= 8) score += 2;
  }

  // PRIORITY 5: Similar occupation
  if (currentUser.occupation && candidate.occupation) {
    if (currentUser.occupation.toLowerCase() === candidate.occupation.toLowerCase()) {
      score += 3;
    }
  }

  return score;
}

// GET /api/matches/recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!currentUser.gettingToKnowComplete) {
      return res.status(400).json({
        message: 'Please complete your profile first',
        needsProfile: true,
      });
    }

    // Exclude self + already-swiped users
    const excludeIds = [
      currentUser._id,
      ...(currentUser.liked    || []),
      ...(currentUser.disliked || []),
    ];

    const candidates = await User.find({
      _id: { $nin: excludeIds },
      gettingToKnowComplete: true,
    }).select('-password -liked -disliked -matches').limit(50);

    // Score and sort
    const scored = candidates
      .map(candidate => ({
        user:  candidate,
        score: calculateCompatibilityScore(currentUser, candidate),
      }))
      .sort((a, b) => b.score - a.score);

    res.json({
      recommendations: scored.map(s => ({
        ...s.user.toJSON(),
        compatibilityScore: s.score,
      })),
      total: scored.length,
    });
  } catch (error) {
    console.error('recommendations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/matches/my-matches
router.get('/my-matches', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'matches',
      // include photos so the frontend avatar can use them
      'name email country age occupation isUnemployed photos ' +
      'visibleWound hiddenWound identifiesMoreAs parentalScaleResult ' +
      'mentalDisorders socialLinks gettingToKnowComplete'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out nulls — happens if a matched user was deleted
    const validMatches = (user.matches || []).filter(Boolean);

    res.json({ matches: validMatches });
  } catch (error) {
    console.error('my-matches error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
