
import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="relative h-screen w-full overflow-hidden bg-stone-50 dark:bg-stone-900 transition-colors duration-300">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gold-400/10 rounded-l-[100px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col md:flex-row items-center justify-between pt-20">

                {/* Text Content */}
                <Motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="md:w-1/2 space-y-6 z-10"
                >
                    <span className="text-gold-600 font-semibold tracking-widest uppercase text-sm">Premium Hair Care</span>
                    <h1 className="text-5xl lg:text-7xl font-serif font-bold text-green-900 dark:text-white leading-[1.1] mb-6">
                        Nilam <span className="text-gold-500 italic">Roots</span>
                        <div className="mt-2 block">Pure. Potent. Personal.</div>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-lg leading-relaxed pt-2">
                        Experience the power of homemade perfection. Say goodbye to hairfall and dandruff with our award-winning herbal formula.
                    </p>
                    <div className="flex space-x-4 pt-4">
                        <Link to="/products" className="bg-green-900 text-white px-8 py-4 rounded-full font-medium hover:bg-green-800 transition-all transform hover:scale-105 shadow-lg shadow-green-900/20 inline-block text-center">
                            Shop Now
                        </Link>
                        <Link to="/about" className="border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 px-8 py-4 rounded-full font-medium hover:border-gold-500 hover:text-gold-600 transition-all flex items-center justify-center">
                            Our Story
                        </Link>
                    </div>

                    <div className="pt-12 flex space-x-8">
                        <div>
                            <p className="text-3xl font-bold text-gray-800 dark:text-white">100%</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Natural Ingredients</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-800 dark:text-white">2k+</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Happy Clients</p>
                        </div>
                    </div>
                </Motion.div>

                {/* Image Content */}
                <Motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="md:w-1/2 relative flex justify-center items-center h-full"
                >
                    {/* Main Product Image */}
                    <div className="relative w-80 h-96 md:w-[500px] md:h-[600px]">
                        {/* Using the generated image path */}
                        <Motion.img
                            animate={{ y: [0, -20, 0] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            src="/assets/nilam_roots_bottle.jpg"
                            alt="Premium Herbal Hair Oil"
                            className="object-cover w-full h-full drop-shadow-2xl rounded-3xl"
                        />

                        {/* Floating Ingredient Badge - Example */}
                        <Motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ repeat: Infinity, duration: 5, delay: 1, ease: "easeInOut" }}
                            className="absolute -bottom-10 -left-10 bg-white dark:bg-stone-800 p-4 rounded-2xl shadow-xl flex items-center space-x-3 max-w-xs"
                        >
                            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-700 dark:text-green-300">🌿</div>
                            <div>
                                <p className="font-bold text-gray-800 dark:text-white">Handmade with Love</p>
                                <p className="text-xs text-gray-500 dark:text-gray-300">By Laly & Sneha</p>
                            </div>
                        </Motion.div>
                    </div>
                </Motion.div>
            </div>
        </section>
    );
};

export default Hero;
