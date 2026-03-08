const Category = require('../models/Category');
const Provider = require('../models/Provider');
const Booking = require('../models/Booking');

// fetch all categories
exports.getAll = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// create new category (admin only)
exports.create = async (req, res) => {
  try {
    const { name, description } = req.body;
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    const cat = await Category.create({ name: name.trim(), description });
    res.status(201).json(cat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update category (admin only)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name) category.name = name.trim();
    if (description !== undefined) category.description = description;

    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// delete category (admin only)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    // Check for dependencies
    const providerCount = await Provider.countDocuments({ categoryId: id });
    const bookingCount = await Booking.countDocuments({ categoryId: id });

    if (providerCount > 0 || bookingCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category: it is referenced by ' + 
                 (providerCount > 0 ? `${providerCount} provider(s)` : '') + 
                 (providerCount > 0 && bookingCount > 0 ? ' and ' : '') + 
                 (bookingCount > 0 ? `${bookingCount} booking(s)` : '')
      });
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
