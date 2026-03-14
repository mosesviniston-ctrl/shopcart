import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product.id, 1);
    };

    return (
        <Link to={`/product/${product.id}`} className="group relative border border-gray-200 rounded-lg p-4 bg-white hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden hover:-translate-y-1">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-50 lg:aspect-none lg:h-56 relative flex items-center justify-center p-4">
                <img
                    src={product.image_url || 'https://via.placeholder.com/300x400?text=No+Image'}
                    alt={product.name}
                    className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-110"
                />
            </div>
            
            <div className="mt-4 flex flex-col flex-1">
                <h3 className="text-sm text-gray-700 font-medium line-clamp-2 hover:text-blue-600 transition-colors">
                     {product.name}
                </h3>
                
                <div className="mt-1 flex items-center gap-2">
                    <div className="bg-green-600 text-white text-xs px-2 py-0.5 rounded flex items-center font-bold shadow-sm">
                        {Number(product.rating).toFixed(1)} <Star size={10} className="ml-1 fill-current" />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">(1,234)</span>
                </div>
                
                <div className="mt-3 flex items-center gap-3">
                    <p className="text-xl font-bold text-gray-900">${Number(product.price).toFixed(2)}</p>
                    <p className="text-sm text-gray-500 line-through">${(Number(product.price) * 1.2).toFixed(2)}</p>
                    <p className="text-sm text-green-600 font-bold">16% off</p>
                </div>
                
                {/* Free delivery badge */}
                <p className="text-xs text-black font-medium mt-2">Free Delivery</p>

                {/* Add to Cart button (visible on hover or always on mobile) */}
                <div className="mt-auto pt-4">
                     <button
                        onClick={handleAddToCart}
                        className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded shadow-sm transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:absolute left-0 bottom-0 lg:w-full lg:rounded-t-none z-10"
                    >
                        <ShoppingCart size={18} /> Add to Cart
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
