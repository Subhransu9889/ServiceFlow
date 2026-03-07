const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
    },
    requestImages: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["Requested", "Confirmed", "In-progress", "Completed", "Cancelled"],
      default: "Requested",
      required: true,
    },
    priceAtBooking: {
      type: Number,
      required: true,
      min: 0,
    },
    workNotes: {
      type: String,
    },
    beforeImages: [
      {
        type: String,
      },
    ],
    afterImages: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
