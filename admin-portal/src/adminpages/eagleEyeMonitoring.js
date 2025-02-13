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
            const res = await axios.get(`/api-trkadn/get-units/${selectedCustomer}`);
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
    console.log(Data, "dataaaa");


    useEffect(() => {
        GetallUsers()
    }, [])

    console.log(Data);

    const GetallUsers = async () => {
        try {
            //setIsLoading(true);
            const res = await axios.get("/api-trkadn/all-users");
            if (res.statusText === "OK") {
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
            const res = await axios.post(`/api-trkadn/update-vehicle/${formData.id}`, formData);
            if (res.statusText === "OK") {
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
        
       window.open(`http://192.168.224.1:3001/login?data=${data}`,"_blank")
    }


    return (
        <>
            <Header />
            <div className=' mt-24 flex flex-col md:flex-row justify-between items-center h-full'>
                <div>
                    <h1 className='text-black dark:text-white font-semibold text-3xl p-6'>
                        Eagle Eye Monitoring Center
                    </h1>
                </div>

                <div className='flex flex-row justify-end space-x-4 m-4 p-3'>
                    <select
                        id="assetType"
                        name="assetType"
                        value={selectedCustomer}
                        onChange={handleChange}
                        className="w-full md:min-w-72 px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                        required
                    >
                        <option value={""}>Select a Client</option>
                        {Customers.map((customer) => (
                            <option value={customer._id}>{customer.firstname}, {customer.company ? customer.company : customer.lastname}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={`   min-h-screen`}> {/* Theme-based background and text color */}
                <div className="overflow-x-auto p-4 ">
                    <table className="min-w-full border border-gray-300  dark:border-gray-700">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-[#343a46]">
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap">Sl No</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Asset Info</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Unit Info</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Date & Time</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">GPS Info</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap">GPS Reading</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 ">Km Reading</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                            {Array.isArray(Data) && Data?.length > 0 &&
                                Data?.map((item, index) => (
                                    <React.Fragment key={index}>
                                        {/* Main Row */}
                                        <tr
                                            className="hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
                                            onClick={() => toggleRow(index)}
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{index + 1}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.assetMake} {item.assetModel},<br />{item.assetRegNo}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.imei}<br />{item.simNumber ? item.simNumber : "Sim Not Attatched"}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{DateTimeFRMT(item.liveData?.date, item.liveData?.time)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center"><AddressCell latitude={item.liveData?.latitude} longitude={item.liveData?.longitude} /></td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 flex justify-center " title={`Signal Strength ${item.liveData?.gsm_signal}%`}><SignalStrengthIcon strength={item.liveData?.gsm_signal} /></td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.liveData?.speed} km/h<br />{item.liveData?.gps_odometer} km</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">
                                                {item.liveData?.digital_input_1_status === "0" || item.liveData?.speed === "0"
                                                    ? "Stopped"
                                                    : item.liveData?.digital_input_1_status === "1" && item.liveData?.speed === "0"
                                                        ? "Engine Started"
                                                        : item.liveData?.digital_input_1_status === "1" && item.liveData?.speed > "0"
                                                            ? "Moving"
                                                            : "Unknown"
                                                }
                                            </td>


                                        </tr>
                                        {/* Collapsible Row */}
                                        {expandedRow === index && (
                                            <tr>
                                                <td colSpan="10" className="px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300">
                                                    <div className="flex justify-between items-start">
                                                        {/* Information Section */}
                                                        <div className='space-y-7'>

                                                            <div className="flex space-x-16">
                                                                <div className="flex flex-col space-y-1">
                                                                    <span className="text-sm ">Client Portal</span>
                                                                    <span className="text-md font-semibold underline hover:cursor-pointer" onClick={() => ClientLogin(item.customer._id)}>Log In</span>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <span className="text-sm ">GPS Coordinates</span>
                                                                    <span className="text-md font-semibold">{item.liveData?.latitude}, {item.liveData?.longitude}</span>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <span className="text-sm ">Add To Incidents</span>
                                                                    <span className="text-md font-semibold underline hover:cursor-pointer"><a href={`/create-incident/${item.customer.company ? item.customer.company : item.customer.firstname}/${item.customer._id}`}>Add</a></span>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <span className="text-sm ">Contacts</span>
                                                                    <span className="text-md font-semibold underline hover:cursor-pointer" onClick={() => setallContactModal(true)}>View All{allContactModal === true ? (<AllContacts Aopen={allContactModal} AonClose={closeallContactModal} contacts={item.customer.contacts} />) : null} </span>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <span className="text-sm ">Update Vehicle</span>
                                                                    <span className="text-md font-semibold underline hover:cursor-pointer" onClick={() => {
                                                                        setIsModalOpen(true);
                                                                        setFormData({
                                                                            assetMake: item.assetMake,
                                                                            assetModel: item.assetModel,
                                                                            assetRegNo: item.assetRegNo,
                                                                            id: item._id,
                                                                            assetType: item.assetType
                                                                        })
                                                                    }}>Update </span>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <span className="text-sm ">Quick Map View</span>
                                                                    <a className="text-md font-semibold underline hover:cursor-pointer"
                                                                        title="Directions"
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        href={`https://www.google.com/maps/search/${item.liveData?.latitude},${item.liveData?.longitude}`}>Open</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}

                                    </React.Fragment>
                                ))}
                        </tbody>
                    </table>
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