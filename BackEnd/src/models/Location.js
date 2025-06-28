const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Location name is required'],
    trim: true,
    maxlength: [100, 'Location name cannot exceed 100 characters']
  },
  type: {
    type: String,
    enum: ['restaurant', 'pet-store', 'combined'],
    required: true
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'United States'
    }
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(coords) {
          return coords.length === 2 && 
                 coords[0] >= -180 && coords[0] <= 180 && // longitude
                 coords[1] >= -90 && coords[1] <= 90;     // latitude
        },
        message: 'Coordinates must be [longitude, latitude] with valid ranges'
      }
    }
  },
  contact: {
    phone: {
      type: String,
      required: true,
      match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email'
      ]
    },
    website: String
  },
  hours: {
    monday: {
      open: String,    // "09:00"
      close: String,   // "21:00"
      closed: { type: Boolean, default: false }
    },
    tuesday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false }
    },
    wednesday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false }
    },
    thursday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false }
    },
    friday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false }
    },
    saturday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false }
    },
    sunday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false }
    }
  },
  services: [{
    type: String,
    enum: [
      'delivery',
      'pickup',
      'dine-in',
      'drive-thru',
      'pet-grooming',
      'veterinary',
      'pet-training',
      'pet-boarding'
    ]
  }],
  features: [{
    type: String,
    enum: [
      'parking',
      'wifi',
      'wheelchair-accessible',
      'outdoor-seating',
      'pet-friendly',
      'kids-area',
      'drive-thru',
      'charging-stations'
    ]
  }],
  deliveryZones: [{
    zipCode: String,
    radius: Number, // in kilometers
    fee: Number,    // delivery fee for this zone
    estimatedTime: Number // estimated delivery time in minutes
  }],
  capacity: {
    dineIn: Number,      // Number of seats for dine-in
    parking: Number,     // Number of parking spots
    staff: Number        // Number of staff members
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  staff: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['manager', 'chef', 'cashier', 'driver', 'cleaner', 'veterinarian', 'groomer']
    },
    schedule: {
      monday: { start: String, end: String, dayOff: Boolean },
      tuesday: { start: String, end: String, dayOff: Boolean },
      wednesday: { start: String, end: String, dayOff: Boolean },
      thursday: { start: String, end: String, dayOff: Boolean },
      friday: { start: String, end: String, dayOff: Boolean },
      saturday: { start: String, end: String, dayOff: Boolean },
      sunday: { start: String, end: String, dayOff: Boolean }
    }
  }],
  images: [{
    url: String,
    public_id: String, // For Cloudinary
    alt: String,
    type: {
      type: String,
      enum: ['exterior', 'interior', 'kitchen', 'parking', 'menu-board']
    }
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
    aspects: {
      food: { type: Number, min: 1, max: 5 },
      service: { type: Number, min: 1, max: 5 },
      cleanliness: { type: Number, min: 1, max: 5 },
      atmosphere: { type: Number, min: 1, max: 5 }
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  specialOffers: [{
    title: String,
    description: String,
    discount: Number, // percentage
    validFrom: Date,
    validTo: Date,
    conditions: String,
    active: { type: Boolean, default: true }
  }],
  inventory: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    reserved: {
      type: Number,
      default: 0,
      min: 0
    },
    lastRestocked: Date
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  temporarilyClosed: {
    type: Boolean,
    default: false
  },
  closureReason: String,
  reopenDate: Date
}, {
  timestamps: true
});

// Indexes for better performance
locationSchema.index({ coordinates: '2dsphere' });
locationSchema.index({ type: 1, isActive: 1 });
locationSchema.index({ 'address.zipCode': 1 });
locationSchema.index({ 'deliveryZones.zipCode': 1 });
locationSchema.index({ 'rating.average': -1 });

// Virtual for full address
locationSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}`;
});

// Method to check if location is open
locationSchema.methods.isOpen = function(date = new Date()) {
  const day = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const currentTime = date.toTimeString().slice(0, 5); // "HH:MM" format
  
  const todayHours = this.hours[day];
  if (!todayHours || todayHours.closed) {
    return false;
  }
  
  return currentTime >= todayHours.open && currentTime <= todayHours.close;
};

// Method to get next opening time
locationSchema.methods.getNextOpeningTime = function() {
  const now = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(now);
    checkDate.setDate(now.getDate() + i);
    const dayName = days[checkDate.getDay()];
    
    const dayHours = this.hours[dayName];
    if (!dayHours || dayHours.closed) continue;
    
    if (i === 0) { // Today
      const currentTime = now.toTimeString().slice(0, 5);
      if (currentTime < dayHours.open) {
        return { date: checkDate, time: dayHours.open };
      }
    } else {
      return { date: checkDate, time: dayHours.open };
    }
  }
  
  return null; // Closed for the week
};

// Method to calculate delivery fee for a zip code
locationSchema.methods.getDeliveryInfo = function(zipCode) {
  const zone = this.deliveryZones.find(zone => zone.zipCode === zipCode);
  if (!zone) {
    return { available: false };
  }
  
  return {
    available: true,
    fee: zone.fee,
    estimatedTime: zone.estimatedTime
  };
};

// Method to update rating
locationSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating.average = Math.round((totalRating / this.reviews.length) * 10) / 10;
    this.rating.count = this.reviews.length;
  }
};

module.exports = mongoose.model('Location', locationSchema);
