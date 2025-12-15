
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User, LogOut, LogIn, Package } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        setIsOpen(false);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-stone-900/80 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="relative">
                            <img src="/logo.png" alt="Nilam Roots" className="h-12 w-12 object-contain transform group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-serif font-bold text-gray-900 dark:text-white leading-none tracking-wide">Nilam</span>
                            <span className="text-xs font-sans text-amber-600 font-bold tracking-[0.2em]">ROOTS</span>
                        </div>
                    </Link>

                    {/* Desktop Menu - Centered */}
                    <div className="hidden md:flex space-x-8 items-center bg-white/50 dark:bg-black/20 backdrop-blur-sm px-8 py-2 rounded-full border border-white/20 shadow-sm">
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/products">Shop</NavLink>
                        <NavLink to="/about">Our Story</NavLink>
                        <NavLink to="/testimonials">Reviews</NavLink>
                        <NavLink to="/contact">Contact</NavLink>
                    </div>

                    {/* Right Icons */}
                    <div className="hidden md:flex items-center space-x-5">
                        <ThemeToggle />

                        <div className="relative flex items-center">
                            <AnimatePresence>
                                {isSearchOpen && (
                                    <Motion.form
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 200, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        onSubmit={handleSearchSubmit}
                                        className="overflow-hidden mr-2"
                                    >
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search..."
                                            className="w-full bg-gray-100 dark:bg-stone-800 border-none rounded-full px-4 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-gray-800 dark:text-white"
                                            autoFocus
                                        />
                                    </Motion.form>
                                )}
                            </AnimatePresence>
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="text-gray-700 dark:text-gray-200 hover:text-amber-600 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-stone-800 rounded-full"
                            >
                                <Search size={20} />
                            </button>
                        </div>

                        <Link to="/cart" className="relative text-gray-700 dark:text-gray-200 hover:text-amber-600 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-stone-800 rounded-full group">
                            <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white dark:border-stone-900">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center gap-2 pl-2 focus:outline-none">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 flex items-center justify-center text-stone-800 font-bold shadow-md ring-2 ring-white dark:ring-stone-800 overflow-hidden">
                                        {user.profilePicture ? (
                                            <img
                                                src={`http://localhost:5000/${user.profilePicture}`}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            user.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-stone-800 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 border border-gray-100 dark:border-stone-700">
                                    <div className="px-4 py-2 border-b border-gray-100 dark:border-stone-700">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    <Link to="/account-settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-stone-700 hover:text-amber-600 transition-colors">
                                        <div className="flex items-center gap-2"><User size={16} /> Profile</div>
                                    </Link>
                                    <Link to="/my-orders" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-stone-700 hover:text-amber-600 transition-colors">
                                        <div className="flex items-center gap-2"><Package size={16} /> My Orders</div>
                                    </Link>
                                    <div className="border-t border-gray-100 dark:border-stone-700 mt-1"></div>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                        <div className="flex items-center gap-2"><LogOut size={16} /> Logout</div>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-5 py-2 rounded-full font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                                <User size={16} /> Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <Link to="/cart" className="relative text-gray-800 dark:text-white">
                            <ShoppingCart size={24} />
                            {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
                        </Link>
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 dark:text-gray-200 p-2">
                            {isOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <Motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-gray-100 dark:border-stone-800 shadow-xl"
                    >
                        <div className="px-6 py-6 space-y-4 flex flex-col">
                            <MobileNavLink to="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
                            <MobileNavLink to="/products" onClick={() => setIsOpen(false)}>Shop</MobileNavLink>
                            <MobileNavLink to="/about" onClick={() => setIsOpen(false)}>Our Story</MobileNavLink>
                            <MobileNavLink to="/testimonials" onClick={() => setIsOpen(false)}>Reviews</MobileNavLink>

                            <hr className="border-gray-200 dark:border-stone-700 my-2" />

                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 py-2">
                                        <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-white font-bold text-lg">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <MobileNavLink to="/account-settings" onClick={() => setIsOpen(false)}>Account Settings</MobileNavLink>
                                    <MobileNavLink to="/my-orders" onClick={() => setIsOpen(false)}>My Orders</MobileNavLink>
                                    <button onClick={handleLogout} className="text-red-500 font-bold py-2 flex items-center gap-2">
                                        Logout <LogOut size={16} />
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 py-3 rounded-xl font-bold text-center shadow" onClick={() => setIsOpen(false)}>
                                    Login / Sign Up
                                </Link>
                            )}

                            <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-100 dark:border-stone-800">
                                <span className="text-sm text-gray-500">Theme</span>
                                <ThemeToggle />
                            </div>
                        </div>
                    </Motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const NavLink = ({ to, children }) => (
    <Link to={to} className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium text-sm transition-colors relative group">
        {children}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full"></span>
    </Link>
);

const MobileNavLink = ({ to, onClick, children }) => (
    <Link to={to} onClick={onClick} className="text-gray-800 dark:text-gray-200 text-lg font-medium py-2 border-b border-gray-50 dark:border-stone-800 last:border-0 hover:pl-2 transition-all">
        {children}
    </Link>
);

export default Navbar;
