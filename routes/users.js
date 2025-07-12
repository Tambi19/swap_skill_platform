const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update user profile
router.put('/:id', auth, async (req, res) => {
  if (req.user.id !== req.params.id) return res.status(401).json({ msg: 'Unauthorized' });
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Search users by skill (public only)
router.get('/', async (req, res) => {
  const { skill } = req.query;
  try {
    const users = await User.find({
      isPublic: true,
      $or: [
        { skillsOffered: skill },
        { skillsWanted: skill }
      ]
    }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;