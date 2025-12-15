import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Package, LogOut, ChevronRight, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const AccountLayout = ({ children }) => {
    const { user, logout, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 flex justify-center items-start">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col justify-center items-center">
                <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
                <Link to="/login" className="bg-orange-500 text-white px-6 py-2 rounded-full">Go to Login</Link>
            </div>
        );
    }

    const navItems = [
        { path: '/my-orders', label: 'My Orders', icon: Package },
        { path: '/account-settings', label: 'Account Settings', icon: User },
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-stone-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* Sidebar */}
                <div className="md:col-span-1 space-y-4">
                    {/* User Profile Card */}
                    <div className="bg-white dark:bg-stone-800 shadow-sm rounded-xl p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-xl font-bold text-white">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Hello,</p>
                            <h3 className="font-bold text-gray-800 dark:text-white truncate">{user.name}</h3>
                        </div>
                    </div>

                    {/* Navigation Menu (Flipkart Style) */}
                    <div className="bg-white dark:bg-stone-800 shadow-sm rounded-xl overflow-hidden">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center justify-between p-4 border-b border-gray-100 dark:border-stone-700 hover:bg-gray-50 dark:hover:bg-stone-700 transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-300'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={20} className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'} />
                                        <span>{item.label}</span>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-400" />
                                </Link>
                            );
                        })}

                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-between p-4 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-stone-700 transition-colors hover:text-red-500"
                        >
                            <div className="flex items-center gap-3">
                                <LogOut size={20} />
                                <span>Logout</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="md:col-span-3">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-stone-800 shadow-sm rounded-xl min-h-[500px] p-6"
                    >
                        {children}
                    </motion.div>
                </div>

            </div>
        </div>
    );
};

export default AccountLayout;
