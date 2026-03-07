const Review = require('../models/Reviews');
const Booking = require('../models/Booking');

// Create a review (customer only, for completed bookings)
exports.createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const customerId = req.user.id;

    // Check if booking exists and is completed
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.customerId.toString() !== customerId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (booking.status !== 'Completed') {
      return res.status(400).json({ message: 'Can only review completed bookings' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists for this booking' });
    }

    const review = await Review.create({
      bookingId,
      customerId,
      providerId: booking.providerId,
      rating: Number(rating),
      comment
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews for a provider
exports.getProviderReviews = async (req, res) => {
  try {
    const { providerId } = req.params;

    const reviews = await Review.find({ providerId })
      .populate('customerId', 'name')
      .populate({
        path: 'bookingId',
        populate: { path: 'categoryId', select: 'name' },
        select: 'status categoryId'
      })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews (admin only)
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('customerId', 'name')
      .populate('providerId', 'userId')
      .populate({
        path: 'bookingId',
        populate: { path: 'categoryId', select: 'name' },
        select: 'status categoryId'
      })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete review (admin only)
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
