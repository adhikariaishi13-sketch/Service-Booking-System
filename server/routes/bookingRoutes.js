const router = require('express').Router();
const {
  createBooking, getTimeSlots, getMyBookings, getBookingById, cancelBooking, getAllBookings, updateBookingStatus,
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/slots', getTimeSlots);
router.get('/my', protect, getMyBookings);
router.post('/', protect, createBooking);
router.get('/', protect, adminOnly, getAllBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/status', protect, adminOnly, updateBookingStatus);

module.exports = router;
