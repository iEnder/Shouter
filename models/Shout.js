const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const shoutSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author'
  },
  body: {
    type: String,
    maxlength: 280,
    required: 'You must add text to your shout'
  },
  created: {
    type: Date,
    default: Date.now
  },
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  reshouts: {
    type: Number,
    default: 0
  },
  image: String,
  replies: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Shout'
    }
  ],
  replyTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'Shout'
  }
});

module.exports = mongoose.model('Shout', shoutSchema);
