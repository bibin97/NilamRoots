
import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-stone-50 dark:bg-stone-900 transition-colors duration-300 pb-10">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-gold-400/10 rounded-none md:rounded-l-[100px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col md:flex-row items-center justify-center md:justify-between pt-24 md:pt-20 gap-10 md:gap-0">

                {/* Text Content */}
                <Motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full md:w-1/2 space-y-6 z-10 text-center md:text-left"
                >
                    <span className="text-gold-600 font-semibold tracking-widest uppercase text-xs md:text-sm">Premium Hair Care</span>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-green-900 dark:text-white leading-tight mb-4 md:mb-6">
                        Nilam <span className="text-gold-500 italic">Roots</span>
                        <div className="mt-2 block text-3xl md:text-5xl lg:text-7xl">Pure. Potent. Personal.</div>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg lg:text-xl max-w-lg mx-auto md:mx-0 leading-relaxed pt-2">
                        Experience the power of homemade perfection. Say goodbye to hairfall and dandruff with our award-winning herbal formula.
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4 justify-center md:justify-start">
                        <Link to="/products" className="bg-green-900 text-white px-8 py-3 md:py-4 rounded-full font-medium hover:bg-green-800 transition-all transform hover:scale-105 shadow-lg shadow-green-900/20 inline-block text-center text-sm md:text-base">
                            Shop Now
                        </Link>
                        <Link to="/about" className="border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 px-8 py-3 md:py-4 rounded-full font-medium hover:border-gold-500 hover:text-gold-600 transition-all flex items-center justify-center text-sm md:text-base">
                            Our Story
                        </Link>
                    </div>

                    <div className="pt-8 md:pt-12 flex justify-center md:justify-start space-x-8">
                        <div>
                            <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">100%</p>
                            <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">Natural Ingredients</p>
                        </div>
                        <div>
                            <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">2k+</p>
                            <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">Happy Clients</p>
                        </div>
                    </div>
                </Motion.div>

                {/* Image Content */}
                <Motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-full md:w-1/2 relative flex justify-center items-center h-full pb-10 md:pb-0"
                >
                    {/* Main Product Image */}
                    <div className="relative w-64 h-80 sm:w-80 sm:h-96 md:w-[500px] md:h-[600px]">
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
                            className="absolute -bottom-6 -left-4 md:-bottom-10 md:-left-10 bg-white dark:bg-stone-800 p-3 md:p-4 rounded-2xl shadow-xl flex items-center space-x-3 max-w-[200px] md:max-w-xs"
                        >
                            <div className="h-10 w-10 md:h-12 md:w-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-700 dark:text-green-300 text-lg md:text-xl">🌿</div>
                            <div>
                                <p className="font-bold text-sm md:text-base text-gray-800 dark:text-white">Handmade with Love</p>
                                <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-300">By Laly & Sneha</p>
                            </div>
                        </Motion.div>
                    </div>
                </Motion.div>
            </div>
        </section>
    );
};

export default Hero;
