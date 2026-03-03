const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
    },
    pricing: {
      type: Number,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Provider = mongoose.model('Provider', providerSchema);

module.exports = Provider;
