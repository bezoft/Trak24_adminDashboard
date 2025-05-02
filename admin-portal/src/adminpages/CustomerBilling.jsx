import React, { useEffect, useState } from 'react'
import Header from '../Components/header'
import axios from 'axios';
import { DateTimeFRMT } from '../DataHelpers/Date&Time';
import axiosInstance from '../auth/interceptor';

function CustomerBilling() {

    const [Data, setData] = useState([]);
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [client, setClient] = useState("");

    const GetUnits = async () => {
        try {
            //setIsLoading(true);
            const res = await axiosInstance.get(`/api-trkadn/expiring-units/${year}/${month}`);
            if (res.status === 200) {
                console.log(res.data);

                setData(res.data);
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
    function isExpired(isoString) {
        const date = new Date(isoString);
        const targetYear = date.getUTCFullYear();
        const targetMonth = date.getUTCMonth() + 1; // getUTCMonth() is 0-based

        const currentDate = new Date();
        const currentYear = currentDate.getUTCFullYear();
        const currentMonth = currentDate.getUTCMonth() + 1;

        return targetYear < currentYear || (targetYear === currentYear && targetMonth < currentMonth);
    }
    function formatDate(isoString) {
        const date = new Date(isoString);

        // Get the day, month, and year
        const day = date.getUTCDate();
        const month = date.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
        const year = date.getUTCFullYear();

        // Add ordinal suffix to the day
        const suffix = (day) => {
            if (day > 3 && day < 21) return 'th'; // 4th to 20th are 'th'
            switch (day % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };

        return `${day}${suffix(day)} ${month}, ${year}`;
    }
    console.log(Data);

    return (
        <>
            <Header />
            <div className='mt-24 flex flex-col md:flex-row justify-between items-center'>
                <div>
                    <h1 className='text-black dark:text-white font-semibold text-4xl p-6'>
                        Customer Billing
                    </h1>
                </div>
            </div>

            <div className='flex flex-col md:flex-row gap-4 px-6 mb-8'>
                <div className='w-full md:w-64'>
                    <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        htmlFor="month"
                    >
                        Select Month
                    </label>
                    <select
                        id="month"
                        name="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="w-full px-4 py-2 border bg-white dark:bg-[#1b1b1d] border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                        required
                    >
                        <option value="">Select Month</option>
                        <option value="01">January</option>
                        <option value="02">February</option>
                        <option value="03">March</option>
                        <option value="04">April</option>
                        <option value="05">May</option>
                        <option value="06">June</option>
                        <option value="07">July</option>
                        <option value="08">August</option>
                        <option value="09">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                </div>

                <div className='w-full md:w-64'>
                    <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        htmlFor="year"
                    >
                        Select Year
                    </label>
                    <select
                        id="year"
                        name="year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full px-4 py-2 border bg-white dark:bg-[#1b1b1d] border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                        required
                    >
                        <option value="">Select Year</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                    </select>
                </div>

                <div className='self-end mb-0.5'>
                    <button
                        className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 shadow-md hover:shadow-lg transition duration-200 flex items-center gap-2"
                        onClick={() => {
                            if (month && year) {
                                GetUnits();
                            }
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Find
                    </button>
                </div>
            </div>

            <div className="min-h-screen px-6">
                <div className="overflow-hidden rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-[#3b3b3b]">
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">No</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Asset Info</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Installed On</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Expiring On</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Signal</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Renewal</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-[#1b1b1d] divide-y divide-gray-200 dark:divide-gray-700">
                                {Array.isArray(Data) && Data.length > 0 ?
                                    Data.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50 dark:hover:bg-[#28282a] transition-colors duration-150"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.customer.company ? item.customer.company : item.customer.firstname}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                <div className="flex flex-col">
                                                    <span>{item.assetMake} {item.assetModel}</span>
                                                    <span className="text-gray-500 dark:text-gray-400 text-xs">{item.assetRegNo}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{formatDate(item.installation)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${isExpired(item.expiry) ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}>
                                                    {formatDate(item.expiry)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{DateTimeFRMT(item.liveData.date, item.liveData.time)}</td>
                                           
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <a
                                                    href={`/create-incident/${item.customer.company ? item.customer.company : item.customer.firstname}/${item.customer._id}`}
                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 "
                                                >
                                                    Add Incident
                                                </a>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {isExpired(item.expiry) ?(
                                                    <a
                                                    href={`/service-renewal/${item._id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-1.5 text-xs font-medium rounded-md dark:text-white border border-orange-500 hover:bg-orange-200 dark:hover:bg-orange-700/50 transition-colors duration-150 focus:outline-none focus:ring-0"
                                                >
                                                    Renew Service
                                                </a>
                                                ):("NIL")}
                                                
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                                <div className="flex flex-col items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                    </svg>
                                                    <span className="text-lg font-medium">No data available</span>
                                                    <span className="text-sm">Please select month and year to view data</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CustomerBilling