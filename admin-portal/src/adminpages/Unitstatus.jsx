import React, { useState, useEffect } from 'react';
import Header from '../Components/header';
import axios from 'axios';
import { Search, Eye, ChevronDown, ChevronUp, Edit, Package, User,PcCase } from 'lucide-react';
import axiosInstance from '../auth/interceptor';

function Unitstatus() {
    const [shipments, setShipments] = useState([]);
    const [unitid, setUnitid] = useState("");
    const [status, setStatus] = useState("Live");
    const [units, setUnits] = useState([]);
    const [unitsBM, setUnitsBM] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null);
    const [activeShipment, setActiveShipment] = useState(null);
    const [loading, setLoading] = useState(true);

    const GetallShipments = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/api-trkadn/getall-shipments");
            if (res.status === 200) {
                setShipments(res.data.shipments);
            }
        } catch (error) {
            console.error("Error fetching shipments:", error);
        } finally {
            setLoading(false);
        }
    };

    const GetUnitsBymodel = async (shipment) => {
        try {
            setLoading(true);
            if (shipment) setActiveShipment(shipment);
            
            const res = await axiosInstance.get(`/api-trkadn/get-unit-model/${shipment ? "false" : status}/${shipment ? shipment : "null"}`);
            if (res.status === 200) {
                setUnitsBM(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching units by model:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    useEffect(() => {
        GetallShipments();
        GetUnitsBymodel();
    }, []);

    useEffect(() => {
        GetUnitsBymodel();
    }, [status]);

    const handleSearch = async () => {
        
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/api-trkadn/search-unit/${unitid}`);
            if (response.status === 200) {
                setUnits(response.data.unit);
            }
        } catch (error) {
            console.error("Error searching for unit:", error);
        } finally {
            setLoading(false);
        }
    };

    const statusColors = {
        "Live": "bg-green-100 text-green-800",
        "Trial Live": "bg-teal-100 text-teal-800",
        "Configured": "bg-blue-100 text-blue-800",
        "Re-Test": "bg-purple-100 text-purple-800",
        "Testing Units": "bg-indigo-100 text-indigo-800",
        "On-site": "bg-cyan-100 text-cyan-800",
        "Faulty": "bg-red-100 text-red-800",
        "Failed": "bg-red-100 text-red-800",
        "Pending RMA": "bg-orange-100 text-orange-800",
        "RMA Approved": "bg-yellow-100 text-yellow-800",
        "RMA Sent": "bg-amber-100 text-amber-800",
        "Damaged": "bg-rose-100 text-rose-800",
        "Lost": "bg-gray-100 text-gray-800",
        "Pending Vendor Testing": "bg-violet-100 text-violet-800",
        "No SIM": "bg-orange-100 text-orange-800",
        "Secure Path": "bg-emerald-100 text-emerald-800",
        "Configured for Secure Path": "bg-lime-100 text-lime-800",
        "Branch Transfer": "bg-sky-100 text-sky-800"
    };

    const getStatusBadge = (statusValue) => {
        const colorClass = statusColors[statusValue] || "bg-gray-100 text-gray-800";
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                {statusValue}
            </span>
        );
    };

    const LoadingSpinner = () => (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
        </div>
    );

    return (
        <>
            <Header />

            <div className="container mt-10 mx-auto px-4 pt-20 pb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="text-gray-900 dark:text-gray-100 font-bold text-2xl sm:text-3xl">
                            Unit Management
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            View and manage all units and shipments
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 w-full md:w-auto flex items-center">
                        <div className="relative w-full md:w-64">
                            <input
                                id="search"
                                name="search"
                                value={unitid}
                                placeholder="Search by Unit IMEI"
                                onChange={(e) => setUnitid(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1b1b1d] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                        <button
                            className="ml-3 bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-all shadow-sm flex items-center"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Panel */}
                    <div className="flex flex-col space-y-6">
                        {/* Shipments Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-800 dark:bg-[#1b1b1d] flex justify-between items-center">
                                <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100 flex items-center">
                                    <Package className="h-5 w-5 mr-2 text-orange-600" />
                                    Shipments
                                </h2>
                                <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">
                                    {shipments.length} total
                                </span>
                            </div>
                            <div className="overflow-x-auto" style={{ maxHeight: "40vh" }}>
                                {loading && !unitsBM.length ? (
                                    <LoadingSpinner />
                                ) : (
                                    <table className="min-w-full divide-y divide-gray-200  dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-[#1b1b1d]">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">No</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Code</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-[#1b1b1d]  divide-y divide-gray-200 dark:divide-gray-700">
                                            {Array.isArray(shipments) && shipments.length > 0 ? (
                                                shipments.map((item, index) => (
                                                    <tr 
                                                        key={index}
                                                        className={`hover:bg-gray-50 dark:hover:bg-[#28282a] transition-colors ${activeShipment === item.shipmentCode ? 'bg-orange-50 dark:bg-[#28282a]' : ''}`}
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{index + 1}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{item.shipmentCode}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{item.moreInfo}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-center">{item.quantity}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <button
                                                                onClick={() => GetUnitsBymodel(item.shipmentCode)}
                                                                className="text-orange-600 hover:text-orange-700 font-medium flex items-center justify-center mx-auto"
                                                            >
                                                                <Eye className="h-4 w-4 mr-1" />
                                                                View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                        No shipments found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        {/* Units by Model Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-800 dark:bg-[#1b1b1d] flex justify-between items-center">
                                <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100 flex items-center">
                                    <PcCase className="h-5 w-5 mr-2 text-orange-600" />
                                    Units by Model
                                </h2>
                                <div>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="bg-white dark:bg-[#1b1b1d] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-lg p-2 focus:ring-orange-500 focus:border-orange-500"
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
                                    </select>
                                </div>
                            </div>
                            <div className="overflow-x-auto" style={{ maxHeight: activeShipment ? "40vh" : "60vh" }}>
                                {loading ? (
                                    <LoadingSpinner />
                                ) : (
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-[#1b1b1d]">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">No</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Model</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-[#1b1b1d] divide-y divide-gray-200 dark:divide-gray-700">
                                            {Array.isArray(unitsBM) && unitsBM.length > 0 ? (
                                                unitsBM.map((item, index) => (
                                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-[#28282a] transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{index + 1}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{item.model.model}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {getStatusBadge(item.model.status)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                            <span className="font-medium">{item.units.length}</span> units
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <button
                                                                onClick={() => setUnits(item.units)}
                                                                className="text-orange-600 hover:text-orange-700 font-medium flex items-center justify-center mx-auto"
                                                            >
                                                                <Eye className="h-4 w-4 mr-1" />
                                                                View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                        No units found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Unit Details */}
                    <div className="bg-white dark:bg-[#1b1b1d] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100 flex items-center">
                                <PcCase className="h-5 w-5 mr-2 text-orange-600" />
                                Unit Details
                                {units.length > 0 && (
                                    <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">
                                        {units.length} units
                                    </span>
                                )}
                            </h2>
                        </div>
                        <div className="overflow-x-auto dark:bg-[#1b1b1d]" style={{ maxHeight: "80vh" }}>
                            {loading && Array.isArray(units) ? (
                                <LoadingSpinner />
                            ) : units.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-[#1b1b1d]">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">No</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Model</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unit ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Shipment</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sim</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-[#1b1b1d] divide-y divide-gray-200 dark:divide-gray-700">
                                        {units.length>0&&units.map((item, index) => (
                                            <React.Fragment key={index}>
                                                <tr 
                                                    onClick={() => toggleRow(index)}
                                                    className="hover:bg-gray-50 dark:hover:dark:bg-[#28282a] cursor-pointer transition-colors"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{index + 1}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{item?.model}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item?.imei}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item?.shipment}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                        {item?.simAttached ? (
                                                            <span className="text-green-600 dark:text-green-400">{item?.simNumber}</span>
                                                        ) : (
                                                            <span className="text-red-500 dark:text-red-400">Not Attached</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(item?.status)}
                                                    </td>
                                                </tr>
                                                {expandedRow === index && (
                                                    <tr>
                                                        <td colSpan="6" className="px-0 py-0 bg-gray-50 dark:bg-gray-750">
                                                            <div className="p-6 bg-gradient-to-r from-orange-50 to-transparent dark:from-[#28282a] dark:to-[#1b1b1d] border-l-4 border-orange-500 m-0">
                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                    <div className="space-y-1">
                                                                        <div className="text-xs text-gray-500 dark:text-gray-400">Asset Details</div>
                                                                        <div className="flex items-center font-medium text-gray-900 dark:text-gray-100">
                                                                            <Package className="h-4 w-4 mr-2 text-orange-600" />
                                                                            {item?.assetMake} {item?.assetModel} 
                                                                            {item?.assetRegNo && <span className="ml-1 text-gray-600 dark:text-gray-400">({item?.assetRegNo})</span>}
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div className="space-y-1">
                                                                        <div className="text-xs text-gray-500 dark:text-gray-400">Customer</div>
                                                                        <div className="flex items-center font-medium text-gray-900 dark:text-gray-100">
                                                                            <User className="h-4 w-4 mr-2 text-orange-600" />
                                                                            {item?.customer.company || item?.customer.firstname}
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div className="space-y-1">
                                                                        <div className="text-xs text-gray-500 dark:text-gray-400">Actions</div>
                                                                        <button className="flex items-center text-orange-600 hover:text-orange-700 font-medium">
                                                                            <Edit className="h-4 w-4 mr-1" />
                                                                            Edit Details
                                                                        </button>
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
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 px-6 text-center">
                                    <PcCase className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Select a model or search for a unit to view details
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Unitstatus;