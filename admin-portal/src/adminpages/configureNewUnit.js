import React, { useState } from 'react';
import Header from '../Components/header';
import axios from 'axios';
import Modal from '../Components/Modal';
import SignalStrengthIcon from '../Components/SignalStrength';

import AddressCell from '../Components/AddressCell';
import { DateTimeFRMT } from '../DataHelpers/Date&Time';
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

    console.log(stockList);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`/api-trkadn/search-unit/${unitId}`);
            console.log(response.data);

            if (response.data && response.data.unit?.stockListed === true) {
                setstockList(true); // Unit is in stock
            } else {
                setData(response.data.unit);
                setstockList(false); // Unit is not in stock or not found
            }
        } catch (error) {
            console.error("Error searching for unit:", error);
            setstockList(null); // Set to null if an error occurs
        }
    };
    console.log(Data);
    
    const GetallShipments = async () => {
        try {
            const res = await axios.get("/api-trkadn/getall-shipmentcodes");
            console.log(res.data);
            
            if (res.statusText === "OK") {
                setShipmentCodes(res.data.shipmentCodes);
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
        console.log(formData);

        try {
            const response = await axios.post("/api-trkadn/config-new-unit", formData);

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
            console.error("Error searching for unit:", error);
            //setstockList(false);
        }
    };


    
    return (
        <>
            <Header />
            <div className="mt-28">
                <div className=" flex w-full items-left px-6 ">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
                        Configure New Unit
                    </h2>
                </div>

                {/* Centered Search Section */}
                <div className="mx-auto w-full max-w-lg mt-24">
                    <div className="flex items-center space-x-5">
                        <input
                            type="text"
                            value={unitId}
                            onChange={(e) => setUnitId(e.target.value)}
                            placeholder="Enter Unit ID"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-6 py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-md shadow-md"
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
                            className="px-6 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md shadow-md"
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
                ) : (
                    null // Display nothing when stockList is null
                )}

                {/* Feedback */}
                {/* {!isUnitFound && unitId && (
                    <p className="mt-4 text-red-500 text-center">
                        Unit not found. Please check the ID and try again.
                    </p>
                )} */}
                <div className="overflow-x-auto p-4 mt-10">
                    <table className="min-w-full border border-gray-300 dark:bg-[#16181d] dark:border-gray-700">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-[#343a46]">
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap">Sl No</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Time of Signal</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">GPS</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Reports</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap">Geographic Area</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 ">Speed</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">KM Reading</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {Array.isArray(Data) && Data.length > 0 &&
  Data.map((item, index) => (
                                <tr
                                    className="hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
                                >
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{index + 1}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">Current Time & Date: {formatDateTime(currentDate)}<br/>Unit Time & Date: {DateTimeFRMT(item.liveData.date,item.liveData.time)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 flex justify-center " title={`Signal Strength ${item.liveData.gsm_signal}%`}><SignalStrengthIcon strength={item.liveData.gsm_signal} /></td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.reports.length}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center"><AddressCell latitude={item.liveData.latitude} longitude={item.liveData.longitude}/></td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.liveData.speed} km/h,<br/> Heading: {item.liveData.latitude_direction}{item.liveData.longitude_direction}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.liveData.gps_odometer} km</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div >

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
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
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
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
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
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
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
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
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
