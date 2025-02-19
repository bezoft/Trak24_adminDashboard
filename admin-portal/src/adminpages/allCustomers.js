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
            const response = await axios.put(`/api-trkadn/update-permissions/${userid}`, permissions);


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
            const res = await axios.get("/api-trkadn/all-users");
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
        
       window.open(`http://192.168.224.1:3001/login?data=${data}`,"_blank")
    }

    return (
        <>
            <Header />
            <div className=' mt-24 flex flex-row justify-between items-center h-full'>
                <div>
                    <h1 className='text-gray-900 dark:text-gray-300 font-semibold text-3xl p-6'>
                        Customer Information ({Data.length})
                    </h1>
                </div>

            </div>

            <div className={`   min-h-screen`}> {/* Theme-based background and text color */}
                <div className="overflow-x-auto p-4 ">
                    <table className="min-w-full border border-gray-300  dark:border-gray-700">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-[#343a46]">
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap">Sl No</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Customer</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Permissions</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Company</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap">Company Info</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 ">Units</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Invoices</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                            {Array.isArray(Data) && Data.length > 0 &&
                                Data.map((item, index) => (
                                    <React.Fragment key={index}>
                                        {/* Main Row */}
                                        <tr
                                            className="hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
                                            onClick={() => toggleRow(index)}
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{index + 1}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.firstname} {item.lastname},<br /> Ph: {item.mobile}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center"><button onClick={() => { setcompany(item.company ? item.company : item.firstname); updatePermissions(item.permissions, item._id); setOpen(true); }}
                                                className="px-2 py-2 text-sm dark:text-white text-black bg-orange-500 bg-opacity-20 hover:bg-opacity-50 rounded-full hover:bg-orange-600 transition duration-200">View / Change</button></td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.company}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.address.street}, {item.address.district}-{item.address.pinCode}, Ph: {item.address.landline}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.imeis.length}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">Upload Invoice</td>

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
                                                                    <span className="text-md font-semibold underline cursor-pointer" onClick={() => ClientLogin(item._id)}>Log In</span>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <span className="text-sm ">Monthly Statements</span>
                                                                    <span className="text-md font-semibold">Upload Statement</span>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <span className="text-sm ">Auto Reports</span>
                                                                    <span className="text-md font-semibold">Schedule</span>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <span className="text-sm ">Contacts</span>
                                                                    <span className="text-md font-semibold underline hover:cursor-pointer" onClick={() => setallContactModal(true)}>View All{allContactModal === true ? (<AllContacts Aopen={allContactModal} AonClose={closeallContactModal} id={item._id} />) : null} </span>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <span className="text-sm ">Add Contact</span>
                                                                    <span className="text-md font-semibold underline hover:cursor-pointer" onClick={() => setcreateContactModal(true)}>Add New{createContactModal === true ? (<CreateContact Mopen={createContactModal} MonClose={closecreateContactModal} id={item._id} />) : null} </span>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <span className="text-sm ">Caution Settings</span>
                                                                    <span className="text-md font-semibold">Change/View</span>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <span className="text-sm ">Incidents</span>
                                                                    <span className="text-md font-semibold underline hover:cursor-pointer"><a href={`/create-incident/${item.company ? item.company : item.firstname}/${item._id}`}>Add</a></span>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <span className="text-sm ">Edit Customer</span>
                                                                    <span className="text-md font-semibold underline hover:cursor-pointer" onClick={() => navigate(`/update-customer/${item._id}`)}>Edit</span>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <span className="text-sm ">Edit Login</span>
                                                                    <span className="text-md font-semibold underline hover:cursor-pointer" onClick={() => setIsModalOpen(true)}>Edit</span>
                                                                </div>
                                                                {isModalOpen === true ? (<ViewLogin open={isModalOpen} username={item.username} id={item._id} onClose={closeModal} />) : null}
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