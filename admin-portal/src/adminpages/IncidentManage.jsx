import React, { useEffect, useState } from 'react'
import Header from '../Components/header'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TableRow } from '../DataHelpers/caseOptions';
import LastUpdated from '../Components/LastUpdated';

function IncidentManage() {

    const [Data, setData] = useState([]);
    const navigate = useNavigate();
    const [expandedRow, setExpandedRow] = useState(null);

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const GetallIncidents = async () => {
        try {
            console.log("Loading");
            //setIsLoading(true);
            const res = await axios.get("/api-trkadn/getall-incidents");
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

    const NavigateEdit =  (data) => {
        const serializedArray = encodeURIComponent(JSON.stringify(data));
        window.open(`/manage-incidents/edit?data=${serializedArray}`, '_blank');
    }

    useEffect(() => {
        GetallIncidents()
    }, [])
console.log(Data);

    return (
        <>
    <Header />
    <div className='mt-24 flex flex-row justify-between items-center'>
        <div>
            <h1 className='text-gray-900 dark:text-gray-300 font-semibold text-3xl p-6'>
                Incident Management
            </h1>
        </div>
    </div>

    <div className="min-h-screen px-6">
        <div className="overflow-hidden rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                        <tr className="bg-gray-200 dark:bg-[#3b3b3b]">
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">No</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Asset</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Incident & Type</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Event</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Priority</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Assigned To</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Updated by</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Update</th>
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
                                    <td className="px-6 py-0 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">{index + 1}</td>
                                    <td className="px-6 py-0 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                        {item.userid.company ? item.userid.company : item.userid.firstname}
                                    </td>
                                    <td className="px-6 py-0 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                        {item.unit.assetMake} {item.unit.assetModel} {item.unit.assetRegNo}
                                    </td>
                                    <td className=" py-0 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                        <TableRow item={item} />
                                    </td>
                                    <td className="px-6 py-0 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.response}</td>
                                    <td className="px-6 py-0 whitespace-nowrap text-sm">
                                        <button
                                            className={`px-3 py-2 text-sm dark:text-white text-black ${item.priority === "High" ? "bg-orange-500/20" :
                                                item.priority === "Medium" ? "bg-yellow-300/20" :
                                                    "bg-green-500/20"
                                                }  rounded-full transition duration-200`}
                                        >
                                            {item.priority}
                                        </button>
                                    </td>
                                    <td className="px-6 py-0 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.caseAssigned}</td>
                                    <td className="px-6 py-0 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                        <LastUpdated updates={item.updates} />
                                    </td>
                                    <td className="px-6 py-0 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.status}</td>
                                    <td className="px-6 py-0 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 underline cursor-pointer">
                                        <a href={`/manage-incidents/update-status/${item._id}`}>Update Status</a>
                                    </td>
                                </tr>

                                {/* Collapsible Row */}
                                {expandedRow === index && (
                                    <tr>
                                        <td colSpan="10" className="px-6 py-6 bg-gray-50 dark:bg-[#1b1b1d] border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex flex-col space-y-8">
                                                <div className="flex space-x-5">
                                                    <div className="flex flex-col min-w-40 p-4 bg-white dark:bg-[#28282a] rounded-lg shadow-sm">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Created by:</span>
                                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.created}</span>
                                                    </div>
                                                    <div className="flex flex-col min-w-40 p-4 bg-white dark:bg-[#28282a] rounded-lg shadow-sm">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Case Details:</span>
                                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.details}</span>
                                                    </div>
                                                    <div className="flex flex-col p-4 min-w-40 bg-white dark:bg-[#28282a] rounded-lg shadow-sm">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Updates:</span>
                                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                            {item.updates.length > 0 ? item.updates[item.updates?.length - 1].details : "NIL"}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col p-4 min-w-40 bg-white dark:bg-[#28282a] rounded-lg shadow-sm hover:cursor-pointer" onClick={() => NavigateEdit(item)}>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Edit Case:</span>
                                                        <button
                                                            onClick={() => NavigateEdit(item)}
                                                            className="text-sm font-medium text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 flex items-center"
                                                        >
                                                            Edit
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <div className="flex flex-col p-4 min-w-40 bg-white dark:bg-[#28282a] rounded-lg shadow-sm">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Close Case:</span>
                                                        <button
                                                            //onClick={() => handleCloseCase(item._id)}
                                                            className="text-sm font-medium text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 flex items-center"
                                                        >
                                                            Close
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        )) : (
                            <tr>
                                <td colSpan="10" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
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
</>
    )
}

export default IncidentManage