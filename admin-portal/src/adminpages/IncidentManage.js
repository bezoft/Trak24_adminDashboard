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
            if (res.statusText === "OK") {
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
            <div className=' mt-24 flex flex-row justify-between items-center'>
                <div>
                    <h1 className='text-gray-900 dark:text-gray-300 font-semibold text-3xl p-6'>
                        Incident Management
                    </h1>
                </div>

            </div>

            <div > {/* Theme-based background and text color */}
                <div className="flex w-full items-center justify-center overflow-x-auto p-4 ">
                    <table className="min-w-full border border-gray-300  dark:border-gray-700">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-[#343a46]">
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">No</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Customer</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Asset</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Incident & Type</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Event</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Priority</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Assigned To</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Updated by</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Status</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Update</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {Array.isArray(Data) && Data.length > 0 &&
  Data.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
                                        onClick={() => toggleRow(index)}
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{index + 1}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.userid.company ? item.userid.company : item.userid.firstname}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.unit.assetMake} {item.unit.assetModel} {item.unit.assetRegNo}<br />{item.unit.model}</td>
                                        <TableRow item={item} />

                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.response}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">
                                            <button
                                                className={`px-3 py-2 text-sm dark:text-white text-black ${item.priority === "High" ? "bg-orange-500" :
                                                    item.priority === "Medium" ? "bg-yellow-300" :
                                                        "bg-green-500"
                                                    } bg-opacity-20 rounded-full transition duration-200`}
                                            >
                                                {item.priority}
                                            </button>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.caseAssigned}</td>
                                        <LastUpdated updates={item.updates} />
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.status}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center underline cursor-pointer" ><a href={`/manage-incidents/update-status/${item._id}`}>Update Status</a></td>
                                    </tr>
                                    {expandedRow === index && (
                                        <tr>
                                            <td colSpan="10" className="px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300">
                                                <div className="flex justify-between items-start">
                                                    {/* Information Section */}
                                                    <div className='space-y-7'>


                                                        <div className="flex space-x-14">
                                                            <div className="flex flex-col space-y-1 w-1/6">
                                                                <span className="text-sm ">Created by:</span>
                                                                <span className="text-md font-semibold">{item.created}</span>
                                                            </div>
                                                            <div className="flex flex-col space-y-1">
                                                                <span className="text-sm ">Case Details:</span>
                                                                <span className="text-md font-semibold">{item.details}</span>
                                                            </div>
                                                            <div className="flex flex-col space-y-1">
                                                                <span className="text-sm ">Updates:</span>
                                                                <span className="text-md font-semibold">{item.updates.length>0?item.updates[item.updates?.length - 1].details:"NIL"}</span>
                                                            </div>
                                                            <div className="flex flex-col space-y-1">
                                                                <span className="text-sm ">Edit Case:</span>
                                                                <span className="text-md font-semibold underline cursor-pointer" onClick={()=>NavigateEdit(item)}>Edit</span>
                                                            </div>
                                                            <div className="flex flex-col space-y-1">
                                                                <span className="text-sm ">Close Case:</span>
                                                                <span className="text-md font-semibold underline cursor-pointer">Close</span>
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
        </>
    )
}

export default IncidentManage