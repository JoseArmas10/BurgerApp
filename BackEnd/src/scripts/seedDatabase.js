const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Location = require('../models/Location');
require('dotenv').config();

// Sample data
const sampleUsers = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: process.env.ADMIN_EMAIL || 'admin@burgerapp.com',
    password: process.env.ADMIN_PASSWORD || 'admin123456',
    role: 'admin',
    isEmailVerified: true,
    phone: '+1234567890',
    address: {
      street: '123 Admin St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    }
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    phone: '+1987654321',
    preferences: {
      favoriteCategory: 'burgers',
      dietaryRestrictions: ['gluten-free']
    },
    address: {
      street: '456 Customer Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'United States'
    }
  }
];

const sampleProducts = [
  // Burgers
  {
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, onion, and our special sauce',
    category: 'burgers',
    subcategory: 'classic',
    price: 12.99,
    images: [{ url: 'https://via.placeholder.com/400x300', alt: 'Classic Burger' }],
    ingredients: [
      { name: 'Beef Patty', allergens: [] },
      { name: 'Lettuce', allergens: [] },
      { name: 'Tomato', allergens: [] },
      { name: 'Onion', allergens: [] },
      { name: 'Burger Bun', allergens: ['gluten'] },
      { name: 'Special Sauce', allergens: ['eggs'] }
    ],
    nutritionalInfo: {
      calories: 650,
      protein: 35,
      carbs: 45,
      fat: 35,
      fiber: 3,
      sodium: 980
    },
    availability: {
      inStock: true,
      stockCount: 50,
      maxOrderQuantity: 5
    },
    tags: ['popular'],
    rating: { average: 4.5, count: 124 },
    preparationTime: 12,
    featured: true
  },
  {
    name: 'Veggie Deluxe',
    description: 'Plant-based patty with avocado, sprouts, and vegan mayo',
    category: 'burgers',
    subcategory: 'vegetarian',
    price: 14.99,
    images: [{ url: 'https://via.placeholder.com/400x300', alt: 'Veggie Burger' }],
    ingredients: [
      { name: 'Plant-based Patty', allergens: ['soy'] },
      { name: 'Avocado', allergens: [] },
      { name: 'Sprouts', allergens: [] },
      { name: 'Vegan Mayo', allergens: [] },
      { name: 'Whole Wheat Bun', allergens: ['gluten'] }
    ],
    nutritionalInfo: {
      calories: 580,
      protein: 25,
      carbs: 52,
      fat: 28,
      fiber: 8,
      sodium: 720
    },
    availability: {
      inStock: true,
      stockCount: 30,
      maxOrderQuantity: 3
    },
    tags: ['new', 'healthy'],
    rating: { average: 4.2, count: 67 },
    preparationTime: 10
  },

  // Sides
  {
    name: 'Crispy Fries',
    description: 'Golden crispy fries seasoned with sea salt',
    category: 'sides',
    price: 4.99,
    images: [{ url: 'https://via.placeholder.com/400x300', alt: 'Crispy Fries' }],
    ingredients: [
      { name: 'Potatoes', allergens: [] },
      { name: 'Sea Salt', allergens: [] },
      { name: 'Vegetable Oil', allergens: [] }
    ],
    nutritionalInfo: {
      calories: 320,
      protein: 4,
      carbs: 45,
      fat: 14,
      fiber: 4,
      sodium: 400
    },
    availability: {
      inStock: true,
      stockCount: 100,
      maxOrderQuantity: 10
    },
    tags: ['popular'],
    rating: { average: 4.7, count: 203 },
    preparationTime: 5
  },

  // Drinks
  {
    name: 'Craft Cola',
    description: 'Artisanal cola made with natural ingredients',
    category: 'drinks',
    price: 3.49,
    images: [{ url: 'https://via.placeholder.com/400x300', alt: 'Craft Cola' }],
    availability: {
      inStock: true,
      stockCount: 200,
      maxOrderQuantity: 15
    },
    tags: ['popular'],
    rating: { average: 4.1, count: 89 },
    preparationTime: 1
  },

  // Pet Products
  {
    name: 'Premium Dog Food',
    description: 'High-quality dry dog food with real chicken and vegetables',
    category: 'pets',
    subcategory: 'food',
    price: 24.99,
    images: [{ url: 'https://via.placeholder.com/400x300', alt: 'Dog Food' }],
    petInfo: {
      petType: 'dog',
      ageGroup: 'adult',
      size: 'all-sizes'
    },
    availability: {
      inStock: true,
      stockCount: 25,
      maxOrderQuantity: 3
    },
    tags: ['premium', 'bestseller'],
    rating: { average: 4.8, count: 156 },
    featured: true
  },
  {
    name: 'Cat Toy Set',
    description: 'Interactive toy set to keep your cat entertained',
    category: 'pets',
    subcategory: 'toys',
    price: 15.99,
    images: [{ url: 'https://via.placeholder.com/400x300', alt: 'Cat Toys' }],
    petInfo: {
      petType: 'cat',
      ageGroup: 'all-ages',
      size: 'all-sizes'
    },
    availability: {
      inStock: true,
      stockCount: 40,
      maxOrderQuantity: 2
    },
    tags: ['new'],
    rating: { average: 4.3, count: 42 }
  }
];

