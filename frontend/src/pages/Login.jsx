import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { login, register } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData.name, formData.email, formData.password, '', '');
            }
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="flex w-full max-w-4xl bg-white rounded shadow-sm overflow-hidden h-[550px]">
                {/* Left Side Branding */}
                <div className="hidden md:flex flex-col justify-between w-[40%] bg-blue-600 p-10 text-white relative">
                    <div>
                        <h2 className="text-3xl font-bold mb-4">{isLogin ? 'Login' : 'Looks like you\'re new here!'}</h2>
                        <p className="text-gray-200 text-lg">{isLogin ? 'Get access to your Orders, Wishlist and Recommendations' : 'Sign up with your details to get started'}</p>
                    </div>
                    <div className="absolute bottom-10 left-0 right-0 flex justify-center">
                        {/* Placeholder graphic for branding */}
                         <div className="w-48 h-32 bg-blue-500 rounded-lg flex items-center justify-center shadow-inner opacity-50 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-20 transform rotate-45"></div>
                             <span className="text-3xl font-extrabold italic opacity-30">Flipkart</span>
                         </div>
                    </div>
                </div>

                {/* Right Side Form */}
                <div className="w-full md:w-[60%] p-10 flex flex-col pt-14 relative">
                    {error && <div className="mb-4 bg-red-100 text-red-600 p-3 rounded text-sm text-center border border-red-200 shadow-sm">{error}</div>}
                    
                    <form onSubmit={handleSubmit} className="flex-grow space-y-6">
                        {!isLogin && (
                             <div className="relative border-b-2 border-gray-300 focus-within:border-blue-500 transition-colors">
                                 <input
                                     type="text"
                                     placeholder=""
                                     className="w-full py-2 outline-none peer text-gray-900 bg-transparent relative z-10"
                                     value={formData.name}
                                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                     required
                                 />
                                 <label className="absolute left-0 top-2 text-gray-500 transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-500 peer-valid:-top-4 peer-valid:text-xs z-0 pointer-events-none">Full Name</label>
                             </div>
                        )}
                        <div className="relative border-b-2 border-gray-300 focus-within:border-blue-500 transition-colors">
                            <input
                                type="email"
                                placeholder=""
                                className="w-full py-2 outline-none peer text-gray-900 bg-transparent relative z-10"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                            <label className="absolute left-0 top-2 text-gray-500 transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-500 peer-valid:-top-4 peer-valid:text-xs z-0 pointer-events-none">Email Address</label>
                        </div>

                        <div className="relative border-b-2 border-gray-300 focus-within:border-blue-500 transition-colors mt-8">
                            <input
                                type="password"
                                placeholder=""
                                className="w-full py-2 outline-none peer text-gray-900 bg-transparent relative z-10"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                             <label className="absolute left-0 top-2 text-gray-500 transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-500 peer-valid:-top-4 peer-valid:text-xs z-0 pointer-events-none">Password</label>
                        </div>
                         
                         {isLogin && <p className="text-xs text-gray-500 mt-4 leading-relaxed tracking-wide">By continuing, you agree to Flipkart's <a href="#" className="text-blue-600">Terms of Use</a> and <a href="#" className="text-blue-600">Privacy Policy</a>.</p>}

                        <div className="pt-4">
                            <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-sm font-bold shadow-sm transition-colors uppercase text-[15px]">
                                {isLogin ? 'Login' : 'Continue'}
                            </button>
                            <p className="text-sm text-center mt-4 text-gray-500">OR</p>
                            <button type="button" className="w-full bg-white hover:bg-gray-50 text-blue-600 border border-gray-300 py-3.5 mt-4 rounded-sm font-semibold shadow-sm transition-colors text-[15px]">
                                Request OTP
                            </button>
                        </div>
                    </form>

                    <div className="mt-auto text-center pt-8">
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-blue-600 font-bold tracking-wide hover:underline text-[15px]"
                        >
                            {isLogin ? 'New to Flipkart? Create an account' : 'Existing User? Log in'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
