const express = require('express');
const router = express.Router();
const tryOnController = require('../controllers/tryOnController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/process', tryOnController.processTryOn);
router.get('/history', tryOnController.getTryOnHistory);
router.delete('/:id', tryOnController.deleteTryOnResult);

module.exports = router;
