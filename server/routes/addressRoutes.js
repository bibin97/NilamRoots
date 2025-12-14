const express = require('express');
const router = express.Router();
const Address = require('../models/Address');

// Get all addresses for a user
router.get('/:userId', async (req, res) => {
    try {
        const addresses = await Address.findAll({ where: { userId: req.params.userId } });
        res.json(addresses);
    } catch (error) {
        console.error("Error fetching addresses", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add new address
router.post('/', async (req, res) => {
    try {
        const { userId, name, phone, pincode, locality, address, city, state, landmark, altPhone, type } = req.body;

        const newAddress = await Address.create({
            userId, name, phone, pincode, locality, address, city, state, landmark, altPhone, type
        });

        res.status(201).json(newAddress);
    } catch (error) {
        console.error("Error adding address", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update address
router.put('/:id', async (req, res) => {
    try {
        const { name, phone, pincode, locality, address, city, state, landmark, altPhone, type } = req.body;
        const addressId = req.params.id;

        const updated = await Address.update({
            name, phone, pincode, locality, address, city, state, landmark, altPhone, type
        }, {
            where: { id: addressId }
        });

        if (updated[0] > 0) {
            const updatedAddress = await Address.findByPk(addressId);
            res.json(updatedAddress);
        } else {
            res.status(404).json({ message: 'Address not found' });
        }
    } catch (error) {
        console.error("Error updating address", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete address
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Address.destroy({ where: { id: req.params.id } });
        if (deleted) {
            res.json({ message: 'Address deleted successfully' });
        } else {
            res.status(404).json({ message: 'Address not found' });
        }
    } catch (error) {
        console.error("Error deleting address", error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
