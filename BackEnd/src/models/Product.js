const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['burgers', 'sides', 'drinks', 'desserts', 'pets']
  },
  subcategory: {
    type: String,
    // For pets: 'food', 'toys', 'accessories', 'health'
    // For food: 'classic', 'premium', 'vegetarian', etc.
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number, // For sale prices
    min: [0, 'Original price cannot be negative']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: String, // For Cloudinary
    alt: String
  }],
  ingredients: [{
    type: String,
    trim: true
  }],
  nutritionalInfo: {
    calories: Number,
    protein: Number, // in grams
    carbs: Number,   // in grams
    fat: Number,     // in grams
    fiber: Number,   // in grams
    sodium: Number   // in mg
  },
  petInfo: { // For pet products
    petType: {
      type: String,
      enum: ['dog', 'cat', 'bird', 'fish', 'small-pet']
    },
    ageGroup: {
      type: String,
      enum: ['puppy', 'adult', 'senior', 'all-ages']
    },
    size: {
      type: String,
      enum: ['small', 'medium', 'large', 'all-sizes']
    }
  },
  availability: {
    inStock: {
      type: Boolean,
      default: true
    },
    stockCount: {
      type: Number,
      default: 0,
      min: [0, 'Stock count cannot be negative']
    },
    maxOrderQuantity: {
      type: Number,
      default: 10
    }
  },
  tags: [{
    type: String,
    enum: ['new', 'popular', 'bestseller', 'limited-time', 'healthy', 'organic', 'premium']
  }],
  allergens: [{
    type: String,
    trim: true
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5']
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'Review comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  preparationTime: {
    type: Number, // in minutes
    default: 15
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  promotion: {
    isActive: {
      type: Boolean,
      default: false
    },
    title: String,
    discountPercentage: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%']
    },
    discountAmount: {
      type: Number,
      min: [0, 'Discount amount cannot be negative']
    },
    validUntil: Date,
    validFrom: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ price: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ tags: 1 });
productSchema.index({ featured: -1, createdAt: -1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for availability status
productSchema.virtual('availabilityStatus').get(function() {
  if (!this.availability.inStock) return 'out-of-stock';
  if (this.availability.stockCount <= 5) return 'low-stock';
  return 'in-stock';
});

// Method to update rating
productSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating.average = Math.round((totalRating / this.reviews.length) * 10) / 10;
    this.rating.count = this.reviews.length;
  }
};

// Pre-save middleware to update rating
productSchema.pre('save', function(next) {
  if (this.isModified('reviews')) {
    this.updateRating();
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
