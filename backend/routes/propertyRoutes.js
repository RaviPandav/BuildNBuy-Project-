const express = require('express');
const router = express.Router();
const {
  createProperty,
  getProperties,
  getPropertyByIdOrSlug,
  getMyProperties,
  updateProperty,
  deleteProperty,
  adminGetProperties,
  moderateProperty,
} = require('../controllers/propertyController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { uploadPropertyImages } = require('../config/cloudinary');

// Admin moderation (must come before /:idOrSlug)
router.get('/admin/all', protect, authorize('admin'), adminGetProperties);
router.put('/:id/moderate', protect, authorize('admin'), moderateProperty);

router.get('/mine', protect, getMyProperties);

router.route('/')
  .get(optionalAuth, getProperties)
  .post(protect, authorize('customer', 'contractor'), uploadPropertyImages.array('images', 10), createProperty);

router.route('/:id')
  .put(protect, authorize('customer', 'contractor', 'admin'), uploadPropertyImages.array('images', 10), updateProperty)
  .delete(protect, deleteProperty);

router.get('/:idOrSlug', optionalAuth, getPropertyByIdOrSlug);

module.exports = router;
