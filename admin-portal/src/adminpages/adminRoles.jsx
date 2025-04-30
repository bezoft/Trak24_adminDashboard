import React, { useEffect, useState } from 'react';
import Header from '../Components/header'
import axios from 'axios';
import Modal from '../Components/Modal';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../auth/interceptor';

function AdminRoles() {

    const [Data, setData] = useState([]);
    const [open, setOpen] = useState(false)
    const [open2, setOpen2] = useState(false)
    const { decryptData } = useAuth()
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        username: "",
        password: "",
        adminType: 0, // Default value
    });

    const AdminType = decryptData().type
    const AdminId = decryptData().id



    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        GetallAdmins()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const response = await axiosInstance.post("/api-trkadn/new-admin", formData);


            if (response.status === 201) {

                setFormData({
                    name: "",
                    username: "",
                    password: "",
                    adminType: "super admin", // Reset to default value
                });
                setOpen(false)
                GetallAdmins()
            }

        } catch (error) {
            console.error("Error adding admin:", error);
        }
    }

    const handleDelete = async (id) => {
        try {

            const response = await axiosInstance.delete(`/api-trkadn/delete-admin/${id}`);

            if (response.status === 200) {
                GetallAdmins()
            }
        } catch (error) {
            console.error('Error saving batch:', error.response?.data?.message || error.message);
        }
    }

    const handleEditinit = async (id, name, username, type) => {
        setFormData({
            id: id,
            name: name,
            username: username,
            adminType: type,
        })
        setOpen2(true)
    }

    const handleEdit = async (e) => {
        e.preventDefault();
        try {

            const response = await axiosInstance.post(`/api-trkadn/update-admin/${formData.id}`, formData);

            if (response.status === 200) {
                setFormData({
                    name: "",
                    username: "",
                    password: "",
                    adminType: 0,
                }); // Reset form
                setOpen2(false);
                GetallAdmins()
            }
        } catch (error) {
            console.error('Error saving batch:', error.response?.data?.message || error.message);
            setOpen2(false);
        }
    }

    const GetallAdmins = async () => {
        try {
            //setIsLoading(true);
            const res = await axiosInstance.get("/api-trkadn/all-admins");
            if (res.status === 200) {
                setData(res.data.admins);
            } else {

            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            // Ensure loading and refreshing states are reset
            //   setIsLoading(false);
            //   setIsRefreshing(false);
        }
    };


    return (
        <>
        <Header />
        <div className="mt-24 flex flex-col md:flex-row justify-between items-center h-full">
            <div>
                <h1 className="text-black dark:text-white font-semibold text-4xl p-6 mb-10">
                    All Admins
                </h1>
            </div>
            <div className="flex flex-row justify-end m-4 p-3 mb-10">
                <button
                    onClick={() => AdminType === 0 ? setOpen(true) : null}
                    className={`${AdminType === 0 ? "" : "disabled cursor-not-allowed"} w-fit h-12 px-4 border border-orange-600 bg-transparent rounded-md flex justify-center items-center text-orange-600 hover:bg-orange-600 hover:text-white transition-colors duration-200`}
                >
                    + Add New Admin
                </button>
            </div>
        </div>
    
        <div className="min-h-screen px-6">
            <div className="overflow-hidden rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-[#3b3b3b]">
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">No</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Username</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Password</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Edit / Delete</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-[#1b1b1d] divide-y divide-gray-200 dark:divide-gray-700">
                            {Array.isArray(Data) && Data.length > 0 ? Data.map((item, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-100 dark:hover:bg-[#28282a] cursor-pointer transition-colors duration-150"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                        <button className={`px-3 py-2 text-sm dark:text-white text-black ${item.adminType === 0 ? "bg-orange-500/20" : "bg-green-500/20"} rounded-full transition duration-200`}>
                                            {item.adminType === 0 ? "Super Admin" : "Admin"}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">***************</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-600">
                                        <a
                                            className={`${AdminType === 0 || (AdminType === 1 && item._id === AdminId) ? "" : "disabled cursor-not-allowed"}`}
                                            style={AdminType === 1 && item._id !== AdminId ? { color: "gray" } : {}}
                                            onClick={() => AdminType === 0 || (AdminType === 1 && item._id === AdminId) ? handleEditinit(item._id, item.name, item.username, item.adminType) : null}
                                        >
                                            Edit &nbsp;
                                        </a>
                                        <a
                                            className={`${AdminType === 0 ? "" : "disabled cursor-not-allowed"}`}
                                            style={AdminType === 1 && item._id !== AdminId || item._id === AdminId ? { color: "gray" } : {}}
                                            onClick={() => AdminType === 0 ? handleDelete(item._id) : null}
                                        >
                                            | &nbsp;Delete
                                        </a>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            <span className="text-lg font-medium">No data available</span>
                                            <span className="text-sm">Please add an admin to view data</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    

            <Modal open={open2} onClose={() => setOpen2(false)}>
                <div className="text-gray-900 dark:text-gray-200">
                    <h2 className="text-2xl font-bold mb-6 text-center">Add / Edit Admin</h2>
                    <form onSubmit={handleEdit} className="flex flex-col gap-6">
                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="name"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                id="name2"
                                name="name"
                                value={formData.name}
                                placeholder="Enter Name"
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                required
                            />
                        </div>
                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="username"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                id="username2"
                                name="username"
                                placeholder="Enter Username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                        </div>
                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password2"
                                name="password"
                                placeholder="Enter Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"

                            />
                        </div>
                        {AdminType === 0 ? (
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    htmlFor="adminType"
                                >
                                    Admin Type
                                </label>
                                <select
                                    id="adminType2"
                                    name="adminType"
                                    value={formData.adminType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    required
                                >
                                    <option value={0}>Super Admin</option>
                                    <option value={1}>Admin</option>
                                </select>
                            </div>
                        ) : (null)}
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
                                Save
                            </button>

                        </div>
                    </form>
                </div>
            </Modal>
            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="text-gray-900 dark:text-gray-200">
                    <h2 className="text-2xl font-bold mb-6 text-center">Add / Edit Admin</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="name"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                placeholder="Enter Name"
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                required
                            />
                        </div>
                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="username"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Enter Username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                        </div>
                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"

                            />
                        </div>
                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="adminType"
                            >
                                Admin Type
                            </label>
                            <select
                                id="adminType"
                                name="adminType"
                                value={formData.adminType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                required
                            >
                                <option value={0}>Super Admin</option>
                                <option value={1}>Admin</option>
                            </select>
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
                                Add Admin
                            </button>

                        </div>
                    </form>
                </div>
            </Modal>


        </>
    )
}

export default AdminRoles