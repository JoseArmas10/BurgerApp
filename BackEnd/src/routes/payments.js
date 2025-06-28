const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
router.post('/create-intent', protect, [
  body('orderId')
    .isMongoId()
    .withMessage('Valid order ID is required'),
  body('paymentMethod')
    .isIn(['card', 'apple-pay', 'google-pay'])
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

    const { orderId, paymentMethod } = req.body;

    // Get the order
    const order = await Order.findById(orderId);

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

    // Check if order is in pending status
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be paid for at this stage'
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.pricing.total * 100), // Convert to cents
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        orderId: order._id.toString(),
        userId: req.user.id.toString(),
        orderNumber: order.orderNumber
      },
      description: `Burger App Order ${order.orderNumber}`,
      receipt_email: order.customerInfo.email
    });

    // Update order with payment intent ID
    order.payment.stripePaymentIntentId = paymentIntent.id;
    order.payment.status = 'processing';
    await order.save();

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private
router.post('/confirm', protect, [
  body('paymentIntentId')
    .notEmpty()
    .withMessage('Payment intent ID is required'),
  body('orderId')
    .isMongoId()
    .withMessage('Valid order ID is required')
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

    const { paymentIntentId, orderId } = req.body;

    // Get the order
    const order = await Order.findById(orderId);

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

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update order status
      order.payment.status = 'completed';
      order.payment.paidAt = new Date();
      order.payment.transactionId = paymentIntent.id;
      order.status = 'confirmed';
      
      // Add status update to history
      order.addStatusUpdate('confirmed', 'Payment confirmed', req.user.id);
      
      await order.save();

      res.status(200).json({
        success: true,
        message: 'Payment confirmed successfully',
        data: {
          order,
          paymentStatus: paymentIntent.status
        }
      });
    } else {
      // Payment failed
      order.payment.status = 'failed';
      await order.save();

      res.status(400).json({
        success: false,
        message: 'Payment failed',
        data: {
          paymentStatus: paymentIntent.status
        }
      });
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Handle Stripe webhook
// @route   POST /api/payments/webhook
// @access  Public (but verified by Stripe signature)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      
      try {
        // Find order by payment intent ID
        const order = await Order.findOne({
          'payment.stripePaymentIntentId': paymentIntent.id
        });

        if (order && order.payment.status !== 'completed') {
          order.payment.status = 'completed';
          order.payment.paidAt = new Date();
          order.payment.transactionId = paymentIntent.id;
          order.status = 'confirmed';
          
          order.addStatusUpdate('confirmed', 'Payment confirmed via webhook', null);
          await order.save();

          // Payment confirmed for order ${order.orderNumber}
        }
      } catch (error) {
        console.error('Error processing payment webhook:', error);
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      
      try {
        const order = await Order.findOne({
          'payment.stripePaymentIntentId': failedPayment.id
        });

        if (order) {
          order.payment.status = 'failed';
          await order.save();

          // Payment failed for order ${order.orderNumber}
        }
      } catch (error) {
        console.error('Error processing failed payment webhook:', error);
      }
      break;

    default:
      // Unhandled event type ${event.type}
  }

  res.status(200).json({ received: true });
});

// @desc    Process refund
// @route   POST /api/payments/refund
// @access  Private
router.post('/refund', protect, [
  body('orderId')
    .isMongoId()
    .withMessage('Valid order ID is required'),
  body('amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Refund amount must be a positive number'),
  body('reason')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Reason cannot exceed 500 characters')
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

    const { orderId, amount, reason } = req.body;

    // Get the order
    const order = await Order.findById(orderId);

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

    // Check if order can be refunded
    if (order.payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Order payment is not completed'
      });
    }

    if (order.payment.status === 'refunded') {
      return res.status(400).json({
        success: false,
        message: 'Order has already been refunded'
      });
    }

    // Calculate refund amount
    const refundAmount = amount ? Math.min(amount, order.pricing.total) : order.pricing.total;

    try {
      // Create refund in Stripe
      const refund = await stripe.refunds.create({
        payment_intent: order.payment.stripePaymentIntentId,
        amount: Math.round(refundAmount * 100), // Convert to cents
        reason: 'requested_by_customer',
        metadata: {
          orderId: order._id.toString(),
          refundReason: reason || 'Customer request'
        }
      });

      // Update order
      order.payment.status = 'refunded';
      order.payment.refundedAt = new Date();
      order.payment.refundAmount = refundAmount;
      order.status = 'cancelled';
      order.cancelReason = reason || 'Refunded';
      
      order.addStatusUpdate('cancelled', `Refunded: ${reason || 'Customer request'}`, req.user.id);
      
      await order.save();

      res.status(200).json({
        success: true,
        message: 'Refund processed successfully',
        data: {
          refund: {
            id: refund.id,
            amount: refundAmount,
            status: refund.status
          },
          order
        }
      });
    } catch (stripeError) {
      console.error('Stripe refund error:', stripeError);
      
      return res.status(400).json({
        success: false,
        message: 'Failed to process refund',
        error: stripeError.message
      });
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Get payment history for user
// @route   GET /api/payments/history
// @access  Private
router.get('/history', protect, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const orders = await Order.find({
      user: req.user.id,
      'payment.status': { $in: ['completed', 'refunded'] }
    })
    .select('orderNumber pricing payment status createdAt')
    .sort({ 'payment.paidAt': -1 })
    .limit(limit)
    .skip(startIndex);

    const total = await Order.countDocuments({
      user: req.user.id,
      'payment.status': { $in: ['completed', 'refunded'] }
    });

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

module.exports = router;
