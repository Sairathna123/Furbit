const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    name: String,
    pet: String
  },
  title: String,
  content: String,
  tags: [String],
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
