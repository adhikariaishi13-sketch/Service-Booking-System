const Category = require('../models/Category');
const Service = require('../models/Service');
const asyncHandler = require('../middleware/asyncHandler');

// GET /api/categories
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 }).lean();
  const counts = await Service.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
  const countMap = {};
  counts.forEach((c) => (countMap[String(c._id)] = c.count));
  res.json(categories.map((c) => ({ ...c, serviceCount: countMap[String(c._id)] || 0 })));
});

// POST /api/categories (admin)
exports.createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
});

// PUT /api/categories/:id (admin)
exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json(category);
});

// DELETE /api/categories/:id (admin)
exports.deleteCategory = asyncHandler(async (req, res) => {
  const inUse = await Service.countDocuments({ category: req.params.id });
  if (inUse > 0) {
    res.status(400);
    throw new Error(`Cannot delete: ${inUse} service(s) still use this category`);
  }
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json({ message: 'Category deleted' });
});
