
import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart, addToCart } = useCart();
    const navigate = useNavigate();

    // Kerala Districts and their Shipping Charges
    const keralaDistricts = {
        "Alappuzha": 60,
        "Ernakulam": 50, // Hub
        "Idukki": 80, // Hill station
        "Kannur": 70,
        "Kasaragod": 80,
        "Kollam": 60,
        "Kottayam": 60,
        "Kozhikode": 70,
        "Malappuram": 70,
        "Palakkad": 70,
        "Pathanamthitta": 70,
        "Thiruvananthapuram": 70,
        "Thrissur": 60,
        "Wayanad": 80 // Hill station
    };

    const [selectedDistrict, setSelectedDistrict] = React.useState("");
    const [shippingCost, setShippingCost] = React.useState(0);

    const handleDistrictChange = (district) => {
        setSelectedDistrict(district);
        setShippingCost(keralaDistricts[district] || 0);
    };

    const handleCheckout = () => {
        if (cart.length === 0) return;

        // Navigate to checkout with cart data (though Context is available there too)
        // We can pass total + shipping cost if we calculated it here, but Checkout page calculates its own.
        // For simplicity, let's just go to checkout. Context holds the cart.
        navigate('/checkout');
    };

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    if (cart.length === 0) {
        return (
            <div className="min-h-screen pt-24 pb-12 bg-stone-50 dark:bg-stone-900 flex flex-col items-center justify-center text-center px-4">
                <Motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md"
                >
                    <div className="h-24 w-24 bg-gray-200 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                        <Trash2 size={40} />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-8">Looks like you haven't added any of our premium herbal oils yet.</p>
                    <Link to="/products" className="inline-flex items-center space-x-2 bg-green-900 text-white px-8 py-3 rounded-full hover:bg-green-800 transition-colors">
                        <span>Start Shopping</span>
                        <ArrowRight size={18} />
                    </Link>
                </Motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-stone-50 dark:bg-stone-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-serif font-bold text-green-900 dark:text-green-400 mb-8">Your Shopping Cart</h1>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        {cart.map((item) => (
                            <Motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-stone-700 flex flex-col sm:flex-row items-center gap-6"
                            >
                                <div className="h-24 w-24 bg-stone-100 dark:bg-stone-700 rounded-xl p-2 flex-shrink-0">
                                    <img src={item.images[0]} alt={item.name} className="h-full w-full object-contain" />
                                </div>

                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{item.name}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">₹{item.price} per unit</p>
                                </div>

                                <div className="flex items-center border border-gray-200 dark:border-stone-600 rounded-lg">
                                    <button
                                        onClick={() => addToCart(item, -1)}
                                        disabled={item.quantity <= 1}
                                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-900 dark:hover:text-green-400 disabled:opacity-30"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-10 text-center font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                                    <button
                                        onClick={() => addToCart(item, 1)}
                                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-900 dark:hover:text-green-400"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <div className="text-right min-w-[80px]">
                                    <p className="font-bold text-green-900 dark:text-green-400 text-lg">₹{item.price * item.quantity}</p>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </Motion.div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-stone-700 sticky top-24">
                            <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Subtotal</span>
                                    <span>₹{total}</span>
                                </div>

                                {/* Shipping Calculation */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Shipping ({selectedDistrict})</span>
                                        <span className={shippingCost === 0 ? "text-green-600 dark:text-green-400 font-medium" : "text-gray-900 dark:text-white"}>
                                            {shippingCost === 0 ? "Select District" : `₹${shippingCost}`}
                                        </span>
                                    </div>
                                    <select
                                        value={selectedDistrict}
                                        onChange={(e) => handleDistrictChange(e.target.value)}
                                        className="w-full mt-2 p-2 text-sm border border-gray-200 dark:border-stone-600 bg-white dark:bg-stone-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-green-900 dark:focus:border-green-400"
                                    >
                                        <option value="">Select District</option>
                                        {Object.keys(keralaDistricts).map((district) => (
                                            <option key={district} value={district}>{district}</option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-400">
                                        * Delivery charges vary by location
                                    </p>
                                </div>

                                <div className="h-px bg-gray-100 dark:bg-stone-700" />
                                <div className="flex justify-between text-gray-900 dark:text-white font-bold text-lg">
                                    <span>Total</span>
                                    <span>₹{total + shippingCost}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-green-900 text-white py-4 rounded-xl font-bold hover:bg-green-800 transition-colors shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                            >
                                <span>Proceed to Checkout</span>
                            </button>

                            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Secure Checkout with SSL
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
