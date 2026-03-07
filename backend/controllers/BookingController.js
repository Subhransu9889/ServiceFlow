const Booking = require('../models/Booking');
const Provider = require('../models/Provider');

const VALID_STATUSES = ["Requested", "Confirmed", "In-progress", "Completed", "Cancelled"];
const ALLOWED_TRANSITIONS = {
  Requested: ["Confirmed", "Cancelled"],
  Confirmed: ["In-progress", "Cancelled"],
  "In-progress": ["Completed", "Cancelled"],
  Completed: [],
  Cancelled: [],
};

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { providerId, categoryId, address, scheduledAt, notes, priceAtBooking, requestImages = [] } = req.body;
    const customerId = req.user.id;

    // Validate provider exists and is available
    const provider = await Provider.findById(providerId);
    if (!provider || !provider.isAvailable || !provider.isApproved) {
      return res.status(400).json({ message: 'Provider not available' });
    }

    if (Number.isNaN(new Date(scheduledAt).getTime())) {
      return res.status(400).json({ message: 'Invalid schedule date/time' });
    }

    if (Number(priceAtBooking) < 0) {
      return res.status(400).json({ message: 'Invalid booking price' });
    }

    const booking = await Booking.create({
      customerId,
      providerId,
      categoryId,
      address,
      scheduledAt: new Date(scheduledAt),
      notes,
      requestImages: Array.isArray(requestImages) ? requestImages : [],
      priceAtBooking,
      status: 'Requested'
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get bookings for customer or provider
exports.getBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    let query = {};

    if (userRole === 'customer') {
      query.customerId = userId;
    } else if (userRole === 'provider') {
      // Find provider profile first
      const provider = await Provider.findOne({ userId });
      if (!provider) {
        return res.status(404).json({ message: 'Provider profile not found' });
      }
      query.providerId = provider._id;
    } else if (userRole === 'admin') {
      // Admin can see all
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const bookings = await Booking.find(query)
      .populate('customerId', 'name email phone')
      .populate('providerId', 'userId city pricing profileImage')
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single booking
exports.getBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const booking = await Booking.findById(id)
      .populate('customerId', 'name email phone')
      .populate('providerId', 'userId city pricing profileImage')
      .populate('categoryId', 'name');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user has access
    if (userRole === 'customer' && booking.customerId._id.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    if (userRole === 'provider') {
      const provider = await Provider.findOne({ userId });
      if (!provider || booking.providerId._id.toString() !== provider._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update booking status (provider or admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, workNotes, beforeImages, afterImages } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check permissions
    if (userRole === 'provider') {
      const provider = await Provider.findOne({ userId });
      if (!provider || booking.providerId.toString() !== provider._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
    } else if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update fields
    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ message: 'Invalid booking status' });
      }

      if (status !== booking.status) {
        const allowedNext = ALLOWED_TRANSITIONS[booking.status] || [];
        if (!allowedNext.includes(status)) {
          return res.status(400).json({
            message: `Invalid status transition from ${booking.status} to ${status}`
          });
        }
      }

      booking.status = status;
    }
    if (workNotes !== undefined) booking.workNotes = workNotes;
    if (beforeImages !== undefined) booking.beforeImages = Array.isArray(beforeImages) ? beforeImages : [];
    if (afterImages !== undefined) booking.afterImages = Array.isArray(afterImages) ? afterImages : [];

    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reschedule booking (customer)
exports.rescheduleBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduledAt } = req.body;
    const userId = req.user.id;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.customerId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (booking.status !== 'Requested' && booking.status !== 'Confirmed') {
      return res.status(400).json({ message: 'Cannot reschedule this booking' });
    }

    if (Number.isNaN(new Date(scheduledAt).getTime())) {
      return res.status(400).json({ message: 'Invalid schedule date/time' });
    }

    booking.scheduledAt = new Date(scheduledAt);
    booking.status = 'Requested'; // Reset to requested for provider approval

    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check permissions
    if (userRole === 'customer' && booking.customerId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    if (userRole === 'provider') {
      const provider = await Provider.findOne({ userId });
      if (!provider || booking.providerId.toString() !== provider._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
    }

    if (booking.status === 'Completed' || booking.status === 'Cancelled') {
      return res.status(400).json({ message: `Cannot cancel a ${booking.status} booking` });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
