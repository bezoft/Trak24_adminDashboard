import React, { useEffect, useState } from 'react';
import { BsGlobe2 } from "react-icons/bs";
import ThemeSwitcher from './Components/themeSwitcher';
import axios from "axios"
import {  useAuth } from './contexts/AuthContext';

function Login() {

    const [username, setUsername] = useState('bz');
    const [password, setPassword] = useState('b');
    const { encryptData} = useAuth()

    useEffect(() => {
        const token = localStorage.getItem('token'); // or use isAuthenticated() logic
        if (token) {
            // If the user is already authenticated, redirect them to the homepage
            window.location.href = "/"
        }
    }, []);

    const HandleLogin = async () => {
        console.log(username, password);

        try {
            const response = await axios.post("/api-trkadn/admin-login", {
                "username": username,
                "password": password
            })
            console.log(response.data);

            if (response.status === 200) {
                localStorage.setItem('token', response.data?.token)
                localStorage.setItem('user', response.data?.userId)
                
                encryptData({id:response.data?.userId,name:response.data?.name,type:response.data?.type})
           window.location.href = "/"
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <header
                className={`fixed top-0 w-full z-50 flex items-center justify-between p-3 text-white transition-shadow  `}
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

            {/* Main Content Section */}
            <section
                className="min-h-screen flex flex-col justify-center dark:hidden bg-gray-100 dark:bg-[#23272f] p-6"
                style={{ backgroundImage: 'url(/assets/GS-bg2.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            >


                <div className='flex justify-center items-center min-h-screen'>
                    {/* Main container: will adjust to fit the screen size */}
                    <div className=' rounded-xl shadow-lg bg-orange-500 bg-opacity-5 w-[850px] h-[550px]'>
                        <div className='flex h-full'>

                            {/* Login form section: 40% of the main container */}
                            <div className='flex flex-col items-center justify-center h-full space-y-3 w-2/4 p-4'>
                                <div className='flex flex-col items-center justify-center'>
                                    <h1 className='text-3xl'>Log In</h1>
                                    <p className='mt-1  mb-4'>Log in to continue to admin dashboard!</p>
                                </div>
                                <div className='w-full px-10'>
                                    <label htmlFor="email" className="block text-gray-600">Username</label>
                                    <input
                                        type="text"
                                        id="uername"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                         className="w-full px-4 py-2 mt-2 rounded-full border text-black border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>

                                <div className='w-full px-10'>
                                    <label htmlFor="password" className="block text-gray-600">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-2 mt-2 mb-3 rounded-full border text-black border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>

                                <button
                                    onClick={HandleLogin}
                                    className="bg-orange-500 w-3/4 py-3  text-white rounded-full hover:bg-orange-600"
                                >
                                    Login
                                </button>
                            </div>

                            {/* Image section: 60% of the main container */}
                            <div className='h-full w-3/5  p-3'>
                                <img src='/assets/log2.png' className='rounded-2xl' />
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <div className='hidden dark:block'>
                <section
                    className="min-h-screen flex flex-col justify-center bg-gray-100 dark:bg-[#23272f] p-6"
                    style={{ backgroundImage: 'url(/assets/GS-bg3.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                    <div className='flex justify-center items-center min-h-screen'>
                        {/* Main container: will adjust to fit the screen size */}
                        <div className=' rounded-xl shadow-lg bg-orange-500 bg-opacity-5 w-[850px] h-[550px]'>
                            <div className='flex h-full'>

                                {/* Login form section: 40% of the main container */}
                                <div className='flex flex-col items-center justify-center h-full space-y-3 w-2/4 p-4'>
                                    <div className='flex flex-col items-center justify-center'>
                                        <h1 className='text-3xl'>Log In</h1>
                                        <p className='mt-1  mb-4'>Log in to continue to admin dashboard!</p>
                                    </div>
                                    <div className='w-full px-10'>
                                        <label htmlFor="email" className="block text-white">Username</label>
                                        <input
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            type="uername"
                                            id="uername-d"
                                            className="w-full px-4 py-2 mt-2 rounded-full border text-white bg-transparent border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>

                                    <div className='w-full px-10'>
                                        <label htmlFor="password" className="block text-white">Password</label>
                                        <input
                                            type="password"
                                            id="password-d"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-2 mt-2 mb-3 rounded-full border text-white bg-transparent border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            placeholder="Enter your password"
                                            required
                                        />
                                    </div>

                                    <button
                                        onClick={HandleLogin}
                                        className="bg-orange-500 w-3/4 py-3  text-white rounded-full hover:bg-orange-600"
                                    >
                                        Login
                                    </button>
                                </div>

                                {/* Image section: 60% of the main container */}
                                <div className='h-full w-3/5  p-3'>
                                    <img src='/assets/log2.png' className='rounded-2xl' />
                                </div>

                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Login;
