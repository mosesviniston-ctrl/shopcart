import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Trash2, AlertCircle } from 'lucide-react';

const Cart = () => {
    const { cart, cartTotal, updateQuantity, removeFromCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded shadow-sm mt-6 p-8">
                <img src="https://rukminim1.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Login required" className="h-40 mb-6" />
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">Missing Cart items?</h2>
                <p className="text-gray-500 mb-6">Login to see the items you added previously</p>
                <Link to="/login" className="bg-orange-500 text-white px-8 py-3 rounded text-sm font-semibold shadow hover:bg-orange-600">Login</Link>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded shadow-sm mt-6 p-8">
                <img src="https://rukminim1.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Empty Cart" className="h-40 mb-6" />
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">Your cart is empty!</h2>
                <p className="text-gray-500 mb-6">Add items to it now.</p>
                <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded text-sm font-semibold shadow hover:bg-blue-700">Shop Now</Link>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-3 gap-6 py-6">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
                <div className="bg-white rounded shadow-sm p-4 text-lg font-semibold border-b border-gray-200">
                    My Cart ({cart.length})
                </div>
                {cart.map(item => (
                    <div key={item.cart_id} className="bg-white rounded shadow-sm p-4 flex flex-col sm:flex-row gap-6 border-b border-gray-100 last:border-0 relative">
                        {/* Image */}
                        <div className="w-full sm:w-32 h-32 flex-shrink-0 flex items-center justify-center cursor-pointer" onClick={() => navigate(`/product/${item.product_id}`)}>
                            <img src={item.image_url} alt={item.name} className="max-h-full max-w-full object-contain hover:scale-105 transition-transform" />
                        </div>
                        
                        {/* Details */}
                        <div className="flex-1">
                            <h3 className="text-gray-900 font-medium hover:text-blue-600 cursor-pointer line-clamp-2" onClick={() => navigate(`/product/${item.product_id}`)}>
                                {item.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 capitalize">{item.category_name}</p>
                            
                            <div className="flex items-baseline gap-2 mt-3">
                                <span className="text-xl font-bold text-gray-900">${Number(item.price).toFixed(2)}</span>
                                <span className="text-sm text-gray-500 line-through">${(Number(item.price) * 1.2).toFixed(2)}</span>
                                <span className="text-sm text-green-600 font-bold tracking-wide">16% off</span>
                            </div>

                            {/* Actions below details */}
                            <div className="flex items-center gap-6 mt-6 pt-4 border-t border-dashed border-gray-200">
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => updateQuantity(item.cart_id, item.quantity - 1)}
                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                        disabled={item.quantity <= 1}
                                    >-</button>
                                    <span className="w-10 text-center border border-gray-200 py-1 font-medium">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item.cart_id, item.quantity + 1)}
                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-100"
                                    >+</button>
                                </div>
                                
                                <button 
                                    onClick={() => removeFromCart(item.cart_id)} 
                                    className="font-semibold text-gray-900 hover:text-red-600 flex items-center text-sm tracking-wide gap-1"
                                >
                                    <Trash2 size={16}/> REMOVE
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Place Order CTA on desktop bottom left */}
                <div className="bg-white rounded shadow-sm p-4 hidden md:flex justify-end border-t border-gray-200 sticky bottom-0">
                     <button onClick={() => navigate('/checkout')} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded text-lg font-bold shadow-md uppercase">
                         Place Order
                     </button>
                </div>
            </div>

            {/* Price Details */}
             <div className="md:col-span-1">
                <div className="bg-white rounded shadow-sm sticky top-20">
                    <h2 className="text-gray-500 font-bold uppercase tracking-wide border-b border-gray-200 p-4 pb-3">Price details</h2>
                    
                    <div className="p-4 space-y-4">
                        <div className="flex justify-between items-center text-gray-900">
                            <span>Price ({cart.length} items)</span>
                            <span>${(cartTotal * 1.2).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-900">
                            <span>Discount</span>
                            <span className="text-green-600 font-medium">-${(cartTotal * 0.2).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-900">
                            <span>Delivery Charges</span>
                            <span className="text-green-600 font-medium">Free</span>
                        </div>
                        
                        <div className="border-t border-dashed border-gray-200 pt-4 mt-4 flex justify-between items-center uppercase !text-lg !font-bold text-gray-900">
                            <span>Total Amount</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        
                        <div className="text-green-600 font-semibold text-sm pt-2">
                             You will save ${(cartTotal * 0.2).toFixed(2)} on this order
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-200 mt-2 flex items-start gap-2 text-gray-600 text-xs">
                         <AlertCircle size={32} className="text-gray-400 opacity-70" />
                         Safe and Secure Payments. Easy returns. 100% Authentic products.
                    </div>
                </div>

                 {/* Place Order CTA on mobile bottom sticky */}
                 <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 shadow-top z-50 flex justify-between items-center">
                      <div>
                           <span className="text-xl font-bold">${cartTotal.toFixed(2)}</span>
                           <span className="text-blue-600 font-medium text-xs block cursor-pointer">View price details</span>
                      </div>
                      <button onClick={() => navigate('/checkout')} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded font-bold shadow-sm uppercase">
                         Place Order
                     </button>
                 </div>
            </div>
        </div>
    );
};

export default Cart;
