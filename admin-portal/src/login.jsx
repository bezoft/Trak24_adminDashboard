import React, { useEffect, useState } from 'react';
import { BsGlobe2 } from "react-icons/bs";
import { FiUser, FiLock, FiLogIn } from "react-icons/fi";
import ThemeSwitcher from './Components/themeSwitcher';
import axios from "axios";
import { useAuth } from './contexts/AuthContext';
import { message } from "antd";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { encryptData } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            window.location.href = "/";
        }
    }, []);

    const HandleLogin = async () => {
        if (!username || !password) {
            message.warning("Please enter both username and password");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("/api-trkadn/admin-login", {
                "username": username,
                "password": password
            });

            if (response.status === 200) {
                message.success("Login successful");
                localStorage.setItem('token', response.data?.token);
                localStorage.setItem('user', response.data?.userId);
                encryptData({ id: response.data?.userId, name: response.data?.name, type: response.data?.type });
                window.location.href = "/";
            } else {
                message.error("Invalid credentials");
            }
        } catch (error) {
            message.error("Failed to login");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            HandleLogin();
        }
    };

    return (
        <>
            {/* Header - Kept exactly the same as original */}
            <header
                className={`fixed top-0 w-full z-50 flex items-center justify-between p-3 text-white transition-shadow`}
            >
                {/* Left Corner: Drawer Toggle Button */}
                <div className="flex items-center">
                    <img
                        src="/assets/trak24comtr.png"
                        alt="Left Logo"
                        className="h-8 dark:hidden"
                    />
                    <img
                        src="/assets/trak24comtrw.png"
                        alt="Left Logo"
                        className="h-8 hidden dark:block"
                    />
                </div>

                {/* Right Corner: Buttons */}
                <div className="flex items-center space-x-4">
                    <ThemeSwitcher />
                    <a
                        href='https://www.trak24.in'
                        className="p-2 hover:bg-gray-100 dark:hover:bg-[#343A46] rounded-full"
                    >
                        <BsGlobe2 className='text-black dark:text-white text-xl' />
                    </a>
                </div>
            </header>

            {/* Light Mode Login */}
            <section
                className="min-h-screen flex items-center justify-center dark:hidden bg-gray-100 dark:bg-[#1b1b1d]"
                style={{ backgroundImage: 'url(/assets/GS-bg2.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl backdrop-blur-sm">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
                        <p className="mt-2 text-gray-600">Log in to continue to admin dashboard</p>
                    </div>
                    
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center">
                                <FiUser className="text-gray-500 mr-2" />
                                <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
                            </div>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="block w-full px-4 py-3 rounded-xl border-gray-300 bg-transperent border transition-all duration-200 ease-in-out shadow-sm"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center">
                                <FiLock className="text-gray-500 mr-2" />
                                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                            </div>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="block w-full px-4 py-3 rounded-xl border-gray-300 bg-transperent border transition-all duration-200 ease-in-out shadow-sm"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <a href="#" className="font-medium text-orange-500 hover:text-orange-600">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={HandleLogin}
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <FiLogIn className="mr-2" /> Log In
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dark Mode Login */}
            <div className='hidden dark:block'>
                <section
                    className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#1b1b1d]"
                    style={{ backgroundImage: 'url(/assets/GS-bg3.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                    <div className="w-full max-w-md p-8 space-y-8 backdrop-blur-sm bg-[#1b1b1d]/20 rounded-2xl shadow-xl">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-white">Welcome Back!</h1>
                            <p className="mt-2 text-gray-300">Log in to continue to admin dashboard</p>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center">
                                    <FiUser className="text-gray-300 mr-2" />
                                    <label htmlFor="username-d" className="text-sm font-medium text-gray-300">Username</label>
                                </div>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        id="username-d"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="block w-full px-4 py-3 rounded-xl border-gray-600 bg-[#1b1b1d]/20 border text-white transition-all duration-200 ease-in-out"
                                        placeholder="Enter your username"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center">
                                    <FiLock className="text-gray-300 mr-2" />
                                    <label htmlFor="password-d" className="text-sm font-medium text-gray-300">Password</label>
                                </div>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <input
                                        type="password"
                                        id="password-d"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="block w-full px-4 py-3 rounded-xl border-gray-600 bg-[#1b1b1d]/20 border text-white transition-all duration-200 ease-in-out"
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-sm">
                                    <a href="#" className="font-medium text-orange-400 hover:text-orange-300">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>

                            <div>
                                <button
                                    onClick={HandleLogin}
                                    disabled={loading}
                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 ease-in-out shadow-lg"
                                >
                                    {loading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <FiLogIn className="mr-2" /> Log In
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Login;