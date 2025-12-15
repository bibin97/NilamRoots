
import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Leaf, Heart, Droplets, Sun } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-900 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="text-gold-600 font-semibold tracking-widest uppercase text-sm">Our Story</span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-green-900 dark:text-white mt-2 mb-6">Rooted in Nature, Crafted with Love</h1>
                    <div className="h-1 w-20 bg-gold-500 mx-auto rounded-full"></div>
                </Motion.div>

                {/* Main Story Content */}
                <div className="space-y-12">
                    <Motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="prose prose-lg prose-stone dark:prose-invert mx-auto text-gray-700 dark:text-gray-300 bg-white dark:bg-stone-800 p-8 md:p-12 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-700"
                    >
                        <p className="lead text-xl font-medium text-green-800 dark:text-green-400 mb-6">
                            It all started with a grandmother's recipe and a desire to bring pure, unadulterated healing to the world.
                        </p>
                        <p className="mb-6">
                            At <strong>NilamRoots</strong>, we believe that true beauty comes from nature's purest ingredients.
                            Our journey began in the lush green landscapes of Kerala, where traditional Ayurveda is not just a practice, but a way of life.
                        </p>
                        <p className="mb-6">
                            Witnessing the struggle with modern hair problems—hairfall, premature greying, and dandruff—<strong>Laly and Sneha</strong>, the mother-daughter duo behind Nilam, decided to turn to their roots.
                            They revived an age-old method of making hair oil: <span className="text-gold-600 font-semibold">The Cold-Infusion Process</span>.
                        </p>
                        <p>
                            We don't just mix oils; we create a potent elixir. Our distinct <strong>Signature Black Oil</strong> gets its rich, dark color not from artificial dyes,
                            but from the potent infusion of roasted herbs, iron-rich hibiscus, and organic amla, slow-cooked to perfection.
                        </p>
                    </Motion.section>

                    {/* Values Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <Motion.div
                            whileHover={{ y: -5 }}
                            className="bg-green-900 dark:bg-stone-800 text-white p-8 rounded-3xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Leaf size={100} />
                            </div>
                            <h3 className="text-2xl font-serif font-bold mb-4 flex items-center gap-2">
                                <Leaf className="text-gold-400" /> Pure Ingredients
                            </h3>
                            <p className="text-green-100 leading-relaxed">
                                We source our coconuts from certified organic farms. No mineral oils, no silicones, just 100% natural goodness that you can trust.
                            </p>
                        </Motion.div>

                        <Motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white dark:bg-stone-800 p-8 rounded-3xl border border-gold-100 dark:border-stone-700 shadow-lg relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 text-gold-600">
                                <Sun size={100} />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-green-900 dark:text-white mb-4 flex items-center gap-2">
                                <Sun className="text-gold-500" /> Traditional Process
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Our oil is prepared in traditional earthen pots and sunlight-charged for 48 hours to activate the potent alkalizing properties of the herbs.
                            </p>
                        </Motion.div>
                    </div>

                    <Motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-stone-100 dark:bg-stone-800 p-8 md:p-12 rounded-3xl text-center"
                    >
                        <Heart className="mx-auto text-red-500 mb-4" size={40} fill="currentColor" />
                        <h2 className="text-3xl font-serif font-bold text-green-900 dark:text-white mb-4">Our Promise to You</h2>
                        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                            We promise that every bottle of Nilam Herbal Hair Oil is packed with the same care and love as the first batch we made for our family.
                            Let nature heal you.
                        </p>
                    </Motion.section>
                </div>
            </div>
        </div>
    );
};

export default About;
