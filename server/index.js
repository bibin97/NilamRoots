
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Import models to ensure they are registered
require('./models/Product');
require('./models/Review');
require('./models/Order');
require('./models/Address');
require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database Connection & Sync
sequelize.authenticate()
    .then(() => {
        console.log('MySQL Database Connected...');
        // Sync models (create tables if not exist)
        // force: false ensures we don't drop tables on restart
        return sequelize.sync({ alter: true });
    })
    .then(() => console.log('Database Synced'))
    .catch(err => console.log('Database Connection User Error:', err));

const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const addressRoutes = require('./routes/addressRoutes');

app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/addresses', addressRoutes);

// Routes
app.get('/', (req, res) => {
    res.send('NilamRoots API is running');
});

// Start Server only if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
