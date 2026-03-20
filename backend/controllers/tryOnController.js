const TryOnResult = require('../models/TryOnResult');
const User = require('../models/User');
const Product = require('../models/Product');

// Save try-on result
exports.saveTryOnResult = async (req, res) => {
  try {
    const { productId, userImage, resultImage, method } = req.body;

    const tryOnResult = new TryOnResult({
      user: req.user.userId,
      product: productId,
      userImage,
      resultImage,
      method: method || 'upload'
    });

    await tryOnResult.save();

    const user = await User.findById(req.user.userId);
    user.tryOnHistory.push({
      product: productId,
      imageUrl: resultImage
    });
    await user.save();

    res.status(201).json({ message: 'Try-on result saved', tryOnResult });
  } catch (error) {
    res.status(500).json({ message: 'Error saving try-on result', error: error.message });
  }
};

// Get try-on history
exports.getTryOnHistory = async (req, res) => {
  try {
    const history = await TryOnResult.find({ user: req.user.userId })
      .populate('product')
      .sort('-createdAt');

    res.json({ history });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching try-on history', error: error.message });
  }
};

// Delete try-on result
exports.deleteTryOnResult = async (req, res) => {
  try {
    const result = await TryOnResult.findById(req.params.id);

    if (!result) {
      return res.status(404).json({ message: 'Try-on result not found' });
    }

    if (result.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await TryOnResult.findByIdAndDelete(req.params.id);

    res.json({ message: 'Try-on result deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting try-on result', error: error.message });
  }
};

// Process virtual try-on (simulated)
exports.processTryOn = async (req, res) => {
  try {
    const { productId, userImage, method } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const resultImage = product.tryOnImage || product.images[0];

    const tryOnResult = new TryOnResult({
      user: req.user.userId,
      product: productId,
      userImage,
      resultImage,
      method
    });

    await tryOnResult.save();

    const user = await User.findById(req.user.userId);
    user.tryOnHistory.push({
      product: productId,
      imageUrl: resultImage
    });
    await user.save();

    res.json({
      message: 'Try-on processed',
      result: {
        id: tryOnResult._id,
        userImage,
        resultImage,
        product: {
          id: product._id,
          name: product.name,
          price: product.price
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing try-on', error: error.message });
  }
};
