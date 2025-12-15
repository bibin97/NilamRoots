
import React from 'react';
import { Phone, Mail, MapPin, Instagram, MessageCircle } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const Contact = () => {
    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-green-900 dark:text-white mb-4">Get in Touch</h1>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
                        Have questions about our hair oil? We are here to help you achieve your dream hair.
                    </p>
                </Motion.div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Contact Info */}
                    <Motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-stone-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-stone-700"
                    >
                        <h2 className="text-2xl font-serif font-bold text-green-900 dark:text-white mb-8">Contact Information</h2>

                        <div className="space-y-8">
                            <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 bg-gold-100 dark:bg-gold-900/40 rounded-full flex items-center justify-center text-gold-600 dark:text-gold-500">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone & WhatsApp</p>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">+91 9497893966</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 bg-gold-100 dark:bg-gold-900/40 rounded-full flex items-center justify-center text-gold-600 dark:text-gold-500">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">nilam.roots@gmail.com</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="h-12 w-12 bg-gold-100 dark:bg-gold-900/40 rounded-full flex items-center justify-center text-gold-600 dark:text-gold-500 flex-shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white leading-relaxed">
                                        Chungathara PO,<br />
                                        Kaippini, Nilambur Thaluk,<br />
                                        Malappuram District, Kerala
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Connect with us</h3>
                            <div className="flex space-x-4">
                                <button className="h-10 w-10 bg-gray-100 dark:bg-stone-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gold-500 hover:text-white transition-colors">
                                    <Instagram size={20} />
                                </button>
                                <a
                                    href={`https://wa.me/919497893966?text=${encodeURIComponent("നമസ്കാരം, എനിക്ക് ഉൽപ്പന്നങ്ങളെക്കുറിച്ച് കൂടുതൽ വിവരങ്ങൾ അറിയണം. (Hello, I would like to know more details about the products.)")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                                >
                                    <MessageCircle size={20} />
                                </a>
                            </div>
                        </div>
                    </Motion.div>

                    {/* Map or Form Image */}
                    <Motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="md:h-[600px] rounded-3xl overflow-hidden shadow-2xl relative"
                    >
                        {/* Using the generated healthy hair model image as a vibe setter since no map provided */}
                        <img
                            src="/assets/healthy_hair_model.png"
                            alt="Healthy Hair"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent flex items-end p-8">
                            <p className="text-white text-xl font-medium">
                                "Our handmade herbal oil has transformed thousands of lives. Be the next one."
                            </p>
                        </div>
                    </Motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
