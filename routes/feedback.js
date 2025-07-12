const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const auth = require('../middleware/auth');

// Leave feedback
router.post('/', auth, async (req, res) => {
  const { swapRequest, toUser, rating, comment } = req.body;
  try {
    const feedback = new Feedback({
      swapRequest,
      fromUser: req.user.id,
      toUser,
      rating,
      comment
    });
    await feedback.save();
    res.json(feedback);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get feedback for a user
router.get('/:userId', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ toUser: req.params.userId }).populate('fromUser', 'name');
    res.json(feedbacks);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;