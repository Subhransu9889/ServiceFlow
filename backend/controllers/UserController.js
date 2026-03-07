const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    });

    let providerProfileData = null;
    // if provider, create a provider record linked to user
    if (role === 'provider') {
      const {
        category, // a string name provided by frontend
        city,
        bio,
        pricing,
        profileImage,
      } = req.body;

      // basic validation
      if (!category || !city || !pricing) {
        return res.status(400).json({ message: 'Provider must supply category, city and pricing' });
      }

      const Category = require('../models/Category');
      const Provider = require('../models/Provider');

      // find or create category document
      let categoryDoc = await Category.findOne({ name: category.trim() });
      if (!categoryDoc) {
        categoryDoc = await Category.create({ name: category.trim() });
      }

      const priceNum = Number(pricing);

      const createdProfile = await Provider.create({
        userId: user._id,
        categoryId: categoryDoc._id,
        city,
        bio,
        pricing: priceNum,
        profileImage,
      });

      providerProfileData = {
        category: categoryDoc.name,
        city: createdProfile.city,
        bio: createdProfile.bio,
        pricing: createdProfile.pricing,
        profileImage: createdProfile.profileImage,
        isAvailable: createdProfile.isAvailable,
        isApproved: createdProfile.isApproved,
      };
    }

    const responseUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    if (providerProfileData) {
      responseUser.providerProfile = providerProfileData;
    }

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user),
      user: responseUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // if provider, fetch profile details
    let responseUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    if (user.role === 'provider') {
      const Provider = require('../models/Provider');
      const profile = await Provider.findOne({ userId: user._id }).populate('categoryId', 'name');
      if (profile) {
        responseUser.providerProfile = {
          category: profile.categoryId ? profile.categoryId.name : undefined,
          city: profile.city,
          bio: profile.bio,
          pricing: profile.pricing,
          profileImage: profile.profileImage,
          isAvailable: profile.isAvailable,
          isApproved: profile.isApproved,
        };
      }
    }

    res.json({
      message: "Login successful",
      token: generateToken(user),
      user: responseUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin only: list users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
