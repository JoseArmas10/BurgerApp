const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testLogin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/burger-pet-store');
    console.log('Connected to MongoDB');
    
    // Test John Doe credentials
    console.log('\n=== TESTING JOHN DOE LOGIN ===');
    const johnUser = await User.findOne({ email: 'john.doe@example.com' });
    if (johnUser) {
      const isValidPassword = await bcrypt.compare('password123', johnUser.password);
      console.log(`Email: john.doe@example.com`);
      console.log(`Password test result: ${isValidPassword ? '✅ CORRECT' : '❌ INCORRECT'}`);
    } else {
      console.log('❌ User not found');
    }
    
    // Test Admin credentials  
    console.log('\n=== TESTING ADMIN LOGIN ===');
    const adminUser = await User.findOne({ email: 'admin@burgerapp.com' });
    if (adminUser) {
      const isValidPassword = await bcrypt.compare('admin123456', adminUser.password);
      console.log(`Email: admin@burgerapp.com`);
      console.log(`Password test result: ${isValidPassword ? '✅ CORRECT' : '❌ INCORRECT'}`);
    } else {
      console.log('❌ User not found');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

testLogin();
