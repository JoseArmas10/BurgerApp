const express = require('express');
const { query, validationResult } = require('express-validator');
const Location = require('../models/Location');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all locations
// @route   GET /api/locations
// @access  Public
router.get('/', [
  query('lat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  query('lng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  query('radius')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Radius must be a positive number'),
  query('type')
    .optional()
    .isIn(['restaurant', 'pet-store', 'combined'])
    .withMessage('Invalid location type')
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

    let query = { isActive: true, temporarilyClosed: false };

    // Filter by type
    if (req.query.type) {
      query.type = req.query.type;
    }

    // Filter by services
    if (req.query.services) {
      const services = req.query.services.split(',');
      query.services = { $in: services };
    }

    let locations;

    // If coordinates provided, find nearby locations
    if (req.query.lat && req.query.lng) {
      const lat = parseFloat(req.query.lat);
      const lng = parseFloat(req.query.lng);
      const radius = parseFloat(req.query.radius) || 50; // Default 50km radius

      locations = await Location.find({
        ...query,
        coordinates: {
          $nearSphere: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            $maxDistance: radius * 1000 // Convert km to meters
          }
        }
      })
      .populate('manager', 'firstName lastName email phone')
      .sort({ 'rating.average': -1 });

      // Add distance calculation
      locations = locations.map(location => {
        const distance = calculateDistance(lat, lng, location.coordinates.lat, location.coordinates.lng);
        return {
          ...location.toObject(),
          distance: Math.round(distance * 100) / 100 // Round to 2 decimal places
        };
      });
    } else {
      // Get all locations
      locations = await Location.find(query)
        .populate('manager', 'firstName lastName email phone')
        .sort({ 'rating.average': -1, name: 1 });
    }

    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Find nearest location
// @route   GET /api/locations/nearest
// @access  Public
router.get('/nearest', [
  query('lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Valid latitude is required'),
  query('lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Valid longitude is required'),
  query('type')
    .optional()
    .isIn(['restaurant', 'pet-store', 'combined'])
    .withMessage('Invalid location type')
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

    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);

    let query = { isActive: true, temporarilyClosed: false };
    
    if (req.query.type) {
      query.type = req.query.type;
    }

    const nearestLocation = await Location.findOne({
      ...query,
      coordinates: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        }
      }
    })
    .populate('manager', 'firstName lastName phone');

    if (!nearestLocation) {
      return res.status(404).json({
        success: false,
        message: 'No locations found nearby'
      });
    }

    // Calculate distance
    const distance = calculateDistance(
      lat, lng, 
      nearestLocation.coordinates.coordinates[1], // latitude 
      nearestLocation.coordinates.coordinates[0]  // longitude
    );

    // Check if location is open
    const isOpen = nearestLocation.isOpen();
    const nextOpening = nearestLocation.getNextOpeningTime();

    res.status(200).json({
      success: true,
      data: {
        location: nearestLocation,
        distance: Math.round(distance * 100) / 100,
        isOpen,
        nextOpening
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single location
// @route   GET /api/locations/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const location = await Location.findOne({
      _id: req.params.id,
      isActive: true
    })
    .populate('manager', 'firstName lastName email phone')
    .populate('staff.user', 'firstName lastName email phone')
    .populate('reviews.user', 'firstName lastName');

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    // Check if location is currently open
    const isOpen = location.isOpen();
    const nextOpening = location.getNextOpeningTime();

    res.status(200).json({
      success: true,
      data: {
        location,
        isOpen,
        nextOpening
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get location's delivery zones
// @route   GET /api/locations/:id/delivery-zones
// @access  Public
router.get('/:id/delivery-zones', async (req, res, next) => {
  try {
    const location = await Location.findOne({
      _id: req.params.id,
      isActive: true
    }).select('deliveryZones name address');

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        location: {
          id: location._id,
          name: location.name,
          address: location.address
        },
        deliveryZones: location.deliveryZones
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Check delivery availability for zip code
// @route   GET /api/locations/delivery-check/:zipCode
// @access  Public
router.get('/delivery-check/:zipCode', async (req, res, next) => {
  try {
    const zipCode = req.params.zipCode;

    // Find locations that deliver to this zip code
    const locations = await Location.find({
      isActive: true,
      temporarilyClosed: false,
      'deliveryZones.zipCode': zipCode
    }).select('name address coordinates deliveryZones');

    const deliveryOptions = locations.map(location => {
      const zone = location.deliveryZones.find(z => z.zipCode === zipCode);
      return {
        location: {
          id: location._id,
          name: location.name,
          address: location.address,
          coordinates: location.coordinates
        },
        deliveryInfo: {
          fee: zone.fee,
          estimatedTime: zone.estimatedTime,
          radius: zone.radius
        }
      };
    });

    res.status(200).json({
      success: true,
      available: deliveryOptions.length > 0,
      data: deliveryOptions
    });
  } catch (error) {
    next(error);
  }
});

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

module.exports = router;
