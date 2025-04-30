import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../Components/header";
import { useParams } from "react-router-dom";
import axiosInstance from "../auth/interceptor";

const NewCustomer = () => {
    // State to manage form data
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        mobile: "",
        company: "",
        email: "",
        address: {
            street: "",
            district: "",
            state: "",
            pinCode: "",
            landline: "",
        },
        salesPerson: "",
        username: "",
        password: "",
        customerType: "",
    });
    const { id } = useParams();
    console.log(id);

    useEffect(() => {
        if (id) {
            Getuserbyid(id);
        }
    }, [id])

    const Getuserbyid = async (userid) => {
        try {
            console.log("Loading");
            //setIsLoading(true);
            const res = await axiosInstance.get(`/api-trkadn/get-user/${userid}`);
            if (res.status === 200) {
                console.log(res.data.data);
                const userData = res.data;

                // Update the formData state
                setFormData({
                    ...formData, // Keep existing structure
                    firstname: userData.firstname || "",
                    lastname: userData.lastname || "",
                    mobile: userData.mobile || "",
                    company: userData.company || "",
                    email: userData.email || "",
                    address: {
                        street: userData.address?.street || "",
                        district: userData.address?.district || "",
                        state: userData.address?.state || "",
                        pinCode: userData.address?.pinCode || "",
                        landline: userData.address?.landline || "",
                    },
                    salesPerson: userData.salesPerson || "",
                    username: userData.username || "",
                    password: userData.password || "",
                    customerType: userData.customerType || "",
                });
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



    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name in formData) {
            setFormData({ ...formData, [name]: value });
        } else {
            setFormData({
                ...formData,
                address: { ...formData.address, [name]: value },
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('/api-trkadn/new-user', formData);
            console.log(response);

            if (response.status === 201) {
                window.location.href = '/customer-info';
            }
        } catch (error) {
            alert('Error creating user: ' + error.response.data.message);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.put(`/api-trkadn/update-user/${id}`, formData);
            console.log(response);

            if (response.status === 200) {
                window.location.href = '/customer-info';
            }
        } catch (error) {
            alert('Error creating user: ' + error.response.data.message);
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen mt-20 flex items-center justify-center">
                <div className="p-8 max-w-4xl w-full">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-300 mb-6 text-center">
                        Create New Customer
                    </h2>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={id ? handleUpdate : handleSubmit}>
                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">First Name</label>
                            <input
                                type="text"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border bg-white dark:bg-[#1b1b1d] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter First Name"
                            />
                        </div>
                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Last Name</label>
                            <input
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border bg-white dark:bg-[#1b1b1d] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter Last Name"
                            />
                        </div>
                        {/* Mobile */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Mobile</label>
                            <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border bg-white dark:bg-[#1b1b1d] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter Mobile Number"
                            />
                        </div>
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border bg-white dark:bg-[#1b1b1d] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter Email Address"
                            />
                        </div>
                        {/* Company Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Company Name</label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border bg-white dark:bg-[#1b1b1d] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter Company Name"
                            />
                        </div>
                        {/* Customer Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Customer Type</label>
                            <select
                                name="customerType"
                                value={formData.customerType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white dark:bg-[#1b1b1d] focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Select Customer Type</option>
                                <option value="Construction Company">Construction Company</option>
                                <option value="Couriers">Couriers</option>
                                <option value="Distribution Company">Distribution Company</option>
                                <option value="Govt Organisation">Govt Organisation</option>
                                <option value="Heavy Equipment Company">Heavy Equipment Company</option>
                                <option value="House Boats">House Boats</option>
                                <option value="Personal">Personal</option>
                                <option value="Rental Company">Rental Company</option>
                                <option value="Schools">Schools</option>
                                <option value="Showroom">Showroom</option>
                                <option value="Tour & Travels">Tour & Travels</option>
                            </select>
                        </div>
                        {/* Address - Building No, Street */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Building No, Street</label>
                            <input
                                type="text"
                                name="street"
                                value={formData.address.street}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border bg-white dark:bg-[#1b1b1d] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter Building No, Street"
                            />
                        </div>
                        {/* Address - District */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">District</label>
                            <input
                                type="text"
                                name="district"
                                value={formData.address.district}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border bg-white dark:bg-[#1b1b1d] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter District"
                            />
                        </div>
                        {/* Address - State */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.address.state}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border bg-white dark:bg-[#1b1b1d] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter State"
                            />
                        </div>
                        {/* Address - PIN Code */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">PIN Code</label>
                            <input
                                type="text"
                                name="pinCode"
                                value={formData.address.pinCode}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border bg-white dark:bg-[#1b1b1d] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter PIN Code"
                            />
                        </div>
                        {/* Address - Landline */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Landline</label>
                            <input
                                type="tel"
                                name="landline"
                                value={formData.address.landline}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border bg-white dark:bg-[#1b1b1d] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter Landline Number"
                            />
                        </div>
                        {/* Sales Person */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Sales Person</label>
                            <input
                                type="text"
                                name="salesPerson"
                                value={formData.salesPerson}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border bg-white dark:bg-[#1b1b1d] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter Sales Person Name"
                            />
                        </div>
                        {/* Login ID */}
                        {!id ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border bg-white dark:bg-[#1b1b1d] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter Login ID"
                                    />
                                </div>
                                {/* Password */}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border bg-white dark:bg-[#1b1b1d] border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter Password"
                                    />
                                </div>
                            </>
                        ) : (null)}
                        {/* Submit Button */}
                        <div className="md:col-span-2 flex justify-center">
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
                            >
                                {id ? "Update Customer" : "Create Customer"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default NewCustomer;
