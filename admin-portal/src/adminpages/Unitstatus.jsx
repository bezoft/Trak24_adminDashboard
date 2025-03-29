import React, { useState, useEffect } from 'react';
import Header from '../Components/header';
import axios from 'axios';

function Unitstatus() {

    const [shipments, setShipments] = useState([]);
    const [unitid, setunitid] = useState("");
    const [status, setStatus] = useState("Live");
    const [Units, setUnits] = useState([]);
    const [UnitsBM, setUnitsBM] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null);

    const GetallShipments = async () => {
        try {
            const res = await axios.get("/api-trkadn/getall-shipments");

            if (res.status === 200) {
                setShipments(res.data.shipments);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            // Ensure loading and refreshing states are reset
            //   setIsLoading(false);
            //   setIsRefreshing(false);
        }
    };

    const GetUnitsBymodel = async (shipment) => {
        try {
            const res = await axios.get(`/api-trkadn/get-unit-model/${shipment?"false":status}/${shipment?shipment:"null"}`);

            if (res.status === 200) {
                setUnitsBM(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            // Ensure loading and refreshing states are reset
            //   setIsLoading(false);
            //   setIsRefreshing(false);
        }
    };

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    useEffect(() => {
        GetallShipments();
        GetUnitsBymodel();
    }, [])

    useEffect(() => {
        GetUnitsBymodel();
    }, [status])

    const handleSearch = async () => {
        try {
            const response = await axios.get(`/api-trkadn/search-unit/${unitid}`);


            if (response.status === 200) {
                setUnits(response.data.unit);
            }
        } catch (error) {
            console.error("Error searching for unit:", error);
        }
    };

    console.log(UnitsBM);

    return (
        <>
            <Header />

            <div className=' mt-20 flex flex-row justify-between items-center h-full'>
                <div>
                    <h1 className='text-gray-900 dark:text-gray-300 font-semibold text-3xl p-6'>
                        Unit Management
                    </h1>
                </div>
                <div className='flex w-1/4 space-x-5 items-end'>

                    <div className="w-1/2">
                        <input
                            id="month"
                            name="month"
                            value={unitid}
                            placeholder='Unit imei'
                            onChange={(e) => setunitid(e.target.value)}
                            className="w-full px-4 py-2 border bg-white dark:bg-[#1b1b1d] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <button
                        className="bg-orange-600 text-white h-10 px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition duration-200"
                        onClick={() => {
                            if (unitid) {
                                handleSearch();
                            }
                        }}
                    >
                        Search
                    </button>
                </div>
            </div>

            <div className="flex gap-4 p-4 h-screen">
                {/* Left side with two stacked divs */}
                <div className="flex flex-col w-1/2 h-full gap-4">
                <div className={`flex-1 ${Units.length > 0 ? "overflow-auto" : ""}`} style={Units.length > 0 ?{ maxHeight: "80vh" }:{}}>
                        {/* table 1 */}

                        <table className={`min-w-full border border-gray-300 dark:bg-[#1b1b1d] ${Units.length > 0 ?"":"mb-10"} dark:border-gray-700`}>
                            <thead>
                                <tr className="bg-gray-200 dark:bg-[#3b3b3b]">
                                    <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap">No</th>
                                    <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Code</th>
                                    <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Description</th>
                                    <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Quantity</th>
                                    <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap">More</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                {Array.isArray(shipments) && shipments.length > 0 &&
                                    shipments.map((item, index) => (
                                        <tr
                                            className="hover:bg-gray-200 dark:bg-[#1b1b1d] dark:hover:bg-[#28282a] cursor-pointer"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{index + 1}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.shipmentCode}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 flex justify-center ">{item.moreInfo}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.quantity}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center underline"><a
                                            onClick={() =>{GetUnitsBymodel(item.shipmentCode);}}
                                            >
                                                View
                                                </a></td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                    </div>

                    {Units.length > 0 ?(
                        <div className="flex-1 overflow-auto" style={{ maxHeight: "80vh" }}>

                        <table className="min-w-full border border-gray-300 dark:bg-[#1b1b1d] dark:border-gray-700">
                            <thead>
                                <tr className="bg-gray-200 dark:bg-[#3b3b3b]">
                                    <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap">No</th>
                                    <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Model</th>
                                    <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300"><select

                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="bg-gray-200 dark:bg-[#3b3b3b] border-[#1b1b1d] dark:border-[#7a7a7a] border-2 text-gray-900 dark:text-gray-300 py-1 rounded"
                                    >
                                        <option value="Live">Live</option>
                                        <option value="Trial Live">Trial Live</option>
                                        <option value="Configured">Configured</option>
                                        <option value="Re-Test">Re-Test</option>
                                        <option value="Testing Units">Testing Units</option>
                                        <option value="On-site">On-site</option>
                                        <option value="Faulty">Faulty</option>
                                        <option value="Failed">Failed</option>
                                        <option value="Pending RMA">Pending RMA</option>
                                        <option value="RMA Approved">RMA Approved</option>
                                        <option value="RMA Sent">RMA Sent</option>
                                        <option value="Damaged">Damaged</option>
                                        <option value="Lost">Lost</option>
                                        <option value="Pending Vendor Testing">Pending Ven Test</option>
                                        <option value="No SIM">No SIM</option>
                                        <option value="Secure Path">Secure Path</option>
                                        <option value="Configured for Secure Path">Configured-Secure P</option>
                                        <option value="Branch Transfer">Branch Transfer</option>
                                    </select></th>
                                    <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Quantity</th>
                                    <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap">More</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                {Array.isArray(UnitsBM) && UnitsBM.length > 0 &&
                                    UnitsBM.map((item, index) => (

                                        <tr
                                            className="hover:bg-gray-200 dark:bg-[#1b1b1d] dark:hover:bg-[#28282a] cursor-pointer"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{index + 1}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.model.model}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 flex justify-center ">{item.model.status}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.units.length}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center underline"><a
                                                onClick={() => setUnits(item.units)}
                                            >View</a></td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                    </div>
                    ):(null)}
                    
                </div>

                <div className="w-1/2 h-full flex items-center justify-center">
                    <div className=" h-full  flex flex-col items-center justify-start">
                        {/* Table Section */}

                        {Units.length > 0 ? (
                            <div className="flex-1 overflow-auto overflow-x-auto w-full" style={{ maxHeight: "80vh" }}>
                            <table className="min-w-1/2 w-full border border-gray-300 dark:bg-[#1b1b1d] dark:border-gray-700">
                                <thead>
                                    <tr className="bg-gray-200 dark:bg-[#3b3b3b]">
                                        <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">No </th>
                                        <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Model</th>
                                        <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Unit ID</th>
                                        <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Shipment</th>
                                        <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Sim</th>
                                        <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Edit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                    {Array.isArray(Units) && Units.length > 0 &&
                                        Units.map((item, index) => (
                                            <React.Fragment key={index}>
                                                <tr
                                                    onClick={() => toggleRow(index)}
                                                    className="hover:bg-gray-200 dark:bg-[#1b1b1d] dark:hover:bg-[#28282a] cursor-pointer">
                                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{index + 1}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.model}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.imei}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.shipment}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 flex justify-center">{item.simAttached ? item.simNumber : "Not Attached"}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.status}</td>
                                                </tr>
                                                {expandedRow === index && (
                                                    <tr>
                                                        <td colSpan="10" className="px-6 py-4 bg-gray-100 dark:bg-[#1b1b1d] text-gray-900 dark:text-gray-300">
                                                            <div className="flex justify-between items-start">
                                                            
                                                                <div className='space-y-7'>

                                                                    <div className="flex space-x-16">
                                                                        <div className="flex flex-col space-y-1">
                                                                            <span className="text-sm ">Unit Name</span>
                                                                            <span className="text-md font-semibold" >{item.assetMake} {item.assetModel} - {item.assetRegNo}</span>
                                                                        </div>
                                                                        <div className="flex flex-col space-y-1">
                                                                            <span className="text-sm ">Customer</span>
                                                                            <span className="text-md font-semibold">{item.customer.company ? item.customer.company : item.customer.firstname}</span>
                                                                        </div>
                                                                        <div className="flex flex-col space-y-1">
                                                                            <span className="text-sm ">Edit</span>
                                                                            <span className="text-md font-semibold underline">Edit</span>
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
                        ) : (
                            <div className={`flex-1 ${Units.length > 0 ? "overflow-auto" : ""}`} style={Units.length > 0 ?{ maxHeight: "80vh" }:{}}>

                                <table className="min-w-full border border-gray-300 dark:bg-[#1b1b1d] dark:border-gray-700">
                                    <thead>
                                        <tr className="bg-gray-200 dark:bg-[#3b3b3b]">
                                            <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap">No</th>
                                            <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Model</th>
                                            <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300"><select

                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                                className="bg-gray-200 dark:bg-[#3b3b3b] border-[#1b1b1d] dark:border-[#7a7a7a] border-2 text-gray-900 dark:text-gray-300 py-1 rounded"
                                            >
                                                <option value="Live">Live</option>
                                                <option value="Trial Live">Trial Live</option>
                                                <option value="Configured">Configured</option>
                                                <option value="Re-Test">Re-Test</option>
                                                <option value="Testing Units">Testing Units</option>
                                                <option value="On-site">On-site</option>
                                                <option value="Faulty">Faulty</option>
                                                <option value="Failed">Failed</option>
                                                <option value="Pending RMA">Pending RMA</option>
                                                <option value="RMA Approved">RMA Approved</option>
                                                <option value="RMA Sent">RMA Sent</option>
                                                <option value="Damaged">Damaged</option>
                                                <option value="Lost">Lost</option>
                                                <option value="Pending Vendor Testing">Pending Ven Test</option>
                                                <option value="No SIM">No SIM</option>
                                                <option value="Secure Path">Secure Path</option>
                                                <option value="Configured for Secure Path">Configured-Secure P</option>
                                                <option value="Branch Transfer">Branch Transfer</option>
                                            </select></th>
                                            <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Quantity</th>
                                            <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap">More</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                        {Array.isArray(UnitsBM) && UnitsBM.length > 0 &&
                                            UnitsBM.map((item, index) => (

                                                <tr
                                                    className="hover:bg-gray-200 dark:bg-[#1b1b1d] dark:hover:bg-[#28282a] cursor-pointer"
                                                >
                                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{index + 1}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.model.model}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 flex justify-center ">{item.model.status}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.units.length}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center underline"><a
                                                        onClick={() => setUnits(item.units)}
                                                    >View</a></td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                        }
                    </div>

                </div>
            </div>
        </>
    );
}

export default Unitstatus;
