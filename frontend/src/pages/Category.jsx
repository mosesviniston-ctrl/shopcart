import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Category = () => {
    const { name } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:5000/api/products?category=${name}`);
                setProducts(res.data);
            } catch (err) {
                console.error('Failed to fetch category products', err);
            }
            setLoading(false);
        };
        fetchProducts();
    }, [name]);

    return (
        <div className="py-6">
            <div className="bg-white p-4 rounded shadow-sm mb-6 flex justify-between items-center border-b-2 border-transparent">
                 <h2 className="text-2xl font-bold text-gray-800 capitalize">{name}</h2>
                 <span className="text-sm text-gray-500 font-medium">{products.length} items</span>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-white rounded shadow-sm">
                   <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="No results" className="h-32 mb-4 opacity-50"/>
                   <h3 className="text-xl font-bold text-gray-700">No products found in this category.</h3>
                   <p className="text-gray-500 mt-2">Try exploring other categories or check back later.</p>
               </div>
            )}
        </div>
    );
};

export default Category;
