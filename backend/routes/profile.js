const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// PUT /api/profile/getting-to-know
router.put('/getting-to-know', auth, async (req, res) => {
  try {
    const { parentalScaleResult, mentalDisorders } = req.body;

    if (parentalScaleResult === undefined || parentalScaleResult === null) {
      return res.status(400).json({ message: 'Parental scale result is required' });
    }

    const user = await User.findById(req.user._id);

    user.parentalScaleResult = parentalScaleResult;
    user.mentalDisorders = mentalDisorders || [];
    user.gettingToKnowComplete = true;

    // Calculate wound types
    user.calculateWounds();

    await user.save();

    res.json({
      message: 'Profile updated!',
      user: {
        _id: user._id,
        parentalScaleResult: user.parentalScaleResult,
        identifiesMoreAs: user.identifiesMoreAs,
        visibleWound: user.visibleWound,
        hiddenWound: user.hiddenWound,
        mentalDisorders: user.mentalDisorders,
        gettingToKnowComplete: user.gettingToKnowComplete
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/profile/update
router.put('/update', auth, async (req, res) => {
  try {
    const { bio, age, dateOfBirth, photos } = req.body;

    const user = await User.findById(req.user._id);

    if (bio !== undefined) user.bio = bio;
    if (age !== undefined) user.age = age;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (photos !== undefined) user.photos = photos;

    if (user.gettingToKnowComplete) {
      user.profileComplete = true;
    }

    await user.save();

    res.json({ message: 'Profile updated!', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/profile/disorders-list
router.get('/disorders-list', (req, res) => {
  const { MENTAL_DISORDERS } = require('../models/User');
  res.json({ disorders: MENTAL_DISORDERS });
});

module.exports = router;
