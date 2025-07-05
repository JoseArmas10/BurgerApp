const mongoose = require('mongoose');
const Order = require('./src/models/Order');
const User = require('./src/models/User');
require('dotenv').config();

async function checkOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/burger-pet-store');
    console.log('Connected to MongoDB');
    
    const orders = await Order.find({}).populate('user', 'firstName lastName email');
    console.log('\n=== PEDIDOS EN LA BASE DE DATOS ===');
    console.log('Total orders:', orders.length);
    
    if (orders.length === 0) {
      console.log('\n❌ No hay pedidos en la base de datos');
    } else {
      orders.forEach((order, index) => {
        console.log(`\n${index + 1}. Order ${order.orderNumber || order._id}`);
        console.log(`   Customer: ${order.user?.firstName} ${order.user?.lastName} (${order.user?.email})`);
        console.log(`   Total: $${order.pricing.total}`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Date: ${order.createdAt}`);
        console.log(`   Items: ${order.items?.length || 0} products`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

checkOrders();
