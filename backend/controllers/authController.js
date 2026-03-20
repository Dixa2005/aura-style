const User = require('../models/User');
const Product = require('../models/Product');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'aura_style_secret_key_2024';

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, gender, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      gender,
      phone
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        gender: user.gender
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        gender: user.gender
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('wishlist.product')
      .populate('orders')
      .populate('tryOnHistory.product');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, gender, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, phone, gender, avatar },
      { new: true }
    );

    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user.userId);

    const exists = user.wishlist.find(item => item.product.toString() === productId);
    if (exists) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    user.wishlist.push({ product: productId });
    await user.save();

    res.json({ message: 'Added to wishlist', wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user.userId);

    user.wishlist = user.wishlist.filter(item => item.product.toString() !== productId);
    await user.save();

    res.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from wishlist', error: error.message });
  }
};

// Get wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('wishlist.product');
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
  }
};

// Add to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;
    const user = await User.findById(req.user.userId);

    const existingItem = user.cart.find(
      item => item.product.toString() === productId && item.size === size && item.color === color
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity, size, color });
    }

    await user.save();
    await user.populate('cart.product');

    res.json({ message: 'Added to cart', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
};

// Update cart item
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity, size, color } = req.body;
    const user = await User.findById(req.user.userId);

    const item = user.cart.find(
      cartItem => cartItem.product.toString() === productId &&
                  cartItem.size === size &&
                  cartItem.color === color
    );

    if (item) {
      item.quantity = quantity;
      await user.save();
    }

    await user.populate('cart.product');

    res.json({ message: 'Cart updated', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart', error: error.message });
  }
};

// Remove from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId, size, color } = req.body;
    const user = await User.findById(req.user.userId);

    user.cart = user.cart.filter(
      item => !(item.product.toString() === productId && item.size === size && item.color === color)
    );

    await user.save();
    await user.populate('cart.product');

    res.json({ message: 'Removed from cart', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart', error: error.message });
  }
};

// Get cart
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('cart.product');
    res.json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.cart = [];
    await user.save();
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
};

// Track product view for recommendations
exports.trackProductView = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user.userId);

    user.viewedProducts = user.viewedProducts.filter(v => v.product.toString() !== productId);
    user.viewedProducts.unshift({ product: productId });

    if (user.viewedProducts.length > 20) {
      user.viewedProducts = user.viewedProducts.slice(0, 20);
    }

    await user.save();
    res.json({ message: 'Product view tracked' });
  } catch (error) {
    res.status(500).json({ message: 'Error tracking product view', error: error.message });
  }
};
