import React, { useEffect, useState } from 'react'
import Modal from '../../Components/Modal';
import axios from 'axios';
import axiosInstance from '../../auth/interceptor';

function DetachSim({ open, onClose }) {
    const [AvUnits, setAvUnits] = useState([]);
    const [formData, setFormData] = useState({
        unitid: "",
        simNumber: "",
        simid: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "sim1Number") {
            // Find the selected SIM object by its `sim1Number`
            const selectedSim = AvUnits.find(sim => sim.sim1Number.toString() === value);
            if (selectedSim) {
                setFormData({
                    ...formData,
                    simNumber: selectedSim.sim1Number, // Set simNumber
                    simid: selectedSim._id,      
                    unitid: selectedSim.unitid._id    // Set simid
                });
            }
        } else {
            // Handle other input changes
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };



    const GetAttachedUnits = async () => {

        try {
            const response = await axiosInstance.get('/api-trkadn/get-attchedunits');
            console.log("makes", response.data.data);

            if (response.status === 200) {
                setAvUnits(response.data.data)
            }
        } catch (error) {
            alert('Error creating user: ' + error.response.data.message);
        }
    };

    useEffect(() => {
        GetAttachedUnits()
    }, [])

    const detachSim = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.put('/api-trkadn/detach-sim', formData);
            if (response.status === 200) {
                setFormData({
                    unitid: "",
                    simNumber: "",
                    simid: ""
                });
                onClose();
            }
        } catch (error) {
            console.error('Error saving batch:', error.response?.data?.message || error.message);
        }
    };
console.log(AvUnits);


    return (
        <Modal open={open} onClose={onClose}>

            <div className="text-gray-900 dark:text-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-center">Detach Sim</h2>
                <form onSubmit={detachSim} className="flex flex-col gap-6">
                 
                    <div>
                        <label
                            className="block text-sm font-medium mb-2"
                            htmlFor="sim1Number"
                        >
                            Available SIM
                        </label>
                        <select
                            id="sim1Number"
                            name="sim1Number"
                            value={formData.simNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                            required
                        >
                            <option value="">Select a SIM</option>
                            {Array.isArray(AvUnits) && AvUnits.length > 0 ? (
                                AvUnits.map((unit, index) => (
                                    <option key={unit._id} value={unit.sim1Number}>add img{unit.sim1Number} attached to {unit.unitid.imei} - {unit.unitid.assetRegNo}</option>
                                ))
                            ) : (
                                <option value="" disabled>No SIM Found, Create One!</option>
                            )}

                        </select>
                    </div>



                    <div className="flex justify-between gap-4 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-600 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-orange-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-orange-700 transition duration-200"
                        >
                            Detach
                        </button>

                    </div>
                </form>
            </div>
        </Modal>
    )
}

export default DetachSim