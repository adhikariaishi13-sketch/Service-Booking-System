
require('dotenv').config();

const mongoose = require('mongoose');
const Category = require('./models/Category');
const Service = require('./models/Service');

const categories = [
  { name: 'Home Cleaning', icon: 'bi-stars', description: 'Home cleaning services' },
  { name: 'Plumbing', icon: 'bi-droplet-half', description: 'Plumbing repairs' },
  { name: 'Electrical Repair', icon: 'bi-lightning-charge', description: 'Electrical repairs' },
  { name: 'AC Repair', icon: 'bi-snow2', description: 'AC servicing and repair' },
  { name: 'Painting', icon: 'bi-palette', description: 'Interior and exterior painting' },
  { name: 'Appliance Repair', icon: 'bi-tv', description: 'Home appliance repair' },
  { name: 'Beauty Services', icon: 'bi-scissors', description: 'Beauty and salon services' },
  { name: 'Carpentry', icon: 'bi-hammer', description: 'Furniture repair and installation' },
];

const services = [
  ['Home Cleaning', 'Full Home Deep Cleaning', 'Complete home deep cleaning.', 2499, '4-6 hours', true],
  ['Home Cleaning', 'Kitchen Deep Cleaning', 'Kitchen cleaning and degreasing.', 1299, '2-3 hours', false],
  ['Home Cleaning', 'Bathroom Cleaning', 'Bathroom cleaning and disinfection.', 599, '1 hour', false],
  ['Plumbing', 'Tap & Pipe Leak Repair', 'Repair leaking taps and pipes.', 349, '1 hour', true],
  ['Plumbing', 'Bathroom Fitting Installation', 'Bathroom fitting installation.', 799, '2 hours', false],
  ['Electrical Repair', 'Fan, Light & Switch Repair', 'Electrical fixture repairs.', 299, '1 hour', true],
  ['Electrical Repair', 'Full House Wiring Check', 'Electrical wiring safety inspection.', 999, '2 hours', false],
  ['AC Repair', 'AC Service (Split / Window)', 'Complete AC servicing.', 599, '1 hour', true],
  ['AC Repair', 'AC Gas Refill', 'AC gas refill and pressure testing.', 1899, '2 hours', false],
  ['Painting', 'Single Room Painting', 'Complete single room painting.', 4999, '1-2 days', true],
  ['Painting', 'Waterproofing & Wall Repair', 'Wall crack repair and waterproofing.', 3499, '1 day', false],
  ['Appliance Repair', 'Washing Machine Repair', 'Washing machine diagnosis and repair.', 499, '1-2 hours', true],
  ['Appliance Repair', 'Refrigerator Repair', 'Refrigerator repair service.', 649, '1-2 hours', false],
  ['Beauty Services', 'Salon at Home (Women)', 'Salon services at your doorstep.', 999, '2 hours', true],
  ['Beauty Services', 'Haircut & Grooming (Men)', 'Haircut and grooming at home.', 499, '1 hour', false],
  ['Carpentry', 'Furniture Repair & Assembly', 'Furniture repair and assembly.', 449, '1-2 hours', true],
  ['Carpentry', 'Modular Shelf Installation', 'Wall shelf installation.', 899, '2 hours', false],
];

async function run() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    for (const category of categories) {
      await Category.updateOne(
        { name: category.name },
        { $setOnInsert: category },
        { upsert: true }
      );
    }

    const createdCategories = await Category.find();
    const categoryMap = {};

    createdCategories.forEach(category => {
      categoryMap[category.name] = category._id;
    });

    for (const [cat, name, description, price, duration, isPopular] of services) {
      await Service.updateOne(
        { name, category: categoryMap[cat] },
        {
          $setOnInsert: {
            name,
            description,
            price,
            duration,
            isPopular,
            category: categoryMap[cat]
          }
        },
        { upsert: true }
      );
    }

    console.log('Categories and Services added successfully!');
    console.log('Categories:', await Category.countDocuments());
    console.log('Services:', await Service.countDocuments());

  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
