const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Configure Multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed'));
    }
});

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_this';

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user exists
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone
        });

        // Create Token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });

    } catch (err) {
        console.error("Register Error:", err);
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: err.errors.map(e => e.message).join(', ') });
        }
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'User already exists' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create Token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update Profile
router.put('/profile', async (req, res) => {
    try {
        const { userId, name, phone, address, pincode } = req.body;

        // Find user
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.address = address || user.address;
        user.pincode = pincode || user.pincode;

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                pincode: user.pincode,
                role: user.role,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error("Update profile error", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Upload Profile Picture
router.post('/upload-profile-pic', upload.single('profilePicture'), async (req, res) => {
    try {
        const { userId } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Save relative path using forward slashes for URL compatibility
        const profilePicturePath = req.file.path.replace(/\\/g, '/');
        user.profilePicture = profilePicturePath;
        await user.save();

        res.json({
            message: 'Profile picture updated successfully',
            profilePicture: profilePicturePath
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: 'Server error during upload' });
    }
});

module.exports = router;
