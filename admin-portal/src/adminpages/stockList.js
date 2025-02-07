import React, { useEffect, useState } from 'react'
import Header from '../Components/header'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function StockList() {

    const [Data, setData] = useState([]);
    const navigate = useNavigate();

    const GetallAdmins = async () => {
        try {
            console.log("Loading");
            //setIsLoading(true);
            const res = await axios.get("/api-trkadn/getall-stock");
            if (res.status === 200) {
                console.log(res.data.stock);
                
                setData(res.data.stock);
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

    useEffect(() => {
        GetallAdmins()
    }, [])
    const sim = 9562721387

    return (
        <>
            <Header />
            <div className=' mt-24 flex flex-row justify-between items-center'>
                <div>
                    <h1 className='text-gray-900 dark:text-gray-300 font-semibold text-3xl p-6'>
                        Stock List
                    </h1>
                </div>

            </div>

            <div > {/* Theme-based background and text color */}
                <div className="flex w-full items-center justify-center overflow-x-auto p-4 ">
                    <table className="w-10/12 border border-gray-300  dark:border-gray-700">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-[#343a46]">
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap">No</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Unit Id</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Unit Info</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Attached SIM</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Shipment</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Status</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap">Install Unit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {Array.isArray(Data) && Data.length > 0 &&
  Data.map((item, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-200 dark:hover:bg-gray-800"
                                >
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{index + 1}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.imei}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.model}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{sim}</td>

                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.shipment}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.status}</td>
                                    <td className="px-6 py-4 text-sm text-green-600 dark:text-green-600 underline hover:cursor-pointer text-center"><a onClick={() => navigate(`/install-unit/${item.imei}/${sim}`)}>Install</a></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default StockList