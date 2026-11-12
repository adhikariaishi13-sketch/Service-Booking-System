const router = require('express').Router();
const { updateProfile, getUsers, deleteUser, getStats } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

router.put('/profile', protect, updateProfile);
router.get('/stats', protect, adminOnly, getStats);
router.get('/', protect, adminOnly, getUsers);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
