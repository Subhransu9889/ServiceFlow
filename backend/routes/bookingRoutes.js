const express = require('express');
const {
  createBooking,
  getBookings,
  getBooking,
  updateBookingStatus,
  rescheduleBooking,
  cancelBooking
} = require('../controllers/BookingController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/', createBooking);
router.get('/', getBookings);
router.get('/:id', getBooking);
router.put('/:id/status', updateBookingStatus);
router.put('/:id/reschedule', rescheduleBooking);
router.put('/:id/cancel', cancelBooking);

module.exports = router;