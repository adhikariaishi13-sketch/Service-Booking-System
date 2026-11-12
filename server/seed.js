// Run with: npm run seed   (wipes services/categories/bookings/users and recreates sample data)
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Service = require('./models/Service');
const Booking = require('./models/Booking');

const categories = [
  { name: 'Home Cleaning', icon: 'bi-stars', description: 'Deep cleaning for homes, kitchens and bathrooms' },
  { name: 'Plumbing', icon: 'bi-droplet-half', description: 'Leaks, taps, pipes and bathroom fittings' },
  { name: 'Electrical Repair', icon: 'bi-lightning-charge', description: 'Wiring, switches, fans and lights' },
  { name: 'AC Repair', icon: 'bi-snow2', description: 'AC service, gas refill and installation' },
  { name: 'Painting', icon: 'bi-palette', description: 'Interior and exterior wall painting' },
  { name: 'Appliance Repair', icon: 'bi-tv', description: 'Washing machine, fridge, microwave and more' },
  { name: 'Beauty Services', icon: 'bi-scissors', description: 'Salon services at your doorstep' },
  { name: 'Carpentry', icon: 'bi-hammer', description: 'Furniture repair, assembly and custom work' },
];

const services = [
  ['Home Cleaning', 'Full Home Deep Cleaning', 'Top-to-bottom cleaning of rooms, kitchen, bathrooms and balcony with professional equipment.', 2499, '4-6 hours', true],
  ['Home Cleaning', 'Kitchen Deep Cleaning', 'Degreasing of chimney, stove, tiles, cabinets and sink.', 1299, '2-3 hours', false],
  ['Home Cleaning', 'Bathroom Cleaning', 'Descaling and disinfecting tiles, fittings, floor and fixtures.', 599, '1 hour', false],
  ['Plumbing', 'Tap & Pipe Leak Repair', 'Find and fix leaking taps, joints and concealed pipe leaks.', 349, '1 hour', true],
  ['Plumbing', 'Bathroom Fitting Installation', 'Installation of washbasin, shower, commode or geyser connection.', 799, '2 hours', false],
  ['Electrical Repair', 'Fan, Light & Switch Repair', 'Repair or replacement of ceiling fans, lights, switches and sockets.', 299, '1 hour', true],
  ['Electrical Repair', 'Full House Wiring Check', 'Safety inspection of wiring, MCB and earthing with a written report.', 999, '2 hours', false],
  ['AC Repair', 'AC Service (Split / Window)', 'Jet-pump cleaning of filters, coil and drain with a performance check.', 599, '1 hour', true],
  ['AC Repair', 'AC Gas Refill', 'Leak check and gas top-up with pressure testing.', 1899, '2 hours', false],
  ['Painting', 'Single Room Painting', 'Wall preparation and two coats of premium emulsion for one room.', 4999, '1-2 days', true],
  ['Painting', 'Waterproofing & Wall Repair', 'Crack filling, damp treatment and touch-up painting.', 3499, '1 day', false],
  ['Appliance Repair', 'Washing Machine Repair', 'Diagnosis and repair for front-load and top-load machines.', 499, '1-2 hours', true],
  ['Appliance Repair', 'Refrigerator Repair', 'Cooling, compressor and thermostat issues fixed on site.', 649, '1-2 hours', false],
  ['Beauty Services', 'Salon at Home (Women)', 'Haircut, facial and cleanup by a trained beautician at home.', 999, '2 hours', true],
  ['Beauty Services', 'Haircut & Grooming (Men)', 'Haircut, beard styling and head massage at home.', 499, '1 hour', false],
  ['Carpentry', 'Furniture Repair & Assembly', 'Repair of beds, wardrobes and doors, or assembly of new furniture.', 449, '1-2 hours', true],
  ['Carpentry', 'Modular Shelf Installation', 'Wall-mounted shelves and racks installed with proper fixing.', 899, '2 hours', false],
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Clearing old data...');
  await Promise.all([User.deleteMany(), Category.deleteMany(), Service.deleteMany(), Booking.deleteMany()]);

  await User.create({ name: 'Admin', email: 'admin@example.com', password: 'Admin@123', phone: '9000000000', role: 'admin' });
  await User.create({ name: 'Demo Customer', email: 'user@example.com', password: 'User@123', phone: '9876543210' });

  const created = await Category.insertMany(categories);
  const byName = {};
  created.forEach((c) => (byName[c.name] = c._id));

  await Service.insertMany(
    services.map(([cat, name, description, price, duration, isPopular]) => ({
      name, description, price, duration, isPopular, category: byName[cat],
    }))
  );

  console.log('Seed complete.');
  console.log('Admin login:    admin@example.com / Admin@123');
  console.log('Customer login: user@example.com  / User@123');
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
