import React, { useEffect, useState } from 'react'
import Modal from '../../Components/Modal';
import axios from 'axios';

function CreateAsset({ open, formData, handleChange, onClose,action }) {
  const [Allmake, setallMake] = useState([]);
  const [AllModels, setAllModels] = useState([]);

    const GetAllMakes = async () => {

        try {
            const response = await axios.get('/api-trkadn/get-all-makes');
            console.log("makes", response.data.data);

            if (response.status === 200) {
                setallMake(response.data.data)
            }
        } catch (error) {
            alert('Error creating user: ' + error.response.data.message);
        }
    };

    const GetAllModel = async () => {

       if(formData.assetMake!==""){
        try {
            const response = await axios.get(`/api-trkadn/get-models/${formData.assetMake}`);
            console.log("models", response.data.data);

            if (response.status === 200) {
                setAllModels(response.data.data)
            }
        } catch (error) {
            alert('Error creating user: ' + error.response.data.message);
        }
       }
    };

    useEffect(() => {
        GetAllModel()
    }, [formData.assetMake])
    

    useEffect(() => {
        GetAllMakes()
    }, [])


    return (
        <Modal open={open} onClose={onClose} >

            <div className="text-gray-900 dark:text-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-center">Create Asset</h2>
                <div className='space-y-5'>
                    <div>
                        <label
                            className="block text-sm font-medium mb-2"
                            htmlFor="assetMake"
                        >
                            Asset Make
                        </label>
                        <select
                            id="assetMake"
                            name="assetMake"
                            value={formData.assetMake}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                            required
                        >
                            <option value="">Select a Make</option>
                            {Array.isArray(Allmake) && Allmake.length > 0 ? (
                                Allmake.map((make, index) => (
                                    <option key={index} value={make.make}>{make.make}</option>
                                ))
                            ) : (
                                <option value="" disabled>No Make Found, Create One!</option>
                            )}
                        </select>
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium mb-2"
                            htmlFor="assetModel"
                        >
                            Asset Model
                        </label>
                        <select
                            id="assetModel"
                            name="assetModel"
                            value={formData.assetModel}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                            required
                        >
                              <option value="">Select a Model</option>
                            {Array.isArray(AllModels) && AllModels.length > 0 ? (
                                AllModels.map((model, index) => (
                                    <option key={index} value={model}>{model}</option>
                                ))
                            ) : (
                                <option value="" disabled>No Model Found, Create One!</option>
                            )}
                        </select>
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium mb-2"
                            htmlFor="assetRegNo"
                        >
                            Asset Registration No
                        </label>
                        <input
                            type="text"
                            id="assetRegNo"
                            name="assetRegNo"
                            placeholder="KL 12 A 1234"
                            value={formData.assetRegNo}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium mb-2"
                            htmlFor="assetType"
                        >
                            Asset Type
                        </label>
                        <select
                            id="assetType"
                            name="assetType"
                            value={formData.assetType}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                            required
                        >
                            <option value={""}>Select a Type</option>
                            <option value={"car"}>Car</option>
                            <option value={"bike"}>Bike</option>
                        </select>
                    </div>
                    <div className="flex justify-between gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-600 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={action}
                            className="bg-orange-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-orange-700 transition duration-200"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default CreateAsset