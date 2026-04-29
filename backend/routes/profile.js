const express        = require('express');
const User           = require('../models/User');
const { MENTAL_DISORDERS } = require('../models/User');
const auth           = require('../middleware/auth');

const router = express.Router();

// PUT /api/profile/getting-to-know
router.put('/getting-to-know', auth, async (req, res) => {
  try {
    const { parentalScaleResult, mentalDisorders } = req.body;

    if (parentalScaleResult === undefined || parentalScaleResult === null) {
      return res.status(400).json({ message: 'Parental scale result is required' });
    }

    const scale = Number(parentalScaleResult);
    if (isNaN(scale) || scale < 0 || scale > 100) {
      return res.status(400).json({ message: 'Parental scale result must be between 0 and 100' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.parentalScaleResult  = scale;
    user.mentalDisorders      = mentalDisorders || [];
    user.gettingToKnowComplete = true;

    user.calculateWounds();

    await user.save();

    res.json({
      message: 'Profile updated!',
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('getting-to-know error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/profile/update
router.put('/update', auth, async (req, res) => {
  try {
    const { bio, age, dateOfBirth, photos } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (bio         !== undefined) user.bio         = bio;
    if (age         !== undefined) user.age         = age;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (photos      !== undefined) user.photos      = photos;

    if (user.gettingToKnowComplete) {
      user.profileComplete = true;
    }

    await user.save();

    res.json({ message: 'Profile updated!', user: user.toJSON() });
  } catch (error) {
    console.error('profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/profile/disorders-list
router.get('/disorders-list', (req, res) => {
  res.json({ disorders: MENTAL_DISORDERS });
});

// PUT /api/profile/social-links
router.put('/social-links', auth, async (req, res) => {
  try {
    const { instagram, whatsapp } = req.body;
    const updateFields = {};

    if (instagram !== undefined) {
      // Strip leading @ if user typed it
      const handle = instagram ? instagram.replace(/^@/, '').trim() : null;
      // Allow letters, numbers, dots, underscores — 1 to 30 chars
      if (handle && !/^[a-zA-Z0-9._]{1,30}$/.test(handle)) {
        return res.status(400).json({
          message: 'Invalid Instagram handle — only letters, numbers, dots and underscores allowed (max 30 chars)',
        });
      }
      updateFields['socialLinks.instagram'] = handle || null;
    }

    if (whatsapp !== undefined) {
      // Strip all formatting characters — keep only digits and leading +
      const raw    = whatsapp ? whatsapp.trim() : null;
      const number = raw ? raw.replace(/[\s\-().]/g, '') : null;
      // Accept +<digits> or just digits, 7–15 digits total (after stripping non-digits except leading +)
      if (number && !/^\+?[0-9]{7,15}$/.test(number)) {
        return res.status(400).json({
          message: `Invalid WhatsApp number — use international format e.g. +919876543210 (received: "${number}")`,
        });
      }
      updateFields['socialLinks.whatsapp'] = number || null;
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: false }
    ).select('-password');

    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Social links updated', user: updated });
  } catch (error) {
    console.error('social-links error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
