import React, { useState, useEffect } from 'react';
import { ChevronDown, Calendar, Clock, CreditCard, CheckCircle, RotateCcw, FileText } from 'lucide-react';
import { message } from "antd"
import Header from '../Components/header';
import { useParams } from "react-router-dom";
import axiosInstance from '../auth/interceptor';
import moment from 'moment-timezone';
import { useAuth } from '../contexts/AuthContext';

function ServiceRenewal() {
    const { id } = useParams();
        const { decryptData } = useAuth()
    const [Data, setData] = useState(null);
    const [renewalDuration, setRenewalDuration] = useState(6);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [renewalHistory, setRenewalHistory] = useState([]);
    const [newExpiry, setnewExpiry] = useState(new Date().toISOString());
    const [isLoading, setIsLoading] = useState(false);
    const [renewalSuccess, setRenewalSuccess] = useState(false);
    const [expandedHistory, setExpandedHistory] = useState(false);


    // Fetch customer assets when a customer is selected
    useEffect(() => {
        FetchDetails()
    }, []);

    const FetchDetails = async () => {
        try {
            setIsLoading(true);
            console.log(id);

            const response = await axiosInstance.get(`/api-trkadn/renewal-unit/${id}`);
            if (response.status === 200) {
                console.log(response.data.data);

                setData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRenewalSubmit = async (e) => {
        e.preventDefault();

        if (!renewalDuration) {
            alert("Please fill all required fields");
            return;
        }

        try {
            setIsLoading(true);
            const renewalData = {
                customer: Data?.customer?.company || Data?.customer?.firstname || "NIL",
                assetId: Data?._id,
                duration: parseInt(renewalDuration),
                handler:decryptData().name,
                renewalDate: new Date().toISOString(),
                expiry: Data?.expiry,
                newExpiry: addMonthsToIsoDate(Data?.expiry, renewalDuration)
            };
            console.log(renewalData);

            const response = await axiosInstance.post('/api-trkadn/renew-service', renewalData);
            if (response.status === 200 || response.status === 201) {
                message.success("Service Renewed!")
            }
        } catch (error) {
            console.error("Error submitting renewal:", error);
            alert("Failed to renew service. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Format date to readable format
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
    function addMonthsToIsoDate(isoDateString, monthsToAdd) {
        if (!isoDateString) {
            return "NIL";
        }

        // Parse the ISO date string using moment
        const date = moment(isoDateString);

        // Check if the date is valid
        if (!date.isValid()) {
            return "INVALID_DATE";
        }

        // Add the specified number of months
        date.add(monthsToAdd, 'months');

        // Return the new date as an ISO string
        //setnewExpiry(date.toISOString())
        return date.toISOString();
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 dark:bg-[#121214] pt-24 px-6 pb-12">
                <div className="w-full mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <h1 className="text-black dark:text-white font-semibold text-4xl">
                                Service Renewal
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Renew tracking services for your customers' assets
                            </p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Renewal Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-[#1b1b1d] rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                                    Renewal Details
                                </h2>

                                {renewalSuccess && (
                                    <div className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 mt-0.5" />
                                        <div>
                                            <p className="text-green-700 dark:text-green-300 font-medium">Service renewed successfully</p>
                                            <p className="text-green-600 dark:text-green-400 text-sm">The service has been renewed for {renewalDuration} months</p>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleRenewalSubmit}>
                                    <div className="space-y-3">
                                        {/* Customer Selection */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Customer*
                                            </label>
                                            <div>
                                                <h1 className="font-bold text-lg">
                                                    {Data?.customer?.company || Data?.customer?.firstname || "NIL"}
                                                </h1>
                                            </div>
                                        </div>

                                        {/* Asset Selection */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Asset*
                                            </label>
                                            <div>
                                                <h1 className='font-bold text-lg'>{Data?.assetMake} - {Data?.assetRegNo}</h1>
                                            </div>
                                        </div>

                                        {/* Duration */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Renewal Duration*
                                            </label>
                                            <div className="relative">
                                                <select
                                                    className="w-full px-4 py-3 bg-white dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none transition-all duration-200"
                                                    value={renewalDuration}
                                                    onChange={(e) => setRenewalDuration(e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select duration</option>
                                                    <option value={1}>1 Month</option>
                                                    <option value={3}>3 Months</option>
                                                    <option value={6}>6 Months</option>
                                                    <option value={12}>12 Months</option>
                                                    <option value={24}>24 Months</option>
                                                </select>
                                                <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>

                                        {/* Payment Method */}
                                        {/* <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Payment Method*
                                            </label>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div
                                                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${paymentMethod === 'Credit Card'
                                                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                                                        : 'border-gray-300 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-700'
                                                        }`}
                                                    onClick={() => setPaymentMethod('Credit Card')}
                                                >
                                                    <div className="flex items-center">
                                                        <CreditCard className="h-5 w-5 text-gray-700 dark:text-gray-300 mr-3" />
                                                        <span className="text-gray-700 dark:text-gray-300">Credit Card</span>
                                                    </div>
                                                </div>

                                                <div
                                                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${paymentMethod === 'Bank Transfer'
                                                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                                                        : 'border-gray-300 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-700'
                                                        }`}
                                                    onClick={() => setPaymentMethod('Bank Transfer')}
                                                >
                                                    <div className="flex items-center">
                                                        <FileText className="h-5 w-5 text-gray-700 dark:text-gray-300 mr-3" />
                                                        <span className="text-gray-700 dark:text-gray-300">Bank Transfer</span>
                                                    </div>
                                                </div>

                                                <div
                                                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${paymentMethod === 'Cash'
                                                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                                                        : 'border-gray-300 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-700'
                                                        }`}
                                                    onClick={() => setPaymentMethod('Cash')}
                                                >
                                                    <div className="flex items-center">
                                                        <Clock className="h-5 w-5 text-gray-700 dark:text-gray-300 mr-3" />
                                                        <span className="text-gray-700 dark:text-gray-300">Cash</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}

                                        {/* Submit Button */}
                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 shadow-md hover:shadow-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                                disabled={isLoading || !renewalDuration}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <RotateCcw className="h-5 w-5 animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Calendar className="h-5 w-5" />
                                                        Renew Service
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Renewal Info Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-[#1b1b1d] rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                                    <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                                    Renewal Information
                                </h2>

                                {Data ? (
                                    <div>
                                        <div className="mb-6">
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Asset</div>
                                            <div className="text-base font-medium text-gray-900 dark:text-gray-100">
                                                {Data?.assetMake} - {Data?.assetRegNo}
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Installation Date</div>
                                            <div className="text-base font-medium text-gray-900 dark:text-gray-100">
                                                {formatDate(Data?.installation)}
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Expiry</div>
                                            <div className="text-base font-medium text-gray-900 dark:text-gray-100">
                                                {formatDate(Data?.expiry)}
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">New Expiry Date</div>
                                            <div className="text-base font-medium text-gray-900 dark:text-gray-100">
                                                {renewalDuration ? (
                                                    formatDate(addMonthsToIsoDate(Data?.expiry, renewalDuration))
                                                ) : (
                                                    <span className="text-gray-400 dark:text-gray-500">Select duration</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Price Estimate */}
                                        {/* <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-600 dark:text-gray-400">Base Price:</span>
                                                <span className="text-gray-900 dark:text-gray-200">
                                                    {renewalDuration ? `KES ${parseInt(renewalDuration) * 1000}` : '-'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-600 dark:text-gray-400">VAT (16%):</span>
                                                <span className="text-gray-900 dark:text-gray-200">
                                                    {renewalDuration ? `KES ${parseInt(renewalDuration) * 160}` : '-'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                                                <span className="text-gray-800 dark:text-gray-200 font-medium">Total:</span>
                                                <span className="text-lg font-semibold text-orange-600">
                                                    {renewalDuration ? `KES ${parseInt(renewalDuration) * 1160}` : '-'}
                                                </span>
                                            </div>
                                        </div> */}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-3 mb-4">
                                            <Calendar className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                            Select a customer and asset to see renewal information
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Renewal History */}
                    <div onClick={() => setExpandedHistory(!expandedHistory)} className="mt-8 cursor-pointer bg-white dark:bg-[#1b1b1d] rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                        <div
                            className="flex justify-between items-center cursor-pointer"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                                <FileText className="h-5 w-5 mr-2 text-orange-500" />
                                Previous Renewals
                            </h2>
                            <ChevronDown
                                className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${expandedHistory ? 'transform rotate-180' : ''}`}
                            />
                        </div>

                        {expandedHistory && (
                            <div className="mt-6">
                                {Data?.renewals.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead>
                                                <tr className="bg-gray-50 dark:bg-[#28282a]">
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Expired Date</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Renewal Duration</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Renewal Date</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Handler</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-[#1b1b1d] divide-y divide-gray-200 dark:divide-gray-700">
                                                {Data?.renewals.map((history, index) => (
                                                        <tr
                                                            key={history._id}
                                                            className="hover:bg-gray-50 dark:hover:bg-[#28282a] transition-colors duration-150"
                                                        >
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                                {history.customer}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                                {formatDate(history.expiredDate)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                            {history.duration} {history.duration === 1 ? 'month' : 'months'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                                {formatDate(history.renewalDate)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                                {history.handler}
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="py-8 text-center">
                                        <div className="flex flex-col items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="text-lg font-medium text-gray-500 dark:text-gray-400">No renewal history</span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {Data ? "This asset has no previous renewals" : "Select an asset to view renewal history"}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ServiceRenewal;