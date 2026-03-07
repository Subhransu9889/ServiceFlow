const express = require('express');
const {
  getProviders,
  getProviderProfile,
  getMyProviderProfile,
  updateProviderProfile,
  getAllProviders,
  approveProvider
} = require('../controllers/ProviderController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getProviders);

// Provider-only routes
router.get('/profile', authenticate, authorize('provider'), getMyProviderProfile);
router.put('/profile', authenticate, authorize('provider'), updateProviderProfile);

// Admin only
router.get('/admin/all', authenticate, authorize('admin'), getAllProviders);
router.put('/:id/approve', authenticate, authorize('admin'), approveProvider);
router.get('/:id', getProviderProfile);

module.exports = router;
