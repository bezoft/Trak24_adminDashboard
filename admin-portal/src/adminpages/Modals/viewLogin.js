import React, { useEffect, useState } from 'react'
import Modal from '../../Components/Modal';
import axios from 'axios';

function ViewLogin({ open, onClose, username, id }) {
    const [formData, setFormData] = useState({
        username: username,
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log(formData,id);

            const response = await axios.post(`/api-trkadn/update-user/${id}`, formData);

            if (response.status === 200) {
                setFormData({
                    username: "",
                    password: ""
                }); // Reset form
                onClose()
            }
        } catch (error) {
            console.error('Error saving batch:', error.response?.data?.message || error.message);
        }
    };



    return (
        <Modal open={open} onClose={onClose}>

            <div className="text-gray-900 dark:text-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-center">User Login</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">


                    <div className='w-full min-w-80'>
                        <label
                            className="block text-sm font-medium mb-2"
                            htmlFor="username"
                        >
                            User Name
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            placeholder="Enter Username"
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                            required
                        />
                    </div>

                    <div className='w-full min-w-80'>
                        <label
                            className="block text-sm font-medium mb-2"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            type="text"
                            id="password"
                            name="password"
                            placeholder='Enter New Password'
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                            required
                        />
                    </div>

                    <div className="flex justify-between gap-4 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-600 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-orange-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-orange-700 transition duration-200"
                        >
                            Save
                        </button>

                    </div>
                </form>
            </div>
        </Modal>
    )
}

export default ViewLogin