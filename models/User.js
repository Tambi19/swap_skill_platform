const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  profilePhoto: String,
  isPublic: { type: Boolean, default: true },
  availability: [String],
  skillsOffered: [String],
  skillsWanted: [String],
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);


