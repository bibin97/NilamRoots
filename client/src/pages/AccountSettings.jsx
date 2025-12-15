import React, { useState, useEffect } from 'react';
import AccountLayout from '../components/AccountLayout';
import { useAuth } from '../context/AuthContext';
import { User, Save, Plus, Trash2, Edit2 } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AccountSettings = () => {
    const { user, updateUser } = useAuth();
    const [personalInfo, setPersonalInfo] = useState({
        name: '',
        phone: ''
    });
    const [addresses, setAddresses] = useState([]);
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [addressForm, setAddressForm] = useState({
        name: '',
        phone: '',
        pincode: '',
        locality: '',
        address: '',
        city: '',
        state: '',
        landmark: '',
        altPhone: '',
        type: 'Home'
    });

    useEffect(() => {
        if (user) {
            setPersonalInfo({
                name: user.name,
                phone: user.phone || ''
            });
            fetchAddresses();
        }
    }, [user]);

    const fetchAddresses = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/addresses/${user.id}`);
            setAddresses(res.data);
        } catch (error) {
            console.error("Error fetching addresses", error);
        }
    };

    const handleInfoChange = (e) => {
        setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
    };

    const handleInfoSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put('http://localhost:5000/api/auth/profile', {
                userId: user.id,
                name: personalInfo.name,
                phone: personalInfo.phone
            });
            // Update context
            updateUser({
                name: personalInfo.name,
                phone: personalInfo.phone
            });

            toast.success("Personal Info Updated!");
            setIsEditingInfo(false);
        } catch (error) {
            toast.error("Failed to update info");
        }
    };

    // Address Form Handlers
    const handleAddressChange = (e) => {
        setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAddressId) {
                // Update
                await axios.put(`http://localhost:5000/api/addresses/${editingAddressId}`, addressForm);
                toast.success("Address Updated!");
            } else {
                // Add New
                await axios.post('http://localhost:5000/api/addresses', {
                    userId: user.id,
                    ...addressForm
                });
                toast.success("Address Added!");
            }
            fetchAddresses();
            resetAddressForm();
        } catch (error) {
            console.error("Address save error", error);
            toast.error("Failed to save address");
        }
    };

    const handleDeleteAddress = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-3 min-w-[250px]">
                <p className="font-semibold text-gray-800">Delete this address?</p>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
                <div className="flex gap-2 mt-1">
                    <button
                        onClick={() => {
                            confirmDelete(id);
                            toast.dismiss(t.id);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex-1"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex-1"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: 6000,
            position: 'top-center',
            style: {
                background: '#fff',
                padding: '1rem',
                borderRadius: '1rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            }
        });
    };

    const confirmDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/addresses/${id}`);
            toast.success("Address Deleted");
            fetchAddresses();
        } catch (error) {
            toast.error("Failed to delete address");
        }
    };

    const handleEditAddress = (addr) => {
        setAddressForm(addr);
        setEditingAddressId(addr.id);
        setShowAddressForm(true);
    };

    const resetAddressForm = () => {
        setAddressForm({
            name: '', phone: '', pincode: '', locality: '', address: '',
            city: '', state: '', landmark: '', altPhone: '', type: 'Home'
        });
        setEditingAddressId(null);
        setShowAddressForm(false);
    };

    // Profile Picture Upload
    const handleProfilePicChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profilePicture', file);
        formData.append('userId', user.id);

        const toastId = toast.loading("Uploading...");

        try {
            const res = await axios.post('http://localhost:5000/api/auth/upload-profile-pic', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update Auth Context State
            updateUser({ profilePicture: res.data.profilePicture });

            toast.success("Profile Picture Updated!", { id: toastId });
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload profile picture", { id: toastId });
        }
    };

    return (
        <AccountLayout>
            {/* Profile Header Section */}
            <div className="bg-white dark:bg-stone-800 rounded-2xl p-8 mb-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-amber-400 to-orange-500 opacity-20"></div>

                <div className="relative flex flex-col md:flex-row items-center gap-6 mt-6">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 p-1 shadow-lg overflow-hidden">
                            <div className="w-full h-full rounded-full bg-white dark:bg-stone-900 flex items-center justify-center text-3xl font-bold text-gray-700 dark:text-gray-200 overflow-hidden">
                                {user?.profilePicture ? (
                                    <img
                                        src={`http://localhost:5000/${user.profilePicture}`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span>{personalInfo.name ? personalInfo.name.charAt(0).toUpperCase() : 'U'}</span>
                                )}
                            </div>
                        </div>
                        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow hover:bg-blue-700 transition cursor-pointer" title="Change Picture">
                            <Edit2 size={14} />
                            <input type="file" className="hidden" accept="image/*" onChange={handleProfilePicChange} />
                        </label>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{personalInfo.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{personalInfo.phone || 'No phone number added'}</p>
                    </div>

                    {/* Actions */}
                    <div>
                        {!isEditingInfo ? (
                            <button onClick={() => setIsEditingInfo(true)} className="bg-white dark:bg-stone-700 border border-gray-200 dark:border-stone-600 px-6 py-2 rounded-full font-medium shadow-sm hover:shadow transition">
                                Edit Profile
                            </button>
                        ) : null}
                    </div>
                </div>

                {/* Edit Form */}
                {isEditingInfo && (
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleInfoSubmit}
                        className="mt-8 border-t border-gray-100 dark:border-stone-700 pt-6 max-w-2xl mx-auto"
                    >
                        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Edit Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={personalInfo.name}
                                    onChange={handleInfoChange}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-stone-700 dark:text-white dark:border-stone-600"
                                    placeholder="Full Name"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={personalInfo.phone}
                                    onChange={handleInfoChange}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-stone-700 dark:text-white dark:border-stone-600"
                                    placeholder="Phone Number"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 justify-end">
                            <button type="button" onClick={() => setIsEditingInfo(false)} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-stone-700">Cancel</button>
                            <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg shadow font-medium hover:bg-blue-700">Save Changes</button>
                        </div>
                    </motion.form>
                )}
            </div>

            {/* Address Management Section */}
            <div className="border-t border-gray-100 dark:border-stone-700 pt-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Manage Addresses</h2>

                {!showAddressForm ? (
                    <div className="space-y-4">
                        {/* Add New Button */}
                        <div
                            onClick={() => { resetAddressForm(); setShowAddressForm(true); }}
                            className="border border-gray-200 dark:border-stone-600 rounded-lg p-4 flex items-center gap-4 text-blue-600 cursor-pointer hover:bg-blue-50 dark:hover:bg-stone-700/50 transition-colors"
                        >
                            <Plus size={24} />
                            <span className="font-bold text-sm uppercase">Add a new address</span>
                        </div>

                        {/* Address List */}
                        {addresses.map((addr) => (
                            <div key={addr.id} className="border border-gray-200 dark:border-stone-600 rounded-lg p-6 relative group">
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEditAddress(addr)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Edit">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteAddress(addr.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-gray-200 dark:bg-stone-700 text-xs px-2 py-1 rounded text-gray-600 dark:text-gray-300 font-bold uppercase">{addr.type}</span>
                                    <h3 className="font-bold text-gray-900 dark:text-white">{addr.name}</h3>
                                    <span className="text-gray-900 dark:text-white font-bold ml-4">{addr.phone}</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
                                    {addr.address}, {addr.locality}, {addr.city}, {addr.state} - <span className="font-bold text-gray-900 dark:text-white">{addr.pincode}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 dark:bg-stone-800 p-6 rounded-lg">
                        <h3 className="text-lg font-bold text-blue-600 mb-4">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>

                        <form onSubmit={handleAddressSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="name" placeholder="Name" value={addressForm.name} onChange={handleAddressChange} className="p-3 border rounded dark:bg-stone-700 dark:text-white dark:border-stone-600" required />
                            <input name="phone" placeholder="10-digit mobile number" value={addressForm.phone} onChange={handleAddressChange} className="p-3 border rounded dark:bg-stone-700 dark:text-white dark:border-stone-600" required />
                            <input name="pincode" placeholder="Pincode" value={addressForm.pincode} onChange={handleAddressChange} className="p-3 border rounded dark:bg-stone-700 dark:text-white dark:border-stone-600" required />
                            <input name="locality" placeholder="Locality" value={addressForm.locality} onChange={handleAddressChange} className="p-3 border rounded dark:bg-stone-700 dark:text-white dark:border-stone-600" required />
                            <textarea name="address" placeholder="Address (Area and Street)" value={addressForm.address} onChange={handleAddressChange} className="p-3 border rounded md:col-span-2 dark:bg-stone-700 dark:text-white dark:border-stone-600" rows="3" required />
                            <input name="city" placeholder="City/District/Town" value={addressForm.city} onChange={handleAddressChange} className="p-3 border rounded dark:bg-stone-700 dark:text-white dark:border-stone-600" required />
                            <input name="state" placeholder="State" value={addressForm.state} onChange={handleAddressChange} className="p-3 border rounded dark:bg-stone-700 dark:text-white dark:border-stone-600" required />
                            <input name="landmark" placeholder="Landmark (Optional)" value={addressForm.landmark} onChange={handleAddressChange} className="p-3 border rounded dark:bg-stone-700 dark:text-white dark:border-stone-600" />
                            <input name="altPhone" placeholder="Alternate Phone (Optional)" value={addressForm.altPhone} onChange={handleAddressChange} className="p-3 border rounded dark:bg-stone-700 dark:text-white dark:border-stone-600" />

                            <div className="md:col-span-2 flex gap-4 mt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="type" value="Home" checked={addressForm.type === 'Home'} onChange={handleAddressChange} />
                                    <span className="dark:text-white">Home</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="type" value="Work" checked={addressForm.type === 'Work'} onChange={handleAddressChange} />
                                    <span className="dark:text-white">Work</span>
                                </label>
                            </div>

                            <div className="md:col-span-2 flex gap-4 mt-4">
                                <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700 transition">Save Address</button>
                                <button type="button" onClick={() => setShowAddressForm(false)} className="text-blue-600 font-bold px-4 py-3 hover:bg-blue-50 rounded transition">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AccountLayout>
    );
};

export default AccountSettings;
