import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoryView from '../components/CategoryView';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Parse search params
                const searchParams = new URLSearchParams(location.search);
                const query = searchParams.get('search');
                
                let url = 'http://localhost:5000/api/products';
                if (query) {
                    url += `?search=${encodeURIComponent(query)}`;
                }

                const res = await axios.get(url);
                setProducts(res.data);
            } catch (err) {
                console.error('Failed to fetch products', err);
            }
            setLoading(false);
        };
        fetchProducts();
    }, [location.search]);

    return (
        <div className="py-6">
            <CategoryView />
            
            {/* Promotional Banner (visual only) */}
             <div className="w-full h-48 md:h-64 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md mb-8 flex items-center justify-center text-white p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>
                <div className="relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Big Billion Days</h1>
                    <p className="text-xl md:text-2xl font-light">Up to 80% off on top brands</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow-sm flex items-center justify-between mb-6 border-b-2 border-transparent">
                <h2 className="text-2xl font-bold text-gray-800">
                    {location.search ? 'Search Results' : 'Best of Electronics & Fashion'}
                </h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded shadow-sm hover:shadow-md transition-shadow font-semibold text-sm">VIEW ALL</button>
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
                    <h3 className="text-xl font-bold text-gray-700">Sorry, no results found!</h3>
                    <p className="text-gray-500 mt-2">Please check the spelling or try searching for something else</p>
                </div>
            )}
        </div>
    );
};

export default Home;
