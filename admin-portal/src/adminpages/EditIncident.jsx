import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Header from '../Components/header';
import Modal from '../Components/Modal';
import { useParams } from "react-router-dom";
import { caseDescOptions } from '../DataHelpers/caseOptions';
import { ISTDateTimeFormatter } from '../Components/Date&TimeCell';
import { useAuth } from '../contexts/AuthContext';
import { useSearchParams } from "react-router-dom";
import axiosInstance from '../auth/interceptor';

function EditIncident() {
    const [searchParams] = useSearchParams();
    const data = JSON.parse(searchParams.get("data"));
    const [userUnits, setuserUnits] = useState([]);
    const [selecteduserUnit, setselecteduserUnit] = useState([]);
    const { id, name } = useParams();
    const [open, setOpen] = useState(false)
    const now = new Date();
    const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    const currentDateTime = now.toLocaleString('en-US', options);
    const [formData, setFormData] = useState({
        caseType: "",
        caseDesc: "",
        details: "",
        priority: "",
        cuvisible: false,
        caseAssigned: "",
        response: "",

    });

    console.log(data);

    useEffect(() => {
        if (data) {
            setFormData({
                incid: data._id,
                caseType: data.caseType || "",
                caseDesc: data.caseDesc || "",
                details: data.details || "",
                priority: data.priority || "",
                cuvisible: data.cuvisible || false,
                caseAssigned: data.caseAssigned || "",
                response: data.response || "",
            });
        }
    }, []);




    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "caseType" && { caseDesc: "" }), // Reset caseDesc if caseType changes
        }));
    };

    const UpdateIncident = async () => {

        try {

            const response = await axiosInstance.put(`/api-trkadn/edit-incident/${data._id}`, formData);

            if (response.status === 200) {
                console.log("susssess");

                setFormData({
                    unit: "",
                    caseType: "",
                    caseDesc: "",
                    details: "",
                    priority: "",
                    cuvisible: false,
                    caseAssigned: "",
                    response: "",
                }); // Reset form
                window.location.href = "/manage-incidents"
            }
        } catch (error) {
            console.error('Error saving shipment:', error.response?.data?.message || error.message);
        }
    };


    return (
        <>
            <Header />
            <div className="mt-24 flex flex-col space-y-8 px-4 md:px-8 mb-24">
                <h1 className="text-gray-900 dark:text-gray-300 font-semibold text-2xl md:text-3xl">
                    Update Incident for {data.userid.company ? data.userid.company : data.userid.firstname}
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
                                        className="w-72 px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        required
                                    >
                                        <option value={data.unit._id}>{data.unit.assetMake} {data.unit.assetModel} - {data.unit.assetRegNo}</option>


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
                                        className="w-72 px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
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
                                        className="w-72 px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        required
                                        disabled={!formData.caseType} // Disable if no caseType selected
                                    >
                                        <option value="">Select a Case Description</option>
                                        {formData.caseType &&
                                            caseDescOptions[formData.caseType].map((option) => (
                                                <option key={option.value} value={option.value}>
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
                                        className="w-72 px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
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
                                        className=" w-72 px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                                        className=" w-72 px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                                        className=" w-72 px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                                        className=" w-72 px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                                <p className="text-sm text-right">{data.userid.company ? data.userid.company : data.userid.firstname || ''}</p>
                            </div>
                            <div
                                className="flex justify-between items-center space-x-20 text-gray-700 dark:text-gray-300"
                            >
                                <h2 className="font-medium">Unit Id:</h2>
                                <p className="text-sm text-right">{data.unit.imei || ''}</p>
                            </div>
                            <div
                                className="flex justify-between items-center space-x-20 text-gray-700 dark:text-gray-300"
                            >
                                <h2 className="font-medium">Attached SIM:</h2>
                                <p className="text-sm text-right">{data.unit?.simNumber || ''}</p>
                            </div>
                            <div
                                className="flex justify-between items-center space-x-20 text-gray-700 dark:text-gray-300"
                            >
                                <h2 className="font-medium">Asset Info:</h2>
                                <p className="text-sm text-right">{data.unit?.assetMake}, {data.unit?.assetModel}<br />{data.unit?.assetRegNo} - {data.unit?.assetType}</p>

                            </div>
                            {/* <div
                                className="flex justify-between items-center space-x-20 text-gray-700 dark:text-gray-300"
                            ><h2 className="font-medium">Last GPS Signal:</h2>
                                <p className="text-sm text-right"><ISTDateTimeFormatter dateString={selecteduserUnit?.liveData?.date} timeString={"132201"}/></p>
                            </div> */}
                        </div>

                        <button
                            className="w-full px-4 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600"
                            onClick={UpdateIncident}
                        >
                            Update Case
                        </button>
                    </div>
                </div>
            </div>

        </>
    );
}

export default EditIncident;
