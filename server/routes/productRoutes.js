const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll();
        // Add a virtual _id field to support legacy frontend code expecting mongodb _id
        const modifiedProducts = products.map(p => {
            const json = p.toJSON();
            json._id = json.id.toString(); // Aliasing id to _id
            return json;
        });
        res.json(modifiedProducts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            const json = product.toJSON();
            json._id = json.id.toString();
            res.json(json);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
