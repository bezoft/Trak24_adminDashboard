import React, { useEffect, useState } from 'react'
import Header from '../Components/header'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { processReportData } from '../DataHelpers/ReportPro';
import Modal from '../Components/Modal';
import ToggleButton from '../Components/ToggleButton';
import AddressCell from '../Components/AddressCell';
import SignalStrengthIcon from '../Components/SignalStrength';
import AllContacts from './Modals/AllContacts';
import CreateAsset from './Modals/CreateAsset';
import { DateTimeFRMT } from '../DataHelpers/Date&Time';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../auth/interceptor';

function EagleEyeMonitoring() {

    const [Data, setData] = useState([]);
    const [Customers, setCustomers] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null);
    const [selectedCustomer, setselectedCustomer] = useState("")
    const navigate = useNavigate();
    const { decryptData } = useAuth()
    const [open, setOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [company, setcompany] = useState("")
    const [permissions, setPermissions] = useState({
        weblogin: false,
        applogin: false,
        dailyAutoReports: false,
    });
    const [formData, setFormData] = useState({
        id: "",
        customer: "",
        customerInfo: "",
        assetMake: "",
        assetModel: "",
        assetRegNo: "",
        assetType: "",
    });
    const closeModal = () => setIsModalOpen(false);

    const [allContactModal, setallContactModal] = useState(false);
    const closeallContactModal = () => setallContactModal(false);

    const handleToggle = (key) => {
        setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleAssetChange = (e) => {
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
    const updatePermissions = (newPermissions) => {
        console.log(newPermissions);

        setPermissions((prevPermissions) => ({
            ...prevPermissions,
            ...newPermissions,
        }));
    };

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const GetUserUnits = async (selectedCustomer) => {
        try {
            //setIsLoading(true);
            const res = await axiosInstance.get(`/api-trkadn/get-units/${selectedCustomer}`);
            if (res.status === 200) {
                setData(res.data.data);
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
    useEffect(() => {
        GetallUsers()
    }, [])


    const GetallUsers = async () => {
        try {
            //setIsLoading(true);
            const res = await axiosInstance.get("/api-trkadn/all-users");
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
    const HandleUpdateVehicle = async () => {
        try {
            console.log("Loading");
            //setIsLoading(true);
            const res = await axiosInstance.post(`/api-trkadn/update-vehicle/${formData.id}`, formData);
            if (res.status === 200) {
                closeModal();
                setFormData({
                    id: "",
                    assetMake: "",
                    assetModel: "",
                    assetRegNo: "",
                    assetType: "",
                })
                GetUserUnits(selectedCustomer);
            } else {
                console.log("Error updating vehicle");
            }
        } catch (error) {
            console.error("Error updating vehicle:", error);
        } finally {
            // Ensure loading and refreshing states are reset
            //   setIsLoading(false);
            //   setIsRefreshing(false);
        }
    }

    const handleChange = (e) => {
        GetUserUnits(e.target.value)
        setselectedCustomer(e.target.value);
    };
    const ClientLogin = (id) => {
        console.log(id);
        const admid = decryptData().id
        const data = encodeURIComponent(JSON.stringify({ admid: admid, clid: id }));

        window.open(`https://clientdashboard.trak24.in/login?data=${data}`, "_blank")
    }


    return (
        <>
            <Header />
            <div className='mt-24 flex flex-col md:flex-row justify-between items-center h-full'>
                <div>
                    <h1 className='text-black dark:text-white font-semibold text-4xl p-6 mb-10'>
                        Eagle Eye Monitoring
                    </h1>
                </div>

                <div className='flex flex-row justify-end m-4 p-3 mb-10'>
                    <div className="relative w-full md:min-w-72">
                        <select
                            id="assetType"
                            name="assetType"
                            value={selectedCustomer}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none pr-10"
                            required
                        >
                            <option value={""}>Select a Client</option>
                            {Customers.map((customer) => (
                                <option key={customer._id} value={customer._id}>{customer.firstname}, {customer.company ? customer.company : customer.lastname}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 dark:text-gray-300">
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="min-h-screen px-6">
                <div className="overflow-hidden rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                                <tr className="bg-gray-200 dark:bg-[#3b3b3b]">
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Sl No</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Asset Info</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Unit Info</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Date & Time</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">GPS Info</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">GPS Reading</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Km Reading</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-[#1b1b1d] divide-y divide-gray-200 dark:divide-gray-700">
                                {Array.isArray(Data) && Data.length > 0 ? Data.map((item, index) => (
                                    <React.Fragment key={index}>
                                        {/* Main Row */}
                                        <tr
                                            className="hover:bg-gray-100 dark:hover:bg-[#28282a] cursor-pointer transition-colors duration-150"
                                            onClick={() => toggleRow(index)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{item.assetMake} {item.assetModel}</span>
                                                    <span className="text-gray-500 dark:text-gray-400 text-xs">{item.assetRegNo}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.imei}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{DateTimeFRMT(item.liveData?.date, item.liveData?.time)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                <AddressCell latitude={item.liveData?.latitude} longitude={item.liveData?.longitude} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.liveData?.speed} km/h</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{item.liveData?.gps_odometer} km</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{item.liveData?.digital_input_1_status === "1" ? "Moving" : "Stopped"}</td>
                                        </tr>

                                        {/* Collapsible Row */}
                                        {expandedRow === index && (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-6 bg-gray-50 dark:bg-[#1b1b1d] border-t border-gray-200 dark:border-gray-700">


                                                    <div className="flex flex-col space-y-8">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
                                                            <div className="flex flex-col p-4 bg-white dark:bg-[#28282a] rounded-lg shadow-sm">
                                                                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Client Portal</span>
                                                                <button
                                                                    onClick={() => ClientLogin(item.customer._id)}
                                                                    className="text-sm font-medium text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 flex items-center"
                                                                >
                                                                    Log In
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                            </div>

                                                            <div className="flex flex-col p-4 bg-white dark:bg-[#28282a] rounded-lg shadow-sm">
                                                                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">GPS Coordinates</span>
                                                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.liveData?.latitude}, {item.liveData?.longitude}</span>
                                                            </div>

                                                            <div className="flex flex-col p-4 bg-white dark:bg-[#28282a] rounded-lg shadow-sm">
                                                                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Add To Incidents</span>
                                                                <a
                                                                    href={`/create-incident/${item.customer.company ? item.customer.company : item.customer.firstname}/${item.customer._id}`}
                                                                    className="text-sm font-medium text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 flex items-center"
                                                                >
                                                                    Add
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                                                    </svg>
                                                                </a>
                                                            </div>

                                                            <div className="flex flex-col p-4 bg-white dark:bg-[#28282a] rounded-lg shadow-sm">
                                                                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Contacts</span>
                                                                <button
                                                                    onClick={() => setallContactModal(true)}
                                                                    className="text-sm font-medium text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 flex items-center"
                                                                >
                                                                    View All
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                                {allContactModal === true ? (<AllContacts Aopen={allContactModal} AonClose={closeallContactModal} contacts={item.customer.contacts} />) : null}
                                                            </div>

                                                            <div className="flex flex-col p-4 bg-white dark:bg-[#28282a] rounded-lg shadow-sm">
                                                                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Update Vehicle</span>
                                                                <button
                                                                    onClick={() => {
                                                                        setIsModalOpen(true);
                                                                        setFormData({
                                                                            assetMake: item.assetMake,
                                                                            assetModel: item.assetModel,
                                                                            assetRegNo: item.assetRegNo,
                                                                            id: item._id,
                                                                            assetType: item.assetType
                                                                        })
                                                                    }}
                                                                    className="text-sm font-medium text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 flex items-center"
                                                                >
                                                                    Update
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                                {allContactModal === true ? (<AllContacts Aopen={allContactModal} AonClose={closeallContactModal} contacts={item.customer.contacts} />) : null}
                                                            </div>
                                                            
                                                            <div className="flex flex-col p-4 bg-white dark:bg-[#28282a] rounded-lg shadow-sm">
                                                                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Quick Map View</span>
                                                                <a
                                                                    title="Directions"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    href={`https://www.google.com/maps/search/${item.liveData?.latitude},${item.liveData?.longitude}`}
                                                                    className="text-sm font-medium text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 flex items-center"
                                                                >
                                                                    Open
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                </a>
                                                                {allContactModal === true ? (<AllContacts Aopen={allContactModal} AonClose={closeallContactModal} contacts={item.customer.contacts} />) : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                )) : (
                                    <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            <span className="text-lg font-medium">No data available</span>
                                            <span className="text-sm">Please select a client to view data</span>
                                        </div>
                                    </td>
                                </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="text-gray-900 dark:text-gray-200 space-y-4">
                    <h2 className="text-2xl font-bold mb-6 text-center">Permissions for {company}</h2>
                    <div className="space-y-10">
                        {/* Web Login Toggle */}
                        <div className="flex items-center justify-between">
                            <label className="text-lg">Web Login</label>
                            <ToggleButton
                                isToggled={permissions.weblogin}
                                onToggle={() => handleToggle("weblogin")}
                            />
                        </div>
                        {/* App Login Toggle */}
                        <div className="flex items-center justify-between">
                            <label className="text-lg">App Login</label>
                            <ToggleButton
                                isToggled={permissions.applogin}
                                onToggle={() => handleToggle("applogin")}
                            />
                        </div>
                        {/* Daily Auto Reports Toggle */}
                        <div className="flex items-center justify-between">
                            <label className="text-lg">Daily Auto Reports</label>
                            <ToggleButton
                                isToggled={permissions.dailyAutoReports}
                                onToggle={() => handleToggle("dailyAutoReports")}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-10 flex justify-end space-x-10 ">
                    <button
                        onClick={() => setOpen(false)}
                        className="px-6 py-2 text-sm text-gray-800 dark:text-gray-200 bg-gray-300 dark:bg-gray-700 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        //onClick={handleSave}
                        className="px-6 py-2 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded-md"
                    >
                        Save
                    </button>
                </div>

            </Modal>
            {isModalOpen === true ? (<CreateAsset open={isModalOpen} action={HandleUpdateVehicle} onClose={closeModal} formData={formData} setFormData={setFormData} handleChange={handleAssetChange} />) : null}
        </>
    )
}

export default EagleEyeMonitoring