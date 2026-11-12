const User = require('../models/User');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const asyncHandler = require('../middleware/asyncHandler');

// PUT /api/users/profile  (logged-in user updates own profile)
exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  const { name, phone, address, password } = req.body;
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (address !== undefined) user.address = address;
  if (password) {
    if (password.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters');
    }
    user.password = password;
  }
  await user.save();
  res.json({
    user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, address: user.address, role: user.role, createdAt: user.createdAt },
  });
});

// GET /api/users  (admin)
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
});

// DELETE /api/users/:id  (admin)
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user.role === 'admin') {
    res.status(400);
    throw new Error('Admin accounts cannot be deleted');
  }
  await Booking.deleteMany({ user: user._id });
  await user.deleteOne();
  res.json({ message: 'User deleted' });
});

// GET /api/users/stats  (admin dashboard numbers)
exports.getStats = asyncHandler(async (req, res) => {
  const [users, services, bookings, pending, completed, revenueAgg] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Service.countDocuments(),
    Booking.countDocuments(),
    Booking.countDocuments({ status: 'Pending' }),
    Booking.countDocuments({ status: 'Completed' }),
    Booking.aggregate([{ $match: { status: 'Completed' } }, { $group: { _id: null, total: { $sum: '$price' } } }]),
  ]);
  res.json({ users, services, bookings, pending, completed, revenue: revenueAgg[0] ? revenueAgg[0].total : 0 });
});
