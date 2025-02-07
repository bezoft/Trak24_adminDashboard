import React, { useEffect, useState } from 'react'
import Modal from '../../Components/Modal';
import axios from 'axios';

function CreateVehicle({ open, onClose }) {
    const [activeTab, setActiveTab] = useState('model'); // Default tab is 'model'
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [Allmake, setallMake] = useState([]);


    const createVehicle = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api-trkadn/create-vehicle', { make });
            console.log(response.data);

            if (response.statusText === "OK") {
                setMake("")
                setActiveTab("model")
                GetAllMakes()
            }
        } catch (error) {
            alert('Error creating user: ' + error.response.data.message);
        }
    };

    const AddModel = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api-trkadn/add-model', { make, model });
            console.log(response.data);

            if (response.statusText === "OK") {
                setMake("")
                setModel("")
                onClose()
            }
        } catch (error) {
            alert('Error creating user: ' + error.response.data.message);
        }
    };

    const GetAllMakes = async () => {

        try {
            const response = await axios.get('/api-trkadn/get-all-makes');
            console.log("makes", response.data.receivedData.data);

            if (response.statusText === "OK") {
                setallMake(response.data.receivedData.data)
            }
        } catch (error) {
            alert('Error creating user: ' + error.response.data.message);
        }
    };

    useEffect(() => {
        GetAllMakes()
    }, [])


    return (
        <Modal open={open} onClose={onClose}>
            {/* <div className="text-gray-900 dark:text-gray-200">
                        <h2 className="text-2xl font-bold mb-6 text-center">Add New Admin</h2>
                        <form  className="flex flex-col gap-6">
                            <div>
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
                                    //value={formData.name}
                                    placeholder="Enter Name"
                                    //onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    htmlFor="username"
                                >
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Enter Username"
                                    //value={formData.username}
                                    //onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    htmlFor="password"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter Password"
                                    //value={formData.password}
                                    //onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    htmlFor="adminType"
                                >
                                    Admin Type
                                </label>
                                <select
                                    id="adminType"
                                    name="adminType"
                                    //value={formData.adminType}
                                    //onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    required
                                >
                                    <option value={0}>Super Admin</option>
                                    <option value={1}>Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-between gap-4 mt-6">
                                <button
                                    type="button"
                                    //onClick={() => setOpen(false)}
                                    className="bg-gray-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-600 transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-orange-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-orange-700 transition duration-200"
                                >
                                    Add Admin
                                </button>
    
                            </div>
                        </form>
                    </div> */}

            <div style={{ padding: '20px' }}>
                {/* Tab Headers */}
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <button
                        className={`${activeTab === 'model' ? "border-2 #000000 dark:#fff rounded-tl-lg rounded-tr-lg" : "border border-b-2 border-l-0 border-r-0 border-t-0"}`}
                        style={{
                            flex: 1,
                            padding: '10px',
                            cursor: 'pointer',
                        }}
                        onClick={() => setActiveTab('model')}
                    >
                        Create Model
                    </button>
                    <button
                        className={`${activeTab === 'make' ? "border-2 #000000 dark:#fff rounded-tl-lg rounded-tr-lg" : "border border-b-2 border-l-0 border-r-0 border-t-0"}`}
                        style={{
                            flex: 1,
                            padding: '10px',
                            cursor: 'pointer',
                        }}
                        onClick={() => setActiveTab('make')}
                    >
                        Create Make
                    </button>
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === 'model' && (
                        <div>
                            <div className="text-gray-900 dark:text-gray-200">
                                <form onSubmit={AddModel} className="flex flex-col gap-6">
                                    <div>
                                        <label
                                            className="block text-sm font-medium mb-2"
                                            htmlFor="makename"
                                        >
                                            Make Name
                                        </label>
                                        <select
                                            id="makename"
                                            name="makename"
                                            value={make}
                                            onChange={(e) => setMake(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
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
                                            htmlFor="model"
                                        >
                                            Model & Varient
                                        </label>
                                        <input
                                            type="text"
                                            id="model"
                                            name="model"
                                            placeholder="Enter Model & Varient"
                                            value={model}
                                            required
                                            onChange={(e) => setModel(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div className="flex justify-between gap-4 mt-6">
                                        <button
                                            type="button"
                                            //onClick={() => setOpen(false)}
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
                        </div>
                    )}
                    {activeTab === 'make' && (
                        <div>
                            <div className="text-gray-900 dark:text-gray-200">
                                <form className="flex flex-col gap-6" onSubmit={createVehicle}>
                                    <div>
                                        <label
                                            className="block text-sm font-medium mb-2"
                                            htmlFor="makeName"
                                        >
                                            Make Name
                                        </label>
                                        <input
                                            type="text"
                                            id="makeName"
                                            name="makeName"
                                            value={make}
                                            placeholder="Enter Make Name"
                                            onChange={(e) => setMake(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            required
                                        />
                                    </div>

                                    <div className="flex justify-between gap-4 mt-6">
                                        <button
                                            type="button"
                                            //onClick={() => setOpen(false)}
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
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    )
}

export default CreateVehicle