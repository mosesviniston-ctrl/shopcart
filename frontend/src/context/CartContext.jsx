import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const { token } = useContext(AuthContext);

    const fetchCart = async () => {
        if (!token) {
            setCart([]);
            return;
        }
        try {
            const res = await axios.get('http://localhost:5000/api/cart');
            setCart(res.data);
        } catch (err) {
            console.error('Failed to fetch cart', err);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [token]);

    const addToCart = async (productId, quantity = 1) => {
        if (!token) return { success: false, message: 'Please login to add items to cart' };
        try {
            await axios.post('http://localhost:5000/api/cart', { product_id: productId, quantity });
            await fetchCart();
            return { success: true };
        } catch (err) {
            return { success: false, message: 'Failed to add item' };
        }
    };

    const updateQuantity = async (cartId, quantity) => {
        try {
            await axios.put(`http://localhost:5000/api/cart/${cartId}`, { quantity });
            await fetchCart();
        } catch (err) {
            console.error('Failed to update quantity', err);
        }
    };

    const removeFromCart = async (cartId) => {
        try {
            await axios.delete(`http://localhost:5000/api/cart/${cartId}`);
            await fetchCart();
        } catch (err) {
            console.error('Failed to remove item', err);
        }
    };

    const clearCart = async () => {
        try {
            await axios.delete('http://localhost:5000/api/cart');
            await fetchCart();
        } catch (err) {
             console.error('Failed to clear cart', err);
        }
    }

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, cartCount, cartTotal, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};
