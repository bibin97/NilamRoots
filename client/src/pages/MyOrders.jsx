import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import AccountLayout from '../components/AccountLayout';

const MyOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/orders');
            // Filter by user
            const userOrders = res.data.filter(order =>
                order.userId === user.id || order.email === user.email || order.phoneNumber === user.phone
            );
            setOrders(userOrders);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AccountLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
            </AccountLayout>
        );
    }

    return (
        <AccountLayout>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <div className="bg-gray-50 dark:bg-stone-900 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">You haven't placed any orders yet!</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">Order something from our store and check back here.</p>
                    <Link to="/products" className="bg-blue-600 text-white px-6 py-2.5 rounded shadow hover:bg-blue-700 transition font-medium">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded hover:shadow-md transition cursor-pointer"
                        >
                            <div className="p-4 flex gap-4">
                                {/* Product Image */}
                                <div className="w-20 h-20 flex-shrink-0">
                                    <div className="w-full h-full bg-gray-100 dark:bg-stone-700 rounded flex items-center justify-center">
                                        <img src="/assets/nilam_roots_green_bottle.png" alt="Product" className="max-h-16 object-contain" />
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                        {order.items && order.items[0]?.name || 'Nilam Roots Hair Oil'}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Qty: {order.items && order.items[0]?.quantity || 1}</p>
                                    <p className="text-xs text-gray-400 mt-1">Ordered on {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>

                                {/* Price */}
                                <div className="text-right">
                                    <p className="font-bold text-gray-900 dark:text-white">₹{order.totalAmount}</p>
                                </div>

                                {/* Status */}
                                <div className="hidden md:block w-1/3 pl-8">
                                    <div className="flex items-start gap-2">
                                        <div className={`mt-1 w-3 h-3 rounded-full ${order.orderStatus === 'Delivered' ? 'bg-green-500' : order.orderStatus === 'Cancelled' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                {order.orderStatus === 'Delivered' ? 'Delivered' : order.orderStatus === 'Cancelled' ? 'Cancelled' : !order.isApproved ? 'Waiting for Approval' : 'Order Confirmed'}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {order.orderStatus === 'Cancelled' ? 'This order has been cancelled.' : !order.isApproved ? 'Waiting for admin approval.' : `Your item has been ${order.orderStatus?.toLowerCase()}.`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Status Only */}
                            <div className="md:hidden px-4 pb-4 pt-0">
                                <div className="flex items-center gap-2 text-sm">
                                    <div className={`w-2 h-2 rounded-full ${order.orderStatus === 'Delivered' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">{order.orderStatus}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </AccountLayout>
    );
};

export default MyOrders;
