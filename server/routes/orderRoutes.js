const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create Order
router.post('/', async (req, res) => {
    try {
        const savedOrder = await Order.create(req.body);
        // Map id to _id for response consistency
        const json = savedOrder.toJSON();
        json._id = json.id.toString();
        res.status(201).json(json);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// Get All Orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.findAll({ order: [['createdAt', 'DESC']] });
        const modifiedOrders = orders.map(o => {
            const json = o.toJSON();
            json._id = json.id.toString();
            return json;
        });
        res.status(200).json(modifiedOrders);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get Single Order
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (order) {
            const json = order.toJSON();
            json._id = json.id.toString();
            res.status(200).json(json);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// Approve Order
router.put('/:id/approve', async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (order) {
            await order.update({ isApproved: true, orderStatus: 'Placed' }); // Changed to 'Placed' as per user request
            const json = order.toJSON();
            json._id = json.id.toString();
            res.status(200).json(json);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// Cancel Order
router.put('/:id/cancel', async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (order) {
            await order.update({ isApproved: false, orderStatus: 'Cancelled' });
            const json = order.toJSON();
            json._id = json.id.toString();
            res.status(200).json(json);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update Status generally
router.put('/:id', async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (order) {
            await order.update(req.body);
            const json = order.toJSON();
            json._id = json.id.toString();
            res.status(200).json(json);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay Order
router.post('/create-razorpay-order', async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;

        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise)
            currency,
            receipt,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error("Razorpay Error:", error);
        res.status(500).json(error);
    }
});

// Verify Payment
router.post('/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            res.json({ success: true, message: "Payment Verified Successfully" });
        } else {
            res.status(400).json({ success: false, message: "Invalid Signature" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

// Get Razorpay Key ID (For Frontend)
router.get('/razorpay-key', (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
});

module.exports = router;
