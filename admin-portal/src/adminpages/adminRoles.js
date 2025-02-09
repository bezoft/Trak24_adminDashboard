import React, { useEffect, useState } from 'react';
import Header from '../Components/header'
import axios from 'axios';
import Modal from '../Components/Modal';
import { useAuth } from '../contexts/AuthContext';

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
            
            const response = await axios.post("/api-trkadn/new-admin", formData);
         

            if (response.status ===201) {

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

    const handleDelete =async (id) => {
        try {

            const response = await axios.delete(`/api-trkadn/delete-admin/${id}`);

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

            const response = await axios.post(`/api-trkadn/update-admin/${formData.id}`, formData);

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
            const res = await axios.get("/api-trkadn/all-admins");
            if (res.statusText === "OK") {
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
            <div className="container mx-auto px-4 max-w-6xl mt-24">
                <div className="px-6 py-4 mt-24 flex justify-between">
                    <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-300">
                        All Admins
                    </h1>
                    <button onClick={() => AdminType === 0 ? setOpen(true) : null} className={`${AdminType === 0 ? "" : "disabled cursor-not-allowed"} w-fit h-12 px-4 border border-orange-600 bg-transparent rounded-md flex justify-center items-center `}>+ Add New Admin</button>
                </div>

                {/* Table */}
                <div className="px-6 py-4">
                    <table className="min-w-full border border-gray-300 dark:border-gray-700">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-[#343a46]">
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap text-center">No</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">Name</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">Role</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">Username</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">Password</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">Edit / Delete</th>
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
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">
                                        <button className={`px-3 py-2 text-sm dark:text-white text-black ${item.adminType === 0 ? "bg-orange-500" : "bg-green-500"} bg-opacity-20 rounded-full transition duration-200`}>
                                            {item.adminType === 0 ? "Super Admin" : "Admin"}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.username}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">***************</td>
                                    <td className="px-6 py-4 text-sm text-red-600 dark:text-red-600 text-center">
                                        <a
                                            className={`${AdminType === 0 || (AdminType === 1 && item._id === AdminId) ? "" : "disabled cursor-not-allowed"}`}
                                            style={AdminType === 1 && item._id !== AdminId ? { color: "gray" } : {}}
                                            onClick={() => AdminType === 0 || (AdminType === 1 && item._id === AdminId) ? handleEditinit(item._id, item.name, item.username, item.adminType) : null}
                                        >
                                            Edit &nbsp;
                                        </a>
                                        <a
                                            className={`${AdminType === 0 ? "" : "disabled cursor-not-allowed"}`}
                                            style={AdminType === 1 && item._id !== AdminId||item._id === AdminId ? { color: "gray" } : {}}
                                            onClick={() => AdminType === 0  ? handleDelete(item._id) : null}
                                        >
                                             | &nbsp;Delete
                                        </a>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
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
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
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
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"

                            />
                        </div>
                        {AdminType===0?(
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
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                required
                            >
                                <option value={0}>Super Admin</option>
                                <option value={1}>Admin</option>
                            </select>
                        </div>
                        ):(null)}
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
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
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
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
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
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"

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
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
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