const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, restrictTo } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

// Get all products for administration
router.get('/products', protect, restrictTo('admin'), async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Crear nuevo producto
router.post('/products', protect, restrictTo('admin'), (req, res, next) => {
  // Usar multer solo si hay archivo
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('❌ Multer error:', err.message);
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      isActive,
      ingredients,
      allergens,
      nutritionalInfo,
      sizes,
      extras
    } = req.body;

    // Validaciones básicas
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, description, price, category'
      });
    }

    // Construir la imagen si se subió un archivo
    let images = [];
    if (req.file) {
      images.push({
        url: `/uploads/products/${req.file.filename}`,
        alt: name || 'Product image'
      });
    }

    // Procesar ingredients - convertir string a array de strings
    let processedIngredients = [];
    if (ingredients) {
      if (typeof ingredients === 'string') {
        processedIngredients = ingredients.split(',').map(ingredient => ingredient.trim()).filter(i => i);
      } else {
        processedIngredients = ingredients;
      }
    }

    // Procesar allergens - mantener como array de strings
    let processedAllergens = [];
    if (allergens) {
      if (typeof allergens === 'string') {
        processedAllergens = allergens.split(',')
          .map(a => a.trim())
          .filter(a => a && a.toLowerCase() !== 'nada' && a.toLowerCase() !== 'ninguno' && a.toLowerCase() !== 'none');
      } else {
        processedAllergens = allergens;
      }
    }

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      images: images, // Usar el array de images correcto
      isActive: isActive !== undefined ? isActive : true,
      ingredients: processedIngredients,
      allergens: processedAllergens,
      nutritionalInfo: nutritionalInfo || {},
      sizes: sizes || [],
      extras: extras || [],
      rating: { average: 0, count: 0 },
      availability: {
        inStock: true,
        stockCount: 100
      }
    });    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct
    });
  } catch (error) {
    console.error('❌ Error creating product:', error);
    res.status(400).json({ 
      success: false,
      message: 'Error creating product', 
      error: error.message,
      details: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : undefined
    });
  }
});

// Actualizar producto
router.put('/products/:id', protect, restrictTo('admin'), upload.single('image'), async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;

    if (req.file) {
      updates.image = req.file.path;
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      updates,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
});

// Eliminar producto (soft delete)
router.delete('/products/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findByIdAndUpdate(
      productId,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deactivated successfully', product });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting product', error: error.message });
  }
});

// Activar/Desactivar producto
router.patch('/products/:id/toggle-status', protect, restrictTo('admin'), async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.json({ 
      message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`, 
      product 
    });
  } catch (error) {
    res.status(400).json({ message: 'Error toggling product status', error: error.message });
  }
});

// Gestión de promociones
router.post('/promotions', protect, restrictTo('admin'), async (req, res) => {
  try {
    const {
      title,
      description,
      discountPercentage,
      validUntil,
      applicableProducts,
      isActive
    } = req.body;

    // Aquí crearías un modelo de Promociones
    // Por ahora, actualizamos los productos con descuento
    if (applicableProducts && applicableProducts.length > 0) {
      await Product.updateMany(
        { _id: { $in: applicableProducts } },
        { 
          $set: { 
            'promotion.isActive': true,
            'promotion.discountPercentage': discountPercentage,
            'promotion.title': title,
            'promotion.validUntil': validUntil
          }
        }
      );
    }

    res.json({ message: 'Promotion created successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error creating promotion', error: error.message });
  }
});

// Estadísticas del admin
router.get('/stats', protect, restrictTo('admin'), async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const productsByCategory = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      totalProducts,
      activeProducts,
      inactiveProducts: totalProducts - activeProducts,
      productsByCategory
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

// Subir imagen de producto
router.post('/products/upload-image', protect, restrictTo('admin'), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const imageUrl = `/uploads/products/${req.file.filename}`;
    
    res.json({
      success: true,
      imageUrl: imageUrl,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    res.status(400).json({ message: 'Error uploading image', error: error.message });
  }
});

module.exports = router;
