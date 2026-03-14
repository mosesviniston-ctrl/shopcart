import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const categoryImages = {
    'Electronics': 'https://rukminim1.flixcart.com/flap/128/128/image/69c6589653afdb9a.png?q=100',
    'Clothing': 'https://rukminim1.flixcart.com/flap/128/128/image/82b3ca5fb2301045.png?q=100',
    'Books': 'https://rukminim1.flixcart.com/flap/128/128/image/f15c02bfeb02d15d.png?q=100',
    'Home & Kitchen': 'https://rukminim1.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg?q=100',
    'Sports': 'https://rukminim1.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png?q=100',
    'Toys & Games': 'https://rukminim1.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png?q=100',
    'Beauty & Health': 'https://rukminim1.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png?q=100', 
    'Grocery': 'https://rukminim1.flixcart.com/flap/128/128/image/29327f40e9c4d26b.png?q=100',
    'Mobiles': 'https://rukminim1.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png?q=100',
    'Appliances': 'https://rukminim1.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png?q=100',
    'Travel': 'https://rukminim1.flixcart.com/flap/128/128/image/71050627a56b4693.png?q=100',
    'Fashion': 'https://rukminim1.flixcart.com/flap/128/128/image/c12afc017e6f24cb.png?q=100'
};

const defaultImage = 'https://rukminim1.flixcart.com/flap/128/128/image/f15c02bfeb02d15d.png?q=100';

const CategoryView = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products/categories');
                setCategories(res.data);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
                // Fallback to static categories if API fails
                setCategories([
                    { id: 1, name: 'Mobiles' },
                    { id: 2, name: 'Fashion' },
                    { id: 3, name: 'Electronics' },
                    { id: 4, name: 'Home & Kitchen' },
                    { id: 5, name: 'Travel' },
                    { id: 6, name: 'Appliances' },
                    { id: 7, name: 'Toys & Games' },
                    { id: 8, name: 'Beauty & Health' }
                ]);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryClick = (categoryName) => {
        navigate(`/?category=${encodeURIComponent(categoryName)}`);
    };

    return (
        <div className="bg-white shadow-sm mb-4 rounded-sm overflow-x-auto">
            <div className="flex justify-between items-center py-4 px-6 min-w-max gap-8 lg:justify-center">
                {categories.map((cat) => (
                    <div 
                        key={cat.id} 
                        className="flex flex-col items-center cursor-pointer group"
                        onClick={() => handleCategoryClick(cat.name)}
                    >
                        <div className="w-16 h-16 flex items-center justify-center mb-1 overflow-hidden transition-transform duration-300 group-hover:scale-105">
                            <img 
                                src={categoryImages[cat.name] || defaultImage} 
                                alt={cat.name} 
                                className="object-contain max-h-full max-w-full"
                            />
                        </div>
                        <span className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                            {cat.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryView;
