import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, Truck, CreditCard, Banknote, AlertCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const product = state?.product || { name: 'Nilam Roots Hair Oil', price: 499, _id: 'manual_id' }; // Fallback

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        pincode: '',
        locality: '',
        address: '',
        city: '',
        state: ''
    });

    const [orderStep, setOrderStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [razorpayKey, setRazorpayKey] = useState('');

    // Fetch Razorpay Key
    useEffect(() => {
        const fetchKey = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/orders/razorpay-key');
                setRazorpayKey(data.key);
            } catch (error) {
                console.error("Failed to fetch Razorpay Key", error);
            }
        };
        fetchKey();
    }, []);

    // Enforce Login
    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setFormData(prev => ({ ...prev, name: user.name, phone: user.phone || '' }));
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (txnId = null) => {
        try {
            // Validate Address
            if (!formData.name || !formData.phone || !formData.pincode || !formData.address || !formData.city || !formData.state) {
                toast.error("Please fill in all address details.");
                return;
            }

            const paymentStatus = (paymentMethod === 'cod') ? 'Pending' : 'Paid';
            const transactionId = txnId || ((paymentMethod !== 'cod') ? "TXN_" + Math.floor(Math.random() * 10000000) : null);

            const orderPayload = {
                customerName: formData.name,
                phoneNumber: formData.phone,
                address: `${formData.address}, ${formData.locality}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
                city: formData.city,
                pincode: formData.pincode,
                totalAmount: product.price,
                paymentMethod: (paymentMethod === 'cod') ? 'COD' : 'Online',
                paymentStatus: paymentStatus,
                transactionId: transactionId,
                userId: user ? user.id : null,
                email: user ? user.email : null,
                orderStatus: 'Pending', // Explicitly Pending until Admin Approves
                items: [{
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: 1
                }]
            };

            const res = await axios.post('http://localhost:5000/api/orders', orderPayload);

            if (res.status === 201) {
                toast.success("Order Placed Successfully!");

                // Malayalam WhatsApp Message
                const orderIdShort = res.data._id.slice(-6).toUpperCase();
                const itemList = `${product.name} (x1)`;

                const paymentText = paymentMethod === 'cod' ? 'ക്യാഷ് ഓൺ ഡെലിവറി (COD) 🏠' : `ഓൺലൈൻ പേയ്മെന്റ് (${paymentMethod.toUpperCase()}) ✅`;

                const message = `
*പുതിയ ഓർഡർ ലഭിച്ചിരിക്കുന്നു!* 🛍️
--------------------------------
👤 *പേര്:* ${formData.name}
📱 *ഫോൺ:* ${formData.phone}
📍 *വിലാസം:* ${formData.address}, ${formData.locality || ''}, ${formData.city}, ${formData.pincode}
📦 *സാധനങ്ങൾ:* ${itemList}
💰 *ആകെ തുക:* ₹${product.price}
💳 *പേയ്മെന്റ്:* ${paymentText}
🆔 *ഓർഡർ ഐഡി:* #${orderIdShort}
--------------------------------
ഓർഡർ അപ്രൂവ് ചെയ്യുക. നന്ദി! 🙏
`.trim();

                const encodedMessage = encodeURIComponent(message);
                const whatsappUrl = `https://wa.me/919497893966?text=${encodedMessage}`;

                // Redirect to WhatsApp after short delay
                setTimeout(() => {
                    window.location.href = whatsappUrl;
                }, 1500);
            }
        } catch (error) {
            console.error("Order failed", error);
            toast.error("Order Failed. Please try again.");
        }
    };

    const initiatePayment = () => {
        // Validate Address First
        if (!formData.name || !formData.phone || !formData.pincode || !formData.address || !formData.city || !formData.state) {
            toast.error("Please fill in all address details.");
            return;
        }

        if (paymentMethod === 'cod') {
            handlePlaceOrder();
        } else {
            setShowPaymentModal(true);
        }
    };

    const handleMockPaymentSuccess = () => {
        setProcessingPayment(true);
        setTimeout(() => {
            setProcessingPayment(false);
            setShowPaymentModal(false);
            const mockTxnId = "PAY_MOCK_" + Date.now();
            handlePlaceOrder(mockTxnId);
        }, 2000); // Simulate 2s processing time
    };

    // Load Razorpay Script
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleRazorpayPayment = async () => {
        setProcessingPayment(true);
        const res = await loadRazorpayScript();

        if (!res) {
            toast.error('Razorpay SDK failed to load. Are you online?');
            setProcessingPayment(false);
            return;
        }

        try {
            // 1. Create Order
            const result = await axios.post('http://localhost:5000/api/orders/create-razorpay-order', {
                amount: product.price,
                receipt: 'receipt_' + Date.now()
            });

            const { amount, id: order_id, currency } = result.data;

            // 2. Open Razorpay Options
            const options = {
                key: razorpayKey, // Fetched from backend
                amount: amount.toString(),
                currency: currency,
                name: "Nilam Roots",
                description: "Purchase of " + product.name,
                image: "/assets/nilam_roots_green_bottle.png", // Replace with your logo URL
                order_id: order_id,
                handler: async function (response) {
                    // 3. Verify Payment
                    try {
                        const verifyRes = await axios.post('http://localhost:5000/api/orders/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyRes.data.success) {
                            setShowPaymentModal(false);
                            handlePlaceOrder(response.razorpay_payment_id); // Pass Transaction ID
                        } else {
                            toast.error("Payment Verification Failed");
                        }
                    } catch (error) {
                        toast.error("Payment Verification Failed");
                    }
                },
                prefill: {
                    name: formData.name,
                    email: user.email,
                    contact: formData.phone,
                },
                notes: {
                    address: formData.address,
                },
                theme: {
                    color: "#f97316", // Orange color
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
            setProcessingPayment(false);

        } catch (error) {
            console.error("Razorpay Error", error);
            toast.error("Unable to initiate payment");
            setProcessingPayment(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-stone-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

                {/* Left Column - Steps */}
                <div className="md:col-span-2 space-y-4">

                    {/* Step 1: Login */}
                    <div className="bg-white dark:bg-stone-800 p-4 shadow-sm rounded-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="bg-gray-200 dark:bg-stone-700 text-blue-600 dark:text-blue-400 px-2 py-1 text-xs font-bold rounded">1</span>
                                <h3 className="font-semibold text-gray-500 dark:text-gray-400 uppercase text-sm">Login</h3>
                            </div>
                            <Check size={18} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="pl-10 mt-2 text-sm text-gray-800 dark:text-gray-200 font-medium">{user ? `Logged in as ${user.name}` : 'Redirecting...'}</div>
                    </div>

                    {/* Step 2: Address */}
                    <div className="bg-white dark:bg-stone-800 shadow-sm rounded-xl overflow-hidden">
                        <div className={`p-4 flex items-center gap-4 ${orderStep === 1 ? 'bg-blue-600 text-white' : 'bg-white dark:bg-stone-800 border-b dark:border-stone-700'}`}>
                            <span className={`px-2 py-1 text-xs font-bold rounded ${orderStep === 1 ? 'bg-white text-blue-600' : 'bg-gray-200 dark:bg-stone-700 text-blue-600 dark:text-blue-400'}`}>2</span>
                            <h3 className={`font-semibold uppercase text-sm ${orderStep === 1 ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>Delivery Address</h3>
                        </div>

                        {orderStep === 1 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="border border-gray-300 dark:border-stone-600 dark:bg-stone-700 dark:text-white p-3 rounded focus:outline-none focus:border-blue-500" />
                                    <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="border border-gray-300 dark:border-stone-600 dark:bg-stone-700 dark:text-white p-3 rounded focus:outline-none focus:border-blue-500" />
                                    <input type="text" name="pincode" placeholder="Pincode" onChange={handleChange} className="border border-gray-300 dark:border-stone-600 dark:bg-stone-700 dark:text-white p-3 rounded focus:outline-none focus:border-blue-500" />
                                    <input type="text" name="locality" placeholder="Locality" onChange={handleChange} className="border border-gray-300 dark:border-stone-600 dark:bg-stone-700 dark:text-white p-3 rounded focus:outline-none focus:border-blue-500" />
                                    <textarea name="address" rows="3" placeholder="Address" onChange={handleChange} className="md:col-span-2 border border-gray-300 dark:border-stone-600 dark:bg-stone-700 dark:text-white p-3 rounded focus:outline-none focus:border-blue-500"></textarea>
                                    <input type="text" name="city" placeholder="City" onChange={handleChange} className="border border-gray-300 dark:border-stone-600 dark:bg-stone-700 dark:text-white p-3 rounded focus:outline-none focus:border-blue-500" />
                                    <select name="state" onChange={handleChange} className="border border-gray-300 dark:border-stone-600 dark:bg-stone-700 dark:text-white p-3 rounded focus:outline-none focus:border-blue-500">
                                        <option value="">--Select State--</option>
                                        <option value="Kerala">Kerala</option>
                                        <option value="Tamil Nadu">Tamil Nadu</option>
                                        <option value="Karnataka">Karnataka</option>
                                    </select>
                                    <button type="button" onClick={() => setOrderStep(2)} className="md:col-span-1 bg-orange-500 text-white font-bold py-3 uppercase text-sm rounded hover:bg-orange-600">
                                        Save and Deliver Here
                                    </button>
                                </form>
                            </motion.div>
                        )}
                        {orderStep > 1 && (
                            <div className="p-4 pl-10 text-sm text-gray-800 dark:text-gray-200">
                                <p className="font-bold">{formData.name} <span className="font-normal">{formData.address}</span></p>
                            </div>
                        )}
                    </div>

                    {/* Step 3: Order Summary */}
                    <div className="bg-white dark:bg-stone-800 shadow-sm rounded-xl overflow-hidden">
                        <div className={`p-4 flex items-center gap-4 ${orderStep === 2 ? 'bg-blue-600 text-white' : 'bg-white dark:bg-stone-800 border-b dark:border-stone-700'}`}>
                            <span className={`px-2 py-1 text-xs font-bold rounded ${orderStep === 2 ? 'bg-white text-blue-600' : 'bg-gray-200 dark:bg-stone-700 text-blue-600 dark:text-blue-400'}`}>3</span>
                            <h3 className={`font-semibold uppercase text-sm ${orderStep === 2 ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>Order Summary</h3>
                        </div>
                        {orderStep === 2 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
                                <div className="flex gap-4">
                                    <div className="w-24 h-24 bg-gray-100 dark:bg-stone-700 flex items-center justify-center rounded-lg">
                                        <img src="/assets/nilam_roots_green_bottle.png" alt={product.name} className="max-h-full max-w-full object-contain" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">{product.name}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Quantity: 1</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">₹{product.price}</p>
                                    </div>
                                </div>
                                <button onClick={() => setOrderStep(3)} className="mt-6 bg-orange-500 text-white font-bold py-3 px-8 uppercase text-sm rounded hover:bg-orange-600">
                                    Continue
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* Step 4: Payment */}
                    <div className="bg-white dark:bg-stone-800 shadow-sm rounded-xl overflow-hidden">
                        <div className={`p-4 flex items-center gap-4 ${orderStep === 3 ? 'bg-blue-600 text-white' : 'bg-white dark:bg-stone-800 border-b dark:border-stone-700'}`}>
                            <span className={`px-2 py-1 text-xs font-bold rounded ${orderStep === 3 ? 'bg-white text-blue-600' : 'bg-gray-200 dark:bg-stone-700 text-blue-600 dark:text-blue-400'}`}>4</span>
                            <h3 className={`font-semibold uppercase text-sm ${orderStep === 3 ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>Payment Options</h3>
                        </div>

                        {orderStep === 3 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col md:flex-row min-h-[400px]">
                                {/* Sidebar - Payment Methods */}
                                <div className="md:w-1/3 bg-gray-50 dark:bg-stone-900 border-r border-gray-200 dark:border-stone-700">
                                    <div className="p-4 border-b border-gray-200 dark:border-stone-700 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                                        Payment Options
                                    </div>
                                    <div className="flex flex-col">
                                        <button
                                            onClick={() => setPaymentMethod('upi')}
                                            className={`p-4 text-left font-medium text-sm flex items-center gap-3 transition-colors ${paymentMethod === 'upi' ? 'bg-white dark:bg-stone-800 text-blue-600 border-l-4 border-blue-600 shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-stone-800'}`}
                                        >
                                            <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center"><img src="https://cdn-icons-png.flaticon.com/128/196/196566.png" className="w-4" alt="" /></div>
                                            UPI / Pay Online
                                        </button>
                                        <button
                                            onClick={() => setPaymentMethod('cod')}
                                            className={`p-4 text-left font-medium text-sm flex items-center gap-3 transition-colors ${paymentMethod === 'cod' ? 'bg-white dark:bg-stone-800 text-blue-600 border-l-4 border-blue-600 shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-stone-800'}`}
                                        >
                                            <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center"><Truck size={14} /></div>
                                            Cash on Delivery
                                        </button>
                                    </div>
                                </div>

                                {/* Main Content - Payment Details form */}
                                <div className="md:w-2/3 p-6 bg-white dark:bg-stone-800">
                                    {paymentMethod === 'upi' && (
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="font-bold text-gray-800 dark:text-white mb-2">Pay securely with Razorpay</h4>
                                                <p className="text-sm text-gray-500 mb-6">UPI, Wallets, Debit/Credit Cards all supported.</p>
                                                <div className="bg-gray-50 dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg p-6 flex flex-col items-center">
                                                    <div className="bg-white p-4 rounded-lg mb-4 shadow">
                                                        <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="w-16 h-16" />
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Fast & Secure Payments</p>
                                                </div>
                                            </div>
                                            <button onClick={handleRazorpayPayment} disabled={processingPayment} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded shadow transition-colors flex justify-center items-center gap-2">
                                                {processingPayment ? (
                                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                                ) : (
                                                    `PAY ₹${product.price} NOW`
                                                )}
                                            </button>
                                            <div className="flex justify-center gap-4 mt-4 opacity-70 grayscale hover:grayscale-0 transition-all">
                                                <img src="https://cdn-icons-png.flaticon.com/128/6124/6124998.png" className="h-8" alt="GPay" />
                                                <img src="https://cdn-icons-png.flaticon.com/128/888/888870.png" className="h-8" alt="Paytm" />
                                                <img src="https://cdn-icons-png.flaticon.com/128/2175/2175515.png" className="h-8" alt="PhonePe" />
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === 'cod' && (
                                        <div className="h-full flex flex-col justify-center">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                                    <Truck size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-800 dark:text-white text-lg">Cash on Delivery</h4>
                                                    <p className="text-sm text-gray-500">Pay via Cash/UPI when you receive the order.</p>
                                                </div>
                                            </div>

                                            {/* Captcha/Confirmation Simulation */}
                                            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 border border-orange-100 dark:border-orange-800/50 rounded mb-6 text-sm text-orange-800 dark:text-orange-200 flex gap-2">
                                                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                                                <p>Due to high demand, please ensure you are available to receive the delivery.</p>
                                            </div>

                                            <button onClick={() => handlePlaceOrder()} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded shadow transition-colors">
                                                CONFIRM ORDER
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Right Column - Price Details */}
                <div className="md:col-span-1">
                    <div className="bg-white dark:bg-stone-800 p-4 shadow-sm rounded-xl sticky top-24">
                        <h3 className="uppercase text-gray-500 dark:text-gray-400 font-semibold text-sm border-b dark:border-stone-700 pb-3 mb-3">Price Details</h3>
                        <div className="space-y-3 text-sm text-gray-800 dark:text-gray-200">
                            <div className="flex justify-between">
                                <span>Price (1 item)</span>
                                <span>₹{product.price}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Charges</span>
                                <span>FREE</span>
                            </div>
                            <div className="border-t border-dashed dark:border-stone-600 my-2"></div>
                            <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                                <span>Total Amount</span>
                                <span>₹{product.price}</span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-green-600 text-xs font-bold">
                            <ShieldCheck size={16} />
                            Safe & Secure Payments
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal (Previously used for mock, kept in case needed or removed) */}
            {/* Keeping it simple - Modal removed as Razorpay handles the overlay */}
        </div>
    );
};

export default Checkout;
