import React, { useEffect, useState } from 'react'
import Header from '../Components/header'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { processReportData } from '../DataHelpers/ReportPro';
import Modal from '../Components/Modal';
import ToggleButton from '../Components/ToggleButton';
import CreateContact from './Modals/CreateContact';
import AllContacts from './Modals/AllContacts';
import ViewLogin from './Modals/viewLogin';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../auth/interceptor';

function AllCustomers() {

    const [Data, setData] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false)
    const [createContactModal, setcreateContactModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [allContactModal, setallContactModal] = useState(false);
    const [company, setcompany] = useState("")
    const [userid, setuserid] = useState("")
    const { decryptData } = useAuth()
    const [permissions, setPermissions] = useState({
        weblogin: false,
        applogin: false,
        dailyAutoReports: false,
    });
    const closecreateContactModal = () => setcreateContactModal(false);
    const closeallContactModal = () => setallContactModal(false);
    const handleToggle = (key) => {
        setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
    };


    const closeModal = () => setIsModalOpen(false);


    const updatePermissions = (newPermissions, id) => {

        setuserid(id)
        setPermissions((prevPermissions) => ({
            ...prevPermissions,
            ...newPermissions,
        }));
    };

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const UpdatePermissions = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.put(`/api-trkadn/update-permissions/${userid}`, permissions);


            if (response.status === 200) {
                setOpen(false)
                GetallUsers()
            }
        } catch (error) {
            alert('Error creating user: ' + error.response.data.message);
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
                setData(res.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            // Ensure loading and refreshing states are reset
            //   setIsLoading(false);
            //   setIsRefreshing(false);
        }
    };

    const ClientLogin = (id) => {
        console.log(id);
        const admid = decryptData().id
        const data = encodeURIComponent(JSON.stringify({ admid: admid, clid: id }));
        
       window.open(`http://clientdashboard.trak24.in/login?data=${data}`,"_blank")
    }

    return (
        <>
        <Header />
        <div className='mt-24 flex flex-col md:flex-row justify-between items-center h-full'>
            <div>
                <h1 className='text-black dark:text-white font-semibold text-4xl p-6 mb-10'>
                    Customer Information ({Data.length})
                </h1>
            </div>
        </div>
    
        <div className="min-h-screen px-6">
            <div className="overflow-hidden rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-[#3b3b3b]">
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Sl No</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Permissions</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Company</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Company Info</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Units</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Invoices</th>
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300 ">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 ">
                                            {item.firstname} {item.lastname},<br /> Ph: {item.mobile}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 ">
                                            <button
                                                onClick={() => { setcompany(item.company ? item.company : item.firstname); updatePermissions(item.permissions, item._id); setOpen(true); }}
                                                className="px-2 py-2 text-sm dark:text-white text-black bg-orange-500/20 hover:bg-orange-600/20 rounded-full hover:bg-orange-600 transition duration-200"
                                            >
                                                View / Change
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 ">{item.company}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 ">
                                            {item.address.street}, {item.address.district}-{item.address.pinCode}, Ph: {item.address.landline}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 ">{item.imeis.length}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 ">Upload Invoice</td>
                                    </tr>
    
                                    {/* Collapsible Row */}
                                    {expandedRow === index && (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-6 bg-gray-50 dark:bg-[#1b1b1d] border-t border-gray-200 dark:border-gray-700">
                                                <div className="flex flex-col space-y-8">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
                                                        <div className="flex flex-col p-4 bg-white dark:bg-[#28282a] rounded-lg shadow-sm">
                                                            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Client Portal</span>
                                                            <button
                                                                onClick={() => ClientLogin(item._id)}
                                                                className="text-sm font-medium text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 flex items-center"
                                                            >
                                                                Log In
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                </svg>
                                                            </button>
                                                        </div>
    
                                                        <div className="flex flex-col p-4 bg-white dark:bg-[#28282a] rounded-lg shadow-sm">
                                                            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Monthly Statements</span>
                                                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Upload Statement</span>
                                                        </div>
    
                                                        <div className="flex flex-col p-4 bg-white dark:bg-[#28282a] rounded-lg shadow-sm">
                                                            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Auto Reports</span>
                                                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Schedule</span>
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
                                                            {allContactModal === true ? (<AllContacts Aopen={allContactModal} AonClose={closeallContactModal} id={item._id} />) : null}
                                                        </div>
    
                                                        <div className="flex flex-col p-4 bg-white dark:bg-[#28282a] rounded-lg shadow-sm">
                                                            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Add Contact</span>
                                                            <button
                                                                onClick={() => setcreateContactModal(true)}
                                                                className="text-sm font-medium text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 flex items-center"
                                                            >
                                                                Add New
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                                                </svg>
                                                            </button>
                                                            {createContactModal === true ? (<CreateContact Mopen={createContactModal} MonClose={closecreateContactModal} id={item._id} />) : null}
                                                        </div>
    
                                                        <div className="flex flex-col p-4 bg-white dark:bg-[#28282a] rounded-lg shadow-sm">
                                                            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Caution Settings</span>
                                                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Change/View</span>
                                                        </div>
    
                                                        <div className="flex flex-col p-4 bg-white dark:bg-[#28282a] rounded-lg shadow-sm">
                                                            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Incidents</span>
                                                            <a
                                                                href={`/create-incident/${item.company ? item.company : item.firstname}/${item._id}`}
                                                                className="text-sm font-medium text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 flex items-center"
                                                            >
                                                                Add
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                                                </svg>
                                                            </a>
                                                        </div>
    
                                                        <div className="flex flex-col p-4 bg-white dark:bg-[#28282a] rounded-lg shadow-sm">
                                                            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Edit Customer</span>
                                                            <button
                                                                onClick={() => navigate(`/update-customer/${item._id}`)}
                                                                className="text-sm font-medium text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 flex items-center"
                                                            >
                                                                Edit
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </button>
                                                        </div>
    
                                                        <div className="flex flex-col p-4 bg-white dark:bg-[#28282a] rounded-lg shadow-sm">
                                                            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Edit Login</span>
                                                            <button
                                                                onClick={() => setIsModalOpen(true)}
                                                                className="text-sm font-medium text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 flex items-center"
                                                            >
                                                                Edit
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </button>
                                                            {isModalOpen === true ? (<ViewLogin open={isModalOpen} username={item.username} id={item._id} onClose={closeModal} />) : null}
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
                        onClick={UpdatePermissions}
                        className="px-6 py-2 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded-md"
                    >
                        Save
                    </button>
                </div>

            </Modal>

        </>
    )
}

export default AllCustomers