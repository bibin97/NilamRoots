const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');

// Add a review
router.post('/', async (req, res) => {
    try {
        const { productId, user, rating, comment } = req.body;

        const review = await Review.create({
            productId,
            user,
            rating,
            comment
        });

        // Update product stats
        const product = await Product.findByPk(productId);
        const reviews = await Review.findAll({ where: { productId } });

        const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

        product.rating = avgRating;
        product.reviewsCount = reviews.length;
        await product.save();

        res.status(201).json(review);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get reviews for a product
router.get('/:productId', async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { productId: req.params.productId },
            order: [['createdAt', 'DESC']]
        });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
