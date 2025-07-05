# Burger App - Full Stack E-commerce

A modern full-stack web application combining a burger restaurant and pet store in one platform. Built with React, Node.js, Express, and MongoDB.

## Features

### 🍔 Restaurant Features
- Menu browsing with categories (burgers, sides, drinks)
- Product details with images and ratings
- Shopping cart functionality
- Order management

### 🐕 Pet Store Features  
- Pet product catalog (toys, food, accessories)
- Product search and filtering
- Shopping cart integration

### 👥 User Features
- User authentication (login/register)
- User profiles and order history
- Admin dashboard for product management

## Tech Stack

**Frontend:**
- React 18
- Bootstrap 5
- Axios for API calls

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Multer for file uploads

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JoseArmas10/BurgerApp.git
   cd BurgerApp
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd FrontEnd
   npm install

   # Backend
   cd ../BackEnd
   npm install
   ```

3. **Environment configuration**
   - Copy `.env.example` to `.env` in both FrontEnd and BackEnd directories
   - Configure your MongoDB connection string
   - Set your JWT secret and other environment variables

4. **Start the application**
   ```bash
   # Option 1: Use the startup script (Windows)
   ./start-dev.bat

   # Option 2: Manual startup
   # Terminal 1 - Backend
   cd BackEnd
   npm run dev

   # Terminal 2 - Frontend  
   cd FrontEnd
   npm start
   ```

5. **Seed the database (optional)**
   ```bash
   cd BackEnd
   npm run seed
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Admin (Protected)
- `GET /api/admin/products` - Get all products (admin)
- `POST /api/admin/products` - Create new product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

## Default Credentials

After running the seed script, you can login with:

**Admin Account:**
- Email: `admin@burgerapp.com`
- Password: `admin123456`

**User Account:**
- Email: `john.doe@example.com`
- Password: `password123`

## Development

### Frontend Development
```bash
cd FrontEnd
npm start
```
Access at: http://localhost:3000

### Backend Development
```bash
cd BackEnd
npm run dev
```
API available at: http://localhost:5000

### Health Check
Visit: http://localhost:5000/health

