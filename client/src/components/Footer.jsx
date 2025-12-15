
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
    return (
        <footer className="bg-green-950 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center space-x-3 text-2xl font-serif font-bold tracking-wider">
                            <img src="/logo.png" alt="Nilam Roots" className="h-12 w-12 object-contain" />
                            <span>Nilam <span className="text-gold-400">Roots</span></span>
                        </Link>
                        <p className="text-gray-300 leading-relaxed">
                            Drafted with care and rooted in tradition, our herbal oils bring nature's purest healing to your hair. Authentic, organic, and effective.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="h-10 w-10 rounded-full bg-green-900 flex items-center justify-center hover:bg-gold-500 transition-colors">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-serif font-bold mb-6 text-gold-400">Quick Links</h3>
                        <ul className="flex flex-wrap gap-x-6 gap-y-2">
                            <li>
                                <Link to="/" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">Home</Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">Shop Now</Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">Our Story</Link>
                            </li>
                            <li>
                                <Link to="/testimonials" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">Reviews</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">Contact Us</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-green-900 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} NilamRoots. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="#" className="hover:text-gold-400 transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-gold-400 transition-colors">Terms of Service</Link>
                        <Link to="#" className="hover:text-gold-400 transition-colors">Shipping Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
