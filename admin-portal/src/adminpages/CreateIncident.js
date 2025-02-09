import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Header from '../Components/header';
import Modal from '../Components/Modal';
import { useParams } from "react-router-dom";
import { caseDescOptions } from '../DataHelpers/caseOptions';
import { ISTDateTimeFormatter } from '../Components/Date&TimeCell';
import { useAuth } from '../contexts/AuthContext';

function CreateIncident() {
    const [userUnits, setuserUnits] = useState([]);
    const [selecteduserUnit, setselecteduserUnit] = useState([]);
    const { id, name } = useParams();
    const [open, setOpen] = useState(false)
    const now = new Date();
    const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    const currentDateTime = now.toLocaleString('en-US', options);
    const { decryptData } = useAuth()
    const DispalyName=decryptData().name
    const [formData, setFormData] = useState({
        userid: id,
        unit: "",
        caseType: "",
        caseDesc: "",
        created: `${DispalyName}, on ${currentDateTime}`,
        details: "",
        priority: "",
        cuvisible: false,
        caseAssigned: "",
        response: "",

    });



    useEffect(() => {
        const selectedUnit = userUnits.find((unit) => unit._id === formData.unit);
        setselecteduserUnit(selectedUnit)
    }, [formData.unit])


    const CreateIncident = async () => {

        try {

            const response = await axios.post('/api-trkadn/create-incident', formData);

            if (response.status === 201) {
        

                setFormData({
                    unit: "",
                    caseType: "",
                    caseDesc: "",
                    details: "",
                    priority: "",
                    response: "",
                    cuvisible: false,
                    caseAssigned: "",
                }); // Reset form
                window.location.href = "/"
            }
        } catch (error) {
            console.error('Error saving shipment:', error.response?.data?.message || error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "caseType" && { caseDesc: "" }), // Reset caseDesc if caseType changes
        }));
    };

    useEffect(() => {
        GetUserUnits()
    }, [])


    const GetUserUnits = async () => {
        try {
   
            //setIsLoading(true);
            const res = await axios.get(`/api-trkadn/get-units/${id}`);

            if (res.status === 200) {
                setuserUnits(res.data.data);
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
                    Create New Incident for {name}
                </h1>

                <div className="flex flex-col md:flex-row w-full md:space-x-5 items-start justify-center">

                    {/* Left Section */}
                    <div className=' space-y-5'>
                        <div className=" border border-gray-300 dark:border-gray-600 p-6 flex flex-col space-y-6 rounded-lg">
                            <h1 className="text-gray-900 dark:text-gray-300 font-semibold text-xl md:text-xl">
                                Case Details
                            </h1>
                            <div className='flex flex-col md:flex-row w-full space-x-10'>


                                <div>
                                    <label
                                        className="block text-md font-medium mb-2 text-gray-700 dark:text-gray-300"
                                        htmlFor="unit"
                                    >
                                        Unit
                                    </label>
                                    <select
                                        id="unit"
                                        value={formData.unit}
                                        onChange={handleChange}
                                        name="unit"
                                        className="w-72 px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        required
                                    >
                                        <option value={"dfd"}>Select a Unit</option>
                                        <option value={"4342"}>Select a Unit</option>
                                        {userUnits.map((unit,index) => (
                                            <option value={unit._id} key={index}>{unit.assetMake} {unit.assetModel} - {unit.assetRegNo}</option>
                                        ))}

                                    </select>
                                </div>

                                <div>
                                    <label
                                        className="block text-md font-medium mb-2 text-gray-700 dark:text-gray-300"
                                        htmlFor="caseType"
                                    >
                                        Case Type
                                    </label>
                                    <select
                                        id="caseType"
                                        value={formData.caseType}
                                        onChange={handleChange}
                                        name="caseType"
                                        className="w-72 px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        required
                                    >
                                        <option value="">Select a Case Type</option>
                                        <option value="Accounts">Accounts</option>
                                        <option value="Device">Device</option>
                                        <option value="GIS">GIS</option>
                                        <option value="IT">IT</option>
                                        <option value="Sales">Sales</option>
                                        <option value="Support">Support</option>
                                    </select>
                                </div>

                                {/* Case Description */}
                                <div>
                                    <label
                                        className="block text-md font-medium mb-2 text-gray-700 dark:text-gray-300"
                                        htmlFor="caseDesc"
                                    >
                                        Case Description
                                    </label>
                                    <select
                                        id="caseDesc"
                                        value={formData.caseDesc}
                                        onChange={handleChange}
                                        name="caseDesc"
                                        className="w-72 px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        required
                                        disabled={!formData.caseType} // Disable if no caseType selected
                                    >
                                        <option value="">Select a Case Description</option>
                                        {formData.caseType &&
                                            caseDescOptions[formData.caseType].map((option,index) => (
                                                <option key={index} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                            </div>

                            <div className='flex flex-col md:flex-row space-x-10'>

                                <div>
                                    <label
                                        className="block text-md font-medium mb-2 text-gray-700 dark:text-gray-300"
                                        htmlFor="details"
                                    >
                                        Details
                                    </label>
                                    <textarea
                                        type="text"
                                        id="details"
                                        value={formData.details}
                                        onChange={handleChange}
                                        name="details"
                                        placeholder="Enter Details"
                                        className="w-72 px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        required
                                    />
                                </div>
                                <div >
                                    <label
                                        className="block text-md font-medium mb-2 text-gray-700 dark:text-gray-300"
                                        htmlFor="priority"
                                    >
                                        Case Priority
                                    </label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        className=" w-72 px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        required
                                    >
                                        <option value={""}>Select Case Priority</option>
                                        <option value={"Low"}>Low</option>
                                        <option value={"Medium"}>Medium</option>
                                        <option value={"High"}>High</option>
                                    </select>
                                </div>

                                <div >
                                    <label
                                        className="block text-md font-medium mb-2 text-gray-700 dark:text-gray-300"
                                        htmlFor="response"
                                    >
                                        Response
                                    </label>
                                    <select
                                        id="response"
                                        name="response"
                                        value={formData.response}
                                        onChange={handleChange}
                                        className=" w-72 px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        required
                                    >
                                        <option value={""}>Select Case Priority</option>
                                        <option value="Call Center Action Done">Call Center Action Done</option>
                                        <option value="Customer Request">Customer Request</option>
                                        <option value="Email Sen">Email Sent</option>
                                        <option value="Escalate">Escalate</option>
                                        <option value="Incident Ignored">Incident Ignored</option>
                                        <option value="Incoming Call">Incoming Call</option>
                                        <option value="No Event">No Event</option>
                                        <option value="Outgoing Call">Outgoing Call</option>
                                        <option value="SMS & Email Sent">SMS &amp; Email Sent</option>
                                        <option value="SMS Sent">SMS Sent</option>
                                    </select>
                                </div>
                            </div>

                            <div className='flex flex-col md:flex-row space-x-10'>

                                <div >
                                    <label
                                        className="block text-md font-medium mb-2 text-gray-700 dark:text-gray-300"
                                        htmlFor="cuvisible"
                                    >
                                        Case Visiblity to Client
                                    </label>
                                    <select
                                        id="cuvisible"
                                        name="cuvisible"
                                        value={formData.cuvisible}
                                        onChange={handleChange}
                                        className=" w-72 px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        required
                                    >
                                        <option value={false}>Hide</option>
                                        <option value={true}>Show</option>
                                    </select>
                                </div>

                                <div >
                                    <label
                                        className="block text-md font-medium mb-2 text-gray-700 dark:text-gray-300"
                                        htmlFor="caseAssigned"
                                    >
                                        Case Assigned
                                    </label>
                                    <select
                                        id="caseAssigned"
                                        name="caseAssigned"
                                        value={formData.caseAssigned}
                                        onChange={handleChange}
                                        className=" w-72 px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        required
                                    >
                                        <option value={""}>Select Case Priority</option>
                                        <option value="bz">bz</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Section (Summary) */}
                    <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-6 space-y-6  w-full md:max-w-96">

                        <div className="space-y-6">
                            <div
                                className="flex justify-between items-center space-x-20 text-gray-700 dark:text-gray-300"
                            >
                                <h2 className="font-medium">Customer:</h2>
                                <p className="text-sm text-right">{name || ''}</p>
                            </div>
                            <div
                                className="flex justify-between items-center space-x-20 text-gray-700 dark:text-gray-300"
                            >
                                <h2 className="font-medium">Unit Id:</h2>
                                <p className="text-sm text-right">{selecteduserUnit?.imei || ''}</p>
                            </div>
                            <div
                                className="flex justify-between items-center space-x-20 text-gray-700 dark:text-gray-300"
                            >
                                <h2 className="font-medium">Attached SIM:</h2>
                                <p className="text-sm text-right">{selecteduserUnit?.simNumber || ''}</p>
                            </div>
                            <div
                                className="flex justify-between items-center space-x-20 text-gray-700 dark:text-gray-300"
                            >
                                <h2 className="font-medium">Km Reading:</h2>
                                <p className="text-sm text-right">{selecteduserUnit?.liveData?.gps_odometer || ''}</p>
                            </div>
                            <div
                                className="flex justify-between items-center space-x-20 text-gray-700 dark:text-gray-300"
                            >
                                <h2 className="font-medium">Asset Info:</h2>
                                <p className="text-sm text-right">{selecteduserUnit?.assetMake}, {selecteduserUnit?.assetModel}<br />{selecteduserUnit?.assetRegNo} - {selecteduserUnit?.assetType}</p>

                            </div>
                            {/* <div
                                className="flex justify-between items-center space-x-20 text-gray-700 dark:text-gray-300"
                            ><h2 className="font-medium">Last GPS Signal:</h2>
                                <p className="text-sm text-right"><ISTDateTimeFormatter dateString={selecteduserUnit?.liveData?.date} timeString={"132201"}/></p>
                            </div> */}
                        </div>

                        <button
                            className="w-full px-4 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600"
                            onClick={CreateIncident}
                        >
                            Install Unit
                        </button>
                    </div>
                </div>
            </div>

            {/* <Modal open={open} onClose={() => setOpen(false)}>
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
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                required
                            >
                                <option value={""}>Select a Make</option>
                                <option value={"BMW"}>BMW</option>
                                <option value={"Maruti"}>Maruti</option>
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
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                required
                            >
                                <option value={""}>Select a Model</option>
                                <option value={"Jimny"}>Jimny</option>
                                <option value={"Dezire"}>Dezire</option>
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
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
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
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                required
                            >
                                <option value={""}>Select a Type</option>
                                <option value={"Car"}>Car</option>
                                <option value={"Bike"}>Bike</option>
                            </select>
                        </div>
                        <div className="flex justify-between gap-4 mt-6">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="bg-gray-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-600 transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setOpen(false)}
                                className="bg-orange-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-orange-700 transition duration-200"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </Modal> */}
        </>
    );
}

export default CreateIncident;
