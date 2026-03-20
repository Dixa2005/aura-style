const Product = require('../models/Product');
const User = require('../models/User');

// Get all products with filtering and pagination
exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      gender,
      minPrice,
      maxPrice,
      colors,
      sizes,
      sort = '-createdAt',
      search,
      featured,
      trending
    } = req.query;

    const query = {};

    if (category) query.category = category;
    if (gender) query.gender = gender;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (colors) query['colors.name'] = { $in: colors.split(',') };
    if (sizes) query.sizes = { $in: sizes.split(',') };
    if (featured === 'true') query.featured = true;
    if (trending === 'true') query.trending = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured products', error: error.message });
  }
};

// Get trending products
exports.getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ trending: true }).limit(8);
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trending products', error: error.message });
  }
};

// Get categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    const categoryCounts = {};

    for (const cat of categories) {
      categoryCounts[cat] = await Product.countDocuments({ category: cat });
    }

    res.json({ categories, categoryCounts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// Get brands
exports.getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    res.json({ brands });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching brands', error: error.message });
  }
};

// Add review
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    const user = await User.findById(req.user.userId);

    const review = {
      user: user._id,
      name: user.name,
      rating,
      comment
    };

    product.reviews.push(review);

    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = totalRating / product.reviews.length;
    product.numReviews = product.reviews.length;

    await product.save();

    res.json({ message: 'Review added', product });
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
};

// Get product recommendations
exports.getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('viewedProducts.product');

    if (!user.viewedProducts.length) {
      const randomProducts = await Product.aggregate([
        { $sample: { size: 8 } }
      ]);
      return res.json({ recommendations: randomProducts });
    }

    const viewedCategories = new Set();
    const viewedBrands = new Set();

    user.viewedProducts.forEach(v => {
      if (v.product) {
        viewedCategories.add(v.product.category);
        viewedBrands.add(v.product.brand);
      }
    });

    const recommendations = await Product.find({
      $or: [
        { category: { $in: Array.from(viewedCategories) } },
        { brand: { $in: Array.from(viewedBrands) } }
      ],
      _id: { $nin: user.viewedProducts.map(v => v.product._id) }
    }).limit(8);

    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendations', error: error.message });
  }
};

// Get similar products
exports.getSimilarProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    const similarProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);

    res.json({ similarProducts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching similar products', error: error.message });
  }
};

// Get price comparison
exports.getPriceComparison = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    const comparison = {
      auraStyle: {
        price: product.price,
        url: `https://aura-style.com/products/${product._id}`,
        inStock: product.stock > 0
      },
      competitors: product.competitors || []
    };

    res.json({ comparison });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching price comparison', error: error.message });
  }
};
