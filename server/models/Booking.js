const mongoose = require('mongoose');

const STATUSES = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    bookingDate: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    address: { type: String, required: [true, 'Address is required'], trim: true },
    contactNumber: { type: String, required: [true, 'Contact number is required'], trim: true },
    instructions: { type: String, trim: true, default: '' },
    price: { type: Number, required: true }, // price saved at the time of booking
    status: { type: String, enum: STATUSES, default: 'Pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
module.exports.STATUSES = STATUSES;
