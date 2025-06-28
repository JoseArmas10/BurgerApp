const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    specialInstructions: String
  }],
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative']
    },
    tax: {
      type: Number,
      required: true,
      min: [0, 'Tax cannot be negative']
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: [0, 'Delivery fee cannot be negative']
    },
    discount: {
      amount: {
        type: Number,
        default: 0,
        min: [0, 'Discount cannot be negative']
      },
      code: String,
      reason: String
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'Total cannot be negative']
    }
  },
  customerInfo: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  deliveryInfo: {
    type: {
      type: String,
      enum: ['delivery', 'pickup'],
      required: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    location: { // For pickup orders
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location'
    },
    estimatedTime: {
      type: Number, // in minutes
      required: true
    },
    actualTime: Number, // in minutes
    instructions: String
  },
  payment: {
    method: {
      type: String,
      enum: ['card', 'paypal', 'cash', 'apple-pay', 'google-pay'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    stripePaymentIntentId: String,
    paidAt: Date,
    refundedAt: Date,
    refundAmount: Number
  },
  status: {
    type: String,
    enum: [
      'pending',      // Order placed, payment pending
      'confirmed',    // Payment confirmed, order accepted
      'preparing',    // Kitchen is preparing the order
      'ready',        // Order ready for pickup/delivery
      'out-for-delivery', // Driver has picked up the order
      'delivered',    // Order delivered to customer
      'completed',    // Order fully completed and rated
      'cancelled'     // Order cancelled
    ],
    default: 'pending'
  },
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  tracking: {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    pickupTime: Date,
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    driverLocation: {
      lat: Number,
      lng: Number,
      lastUpdated: Date
    }
  },
  rating: {
    overall: {
      type: Number,
      min: 1,
      max: 5
    },
    food: {
      type: Number,
      min: 1,
      max: 5
    },
    delivery: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'Review comment cannot exceed 500 characters']
    },
    ratedAt: Date
  },
  notes: {
    customer: String,
    kitchen: String,
    driver: String,
    admin: String
  },
  cancelReason: String,
  cancelledAt: Date,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ 'deliveryInfo.type': 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Get the count of orders for today
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    const todayOrdersCount = await this.constructor.countDocuments({
      createdAt: { $gte: startOfDay, $lt: endOfDay }
    });
    
    const orderSequence = (todayOrdersCount + 1).toString().padStart(3, '0');
    this.orderNumber = `BA${year}${month}${day}${orderSequence}`;
  }
  next();
});

// Method to add status update
orderSchema.methods.addStatusUpdate = function(status, note, updatedBy) {
  this.status = status;
  this.statusHistory.push({
    status,
    note,
    updatedBy,
    timestamp: new Date()
  });
};

// Virtual for total items count
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for formatted order number
orderSchema.virtual('formattedOrderNumber').get(function() {
  return `#${this.orderNumber}`;
});

// Method to calculate estimated delivery time
orderSchema.methods.calculateEstimatedDelivery = function() {
  const baseTime = 30; // Base preparation time in minutes
  const itemsTime = this.items.reduce((time, item) => time + (item.quantity * 5), 0);
  const deliveryTime = this.deliveryInfo.type === 'delivery' ? 20 : 0;
  
  return baseTime + itemsTime + deliveryTime;
};

module.exports = mongoose.model('Order', orderSchema);
