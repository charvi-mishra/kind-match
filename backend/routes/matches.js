const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Scoring algorithm for match compatibility
function calculateCompatibilityScore(currentUser, candidate) {
  let score = 0;

  // PRIORITY 1: Opposite hidden wound (most important)
  if (currentUser.hiddenWound && candidate.visibleWound) {
    if (currentUser.hiddenWound !== candidate.hiddenWound) {
      score += 40; // Opposite hidden wound
    }
  }

  // PRIORITY 2: Opposite visible wound
  if (currentUser.visibleWound && candidate.hiddenWound) {
    if (currentUser.visibleWound !== candidate.visibleWound) {
      score += 30; // Opposite visible wound
    }
  }

  // PRIORITY 3: Similar mental disorders
  if (currentUser.mentalDisorders?.length > 0 && candidate.mentalDisorders?.length > 0) {
    const commonDisorders = currentUser.mentalDisorders.filter(d =>
      candidate.mentalDisorders.includes(d)
    );
    const similarityRatio = commonDisorders.length / Math.max(currentUser.mentalDisorders.length, candidate.mentalDisorders.length);
    score += similarityRatio * 20;
  }

  // PRIORITY 4: Similar age group (within 5 years)
  if (currentUser.age && candidate.age) {
    const ageDiff = Math.abs(currentUser.age - candidate.age);
    if (ageDiff <= 3) score += 7;
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

    if (!currentUser.gettingToKnowComplete) {
      return res.status(400).json({
        message: 'Please complete your profile first',
        needsProfile: true
      });
    }

    // Get users not yet swiped
    const excludeIds = [
      currentUser._id,
      ...(currentUser.liked || []),
      ...(currentUser.disliked || []),
      ...(currentUser.matches || [])
    ];

    const candidates = await User.find({
      _id: { $nin: excludeIds },
      gettingToKnowComplete: true
    }).select('-password').limit(50);

    // Score and sort candidates
    const scored = candidates.map(candidate => ({
      user: candidate,
      score: calculateCompatibilityScore(currentUser, candidate)
    }));

    scored.sort((a, b) => b.score - a.score);

    res.json({
      recommendations: scored.map(s => ({
        ...s.user.toJSON(),
        compatibilityScore: s.score
      })),
      total: scored.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/matches/my-matches
router.get('/my-matches', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('matches', '-password -liked -disliked -matches');

    res.json({ matches: user.matches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
