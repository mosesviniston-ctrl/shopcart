import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Zap, Star } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                console.error('Failed to fetch product', err);
            }
            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product.id, 1);
        navigate('/cart');
    };

    const handleBuyNow = () => {
        addToCart(product.id, 1);
        navigate('/checkout');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    if (!product) return <div className="text-center py-20 text-2xl font-bold text-gray-700">Product not found</div>;

    return (
        <div className="bg-white p-4 md:p-8 rounded shadow-sm my-6 grid md:grid-cols-12 gap-8">
            {/* Product Image & Actions */}
            <div className="md:col-span-5 flex flex-col items-center">
                <div className="border border-gray-200 rounded p-4 w-full h-[300px] md:h-[500px] flex items-center justify-center relative hover:shadow-lg transition-shadow">
                    <img 
                        src={product.image_url || 'https://via.placeholder.com/400?text=No+Image'} 
                        alt={product.name}
                        className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300" 
                    />
                </div>
                <div className="flex gap-4 w-full mt-4">
                    <button 
                        onClick={handleAddToCart}
                        className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-4 rounded shadow flex justify-center items-center h-14"
                    >
                        <ShoppingCart className="mr-2" size={20} /> ADD TO CART
                    </button>
                    <button 
                        onClick={handleBuyNow}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-4 rounded shadow flex justify-center items-center h-14"
                    >
                        <Zap className="mr-2 fill-current" size={20} /> BUY NOW
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="md:col-span-7 flex flex-col pt-2">
                <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide font-semibold">{product.category_name}</p>
                <h1 className="text-2xl font-normal text-gray-900 mb-2">{product.name}</h1>
                
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-green-600 text-white text-sm px-2 py-0.5 rounded flex items-center font-bold shadow-sm">
                        {Number(product.rating).toFixed(1)} <Star size={12} className="ml-1 fill-current" />
                    </div>
                    <span className="text-sm text-gray-500 font-medium font-sans">12,456 Ratings & 1,234 Reviews</span>
                    {/* Add f-assured equivalent graphic */}
                    <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="Assured" className="h-5" />
                </div>

                <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-3xl font-medium text-gray-900">${Number(product.price).toFixed(2)}</span>
                    <span className="text-base text-gray-500 line-through">${(Number(product.price) * 1.2).toFixed(2)}</span>
                    <span className="text-base text-green-600 font-bold tracking-wide">16% off</span>
                </div>

                <div className="mb-6">
                    <h3 className="text-sm text-gray-500 font-medium mb-2">Available offers</h3>
                    <ul className="text-sm space-y-2 text-gray-700">
                        <li className="flex gap-2">
                            <img src="https://rukminim2.flixcart.com/www/36/36/promos/06/09/2016/c22c9fc4-0555-4460-8401-bf5c28d7ba29.png?q=90" className="w-4 h-4 mt-0.5" />
                            <span><strong className="font-semibold text-gray-900">Bank Offer:</strong> 5% Cashback on Flipkart Axis Bank Card <a href="#" className="text-blue-600 font-medium ml-1">T&C</a></span>
                         </li>
                         <li className="flex gap-2">
                            <img src="https://rukminim2.flixcart.com/www/36/36/promos/06/09/2016/c22c9fc4-0555-4460-8401-bf5c28d7ba29.png?q=90" className="w-4 h-4 mt-0.5" />
                            <span><strong className="font-semibold text-gray-900">Special Price:</strong> Get extra 10% off (price inclusive of cashback/coupon) <a href="#" className="text-blue-600 font-medium ml-1">T&C</a></span>
                         </li>
                    </ul>
                </div>

                <div className="border-t border-gray-200 mt-2 mb-6"></div>

                <div>
                    <h2 className="text-xl font-medium border-b border-gray-200 pb-2 mb-4">Description</h2>
                    <p className="text-gray-700 leading-relaxed font-sans">{product.description}</p>
                </div>
                
                <div className="mt-8 border border-gray-200 rounded p-4 flex gap-4">
                     <div className="w-16 h-16 flex items-center justify-center bg-gray-50 rounded shadow-sm border border-gray-100">
                        <span className="text-2xl">📦</span>
                     </div>
                     <div>
                         <h4 className="font-medium text-gray-900">7 Days Replacement Policy</h4>
                         <p className="text-sm text-gray-500 mt-1">If the product is damaged or defective upon receiving.</p>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
