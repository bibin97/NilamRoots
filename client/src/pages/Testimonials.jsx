
import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: "Sajith Joseph",
        rating: 5,
        review: "Absolutely amazing! The hair oil has completely transformed my hair texture. Highly recommended!",
        image: "/assets/sajith.png"
    },
    {
        name: "Akhil Lukos",
        rating: 5,
        review: "I was skeptical at first, but the results speak for themselves. My hair feels stronger and healthier.",
        image: "/assets/akhil.png"
    },
    {
        name: "Nithin Joseph",
        rating: 5,
        review: "The best herbal oil I've ever used. The smell is natural and pleasant, and it really works.",
        image: "/assets/nithin.png"
    },
    {
        name: "Sneha Thankachan",
        rating: 5,
        review: "Love the product! It's so gentle on the scalp and has reduced my hair fall significantly.",
        image: "/assets/sneha.png"
    },
    {
        name: "Abin Thankachan",
        rating: 5,
        review: "Great quality and authentic ayurvedic ingredients. You can feel the difference from the first use.",
        image: "/assets/abin.jpg"
    },
    {
        name: "Bibin Thankachan",
        rating: 5,
        review: "Excellent product! Delivery was fast and the packaging was great. Will definitely buy again.",
        image: "/assets/bibin_real.jpg"
    }
];





const Testimonials = () => {
    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="text-gold-600 font-semibold tracking-widest uppercase text-sm">Customer Stories</span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-green-900 dark:text-white mt-2 mb-6">What Our Customers Say</h1>
                    <div className="h-1 w-20 bg-gold-500 mx-auto rounded-full"></div>
                </Motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                            className="bg-white dark:bg-stone-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-stone-700 relative"
                        >
                            <div className="absolute top-8 right-8 text-gold-200">
                                <Quote size={40} fill="currentColor" />
                            </div>

                            {/* User Profile */}
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-gold-200 shadow-sm flex-shrink-0">
                                    <img src={testimonial.image} alt={testimonial.name} className="h-full w-full object-cover" />
                                </div>
                                <h3 className="font-bold text-green-900 dark:text-white text-lg">{testimonial.name}</h3>
                            </div>

                            {/* Rating */}
                            <div className="flex text-gold-500 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} size={20} fill="currentColor" />
                                ))}
                            </div>

                            {/* Review Text */}
                            <p className="text-gray-600 dark:text-gray-300 mb-2 italic leading-relaxed">
                                "{testimonial.review}"
                            </p>

                        </Motion.div>
                    ))}
                </div>


            </div>
        </div>
    );
};

export default Testimonials;