const sampleLocations = [
  {
    name: 'Burger App Downtown',
    type: 'combined',
    address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    coordinates: {
      type: 'Point',
      coordinates: [-73.9851, 40.7589] // [longitude, latitude]
    },
    contact: {
      phone: '+1-555-0123',
      email: 'downtown@burgerapp.com'
    },
    hours: {
      monday: { open: '09:00', close: '21:00', closed: false },
      tuesday: { open: '09:00', close: '21:00', closed: false },
      wednesday: { open: '09:00', close: '21:00', closed: false },
      thursday: { open: '09:00', close: '21:00', closed: false },
      friday: { open: '09:00', close: '22:00', closed: false },
      saturday: { open: '08:00', close: '22:00', closed: false },
      sunday: { open: '08:00', close: '20:00', closed: false }
    },
    services: ['delivery', 'pickup', 'dine-in'],
    features: ['parking', 'wifi', 'wheelchair-accessible'],
    deliveryZones: [
      { zipCode: '10001', radius: 5, fee: 3.99, estimatedTime: 25 },
      { zipCode: '10002', radius: 7, fee: 4.99, estimatedTime: 30 },
      { zipCode: '10003', radius: 8, fee: 5.99, estimatedTime: 35 }
    ],
    capacity: {
      dineIn: 50,
      parking: 20,
      staff: 15
    },
    rating: { average: 4.6, count: 89 },
    isActive: true,
    temporarilyClosed: false
  },
  {
    name: 'Burger App Westside',
    type: 'restaurant',
    address: {
      street: '456 West Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'United States'
    },
    coordinates: {
      type: 'Point',
      coordinates: [-118.2437, 34.0522] // [longitude, latitude]
    },
    contact: {
      phone: '+1-555-0456',
      email: 'westside@burgerapp.com'
    },
    hours: {
      monday: { open: '10:00', close: '20:00', closed: false },
      tuesday: { open: '10:00', close: '20:00', closed: false },
      wednesday: { open: '10:00', close: '20:00', closed: false },
      thursday: { open: '10:00', close: '20:00', closed: false },
      friday: { open: '10:00', close: '21:00', closed: false },
      saturday: { open: '09:00', close: '21:00', closed: false },
      sunday: { open: '09:00', close: '19:00', closed: false }
    },
    services: ['delivery', 'pickup', 'drive-thru'],
    features: ['drive-thru', 'parking', 'wifi'],
    deliveryZones: [
      { zipCode: '90210', radius: 3, fee: 2.99, estimatedTime: 20 },
      { zipCode: '90211', radius: 5, fee: 3.99, estimatedTime: 25 }
    ],
    capacity: {
      dineIn: 35,
      parking: 15,
      staff: 10
    },
    rating: { average: 4.4, count: 67 },
    isActive: true,
    temporarilyClosed: false
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Location.deleteMany({});

    // Seed users
    console.log('Seeding users...');
    const users = await User.create(sampleUsers);
    console.log(`Created ${users.length} users`);

    // Seed products
    console.log('Seeding products...');
    const products = await Product.create(sampleProducts);
    console.log(`Created ${products.length} products`);

    // Seed locations
    console.log('Seeding locations...');
    const locations = await Location.create(sampleLocations);
    console.log(`Created ${locations.length} locations`);

    console.log('Database seeded successfully!');
    console.log('Admin credentials:');
    console.log(`Email: ${sampleUsers[0].email}`);
    console.log(`Password: ${sampleUsers[0].password}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
