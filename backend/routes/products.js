const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/trending', productController.getTrendingProducts);
router.get('/categories', productController.getCategories);
router.get('/brands', productController.getBrands);
router.get('/:id', productController.getProduct);
router.get('/:id/similar', productController.getSimilarProducts);
router.get('/:id/compare', productController.getPriceComparison);

// Protected routes
router.post('/:id/reviews', authMiddleware, productController.addReview);
router.get('/recommendations', authMiddleware, productController.getRecommendations);

module.exports = router;
