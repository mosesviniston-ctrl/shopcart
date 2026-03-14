const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// All cart routes are protected
router.use(authMiddleware);

// @route   GET /api/cart
// @desc    Get user's cart items
// @access  Private
router.get('/', async (req, res) => {
    try {
        const [cartItems] = await pool.execute(
            `SELECT c.id as cart_id, c.quantity, p.* 
             FROM cart c 
             JOIN products p ON c.product_id = p.id 
             WHERE c.user_id = ?`,
            [req.user.id]
        );
        res.json(cartItems);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        const qty = quantity || 1;

        if (!product_id) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Check if product exists in cart
        const [existing] = await pool.execute('SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?', [req.user.id, product_id]);

        if (existing.length > 0) {
            // Update quantity
            await pool.execute('UPDATE cart SET quantity = quantity + ? WHERE id = ?', [qty, existing[0].id]);
        } else {
            // Insert new cart item
            await pool.execute('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [req.user.id, product_id, qty]);
        }

        res.status(200).json({ message: 'Item added to cart' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/cart/:id
// @desc    Update cart item quantity
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cartId = req.params.id;

        if (quantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be greater than 0' });
        }

        await pool.execute('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, cartId, req.user.id]);
        res.json({ message: 'Cart updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/cart/:id
// @desc    Remove item from cart
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const cartId = req.params.id;
        await pool.execute('DELETE FROM cart WHERE id = ? AND user_id = ?', [cartId, req.user.id]);
        res.json({ message: 'Item removed from cart' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/cart
// @desc    Clear user's entire cart
// @access  Private
router.delete('/', async (req, res) => {
    try {
        await pool.execute('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
        res.json({ message: 'Cart cleared' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
