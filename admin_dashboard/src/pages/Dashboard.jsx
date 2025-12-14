
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Clock, Package, TrendingUp } from 'lucide-react';

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('all'); // all, pending, approved

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/orders');
            setOrders(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleApprove = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/orders/${id}/approve`);
            fetchOrders(); // Refresh
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            try {
                await axios.put(`http://localhost:5000/api/orders/${id}/cancel`);
                fetchOrders();
            } catch (error) {
                console.error("Error cancelling order", error);
            }
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'pending') return !order.isApproved;
        if (filter === 'approved') return order.isApproved;
        return true;
    });

    const pendingCount = orders.filter(o => !o.isApproved).length;
    const revenue = orders.filter(o => o.isApproved).reduce((acc, curr) => acc + curr.totalAmount, 0);

    return (
        <div className="min-h-screen bg-gray-50 pt-12 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                            <Package size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Pending Approval</p>
                            <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
                        </div>
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-full">
                            <Clock size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Revenue</p>
                            <p className="text-2xl font-bold text-green-600">₹{revenue}</p>
                        </div>
                        <div className="p-3 bg-green-50 text-green-600 rounded-full">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'all' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        All Orders
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'pending' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        Pending Approval
                    </button>
                    <button
                        onClick={() => setFilter('approved')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'approved' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        Approved
                    </button>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Order ID</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Customer</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Amount</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Payment</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map(order => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="p-4 text-sm text-gray-500 font-mono">#{order._id.slice(-6).toUpperCase()}</td>
                                        <td className="p-4 text-sm text-gray-900">
                                            <div className="font-medium">{order.customerName}</div>
                                            <div className="text-gray-400 text-xs">{order.phoneNumber}</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-900 font-medium">₹{order.totalAmount}</td>
                                        <td className="p-4 text-sm">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${order.paymentMethod === 'Online' ? 'bg-purple-50 text-purple-700' : 'bg-yellow-50 text-yellow-700'
                                                }`}>
                                                {order.paymentMethod}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${order.orderStatus === 'Cancelled' ? 'bg-red-50 text-red-700' :
                                                order.isApproved ? 'bg-green-50 text-green-700' :
                                                    'bg-orange-50 text-orange-700'
                                                }`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {order.orderStatus !== 'Cancelled' && !order.isApproved && (
                                                    <button
                                                        onClick={() => handleApprove(order._id)}
                                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1"
                                                    >
                                                        <CheckCircle size={14} /> Approve
                                                    </button>
                                                )}
                                                {order.orderStatus !== 'Cancelled' && (
                                                    <button
                                                        onClick={() => handleCancel(order._id)}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredOrders.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-gray-400">No orders found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
