import React, { useEffect, useState, useCallback } from 'react'
import Header from '../Components/header'
import axiosInstance from '../auth/interceptor';
import axios from 'axios';

function RawDataManager() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasDataLoaded, setHasDataLoaded] = useState(false);

    // Memoized filter function to prevent unnecessary re-filtering
    const filterData = useCallback((dataToFilter, searchValue) => {
        if (searchValue.trim() === '') {
            return dataToFilter;
        }
        return dataToFilter.filter(item => 
            item.imei && item.imei.toLowerCase().includes(searchValue.toLowerCase())
        );
    }, []);

    const getAllUnitsRawData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await axiosInstance.get("/api-trkadn/getall-rawdata");
            if (res.status === 200) {
                console.log(res.data.data);
                if (res.data.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
                    setData(res.data.data);
                    setHasDataLoaded(true);
                } else {
                    setData([]);
                    setHasDataLoaded(true);
                }
            } else {
                setError("Failed to fetch data");
                setHasDataLoaded(true);
            }
        } catch (error) {
            console.error("Error fetching raw data:", error);
            setError("Failed to load raw data. Please try again later.");
            setData([]);
            setHasDataLoaded(true);
        } finally {
            setIsLoading(false);
        }
    };

    const getAllUnitsRawData2 = async () => {
        try {
            setError(null);
            const res = await axiosInstance.get("/api-trkadn/getall-rawdata");
            if (res.status === 200) {
                console.log(res.data.data);
                if (res.data.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
                    setData(res.data.data);
                    setHasDataLoaded(true);
                } else {
                    setData([]);
                    setHasDataLoaded(true);
                }
            } else {
                setError("Failed to fetch data");
                setHasDataLoaded(true);
            }
        } catch (error) {
            console.error("Error fetching raw data:", error);
            setError("Failed to load raw data. Please try again later.");
            setData([]);
            setHasDataLoaded(true);
        } 
    };

    useEffect(() => {
        // Call immediately once
        getAllUnitsRawData();

        // Set interval to run every 10 seconds (10000 ms)
        const intervalId = setInterval(() => {
            getAllUnitsRawData2();
        }, 10000);

        // Cleanup on unmount
        return () => clearInterval(intervalId);
    }, []); // Remove searchTerm dependency

    // Filter data when either searchTerm OR data changes
    useEffect(() => {
        setFilteredData(filterData(data, searchTerm));
    }, [searchTerm, data, filterData]); // Keep data dependency to update filtered results

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleRetry = () => {
        setError(null);
        setHasDataLoaded(false);
        getAllUnitsRawData();
    };

    // Show error state when data fetching failed or no data available
    if (error && hasDataLoaded && data.length === 0) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex flex-col items-center justify-center px-6">
                    <div className="text-center max-w-md">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 mx-auto mb-4 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            No Data Available
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {error === "No raw data found" 
                                ? "No raw data has been recorded yet. Please check back later."
                                : "Unable to load raw data. Please check your connection and try again."
                            }
                        </p>
                        <button
                            onClick={handleRetry}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            Try Again
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="mt-24 flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h1 className="text-black dark:text-white font-semibold text-4xl p-6 mb-4">
                        Raw Data Manager
                    </h1>
                </div>
                <div className="p-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by IMEI number..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full md:w-80 px-3 py-3 pl-12 bg-white dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        <svg
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="min-h-screen px-6">
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    {isLoading ? 'Loading...' : `Showing ${filteredData.length} of ${data.length} units`}
                </div>
                
                <div className="overflow-hidden mb-12 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                                <tr className="bg-gray-200 dark:bg-[#3b3b3b]">
                                    <th scope="col" className="px-3 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider w-16">
                                        No
                                    </th>
                                    <th scope="col" className="px-3 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider w-32">
                                        IMEI
                                    </th>
                                    <th scope="col" className="px-3 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Raw Data
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-[#1b1b1d] divide-y divide-gray-200 dark:divide-gray-700">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-col items-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                                                <span className="text-lg font-medium">Loading raw data...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : Array.isArray(filteredData) && filteredData.length > 0 ? (
                                    filteredData.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-100 dark:hover:bg-[#28282a] transition-colors duration-150"
                                        >
                                            <td className="px-3 py-4 text-sm font-medium text-gray-900 dark:text-gray-300 w-16">
                                                {index + 1}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-700 dark:text-gray-300 font-mono w-32">
                                                {item.imei || 'N/A'}<br/>{item.model || 'Unknown'}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-700 dark:text-gray-300 break-all whitespace-pre-wrap">
                                                {item.rawData || 'No data'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
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
                                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                    />
                                                </svg>
                                                <span className="text-lg font-medium">
                                                    {searchTerm.trim() !== '' ? 'No units found' : 'No results found'}
                                                </span>
                                                <span className="text-sm">
                                                    {searchTerm.trim() !== '' 
                                                        ? `No units found matching "${searchTerm}"` 
                                                        : 'No data matches your search criteria'
                                                    }
                                                </span>
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

export default RawDataManager