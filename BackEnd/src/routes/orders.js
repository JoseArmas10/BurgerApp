const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Location = require('../models/Location');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
router.get('/', protect, [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('status')
    .optional()
    .isIn(['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'completed', 'cancelled'])
    .withMessage('Invalid status')
], async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Build filter
    const filter = { user: req.user.id };
    
    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.createdAt.$lte = new Date(req.query.endDate);
    }

    // Execute query
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex)
      .populate('items.product', 'name images category')
      .populate('deliveryInfo.location', 'name address');

    // Get total count
    const total = await Order.countDocuments(filter);

    // Pagination info
    const pagination = {
      current: page,
      pages: Math.ceil(total / limit),
      total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    };

    res.status(200).json({
      success: true,
      count: orders.length,
      pagination,
      data: orders
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images category description')
      .populate('deliveryInfo.location', 'name address contact hours')
      .populate('tracking.driver', 'firstName lastName phone')
      .populate('statusHistory.updatedBy', 'firstName lastName role');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order or is admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.product')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('deliveryInfo.type')
    .isIn(['delivery', 'pickup'])
    .withMessage('Delivery type must be either delivery or pickup'),
  body('customerInfo.firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('customerInfo.lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('customerInfo.email')
    .isEmail()
    .withMessage('Valid email is required'),
  body('customerInfo.phone')
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  body('payment.method')
    .isIn(['card', 'paypal', 'cash', 'apple-pay', 'google-pay'])
    .withMessage('Invalid payment method')
], async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { items, deliveryInfo, customerInfo, payment } = req.body;

    // Validate and process items
    const processedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product} not found or unavailable`
        });
      }

      // Check stock
      if (!product.availability.inStock || product.availability.stockCount < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      // Check max order quantity
      if (item.quantity > product.availability.maxOrderQuantity) {
        return res.status(400).json({
          success: false,
          message: `Maximum order quantity for ${product.name} is ${product.availability.maxOrderQuantity}`
        });
      }

      const processedItem = {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions
      };

      processedItems.push(processedItem);
      subtotal += product.price * item.quantity;
    }

    // Calculate pricing
    const taxRate = 0.08; // 8% tax
    const tax = Math.round(subtotal * taxRate * 100) / 100;
    
    let deliveryFee = 0;
    let estimatedTime = 30; // Base time in minutes

    if (deliveryInfo.type === 'delivery') {
      // Calculate delivery fee and time based on location
      deliveryFee = 5.99; // Base delivery fee
      estimatedTime += 20; // Add delivery time
    } else if (deliveryInfo.type === 'pickup' && deliveryInfo.location) {
      // Validate pickup location
      const location = await Location.findById(deliveryInfo.location);
      if (!location || !location.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Invalid pickup location'
        });
      }
    }

    // Apply any discounts
    let discountAmount = 0;
    if (req.body.discountCode) {
      // Implement discount logic here
      // For now, just validate the code exists
    }

    const total = subtotal + tax + deliveryFee - discountAmount;

    // Calculate estimated delivery time
    const itemsTime = processedItems.reduce((time, item) => time + (item.quantity * 2), 0);
    estimatedTime += itemsTime;

    // Create order
    const orderData = {
      user: req.user.id,
      items: processedItems,
      pricing: {
        subtotal: Math.round(subtotal * 100) / 100,
        tax: Math.round(tax * 100) / 100,
        deliveryFee: Math.round(deliveryFee * 100) / 100,
        discount: {
          amount: discountAmount,
          code: req.body.discountCode,
          reason: req.body.discountReason
        },
        total: Math.round(total * 100) / 100
      },
      customerInfo,
      deliveryInfo: {
        ...deliveryInfo,
        estimatedTime
      },
      payment: {
        method: payment.method,
        status: 'pending'
      },
      status: 'pending'
    };

    // Add initial status to history
    orderData.statusHistory = [{
      status: 'pending',
      timestamp: new Date(),
      note: 'Order placed',
      updatedBy: req.user.id
    }];

    const order = await Order.create(orderData);

    // Update product stock
    for (const item of processedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 'availability.stockCount': -item.quantity }
      });
    }

    // Populate the order before sending response
    await order.populate('items.product', 'name images category');

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update order status (Admin/Staff only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, restrictTo('admin'), [
  body('status')
    .isIn(['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'completed', 'cancelled'])
    .withMessage('Invalid status'),
  body('note')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Note cannot exceed 500 characters')
], async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update status and add to history
    order.addStatusUpdate(req.body.status, req.body.note, req.user.id);

    // Set specific timestamps
    const now = new Date();
    switch (req.body.status) {
      case 'confirmed':
        if (!order.payment.paidAt) {
          order.payment.paidAt = now;
          order.payment.status = 'completed';
        }
        break;
      case 'out-for-delivery':
        order.tracking.pickupTime = now;
        break;
      case 'delivered':
        order.tracking.actualDeliveryTime = now;
        break;
      case 'cancelled':
        order.cancelledAt = now;
        order.cancelledBy = req.user.id;
        order.cancelReason = req.body.note;
        
        // Restore product stock
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { 'availability.stockCount': item.quantity }
          });
        }
        break;
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Rate order
// @route   POST /api/orders/:id/rate
// @access  Private
router.post('/:id/rate', protect, [
  body('overall')
    .isInt({ min: 1, max: 5 })
    .withMessage('Overall rating must be between 1 and 5'),
  body('food')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Food rating must be between 1 and 5'),
  body('delivery')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Delivery rating must be between 1 and 5'),
  body('comment')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
], async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if order is completed
    if (order.status !== 'delivered' && order.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Order must be delivered before rating'
      });
    }

    // Check if already rated
    if (order.rating.overall) {
      return res.status(400).json({
        success: false,
        message: 'Order has already been rated'
      });
    }

    // Add rating
    order.rating = {
      overall: req.body.overall,
      food: req.body.food,
      delivery: req.body.delivery,
      comment: req.body.comment,
      ratedAt: new Date()
    };

    order.status = 'completed';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order rated successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, [
  body('reason')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Reason cannot exceed 500 characters')
], async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Cancel the order
    order.addStatusUpdate('cancelled', req.body.reason || 'Cancelled by customer', req.user.id);
    order.cancelledAt = new Date();
    order.cancelledBy = req.user.id;
    order.cancelReason = req.body.reason || 'Cancelled by customer';

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 'availability.stockCount': item.quantity }
      });
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Reorder - create new order from existing order
// @route   POST /api/orders/:id/reorder
// @access  Private
router.post('/:id/reorder', protect, async (req, res, next) => {
  try {
    const originalOrder = await Order.findById(req.params.id)
      .populate('items.product');

    if (!originalOrder) {
      return res.status(404).json({
        success: false,
        message: 'Original order not found'
      });
    }

    // Check if user owns this order
    if (originalOrder.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check product availability
    const unavailableItems = [];
    const availableItems = [];

    for (const item of originalOrder.items) {
      const product = await Product.findById(item.product._id);
      
      if (!product || !product.isActive || !product.availability.inStock || 
          product.availability.stockCount < item.quantity) {
        unavailableItems.push(item.name);
      } else {
        availableItems.push({
          product: item.product._id,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions
        });
      }
    }

    if (availableItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'None of the items from the original order are currently available'
      });
    }

    // Create reorder data
    const reorderData = {
      items: availableItems,
      deliveryInfo: originalOrder.deliveryInfo,
      customerInfo: originalOrder.customerInfo,
      payment: { method: originalOrder.payment.method }
    };

    // Forward to create order endpoint
    req.body = reorderData;
    next();
  } catch (error) {
    next(error);
  }
}, async (req, res, next) => {
  // This will execute the create order logic
  const createOrderHandler = router.stack.find(layer => 
    layer.route && layer.route.path === '/' && layer.route.methods.post
  ).route.stack[1].handle;
  
  await createOrderHandler(req, res, next);
});

// @desc    Get order statistics (Admin only)
// @route   GET /api/orders/stats
// @access  Private/Admin
router.get('/admin/stats', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const stats = await Order.aggregate([
      {
        $facet: {
          today: [
            { $match: { createdAt: { $gte: startOfDay } } },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                revenue: { $sum: '$pricing.total' },
                avgOrderValue: { $avg: '$pricing.total' }
              }
            }
          ],
          thisWeek: [
            { $match: { createdAt: { $gte: startOfWeek } } },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                revenue: { $sum: '$pricing.total' }
              }
            }
          ],
          thisMonth: [
            { $match: { createdAt: { $gte: startOfMonth } } },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                revenue: { $sum: '$pricing.total' }
              }
            }
          ],
          byStatus: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ],
          byDeliveryType: [
            {
              $group: {
                _id: '$deliveryInfo.type',
                count: { $sum: 1 },
                avgTotal: { $avg: '$pricing.total' }
              }
            }
          ],
          topItems: [
            { $unwind: '$items' },
            {
              $group: {
                _id: '$items.name',
                totalQuantity: { $sum: '$items.quantity' },
                revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
              }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 10 }
          ]
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
