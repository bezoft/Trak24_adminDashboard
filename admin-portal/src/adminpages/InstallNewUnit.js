import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Header from '../Components/header';
import Modal from '../Components/Modal';
import { useParams } from "react-router-dom";
import CreateAsset from './Modals/CreateAsset';

function InstallNewUnit() {
    const [Customers, setCustomers] = useState([]);
    const { id, sim } = useParams();
 const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        imei: id,
        customer: "",
        customerInfo: "",
        assetMake: "",
        assetModel: "",
        assetRegNo: "",
        assetType: "",
        simAttached:sim,
        kmreading: "",
        gprsPort: 0,
    });
    const closeModal = () => setIsModalOpen(false);

    const InstallUnit = async () => {
        try {

            const response = await axios.post('/api-trkadn/install-new-unit', formData);

            if (response.status === 200) {
                console.log("susssess");
                
                setFormData({
                    imei:"",
                    customer: "",
                    customerInfo: "",
                    assetMake: "",
                    assetModel: "",
                    assetRegNo: "",
                    assetType: "",
                    simAttached:"",
                    kmreading: "",
                    gprsPort: 0,
                }); // Reset form
                window.location.href = "/stock-list"
            }
        } catch (error) {
            console.error('Error saving shipment:', error.response?.data?.message || error.message);
        }
    };
    console.log("Form",formData);
    

    const handleChange = (e) => {
        const { name, value } = e.target;

        // If 'customer' is being updated, set both 'customer' and 'customerInfo'
        if (name === "customer") {
            const selectedCustomer = Customers.find(
                (customer) => customer._id === value
            );
            setFormData((prevState) => ({
                ...prevState,
                [name]: value, // update the customer _id
                customerInfo: `${selectedCustomer.firstname}, ${selectedCustomer.company ? selectedCustomer.company : selectedCustomer.lastname}`, // update customer info
            }));
        } else {
            // Handle other field updates normally
            setFormData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    useEffect(() => {
        GetallCustomers()
    }, [])

    console.log(Customers);

    const GetallCustomers = async () => {
        try {
            console.log("Loading");
            //setIsLoading(true);
            const res = await axios.get("/api-trkadn/all-users");
            if (res.status === 200) {
                setCustomers(res.data);
            } else {
                console.log("Empty data received");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            // Ensure loading and refreshing states are reset
            //   setIsLoading(false);
            //   setIsRefreshing(false);
        }
    };


    return (
        <>
            <Header />
            <div className="mt-24 flex flex-col space-y-8 px-4 md:px-8 mb-24">
                <h1 className="text-gray-900 dark:text-gray-300 font-semibold text-2xl md:text-3xl">
                    Install New Unit
                </h1>

                <div className="flex flex-col md:flex-row w-full md:space-x-5 items-start justify-center">

                    {/* Left Section */}
                    <div className=' space-y-5'>
                        <div className=" border border-gray-300 dark:border-gray-600 p-6 flex flex-col space-y-6 rounded-lg">
                            <h1 className="text-gray-900 dark:text-gray-300 font-semibold text-xl md:text-xl">
                                Regular Options
                            </h1>
                            <div className='flex flex-col md:flex-row w-full space-x-10'>


                                <div>
                                    <label
                                        className="block text-md font-medium mb-2 text-gray-700 dark:text-gray-300"
                                        htmlFor="customer"
                                    >
                                        Customer
                                    </label>
                                    <select
                                        id="customer"
                                        value={formData.customer}
                                        onChange={handleChange}
                                        name="customer"
                                        className="w-72 px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        required
                                    >
                                        <option value={""}>Select a Client</option>
                                        {Customers.map((customer) => (
                                            <option key={customer._id} value={customer._id}>{customer.firstname}, {customer.company ? customer.company : customer.lastname}</option>
                                        ))}

                                    </select>
                                </div>

                                <div>
                                    <label
                                        className="block text-md font-medium mb-2 text-gray-700 dark:text-gray-300"
                                        htmlFor="kmreading"
                                    >
                                        Km Reading
                                    </label>
                                    <input
                                        type="text"
                                        id="kmreading"
                                        value={formData.kmreading}
                                        onChange={handleChange}
                                        name="kmreading"
                                        placeholder="Enter Km Reading"
                                        className="w-72 px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-md font-medium mb-2 text-gray-700 dark:text-gray-300"
                                        htmlFor="asset"
                                    >
                                        Create Asset
                                    </label>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className=" w-72 px-4 py-3 border border-gray-600 text-black dark:text-white font-medium rounded-lg dark:hover:bg-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    >
                                        Create
                                    </button>
                                </div>
                            </div>

                            <div className='flex flex-col md:flex-row space-x-10'>

                                <div >
                                    <label
                                        className="block text-md font-medium mb-2 text-gray-700 dark:text-gray-300"
                                        htmlFor="gprsPort"
                                    >
                                        GPRS Port
                                    </label>
                                    <select
                                        id="gprsPort"
                                        name="gprsPort"
                                        value={formData.gprsPort}
                                        onChange={handleChange}
                                        className=" w-72 px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        required
                                    >
                                        <option value={""}>Select a Port</option>
                                        <option value={1235}>1235</option>
                                        <option value={9874}>9874</option>
                                    </select>
                                </div>

                            </div>
                        </div>


                        <div className=" opacity-30 border border-gray-300 dark:border-gray-600 p-6 flex flex-col space-y-6 rounded-lg pointer-events-none">
                            <h1 className="text-gray-900 dark:text-gray-300 font-semibold text-xl md:text-xl">
                                Advanced Options
                            </h1>
                            <div className='flex flex-col md:flex-row w-full space-x-10'>
                                <div >
                                    <label
                                        className="block text-md font-medium mb-2 text-gray-700 dark:text-gray-300"
                                        htmlFor="adminType"
                                    >
                                        GPRS Port
                                    </label>
                                    <select
                                        id="adminType"
                                        name="adminType"
                                        className=" w-72 px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        required
                                    >
                                        <option value={0}>Super Admin</option>
                                        <option value={1}>Admin</option>
                                    </select>
                                </div>

                                <div>
                                    <label
                                        className="block text-md font-medium mb-2 text-gray-700 dark:text-gray-300"
                                        htmlFor="KmReading"
                                    >
                                        Km Reading
                                    </label>
                                    <input
                                        type="text"
                                        id="KmReading"
                                        name="KmReading"
                                        placeholder="Enter KmReading"
                                        className="w-72 px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className='flex flex-col md:flex-row space-x-10'>
                                <div>
                                    <label
                                        className="block text-md font-medium mb-2 text-gray-700 dark:text-gray-300"
                                        htmlFor="customer"
                                    >
                                        Customer
                                    </label>
                                    <select
                                        id="customer"
                                        name="customer"
                                        className="w-72 px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        required
                                    >
                                        <option value={0}>Super Admin</option>
                                        <option value={1}>Admin</option>
                                    </select>
                                </div>

                                <div>
                                    <label
                                        className="block text-md font-medium mb-2 text-gray-700 dark:text-gray-300"
                                        htmlFor="asset"
                                    >
                                        Create Asset
                                    </label>
                                    <button
                                        className=" w-72 px-4 py-3 border border-gray-600 text-black dark:text-white font-medium rounded-lg dark:hover:bg-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    >
                                        Create
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Section (Summary) */}
                    <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-6 space-y-6  w-full md:max-w-96">
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-300">Summary</h1>

                        <div className="space-y-6">
                            <div
                                className="flex justify-between items-center space-x-20 text-gray-700 dark:text-gray-300"
                            >
                                <h2 className="font-medium">Unit Id:</h2>
                                <p className="text-sm text-right">{formData.imei || ''}</p>
                            </div>
                            <div
                                className="flex justify-between items-center space-x-20 text-gray-700 dark:text-gray-300"
                            >
                                <h2 className="font-medium">Attached SIM:</h2>
                                <p className="text-sm text-right">{sim || ''}</p>
                            </div>
                            <div
                                className="flex justify-between items-center space-x-20 text-gray-700 dark:text-gray-300"
                            >
                                <h2 className="font-medium">Customer:</h2>
                                <p className="text-sm text-right">{formData.customerInfo || ''}</p>
                            </div>
                            <div
                                className="flex justify-between items-center space-x-20 text-gray-700 dark:text-gray-300"
                            >
                                <h2 className="font-medium">Km Reading:</h2>
                                <p className="text-sm text-right">{formData.kmreading || ''}</p>
                            </div>
                            <div
                                className="flex justify-between items-center space-x-20 text-gray-700 dark:text-gray-300"
                            >
                                <h2 className="font-medium">Asset Info:</h2>
                                <p className="text-sm text-right">{formData.assetMake}, {formData.assetModel}<br />{formData.assetRegNo} - {formData.assetType}</p>

                            </div>
                            <div
                                className="flex justify-between items-center space-x-20 text-gray-700 dark:text-gray-300"
                            ><h2 className="font-medium">GPRS Port:</h2>
                                <p className="text-sm text-right">{formData.gprsPort || '0'}</p>
                            </div>
                        </div>

                        <button
                            className="w-full px-4 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600"
                            onClick={InstallUnit}
                        >
                            Install Unit
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen === true ? (<CreateAsset open={isModalOpen} onClose={closeModal} formData={formData} setFormData={setFormData} handleChange={handleChange} />) : null}
        </>
    );
}

export default InstallNewUnit;
