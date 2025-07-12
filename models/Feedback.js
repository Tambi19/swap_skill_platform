const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  swapRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'SwapRequest', required: true },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
