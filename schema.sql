-- E-commerce Platform Database Schema
-- Database: flipkart_clone

CREATE DATABASE IF NOT EXISTS flipkart_clone;
USE flipkart_clone;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    stock INT NOT NULL DEFAULT 0,
    rating DECIMAL(2, 1) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- Cart Table
CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY user_product (user_id, product_id)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    payment_id VARCHAR(255),
    razorpay_order_id VARCHAR(255),
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Mobiles, Laptops, Accessories'),
('Fashion', 'Clothing, Footwear, Watches'),
('Home & Furniture', 'Decor, Furniture, Kitchen Appliances'),
('Books', 'Fiction, Non-fiction, Educational')
ON DUPLICATE KEY UPDATE name=name;

-- Insert sample products
INSERT INTO products (category_id, name, description, price, stock, image_url, rating) VALUES
(1, 'Smartphone Pro X', 'Latest dual-camera smartphone with 128GB storage.', 699.99, 50, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80', 4.5),
(1, 'Ultra Slim Laptop', '13-inch laptop, 16GB RAM, 512GB SSD.', 1099.00, 30, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80', 4.8),
(2, 'Men''s Casual Sneaker', 'Comfortable daily wear sneakers.', 45.50, 100, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80', 4.2),
(3, 'Ergonomic Office Chair', 'Breathable mesh chair with lumbar support.', 150.00, 20, 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80', 4.6),
(1, 'Wireless Noise-Cancending Headphones', 'Over-ear headphones with 30-hour battery life.', 199.99, 40, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', 4.7)
ON DUPLICATE KEY UPDATE name=name;
