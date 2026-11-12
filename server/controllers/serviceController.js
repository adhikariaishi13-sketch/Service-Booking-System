const Service = require('../models/Service');
const Booking = require('../models/Booking');
const asyncHandler = require('../middleware/asyncHandler');

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/services?search=&category=&popular=true
exports.getServices = asyncHandler(async (req, res) => {
  const { search, category, popular } = req.query;
  const filter = {};
  if (search) filter.name = { $regex: escapeRegex(search), $options: 'i' };
  if (category) filter.category = category;
  if (popular === 'true') filter.isPopular = true;
  const services = await Service.find(filter).populate('category', 'name icon').sort({ createdAt: -1 });
  res.json(services);
});

// GET /api/services/:id
exports.getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id).populate('category', 'name icon');
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  res.json(service);
});

// POST /api/services (admin)
exports.createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json(await service.populate('category', 'name icon'));
});

// PUT /api/services/:id (admin)
exports.updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('category', 'name icon');
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  res.json(service);
});

// DELETE /api/services/:id (admin)
exports.deleteService = asyncHandler(async (req, res) => {
  const active = await Booking.countDocuments({ service: req.params.id, status: { $in: ['Pending', 'Confirmed', 'In Progress'] } });
  if (active > 0) {
    res.status(400);
    throw new Error(`Cannot delete: ${active} active booking(s) exist for this service`);
  }
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  res.json({ message: 'Service deleted' });
});
