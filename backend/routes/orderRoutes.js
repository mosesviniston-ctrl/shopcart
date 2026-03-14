const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// All order routes protected
router.use(authMiddleware);

// @route   POST /api/orders/checkout
// @desc    Create an order and Razorpay instance
// @access  Private
router.post('/checkout', async (req, res) => {
    try {
        const { shipping_address } = req.body;

        if (!shipping_address) {
            return res.status(400).json({ message: 'Shipping address is required' });
        }

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Get user's cart items
            const [cartItems] = await connection.execute(
                `SELECT c.id as cart_id, c.product_id, c.quantity, p.price, p.stock 
                 FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?`,
                [req.user.id]
            );

            if (cartItems.length === 0) {
                await connection.rollback();
                connection.release();
                return res.status(400).json({ message: 'Cart is empty' });
            }

            // Calculate total amount
            let totalAmount = 0;
            for (let item of cartItems) {
                if (item.stock < item.quantity) {
                    await connection.rollback();
                    connection.release();
                    return res.status(400).json({ message: `Insufficient stock for product ID ${item.product_id}` });
                }
                totalAmount += item.price * item.quantity;
            }

            // Create Order in DB
            const [orderResult] = await connection.execute(
                'INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES (?, ?, ?, ?)',
                [req.user.id, totalAmount, 'pending', shipping_address]
            );
            const orderId = orderResult.insertId;

            // Insert Order Items and Update Stock
            for (let item of cartItems) {
                // Insert into order_items
                await connection.execute(
                    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, item.product_id, item.quantity, item.price]
                );

                // Deduct stock
                await connection.execute('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
            }

            // Clear Cart
            await connection.execute('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

            // Create Razorpay Order
            const options = {
                amount: Math.round(totalAmount * 100), // amount in the smallest currency unit (paise)
                currency: "INR",
                receipt: `receipt_order_${orderId}`
            };

            const razorpayOrder = await instance.orders.create(options);

            // Update order with razorpay ID
            await connection.execute('UPDATE orders SET razorpay_order_id = ? WHERE id = ?', [razorpayOrder.id, orderId]);

            await connection.commit();
            connection.release();

            res.json({
                order: {
                    id: orderId,
                    total_amount: totalAmount,
                    razorpay_order_id: razorpayOrder.id,
                },
                razorpay_key: process.env.RAZORPAY_KEY_ID
            });
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/orders/verify
// @desc    Verify Razorpay payment
// @access  Private
router.post('/verify', async (req, res) => {
    try {
        const { order_id, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Update order status
            await pool.execute(
                'UPDATE orders SET status = ?, payment_id = ? WHERE razorpay_order_id = ?',
                ['completed', razorpay_payment_id, razorpay_order_id]
            );

            res.json({ message: 'Payment successfully verified', payment_id: razorpay_payment_id });
        } else {
            // Payment failed or signature mismatch
            await pool.execute(
                'UPDATE orders SET status = ? WHERE razorpay_order_id = ?',
                ['failed', razorpay_order_id]
            );
            res.status(400).json({ message: 'Invalid Signature' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/orders
// @desc    Get user's past orders
// @access  Private
router.get('/', async (req, res) => {
    try {
        const [orders] = await pool.execute(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/orders/:id
// @desc    Get order details
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const [orders] = await pool.execute(
            'SELECT * FROM orders WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );

        if (orders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const [items] = await pool.execute(
            `SELECT oi.*, p.name, p.image_url 
             FROM order_items oi 
             JOIN products p ON oi.product_id = p.id 
             WHERE oi.order_id = ?`,
            [req.params.id]
        );

        res.json({ ...orders[0], items });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
