const Provider = require('../models/Provider');
const User = require('../models/User');
const Category = require('../models/Category');

// Get all approved providers (for customers to browse)
exports.getProviders = async (req, res) => {
  try {
    const { category, city } = req.query;

    let query = { isApproved: true, isAvailable: true };

    if (category) {
      const categoryDoc = await Category.findOne({ name: new RegExp(category, 'i') });
      if (categoryDoc) {
        query.categoryId = categoryDoc._id;
      }
    }

    if (city) {
      query.city = new RegExp(city, 'i');
    }

    const providers = await Provider.find(query)
      .populate('userId', 'name email phone')
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });

    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get provider profile
exports.getProviderProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await Provider.findById(id)
      .populate('userId', 'name email phone')
      .populate('categoryId', 'name');

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logged-in provider profile
exports.getMyProviderProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const provider = await Provider.findOne({ userId })
      .populate('userId', 'name email phone')
      .populate('categoryId', 'name');

    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update provider profile (provider only)
exports.updateProviderProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { city, bio, pricing, profileImage, isAvailable } = req.body;

    const provider = await Provider.findOne({ userId });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    if (city !== undefined) provider.city = city;
    if (bio !== undefined) provider.bio = bio;
    if (pricing !== undefined) provider.pricing = Number(pricing);
    if (profileImage !== undefined) provider.profileImage = profileImage;
    if (isAvailable !== undefined) provider.isAvailable = isAvailable;

    await provider.save();

    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all providers (admin only)
exports.getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.find()
      .populate('userId', 'name email phone')
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });

    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve provider (admin only)
exports.approveProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const provider = await Provider.findById(id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    provider.isApproved = isApproved;
    await provider.save();

    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
