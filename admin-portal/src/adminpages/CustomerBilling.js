import React, { useEffect, useState } from 'react'
import Header from '../Components/header'
import axios from 'axios';
import { DateTimeFRMT } from '../DataHelpers/Date&Time';

function CustomerBilling() {

    const [Data, setData] = useState([]);
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [client, setClient] = useState("");

    const GetUnits = async (selectedCustomer) => {
        try {
            //setIsLoading(true);
            const res = await axios.get(`/api-trkadn/expiring-units/${year}/${month}`);
            if (res.status === 200) {
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
            <div className=' mt-24 flex flex-col md:flex-row justify-between items-center h-full'>
                <div>
                    <h1 className='text-black dark:text-white font-semibold text-3xl p-6'>
                        Customer Billing
                    </h1>
                </div>


            </div>

            <div className='flex w-full space-x-5 px-5 items-end'>

                <div>
                    <label
                        className="block text-sm text-gray-700 dark:text-white mb-1"
                        htmlFor="month"
                    >
                        Select Month
                    </label>
                    <select
                        id="month"
                        name="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="w-full px-4 py-2 border bg-white dark:bg-[#23272f] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required
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

                <div>
                    <label
                        className="block text-sm text-gray-700 dark:text-white mb-1"
                        htmlFor="year"
                    >
                        Select Year
                    </label>
                    <select
                        id="year"
                        name="year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full px-4 py-2 border bg-white dark:bg-[#23272f] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required
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

                <button
                    className="bg-orange-600 text-white h-10 px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition duration-200"
                    onClick={() => {
                        if (month && year) {
                            GetUnits();
                        }
                    }}
                >
                    Find
                </button>

            </div>

            <div className={`   min-h-screen`}>
                <div className="overflow-x-auto p-4 ">
                    <table className="min-w-full border border-gray-300 dark:bg-[#16181d]  dark:border-gray-700">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-[#3b3b3b]">
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap">No</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Customer</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Asset Info</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Installed On</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Expiring On</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 ">Signal</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Add In</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                            {Array.isArray(Data) && Data.length > 0 &&
                                Data.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{index + 1}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.customer.company ? item.customer.company : item.customer.firstname}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.assetMake} {item.assetModel},<br /> Ph: {item.assetRegNo}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{formatDate(item.installation)}</td>
                                        <td className={`px-6 py-4 text-sm ${isExpired(item.expiry)===true?"text-red-600 dark:text-red-600 font-bold":"text-gray-900 dark:text-gray-300"}  text-center`}>{formatDate(item.expiry)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{DateTimeFRMT(item.liveData.date,item.liveData.time)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center underline"><a href={`/create-incident/${item.customer.company ? item.customer.company : item.customer.firstname}/${item.customer._id}`}>Add</a></td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default CustomerBilling