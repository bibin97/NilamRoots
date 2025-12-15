
import React, { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Check, Package, Truck, Home, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

const OrderSuccess = () => {
    const [orderId] = useState(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);

    useEffect(() => {
        // Trigger confetti celebration
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults, partyCount: particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults, partyCount: particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);
    }, []);

    const steps = [
        { icon: Package, label: 'Order Placed', status: 'completed', date: new Date().toLocaleDateString() },
        { icon: Check, label: 'Confirmed', status: 'current', date: 'Pending Confirmation' },
        { icon: Truck, label: 'Shipped', status: 'upcoming', date: 'Expected shortly' },
        { icon: Home, label: 'Delivered', status: 'upcoming', date: 'Within 3-5 days' }
    ];

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center transition-colors duration-300">

            <Motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="bg-white dark:bg-stone-800 p-8 rounded-3xl shadow-xl max-w-2xl w-full text-center border border-gray-100 dark:border-stone-700"
            >
                <div className="h-20 w-20 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check size={40} className="text-green-600 dark:text-green-300" />
                </div>

                <h1 className="text-3xl font-serif font-bold text-green-900 dark:text-green-400 mb-2">Order Request Sent!</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    Thank you for choosing NilamRoots. We have received your order request via WhatsApp. Our team will verify and confirm your order shortly.
                </p>

                <div className="bg-stone-50 dark:bg-stone-900 rounded-xl p-6 mb-8 border border-gray-100 dark:border-stone-700 text-left">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-stone-700 pb-4">
                        <span className="text-gray-500 dark:text-gray-400">Order ID</span>
                        <span className="font-mono font-bold text-gray-900 dark:text-white">{orderId}</span>
                    </div>

                    {/* Progress Tracker */}
                    <div className="relative">
                        <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200 dark:bg-stone-700" style={{ height: '80%' }}></div>
                        <div className="space-y-8 relative">
                            {steps.map((step, index) => (
                                <div key={index} className="flex items-start space-x-4">
                                    <div className={`relative z-10 flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center border-2 ${step.status === 'completed' ? 'bg-green-600 border-green-600 text-white' :
                                        step.status === 'current' ? 'bg-white dark:bg-stone-800 border-gold-500 text-gold-500 animate-pulse' :
                                            'bg-white dark:bg-stone-800 border-gray-300 dark:border-stone-600 text-gray-300 dark:text-stone-600'
                                        }`}>
                                        <step.icon size={14} />
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-bold text-sm ${step.status === 'upcoming' ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                                            {step.label}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{step.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* New Procedure Section */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-stone-700">
                        <h3 className="font-serif font-bold text-gray-900 dark:text-white mb-4">What Happens Next? (അടുത്തത് എന്ത്?)</h3>
                        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex gap-3">
                                <div className="text-gold-500 font-bold shrink-0">1.</div>
                                <p>Our team (Laly or Sneha) will check your WhatsApp message and confirm stock.</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="text-gold-500 font-bold shrink-0">2.</div>
                                <p>You will receive a payment link via WhatsApp (GPay/UPI).</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="text-gold-500 font-bold shrink-0">3.</div>
                                <p>Once paid, we will pack your herbal oil and share the Tracking ID (DTDC/Speed Post).</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="text-gold-500 font-bold shrink-0">4.</div>
                                <p>You will get delivery updates directly on your WhatsApp.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <Link to="/" className="inline-flex items-center space-x-2 bg-green-900 text-white px-8 py-3 rounded-full hover:bg-green-800 transition-all transform hover:scale-105 shadow-lg shadow-green-900/20">
                        <span>Continue Shopping</span>
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </Motion.div>
        </div>
    );
};

export default OrderSuccess;
