const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['tops', 'bottoms', 'dresses', 'outerwear', 'accessories', 'shoes', 'activewear', 'ethnic'],
    index: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'unisex'],
    index: true
  },
  sizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free']
  }],
  colors: [{
    name: String,
    hex: String,
    image: String
  }],
  brand: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    rating: {
      type: Number,
      min: 0,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  featured: {
    type: Boolean,
    default: false
  },
  trending: {
    type: Boolean,
    default: false
  },
  tags: [String],
  priceHistory: [{
    price: Number,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  competitors: [{
    name: String,
    url: String,
    price: Number
  }],
  tryOnImage: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ category: 1, gender: 1, price: 1 });

module.exports = mongoose.model('Product', productSchema);
