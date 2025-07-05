const mongoose = require('mongoose');
require('dotenv').config();

const Order = require('./src/models/Order');
const User = require('./src/models/User');
const Product = require('./src/models/Product');

// Database connection function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

async function testOrderCreation() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Find a test user
    const user = await User.findOne({ email: 'john.doe@example.com' });
    if (!user) {
      console.log('Test user not found');
      return;
    }
    console.log('Found test user:', user.firstName, user.lastName);

    // Find a test product
    const product = await Product.findOne({ isActive: true });
    if (!product) {
      console.log('No active products found');
      return;
    }
    console.log('Found test product:', product.name, 'Price:', product.price);

    // Create order data
    const orderData = {
      user: user._id,
      items: [{
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: 2,
        specialInstructions: 'Test order from script'
      }],
      pricing: {
        subtotal: product.price * 2,
        tax: Math.round(product.price * 2 * 0.08 * 100) / 100,
        deliveryFee: 5.99,
        discount: {
          amount: 0
        },
        total: Math.round((product.price * 2 * 1.08 + 5.99) * 100) / 100
      },
      customerInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '1234567890'
      },
      deliveryInfo: {
        type: 'delivery',
        estimatedTime: 45,
        address: {
          street: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          country: 'USA'
        }
      },
      payment: {
        method: 'card',
        status: 'pending'
      },
      status: 'pending',
      statusHistory: [{
        status: 'pending',
        timestamp: new Date(),
        note: 'Test order placed via script',
        updatedBy: user._id
      }]
    };

    console.log('\nCreating order...');
    
    // Create order using new Order() and save() to trigger middleware
    const order = new Order(orderData);
    await order.save();

    console.log('✅ Order created successfully!');
    console.log('Order ID:', order._id);
    console.log('Order Number:', order.orderNumber);
    console.log('Total:', order.pricing.total);
    console.log('Status:', order.status);

    // Verify the order in database
    const savedOrder = await Order.findById(order._id);
    console.log('\nVerification from database:');
    console.log('Order exists:', !!savedOrder);
    console.log('Order number in DB:', savedOrder?.orderNumber);

  } catch (error) {
    console.error('❌ Error creating order:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

testOrderCreation();
