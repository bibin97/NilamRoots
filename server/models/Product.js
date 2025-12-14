const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    // Mongoose: _id (auto). Sequelize: id (auto). 
    // We might need to handle UUIDs if we want to mimic Mongo strings, but let's stick to auto-increment integers for simplicity with MySQL.
    // Frontend Update: Ensure frontend handles `id` or `_id`. I'll add a getter for `_id` to be safe?
    // Sequelize virtual field?
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    images: {
        type: DataTypes.JSON, // Stores array of strings
        defaultValue: []
    },
    features: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    inStock: { type: DataTypes.BOOLEAN, defaultValue: true },
    rating: { type: DataTypes.FLOAT, defaultValue: 0 },
    reviewsCount: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
    tableName: 'products'
});

module.exports = Product;
