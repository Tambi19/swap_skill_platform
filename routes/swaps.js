const express = require('express');
const router = express.Router();
const SwapRequest = require('../models/SwapRequest');
const auth = require('../middleware/auth');

// Create swap request
router.post('/', auth, async (req, res) => {
  const { toUser, offeredSkill, wantedSkill } = req.body;
  try {
    const swap = new SwapRequest({
      fromUser: req.user.id,
      toUser,
      offeredSkill,
      wantedSkill
    });
    await swap.save();
    res.json(swap);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get current and pending swap requests for user
router.get('/', auth, async (req, res) => {
  try {
    const swaps = await SwapRequest.find({
      $or: [{ fromUser: req.user.id }, { toUser: req.user.id }]
    }).populate('fromUser toUser', 'name');
    res.json(swaps);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Accept or reject swap
router.put('/:id', auth, async (req, res) => {
  const { status } = req.body; // 'accepted' or 'rejected'
  try {
    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) return res.status(404).json({ msg: 'Swap not found' });
    if (swap.toUser.toString() !== req.user.id) return res.status(401).json({ msg: 'Unauthorized' });

    swap.status = status;
    await swap.save();
    res.json(swap);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete swap request (if not accepted)
router.delete('/:id', auth, async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) return res.status(404).json({ msg: 'Swap not found' });
    if (swap.fromUser.toString() !== req.user.id) return res.status(401).json({ msg: 'Unauthorized' });
    if (swap.status === 'accepted') return res.status(400).json({ msg: 'Cannot delete accepted swap' });

    await swap.remove();
    res.json({ msg: 'Swap deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;