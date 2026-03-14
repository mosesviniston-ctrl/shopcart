const express = require('express');
const router = express.Router();
const pool = require('../db');

// @route   GET /api/products/categories
// @desc    Get all categories
// @access  Public
router.get('/categories', async (req, res) => {
    try {
        const [categories] = await pool.execute('SELECT * FROM categories');
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/products
// @desc    Get products (with optional category, search, and sort filters)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, search, sort } = req.query;
        let query = 'SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE 1=1';
        let queryParams = [];

        if (category) {
            query += ' AND c.name = ?';
            queryParams.push(category);
        }

        if (search) {
            query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
            const searchParam = `%${search}%`;
            queryParams.push(searchParam, searchParam);
        }

        if (sort === 'price_asc') {
            query += ' ORDER BY p.price ASC';
        } else if (sort === 'price_desc') {
            query += ' ORDER BY p.price DESC';
        } else if (sort === 'rating') {
            query += ' ORDER BY p.rating DESC';
        } else {
            query += ' ORDER BY p.created_at DESC';
        }

        const [products] = await pool.execute(query, queryParams);
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const [products] = await pool.execute(
            'SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
            [req.params.id]
        );
        
        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(products[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
