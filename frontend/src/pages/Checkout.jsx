import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

const Checkout = () => {
    const { cart, cartTotal, fetchCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [address, setAddress] = useState(user?.address || '');
    const [loading, setLoading] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (cart.length === 0) {
            navigate('/cart');
        }
        
        // Load Razorpay Script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => setScriptLoaded(true);
        document.body.appendChild(script);
        
        return () => {
            document.body.removeChild(script);
        };
    }, [user, cart.length, navigate]);

    const handleCheckout = async (e) => {
        e.preventDefault();
        
        if (!scriptLoaded) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }
        
        if (!address.trim()) {
            alert('Please provide a shipping address');
            return;
        }

        setLoading(true);

        try {
            // 1. Create order on our backend
            const { data } = await axios.post('http://localhost:5000/api/orders/checkout', {
                shipping_address: address
            });

            // 2. Options for Razorpay
            const options = {
                key: data.razorpay_key,
                amount: data.order.total_amount * 100, // paise
                currency: 'INR',
                name: 'Flipkart Clone',
                description: 'Test Transaction',
                image: 'https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fk_header_logo_exploreplus-44005d.svg', // generic logo
                order_id: data.order.razorpay_order_id,
                handler: async function (response) {
                    try {
                        // 3. Verify payment signature on backend
                        await axios.post('http://localhost:5000/api/orders/verify', {
                            order_id: data.order.id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        
                        // 4. Update local state and redirect
                        await fetchCart(); // Clear cart in context effectively
                        navigate('/orders', { replace: true, state: { success: true } });
                        alert('Payment Successful!');
                    } catch (error) {
                        alert('Payment verification failed');
                        console.error('Verify error', error);
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.phone || '9999999999'
                },
                notes: {
                    address: address
                },
                theme: {
                    color: '#2874f0' // Flipkart Blue
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response){
                alert('Payment Failed. ' + response.error.description);
            });
            rzp.open();

        } catch (error) {
            console.error('Checkout error', error);
            alert(error.response?.data?.message || 'Failed to initiate checkout');
        }
        
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                 {/* Header Step 1 */}
                 <div className="bg-blue-600 text-white p-4 font-semibold text-lg flex items-center gap-3">
                     <span className="bg-white text-blue-600 rounded-sm w-6 h-6 flex items-center justify-center text-sm">1</span> 
                     LOGIN
                     <span className="ml-auto text-sm font-normal"><ShieldCheck size={18} className="inline mr-1 mb-0.5" /> Secure</span>
                 </div>
                 <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center text-gray-700">
                      <div>
                          <span className="font-semibold text-gray-900">{user?.name}</span> <span className="text-sm font-medium ml-2">{user?.phone || user?.email}</span>
                      </div>
                 </div>

                 {/* Step 2 Address */}
                 <div className="bg-blue-600 text-white p-4 font-semibold text-lg flex items-center gap-3 mt-4">
                     <span className="bg-white text-blue-600 rounded-sm w-6 h-6 flex items-center justify-center text-sm">2</span> 
                     DELIVERY ADDRESS
                 </div>
                 <div className="p-6 bg-white border-b border-gray-200">
                      <form onSubmit={handleCheckout}>
                           <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Detailed Address</label>
                                <textarea 
                                    className="shadow-sm appearance-none border border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline resize-none h-32" 
                                    placeholder="Enter your full shipping address here..."
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                ></textarea>
                           </div>

                           <div className="mt-8 flex items-center gap-6 p-4 bg-orange-50 rounded border border-orange-100 mb-6">
                                <span className="text-orange-500 font-bold tracking-wide uppercase">Order Summary</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                <span className="font-medium">{cart.length} Item(s)</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                <span className="font-bold text-lg text-gray-900">Total: ${cartTotal.toFixed(2)}</span>
                           </div>

                           <button 
                                type="submit" 
                                disabled={loading || cart.length === 0}
                                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3.5 px-10 rounded shadow flex items-center justify-center uppercase w-full md:w-auto text-[15px]"
                            >
                                {loading ? 'Processing...' : 'Proceed to Payment'}
                            </button>
                      </form>
                 </div>
             </div>
        </div>
    );
};

export default Checkout;
