const mongoose = require('mongoose');

const tryOnResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  userImage: {
    type: String,
    required: true
  },
  resultImage: {
    type: String,
    required: true
  },
  method: {
    type: String,
    enum: ['upload', 'camera'],
    default: 'upload'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TryOnResult', tryOnResultSchema);
