const express = require('express');
const { getAll, create, update, delete: deleteCategory } = require('../controllers/CategoryController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// public
router.get('/', getAll);

// protected - admin only
router.use(authenticate);
router.use(authorize('admin'));
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', deleteCategory);

module.exports = router;
