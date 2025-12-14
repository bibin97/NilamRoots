const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // Import User model for association

const Address = sequelize.define('Address', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: { // Foreign key
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pincode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    locality: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: { // Street / Area
        type: DataTypes.TEXT,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    landmark: {
        type: DataTypes.STRING,
        allowNull: true
    },
    altPhone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    type: { // Home or Work
        type: DataTypes.ENUM('Home', 'Work'),
        defaultValue: 'Home'
    }
}, {
    timestamps: true
});

// Define Association
User.hasMany(Address, { foreignKey: 'userId', onDelete: 'CASCADE' });
Address.belongsTo(User, { foreignKey: 'userId' });

module.exports = Address;
