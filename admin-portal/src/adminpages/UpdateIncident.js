import React, { useEffect, useState } from 'react'
import Header from '../Components/header'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TableRow } from '../DataHelpers/caseOptions';
import Modal from '../Components/Modal';
import { useParams } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

function UpdateIncident() {

    const [Data, setData] = useState([]);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false)
    const now = new Date();
    const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    const currentDateTime = now.toLocaleString('en-US', options);
    const { decryptData } = useAuth()
    const DispalyName=decryptData().name
    const [formData, setFormData] = useState({
        updatedBy: DispalyName,
        datetime: ` ${currentDateTime}`,
        details: "",
        status: ""
    });
    const { id } = useParams();
    const Getuserbyid = async () => {
        try {
            console.log("Loading");
            //setIsLoading(true);
            const res = await axios.get(`/api-trkadn/getincidents-by-id/${id}`);
            if (res.statusText === "OK") {
console.log(res.data.data[0]);

                setData(res.data.data[0].updates);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.put(`/api-trkadn/add-update/${id}`, formData);
            console.log(response);

            if (response.statusText === "OK") {

                setFormData({
                    details: "",
                    status: "",
                    datetime: ""
                });
                setOpen(false)
                Getuserbyid()
            }

        } catch (error) {
            console.error("Error adding Contact:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    useEffect(() => {
        Getuserbyid()
    }, [])

    return (
        <>
            <Header />
            <div className=' mt-24 flex flex-row justify-between items-center'>
                <div className="px-6 py-4 flex w-full justify-between">
                    <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-300">
                        Update Case Status
                    </h1>
                    <button onClick={() => setOpen(true)} className='w-fit h-12 px-4 border border-orange-600 bg-[#f6f7f9] dark:bg-[#343a46] rounded-md flex justify-center items-center'>+ Add New Update</button>
                </div>

            </div>

            <div > {/* Theme-based background and text color */}
                <div className="flex w-full items-center justify-center overflow-x-auto p-4 ">
                    <table className="min-w-full border border-gray-300  dark:border-gray-700">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-[#343a46]">
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">No</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Updated By</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Date & Time</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Updates</th>
                                {/* <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">More Info</th> */}
                                {/* <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Event</th> */}
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                            {Data.length > 0 && Data?.map((item, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-200 dark:hover:bg-gray-800"
                                >
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{index + 1}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.updatedBy}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.datetime}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.details}</td>
                                    {/* 
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.caseAssigned}</td> */}
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal open={open} onClose={() => setOpen(false)}>

                <div className="text-gray-900 dark:text-gray-200">
                    <h2 className="text-2xl font-bold mb-6 text-center">Add New Admin</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="status"
                            >
                                Add Case Update
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="Action Done">Action Done</option>
                                <option value="Active">Active</option>
                                <option value="Requires Confirmation">Requires Confirmation</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Under Process">Under Process</option>
                            </select>
                        </div>
                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="details"
                            >
                                Update Details
                            </label>
                            <textarea
                                type="text"
                                id="details"
                                name="details"
                                value={formData.details}
                                placeholder="Enter Details"
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                required
                            />
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
                                type="submit"
                                className="bg-orange-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-orange-700 transition duration-200"
                            >
                                Add Admin
                            </button>

                        </div>
                    </form>
                </div>
            </Modal>
        </>
    )
}

export default UpdateIncident