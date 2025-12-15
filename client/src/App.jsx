
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Features from './components/Features';
import Contact from './pages/Contact';
import About from './pages/About';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Testimonials from './pages/Testimonials';
import OrderSuccess from './pages/OrderSuccess';
import Checkout from './pages/Checkout';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyOrders from './pages/MyOrders';
import AccountSettings from './pages/AccountSettings';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <main>
            <Hero />
            <Features />
          </main>
        } />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/account-settings" element={<AccountSettings />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors duration-300">
              <Navbar />
              <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                  // Define default options
                  duration: 4000,
                  style: {
                    background: '#fff',
                    color: '#363636',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    padding: '16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    maxWidth: '400px',
                  },
                  success: {
                    style: {
                      borderLeft: '6px solid #10B981', // Green accent
                    },
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    style: {
                      borderLeft: '6px solid #EF4444', // Red accent
                    },
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#fff',
                    },
                  },
                  loading: {
                    style: {
                      borderLeft: '6px solid #3B82F6', // Blue accent
                    },
                  },
                }}
                containerStyle={{
                  zIndex: 99999,
                }}
              />
              <AnimatedRoutes />
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
