import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import { GeolocationProvider } from "./context/GeolocationContext";
import { ToastProvider } from "./context/ToastContext";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Menu from "./pages/Menu/Menu";
import Shop from "./pages/Shop/Shop";
import Contact from "./pages/Contact/Contact";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProductDetail from "./pages/Product/ProductDetail";
import Locations from "./pages/Locations/Locations";
import Profile from "./pages/Profile/Profile";
import OrderHistory from "./pages/Orders/OrderHistory";
import OrderDetail from "./pages/Orders/OrderDetail";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CartDropdown from "./components/CartDropdown";

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <CartProvider>
          <GeolocationProvider>
            <ToastProvider>
              <Router>
                <CartDropdown />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/locations" element={<Locations />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/orders" element={<OrderHistory />} />
                  <Route path="/orders/:id" element={<OrderDetail />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
              </Router>
            </ToastProvider>
          </GeolocationProvider>
        </CartProvider>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;
