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

router.put('/social-links', auth, async (req, res) => {
  try {
    const { instagram, whatsapp } = req.body;
    const socialLinks = {};

    if (instagram !== undefined) {
      const handle = instagram ? instagram.replace(/^@/, '').trim() : null;
      if (handle && !/^[a-zA-Z0-9._]{1,30}$/.test(handle)) {
        return res.status(400).json({ message: 'Invalid Instagram handle' });
      }
      socialLinks['socialLinks.instagram'] = handle || null;
    }

    if (whatsapp !== undefined) {
      // Strip spaces, dashes, parentheses — keep only + and digits
      const number = whatsapp ? whatsapp.replace(/[\s\-().]/g, '').trim() : null;
      if (number && !/^\+?[0-9]{7,15}$/.test(number)) {
        return res.status(400).json({ message: 'Invalid WhatsApp number' });
      }
      socialLinks['socialLinks.whatsapp'] = number || null;
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $set: socialLinks },
      { new: true, runValidators: false }
    ).select('-password');

    res.json({ message: 'Social links updated', user: updated });
  } catch (err) {
    console.error('social-links update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
