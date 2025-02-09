import React, { useEffect, useState } from 'react'
import Modal from '../../Components/Modal';
import axios from 'axios';

function CreateSimBatch({ open, onClose }) {
    const [formData, setFormData] = useState({
        batchName: '',
        gsmProvider: "",
        purchaseDate: '', // Default branch
        simCardnos: 0,
        remarks: '',
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
            console.log(formData);

            const response = await axios.post('/api-trkadn/create-sim-batch', formData);
console.log(response);

            if (response.status === 201) {
                setFormData({
                    sbatch: '',
                    purchaseDate: '', // Default branch
                    simCardnos: 0,
                    remarks: '',
                }); // Reset form
                onClose()
            }
        } catch (error) {
            console.error('Error saving batch:', error.response?.data?.message || error.message);
        }
    };



    return (
        <Modal open={open} onClose={onClose} size={"xl"}>

            <div className="text-gray-900 dark:text-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-center">Create SIM Batch</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className='flex space-x-5'>
                        <div className='w-full'>
                            <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="batchName"
                            >
                                Batch Name
                            </label>
                            <input
                                type="text"
                                id="batchName"
                                name="batchName"
                                value={formData.batchName}
                                placeholder="Enter Batch Name"
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                required
                            />
                        </div>
                        <div className='w-full'>
                            <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="gsmProvider"
                            >
                                GSM Provider
                            </label>
                            <select
                                id="gsmProvider"
                                name="gsmProvider"
                                value={formData.gsmProvider}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                required
                            >
                                <option value="">Select Provider</option>
                                <option value="Airtel">Airtel</option>
                                <option value="Vi eSIM">Vi eSIM</option>
                                <option value="BSNL">BSNL</option>
                                <option value="Vodafone">Vodafone</option>
                                <option value="Du">Du</option>
                                <option value="Nawras">Nawras</option>
                                <option value="Etisalat">Etisalat</option>
                                <option value="M2M">M2M</option>
                                <option value="Airtel eSIM">Airtel eSIM</option>
                            </select>
                        </div>
                    </div>

                    <div className='flex space-x-5'>
                    <div className='w-full'>
                            <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="purchaseDate"
                            >
                                Purchase Date
                            </label>
                            <input
                                type="datetime-local"
                                name="purchaseDate"
                                value={formData.purchaseDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                        </div>
                        <div className='w-full'>
                            <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="simCardnos"
                            >
                                Sim Quantity
                            </label>
                            <input
                                type="number"
                                id="simCardnos"
                                name="simCardnos"
                                placeholder="Enter Sim Quantity"
                                value={formData.simCardnos}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                required
                            />
                        </div>
                    </div>

                    <div className='w-full'>
                        <label
                            className="block text-sm font-medium mb-2"
                            htmlFor="remarks"
                        >
                            Remarks
                        </label>
                        <input
                            type="text"
                            id="remarks"
                            name="remarks"
                            value={formData.remarks}
                            placeholder="Enter Remarks"
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
                            Create
                        </button>

                    </div>
                </form>
            </div>
        </Modal>
    )
}

export default CreateSimBatch