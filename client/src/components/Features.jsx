
import React from 'react';
import { motion as Motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Sprout } from 'lucide-react';

const Features = () => {
    const features = [
        {
            icon: <ShieldCheck size={40} />,
            title: "Stop Hairfall",
            desc: "Strengthens roots from within, reducing hairfall by up to 90% in just 4 weeks.",
            color: "bg-red-50 text-red-600"
        },
        {
            icon: <Sparkles size={40} />,
            title: "Goodbye Dandruff",
            desc: "Antifungal herbal properties eliminate dandruff and soothe itchy scalp permanently.",
            color: "bg-blue-50 text-blue-600"
        },
        {
            icon: <Sprout size={40} />,
            title: "Promote Regrowth",
            desc: "Stimulates dormant follicles to encourage new, thick, and healthy hair growth.",
            color: "bg-green-50 text-green-600"
        }
    ];

    return (
        <section className="py-20 bg-white dark:bg-stone-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-gold-600 font-semibold tracking-widest uppercase text-sm">Why Choose Nilam</span>
                    <h2 className="text-4xl font-serif font-bold text-green-900 dark:text-white mt-2">The Miracle Cure for Your Hair</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-white dark:bg-stone-800 p-8 rounded-3xl border border-gray-100 dark:border-stone-700 hover:shadow-xl transition-shadow group"
                        >
                            <div className={`h-20 w-20 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {feature.desc}
                            </p>
                        </Motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
