import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartCount } = useContext(CartContext);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex flex-col pt-1">
                        <span className="font-bold text-2xl tracking-tight italic">Flipkart</span>
                        <span className="text-xs text-gray-300 italic -mt-1 hover:underline">Explore <span className="text-yellow-400">Plus</span></span>
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl px-8 hidden sm:block">
                        <form onSubmit={handleSearch} className="relative group">
                            <input
                                type="text"
                                placeholder="Search for products, brands and more"
                                className="w-full bg-white text-gray-900 rounded-sm py-2 px-4 pl-4 pr-10 focus:outline-none shadow-sm h-10 transition-shadow duration-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit" className="absolute right-0 top-0 mt-2 mr-3 text-blue-600">
                                <Search size={20} />
                            </button>
                        </form>
                    </div>

                    {/* Right side links */}
                    <div className="flex items-center space-x-6">
                        {user ? (
                            <div className="flex items-center space-x-4 relative group cursor-pointer">
                                <span className="font-semibold text-white flex items-center hover:text-gray-200">
                                    <User size={18} className="mr-1" /> {user.name.split(' ')[0]}
                                </span>
                                {/* Dropdown menu */}
                                <div className="absolute top-8 right-0 w-48 bg-white rounded shadow-lg py-2 hidden group-hover:block transition-opacity duration-200 opacity-0 group-hover:opacity-100 border border-gray-200">
                                     <div className="absolute -top-2 right-4 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-200"></div>
                                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 font-medium">Orders</Link>
                                    <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 font-medium flex gap-2 items-center">
                                       <LogOut size={16}/> Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="bg-white text-blue-600 font-semibold py-1 px-8 rounded-sm hover:text-white hover:bg-transparent border border-white transition-colors duration-200 h-8 flex items-center justify-center">
                                Login
                            </Link>
                        )}

                        {/* Cart */}
                        <Link to="/cart" className="flex items-center font-semibold text-white hover:text-gray-200 relative">
                            <ShoppingCart size={24} className="mr-1" />
                            <span className="hidden sm:inline">Cart</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -left-2 bg-yellow-500 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center text-black border border-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
            {/* Mobile search */}
            <div className="sm:hidden px-4 pb-3">
                 <form onSubmit={handleSearch} className="relative">
                     <input
                         type="text"
                         placeholder="Search products..."
                         className="w-full bg-white text-gray-900 rounded-sm py-2 px-4 focus:outline-none shadow-sm"
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                     />
                     <button type="submit" className="absolute right-0 top-0 mt-2 mr-3 text-blue-600">
                         <Search size={20} />
                     </button>
                 </form>
             </div>
        </header>
    );
};

export default Navbar;
