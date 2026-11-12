const Booking = require('../models/Booking');
const Service = require('../models/Service');
const asyncHandler = require('../middleware/asyncHandler');

const TIME_SLOTS = ['09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM', '02:00 PM - 04:00 PM', '04:00 PM - 06:00 PM', '06:00 PM - 08:00 PM'];
const populateBooking = (q) =>
  q.populate({ path: 'service', select: 'name image price category', populate: { path: 'category', select: 'name icon' } });

// POST /api/bookings
exports.createBooking = asyncHandler(async (req, res) => {
  const { serviceId, bookingDate, timeSlot, address, contactNumber, instructions } = req.body;

  if (!serviceId || !bookingDate || !timeSlot || !address || !contactNumber) {
    res.status(400);
    throw new Error('Service, date, time slot, address and contact number are required');
  }
  if (!TIME_SLOTS.includes(timeSlot)) {
    res.status(400);
    throw new Error('Invalid time slot');
  }
  if (!/^[6-9]\d{9}$/.test(contactNumber)) {
    res.status(400);
    throw new Error('Enter a valid 10-digit mobile number');
  }
  const date = new Date(bookingDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (isNaN(date.getTime()) || date < today) {
    res.status(400);
    throw new Error('Booking date cannot be in the past');
  }
  const service = await Service.findById(serviceId);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  const booking = await Booking.create({
    user: req.user._id,
    service: service._id,
    bookingDate: date,
    timeSlot,
    address,
    contactNumber,
    instructions,
    price: service.price,
  });
  res.status(201).json(await populateBooking(Booking.findById(booking._id)));
});

// GET /api/bookings/slots
exports.getTimeSlots = (req, res) => res.json(TIME_SLOTS);

// GET /api/bookings/my
exports.getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await populateBooking(Booking.find({ user: req.user._id }).sort({ createdAt: -1 }));
  res.json(bookings);
});

// GET /api/bookings/:id (owner or admin)
exports.getBookingById = asyncHandler(async (req, res) => {
  const booking = await populateBooking(Booking.findById(req.params.id)).populate('user', 'name email');
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  const ownerId = booking.user._id ? String(booking.user._id) : String(booking.user);
  if (ownerId !== String(req.user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('You cannot view this booking');
  }
  res.json(booking);
});

// PUT /api/bookings/:id/cancel (owner; only Pending or Confirmed)
exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking || String(booking.user) !== String(req.user._id)) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (!['Pending', 'Confirmed'].includes(booking.status)) {
    res.status(400);
    throw new Error(`A booking that is ${booking.status} cannot be cancelled`);
  }
  booking.status = 'Cancelled';
  await booking.save();
  res.json(await populateBooking(Booking.findById(booking._id)));
});

// GET /api/bookings (admin)
exports.getAllBookings = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const bookings = await populateBooking(Booking.find(filter).sort({ createdAt: -1 })).populate('user', 'name email phone');
  res.json(bookings);
});

// PUT /api/bookings/:id/status (admin)
exports.updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!Booking.STATUSES.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  booking.status = status;
  await booking.save();
  res.json(await populateBooking(Booking.findById(booking._id)).populate('user', 'name email phone'));
});
