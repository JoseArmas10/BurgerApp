# 🚀 Quick Start Guide

## Overview
This guide will get your Burger & Pet Store App running in under 5 minutes.

## Prerequisites
- Node.js 16+ installed
- MongoDB Community Edition installed
- Git (for cloning)

## Quick Setup (5 minutes)

### 1. Start MongoDB
```bash
# Windows
cd BackEnd
start-mongodb.bat

# Manual (if batch file doesn't work)
mongod --dbpath "C:\data\db"
```

### 2. Setup Backend
```bash
cd BackEnd
npm install
npm run seed    # Populate database with sample data
npm run dev     # Start backend server
```
Backend will run on http://localhost:5000

### 3. Setup Frontend
```bash
# Open new terminal
cd FrontEnd
npm install
npm start       # Start development server
```
Frontend will run on http://localhost:3000

### 4. Verify Everything Works
```bash
cd BackEnd
node test-backend.js
```

## 🎯 Default Accounts

### Admin Account
- **Email**: admin@burgerapp.com
- **Password**: admin123456

### Test User Account  
- **Email**: user@example.com
- **Password**: password123

## 📍 Key URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## 🔥 Quick Features to Test

1. **Browse Products**: Visit Menu and Shop pages
2. **View Details**: Click any product for detailed view
3. **Add to Cart**: Add items and view cart dropdown
4. **User Login**: Use admin credentials to login
5. **Find Stores**: Check "Locations" page for interactive map
6. **Place Order**: Complete a test order (uses fake payment)

## 🛠️ Troubleshooting

### MongoDB Issues
```bash
# If MongoDB won't start
net start MongoDB

# Check if MongoDB is running
tasklist /fi "imagename eq mongod.exe"
```

### Port Conflicts
- Backend (5000): Kill any process using port 5000
- Frontend (3000): React will prompt to use different port

### API Not Working
1. Ensure backend server is running
2. Check console for CORS errors
3. Verify MongoDB is connected
4. Run `node test-backend.js` to diagnose

## 📱 Testing on Mobile
The app is responsive! Test on:
- Mobile devices (responsive design)
- Tablets (optimized layout)
- Desktop (full features)

## 🎨 Key Features to Explore

### 🍔 Food Section (Menu)
- Burgers with nutritional info
- Sides and drinks
- Special dietary options

### 🐕 Pet Section (Shop)  
- Dog and cat products
- Food, toys, accessories
- Age-specific recommendations

### 🗺️ Location Features
- Interactive map with store locations
- Nearest store finder
- Delivery time estimation
- Store hours and contact info

### 🛒 Shopping Experience
- Persistent shopping cart
- Smooth checkout flow
- Order history tracking
- User account management

## 🔄 Development Workflow

### Making Changes
1. **Frontend**: Changes auto-reload in browser
2. **Backend**: Nodemon auto-restarts server
3. **Database**: Use MongoDB Compass for visual editing

### Adding Sample Data
```bash
cd BackEnd
npm run seed    # Clears and repopulates database
```

### Testing API Changes
```bash
cd BackEnd
node test-backend.js    # Quick API verification
```

## 🚀 Ready for Production?

Once everything works locally:

1. **Deploy Backend**: Heroku, Railway, or any Node.js host
2. **Deploy Frontend**: Vercel, Netlify, or static hosting
3. **Database**: Migrate to MongoDB Atlas
4. **Environment**: Update .env files for production
5. **Payments**: Configure real Stripe keys

---

**🎉 You're all set!** Your modern burger and pet store app is ready to serve customers!

**Need help?** Check the full documentation in SETUP.md, INTEGRATION.md, or DEPLOYMENT.md
