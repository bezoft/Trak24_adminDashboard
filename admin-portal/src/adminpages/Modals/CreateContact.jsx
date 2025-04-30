import React, { useEffect, useState } from 'react'
import Modal from '../../Components/Modal';
import axios from 'axios';
import axiosInstance from '../../auth/interceptor';

function CreateContact({ Mopen, MonClose, id }) {
    const [Data, setData] = useState([]);
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        comType: "",
        phNumber: "",
        email: "",
        notes: "",
        address: ""
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
            const response = await axiosInstance.put(`/api-trkadn/create-contact/${id}`, formData);
            console.log(response);

            if (response.status === 200) {

                setFormData({
                    name: "",
                    comType: "",
                    phNumber: "",
                    email: "",
                    notes: "",
                    address: ""
                });
                MonClose()
            }

        } catch (error) {
            console.error("Error adding Contact:", error);
        }
    };



    return (
        <Modal open={Mopen} onClose={MonClose} size={"xl"}>

            <div className="text-gray-900 dark:text-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-center">New Contact Info</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className='flex space-x-5 '>
                        <div className='w-full'>
                            <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="name"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                placeholder="Enter Name"
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                required
                            />
                        </div>
                        <div className='w-full'>
                            <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="comType"
                            >
                                Type of Communication
                            </label>
                            <select
                                id="comType"
                                name="comType"
                                value={formData.comType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                required
                            >
                                <option value="">Select a Type</option>
                                <option value="Email">Email</option>
                            </select>
                        </div>

                    </div>

                    <div className='flex space-x-5'>
                        <div className='w-full'>
                            <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="phNumber"
                            >
                                Phone Number
                            </label>
                            <input
                                type="text"
                                id="phNumber"
                                name="phNumber"
                                placeholder="Enter Phone Number"
                                value={formData.phNumber}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                        </div>
                        <div className='w-full'>
                            <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="email"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                required
                            />
                        </div>
                    </div>

                    <div className='flex space-x-5'>
                        <div className='w-full'>
                            <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="notes"
                            >
                                Notes
                            </label>
                            <input
                                type="text"
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                placeholder="Enter Notes"
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                required
                            />
                        </div>
                        <div className='w-full'>
                            <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="address"
                            >
                                Address
                            </label>
                            <input
                                type="textarea"
                                id="address"
                                name="address"
                                value={formData.address}
                                placeholder="Enter Address"
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                required
                            />
                        </div>
                    </div>


                    <div className="flex justify-between gap-4 mt-6">
                        <button
                            type="button"
                            onClick={MonClose}
                            className="bg-gray-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-600 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-orange-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-orange-700 transition duration-200"
                        >
                           Create 
                        </button>

                    </div>
                </form>
            </div>
        </Modal>
    )
}

export default CreateContact