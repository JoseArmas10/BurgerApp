const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Product = require('./src/models/Product');

async function fixBurgerImage() {
  try {
    console.log('Connecting to database...');
    
    // Find the Burguer product
    const burger = await Product.findOne({ name: { $regex: /burguer/i } });
    
    if (!burger) {
      console.log('Burger product not found');
      return;
    }
    
    console.log('Found burger:', burger.name);
    console.log('Current images:', burger.images);
    
    // Assuming the last uploaded image is for the burger
    // You can check the uploads folder to see which image file is the burger
    const imageUrl = '/uploads/products/image-1751129499482-898443084.png'; // Use the latest image
    
    // Update the burger with the correct image structure
    burger.images = [{
      url: imageUrl,
      alt: burger.name,
      public_id: 'local-' + Date.now()
    }];
    
    await burger.save();
    
    console.log('Updated burger with image:', burger.images);
    console.log('Burger updated successfully!');
    
  } catch (error) {
    console.error('Error fixing burger image:', error);
  } finally {
    mongoose.connection.close();
  }
}

fixBurgerImage();
