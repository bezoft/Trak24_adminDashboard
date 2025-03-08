import React, { useState, useEffect } from 'react';
import Header from '../Components/header';
import axios from 'axios';

function Unitstatus() {

    const [shipments, setShipments] = useState([]);

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
    console.log(shipments);

    useEffect(() => {
        GetallShipments()
    }, [])


    return (
        <>
            <Header />

            <div className="flex gap-4 p-4 mt-24 h-screen">
                {/* Left side with two stacked divs */}
                <div className="flex flex-col w-1/2 h-full gap-4">
                    <div className="flex-1 overflow-auto" style={{ maxHeight: "80vh" }}>



                        <table className="min-w-full border border-gray-300 dark:bg-[#16181d] dark:border-gray-700">
                            <thead>
                                <tr className="bg-gray-200 dark:bg-[#3b3b3b]">
                                    <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap">Sl No</th>
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
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">more</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                    </div>
                    <div className="flex-1 overflow-auto" style={{ maxHeight: "80vh" }}>



                        <table className="min-w-full border border-gray-300 dark:bg-[#16181d] dark:border-gray-700">
                            <thead>
                                <tr className="bg-gray-200 dark:bg-[#3b3b3b]">
                                    <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap">Sl No</th>
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
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">more</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                    </div>
                </div>

                {/* Right side with one div */}
                <div className="w-1/2 h-full bg-yellow-500 flex items-center justify-center">
                    <p className="text-black">Table 3</p>
                </div>
            </div>
        </>
    );
}

export default Unitstatus;
