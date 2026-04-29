const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const auth    = require('../middleware/auth');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Shared user shape returned on register / login / me
// Keeps the response consistent across all three endpoints
function userPayload(user) {
  return {
    _id:                   user._id,
    name:                  user.name,
    email:                 user.email,
    country:               user.country,
    occupation:            user.occupation,
    isUnemployed:          user.isUnemployed,
    age:                   user.age,
    bio:                   user.bio,
    photos:                user.photos,
    profileComplete:       user.profileComplete,
    gettingToKnowComplete: user.gettingToKnowComplete,
    parentalScaleResult:   user.parentalScaleResult,
    identifiesMoreAs:      user.identifiesMoreAs,
    visibleWound:          user.visibleWound,
    hiddenWound:           user.hiddenWound,
    mentalDisorders:       user.mentalDisorders,
    socialLinks:           user.socialLinks,
  };
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, country, occupation, isUnemployed, password } = req.body;

    if (!name || !email || !country || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = new User({
      name,
      email,
      country,
      occupation: isUnemployed ? null : occupation,
      isUnemployed: isUnemployed || false,
      password,
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: userPayload(user),
    });
  } catch (error) {
    console.error('register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Welcome back!',
      token,
      user: userPayload(user),
    });
  } catch (error) {
    console.error('login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  // req.user is already fetched by auth middleware (password excluded)
  res.json({ user: userPayload(req.user) });
});

module.exports = router;
