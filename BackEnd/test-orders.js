const mongoose = require('mongoose');
const User = require('./src/models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function testOrderEndpoint() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/burger-pet-store');
    console.log('Connected to MongoDB');
    
    // Get the John Doe user
    const user = await User.findOne({ email: 'john.doe@example.com' });
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    // Generate a token for testing
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_make_it_long_and_complex',
      { expiresIn: '7d' }
    );
    
    console.log('\n=== TEST TOKEN PARA JOHN DOE ===');
    console.log('User ID:', user._id);
    console.log('Token:', token);
    console.log('\n=== INSTRUCCIONES ===');
    console.log('1. Ve al frontend y haz login con john.doe@example.com / password123');
    console.log('2. Abre las DevTools (F12) → Network tab');
    console.log('3. Intenta hacer un pedido');
    console.log('4. Ve si aparece la llamada a POST /api/orders');
    console.log('5. Revisa si hay errores en la respuesta');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

testOrderEndpoint();
