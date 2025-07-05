const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/burger-pet-store');
    console.log('Connected to MongoDB');
    
    const users = await User.find({}, 'firstName lastName email role');
    console.log('\n=== USUARIOS EN LA BASE DE DATOS ===');
    console.log('Total users:', users.length);
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.firstName} ${user.lastName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role || 'user'}`);
    });
    
    if (users.length === 0) {
      console.log('\n❌ No hay usuarios en la base de datos');
      console.log('Ejecuta: npm run seed');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

checkUsers();
