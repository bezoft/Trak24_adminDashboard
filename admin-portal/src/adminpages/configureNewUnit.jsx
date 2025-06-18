import React, { useState } from 'react';
import Header from '../Components/header';
import axios from 'axios';
import Modal from '../Components/Modal';
import SignalStrengthIcon from '../Components/SignalStrength';

import AddressCell from '../Components/AddressCell';
import { DateTimeFRMT } from '../DataHelpers/Date&Time';
import axiosInstance from '../auth/interceptor';
function ConfigureNewUnit() {
    const [unitId, setUnitId] = useState('');
    const currentDate = new Date();
    const [Data, setData] = useState([])
    const [ShipmentCodes, setShipmentCodes] = useState([])
    const [stockList, setstockList] = useState(null); // State to control "Add to Stock List" button visibility
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        imei: "",
        shipment: "",
        model: "",
        remarks: "",
        status: "",
        stockListed: true
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    function formatDateTime(date) {
        const options = { day: "2-digit", month: "short", year: "numeric" }; // Format: 04 Jan 2025
        const datePart = date.toLocaleDateString("en-US", options);
    
        const timePart = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true, // Ensures AM/PM format
        });
    
        return `${datePart}, ${timePart}`;
    }



   const handleSearch = async () => {
    try {
        // Remove whitespace from unitId before making the API call
        const cleanUnitId = unitId.trim();
        
        const response = await axiosInstance.get(`/api-trkadn/searchconfig-unit/${cleanUnitId}`);
   
        if (response.data && response.data.unit?.stockListed === true) {
            setstockList(true); // Unit is in stock
        } else {
            setData(response.data.unit);
            setstockList(false); // Unit is not in stock or not found
        }
    } catch (error) {
        setstockList(null); // Set to null if an error occurs
    }
};
   
    
    const GetallShipments = async () => {
        try {
            const res = await axiosInstance.get("/api-trkadn/getall-shipmentcodes");
      
            
            if (res.status === 200) {
                setShipmentCodes(res.data.shipmentCodes);
            } 
        } catch (error) {
        } finally {
            // Ensure loading and refreshing states are reset
            //   setIsLoading(false);
            //   setIsRefreshing(false);
        }
    };
    const AddToStock = async () => {
        setFormData((prevData) => ({
            ...prevData,
            imei: unitId
        }));
        GetallShipments()
        setOpen(true)
    };

    const handleAddToStock = async (e) => {
        e.preventDefault();
      

        try {
            const response = await axiosInstance.post("/api-trkadn/config-new-unit", formData);

            if (response.status === 200) {

                setFormData({
                    imei: "",
                    shipment: "",
                    model: "",
                    remarks: "",
                    status: "",
                    stockListed: true
                });
                setstockList(null)
                setUnitId("")
                setOpen(false)
                window.location.href = "/stock-list"
            }
        } catch (error) {
            //setstockList(false);
        }
    };


    
    return (
        <>
    <Header />
    <div className="mt-28">
        {/* Page Title */}
        <div className="flex w-full items-left px-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
                Configure New Unit
            </h2>
        </div>

        {/* Search Section */}
        <div className="mx-auto w-full max-w-lg mt-24">
            <div className="flex items-center space-x-5">
                <input
                    type="text"
                    value={unitId}
                    onChange={(e) => setUnitId(e.target.value)}
                    placeholder="Enter Unit ID"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <button
                    onClick={handleSearch}
                    className="px-6 py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-md shadow-md transition duration-200"
                >
                    Search
                </button>
            </div>
        </div>

        {/* Conditional Add to Stock List Button */}
        {stockList === false ? (
            <div className="mt-10 text-center">
                <button
                    onClick={AddToStock}
                    className="px-6 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md shadow-md transition duration-200"
                >
                    Add to Stock List
                </button>
            </div>
        ) : stockList === true ? (
            <div className="mt-10 text-center">
                <p className="mt-4 text-red-500 text-center">
                    Unit Already in Stock List
                </p>
            </div>
        ) : null}

        {/* Table Section */}
        <div className="min-h-screen px-6 mt-10">
            <div className="overflow-hidden rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-[#3b3b3b]">
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Sl No</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Time of Signal</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">GPS</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Reports</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Geographic Area</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Speed</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">KM Reading</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-[#1b1b1d] divide-y divide-gray-200 dark:divide-gray-700">
                            {Array.isArray(Data) && Data.length > 0 ? (
                                Data.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-100 dark:hover:bg-[#28282a] cursor-pointer transition-colors duration-150"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300 ">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 ">
                                            Current Time & Date: {formatDateTime(currentDate)}<br />
                                            Unit Time & Date: {DateTimeFRMT(item.liveData?.date, item.liveData?.time)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 ">
                                            <div title={`Signal Strength ${item.liveData?.gsm_signal}%`}>
                                                <SignalStrengthIcon strength={item.liveData?.gsm_signal} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 ">
                                            {item.reports?.length}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 ">
                                            <AddressCell latitude={item.liveData?.latitude} longitude={item.liveData?.longitude} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 ">
                                            {item.liveData?.speed} km/h,<br />
                                            Heading: {item.liveData?.latitude_direction}{item.liveData?.longitude_direction}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 ">
                                            {item.liveData?.gps_odometer} km
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-10 w-10 mb-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                                />
                                            </svg>
                                            <span className="text-lg font-medium">No data available</span>
                                            <span className="text-sm">Please search for a unit to view data</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="text-gray-900 dark:text-gray-200">
                    <h2 className="text-2xl font-bold mb-6 text-center">Add To Stock List</h2>
                    <form onSubmit={handleAddToStock} className="flex flex-col gap-4">
                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="name"
                            >
                                Unit Id
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.imei}
                                placeholder="Enter Name"
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                required
                            />
                        </div>
                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="shipment"
                            >
                                Shipment
                            </label>
                            <select
                                id="shipment"
                                name="shipment"
                                value={formData.shipment}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                required
                            >
                                <option>Select a Shipment Code</option>
                                {ShipmentCodes.map((code) => (
                                    <option value={code.shipmentCode}>{code.shipmentCode}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="model"
                            >
                                Model
                            </label>
                            <select
                                id="model"
                                name="model"
                                value={formData.model}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                required
                            >
                                <option>Select a Model</option>
                                <option value="AT1">AT1</option>
                                <option value="AT5">AT5</option>
                                <option value="TK103-2">TK103-2</option>
                                <option value="SIB-1">SIB-1</option>
                                <option value="AT3 E">AT3 E</option>
                                <option value="AT1 E Pro1">AT1 E Pro1</option>
                                <option value="AT1 E Pro 2">AT1 E Pro 2</option>
                                <option value="AT5V">AT5V</option>
                                <option value="AX5">AX5</option>
                                <option value="Sky1">Sky1</option>
                                <option value="AK1">AK1</option>
                                <option value="AK1Lite">AK1Lite</option>
                                <option value="TFT">TFT</option>
                                <option value="TFT T8803 Pro">TFT T8803 Pro</option>
                                <option value="TFT T8806F">TFT T8806F</option>
                                <option value="AL11">AL11</option>
                                <option value="AT5+FMS">AT5+FMS</option>
                                <option value="AL1">AL1</option>
                                <option value="Eco 4+">Eco 4+</option>
                                <option value="AS3">AS3</option>
                                <option value="AS1">AS1</option>
                                <option value="TFT 8808A">TFT 8808A</option>
                                <option value="TFT 8603">TFT 8603</option>
                                <option value="T8608-OBD II">T8608-OBD II</option>
                                <option value="T8608D-OBD II">T8608D-OBD II</option>
                                <option value="T8806+R">T8806+R</option>
                                <option value="T8806">T8806</option>
                                <option value="BSTPL-15">BSTPL-15</option>
                                <option value="BSTPL-17A">BSTPL-17A</option>
                                <option value="Bharat 101">Bharat 101</option>
                                <option value="TS 101 Advanced">TS 101 Advanced</option>
                                <option value="TS Basic">TS Basic</option>
                                <option value="Non OBD Dongle">Non OBD Dongle</option>
                                <option value="OBD II">OBD II</option>
                                <option value="AK300-LE">AK300-LE</option>
                                <option value="BSTPL-17IS">BSTPL-17IS</option>
                                <option value="BSTPL-56R">BSTPL-56R</option>

                            </select>
                        </div>
                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="status"
                            >
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                required
                            >
                                <option>Select a Status</option>
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
                                <option value="Pending Vendor Testing">Pending Vendor Testing</option>
                                <option value="No SIM">No SIM</option>
                                <option value="Secure Path">Secure Path</option>
                                <option value="Configured for Secure Path">Configured for Secure Path</option>
                                <option value="Branch Transfer">Branch Transfer</option>

                            </select>
                        </div>
                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="remarks"
                            >
                                Remarks
                            </label>
                            <input
                                type="text"
                                id="remarks"
                                name="remarks"
                                placeholder="Enter Remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
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
                                Add to Stock
                            </button>

                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}

export default ConfigureNewUnit;
