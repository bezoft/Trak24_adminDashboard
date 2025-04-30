import React, { useState } from 'react';
import axios from 'axios';
import Header from '../Components/header';
import axiosInstance from '../auth/interceptor';

function NewShipment() {
    const [formData, setFormData] = useState({
        shipmentCode: '',
        branch: 'Kerala', // Default branch
        quantity: 0,
        moreInfo: '',
        vendor: '',
        createdDate: '',
    });


    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(formData);
            
            const response = await axiosInstance.post('/api-trkadn/new-shipment', formData);
            if (response.status === 200) {
                setFormData({
                    shipmentCode: '',
                    branch: 'Kerala',
                    quantity: '',
                    moreInfo: '',
                    vendor: '',
                    createdDate: '',
                }); // Reset form
            }
        } catch (error) {
            console.error('Error saving shipment:', error.response?.data?.message || error.message);
        }
    };

    return (
        <>
            <Header />
            <div className="max-w-2xl mx-auto mt-28 mb-24">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-200 mb-6">Create New Shipment</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Shipment Code */}
                    {/* Shipment Code */}
                    <div>
                        <label className="block text-gray-800 dark:text-gray-200 mb-1">Shipment Code:</label>
                        <input
                            type="text"
                            name="shipmentCode"
                            value={formData.shipmentCode}
                            onChange={handleChange}
                           className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                            placeholder="Enter shipment code"
                        />
                    </div>
                    {/* Branch */}
                    <div>
                        <label className="block text-gray-800 dark:text-gray-200 mb-1">Branch:</label>
                        <select
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                        >
                            <option value="Kerala">Kerala</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    {/* Quantity */}
                    <div>
                        <label className="block text-gray-800 dark:text-gray-200 mb-1">Quantity:</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                            placeholder="Enter quantity"
                        />
                    </div>
                    {/* More Info */}
                    <div>
                        <label className="block text-gray-800 dark:text-gray-200 mb-1">More Info:</label>
                        <textarea
                            name="moreInfo"
                            value={formData.moreInfo}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                            placeholder="Additional information"
                        />
                    </div>
                    {/* Vendor */}
                    <div>
                        <label className="block text-gray-800 dark:text-gray-200 mb-1">Vendor:</label>
                        <select
                            name="vendor"
                            value={formData.vendor}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                        >
                             <option value="">Select Vendor</option>
                            <option value="rcbItem ">Select a Vendor</option>
                            <option value="Atrack Technologies">Atrack Technologies</option>
                            <option value="JEO Technologies">JEO Technologies</option>
                            <option value="Sibylsys">Sibylsys</option>
                            <option value="Sky Track systems">Sky Track systems</option>
                            <option value="Top Fly Tech">Top Fly Tech</option>
                            <option value="Ruptela">Ruptela</option>
                            <option value="BS Technotronics Private Ltd">BS Technotronics Private Ltd.</option>
                            <option value="iTriangle Infotech">iTriangle Infotech</option>
                            <option value="Minew">Minew</option>
                        </select>
                    </div>
                    {/* Shipment Created Date */}
                    <div>
                        <label className="block text-gray-800 dark:text-gray-200 mb-1">Shipment Created Date:</label>
                        <input
                            type="datetime-local"
                            name="createdDate"
                            value={formData.createdDate}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                    </div>
                    {/* Actions */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200 bg-gray-300 dark:bg-gray-700 rounded-md"
                            onClick={() => setFormData({
                                shipmentCode: '',
                                branch: 'Kerala',
                                quantity: '',
                                moreInfo: '',
                                vendor: '',
                                createdDate: '',
                            })}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded-md"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default NewShipment;

