const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);

router.get('/wishlist', authMiddleware, authController.getWishlist);
router.post('/wishlist/:productId', authMiddleware, authController.addToWishlist);
router.delete('/wishlist/:productId', authMiddleware, authController.removeFromWishlist);

router.get('/cart', authMiddleware, authController.getCart);
router.post('/cart', authMiddleware, authController.addToCart);
router.put('/cart', authMiddleware, authController.updateCartItem);
router.delete('/cart', authMiddleware, authController.removeFromCart);
router.delete('/cart/clear', authMiddleware, authController.clearCart);

router.post('/track/:productId', authMiddleware, authController.trackProductView);

module.exports = router;
