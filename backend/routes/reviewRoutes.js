const express = require('express');
const {
  createReview,
  getProviderReviews,
  getAllReviews,
  deleteReview
} = require('../controllers/ReviewController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.use(authenticate);
router.post('/', createReview);
router.get('/provider/:providerId', getProviderReviews);

// Admin only
router.get('/admin/all', authorize('admin'), getAllReviews);
router.delete('/:id', authorize('admin'), deleteReview);

module.exports = router;