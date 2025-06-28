const axios = require('axios');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

require('dotenv').config();

async function testLogin() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/burger-pet-store');
    console.log('📁 Connected to database');

    // Check if admin user exists
    const adminUser = await User.findOne({ email: 'admin@burgerapp.com' });
    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }
    console.log('👤 Admin user found:', adminUser.email);

    // Test password comparison manually
    const testPassword = 'admin123456';
    const isValid = await adminUser.comparePassword(testPassword);
    console.log('🔒 Password comparison result:', isValid);

    // Test password hash manually
    const manualHash = await bcrypt.compare(testPassword, adminUser.password);
    console.log('🔑 Manual bcrypt comparison:', manualHash);

    // Test login API
    console.log('\n🧪 Testing login API...');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'admin@burgerapp.com',
        password: 'admin123456'
      });
      console.log('✅ Login successful!');
      console.log('Token received:', !!response.data.token);
      console.log('User data:', response.data.user);
    } catch (error) {
      console.log('❌ Login failed:', error.response?.status);
      console.log('Error details:', error.response?.data);
      console.log('Full error:', error.message);
    }

  } catch (error) {
    console.error('💥 Test failed:', error.message);
  } finally {
    mongoose.disconnect();
    process.exit();
  }
}

testLogin();
