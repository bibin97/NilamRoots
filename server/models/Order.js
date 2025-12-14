const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    customerName: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.TEXT, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    pincode: { type: DataTypes.STRING, allowNull: false },
    phoneNumber: { type: DataTypes.STRING, allowNull: false },

    // Storing items as JSON for simplicity (Snapshot of product data at time of order)
    items: {
        type: DataTypes.JSON,
        allowNull: false
        // Structure: [{ productId, name, quantity, price }]
    },

    totalAmount: { type: DataTypes.INTEGER, allowNull: false },
    paymentMethod: { type: DataTypes.STRING, allowNull: false }, // 'Credit Card', 'UPI', 'COD'
    paymentStatus: { type: DataTypes.STRING, defaultValue: 'Pending' }, // 'Pending', 'Paid'
    transactionId: { type: DataTypes.STRING, allowNull: true },
    userId: { type: DataTypes.INTEGER, allowNull: true }, // Link to User model
    orderStatus: { type: DataTypes.STRING, defaultValue: 'Pending Approval' }, // 'Pending Approval', 'Approved', 'Shipped', 'Delivered'
    isApproved: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    tableName: 'orders'
});

module.exports = Order;
